import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE({ params }: { params: { reviewId: string } }) {
  try {
    const reviews = await prisma.review.delete({
      where: {
        id: params.reviewId,
      },
    });

    if (!reviews) {
      return NextResponse.json({ error: "No reviews found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
