import { useCostData } from "./context";
import { formatETBMillions } from "./format";

const RADIUS = 42;
const TRACK_STROKE = 16;
const ARC_STROKE = 8;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Fixed order + colors, keyed by category name (not sort position) so a
// category keeps the same color as its share of spend changes over time.
// Validated with the dataviz skill's palette checker (adjacent-pairs, since
// these render in this fixed sequence around the ring, not an arbitrary
// user-filterable order): all checks pass — lightness band, chroma floor,
// CVD separation, normal-vision floor, contrast vs. white surface.
const CATEGORY_ORDER = ["Labor", "Fuel", "Equipment", "Materials", "Subcontracts"];
const CATEGORY_COLOR: Record<string, string> = {
  Labor: "#2e7d4f",
  Fuel: "#2563eb",
  Equipment: "#b45309",
  Materials: "#db2777",
  Subcontracts: "#ffffff",
};
const FALLBACK_COLOR = "#6b7280";
// White has no contrast against the white card, so anywhere it's rendered as
// a fill (legend dot, legend bar) also gets this border to stay visible.
const WHITE_BORDER_CLASS = "border border-gray-300";

function colorFor(name: string): string {
  return CATEGORY_COLOR[name] ?? FALLBACK_COLOR;
}

export function CostBreakdownRing() {
  const { summary, isLoading } = useCostData();

  if (isLoading || !summary) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-base font-bold text-gray-900">Cost Breakdown</h2>
        <p className="mt-4 text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  const totalActual = summary.categories.reduce((sum, c) => sum + c.actual, 0);

  const orderedCategories = [...summary.categories].sort(
    (a, b) => CATEGORY_ORDER.indexOf(a.name) - CATEGORY_ORDER.indexOf(b.name),
  );

  const percents = orderedCategories.map((c) =>
    totalActual > 0 ? (c.actual / totalActual) * 100 : 0,
  );
  const arcs = orderedCategories.map((category, index) => {
    const priorPercent = percents.slice(0, index).reduce((sum, p) => sum + p, 0);
    return {
      name: category.name,
      length: (percents[index] / 100) * CIRCUMFERENCE,
      offset: -(priorPercent / 100) * CIRCUMFERENCE,
    };
  });

  const legendCategories = [...summary.categories]
    .sort((a, b) => b.actual - a.actual)
    .map((c) => ({ ...c, percent: totalActual > 0 ? (c.actual / totalActual) * 100 : 0 }));
  const maxCategoryPercent = Math.max(...legendCategories.map((c) => c.percent), 1);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h2 className="text-base font-bold text-gray-900">Cost Breakdown</h2>

      <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <div className="relative h-36 w-36 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            {/* Soft gray track — thicker than each arc, so it peeks out on both
                edges (the "halo") instead of one flat single-width ring. */}
            <circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={TRACK_STROKE}
            />
            {arcs.map((arc) => (
              <circle
                key={arc.name}
                cx="50"
                cy="50"
                r={RADIUS}
                fill="none"
                stroke={colorFor(arc.name)}
                strokeWidth={ARC_STROKE}
                strokeDasharray={`${arc.length} ${CIRCUMFERENCE}`}
                strokeDashoffset={arc.offset}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-gray-900">
              {formatETBMillions(summary.actualCost)}
            </span>
            <span className="text-xs font-medium text-gray-500">Total Spent</span>
          </div>
        </div>

        <div className="w-full flex-1 space-y-2.5">
          {legendCategories.map((category) => (
            <div key={category.name} className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        category.name === "Subcontracts" ? WHITE_BORDER_CLASS : ""
                      }`}
                      style={{ backgroundColor: colorFor(category.name) }}
                    />
                    {category.name}
                  </span>
                  <span className="text-xs font-semibold text-gray-500">
                    {Math.round(category.percent)}%
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${
                      category.name === "Subcontracts" ? WHITE_BORDER_CLASS : ""
                    }`}
                    style={{
                      width: `${(category.percent / maxCategoryPercent) * 100}%`,
                      backgroundColor: colorFor(category.name),
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
