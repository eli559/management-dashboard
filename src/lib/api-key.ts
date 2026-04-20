import { randomBytes } from "crypto";

export function generateApiKey(): string {
  const key = randomBytes(24).toString("hex");
  return `pk_${key}`;
}
