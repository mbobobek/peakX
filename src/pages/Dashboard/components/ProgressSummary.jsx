import { useMemo } from 'react';

export default function ProgressSummary({
  completed = 0,
  total = 0,
  totalHabits = 0,
  bestStreak = 0,
  currentStreak = 0,
}) {
  const percentage = useMemo(() => {
    if (!total) return 0;
    return Math.max(0, Math.min(100, Number(((completed / total) * 100).toFixed(1))));
  }, [completed, total]);

  const remaining = Math.max(0, total - completed);
  const size = 140;
  const mobileSize = 110;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="w-full rounded-3xl border border-white/40 bg-white/60 p-6 shadow-lg backdrop-blur-xl transition duration-300 dark:border-slate-700/50 dark:bg-dark-surface/80">
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
          <div className="flex flex-col items-center gap-1 md:items-start">
            <span className="text-sm font-semibold uppercase tracking-wide text-primary">Progress</span>
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {completed}/{total} habits completed
            </span>
            <span className="text-sm text-slate-700 dark:text-slate-300">
              {remaining === 0
                ? 'All habits completed — amazing!'
                : `Great job! ${remaining} more to go.`}
            </span>
          </div>

          <div className="flex flex-col items-center gap-3 md:flex-row md:items-center">
            <div className="relative flex items-center justify-center">
              <svg
                className="hidden md:block"
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
              >
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8A6BFF" />
                    <stop offset="100%" stopColor="#6D5FFC" />
                  </linearGradient>
                </defs>
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="url(#progressGradient)"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
                <text
                  x="50%"
                  y="50%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  className="fill-white text-xl font-bold"
                >
                  {percentage}%
                </text>
              </svg>

              <svg
                className="md:hidden"
                width={mobileSize}
                height={mobileSize}
                viewBox={`0 0 ${mobileSize} ${mobileSize}`}
              >
                <defs>
                  <linearGradient id="progressGradientMobile" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8A6BFF" />
                    <stop offset="100%" stopColor="#6D5FFC" />
                  </linearGradient>
                </defs>
                <circle
                  cx={mobileSize / 2}
                  cy={mobileSize / 2}
                  r={(mobileSize - strokeWidth) / 2}
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                <circle
                  cx={mobileSize / 2}
                  cy={mobileSize / 2}
                  r={(mobileSize - strokeWidth) / 2}
                  stroke="url(#progressGradientMobile)"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * ((mobileSize - strokeWidth) / 2)}
                  strokeDashoffset={
                    2 * Math.PI * ((mobileSize - strokeWidth) / 2) -
                    (percentage / 100) * 2 * Math.PI * ((mobileSize - strokeWidth) / 2)
                  }
                  strokeLinecap="round"
                  transform={`rotate(-90 ${mobileSize / 2} ${mobileSize / 2})`}
                />
                <text
                  x="50%"
                  y="50%"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  className="fill-white text-lg font-bold"
                >
                  {percentage}%
                </text>
              </svg>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-[#f4f0ff]/70 px-3 py-2 text-sm text-slate-900 dark:text-slate-100">
                <span className="text-base">💡</span>
                <span>Tip: Start with an easy habit to build early momentum today.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/40 bg-white/60 p-4 shadow-sm backdrop-blur dark:border-slate-700/50 dark:bg-dark-bg/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Total Habits</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{totalHabits}</p>
            </div>
            <span className="text-success">↑</span>
          </div>
        </div>
        <div className="rounded-2xl border border-white/40 bg-white/60 p-4 shadow-sm backdrop-blur dark:border-slate-700/50 dark:bg-dark-bg/40">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Best Streak</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{bestStreak} days</p>
              <p className="text-xs text-slate-600 dark:text-slate-300">Current: {currentStreak} days</p>
            </div>
            <span className="text-xl">🔥</span>
          </div>
        </div>
      </div>
    </div>
  );
}
