import DashboardStats from './DashboardStats';
import TodayOverview from './overview/TodayOverview';
import WelcomeHero from './components/WelcomeHero';
import ProgressSummary from './components/ProgressSummary';

export default function Dashboard() {
  // Placeholder computed values for now
  const todayCompleted = 0;
  const todayTotal = 0;
  const totalHabits = 0;
  const bestStreak = 0;
  const currentStreak = 0;

  return (
    <div className="min-h-screen bg-slate-50 px-4 md:px-6 lg:px-10 py-6 text-slate-900">
      <div className="w-full flex justify-start">
        <div className="w-full md:w-1/2 min-w-[300px] px-3 md:px-6 space-y-6">
          <div className="glass-card w-full p-6">
            <WelcomeHero />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col h-full">
              <div className="glass-card h-[80%] p-4 mb-4">
                <ProgressSummary
                  completed={todayCompleted}
                  total={todayTotal}
                  totalHabits={totalHabits}
                  bestStreak={bestStreak}
                  currentStreak={currentStreak}
                />
              </div>
              <div className="flex gap-4">
                <div className="glass-card w-1/2 h-[90px] p-4">
                  <DashboardStats />
                </div>
                <div className="glass-card w-1/2 h-[90px] p-4">
                  <DashboardStats />
                </div>
              </div>
            </div>

            <div className="glass-card h-full p-4">
              <TodayOverview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
