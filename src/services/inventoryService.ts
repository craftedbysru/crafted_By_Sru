import prisma from "@/lib/prisma";
import { Product } from "../types";
import { withDbRetry } from "@/lib/db-retry";

export const getInventory = async (filter: any = {}, options: { take?: number, orderBy?: any } = {}) => {
  return await withDbRetry(() => prisma.product.findMany({
    where: filter,
    take: options.take,
    orderBy: options.orderBy,
    include: {
      categoryRel: true
    }
  }));
};

export const getProductById = async (id: string) => {
  return await withDbRetry(() => prisma.product.findUnique({
    where: { id },
    include: {
      categoryRel: true
    }
  }));
};

export const addProduct = async (product: any) => {
  return await withDbRetry(() => prisma.product.create({
    data: product
  }));
};

export const updateProduct = async (id: string, updates: any) => {
  return await withDbRetry(() => prisma.product.update({
    where: { id },
    data: updates
  }));
};

export const deleteProduct = async (id: string) => {
  return await withDbRetry(() => prisma.product.delete({
    where: { id }
  }));
};
