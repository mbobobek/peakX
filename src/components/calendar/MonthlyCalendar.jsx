import { getMonthMatrix, getToday } from '../../utils/dateUtils';

const statusColors = {
  done: 'bg-green-500',
  half: 'bg-yellow-400',
  missed: 'bg-red-500',
  none: 'bg-slate-200',
};

export default function MonthlyCalendar({ history = {}, year, month }) {
  const weeks = getMonthMatrix(year, month); // month is 0-based
  const today = getToday();

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-semibold text-slate-500 mb-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {weeks.flat().map((day) => {
          const status = history[day] || 'none';
          const isToday = day === today;
          const color = statusColors[status];
          return (
            <div
              key={day}
              className={`flex h-8 w-8 items-center justify-center rounded-md text-[11px] font-medium ${
                isToday ? 'ring-2 ring-blue-300' : ''
              } ${color}`}
              title={`${day} • ${status}`}
            >
              {day.slice(-2)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
