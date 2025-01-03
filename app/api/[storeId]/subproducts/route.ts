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
        review: true,
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
  const {
    name,
    stock,
    perunitprice,
    prices,
    discount,
    productId,
    image,
    inStock,
    featured,
  } = await req.json();

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

  if (!perunitprice) {
    return NextResponse.json(
      { error: "Price is required" },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const calculatedPrices = prices.map((price: string) => {
      const basePrice = parseFloat(price) * parseFloat(perunitprice);
      const finalPrice = discount
        ? basePrice - basePrice * (parseFloat(discount) / 100)
        : basePrice;

      if (price.includes("2.5")) {
        return {
          value: price,
          label: "250 grams",
          price: finalPrice.toFixed(2),
        };
      } else if (price.includes("5")) {
        return {
          value: price,
          label: "500 grams",
          price: finalPrice.toFixed(2),
        };
      } else if (price.includes("1")) {
        return {
          value: price,
          label: "100 grams",
          price: finalPrice.toFixed(2),
        };
      }
    });

    const subproduct = await prisma.subproduct.create({
      data: {
        name,
        stock: parseInt(stock),
        perunitprice: parseFloat(perunitprice),
        prices: calculatedPrices,
        inStock,
        featured,
        discount: parseFloat(discount),
        product: {
          connect: {
            id: productId,
          },
        },
        image: image && {
          createMany: {
            data: image,
          },
        },
      },
    });

    if (subproduct) {
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
