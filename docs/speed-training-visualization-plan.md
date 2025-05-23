# Speed Training Visualization App - Development Plan

## Project Overview

**Project Name:** Speed Training Visualization Dashboard  
**Purpose:** Create an interactive web application to visualize and navigate the 6-week Field Day speed training program with integrated video demonstrations and detailed exercise descriptions  
**Target Users:** Athletes, coaches, fitness enthusiasts, and sports performance professionals  

## Executive Summary

This project will create a modern, responsive web application that transforms the JSON-based speed training plan into an intuitive, interactive visualization dashboard with embedded video demonstrations and comprehensive exercise descriptions. The app will help users understand program structure, track progress, follow the training regimen, and learn proper exercise technique through integrated YouTube video demonstrations and detailed exercise summaries.

## Technology Stack

### Core Technologies
- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with CSS Grid, Flexbox, and custom properties
- **Vanilla JavaScript (ES6+)** - Core functionality and interactivity

### Modern Frameworks & Libraries
- **Chart.js** - Data visualization and progress charts
- **Anime.js** - Smooth animations and transitions
- **Day.js** - Lightweight date manipulation
- **YouTube API / Embedded Player** - Video demonstration integration
- **Intersection Observer API** - Scroll-based animations and lazy video loading
- **CSS Framework:** Custom CSS with modern features (no external framework dependency)

### Development Tools
- **Vite** - Fast build tool and development server
- **PostCSS** - CSS processing and optimization
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting

## Application Features

### Core Features

#### 1. Program Overview Dashboard
- **Weekly Progress Tracker**: Visual representation of completed weeks
- **Training Focus Calendar**: Color-coded calendar showing daily focus areas
- **Program Statistics**: Total workouts, exercises, estimated time commitment
- **Quick Navigation**: Jump to any week/day instantly
- **Video Library Access**: Quick access to all exercise demonstration videos
- **Exercise Summary Database**: Searchable database of all exercise descriptions

#### 2. Interactive Week View
- **Week-by-Week Navigation**: Smooth transitions between weeks
- **Progress Indicators**: Visual completion status for each day
- **Focus Area Breakdown**: Pie charts showing exercise distribution
- **Difficulty Progression**: Visual representation of program advancement
- **Video Preview Grid**: Thumbnail view of week's exercise videos
- **Exercise Preview Cards**: Quick view of exercise summaries with expansion options
- **Section Collapse Management**: Collapsible day sections with individual and global controls
  - **Individual Day Collapse**: Each day can be expanded/collapsed independently
  - **Exercise Block Collapse**: Warm-up, A, B, C, D blocks within each day are collapsible
  - **Global Collapse/Expand Controls**: Master controls to collapse/expand all sections at once
  - **Collapse State Persistence**: Remember user's preferred collapse states across sessions
  - **Smart Defaults**: New weeks start with current/next day expanded, others collapsed
  - **Accessibility Support**: Keyboard navigation and screen reader compatibility for collapse controls

#### 3. Enhanced Daily Workout Interface
- **Exercise Block Organization**: Collapsible sections for Warm-up, A, B, C, D blocks
- **Comprehensive Exercise Cards**: Individual cards for each exercise with:
  - Exercise name and detailed summary description
  - Sets/reps information with visual indicators
  - Comprehensive notes and coaching tips
  - **Video Demonstration Tab**: Embedded YouTube player
  - **Exercise Details Tab**: Full exercise summary with technique breakdown
  - **Personal Notes Tab**: User-generated notes and modifications
  - Completion checkboxes with progress indicators
  - Timer integration with exercise-specific durations
- **Block Progress**: Visual completion indicators with summary statistics
- **Exercise Search**: Find exercises by name or description content
- **Smart Suggestions**: Related exercises based on movement patterns in summaries

#### 4. Advanced Video Integration System
- **Embedded YouTube Players**: Clean integration using YouTube iframe API
- **Multi-Tab Interface**: Exercise information, video demonstrations, and personal notes
- **Lazy Loading**: Videos load only when tab is opened to optimize performance
- **Video Controls**: 
  - Play/pause functionality
  - Speed control (0.5x, 1x, 1.25x, 1.5x)
  - Full-screen mode
  - Video bookmarking for key moments
- **Exercise-Video Synchronization**: Video content aligned with exercise summary highlights
- **Mobile Optimization**: Touch-friendly video controls and responsive sizing
- **Offline Indicators**: Clear messaging when videos are unavailable offline

#### 5. Enhanced Progress Tracking System
- **Workout Completion**: Mark individual exercises and days as complete
- **Progress Analytics**: Charts showing completion rates and patterns
- **Streak Tracking**: Consecutive workout days visualization
- **Exercise Mastery Tracking**: Track understanding and proficiency based on exercise summaries
- **Performance Notes**: Add personal notes and observations
- **Video Watch History**: Track which demonstration videos have been viewed
- **Exercise Difficulty Assessment**: Self-rating system based on exercise summary complexity

#### 6. Advanced Search & Filter System
- **Exercise Search**: Find specific exercises across all weeks by name or summary content
- **Semantic Search**: Search within exercise summaries for technique keywords
- **Filter by Focus**: Show only Acceleration, Speed, or COD exercises
- **Filter by Equipment**: Identify exercises requiring specific equipment
- **Filter by Complexity**: Sort exercises by movement complexity using summary analysis
- **Movement Pattern Search**: Find exercises with similar movement patterns
- **Video Search**: Find exercises by searching video content or descriptions
- **Quick Exercise Reference**: Searchable exercise database with summaries and video thumbnails

### Advanced Features

#### 7. Interactive Visualizations
- **Program Flow Diagram**: Visual representation of program structure with exercise progression
- **Exercise Progression Maps**: Show how exercises evolve weekly with detailed summaries
- **Training Load Visualization**: Charts showing intensity progression based on exercise complexity
- **Focus Area Distribution**: Interactive charts by week/day with exercise breakdowns
- **Video Engagement Analytics**: Track most watched videos and user preferences
- **Exercise Complexity Visualization**: Charts showing difficulty progression using summary analysis

#### 8. Enhanced User Experience
- **Responsive Design**: Mobile-first approach with tablet/desktop optimization
- **Dark/Light Mode**: Theme switching with system preference detection
- **Offline Support**: Service Worker for offline access (excluding videos)
- **Print-Friendly Views**: Optimized layouts for printing workout cards with exercise summaries and QR codes to videos
- **Video Accessibility**: Closed captions where available, audio descriptions
- **Exercise Summary Read-Aloud**: Text-to-speech for exercise descriptions
- **Smart Exercise Recommendations**: Suggest modifications based on exercise summary analysis

