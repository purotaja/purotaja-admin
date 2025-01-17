import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string; notificationId: string } }
) {
  try {
    const store = await prisma.store.findUnique({
      where: { value: params.storeId },
    });

    if (!store) {
      return NextResponse.json({ message: "Store not found" });
    }

    const notification = await prisma.notification.update({
      where: { id: params.notificationId },
      data: {
        read: true,
      },
    });
    
    return NextResponse.json(notification);
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json({ message: "Error creating notification" });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; notificationId: string } }
) {
  try {
    const store = await prisma.store.findUnique({
      where: { value: params.storeId },
      include: { notification: true },
    });
    
    if (!store) {
      return NextResponse.json({ message: "Store not found" });
    }

    const ntid = store.notification.find(
      (n) => n.id === params.notificationId
    )?.id;

    await prisma.notification.delete({
      where: { id: ntid! },
    });

    return NextResponse.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json({ message: "Error deleting notification" });
  }
}
