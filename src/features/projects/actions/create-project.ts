"use server";

import { revalidatePath } from "next/cache";
import { createProjectSchema } from "@/lib/validations/project";
import { createProject } from "@/lib/dal/projects";
import { generateApiKey } from "@/lib/api-key";

interface ActionResult {
  success: boolean;
  errors?: Record<string, string[]>;
  project?: { slug: string; apiKey: string; name: string; websiteUrl: string | null; techType: string };
}

export async function createProjectAction(
  formData: FormData
): Promise<ActionResult> {
  const raw = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    type: formData.get("type"),
    description: formData.get("description") || null,
    websiteUrl: formData.get("websiteUrl") || null,
    techType: formData.get("techType") || "js",
  };

  const parsed = createProjectSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  try {
    const apiKey = generateApiKey();
    const project = await createProject({
      ...parsed.data,
      description: parsed.data.description ?? null,
      websiteUrl: parsed.data.websiteUrl ?? null,
      techType: parsed.data.techType ?? "js",
      apiKey,
    });

    revalidatePath("/projects");
    revalidatePath("/dashboard");

    return {
      success: true,
      project: {
        slug: project.slug,
        apiKey: project.apiKey,
        name: project.name,
        websiteUrl: (project as Record<string, unknown>).websiteUrl as string | null,
        techType: (project as Record<string, unknown>).techType as string,
      },
    };
  } catch (error: unknown) {
    const prismaError = error as { code?: string };
    if (prismaError.code === "P2002") {
      return { success: false, errors: { slug: ["slug כבר קיים, בחר slug אחר"] } };
    }
    return { success: false, errors: { _form: ["שגיאה ביצירת הפרויקט. נסה שנית."] } };
  }
}
