import { connection } from "next/server";
import { alerts, assets } from "@/lib/mock-data";
import { riskLevel } from "@/lib/risk";
import { SEVERITIES, type Severity } from "@/lib/types";

// GET /api/summary — aggregated numbers for the overview screen
export async function GET() {
  // Alert statuses change at runtime (PATCH), so never prerender this.
  await connection();

  const active = alerts.filter((alert) => alert.status !== "resolved");

  const openBySeverity = Object.fromEntries(
    SEVERITIES.map((severity) => [
      severity,
      active.filter((alert) => alert.severity === severity).length,
    ]),
  ) as Record<Severity, number>;

  const averageRisk = Math.round(
    assets.reduce((sum, asset) => sum + asset.riskScore, 0) / assets.length,
  );

  const assetsAtRisk = assets.filter((asset) => riskLevel(asset.riskScore) === "critical").length;

  const topAssets = [...assets]
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 5)
    .map(({ id, name, type, riskScore }) => ({ id, name, type, riskScore }));

  const urgentAlerts = active
    .filter((alert) => alert.severity === "critical" || alert.severity === "high")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5)
    .map((alert) => ({
      ...alert,
      assetName: assets.find((asset) => asset.id === alert.assetId)?.name ?? "Unknown",
    }));

  return Response.json({
    openAlerts: active.length,
    openBySeverity,
    totalAssets: assets.length,
    assetsAtRisk,
    averageRisk,
    topAssets,
    urgentAlerts,
  });
}
