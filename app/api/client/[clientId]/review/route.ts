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
  { params }: { params: { clientId: string } }
) {
  try {
    const review = await prisma.review.findMany({
      where: {
        clientId: params.clientId,
      },
    });

    return NextResponse.json(review, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500, headers: corsHeaders });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { clientId: string } }
) {
  try {
    const data = await req.json();
    const review = await prisma.review.create({
      data: {
        ...data,
        clientId: params.clientId,
      },
    });

    return NextResponse.json(review, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500, headers: corsHeaders });
  }
}
