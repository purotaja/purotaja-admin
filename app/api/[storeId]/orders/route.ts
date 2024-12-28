import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET Orders
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
    
    return NextResponse.json({
      orders: completePropuctOrder,
    });
  } catch (error) {
    console.error("[ORDERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// POST Create Product
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

    // Validate required fields
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
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

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
