import { api } from "@/app/(dashboard)/axios";
import type { CostSummary } from "./types";

export async function getCostSummary(): Promise<CostSummary> {
  const response = await api.get<CostSummary>("/cost/summary");
  return response.data;
}

export async function dismissCostAlert(id: string): Promise<void> {
  await api.post(`/cost/alerts/${id}/dismiss`);
}
