"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  Eye,
  Lightbulb,
  Bug,
  Shield,
  UserCog,
  Puzzle,
  Settings,
  Inbox,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { APP_NAME, ROUTES } from "@/lib/constants";
import { ErrorBadge } from "./ErrorBadge";
import { LogoutButton } from "./LogoutButton";
import type { NavItem } from "@/types/navigation";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  Eye,
  Lightbulb,
  Bug,
  Shield,
  UserCog,
  Puzzle,
  Inbox,
};

const navigationItems: NavItem[] = [
  { label: "דשבורד", href: ROUTES.DASHBOARD, icon: "LayoutDashboard" },
  { label: "פניות", href: ROUTES.LEADS, icon: "Inbox" },
  { label: "פרויקטים", href: ROUTES.PROJECTS, icon: "FolderKanban" },
  { label: "דוחות", href: ROUTES.REPORTS, icon: "BarChart3" },
  { label: "מבקרים", href: ROUTES.VISITORS, icon: "Eye" },
  { label: "תובנות", href: ROUTES.INSIGHTS, icon: "Lightbulb" },
  { label: "שגיאות", href: ROUTES.ERRORS, icon: "Bug" },
  { label: "כספת גישות", href: ROUTES.VAULT, icon: "Shield" },
  { label: "צוות", href: ROUTES.TEAM, icon: "UserCog" },
  { label: "אינטגרציות", href: ROUTES.INTEGRATIONS, icon: "Puzzle" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 start-0 z-40 w-[272px] bg-[#08080a]/70 backdrop-blur-md flex flex-col border-e border-white/[0.05]">
      {/* ── לוגו ── */}
      <div className="h-[64px] flex items-center px-5 border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="לוגו" width={38} height={38} className="rounded-xl shadow-[0_0_20px_-4px_rgba(14,165,233,0.15)]" />
          <div>
            <span className="text-[14px] font-bold text-white tracking-tight leading-tight block">
              ניהול וניטור
            </span>
            <p className="text-[10px] font-bold mt-0.5 tracking-widest" dir="ltr"
              style={{ background: "linear-gradient(90deg, #0ea5e9, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              DIGITALCRAFT
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
                  ? "bg-gradient-to-l from-sky-500/[0.12] via-violet-500/[0.06] to-transparent text-white border border-white/[0.06]"
                  : "text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200 hover:border hover:border-white/[0.04]"
              )}
            >
              {isActive && (
                <div className="absolute inset-y-2 start-0 w-[3px] rounded-full bg-gradient-to-b from-sky-400 to-violet-500 shadow-[0_0_12px_rgba(14,165,233,0.5)]" />
              )}
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-l from-sky-500/[0.04] to-transparent opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <Icon
                className={cn(
                  "w-[17px] h-[17px] flex-shrink-0 transition-colors duration-200",
                  isActive ? "text-sky-400" : "group-hover/nav:text-zinc-300"
                )}
              />
              <span className="flex-1">{item.label}</span>
              {item.href === ROUTES.ERRORS && <ErrorBadge />}
            </Link>
          );
        })}
      </nav>

      {/* ── תחתית ── */}
      <div className="px-3 py-4 border-t border-white/[0.04] space-y-0.5">
        <Link
          href={ROUTES.SETTINGS}
          className={cn(
            "relative flex items-center gap-3 px-3 py-[10px] rounded-xl text-[13px] font-medium transition-all duration-300",
            pathname === ROUTES.SETTINGS
              ? "bg-gradient-to-l from-sky-500/[0.12] via-violet-500/[0.06] to-transparent text-white border border-white/[0.06]"
              : "text-zinc-300 hover:bg-white/[0.04] hover:text-zinc-200"
          )}
        >
          {pathname === ROUTES.SETTINGS && (
            <div className="absolute inset-y-2 start-0 w-[3px] rounded-full bg-gradient-to-b from-sky-400 to-violet-500 shadow-[0_0_12px_rgba(14,165,233,0.5)]" />
          )}
          <Settings className={cn("w-[17px] h-[17px] flex-shrink-0", pathname === ROUTES.SETTINGS ? "text-sky-400" : "")} />
          <span>הגדרות</span>
        </Link>
        <LogoutButton />
      </div>
    </aside>
  );
}
