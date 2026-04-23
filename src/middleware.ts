import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/api/events/ingest", "/api/auth/login", "/login"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

// Security headers applied to all responses
const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static assets — pass through with headers
  if (
    pathname.startsWith("/_next") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg")
  ) {
    const res = NextResponse.next();
    for (const [k, v] of Object.entries(SECURITY_HEADERS)) res.headers.set(k, v);
    return res;
  }

  // Public endpoints — pass with headers
  if (isPublicPath(pathname)) {
    const res = NextResponse.next();
    for (const [k, v] of Object.entries(SECURITY_HEADERS)) res.headers.set(k, v);
    return res;
  }

  // Auth required for everything else
  if (!process.env.DASHBOARD_PASSWORD) {
    // No password = reject (don't allow open access)
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const session = request.cookies.get("dashboard_session");
  if (!session?.value) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated — add security headers
  const res = NextResponse.next();
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) res.headers.set(k, v);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
