import { getLast7Days } from '../../../utils/dateUtils';

const statusColors = {
  done: 'bg-green-500',
  half: 'bg-yellow-500',
  missed: 'bg-red-500',
  none: 'bg-slate-300',
};

export default function DailyPreview({ history = {} }) {
  const days = getLast7Days();
  return (
    <div className="mt-3 flex gap-2">
      {days.map((d) => {
        const status = history[d] || 'none';
        return <span key={d} className={`h-3 w-3 rounded-full ${statusColors[status]}`} title={d} />;
      })}
    </div>
  );
}
