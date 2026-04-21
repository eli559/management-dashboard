import { NextResponse } from "next/server";
import { getUnreadNotifications, getUnreadCount, markAllAsRead } from "@/lib/dal/notifications";

export const dynamic = "force-dynamic";

export async function GET() {
  const [notifications, count] = await Promise.all([
    getUnreadNotifications(15),
    getUnreadCount(),
  ]);
  return NextResponse.json({ notifications, count });
}

export async function POST() {
  await markAllAsRead();
  return NextResponse.json({ success: true });
}
