import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { withDbRetry } from "@/lib/db-retry";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("Categories GET request received");

    const categoriesData = await withDbRetry(() => prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        products: {
          take: 1,
          select: {
            imageUrl: true,
            images: true,
          }
        }
      }
    }));

    const categories = categoriesData as any[];

    // Format categories to include an 'image' field for convenience
    const formattedCategories = categories.map(cat => {
      // Use the fallback logic from products
      let image = null;
      const firstProduct = cat.products[0];
      if (firstProduct) {
        image = firstProduct.imageUrl || (Array.isArray(firstProduct.images) ? firstProduct.images[0] : null);
      }
      
      return {
        ...cat,
        image,
        products: undefined // Don't send the whole products array if not needed
      };
    });

    console.log(`Fetched ${formattedCategories.length} categories`);
    return NextResponse.json(formattedCategories);
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories", details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session || ((session.user as any).role !== "merchant" && (session.user as any).role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name } = await request.json();
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const userId = (session.user as any).id;
    // Use the RLS-aware client extension
    const rlsClient = prisma.$withUser(userId);

    const category = await rlsClient.category.create({
      data: { 
        name
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Category already exists or invalid data" }, { status: 400 });
  }
}
