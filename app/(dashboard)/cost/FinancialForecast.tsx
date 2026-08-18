import { useCostData } from "./context";
import { formatShortMillions } from "./format";

export function FinancialForecast() {
  const { summary, isLoading } = useCostData();

  if (isLoading || !summary) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-base font-bold text-gray-900">Financial Forecast</h2>
        <p className="mt-4 text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  const marginVsContract =
    summary.contractValue > 0
      ? (summary.estimatedProfit / summary.contractValue) * 100
      : 0;

  const steps = [
    {
      label: "Contract Value",
      value: formatShortMillions(summary.contractValue),
      filled: true,
    },
    {
      label: "Est. Final Cost",
      value: formatShortMillions(summary.estimatedFinalCost),
      filled: true,
    },
    {
      label: "Est. Profit",
      value: formatShortMillions(summary.estimatedProfit),
      valueClassName: "text-brand-green",
      sublabel: `${Math.round(marginVsContract * 10) / 10}% Margin`,
      filled: false,
    },
  ];

  // Dot centers sit at the middle of each equal-width grid column, i.e. at
  // 50/N%, 150/N%, ... of the row. Inset the line layer by half a column on
  // each side so it starts/ends exactly at the first/last dot's center, then
  // split the remaining width into (N-1) equal segments — one per gap.
  const columnPercent = 100 / steps.length;
  const halfColumnPercent = columnPercent / 2;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h2 className="text-base font-bold text-gray-900">Financial Forecast</h2>

      <div className="relative mt-8">
        <div
          className="absolute top-1.75 flex"
          style={{ left: `${halfColumnPercent}%`, right: `${halfColumnPercent}%` }}
        >
          {steps.slice(1).map((step) => (
            <div
              key={step.label}
              className="h-0.5 flex-1"
              style={
                step.filled
                  ? { backgroundColor: "#2e7d4f" }
                  : { background: "linear-gradient(to right, #2e7d4f, #d1d5db)" }
              }
            />
          ))}
        </div>

        <div className="relative grid" style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}>
          {steps.map((step) => (
            <div key={step.label} className="flex flex-col items-center text-center">
              <span
                className={`h-3.5 w-3.5 rounded-full ${
                  step.filled ? "bg-brand-green" : "border-2 border-amber-300 bg-amber-100"
                }`}
              />
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                {step.label}
              </p>
              <p className={`mt-1 text-lg font-bold ${step.valueClassName ?? "text-gray-900"}`}>
                {step.value}
              </p>
              {step.sublabel && (
                <p className="text-xs font-medium text-brand-green">{step.sublabel}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
