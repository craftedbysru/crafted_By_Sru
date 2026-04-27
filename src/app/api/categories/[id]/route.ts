import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session || ((session.user as any).role !== "merchant" && (session.user as any).role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name } = await request.json();
    const category = await prisma.category.update({
      where: { id },
      data: { name },
    });

    // Update the 'category' string field in products for backward compatibility
    await prisma.product.updateMany({
      where: { categoryId: id },
      data: { category: name },
    });

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update category" }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session || ((session.user as any).role !== "merchant" && (session.user as any).role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // When a category is deleted, products' categoryId will be set to null due to onDelete: SetNull in schema
    // But we also want to clear the 'category' string field or set it to "No Category"
    await prisma.product.updateMany({
      where: { categoryId: id },
      data: { category: null },
    });

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 400 });
  }
}
