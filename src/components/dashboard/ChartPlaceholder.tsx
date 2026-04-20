const months = [
  "ינו", "פבר", "מרץ", "אפר", "מאי", "יונ",
  "יול", "אוג", "ספט", "אוק", "נוב", "דצמ",
];

const bars = [40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 68];

export function ChartPlaceholder() {
  return (
    <div className="relative bg-white rounded-2xl border border-zinc-100/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 h-full animate-slide-up stagger-5">
      {/* Subtle top accent */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-l from-transparent via-zinc-200/60 to-transparent rounded-t-2xl" />

      {/* כותרת */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-[15px] font-bold text-zinc-900">סקירת פעילות</h3>
          <p className="text-[13px] text-zinc-400 mt-0.5">
            12 החודשים האחרונים
          </p>
        </div>
        <select className="px-3 py-1.5 bg-zinc-50 border border-zinc-100 rounded-lg text-[12px] text-zinc-500 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-200/60 transition-all cursor-pointer">
          <option>12 חודשים</option>
          <option>6 חודשים</option>
          <option>3 חודשים</option>
        </select>
      </div>

      {/* גרף */}
      <div className="flex items-end gap-[6px] h-52 px-1">
        {bars.map((height, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2.5">
            <div className="w-full relative group cursor-pointer">
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] font-semibold px-3 py-1.5 rounded-lg shadow-lg shadow-black/10 opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none scale-90 group-hover:scale-100">
                {(height * 12).toLocaleString("he-IL")}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-900 rotate-45" />
              </div>
              <div
                className="w-full rounded-md transition-all duration-300 animate-bar-rise group-hover:shadow-md group-hover:shadow-zinc-300/30"
                style={{
                  height: `${(height / 100) * 208}px`,
                  background: `linear-gradient(to top, #27272a, #52525b)`,
                  animationDelay: `${i * 50}ms`,
                }}
              />
            </div>
            <span className="text-[10px] text-zinc-400 font-medium">
              {months[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
