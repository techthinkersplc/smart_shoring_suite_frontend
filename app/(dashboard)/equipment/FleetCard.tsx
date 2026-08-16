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

function fuelSeverity(percent: number) {
  if (percent >= 50) return { fill: "bg-emerald-500", track: "bg-emerald-100" };
  if (percent >= 20) return { fill: "bg-amber-400", track: "bg-amber-100" };
  return { fill: "bg-red-500", track: "bg-red-100" };
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function FleetCard({ equipment }: { equipment: Equipment }) {
  const fuel = equipment.fuelLevelPercent ?? 0;
  const severity = fuelSeverity(fuel);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-gray-900">
            {equipment.name} – {equipment.equipmentId}
          </h3>
          <p className="text-sm text-gray-500">{equipment.model}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {equipment.maintenanceDueInDays !== undefined && (
            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
              ⚠ Maint Due ({equipment.maintenanceDueInDays}d)
            </span>
          )}
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[equipment.status]}`}
          >
            {STATUS_LABEL[equipment.status]}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs font-medium text-gray-500">
          <span>Fuel Level</span>
          <span className="text-gray-900">{fuel}%</span>
        </div>
        <div className={`mt-1.5 h-1.5 w-full overflow-hidden rounded-full ${severity.track}`}>
          <div
            className={`h-full rounded-full ${severity.fill}`}
            style={{ width: `${fuel}%` }}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-4">
        <div>
          <p className="text-xs font-medium text-gray-500">Engine Hours</p>
          <p className="text-sm font-bold text-gray-900">{equipment.engineHours} hrs</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500">Idle Hours</p>
          <p className="text-sm font-bold text-gray-900">{equipment.idleHours} hrs</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4">
        {equipment.assignedTo ? (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-xs font-semibold text-white">
            {initials(equipment.assignedTo)}
          </div>
        ) : (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-4 w-4"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
            </svg>
          </div>
        )}
        <div className="min-w-0 text-sm">
          <p className="truncate font-medium text-gray-900">
            {equipment.assignedTo ?? "Unassigned"}
          </p>
          <p className="truncate text-xs text-gray-500">{equipment.location}</p>
        </div>
      </div>
    </div>
  );
}
