import { dateRange, daysBetween } from '../../../utils/dateUtils';

export default function CustomIntervalPreview({ habit, history = {} }) {
  const start = habit?.startDate;
  const end = habit?.endDate;

  if (!start || !end) return null;

  const totalDays = daysBetween(start, end) + 1;
  const range = dateRange(start, end);
  const completed = range.reduce((acc, day) => {
    const status = history[day];
    if (!status) return acc;
    if (status === 'done') return acc + 1;
    if (status === 'half') return acc + 0.5;
    return acc;
  }, 0);

  const percent = totalDays > 0 ? Math.min(100, Math.round((completed / totalDays) * 100)) : 0;

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-xs font-medium text-slate-700">
        <span>
          {completed}/{totalDays} days completed
        </span>
        <span className="text-slate-500">
          {start} → {end}
        </span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-muted/30">
        <div
          className="h-2 rounded-full bg-primary transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
