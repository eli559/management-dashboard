import { NextResponse } from "next/server";
import { getPublicKey } from "@/lib/push";

export const dynamic = "force-dynamic";

// Public VAPID key is not secret — the client needs it to subscribe.
export async function GET() {
  const key = getPublicKey();
  if (!key) {
    return NextResponse.json({ error: "Push not configured" }, { status: 503 });
  }
  return NextResponse.json({ publicKey: key });
}
