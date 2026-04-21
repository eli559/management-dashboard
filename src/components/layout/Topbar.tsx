import { Bell, Search, ChevronDown } from "lucide-react";

export function Topbar() {
  return (
    <header className="h-[64px] bg-[#06060a]/50 backdrop-blur-md border-b border-white/[0.05] flex items-center justify-between px-8 sticky top-0 z-30">
      {/* ── חיפוש ── */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-zinc-400" />
          <input
            type="text"
            placeholder="חיפוש..."
            className="w-64 ps-10 pe-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[13px] text-zinc-300 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-white/[0.1] focus:border-white/[0.1] transition-all"
          />
        </div>
      </div>

      {/* ── פעולות ── */}
      <div className="flex items-center gap-1.5">
        <button className="relative p-2 rounded-lg hover:bg-white/[0.04] transition-colors duration-200">
          <Bell className="w-[18px] h-[18px] text-zinc-400" />
          <span className="absolute top-1.5 end-1.5 w-[7px] h-[7px] bg-amber-400 rounded-full ring-2 ring-[#0a0a0c] shadow-[0_0_6px_rgba(245,158,11,0.4)]" />
        </button>

        <div className="w-px h-7 bg-white/[0.06] mx-2" />

        <button className="flex items-center gap-2.5 p-1.5 pe-3 rounded-lg hover:bg-white/[0.04] transition-colors duration-200">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-zinc-300 text-[12px] font-bold border border-white/[0.06]">
            א
          </div>
          <div className="hidden md:block text-start">
            <p className="text-[13px] font-semibold text-zinc-200 leading-tight">
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
