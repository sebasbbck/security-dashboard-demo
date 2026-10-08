import type { NextRequest } from "next/server";
import { alerts, assets } from "@/lib/mock-data";
import { ASSET_TYPES, type AssetType } from "@/lib/types";

// GET /api/assets?type=server&q=prod  — sorted by risk, riskiest first
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const type = params.get("type");
  const query = params.get("q")?.trim().toLowerCase();

  if (type && !ASSET_TYPES.includes(type as AssetType)) {
    return Response.json({ error: "Invalid asset type" }, { status: 400 });
  }

  const items = assets
    .filter((asset) => !type || asset.type === type)
    .filter(
      (asset) =>
        !query ||
        asset.name.toLowerCase().includes(query) ||
        asset.owner.toLowerCase().includes(query) ||
        asset.ip?.includes(query),
    )
    .sort((a, b) => b.riskScore - a.riskScore)
    .map((asset) => ({
      ...asset,
      openAlerts: alerts.filter(
        (alert) => alert.assetId === asset.id && alert.status !== "resolved",
      ).length,
    }));

  return Response.json({ items, total: items.length });
}
