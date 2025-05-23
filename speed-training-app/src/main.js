// Import styles
import './styles/globals.css'

// Import core modules
import { DataProcessor } from './data/data-processor.js'
import { ProgressTracker } from './utils/progress-tracker.js'
import { Router } from './utils/router.js'
import { ThemeManager } from './utils/theme-manager.js'

// Import views
import { DashboardView } from './views/DashboardView.js'
import { WeekView } from './views/WeekView.js'
import { DayView } from './views/DayView.js'
import { VideoLibraryView } from './views/VideoLibraryView.js'

// Import components
import { NavigationComponent } from './components/navigation/Navigation.js'
import { SearchComponent } from './components/ui/Search.js'

/**
 * Main Application Class
 * Orchestrates the Speed Training Visualization Dashboard
 */
class SpeedTrainingApp {
  constructor() {
    this.dataProcessor = null
    this.progressTracker = null
    this.router = null
    this.themeManager = null
    
    // Components
    this.navigation = null
    this.search = null
    
    // Views
    this.views = {}
    
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
      
      // Initialize core systems
      await this.initializeCore()
      
      // Initialize components
      this.initializeComponents()
      
      // Initialize views
      this.initializeViews()
      
      // Setup event listeners
      this.setupEventListeners()
      
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
   * Initialize core application systems
   */
  async initializeCore() {
    // Initialize data processor
    this.dataProcessor = new DataProcessor()
    await this.dataProcessor.loadTrainingPlan()
    
    // Initialize progress tracker
    this.progressTracker = new ProgressTracker(this.dataProcessor)
    
    // Initialize router
    this.router = new Router()
    
    // Register routes
    this.setupRoutes()
    
    // Initialize theme manager
    this.themeManager = new ThemeManager()
  }

  /**
   * Setup application routes
   */
  setupRoutes() {
    // Register all application routes
    this.router.addRoute('dashboard', () => this.showViewInternal('dashboard'))
    this.router.addRoute('week-view', () => this.showViewInternal('week-view'))
    this.router.addRoute('day', () => this.showViewInternal('day'))
    this.router.addRoute('video-library', () => this.showViewInternal('video-library'))
    this.router.addRoute('', () => this.showViewInternal('dashboard')) // Default route
  }

  /**
   * Initialize UI components
   */
  initializeComponents() {
    // Navigation component
    this.navigation = new NavigationComponent(
      this.dataProcessor,
      this.progressTracker
    )
    
    // Search component
    this.search = new SearchComponent(this.dataProcessor)
  }

  /**
   * Initialize view components
   */
  initializeViews() {
    // Dashboard view
    this.views.dashboard = new DashboardView(
      this.dataProcessor,
      this.progressTracker
    )
    
    // Week view
    this.views.week = new WeekView(
      this.dataProcessor,
      this.progressTracker
    )
    
    // Day view
    this.views.day = new DayView(
      this.dataProcessor,
      this.progressTracker
    )
    
    // Video library view
    this.views.videoLibrary = new VideoLibraryView(
      this.dataProcessor,
      this.progressTracker
    )
  }

  /**
   * Setup global event listeners
   */
  setupEventListeners() {
    // Theme toggle
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
        // Navigate to current day's workout
        const currentDay = this.progressTracker.getCurrentDay()
        this.showDay(currentDay.week, currentDay.day)
      })
    }

    if (nextWorkout) {
      nextWorkout.addEventListener('click', () => {
        // Navigate to next workout
        const nextDay = this.progressTracker.getNextWorkout()
        if (nextDay) {
          this.showDay(nextDay.week, nextDay.day)
        }
      })
    }

    if (videoLibraryBtn) {
      videoLibraryBtn.addEventListener('click', () => {
        this.showView('video-library')
      })
    }

    // Week navigation
    const prevWeek = document.getElementById('prev-week')
    const nextWeek = document.getElementById('next-week')

    if (prevWeek) {
      prevWeek.addEventListener('click', () => {
        if (this.currentWeek > 1) {
          this.currentWeek--
          this.views.week.showWeek(this.currentWeek)
        }
      })
    }

    if (nextWeek) {
      nextWeek.addEventListener('click', () => {
        const totalWeeks = this.dataProcessor.getTotalWeeks()
        if (this.currentWeek < totalWeeks) {
          this.currentWeek++
          this.views.week.showWeek(this.currentWeek)
        }
      })
    }

    // Day navigation
    const backToWeek = document.getElementById('back-to-week')
    if (backToWeek) {
      backToWeek.addEventListener('click', () => {
        this.showView('week-view')
        this.views.week.showWeek(this.currentWeek)
      })
    }

    // Search functionality
    const searchInput = document.getElementById('exercise-search')
    const searchClear = document.getElementById('search-clear')

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.search.handleSearch(e.target.value)
      })
    }

    if (searchClear) {
      searchClear.addEventListener('click', () => {
        searchInput.value = ''
        this.search.clearSearch()
      })
    }

    // Filter functionality
    const focusFilter = document.getElementById('focus-filter')
    const completionFilter = document.getElementById('completion-filter')

    if (focusFilter) {
      focusFilter.addEventListener('change', (e) => {
        this.applyFilters()
      })
    }

    if (completionFilter) {
      completionFilter.addEventListener('change', (e) => {
        this.applyFilters()
      })
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardShortcuts(e)
    })
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

    // Escape to clear search
    if (e.key === 'Escape') {
      const searchInput = document.getElementById('exercise-search')
      if (searchInput && searchInput.value) {
        searchInput.value = ''
        this.search.clearSearch()
      }
    }

    // Number keys for quick week navigation
    if (e.key >= '1' && e.key <= '6' && !e.ctrlKey && !e.metaKey) {
      const weekNumber = parseInt(e.key)
      if (weekNumber <= this.dataProcessor.getTotalWeeks()) {
        this.currentWeek = weekNumber
        this.showView('week-view')
        this.views.week.showWeek(weekNumber)
      }
    }
  }

  /**
   * Show a specific view (internal method for router callbacks)
   */
  showViewInternal(viewName) {
    this.displayView(viewName, false) // false = don't update router
  }

  /**
   * Show a specific view (public method)
   */
  showView(viewName) {
    this.displayView(viewName, true) // true = update router
  }

  /**
   * Display a view with optional router update
   */
  displayView(viewName, updateRouter = true) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
      view.classList.remove('active')
    })

    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active')
    })

    // Show selected view
    const targetView = document.getElementById(`${viewName === 'week-view' ? 'week' : viewName === 'video-library' ? 'video-library' : viewName}-view`)
    const targetNav = document.querySelector(`[data-view="${viewName}"]`)

    if (targetView) {
      targetView.classList.add('active')
    }

    if (targetNav) {
      targetNav.classList.add('active')
    }

    // Update current view state
    this.currentView = viewName

    // Initialize view if needed
    if (this.views[viewName === 'week-view' ? 'week' : viewName === 'video-library' ? 'videoLibrary' : viewName]) {
      this.views[viewName === 'week-view' ? 'week' : viewName === 'video-library' ? 'videoLibrary' : viewName].render()
    }

    // Update URL without page reload (only if not called from router)
    if (updateRouter) {
      this.router.navigateTo(viewName)
    }
  }

  /**
   * Show specific day view
   */
  showDay(weekNumber, dayNumber) {
    this.currentWeek = weekNumber
    this.currentDay = dayNumber
    
    this.showView('day')
    this.views.day.showDay(weekNumber, dayNumber)
  }

  /**
   * Apply current filters
   */
  applyFilters() {
    const focusFilter = document.getElementById('focus-filter')
    const completionFilter = document.getElementById('completion-filter')

    const filters = {
      focus: focusFilter ? focusFilter.value : '',
      completion: completionFilter ? completionFilter.value : ''
    }

    // Apply filters to current view
    if (this.views[this.currentView] && this.views[this.currentView].applyFilters) {
      this.views[this.currentView].applyFilters(filters)
    }
  }

  /**
   * Show loading state
   */
  showLoading() {
    const loadingState = document.getElementById('loading-state')
    if (loadingState) {
      loadingState.classList.remove('hidden')
    }
  }

  /**
   * Hide loading state
   */
  hideLoading() {
    const loadingState = document.getElementById('loading-state')
    if (loadingState) {
      loadingState.classList.add('hidden')
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
