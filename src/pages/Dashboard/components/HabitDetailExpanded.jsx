export default function HabitDetailExpanded({ habit, onUpdate, updatingId }) {
  if (!habit) {
    return (
      <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0px_8px_24px_rgba(0,0,0,0.06)] p-4 text-sm text-slate-600">
        Select a habit above to view details.
      </div>
    );
  }

  const statusBadge = {
    done: "bg-emerald-50 text-emerald-700",
    half: "bg-amber-50 text-amber-700",
    missed: "bg-rose-50 text-rose-700",
    pending: "bg-slate-100 text-slate-700",
  }[habit.statusForToday || "pending"];

  const statuses = [
    { key: "done", label: "DONE", className: "bg-green-100 text-green-800 hover:bg-green-200" },
    { key: "half", label: "HALF", className: "bg-amber-100 text-amber-800 hover:bg-amber-200" },
    { key: "missed", label: "MISSED", className: "bg-rose-100 text-rose-800 hover:bg-rose-200" },
  ];

  return (
    <div className="mt-2 rounded-2xl bg-white/80 backdrop-blur-xl shadow-lg p-5 flex flex-col gap-4 border border-white/60">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{habit.title}</h3>
          <p className="text-xs text-slate-500">{habit.frequency} habit</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge}`}>
          {habit.statusForToday || "pending"}
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
              updatingId === habit.id ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
