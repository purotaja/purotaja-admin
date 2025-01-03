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
  { params }: { params: { storeId: string; subproductId: string } }
) {
  try {
    const subproduct = await prisma.subproduct.findUnique({
      where: {
        id: params.subproductId,
      },
      include: {
        image: true,
      },
    });

    return NextResponse.json(subproduct, { headers: corsHeaders });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; subproductId: string } }
) {
  const { name, stock, productId, image } = await req.json();

  try {
    const subproduct = await prisma.subproduct.findUnique({
      where: {
        id: params.subproductId,
      },
      include: {
        image: true,
      },
    });

    if (!subproduct) {
      return NextResponse.json(
        { error: "Subproduct not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    const updatedSubproduct = await prisma.subproduct.update({
      where: {
        id: params.subproductId,
      },
      data: {
        name,
        stock,
        productId,
        image: image && {
          deleteMany: {},
          createMany: {
            data: image.map((image: { url: string; key: string }) => image),
          },
        },
      },
      include: {
        image: true,
      },
    });

    return NextResponse.json(
      { subproduct: updatedSubproduct },
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

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; subproductId: string } }
) {
  try {
    const subproduct = await prisma.subproduct.findUnique({
      where: {
        id: params.subproductId,
      },
    });

    if (!subproduct) {
      return NextResponse.json(
        { error: "Subproduct not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    await prisma.subproduct.delete({
      where: {
        id: params.subproductId,
      },
    });

    return NextResponse.json({}, { headers: corsHeaders });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
