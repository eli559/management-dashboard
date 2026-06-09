import { NextRequest, NextResponse } from "next/server";
import { saveSubscription, deleteSubscription } from "@/lib/dal/push";

export const dynamic = "force-dynamic";

function isAuthenticated(request: NextRequest): boolean {
  return !!request.cookies.get("dashboard_session")?.value;
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const sub = body?.subscription ?? body;
    const endpoint = sub?.endpoint;
    const p256dh = sub?.keys?.p256dh;
    const auth = sub?.keys?.auth;
    if (!endpoint || !p256dh || !auth) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }
    await saveSubscription({
      endpoint,
      p256dh,
      auth,
      userAgent: request.headers.get("user-agent"),
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const endpoint = body?.endpoint;
    if (endpoint) await deleteSubscription(endpoint);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
