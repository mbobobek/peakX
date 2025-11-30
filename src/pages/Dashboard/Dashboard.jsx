import DashboardStats from './DashboardStats';
import DashboardWeekly from './DashboardWeekly';
import DashboardMonthly from './DashboardMonthly';
import TodayOverview from './overview/TodayOverview';
import WeeklySummary from './analytics/WeeklySummary';
import MonthlyHeatmap from './analytics/MonthlyHeatmap';
import TrendCard from './analytics/TrendCard';
import WelcomeHero from './components/WelcomeHero';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <WelcomeHero />
        <TodayOverview />

        <div className="grid gap-4 md:grid-cols-2">
          <WeeklySummary />
          <MonthlyHeatmap />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <DashboardStats />
          <TrendCard />
        </div>

        <DashboardWeekly />
        <DashboardMonthly />
      </div>
    </div>
  );
}
