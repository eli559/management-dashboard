import { prisma } from "@/lib/prisma";
import type { CreateProjectInput } from "@/lib/validations/project";

export async function getProjects() {
  return prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { events: true } },
    },
  });
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
  data: CreateProjectInput & { apiKey: string }
) {
  return prisma.project.create({
    data: {
      name: data.name,
      slug: data.slug,
      type: data.type,
      description: data.description ?? null,
      apiKey: data.apiKey,
    },
  });
}

export async function getProjectCount() {
  return prisma.project.count();
}
