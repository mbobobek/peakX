import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getHabits } from '../../services/habits';
import { getLast7Days, getToday } from '../../utils/dateUtils';

function calculateStreak(history = {}) {
  const today = getToday();
  let streak = 0;
  let cursor = today;
  while (history[cursor] === 'done') {
    streak += 1;
    const prev = new Date(cursor);
    prev.setDate(prev.getDate() - 1);
    cursor = prev.toISOString().split('T')[0];
  }
  return streak;
}

function calculateSuccessRate(habits = []) {
  const days = getLast7Days();
  const totalSlots = days.length * habits.length || 1;
  let score = 0;

  habits.forEach((habit) => {
    days.forEach((d) => {
      const status = habit.history?.[d];
      if (status === 'done') score += 1;
      else if (status === 'half') score += 0.5;
    });
  });

  return Math.round((score / totalSlots) * 100);
}

export default function DashboardStats() {
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
        setError(err.message || 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const { totalHabits, bestStreak, successRate } = useMemo(() => {
    if (!habits.length) return { totalHabits: 0, bestStreak: 0, successRate: 0 };
    const streaks = habits.map((h) => calculateStreak(h.history || {}));
    return {
      totalHabits: habits.length,
      bestStreak: Math.max(...streaks, 0),
      successRate: calculateSuccessRate(habits),
    };
  }, [habits]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Total Habits</p>
        <div className="mt-2 text-3xl font-bold text-slate-900">
          {loading ? '...' : totalHabits}
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Best Streak</p>
        <div className="mt-2 text-3xl font-bold text-slate-900">
          {loading ? '...' : `${bestStreak} days`}
        </div>
      </div>
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Success Rate (7d)</p>
        <div className="mt-2 text-3xl font-bold text-slate-900">
          {loading ? '...' : `${successRate}%`}
        </div>
      </div>
    </div>
  );
}
