"use client";

import { useState } from "react";
import { FolderKanban } from "lucide-react";
import { ProjectCard } from "@/features/projects/components/ProjectCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProjectsPageHeader } from "./ProjectsPageHeader";

interface Project {
  id: string;
  name: string;
  slug: string;
  type: string;
  status: string;
  description: string | null;
  createdAt: Date;
  _count: { events: number };
  lastEventAt: Date | null;
}

export function ProjectsClient({ projects }: { projects: Project[] }) {
  const [search, setSearch] = useState("");

  const filtered = search
    ? projects.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase())
      )
    : projects;

  return (
    <div className="space-y-8">
      <ProjectsPageHeader onSearch={setSearch} />

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              name={project.name}
              slug={project.slug}
              type={project.type}
              status={project.status}
              description={project.description}
              createdAt={project.createdAt}
              eventCount={project._count.events}
              lastEventAt={project.lastEventAt}
            />
          ))}
        </div>
      ) : search ? (
        <EmptyState
          icon={FolderKanban}
          title={`לא נמצאו פרויקטים עבור "${search}"`}
          description="נסה חיפוש אחר"
        />
      ) : (
        <EmptyState
          icon={FolderKanban}
          title="אין פרויקטים עדיין"
          description="צור את הפרויקט הראשון שלך כדי להתחיל לעקוב אחר אירועים"
        />
      )}
    </div>
  );
}
