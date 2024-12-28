import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { storeOtp } from "@/lib/server/otp-service";
import { SendOtp } from "@/lib/server/send-otp";
import jwt from "jsonwebtoken";

interface RegisterCredentials {
  name: string;
  email: string;
  phone: string;
}

// CORS configuration
const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "*", // Specify your allowed origin or use '*' for all
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle OPTIONS preflight request
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(req: Request) {
  try {
    // Handle CORS for the POST request
    const origin = req.headers.get("origin") || "";
    const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";

    // Basic origin check
    if (allowedOrigin !== "*" && origin !== allowedOrigin) {
      return NextResponse.json(
        { error: "Origin not allowed", success: false },
        {
          status: 403,
          headers: {
            "Access-Control-Allow-Origin": allowedOrigin,
          },
        }
      );
    }

    const body: RegisterCredentials = await req.json();

    switch (true) {
      case !body.name:
        return NextResponse.json(
          { message: "Missing required field: name", success: false },
          {
            status: 400,
            headers: corsHeaders,
          }
        );
      case !body.email:
        return NextResponse.json(
          { message: "Missing required field: email", success: false },
          {
            status: 400,
            headers: corsHeaders,
          }
        );
      case !body.phone:
        return NextResponse.json(
          { message: "Missing required field: phone", success: false },
          {
            status: 400,
            headers: corsHeaders,
          }
        );
    }

    const fetchClient = await prisma.client.findUnique({
      where: { email: body.email },
    });

    if (fetchClient) {
      return NextResponse.json(
        { message: "Client already exists", success: false },
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    const client = await prisma.client.create({
      data: body,
    });

    if (client) {
      const { success, otp } = await storeOtp(client.id);

      if (!success || !otp) {
        return NextResponse.json(
          { message: "OTP not generated", success: false },
          {
            status: 500,
            headers: corsHeaders,
          }
        );
      }

      const isSent = await SendOtp(client.email, otp);

      if (!isSent) {
        return NextResponse.json(
          { message: "OTP not sent", success: false },
          {
            status: 500,
            headers: corsHeaders,
          }
        );
      }

      const secret = process.env.JWTSECRET as string;

      const token = jwt.sign({ clientId: client.id }, secret);

      return NextResponse.json(
        {
          message: "Client created successfully",
          token: token,
          success: true,
        },
        {
          status: 201,
          headers: corsHeaders,
        }
      );
    }

    return NextResponse.json(
      { message: "An error occurred", success: false },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "An error occurred", success: false },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
