import { useCostData } from "./context";
import type { AlertSeverity } from "./types";

const SEVERITY_STYLE: Record<
  AlertSeverity,
  { card: string; title: string; message: string; icon: string }
> = {
  CRITICAL: {
    card: "bg-red-50 border-red-100",
    title: "text-red-700",
    message: "text-red-600",
    icon: "text-red-500",
  },
  WARNING: {
    card: "bg-amber-50 border-amber-100",
    title: "text-amber-700",
    message: "text-amber-600",
    icon: "text-amber-500",
  },
  NOMINAL: {
    card: "bg-brand-green/10 border-brand-green/20",
    title: "text-brand-green",
    message: "text-brand-green",
    icon: "text-brand-green",
  },
};

function AlertIcon({ severity }: { severity: AlertSeverity }) {
  if (severity === "CRITICAL") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M3 17l6-8 4 4 8-10" />
        <path d="M15 3h6v6" />
      </svg>
    );
  }
  if (severity === "WARNING") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.7 21a2 2 0 0 1-3.4 0" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
    </svg>
  );
}

export function CostAlerts() {
  const { summary, isLoading, dismissAlert } = useCostData();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h2 className="flex items-center gap-1.5 text-base font-bold text-gray-900">
        ⚠️ Cost Alerts
      </h2>

      <div className="mt-4 space-y-3">
        {isLoading || !summary ? (
          <p className="text-sm text-gray-500">Loading alerts...</p>
        ) : summary.alerts.length === 0 ? (
          <p className="text-sm text-gray-500">No active alerts.</p>
        ) : (
          summary.alerts.map((alert) => {
            const style = SEVERITY_STYLE[alert.severity];
            return (
              <div
                key={alert.id}
                className={`flex items-start gap-3 rounded-lg border p-3 ${style.card}`}
              >
                <span className={`mt-0.5 shrink-0 ${style.icon}`}>
                  <AlertIcon severity={alert.severity} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-semibold ${style.title}`}>{alert.title}</p>
                  <p className={`mt-0.5 text-xs ${style.message}`}>{alert.message}</p>
                </div>
                <button
                  type="button"
                  onClick={() => dismissAlert(alert.id)}
                  aria-label="Dismiss alert"
                  className={`shrink-0 rounded-md p-0.5 hover:bg-black/5 ${style.icon}`}
                >
                  ✕
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
