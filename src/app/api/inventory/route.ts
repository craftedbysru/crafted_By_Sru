import { NextResponse } from "next/server";
import * as inventoryService from "@/services/inventoryService";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().min(1, "Description is required").max(1000),
  price: z.union([z.string(), z.number()]).transform((val) => {
    const n = Number(val);
    return isNaN(n) ? 0 : n;
  }),
  sku: z.string().optional(),
  category: z.string().optional(),
  categoryId: z.string().optional(),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
  images: z.array(z.string().url()).optional().default([]),
  videoUrl: z.string().url("Invalid video URL").optional().or(z.literal("")),
  stock: z.union([z.string(), z.number()]).transform((val) => {
    const n = Math.floor(Number(val));
    return isNaN(n) ? 10 : n;
  }).optional().default(10),
  isBestSeller: z.boolean().optional().default(false),
  productData: z.string().optional().default(""),
  offerId: z.string().optional().nullable(),
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

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bestSeller = searchParams.get("bestSeller") === "true";
    const hasOffer = searchParams.get("hasOffer") === "true";
    const offerIdParam = searchParams.get("offerId");
    const limitStr = searchParams.get("limit");
    const limit = limitStr ? parseInt(limitStr) : undefined;
    const sort = searchParams.get("sort") === "desc" ? { createdAt: "desc" as const } : undefined;
    const search = searchParams.get("search");
    const categoryIdRaw = searchParams.get("categoryId") || searchParams.get("category");
    const categoryId = (categoryIdRaw === "null" || categoryIdRaw === "undefined" || !categoryIdRaw) ? null : categoryIdRaw;
    
    // Safety check for NaN limit
    const validatedLimit = (limit !== undefined && !isNaN(limit)) ? limit : undefined;
    
    console.log(`Inventory GET: bestSeller=${bestSeller}, limit=${validatedLimit}, sort=${!!sort}, search=${search}, categoryId=${categoryId}, hasOffer=${hasOffer}, offerId=${offerIdParam}`);
    
    const filter: any = {};
    if (bestSeller) filter.isBestSeller = true;
    if (hasOffer) filter.offerId = { not: null };
    if (offerIdParam) filter.offerId = offerIdParam;
    if (categoryId && categoryId !== "all" && categoryId !== "All") {
      filter.OR = [
        { categoryId: categoryId },
        { category: { contains: categoryId, mode: 'insensitive' } }
      ];
    }
    if (search) {
      filter.OR = [
        ...(filter.OR || []),
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    const options = { take: validatedLimit, orderBy: sort };
    const inventory = await inventoryService.getInventory(filter, options);
    
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
