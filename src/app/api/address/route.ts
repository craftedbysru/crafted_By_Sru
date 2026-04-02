import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
      include: { addresses: true },
    });

    return NextResponse.json(user?.addresses || []);
  } catch (error) {
    console.error("Failed to fetch addresses:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { street, city, state, zipCode, country } = await req.json();
    
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newAddress = await prisma.address.create({
      data: {
        street,
        city,
        state,
        zipCode,
        country,
        userId: user.id,
      },
    });

    return NextResponse.json(newAddress);
  } catch (error) {
    console.error("Failed to create address:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
