import prisma from "@/lib/prisma";
import { Order } from "../types";

export const createOrder = async (orderData: any) => {
  return await prisma.$transaction(async (tx) => {
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
  });
};

export const getOrders = async (customerId?: string) => {
  if (customerId) {
    return await prisma.order.findMany({
      where: { customerId }
    });
  }
  return await prisma.order.findMany();
};
