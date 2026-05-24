import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { getRazorpay } from "@/lib/razorpay";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userRole = (session.user as any)?.role;
  if (userRole !== "admin" && userRole !== "merchant") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { orderId, paymentId, amount } = await request.json();
    if (!orderId || !paymentId || !amount) {
      return new NextResponse("Missing required parameters: orderId, paymentId, or amount", { status: 400 });
    }

    const razorpay = getRazorpay();
    
    // Capture the payment on Razorpay (expects amount in paise)
    const paiseAmount = Math.round(amount * 100);
    const payment = await razorpay.payments.capture(paymentId, paiseAmount, "INR");

    // Update the Order status in the DB
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "paid"
      }
    });

    // Mark the transaction as active/success in the DB
    await prisma.transaction.updateMany({
      where: {
        orderId,
        providerPaymentId: paymentId
      },
      data: {
        status: "success",
        metadata: {
          capturedAt: new Date().toISOString(),
          razorpayResponse: payment
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: "Payment successfully captured.",
      payment
    });

  } catch (error: any) {
    console.error("Error capturing authorized payment:", error);
    return NextResponse.json({ error: error.message || "Failed to capture payment" }, { status: 500 });
  }
}
