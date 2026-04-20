const months = [
  "ינו",
  "פבר",
  "מרץ",
  "אפר",
  "מאי",
  "יונ",
  "יול",
  "אוג",
  "ספט",
  "אוק",
  "נוב",
  "דצמ",
];

const bars = [40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 68];

export function ChartPlaceholder() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-slate-900">סקירת פעילות</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            נתוני פעילות ב-12 החודשים האחרונים
          </p>
        </div>
        <select className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all cursor-pointer">
          <option>12 חודשים</option>
          <option>6 חודשים</option>
          <option>3 חודשים</option>
        </select>
      </div>

      {/* Chart */}
      <div className="flex items-end gap-2.5 h-52 px-2">
        {bars.map((height, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2.5">
            <div className="w-full relative group cursor-pointer">
              {/* Tooltip */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-semibold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {height * 12}
              </div>
              <div
                className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-lg transition-all duration-300 hover:from-indigo-700 hover:to-indigo-500 hover:shadow-md hover:shadow-indigo-500/20"
                style={{ height: `${(height / 100) * 208}px` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              {months[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
