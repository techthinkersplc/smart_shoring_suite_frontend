import { api } from "@/app/(dashboard)/axios";
import type { Notification } from "./types";

export async function listNotifications(): Promise<Notification[]> {
  const response = await api.get<Notification[]>("/notifications");
  return response.data;
}

export async function markNotificationRead(id: string): Promise<void> {
  await api.post(`/notifications/${id}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.post("/notifications/read-all");
}
