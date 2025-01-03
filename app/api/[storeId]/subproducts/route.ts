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
    const subproducts = await prisma.subproduct.findMany({
      include: {
        image: true,
      },
    });

    return NextResponse.json(subproducts, { headers: corsHeaders });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { name, stock, productId, image } = await req.json();

  if (!name) {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400, headers: corsHeaders }
    );
  }

  if (!stock) {
    return NextResponse.json(
      { error: "Stock is required" },
      { status: 400, headers: corsHeaders }
    );
  }

  if (!productId) {
    return NextResponse.json(
      { error: "Product Id is required" },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const subproduct = await prisma.subproduct.create({
      data: {
        name,
        stock,
        product: {
          connect: {
            id: productId,
          },
        },
      },
    });

    const images = image.url
      ? await prisma.image.create({
          data: {
            url: image.url,
            key: image.key,
            subproduct: {
              connect: {
                id: subproduct.id,
              },
            },
          },
        })
      : null;

    if (subproduct && images) {
      return NextResponse.json(subproduct, {
        status: 201,
        headers: corsHeaders,
      });
    }

    return NextResponse.json(
      { error: "Subproduct not created" },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
