const fs = require("fs");
const path = require("path");

const schemaPath = path.join(__dirname, "../prisma/schema.prisma");
let schemaContent = fs.readFileSync(schemaPath, "utf8");

const dbUrl = process.env.DATABASE_URL || "";
const isOnVercel = process.env.VERCEL === "1" || !!process.env.VERCEL;
const isPostgres = dbUrl.startsWith("postgres://") || dbUrl.startsWith("postgresql://") || isOnVercel;
const targetProvider = isPostgres ? "postgresql" : "sqlite";

// Replace provider = "..." inside datasource db
const updatedContent = schemaContent.replace(
  /datasource db\s*\{[^}]*provider\s*=\s*"[^"]*"/,
  (match) => match.replace(/provider\s*=\s*"[^"]*"/, `provider = "${targetProvider}"`)
);

fs.writeFileSync(schemaPath, updatedContent, "utf8");
console.log(`Database provider in schema.prisma set to "${targetProvider}"`);
