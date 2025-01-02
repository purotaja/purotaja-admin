import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        image: true,
      },
    });

    // const afterDiscount = products.map((product) => ({
    //   ...product,
    //   discounted_price: product.discount
    //     ? product.price - (product.price * product.discount) / 100
    //     : product.price,
    // }));

    return corsResponse(
      NextResponse.json({
        products: products,
      })
    );
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return corsResponse(
      NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.json();

    if (!body.name) {
      return corsResponse(
        NextResponse.json({ error: "Name is required" }, { status: 400 })
      );
    }

    if (!body.categoryId) {
      return corsResponse(
        NextResponse.json({ error: "Category ID is required" }, { status: 400 })
      );
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        categoryId: body.categoryId,
      },
      include: {
        category: true,
        image: true,
      },
    });

    if (body.image && Array.isArray(body.image)) {
      await Promise.all(
        body.image
          .filter((img: { url: string; key: string }) => img.url && img.key)
          .map(async (img: { url: string; key: string }) => {
            await prisma.image.create({
              data: {
                url: img.url,
                key: img.key,
                productId: product.id,
              },
            });
          })
      );
    }

    return corsResponse(
      NextResponse.json({ product: product }, { status: 200 })
    );
  } catch (error) {
    console.error("[PRODUCTS_POST]", error);
    return corsResponse(
      NextResponse.json({ error: "Failed to create product" }, { status: 500 })
    );
  }
}
