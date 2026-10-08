import { riskBarColor, riskLevel, riskTextColor } from "@/lib/risk";

/** Risk score as a number plus a colored bar, readable at a glance. */
export default function RiskMeter({ score }: { score: number }) {
  const level = riskLevel(score);
  return (
    <div className="flex items-center gap-2" title={`Risk ${score}/100 (${level})`}>
      <span className={`w-7 text-right font-mono text-sm font-semibold ${riskTextColor[level]}`}>
        {score}
      </span>
      <div
        className="bg-line h-1.5 w-20 overflow-hidden rounded-full"
        role="meter"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Risk score"
      >
        <div
          className={`h-full rounded-full ${riskBarColor[level]}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
