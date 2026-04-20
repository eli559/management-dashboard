import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/api/events/ingest", "/api/auth/login", "/login"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public endpoints — no auth needed
  if (isPublicPath(pathname)) return NextResponse.next();

  // Static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg")
  ) {
    return NextResponse.next();
  }

  // No password configured — dev mode, allow all
  if (!process.env.DASHBOARD_PASSWORD) return NextResponse.next();

  // Check session cookie
  const session = request.cookies.get("dashboard_session");
  if (session?.value) return NextResponse.next();

  // Not authenticated — redirect to login
  const loginUrl = new URL("/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
