import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const getPrismaInstance = () => {
  const databaseUrl = process.env.DATABASE_URL;
  const isOnVercel = process.env.VERCEL === "1" || !!process.env.VERCEL;
  
  // Decide whether to use PostgreSQL or SQLite to match the schema provider
  const isPostgres = (databaseUrl && (databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://"))) || isOnVercel;

  if (isPostgres) {
    // For PostgreSQL, we pass a pg Pool to the PrismaPg adapter
    const connectionString = databaseUrl || "postgresql://postgres:postgres@localhost:5432/postgres";
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  } else {
    // In Prisma 7, the BetterSqlite3 adapter takes the connection URL directly
    const connectionString = databaseUrl || "file:./dev.db";
    const adapter = new PrismaBetterSqlite3({ url: connectionString });
    return new PrismaClient({ adapter });
  }
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof getPrismaInstance>;
}

const prisma = globalThis.prismaGlobal ?? getPrismaInstance();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
