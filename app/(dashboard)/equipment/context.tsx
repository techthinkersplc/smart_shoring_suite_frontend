"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { listEquipment } from "./api";
import { MOCK_EQUIPMENT } from "./mockData";
import type { Equipment, EquipmentStatus } from "./types";

export type EquipmentStatusFilter = "ALL" | EquipmentStatus;

interface EquipmentStats {
  total: number;
  active: number;
  idle: number;
  maintenance: number;
  breakdown: number;
}

interface EquipmentContextValue {
  equipment: Equipment[];
  filteredEquipment: Equipment[];
  stats: EquipmentStats;
  isLoading: boolean;
  // True while showing MOCK_EQUIPMENT because GET /equipment isn't live yet.
  isMockData: boolean;
  statusFilter: EquipmentStatusFilter;
  setStatusFilter: (filter: EquipmentStatusFilter) => void;
  refresh: () => void;
}

const EquipmentContext = createContext<EquipmentContextValue | undefined>(undefined);

export function EquipmentProvider({ children }: { children: ReactNode }) {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMockData, setIsMockData] = useState(false);
  const [statusFilter, setStatusFilter] = useState<EquipmentStatusFilter>("ALL");

  useEffect(() => {
    listEquipment()
      .then((data) => {
        setEquipment(data);
        setIsMockData(false);
      })
      .catch(() => {
        setEquipment(MOCK_EQUIPMENT);
        setIsMockData(true);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const refresh = () => {
    setIsLoading(true);
    listEquipment()
      .then((data) => {
        setEquipment(data);
        setIsMockData(false);
      })
      .catch(() => {
        setEquipment(MOCK_EQUIPMENT);
        setIsMockData(true);
      })
      .finally(() => setIsLoading(false));
  };

  const stats = useMemo<EquipmentStats>(
    () => ({
      total: equipment.length,
      active: equipment.filter((e) => e.status === "ACTIVE").length,
      idle: equipment.filter((e) => e.status === "IDLE").length,
      maintenance: equipment.filter((e) => e.status === "MAINTENANCE").length,
      breakdown: equipment.filter((e) => e.status === "BREAKDOWN").length,
    }),
    [equipment],
  );

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
      stats,
      isLoading,
      isMockData,
      statusFilter,
      setStatusFilter,
      refresh,
    }),
    [equipment, filteredEquipment, stats, isLoading, isMockData, statusFilter],
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
