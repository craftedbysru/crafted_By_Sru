import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email-server";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Find all verification tokens matching the pattern for this email
    const pendingTokens = await prisma.verificationToken.findMany({
      where: {
        identifier: {
          startsWith: `otp_signup:${email}:`
        }
      }
    });

    // Find a valid unexpired token that has match on OTP token code
    const validToken = pendingTokens.find(
      (t) => t.token === otp.trim() && t.expires > new Date()
    );

    if (!validToken) {
      return NextResponse.json(
        { error: "Invalid or expired OTP. Please check your email or try registering again." },
        { status: 400 }
      );
    }

    // Deconstruct from base64 suffix
    const parts = validToken.identifier.split(":");
    const base64Data = parts[parts.length - 1];
    
    if (!base64Data) {
      return NextResponse.json(
        { error: "Malformed verification token payload. Please register again." },
        { status: 400 }
      );
    }

    const userJsonStr = Buffer.from(base64Data, "base64").toString("utf-8");
    const { name, email: userEmail, password, firstName, lastName, phone } = JSON.parse(userJsonStr);

    // Double-check user existence to avoid race conditions
    const existingUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already registered" },
        { status: 400 }
      );
    }

    // Create the authentic User from the verified payload
    const user = await prisma.user.create({
      data: {
        name,
        firstName,
        lastName,
        phone,
        email: userEmail,
        password, // Already securely hashed in the send-otp stage
        role: "customer", // Standard consumer role
        emailVerified: new Date(),
      },
    });

    // Clear verification tokens for this email
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: {
          startsWith: `otp_signup:${userEmail}:`
        }
      }
    });

    // Send dynamic welcome email (now that user verified credibility)
    try {
      await sendWelcomeEmail(userEmail, name);
    } catch (e) {
      console.error("Failed to send welcome email:", e);
    }

    return NextResponse.json(
      { success: true, message: "Email verified successfully!", user: { id: user.id, email: user.email, name: user.name } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
