import { Bell, Search, ChevronDown } from "lucide-react";

export function Topbar() {
  return (
    <header className="h-[72px] bg-white/80 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-8 sticky top-0 z-30">
      {/* ── Search ── */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="חיפוש..."
            className="w-72 ps-10 pe-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
          />
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
          <Bell className="w-5 h-5 text-slate-500" />
          <span className="absolute top-2 end-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-slate-200 mx-2" />

        {/* User */}
        <button className="flex items-center gap-3 p-1.5 pe-3 rounded-xl hover:bg-slate-50 transition-colors">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            א
          </div>
          <div className="hidden md:block text-start">
            <p className="text-sm font-semibold text-slate-900 leading-tight">
              אליעזר
            </p>
            <p className="text-[11px] text-slate-500">מנהל מערכת</p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
        </button>
      </div>
    </header>
  );
}
