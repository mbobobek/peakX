import { useState } from 'react';
import DailyPreview from '../../Habits/components/DailyPreview';
import WeeklyPreview from '../../Habits/components/WeeklyPreview';
import CustomPreview from '../../Habits/components/CustomPreview';
import { updateHabitHistory } from '../../../services/habits';
import { getToday } from '../../../utils/dateUtils';
import { useAuth } from '../../../context/AuthContext';

const actionButtons = [
  { label: 'Done', value: 'done', classes: 'bg-green-500 hover:bg-green-600' },
  { label: 'Half', value: 'half', classes: 'bg-yellow-500 hover:bg-yellow-600' },
  { label: 'Missed', value: 'missed', classes: 'bg-red-500 hover:bg-red-600' },
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
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Today&apos;s Habits</h3>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
      {habits.length === 0 ? (
        <p className="text-sm text-slate-600">No habits for today.</p>
      ) : (
        <div className="space-y-4">
          {habits.map((habit) => (
            <div key={habit.id} className="rounded-xl border border-slate-200 p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-semibold text-slate-900">{habit.title}</h4>
                  <p className="text-xs text-slate-600">
                    {habit.category || 'Uncategorized'} • {habit.frequency || 'daily'}
                  </p>
                  {habit.frequency === 'daily' && <DailyPreview history={habit.history || {}} />}
                  {habit.frequency === 'weekly' && <WeeklyPreview history={habit.history || {}} />}
                  {habit.frequency === 'custom' && (
                    <CustomPreview habit={habit} history={habit.history || {}} />
                  )}
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                {actionButtons.map((btn) => (
                  <button
                    key={btn.value}
                    onClick={() => handleStatus(habit.id, btn.value)}
                    className={`rounded-lg px-3 py-1 text-xs font-semibold text-white shadow-sm ${btn.classes}`}
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
