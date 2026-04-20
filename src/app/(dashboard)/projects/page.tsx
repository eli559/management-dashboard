import { FolderKanban } from "lucide-react";
import { getProjects } from "@/lib/dal/projects";
import { ProjectCard } from "@/features/projects/components/ProjectCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProjectsPageHeader } from "./ProjectsPageHeader";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-8">
      {/* Header (Client for dialog toggle) */}
      <ProjectsPageHeader />

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              name={project.name}
              slug={project.slug}
              type={project.type}
              status={project.status}
              description={project.description}
              createdAt={project.createdAt}
              eventCount={project._count.events}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FolderKanban}
          title="אין פרויקטים עדיין"
          description='צור את הפרויקט הראשון שלך כדי להתחיל לעקוב אחר אירועים ולנתח נתונים'
        />
      )}
    </div>
  );
}
