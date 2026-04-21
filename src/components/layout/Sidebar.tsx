"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  Users,
  Puzzle,
  Settings,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { APP_NAME, ROUTES } from "@/lib/constants";
import type { NavItem } from "@/types/navigation";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  Users,
  Puzzle,
};

const navigationItems: NavItem[] = [
  { label: "דשבורד", href: ROUTES.DASHBOARD, icon: "LayoutDashboard" },
  { label: "פרויקטים", href: ROUTES.PROJECTS, icon: "FolderKanban" },
  { label: "דוחות", href: ROUTES.REPORTS, icon: "BarChart3" },
  { label: "משתמשים", href: ROUTES.USERS, icon: "Users" },
  { label: "אינטגרציות", href: ROUTES.INTEGRATIONS, icon: "Puzzle" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 start-0 z-40 w-[272px] bg-[#08080a]/70 backdrop-blur-md flex flex-col border-e border-white/[0.05]">
      {/* ── לוגו ── */}
      <div className="h-[64px] flex items-center px-6 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-400/10 flex items-center justify-center shadow-[0_0_20px_-4px_rgba(245,158,11,0.15)]">
            <LayoutDashboard className="w-[18px] h-[18px] text-amber-400" />
          </div>
          <div>
            <span className="text-[14px] font-bold text-white tracking-tight">
              {APP_NAME}
            </span>
            <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
              ניהול פרויקטים מתקדם
            </p>
          </div>
        </div>
      </div>

      {/* ── ניווט ── */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-3 text-[10px] font-semibold text-zinc-700 uppercase tracking-widest">
          תפריט ראשי
        </p>
        {navigationItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive =
            pathname === item.href ||
            (item.href !== ROUTES.DASHBOARD &&
              pathname?.startsWith(item.href + "/"));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 px-3 py-[9px] rounded-lg text-[13px] font-medium transition-all duration-200",
                isActive
                  ? "bg-white/[0.06] text-white shadow-[0_0_20px_-4px_rgba(245,158,11,0.08)]"
                  : "text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-300"
              )}
            >
              {isActive && (
                <div className="absolute inset-y-1.5 start-0 w-[3px] rounded-full bg-amber-400/70 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
              )}
              <Icon
                className={cn(
                  "w-[17px] h-[17px] flex-shrink-0",
                  isActive ? "text-amber-400/80" : ""
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── תחתית ── */}
      <div className="px-3 py-4 border-t border-white/[0.04]">
        <Link
          href={ROUTES.SETTINGS}
          className="flex items-center gap-3 px-3 py-[9px] rounded-lg text-[13px] font-medium text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-400 transition-all duration-200"
        >
          <Settings className="w-[17px] h-[17px] flex-shrink-0" />
          <span>הגדרות</span>
        </Link>
      </div>
    </aside>
  );
}
