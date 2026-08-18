"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  getEquipmentStats,
  listBreakdowns,
  listEquipment,
  listEquipmentTypes,
  listMaintenanceRecords,
} from "./api";
import { handleApiError } from "@/app/(dashboard)/errors/handleApiError";
import type {
  Equipment,
  EquipmentStats,
  EquipmentStatus,
  EquipmentType,
  MaintenanceLogEntry,
} from "./types";

export type EquipmentStatusFilter = "ALL" | EquipmentStatus;

const EMPTY_STATS: EquipmentStats = {
  total: 0,
  active: 0,
  idle: 0,
  maintenance: 0,
  breakdown: 0,
};

interface EquipmentContextValue {
  equipment: Equipment[];
  filteredEquipment: Equipment[];
  equipmentTypes: EquipmentType[];
  stats: EquipmentStats;
  isLoading: boolean;
  error: string;
  // null while the per-equipment breakdown/maintenance fetches are in flight
  // (kept separate from `isLoading` so the fleet cards render immediately
  // instead of waiting on this — see the "refetch keeps the frame" note below).
  maintenanceLog: MaintenanceLogEntry[] | null;
  statusFilter: EquipmentStatusFilter;
  setStatusFilter: (filter: EquipmentStatusFilter) => void;
  refresh: () => void;
  addEquipmentType: (type: EquipmentType) => void;
}

const EquipmentContext = createContext<EquipmentContextValue | undefined>(undefined);

// Merges GET /equipment/:id/breakdowns and /equipment/:id/maintenance across
// every piece of equipment into one real, sorted log — there's no bulk
// fleet-wide endpoint on the backend for this yet.
async function fetchMaintenanceLog(equipment: Equipment[]): Promise<MaintenanceLogEntry[]> {
  const perEquipment = await Promise.all(
    equipment.map(async (item) => {
      const [breakdowns, maintenance] = await Promise.all([
        listBreakdowns(item.id).catch(() => []),
        listMaintenanceRecords(item.id).catch(() => []),
      ]);

      const breakdownEntries: MaintenanceLogEntry[] = breakdowns.map((b) => ({
        id: `breakdown-${b.id}`,
        equipmentId: item.id,
        equipmentCode: item.equipmentCode,
        issue: b.description,
        reportedAt: b.date,
        status: b.status,
      }));

      const maintenanceEntries: MaintenanceLogEntry[] = maintenance.map((m) => ({
        id: `maintenance-${m.id}`,
        equipmentId: item.id,
        equipmentCode: item.equipmentCode,
        issue: m.maintenanceType,
        reportedAt: m.startDate,
        status: m.status,
      }));

      return [...breakdownEntries, ...maintenanceEntries];
    }),
  );

  return perEquipment
    .flat()
    .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());
}

export function EquipmentProvider({ children }: { children: ReactNode }) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [equipmentTypes, setEquipmentTypes] = useState<EquipmentType[]>([]);
  const [stats, setStats] = useState<EquipmentStats>(EMPTY_STATS);
  const [maintenanceLog, setMaintenanceLog] = useState<MaintenanceLogEntry[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<EquipmentStatusFilter>("ALL");

  useEffect(() => {
    Promise.all([listEquipment(), getEquipmentStats(), listEquipmentTypes()])
      .then(([equipmentData, statsData, typesData]) => {
        setEquipment(equipmentData);
        setStats(statsData);
        setEquipmentTypes(typesData);
        setError("");
      })
      .catch((err) => setError(handleApiError(err)))
      .finally(() => setIsLoading(false));
  }, []);

  // Runs whenever the equipment list changes (initial load, refresh after
  // creating equipment). Deliberately not gated by its own "loading" flip on
  // `equipment` changes — it just replaces `maintenanceLog` once the fetch
  // resolves, so a refresh doesn't flash the log back to a loading state.
  useEffect(() => {
    fetchMaintenanceLog(equipment)
      .then((entries) => setMaintenanceLog(entries))
      .catch(() => setMaintenanceLog([]));
  }, [equipment]);

  const refresh = () => {
    setIsLoading(true);
    Promise.all([listEquipment(), getEquipmentStats(), listEquipmentTypes()])
      .then(([equipmentData, statsData, typesData]) => {
        setEquipment(equipmentData);
        setStats(statsData);
        setEquipmentTypes(typesData);
        setError("");
      })
      .catch((err) => setError(handleApiError(err)))
      .finally(() => setIsLoading(false));
  };

  // Lets the "add new type" flow in the create form append the freshly
  // created type locally without a full refetch.
  const addEquipmentType = (type: EquipmentType) => {
    setEquipmentTypes((prev) => [...prev, type].sort((a, b) => a.name.localeCompare(b.name)));
  };

  const filteredEquipment = useMemo(
    () =>
      statusFilter === "ALL"
        ? equipment
        : equipment.filter((e) => e.status === statusFilter),
    [equipment, statusFilter],
  );

  const value = useMemo(
    () => ({
      equipment,
      filteredEquipment,
      equipmentTypes,
      stats,
      isLoading,
      error,
      maintenanceLog,
      statusFilter,
      setStatusFilter,
      refresh,
      addEquipmentType,
    }),
    [
      equipment,
      filteredEquipment,
      equipmentTypes,
      stats,
      isLoading,
      error,
      maintenanceLog,
      statusFilter,
    ],
  );

  return (
    <EquipmentContext.Provider value={value}>{children}</EquipmentContext.Provider>
  );
}

export function useEquipmentData(): EquipmentContextValue {
  const context = useContext(EquipmentContext);
  if (!context) {
    throw new Error("useEquipmentData must be used within an EquipmentProvider");
  }
  return context;
}
