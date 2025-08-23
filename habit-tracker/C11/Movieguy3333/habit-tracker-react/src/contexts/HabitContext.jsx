import { createContext, useContext, useEffect } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { parse, differenceInCalendarDays, format } from "date-fns";

const HabitContext = createContext();

/* const FAKE_DATE = new Date("2025-08-07T00:00:00");
const todaysDate = format(FAKE_DATE, "MM/dd/yyyy"); */

const todaysDate = format(new Date(), "MM/dd/yyyy");

function HabitProvider({ children }) {
  const [habits, setHabits] = useLocalStorageState([], "habits");
  const [userStats, setUserStats] = useLocalStorageState(
    { totalHabits: 0, totalPoints: 0, activeStreaks: 0, longestStreak: 0 },
    "user-stats"
  );

  useEffect(() => {
    console.log("Checking habits on load. Today's date:", todaysDate);

    setHabits((habits) =>
      habits.map((habit) =>
        habit.completionDates[habit.completionDates.length - 1] !== todaysDate
          ? { ...habit, completedToday: false }
          : habit
      )
    );
  }, [setHabits]);

  function handleAddHabit(newHabit) {
    setHabits((habits) => [...habits, newHabit]);
    setUserStats({
      ...userStats,
      totalPoints:
        userStats.totalPoints + checkDifficultyValue(newHabit.difficulty),
      /* activeStreaks: userStats.activeStreaks + 1, */
      longestStreak:
        newHabit.streak > userStats.longestStreak
          ? newHabit.streak
          : userStats.longestStreak,
      totalHabits: userStats.totalHabits + 1,
    });
    alert("Habit Successfully Created.");
  }

  function handleEditHabit(changedHabit) {
    setHabits((habits) =>
      habits.map((habit) =>
        habit.id === changedHabit.id ? changedHabit : habit
      )
    );
    alert("Habit Successfully Changed");
  }

  function handleDeleteHabit(id) {
    if (!habits) return;
    const habit = habits.find((habit) => habit.id === id);
    setHabits((habits) => habits.filter((habit) => habit.id !== id));

    setUserStats((userStats) => ({
      ...userStats,
      activeStreaks:
        habit.streak > 0
          ? userStats.activeStreaks - 1
          : userStats.activeStreaks,
    }));
    alert("Habit Successfully Deleted");
  }

  function handleCompleteHabit(id) {
    setHabits((habits) => {
      const habit = habits.find((habit) => habit.id === id);

      if (habit.completedToday) {
        alert("You've already completed this habit today!");
        return habits;
      }

      const lastDateCompleted =
        habit.completionDates[habit.completionDates.length - 1];
      const exactlyOneDayApart =
        Math.abs(
          differenceInCalendarDays(
            parse(todaysDate, "MM/dd/yyyy", new Date()),
            parse(lastDateCompleted, "MM/dd/yyyy", new Date())
          )
        ) === 1;

      setUserStats({
        ...userStats,
        totalPoints:
          userStats.totalPoints + checkDifficultyValue(habit.difficulty),
        longestStreak:
          habit.streak + 1 > userStats.longestStreak && exactlyOneDayApart
            ? habit.streak + 1
            : userStats.longestStreak,
        activeStreaks:
          exactlyOneDayApart && habit.streak === 0
            ? userStats.activeStreaks + 1
            : !exactlyOneDayApart && habit.streak >= 1
            ? userStats.activeStreaks - 1
            : userStats.activeStreaks,
      });

      return habits.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              streak: exactlyOneDayApart ? habit.streak + 1 : 0,
              completedToday: true,
              completionDates: [
                ...habit.completionDates,
                // change to todaysDate
                todaysDate,
              ],
            }
          : habit
      );
    });
  }
  function checkDifficultyValue(difficulty) {
    if (difficulty === "Easy") return 1;
    if (difficulty === "Medium") return 2;
    if (difficulty === "Hard") return 3;
    return 0;
  }
  return (
    <HabitContext.Provider
      value={{
        habits,
        setHabits,
        userStats,

        handleAddHabit,
        handleEditHabit,
        handleDeleteHabit,
        handleCompleteHabit,
        checkDifficultyValue,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
}

function useHabit() {
  const context = useContext(HabitContext);
  if (context === undefined)
    throw new Error("HabitContext was used outside provider");

  return context;
}

export { HabitProvider, useHabit };
