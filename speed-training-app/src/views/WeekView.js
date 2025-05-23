/**
 * WeekView - Shows detailed view of a specific week
 */
export class WeekView {
  constructor(dataProcessor, progressTracker) {
    this.dataProcessor = dataProcessor
    this.progressTracker = progressTracker
    this.container = document.getElementById('week-view')
    this.currentWeek = 1
  }

  /**
   * Render the week view
   */
  render() {
    if (!this.container) return
    this.showWeek(this.currentWeek)
  }

  /**
   * Show a specific week
   */
  showWeek(weekNumber) {
    this.currentWeek = weekNumber
    
    const week = this.dataProcessor.getWeek(weekNumber)
    if (!week) return

    this.updateWeekTitle(weekNumber)
    this.renderWeekContent(week)
    this.updateNavigationButtons(weekNumber)
  }

  /**
   * Update week title
   */
  updateWeekTitle(weekNumber) {
    const weekTitle = document.getElementById('week-title')
    if (weekTitle) {
      weekTitle.textContent = `Week ${weekNumber}`
    }
  }

  /**
   * Render week content
   */
  renderWeekContent(week) {
    const weekContent = document.getElementById('week-content')
    if (!weekContent) return

    const weekProgress = this.progressTracker.getWeekProgress(week.weekNumber)
    
    const weekHtml = `
      <div class="week-overview">
        <div class="week-stats">
          <div class="week-stat">
            <span class="stat-label">Progress:</span>
            <span class="stat-value">${weekProgress}%</span>
          </div>
          <div class="week-stat">
            <span class="stat-label">Days:</span>
            <span class="stat-value">${week.days.length}</span>
          </div>
          <div class="week-stat">
            <span class="stat-label">Exercises:</span>
            <span class="stat-value">${week.totalExercises}</span>
          </div>
        </div>
        
        <div class="week-progress-bar">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${weekProgress}%"></div>
          </div>
        </div>
      </div>

      <div class="week-days-grid">
        ${week.days.map(day => {
          const isComplete = this.progressTracker.isDayComplete(week.weekNumber, day.dayNumber)
          const isStarted = this.progressTracker.isDayStarted(week.weekNumber, day.dayNumber)
          const dayProgress = this.progressTracker.getDayProgress(week.weekNumber, day.dayNumber)
          
          return `
            <div class="day-card ${isComplete ? 'completed' : ''} ${isStarted ? 'started' : ''}" 
                 data-week="${week.weekNumber}" 
                 data-day="${day.dayNumber}">
              <div class="day-header">
                <h3>Day ${day.dayNumber}</h3>
                <div class="day-status">
                  ${isComplete ? '✓ Complete' : isStarted ? '⏳ In Progress' : '○ Not Started'}
                </div>
              </div>
              
              <div class="day-focus" style="border-left-color: ${day.focusColor}">
                <span class="focus-icon">${this.getFocusIcon(day.focus)}</span>
                <span class="focus-text">${day.focus}</span>
              </div>
              
              <div class="day-summary">
                <div class="day-stat">
                  <span>${day.totalExercises} exercises</span>
                </div>
                <div class="day-stat">
                  <span>${day.videoCount} videos</span>
                </div>
                <div class="day-stat">
                  <span>~${day.estimatedDuration} min</span>
                </div>
              </div>
              
              <div class="day-progress">
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${dayProgress}%"></div>
                </div>
                <span class="progress-text">${dayProgress}% complete</span>
              </div>
              
              <div class="day-actions">
                <button class="btn btn-primary day-start-btn" 
                        data-week="${week.weekNumber}" 
                        data-day="${day.dayNumber}">
                  ${isStarted ? 'Continue' : 'Start'} Workout
                </button>
              </div>
            </div>
          `
        }).join('')}
      </div>
    `

    weekContent.innerHTML = weekHtml
    this.setupWeekInteractions()
  }

  /**
   * Update navigation buttons
   */
  updateNavigationButtons(weekNumber) {
    const prevBtn = document.getElementById('prev-week')
    const nextBtn = document.getElementById('next-week')
    const totalWeeks = this.dataProcessor.getTotalWeeks()

    if (prevBtn) {
      prevBtn.disabled = weekNumber <= 1
      prevBtn.classList.toggle('disabled', weekNumber <= 1)
    }

    if (nextBtn) {
      nextBtn.disabled = weekNumber >= totalWeeks
      nextBtn.classList.toggle('disabled', weekNumber >= totalWeeks)
    }
  }

  /**
   * Setup week interactions
   */
  setupWeekInteractions() {
    // Day card clicks
    const dayCards = document.querySelectorAll('.day-card')
    dayCards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.day-start-btn')) return // Skip if clicking button
        
        const weekNumber = parseInt(card.dataset.week)
        const dayNumber = parseInt(card.dataset.day)
        
        if (window.speedTrainingApp) {
          window.speedTrainingApp.showDay(weekNumber, dayNumber)
        }
      })
    })

    // Start workout buttons
    const startBtns = document.querySelectorAll('.day-start-btn')
    startBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        
        const weekNumber = parseInt(btn.dataset.week)
        const dayNumber = parseInt(btn.dataset.day)
        
        // Mark day as started
        this.progressTracker.startDay(weekNumber, dayNumber)
        
        if (window.speedTrainingApp) {
          window.speedTrainingApp.showDay(weekNumber, dayNumber)
        }
      })
    })
  }

  /**
   * Get focus area icon
   */
  getFocusIcon(focus) {
    const icons = {
      'Acceleration': '🚀',
      'Top End Speed': '⚡',
      'Change of Direction/Lateral Movements/Agility': '🔄'
    }
    return icons[focus] || '🏃'
  }

  /**
   * Apply filters
   */
  applyFilters(filters) {
    // Could filter days by focus, completion status, etc.
    console.log('Week view filters applied:', filters)
  }
} 