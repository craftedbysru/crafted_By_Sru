import prisma from "@/lib/prisma";
import { User, Address } from "../types";

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email }
  });
};

export const createUser = async (userData: any) => {
  return await prisma.user.create({
    data: userData
  });
};

export const getAddresses = async (userId: string) => {
  return await prisma.address.findMany({
    where: { userId }
  });
};

export const addAddress = async (userId: string, addressData: any) => {
  return await prisma.address.create({
    data: {
      ...addressData,
      userId
    }
  });
};
