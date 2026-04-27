import { PrismaClient } from '@prisma/client';

async function test() {
  const prisma = new PrismaClient();
  try {
    console.log("Testing Product.findMany()...");
    const products = await prisma.product.findMany({ take: 1 });
    console.log("Success! Products found:", products.length);
    if (products.length > 0) {
      console.log("Sample product keys:", Object.keys(products[0]));
    }
  } catch (error: any) {
    console.error("FAILURE in findMany:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
