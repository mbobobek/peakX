import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  const displayName = useMemo(() => {
    if (user?.email) {
      const name = user.email.split('@')[0];
      return name ? name.charAt(0).toUpperCase() + name.slice(1) : 'PeakX user';
    }
    return 'PeakX user';
  }, [user]);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050816]">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <section className="w-full lg:w-1/2">
          <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-r from-[#7B5CFF] via-[#A667FF] to-[#FF7BD7] p-6 text-white shadow-[0_18px_45px_rgba(88,63,200,0.35)] sm:p-8">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-xl" />
            <div className="relative">
              <div className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70 mb-3">
                Dashboard
              </div>
              <h1 className="text-2xl font-bold sm:text-3xl">Welcome back, {displayName}</h1>
              <p className="mt-1 text-sm text-white/80 sm:text-base">{formattedDate}</p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-[15px]">
                PeakX helps you build consistent habits and track your daily progress in one place. Focus
                on today’s key tasks and keep your streak alive.
              </p>
              <div className="mt-6 flex justify-start">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
                  🔥 Streak · 0 days
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
