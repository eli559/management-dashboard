"use client";

import { useEffect, useState } from "react";

export function ErrorBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch("/api/errors/count");
        if (res.ok) { const d = await res.json(); setCount(d.count); }
      } catch {}
    }
    check();
    const t = setInterval(check, 20000);
    return () => clearInterval(t);
  }, []);

  if (count === 0) return null;

  return (
    <span className="min-w-[16px] h-[16px] bg-red-500 text-[9px] font-bold text-white rounded-full flex items-center justify-center px-1 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-[pulse_2s_ease-in-out_infinite]">
      {count > 9 ? "9+" : count}
    </span>
  );
}
