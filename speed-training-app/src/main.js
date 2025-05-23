// Import styles
import './styles/globals.css'

// Import core modules
import { DataProcessor } from './data/data-processor.js'
import { ProgressTracker } from './components/progress/ProgressTracker.js'
import { ThemeManager } from './utils/theme-manager.js'

// Import components
import { SearchComponent } from './components/ui/SearchComponent.js'
import { ExerciseCard } from './components/exercise/ExerciseCard.js'

/**
 * Main Application Class
 * Orchestrates the Speed Training Visualization Dashboard
 */
class SpeedTrainingApp {
  constructor() {
    this.dataProcessor = null
    this.progressTracker = null
    this.themeManager = null
    
    // Components
    this.search = null
    this.exerciseCards = new Map() // Store exercise card instances
    
    // State
    this.currentView = 'dashboard'
    this.currentWeek = 1
    this.currentDay = 1
    
    this.init()
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      // Show loading state
      this.showLoading()
      
      // Initialize theme manager first
      this.initializeTheme()
      
      // Initialize core systems
      await this.initializeCore()
      
      // Initialize components
      this.initializeComponents()
      
      // Setup event listeners
      this.setupEventListeners()
      
      // Load initial content
      await this.loadInitialContent()
      
      // Hide loading and show initial view
      this.hideLoading()
      this.showView('dashboard')
      
      console.log('Speed Training App initialized successfully!')
      
    } catch (error) {
      console.error('Failed to initialize app:', error)
      this.showError('Failed to load the application. Please refresh the page.')
    }
  }

  /**
   * Initialize theme management
   */
  initializeTheme() {
    this.themeManager = new ThemeManager()
  }

  /**
   * Initialize core application systems
   */
  async initializeCore() {
    // Initialize data processor
    this.dataProcessor = new DataProcessor()
    await this.dataProcessor.loadTrainingPlan()
    
    // Initialize progress tracker
    this.progressTracker = new ProgressTracker()
  }

  /**
   * Initialize UI components
   */
  initializeComponents() {
    // Initialize search component in sidebar
    const searchContainer = document.querySelector('.nav-section .search-container')
    if (searchContainer) {
      this.search = new SearchComponent(this.dataProcessor, searchContainer)
    }
    
    // Update overall progress
    this.updateOverallProgress()
    
    // Populate weeks navigation
    this.populateWeeksNavigation()
    
    // Update program statistics
    this.updateProgramStatistics()
  }

  /**
   * Load initial content
   */
  async loadInitialContent() {
    // Load dashboard content
    await this.loadDashboard()
    
    // Preload first week's content
    this.preloadWeekContent(1)
  }

  /**
   * Load dashboard content
   */
  async loadDashboard() {
    const stats = this.dataProcessor.getProgramStats()
    const engagement = this.progressTracker.getContentEngagementStats()
    const insights = this.progressTracker.generateLearningInsights()
    
    // Update program statistics
    const statsContainer = document.getElementById('program-stats')
    if (statsContainer) {
      statsContainer.innerHTML = `
        <div class="stat-item">
          <div class="stat-value">${stats.totalWeeks}</div>
          <div class="stat-label">Weeks</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${stats.totalDays}</div>
          <div class="stat-label">Days</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${stats.totalExercises}</div>
          <div class="stat-label">Exercises</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${stats.totalVideos}</div>
          <div class="stat-label">Videos</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${engagement.totalSummariesRead}</div>
          <div class="stat-label">Summaries Read</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${Math.round(engagement.averageTimePerSummary)}s</div>
          <div class="stat-label">Avg. Read Time</div>
        </div>
      `
    }

    // Display learning insights
    this.displayLearningInsights(insights)
    
    // Update training calendar
    this.updateTrainingCalendar()
  }

  /**
   * Display learning insights
   */
  displayLearningInsights(insights) {
    const insightsContainer = document.createElement('div')
    insightsContainer.className = 'learning-insights'
    insightsContainer.innerHTML = `
      <h3>Your Learning Insights</h3>
      <div class="insights-list">
        ${insights.map(insight => `
          <div class="insight-item ${insight.type}">
            <span class="insight-icon">${insight.icon}</span>
            <div class="insight-content">
              <div class="insight-message">${insight.message}</div>
              <div class="insight-detail">${insight.detail}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `

    // Add to dashboard
    const quickActionsCard = document.querySelector('.quick-actions-card')
    if (quickActionsCard && insights.length > 0) {
      quickActionsCard.parentNode.insertBefore(insightsContainer, quickActionsCard.nextSibling)
    }
  }

  /**
   * Update training calendar
   */
  updateTrainingCalendar() {
    const calendarContainer = document.getElementById('training-calendar')
    if (!calendarContainer) return

    const weeks = []
    for (let week = 1; week <= 6; week++) {
      const weekData = this.dataProcessor.getWeek(week)
      const completion = this.progressTracker.calculateWeekCompletion(week, this.dataProcessor.getAllExercises())
      
      weeks.push({
        number: week,
        completion: completion,
        days: weekData ? weekData.days : []
      })
    }

    calendarContainer.innerHTML = `
      <div class="calendar-grid">
        ${weeks.map(week => `
          <div class="calendar-week" data-week="${week.number}">
            <div class="week-header">
              <span class="week-title">Week ${week.number}</span>
              <span class="week-completion">${week.completion}%</span>
            </div>
            <div class="week-days">
              ${week.days.map(day => `
                <div class="calendar-day" data-week="${week.number}" data-day="${day.dayNumber}">
                  <div class="day-number">${day.dayNumber}</div>
                  <div class="day-focus">${day.focus}</div>
                  <div class="day-progress">
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: ${this.progressTracker.calculateDayCompletion(week.number, day.dayNumber, this.dataProcessor.getAllExercises())}%"></div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `

    // Add click handlers for calendar
    calendarContainer.addEventListener('click', (e) => {
      const dayElement = e.target.closest('.calendar-day')
      if (dayElement) {
        const week = parseInt(dayElement.dataset.week)
        const day = parseInt(dayElement.dataset.day)
        this.showDay(week, day)
      }
    })
  }

  /**
   * Populate weeks navigation
   */
  populateWeeksNavigation() {
    const weeksNav = document.getElementById('weeks-nav')
    if (!weeksNav) return

    const weeks = []
    for (let i = 1; i <= 6; i++) {
      const completion = this.progressTracker.calculateWeekCompletion(i, this.dataProcessor.getAllExercises())
      weeks.push(`
        <li>
          <a href="#" class="nav-link week-link" data-week="${i}">
            <span class="week-number">Week ${i}</span>
            <span class="week-progress">${completion}%</span>
            <div class="progress-bar-mini">
              <div class="progress-fill" style="width: ${completion}%"></div>
            </div>
          </a>
        </li>
      `)
    }

    weeksNav.innerHTML = weeks.join('')

    // Add click handlers
    weeksNav.addEventListener('click', (e) => {
      e.preventDefault()
      const weekLink = e.target.closest('.week-link')
      if (weekLink) {
        const weekNumber = parseInt(weekLink.dataset.week)
        this.showWeek(weekNumber)
      }
    })
  }

  /**
   * Show specific week
   */
  showWeek(weekNumber) {
    this.currentWeek = weekNumber
    this.showView('week-view')
    this.loadWeekContent(weekNumber)
  }

  /**
   * Load week content
   */
  loadWeekContent(weekNumber) {
    const weekData = this.dataProcessor.getWeek(weekNumber)
    if (!weekData) return

    // Update week title
    const weekTitle = document.getElementById('week-title')
    if (weekTitle) {
      weekTitle.textContent = `Week ${weekNumber}`
    }

    // Load week content
    const weekContent = document.getElementById('week-content')
    if (!weekContent) return

    weekContent.innerHTML = `
      <div class="week-overview">
        <div class="week-stats">
          <div class="stat">
            <span class="stat-value">${weekData.days.length}</span>
            <span class="stat-label">Training Days</span>
          </div>
          <div class="stat">
            <span class="stat-value">${weekData.totalExercises}</span>
            <span class="stat-label">Total Exercises</span>
          </div>
          <div class="stat">
            <span class="stat-value">${this.progressTracker.calculateWeekCompletion(weekNumber, this.dataProcessor.getAllExercises())}%</span>
            <span class="stat-label">Completed</span>
          </div>
        </div>
      </div>
      
      <div class="days-grid">
        ${weekData.days.map(day => this.createDayCard(day)).join('')}
      </div>
    `

    // Add click handlers for day cards
    weekContent.addEventListener('click', (e) => {
      const dayCard = e.target.closest('.day-card')
      if (dayCard) {
        const dayNumber = parseInt(dayCard.dataset.day)
        this.showDay(weekNumber, dayNumber)
      }
    })
  }

  /**
   * Create day card HTML
   */
  createDayCard(day) {
    const completion = this.progressTracker.calculateDayCompletion(day.weekNumber, day.dayNumber, this.dataProcessor.getAllExercises())
    
    return `
      <div class="day-card" data-week="${day.weekNumber}" data-day="${day.dayNumber}">
        <div class="day-header">
          <h3>Day ${day.dayNumber}</h3>
          <span class="completion-badge">${completion}%</span>
        </div>
        <div class="day-focus" data-focus="${day.focus}">
          <span class="focus-label">${day.focus}</span>
        </div>
        <div class="day-stats">
          <span class="exercise-count">${day.totalExercises} exercises</span>
          <span class="video-count">${day.videoCount} videos</span>
          <span class="duration">${day.estimatedDuration} min</span>
        </div>
        <div class="day-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${completion}%"></div>
          </div>
        </div>
      </div>
    `
  }

  /**
   * Show specific day
   */
  showDay(weekNumber, dayNumber) {
    this.currentWeek = weekNumber
    this.currentDay = dayNumber
    this.showView('day-view')
    this.loadDayContent(weekNumber, dayNumber)
  }

  /**
   * Load day content with enhanced exercise cards
   */
  loadDayContent(weekNumber, dayNumber) {
    const dayData = this.dataProcessor.getDay(weekNumber, dayNumber)
    if (!dayData) return

    // Update day title and description
    const dayTitle = document.getElementById('day-title')
    const dayDescription = document.getElementById('day-description')
    
    if (dayTitle) {
      dayTitle.textContent = `Day ${dayNumber} - ${dayData.focus}`
    }
    
    if (dayDescription) {
      dayDescription.textContent = `Focus on ${dayData.focus.toLowerCase()} training`
    }

    // Load day content with enhanced exercise cards
    const dayContent = document.getElementById('day-content')
    if (!dayContent) return

    // Clear existing exercise cards
    this.exerciseCards.clear()

    dayContent.innerHTML = `
      <div class="day-overview">
        <div class="day-meta">
          <span class="day-duration">⏱️ ${dayData.estimatedDuration} minutes</span>
          <span class="exercise-count">📋 ${dayData.totalExercises} exercises</span>
          <span class="video-count">🎥 ${dayData.videoCount} videos</span>
        </div>
        ${dayData.notes ? `<div class="day-notes">${dayData.notes}</div>` : ''}
      </div>
      
      <div class="blocks-container">
        ${dayData.blocks.map(block => this.createBlockSection(block)).join('')}
      </div>
    `

    // Initialize exercise cards for this day
    this.initializeExerciseCards(dayData)
  }

  /**
   * Create block section HTML
   */
  createBlockSection(block) {
    return `
      <div class="block-section" data-block="${block.name}">
        <div class="block-header">
          <h3 class="block-title">${block.name}</h3>
          <span class="block-count">${block.exerciseCount} exercises</span>
        </div>
        <div class="block-exercises" id="block-${block.name.replace(/[^a-zA-Z0-9]/g, '')}">
          <!-- Exercise cards will be inserted here -->
        </div>
      </div>
    `
  }

  /**
   * Initialize exercise cards for a day
   */
  initializeExerciseCards(dayData) {
    dayData.blocks.forEach(block => {
      const blockContainer = document.getElementById(`block-${block.name.replace(/[^a-zA-Z0-9]/g, '')}`)
      if (!blockContainer) return

      block.exercises.forEach(exercise => {
        // Create enhanced exercise card
        const exerciseCard = new ExerciseCard(exercise, block.name, this.dataProcessor)
        const cardElement = exerciseCard.render()
        
        // Store reference
        this.exerciseCards.set(exercise.id, exerciseCard)
        
        // Add to container
        blockContainer.appendChild(cardElement)
      })
    })
  }

  /**
   * Preload week content for better performance
   */
  preloadWeekContent(weekNumber) {
    const weekData = this.dataProcessor.getWeek(weekNumber)
    if (weekData) {
      // Preload day data
      weekData.days.forEach(day => {
        // This could include preloading video thumbnails, etc.
        console.log(`Preloaded day ${day.dayNumber} of week ${weekNumber}`)
      })
    }
  }

  /**
   * Update overall progress in header
   */
  updateOverallProgress() {
    const totalExercises = this.dataProcessor.getProgramStats().totalExercises
    const completion = this.progressTracker.calculateOverallCompletion(totalExercises)
    
    const progressFill = document.getElementById('overall-progress')
    const progressPercentage = document.getElementById('overall-percentage')
    
    if (progressFill) {
      progressFill.style.width = `${completion}%`
    }
    
    if (progressPercentage) {
      progressPercentage.textContent = `${completion}%`
    }
  }

  /**
   * Update program statistics
   */
  updateProgramStatistics() {
    const stats = this.dataProcessor.getProgramStats()
    
    // This could update various statistics throughout the UI
    console.log('Program statistics:', stats)
  }

  /**
   * Setup global event listeners
   */
  setupEventListeners() {
    // Theme toggle using ThemeManager
    const themeToggle = document.getElementById('theme-toggle')
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.themeManager.toggleTheme()
      })
    }

    // Navigation links
    document.addEventListener('click', (e) => {
      const navLink = e.target.closest('[data-view]')
      if (navLink) {
        e.preventDefault()
        const viewName = navLink.dataset.view
        this.showView(viewName)
      }
    })

    // Quick action buttons
    const todayWorkout = document.getElementById('today-workout')
    const nextWorkout = document.getElementById('next-workout')
    const videoLibraryBtn = document.getElementById('video-library-btn')

    if (todayWorkout) {
      todayWorkout.addEventListener('click', () => {
        // For now, go to week 1 day 1
        this.showDay(1, 1)
      })
    }

    if (nextWorkout) {
      nextWorkout.addEventListener('click', () => {
        // For now, go to next day
        this.showDay(this.currentWeek, Math.min(this.currentDay + 1, 3))
      })
    }

    if (videoLibraryBtn) {
      videoLibraryBtn.addEventListener('click', () => {
        this.showView('video-library-view')
      })
    }

    // Week navigation buttons
    const prevWeek = document.getElementById('prev-week')
    const nextWeek = document.getElementById('next-week')

    if (prevWeek) {
      prevWeek.addEventListener('click', () => {
        if (this.currentWeek > 1) {
          this.showWeek(this.currentWeek - 1)
        }
      })
    }

    if (nextWeek) {
      nextWeek.addEventListener('click', () => {
        if (this.currentWeek < 6) {
          this.showWeek(this.currentWeek + 1)
        }
      })
    }

    // Day navigation
    const backToWeek = document.getElementById('back-to-week')
    if (backToWeek) {
      backToWeek.addEventListener('click', () => {
        this.showWeek(this.currentWeek)
      })
    }

    // Global exercise card events
    document.addEventListener('exerciseCompleted', (e) => {
      this.handleExerciseCompletion(e.detail)
    })

    document.addEventListener('navigateToExercise', (e) => {
      this.navigateToExercise(e.detail.exerciseId)
    })

    document.addEventListener('showSimilarExercises', (e) => {
      this.showSimilarExercises(e.detail)
    })

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardShortcuts(e)
    })
  }

  /**
   * Handle exercise completion
   */
  handleExerciseCompletion(detail) {
    // Update overall progress
    this.updateOverallProgress()
    
    // Update week navigation if needed
    this.populateWeeksNavigation()
    
    console.log('Exercise completed:', detail)
  }

  /**
   * Navigate to specific exercise
   */
  navigateToExercise(exerciseId) {
    const exercise = this.dataProcessor.getExercise(exerciseId)
    if (exercise) {
      this.showDay(exercise.weekNumber, exercise.dayNumber)
      
      // Scroll to exercise after a short delay
      setTimeout(() => {
        const exerciseElement = document.querySelector(`[data-exercise-id="${exerciseId}"]`)
        if (exerciseElement) {
          exerciseElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          exerciseElement.classList.add('highlight')
          setTimeout(() => exerciseElement.classList.remove('highlight'), 2000)
        }
      }, 500)
    }
  }

  /**
   * Show similar exercises (placeholder)
   */
  showSimilarExercises(detail) {
    console.log('Show similar exercises:', detail)
    // This could open a modal or navigate to a search result
  }

  /**
   * Handle keyboard shortcuts
   */
  handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      const searchInput = document.getElementById('exercise-search')
      if (searchInput) {
        searchInput.focus()
      }
    }

    // Number keys for quick week navigation
    if (e.key >= '1' && e.key <= '6' && !e.ctrlKey && !e.metaKey && !e.target.matches('input, textarea')) {
      const weekNumber = parseInt(e.key)
      this.showWeek(weekNumber)
    }
  }

  /**
   * Show a specific view
   */
  showView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
      view.classList.remove('active')
    })

    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active')
    })

    // Show selected view
    const viewMapping = {
      'dashboard': 'dashboard-view',
      'week-view': 'week-view',
      'day-view': 'day-view',
      'video-library': 'video-library-view'
    }

    const targetViewId = viewMapping[viewName] || `${viewName}-view`
    const targetView = document.getElementById(targetViewId)
    const targetNav = document.querySelector(`[data-view="${viewName}"]`)

    if (targetView) {
      targetView.classList.add('active')
    }

    if (targetNav) {
      targetNav.classList.add('active')
    }

    // Update current view state
    this.currentView = viewName

    // Load content based on view
    if (viewName === 'dashboard') {
      this.loadDashboard()
    } else if (viewName === 'video-library') {
      this.loadVideoLibrary()
    }
  }

  /**
   * Load video library content
   */
  loadVideoLibrary() {
    const videoLibraryContent = document.getElementById('video-library-content')
    if (!videoLibraryContent) return

    const videos = this.dataProcessor.getAllVideos()
    const videosByFocus = {}

    // Group videos by focus area
    videos.forEach(video => {
      if (!videosByFocus[video.focus]) {
        videosByFocus[video.focus] = []
      }
      videosByFocus[video.focus].push(video)
    })

    videoLibraryContent.innerHTML = `
      <div class="video-library-header">
        <h3>Exercise Demonstration Videos</h3>
        <p>Watch proper form and technique for all exercises</p>
      </div>
      
      ${Object.entries(videosByFocus).map(([focus, focusVideos]) => `
        <div class="video-focus-section">
          <h4 class="focus-title" data-focus="${focus}">${focus}</h4>
          <div class="videos-grid">
            ${focusVideos.map(video => `
              <div class="video-thumbnail-card" data-video="${video.videoId}">
                <div class="video-thumbnail">
                  <img src="https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg" 
                       alt="${video.exerciseName}" loading="lazy">
                  <div class="play-overlay">▶️</div>
                </div>
                <div class="video-info">
                  <h5>${video.exerciseName}</h5>
                  <p>Week ${video.weekNumber}, Day ${video.dayNumber}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    `

    // Add click handlers for video thumbnails
    videoLibraryContent.addEventListener('click', (e) => {
      const videoCard = e.target.closest('.video-thumbnail-card')
      if (videoCard) {
        const videoId = videoCard.dataset.video
        const video = videos.find(v => v.videoId === videoId)
        if (video) {
          // Navigate to the exercise that contains this video
          const exercise = this.dataProcessor.getAllExercises().find(ex => ex.videoId === videoId)
          if (exercise) {
            this.navigateToExercise(exercise.id)
          }
        }
      }
    })
  }

  /**
   * Show loading state
   */
  showLoading() {
    const loadingState = document.getElementById('loading-state')
    if (loadingState) {
      loadingState.style.display = 'flex'
    }
  }

  /**
   * Hide loading state
   */
  hideLoading() {
    const loadingState = document.getElementById('loading-state')
    if (loadingState) {
      loadingState.style.display = 'none'
    }
  }

  /**
   * Show error message
   */
  showError(message) {
    const loadingState = document.getElementById('loading-state')
    if (loadingState) {
      loadingState.innerHTML = `
        <div class="error-state">
          <div class="error-icon">⚠️</div>
          <h3>Error</h3>
          <p>${message}</p>
          <button onclick="location.reload()" class="retry-btn">Retry</button>
        </div>
      `
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Create global app instance
  window.speedTrainingApp = new SpeedTrainingApp()
})

// Handle page visibility changes for better performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // App is hidden, pause any running timers/animations
    console.log('App hidden - pausing performance-intensive operations')
  } else {
    // App is visible again, resume operations
    console.log('App visible - resuming operations')
  }
})
