import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isRateLimited } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
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
    if (!body?.password) {
      return NextResponse.json({ error: "חסרים פרטים" }, { status: 400 });
    }

    const email = body.email ?? "admin@dashboard.com";

    // Try DB first
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      const valid = await bcrypt.compare(body.password, user.password);
      if (!valid) {
        return NextResponse.json({ error: "סיסמה שגויה" }, { status: 401 });
      }

      // Update last login
      await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });
    } else {
      // Fallback to env var (for first run before bootstrap)
      const envPassword = process.env.DASHBOARD_PASSWORD;
      if (!envPassword || body.password !== envPassword) {
        return NextResponse.json({ error: "סיסמה שגויה" }, { status: 401 });
      }
    }

    const token = randomBytes(32).toString("hex");

    const response = NextResponse.json({ success: true });
    response.cookies.set("dashboard_session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "שגיאת שרת" }, { status: 500 });
  }
}