#### 9. Customization Options
- **Personal Schedule**: Adapt to user's preferred training days
- **Exercise Modifications**: Notes for exercise substitutions with alternative exercise suggestions
- **Rest Timer**: Integrated countdown timers for rest periods
- **Goal Setting**: Personal targets and milestone tracking
- **Video Preferences**: Save preferred playback speed and quality settings
- **Favorite Videos**: Bookmark frequently referenced demonstration videos
- **Exercise Notes Expansion**: Detailed personal notes linked to exercise summaries
- **Difficulty Scaling**: Adjust exercise complexity based on fitness level

## Enhanced User Interface Design

### Design Principles
- **Information-Rich**: Comprehensive display of exercise summaries without overwhelming users
- **Progressive Disclosure**: Detailed information available on demand through expandable sections
- **Contextual Learning**: Exercise summaries integrated seamlessly with video demonstrations
- **Intuitive Navigation**: Clear information hierarchy with seamless access to detailed descriptions
- **Performance Focused**: Fast loading and smooth interactions with optimized content loading
- **Accessibility First**: WCAG 2.1 AA compliance including video and text accessibility
- **Mobile-First Content**: Touch-optimized controls with readable exercise descriptions

### Enhanced Color Scheme
```css
:root {
  /* Primary Colors */
  --primary-blue: #2563eb;
  --primary-green: #059669;
  --primary-orange: #ea580c;
  
  /* Training Focus Colors */
  --acceleration: #ef4444;    /* Red */
  --speed: #3b82f6;          /* Blue */
  --agility: #10b981;        /* Green */
  
  /* Content Hierarchy Colors */
  --exercise-name: #1f2937;
  --exercise-summary: #374151;
  --exercise-notes: #6b7280;
  --highlight-text: #f59e0b;
  
  /* Video Interface Colors */
  --video-bg: #000000;
  --video-controls: #ffffff;
  --video-accent: #ff0000;   /* YouTube red */
  
  /* Interactive Elements */
  --tab-active: #3b82f6;
  --tab-inactive: #9ca3af;
  --completion-green: #22c55e;
  --summary-bg: #f8fafc;
  
  /* Neutral Colors */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-900: #111827;
  
  /* Status Colors */
  --success: #22c55e;
  --warning: #f59e0b;
  --error: #ef4444;
  --watched: #9333ea;        /* Purple for watched videos */
  --mastered: #10b981;       /* Green for mastered exercises */
  
  /* Collapsible Interface Colors */
  --collapse-indicator: #6b7280;     /* Gray for collapse arrows */
  --collapse-hover: #374151;         /* Darker gray on hover */
  --expanded-bg: #f8fafc;            /* Light background for expanded sections */
  --collapsed-bg: #ffffff;           /* White background for collapsed sections */
  --section-border: #e5e7eb;         /* Light gray borders */
  --global-control-bg: #3b82f6;      /* Blue for global control buttons */
  --global-control-hover: #2563eb;   /* Darker blue on hover */
  --smart-view-bg: #059669;          /* Green for smart view button */
  --day-header-bg: #f3f4f6;          /* Light gray for day headers */
  --block-header-bg: #fafafa;        /* Very light gray for block headers */
}
```

### Enhanced Typography
- **Primary Font**: 'Inter' (modern, readable sans-serif)
- **Exercise Names**: Bold weight for immediate recognition
- **Exercise Summaries**: Regular weight with optimized line-height for readability
- **Accent Font**: 'JetBrains Mono' (for data/numbers)
- **Video UI Font**: 'Roboto' (optimized for video interface elements)
- **Scale**: Modular scale with clear hierarchy for content layers

### Updated Layout Structure with Collapsible Week View
```
┌─────────────────────────────────────────────────────────────┐
│ Header (Navigation, Progress)                               │
├─────────────────────────────────────────────────────────────┤
│ Sidebar    │ Week View with Global Controls                 │
│ - Weeks    │ ┌─────────────────────────────────────────────┐ │
│ - Filter   │ │ [📖 Expand All] [📁 Collapse All] [🎯 Smart]│ │
│ - Search   │ ├─────────────────────────────────────────────┤ │
│ - Videos   │ │ ▼ Day 1 (75% Complete) [📁][📖]           │ │
│ - Summary  │ │   ▼ Warm-up Block (3 exercises)             │ │
│            │ │     Exercise Card with Summary/Video tabs   │ │
│            │ │   ▶ Block A (collapsed)                     │ │
│            │ │ ▶ Day 2 (collapsed)                         │ │
│            │ │ ▼ Day 3 (25% Complete) [📁][📖]           │ │
│            │ │   ▼ Block A (5 exercises)                   │ │
│            │ │     Exercise Cards...                       │ │
│            │ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

Legend:
▼ = Expanded section    ▶ = Collapsed section
[📁] = Collapse controls    [📖] = Expand controls
[🎯] = Smart View (show current/upcoming only)
```

