# Habit Tracker

A simple, beautiful habit tracker built with vanilla JavaScript, HTML, and CSS.

## Features

- ✅ Add, complete, and delete habits
- 🔥 Streak tracking with visual indicators
- 📊 Progress tracking and statistics
- 🎨 Beautiful, responsive design
- 💾 Local storage for data persistence
- 📱 Mobile-friendly interface
- 🏷️ Category organization
- 📈 Daily goal tracking

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

### Adding a Habit
1. Fill out the form on the left side
2. Enter a habit name, description (optional), category, and daily goal
3. Click "Add Habit"

### Completing Habits
- Click the "Complete" button on any habit card to mark it as done for today
- Click again to uncomplete if needed
- Progress bars show your completion status

### Tracking Progress
- View your current streak for each habit
- See overall statistics in the header
- Monitor daily completion rate in the progress summary

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox and Grid
- **Vanilla JavaScript** - No frameworks, pure JS
- **Local Storage** - Data persistence
- **Vite** - Development server and build tool

## Project Structure

```
src/
├── main.js          # Main JavaScript application
├── index.css        # Styles and animations
└── assets/          # Images and other assets

index.html           # Main HTML structure
package.json         # Project configuration
vite.config.ts       # Vite configuration
```

## Features in Detail

### Habit Management
- Create habits with names, descriptions, and categories
- Set daily goals for each habit
- Delete habits with confirmation

### Streak Calculation
- Automatic streak calculation based on consecutive days
- Visual streak indicators with fire emoji
- Tracks both current and longest streaks

### Data Persistence
- All data is saved to browser's local storage
- Data persists between browser sessions
- No external database required

### Responsive Design
- Works on desktop, tablet, and mobile devices
- Adaptive layout using CSS Grid and Flexbox
- Touch-friendly interface

## Browser Support

Works in all modern browsers that support:
- ES6+ JavaScript
- CSS Grid and Flexbox
- Local Storage API

## License

This project is open source and available under the MIT License. 