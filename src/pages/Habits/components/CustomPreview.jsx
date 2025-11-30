export default function CustomPreview({ history = {}, habit }) {
  const target = Number(habit?.targetCount) > 0 ? Number(habit.targetCount) : 5;
  const entries = Object.values(history || {});
  const score = entries.reduce((acc, val) => {
    if (val === 'done') return acc + 1;
    if (val === 'half') return acc + 0.5;
    return acc;
  }, 0);
  const filled = Math.min(target, Math.round(score));

  return (
    <div className="mt-3">
      <div className="mb-1 text-xs font-medium text-slate-600">
        {filled}/{target}
      </div>
      <div className="flex gap-1">
        {Array.from({ length: target }).map((_, idx) => (
          <span
            key={idx}
            className={`h-2.5 w-6 rounded ${idx < filled ? 'bg-blue-500' : 'bg-slate-200'}`}
          />
        ))}
      </div>
    </div>
  );
}
