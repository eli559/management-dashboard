import { prisma } from "@/lib/prisma";
import { getCredentials } from "@/lib/dal/credentials";
import { VaultClient } from "@/components/vault/VaultClient";

export const dynamic = "force-dynamic";

export default async function VaultPage() {
  const [credentials, projects] = await Promise.all([
    getCredentials(),
    prisma.project.findMany({ select: { id: true, name: true } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="animate-slide-up stagger-1">
        <h1 className="text-[22px] font-bold text-white">כספת גישות</h1>
        <p className="text-zinc-300 mt-0.5 text-[14px]">ניהול מאובטח של פרטי גישה לפרויקטים</p>
      </div>

      <div className="animate-slide-up stagger-2">
        <VaultClient
          credentials={credentials.map((c) => ({ ...c, createdAt: c.createdAt.toISOString(), updatedAt: c.updatedAt.toISOString(), lastViewedAt: c.lastViewedAt?.toISOString() ?? null }))}
          projects={projects}
        />
      </div>
    </div>
  );
}
