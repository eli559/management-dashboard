import { NotificationBell } from "./NotificationBell";

export function Topbar() {
  return (
    <header className="bg-[#06060a]/80 backdrop-blur-md border-b border-white/[0.05] flex items-end justify-between px-4 md:px-6 sticky top-0 z-30 pb-3 md:pb-0 md:items-center md:h-[68px]"
      style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)" }}
    >
      {/* Mobile title */}
      <div className="flex items-center gap-2.5 md:hidden">
        <div>
          <span className="text-[15px] font-bold text-white tracking-tight leading-tight block">ניהול וניטור</span>
          <span className="text-[10px] font-bold tracking-widest" dir="ltr"
            style={{ background: "linear-gradient(90deg, #0ea5e9, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            DIGITALCRAFT
          </span>
        </div>
      </div>
      <div className="hidden md:block" />

      {/* Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        <NotificationBell />
      </div>
    </header>
  );
}
