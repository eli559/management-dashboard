import { prisma } from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/encryption";

export interface CredentialInput {
  projectId?: string | null;
  type: string;
  serviceName: string;
  loginUrl?: string | null;
  username?: string | null;
  secret: string;
  notes?: string | null;
}

export async function createCredential(data: CredentialInput) {
  const cred = await prisma.accessCredential.create({
    data: {
      projectId: data.projectId ?? null,
      type: data.type,
      serviceName: data.serviceName,
      loginUrl: data.loginUrl ?? null,
      username: data.username ?? null,
      encryptedSecret: encrypt(data.secret),
      notes: data.notes ?? null,
    },
  });

  await logAction(cred.id, "create");
  return cred;
}

export async function updateCredential(id: string, data: Partial<CredentialInput>) {
  const updateData: Record<string, unknown> = {};
  if (data.projectId !== undefined) updateData.projectId = data.projectId;
  if (data.type !== undefined) updateData.type = data.type;
  if (data.serviceName !== undefined) updateData.serviceName = data.serviceName;
  if (data.loginUrl !== undefined) updateData.loginUrl = data.loginUrl;
  if (data.username !== undefined) updateData.username = data.username;
  if (data.notes !== undefined) updateData.notes = data.notes;
  if (data.secret) updateData.encryptedSecret = encrypt(data.secret);

  const cred = await prisma.accessCredential.update({ where: { id }, data: updateData });
  await logAction(id, "update");
  return cred;
}

export async function deleteCredential(id: string) {
  await logAction(id, "delete");
  return prisma.accessCredential.delete({ where: { id } });
}

export async function getCredentials(filters?: { projectId?: string; type?: string }) {
  const where: Record<string, unknown> = {};
  if (filters?.projectId) where.projectId = filters.projectId;
  if (filters?.type) where.type = filters.type;

  return prisma.accessCredential.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      projectId: true,
      type: true,
      serviceName: true,
      loginUrl: true,
      username: true,
      // NOTE: encryptedSecret NOT returned in list
      notes: true,
      lastViewedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function viewSecret(id: string): Promise<string> {
  const cred = await prisma.accessCredential.findUnique({
    where: { id },
    select: { encryptedSecret: true },
  });
  if (!cred) throw new Error("Not found");

  await prisma.accessCredential.update({ where: { id }, data: { lastViewedAt: new Date() } });
  await logAction(id, "view");

  return decrypt(cred.encryptedSecret);
}

export async function copySecret(id: string): Promise<string> {
  const secret = await viewSecret(id);
  await logAction(id, "copy");
  return secret;
}

async function logAction(credentialId: string, action: string) {
  try {
    await prisma.credentialAuditLog.create({
      data: { credentialId, action },
    });
  } catch {
    // Don't fail main operation if audit fails
  }
}

export async function getAuditLogs(credentialId: string) {
  return prisma.credentialAuditLog.findMany({
    where: { credentialId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}
