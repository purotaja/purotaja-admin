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

export async function POST(
  request: NextRequest,
  { params }: { params: { storeId: string; subcategoryId: string } }
) {
  try {
    const data = await request.json();

    const subcategory = await prisma.subcategory.update({
      where: {
        id: params.subcategoryId,
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

    if (!subcategory) {
      return corsResponse(
        NextResponse.json({ message: "Subcategory not found" }, { status: 404 })
      );
    }

    return corsResponse(NextResponse.json({ subcategory: subcategory }));
  } catch (error) {
    console.log(error);
    return corsResponse(
      NextResponse.json(
        { message: "Error updating subcategory" },
        { status: 500 }
      )
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { storeId: string; subcategoryId: string } }
) {
  try {
    const subcategory = await prisma.subcategory.delete({
      where: {
        id: params.subcategoryId,
      },
      include: {
        image: true,
      },
    });

    if (!subcategory) {
      return corsResponse(
        NextResponse.json(
          { message: "Subcategory not deleted" },
          { status: 404 }
        )
      );
    }
    
    return corsResponse(NextResponse.json({ messgae: "Subcategory deleted" }));
  } catch (error) {
    return corsResponse(
      NextResponse.json(
        { message: "Error deleting subcategory" },
        { status: 500 }
      )
    );
  }
}
