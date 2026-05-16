import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth() as any;
    if (!session || (session.user.role !== "admin" && session.user.role !== "merchant")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.offer.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Offer deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete offer" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth() as any;
    if (!session || (session.user.role !== "admin" && session.user.role !== "merchant")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { name, description, discount } = await req.json();

    const offer = await prisma.offer.update({
      where: { id },
      data: {
        name,
        description,
        discount: discount ? parseFloat(discount) : null
      }
    });

    return NextResponse.json(offer);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update offer" }, { status: 500 });
  }
}
