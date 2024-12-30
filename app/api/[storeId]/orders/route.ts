import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod"; // For input validation

// Input validation schema
const ProductOrderSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  subtotal: z.number(),
  subcategory: z.string().nullable(),
});

const OrderInputSchema = z.object({
  orders: z.object({
    products: z.array(
      z.object({
        id: z.string(),
        subcategory: z.string(),
        quantity: z.string(),
      })
    ),
    userId: z.string(),
    addressId: z.string(),
  }),
});

// CORS headers configuration
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Configure this based on your needs
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET Orders with CORS
export async function GET(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    // Fetch Orders
    const orders = await prisma.orders.findMany({
      include: {
        address: true,
        client: true,
      },
    });

    const completePropuctOrder = orders.map((order) => ({
      ...order,
    }));

    return NextResponse.json(
      { orders: completePropuctOrder },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("[ORDERS_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = OrderInputSchema.parse(body);
    const { orders } = validatedData;

    // Fetch all products in one query
    const productIds = orders.products.map((product) => product.id);
    const productsFromDB = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select: {
        id: true,
        name: true,
        price: true,
      },
    });

    // Create a map for quick product lookup
    const productMap = new Map(
      productsFromDB.map((product) => [product.id, product])
    );

    // Calculate products with subtotals
    let totalAmount = 0;
    const enrichedProducts = orders.products.map((orderProduct) => {
      const product = productMap.get(orderProduct.id);
      if (!product) {
        throw new Error(`Product not found: ${orderProduct.id}`);
      }

      const quantity = parseInt(orderProduct.quantity);
      const subtotal = product.price * quantity;
      totalAmount += subtotal;

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        subtotal: subtotal,
        subcategory: orderProduct.subcategory || null,
      };
    });

    // Create the order with exact database structure
    const order = await prisma.orders.create({
      data: {
        amount: totalAmount.toString(),
        products: enrichedProducts,
        clientId: orders.userId,
        addressId: orders.addressId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: order,
      },
      {
        status: 201,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("Error creating order:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input data",
          details: error.errors,
        },
        { status: 400, headers: corsHeaders }
      );
    }

    if (error instanceof Error && error.message.includes("Product not found")) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create order",
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
