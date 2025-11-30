import { InformationCircleIcon } from '@heroicons/react/24/outline';

function formatToday() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

export default function Welcome({ username }) {
  const today = formatToday();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef1ff] to-[#f4f6ff] text-slate-900">
      {/* NAVBAR */}
      <nav className="w-full px-10 py-4 flex items-center justify-between bg-white/60 backdrop-blur-xl shadow-sm border-b border-white/30">
        <div className="text-2xl font-bold bg-gradient-to-r from-[#9b5eff] to-[#7b9dff] bg-clip-text text-transparent">
          PeakX
        </div>

        <div className="flex items-center gap-8 text-slate-700 font-medium">
          <button className="hover:text-[#9b5eff] transition">Dashboard</button>
          <button className="hover:text-[#9b5eff] transition">Habits</button>
          <button className="hover:text-[#9b5eff] transition">Analytics</button>
          <button className="hover:text-[#9b5eff] transition">Goals</button>
          <button className="hover:text-[#9b5eff] transition">Community</button>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-9 w-9 rounded-full bg-[#9b5eff]/15 flex items-center justify-center text-[#9b5eff] font-semibold">
            {username?.[0]}
          </div>
        </div>
      </nav>

      {/* WELCOME SECTION */}
      <div className="px-10 pt-10">
        <div className="w-1/2 bg-gradient-to-r from-[#9b5eff] to-[#7b9dff] rounded-2xl shadow-xl p-8 backdrop-blur-xl border border-white/20 text-white">
          <p className="text-sm opacity-90">{today}</p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Welcome back, {username}
          </h1>

          <div className="mt-6 flex items-start gap-3 text-base opacity-95 leading-relaxed">
            <InformationCircleIcon className="h-5 w-5 mt-1 flex-shrink-0 text-white/90" />
            <div className="space-y-2">
              <p>PeakX helps you track habits, goals and personal growth.</p>
              <p>Stay consistent and unlock your full potential.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
