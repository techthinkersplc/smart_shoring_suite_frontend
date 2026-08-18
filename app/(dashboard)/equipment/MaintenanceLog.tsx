"use client";

import { useState } from "react";
import { useEquipmentData } from "./context";
import type { MaintenanceLogEntry, MaintenanceLogStatus } from "./types";

const STATUS_BADGE: Record<MaintenanceLogStatus, string> = {
  Open: "bg-red-50 text-red-600",
  "In Progress": "bg-amber-50 text-amber-700",
  Scheduled: "bg-amber-50 text-amber-700",
  Resolved: "bg-brand-green/10 text-brand-green",
};

const PREVIEW_COUNT = 4;

function MaintenanceLogTable({ entries }: { entries: MaintenanceLogEntry[] }) {
  return (
    <table className="w-full min-w-100 text-left text-sm">
      <thead>
        <tr className="border-b border-gray-200 text-xs text-gray-500">
          <th className="py-2 pr-4 font-medium">Equipment</th>
          <th className="py-2 pr-4 font-medium">Issue</th>
          <th className="py-2 pr-4 font-medium">Reported</th>
          <th className="py-2 pr-4 font-medium">Status</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry) => (
          <tr key={entry.id} className="border-b border-gray-100 text-gray-900">
            <td className="py-2.5 pr-4 font-semibold">{entry.equipmentCode}</td>
            <td className="py-2.5 pr-4 text-gray-600">{entry.issue}</td>
            <td className="py-2.5 pr-4 text-gray-600">
              {new Date(entry.reportedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
              })}
            </td>
            <td className="py-2.5 pr-4">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[entry.status]}`}
              >
                {entry.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function MaintenanceLog() {
  const { maintenanceLog } = useEquipmentData();
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);
  const entries = maintenanceLog ?? [];
  const previewEntries = entries.slice(0, PREVIEW_COUNT);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-base font-bold text-gray-900">
          🔧 Breakdown &amp; Maintenance Log
        </h2>
        {entries.length > PREVIEW_COUNT && (
          <button
            type="button"
            onClick={() => setIsViewAllOpen(true)}
            className="text-sm font-medium text-brand-green hover:opacity-80"
          >
            View All
          </button>
        )}
      </div>

      <div className="mt-4 overflow-x-auto">
        {maintenanceLog === null ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : entries.length === 0 ? (
          <p className="text-sm text-gray-500">No breakdowns or maintenance reported.</p>
        ) : (
          <MaintenanceLogTable entries={previewEntries} />
        )}
      </div>

      {isViewAllOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Breakdown &amp; Maintenance Log
              </h2>
              <button
                type="button"
                onClick={() => setIsViewAllOpen(false)}
                aria-label="Close"
                className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <MaintenanceLogTable entries={entries} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
