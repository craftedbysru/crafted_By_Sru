import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

async function checkColumns() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL not set");
    return;
  }

  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter } as any);

  try {
    console.log("Checking columns for Product table...");
    const columns: any[] = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Product'
    `;
    console.log("Columns found:", columns.map(c => c.column_name).join(", "));
    
    if (columns.some(c => c.column_name === 'rating')) {
      console.log("CRITICAL: 'rating' column STILL EXISTS in the database!");
    } else {
      console.log("SUCCESS: 'rating' column IS NOT in the database.");
    }
  } catch (error: any) {
    console.error("Error checking columns:", error.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

checkColumns();
