const months = [
  "ינו", "פבר", "מרץ", "אפר", "מאי", "יונ",
  "יול", "אוג", "ספט", "אוק", "נוב", "דצמ",
];

const bars = [40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 68];

export function ChartPlaceholder() {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 h-full">
      {/* כותרת */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-zinc-900">סקירת פעילות</h3>
          <p className="text-sm text-zinc-500 mt-0.5">
            נתוני פעילות ב-12 החודשים האחרונים
          </p>
        </div>
        <select className="px-3.5 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-600 font-medium focus:outline-none focus:ring-2 focus:ring-zinc-300/40 focus:border-zinc-300 transition-all cursor-pointer">
          <option>12 חודשים</option>
          <option>6 חודשים</option>
          <option>3 חודשים</option>
        </select>
      </div>

      {/* גרף */}
      <div className="flex items-end gap-2.5 h-52 px-2">
        {bars.map((height, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2.5">
            <div className="w-full relative group cursor-pointer">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] font-semibold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {height * 12}
              </div>
              <div
                className="w-full bg-gradient-to-t from-zinc-800 to-zinc-500 rounded-lg transition-all duration-300 hover:from-zinc-900 hover:to-zinc-600 hover:shadow-md hover:shadow-zinc-400/20"
                style={{ height: `${(height / 100) * 208}px` }}
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
