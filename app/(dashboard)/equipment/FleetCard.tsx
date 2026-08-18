"use client";

import { useState } from "react";
import { useAuth } from "@/app/(dashboard)/hooks/useAuth";
import { UserRole } from "@/app/(dashboard)/constant";
import { EquipmentActionModal } from "./EquipmentActionModal";
import type { Equipment, EquipmentStatus } from "./types";

const STATUS_BADGE: Record<EquipmentStatus, string> = {
  ACTIVE: "bg-emerald-600 text-white",
  IDLE: "bg-amber-700 text-white",
  BREAKDOWN: "bg-red-600 text-white",
  MAINTENANCE: "bg-gray-500 text-white",
};

const STATUS_LABEL: Record<EquipmentStatus, string> = {
  ACTIVE: "Active",
  IDLE: "Idle",
  BREAKDOWN: "Breakdown",
  MAINTENANCE: "Maintenance",
};

// Mirrors equipment.routes.ts's canManage / breakdown role gates exactly, so
// these buttons only show for roles the backend would actually let through.
const CAN_SCHEDULE_MAINTENANCE = [
  UserRole.ADMIN,
  UserRole.PROJECT_MANAGER,
  UserRole.SITE_ENGINEER,
];
const CAN_REPORT_BREAKDOWN = [
  UserRole.ADMIN,
  UserRole.PROJECT_MANAGER,
  UserRole.SITE_ENGINEER,
  UserRole.SAFETY_OFFICER,
];

export function FleetCard({ equipment }: { equipment: Equipment }) {
  const { user } = useAuth();
  const [action, setAction] = useState<"maintenance" | "breakdown" | null>(null);

  const canScheduleMaintenance = !!user && CAN_SCHEDULE_MAINTENANCE.includes(user.role);
  const canReportBreakdown = !!user && CAN_REPORT_BREAKDOWN.includes(user.role);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-gray-900">
            {equipment.equipmentType.name} – {equipment.equipmentCode}
          </h3>
          <p className="text-sm text-gray-500">
            {equipment.manufacturer} {equipment.model}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[equipment.status]}`}
        >
          {STATUS_LABEL[equipment.status]}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-4">
        <div>
          <p className="text-xs font-medium text-gray-500">Year</p>
          <p className="text-sm font-bold text-gray-900">{equipment.year}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500">Serial Number</p>
          <p className="truncate text-sm font-bold text-gray-900">{equipment.serialNumber}</p>
        </div>
      </div>

      {(canScheduleMaintenance || canReportBreakdown) && (
        <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">
          {canScheduleMaintenance && (
            <button
              type="button"
              onClick={() => setAction("maintenance")}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              Schedule Maintenance
            </button>
          )}
          {canReportBreakdown && (
            <button
              type="button"
              onClick={() => setAction("breakdown")}
              className="flex-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
            >
              Report Breakdown
            </button>
          )}
        </div>
      )}

      {action && (
        <EquipmentActionModal
          equipment={equipment}
          mode={action}
          onClose={() => setAction(null)}
        />
      )}
    </div>
  );
}
