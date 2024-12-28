import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PATCH, DELETE, OPTIONS",
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
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        category: true,
        image: true,
      },
    });

    if (!product) {
      return corsResponse(
        NextResponse.json({ error: "Product not found" }, { status: 404 })
      );
    }

    const afterDiscount = {
      ...product,
      discounted_price: product.discount
        ? product.price - (product.price * product.discount) / 100
        : product.price,
    };

    return corsResponse(NextResponse.json({ product: afterDiscount }));
  } catch (error) {
    console.error("[PRODUCT_GET]", error);
    return corsResponse(
      NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const body = await req.json();

    const {
      name,
      description,
      discount,
      price,
      stock,
      categoryId,
      subcategories,
      image,
    } = body;

    const existingProduct = await prisma.product.findUnique({
      where: {
        id: params.productId,
      },
    });

    if (!existingProduct) {
      return corsResponse(
        NextResponse.json({ error: "Product not found" }, { status: 404 })
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

    const product = await prisma.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        description,
        price,
        stock,
        categoryId,
        discount,
        subcategories: addSubcategories,
        image: image && {
          deleteMany: {},
          createMany: {
            data: image.map((image: { url: string; key: string }) => image),
          },
        },
      },
      include: {
        image: true,
        category: true,
      },
    });

    return corsResponse(NextResponse.json({ product: product }));
  } catch (error) {
    console.error("[PRODUCT_PATCH]", error);
    return corsResponse(
      NextResponse.json({ error: "Failed to update product" }, { status: 500 })
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const existingProduct = await prisma.product.findUnique({
      where: {
        id: params.productId,
      },
    });

    if (!existingProduct) {
      return corsResponse(
        NextResponse.json({ error: "Product not found" }, { status: 404 })
      );
    }

    const product = await prisma.product.delete({
      where: {
        id: params.productId,
      },
    });

    return corsResponse(NextResponse.json({ product: product }));
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return corsResponse(
      NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
    );
  }
}
