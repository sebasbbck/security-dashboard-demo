"use client";

import { useState } from "react";
import { fetchAssets } from "@/lib/api";
import { timeAgo } from "@/lib/format";
import { ASSET_TYPES, type AssetType } from "@/lib/types";
import { useDebounced } from "@/lib/use-debounced";
import { useFetch } from "@/lib/use-fetch";
import FilterPill from "./FilterPill";
import RiskMeter from "./RiskMeter";

export default function AssetsView() {
  const [type, setType] = useState<AssetType | "">("");
  const [search, setSearch] = useState("");
  const query = useDebounced(search.trim());

  const { data, error, loading } = useFetch(
    (signal) => fetchAssets({ type, q: query }, signal).then((res) => res.items),
    `${type}|${query}`,
  );
  const assets = data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by asset type">
          <FilterPill active={type === ""} onClick={() => setType("")}>
            All
          </FilterPill>
          {ASSET_TYPES.map((t) => (
            <FilterPill key={t} active={type === t} onClick={() => setType(t)}>
              <span className="capitalize">{t}</span>
            </FilterPill>
          ))}
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, owner or IP…"
          aria-label="Search assets"
          className="border-line bg-panel placeholder:text-muted w-full rounded-md border px-3 py-2 text-sm lg:ml-auto lg:w-64"
        />
      </div>

      {error && (
        <p
          role="alert"
          className="border-critical/40 bg-critical/10 text-critical rounded-md border px-3 py-2 text-sm"
        >
          {error}
        </p>
      )}

      <div
        className={`border-line bg-panel overflow-x-auto rounded-lg border transition-opacity ${loading ? "opacity-50" : ""}`}
        aria-busy={loading}
      >
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-line text-muted border-b text-xs tracking-wide uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Asset</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Owner</th>
              <th className="px-4 py-3 font-medium">Risk</th>
              <th className="px-4 py-3 font-medium">Open alerts</th>
              <th className="px-4 py-3 font-medium">Last seen</th>
            </tr>
          </thead>
          <tbody className="divide-line divide-y">
            {!loading && assets.length === 0 && (
              <tr>
                <td colSpan={6} className="text-muted px-4 py-8 text-center">
                  No assets match these filters.
                </td>
              </tr>
            )}
            {assets.map((asset) => (
              <tr key={asset.id} className="hover:bg-panel-hover">
                <td className="px-4 py-3">
                  <div className="font-mono">{asset.name}</div>
                  <div className="text-muted text-xs">{asset.ip ?? "—"}</div>
                </td>
                <td className="text-muted px-4 py-3 capitalize">{asset.type}</td>
                <td className="px-4 py-3">{asset.owner}</td>
                <td className="px-4 py-3">
                  <RiskMeter score={asset.riskScore} />
                </td>
                <td className="px-4 py-3">
                  {asset.openAlerts > 0 ? (
                    <span className="font-semibold">{asset.openAlerts}</span>
                  ) : (
                    <span className="text-muted">0</span>
                  )}
                </td>
                <td className="text-muted px-4 py-3">{timeAgo(asset.lastSeen)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
