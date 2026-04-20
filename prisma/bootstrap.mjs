/**
 * Bootstrap: ensures required projects exist on startup.
 * Uses better-sqlite3 directly to avoid Prisma ESM issues in production.
 * Idempotent: skips if project already exists.
 */

import Database from "better-sqlite3";
import { randomBytes } from "crypto";

const dbPath = (process.env.DATABASE_URL ?? "file:./prisma/dev.db").replace("file:", "");
const db = new Database(dbPath);

const PROJECTS = [
  {
    id: "proj_trainer_app",
    name: "אפליקציית אימונים",
    slug: "trainer-app",
    type: "WEBSITE",
    description: "אפליקציית ניהול אימונים ותזונה",
    apiKey: "pk_015a62ed52d60d7912e589fb5b9535adad5ab6c9e9abe24e",
  },
];

const insert = db.prepare(`
  INSERT OR IGNORE INTO projects (id, name, slug, type, description, status, apiKey, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, 'ACTIVE', ?, datetime('now'), datetime('now'))
`);

for (const p of PROJECTS) {
  const result = insert.run(p.id, p.name, p.slug, p.type, p.description, p.apiKey);
  if (result.changes > 0) {
    console.log(`✓ Created project "${p.name}"`);
  } else {
    console.log(`✓ Project "${p.name}" already exists`);
  }
}

const count = db.prepare("SELECT COUNT(*) as c FROM projects").get();
console.log(`✓ Total projects: ${count.c}`);
db.close();
