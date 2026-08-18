"use client";

import { useState, type SubmitEvent } from "react";
import { createEquipment, createEquipmentType } from "./api";
import { useEquipmentData } from "./context";
import { handleApiError } from "@/app/(dashboard)/errors/handleApiError";
import type { CreateEquipmentPayload, EquipmentStatus } from "./types";

const NEW_TYPE_VALUE = "__new__";

const EMPTY_FORM: CreateEquipmentPayload = {
  equipmentCode: "",
  equipmentTypeId: "",
  status: "ACTIVE",
  year: new Date().getFullYear(),
  serialNumber: "",
  model: "",
  manufacturer: "",
};

export function AddEquipmentModal({ onClose }: { onClose: () => void }) {
  const { equipmentTypes, addEquipmentType, refresh } = useEquipmentData();
  const [form, setForm] = useState<CreateEquipmentPayload>(EMPTY_FORM);
  const [newTypeName, setNewTypeName] = useState("");
  const [isAddingType, setIsAddingType] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = <K extends keyof CreateEquipmentPayload>(
    field: K,
    value: CreateEquipmentPayload[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTypeSelect = (value: string) => {
    if (value === NEW_TYPE_VALUE) {
      setIsAddingType(true);
      return;
    }
    updateField("equipmentTypeId", value);
  };

  const handleAddType = async () => {
    if (!newTypeName.trim()) return;
    setError("");
    try {
      const type = await createEquipmentType({ name: newTypeName.trim() });
      addEquipmentType(type);
      updateField("equipmentTypeId", type.id);
      setNewTypeName("");
      setIsAddingType(false);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.equipmentTypeId) {
      setError("Choose or add an equipment type.");
      return;
    }

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

          <div className="sm:col-span-2">
            <label htmlFor="equipmentType" className="mb-1.5 block text-sm font-medium text-gray-700">
              Equipment Type
            </label>
            {isAddingType ? (
              <div className="flex gap-2">
                <input
                  autoFocus
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  placeholder="e.g. Rotary Rig"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
                />
                <button
                  type="button"
                  onClick={handleAddType}
                  className="shrink-0 rounded-lg bg-brand-green px-3 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingType(false);
                    setNewTypeName("");
                  }}
                  className="shrink-0 rounded-lg border border-gray-300 px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <select
                id="equipmentType"
                value={form.equipmentTypeId}
                onChange={(e) => handleTypeSelect(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
              >
                <option value="" disabled>
                  {equipmentTypes.length === 0 ? "No types yet — add one" : "Select a type"}
                </option>
                {equipmentTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
                <option value={NEW_TYPE_VALUE}>+ Add new type...</option>
              </select>
            )}
          </div>

          <div>
            <label htmlFor="status" className="mb-1.5 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={form.status}
              onChange={(e) => updateField("status", e.target.value as EquipmentStatus)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
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
              placeholder="RR-04"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
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
              className="rounded-lg bg-brand-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Saving..." : "Save Equipment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