### CSS Specifications for Collapsible Week View
```css
/* Global Controls */
.week-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: var(--gray-50);
  border-radius: 8px;
  border: 1px solid var(--section-border);
}

.global-collapse-controls {
  display: flex;
  gap: 0.5rem;
}

.global-control-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.global-control-btn.expand-all,
.global-control-btn.collapse-all {
  background: var(--global-control-bg);
  color: white;
}

.global-control-btn.smart-view {
  background: var(--smart-view-bg);
  color: white;
}

.global-control-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.global-control-btn.expand-all:hover,
.global-control-btn.collapse-all:hover {
  background: var(--global-control-hover);
}

/* Day Sections */
.day-section {
  margin-bottom: 1rem;
  border: 1px solid var(--section-border);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.day-section.collapsed {
  background: var(--collapsed-bg);
}

.day-section.expanded {
  background: var(--expanded-bg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--day-header-bg);
  cursor: pointer;
  transition: background-color 0.2s ease;
  border: none;
  width: 100%;
  text-align: left;
}

.day-header:hover {
  background: var(--gray-200);
}

.day-header:focus {
  outline: 2px solid var(--primary-blue);
  outline-offset: -2px;
}

.day-title-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.collapse-indicator {
  font-size: 1rem;
  color: var(--collapse-indicator);
  transition: transform 0.2s ease, color 0.2s ease;
  user-select: none;
}

.collapse-indicator.expanded {
  transform: rotate(0deg);
}

.collapse-indicator.collapsed {
  transform: rotate(-90deg);
}

.day-header:hover .collapse-indicator {
  color: var(--collapse-hover);
}

.day-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--gray-900);
  margin: 0;
}

.day-date {
  font-size: 0.875rem;
  color: var(--gray-600);
}

.day-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.day-progress-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.progress-bar {
  width: 60px;
  height: 6px;
  background: var(--gray-200);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--completion-green);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.day-focus-badge {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 4px;
  color: white;
}

.day-focus-badge.acceleration {
  background: var(--acceleration);
}

.day-focus-badge.speed {
  background: var(--speed);
}

.day-focus-badge.agility {
  background: var(--agility);
}

/* Day Content */
.day-content {
  padding: 0;
  overflow: hidden;
}

.day-content[aria-hidden="true"] {
  display: none;
}

.day-content[aria-hidden="false"] {
  animation: expandContent 0.3s ease-out;
}

@keyframes expandContent {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 1000px;
  }
}

/* Exercise Blocks */
.exercise-block {
  border-top: 1px solid var(--section-border);
}

.exercise-block:first-child {
  border-top: none;
}

.block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--block-header-bg);
  cursor: pointer;
  transition: background-color 0.2s ease;
  border: none;
  width: 100%;
  text-align: left;
}

.block-header:hover {
  background: var(--gray-100);
}

.block-header:focus {
  outline: 2px solid var(--primary-blue);
  outline-offset: -2px;
}

.block-title-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.block-collapse-indicator {
  font-size: 0.875rem;
  color: var(--collapse-indicator);
  transition: transform 0.2s ease;
  user-select: none;
}

.block-title {
  font-size: 1rem;
  font-weight: 500;
  color: var(--gray-800);
  margin: 0;
}

.block-exercise-count {
  font-size: 0.75rem;
  color: var(--gray-500);
}

.block-content {
  padding: 1rem;
  background: white;
}

.block-content[aria-hidden="true"] {
  display: none;
}

/* Day Actions */
.day-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--gray-50);
  border-top: 1px solid var(--section-border);
}

.day-action-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--gray-300);
  border-radius: 6px;
  background: white;
  color: var(--gray-700);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.day-action-btn:hover {
  background: var(--gray-50);
  border-color: var(--gray-400);
}

.day-action-btn.completed {
  background: var(--success);
  color: white;
  border-color: var(--success);
}

/* Keyboard Navigation */
.day-header:focus-visible,
.block-header:focus-visible {
  outline: 2px solid var(--primary-blue);
  outline-offset: 2px;
}

/* Screen Reader Support */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .week-controls {
    flex-direction: column;
    gap: 1rem;
  }
  
  .global-collapse-controls {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .day-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .day-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .global-control-btn {
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
  }
  
  .day-title {
    font-size: 1rem;
  }
  
  .day-actions {
    gap: 0.25rem;
  }
}
```

### Enhanced Exercise Card with Summary Integration
```
┌─────────────────────────────────────┐
│ Exercise Name                   [✓] │
│ Brief Summary (first 100 chars)    │
├─────────────────────────────────────┤
│ [Summary] [📹 Video] [Details] [📝] │
├─────────────────────────────────────┤
│ Content Area:                       │
│ ┌─────────────────────────────────┐ │
│ │ Full Exercise Summary /         │ │
│ │ Video Player /                  │ │
│ │ Exercise Details /              │ │
│ │ Personal Notes                  │ │
│ │                                 │ │
│ │ [Action Buttons]                │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## Implementation Phases

### Phase 1: Foundation + Summary Integration (Week 1-2)
**Goal**: Establish core architecture with exercise summary integration

#### Tasks:
1. **Project Setup**
   - Initialize Vite project structure
   - Configure build tools and linting
   - Set up development environment
   - Add YouTube API integration setup

2. **Enhanced Data Processing**
   - Create JSON data parser with exercise summary extraction
   - Build data transformation utilities with summary indexing
   - Implement search/filter logic including summary content
   - Video URL validation and sanitization
   - Exercise summary text processing and keyword extraction

3. **Core Layout with Content Hierarchy**
   - Implement responsive grid system optimized for text content
   - Create navigation components with summary preview
   - Build sidebar structure with summary search
   - Design content-rich layout framework

4. **Basic Views with Summary Display**
   - Program overview page with exercise summary statistics
   - Week list view with exercise summaries and video thumbnails
   - Day detail view with expandable exercise summaries
   - Basic video player integration with summary correlation

#### Deliverables:
- Functional navigation between weeks/days with summary previews
- Content-rich responsive layout with exercise summary display
- Enhanced data loading and parsing system with summary indexing
- Initial YouTube embed integration with summary context

### Phase 2: Enhanced Exercise Interface + Advanced Summary Features (Week 3-4)
**Goal**: Implement comprehensive exercise interface with full summary integration

#### Tasks:
1. **Advanced Exercise Interface**
   - Multi-tabbed exercise card components with summary tab
   - Exercise summary display with formatting and highlighting
   - Video player integration with summary-video alignment
   - Lazy loading implementation for content and videos
   - Progressive disclosure of detailed exercise information

2. **Enhanced Progress System**
   - Local storage integration with exercise understanding tracking
   - Progress calculation logic including summary mastery
   - Visual indicators for exercise comprehension
   - Video watch tracking with summary correlation

3. **Advanced Search & Filter**
   - Real-time search functionality across exercise summaries
   - Semantic search within exercise descriptions
   - Multi-criteria filtering including summary keywords
   - Results highlighting with summary excerpts
   - Video thumbnail previews with summary context

4. **Responsive Content Design**
   - Mobile optimization for exercise summary reading
   - Touch-friendly content navigation
   - Tablet layouts with optimal content and video balance
   - Text accessibility features with summary read-aloud

#### Deliverables:
- Comprehensive workout interface with full summary integration
- Advanced progress tracking system with exercise mastery metrics
- Semantic search and filter functionality across all content
- Mobile-responsive design optimized for content consumption

### Phase 3: Advanced Features + Content Analytics (Week 5-6)
**Goal**: Add interactive analytics, advanced content features, and enhanced visualizations

#### Tasks:
1. **Advanced Content Features**
   - Exercise summary bookmarking and favorites
   - Content highlighting and personal annotations
   - Exercise difficulty assessment based on summaries
   - Related exercise suggestions using summary analysis

2. **Enhanced Chart Integration**
   - Progress charts (Chart.js) with exercise mastery data
   - Training distribution visualizations with content complexity
   - Exercise understanding analytics
   - Completion analytics with summary engagement correlation

3. **Smart Content System**
   - Exercise recommendation engine based on summary analysis
   - Movement pattern recognition from descriptions
   - Difficulty progression tracking using summary complexity
   - Personalized exercise modifications

4. **Advanced Analytics**
   - Content engagement tracking (time spent reading summaries)
   - Exercise comprehension analytics
   - Video-summary correlation metrics
   - Learning progression visualization

#### Deliverables:
- Advanced content functionality and analytics
- Interactive data visualizations including content engagement metrics
- Smart exercise recommendation system
- Comprehensive learning and progression tracking

### Phase 4: Polish, Optimization & Content Performance (Week 7-8)
**Goal**: Finalize user experience and optimize content delivery

#### Tasks:
1. **Content Performance Optimization**
   - Text content optimization and compression
   - Summary indexing and search optimization
   - Progressive content loading strategies
   - Video-content synchronization optimization

2. **Enhanced Accessibility**
   - Keyboard navigation for all content
   - Screen reader optimization for exercise summaries
   - Content readability optimization
   - Multi-language support preparation

3. **Comprehensive Testing**
   - Content accuracy and consistency validation
   - Cross-device content rendering testing
   - Performance auditing with content-heavy pages
   - Summary search functionality testing

4. **Complete Documentation**
   - User guide including all content features
   - Exercise summary style guide
   - Content accessibility guidelines
   - Developer documentation for content integration

#### Deliverables:
- Production-ready application with optimized content delivery
- Complete documentation including content management guidelines
- Performance optimized build with content considerations

## Enhanced Key Components Specification

### 1. Advanced ExerciseCard Component with Full Summary Integration
```javascript
class ExerciseCard {
  constructor(exercise, blockName) {
    this.exercise = exercise;
    this.blockName = blockName;
    this.completed = false;
    this.activeTab = 'summary'; // 'summary', 'video', 'details', 'notes'
    this.videoWatched = false;
    this.summaryRead = false;
    this.masteryLevel = 0; // 0-5 scale based on user self-assessment
  }
  
