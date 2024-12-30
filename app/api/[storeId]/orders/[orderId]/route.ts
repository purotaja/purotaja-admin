import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// OPTIONS handler for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET Individual Order
export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    if (!params.orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const order = await prisma.orders.findUnique({
      where: {
        id: params.orderId,
      },
      include: {
        address: true,
        client: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(order, { headers: corsHeaders });
  } catch (error) {
    console.error("[ORDER_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// PATCH Update Order
export async function PATCH(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    if (!params.orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const body = await req.json();
    const {
      status,
      addressId,
    } = body;

    // Check if order exists
    const existingOrder = await prisma.orders.findUnique({
      where: {
        id: params.orderId,
      },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Update order
    const updatedOrder = await prisma.orders.update({
      where: {
        id: params.orderId,
      },
      data: {
        status: status,
        addressId: addressId,
      },
      include: {
        address: true,
        client: true,
      },
    });

    return NextResponse.json(updatedOrder, { headers: corsHeaders });
  } catch (error) {
    console.error("[ORDER_PATCH]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE Order
export async function DELETE(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    if (!params.orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if order exists
    const existingOrder = await prisma.orders.findUnique({
      where: {
        id: params.orderId,
      },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Delete the order
    await prisma.orders.delete({
      where: {
        id: params.orderId,
      },
    });

    return NextResponse.json(
      { message: "Order deleted successfully" },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("[ORDER_DELETE]", error);

    if (error instanceof Error) {
      // Handle specific Prisma errors
      if (error.message.includes("foreign key constraint")) {
        return NextResponse.json(
          { error: "Cannot delete order due to related records" },
          { status: 400, headers: corsHeaders }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
