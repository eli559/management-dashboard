import { prisma } from "@/lib/prisma";

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  color: string;
  read: boolean;
  createdAt: Date;
}

export async function getUnreadNotifications(limit = 10): Promise<NotificationItem[]> {
  return prisma.notification.findMany({
    where: { read: false },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getUnreadCount(): Promise<number> {
  return prisma.notification.count({ where: { read: false } });
}

export async function markAsRead(id: string): Promise<void> {
  await prisma.notification.update({
    where: { id },
    data: { read: true },
  });
}

export async function markAllAsRead(): Promise<void> {
  await prisma.notification.updateMany({
    where: { read: false },
    data: { read: true },
  });
}

export async function createNotification(data: {
  type: string;
  title: string;
  body: string;
  color?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  await prisma.notification.create({
    data: {
      type: data.type,
      title: data.title,
      body: data.body,
      color: data.color ?? "blue",
      metadata: JSON.stringify(data.metadata ?? {}),
    },
  });
}
