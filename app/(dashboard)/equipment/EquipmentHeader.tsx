"use client";

import { useEquipmentData, type EquipmentStatusFilter } from "./context";

export function EquipmentHeader() {
  const { stats, isLoading, statusFilter, setStatusFilter } = useEquipmentData();

  return (
    <div className="flex flex-1 items-center gap-6">
      <h1 className="text-xl font-bold text-gray-900">Equipment Management</h1>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as EquipmentStatusFilter)}
        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
      >
        <option value="ALL">All Equipment</option>
        <option value="ACTIVE">Active</option>
        <option value="IDLE">Idle</option>
        <option value="MAINTENANCE">Maintenance</option>
        <option value="BREAKDOWN">Breakdown</option>
      </select>

      <div className="ml-auto flex items-center gap-6">
        <div className="text-center">
          <p className="text-xs font-medium text-gray-500">Total Units</p>
          <p className="text-lg font-bold text-gray-900">
            {isLoading ? "..." : stats.total}
          </p>
        </div>
        <div className="text-center">
          <p className="flex items-center justify-center gap-1.5 text-xs font-medium text-gray-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Active
          </p>
          <p className="text-lg font-bold text-emerald-700">
            {isLoading ? "..." : stats.active}
          </p>
        </div>
        <div className="text-center">
          <p className="flex items-center justify-center gap-1.5 text-xs font-medium text-gray-500">
            <span className="h-2 w-2 rounded-full bg-amber-400" /> Idle
          </p>
          <p className="text-lg font-bold text-amber-700">
            {isLoading ? "..." : stats.idle}
          </p>
        </div>
        <div className="text-center">
          <p className="flex items-center justify-center gap-1.5 text-xs font-medium text-gray-500">
            <span className="h-2 w-2 rounded-full bg-gray-400" /> Maintenance
          </p>
          <p className="text-lg font-bold text-gray-700">
            {isLoading ? "..." : stats.maintenance}
          </p>
        </div>
      </div>
    </div>
  );
}
