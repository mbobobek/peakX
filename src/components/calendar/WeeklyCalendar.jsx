import { getLastNDays } from '../../utils/dateUtils';

const statusColors = {
  done: 'bg-green-500',
  half: 'bg-yellow-400',
  missed: 'bg-red-500',
  none: 'bg-slate-300',
};

export default function WeeklyCalendar({ history = {} }) {
  const days = getLastNDays(7);
  const today = days[days.length - 1];

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2">
        {days.map((d) => {
          const status = history[d] || 'none';
          const isToday = d === today;
          return (
            <div key={d} className="flex flex-col items-center gap-1">
              <span
                className={`h-3 w-3 rounded-full ${statusColors[status]} ${isToday ? 'ring-2 ring-blue-200' : ''}`}
                title={`${d} • ${status}`}
              />
              {isToday && <span className="text-[10px] font-semibold text-blue-600">Today</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
