import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getHabits, deleteHabit, updateHabitHistory } from '../../services/habits';
import AddHabitModal from '../../components/modals/AddHabitModal';
import { getToday } from '../../utils/dateUtils';
import DailyPreview from './components/DailyPreview';
import WeeklyPreview from './components/WeeklyPreview';
import CustomPreview from './components/CustomPreview';

export default function Habits() {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

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

  const handleStatus = async (habitId, status) => {
    if (!user?.uid) return;
    const today = getToday();
    try {
      await updateHabitHistory(user.uid, habitId, today, status);
      setHabits((prev) =>
        prev.map((h) =>
          h.id === habitId ? { ...h, history: { ...(h.history || {}), [today]: status } } : h
        )
      );
    } catch (err) {
      setError(err.message || 'Status update failed');
    }
  };

  const handleDelete = async (habitId) => {
    if (!user?.uid) return;
    const confirmDelete = window.confirm('Delete this habit?');
    if (!confirmDelete) return;
    try {
      await deleteHabit(user.uid, habitId);
      setHabits((prev) => prev.filter((h) => h.id !== habitId));
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  };

  const handleCreated = (newHabit) => {
    setHabits((prev) => [newHabit, ...prev]);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 text-slate-900">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-10 text-center shadow">
          <p className="text-sm font-medium text-slate-600">Please sign in to manage your habits.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Your Habits</h1>
            <p className="text-sm text-slate-600">Track and update your daily or weekly habits.</p>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-600"
          >
            New Habit
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 shadow-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow">
            Loading habits...
          </div>
        ) : habits.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow">
            No habits yet. Create one to get started.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className="rounded-xl border border-muted/40 bg-white p-4 shadow-sm dark:bg-dark-surface dark:border-slate-700"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{habit.title}</h3>
                    <p className="text-sm text-slate-600">
                      {habit.category || 'Uncategorized'} • {habit.frequency || 'daily'}
                    </p>
                    {habit.frequency === 'daily' && <DailyPreview history={habit.history || {}} />}
                    {habit.frequency === 'weekly' && <WeeklyPreview history={habit.history || {}} />}
                    {habit.frequency === 'custom' && (
                      <CustomPreview habit={habit} history={habit.history || {}} />
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(habit.id)}
                    className="rounded-lg border border-danger/30 px-2 py-1 text-xs font-semibold text-danger hover:bg-danger/10"
                  >
                    Delete
                  </button>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleStatus(habit.id, 'done')}
                    className="rounded-lg bg-success px-3 py-1 text-xs font-semibold text-white shadow-sm hover:brightness-95"
                  >
                    Done
                  </button>
                  <button
                    onClick={() => handleStatus(habit.id, 'half')}
                    className="rounded-lg bg-warning px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm hover:brightness-95"
                  >
                    Half
                  </button>
                  <button
                    onClick={() => handleStatus(habit.id, 'missed')}
                    className="rounded-lg bg-danger px-3 py-1 text-xs font-semibold text-white shadow-sm hover:brightness-95"
                  >
                    Missed
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddHabitModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onCreated={handleCreated} />
    </div>
  );
}
