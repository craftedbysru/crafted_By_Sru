import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendOtpEmail } from "@/lib/email-server";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, firstName, lastName, phone } = signupSchema.parse(body);

    // Check if user already exists or is the master email
    if (email === "merchant@nexus.shop") {
      return NextResponse.json(
        { error: "This email is reserved" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare credentials payload to secure inside VerificationToken
    const payload = Buffer.from(
      JSON.stringify({ name, email, password: hashedPassword, firstName, lastName, phone })
    ).toString("base64");

    const identifier = `otp_signup:${email}:${payload}`;

    // Cryptographical random-like 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Clear previous pending verification tokens for this email to avoid stale entries
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: {
          startsWith: `otp_signup:${email}:`
        }
      }
    });

    // Create verification token
    await prisma.verificationToken.create({
      data: {
        identifier,
        token: otp,
        expires: new Date(Date.now() + 10 * 60 * 1000), // Valid for 10 minutes
      },
    });

    // Send the Verification OTP email
    console.log(`[SIGNUP] Sending OTP ${otp} to ${email}`);
    await sendOtpEmail(email, otp);

    return NextResponse.json(
      { success: true, otpRequired: true, email, message: "Verification OTP sent to your email." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    if (error instanceof z.ZodError) {
      const issues = (error as any).issues || (error as any).errors || [];
      return NextResponse.json(
        { error: issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
