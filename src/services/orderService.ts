import prisma from "@/lib/prisma";
import { Order } from "../types";
import { withDbRetry } from "@/lib/db-retry";

export const createOrder = async (orderData: any) => {
  return await withDbRetry(() => prisma.$transaction(async (tx) => {
    // Create the order
    const order = await tx.order.create({
      data: orderData
    });

    // Update stock for each item
    const items = orderData.items as any[];
    for (const item of items) {
      // Check if product exists and has enough stock
      const product = await tx.product.findUnique({
        where: { id: item.id }
      });

      if (!product) {
        throw new Error(`Product ${item.id} not found`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }

      await tx.product.update({
        where: { id: item.id },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });
    }

    return order;
  }));
};

export const getOrders = async (customerId?: string) => {
  return await withDbRetry(() => {
    if (customerId) {
      return prisma.order.findMany({
        where: { customerId }
      });
    }
    return prisma.order.findMany();
  });
};
