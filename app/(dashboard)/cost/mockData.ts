// Temporary sample data — the backend /cost module isn't implemented yet.
// Swap MOCK_COST_SUMMARY for the real fetch in context.tsx once it is; the
// shape already matches the CostSummary type the rest of this feature consumes.
import type { CostSummary } from "./types";

// Today's date, not a fixed placeholder — a mock report should still look
// current whenever this app is opened.
const TODAY_ISO = new Date().toISOString().slice(0, 10);

export const MOCK_COST_SUMMARY: CostSummary = {
  projectName: "Sky Tower A",
  asOfDate: TODAY_ISO,
  contractValue: 130_000_000,
  totalBudget: 120_000_000,
  actualCost: 86_400_000,
  estimatedFinalCost: 114_800_000,
  estimatedProfit: 15_200_000,
  profitMarginPercent: 12.7,
  costPerformanceIndex: 92,
  categories: [
    { name: "Labor", budget: 25_000_000, actual: 23_000_000 },
    { name: "Fuel", budget: 8_000_000, actual: 9_200_000 },
    { name: "Equipment", budget: 18_000_000, actual: 16_000_000 },
    { name: "Materials", budget: 20_000_000, actual: 22_000_000 },
    { name: "Subcontracts", budget: 15_000_000, actual: 12_000_000 },
  ],
  alerts: [
    {
      id: "alert-1",
      severity: "CRITICAL",
      title: "Critical Overrun",
      message: "Fuel spending is 15% above allocated budget.",
    },
    {
      id: "alert-2",
      severity: "WARNING",
      title: "Warning Threshold",
      message: "Equipment budget limit approaching (89% consumed).",
    },
    {
      id: "alert-3",
      severity: "NOMINAL",
      title: "Status Nominal",
      message: "Overall project remains safely under total budget.",
    },
  ],
};
