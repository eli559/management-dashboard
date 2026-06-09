"use client";

import { useEffect, useState } from "react";
import { Bell, BellRing, BellOff } from "lucide-react";

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

type State = "loading" | "unsupported" | "default" | "denied" | "granted" | "working";

export function PushToggle() {
  const [state, setState] = useState<State>("loading");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const supported =
      "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    if (!supported) {
      setState("unsupported");
      return;
    }
    navigator.serviceWorker.getRegistration().then(async (reg) => {
      if (reg) {
        const sub = await reg.pushManager.getSubscription();
        if (sub && Notification.permission === "granted") {
          setState("granted");
          return;
        }
      }
      setState(Notification.permission === "denied" ? "denied" : "default");
    });
  }, []);

  async function enable() {
    try {
      setState("working");
      setMsg("");
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState("denied");
        return;
      }

      const res = await fetch("/api/push/vapid");
      if (!res.ok) throw new Error("vapid");
      const { publicKey } = await res.json();

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
      });

      const save = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub.toJSON() }),
      });
      if (!save.ok) throw new Error("save");

      setState("granted");
      setMsg("מעולה! התראות על פניות חדשות יגיעו לטלפון הזה.");
    } catch {
      setState("default");
      setMsg("ההפעלה נכשלה. ודא ש-iOS 16.4+ ושפתחת מהאייקון שבמסך הבית, ונסה שוב.");
    }
  }

  if (state === "loading") return null;

  const base =
    "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors";

  if (state === "unsupported") {
    return (
      <div className="text-xs text-zinc-500 flex items-center gap-2">
        <BellOff className="w-4 h-4" /> התראות דחיפה לא נתמכות בדפדפן הזה.
      </div>
    );
  }

  if (state === "granted") {
    return (
      <div className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
        <BellRing className="w-4 h-4" /> התראות מופעלות במכשיר הזה
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div className="text-xs text-amber-400 flex items-center gap-2 max-w-md">
        <BellOff className="w-4 h-4 shrink-0" /> ההתראות חסומות. הפעל אותן בהגדרות המכשיר עבור האתר ורענן.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={enable}
        disabled={state === "working"}
        className={`${base} bg-sky-500 text-white hover:bg-sky-400 disabled:opacity-60`}
      >
        <Bell className="w-4 h-4" />
        {state === "working" ? "מפעיל…" : "הפעל התראות בטלפון"}
      </button>
      {msg && <span className="text-xs text-zinc-400 max-w-md">{msg}</span>}
    </div>
  );
}
