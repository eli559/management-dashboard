import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { randomBytes } from "crypto";

const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

const EVENT_NAMES = [
  "page_view",
  "button_click",
  "form_submit",
  "signup",
  "login",
  "purchase",
  "search",
  "download",
];

const PAGES = [
  "/",
  "/pricing",
  "/about",
  "/dashboard",
  "/settings",
  "/contact",
  "/docs",
  "/blog",
];

const USERS = [
  "user_avraham",
  "user_sarah",
  "user_david",
  "user_rachel",
  "user_moshe",
  "user_leah",
  "user_yakov",
  "user_rivka",
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysBack: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  date.setHours(Math.floor(Math.random() * 24));
  date.setMinutes(Math.floor(Math.random() * 60));
  return date;
}

async function main() {
  console.log("🌱 Starting seed...\n");

  // ── Create Projects ──
  const project1 = await prisma.project.upsert({
    where: { slug: "saas-crm" },
    update: {},
    create: {
      name: "מערכת CRM",
      slug: "saas-crm",
      type: "SAAS",
      description: "מערכת ניהול לקוחות מתקדמת עם דשבורד אנליטי ואוטומציות",
      status: "ACTIVE",
      apiKey: `pk_${randomBytes(24).toString("hex")}`,
    },
  });
  console.log(`✓ Project: ${project1.name} (${project1.slug})`);

  const project2 = await prisma.project.upsert({
    where: { slug: "marketing-site" },
    update: {},
    create: {
      name: "אתר שיווקי",
      slug: "marketing-site",
      type: "WEBSITE",
      description: "אתר הנחיתה הראשי של החברה עם דפי מוצר ובלוג",
      status: "ACTIVE",
      apiKey: `pk_${randomBytes(24).toString("hex")}`,
    },
  });
  console.log(`✓ Project: ${project2.name} (${project2.slug})`);

  const project3 = await prisma.project.upsert({
    where: { slug: "mobile-app" },
    update: {},
    create: {
      name: "אפליקציה מובייל",
      slug: "mobile-app",
      type: "MOBILE_APP",
      description: "אפליקציית Android ו-iOS לניהול משימות אישי",
      status: "ACTIVE",
      apiKey: `pk_${randomBytes(24).toString("hex")}`,
    },
  });
  console.log(`✓ Project: ${project3.name} (${project3.slug})\n`);

  // ── Create Events ──
  const projects = [project1, project2, project3];
  const eventCounts = [80, 50, 30];

  for (let p = 0; p < projects.length; p++) {
    const project = projects[p];
    const count = eventCounts[p];

    for (let i = 0; i < count; i++) {
      await prisma.event.create({
        data: {
          projectId: project.id,
          eventName: randomItem(EVENT_NAMES),
          sessionId: `sess_${randomBytes(6).toString("hex")}`,
          userIdentifier: Math.random() > 0.15 ? randomItem(USERS) : null,
          page: randomItem(PAGES),
          value: Math.random() > 0.5 ? Math.round(Math.random() * 500) : null,
          metadata: JSON.stringify({
            browser: randomItem(["Chrome", "Firefox", "Safari", "Edge"]),
            os: randomItem(["macOS", "Windows", "iOS", "Android"]),
            country: randomItem(["IL", "US", "UK", "DE"]),
          }),
          createdAt: randomDate(30),
        },
      });
    }

    console.log(`✓ Created ${count} events for "${project.name}"`);
  }

  console.log("\n✅ Seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
