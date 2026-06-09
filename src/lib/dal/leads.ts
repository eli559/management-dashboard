import { prisma } from "@/lib/prisma";

export async function createLead(data: {
  projectId?: string | null;
  name: string;
  phone: string;
  business?: string | null;
  budget?: string | null;
  services?: string | null;
  source?: string | null;
  page?: string | null;
  metadata?: Record<string, unknown>;
}) {
  return prisma.lead.create({
    data: {
      projectId: data.projectId ?? null,
      name: data.name,
      phone: data.phone,
      business: data.business ?? null,
      budget: data.budget ?? null,
      services: data.services ?? null,
      source: data.source ?? null,
      page: data.page ?? null,
      metadata: JSON.stringify(data.metadata ?? {}),
    },
  });
}

export async function getLeads(limit = 200) {
  return prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: limit });
}

export async function getNewLeadCount() {
  return prisma.lead.count({ where: { status: "new" } });
}

export async function updateLeadStatus(id: string, status: string) {
  await prisma.lead.update({ where: { id }, data: { status } });
}
