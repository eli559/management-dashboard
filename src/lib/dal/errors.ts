import { prisma } from "@/lib/prisma";
import { parseDevice } from "@/lib/device-parser";
import { createHash } from "crypto";

// Statuses: open, investigating, resolved, ignored
// Hebrew: פתוח, בטיפול, טופל, התעלם

function parseBrowser(ua: string | null): string {
  if (!ua) return "לא ידוע";
  const s = ua.toLowerCase();
  if (s.includes("chrome") && !s.includes("edg")) return "Chrome";
  if (s.includes("firefox")) return "Firefox";
  if (s.includes("safari") && !s.includes("chrome")) return "Safari";
  if (s.includes("edg")) return "Edge";
  return "אחר";
}

function makeFingerprint(projectId: string, message: string, page: string | null): string {
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
  const fp = makeFingerprint(data.projectId, data.message, data.page ?? null);
  const device = parseDevice(data.userAgent);
  const browser = parseBrowser(data.userAgent ?? null);
  const severity = calcSeverity(data.message, data.isUnhandled ?? false);
  const now = new Date();

  // Find existing issue by fingerprint (any time, not just last hour)
  const existing = await prisma.projectError.findFirst({
    where: { fingerprint: fp },
    orderBy: { createdAt: "desc" },
  });

  if (existing) {
    const updateData: Record<string, unknown> = {
      count: { increment: 1 },
      updatedAt: now,
    };

    // If was resolved/ignored and error comes back → reopen
    if (existing.status === "resolved" || existing.status === "ignored") {
      updateData.status = "open";
      updateData.metadata = JSON.stringify({ reopened: true, previousStatus: existing.status, reopenedAt: now.toISOString() });
    }

    await prisma.projectError.update({
      where: { id: existing.id },
      data: updateData,
    });
    return existing;
  }

  // New error issue
  return prisma.projectError.create({
    data: {
      projectId: data.projectId,
      message: data.message.substring(0, 1000),
      stack: data.stack?.substring(0, 3000) ?? null,
      page: data.page ?? null,
      severity,
      status: "open",
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

  // Default: show open + investigating. "all" = no filter.
  if (filters?.status && filters.status !== "all") {
    where.status = filters.status;
  } else if (!filters?.status) {
    where.status = { in: ["open", "new", "investigating"] };
  }

  return prisma.projectError.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    take: 200,
    include: { project: { select: { name: true, slug: true } } },
  });
}

export async function getErrorStats() {
  const [total, openErrors, critical, projectsWithErrors] = await Promise.all([
    prisma.projectError.count(),
    prisma.projectError.count({ where: { status: "open" } }),
    prisma.projectError.count({ where: { severity: { in: ["critical", "high"] }, status: { in: ["open", "investigating"] } } }),
    prisma.projectError.findMany({
      where: { status: "open" },
      distinct: ["projectId"],
      select: { projectId: true },
    }),
  ]);

  return { total, openErrors, critical, projectsWithErrors: projectsWithErrors.length };
}

export async function getOpenErrorCount(): Promise<number> {
  return prisma.projectError.count({ where: { status: "open" } });
}

export async function updateErrorStatus(id: string, status: string) {
  return prisma.projectError.update({
    where: { id },
    data: { status, updatedAt: new Date() },
  });
}
