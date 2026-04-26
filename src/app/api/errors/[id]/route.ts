import { NextRequest, NextResponse } from "next/server";
import { updateErrorStatus } from "@/lib/dal/errors";

const VALID_STATUSES = ["open", "investigating", "resolved", "ignored"];

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

  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  await updateErrorStatus(id, status);
  return NextResponse.json({ success: true });
}
