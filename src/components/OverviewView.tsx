"use client";

import Link from "next/link";
import { fetchSummary } from "@/lib/api";
import { timeAgo } from "@/lib/format";
import { riskLevel, riskTextColor } from "@/lib/risk";
import { SEVERITIES, type Severity } from "@/lib/types";
import { useFetch } from "@/lib/use-fetch";
import { SeverityBadge } from "./badges";
import RiskMeter from "./RiskMeter";

const severityBar: Record<Severity, string> = {
  critical: "bg-critical",
  high: "bg-high",
  medium: "bg-medium",
  low: "bg-low",
};

export default function OverviewView() {
  const { data, error } = useFetch((signal) => fetchSummary(signal), "summary");

  if (error) {
    return (
      <p
        role="alert"
        className="border-critical/40 bg-critical/10 text-critical rounded-md border px-3 py-2 text-sm"
      >
        {error}
      </p>
    );
  }
  if (!data) {
    return <div className="bg-panel h-64 animate-pulse rounded-lg" aria-busy="true" />;
  }

  const posture = riskLevel(data.averageRisk);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Critical alerts"
          value={data.openBySeverity.critical}
          accent="text-critical"
          href="/alerts"
        />
        <StatCard label="Open alerts" value={data.openAlerts} href="/alerts" />
        <StatCard
          label="Assets at critical risk"
          value={`${data.assetsAtRisk}/${data.totalAssets}`}
          accent="text-critical"
          href="/assets"
        />
        <StatCard
          label="Average risk"
          value={data.averageRisk}
          accent={riskTextColor[posture]}
          hint={posture}
        />
      </div>

      <section className="border-line bg-panel rounded-lg border p-4">
        <h2 className="text-muted mb-3 text-sm font-medium">Open alerts by severity</h2>
        <SeverityDistribution counts={data.openBySeverity} total={data.openAlerts} />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="border-line bg-panel rounded-lg border">
          <SectionHeader title="Needs action" href="/alerts" />
          <ul className="divide-line divide-y">
            {data.urgentAlerts.length === 0 && (
              <li className="text-muted p-4 text-sm">Nothing urgent. Nice.</li>
            )}
            {data.urgentAlerts.map((alert) => (
              <li key={alert.id} className="space-y-1 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <SeverityBadge severity={alert.severity} />
                  <span className="font-medium">{alert.title}</span>
                </div>
                <p className="text-muted text-xs">
                  <span className="text-text font-mono">{alert.assetName}</span> ·{" "}
                  {timeAgo(alert.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-line bg-panel rounded-lg border">
          <SectionHeader title="Riskiest assets" href="/assets" />
          <ul className="divide-line divide-y">
            {data.topAssets.map((asset) => (
              <li key={asset.id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <div className="truncate font-mono text-sm">{asset.name}</div>
                  <div className="text-muted text-xs capitalize">{asset.type}</div>
                </div>
                <RiskMeter score={asset.riskScore} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent = "text-text",
  hint,
  href,
}: {
  label: string;
  value: number | string;
  accent?: string;
  hint?: string;
  href?: string;
}) {
  const body = (
    <>
      <div className="text-muted text-xs tracking-wide uppercase">{label}</div>
      <div className={`mt-1 text-3xl font-semibold ${accent}`}>{value}</div>
      {hint && <div className={`text-xs capitalize ${accent}`}>{hint}</div>}
    </>
  );
  const className = "block rounded-lg border border-line bg-panel p-4";
  return href ? (
    <Link href={href} className={`${className} hover:bg-panel-hover transition-colors`}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="border-line flex items-center justify-between border-b px-4 py-3">
      <h2 className="text-sm font-medium">{title}</h2>
      <Link href={href} className="text-muted hover:text-text text-xs">
        View all →
      </Link>
    </div>
  );
}

function SeverityDistribution({
  counts,
  total,
}: {
  counts: Record<Severity, number>;
  total: number;
}) {
  return (
    <div className="space-y-3">
      <div className="bg-line flex h-3 overflow-hidden rounded-full">
        {SEVERITIES.map((severity) =>
          counts[severity] > 0 ? (
            <div
              key={severity}
              className={severityBar[severity]}
              style={{ width: `${(counts[severity] / Math.max(total, 1)) * 100}%` }}
              title={`${severity}: ${counts[severity]}`}
            />
          ) : null,
        )}
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
        {SEVERITIES.map((severity) => (
          <span key={severity} className="flex items-center gap-1.5">
            <span className={`size-2 rounded-full ${severityBar[severity]}`} />
            <span className="text-muted capitalize">{severity}</span>
            <span className="font-semibold">{counts[severity]}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
