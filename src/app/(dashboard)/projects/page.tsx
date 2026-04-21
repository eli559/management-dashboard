import { getProjects } from "@/lib/dal/projects";
import { LiveRefresh } from "@/components/LiveRefresh";
import { ProjectsClient } from "./ProjectsClient";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <LiveRefresh interval={15} />
      <ProjectsClient projects={projects} />
    </>
  );
}
