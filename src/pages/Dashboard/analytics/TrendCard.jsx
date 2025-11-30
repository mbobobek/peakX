import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getHabits } from '../../../services/habits';
import { getLastNDays, isBetween } from '../../../utils/dateUtils';

function averageScoreByDays(habits, days) {
  if (!habits.length || !days.length) return 0;
  let total = 0;
  let count = 0;
  days.forEach((day) => {
    habits.forEach((h) => {
      if (h.frequency === 'custom' && h.startDate && h.endDate && !isBetween(day, h.startDate, h.endDate)) {
        return;
      }
      count += 1;
      const status = h.history?.[day];
      if (status === 'done') total += 1;
      else if (status === 'half') total += 0.5;
    });
  });
  return count ? total / count : 0;
}

export default function TrendCard() {
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
        setError(err.message || 'Failed to load trend data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const { trendText, deltaPercent } = useMemo(() => {
    const days14 = getLastNDays(14);
    const firstHalf = days14.slice(0, 7);
    const secondHalf = days14.slice(7);

    const avgOld = averageScoreByDays(habits, firstHalf);
    const avgNew = averageScoreByDays(habits, secondHalf);

    const improvement = avgOld ? ((avgNew - avgOld) / avgOld) * 100 : avgNew * 100;
    const trendUp = improvement >= 0;

    return {
      trendText: trendUp ? 'Trend up' : 'Trend down',
      deltaPercent: Math.round(Math.abs(improvement)),
    };
  }, [habits]);

  const icon = (
    <span
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
        trendText === 'Trend up' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
      }`}
    >
      {trendText === 'Trend up' ? '↑' : '↓'}
    </span>
  );

  return (
    <div className="rounded-2xl card-light dark:card-dark p-6">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p className="text-sm font-medium text-slate-600">14-day trend</p>
          {loading ? (
            <p className="text-base font-semibold text-slate-900">Loading...</p>
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : (
            <p className="text-base font-semibold text-slate-900">
              {trendText} · {deltaPercent}%
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
