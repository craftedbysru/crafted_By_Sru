import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

// Ensure we use a single pg.Pool instance globally
// Standard Next.js singleton pattern for Prisma + pg adapter
declare global {
  var __pgPool: pg.Pool | undefined;
  var __prisma: any | undefined;
}

const getPool = () => {
  if (globalThis.__pgPool) return globalThis.__pgPool;

  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 15, // Sufficient for parallel page requests
    idleTimeoutMillis: 5000, // Release idle connections rapidly
    connectionTimeoutMillis: 10000,
    maxUses: 1000, 
  });

  pool.on('error', (err) => {
    console.error('Postgres Pool Error:', err);
  });

  globalThis.__pgPool = pool;
  return pool;
};

const prismaClientSingleton = () => {
  const pool = getPool();
  const adapter = new PrismaPg(pool);
  const baseClient = new PrismaClient({ 
    adapter,
    log: ['error'], 
  } as any);

  // Extend Prisma for Row Level Security (RLS) support
  return baseClient.$extends({
    client: {
      $withUser(userId: string) {
        return baseClient.$extends({
          query: {
            $allModels: {
              async $allOperations({ args, query }) {
                // To respect RLS, we wrap the operation in a transaction and set the claims
                return baseClient.$transaction(async (tx) => {
                  try {
                    await tx.$executeRawUnsafe(
                      `SELECT set_config('request.jwt.claims', $1, true)`,
                      JSON.stringify({ sub: userId })
                    );
                  } catch (e) {
                    console.error("Failed to set RLS user context", e);
                  }
                  return query(args);
                });
              },
            },
          },
        });
      },
    },
  });
};

const prisma = globalThis.__prisma ?? prismaClientSingleton();

// Always store the instance in globalThis to ensure it's a true singleton 
// across all environments and prevent connection leaks/port exhaustion.
globalThis.__prisma = prisma;

export default prisma;
