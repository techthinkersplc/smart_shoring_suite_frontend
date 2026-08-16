export type EquipmentStatus = "ACTIVE" | "IDLE" | "MAINTENANCE" | "BREAKDOWN";

export interface Equipment {
  id: string;
  equipmentId: string;
  name: string;
  status: EquipmentStatus;
  year: number;
  serialNumber: string;
  model: string;
  manufacturer: string;
  equipmentCode: string;
  // Not part of the backend contract yet — populated by mock data until the
  // backend equipment module exposes them.
  maintenanceDueInDays?: number;
  fuelLevelPercent?: number;
  engineHours?: number;
  idleHours?: number;
  location?: string;
  assignedTo?: string | null;
}

export type MaintenanceLogStatus = "Open" | "Scheduled" | "Resolved";

export interface MaintenanceLogEntry {
  id: string;
  equipmentId: string;
  issue: string;
  reportedAt: string;
  status: MaintenanceLogStatus;
}

export interface CreateEquipmentPayload {
  equipmentId: string;
  name: string;
  status: EquipmentStatus;
  year: number;
  serialNumber: string;
  model: string;
  manufacturer: string;
  equipmentCode: string;
}
