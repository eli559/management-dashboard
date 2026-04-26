import { NextRequest, NextResponse } from "next/server";
import { markErrorResolved, markErrorInvestigating } from "@/lib/dal/errors";

function isAuthenticated(request: NextRequest): boolean {
  return !!request.cookies.get("dashboard_session")?.value;
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const status = body?.status;

  if (status === "resolved") {
    await markErrorResolved(id);
  } else if (status === "investigating") {
    await markErrorInvestigating(id);
  } else {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
