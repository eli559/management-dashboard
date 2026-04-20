import { z } from "zod";

// Only allow safe characters in string fields — no HTML, no script tags
const safeString = (maxLen: number) =>
  z
    .string()
    .max(maxLen)
    .transform((s) => s.replace(/[<>]/g, ""));

// Metadata: flat key-value only, limited depth, limited size
const metadataValue = z.union([z.string().max(500), z.number(), z.boolean(), z.null()]);

const safeMetadata = z
  .record(z.string().max(100), metadataValue)
  .optional()
  .default({})
  .refine(
    (obj) => Object.keys(obj).length <= 20,
    "metadata cannot have more than 20 keys"
  );

// Event name: only alphanumeric + underscore + dash
const eventNamePattern = /^[a-zA-Z0-9_\-\.]{1,100}$/;

export const ingestEventSchema = z.object({
  apiKey: z.string().min(1, "apiKey is required").max(100),
  eventName: z
    .string()
    .min(1, "eventName is required")
    .max(100, "eventName is too long")
    .regex(eventNamePattern, "eventName contains invalid characters"),
  sessionId: safeString(255).optional().nullable(),
  userIdentifier: safeString(255).optional().nullable(),
  page: safeString(2048).optional().nullable(),
  value: z.number().min(-1e9).max(1e9).optional().nullable(),
  metadata: safeMetadata,
});

export type IngestEventInput = z.infer<typeof ingestEventSchema>;
