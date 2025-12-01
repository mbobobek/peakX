import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { getHabits, updateHabitHistory } from '../services/habits';
import { getToday, isBetween, getLast7Days } from '../utils/dateUtils';

function formatTodayReadable() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

function isHabitScheduledOnDate(habit, dateKey) {
  if (!habit) return false;
  if (habit.frequency === 'custom') {
    const { startDate, endDate } = habit;
    if (startDate && endDate) {
      return isBetween(dateKey, startDate, endDate);
    }
  }
  // Default: treat daily/weekly (and others) as scheduled today
  return true;
}

export default function Welcome({ username }) {
  const { user, loading: authLoading } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedHabitId, setSelectedHabitId] = useState(null);

  const todayKey = useMemo(() => getToday(), []);
  const readableDate = useMemo(() => formatTodayReadable(), []);

  const displayName = useMemo(() => {
    if (username) return username;
    if (user?.displayName) return user.displayName;
    if (user?.email) {
      const name = user.email.split('@')[0];
      return name ? name.charAt(0).toUpperCase() + name.slice(1) : 'PeakX user';
    }
    return 'PeakX user';
  }, [username, user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.uid) {
      setHabits([]);
      setLoading(false);
      setError('Please sign in to see your dashboard.');
      return;
    }
    const load = async () => {
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
  }, [user, authLoading]);

  const todayHabits = useMemo(
    () =>
      habits
        .filter((h) => isHabitScheduledOnDate(h, todayKey))
        .map((h) => ({
          ...h,
          statusForToday: h?.history?.[todayKey] || 'pending',
        })),
    [habits, todayKey]
  );

  const totalHabits = todayHabits.length;
  const completedHabits = todayHabits.filter((h) => h.statusForToday === 'done').length;
  const percentNumber = totalHabits === 0 ? 0 : (completedHabits / totalHabits) * 100;
  const percentDisplay = percentNumber.toFixed(1);
  const weeklySummary = useMemo(() => getWeeklySummary(habits, todayKey), [habits, todayKey]);

  const handleStatusChange = async (habitId, status) => {
    if (!user?.uid) {
      setError('Please sign in to update habits.');
      return;
    }
    setUpdatingId(habitId);
    setError('');
    try {
      await updateHabitHistory(user.uid, habitId, todayKey, status);
      setHabits((prev) =>
        prev.map((h) =>
          h.id === habitId ? { ...h, history: { ...(h.history || {}), [todayKey]: status } } : h
        )
      );
    } catch (err) {
      setError(err.message || 'Failed to update habit');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef1ff] to-[#f4f6ff] text-slate-900">
      <div className="max-w-6xl mx-auto px-6">
        {/* DASHBOARD */}
        <main className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 px-6 pt-6">
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-6">
              <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-r from-[#a074ff] via-[#8a8dff] to-[#6ca8ff] shadow-[0px_10px_35px_rgba(0,0,0,0.10)] shadow-inner shadow-white/10 backdrop-blur-2xl border border-white/20 text-white px-8 md:px-10 py-8">
                <div className="relative z-10">
                  <p className="text-xs md:text-sm font-semibold opacity-95">{readableDate}</p>

                  <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight">
                    Welcome back, {displayName}
                  </h1>

                  <div className="mt-3 flex items-start gap-2.5 text-xs md:text-sm font-semibold opacity-95 leading-snug">
                    <InformationCircleIcon className="h-5 w-5 mt-1 flex-shrink-0 text-white/90" />
                    <div className="space-y-1">
                      <p>PeakX helps you track habits, goals and personal growth.</p>
                      <p>Stay consistent and unlock your full potential.</p>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="w-full rounded-2xl border border-red-100 bg-red-50/80 px-4 py-3 text-sm text-red-700 shadow-sm">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="w-full rounded-3xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0px_10px_30px_rgba(0,0,0,0.06)] px-6 py-10 text-slate-600">
                  Loading today&apos;s habits...
                </div>
              ) : (
                <div className="w-full flex flex-col gap-6">
                  <div className="flex gap-4">
                    <div className="w-[35%]">
                      <ProgressCard total={totalHabits} completed={completedHabits} percent={percentNumber} />
                    </div>
                    <div className="w-[65%] flex flex-col gap-4">
                      <h2 className="text-xl font-semibold text-slate-800">Today&apos;s Habits</h2>
                      <TodayHabitsSection
                        todayHabits={todayHabits}
                        onUpdate={handleStatusChange}
                        updatingId={updatingId}
                        selectedHabitId={selectedHabitId}
                        onSelectHabit={(id) => setSelectedHabitId((prev) => (prev === id ? null : id))}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-6">
              <WeeklySummaryCard weeklySummary={weeklySummary} />
              <MonthlyActivityCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function ProgressCard({ total, completed, percent }) {
  const safePercent = Number.isFinite(percent) ? percent : 0;
  const percentDisplay = total === 0 ? '0.0' : safePercent.toFixed(1);

  return (
    <div className="bg-white/50 backdrop-blur-xl border border-white/40 rounded-3xl shadow-[0px_10px_30px_rgba(0,0,0,0.08)] p-8 flex flex-col items-center gap-6">
      <div
        className="relative h-28 w-28 md:h-32 md:w-32 rounded-full flex items-center justify-center"
        style={{
          background: `conic-gradient(#9b5eff ${safePercent}%, #e5e7eb ${safePercent}%)`,
        }}
      >
        <div className="h-[88%] w-[88%] rounded-full bg-white/90 flex items-center justify-center text-slate-900 font-bold text-base">
          {percentDisplay}%
        </div>
      </div>

      <div className="space-y-1 text-slate-900 text-center">
        <p className="text-lg font-semibold">
          {completed}/{total} habits completed
        </p>
        <p className="text-sm text-slate-600">
          {total === 0 ? 'No habits scheduled today.' : 'Great job! Keep it up.'}
        </p>
      </div>
    </div>
  );
}

function TodayHabitsSection({ todayHabits, onUpdate, updatingId, selectedHabitId, onSelectHabit }) {
  if (!todayHabits || todayHabits.length === 0) {
    return (
      <div className="rounded-3xl bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0px_10px_30px_rgba(0,0,0,0.06)] p-6 text-slate-800">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-slate-900">Today&apos;s Habits</h3>
          <p className="text-sm text-slate-600">
            No habits scheduled for today. Create some on the Habits page.
          </p>
          <Link
            to="/habits"
            className="mt-2 inline-flex w-fit rounded-xl bg-gradient-to-r from-[#9b5eff] to-[#7b9dff] px-4 py-2 text-sm font-semibold text-white shadow hover:shadow-md transition"
          >
            Go to Habits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {todayHabits.map((habit) => (
          <TodayHabitCapsule
            key={habit.id}
            habit={habit}
            isSelected={selectedHabitId === habit.id}
            onClick={() => onSelectHabit(habit.id)}
          />
        ))}
      </div>

      <ExpandedHabitDetail
        habit={todayHabits.find((h) => h.id === selectedHabitId)}
        onUpdate={onUpdate}
        updatingId={updatingId}
      />
    </div>
  );
}

function TodayHabitCapsule({ habit, isSelected, onClick }) {
  const statusDot = {
    done: 'bg-emerald-500',
    half: 'bg-amber-400',
    missed: 'bg-rose-500',
    pending: 'bg-slate-400',
  }[habit.statusForToday || 'pending'];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-xl shadow-sm border ${
        isSelected ? 'border-[#9b5eff] shadow-[0_4px_12px_rgba(155,94,255,0.25)]' : 'border-white/60'
      }`}
    >
      <span className={`inline-flex h-2.5 w-2.5 rounded-full ${statusDot}`} />
      <span className="text-xs md:text-sm font-medium truncate max-w-[120px] md:max-w-[180px]">
        {habit.title}
      </span>
    </button>
  );
}

function ExpandedHabitDetail({ habit, onUpdate, updatingId }) {
  if (!habit) {
    return (
      <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0px_8px_24px_rgba(0,0,0,0.06)] p-4 text-sm text-slate-600">
        Select a habit above to view details.
      </div>
    );
  }

  const statusBadge = {
    done: 'bg-emerald-50 text-emerald-700',
    half: 'bg-amber-50 text-amber-700',
    missed: 'bg-rose-50 text-rose-700',
    pending: 'bg-slate-100 text-slate-700',
  }[habit.statusForToday || 'pending'];

  const statuses = [
    { key: 'done', label: 'DONE', className: 'bg-green-100 text-green-800 hover:bg-green-200' },
    { key: 'half', label: 'HALF', className: 'bg-amber-100 text-amber-800 hover:bg-amber-200' },
    { key: 'missed', label: 'MISSED', className: 'bg-rose-100 text-rose-800 hover:bg-rose-200' },
  ];

  return (
    <div className="mt-2 rounded-2xl bg-white/80 backdrop-blur-xl shadow-lg p-5 flex flex-col gap-4 border border-white/60">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{habit.title}</h3>
          <p className="text-xs text-slate-500">{habit.frequency} habit</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge}`}>
          {habit.statusForToday || 'pending'}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {statuses.map((s) => (
          <button
            key={s.key}
            type="button"
            disabled={updatingId === habit.id}
            onClick={() => onUpdate(habit.id, s.key)}
            className={`rounded-full px-4 py-2 text-xs md:text-sm font-semibold transition shadow-sm ${s.className} ${
              updatingId === habit.id ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function getWeeklySummary(habits, todayKey) {
  const days = getLast7Days();
  const todayDate = new Date(todayKey);

  return days.map((dateKey) => {
    const dateObj = new Date(dateKey);
    const isFuture = dateObj > todayDate;
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

    if (isFuture) {
      return { day: dayName, percent: null };
    }

    const scheduled = habits.filter((h) => isHabitScheduledOnDate(h, dateKey));
    const total = scheduled.length;
    const doneCount = scheduled.filter((h) => h?.history?.[dateKey] === 'done').length;
    const percent = total > 0 ? Math.round((doneCount / total) * 100) : 0;

    return { day: dayName, percent };
  });
}

function WeeklySummaryCard({ weeklySummary }) {
  const barColor = (percent) => {
    if (percent === null) return 'bg-slate-300';
    if (percent >= 80) return 'bg-emerald-500';
    if (percent >= 40) return 'bg-amber-400';
    return 'bg-rose-500';
  };

  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur-xl shadow-xl p-4 border border-white/60">
      <h2 className="text-lg font-semibold text-slate-900 mb-2">Weekly Summary</h2>
      <div className="space-y-2.5">
        {weeklySummary.map((day) => (
          <div key={day.day} className="space-y-2">
            <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
              <span>{day.day}</span>
              <span className="text-slate-600">{day.percent === null ? 'Future' : `${day.percent}%`}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200/60 overflow-hidden">
              <div
                className={`h-2 rounded-full ${barColor(day.percent)}`}
                style={{ width: day.percent === null ? '0%' : `${Math.min(100, Math.max(0, day.percent))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthlyActivityCard() {
  return (
    <div className="rounded-2xl bg-white/70 backdrop-blur-xl shadow-xl p-4 border border-white/60">
      <h2 className="text-lg font-semibold mb-2 text-slate-900">Monthly Activity</h2>
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: 28 }).map((_, idx) => (
          <div key={idx} className="h-4 w-4 rounded bg-slate-200/80" />
        ))}
      </div>
    </div>
  );
}
