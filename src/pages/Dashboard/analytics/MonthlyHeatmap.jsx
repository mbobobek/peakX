import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getHabits } from '../../../services/habits';
import { getLastNDays, isBetween } from '../../../utils/dateUtils';

const colorForScore = (score) => {
  if (score === null) return 'bg-muted/30';
  if (score >= 0.75) return 'bg-success';
  if (score >= 0.4) return 'bg-warning';
  return 'bg-danger';
};

export default function MonthlyHeatmap() {
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
        setError(err.message || 'Failed to load monthly data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const days = useMemo(() => getLastNDays(30), []);

  const dayScores = useMemo(() => {
    return days.map((day) => {
      if (!habits.length) return null;
      let total = 0;
      let activeCount = 0;
      habits.forEach((h) => {
        if (h.frequency === 'custom' && h.startDate && h.endDate && !isBetween(day, h.startDate, h.endDate)) {
          return;
        }
        activeCount += 1;
        const status = h.history?.[day];
        if (status === 'done') total += 1;
        else if (status === 'half') total += 0.5;
      });
      const avg = activeCount ? total / activeCount : 0;
      return activeCount ? avg : null;
    });
  }, [days, habits]);

  return (
    <div className="rounded-2xl card-light dark:card-dark p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Monthly Heatmap</h3>
        {loading && <span className="text-xs text-slate-500">Loading...</span>}
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
      <div className="mt-4 grid grid-cols-7 gap-2">
        {dayScores.map((score, idx) => (
          <div
            key={days[idx]}
            className={`h-4 w-4 rounded ${colorForScore(score)}`}
            title={`${new Date(days[idx]).toLocaleDateString()} • ${
              score !== null ? score.toFixed(2) : 'No data'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
