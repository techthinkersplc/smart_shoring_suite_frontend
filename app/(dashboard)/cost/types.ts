export type AlertSeverity = "CRITICAL" | "WARNING" | "NOMINAL";

export interface CostAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  message: string;
}

export interface CostCategoryBreakdown {
  name: string;
  budget: number;
  actual: number;
}

export interface CostSummary {
  projectName: string;
  asOfDate: string;
  contractValue: number;
  totalBudget: number;
  actualCost: number;
  estimatedFinalCost: number;
  estimatedProfit: number;
  profitMarginPercent: number;
  costPerformanceIndex: number;
  categories: CostCategoryBreakdown[];
  alerts: CostAlert[];
}
