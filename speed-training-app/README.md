# Speed Training Dashboard

An interactive web application for visualizing and navigating the 6-week Field Day speed training program with integrated YouTube video demonstrations.

## 🚀 Features

### Phase 1 - Foundation (Implemented)
- ✅ **Program Overview Dashboard** - Visual statistics and progress tracking
- ✅ **Interactive Week View** - Navigate through training weeks with progress indicators
- ✅ **Detailed Day View** - Complete workout interface with exercise cards
- ✅ **Video Integration** - YouTube video demonstrations with lazy loading
- ✅ **Progress Tracking** - Mark exercises complete and track overall progress
- ✅ **Search & Filter** - Find exercises quickly across all weeks
- ✅ **Video Library** - Browse all exercise videos organized by focus area
- ✅ **Dark/Light Theme** - Automatic theme switching with system preference detection
- ✅ **Responsive Design** - Mobile-first design with tablet/desktop optimization
- ✅ **Local Storage** - Progress and preferences saved locally

## 🎯 Training Program Structure

The app visualizes a comprehensive 6-week program with:
- **18 total training days** (3 days per week)
- **Three focus areas**:
  - 🚀 Acceleration - Explosive starts and acceleration mechanics
  - ⚡ Top End Speed - Maximum velocity and speed maintenance
  - 🔄 Change of Direction - Agility and lateral movement skills
- **Exercise blocks**: Warm-up, Skill Work, Plyos/Drills, and focused work
- **Video demonstrations** for proper exercise technique

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and navigate to the project**
   ```bash
   cd speed-training-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the URL shown in terminal)

## 📱 Using the Dashboard

### Dashboard Overview
- View program statistics and overall progress
- See weekly progress charts
- Access quick actions for today's workout
- Navigate through the training calendar

### Week View
- Browse individual weeks with day-by-day breakdowns
- See week progress and completion status
- Click on any day to start or continue workouts

### Day View (Workout Interface)
- **Exercise Cards** with tabbed interface:
  - **Info Tab**: Sets/reps and exercise instructions
  - **Video Tab**: YouTube demonstration videos (lazy loaded)
  - **Notes Tab**: Personal notes for each exercise
- **Completion Tracking**: Mark exercises complete with progress indicators
- **Block Organization**: Exercises grouped by training blocks

### Video Library
- Browse all exercise videos by focus area
- Filter by watched/unwatched, favorites
- Watch videos in full-screen modal
- Quick navigation to specific exercises

### Search & Navigation
- **Global Search**: Find exercises across all weeks
- **Sidebar Navigation**: Quick access to any week
- **Keyboard Shortcuts**:
  - `Ctrl/Cmd + K`: Focus search
  - `Escape`: Clear search
  - `1-6`: Navigate to specific weeks

## 🎨 Design Features

### Theme System
- **Auto-switching**: Follows system preferences
- **Manual toggle**: Light/dark/system modes
- **Smooth transitions**: Animated theme changes

### Video Integration
- **Lazy loading**: Videos load only when needed
- **YouTube optimization**: Embedded player with custom controls
- **Watch tracking**: Progress tracking for video engagement
- **Mobile optimized**: Touch-friendly video interface

### Progress Tracking
- **Exercise completion**: Individual exercise tracking
- **Day/week progress**: Hierarchical progress calculation
- **Streak tracking**: Consecutive workout tracking
- **Local persistence**: Data saved in browser storage

## 🏗️ Technical Architecture

### Core Technologies
- **Vite** - Fast build tool and development server
- **Vanilla JavaScript (ES6+)** - Modern JavaScript features
- **CSS3** - CSS Grid, Flexbox, custom properties
- **Local Storage** - Client-side data persistence

### Libraries
- **Chart.js** - Data visualization (ready for Phase 3)
- **Anime.js** - Smooth animations (ready for Phase 3)
- **Day.js** - Date manipulation

### Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── navigation/       # Sidebar and navigation
│   ├── exercise/         # Exercise cards and interactions
│   ├── video/           # Video player components
│   └── ui/              # Search and utility components
├── data/                # Data processing and management
├── styles/              # CSS architecture
│   ├── components/      # Component-specific styles
│   ├── variables.css    # Design tokens
│   ├── reset.css        # CSS reset
│   └── globals.css      # Global styles
├── utils/               # Utility functions
│   ├── progress-tracker.js
│   ├── router.js
│   └── theme-manager.js
├── views/               # Page-level components
│   ├── DashboardView.js
│   ├── WeekView.js
│   ├── DayView.js
│   └── VideoLibraryView.js
└── main.js             # Application entry point
```

## 📊 Data Structure

The training plan is organized as:
```javascript
{
  "program_title": "6 week field day program",
  "weeks": [
    {
      "week_number": 1,
      "days": [
        {
          "day_number": 1,
          "focus": "Acceleration",
          "blocks": [
            {
              "block_name": "Warm-up",
              "exercises": [
                {
                  "name": "Exercise Name",
                  "sets_reps": "3x5",
                  "notes": "Instructions",
                  "video_url": "https://youtube.com/..."
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## 🎯 Progress Tracking

### Exercise Level
- Individual completion status
- Personal notes
- Video watch tracking

### Day Level
- Overall completion percentage
- Block completion status
- Session tracking

### Week Level
- Weekly progress calculation
- Focus area distribution
- Completion indicators

### Program Level
- Overall progress percentage
- Streak tracking
- Video engagement metrics

## 📱 Mobile Experience

### Touch Optimizations
- Large touch targets for buttons
- Swipe-friendly navigation
- Mobile-optimized video controls
- Responsive layout adapts to all screen sizes

### Performance
- Lazy loading for images and videos
- Efficient re-rendering
- Smooth animations with hardware acceleration
- Local storage for offline progress tracking

## 🚀 Future Enhancements (Phase 2 & 3)

### Phase 2 - Enhanced Features
- Real-time Chart.js visualizations
- Advanced video controls (playback speed, bookmarks)
- Export/import progress data
- Enhanced search with autocomplete
- Social sharing features

### Phase 3 - Advanced Functionality
- Offline PWA capabilities
- Workout timers and rest periods
- Custom workout modifications
- Advanced analytics dashboard
- Multi-user support

## 🤝 Contributing

This project follows the development plan outlined in the Speed Training Visualization Plan. Key principles:

- **Mobile-first design**
- **Performance-focused development**
- **Accessible interface design**
- **Modern JavaScript practices**
- **Component-based architecture**

## 📄 License

This project is part of the Field Day Speed Training Program implementation.

## 🏃‍♀️ About the Training Program

The 6-Week Field Day Program is designed to enhance:
- **Speed** - Maximum velocity development
- **Acceleration** - Explosive start mechanics
- **Change of Direction** - Agility and lateral movements
- **Movement Proficiency** - Overall athletic performance

**Duration**: 30-45 minutes per session
**Frequency**: 3 days per week (recommended: M/W/F or T/Th/Sat)
**Progression**: Gradual skill building with movement mastery focus

---

**Start your speed training journey today! 🏃‍♂️💨** 