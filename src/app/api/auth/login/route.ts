import { NextRequest, NextResponse } from "next/server";
import { randomBytes, timingSafeEqual } from "crypto";
import { isRateLimited } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // ── Rate limit login attempts ──
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ?? "unknown";

    if (isRateLimited(`login:${ip}`)) {
      return NextResponse.json(
        { error: "יותר מדי ניסיונות. נסה שוב מאוחר יותר." },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body?.email || !body?.password) {
      return NextResponse.json({ error: "חסרים פרטים" }, { status: 400 });
    }

    const validEmail = process.env.DASHBOARD_EMAIL ?? "admin@dashboard.com";
    const validPassword = process.env.DASHBOARD_PASSWORD;

    if (!validPassword) {
      return NextResponse.json({ error: "שגיאת הגדרות" }, { status: 500 });
    }

    // ── Timing-safe comparison ──
    const emailMatch =
      body.email.length === validEmail.length &&
      timingSafeEqual(Buffer.from(body.email), Buffer.from(validEmail));

    const passwordMatch =
      body.password.length === validPassword.length &&
      timingSafeEqual(Buffer.from(body.password), Buffer.from(validPassword));

    if (!emailMatch || !passwordMatch) {
      return NextResponse.json(
        { error: "אימייל או סיסמה שגויים" },
        { status: 401 }
      );
    }

    // ── Cryptographically secure token ──
    const token = randomBytes(32).toString("hex");

    const response = NextResponse.json({ success: true });
    response.cookies.set("dashboard_session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });

    return response;
  } catch {
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
