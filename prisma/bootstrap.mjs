/**
 * Bootstrap: ensures required projects exist on startup.
 * Does NOT create fake events — only the project records
 * so that tracking clients can send events to a valid apiKey.
 *
 * Idempotent: skips if project already exists.
 */

import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

// Fixed API keys — must match what tracking clients use
const PROJECTS = [
  {
    name: "אפליקציית אימונים",
    slug: "trainer-app",
    type: "WEBSITE",
    description: "אפליקציית ניהול אימונים ותזונה",
    apiKey: "pk_015a62ed52d60d7912e589fb5b9535adad5ab6c9e9abe24e",
  },
];

async function main() {
  for (const p of PROJECTS) {
    const existing = await prisma.project.findUnique({
      where: { apiKey: p.apiKey },
    });

    if (existing) {
      console.log(`✓ Project "${p.name}" already exists`);
      continue;
    }

    await prisma.project.create({
      data: {
        name: p.name,
        slug: p.slug,
        type: p.type,
        description: p.description,
        status: "ACTIVE",
        apiKey: p.apiKey,
      },
    });
    console.log(`✓ Created project "${p.name}"`);
  }
}

main()
  .catch((e) => {
    console.error("Bootstrap failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
