import { prisma } from "@/lib/prisma";

interface CreateEventData {
  projectId: string;
  eventName: string;
  sessionId?: string | null;
  userIdentifier?: string | null;
  page?: string | null;
  value?: number | null;
  metadata?: Record<string, unknown> | string;
}

export async function createEvent(data: CreateEventData) {
  return prisma.event.create({
    data: {
      projectId: data.projectId,
      eventName: data.eventName,
      sessionId: data.sessionId ?? null,
      userIdentifier: data.userIdentifier ?? null,
      page: data.page ?? null,
      value: data.value ?? null,
      metadata:
        typeof data.metadata === "string"
          ? data.metadata
          : JSON.stringify(data.metadata ?? {}),
    },
  });
}

export async function getRecentEventsByProject(
  projectId: string,
  limit = 20
) {
  return prisma.event.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getProjectEventStats(projectId: string) {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [totalEvents, todayEvents, uniqueUsersResult, uniqueSessionsResult] =
    await Promise.all([
      prisma.event.count({ where: { projectId } }),
      prisma.event.count({ where: { projectId, createdAt: { gte: startOfDay } } }),
      prisma.event.findMany({
        where: { projectId, userIdentifier: { not: null } },
        distinct: ["userIdentifier"],
        select: { userIdentifier: true },
      }),
      prisma.event.findMany({
        where: { projectId, sessionId: { not: null } },
        distinct: ["sessionId"],
        select: { sessionId: true },
      }),
    ]);

  return {
    totalEvents,
    todayEvents,
    uniqueUsers: uniqueUsersResult.length,
    uniqueSessions: uniqueSessionsResult.length,
  };
}

export interface EventNameBreakdown {
  eventName: string;
  count: number;
}

export async function getProjectEventBreakdown(projectId: string): Promise<EventNameBreakdown[]> {
  const events = await prisma.event.findMany({
    where: { projectId },
    select: { eventName: true },
  });

  const counts: Record<string, number> = {};
  for (const e of events) {
    counts[e.eventName] = (counts[e.eventName] ?? 0) + 1;
  }

  return Object.entries(counts)
    .map(([eventName, count]) => ({ eventName, count }))
    .sort((a, b) => b.count - a.count);
}

export interface TopPage {
  page: string;
  count: number;
}

export async function getProjectTopPages(projectId: string): Promise<TopPage[]> {
  const events = await prisma.event.findMany({
    where: { projectId, page: { not: null } },
    select: { page: true },
  });

  const counts: Record<string, number> = {};
  for (const e of events) {
    if (e.page) counts[e.page] = (counts[e.page] ?? 0) + 1;
  }

  return Object.entries(counts)
    .map(([page, count]) => ({ page, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

export async function getProjectMonthlyEvents(projectId: string) {
  const MONTH_NAMES = ["ינו","פבר","מרץ","אפר","מאי","יונ","יול","אוג","ספט","אוק","נוב","דצמ"];
  const now = new Date();

  const promises = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const month = MONTH_NAMES[d.getMonth()];

    promises.push(
      prisma.event.count({ where: { projectId, createdAt: { gte: start, lt: end } } })
        .then((count) => ({ month, count }))
    );
  }

  return Promise.all(promises);
}
