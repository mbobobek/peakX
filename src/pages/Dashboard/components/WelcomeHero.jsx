import { useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getToday } from '../../../utils/dateUtils';

export default function WelcomeHero() {
  const { user } = useAuth();

  const name = useMemo(() => {
    if (!user?.email) return 'Guest';
    const raw = user.email.split('@')[0] || 'User';
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }, [user]);

  const todayISO = getToday();
  const dateText = new Date(todayISO).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <section className="mb-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#6D5FFC] via-[#7A6BFF] to-[#F7F4FF] px-5 py-5 shadow-[0_20px_45px_rgba(109,95,252,0.35)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 md:px-8 md:py-6">
        <div className="absolute right-8 top-[-20px] h-40 w-40 rounded-full bg-white/20 blur-3xl opacity-60 pointer-events-none" />
        <div className="flex flex-col gap-4 text-center text-white md:flex-row md:items-center md:justify-between md:text-left">
          <div className="space-y-1 md:max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">Dashboard</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Welcome back, {name}</h1>
            <p className="text-sm text-white/80">{dateText}</p>
            <p className="mt-4 max-w-xl text-sm sm:text-base text-white/85">
              You’re on your way to building consistent habits. Focus on today’s tasks and keep your
              streak alive.
            </p>
          </div>
          <div className="relative flex w-full justify-center md:w-auto md:justify-end">
            <div className="rounded-2xl border border-white/40 bg-white/20 px-4 py-3 text-right text-white shadow-sm backdrop-blur">
              <p className="text-xs font-semibold text-white/80">Streak</p>
              <p className="text-lg font-bold">5 days 🔥</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
