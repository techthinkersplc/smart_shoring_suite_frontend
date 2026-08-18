// Temporary sample data — the backend /notifications module isn't implemented
// yet (its files exist but are empty, and it isn't mounted in main.router.ts).
// Swap MOCK_NOTIFICATIONS for the real fetch in context.tsx once it is.
import type { Notification } from "./types";

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    title: "Excavator EX-15 reported a breakdown",
    message: "Hydraulic leak reported at Metro Line – Sec 4. Status: Open.",
    severity: "CRITICAL",
    isRead: false,
    createdAt: hoursAgo(1),
    href: "/equipment",
  },
  {
    id: "notif-2",
    title: "Fuel spending over budget",
    message: "Fuel category is 15% above its allocated budget on Sky Tower A.",
    severity: "CRITICAL",
    isRead: false,
    createdAt: hoursAgo(3),
    href: "/cost",
  },
  {
    id: "notif-3",
    title: "Equipment budget approaching limit",
    message: "Equipment spending has reached 89% of its allocated budget.",
    severity: "WARNING",
    isRead: false,
    createdAt: hoursAgo(6),
    href: "/cost",
  },
  {
    id: "notif-4",
    title: "Anchor Rig maintenance due",
    message: "AR-02 is due for scheduled maintenance in 2 days.",
    severity: "WARNING",
    isRead: true,
    createdAt: hoursAgo(20),
    href: "/equipment",
  },
  {
    id: "notif-5",
    title: "New team member added",
    message: "Shikur Ahmed was added as a Site Engineer.",
    severity: "INFO",
    isRead: true,
    createdAt: hoursAgo(30),
    href: "/users",
  },
];
