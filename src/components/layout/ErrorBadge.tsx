"use client";

import { useEffect, useState, useCallback } from "react";

export function ErrorBadge() {
  const [count, setCount] = useState(0);

  const check = useCallback(async () => {
    try {
      const res = await fetch("/api/errors/count");
      if (res.ok) { const d = await res.json(); setCount(d.count); }
    } catch {}
  }, []);

  useEffect(() => {
    check();
    const t = setInterval(check, 20000);

    // Listen for error status changes — update immediately
    const onUpdate = () => check();
    window.addEventListener("error-status-changed", onUpdate);

    return () => { clearInterval(t); window.removeEventListener("error-status-changed", onUpdate); };
  }, [check]);

  if (count === 0) return null;

  return (
    <span className="min-w-[16px] h-[16px] bg-red-500 text-[9px] font-bold text-white rounded-full flex items-center justify-center px-1 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-[pulse_2s_ease-in-out_infinite]">
      {count > 9 ? "9+" : count}
    </span>
  );
}
