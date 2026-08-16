"use client";

import { useState } from "react";
import { useEquipmentData } from "./context";
import { AddEquipmentModal } from "./AddEquipmentModal";
import { FleetCard } from "./FleetCard";
import { MaintenanceLog } from "./MaintenanceLog";

export default function EquipmentPage() {
  const { filteredEquipment, isLoading } = useEquipmentData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Fleet Overview</h2>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-900"
        >
          + Add Equipment
        </button>
      </div>

      {isModalOpen && <AddEquipmentModal onClose={() => setIsModalOpen(false)} />}

      {/* {isMockData && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Showing sample equipment — the backend&apos;s /equipment endpoint isn&apos;t
          live yet, so this is preview data.
        </p>
      )} */}

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading equipment...</p>
      ) : filteredEquipment.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">No equipment to show.</p>
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
