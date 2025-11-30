import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getHabits } from '../../../services/habits';
import { getLastNDays } from '../../../utils/dateUtils';

const colorForScore = (score) => {
  if (score === null) return 'bg-slate-300';
  if (score >= 0.75) return 'bg-green-500';
  if (score >= 0.4) return 'bg-yellow-400';
  return 'bg-red-400';
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
      habits.forEach((h) => {
        const status = h.history?.[day];
        if (status === 'done') total += 1;
        else if (status === 'half') total += 0.5;
      });
      const avg = habits.length ? total / habits.length : 0;
      return avg;
    });
  }, [days, habits]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
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
