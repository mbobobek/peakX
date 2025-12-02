export default function MonthlyActivityCard() {
  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur-xl shadow-xl p-5 border border-white/60">
      <h2 className="text-sm font-semibold mb-3 text-slate-900">Monthly Activity</h2>

      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: 28 }).map((_, idx) => (
          <div key={idx} className="h-4 w-4 rounded bg-slate-200/80" />
        ))}
      </div>
    </div>
  );
}
