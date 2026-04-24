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
    max: 10, // Increased from 2 to handle concurrent requests better
    idleTimeoutMillis: 30000, 
    connectionTimeoutMillis: 10000,
  });

  pool.on('error', (err) => {
    console.error('CRITICAL: Postgres Pool Error:', err);
    // Explicitly reset on address or termination errors
    if (err.message.includes('EADDRINUSE') || err.message.includes('connection') || err.message.includes('terminat')) {
      console.warn('Fatal pool error detected. Resetting global pool and client references.');
      globalThis.__pgPool = undefined;
      globalThis.__prisma = undefined;
    }
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
              async $allOperations({ args, query, operation }) {
                // To respect RLS, we wrap WRITING operations in a transaction and set the claims
                // Read operations usually don't need RLS context unless they are tenant-specific
                // But for safety in a multi-tenant artisan app, we use it for all if requested.
                // OPTIMIZATION: Only use transaction for mutations or if explicitly needed
                const isMutation = ['create', 'update', 'delete', 'upsert', 'createMany', 'updateMany', 'deleteMany'].includes(operation);
                
                if (isMutation) {
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
                }
                
                // For READ operations, we still set context but outside a heavy transaction if possible
                // or just run it as is if it's general content.
                // However, PrismaPg adapter + $executeRaw outside transaction might not guarantee session continuity 
                // on the same connection from the pool. So transactions ARE safer but expensive.
                // We'll keep transaction for everything but use a more robust pool.
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
