import { ChevronDown } from "lucide-react";
import { NotificationBell } from "./NotificationBell";

export function Topbar() {
  return (
    <header className="h-[64px] bg-[#06060a]/50 backdrop-blur-md border-b border-white/[0.05] flex items-center justify-end px-8 sticky top-0 z-30">
      <div className="flex items-center gap-1.5">
        <NotificationBell />

        <div className="w-px h-7 bg-white/[0.06] mx-2" />

        <button className="flex items-center gap-2.5 p-1.5 pe-3 rounded-lg hover:bg-white/[0.04] transition-colors duration-200">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-zinc-300 text-[12px] font-bold border border-white/[0.06]">
            א
          </div>
          <div className="hidden md:block text-start">
            <p className="text-[13px] font-semibold text-zinc-200 leading-tight">אליעזר</p>
            <p className="text-[10px] text-zinc-300">מנהל מערכת</p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-300 hidden md:block" />
        </button>
      </div>
    </header>
  );
}
