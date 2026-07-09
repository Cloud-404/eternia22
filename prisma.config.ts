import "dotenv/config";
import { defineConfig } from "prisma/config";
import fs from "fs";
import path from "path";

const getDatabaseUrl = () => {
  const envUrl = process.env.DATABASE_URL;
  if (envUrl) return envUrl;

  try {
    const schemaPath = path.join(__dirname, "prisma/schema.prisma");
    if (fs.existsSync(schemaPath)) {
      const schemaContent = fs.readFileSync(schemaPath, "utf8");
      const match = schemaContent.match(/provider\s*=\s*"([^"]*)"/);
      if (match && match[1] === "postgresql") {
        return "postgresql://postgres:postgres@localhost:5432/postgres";
      }
    }
  } catch (e) {
    // Ignore error
  }

  return "file:./dev.db";
};

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: getDatabaseUrl(),
  },
});
