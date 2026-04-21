"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Bell, X } from "lucide-react";
import { cn } from "@/utils/cn";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  color: string;
  createdAt: string;
}

const colorDot: Record<string, string> = {
  blue: "bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-[pulse_2.5s_ease-in-out_infinite]",
  emerald: "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-[pulse_2.5s_ease-in-out_infinite]",
  amber: "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-[pulse_2.5s_ease-in-out_infinite]",
  violet: "bg-violet-400 shadow-[0_0_8px_rgba(139,92,246,0.6)] animate-[pulse_2.5s_ease-in-out_infinite]",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "עכשיו";
  if (mins < 60) return `לפני ${mins} דק׳`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `לפני ${hours} שע׳`;
  return `לפני ${Math.floor(hours / 24)} ימים`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setCount(data.count);
      }
    } catch {}
  }, []);

  // Poll every 20 seconds
  useEffect(() => {
    fetchNotifications();
    const timer = setInterval(fetchNotifications, 20000);
    return () => clearInterval(timer);
  }, [fetchNotifications]);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications", { method: "POST" });
      setCount(0);
      setNotifications([]);
    } catch {}
  };

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-white/[0.06] transition-colors duration-200"
      >
        <Bell className={cn("w-[18px] h-[18px]", count > 0 ? "text-white" : "text-zinc-300")} />
        {count > 0 && (
          <span className="absolute -top-0.5 -end-0.5 min-w-[18px] h-[18px] bg-amber-400 text-[9px] font-bold text-zinc-950 rounded-full flex items-center justify-center px-1 shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-[fade-in_200ms_ease-out]">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full end-0 mt-2 w-[340px] glass-strong rounded-2xl overflow-hidden animate-[dialog-in_200ms_ease-out] z-50" style={{ maxHeight: "420px" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <span className="text-[13px] font-bold text-white">התראות</span>
            {count > 0 && (
              <button onClick={markAllRead} className="text-[11px] text-zinc-300 hover:text-white transition-colors">
                סמן הכל כנקרא
              </button>
            )}
          </div>

          {/* List */}
          <div className="overflow-y-auto" style={{ maxHeight: "360px" }}>
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors border-b border-white/[0.03] last:border-0">
                  <div className={cn("w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0", colorDot[n.color] ?? colorDot.blue)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-white">{n.title}</p>
                    <p className="text-[11px] text-zinc-300 mt-0.5 truncate">{n.body}</p>
                    <p className="text-[10px] text-zinc-300 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center">
                <Bell className="w-6 h-6 text-zinc-300 mx-auto mb-2" />
                <p className="text-[12px] text-zinc-300">אין התראות חדשות</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
