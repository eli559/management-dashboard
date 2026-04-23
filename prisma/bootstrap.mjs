/**
 * Bootstrap: ensures required projects exist on startup.
 * Uses pg directly for PostgreSQL (Neon).
 */

import "dotenv/config";
import pg from "pg";

function parseDbUrl(url) {
  const u = new URL(url);
  return {
    host: u.hostname,
    port: parseInt(u.port || "5432"),
    database: u.pathname.slice(1),
    user: u.username,
    password: u.password,
    ssl: u.searchParams.get("sslmode") === "require" ? true : undefined,
  };
}

const config = parseDbUrl(process.env.DATABASE_URL);
const pool = new pg.Pool(config);

const PROJECTS = [
  {
    id: "proj_trainer_app",
    name: "אפליקציית אימונים",
    slug: "trainer-app",
    type: "WEBSITE",
    description: "אפליקציית ניהול אימונים ותזונה",
    apiKey: "pk_015a62ed52d60d7912e589fb5b9535adad5ab6c9e9abe24e",
  },
  {
    id: "proj_landing_page",
    name: "דף נחיתה",
    slug: "landing-page",
    type: "WEBSITE",
    description: "דף נחיתה שיווקי — מעקב כניסות, קליקים, המרות",
    apiKey: "pk_landing_7f3a9c2e1b4d6e8a0f5c3b7d9e1a4f6c8b2d0e3a5c7f9b",
  },
];

try {
  for (const p of PROJECTS) {
    const existing = await pool.query('SELECT id FROM projects WHERE "apiKey" = $1', [p.apiKey]);
    if (existing.rows.length > 0) {
      console.log(`✓ Project "${p.name}" already exists`);
      continue;
    }

    await pool.query(
      `INSERT INTO projects (id, name, slug, type, description, status, "apiKey", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, 'ACTIVE', $6, NOW(), NOW())
       ON CONFLICT ("apiKey") DO NOTHING`,
      [p.id, p.name, p.slug, p.type, p.description, p.apiKey]
    );
    console.log(`✓ Created project "${p.name}"`);
  }

  const res = await pool.query("SELECT COUNT(*) as c FROM projects");
  console.log(`✓ Total projects: ${res.rows[0].c}`);
} catch (err) {
  console.error("Bootstrap error:", err.message);
} finally {
  await pool.end();
}
