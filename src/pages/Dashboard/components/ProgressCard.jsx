export default function ProgressCard({ total, completed, percent }) {
  const safePercent = Number.isFinite(percent) ? percent : 0;
  const percentDisplay = total === 0 ? '0.0' : safePercent.toFixed(1);

  return (
    <div className="bg-white/50 backdrop-blur-xl border border-white/40 rounded-3xl shadow-[0px_10px_30px_rgba(0,0,0,0.08)] p-8 flex flex-col items-center gap-7 h-full w-full">

      <div
        className="relative h-32 w-32 md:h-36 md:w-36 rounded-full flex items-center justify-center"
        style={{
          background: `conic-gradient(#9b5eff ${safePercent}%, #e5e7eb ${safePercent}%)`,
        }}
      >
        <div className="h-[88%] w-[88%] rounded-full bg-white/90 flex items-center justify-center text-slate-900 font-bold text-base">
          {percentDisplay}%
        </div>
      </div>

      <div className="space-y-1 text-slate-900 text-center">
        <p className="text-lg font-semibold">
          {completed}/{total} habits completed
        </p>
        <p className="text-sm text-slate-600">
          {total === 0 ? "No habits scheduled today." : "Great job! Keep it up."}
        </p>
      </div>

    </div>
  );
}
