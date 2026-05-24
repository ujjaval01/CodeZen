import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient() {
  const isPostgres = process.env.DATABASE_URL?.startsWith("postgres");

  if (isPostgres) {
    // For PostgreSQL production deployment (requires: npm i pg @prisma/adapter-pg)
    try {
      const { Pool } = require("pg");
      const { PrismaPg } = require("@prisma/adapter-pg");
      const pool = new Pool({ connectionString: process.env.DATABASE_URL });
      const adapter = new PrismaPg(pool);
      return new PrismaClient({ adapter });
    } catch (e) {
      console.warn("Postgres URL detected, but pg and @prisma/adapter-pg are not installed. Falling back to SQLite.");
    }
  }

  // Default to SQLite (development/local practice out-of-the-box)
  const adapter = new PrismaBetterSqlite3({ url: "file:dev.db" });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
