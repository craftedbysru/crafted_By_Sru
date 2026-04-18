import { NextResponse } from "next/server";
import * as inventoryService from "@/services/inventoryService";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = await inventoryService.getProductById(id);
  if (item) return NextResponse.json(item);
  return new NextResponse("Not found", { status: 404 });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || ((session.user as any).role !== "merchant" && (session.user as any).role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const userId = (session.user as any).id;
    
    // Clean up body to only include fields allowed by Prisma for update
    const { id: _, categoryRel: __, createdAt: ___, updatedAt: ____, ...updates } = body;
    
    // Use RLS-aware client
    const rlsClient = prisma.$withUser(userId);
    
    const updated = await rlsClient.product.update({
      where: { id },
      data: updates as any,
    });
    
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Failed to update product:", error);
    return NextResponse.json({ error: "Failed to update product", details: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || ((session.user as any).role !== "merchant" && (session.user as any).role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const userId = (session.user as any).id;
    
    // Use RLS-aware client
    const rlsClient = prisma.$withUser(userId);
    
    await rlsClient.product.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete product:", error);
    return NextResponse.json({ error: "Failed to delete product", details: error.message }, { status: 500 });
  }
}
