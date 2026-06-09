"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, FolderKanban, BarChart3, Bug,
  MoreHorizontal, Eye, Lightbulb, Shield, UserCog,
  Puzzle, Settings, X, Inbox,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/lib/constants";
import { ErrorBadge } from "./ErrorBadge";
import { LogoutButton } from "./LogoutButton";

const mainTabs = [
  { label: "דשבורד", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "פניות", href: ROUTES.LEADS, icon: Inbox },
  { label: "פרויקטים", href: ROUTES.PROJECTS, icon: FolderKanban },
  { label: "דוחות", href: ROUTES.REPORTS, icon: BarChart3 },
];

const moreTabs = [
  { label: "שגיאות", href: ROUTES.ERRORS, icon: Bug },
  { label: "מבקרים", href: ROUTES.VISITORS, icon: Eye },
  { label: "תובנות", href: ROUTES.INSIGHTS, icon: Lightbulb },
  { label: "כספת גישות", href: ROUTES.VAULT, icon: Shield },
  { label: "צוות", href: ROUTES.TEAM, icon: UserCog },
  { label: "אינטגרציות", href: ROUTES.INTEGRATIONS, icon: Puzzle },
  { label: "הגדרות", href: ROUTES.SETTINGS, icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== ROUTES.DASHBOARD && pathname?.startsWith(href + "/"));

  const isMoreActive = moreTabs.some((t) => isActive(t.href));

  return (
    <>
      {/* Bottom tab bar */}
      <nav
        className="fixed bottom-0 inset-x-0 z-50 md:hidden nav-glass border-t border-white/[0.06]"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {/* Top gradient accent line */}
        <div className="absolute top-0 inset-x-0 h-px gradient-line" />

        <div className="flex items-center justify-around h-[58px] px-1">
          {mainTabs.map((tab) => {
            const active = isActive(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 rounded-xl tap-scale relative",
                  "transition-all duration-200",
                  active ? "text-sky-400" : "text-zinc-500"
                )}
              >
                {/* Active glow behind icon */}
                {active && (
                  <div className="absolute top-1 w-8 h-8 rounded-full bg-sky-500/[0.15] blur-lg animate-glow-pulse" />
                )}
                <tab.icon className={cn(
                  "w-[22px] h-[22px] relative z-10 transition-transform duration-200",
                  active && "animate-[icon-bounce_0.4s_ease-out]"
                )} />
                <span className={cn(
                  "text-[10px] font-semibold relative z-10 transition-all duration-200",
                  active ? "text-sky-400" : "text-zinc-500"
                )}>{tab.label}</span>
                {/* Active indicator dot */}
                {active && (
                  <div className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(14,165,233,0.6)] animate-nav-dot" />
                )}
                {(tab.href as string) === ROUTES.ERRORS && (
                  <span className="absolute top-0.5 end-[calc(50%-16px)]">
                    <ErrorBadge />
                  </span>
                )}
              </Link>
            );
          })}
          <button
            onClick={() => setShowMore(true)}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 rounded-xl tap-scale",
              "transition-all duration-200",
              isMoreActive ? "text-sky-400" : "text-zinc-500"
            )}
          >
            <MoreHorizontal className="w-[22px] h-[22px]" />
            <span className="text-[10px] font-semibold">עוד</span>
            {isMoreActive && (
              <div className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(14,165,233,0.6)] animate-nav-dot" />
            )}
          </button>
        </div>
      </nav>

      {/* More drawer */}
      {showMore && (
        <div className="fixed inset-0 z-[99998] md:hidden" onClick={() => setShowMore(false)}>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md animate-drawer-backdrop" />
          <div
            className="fixed bottom-0 inset-x-0 z-[99999] rounded-t-3xl animate-drawer-up overflow-hidden"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glass background */}
            <div className="absolute inset-0 bg-[#0c0c14]/95 backdrop-blur-2xl" />
            {/* Top gradient */}
            <div className="absolute top-0 inset-x-0 h-px gradient-line" />

            <div className="relative z-10 p-5 pb-6">
              {/* Drag handle */}
              <div className="flex justify-center mb-4">
                <div className="w-10 h-1 rounded-full bg-white/[0.15]" />
              </div>

              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[15px] font-bold text-white">תפריט</h3>
                <button
                  onClick={() => setShowMore(false)}
                  className="p-2 rounded-xl hover:bg-white/[0.06] text-zinc-400 tap-scale transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {moreTabs.map((tab, i) => {
                  const active = isActive(tab.href);
                  return (
                    <Link
                      key={tab.href}
                      href={tab.href}
                      onClick={() => setShowMore(false)}
                      className={cn(
                        "relative flex flex-col items-center gap-2.5 p-4 rounded-2xl tap-scale",
                        "transition-all duration-200 animate-slide-up gradient-border",
                        active
                          ? "gradient-border-active text-sky-300 shadow-[0_0_24px_-4px_rgba(14,165,233,0.3)]"
                          : "text-zinc-300 active:text-sky-300"
                      )}
                      style={{
                        background: active
                          ? "linear-gradient(170deg, rgba(14,165,233,0.1), rgba(139,92,246,0.06), rgba(14,165,233,0.04))"
                          : "linear-gradient(170deg, rgba(14,165,233,0.04), rgba(139,92,246,0.02), rgba(14,165,233,0.01))",
                        animationDelay: `${i * 40}ms`,
                      }}
                    >
                      <tab.icon className={cn("w-5 h-5", active && "drop-shadow-[0_0_6px_rgba(14,165,233,0.5)]")} />
                      <span className="text-[11px] font-medium">{tab.label}</span>
                    </Link>
                  );
                })}
              </div>
              <div className="mt-4 border-t border-white/[0.06] pt-4">
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
