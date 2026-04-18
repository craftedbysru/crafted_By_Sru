import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as any).role;
  if (role !== "merchant" && role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { pin } = await request.json();

    if (!pin) {
      return NextResponse.json({ error: "PIN is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { merchantPin: true }
    });

    if (!user || !user.merchantPin) {
      return NextResponse.json({ error: "Merchant security not configured" }, { status: 400 });
    }

    const isValid = await bcrypt.compare(pin, user.merchantPin);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid Security PIN" }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Merchant PIN Error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
