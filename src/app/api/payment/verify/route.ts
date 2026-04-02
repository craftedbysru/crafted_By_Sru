import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { verifyRazorpaySignature } from "@/lib/payment-utils";
import { razorpay } from "@/lib/razorpay";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderData // items, total, shippingAddress, etc.
    } = await request.json();

    // Fetch the order from Razorpay to verify the amount
    const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
    if (razorpayOrder.amount !== Math.round(orderData.total * 100)) {
      console.error("Amount mismatch:", razorpayOrder.amount, Math.round(orderData.total * 100));
      return new NextResponse("Amount mismatch", { status: 400 });
    }

    const isAuthentic = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      process.env.RAZORPAY_KEY_SECRET!
    );

    if (isAuthentic) {
      // Payment is verified, now create the order in the database
      const order = await prisma.order.create({
        data: {
          customerId: session.user?.id!,
          items: orderData.items,
          total: orderData.total,
          status: "Processing",
          paymentId: razorpay_payment_id,
          razorpayOrderId: razorpay_order_id,
          paymentStatus: "paid",
          shippingAddress: orderData.shippingAddress,
        },
      });

      return NextResponse.json({ success: true, orderId: order.id });
    } else {
      return new NextResponse("Invalid signature", { status: 400 });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return new NextResponse("Error verifying payment", { status: 500 });
  }
}
