import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getHabits } from '../../../services/habits';
import { getLast7Days, isBetween } from '../../../utils/dateUtils';

const colorForScore = (score) => {
  if (score === null) return 'bg-muted/30';
  if (score >= 0.75) return 'bg-success';
  if (score >= 0.4) return 'bg-warning';
  return 'bg-danger';
};

export default function WeeklySummary() {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const data = await getHabits(user.uid);
        setHabits(data);
      } catch (err) {
        setError(err.message || 'Failed to load weekly summary');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const days = getLast7Days();
  const dayLabels = days.map((d) =>
    new Date(d).toLocaleDateString(undefined, { weekday: 'short' })
  );

  const dayScores = useMemo(() => {
    return days.map((day) => {
      if (!habits.length) return null;
      let total = 0;
      habits.forEach((h) => {
        if (h.frequency === 'custom' && h.startDate && h.endDate && !isBetween(day, h.startDate, h.endDate)) {
          return;
        }
        const status = h.history?.[day];
        if (status === 'done') total += 1;
        else if (status === 'half') total += 0.5;
        else if (status === 'missed') total += 0;
      });
      const activeCount = habits.filter((h) => {
        if (h.frequency === 'custom' && h.startDate && h.endDate) {
          return isBetween(day, h.startDate, h.endDate);
        }
        return true;
      }).length;
      const denom = activeCount || 0;
      const avg = denom ? total / denom : 0;
      return denom ? avg : null;
    });
  }, [days, habits]);

  return (
    <div className="glass-card p-5 md:p-6 shadow-[0_12px_60px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Weekly Summary</h3>
        {loading && <span className="text-xs text-slate-500">Loading...</span>}
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
      <div className="mt-4 grid grid-cols-7 items-end gap-3">
        {dayScores.map((score, idx) => (
          <div key={days[idx]} className="flex flex-col items-center gap-2">
            <div
              className={`w-full rounded-md ${colorForScore(score)}`}
              style={{ height: `${(score || 0) * 60 + 8}px` }}
              title={`${days[idx]} • ${score !== null ? score.toFixed(2) : 'No data'}`}
            />
            <span className="text-xs font-medium text-slate-600">{dayLabels[idx]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
