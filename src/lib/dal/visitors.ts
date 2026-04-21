import { prisma } from "@/lib/prisma";
import { parseDevice } from "@/lib/device-parser";

export interface VisitorSession {
  sessionId: string;
  projectName: string;
  projectSlug: string;
  firstSeen: Date;
  lastSeen: Date;
  pageCount: number;
  eventCount: number;
  pages: string[];
  events: string[];
  referrer: string | null;
  deviceType: string;
  deviceName: string;
}

export interface VisitorStats {
  totalSessions: number;
  todaySessions: number;
  thisWeekSessions: number;
  avgEventsPerSession: number;
  topPages: { page: string; count: number }[];
  topReferrers: { referrer: string; count: number }[];
  sessionsByProject: { projectName: string; projectSlug: string; count: number }[];
}

export async function getVisitorStats(): Promise<VisitorStats> {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const allEvents = await prisma.event.findMany({
    where: { sessionId: { not: null } },
    select: {
      sessionId: true,
      page: true,
      eventName: true,
      metadata: true,
      createdAt: true,
      project: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Unique sessions
  const sessionSet = new Set(allEvents.map((e) => e.sessionId));
  const totalSessions = sessionSet.size;

  const todayEvents = allEvents.filter((e) => e.createdAt >= startOfDay);
  const todaySessions = new Set(todayEvents.map((e) => e.sessionId)).size;

  const weekEvents = allEvents.filter((e) => e.createdAt >= weekAgo);
  const thisWeekSessions = new Set(weekEvents.map((e) => e.sessionId)).size;

  const avgEventsPerSession = totalSessions > 0 ? Math.round(allEvents.length / totalSessions) : 0;

  // Top pages
  const pageCounts: Record<string, number> = {};
  for (const e of allEvents) {
    if (e.page) pageCounts[e.page] = (pageCounts[e.page] ?? 0) + 1;
  }
  const topPages = Object.entries(pageCounts)
    .map(([page, count]) => ({ page, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Top referrers
  const refCounts: Record<string, number> = {};
  for (const e of allEvents) {
    try {
      const meta = typeof e.metadata === "string" ? JSON.parse(e.metadata) : e.metadata;
      if (meta?.referrer) {
        const ref = String(meta.referrer).replace(/https?:\/\//, "").split("/")[0];
        if (ref) {
          refCounts[ref] = (refCounts[ref] ?? 0) + 1;
        }
      }
    } catch {}
  }
  const topReferrers = Object.entries(refCounts)
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Sessions by project
  const projCounts: Record<string, { name: string; slug: string; count: number }> = {};
  for (const e of allEvents) {
    const key = e.project.slug;
    if (!projCounts[key]) {
      projCounts[key] = { name: e.project.name, slug: e.project.slug, count: 0 };
    }
    // Count unique sessions per project
  }
  // Recount by unique sessions
  const projSessions: Record<string, Set<string>> = {};
  for (const e of allEvents) {
    const key = e.project.slug;
    if (!projSessions[key]) projSessions[key] = new Set();
    if (e.sessionId) projSessions[key].add(e.sessionId);
  }
  const sessionsByProject = Object.entries(projSessions)
    .map(([slug, sessions]) => ({
      projectName: projCounts[slug]?.name ?? slug,
      projectSlug: slug,
      count: sessions.size,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    totalSessions,
    todaySessions,
    thisWeekSessions,
    avgEventsPerSession,
    topPages,
    topReferrers,
    sessionsByProject,
  };
}

export async function getRecentSessions(limit = 30): Promise<VisitorSession[]> {
  const events = await prisma.event.findMany({
    where: { sessionId: { not: null } },
    select: {
      sessionId: true,
      eventName: true,
      page: true,
      metadata: true,
      createdAt: true,
      project: { select: { name: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Group by sessionId
  const sessionMap = new Map<string, typeof events>();
  for (const e of events) {
    if (!e.sessionId) continue;
    const list = sessionMap.get(e.sessionId) ?? [];
    list.push(e);
    sessionMap.set(e.sessionId, list);
  }

  // Build session objects
  const sessions: VisitorSession[] = [];
  for (const [sessionId, evts] of sessionMap) {
    const sorted = evts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    const pages = [...new Set(sorted.filter((e) => e.page).map((e) => e.page!))];
    const eventNames = [...new Set(sorted.map((e) => e.eventName))];

    let referrer: string | null = null;
    let ua: string | null = null;
    for (const e of sorted) {
      try {
        const meta = typeof e.metadata === "string" ? JSON.parse(e.metadata) : e.metadata;
        if (meta?.referrer && !referrer) referrer = String(meta.referrer);
        if (meta?.ua && !ua) ua = String(meta.ua);
      } catch {}
    }

    const device = parseDevice(ua);

    sessions.push({
      sessionId,
      projectName: sorted[0].project.name,
      projectSlug: sorted[0].project.slug,
      firstSeen: sorted[0].createdAt,
      lastSeen: sorted[sorted.length - 1].createdAt,
      pageCount: pages.length,
      eventCount: evts.length,
      pages,
      events: eventNames,
      referrer,
      deviceType: device.type,
      deviceName: device.name,
    });
  }

  // Sort by last activity, take limit
  return sessions
    .sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime())
    .slice(0, limit);
}
