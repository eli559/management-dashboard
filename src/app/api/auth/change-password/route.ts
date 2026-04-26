import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  if (!request.cookies.get("dashboard_session")?.value) {
    return NextResponse.json({ error: "לא מורשה" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.currentPassword || !body?.newPassword) {
    return NextResponse.json({ error: "חסרים פרטים" }, { status: 400 });
  }

  if (body.newPassword.length < 6) {
    return NextResponse.json({ error: "הסיסמה החדשה חייבת להכיל לפחות 6 תווים" }, { status: 400 });
  }

  const email = "admin@dashboard.com";
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: "משתמש לא נמצא" }, { status: 404 });
  }

  const valid = await bcrypt.compare(body.currentPassword, user.password);
  if (!valid) {
    return NextResponse.json({ error: "הסיסמה הנוכחית שגויה" }, { status: 401 });
  }

  const newHash = await bcrypt.hash(body.newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: newHash },
  });

  return NextResponse.json({ success: true, message: "הסיסמה שונתה בהצלחה" });
}
