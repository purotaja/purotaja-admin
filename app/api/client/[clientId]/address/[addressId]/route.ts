import { prisma } from "@/lib/prisma";
import { Address, LabelType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

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

export async function POST(
  request: NextRequest,
  { params }: { params: { clientId: string; addressId: string } }
) {
  try {
    const data = await request.json();

    const addresses = await prisma.address.findUnique({
      where: {
        id: params.addressId,
      },
    });

    if (!addresses) {
      return corsResponse(
        NextResponse.json(
          { message: "Address not found", success: false },
          { status: 404 }
        )
      );
    }

    const address = await prisma.address.update({
      where: {
        id: params.addressId,
      },
      data: {
        ...data,
        label: data.label as LabelType,
        isDefault:
          data.isDefault || (data.label as LabelType) === "HOME" ? true : false,
        clientId: params.clientId,
      },
    });

    if (!address) {
      return corsResponse(
        NextResponse.json(
          { message: "Address not updated", success: false },
          { status: 404 }
        )
      );
    }

    return corsResponse(
      NextResponse.json({ message: "Address updated", success: true })
    );
  } catch (error) {
    return corsResponse(
      NextResponse.json(
        { message: "Error updating address", success: false },
        { status: 500 }
      )
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { clientId: string; addressId: string } }
) {
  try {
    const address = await prisma.address.findUnique({
      where: {
        id: params.addressId,
      },
    });

    if (!address) {
      return corsResponse(
        NextResponse.json(
          { message: "Address not found", success: false },
          { status: 404 }
        )
      );
    }

    await prisma.address.delete({
      where: {
        id: params.addressId,
      },
    });

    return corsResponse(
      NextResponse.json({ message: "Deleted address", success: true })
    );
  } catch (error) {
    return corsResponse(
      NextResponse.json(
        { message: "Error updating address", success: false },
        { status: 500 }
      )
    );
  }
}
