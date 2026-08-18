import { useCostData } from "./context";
import { formatETBMillions } from "./format";

function TrendIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </svg>
  );
}

function StatCard({
  label,
  value,
  valueClassName = "text-gray-900",
  sublabel,
  sublabelClassName = "text-gray-400",
  icon,
}: {
  label: string;
  value: string;
  valueClassName?: string;
  sublabel?: string;
  sublabelClassName?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            {label}
          </p>
          <p className={`mt-1 text-xl font-bold ${valueClassName}`}>{value}</p>
          {sublabel && (
            <p className={`mt-0.5 text-xs font-medium ${sublabelClassName}`}>{sublabel}</p>
          )}
        </div>
        {icon && <span className="text-brand-green/50">{icon}</span>}
      </div>
    </div>
  );
}

export function CostStats() {
  const { summary, isLoading, variance } = useCostData();

  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl border border-gray-200 bg-gray-50" />
        ))}
      </div>
    );
  }

  const isUnderBudget = variance >= 0;
  const finalCostVariancePercent =
    summary.totalBudget > 0
      ? Math.round((Math.abs(variance) / summary.totalBudget) * 1000) / 10
      : 0;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
      <StatCard label="Total Budget" value={formatETBMillions(summary.totalBudget)} />
      <StatCard label="Actual Cost" value={formatETBMillions(summary.actualCost)} />
      <StatCard
        label="Variance"
        value={`${isUnderBudget ? "+" : "-"}${formatETBMillions(Math.abs(variance))}`}
        valueClassName={isUnderBudget ? "text-brand-green" : "text-red-600"}
        sublabel={isUnderBudget ? "↓ Under Budget" : "↑ Over Budget"}
        sublabelClassName={isUnderBudget ? "text-brand-green" : "text-red-600"}
      />
      <StatCard
        label="Est. Final Cost"
        value={formatETBMillions(summary.estimatedFinalCost)}
        sublabel={`${finalCostVariancePercent}% ${isUnderBudget ? "below" : "above"} budget`}
        sublabelClassName={isUnderBudget ? "text-brand-green" : "text-red-600"}
      />
      <StatCard
        label="Est. Profit"
        value={formatETBMillions(summary.estimatedProfit)}
        sublabel={`${summary.profitMarginPercent}% margin`}
        sublabelClassName="text-brand-green"
      />
      <StatCard
        label="Cost Performance"
        value={`${summary.costPerformanceIndex}%`}
        icon={<TrendIcon />}
      />
    </div>
  );
}
