import { NextRequest, NextResponse } from "next/server";
import { ingestEventSchema } from "@/lib/validations/event";
import { getProjectByApiKey } from "@/lib/dal/projects";
import { createEvent } from "@/lib/dal/events";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const parsed = ingestEventSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid payload",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { apiKey, ...eventData } = parsed.data;

    const project = await getProjectByApiKey(apiKey);
    if (!project) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }

    if (project.status !== "ACTIVE") {
      return NextResponse.json(
        { error: "Project is not active" },
        { status: 403 }
      );
    }

    const event = await createEvent({
      projectId: project.id,
      eventName: eventData.eventName,
      sessionId: eventData.sessionId ?? null,
      userIdentifier: eventData.userIdentifier ?? null,
      page: eventData.page ?? null,
      value: eventData.value ?? null,
      metadata: eventData.metadata ?? {},
    });

    return NextResponse.json(
      { success: true, eventId: event.id },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
