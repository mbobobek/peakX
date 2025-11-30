import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getHabits, deleteHabit, updateHabitHistory } from '../../services/habits';
import AddHabitModal from '../../components/modals/AddHabitModal';
import { getToday, getLast7Days } from '../../utils/dateUtils';

const statusColors = {
  done: 'bg-green-500',
  half: 'bg-yellow-400',
  missed: 'bg-red-500',
  none: 'bg-slate-300',
};

function WeeklyDots({ history }) {
  const days = getLast7Days();
  return (
    <div className="mt-3 flex gap-2">
      {days.map((d) => {
        const status = history?.[d] || 'none';
        return <span key={d} className={`h-3 w-3 rounded-full ${statusColors[status]}`} title={d} />;
      })}
    </div>
  );
}

export default function Habits() {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');

  const fetchHabits = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const data = await getHabits(user.uid);
      setHabits(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchHabits();
    } else {
      setHabits([]);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleDelete = async (id) => {
    if (!user) return;
    try {
      await deleteHabit(user.uid, id);
      setHabits((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreated = (habit) => {
    setHabits((prev) => [habit, ...prev]);
  };

  const handleStatus = async (habitId, status) => {
    if (!user) return;
    const today = getToday();
    try {
      await updateHabitHistory(user.uid, habitId, today, status);
      setHabits((prev) =>
        prev.map((h) =>
          h.id === habitId
            ? {
                ...h,
                history: {
                  ...(h.history || {}),
                  [today]: status,
                },
              }
            : h
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Habits</h1>
          <p className="text-sm text-slate-600">Track your habits and update today’s status.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-600"
        >
          New Habit
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow">
          Loading habits...
        </div>
      ) : habits.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow">
          No habits yet. Create one to get started.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {habits.map((habit) => (
            <div key={habit.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{habit.title}</h3>
                  <p className="text-sm text-slate-600">
                    {habit.category} • {habit.frequency}
                  </p>
                  <p className="text-xs text-slate-400">
                    Created: {new Date(habit.createdAt).toLocaleDateString()}
                  </p>
                  <WeeklyDots history={habit.history || {}} />
                </div>
                <button
                  onClick={() => handleDelete(habit.id)}
                  className="rounded-lg border border-red-200 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleStatus(habit.id, 'done')}
                  className="rounded-lg bg-green-500 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-green-600"
                >
                  Done
                </button>
                <button
                  onClick={() => handleStatus(habit.id, 'half')}
                  className="rounded-lg bg-yellow-400 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-yellow-500"
                >
                  Half
                </button>
                <button
                  onClick={() => handleStatus(habit.id, 'missed')}
                  className="rounded-lg bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow-sm hover:bg-red-600"
                >
                  Missed
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddHabitModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        userId={user?.uid}
        onCreated={handleCreated}
      />
    </div>
  );
}
