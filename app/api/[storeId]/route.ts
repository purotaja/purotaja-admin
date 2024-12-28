import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const store = await prisma.store.findUnique({
      where: {
        value: params.storeId,
      },
    });

    return NextResponse.json({ store: store });
  } catch (err) {
    console.error(err);
    return NextResponse.json(err);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const data = await req.json();

  try {
    const store = await prisma.store.update({
      where: {
        id: params.storeId,
      },
      data: data,
    });

    return NextResponse.json({ store: store });
  } catch (err) {
    console.error(err);
    return NextResponse.json(err);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const store = await prisma.store.delete({
      where: {
        id: params.storeId,
      },
    });

    return NextResponse.json({ store: store });
  } catch (err) {
    console.error(err);
    return NextResponse.json(err);
  }
}
