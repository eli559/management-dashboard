import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEventLabel } from "@/lib/event-labels";
import { getPageLabel } from "@/lib/page-labels";

export const dynamic = "force-dynamic";

function isAuthenticated(request: NextRequest): boolean {
  return !!request.cookies.get("dashboard_session")?.value;
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projectId = request.nextUrl.searchParams.get("project") || undefined;

  const events = await prisma.event.findMany({
    where: projectId ? { projectId } : undefined,
    orderBy: { createdAt: "desc" },
    take: 10000,
    include: { project: { select: { name: true } } },
  });

  // BOM for Hebrew Excel compatibility
  const BOM = "\uFEFF";

  const headers = ["תאריך", "שעה", "פרויקט", "אירוע", "עמוד", "סשן", "משתמש", "ערך", "מטא-דאטה"];
  const rows = events.map((e) => {
    const d = new Date(e.createdAt);
    const date = d.toLocaleDateString("he-IL", { timeZone: "Asia/Jerusalem" });
    const time = d.toLocaleTimeString("he-IL", { timeZone: "Asia/Jerusalem", hour: "2-digit", minute: "2-digit" });

    return [
      date,
      time,
      e.project.name,
      getEventLabel(e.eventName),
      getPageLabel(e.page),
      e.sessionId ?? "",
      e.userIdentifier ?? "",
      e.value != null ? String(e.value) : "",
      e.metadata ?? "",
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",");
  });

  const csv = BOM + headers.join(",") + "\n" + rows.join("\n");

  const projectName = projectId
    ? events[0]?.project.name ?? "פרויקט"
    : "כל_הפרויקטים";

  const filename = `ייצוא_${projectName}_${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
