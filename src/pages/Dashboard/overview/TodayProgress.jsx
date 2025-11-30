export default function TodayProgress({ completed = 0, total = 0 }) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="rounded-2xl card-light dark:card-dark p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Today&apos;s Progress</h3>
        <span className="text-sm font-medium text-slate-600">
          {completed}/{total} completed
        </span>
      </div>
      <div className="mt-4 h-3 rounded-full bg-muted/30">
        <div
          className="h-3 rounded-full bg-primary transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-700">{percent}%</p>
    </div>
  );
}