  render() {
    return `
      <div class="exercise-card ${this.completed ? 'completed' : ''}" data-mastery="${this.masteryLevel}">
        <div class="exercise-header">
          <h4 class="exercise-name">${this.exercise.name}</h4>
          <div class="exercise-meta">
            <span class="mastery-indicator" title="Mastery Level: ${this.masteryLevel}/5">
              ${'★'.repeat(this.masteryLevel)}${'☆'.repeat(5-this.masteryLevel)}
            </span>
            <button class="complete-btn">${this.completed ? '✓' : '○'}</button>
          </div>
        </div>
        
        <div class="exercise-preview">
          <p class="summary-preview">${this.getSummaryPreview()}</p>
          ${this.exercise.sets_reps ? `<span class="sets-reps-badge">${this.exercise.sets_reps}</span>` : ''}
        </div>
        
        <div class="exercise-tabs">
          <button class="tab ${this.activeTab === 'summary' ? 'active' : ''}" 
                  data-tab="summary">
            📖 Summary ${this.summaryRead ? '✓' : ''}
          </button>
          ${this.exercise.video_url ? `
            <button class="tab ${this.activeTab === 'video' ? 'active' : ''}" 
                    data-tab="video">
              📹 Video ${this.videoWatched ? '✓' : ''}
            </button>
          ` : ''}
          <button class="tab ${this.activeTab === 'details' ? 'active' : ''}" 
                  data-tab="details">⚙️ Details</button>
          <button class="tab ${this.activeTab === 'notes' ? 'active' : ''}" 
                  data-tab="notes">📝 Notes</button>
        </div>
        
        <div class="exercise-content">
          ${this.renderTabContent()}
        </div>
        
        <div class="exercise-actions">
          ${this.renderActionButtons()}
        </div>
      </div>
    `;
  }
  
  getSummaryPreview() {
    const summary = this.exercise.exercise_summary || '';
    return summary.length > 100 ? summary.substring(0, 100) + '...' : summary;
  }
  
