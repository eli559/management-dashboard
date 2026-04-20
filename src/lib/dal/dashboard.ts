import { prisma } from "@/lib/prisma";

export interface MonthlyCount {
  month: string;
  count: number;
}

export interface EventBreakdown {
  eventName: string;
  count: number;
}

export interface ProjectSummary {
  id: string;
  name: string;
  slug: string;
  eventCount: number;
}

const MONTH_NAMES = [
  "ינו", "פבר", "מרץ", "אפר", "מאי", "יונ",
  "יול", "אוג", "ספט", "אוק", "נוב", "דצמ",
];

export async function getDashboardStats() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    totalProjects,
    totalEvents,
    todayEvents,
    recentEvents,
    monthlyData,
    eventBreakdown,
    topProjects,
    latestEvent,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.event.count(),
    prisma.event.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.event.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { project: { select: { name: true, slug: true } } },
    }),
    getMonthlyEventCounts(),
    getEventBreakdown(),
    getTopProjects(),
    prisma.event.findFirst({ orderBy: { createdAt: "desc" }, select: { createdAt: true } }),
  ]);

  return {
    totalProjects,
    totalEvents,
    todayEvents,
    recentEvents,
    monthlyData,
    eventBreakdown,
    topProjects,
    latestEventTime: latestEvent?.createdAt ?? null,
  };
}

async function getMonthlyEventCounts(): Promise<MonthlyCount[]> {
  const now = new Date();
  const result: MonthlyCount[] = [];

  const promises = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const monthName = MONTH_NAMES[d.getMonth()];

    promises.push(
      prisma.event.count({ where: { createdAt: { gte: start, lt: end } } })
        .then((count) => ({ month: monthName, count }))
    );
  }

  return Promise.all(promises);
}

async function getEventBreakdown(): Promise<EventBreakdown[]> {
  const events = await prisma.event.findMany({
    select: { eventName: true },
  });

  const counts: Record<string, number> = {};
  for (const e of events) {
    counts[e.eventName] = (counts[e.eventName] ?? 0) + 1;
  }

  return Object.entries(counts)
    .map(([eventName, count]) => ({ eventName, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

async function getTopProjects(): Promise<ProjectSummary[]> {
  const projects = await prisma.project.findMany({
    select: { id: true, name: true, slug: true, _count: { select: { events: true } } },
    orderBy: { events: { _count: "desc" } },
    take: 5,
  });

  return projects.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    eventCount: p._count.events,
  }));
}
