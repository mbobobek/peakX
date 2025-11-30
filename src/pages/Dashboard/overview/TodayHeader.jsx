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
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-500">Today</p>
      <h2 className="text-2xl font-bold text-slate-900">{formatted}</h2>
      <p className="text-sm text-slate-600">Here is your focus for today.</p>
    </div>
  );
}
