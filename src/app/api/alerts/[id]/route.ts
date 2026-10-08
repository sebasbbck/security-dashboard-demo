import type { NextRequest } from "next/server";
import { alerts } from "@/lib/mock-data";
import { ALERT_STATUSES, type AlertStatus } from "@/lib/types";

// PATCH /api/alerts/:id  body: { "status": "investigating" }
// State lives in memory: it resets when the server restarts (fine for a demo).
export async function PATCH(request: NextRequest, ctx: RouteContext<"/api/alerts/[id]">) {
  const { id } = await ctx.params;
  const alert = alerts.find((item) => item.id === id);
  if (!alert) {
    return Response.json({ error: "Alert not found" }, { status: 404 });
  }

  const body = (await request.json().catch(() => null)) as { status?: string } | null;
  if (!body?.status || !ALERT_STATUSES.includes(body.status as AlertStatus)) {
    return Response.json({ error: "Invalid status" }, { status: 400 });
  }

  alert.status = body.status as AlertStatus;
  return Response.json(alert);
}
