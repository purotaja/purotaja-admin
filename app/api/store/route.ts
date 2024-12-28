import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const stores = await prisma.store.findMany();

    return NextResponse.json({ stores: stores });
  } catch (err) {
    console.error(err);
    return NextResponse.json(err);
  }
}

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const store = await prisma.store.create({
      data: data,
    });

    return NextResponse.json({ store: store });
  } catch (err) {
    console.error(err);
    return NextResponse.json(err);
  }
}
