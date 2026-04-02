import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

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
      const orders = await prisma.order.findMany({
        where: { customerId: customerUid },
        include: {
          customer: {
            select: {
              name: true,
              email: true,
            },
          },
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
    const orders = await prisma.order.findMany({
      include: {
        customer: {
          select: {
            name: true,
            email: true,
          },
        },
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
    const { orderId, status } = await req.json();

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Failed to update order status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
