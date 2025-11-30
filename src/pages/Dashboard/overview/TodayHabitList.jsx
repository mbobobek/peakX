import { useState } from 'react';
import DailyPreview from '../../Habits/components/DailyPreview';
import WeeklyPreview from '../../Habits/components/WeeklyPreview';
import CustomPreview from '../../Habits/components/CustomPreview';
import { updateHabitHistory } from '../../../services/habits';
import { getToday } from '../../../utils/dateUtils';
import { useAuth } from '../../../context/AuthContext';

const actionButtons = [
  { label: 'Done', value: 'done', classes: 'bg-green-100 text-green-700 border-green-300 hover:brightness-95' },
  { label: 'Half', value: 'half', classes: 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:brightness-95' },
  { label: 'Missed', value: 'missed', classes: 'bg-red-100 text-red-600 border-red-300 hover:brightness-95' },
];

export default function TodayHabitList({ habits = [], onLocalUpdate }) {
  const { user } = useAuth();
  const [error, setError] = useState('');
  const today = getToday();

  const handleStatus = async (habitId, status) => {
    if (!user?.uid) return;
    setError('');
    try {
      await updateHabitHistory(user.uid, habitId, today, status);
      if (onLocalUpdate) {
        onLocalUpdate(habitId, status, today);
      }
    } catch (err) {
      setError(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="glass-card p-5 md:p-6 shadow-[0_12px_60px_rgba(0,0,0,0.06)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Today&apos;s Habits</h3>
        {error && <span className="text-xs text-danger">{error}</span>}
      </div>
      {habits.length === 0 ? (
        <p className="text-sm text-slate-600 dark:text-slate-300">No habits for today.</p>
      ) : (
        <div className="space-y-3">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="glass-card p-4 md:p-5 shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white">
                  {habit.frequency?.[0]?.toUpperCase() || 'H'}
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">{habit.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {habit.category || 'Uncategorized'} • {habit.frequency || 'daily'}
                  </p>
                  {habit.frequency === 'daily' && <DailyPreview history={habit.history || {}} />}
                  {habit.frequency === 'weekly' && <WeeklyPreview history={habit.history || {}} />}
                  {habit.frequency === 'custom' && (
                    <CustomPreview habit={habit} history={habit.history || {}} />
                  )}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {actionButtons.map((btn) => (
                  <button
                    key={btn.value}
                    onClick={() => handleStatus(habit.id, btn.value)}
                    className={`rounded-full border px-6 py-2 text-xs font-semibold shadow-sm ${btn.classes}`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
