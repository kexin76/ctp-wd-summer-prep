import "./App.css";
import Form from "./components/Form";
import Habits from "./components/Habits";
import UserStats from "./components/UserStats";

function App() {
  /*   function handleAddHabit(newHabit) {
    setHabits((habits) => [...habits, newHabit]);
  }
  const [habits, setHabits] = useState([]); */

  return (
    <div className="App">
      <Form />
      <Habits />
      <UserStats />
    </div>
  );
}

export default App;
