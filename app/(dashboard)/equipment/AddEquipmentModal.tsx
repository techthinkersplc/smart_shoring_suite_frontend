"use client";

import { useState, type SubmitEvent } from "react";
import { createEquipment } from "./api";
import { useEquipmentData } from "./context";
import { handleApiError } from "@/app/(dashboard)/errors/handleApiError";
import type { CreateEquipmentPayload, EquipmentStatus } from "./types";

const EMPTY_FORM: CreateEquipmentPayload = {
  equipmentId: "",
  name: "",
  status: "ACTIVE",
  year: new Date().getFullYear(),
  serialNumber: "",
  model: "",
  manufacturer: "",
  equipmentCode: "",
};

export function AddEquipmentModal({ onClose }: { onClose: () => void }) {
  const { refresh } = useEquipmentData();
  const [form, setForm] = useState<CreateEquipmentPayload>(EMPTY_FORM);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = <K extends keyof CreateEquipmentPayload>(
    field: K,
    value: CreateEquipmentPayload[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await createEquipment(form);
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
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Add Equipment</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 sm:col-span-2">
              {error}
            </p>
          )}

          <div>
            <label htmlFor="equipmentId" className="mb-1.5 block text-sm font-medium text-gray-700">
              Equipment ID
            </label>
            <input
              id="equipmentId"
              required
              value={form.equipmentId}
              onChange={(e) => updateField("equipmentId", e.target.value)}
              placeholder="EQ-0001"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
              Equipment Name
            </label>
            <input
              id="name"
              required
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Rotary Rig"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={form.status}
              onChange={(e) => updateField("status", e.target.value as EquipmentStatus)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            >
              <option value="ACTIVE">Active</option>
              <option value="IDLE">Idle</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="BREAKDOWN">Breakdown</option>
            </select>
          </div>

          <div>
            <label htmlFor="year" className="mb-1.5 block text-sm font-medium text-gray-700">
              Year
            </label>
            <input
              id="year"
              type="number"
              required
              min={1900}
              max={2100}
              value={form.year}
              onChange={(e) => updateField("year", Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label htmlFor="serialNumber" className="mb-1.5 block text-sm font-medium text-gray-700">
              Serial Number
            </label>
            <input
              id="serialNumber"
              required
              value={form.serialNumber}
              onChange={(e) => updateField("serialNumber", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label htmlFor="model" className="mb-1.5 block text-sm font-medium text-gray-700">
              Model
            </label>
            <input
              id="model"
              required
              value={form.model}
              onChange={(e) => updateField("model", e.target.value)}
              placeholder="Bauer BG 28 H"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label htmlFor="manufacturer" className="mb-1.5 block text-sm font-medium text-gray-700">
              Manufacturer
            </label>
            <input
              id="manufacturer"
              required
              value={form.manufacturer}
              onChange={(e) => updateField("manufacturer", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label htmlFor="equipmentCode" className="mb-1.5 block text-sm font-medium text-gray-700">
              Equipment Code
            </label>
            <input
              id="equipmentCode"
              required
              value={form.equipmentCode}
              onChange={(e) => updateField("equipmentCode", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="flex justify-end gap-3 sm:col-span-2">
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
              className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : "Save Equipment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
