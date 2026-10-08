import type { Severity } from "./types";

// Maps a 0-100 risk score to the same four levels used for alert severity,
// so colors mean the same thing everywhere in the UI.
export function riskLevel(score: number): Severity {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 40) return "medium";
  return "low";
}

export const riskBarColor: Record<Severity, string> = {
  critical: "bg-critical",
  high: "bg-high",
  medium: "bg-medium",
  low: "bg-low",
};

export const riskTextColor: Record<Severity, string> = {
  critical: "text-critical",
  high: "text-high",
  medium: "text-medium",
  low: "text-low",
};
