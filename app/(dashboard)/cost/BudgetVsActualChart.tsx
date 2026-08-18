import { useCostData } from "./context";
import { formatShortMillions } from "./format";
import type { CostCategoryBreakdown } from "./types";

function CategoryRow({ category, max }: { category: CostCategoryBreakdown; max: number }) {
  const isOverBudget = category.actual > category.budget;
  const budgetPercent = (category.budget / max) * 100;
  const actualPercent = (category.actual / max) * 100;

  return (
    <div className="grid grid-cols-[100px_1fr_90px] items-center gap-3">
      <span className="text-sm font-medium text-gray-700">{category.name}</span>

      <div className="space-y-1">
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-50">
          <div
            className="h-full rounded-full bg-gray-300"
            style={{ width: `${budgetPercent}%` }}
          />
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-50">
          <div
            className={`h-full rounded-full ${isOverBudget ? "bg-red-500" : "bg-brand-green"}`}
            style={{ width: `${actualPercent}%` }}
          />
        </div>
      </div>

      <span
        className={`text-right text-xs font-semibold ${isOverBudget ? "text-red-600" : "text-gray-700"}`}
      >
        {formatShortMillions(category.budget)} / {formatShortMillions(category.actual)}
      </span>
    </div>
  );
}

export function BudgetVsActualChart() {
  const { filteredCategories, isLoading } = useCostData();

  const max = Math.max(1, ...filteredCategories.flatMap((c) => [c.budget, c.actual]));

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-bold text-gray-900">Budget vs Actual by Category</h2>
        <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-gray-300" /> Budget
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-brand-green" /> Actual
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500" /> Over Budget
          </span>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {isLoading ? (
          <p className="text-sm text-gray-500">Loading cost data...</p>
        ) : filteredCategories.length === 0 ? (
          <p className="text-sm text-gray-500">No categories match your search.</p>
        ) : (
          filteredCategories.map((category) => (
            <CategoryRow key={category.name} category={category} max={max} />
          ))
        )}
      </div>
    </div>
  );
}
