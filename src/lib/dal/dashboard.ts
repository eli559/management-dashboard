import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const now = new Date();
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const [totalProjects, totalEvents, todayEvents, recentEvents] =
    await Promise.all([
      prisma.project.count(),
      prisma.event.count(),
      prisma.event.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.event.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        include: {
          project: { select: { name: true, slug: true } },
        },
      }),
    ]);

  return {
    totalProjects,
    totalEvents,
    todayEvents,
    recentEvents,
  };
}
