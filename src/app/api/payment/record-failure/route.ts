import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const recordFailureSchema = z.object({
  orderId: z.string().min(1),
  errorDetails: z.any().optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await request.json();
    const { orderId, errorDetails } = recordFailureSchema.parse(body);
    const userId = session.user?.id!;

    const rlsClient = prisma.$withUser(userId);

    // Update order and create a failed transaction record
    await rlsClient.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { 
          paymentStatus: "failed",
          status: "FAILED" 
        },
      });

      await tx.transaction.create({
        data: {
          orderId,
          amount: 0, // No payment made
          status: "failed",
          provider: "razorpay",
          errorDetails: JSON.stringify(errorDetails),
          metadata: {
            userAgent: request.headers.get("user-agent"),
            ip: request.headers.get("x-forwarded-for"),
          }
        }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error recording payment failure:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
