"use client";

import { useState } from "react";
import { fetchAlerts, updateAlertStatus, type AlertWithAsset } from "@/lib/api";
import { timeAgo } from "@/lib/format";
import { useDebounced } from "@/lib/use-debounced";
import { useFetch } from "@/lib/use-fetch";
import { ALERT_STATUSES, SEVERITIES, type AlertStatus, type Severity } from "@/lib/types";
import { SeverityBadge, StatusLabel } from "./badges";
import FilterPill from "./FilterPill";

const severityAccent: Record<Severity, string> = {
  critical: "border-l-critical",
  high: "border-l-high",
  medium: "border-l-medium",
  low: "border-l-low",
};

export default function AlertsView() {
  const [severity, setSeverity] = useState<Severity | "">("");
  const [status, setStatus] = useState<AlertStatus | "">("");
  const [search, setSearch] = useState("");
  // Don't hit the API on every keystroke.
  const query = useDebounced(search.trim());

  const { data, setData, error, setError, loading } = useFetch(
    (signal) => fetchAlerts({ severity, status, q: query }, signal).then((res) => res.items),
    `${severity}|${status}|${query}`,
  );
  const alerts: AlertWithAsset[] = data ?? [];

  async function changeStatus(id: string, next: AlertStatus) {
    const previous = data;
    // Optimistic update: reflect the change immediately, roll back on failure.
    setData((items) => items?.map((a) => (a.id === id ? { ...a, status: next } : a)) ?? null);
    try {
      await updateAlertStatus(id, next);
    } catch (err) {
      setData(previous);
      setError((err as Error).message);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by severity">
          <FilterPill active={severity === ""} onClick={() => setSeverity("")}>
            All
          </FilterPill>
          {SEVERITIES.map((s) => (
            <FilterPill key={s} active={severity === s} onClick={() => setSeverity(s)}>
              <span className="capitalize">{s}</span>
            </FilterPill>
          ))}
        </div>

        <div className="flex gap-2 lg:ml-auto">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as AlertStatus | "")}
            aria-label="Filter by status"
            className="border-line bg-panel rounded-md border px-3 py-2 text-sm"
          >
            <option value="">Any status</option>
            {ALERT_STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search alerts…"
            aria-label="Search alerts"
            className="border-line bg-panel placeholder:text-muted w-full rounded-md border px-3 py-2 text-sm lg:w-64"
          />
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="border-critical/40 bg-critical/10 text-critical rounded-md border px-3 py-2 text-sm"
        >
          {error}
        </p>
      )}

      <ul
        className={`space-y-2 transition-opacity ${loading ? "opacity-50" : ""}`}
        aria-busy={loading}
      >
        {!loading && alerts.length === 0 && (
          <li className="border-line text-muted rounded-lg border border-dashed p-8 text-center text-sm">
            No alerts match these filters.
          </li>
        )}
        {alerts.map((alert) => (
          <li
            key={alert.id}
            className={`border-line bg-panel grid gap-3 rounded-lg border border-l-4 p-4 sm:grid-cols-[1fr_auto] sm:items-center ${severityAccent[alert.severity]} ${
              alert.status === "resolved" ? "opacity-60" : ""
            }`}
          >
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <SeverityBadge severity={alert.severity} />
                <h2 className="font-medium">{alert.title}</h2>
              </div>
              <p className="text-muted text-sm">{alert.description}</p>
              <p className="text-muted text-xs">
                <span className="text-text font-mono">{alert.assetName}</span> · {alert.source} ·{" "}
                {timeAgo(alert.createdAt)}
              </p>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <StatusLabel status={alert.status} />
              <select
                value={alert.status}
                onChange={(e) => changeStatus(alert.id, e.target.value as AlertStatus)}
                aria-label={`Change status of ${alert.title}`}
                className="border-line bg-canvas rounded-md border px-2 py-1 text-sm"
              >
                {ALERT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s === "open" ? "Reopen" : s === "investigating" ? "Investigate" : "Resolve"}
                  </option>
                ))}
              </select>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
