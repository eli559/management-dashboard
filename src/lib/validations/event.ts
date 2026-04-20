import { z } from "zod";

export const ingestEventSchema = z.object({
  apiKey: z.string().min(1, "apiKey is required"),
  eventName: z
    .string()
    .min(1, "eventName is required")
    .max(255, "eventName is too long"),
  sessionId: z.string().max(255).optional().nullable(),
  userIdentifier: z.string().max(255).optional().nullable(),
  page: z.string().max(2048).optional().nullable(),
  value: z.number().optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional().default({}),
});

export type IngestEventInput = z.infer<typeof ingestEventSchema>;
