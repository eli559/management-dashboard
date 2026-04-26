import { prisma } from "@/lib/prisma";
import type { CreateProjectInput } from "@/lib/validations/project";

export async function getProjects() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { events: true } },
      events: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true },
      },
    },
  });

  return projects.map((p) => ({
    ...p,
    lastEventAt: p.events[0]?.createdAt ?? null,
    events: undefined,
  }));
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
  });
}

export async function getProjectByApiKey(apiKey: string) {
  return prisma.project.findUnique({
    where: { apiKey },
    select: { id: true, status: true },
  });
}

export async function createProject(
  data: CreateProjectInput & { apiKey: string; websiteUrl?: string | null; techType?: string }
) {
  return prisma.project.create({
    data: {
      name: data.name,
      slug: data.slug,
      type: data.type,
      description: data.description ?? null,
      websiteUrl: data.websiteUrl ?? null,
      techType: data.techType ?? "js",
      apiKey: data.apiKey,
    },
  });
}

export async function getProjectCount() {
  return prisma.project.count();
}
