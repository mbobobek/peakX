import { getLast7Days } from '../../../utils/dateUtils';

const weekdayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const statusColors = {
  done: 'bg-green-500',
  half: 'bg-yellow-500',
  missed: 'bg-red-500',
  none: 'bg-slate-300',
};

export default function WeeklyPreview({ history = {} }) {
  const days = getLast7Days(); // last 7 calendar days to map statuses

  // Build status by weekday using last 7 days history
  const weekdayStatus = Array(7).fill('none');
  days.forEach((iso) => {
    const day = new Date(iso).getDay(); // 0-6 (Sun-Sat)
    const status = history[iso];
    if (status && weekdayStatus[day] === 'none') {
      weekdayStatus[day] = status;
    }
  });

  return (
    <div className="mt-3 grid grid-cols-7 gap-2 text-center text-[11px] font-semibold text-slate-600">
      {weekdayStatus.map((s, idx) => (
        <div key={idx} className="flex flex-col items-center gap-1">
          <span className={`h-3 w-3 rounded-full ${statusColors[s]}`} />
          <span>{weekdayLabels[idx]}</span>
        </div>
      ))}
    </div>
  );
}
