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
    <aside className="fixed inset-y-0 start-0 z-40 w-[280px] bg-slate-900 flex flex-col border-e border-slate-800">
      {/* ── Brand ── */}
      <div className="h-[72px] flex items-center px-6 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-[15px] font-bold text-white tracking-tight">
              {APP_NAME}
            </span>
            <p className="text-[11px] text-slate-500 font-medium">
              ניהול פרויקטים מתקדם
            </p>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        <p className="px-4 mb-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
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
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-200"
              )}
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ms-auto text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-semibold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom ── */}
      <div className="px-3 py-4 border-t border-white/[0.08]">
        <Link
          href={ROUTES.SETTINGS}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium text-slate-400 hover:bg-white/[0.06] hover:text-slate-200 transition-all duration-200"
        >
          <Settings className="w-[18px] h-[18px] flex-shrink-0" />
          <span>הגדרות</span>
        </Link>
      </div>
    </aside>
  );
}
