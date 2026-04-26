"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  Eye,
  Lightbulb,
  Bug,
  UserCog,
  Puzzle,
  Settings,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { APP_NAME, ROUTES } from "@/lib/constants";
import { ErrorBadge } from "./ErrorBadge";
import type { NavItem } from "@/types/navigation";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  Eye,
  Lightbulb,
  Bug,
  UserCog,
  Puzzle,
};

const navigationItems: NavItem[] = [
  { label: "דשבורד", href: ROUTES.DASHBOARD, icon: "LayoutDashboard" },
  { label: "פרויקטים", href: ROUTES.PROJECTS, icon: "FolderKanban" },
  { label: "דוחות", href: ROUTES.REPORTS, icon: "BarChart3" },
  { label: "מבקרים", href: ROUTES.VISITORS, icon: "Eye" },
  { label: "תובנות", href: ROUTES.INSIGHTS, icon: "Lightbulb" },
  { label: "שגיאות", href: ROUTES.ERRORS, icon: "Bug" },
  { label: "צוות", href: ROUTES.TEAM, icon: "UserCog" },
  { label: "אינטגרציות", href: ROUTES.INTEGRATIONS, icon: "Puzzle" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 start-0 z-40 w-[272px] bg-[#08080a]/70 backdrop-blur-md flex flex-col border-e border-white/[0.05]">
      {/* ── לוגו ── */}
      <div className="h-[72px] flex items-center px-6 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center shadow-[0_0_20px_-4px_rgba(245,158,11,0.15)]">
            <LayoutDashboard className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <span className="text-[15px] font-bold text-white tracking-tight">
              מערכת ניהול וניטור
            </span>
            <p className="text-[10px] text-zinc-300 font-medium mt-0.5">
              ניהול פרויקטים מתקדם
            </p>
          </div>
        </div>
      </div>

      {/* ── ניווט ── */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-3 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">
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
                "relative flex items-center gap-3 px-3 py-[10px] rounded-xl text-[13px] font-medium transition-all duration-300 group/nav",
                isActive
                  ? "bg-gradient-to-l from-amber-400/[0.15] via-amber-400/[0.06] to-transparent text-white border border-white/[0.06]"
                  : "text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200 hover:border hover:border-white/[0.04]"
              )}
            >
              {isActive && (
                <div className="absolute inset-y-2 start-0 w-[3px] rounded-full bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.6)]" />
              )}
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-l from-white/[0.04] to-transparent opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <Icon
                className={cn(
                  "w-[17px] h-[17px] flex-shrink-0 transition-colors duration-200",
                  isActive ? "text-amber-400" : "group-hover/nav:text-zinc-300"
                )}
              />
              <span className="flex-1">{item.label}</span>
              {item.href === ROUTES.ERRORS && <ErrorBadge />}
            </Link>
          );
        })}
      </nav>

      {/* ── תחתית ── */}
      <div className="px-3 py-4 border-t border-white/[0.04]">
        <Link
          href={ROUTES.SETTINGS}
          className="flex items-center gap-3 px-3 py-[9px] rounded-lg text-[13px] font-medium text-zinc-300 hover:bg-white/[0.03] hover:text-zinc-300 transition-all duration-200"
        >
          <Settings className="w-[17px] h-[17px] flex-shrink-0" />
          <span>הגדרות</span>
        </Link>
      </div>
    </aside>
  );
}
