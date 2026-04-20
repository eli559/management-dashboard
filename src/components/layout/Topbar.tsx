import { Bell, Search, ChevronDown } from "lucide-react";

export function Topbar() {
  return (
    <header className="h-[64px] bg-white/70 backdrop-blur-xl border-b border-zinc-200/50 flex items-center justify-between px-8 sticky top-0 z-30">
      {/* ── חיפוש ── */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-zinc-400" />
          <input
            type="text"
            placeholder="חיפוש..."
            className="w-64 ps-10 pe-4 py-2 bg-zinc-50/80 border border-zinc-200/60 rounded-lg text-[13px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200/50 focus:border-zinc-300 transition-all"
          />
        </div>
      </div>

      {/* ── פעולות ── */}
      <div className="flex items-center gap-1.5">
        <button className="relative p-2 rounded-lg hover:bg-zinc-50 transition-colors duration-200">
          <Bell className="w-[18px] h-[18px] text-zinc-400" />
          <span className="absolute top-1.5 end-1.5 w-[7px] h-[7px] bg-amber-400 rounded-full ring-2 ring-white" />
        </button>

        <div className="w-px h-7 bg-zinc-200/60 mx-2" />

        <button className="flex items-center gap-2.5 p-1.5 pe-3 rounded-lg hover:bg-zinc-50 transition-colors duration-200">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white text-[12px] font-bold">
            א
          </div>
          <div className="hidden md:block text-start">
            <p className="text-[13px] font-semibold text-zinc-900 leading-tight">
              אליעזר
            </p>
            <p className="text-[10px] text-zinc-400">מנהל מערכת</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400 hidden md:block" />
        </button>
      </div>
    </header>
  );
}
