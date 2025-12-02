export default function HabitCapsule({ habit, isSelected, onClick }) {
  const statusDot = {
    done: "bg-emerald-500",
    half: "bg-amber-400",
    missed: "bg-rose-500",
    pending: "bg-slate-400",
  }[habit.statusForToday || "pending"];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-xl shadow-sm border ${
        isSelected
          ? "border-[#9b5eff] shadow-[0_4px_12px_rgba(155,94,255,0.25)]"
          : "border-white/60"
      }`}
    >
      <span className={`inline-flex h-2.5 w-2.5 rounded-full ${statusDot}`} />
      <span className="text-xs md:text-sm font-medium truncate max-w-[120px] md:max-w-[180px]">
        {habit.title}
      </span>
    </button>
  );
}
