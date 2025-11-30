import { getToday } from '../../../utils/dateUtils';

export default function TodayHeader() {
  const todayISO = getToday();
  const formatted = new Date(todayISO).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">Today</p>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{formatted}</h2>
      <p className="text-sm text-slate-600 dark:text-slate-300">Here is your focus for today.</p>
    </div>
  );
}
