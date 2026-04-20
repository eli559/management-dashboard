import { prisma } from "@/lib/prisma";

// ── Types ──

export interface DailyCount {
  date: string;
  count: number;
}

export interface HourlyCount {
  hour: number;
  count: number;
}

export interface EventTypeCount {
  eventName: string;
  count: number;
}

export interface PageCount {
  page: string;
  count: number;
}

export interface ProjectEventCount {
  projectId: string;
  projectName: string;
  projectSlug: string;
  count: number;
}

export interface WeekdayCount {
  day: string;
  count: number;
}

export interface PeriodComparison {
  current: number;
  previous: number;
  changePercent: number;
}

// ── Date Helpers ──

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return startOfDay(d);
}

// ── Main Query ──

export async function getReportsData(filters?: {
  projectId?: string;
  eventName?: string;
  days?: number;
}) {
  const days = filters?.days ?? 30;
  const since = daysAgo(days);
  const previousStart = daysAgo(days * 2);
  const today = startOfDay(new Date());
  const weekAgo = daysAgo(7);
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  // Base where clause
  const base: Record<string, unknown> = {};
  if (filters?.projectId) base.projectId = filters.projectId;
  if (filters?.eventName) base.eventName = filters.eventName;

  // All counts via DB queries (no allEvents in memory)
  const [
    totalEvents,
    previousEvents,
    todayEvents,
    thisWeekEvents,
    thisMonthEvents,
    uniqueSessionsResult,
    uniqueUsersResult,
    latestEvent,
    allProjects,
  ] = await Promise.all([
    prisma.event.count({ where: { ...base, createdAt: { gte: since } } }),
    prisma.event.count({ where: { ...base, createdAt: { gte: previousStart, lt: since } } }),
    prisma.event.count({ where: { ...base, createdAt: { gte: today } } }),
    prisma.event.count({ where: { ...base, createdAt: { gte: weekAgo } } }),
    prisma.event.count({ where: { ...base, createdAt: { gte: monthStart } } }),
    prisma.event.findMany({
      where: { ...base, createdAt: { gte: since }, sessionId: { not: null } },
      distinct: ["sessionId"],
      select: { sessionId: true },
    }),
    prisma.event.findMany({
      where: { ...base, createdAt: { gte: since }, userIdentifier: { not: null } },
      distinct: ["userIdentifier"],
      select: { userIdentifier: true },
    }),
    prisma.event.findFirst({
      where: { ...base, createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
    prisma.project.findMany({
      select: { id: true, name: true, slug: true },
    }),
  ]);

  // Daily counts — one query per day
  const dailyCounts = await getDailyCounts(base, days);

  // Sparkline — last 7 days
  const sparkline = dailyCounts.slice(-7).map((d) => d.count);

  // Hourly — fetch only createdAt, compute hours
  const eventsForDistribution = await prisma.event.findMany({
    where: { ...base, createdAt: { gte: since } },
    select: { createdAt: true, eventName: true, page: true, projectId: true },
  });

  // Hourly distribution
  const hourlyMap = new Array(24).fill(0);
  const WEEKDAYS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
  const weekdayMap = new Array(7).fill(0);
  const eventTypeCounts: Record<string, number> = {};
  const pageCounts: Record<string, number> = {};
  const projectCounts: Record<string, number> = {};

  for (const e of eventsForDistribution) {
    hourlyMap[e.createdAt.getHours()]++;
    weekdayMap[e.createdAt.getDay()]++;
    eventTypeCounts[e.eventName] = (eventTypeCounts[e.eventName] ?? 0) + 1;
    if (e.page) pageCounts[e.page] = (pageCounts[e.page] ?? 0) + 1;
    projectCounts[e.projectId] = (projectCounts[e.projectId] ?? 0) + 1;
  }

  const hourlyCounts: HourlyCount[] = hourlyMap.map((count, hour) => ({ hour, count }));
  const weekdayCounts: WeekdayCount[] = weekdayMap.map((count, idx) => ({ day: WEEKDAYS[idx], count }));

  const eventTypes: EventTypeCount[] = Object.entries(eventTypeCounts)
    .map(([eventName, count]) => ({ eventName, count }))
    .sort((a, b) => b.count - a.count);

  const topPages: PageCount[] = Object.entries(pageCounts)
    .map(([page, count]) => ({ page, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const projectMap = new Map(allProjects.map((p) => [p.id, p]));
  const projectEventCounts: ProjectEventCount[] = Object.entries(projectCounts)
    .map(([projectId, count]) => {
      const p = projectMap.get(projectId);
      return { projectId, projectName: p?.name ?? "לא ידוע", projectSlug: p?.slug ?? "", count };
    })
    .sort((a, b) => b.count - a.count);

  // Comparison
  const changePercent =
    previousEvents > 0
      ? Math.round(((totalEvents - previousEvents) / previousEvents) * 100)
      : totalEvents > 0 ? 100 : 0;

  return {
    totalEvents,
    todayEvents,
    thisWeekEvents,
    thisMonthEvents,
    uniqueSessions: uniqueSessionsResult.length,
    uniqueUsers: uniqueUsersResult.length,
    latestEventTime: latestEvent?.createdAt ?? null,
    comparison: { current: totalEvents, previous: previousEvents, changePercent } as PeriodComparison,
    topEventType: eventTypes.length > 0 ? eventTypes[0].eventName : null,
    topProject: projectEventCounts.length > 0 ? projectEventCounts[0] : null,
    dailyCounts,
    hourlyCounts,
    eventTypes,
    topPages,
    projectEventCounts,
    weekdayCounts,
    allProjects,
    eventNames: Object.keys(eventTypeCounts),
    days,
    sparkline,
  };
}

async function getDailyCounts(
  base: Record<string, unknown>,
  days: number
): Promise<DailyCount[]> {
  const promises = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = daysAgo(i);
    const next = daysAgo(i - 1);
    promises.push(
      prisma.event.count({ where: { ...base, createdAt: { gte: d, lt: next } } })
        .then((count) => ({
          date: `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`,
          count,
        }))
    );
  }
  return Promise.all(promises);
}
