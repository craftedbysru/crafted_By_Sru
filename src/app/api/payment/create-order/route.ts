import { NextResponse } from "next/server";
import { getRazorpay } from "@/lib/razorpay";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const createOrderSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().default("INR"),
  orderData: z.object({
    items: z.array(z.any()),
    total: z.number().positive(),
    currency: z.string().optional(),
    shippingAddress: z.any(),
    packagingDetails: z.string().optional(),
    deliveryType: z.string().optional(),
  }),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { amount, currency, orderData } = createOrderSchema.parse(body);
    const userId = session.user?.id!;
    const razorpay = getRazorpay();

    // 1. Create a PENDING order in DB first
    const rlsClient = prisma.$withUser(userId);
    const dbOrder = await rlsClient.order.create({
      data: {
        customerId: userId,
        items: orderData.items,
        total: orderData.total,
        currency: orderData.currency || "INR",
        status: "pending",
        paymentStatus: "unpaid",
        shippingAddress: orderData.shippingAddress,
        phone: orderData.shippingAddress.phone || null,
        packagingDetails: orderData.packagingDetails,
        deliveryType: orderData.deliveryType,
      },
    });

    // 2. Create Razorpay order
    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit (paise for INR)
      currency,
      receipt: dbOrder.id, // Linking DB order ID as receipt
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // 3. Save Razorpay Order ID to a pending transaction
    await rlsClient.transaction.create({
      data: {
        orderId: dbOrder.id,
        amount: orderData.total,
        currency: orderData.currency || "INR",
        status: "pending",
        provider: "razorpay",
        providerOrderId: razorpayOrder.id
      }
    });

    return NextResponse.json({ 
      razorpayOrder, 
      dbOrderId: dbOrder.id 
    });
  } catch (error) {
    console.error("Error creating order attempt:", error);
    return new NextResponse("Error creating order", { status: 500 });
  }
}
