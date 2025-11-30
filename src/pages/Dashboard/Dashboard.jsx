import DashboardStats from './DashboardStats';
import TodayOverview from './overview/TodayOverview';
import WeeklySummary from './analytics/WeeklySummary';
import MonthlyHeatmap from './analytics/MonthlyHeatmap';
import TrendCard from './analytics/TrendCard';
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
      {/* <div className="mx-auto max-w-6xl space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
        <div className="space-y-6 lg:space-y-8">
          <WelcomeHero />
          <ProgressSummary
            completed={todayCompleted}
            total={todayTotal}
            totalHabits={totalHabits}
            bestStreak={bestStreak}
            currentStreak={currentStreak}
          />
          <DashboardStats />
        </div>

        <div className="space-y-6 lg:space-y-8">
          <TodayOverview />
        </div>

        <div className="space-y-6 lg:space-y-8">
          <WeeklySummary />
          <MonthlyHeatmap />
          <TrendCard />
        </div>
      </div> */}

      <div className="pt-4"></div>
    </div>
  );
}
