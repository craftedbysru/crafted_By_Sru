import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const address = await prisma.address.findUnique({
      where: { id },
    });

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email as string },
    });

    if (address.userId !== user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.address.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Address deleted" });
  } catch (error) {
    console.error("Failed to delete address:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
