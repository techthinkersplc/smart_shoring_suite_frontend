import { MOCK_MAINTENANCE_LOG } from "./mockData";
import type { MaintenanceLogStatus } from "./types";

const STATUS_BADGE: Record<MaintenanceLogStatus, string> = {
  Open: "bg-red-50 text-red-600",
  Scheduled: "bg-amber-50 text-amber-700",
  Resolved: "bg-emerald-50 text-emerald-700",
};

export function MaintenanceLog() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-base font-bold text-gray-900">
          🔧 Breakdown &amp; Maintenance Log
        </h2>
        <button type="button" className="text-sm font-medium text-emerald-700 hover:text-emerald-800">
          View All
        </button>
      </div>

      <div className="mt-4 overflow-x-auto">
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
            {MOCK_MAINTENANCE_LOG.map((entry) => (
              <tr key={entry.id} className="border-b border-gray-100 text-gray-900">
                <td className="py-2.5 pr-4 font-semibold">{entry.equipmentId}</td>
                <td className="py-2.5 pr-4 text-gray-600">{entry.issue}</td>
                <td className="py-2.5 pr-4 text-gray-600">{entry.reportedAt}</td>
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
      </div>
    </div>
  );
}
