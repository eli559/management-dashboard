import { NextRequest, NextResponse } from "next/server";
import { viewSecret, updateCredential, deleteCredential } from "@/lib/dal/credentials";

function isAuth(r: NextRequest) { return !!r.cookies.get("dashboard_session")?.value; }

// GET = decrypt and return secret
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const action = request.nextUrl.searchParams.get("action"); // "view" or "copy"

  try {
    const secret = await viewSecret(id);
    return NextResponse.json({ secret });
  } catch {
    return NextResponse.json({ error: "לא נמצא" }, { status: 404 });
  }
}

// PATCH = update
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  await updateCredential(id, body);
  return NextResponse.json({ success: true });
}

// DELETE
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  await deleteCredential(id);
  return NextResponse.json({ success: true });
}
