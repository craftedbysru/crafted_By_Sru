import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { getRazorpay } from "@/lib/razorpay";
import { sendOrderConfirmationEmail } from "@/lib/email-server";

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { orderId } = await request.json();
    if (!orderId) {
      return new NextResponse("Order ID is required", { status: 400 });
    }

    const userId = session.user?.id!;
    const userRole = (session.user as any)?.role;

    // Fetch order first
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        transactions: true,
        customer: true,
      }
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // Authorization check: Only the customer who placed the order or admin/merchant can sync
    if (userRole !== "admin" && userRole !== "merchant" && order.customerId !== userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get any existing provider order ID
    const providerOrderId = order.transactions?.find(t => t.providerOrderId)?.providerOrderId;
    if (!providerOrderId) {
      return NextResponse.json({ 
        success: false, 
        message: "No provider order reference exists for this order.",
        paymentStatus: order.paymentStatus
      });
    }

    const razorpay = getRazorpay();
    let paymentsList: any[] = [];

    try {
      // Try to fetch payments related to the Razorpay order
      const paymentsResponse = await razorpay.orders.fetchPayments(providerOrderId);
      paymentsList = paymentsResponse.items || [];
    } catch (err) {
      console.error("Error fetching payments from Razorpay:", err);
      // Fallback: try by listing payments with order_id filter
      try {
        const listResponse = await (razorpay.payments.all as any)({ order_id: providerOrderId });
        paymentsList = listResponse.items || [];
      } catch (err2) {
        console.error("Fallback payment fetch failed too:", err2);
      }
    }

    if (paymentsList.length === 0) {
      return NextResponse.json({ 
        success: true, 
        synced: false,
        message: "No payment attempts found on Razorpay for this order.",
        paymentStatus: order.paymentStatus
      });
    }

    // Look for successful (captured or authorized) payments
    const successfulPayment = paymentsList.find(
      p => p.status === "captured" || p.status === "authorized"
    );

    const isCurrentUnpaid = order.paymentStatus === "unpaid" || order.paymentStatus === "failed";

    if (successfulPayment) {
      const targetPaymentStatus = successfulPayment.status === "captured" ? "paid" : "authorized";

      // If order is currently unpaid or failed, we must update the order, decrement stock, and update transaction
      if (isCurrentUnpaid) {
        const items = order.items as any[];
        
        // RLS-aware client
        const rlsClient = prisma.$withUser(userId);

        await rlsClient.$transaction(async (tx) => {
          // 1. Check stock for all items
          for (const item of items) {
            const product = await tx.product.findUnique({
              where: { id: item.id }
            });
            
            if (!product || product.stock < item.quantity) {
              throw new Error(`Insufficient stock for product ${item.name}`);
            }
          }

          // 2. Decrement stock
          for (const item of items) {
            await tx.product.update({
              where: { id: item.id },
              data: { stock: { decrement: item.quantity } }
            });
          }

          // 3. Update Order paymentStatus and status
          await tx.order.update({
            where: { id: orderId },
            data: {
              status: "PROCESSING",
              paymentStatus: targetPaymentStatus,
            },
          });

          // 4. Update or Create successful transaction record
          const existingSuccessTx = order.transactions?.find(t => t.providerPaymentId === successfulPayment.id);
          if (existingSuccessTx) {
            await tx.transaction.update({
              where: { id: existingSuccessTx.id },
              data: {
                status: "success",
                metadata: {
                  syncedAt: new Date().toISOString(),
                  razorpayStatus: successfulPayment.status,
                  originalPaymentId: successfulPayment.id
                }
              }
            });
          } else {
            // Check if we can update the pending transaction that matches the providerOrderId
            const pendingTx = order.transactions?.find(t => t.providerOrderId === providerOrderId && !t.providerPaymentId);
            if (pendingTx) {
              await tx.transaction.update({
                where: { id: pendingTx.id },
                data: {
                  status: "success",
                  providerPaymentId: successfulPayment.id,
                  metadata: {
                    syncedAt: new Date().toISOString(),
                    razorpayStatus: successfulPayment.status,
                  }
                }
              });
            } else {
              // Otherwise create a new transaction entry
              await tx.transaction.create({
                data: {
                  orderId,
                  amount: order.total,
                  currency: order.currency || "INR",
                  status: "success",
                  provider: "razorpay",
                  providerOrderId: providerOrderId,
                  providerPaymentId: successfulPayment.id,
                  metadata: {
                    syncedAt: new Date().toISOString(),
                    razorpayStatus: successfulPayment.status,
                  }
                }
              });
            }
          }
        });

        // 5. Send order confirmation email
        sendOrderConfirmationEmail(
          order.shippingAddress?.email || order.customer?.email || "",
          order.id,
          order.total,
          items,
          order.shippingAddress || {},
          order.currency || "INR"
        ).catch(err => {
          console.error("Async confirmation email failed during sync:", err);
        });

        return NextResponse.json({
          success: true,
          synced: true,
          paymentStatus: targetPaymentStatus,
          message: "Payment successfully verified and synchronized."
        });
      } else {
        // If it was already successful, but there's a difference in payment state (e.g. was authorized, now captured), update it
        if (order.paymentStatus !== targetPaymentStatus) {
          await prisma.order.update({
            where: { id: orderId },
            data: { paymentStatus: targetPaymentStatus }
          });
        }

        return NextResponse.json({
          success: true,
          synced: false,
          paymentStatus: targetPaymentStatus,
          message: "Order was already marked as successful."
        });
      }
    }

    // No successful payment, check if we have any failed/other payment attempts
    const failedPayment = paymentsList.find(p => p.status === "failed");
    if (failedPayment && order.paymentStatus === "unpaid") {
      // Mark as failed
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: "failed", status: "FAILED" }
      });

      await prisma.transaction.create({
        data: {
          orderId,
          amount: 0,
          status: "failed",
          provider: "razorpay",
          providerOrderId,
          providerPaymentId: failedPayment.id,
          errorDetails: failedPayment.error_description || JSON.stringify(failedPayment)
        }
      });

      return NextResponse.json({
        success: true,
        synced: true,
        paymentStatus: "failed",
        message: "Payment attempt was marked as failed on Razorpay. Synchronized status."
      });
    }

    return NextResponse.json({
      success: true,
      synced: false,
      paymentStatus: order.paymentStatus,
      message: "No successful payment was authorized or captured on Razorpay."
    });

  } catch (error: any) {
    console.error("Error syncing payment status:", error);
    return NextResponse.json({ error: error.message || "Failed to synchronize payment" }, { status: 500 });
  }
}
