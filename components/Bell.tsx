"use client";

import { useNotifications } from "./NotificationProvider";
import { Bell, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

export function NotificationBell() {
  const { unreadCount, notifications, markAsRead, deleteNotification } =
    useNotifications();

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="hover:bg-[#73549b]/15 p-2 rounded-full transition-colors duration-200">
            <Bell className="w-5 h-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="absolute -right-20 mt-6 w-80 bg-background rounded-lg shadow-lg border z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">
                Notifications
              </h3>
            </div>
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No notifications</p>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg ${
                      notification.read ? "bg-gray-50" : "bg-[#73549b]/15"
                    } relative group`}
                  >
                    <div
                      className="cursor-pointer"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <p className="text-sm text-black pr-6">
                        {notification.message}
                      </p>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                      aria-label="Delete notification"
                    >
                      <Trash2 className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#73549b] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {unreadCount}
        </span>
      )}
    </div>
  );
}
