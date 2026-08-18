"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "./api";
import { MOCK_NOTIFICATIONS } from "./mockData";
import type { Notification } from "./types";

interface NotificationsContextValue {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  // True while showing MOCK_NOTIFICATIONS because GET /notifications isn't live yet.
  isMockData: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(
  undefined,
);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMockData, setIsMockData] = useState(false);

  useEffect(() => {
    listNotifications()
      .then((data) => {
        setNotifications(data);
        setIsMockData(false);
      })
      .catch(() => {
        setNotifications(MOCK_NOTIFICATIONS);
        setIsMockData(true);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications],
  );

  // Update locally right away so the UI always works, and best-effort persist
  // to the backend — once /notifications is live this will actually stick;
  // until then the request just fails silently and local state still holds.
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    markNotificationRead(id).catch(() => {});
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    markAllNotificationsRead().catch(() => {});
  };

  const value = useMemo(
    () => ({ notifications, unreadCount, isLoading, isMockData, markAsRead, markAllAsRead }),
    [notifications, unreadCount, isLoading, isMockData],
  );

  return (
    <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
  );
}

export function useNotifications(): NotificationsContextValue {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
}
