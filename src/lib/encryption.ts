import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

const ALGORITHM = "aes-256-gcm";

function getKey(): Buffer {
  const raw = process.env.ENCRYPTION_KEY;
  if (!raw || raw.length < 16) {
    throw new Error("ENCRYPTION_KEY must be set (min 16 chars)");
  }
  return scryptSync(raw, "vault-salt", 32);
}

export function encrypt(text: string): string {
  const key = getKey();
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const tag = cipher.getAuthTag().toString("hex");
  // Format: iv:tag:encrypted
  return `${iv.toString("hex")}:${tag}:${encrypted}`;
}

export function decrypt(data: string): string {
  const key = getKey();
  const [ivHex, tagHex, encrypted] = data.split(":");
  if (!ivHex || !tagHex || !encrypted) throw new Error("Invalid encrypted data");

  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
