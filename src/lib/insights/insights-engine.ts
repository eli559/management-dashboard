import { prisma } from "@/lib/prisma";
import { getEventLabel } from "@/lib/event-labels";
import { getPageLabel } from "@/lib/page-labels";

export type InsightSeverity = "critical" | "warning" | "success" | "info";
export type InsightType = "no_activity" | "high_activity" | "drop" | "rise" | "top_event" | "top_page" | "top_project" | "low_data";

export interface Insight {
  id: string;
  title: string;
  description: string;
  recommendation: string;
  severity: InsightSeverity;
  type: InsightType;
  projectId: string | null;
  projectName: string | null;
  metricValue: number | null;
  calculatedAt: Date;
}

function makeId(type: string, projectId?: string): string {
  return `${type}_${projectId ?? "all"}_${Date.now()}`;
}

export async function generateInsights(projectFilter?: string): Promise<Insight[]> {
  const now = new Date();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const projects = await prisma.project.findMany({
    where: projectFilter ? { id: projectFilter } : undefined,
    select: { id: true, name: true, slug: true },
  });

  const insights: Insight[] = [];

  for (const project of projects) {
    const pid = project.id;

    // Counts
    const [last24h, prev24h, lastWeek, prevWeek, total] = await Promise.all([
      prisma.event.count({ where: { projectId: pid, createdAt: { gte: dayAgo } } }),
      prisma.event.count({ where: { projectId: pid, createdAt: { gte: twoDaysAgo, lt: dayAgo } } }),
      prisma.event.count({ where: { projectId: pid, createdAt: { gte: weekAgo } } }),
      prisma.event.count({ where: { projectId: pid, createdAt: { gte: twoWeeksAgo, lt: weekAgo } } }),
      prisma.event.count({ where: { projectId: pid } }),
    ]);

    // ── Rule 1: No activity (24h) ──
    if (last24h === 0 && total > 0) {
      insights.push({
        id: makeId("no_activity", pid),
        title: "אין פעילות",
        description: `${project.name} לא קיבל אירועים ב-24 השעות האחרונות`,
        recommendation: "בדוק שה-tracking מותקן ושהאתר פעיל",
        severity: "warning",
        type: "no_activity",
        projectId: pid,
        projectName: project.name,
        metricValue: 0,
        calculatedAt: now,
      });
    }

    // ── Rule 2: High activity ──
    if (prev24h > 0 && last24h > prev24h * 2 && last24h > 10) {
      insights.push({
        id: makeId("high_activity", pid),
        title: "פעילות גבוהה",
        description: `${project.name} קיבל ${last24h} אירועים ב-24 שעות — פי ${Math.round(last24h / prev24h)} מאתמול`,
        recommendation: "כדאי לבדוק מה גרם לעלייה — אולי קמפיין או קישור חדש",
        severity: "success",
        type: "high_activity",
        projectId: pid,
        projectName: project.name,
        metricValue: last24h,
        calculatedAt: now,
      });
    }

    // ── Rule 3: Activity drop (week over week) ──
    if (prevWeek > 10 && lastWeek < prevWeek * 0.5) {
      const dropPct = Math.round((1 - lastWeek / prevWeek) * 100);
      insights.push({
        id: makeId("drop", pid),
        title: "ירידה בפעילות",
        description: `${project.name} — ירידה של ${dropPct}% בפעילות השבועית (${lastWeek} מול ${prevWeek})`,
        recommendation: "בדוק אם יש בעיה טכנית באתר או שינוי בתנועה",
        severity: "critical",
        type: "drop",
        projectId: pid,
        projectName: project.name,
        metricValue: dropPct,
        calculatedAt: now,
      });
    }

    // ── Rule 4: Activity rise (week over week) ──
    if (prevWeek > 5 && lastWeek > prevWeek * 1.5 && lastWeek > 10) {
      const risePct = Math.round((lastWeek / prevWeek - 1) * 100);
      insights.push({
        id: makeId("rise", pid),
        title: "עלייה בפעילות",
        description: `${project.name} — עלייה של ${risePct}% בפעילות השבועית (${lastWeek} מול ${prevWeek})`,
        recommendation: "מגמה חיובית! כדאי לבדוק מאיפה מגיעים המבקרים",
        severity: "success",
        type: "rise",
        projectId: pid,
        projectName: project.name,
        metricValue: risePct,
        calculatedAt: now,
      });
    }

    // ── Rule 5: Top event type ──
    if (total > 5) {
      const events = await prisma.event.findMany({
        where: { projectId: pid },
        select: { eventName: true },
      });
      const counts: Record<string, number> = {};
      for (const e of events) counts[e.eventName] = (counts[e.eventName] ?? 0) + 1;
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      if (sorted.length > 0) {
        const [topName, topCount] = sorted[0];
        const pct = Math.round((topCount / total) * 100);
        if (pct > 60) {
          insights.push({
            id: makeId("top_event", pid),
            title: "אירוע דומיננטי",
            description: `ב-${project.name}, ${pct}% מהאירועים הם "${getEventLabel(topName)}"`,
            recommendation: pct > 90 ? "רוב הפעילות מסוג אחד — שקול להרחיב מעקב" : "התפלגות סבירה",
            severity: "info",
            type: "top_event",
            projectId: pid,
            projectName: project.name,
            metricValue: pct,
            calculatedAt: now,
          });
        }
      }
    }

    // ── Rule 6: Top page ──
    if (total > 5) {
      const pages = await prisma.event.findMany({
        where: { projectId: pid, page: { not: null } },
        select: { page: true },
      });
      const pageCounts: Record<string, number> = {};
      for (const e of pages) if (e.page) pageCounts[e.page] = (pageCounts[e.page] ?? 0) + 1;
      const topPage = Object.entries(pageCounts).sort((a, b) => b[1] - a[1])[0];
      if (topPage) {
        insights.push({
          id: makeId("top_page", pid),
          title: "עמוד מוביל",
          description: `העמוד הנצפה ביותר ב-${project.name}: "${getPageLabel(topPage[0])}" (${topPage[1]} צפיות)`,
          recommendation: "זה העמוד שמושך הכי הרבה תנועה — ודא שהוא ממיר",
          severity: "info",
          type: "top_page",
          projectId: pid,
          projectName: project.name,
          metricValue: topPage[1],
          calculatedAt: now,
        });
      }
    }

    // ── Rule 7: Low data ──
    if (total > 0 && total < 5) {
      insights.push({
        id: makeId("low_data", pid),
        title: "מעט נתונים",
        description: `${project.name} — רק ${total} אירועים בסך הכל. אין מספיק נתונים לניתוח מעמיק`,
        recommendation: "ודא שה-tracking מותקן ושיש תנועה לאתר",
        severity: "warning",
        type: "low_data",
        projectId: pid,
        projectName: project.name,
        metricValue: total,
        calculatedAt: now,
      });
    }
  }

  // ── Rule 8: Top project (global only) ──
  if (!projectFilter && projects.length > 1) {
    const projectCounts = await Promise.all(
      projects.map(async (p) => ({
        ...p,
        count: await prisma.event.count({ where: { projectId: p.id, createdAt: { gte: weekAgo } } }),
      }))
    );
    const top = projectCounts.sort((a, b) => b.count - a.count)[0];
    if (top && top.count > 0) {
      insights.push({
        id: makeId("top_project"),
        title: "פרויקט מוביל",
        description: `${top.name} הוא הפרויקט הפעיל ביותר השבוע עם ${top.count} אירועים`,
        recommendation: "כדאי להתמקד בפרויקט הזה ולנתח את הנתונים",
        severity: "info",
        type: "top_project",
        projectId: top.id,
        projectName: top.name,
        metricValue: top.count,
        calculatedAt: now,
      });
    }
  }

  // Sort: critical first, then warning, success, info
  const order: Record<InsightSeverity, number> = { critical: 0, warning: 1, success: 2, info: 3 };
  insights.sort((a, b) => order[a.severity] - order[b.severity]);

  return insights;
}
