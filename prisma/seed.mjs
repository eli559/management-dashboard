import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { randomBytes } from "crypto";

const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

const EVENTS = ["page_view","button_click","form_submit","signup","login","purchase","search","download"];
const PAGES = ["/","/pricing","/about","/dashboard","/settings","/contact","/docs","/blog"];
const USERS = ["user_avraham","user_sarah","user_david","user_rachel","user_moshe","user_leah"];

const pick = (a) => a[Math.floor(Math.random() * a.length)];
const ago = (d) => { const t = new Date(); t.setDate(t.getDate() - Math.floor(Math.random() * d)); t.setHours(Math.floor(Math.random() * 24)); return t; };

async function main() {
  const count = await prisma.project.count();
  if (count > 0) { console.log("→ DB already has data, skipping seed."); return; }

  const projects = [
    { name: "מערכת CRM", slug: "saas-crm", type: "SAAS", description: "מערכת ניהול לקוחות מתקדמת", evts: 80 },
    { name: "אתר שיווקי", slug: "marketing-site", type: "WEBSITE", description: "אתר הנחיתה הראשי של החברה", evts: 50 },
    { name: "אפליקציה מובייל", slug: "mobile-app", type: "MOBILE_APP", description: "אפליקציית ניהול משימות", evts: 30 },
  ];

  for (const p of projects) {
    const proj = await prisma.project.create({
      data: { name: p.name, slug: p.slug, type: p.type, description: p.description, status: "ACTIVE", apiKey: `pk_${randomBytes(24).toString("hex")}` },
    });
    console.log(`✓ ${proj.name} → ${proj.apiKey}`);

    for (let i = 0; i < p.evts; i++) {
      await prisma.event.create({
        data: {
          projectId: proj.id, eventName: pick(EVENTS), sessionId: `sess_${randomBytes(6).toString("hex")}`,
          userIdentifier: Math.random() > 0.15 ? pick(USERS) : null, page: pick(PAGES),
          value: Math.random() > 0.5 ? Math.round(Math.random() * 500) : null,
          metadata: JSON.stringify({ browser: pick(["Chrome","Firefox","Safari"]), os: pick(["macOS","Windows","iOS"]) }),
          createdAt: ago(30),
        },
      });
    }
    console.log(`  + ${p.evts} events`);
  }
  console.log("✅ Seed done");
}

main().catch(console.error).finally(() => prisma.$disconnect());
