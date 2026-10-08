import type { NextRequest } from "next/server";
import { alerts, assets } from "@/lib/mock-data";
import { ALERT_STATUSES, SEVERITIES, type AlertStatus, type Severity } from "@/lib/types";

// GET /api/alerts?severity=critical&status=open&q=login
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const severity = params.get("severity");
  const status = params.get("status");
  const query = params.get("q")?.trim().toLowerCase();

  if (severity && !SEVERITIES.includes(severity as Severity)) {
    return Response.json({ error: "Invalid severity" }, { status: 400 });
  }
  if (status && !ALERT_STATUSES.includes(status as AlertStatus)) {
    return Response.json({ error: "Invalid status" }, { status: 400 });
  }

  const items = alerts
    .filter((alert) => !severity || alert.severity === severity)
    .filter((alert) => !status || alert.status === status)
    .filter(
      (alert) =>
        !query ||
        alert.title.toLowerCase().includes(query) ||
        alert.description.toLowerCase().includes(query),
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((alert) => ({
      ...alert,
      assetName: assets.find((asset) => asset.id === alert.assetId)?.name ?? "Unknown",
    }));

  return Response.json({ items, total: items.length });
}
