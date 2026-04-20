import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body?.email || !body?.password) {
      return NextResponse.json({ error: "חסרים פרטים" }, { status: 400 });
    }

    const validEmail = process.env.DASHBOARD_EMAIL ?? "admin@dashboard.com";
    const validPassword = process.env.DASHBOARD_PASSWORD;

    if (!validPassword) {
      return NextResponse.json({ error: "לא הוגדרה סיסמה" }, { status: 500 });
    }

    if (body.email !== validEmail || body.password !== validPassword) {
      return NextResponse.json(
        { error: "אימייל או סיסמה שגויים" },
        { status: 401 }
      );
    }

    const token = Buffer.from(`${Date.now()}-${validEmail}`).toString(
      "base64url"
    );

    const response = NextResponse.json({ success: true });
    response.cookies.set("dashboard_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
