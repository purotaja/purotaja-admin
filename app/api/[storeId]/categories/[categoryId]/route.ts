import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

function corsResponse(response: NextResponse) {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

export async function OPTIONS() {
  return corsResponse(
    new NextResponse(null, {
      status: 204,
    })
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const data = await prisma.category.findUnique({
      where: {
        id: params.categoryId,
      },
      include: {
        image: true,
        product: true,
      },
    });

    if (!data) {
      return corsResponse(
        NextResponse.json({ message: "Category not found" }, { status: 404 })
      );
    }

    const products = await prisma.product.findMany({
      where: {
        categoryId: params.categoryId,
      },
      include: {
        image: true,
      },
    });

    data.product = products;

    return corsResponse(NextResponse.json({ category: data }, { status: 200 }));
  } catch (error) {
    return corsResponse(
      NextResponse.json({ message: "Error fetching category" }, { status: 500 })
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const data = await request.json();

    const category = await prisma.category.update({
      where: {
        id: params.categoryId,
      },
      data: {
        name: data.name,
      },
    });

    const image = await prisma.image.update({
      where: { id: data.imageId },
      data: {
        url: data.image.url,
        key: data.image.key,
      },
    });

    if (!category) {
      return corsResponse(
        NextResponse.json({ message: "Category not found" }, { status: 404 })
      );
    }

    return corsResponse(NextResponse.json({ category: category }));
  } catch (error) {
    return corsResponse(
      NextResponse.json({ message: "Error updating category" }, { status: 500 })
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const category = await prisma.category.delete({
      where: {
        id: params.categoryId,
      },
    });

    if (!category) {
      return corsResponse(
        NextResponse.json({ message: "Category not deleted" }, { status: 404 })
      );
    }

    return corsResponse(
      NextResponse.json({ messgae: "Category deleted" }, { status: 200 })
    );
  } catch (error) {
    console.log("Error: ", error);
    return corsResponse(
      NextResponse.json({ message: "Error deleting category" }, { status: 500 })
    );
  }
}
