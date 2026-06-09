import { prisma } from "@/lib/prisma";

export async function saveSubscription(s: {
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent?: string | null;
}) {
  return prisma.pushSubscription.upsert({
    where: { endpoint: s.endpoint },
    update: { p256dh: s.p256dh, auth: s.auth, userAgent: s.userAgent ?? null },
    create: {
      endpoint: s.endpoint,
      p256dh: s.p256dh,
      auth: s.auth,
      userAgent: s.userAgent ?? null,
    },
  });
}

export async function getSubscriptions() {
  return prisma.pushSubscription.findMany();
}

export async function deleteSubscription(endpoint: string) {
  await prisma.pushSubscription.deleteMany({ where: { endpoint } });
}
