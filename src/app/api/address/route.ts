import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const addressSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  phone: z.string().min(10, "Valid phone number is required").max(15).regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),
  street: z.string().min(1, "Street is required").max(200),
  street2: z.string().max(200).optional().or(z.literal("")),
  street3: z.string().max(200).optional().or(z.literal("")),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().min(1, "State is required").max(100),
  zipCode: z.string().length(6, "Pincode must be exactly 6 digits").regex(/^\d+$/, "Pincode must be numeric"),
  country: z.string().min(1, "Country is required").max(100),
});

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = (session.user as any)?.id;
    // Use the RLS-aware client extension
    const rlsClient = prisma.$withUser(userId);

    const user = await rlsClient.user.findUnique({
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
    const body = await req.json();
    const userId = (session.user as any)?.id;
    
    // Auto-populate name and phone from session/user if missing and user didn't provide them (since we might remove them from UI)
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const validatedData = addressSchema.parse({
      ...body,
      name: body.name || user.name || "Customer",
      phone: body.phone || user.phone || "9999999999" // Fallback but usually user has phone from login
    });
    
    // Use the RLS-aware client extension
    const rlsClient = prisma.$withUser(userId);
    
    const newAddress = await rlsClient.address.create({
      data: {
        ...validatedData,
        userId: user.id,
      },
    });

    return NextResponse.json(newAddress);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Failed to create address:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
