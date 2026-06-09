import { NextRequest, NextResponse } from "next/server";
import { ingestLeadSchema } from "@/lib/validations/lead";
import { getProjectByApiKey } from "@/lib/dal/projects";
import { createLead } from "@/lib/dal/leads";
import { createNotification } from "@/lib/dal/notifications";
import { sendPushToAll } from "@/lib/push";
import { isRateLimited } from "@/lib/rate-limit";

// CORS: allowlist via ALLOWED_ORIGINS, otherwise permissive (initial setup)
function getCorsHeaders(origin: string | null) {
  const allowed = process.env.ALLOWED_ORIGINS;
  if (allowed) {
    const list = allowed.split(",").map((s) => s.trim());
    return {
      "Access-Control-Allow-Origin": origin && list.includes(origin) ? origin : "",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
  }
  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

const MAX_BODY_SIZE = 8 * 1024;

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(origin) });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const cors = getCorsHeaders(origin);

  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: cors });
    }

    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > MAX_BODY_SIZE) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413, headers: cors });
    }

    const rawText = await request.text().catch(() => null);
    if (!rawText || rawText.length > MAX_BODY_SIZE) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400, headers: cors });
    }

    let body: unknown;
    try {
      body = JSON.parse(rawText);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400, headers: cors });
    }

    const parsed = ingestLeadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400, headers: cors });
    }

    const { apiKey, ...data } = parsed.data;
    const project = await getProjectByApiKey(apiKey);
    if (!project) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: cors });
    }
    if (project.status !== "ACTIVE") {
      return NextResponse.json({ error: "Project is not active" }, { status: 403, headers: cors });
    }

    const lead = await createLead({
      projectId: project.id,
      name: data.name,
      phone: data.phone,
      business: data.business ?? null,
      budget: data.budget ?? null,
      services: data.services ?? null,
      source: data.source ?? null,
      page: data.page ?? null,
      metadata: data.metadata ?? {},
    });

    // in-app notification (bell) + phone push — both non-blocking
    const summary = [data.name, data.phone, data.business].filter(Boolean).join(" · ");
    createNotification({
      type: "lead",
      title: "פנייה חדשה 🎯",
      body: summary,
      color: "emerald",
      metadata: { leadId: lead.id, phone: data.phone },
    }).catch(() => {});

    sendPushToAll({
      title: "פנייה חדשה 🎯",
      body: summary || "מישהו השאיר פרטים",
      url: "/leads",
    }).catch(() => {});

    return NextResponse.json({ success: true, leadId: lead.id }, { status: 201, headers: cors });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500, headers: cors });
  }
}
