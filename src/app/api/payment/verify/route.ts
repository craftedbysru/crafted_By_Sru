import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { verifyRazorpaySignature } from "@/lib/payment-utils";
import { getRazorpay } from "@/lib/razorpay";
import { z } from "zod";
import { sendOrderConfirmationEmail } from "@/lib/email-server";

const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
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
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderData 
    } = verifyPaymentSchema.parse(body);

    const razorpay = getRazorpay();

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
      // Payment is verified, now create the order and update stock in a transaction
      const userId = session.user?.id!;
      const rlsClient = prisma.$withUser(userId);

      const result = await rlsClient.$transaction(async (tx) => {
        // 1. Check stock for all items
        for (const item of orderData.items) {
          const product = await tx.product.findUnique({
            where: { id: item.id }
          });
          
          if (!product || product.stock < item.quantity) {
            throw new Error(`Insufficient stock for product ${item.name}`);
          }
        }

        // 2. Decrement stock
        for (const item of orderData.items) {
          await tx.product.update({
            where: { id: item.id },
            data: { stock: { decrement: item.quantity } }
          });
        }

        // 3. Update the existing order and the associated transaction
        const order = await tx.order.update({
          where: { id: razorpayOrder.receipt as string },
          data: {
            status: "PROCESSING",
            paymentStatus: "paid",
          },
        });

        await tx.transaction.updateMany({
          where: { 
            orderId: razorpayOrder.receipt as string,
            providerOrderId: razorpay_order_id,
          },
          data: {
            status: "success",
            providerPaymentId: razorpay_payment_id,
            metadata: {
              razorpay_signature,
              userAgent: request.headers.get("user-agent"),
              ip: request.headers.get("x-forwarded-for"),
            }
          }
        });

        // 4. Auto-save phone and address to user profile if needed
        const user = await tx.user.findUnique({
          where: { id: userId },
          include: { addresses: true }
        });

        if (user) {
          const updates: any = {};
          if (!user.phone && orderData.shippingAddress.phone) {
            updates.phone = orderData.shippingAddress.phone;
          }

          if (Object.keys(updates).length > 0) {
            await tx.user.update({
              where: { id: userId },
              data: updates
            });
          }

          // Save address if user has none
          if (user.addresses.length === 0 && orderData.shippingAddress) {
            const addr = orderData.shippingAddress;
            await tx.address.create({
              data: {
                userId: userId,
                street: addr.street || addr.addressLine1 || "",
                street2: addr.street2 || addr.addressLine2 || null,
                street3: addr.street3 || null,
                city: addr.city || "",
                state: addr.state || "",
                zipCode: addr.postalCode || addr.zipCode || addr.pincode || "",
                country: addr.country || "India"
              }
            });
          }
        }

        return order;
      });

      // 5. Send confirmation email (outside transaction, non-blocking)
      sendOrderConfirmationEmail(
        orderData.shippingAddress.email || session.user?.email || "",
        result.id,
        result.total,
        orderData.items,
        orderData.shippingAddress,
        orderData.currency || "INR"
      ).catch(err => {
        console.error("Async confirmation email failed:", err);
      });

      return NextResponse.json({ success: true, orderId: result.id });
    } else {
      return new NextResponse("Invalid signature", { status: 400 });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return new NextResponse("Error verifying payment", { status: 500 });
  }
}
