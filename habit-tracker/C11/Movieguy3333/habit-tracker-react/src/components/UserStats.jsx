import { useHabit } from "../contexts/HabitContext";

function UserStats() {
  const { userStats } = useHabit();
  return (
    <div className="user-stats">
      {" "}
      <h1 className="section-header">User Stats</h1>
      <h2 className="user-info" id="total-points">
        Total Points Accumulated: {userStats.totalPoints}
      </h2>
      <h2 className="user-info" id="total-habits">
        Total Habits: {userStats.totalHabits}
      </h2>
      <h2 className="user-info" id="longest-streak">
        Longest Streak: {userStats.longestStreak}
      </h2>
      <h2 className="user-info" id="active-streaks">
        Active Streaks: {userStats.activeStreaks}
      </h2>
    </div>
  );
}

export default UserStats;
