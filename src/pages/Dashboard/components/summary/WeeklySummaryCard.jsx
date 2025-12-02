export default function WeeklySummaryCard({ weeklySummary, todayKey }) {
  const getBarColor = (percent, future) => {
    if (future || percent === null) return "bg-slate-300";
    if (percent >= 80) return "bg-emerald-500";
    if (percent >= 40) return "bg-amber-400";
    return "bg-rose-500";
  };

  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur-xl shadow-xl p-3.5 border border-white/60">
      <h2 className="text-sm font-semibold text-slate-900 mb-1.5">Weekly Summary</h2>

      <div className="space-y-1.5">
        {weeklySummary.map((day) => {
          const isToday = day.dateKey === todayKey;

          return (
            <div
              key={day.day}
              className={`p-1.5 rounded-lg transition ${
                isToday
                  ? "bg-[#eef2ff] border border-[#9b5eff]/40 shadow-sm"
                  : "bg-transparent"
              }`}
            >
              <div className="flex items-center justify-between text-[12px] font-semibold text-slate-800">
                <span className={isToday ? "font-bold text-[#6b4eff]" : ""}>
                  {day.day}
                </span>

                <span className="text-slate-600 text-[11px]">
                  {day.percent === null ? "Future" : `${day.percent}%`}
                </span>
              </div>

              <div className="h-1 w-full mt-1 rounded-full bg-slate-200/60 overflow-hidden">
                <div
                  className={`h-1 rounded-full ${getBarColor(
                    day.percent,
                    day.future
                  )} ${isToday ? "shadow-[0_0_6px_rgba(107,78,255,0.6)]" : ""}`}
                  style={{
                    width:
                      day.percent === null || day.future
                        ? "0%"
                        : `${Math.min(100, Math.max(0, day.percent))}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