  renderTabContent() {
    switch(this.activeTab) {
      case 'summary':
        return `
          <div class="exercise-summary-content">
            <div class="full-summary">
              <p class="exercise-summary">${this.exercise.exercise_summary || 'No summary available'}</p>
            </div>
            ${this.exercise.exercise_summary ? `
              <div class="summary-actions">
                <button class="read-aloud-btn" onclick="this.readAloud()">🔊 Read Aloud</button>
                <button class="highlight-btn" onclick="this.toggleHighlight()">🖍️ Highlight</button>
                <button class="bookmark-btn" onclick="this.bookmarkExercise()">🔖 Bookmark</button>
              </div>
            ` : ''}
            <div class="exercise-metadata">
              <span class="focus-area">${this.determineFocusArea()}</span>
              <span class="complexity-level">${this.determineComplexity()}</span>
            </div>
          </div>
        `;
      case 'video':
        return this.exercise.video_url ? `
          <div class="video-container">
            <div class="video-summary-sync">
              <button class="sync-btn" onclick="this.syncVideoWithSummary()">
                🔗 Sync with Summary
              </button>
            </div>
            <iframe 
              src="${this.getEmbedUrl(this.exercise.video_url)}"
              frameborder="0"
              allowfullscreen
              loading="lazy">
            </iframe>
            <div class="video-controls">
              <button class="video-bookmark">🔖 Bookmark</button>
              <button class="video-fullscreen">⛶ Fullscreen</button>
              <button class="video-summary-overlay">📖 Show Summary Overlay</button>
            </div>
          </div>
        ` : '<p>No video available</p>';
      case 'details':
        return `
          <div class="exercise-details">
            <div class="sets-reps-detail">
              <h5>Sets & Reps</h5>
              <p class="sets-reps">${this.exercise.sets_reps || 'Not specified'}</p>
            </div>
            ${this.exercise.notes ? `
              <div class="exercise-notes-detail">
                <h5>Coaching Notes</h5>
                <p class="exercise-notes">${this.exercise.notes}</p>
              </div>
            ` : ''}
            <div class="exercise-analysis">
              <h5>Movement Analysis</h5>
              <div class="movement-tags">
                ${this.generateMovementTags().map(tag => `<span class="movement-tag">${tag}</span>`).join('')}
              </div>
            </div>
            <div class="difficulty-assessment">
              <h5>Difficulty Assessment</h5>
              <div class="mastery-controls">
                <label>Rate your mastery (1-5):</label>
                <div class="star-rating">
                  ${[1,2,3,4,5].map(i => `
                    <button class="star ${i <= this.masteryLevel ? 'filled' : ''}" 
                            onclick="this.setMastery(${i})">★</button>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        `;
      case 'notes':
        return `
          <div class="personal-notes-section">
            <textarea class="personal-notes" 
                      placeholder="Add your personal notes and observations...">${this.getPersonalNotes()}</textarea>
            <div class="notes-actions">
              <button class="save-notes-btn" onclick="this.saveNotes()">💾 Save Notes</button>
              <button class="voice-notes-btn" onclick="this.recordVoiceNote()">🎤 Voice Note</button>
            </div>
            <div class="related-exercises">
              <h5>Related Exercises</h5>
              <div class="related-list">
                ${this.getRelatedExercises().map(ex => `
                  <div class="related-item" onclick="this.navigateToExercise('${ex.id}')">
                    <span class="related-name">${ex.name}</span>
                    <span class="related-similarity">${ex.similarity}% similar</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `;
      default:
        return '';
    }
  }
  
  renderActionButtons() {
    return `
      <div class="action-buttons">
        <button class="mark-complete-btn ${this.completed ? 'completed' : ''}" 
                onclick="this.toggleCompletion()">
          ${this.completed ? '✅ Completed' : '⭕ Mark Complete'}
        </button>
        <button class="find-similar-btn" onclick="this.findSimilarExercises()">
          🔍 Find Similar
        </button>
        <button class="share-btn" onclick="this.shareExercise()">
          📤 Share
        </button>
      </div>
    `;
  }
  
  determineFocusArea() {
    const summary = this.exercise.exercise_summary?.toLowerCase() || '';
    if (summary.includes('acceleration') || summary.includes('explosive')) return 'Acceleration';
    if (summary.includes('speed') || summary.includes('top speed')) return 'Speed';
    if (summary.includes('lateral') || summary.includes('agility') || summary.includes('direction')) return 'Agility';
    return 'General';
  }
  
  determineComplexity() {
    const summary = this.exercise.exercise_summary || '';
    const keywords = ['basic', 'simple', 'beginner', 'advanced', 'complex', 'coordination', 'multiple'];
    let complexity = 1;
    
    if (summary.toLowerCase().includes('advanced') || summary.toLowerCase().includes('complex')) complexity = 4;
    else if (summary.toLowerCase().includes('coordination') || summary.toLowerCase().includes('multiple')) complexity = 3;
    else if (summary.toLowerCase().includes('basic') || summary.toLowerCase().includes('simple')) complexity = 1;
    else complexity = 2;
    
    return `Level ${complexity}/4`;
  }
  
  generateMovementTags() {
    const summary = this.exercise.exercise_summary?.toLowerCase() || '';
    const tags = [];
    
    if (summary.includes('jump') || summary.includes('hop')) tags.push('Plyometric');
    if (summary.includes('lateral') || summary.includes('sideways')) tags.push('Lateral');
    if (summary.includes('sprint') || summary.includes('run')) tags.push('Sprint');
    if (summary.includes('balance') || summary.includes('stability')) tags.push('Balance');
    if (summary.includes('coordination')) tags.push('Coordination');
    if (summary.includes('power') || summary.includes('explosive')) tags.push('Power');
    if (summary.includes('hip') || summary.includes('core')) tags.push('Core');
    
    return tags.length > 0 ? tags : ['General Movement'];
  }
  
  getRelatedExercises() {
    // Implement similarity algorithm based on exercise summaries
    // Return array of related exercises with similarity scores
    return [];
  }
  
  readAloud() {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(this.exercise.exercise_summary);
      speechSynthesis.speak(utterance);
    }
  }
}
```

### 2. Collapsible Week View Component with Global Controls
```javascript
class CollapsibleWeekView {
  constructor(weekData, weekNumber) {
    this.weekData = weekData;
    this.weekNumber = weekNumber;
    this.collapseStates = this.loadCollapseStates();
    this.initializeDefaultStates();
  }
  
  initializeDefaultStates() {
    // Smart defaults: current/next day expanded, others collapsed
    const today = new Date();
    const currentDay = this.getCurrentDayIndex(today);
    
    if (!this.collapseStates[this.weekNumber]) {
      this.collapseStates[this.weekNumber] = {
        days: {},
        exerciseBlocks: {}
      };
    }
    
    this.weekData.days.forEach((day, index) => {
      const dayKey = `day_${index}`;
      if (this.collapseStates[this.weekNumber].days[dayKey] === undefined) {
        // Expand current and next day, collapse others
        this.collapseStates[this.weekNumber].days[dayKey] = 
          (index === currentDay || index === currentDay + 1) ? false : true;
      }
      
      // Initialize exercise block states
      if (!this.collapseStates[this.weekNumber].exerciseBlocks[dayKey]) {
        this.collapseStates[this.weekNumber].exerciseBlocks[dayKey] = {
          warmup: false,
          blockA: false,
          blockB: false,
          blockC: false,
          blockD: false
        };
      }
    });
    
    this.saveCollapseStates();
  }
  
  render() {
    return `
      <div class="week-view" data-week="${this.weekNumber}">
        <div class="week-header">
          <h2 class="week-title">Week ${this.weekNumber}</h2>
          <div class="week-stats">
            <span class="week-progress">${this.getWeekProgress()}% Complete</span>
            <span class="week-focus">${this.getWeekFocus()}</span>
          </div>
        </div>
        
        <div class="week-controls">
          <div class="global-collapse-controls">
            <button class="global-control-btn expand-all" 
                    onclick="this.expandAll()" 
                    title="Expand All Sections (Ctrl+E)"
                    aria-label="Expand all days and exercise blocks">
              📖 Expand All
            </button>
            <button class="global-control-btn collapse-all" 
                    onclick="this.collapseAll()" 
                    title="Collapse All Sections (Ctrl+C)"
                    aria-label="Collapse all days and exercise blocks">
              📁 Collapse All
            </button>
            <button class="global-control-btn smart-view" 
                    onclick="this.applySmartView()" 
                    title="Smart View: Show current and upcoming workouts"
                    aria-label="Apply smart view showing relevant days">
              🎯 Smart View
            </button>
          </div>
          
          <div class="view-options">
            <button class="view-toggle compact-view ${this.isCompactView() ? 'active' : ''}" 
                    onclick="this.toggleCompactView()"
                    title="Toggle Compact View">
              📋 Compact
            </button>
            <button class="view-toggle summary-view ${this.isSummaryView() ? 'active' : ''}" 
                    onclick="this.toggleSummaryView()"
                    title="Toggle Summary View">
              📝 Summary
            </button>
          </div>
        </div>
        
        <div class="week-days">
          ${this.weekData.days.map((day, dayIndex) => this.renderDay(day, dayIndex)).join('')}
        </div>
        
        <div class="week-summary-stats" ${this.collapseStates[this.weekNumber].showSummary ? '' : 'style="display: none;"'}>
          ${this.renderWeekSummary()}
        </div>
      </div>
    `;
  }
  
