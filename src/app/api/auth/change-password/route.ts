import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

export async function POST(request: NextRequest) {
  if (!request.cookies.get("dashboard_session")?.value) {
    return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.currentPassword || !body?.newPassword) {
    return NextResponse.json({ error: "חסרים פרטים" }, { status: 400 });
  }

  const currentValid = process.env.DASHBOARD_PASSWORD;
  if (!currentValid) {
    return NextResponse.json({ error: "שגיאת הגדרות" }, { status: 500 });
  }

  // Verify current password
  const match =
    body.currentPassword.length === currentValid.length &&
    timingSafeEqual(Buffer.from(body.currentPassword), Buffer.from(currentValid));

  if (!match) {
    return NextResponse.json({ error: "הסיסמה הנוכחית שגויה" }, { status: 401 });
  }

  if (body.newPassword.length < 6) {
    return NextResponse.json({ error: "הסיסמה החדשה חייבת להכיל לפחות 6 תווים" }, { status: 400 });
  }

  // Note: This updates the env var at runtime but won't persist across deploys.
  // For persistent change, update Cloud Run env var.
  process.env.DASHBOARD_PASSWORD = body.newPassword;

  return NextResponse.json({
    success: true,
    message: "הסיסמה שונתה בהצלחה. לשינוי קבוע, עדכן את משתנה הסביבה DASHBOARD_PASSWORD ב-Cloud Run.",
  });
}
