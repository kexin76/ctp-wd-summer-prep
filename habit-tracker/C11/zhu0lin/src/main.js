// Habit Tracker Application
class HabitTracker {
  constructor() {
    this.habits = [];
    this.today = new Date().toDateString();
    this.init();
  }

  init() {
    this.loadHabits();
    this.setupEventListeners();
    this.renderHabits();
    this.updateStats();
  }

  // Local Storage Operations
  saveHabits() {
    localStorage.setItem('habits', JSON.stringify(this.habits));
  }

  loadHabits() {
    const saved = localStorage.getItem('habits');
    this.habits = saved ? JSON.parse(saved) : [];
  }

  // Event Listeners
  setupEventListeners() {
    const form = document.getElementById('habitForm');
    form.addEventListener('submit', (e) => this.handleAddHabit(e));
  }

  // Habit CRUD Operations
  handleAddHabit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const habit = {
      id: Date.now().toString(),
      name: formData.get('habitName').trim(),
      description: formData.get('habitDescription').trim(),
      category: formData.get('habitCategory'),
      goal: parseInt(formData.get('habitGoal')),
      streak: 0,
      longestStreak: 0,
      completedDates: [],
      createdAt: new Date().toISOString()
    };

    this.addHabit(habit);
    e.target.reset();
  }

  addHabit(habit) {
    this.habits.push(habit);
    this.saveHabits();
    this.renderHabits();
    this.updateStats();
    this.showNotification('Habit added successfully!', 'success');
  }

  deleteHabit(habitId) {
    if (confirm('Are you sure you want to delete this habit?')) {
      this.habits = this.habits.filter(habit => habit.id !== habitId);
      this.saveHabits();
      this.renderHabits();
      this.updateStats();
      this.showNotification('Habit deleted successfully!', 'success');
    }
  }

  toggleHabitCompletion(habitId) {
    const habit = this.habits.find(h => h.id === habitId);
    if (!habit) return;

    const today = new Date().toDateString();
    const isCompletedToday = habit.completedDates.includes(today);

    if (isCompletedToday) {
      // Uncomplete habit
      habit.completedDates = habit.completedDates.filter(date => date !== today);
      this.calculateStreak(habit);
    } else {
      // Complete habit
      habit.completedDates.push(today);
      this.calculateStreak(habit);
    }

    this.saveHabits();
    this.renderHabits();
    this.updateStats();
    
    const message = isCompletedToday ? 'Habit uncompleted' : 'Habit completed!';
    this.showNotification(message, 'success');
  }

  // Streak Calculation
  calculateStreak(habit) {
    const sortedDates = habit.completedDates
      .map(date => new Date(date))
      .sort((a, b) => b - a);

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Calculate current streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedDates.length; i++) {
      const date = sortedDates[i];
      date.setHours(0, 0, 0, 0);

      if (i === 0) {
        const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));
        if (diffDays <= 1) {
          currentStreak = 1;
          tempStreak = 1;
        }
      } else {
        const prevDate = sortedDates[i - 1];
        const diffDays = Math.floor((prevDate - date) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          tempStreak++;
          if (i === 0 || Math.floor((today - date) / (1000 * 60 * 60 * 24)) <= 1) {
            currentStreak = tempStreak;
          }
        } else {
          tempStreak = 1;
        }
      }

      longestStreak = Math.max(longestStreak, tempStreak);
    }

    habit.streak = currentStreak;
    habit.longestStreak = Math.max(habit.longestStreak, longestStreak);
  }

  // Rendering
  renderHabits() {
    const habitsList = document.getElementById('habitsList');
    const emptyState = document.getElementById('emptyState');

    if (this.habits.length === 0) {
      habitsList.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';
    habitsList.innerHTML = this.habits
      .map(habit => this.createHabitCard(habit))
      .join('');
  }

  createHabitCard(habit) {
    const today = new Date().toDateString();
    const isCompletedToday = habit.completedDates.includes(today);
    const completionCount = habit.completedDates.filter(date => date === today).length;
    const progressPercentage = Math.min((completionCount / habit.goal) * 100, 100);

    return `
      <div class="habit-card ${isCompletedToday ? 'completed' : ''}" data-habit-id="${habit.id}">
        <div class="habit-header">
          <div class="habit-info">
            <div class="habit-name">${this.escapeHtml(habit.name)}</div>
            ${habit.description ? `<div class="habit-description">${this.escapeHtml(habit.description)}</div>` : ''}
            <div class="habit-meta">
              <span class="habit-category ${habit.category}">${this.getCategoryDisplayName(habit.category)}</span>
              <div class="habit-streak">
                <span class="streak-icon">🔥</span>
                <span>${habit.streak} day${habit.streak !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
          <div class="habit-actions">
            <button class="complete-btn ${isCompletedToday ? 'completed' : ''}" 
                    onclick="habitTracker.toggleHabitCompletion('${habit.id}')">
              ${isCompletedToday ? '✓ Done' : 'Complete'}
            </button>
            <button class="delete-btn" onclick="habitTracker.deleteHabit('${habit.id}')">
              ×
            </button>
          </div>
        </div>
        <div class="habit-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progressPercentage}%"></div>
          </div>
          <div class="progress-text">
            ${completionCount}/${habit.goal} completed today
          </div>
        </div>
      </div>
    `;
  }

  // Utility Functions
  getCategoryDisplayName(category) {
    const categories = {
      health: 'Health & Fitness',
      productivity: 'Productivity',
      learning: 'Learning',
      mindfulness: 'Mindfulness',
      social: 'Social',
      other: 'Other'
    };
    return categories[category] || category;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Statistics
  updateStats() {
    const totalHabits = this.habits.length;
    const activeStreaks = this.habits.filter(habit => habit.streak > 0).length;
    const today = new Date().toDateString();
    
    const completedToday = this.habits.reduce((total, habit) => {
      const completions = habit.completedDates.filter(date => date === today).length;
      return total + Math.min(completions, habit.goal);
    }, 0);

    const totalToday = this.habits.reduce((total, habit) => total + habit.goal, 0);
    const completionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

    // Update DOM
    document.getElementById('totalHabits').textContent = totalHabits;
    document.getElementById('activeStreaks').textContent = activeStreaks;
    document.getElementById('completedToday').textContent = completedToday;
    document.getElementById('totalToday').textContent = totalToday;
    document.getElementById('completionRate').textContent = `${completionRate}%`;
  }

  // Notifications
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 20px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '600',
      zIndex: '1000',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease',
      backgroundColor: type === 'success' ? '#28a745' : '#007bff'
    });

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}

// Initialize the application
let habitTracker;

document.addEventListener('DOMContentLoaded', () => {
  habitTracker = new HabitTracker();
});

// Make habitTracker globally available for button onclick handlers
window.habitTracker = null;
document.addEventListener('DOMContentLoaded', () => {
  window.habitTracker = new HabitTracker();
});
