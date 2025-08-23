let habits = [];

const habitForm = document.getElementById('habit-form');
const habitInput = document.getElementById('habit-name');
const habitList = document.getElementById('habit-list');

function loadHabits() {
  const stored = localStorage.getItem('habits');
  if (stored) {
    habits = JSON.parse(stored);
    renderHabits();
  }
}

function saveHabits() {
  localStorage.setItem('habits', JSON.stringify(habits));
}

function renderHabits() {
  habitList.innerHTML = '';
  habits.forEach((habit) => {
    const li = document.createElement('li');
    li.textContent = habit.name;
    habitList.appendChild(li);
  });
}

habitForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const habitName = habitInput.value.trim();
  if (habitName === '') return;

  const newHabit = {
    id: Date.now(),
    name: habitName,
    dates: []
  };

  habits.push(newHabit);
  saveHabits();
  renderHabits();
  habitInput.value = '';
});

loadHabits();
