import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getHabits } from '../../../services/habits';
import { getToday } from '../../../utils/dateUtils';
import TodayHeader from './TodayHeader';
import TodayProgress from './TodayProgress';
import TodayHabitList from './TodayHabitList';

export default function TodayOverview() {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const today = getToday();
  const todayWeekday = new Date(today).getDay(); // 0-6

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
        setError(err.message || 'Failed to load habits');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const todaysHabits = useMemo(() => {
    return habits.filter((habit) => {
      if (habit.frequency === 'weekly') {
        const days = Array.isArray(habit.weekdays) ? habit.weekdays : [];
        return days.includes(todayWeekday);
      }
      // daily or custom -> always included
      return true;
    });
  }, [habits, todayWeekday]);

  const completedToday = useMemo(() => {
    return todaysHabits.filter((h) => {
      const status = h.history?.[today];
      return status === 'done' || status === 'half' || status === 'missed';
    }).length;
  }, [todaysHabits, today]);

  const handleLocalUpdate = (habitId, status, dateISO) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId ? { ...h, history: { ...(h.history || {}), [dateISO]: status } } : h
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <TodayHeader />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        {loading ? (
          <p className="mt-3 text-sm text-slate-600">Loading today&apos;s habits...</p>
        ) : (
          <div className="mt-6 space-y-4">
            <TodayProgress completed={completedToday} total={todaysHabits.length} />
            <TodayHabitList habits={todaysHabits} onLocalUpdate={handleLocalUpdate} />
          </div>
        )}
      </div>
    </div>
  );
}
