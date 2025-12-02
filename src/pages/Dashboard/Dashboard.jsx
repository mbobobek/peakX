import WelcomeHeader from "./components/WelcomeHeader";
import ProgressCard from "./components/ProgressCard";
import TodayHabitsSection from "./components/TodayHabitsSection";
import WeeklySummaryCard from "./components/WeeklySummaryCard";
import MonthlyActivityCard from "./components/MonthlyActivityCard";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 pt-6">
      <div className="flex flex-col gap-6">
        <WelcomeHeader />
        <ProgressCard />
        <TodayHabitsSection />
      </div>

      <div className="flex flex-col gap-6">
        <WeeklySummaryCard />
        <MonthlyActivityCard />
      </div>
    </div>
  );
}
