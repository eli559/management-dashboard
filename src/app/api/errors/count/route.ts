import { NextRequest, NextResponse } from "next/server";
import { getNewErrorCount } from "@/lib/dal/errors";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!request.cookies.get("dashboard_session")?.value) {
    return NextResponse.json({ count: 0 });
  }
  const count = await getNewErrorCount();
  return NextResponse.json({ count });
}
