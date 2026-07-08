import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const getPrismaInstance = () => {
  const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";

  if (databaseUrl.startsWith("file:")) {
    // In Prisma 7, the BetterSqlite3 adapter takes the connection URL directly
    const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
    return new PrismaClient({ adapter });
  } else {
    // For PostgreSQL, we pass a pg Pool to the PrismaPg adapter
    const pool = new Pool({ connectionString: databaseUrl });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  }
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof getPrismaInstance>;
}

const prisma = globalThis.prismaGlobal ?? getPrismaInstance();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
