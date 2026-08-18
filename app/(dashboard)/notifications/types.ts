export type NotificationSeverity = "INFO" | "WARNING" | "CRITICAL";

export interface Notification {
  id: string;
  title: string;
  message: string;
  severity: NotificationSeverity;
  isRead: boolean;
  createdAt: string;
  href?: string;
}
