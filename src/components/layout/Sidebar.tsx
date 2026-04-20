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
    <aside className="fixed inset-y-0 start-0 z-40 w-[280px] bg-zinc-950 flex flex-col border-e border-white/[0.06]">
      {/* ── Brand ── */}
      <div className="h-[72px] flex items-center px-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <span className="text-[15px] font-bold text-white tracking-tight">
              {APP_NAME}
            </span>
            <p className="text-[11px] text-zinc-600 font-medium">
              ניהול פרויקטים מתקדם
            </p>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        <p className="px-4 mb-3 text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
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
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200",
                isActive
                  ? "bg-white/[0.08] text-white border-s-2 border-amber-400/60 ps-[14px]"
                  : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300"
              )}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom ── */}
      <div className="px-3 py-4 border-t border-white/[0.06]">
        <Link
          href={ROUTES.SETTINGS}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300 transition-all duration-200"
        >
          <Settings className="w-[18px] h-[18px] flex-shrink-0" />
          <span>הגדרות</span>
        </Link>
      </div>
    </aside>
  );
}
