import { prisma } from "@/lib/prisma";
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

export async function GET(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  try {
    const users = await prisma.client.findUnique({
      where: {
        id: params.clientId,
      },
    });

    if (!users) {
      return corsResponse(
        NextResponse.json({ message: "User not found" }, { status: 404 })
      );
    }

    return corsResponse(NextResponse.json({ users }));
  } catch (error) {
    return corsResponse(
      NextResponse.json({ message: "Error fetching user" }, { status: 500 })
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  try {
    const data = await request.json();
    
    const users = await prisma.client.update({
      where: {
        id: params.clientId,
      },
      data,
    });
    
    if (!users) {
      return corsResponse(
        NextResponse.json({ message: "User not found" }, { status: 404 })
      );
    }

    return corsResponse(NextResponse.json({ users }));
  } catch (error) {
    return corsResponse(
      NextResponse.json({ message: "Error updating user" }, { status: 500 })
    );
  }
}
