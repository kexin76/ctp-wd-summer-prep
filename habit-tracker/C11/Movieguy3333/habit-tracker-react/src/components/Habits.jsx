import { useHabit } from "../contexts/HabitContext";
import HabitItem from "./HabitItem";

function Habits() {
  const { habits } = useHabit();

  return (
    <div className="habits">
      <h1 className="section-header">Habits</h1>

      {habits
        ? habits.map((habit) => <HabitItem habit={habit} key={habit.id} />)
        : "There are no habits"}
    </div>
  );
}

export default Habits;
