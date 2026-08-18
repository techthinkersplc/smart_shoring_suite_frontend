"use client";

import { useState, type SubmitEvent } from "react";
import { reportBreakdown, scheduleMaintenance } from "./api";
import { useEquipmentData } from "./context";
import { handleApiError } from "@/app/(dashboard)/errors/handleApiError";
import type { Equipment } from "./types";

type Mode = "maintenance" | "breakdown";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function EquipmentActionModal({
  equipment,
  mode,
  onClose,
}: {
  equipment: Equipment;
  mode: Mode;
  onClose: () => void;
}) {
  const { refresh } = useEquipmentData();
  const isMaintenance = mode === "maintenance";

  const [maintenanceType, setMaintenanceType] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(todayIso);
  const [cost, setCost] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isMaintenance && !description.trim()) {
      setError("Describe the breakdown.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      if (isMaintenance) {
        await scheduleMaintenance(equipment.id, {
          maintenanceType,
          description: description.trim() || undefined,
          startDate: date,
          cost: cost ? Number(cost) : undefined,
        });
      } else {
        await reportBreakdown(equipment.id, { date, description });
      }
      refresh();
      onClose();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {isMaintenance ? "Schedule Maintenance" : "Report Breakdown"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          {equipment.equipmentType.name} – {equipment.equipmentCode}
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}

          {isMaintenance && (
            <div>
              <label
                htmlFor="maintenanceType"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Maintenance Type
              </label>
              <input
                id="maintenanceType"
                required
                value={maintenanceType}
                onChange={(e) => setMaintenanceType(e.target.value)}
                placeholder="e.g. Routine Inspection"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
              />
            </div>
          )}

          <div>
            <label htmlFor="date" className="mb-1.5 block text-sm font-medium text-gray-700">
              {isMaintenance ? "Start Date" : "Date"}
            </label>
            <input
              id="date"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
            />
          </div>

          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-gray-700">
              Description{isMaintenance ? " (optional)" : ""}
            </label>
            <textarea
              id="description"
              required={!isMaintenance}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isMaintenance ? "Notes about this maintenance..." : "What happened?"}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
            />
          </div>

          {isMaintenance && (
            <div>
              <label htmlFor="cost" className="mb-1.5 block text-sm font-medium text-gray-700">
                Cost (optional)
              </label>
              <input
                id="cost"
                type="number"
                min={0}
                step="0.01"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
              />
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${
                isMaintenance ? "bg-brand-green hover:opacity-90" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isSubmitting ? "Saving..." : isMaintenance ? "Schedule" : "Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
