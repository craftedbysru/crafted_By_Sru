import { NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { auth } from "@/auth";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { amount, currency = "INR" } = await request.json();

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
