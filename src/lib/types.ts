export const SEVERITIES = ["critical", "high", "medium", "low"] as const;
export type Severity = (typeof SEVERITIES)[number];

export const ALERT_STATUSES = ["open", "investigating", "resolved"] as const;
export type AlertStatus = (typeof ALERT_STATUSES)[number];

export const ASSET_TYPES = ["server", "workstation", "database", "domain", "cloud"] as const;
export type AssetType = (typeof ASSET_TYPES)[number];

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  ip: string | null;
  owner: string;
  riskScore: number; // 0-100
  lastSeen: string; // ISO date
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: AlertStatus;
  assetId: string;
  source: string;
  createdAt: string; // ISO date
}
