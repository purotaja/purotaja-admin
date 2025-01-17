import React, { createContext, useContext, useEffect, useState } from "react";
import Pusher from "pusher-js";
import { toast } from "sonner";

type Notification = {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
};

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
  storeId,
}: {
  children: React.ReactNode;
  storeId: string;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Initialize Pusher
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    // Subscribe to store's notification channel
    const channel = pusher.subscribe(`store-${storeId}`);

    channel.bind("notification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      toast.custom((t) => (
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="font-bold">{notification.message}</h3>
        </div>
      ));
    });

    fetchNotifications();

    return () => {
      pusher.unsubscribe(`store-${storeId}`);
    };
  }, [storeId]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/${storeId}/notifications`);
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/${storeId}/notifications/${id}`, {
        method: "POST",
      });
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/${storeId}/notifications/${id}`, {
        method: "DELETE",
      });
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, deleteNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
