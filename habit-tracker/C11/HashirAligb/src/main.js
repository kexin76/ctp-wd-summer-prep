// Habit Tracker - Week 1
// Store habits and completions
let habits = [];
let completions = [];

// Helper functions
function makeId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getToday() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Save and load data
function saveData() {
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('completions', JSON.stringify(completions));
}

function loadData() {
    const savedHabits = localStorage.getItem('habits');
    const savedCompletions = localStorage.getItem('completions');
    
    if (savedHabits) {
        habits = JSON.parse(savedHabits);
    }
    
    if (savedCompletions) {
        completions = JSON.parse(savedCompletions);
    }
}

// Add new habit
function addHabit(name, frequency) {
    const habit = {
        id: makeId(),
        name: name,
        frequency: frequency,
        created: getToday()
    };
    
    habits.push(habit);
    saveData();
    showHabits();
    updateStats();
}

// Delete habit
function deleteHabit(habitId) {
    habits = habits.filter(habit => habit.id !== habitId);
    completions = completions.filter(comp => comp.habitId !== habitId);
    saveData();
    showHabits();
    updateStats();
}

// Mark habit complete
function markComplete(habitId) {
    const today = getToday();
    
    // Remove if already completed today
    completions = completions.filter(comp => !(comp.habitId === habitId && comp.date === today));
    
    const completion = {
        id: makeId(),
        habitId: habitId,
        date: today,
        completed: true
    };
    
    completions.push(completion);
    saveData();
    showHabits();
    updateStats();
}

// Check if habit is completed today
function isCompletedToday(habitId) {
    const today = getToday();
    return completions.some(comp => comp.habitId === habitId && comp.date === today);
}

// Calculate current streak
function getCurrentStreak(habitId) {
    const today = new Date();
    let currentDate = new Date(today);
    let streak = 0;
    
    while (true) {
        const dateString = currentDate.toISOString().split('T')[0];
        
        if (isCompletedToday(habitId)) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }
    
    return streak;
}

// Show all habits
function showHabits() {
    const container = document.getElementById('habits-container');
    
    if (habits.length === 0) {
        container.innerHTML = '<p>No habits added yet. Add your first habit above!</p>';
        return;
    }
    
    container.innerHTML = habits.map(habit => {
        const streak = getCurrentStreak(habit.id);
        const completed = isCompletedToday(habit.id);
        
        return `
            <div class="habit-item ${completed ? 'completed' : ''}">
                <div class="habit-info">
                    <div class="habit-name">${habit.name}</div>
                    <div class="habit-frequency">Target: ${habit.frequency}</div>
                    <div class="streak-info">
                        Current Streak: <span class="current-streak">${streak} days</span>
                    </div>
                </div>
                <div class="habit-actions">
                    <button class="btn-complete" onclick="markComplete('${habit.id}')">
                        ${completed ? 'Undo' : 'Complete'}
                    </button>
                    <button class="btn-delete" onclick="deleteHabit('${habit.id}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

// Update statistics
function updateStats() {
    const container = document.getElementById('stats-container');
    
    const totalHabits = habits.length;
    const totalCompletions = completions.filter(c => c.completed).length;
    
    container.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">${totalHabits}</div>
                <div class="stat-label">Total Habits</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${totalCompletions}</div>
                <div class="stat-label">Total Completions</div>
            </div>
        </div>
    `;
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    const habitName = document.getElementById('habit-name').value.trim();
    const frequency = document.getElementById('habit-frequency').value;
    
    if (!habitName) {
        alert('Please enter a habit name!');
        return;
    }
    
    addHabit(habitName, frequency);
    
    // Reset form
    event.target.reset();
}

// Initialize app
function init() {
    loadData();
    
    document.getElementById('habit-form').addEventListener('submit', handleFormSubmit);
    
    showHabits();
    updateStats();
}

document.addEventListener('DOMContentLoaded', init);
