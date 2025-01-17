import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const store = await prisma.store.findUnique({
      where: { value: params.storeId },
    });

    if (!store) {
      return NextResponse.json({ message: "Store not found" });
    }

    const notifications = await prisma.notification.findMany({
      where: {
        storeId: store.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ message: "Error fetching notifications" });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { message } = await req.json();

    const store = await prisma.store.findUnique({
      where: { value: params.storeId },
    });

    if (!store) {
      return NextResponse.json({ message: "Store not found" });
    }

    const notification = await prisma.notification.create({
      data: {
        message: message,
        storeId: store?.id,
      },
    });

    await pusher.trigger(`user-${store.id}`, "notification", notification);

    return NextResponse.json(notification);
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json({ message: "Error creating notification" });
  }
}
