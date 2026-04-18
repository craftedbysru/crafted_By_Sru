import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const orderStatusSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  status: z.string().min(1, "Status is required"), // More flexible
});

export async function GET(req: Request) {
  const session = await auth();
  const { searchParams } = new URL(req.url);
  const customerUid = searchParams.get("customerUid");

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userRole = (session.user as any)?.role;
  const userId = (session.user as any)?.id;

  // If customerUid is provided, allow the customer to see their own orders
  if (customerUid) {
    if (userRole !== "admin" && userRole !== "merchant" && userId !== customerUid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const rlsClient = prisma.$withUser(userId);
      const orders = await rlsClient.order.findMany({
        where: { customerId: customerUid },
        include: {
          customer: {
            select: {
              name: true,
              email: true,
              addresses: true,
            },
          },
          transactions: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json(orders);
    } catch (error) {
      console.error("Failed to fetch customer orders:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }

  // Otherwise, only allow admin/merchant to see all orders
  if (userRole !== "admin" && userRole !== "merchant") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rlsClient = prisma.$withUser(userId);
    const orders = await rlsClient.order.findMany({
      include: {
        customer: {
          select: {
            name: true,
            email: true,
            addresses: true,
          },
        },
        transactions: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await auth();

  if (!session || ((session.user as any)?.role !== "admin" && (session.user as any)?.role !== "merchant")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { orderId, status } = orderStatusSchema.parse(body);
    const userId = (session.user as any).id;
    
    // RLS-aware client
    const rlsClient = prisma.$withUser(userId);

    const updatedOrder = await rlsClient.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Failed to update order status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
