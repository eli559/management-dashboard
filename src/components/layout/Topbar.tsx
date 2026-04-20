import { Bell, Search, ChevronDown } from "lucide-react";

export function Topbar() {
  return (
    <header className="h-[72px] bg-white/80 backdrop-blur-md border-b border-zinc-200/60 flex items-center justify-between px-8 sticky top-0 z-30">
      {/* ── חיפוש ── */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="חיפוש..."
            className="w-72 ps-10 pe-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300/40 focus:border-zinc-300 transition-all"
          />
        </div>
      </div>

      {/* ── פעולות ── */}
      <div className="flex items-center gap-2">
        {/* התראות */}
        <button className="relative p-2.5 rounded-xl hover:bg-zinc-50 transition-colors">
          <Bell className="w-5 h-5 text-zinc-500" />
          <span className="absolute top-2 end-2 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white" />
        </button>

        {/* מפריד */}
        <div className="w-px h-8 bg-zinc-200 mx-2" />

        {/* משתמש */}
        <button className="flex items-center gap-3 p-1.5 pe-3 rounded-xl hover:bg-zinc-50 transition-colors">
          <div className="w-9 h-9 rounded-full bg-zinc-900 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            א
          </div>
          <div className="hidden md:block text-start">
            <p className="text-sm font-semibold text-zinc-900 leading-tight">
              אליעזר
            </p>
            <p className="text-[11px] text-zinc-500">מנהל מערכת</p>
          </div>
          <ChevronDown className="w-4 h-4 text-zinc-400 hidden md:block" />
        </button>
      </div>
    </header>
  );
}
