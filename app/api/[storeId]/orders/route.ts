import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// CORS headers configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Configure this based on your needs
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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

// POST Create Product with CORS
export async function POST(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    // Get the request body
    const body = await req.json();

    // Destructure and validate required fields
    const {
      name,
      description,
      price,
      categoryId,
      stock,
      image,
      discount,
      subcategories,
    } = body;

    // Validate required fields with proper error responses
    const validationErrors = [];
    if (!name) validationErrors.push("Name is required");
    if (!price) validationErrors.push("Price is required");
    if (!categoryId) validationErrors.push("Category ID is required");

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { errors: validationErrors },
        { status: 400, headers: corsHeaders }
      );
    }

    const subdata = await prisma.subcategory.findMany({
      include: {
        image: true,
      },
    });

    const addSubcategories = subcategories?.map(
      (subcategoryId: string) =>
        subdata.find((sub) => sub.id === subcategoryId) || {}
    );

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock: stock || 0,
        discount: discount || 0,
        categoryId,
        subcategories: addSubcategories,
      },
      include: {
        image: true,
        category: true,
      },
    });

    return NextResponse.json(
      { id: product.id },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("[PRODUCTS_POST]", error);
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: "A product with this name already exists" },
          { status: 409, headers: corsHeaders }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}