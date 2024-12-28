import { CategorySchema } from "@/app/(dashboard)/_components/categories/CategoryForm";
import { SubcategorySchema } from "@/app/(dashboard)/_components/subcategories/SubcategoryForm";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

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
    const subcategories = await prisma.subcategory.findMany({
      include: {
        image: true,
      },
    });

    return corsResponse(
      NextResponse.json({ subcategories: subcategories }, { status: 200 })
    );
  } catch (error) {
    return corsResponse(
      NextResponse.json(
        { error: "Failed to fetch subcategories" },
        { status: 500 }
      )
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body: z.infer<typeof SubcategorySchema> = await req.json();

    const subcategory = await prisma.subcategory.create({
      data: {
        name: body.name,
      },
    });

    const image = body.image.url
      ? await prisma.image.create({
          data: {
            url: body.image.url,
            key: body.image.key,
            category: {
              connect: {
                id: subcategory.id,
              },
            },
          },
        })
      : null;

    if (subcategory && image) {
      return corsResponse(
        NextResponse.json({ subcategory: subcategory }, { status: 200 })
      );
    }

    return corsResponse(
      NextResponse.json({ error: "Subcategory not created" }, { status: 400 })
    );
  } catch (error) {
    console.log(error);
    return corsResponse(
      NextResponse.json(
        { error: "Failed to create subcategory" },
        { status: 500 }
      )
    );
  }
}
