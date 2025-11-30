import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getHabits } from '../../../services/habits';
import { getToday } from '../../../utils/dateUtils';
import TodayProgress from './TodayProgress';
import TodayHabitList from './TodayHabitList';
import { isBetween } from '../../../utils/dateUtils';

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
      if (habit.frequency === 'custom' && habit.startDate && habit.endDate) {
        return isBetween(today, habit.startDate, habit.endDate);
      }
      // daily or custom without interval -> always included
      return true;
    });
  }, [habits, todayWeekday, today]);

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
      <div className="rounded-2xl card-light dark:card-dark p-6 shadow-sm">
        {error && <p className="mb-2 text-sm text-danger">{error}</p>}
        {loading ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">Loading today&apos;s habits...</p>
        ) : (
          <div className="space-y-4">
            <TodayProgress completed={completedToday} total={todaysHabits.length} />
            <TodayHabitList habits={todaysHabits} onLocalUpdate={handleLocalUpdate} />
          </div>
        )}
      </div>
    </div>
  );
}
