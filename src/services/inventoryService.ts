import prisma from "@/lib/prisma";
import { Product } from "../types";

export const getInventory = async () => {
  return await prisma.product.findMany();
};

export const getProductById = async (id: string) => {
  return await prisma.product.findUnique({
    where: { id }
  });
};

export const addProduct = async (product: any) => {
  return await prisma.product.create({
    data: product
  });
};

export const updateProduct = async (id: string, updates: any) => {
  return await prisma.product.update({
    where: { id },
    data: updates
  });
};

export const deleteProduct = async (id: string) => {
  return await prisma.product.delete({
    where: { id }
  });
};
