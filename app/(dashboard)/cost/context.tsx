"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { dismissCostAlert, getCostSummary } from "./api";
import { MOCK_COST_SUMMARY } from "./mockData";
import type { CostSummary } from "./types";

interface CostContextValue {
  summary: CostSummary | null;
  filteredCategories: CostSummary["categories"];
  isLoading: boolean;
  // True while showing MOCK_COST_SUMMARY because GET /cost/summary isn't live yet.
  isMockData: boolean;
  variance: number;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  dismissAlert: (id: string) => void;
}

const CostContext = createContext<CostContextValue | undefined>(undefined);

export function CostProvider({ children }: { children: ReactNode }) {
  const [summary, setSummary] = useState<CostSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMockData, setIsMockData] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getCostSummary()
      .then((data) => {
        setSummary(data);
        setIsMockData(false);
      })
      .catch(() => {
        setSummary(MOCK_COST_SUMMARY);
        setIsMockData(true);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const variance = useMemo(
    () => (summary ? summary.totalBudget - summary.estimatedFinalCost : 0),
    [summary],
  );

  const filteredCategories = useMemo(() => {
    if (!summary) return [];
    const term = searchTerm.trim().toLowerCase();
    if (!term) return summary.categories;
    return summary.categories.filter((c) => c.name.toLowerCase().includes(term));
  }, [summary, searchTerm]);

  // Remove it locally right away so the UI always works, and best-effort
  // persist to the backend — once /cost/alerts is live this will actually
  // stick; until then the request just fails silently and local state holds.
  const dismissAlert = (id: string) => {
    setSummary((prev) =>
      prev ? { ...prev, alerts: prev.alerts.filter((a) => a.id !== id) } : prev,
    );
    dismissCostAlert(id).catch(() => {});
  };

  const value = useMemo(
    () => ({
      summary,
      filteredCategories,
      isLoading,
      isMockData,
      variance,
      searchTerm,
      setSearchTerm,
      dismissAlert,
    }),
    [summary, filteredCategories, isLoading, isMockData, variance, searchTerm],
  );

  return <CostContext.Provider value={value}>{children}</CostContext.Provider>;
}

export function useCostData(): CostContextValue {
  const context = useContext(CostContext);
  if (!context) {
    throw new Error("useCostData must be used within a CostProvider");
  }
  return context;
}
