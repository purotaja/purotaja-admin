import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const reviews = await prisma.review.findMany({
      include: { product: true, client: true },
    });

    const modifiedData = reviews.map((review) => {
      return {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        product: review.product?.name,
        client: review.client?.email,
      };
    });

    return NextResponse.json({ reviews: modifiedData });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
