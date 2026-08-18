import { useCostData } from "./context";

function UpIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
      <path d="M7 17l10-10" />
      <path d="M9 7h8v8" />
    </svg>
  );
}

function DownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
      <path d="M7 7l10 10" />
      <path d="M17 9v8H9" />
    </svg>
  );
}

export function VarianceAnalysisTable() {
  const { filteredCategories, isLoading } = useCostData();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h2 className="text-base font-bold text-gray-900">Variance Analysis</h2>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-140 text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs text-gray-500">
              <th className="py-2 pr-4 font-medium">Category</th>
              <th className="py-2 pr-4 font-medium">Budget</th>
              <th className="py-2 pr-4 font-medium">Actual</th>
              <th className="py-2 pr-4 font-medium">Variance</th>
              <th className="py-2 pr-4 font-medium">Var %</th>
              <th className="py-2 pr-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-4 text-sm text-gray-500">
                  Loading cost data...
                </td>
              </tr>
            ) : filteredCategories.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-4 text-sm text-gray-500">
                  No categories match your search.
                </td>
              </tr>
            ) : (
              filteredCategories.map((category) => {
                const variance = category.budget - category.actual;
                const variancePercent =
                  category.budget > 0 ? (variance / category.budget) * 100 : 0;
                const isUnderBudget = variance >= 0;

                return (
                  <tr key={category.name} className="border-b border-gray-100 text-gray-900">
                    <td className="py-2.5 pr-4 font-medium">{category.name}</td>
                    <td className="py-2.5 pr-4 text-gray-600">
                      {category.budget.toLocaleString()}
                    </td>
                    <td className="py-2.5 pr-4 text-gray-600">
                      {category.actual.toLocaleString()}
                    </td>
                    <td
                      className={`py-2.5 pr-4 font-medium ${
                        isUnderBudget ? "text-brand-green" : "text-red-600"
                      }`}
                    >
                      {isUnderBudget ? "+" : "-"}
                      {Math.abs(variance).toLocaleString()}
                    </td>
                    <td
                      className={`py-2.5 pr-4 font-medium ${
                        isUnderBudget ? "text-brand-green" : "text-red-600"
                      }`}
                    >
                      {isUnderBudget ? "" : "-"}
                      {Math.abs(Math.round(variancePercent * 10) / 10)}%
                    </td>
                    <td className="py-2.5 pr-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                          isUnderBudget
                            ? "bg-brand-green/10 text-brand-green"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {isUnderBudget ? <DownIcon /> : <UpIcon />}
                        {isUnderBudget ? "Under Budget" : "Over Budget"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
