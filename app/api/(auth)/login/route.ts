import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { storeOtp } from "@/lib/server/otp-service";
import { SendOtp } from "@/lib/server/send-otp";
import jwt from "jsonwebtoken";

interface LoginCredentials {
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
        { message: "Origin not allowed", success: false },
        {
          status: 403,
          headers: {
            "Access-Control-Allow-Origin": allowedOrigin,
          },
        }
      );
    }

    const body: LoginCredentials = await req.json();

    if (!body.phone) {
      return NextResponse.json(
        { message: "Missing required field: phone", success: false },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const client = await prisma.client.findUnique({
      where: { phone: body.phone },
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

      if (isSent) {
        const token = jwt.sign(
          { clientId: client.id },
          process.env.JWTSECRET as string,
          {
            expiresIn: "30d",
          }
        );

        return NextResponse.json(
          { success: true, token: token, message: "OTP sent to your email" },
          {
            status: 200,
            headers: corsHeaders,
          }
        );
      }
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
