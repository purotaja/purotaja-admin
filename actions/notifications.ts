"use server";

import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";
import axios from "axios";
import { revalidatePath } from "next/cache";

export async function getNotifications(storeId: string) {
  if (!storeId) {
    throw new Error("Store ID is required");
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/${storeId}/notifications`;
    const data = await axios.get(url).then((res) => res.data);
    const notifications = data.notifications;
    
    console.log(notifications);
    return { notifications };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch notifications");
  }
}

export async function createNotification({
  storeId,
  message,
}: {
  storeId: string;
  message: string;
}) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/${storeId}/notifications`;
    const data = await axios.post(url, { message }).then((res) => res.data);
    const notification = data.notification;

    await pusher.trigger(`store-${storeId}`, "new-notification", notification);

    revalidatePath("/");
    return { notification };
  } catch (error: any) {
    console.log(error);
    throw new Error("Failed to create notification");
  }
}

export async function markNotificationAsRead(id: string) {
  try {
    const notification = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    await pusher.trigger(
      `store-${notification.storeId}`,
      "notification-read",
      notification
    );

    revalidatePath("/");
    return { notification };
  } catch (error) {
    throw new Error("Failed to mark notification as read");
  }
}

export async function deleteNotification(id: string) {
  try {
    const notification = await prisma.notification.delete({
      where: { id },
    });

    revalidatePath("/");
    return { notification };
  } catch (error) {
    throw new Error("Failed to delete notification");
  }
}
