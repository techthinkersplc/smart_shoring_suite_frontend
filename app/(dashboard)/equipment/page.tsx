"use client";

import { useState } from "react";
import { useEquipmentData } from "./context";
import { AddEquipmentModal } from "./AddEquipmentModal";
import { FleetCard } from "./FleetCard";
import { MaintenanceLog } from "./MaintenanceLog";
import { useAuth } from "@/app/(dashboard)/hooks/useAuth";
import { UserRole } from "@/app/(dashboard)/constant";

export default function EquipmentPage() {
  const { filteredEquipment, isLoading, error } = useEquipmentData();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const canAddEquipment =
    user?.role === UserRole.ADMIN || user?.role === UserRole.PROJECT_MANAGER;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Fleet Overview</h2>
        {canAddEquipment && (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
          >
            + Add Equipment
          </button>
        )}
      </div>

      {isModalOpen && <AddEquipmentModal onClose={() => setIsModalOpen(false)} />}

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading equipment...</p>
      ) : error ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : filteredEquipment.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">
            No equipment yet — {canAddEquipment ? "add the first one above." : "check back once some is added."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredEquipment.map((item) => (
            <FleetCard key={item.id} equipment={item} />
          ))}
          <div className="md:col-span-2">
            <MaintenanceLog />
          </div>
        </div>
      )}
    </div>
  );
}
