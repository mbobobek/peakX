import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getHabits, updateHabitHistory } from "../services/habits";
import { getToday, getLast7Days, isBetween } from "../utils/dateUtils";

// COMPONENTS
import WelcomeHeader from "./Dashboard/components/WelcomeHeader";
import ProgressCard from "./Dashboard/components/ProgressCard";
import TodayHabitsSection from "./Dashboard/components/TodayHabitsSection";
import WeeklySummaryCard from "./Dashboard/components/summary/WeeklySummaryCard";
import MonthlyActivityCard from "./Dashboard/components/summary/MonthlyActivityCard";

export default function Welcome({ username }) {
  const { user, loading: authLoading } = useAuth();

  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedHabitId, setSelectedHabitId] = useState(null);

  const todayKey = useMemo(() => getToday(), []);
  const readableDate = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
    []
  );

  const displayName = useMemo(() => {
    if (username) return username;
    if (user?.displayName) return user.displayName;
    if (user?.email) {
      const name = user.email.split("@")[0];
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return "PeakX user";
  }, [username, user]);

  // Load habits
  useEffect(() => {
    if (authLoading) return;

    if (!user?.uid) {
      setHabits([]);
      setLoading(false);
      setError("Please sign in to see your dashboard.");
      return;
    }

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getHabits(user.uid);
        setHabits(data);
      } catch (err) {
        setError(err.message || "Failed to load habits");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user, authLoading]);

  // Check if habit is scheduled today
  const isHabitScheduledOnDate = (habit, dateKey) => {
    if (habit.frequency === "custom") {
      const { startDate, endDate } = habit;
      return isBetween(dateKey, startDate, endDate);
    }
    return true; // daily/weekly default
  };

  const todayHabits = useMemo(
    () =>
      habits
        .filter((h) => isHabitScheduledOnDate(h, todayKey))
        .map((h) => ({
          ...h,
          statusForToday: h?.history?.[todayKey] || "pending",
        })),
    [habits, todayKey]
  );

  const totalHabits = todayHabits.length;
  const completedHabits = todayHabits.filter(
    (h) => h.statusForToday === "done"
  ).length;

  const percent =
    totalHabits === 0 ? 0 : (completedHabits / totalHabits) * 100;

  // Weekly Summary
  const weeklySummary = useMemo(() => {
    const days = getLast7Days();
    const todayDate = new Date(todayKey);

    return days.map((dateKey) => {
      const dateObj = new Date(dateKey);
      const dayName = dateObj.toLocaleDateString("en-US", {
        weekday: "long",
      });

      const isToday = dateKey === todayKey;

      if (dateObj > todayDate)
        return { day: dayName, percent: null, future: true, dateKey, isToday };

      const scheduled = habits.filter((h) =>
        isHabitScheduledOnDate(h, dateKey)
      );
      const doneCount = scheduled.filter(
        (h) => h?.history?.[dateKey] === "done"
      ).length;

      const percent =
        scheduled.length > 0
          ? Math.round((doneCount / scheduled.length) * 100)
          : 0;

      return { day: dayName, percent, dateKey, isToday };
    });
  }, [habits, todayKey]);

  const handleStatusChange = async (habitId, status) => {
    if (!user?.uid) return;

    setUpdatingId(habitId);

    try {
      await updateHabitHistory(user.uid, habitId, todayKey, status);

      setHabits((prev) =>
        prev.map((h) =>
          h.id === habitId
            ? {
                ...h,
                history: { ...(h.history || {}), [todayKey]: status },
              }
            : h
        )
      );
    } catch (err) {
      setError(err.message || "Failed to update habit");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-90px)] text-slate-900 pt-12 md:pt-16">
      <div className="max-w-6xl mx-auto px-6">

        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[65%_35%]">

            {/* LEFT */}
            <div className="flex flex-col gap-5">

              <div className="order-1 md:order-1 lg:order-none">
                <WelcomeHeader
                  displayName={displayName}
                  readableDate={readableDate}
                />
              </div>

              {error && (
                <div className="w-full rounded-2xl border border-red-100 bg-red-50/80 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="rounded-3xl bg-white/60 backdrop-blur-xl p-6 min-h-[160px]">
                  Loading habits...
                </div>
              ) : (
                <div className="flex flex-col gap-6">

                  <div className="grid grid-cols-1 lg:grid-cols-[42%_58%] gap-4 items-start">
                    <div className="w-full order-3 md:order-2 lg:order-none">
                      <ProgressCard
                        total={totalHabits}
                        completed={completedHabits}
                        percent={percent}
                      />
                    </div>

                    <div className="w-full order-2 md:order-3 lg:order-none">
                      <TodayHabitsSection
                        todayHabits={todayHabits}
                        selectedHabitId={selectedHabitId}
                        onSelectHabit={(id) =>
                          setSelectedHabitId((prev) =>
                            prev === id ? null : id
                          )
                        }
                        updatingId={updatingId}
                        onUpdate={handleStatusChange}
                      />
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* RIGHT */}
            <div className="flex flex-col gap-3 w-full order-4 md:order-4 lg:order-none lg:max-w-[360px] lg:ml-auto">
              <WeeklySummaryCard 
                weeklySummary={weeklySummary}
                todayKey={todayKey}
              />
              <MonthlyActivityCard />
            </div>

          </div>
        </main>

      </div>
    </div>
  );
}