  renderDay(day, dayIndex) {
    const dayKey = `day_${dayIndex}`;
    const isCollapsed = this.collapseStates[this.weekNumber].days[dayKey];
    const dayProgress = this.getDayProgress(day);
    const dayName = this.getDayName(dayIndex);
    
    return `
      <div class="day-section ${isCollapsed ? 'collapsed' : 'expanded'}" data-day="${dayIndex}">
        <div class="day-header" 
             onclick="this.toggleDay(${dayIndex})"
             onkeydown="this.handleDayKeydown(event, ${dayIndex})"
             tabindex="0"
             role="button"
             aria-expanded="${!isCollapsed}"
             aria-controls="day-content-${dayIndex}">
          
          <div class="day-title-section">
            <span class="collapse-indicator ${isCollapsed ? 'collapsed' : 'expanded'}" 
                  aria-hidden="true">
              ${isCollapsed ? '▶' : '▼'}
            </span>
            <h3 class="day-title">${dayName}</h3>
            <span class="day-date">${this.getDayDate(dayIndex)}</span>
          </div>
          
          <div class="day-meta">
            <div class="day-progress-indicator">
              <span class="progress-text">${dayProgress}%</span>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${dayProgress}%"></div>
              </div>
            </div>
            <span class="day-focus-badge">${this.getDayFocus(day)}</span>
            <span class="exercise-count">${this.getTotalExercises(day)} exercises</span>
          </div>
        </div>
        
        <div class="day-content" 
             id="day-content-${dayIndex}"
             ${isCollapsed ? 'style="display: none;"' : ''}
             aria-hidden="${isCollapsed}">
          
          <div class="day-exercise-blocks">
            ${this.renderExerciseBlocks(day, dayIndex)}
          </div>
          
          <div class="day-actions">
            <button class="day-action-btn mark-day-complete ${dayProgress === 100 ? 'completed' : ''}"
                    onclick="this.toggleDayCompletion(${dayIndex})">
              ${dayProgress === 100 ? '✅ Day Complete' : '⭕ Mark Day Complete'}
            </button>
            <button class="day-action-btn collapse-day-blocks"
                    onclick="this.collapseDayBlocks(${dayIndex})">
              📁 Collapse Blocks
            </button>
            <button class="day-action-btn expand-day-blocks"
                    onclick="this.expandDayBlocks(${dayIndex})">
              📖 Expand Blocks
            </button>
          </div>
        </div>
      </div>
    `;
  }
  
