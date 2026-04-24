import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL?.includes("://") 
      ? process.env.DATABASE_URL 
      : `postgresql://${process.env.DATABASE_URL || 'localhost'}/db`,
  },
});
