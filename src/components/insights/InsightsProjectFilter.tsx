"use client";

import { useRouter } from "next/navigation";

interface Props {
  projects: { id: string; name: string }[];
  currentProjectId?: string;
}

export function InsightsProjectFilter({ projects, currentProjectId }: Props) {
  const router = useRouter();

  return (
    <select
      value={currentProjectId ?? ""}
      onChange={(e) => {
        const val = e.target.value;
        router.push(val ? `/insights?project=${val}` : "/insights");
      }}
      className="px-3 py-2.5 bg-white/[0.04] border border-white/[0.1] rounded-xl text-[13px] text-zinc-200 focus:outline-none focus:ring-1 focus:ring-sky-500/30 cursor-pointer tap-scale"
    >
      <option value="">כל הפרויקטים</option>
      {projects.map((p) => (
        <option key={p.id} value={p.id}>{p.name}</option>
      ))}
    </select>
  );
}
