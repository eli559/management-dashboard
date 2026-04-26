import { prisma } from "@/lib/prisma";
import { parseDevice } from "@/lib/device-parser";
import { createHash } from "crypto";

function parseBrowser(ua: string | null): string {
  if (!ua) return "לא ידוע";
  const s = ua.toLowerCase();
  if (s.includes("chrome") && !s.includes("edg")) return "Chrome";
  if (s.includes("firefox")) return "Firefox";
  if (s.includes("safari") && !s.includes("chrome")) return "Safari";
  if (s.includes("edg")) return "Edge";
  return "אחר";
}

function fingerprint(projectId: string, message: string, page: string | null): string {
  return createHash("md5").update(`${projectId}:${message}:${page ?? ""}`).digest("hex").substring(0, 16);
}

function calcSeverity(message: string, isUnhandled: boolean): string {
  const m = message.toLowerCase();
  if (isUnhandled || m.includes("uncaught") || m.includes("unhandled")) return "high";
  if (m.includes("typeerror") || m.includes("referenceerror") || m.includes("syntaxerror")) return "medium";
  if (m.includes("network") || m.includes("fetch") || m.includes("cors")) return "high";
  return "low";
}

export async function createError(data: {
  projectId: string;
  message: string;
  stack?: string | null;
  page?: string | null;
  sessionId?: string | null;
  userAgent?: string | null;
  isUnhandled?: boolean;
}) {
  const fp = fingerprint(data.projectId, data.message, data.page ?? null);
  const device = parseDevice(data.userAgent);
  const browser = parseBrowser(data.userAgent ?? null);
  const severity = calcSeverity(data.message, data.isUnhandled ?? false);

  // Dedup: if same fingerprint in last hour, increment count
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const existing = await prisma.projectError.findFirst({
    where: { fingerprint: fp, createdAt: { gte: hourAgo } },
    orderBy: { createdAt: "desc" },
  });

  if (existing) {
    await prisma.projectError.update({
      where: { id: existing.id },
      data: { count: { increment: 1 }, updatedAt: new Date() },
    });
    return existing;
  }

  return prisma.projectError.create({
    data: {
      projectId: data.projectId,
      message: data.message.substring(0, 1000),
      stack: data.stack?.substring(0, 3000) ?? null,
      page: data.page ?? null,
      severity,
      status: "new",
      sessionId: data.sessionId ?? null,
      userAgent: data.userAgent?.substring(0, 300) ?? null,
      deviceType: device.type,
      deviceName: device.name,
      browser,
      fingerprint: fp,
    },
  });
}

export async function getErrors(filters?: { projectId?: string; severity?: string; status?: string }) {
  const where: Record<string, unknown> = {};
  if (filters?.projectId) where.projectId = filters.projectId;
  if (filters?.severity) where.severity = filters.severity;
  if (filters?.status) where.status = filters.status;

  return prisma.projectError.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { project: { select: { name: true, slug: true } } },
  });
}

export async function getErrorStats() {
  const now = new Date();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [total, newErrors, critical, projectsWithErrors] = await Promise.all([
    prisma.projectError.count(),
    prisma.projectError.count({ where: { status: "new" } }),
    prisma.projectError.count({ where: { severity: { in: ["critical", "high"] } } }),
    prisma.projectError.findMany({
      where: { status: "new" },
      distinct: ["projectId"],
      select: { projectId: true },
    }),
  ]);

  return { total, newErrors, critical, projectsWithErrors: projectsWithErrors.length };
}

export async function getNewErrorCount(): Promise<number> {
  return prisma.projectError.count({ where: { status: "new" } });
}

export async function markErrorResolved(id: string) {
  return prisma.projectError.update({
    where: { id },
    data: { status: "resolved" },
  });
}

export async function markErrorInvestigating(id: string) {
  return prisma.projectError.update({
    where: { id },
    data: { status: "investigating" },
  });
}
