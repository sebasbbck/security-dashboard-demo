import type { Alert, AlertStatus, Asset, AssetType, Severity } from "./types";

// Thin client for the app's REST API (src/app/api/*).

export type AlertWithAsset = Alert & { assetName: string };
export type AssetWithAlerts = Asset & { openAlerts: number };

export interface Summary {
  openAlerts: number;
  openBySeverity: Record<Severity, number>;
  totalAssets: number;
  assetsAtRisk: number;
  averageRisk: number;
  topAssets: Pick<Asset, "id" | "name" | "type" | "riskScore">[];
  urgentAlerts: AlertWithAsset[];
}

export interface AlertFilters {
  severity?: Severity | "";
  status?: AlertStatus | "";
  q?: string;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export function fetchAlerts(filters: AlertFilters, signal?: AbortSignal) {
  const params = new URLSearchParams();
  if (filters.severity) params.set("severity", filters.severity);
  if (filters.status) params.set("status", filters.status);
  if (filters.q) params.set("q", filters.q);
  return request<{ items: AlertWithAsset[]; total: number }>(`/api/alerts?${params}`, { signal });
}

export function updateAlertStatus(id: string, status: AlertStatus) {
  return request<Alert>(`/api/alerts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

export function fetchAssets(filters: { type?: AssetType | ""; q?: string }, signal?: AbortSignal) {
  const params = new URLSearchParams();
  if (filters.type) params.set("type", filters.type);
  if (filters.q) params.set("q", filters.q);
  return request<{ items: AssetWithAlerts[]; total: number }>(`/api/assets?${params}`, { signal });
}

export function fetchSummary(signal?: AbortSignal) {
  return request<Summary>("/api/summary", { signal });
}
