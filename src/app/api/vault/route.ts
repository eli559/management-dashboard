import { NextRequest, NextResponse } from "next/server";
import { getCredentials, createCredential } from "@/lib/dal/credentials";

function isAuth(r: NextRequest) { return !!r.cookies.get("dashboard_session")?.value; }

export async function GET(request: NextRequest) {
  if (!isAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projectId = request.nextUrl.searchParams.get("project") || undefined;
  const type = request.nextUrl.searchParams.get("type") || undefined;
  const creds = await getCredentials({ projectId, type });
  return NextResponse.json({ credentials: creds });
}

export async function POST(request: NextRequest) {
  if (!isAuth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body?.secret) {
    return NextResponse.json({ error: "סיסמה היא שדה חובה" }, { status: 400 });
  }

  const cred = await createCredential({
    projectId: body.projectId || null,
    type: body.type || "other",
    serviceName: body.serviceName || "גישה כללית",
    loginUrl: body.loginUrl || null,
    username: body.username || null,
    secret: body.secret,
    notes: body.notes || null,
  });

  return NextResponse.json({ success: true, id: cred.id }, { status: 201 });
}
