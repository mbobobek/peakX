import HabitCapsule from "./HabitCapsule";
import HabitDetailExpanded from "./HabitDetailExpanded";
import { Link } from "react-router-dom";

export default function TodayHabitsSection({
  todayHabits,
  selectedHabitId,
  onSelectHabit,
  onUpdate,
  updatingId,
}) {
  // --- Toggle logic (opens & closes on second click)
  const handleSelect = (id) => {
    if (selectedHabitId === id) {
      onSelectHabit(null); // close panel
    } else {
      onSelectHabit(id); // open new one
    }
  };

  // --- No habits today
  if (!todayHabits || todayHabits.length === 0) {
    return (
      <div className="rounded-3xl bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0px_10px_30px_rgba(0,0,0,0.06)] p-6 text-slate-800">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-slate-900">
            Today&apos;s Habits
          </h3>
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

  // --- UI
  return (
    <div className="space-y-4">
      {/* Habit List */}
      <div className="flex flex-wrap gap-3">
        {todayHabits.map((habit) => (
          <HabitCapsule
            key={habit.id}
            habit={habit}
            isSelected={selectedHabitId === habit.id}
            onClick={() => handleSelect(habit.id)}
          />
        ))}
      </div>

      {/* Expanded panel */}
      {selectedHabitId && (
        <HabitDetailExpanded
          habit={todayHabits.find((h) => h.id === selectedHabitId)}
          onUpdate={onUpdate}
          updatingId={updatingId}
        />
      )}
    </div>
  );
}
