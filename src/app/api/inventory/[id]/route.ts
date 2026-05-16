import { NextResponse } from "next/server";
import * as inventoryService from "@/services/inventoryService";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";
import { z } from "zod";

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
    const { id: _, categoryRel: __, offerRel: ___, createdAt: ____, updatedAt: _____, ...updates } = body;
    
    // Transform fields using a partial version of productSchema to ensure types are correct (Price, Stock, etc)
    const updateSchema = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      price: z.union([z.string(), z.number()]).transform((val) => {
        const n = Number(val);
        return isNaN(n) ? undefined : n;
      }).optional(),
      sku: z.string().optional(),
      category: z.string().optional(),
      categoryId: z.string().optional(),
      offerId: z.string().optional().nullable().transform(val => (val === "" || val === "none") ? null : val),
      imageUrl: z.string().optional(),
      images: z.array(z.string()).optional(),
      videoUrl: z.string().optional().nullable(),
      stock: z.union([z.string(), z.number()]).transform((val) => {
        const n = Math.floor(Number(val));
        return isNaN(n) ? undefined : n;
      }).optional(),
      isBestSeller: z.boolean().optional(),
      productData: z.string().optional(),
      originalPrice: z.union([z.string(), z.number()]).transform((val) => {
        if (val === "" || val === null) return null;
        const n = Number(val);
        return isNaN(n) ? null : n;
      }).optional().nullable(),
      discount: z.union([z.string(), z.number()]).transform((val) => {
        if (val === "" || val === null) return null;
        const n = Number(val);
        return isNaN(n) ? null : n;
      }).optional().nullable(),
    });

    const validatedUpdates = updateSchema.parse(updates);
    
    // Explicitly cast validatedUpdates to avoid any Prisma strictness issues with polymorphic types if they exist
    const finalData = { ...validatedUpdates };
    
    // Use RLS-aware client
    const rlsClient = prisma.$withUser(userId);
    
    const updated = await withDbRetry(() => rlsClient.product.update({
      where: { id },
      data: finalData as any,
    }));
    
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Failed to update product:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    }
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
    
    await withDbRetry(() => rlsClient.product.delete({
      where: { id },
    }));
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete product:", error);
    return NextResponse.json({ error: "Failed to delete product", details: error.message }, { status: 500 });
  }
}
