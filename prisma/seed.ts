import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import "dotenv/config";

const dbUrl = process.env.DATABASE_URL;
console.log(`Using DATABASE_URL: ${dbUrl}`);

const pool = new pg.Pool({ connectionString: dbUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  // Create Merchant User
  const hashedPassword = await bcrypt.hash('merchant123', 10);
  const merchant = await prisma.user.upsert({
    where: { email: 'merchant@demo.com' },
    update: {},
    create: {
      email: 'merchant@demo.com',
      name: 'Demo Merchant',
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log({ merchant });

  // Create Sample Products
  const products = [
    {
      name: "Handcrafted Ceramic Vase",
      price: 85.00,
      description: "A beautiful, minimalist ceramic vase handcrafted by local artisans. Each piece is unique with subtle variations in texture and glaze.",
      category: "Home Decor",
      image: "https://images.unsplash.com/photo-1578749553376-47ef44293761?q=80&w=800&auto=format&fit=crop",
      featured: true,
      stock: 15
    },
    {
      name: "Organic Linen Throw",
      price: 120.00,
      description: "Soft, breathable organic linen throw perfect for cozy evenings. Sustainably sourced and naturally dyed.",
      category: "Textiles",
      image: "https://images.unsplash.com/photo-1580302200322-2246319ad449?q=80&w=800&auto=format&fit=crop",
      featured: true,
      stock: 20
    },
    {
      name: "Hand-Woven Rattan Basket",
      price: 45.00,
      description: "Versatile and stylish rattan basket, hand-woven using traditional techniques. Ideal for storage or as a decorative piece.",
      category: "Home Decor",
      image: "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?q=80&w=800&auto=format&fit=crop",
      featured: true,
      stock: 30
    },
    {
      name: "Artisan Scented Candle",
      price: 32.00,
      description: "Hand-poured soy wax candle with a blend of essential oils. Notes of sandalwood, amber, and vanilla.",
      category: "Accessories",
      image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop",
      featured: true,
      stock: 50
    },
    {
      name: "Abstract Earth Tones Print",
      price: 65.00,
      description: "A high-quality giclée print of an original abstract painting. Features warm earth tones and organic shapes.",
      category: "Art",
      image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800&auto=format&fit=crop",
      featured: false,
      stock: 25
    },
    {
      name: "Minimalist Wooden Bowl",
      price: 55.00,
      description: "Carved from a single piece of sustainable oak, this bowl highlights the natural beauty of the wood grain.",
      category: "Home Decor",
      image: "https://images.unsplash.com/photo-1591814468924-cafb5d1232e1?q=80&w=800&auto=format&fit=crop",
      featured: false,
      stock: 12
    }
  ];

  for (const product of products) {
    const existing = await prisma.product.findFirst({
      where: { name: product.name }
    });
    
    if (!existing) {
      await prisma.product.create({
        data: product,
      });
    }
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
