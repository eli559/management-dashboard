import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware: protects all routes EXCEPT the public ingest endpoint.
 *
 * /api/events/ingest — open to the world (POST + OPTIONS only)
 * Everything else — requires DASHBOARD_PASSWORD via basic auth
 */

const PUBLIC_PATHS = ["/api/events/ingest"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p);
}

function unauthorized() {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Dashboard"',
    },
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Public ingest endpoint — allow without auth ──
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // ── Static assets and Next.js internals — skip ──
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.endsWith(".ico") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg")
  ) {
    return NextResponse.next();
  }

  // ── Dashboard password protection ──
  const password = process.env.DASHBOARD_PASSWORD;
  if (!password) {
    // No password set — allow access (dev mode)
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return unauthorized();
  }

  try {
    const base64 = authHeader.split(" ")[1];
    const decoded = atob(base64);
    const [, pwd] = decoded.split(":");

    if (pwd !== password) {
      return unauthorized();
    }
  } catch {
    return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
