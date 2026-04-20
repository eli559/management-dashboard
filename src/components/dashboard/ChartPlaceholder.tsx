const months = [
  "ינו", "פבר", "מרץ", "אפר", "מאי", "יונ",
  "יול", "אוג", "ספט", "אוק", "נוב", "דצמ",
];

const bars = [40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 68];

export function ChartPlaceholder() {
  return (
    <div className="relative glass rounded-2xl p-6 h-full animate-slide-up stagger-5 overflow-hidden">
      {/* Top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-white/[0.08] to-transparent" />

      {/* Ambient glow */}
      <div className="absolute top-0 start-1/3 w-60 h-40 bg-blue-500/[0.03] rounded-full blur-3xl" />

      {/* כותרת */}
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div>
          <h3 className="text-[15px] font-bold text-zinc-200">סקירת פעילות</h3>
          <p className="text-[13px] text-zinc-600 mt-0.5">
            12 החודשים האחרונים
          </p>
        </div>
        <select className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[12px] text-zinc-500 font-medium focus:outline-none focus:ring-1 focus:ring-white/[0.1] transition-all cursor-pointer">
          <option>12 חודשים</option>
          <option>6 חודשים</option>
          <option>3 חודשים</option>
        </select>
      </div>

      {/* גרף */}
      <div className="relative z-10 flex items-end gap-[6px] h-52 px-1">
        {bars.map((height, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2.5">
            <div className="w-full relative group cursor-pointer">
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 glass-strong text-white text-[10px] font-semibold px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none scale-90 group-hover:scale-100 z-20">
                {(height * 12).toLocaleString("he-IL")}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/[0.05] rotate-45 border-b border-r border-white/[0.08]" />
              </div>
              <div
                className="w-full rounded-md transition-all duration-300 animate-bar-rise group-hover:shadow-[0_0_20px_-4px_rgba(59,130,246,0.3)]"
                style={{
                  height: `${(height / 100) * 208}px`,
                  background: `linear-gradient(to top, rgba(59,130,246,0.3), rgba(59,130,246,0.08))`,
                  animationDelay: `${i * 50}ms`,
                }}
              />
            </div>
            <span className="text-[10px] text-zinc-600 font-medium">
              {months[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
