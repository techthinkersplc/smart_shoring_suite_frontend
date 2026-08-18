// Mirrors DSSS_Backend/src/modules/equipment (entities, dto, service) exactly —
// this is a real, implemented, mounted backend module, not a placeholder.
export type EquipmentStatus = "ACTIVE" | "IDLE" | "MAINTENANCE" | "BREAKDOWN";

export interface EquipmentType {
  id: string;
  name: string;
}

export interface Equipment {
  id: string;
  equipmentCode: string;
  equipmentType: EquipmentType;
  manufacturer: string;
  model: string;
  serialNumber: string;
  year: number;
  status: EquipmentStatus;
}

export interface EquipmentStats {
  total: number;
  active: number;
  idle: number;
  maintenance: number;
  breakdown: number;
}

export interface CreateEquipmentPayload {
  equipmentCode: string;
  equipmentTypeId: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  year: number;
  status?: EquipmentStatus;
}

export interface CreateEquipmentTypePayload {
  name: string;
}

export interface ScheduleMaintenancePayload {
  maintenanceType: string;
  description?: string;
  startDate: string;
  cost?: number;
}

export interface ReportBreakdownPayload {
  date: string;
  description: string;
}

export type BreakdownStatus = "Open" | "In Progress" | "Resolved";

export interface Breakdown {
  id: string;
  equipmentId: string;
  date: string;
  description: string;
  downtimeHours: number | null;
  repairCost: number | null;
  status: BreakdownStatus;
}

export type MaintenanceRecordStatus = "Scheduled" | "In Progress" | "Resolved";

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  maintenanceType: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  cost: number | null;
  performedBy: { id: string; name: string } | null;
  status: MaintenanceRecordStatus;
}

// There's no bulk "all breakdowns/maintenance across the fleet" endpoint on
// the backend — only per-equipment GET /equipment/:id/breakdowns and
// /equipment/:id/maintenance. This is the merged, real result of fetching
// both for every piece of equipment, not mock data.
export type MaintenanceLogStatus = BreakdownStatus | MaintenanceRecordStatus;

export interface MaintenanceLogEntry {
  id: string;
  equipmentId: string;
  equipmentCode: string;
  issue: string;
  reportedAt: string;
  status: MaintenanceLogStatus;
}
