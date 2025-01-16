import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const store = await prisma.store.findUnique({
      where: { value: params.storeId },
    });

    if (!store) {
      return NextResponse.json(
        { error: "Store not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    const notifications = await prisma.notification.findMany({
      where: { storeId: store.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      { notifications },
      { headers: corsHeaders, status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { message } = await req.json();

  try {
    const store = await prisma.store.findUnique({
      where: { value: params.storeId },
    });

    if (!store) {
      return NextResponse.json(
        { error: "Store not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    const notification = await prisma.notification.create({
      data: {
        storeId: store.id,
        message: message,
      },
    });
    
    return NextResponse.json(
      { notification },
      { headers: corsHeaders, status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500, headers: corsHeaders }
    );
  }
}
