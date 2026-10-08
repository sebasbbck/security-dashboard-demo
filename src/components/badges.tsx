import type { AlertStatus, Severity } from "@/lib/types";

const severityStyles: Record<Severity, string> = {
  critical: "bg-critical/15 text-critical ring-critical/30",
  high: "bg-high/15 text-high ring-high/30",
  medium: "bg-medium/15 text-medium ring-medium/30",
  low: "bg-low/15 text-low ring-low/30",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold tracking-wide uppercase ring-1 ${severityStyles[severity]}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {severity}
    </span>
  );
}

export const statusTextColor: Record<AlertStatus, string> = {
  open: "text-text",
  investigating: "text-medium",
  resolved: "text-ok",
};
