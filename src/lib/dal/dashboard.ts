import { prisma } from "@/lib/prisma";

export interface MonthlyCount {
  month: string; // "ינו", "פבר", etc.
  count: number;
}

const MONTH_NAMES = [
  "ינו", "פבר", "מרץ", "אפר", "מאי", "יונ",
  "יול", "אוג", "ספט", "אוק", "נוב", "דצמ",
];

export async function getDashboardStats() {
  const now = new Date();
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const [totalProjects, totalEvents, todayEvents, recentEvents] =
    await Promise.all([
      prisma.project.count(),
      prisma.event.count(),
      prisma.event.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.event.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        include: {
          project: { select: { name: true, slug: true } },
        },
      }),
    ]);

  // Monthly event counts for the last 12 months
  const monthlyData = await getMonthlyEventCounts();

  return {
    totalProjects,
    totalEvents,
    todayEvents,
    recentEvents,
    monthlyData,
  };
}

async function getMonthlyEventCounts(): Promise<MonthlyCount[]> {
  const now = new Date();
  const result: MonthlyCount[] = [];

  for (let i = 11; i >= 0; i--) {
    const year = now.getFullYear();
    const month = now.getMonth() - i;

    const d = new Date(year, month, 1);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);

    const count = await prisma.event.count({
      where: {
        createdAt: { gte: start, lt: end },
      },
    });

    result.push({
      month: MONTH_NAMES[d.getMonth()],
      count,
    });
  }

  return result;
}
