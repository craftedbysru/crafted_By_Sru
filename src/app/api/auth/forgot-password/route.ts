import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email-server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "The provided email is not registered with us." }, { status: 404 });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpires,
      },
    });

    // Get dynamic origin from request URL/headers to guarantee working forgot password links under proxies
    const forwardedProto = req.headers.get("x-forwarded-proto") || "https";
    const forwardedHost = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const origin = forwardedProto && forwardedHost ? `${forwardedProto}://${forwardedHost}` : new URL(req.url).origin;

    // Send email with dynamic origin
    await sendPasswordResetEmail(email, resetToken, origin);

    return NextResponse.json({ message: "If an account exists with this email, a reset link has been sent." });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
