import { NextResponse } from "next/server";
import * as inventoryService from "@/services/inventoryService";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().min(1, "Description is required").max(1000),
  price: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  sku: z.string().optional(),
  category: z.string().optional(),
  categoryId: z.string().optional(),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
  images: z.array(z.string().url()).optional().default([]),
  videoUrl: z.string().url("Invalid video URL").optional().or(z.literal("")),
  stock: z.union([z.string(), z.number()]).transform((val) => Number(val)).optional().default(10),
  isBestSeller: z.boolean().optional().default(false),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bestSeller = searchParams.get("bestSeller") === "true";
    const limitStr = searchParams.get("limit");
    const limit = limitStr ? parseInt(limitStr) : undefined;
    const sort = searchParams.get("sort") === "desc" ? { createdAt: "desc" as const } : undefined;
    
    // Safety check for NaN limit
    const validatedLimit = (limit !== undefined && !isNaN(limit)) ? limit : undefined;
    
    console.log(`Inventory GET: bestSeller=${bestSeller}, limit=${validatedLimit}, sort=${!!sort}`);
    
    let inventory;
    const options = { take: validatedLimit, orderBy: sort };
    
    if (bestSeller) {
      inventory = await inventoryService.getInventory({ isBestSeller: true }, options);
    } else {
      inventory = await inventoryService.getInventory({}, options);
    }
    
    // Ensure inventory is an array
    if (!Array.isArray(inventory)) {
      throw new Error("Inventory service did not return an array");
    }
    
    return NextResponse.json(inventory);
  } catch (error: any) {
    console.error("CRITICAL: Inventory Fetch Failure:", {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    return NextResponse.json({ 
      error: "Failed to fetch inventory", 
      details: error.message,
      code: error.code
    }, { status: 500 });
  }
}

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
    const body = await request.json();
    const validatedData = productSchema.parse(body);
    
    const userId = (session.user as any).id;
    // Use the RLS-aware client extension to enforce DB-level session context
    const rlsClient = prisma.$withUser(userId);
    
    const newItem = await rlsClient.product.create({
      data: validatedData as any
    });
    
    console.log(`Product created successfully by user ${userId}`);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
