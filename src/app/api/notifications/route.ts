import { NextRequest, NextResponse } from "next/server";
import { getUnreadNotifications, getUnreadCount, markAllAsRead } from "@/lib/dal/notifications";

export const dynamic = "force-dynamic";

function isAuthenticated(request: NextRequest): boolean {
  return !!request.cookies.get("dashboard_session")?.value;
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const [notifications, count] = await Promise.all([
    getUnreadNotifications(15),
    getUnreadCount(),
  ]);
  return NextResponse.json({ notifications, count });
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await markAllAsRead();
  return NextResponse.json({ success: true });
}
