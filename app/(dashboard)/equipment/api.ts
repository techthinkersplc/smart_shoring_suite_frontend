import { api } from "@/app/(dashboard)/axios";
import type { CreateEquipmentPayload, Equipment } from "./types";

export async function listEquipment(): Promise<Equipment[]> {
  const response = await api.get<Equipment[]>("/equipment");
  return response.data;
}

export async function createEquipment(
  payload: CreateEquipmentPayload,
): Promise<Equipment> {
  const response = await api.post<Equipment>("/equipment", payload);
  return response.data;
}
