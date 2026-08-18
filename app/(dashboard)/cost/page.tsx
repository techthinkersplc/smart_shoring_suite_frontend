"use client";

import { useCostData } from "./context";
import { CostStats } from "./CostStats";
import { BudgetVsActualChart } from "./BudgetVsActualChart";
import { CostAlerts } from "./CostAlerts";
import { CostBreakdownRing } from "./CostBreakdownRing";
import { FinancialForecast } from "./FinancialForecast";
import { VarianceAnalysisTable } from "./VarianceAnalysisTable";
import { formatETBMillions } from "./format";

function exportReportCsv(
  summary: NonNullable<ReturnType<typeof useCostData>["summary"]>,
): void {
  const rows = [
    ["Metric", "Value"],
    ["Project", summary.projectName],
    ["As Of", summary.asOfDate],
    ["Contract Value", formatETBMillions(summary.contractValue)],
    ["Total Budget", formatETBMillions(summary.totalBudget)],
    ["Actual Cost", formatETBMillions(summary.actualCost)],
    ["Estimated Final Cost", formatETBMillions(summary.estimatedFinalCost)],
    ["Estimated Profit", formatETBMillions(summary.estimatedProfit)],
    ["Profit Margin", `${summary.profitMarginPercent}%`],
    ["Cost Performance Index", `${summary.costPerformanceIndex}%`],
    [],
    ["Category", "Budget", "Actual"],
    ...summary.categories.map((c) => [c.name, String(c.budget), String(c.actual)]),
  ];

  const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `cost-report-${summary.asOfDate}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function CostPage() {
  const { summary } = useCostData();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cost Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor project costs, budget performance, and estimated profitability.
          </p>
        </div>
        <button
          type="button"
          disabled={!summary}
          onClick={() => summary && exportReportCsv(summary)}
          className="flex shrink-0 items-center gap-2 rounded-lg border border-brand-green/30 px-4 py-2 text-sm font-semibold text-brand-green transition-colors hover:bg-brand-green/5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M12 3v12" />
            <path d="M7 10l5 5 5-5" />
            <path d="M4 20h16" />
          </svg>
          Export Report
        </button>
      </div>

      {/* {isMockData && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Showing sample cost data — the backend&apos;s /cost/summary endpoint isn&apos;t
          live yet, so this is preview data.
        </p>
      )} */}

      <CostStats />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BudgetVsActualChart />
        </div>
        <CostAlerts />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CostBreakdownRing />
        <FinancialForecast />
      </div>

      <VarianceAnalysisTable />
    </div>
  );
}
