import { prisma } from "@/lib/prisma";

// ── Types ──

export interface DailyCount {
  date: string; // "21/04"
  count: number;
}

export interface HourlyCount {
  hour: number; // 0-23
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

// ── Queries ──

export async function getReportsData(filters?: {
  projectId?: string;
  eventName?: string;
  days?: number;
}) {
  const days = filters?.days ?? 30;
  const since = daysAgo(days);
  const previousStart = daysAgo(days * 2);

  const where: Record<string, unknown> = { createdAt: { gte: since } };
  const wherePrev: Record<string, unknown> = {
    createdAt: { gte: previousStart, lt: since },
  };

  if (filters?.projectId) {
    where.projectId = filters.projectId;
    wherePrev.projectId = filters.projectId;
  }
  if (filters?.eventName) {
    where.eventName = filters.eventName;
    wherePrev.eventName = filters.eventName;
  }

  const [
    totalEvents,
    previousEvents,
    todayEvents,
    thisWeekEvents,
    allEvents,
    allProjects,
    uniqueSessionsResult,
    uniqueUsersResult,
    latestEvent,
  ] = await Promise.all([
    prisma.event.count({ where }),
    prisma.event.count({ where: wherePrev }),
    prisma.event.count({
      where: { ...where, createdAt: { gte: startOfDay(new Date()) } },
    }),
    prisma.event.count({ where: { ...where, createdAt: { gte: daysAgo(7) } } }),
    prisma.event.findMany({
      where,
      select: {
        eventName: true,
        page: true,
        sessionId: true,
        userIdentifier: true,
        createdAt: true,
        projectId: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.project.findMany({
      select: { id: true, name: true, slug: true },
    }),
    prisma.event.findMany({
      where: { ...where, sessionId: { not: null } },
      distinct: ["sessionId"],
      select: { sessionId: true },
    }),
    prisma.event.findMany({
      where: { ...where, userIdentifier: { not: null } },
      distinct: ["userIdentifier"],
      select: { userIdentifier: true },
    }),
    prisma.event.findFirst({
      where,
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
  ]);

  // ── Compute aggregations from allEvents ──

  const projectMap = new Map(allProjects.map((p) => [p.id, p]));

  // Daily counts (last N days)
  const dailyCounts: DailyCount[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = daysAgo(i);
    const next = daysAgo(i - 1);
    const count = allEvents.filter(
      (e) => e.createdAt >= d && e.createdAt < next
    ).length;
    dailyCounts.push({
      date: `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`,
      count,
    });
  }

  // Hourly distribution
  const hourlyMap = new Array(24).fill(0);
  for (const e of allEvents) {
    hourlyMap[e.createdAt.getHours()]++;
  }
  const hourlyCounts: HourlyCount[] = hourlyMap.map((count, hour) => ({
    hour,
    count,
  }));

  // Event type breakdown
  const eventTypeCounts: Record<string, number> = {};
  for (const e of allEvents) {
    eventTypeCounts[e.eventName] = (eventTypeCounts[e.eventName] ?? 0) + 1;
  }
  const eventTypes: EventTypeCount[] = Object.entries(eventTypeCounts)
    .map(([eventName, count]) => ({ eventName, count }))
    .sort((a, b) => b.count - a.count);

  // Top pages
  const pageCounts: Record<string, number> = {};
  for (const e of allEvents) {
    if (e.page) pageCounts[e.page] = (pageCounts[e.page] ?? 0) + 1;
  }
  const topPages: PageCount[] = Object.entries(pageCounts)
    .map(([page, count]) => ({ page, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Per-project counts
  const projectCounts: Record<string, number> = {};
  for (const e of allEvents) {
    projectCounts[e.projectId] = (projectCounts[e.projectId] ?? 0) + 1;
  }
  const projectEventCounts: ProjectEventCount[] = Object.entries(projectCounts)
    .map(([projectId, count]) => {
      const p = projectMap.get(projectId);
      return {
        projectId,
        projectName: p?.name ?? "לא ידוע",
        projectSlug: p?.slug ?? "",
        count,
      };
    })
    .sort((a, b) => b.count - a.count);

  // Weekday distribution
  const WEEKDAYS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
  const weekdayMap = new Array(7).fill(0);
  for (const e of allEvents) {
    weekdayMap[e.createdAt.getDay()]++;
  }
  const weekdayCounts: WeekdayCount[] = weekdayMap.map((count, idx) => ({
    day: WEEKDAYS[idx],
    count,
  }));

  // Period comparison
  const changePercent =
    previousEvents > 0
      ? Math.round(((totalEvents - previousEvents) / previousEvents) * 100)
      : totalEvents > 0
        ? 100
        : 0;

  const comparison: PeriodComparison = {
    current: totalEvents,
    previous: previousEvents,
    changePercent,
  };

  // Top event name
  const topEventType = eventTypes.length > 0 ? eventTypes[0].eventName : null;

  // Top project
  const topProject =
    projectEventCounts.length > 0 ? projectEventCounts[0] : null;

  return {
    totalEvents,
    todayEvents,
    thisWeekEvents,
    uniqueSessions: uniqueSessionsResult.length,
    uniqueUsers: uniqueUsersResult.length,
    latestEventTime: latestEvent?.createdAt ?? null,
    comparison,
    topEventType,
    topProject,
    dailyCounts,
    hourlyCounts,
    eventTypes,
    topPages,
    projectEventCounts,
    weekdayCounts,
    allProjects,
    eventNames: Object.keys(eventTypeCounts),
    days,
  };
}
