import { useRef, useState } from "react";
import { useHabit } from "../contexts/HabitContext";
import Button from "./Button";

function HabitItem({ habit }) {
  const { handleDeleteHabit, handleCompleteHabit, handleEditHabit } =
    useHabit();
  const [isEditModeEnabled, setIsEditModeEnabled] = useState(false);
  const [name, setName] = useState("");

  const topRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (habit.name === name) {
      alert("Please don't enter the same name.");
      return;
    }
    const changedHabit = { ...habit, name: name };
    handleEditHabit(changedHabit);
    setIsEditModeEnabled((currentEditMode) => !currentEditMode);
  }

  function handleToggleEditMode() {
    setIsEditModeEnabled((currentEditMode) => {
      const newMode = !currentEditMode;
      if (!currentEditMode && topRef.current) {
        // Scroll to top when entering edit mode
        topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return newMode;
    });
  }

  return (
    <div className="habit-item" ref={topRef}>
      {!isEditModeEnabled ? (
        <>
          <h1 className="habit-info" id="habit-name">
            {habit.name}
          </h1>
          <h2 className="habit-info">Difficulty: {habit.difficulty}</h2>

          <h3 className="habit-info">
            {habit.completedToday
              ? "  ✅ Completed Today"
              : "❗️ Not Completed Today"}{" "}
          </h3>
          <Button onClick={() => handleCompleteHabit(habit.id)}>
            Complete Habit
          </Button>
          <div className="habit-info-wrapper">
            <div className="habit-numeric-info">
              <h2 className="habit-section-heading">Progress</h2>
              <h3 className="habit-info">Streak: {habit.streak}</h3>
            </div>
            <div className="date-info">
              <h2 className="habit-section-heading">History</h2>
              <h3 className="habit-info" id="date-created">
                Date Created: {habit.createdAt}
              </h3>
              <div className="completion-dates">
                <ul>
                  {habit.completionDates.map((date) => (
                    <li key={date + Math.random()} className="habit-info">
                      Completed on: {date}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <Button onClick={handleToggleEditMode} className="edit-btn">
            Edit Mode
          </Button>
          <Button
            onClick={() => handleDeleteHabit(habit.id)}
            className="delete-btn"
          >
            Delete Habit
          </Button>
        </>
      ) : (
        <>
          <h1>Currently editing: {habit.name}</h1>
          <Button onClick={handleToggleEditMode}>Go Back</Button>
          <form className="form edit-form" onSubmit={handleSubmit}>
            <label htmlFor="name">New Habit Name: </label>
            <input
              type="text"
              placeholder="Enter new habit name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
            />
            <Button type="submit">Save Changes</Button>
          </form>
        </>
      )}
    </div>
  );
}

export default HabitItem;
