import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getHabits } from '../../services/habits';
import { getLast7Days } from '../../utils/dateUtils';

const colorByScore = (score) => {
  if (score >= 0.8) return 'bg-green-500';
  if (score >= 0.5) return 'bg-yellow-400';
  if (score >= 0.1) return 'bg-red-400';
  return 'bg-slate-300';
};

export default function DashboardWeekly() {
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
  const weekSummary = useMemo(() => {
    return days.map((day) => {
      let score = 0;
      habits.forEach((h) => {
        const status = h.history?.[day];
        if (status === 'done') score += 1;
        else if (status === 'half') score += 0.5;
      });
      // normalize by number of habits to keep scale 0..1 (avoid divide-by-zero)
      const normalized = habits.length ? score / habits.length : 0;
      return { day, score: normalized };
    });
  }, [days, habits]);

  const formatDay = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { weekday: 'short' });
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Weekly Summary</h2>
        {loading && <span className="text-xs text-slate-500">Loading...</span>}
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
      <div className="mt-4 flex items-end gap-3">
        {weekSummary.map(({ day, score }) => (
          <div key={day} className="flex flex-col items-center gap-2">
            <div className={`h-8 w-8 rounded-lg ${colorByScore(score)}`} title={`${day}: ${score.toFixed(2)}`} />
            <span className="text-xs font-medium text-slate-600">{formatDay(day)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
