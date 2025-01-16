"use client";

import { useEffect, useState, useTransition, useRef } from "react";
import { Bell, Loader2, Trash2 } from "lucide-react";
import { pusherClient } from "@/lib/pusher";
import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "@/actions/notifications";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import type { Notification } from "@prisma/client";
import { usePathname } from "next/navigation";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isClient, setIsClient] = useState(false);
  const pusherRef = useRef<any>(null);

  const pathname = usePathname();
  const storeId = pathname.split("/")[1];

  // Initialize audio
  useEffect(() => {
    setIsClient(true);
    const audio = new Audio("/notification-sound.wav");
    audio.preload = "auto";

    const handleCanPlayThrough = () => {
      setAudioLoaded(true);
      console.log("Notification sound loaded successfully");
    };

    const handleError = (e: Event) => {
      console.error("Error loading notification sound:", e);
      setAudioLoaded(false);
    };

    audio.addEventListener("canplaythrough", handleCanPlayThrough);
    audio.addEventListener("error", handleError);

    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener(
          "canplaythrough",
          handleCanPlayThrough
        );
        audioRef.current.removeEventListener("error", handleError);
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playNotificationSound = async () => {
    if (!audioRef.current || !audioLoaded) {
      console.log("Audio not ready:", {
        audioLoaded,
        hasAudio: !!audioRef.current,
      });
      return;
    }

    try {
      audioRef.current.currentTime = 0;
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Notification sound playback failed:", error);
          if (error.name === "NotAllowedError") {
            console.log("Sound playback requires user interaction first");
          }
        });
      }
    } catch (error) {
      console.error("Error playing notification sound:", error);
    }
  };

  const fetchNotifications = async () => {
    if (!storeId) return;

    try {
      const { notifications: fetchedNotifications } = await getNotifications(
        storeId
      );
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const handleMarkAsRead = (id: string) => {
    startTransition(async () => {
      try {
        const { notification } = await markNotificationAsRead(id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteNotification(id);
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      } catch (error) {
        console.error("Failed to delete notification:", error);
      }
    });
  };

  // Set up Pusher subscription
  useEffect(() => {
    if (!isClient || !storeId) return;

    // Initial fetch
    fetchNotifications();

    const channelName = `store-${storeId}`;

    // Clean up existing subscription if any
    if (pusherRef.current) {
      pusherRef.current.unbind_all();
      pusherClient.unsubscribe(channelName);
    }

    // Create new subscription
    const channel = pusherClient.subscribe(channelName);
    pusherRef.current = channel;

    // Debug log for subscription
    console.log(`Subscribed to Pusher channel: ${channelName}`);

    // Bind new notification event
    channel.bind("new-notification", (notification: Notification) => {
      console.log("Received new notification:", notification);
      setNotifications((prev) => {
        // Check if notification already exists
        const exists = prev.some((n) => n.id === notification.id);
        if (exists) {
          return prev;
        }
        return [notification, ...prev];
      });
      playNotificationSound();

      if (
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        new Notification("New Notification", {
          body: notification.message,
        });
      }
    });

    // Bind notification read event
    channel.bind("notification-read", (updatedNotification: Notification) => {
      console.log("Notification marked as read:", updatedNotification);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === updatedNotification.id
            ? { ...notification, read: true }
            : notification
        )
      );
    });
    
    // Request notification permission
    if (typeof window !== "undefined" && "Notification" in window) {
      Notification.requestPermission();
    }

    // Cleanup function
    return () => {
      console.log(`Unsubscribing from Pusher channel: ${channelName}`);
      if (pusherRef.current) {
        pusherRef.current.unbind_all();
        pusherClient.unsubscribe(channelName);
        pusherRef.current = null;
      }
    };
  }, [storeId, isClient]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            className="relative"
            variant="ghost"
            aria-label="Notifications"
            size="icon"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.play().catch((e) => {
                  console.log("Bell click sound test:", e.message);
                });
              }
            }}
          >
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#73549b] text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-80 bg-background rounded-lg shadow-lg border z-50"
          align="end"
          alignOffset={-20}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">
                Notifications
              </h3>
              {isPending && (
                <Loader2 className="h-4 w-4 animate-spin text-black" />
              )}
            </div>
            {notifications.length === 0 ? (
              <p className="text-black text-center py-4">No notifications</p>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg ${
                      notification.read ? "bg-gray-50" : "bg-blue-50"
                    } relative group`}
                  >
                    <div
                      className="cursor-pointer"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <p className="text-sm text-black pr-6">
                        {notification.message}
                      </p>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                      aria-label="Delete notification"
                    >
                      <Trash2 className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
