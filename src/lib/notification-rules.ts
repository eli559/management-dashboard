import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/dal/notifications";
import { getEventLabel } from "@/lib/event-labels";

/**
 * Check notification rules after an event is created.
 * Runs async — does not block the ingest response.
 */
export async function checkNotificationRules(event: {
  eventName: string;
  projectId: string;
  sessionId?: string | null;
  page?: string | null;
}) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: event.projectId },
      select: { name: true },
    });
    const projectName = project?.name ?? "פרויקט";
    const eventLabel = getEventLabel(event.eventName);

    // ── Rule 1: WhatsApp / Instagram / Phone click ──
    if (["click_whatsapp", "click_instagram", "click_phone"].includes(event.eventName)) {
      const colors: Record<string, string> = {
        click_whatsapp: "emerald",
        click_instagram: "violet",
        click_phone: "blue",
      };
      await createNotification({
        type: "conversion",
        title: eventLabel,
        body: `מבקר ב-${projectName} ביצע: ${eventLabel}`,
        color: colors[event.eventName] ?? "blue",
      });
    }

    // ── Rule 2: Form submit ──
    if (event.eventName === "form_submit") {
      await createNotification({
        type: "conversion",
        title: "שליחת טופס",
        body: `טופס נשלח ב-${projectName}`,
        color: "amber",
      });
    }

    // ── Rule 3: Milestone — every 50 events for a project ──
    const eventCount = await prisma.event.count({ where: { projectId: event.projectId } });
    if (eventCount > 0 && eventCount % 50 === 0) {
      await createNotification({
        type: "milestone",
        title: `${eventCount} אירועים!`,
        body: `${projectName} הגיע ל-${eventCount} אירועים`,
        color: "amber",
      });
    }

    // ── Rule 4: New session (first event in session) ──
    if (event.sessionId) {
      const sessionEvents = await prisma.event.count({
        where: { sessionId: event.sessionId },
      });
      if (sessionEvents === 1) {
        await createNotification({
          type: "visitor",
          title: "מבקר חדש",
          body: `מבקר חדש נכנס ל-${projectName}${event.page && event.page !== "/" ? ` בעמוד ${event.page}` : ""}`,
          color: "blue",
        });
      }
    }
  } catch {
    // Never fail ingest because of notifications
  }
}
