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
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const [totalEvents, todayEvents, uniqueUsersResult, uniqueSessionsResult] =
    await Promise.all([
      prisma.event.count({ where: { projectId } }),
      prisma.event.count({
        where: { projectId, createdAt: { gte: startOfDay } },
      }),
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

export async function getTotalEventCount() {
  return prisma.event.count();
}

export async function getTodayEventCount() {
  const now = new Date();
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  return prisma.event.count({
    where: { createdAt: { gte: startOfDay } },
  });
}
