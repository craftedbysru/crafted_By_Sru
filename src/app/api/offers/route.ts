import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const offers = await prisma.offer.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(offers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth() as any;
    if (!session || (session.user.role !== "admin" && session.user.role !== "merchant")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, discount } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const offer = await prisma.offer.create({
      data: {
        name,
        description,
        discount: discount ? parseFloat(discount) : null
      }
    });

    return NextResponse.json(offer);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Offer name already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create offer" }, { status: 500 });
  }
}
