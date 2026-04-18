import { NextResponse } from "next/server";
import { getRazorpay } from "@/lib/razorpay";
import { auth } from "@/auth";
import { z } from "zod";

const createOrderSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().default("INR"),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { amount, currency } = createOrderSchema.parse(body);
    const razorpay = getRazorpay();

    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit (paise for INR)
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return new NextResponse("Error creating order", { status: 500 });
  }
}
