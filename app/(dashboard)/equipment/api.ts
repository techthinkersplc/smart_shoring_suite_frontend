import { api } from "@/app/(dashboard)/axios";
import type {
  Breakdown,
  CreateEquipmentPayload,
  CreateEquipmentTypePayload,
  Equipment,
  EquipmentStats,
  EquipmentStatus,
  EquipmentType,
  MaintenanceRecord,
  ReportBreakdownPayload,
  ScheduleMaintenancePayload,
} from "./types";

export async function listEquipment(status?: EquipmentStatus): Promise<Equipment[]> {
  const response = await api.get<Equipment[]>("/equipment", {
    params: status ? { status } : undefined,
  });
  return response.data;
}

export async function getEquipmentStats(): Promise<EquipmentStats> {
  const response = await api.get<EquipmentStats>("/equipment/stats");
  return response.data;
}

export async function listEquipmentTypes(): Promise<EquipmentType[]> {
  const response = await api.get<EquipmentType[]>("/equipment/types");
  return response.data;
}

export async function createEquipmentType(
  payload: CreateEquipmentTypePayload,
): Promise<EquipmentType> {
  const response = await api.post<EquipmentType>("/equipment/types", payload);
  return response.data;
}

export async function createEquipment(
  payload: CreateEquipmentPayload,
): Promise<Equipment> {
  const response = await api.post<Equipment>("/equipment", payload);
  return response.data;
}

export async function listBreakdowns(equipmentId: string): Promise<Breakdown[]> {
  const response = await api.get<Breakdown[]>(`/equipment/${equipmentId}/breakdowns`);
  return response.data;
}

export async function listMaintenanceRecords(
  equipmentId: string,
): Promise<MaintenanceRecord[]> {
  const response = await api.get<MaintenanceRecord[]>(`/equipment/${equipmentId}/maintenance`);
  return response.data;
}

export async function scheduleMaintenance(
  equipmentId: string,
  payload: ScheduleMaintenancePayload,
): Promise<MaintenanceRecord> {
  const response = await api.post<MaintenanceRecord>(
    `/equipment/${equipmentId}/maintenance`,
    payload,
  );
  return response.data;
}

export async function reportBreakdown(
  equipmentId: string,
  payload: ReportBreakdownPayload,
): Promise<Breakdown> {
  const response = await api.post<Breakdown>(`/equipment/${equipmentId}/breakdowns`, payload);
  return response.data;
}
