import { prisma } from "@/lib/prisma";
import { UserType } from "@prisma/client";
import { NextResponse } from "next/server";

export interface UserDataType {
    email: string;
    name: string;
    clerkId: string;
    role: UserType;
}

interface ParamsType {
    params: {
        userId: string;
    }
}

export async function GET(req: Request, { params }: ParamsType) {
    try {
        const user = await prisma.user.findUnique({
            where: { clerkId: params.userId }
        });

        return NextResponse.json({ user: user })
    } catch (err) {
        console.error(err);
        return NextResponse.json(err)
    }
}

export async function PATCH(req: Request, { params }: ParamsType) {
    try {
        const role = await req.json();

        const user = await prisma.user.update({
            where: { id: params.userId },
            data: {
                role: role
            }
        });

        return NextResponse.json({ user: user })
    } catch (err) {
        console.error(err);
        return NextResponse.json(err)
    }
}

export async function DELETE(req: Request, { params }: ParamsType) {
    try {
        const user = await prisma.user.delete({
            where: { id: params.userId }
        });

        return NextResponse.json({ user: user })
    } catch (err) {
        console.error(err);
        return NextResponse.json(err)
    }
}