import { z } from "zod";

// strip angle brackets to avoid any HTML injection in stored strings
const safe = (max: number) =>
  z.string().trim().max(max).transform((s) => s.replace(/[<>]/g, ""));

const metaValue = z.union([z.string().max(500), z.number(), z.boolean(), z.null()]);

export const ingestLeadSchema = z.object({
  apiKey: z.string().min(1, "apiKey is required").max(100),
  name: safe(80).pipe(z.string().min(1, "name is required")),
  phone: z
    .string()
    .trim()
    .min(1, "phone is required")
    .max(30)
    .transform((s) => s.replace(/[^0-9+\-() ]/g, "")),
  business: safe(120).optional().nullable(),
  budget: safe(60).optional().nullable(),
  services: safe(200).optional().nullable(),
  source: safe(200).optional().nullable(),
  page: safe(2048).optional().nullable(),
  metadata: z
    .record(z.string().max(60), metaValue)
    .optional()
    .default({})
    .refine((o) => Object.keys(o).length <= 30, "too many metadata keys"),
});

export type IngestLeadInput = z.infer<typeof ingestLeadSchema>;
