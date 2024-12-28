import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/server/otp-service";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

interface VerificationCredentials {
  token: string;
  otp: string;
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

    const body: VerificationCredentials = await req.json();

    if (!body.otp) {
      return NextResponse.json(
        { message: "Missing required field: otp", success: false },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    if (!body.token) {
      return NextResponse.json(
        { message: "Missing required field: client id", success: false },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const decodedToken = jwt.verify(
      body.token,
      process.env.JWTSECRET as string
    ) as jwt.JwtPayload;

    const isVerified = await verifyOtp(decodedToken.clientId, body.otp);

    if (isVerified) {
      const client = await prisma.client.findUnique({
        where: { id: decodedToken.clientId },
      });

      await prisma.otp.deleteMany({
        where: { clientId: decodedToken.clientId },
      });
      
      return NextResponse.json(
        { client: client, success: true },
        {
          status: 200,
          headers: corsHeaders,
        }
      );
    }

    return NextResponse.json(
      { message: "User not verified", success: false },
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
