import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(2, "שם הפרויקט חייב להכיל לפחות 2 תווים")
    .max(100, "שם הפרויקט ארוך מדי"),
  slug: z
    .string()
    .min(2, "slug חייב להכיל לפחות 2 תווים")
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "slug חייב להכיל רק אותיות קטנות באנגלית, מספרים ומקפים"
    ),
  type: z.enum(["WEBSITE", "MOBILE_APP", "API", "SAAS", "OTHER"], {
    message: "יש לבחור סוג פרויקט",
  }),
  description: z.string().max(500, "התיאור ארוך מדי").optional().nullable(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
