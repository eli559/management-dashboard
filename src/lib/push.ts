import webpush from "web-push";
import { getSubscriptions, deleteSubscription } from "@/lib/dal/push";

let configured = false;

function configure(): boolean {
  if (configured) return true;
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) return false;
  const subject = process.env.VAPID_SUBJECT || "mailto:eliezer211725080@gmail.com";
  webpush.setVapidDetails(subject, pub, priv);
  configured = true;
  return true;
}

export function getPublicKey(): string {
  return process.env.VAPID_PUBLIC_KEY || "";
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
}

/** Sends a web-push notification to every saved subscription. Never throws. */
export async function sendPushToAll(payload: PushPayload): Promise<void> {
  if (!configure()) return;
  let subs: Awaited<ReturnType<typeof getSubscriptions>> = [];
  try {
    subs = await getSubscriptions();
  } catch {
    return;
  }
  await Promise.all(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          JSON.stringify(payload)
        );
      } catch (err) {
        const code = (err as { statusCode?: number })?.statusCode;
        if (code === 404 || code === 410) {
          await deleteSubscription(s.endpoint).catch(() => {});
        }
      }
    })
  );
}