  renderExerciseBlocks(day, dayIndex) {
    const blocks = ['warmup', 'blockA', 'blockB', 'blockC', 'blockD'];
    const dayKey = `day_${dayIndex}`;
    
    return blocks.map(blockName => {
      const exercises = day[blockName] || [];
      if (exercises.length === 0) return '';
      
      const isBlockCollapsed = this.collapseStates[this.weekNumber].exerciseBlocks[dayKey][blockName];
      const blockProgress = this.getBlockProgress(exercises);
      const blockTitle = this.getBlockTitle(blockName);
      
      return `
        <div class="exercise-block ${isBlockCollapsed ? 'collapsed' : 'expanded'}" 
             data-block="${blockName}">
          
          <div class="block-header"
               onclick="this.toggleBlock(${dayIndex}, '${blockName}')"
               onkeydown="this.handleBlockKeydown(event, ${dayIndex}, '${blockName}')"
               tabindex="0"
               role="button"
               aria-expanded="${!isBlockCollapsed}"
               aria-controls="block-content-${dayIndex}-${blockName}">
            
            <div class="block-title-section">
              <span class="block-collapse-indicator ${isBlockCollapsed ? 'collapsed' : 'expanded'}"
                    aria-hidden="true">
                ${isBlockCollapsed ? '▶' : '▼'}
              </span>
              <h4 class="block-title">${blockTitle}</h4>
              <span class="block-exercise-count">(${exercises.length} exercises)</span>
            </div>
            
            <div class="block-meta">
              <div class="block-progress">
                <span class="block-progress-text">${blockProgress}%</span>
                <div class="block-progress-bar">
                  <div class="block-progress-fill" style="width: ${blockProgress}%"></div>
                </div>
              </div>
              <span class="estimated-time">${this.getBlockEstimatedTime(exercises)}</span>
            </div>
          </div>
          
          <div class="block-content"
               id="block-content-${dayIndex}-${blockName}"
               ${isBlockCollapsed ? 'style="display: none;"' : ''}
               aria-hidden="${isBlockCollapsed}">
            
            <div class="exercise-list">
              ${exercises.map((exercise, exerciseIndex) => 
                new ExerciseCard(exercise, blockName).render()
              ).join('')}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
  
  renderWeekSummary() {
    const totalExercises = this.getTotalWeekExercises();
    const completedExercises = this.getCompletedWeekExercises();
    const focusDistribution = this.getFocusDistribution();
    
    return `
      <div class="week-summary">
        <h4>Week ${this.weekNumber} Summary</h4>
        
        <div class="summary-stats">
          <div class="stat-item">
            <span class="stat-label">Total Exercises:</span>
            <span class="stat-value">${totalExercises}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Completed:</span>
            <span class="stat-value">${completedExercises}/${totalExercises}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Estimated Time:</span>
            <span class="stat-value">${this.getWeekEstimatedTime()}</span>
          </div>
        </div>
        
        <div class="focus-distribution">
          <h5>Focus Areas</h5>
          <div class="focus-chart">
            ${Object.entries(focusDistribution).map(([focus, percentage]) => `
              <div class="focus-item">
                <span class="focus-label">${focus}:</span>
                <div class="focus-bar">
                  <div class="focus-fill focus-${focus.toLowerCase()}" 
                       style="width: ${percentage}%"></div>
                </div>
                <span class="focus-percentage">${percentage}%</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }
  
  // Toggle Functions
  toggleDay(dayIndex) {
    const dayKey = `day_${dayIndex}`;
    const isCurrentlyCollapsed = this.collapseStates[this.weekNumber].days[dayKey];
    
    this.collapseStates[this.weekNumber].days[dayKey] = !isCurrentlyCollapsed;
    this.saveCollapseStates();
    this.updateDayDisplay(dayIndex);
    
    // Announce change for screen readers
    this.announceToggle(`Day ${dayIndex + 1}`, !isCurrentlyCollapsed ? 'collapsed' : 'expanded');
  }
  
  toggleBlock(dayIndex, blockName) {
    const dayKey = `day_${dayIndex}`;
    const isCurrentlyCollapsed = this.collapseStates[this.weekNumber].exerciseBlocks[dayKey][blockName];
    
    this.collapseStates[this.weekNumber].exerciseBlocks[dayKey][blockName] = !isCurrentlyCollapsed;
    this.saveCollapseStates();
    this.updateBlockDisplay(dayIndex, blockName);
    
    // Announce change for screen readers
    this.announceToggle(`${this.getBlockTitle(blockName)}`, !isCurrentlyCollapsed ? 'collapsed' : 'expanded');
  }
  
  expandAll() {
    // Expand all days and exercise blocks
    this.weekData.days.forEach((day, dayIndex) => {
      const dayKey = `day_${dayIndex}`;
      this.collapseStates[this.weekNumber].days[dayKey] = false;
      
      Object.keys(this.collapseStates[this.weekNumber].exerciseBlocks[dayKey]).forEach(blockName => {
        this.collapseStates[this.weekNumber].exerciseBlocks[dayKey][blockName] = false;
      });
    });
    
    this.saveCollapseStates();
    this.updateAllDisplays();
    this.announceToggle('All sections', 'expanded');
  }
  
  collapseAll() {
    // Collapse all days and exercise blocks
    this.weekData.days.forEach((day, dayIndex) => {
      const dayKey = `day_${dayIndex}`;
      this.collapseStates[this.weekNumber].days[dayKey] = true;
      
      Object.keys(this.collapseStates[this.weekNumber].exerciseBlocks[dayKey]).forEach(blockName => {
        this.collapseStates[this.weekNumber].exerciseBlocks[dayKey][blockName] = true;
      });
    });
    
    this.saveCollapseStates();
    this.updateAllDisplays();
    this.announceToggle('All sections', 'collapsed');
  }
  
  applySmartView() {
    // Smart view: Show current/upcoming workouts, collapse completed/future ones
    const today = new Date();
    const currentDay = this.getCurrentDayIndex(today);
    
    this.weekData.days.forEach((day, dayIndex) => {
      const dayKey = `day_${dayIndex}`;
      const dayProgress = this.getDayProgress(day);
      
      // Expand current day and next day, collapse others
      if (dayIndex === currentDay || dayIndex === currentDay + 1) {
        this.collapseStates[this.weekNumber].days[dayKey] = false;
        // Expand blocks for current day
        Object.keys(this.collapseStates[this.weekNumber].exerciseBlocks[dayKey]).forEach(blockName => {
          this.collapseStates[this.weekNumber].exerciseBlocks[dayKey][blockName] = false;
        });
      } else if (dayProgress === 100) {
        // Collapse completed days
        this.collapseStates[this.weekNumber].days[dayKey] = true;
      } else {
        // Collapse future days beyond next
        this.collapseStates[this.weekNumber].days[dayKey] = true;
      }
    });
    
    this.saveCollapseStates();
    this.updateAllDisplays();
    this.announceToggle('Smart view', 'applied');
  }
  
  collapseDayBlocks(dayIndex) {
    const dayKey = `day_${dayIndex}`;
    Object.keys(this.collapseStates[this.weekNumber].exerciseBlocks[dayKey]).forEach(blockName => {
      this.collapseStates[this.weekNumber].exerciseBlocks[dayKey][blockName] = true;
    });
    this.saveCollapseStates();
    this.updateDayBlockDisplays(dayIndex);
  }
  
  expandDayBlocks(dayIndex) {
    const dayKey = `day_${dayIndex}`;
    Object.keys(this.collapseStates[this.weekNumber].exerciseBlocks[dayKey]).forEach(blockName => {
      this.collapseStates[this.weekNumber].exerciseBlocks[dayKey][blockName] = false;
    });
    this.saveCollapseStates();
    this.updateDayBlockDisplays(dayIndex);
  }
  
  // Keyboard Navigation Support
  handleDayKeydown(event, dayIndex) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleDay(dayIndex);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.focusNextDay(dayIndex);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.focusPreviousDay(dayIndex);
    }
  }
  
  handleBlockKeydown(event, dayIndex, blockName) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleBlock(dayIndex, blockName);
    }
  }
  
  // Utility Functions
  getCurrentDayIndex(date) {
    // Calculate current day index based on program start date
    // This would be implemented based on the specific program logic
    return 0; // Placeholder
  }
  
  announceToggle(section, action) {
    // Create announcement for screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `${section} ${action}`;
    
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  }
  
  loadCollapseStates() {
    const saved = localStorage.getItem('weekViewCollapseStates');
    return saved ? JSON.parse(saved) : {};
  }
  
  saveCollapseStates() {
    localStorage.setItem('weekViewCollapseStates', JSON.stringify(this.collapseStates));
  }
  
  // Add keyboard shortcuts
  initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
        switch(event.key.toLowerCase()) {
          case 'e':
            event.preventDefault();
            this.expandAll();
            break;
          case 'c':
            event.preventDefault();
            this.collapseAll();
            break;
        }
      }
    });
  }
}
```

### 3. Enhanced Search Component with Summary Integration
```javascript
class ExerciseSearch {
  constructor() {
    this.exercises = [];
    this.searchIndex = {};
    this.summaryIndex = {};
    this.initializeSearch();
  }
  
  initializeSearch() {
    // Build search index including exercise summaries
    this.exercises.forEach(exercise => {
      this.indexExercise(exercise);
    });
  }
  
  indexExercise(exercise) {
    // Index exercise name, summary, and notes for search
    const searchText = [
      exercise.name,
      exercise.exercise_summary,
      exercise.notes
    ].filter(text => text).join(' ').toLowerCase();
    
    // Create keyword index
    const keywords = this.extractKeywords(searchText);
    keywords.forEach(keyword => {
      if (!this.searchIndex[keyword]) {
        this.searchIndex[keyword] = [];
      }
      this.searchIndex[keyword].push(exercise);
    });
  }
  
  search(query) {
    const queryLower = query.toLowerCase();
    const results = [];
    
    // Direct name matches (highest priority)
    const nameMatches = this.exercises.filter(ex => 
      ex.name.toLowerCase().includes(queryLower)
    );
    
    // Summary content matches (high priority)
    const summaryMatches = this.exercises.filter(ex => 
      ex.exercise_summary?.toLowerCase().includes(queryLower)
    );
    
    // Keyword matches (medium priority)
    const keywordMatches = this.searchKeywords(queryLower);
    
    // Combine and rank results
    return this.rankSearchResults(nameMatches, summaryMatches, keywordMatches, query);
  }
  
  searchKeywords(query) {
    const queryWords = query.split(' ');
    const matches = new Set();
    
    queryWords.forEach(word => {
      Object.keys(this.searchIndex).forEach(keyword => {
        if (keyword.includes(word)) {
          this.searchIndex[keyword].forEach(exercise => matches.add(exercise));
        }
      });
    });
    
    return Array.from(matches);
  }
  
  rankSearchResults(nameMatches, summaryMatches, keywordMatches, query) {
    const scored = [];
    const seen = new Set();
    
    // Score and combine results
    nameMatches.forEach(ex => {
      if (!seen.has(ex.name)) {
        scored.push({
          exercise: ex,
          score: 100,
          matchType: 'name',
          excerpt: this.getExcerpt(ex, query)
        });
        seen.add(ex.name);
      }
    });
    
    summaryMatches.forEach(ex => {
      if (!seen.has(ex.name)) {
        scored.push({
          exercise: ex,
          score: 80,
          matchType: 'summary',
          excerpt: this.getExcerpt(ex, query)
        });
        seen.add(ex.name);
      }
    });
    
    keywordMatches.forEach(ex => {
      if (!seen.has(ex.name)) {
        scored.push({
          exercise: ex,
          score: 60,
          matchType: 'keyword',
          excerpt: this.getExcerpt(ex, query)
        });
        seen.add(ex.name);
      }
    });
    
    return scored.sort((a, b) => b.score - a.score);
  }
  
  getExcerpt(exercise, query) {
    const summary = exercise.exercise_summary || '';
    const queryLower = query.toLowerCase();
    const summaryLower = summary.toLowerCase();
    
    const index = summaryLower.indexOf(queryLower);
    if (index === -1) return summary.substring(0, 150) + '...';
    
    const start = Math.max(0, index - 50);
    const end = Math.min(summary.length, index + query.length + 50);
    
    return (start > 0 ? '...' : '') + 
           summary.substring(start, end) + 
           (end < summary.length ? '...' : '');
  }
  
  extractKeywords(text) {
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    return text.split(/\W+/)
               .filter(word => word.length > 2 && !stopWords.includes(word))
               .map(word => word.toLowerCase());
  }
}
```

### 4. Content Analytics Component
```javascript
class ContentAnalytics {
  constructor() {
    this.analytics = this.loadAnalytics();
  }
  
  trackSummaryRead(exerciseId) {
    if (!this.analytics.summaryReads) this.analytics.summaryReads = {};
    if (!this.analytics.summaryReads[exerciseId]) {
      this.analytics.summaryReads[exerciseId] = {
        count: 0,
        firstRead: Date.now(),
        totalTime: 0
      };
    }
    this.analytics.summaryReads[exerciseId].count++;
    this.saveAnalytics();
  }
  
  trackSummaryTime(exerciseId, timeSpent) {
    if (!this.analytics.summaryReads) this.analytics.summaryReads = {};
    if (!this.analytics.summaryReads[exerciseId]) {
      this.analytics.summaryReads[exerciseId] = { count: 0, totalTime: 0 };
    }
    this.analytics.summaryReads[exerciseId].totalTime += timeSpent;
    this.saveAnalytics();
  }
  
  getContentEngagementData() {
    const summaryReads = this.analytics.summaryReads || {};
    const exerciseEngagement = Object.entries(summaryReads).map(([id, data]) => ({
      exerciseId: id,
      readCount: data.count,
      avgTimeSpent: data.totalTime / data.count,
      totalTimeSpent: data.totalTime
    }));
    
    return {
      totalSummariesRead: Object.keys(summaryReads).length,
      averageTimePerSummary: this.calculateAverageTime(summaryReads),
      mostReadExercises: exerciseEngagement.sort((a, b) => b.readCount - a.readCount).slice(0, 10),
      longestStudiedExercises: exerciseEngagement.sort((a, b) => b.totalTimeSpent - a.totalTimeSpent).slice(0, 10)
    };
  }
  
  generateLearningInsights() {
    const engagement = this.getContentEngagementData();
    const insights = [];
    
    if (engagement.averageTimePerSummary > 60) {
      insights.push({
        type: 'positive',
        message: 'Great job taking time to understand each exercise thoroughly!'
      });
    }
    
    if (engagement.totalSummariesRead > 50) {
      insights.push({
        type: 'achievement',
        message: 'Exercise Explorer: You\'ve read over 50 exercise descriptions!'
      });
    }
    
    return insights;
  }
}
```

## Performance Targets with Content

### Loading Performance
- **First Contentful Paint**: < 1.2s
- **Largest Contentful Paint**: < 2.5s (including summary content)
- **Time to Interactive**: < 3.0s
- **Bundle Size**: < 650KB (gzipped, including content processing)

### Content Performance
- **Summary Load Time**: < 200ms for exercise summary display
- **Search Response**: < 100ms for summary-based queries
- **Content Indexing**: < 500ms for full exercise database indexing
- **Progressive Loading**: Content appears incrementally for better perceived performance

### Runtime Performance
- **60 FPS**: Smooth animations and content transitions
- **Memory Usage**: < 85MB in browser (including content indexing)
- **Search Performance**: < 50ms for semantic search queries

## Content-Specific Features

### Exercise Summary Enhancements
1. **Smart Highlighting**: Automatic highlighting of key terms in summaries
2. **Difficulty Assessment**: AI-powered difficulty scoring based on summary complexity
3. **Movement Pattern Recognition**: Automatic categorization based on movement descriptions
4. **Progressive Disclosure**: Expandable summary sections for detailed information

### Content Accessibility
- **Text-to-Speech**: Built-in reading of exercise summaries
- **High Contrast Mode**: Enhanced readability for exercise descriptions
- **Scalable Text**: User-controlled text sizing for summaries
- **Simplified Language**: Option to view simplified exercise descriptions

### Learning Features
- **Comprehension Tracking**: Monitor user understanding of exercise concepts
- **Knowledge Building**: Progressive complexity in exercise descriptions
- **Concept Linking**: Related exercise suggestions based on movement patterns
- **Mastery Assessment**: Self-evaluation tools for exercise understanding

## Conclusion

This enhanced design integrates the comprehensive exercise summaries as a core feature of the training visualization app. By leveraging the detailed `exercise_summary` data, users will have immediate access to thorough exercise descriptions, significantly improving their understanding of proper technique, movement patterns, and training objectives.

The integration of exercise summaries transforms the app from a simple workout tracker into a comprehensive learning platform that combines structured training data, detailed exercise descriptions, progress tracking, and video demonstrations. This creates an educational training companion that helps users not just follow workouts, but truly understand the science and technique behind each movement.

The design emphasizes progressive disclosure of information, allowing users to access as much or as little detail as they need, while maintaining a clean and intuitive interface optimized for both mobile and desktop experiences. 