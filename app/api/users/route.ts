import { prisma } from "@/lib/prisma";
import { UserType } from "@prisma/client";
import { NextResponse } from "next/server";

export interface UserDataType {
  email: string;
  name: string;
  clerkId: string;
  role: UserType;
}

export async function GET(req: Request) {
  try {
    const users = await prisma.user.findMany();

    return NextResponse.json({ users: users });
  } catch (err) {
    console.error(err);
    return NextResponse.json(err);
  }
}

export async function POST(req: Request) {
  const data = await req.json();
  try {
    const user = await prisma.user.create({
      data: data,
    });
    
    return NextResponse.json({ user: user });
  } catch (err) {
    console.error(err);
    return NextResponse.json(err);
  }
}
