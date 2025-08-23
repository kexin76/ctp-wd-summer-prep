import { useState } from "react";
import { useHabit } from "../contexts/HabitContext";
import { format } from "date-fns";
import Button from "./Button";

function Form() {
  const { handleAddHabit } = useHabit();
  const [name, setName] = useState("");
  const [chosenDifficulty, setChosenDifficulty] = useState("");
  function handleSubmit(e) {
    e.preventDefault();
    if (!name) {
      alert("habit must have a name");
      return;
    }

    const currentDateAndTime = format(new Date(), "MM/dd/yyyy");
    const newHabit = {
      id: Date.now(),
      difficulty: chosenDifficulty,
      name: name,
      createdAt: currentDateAndTime,

      completionDates: [currentDateAndTime],
      completedToday: true,
      streak: 0,
    };
    handleAddHabit(newHabit);

    setName("");
  }
  return (
    <div className="form">
      <form className="form add-form" onSubmit={handleSubmit}>
        <h1 className="section-header">Add a habit</h1>
        <label for="name">Habit name:</label>
        <input
          type="text"
          placeholder="Habit name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          id="name"
        />
        <label for="difficulty"> Difficulty:</label>
        <select
          value={chosenDifficulty}
          onChange={(e) => setChosenDifficulty(e.target.value)}
          id="difficulty"
        >
          <option value="Easy">Easy (1 Point)</option>
          <option value="Medium">Medium (2 Points)</option>
          <option value="Hard">Hard (3 Points)</option>
        </select>
        <Button type="submit">Add Habit</Button>
      </form>
    </div>
  );
}

export default Form;
