import { NextRequest, NextResponse } from "next/server";
import { ingestEventSchema } from "@/lib/validations/event";
import { getProjectByApiKey } from "@/lib/dal/projects";
import { createEvent } from "@/lib/dal/events";
import { isRateLimited } from "@/lib/rate-limit";
import { checkNotificationRules } from "@/lib/notification-rules";

// CORS: allow specific origins or all (configure via env)
function getCorsHeaders(origin: string | null) {
  const allowed = process.env.ALLOWED_ORIGINS;
  const allowedList = allowed ? allowed.split(",").map((s) => s.trim()) : null;

  const allowOrigin =
    !allowedList || (origin && allowedList.includes(origin)) ? origin ?? "*" : "";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

// Max body size: 8KB
const MAX_BODY_SIZE = 8 * 1024;

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(origin) });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  try {
    // ── Rate limiting ──
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: corsHeaders }
      );
    }

    // ── Body size check ──
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > MAX_BODY_SIZE) {
      return NextResponse.json(
        { error: "Payload too large" },
        { status: 413, headers: corsHeaders }
      );
    }

    // ── Parse body ──
    const rawText = await request.text().catch(() => null);
    if (!rawText || rawText.length > MAX_BODY_SIZE) {
      return NextResponse.json(
        { error: "Invalid or oversized body" },
        { status: 400, headers: corsHeaders }
      );
    }

    let body: unknown;
    try {
      body = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400, headers: corsHeaders }
      );
    }

    // ── Validate ──
    const parsed = ingestEventSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten().fieldErrors },
        { status: 400, headers: corsHeaders }
      );
    }

    // ── Auth ──
    const { apiKey, ...eventData } = parsed.data;

    const project = await getProjectByApiKey(apiKey);
    if (!project) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401, headers: corsHeaders }
      );
    }

    if (project.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Project is not active" },
        { status: 403, headers: corsHeaders }
      );
    }

    // ── Save ──
    const event = await createEvent({
      projectId: project.id,
      eventName: eventData.eventName,
      sessionId: eventData.sessionId ?? null,
      userIdentifier: eventData.userIdentifier ?? null,
      page: eventData.page ?? null,
      value: eventData.value ?? null,
      metadata: eventData.metadata ?? {},
    });

    // ── Notifications (async, non-blocking) ──
    checkNotificationRules({
      eventName: eventData.eventName,
      projectId: project.id,
      sessionId: eventData.sessionId ?? null,
      page: eventData.page ?? null,
    }).catch(() => {});

    return NextResponse.json(
      { success: true, eventId: event.id },
      { status: 201, headers: corsHeaders }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
