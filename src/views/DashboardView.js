/**
 * DashboardView - Main dashboard view showing program overview and statistics
 */
export class DashboardView {
  constructor(dataProcessor, progressTracker) {
    this.dataProcessor = dataProcessor
    this.progressTracker = progressTracker
    this.container = document.getElementById('dashboard-view')
  }

  /**
   * Render the dashboard view
   */
  render() {
    if (!this.container) return

    this.renderProgramStats()
    this.renderProgressChart()
    this.renderTrainingCalendar()
    this.updateProgressBar()
  }

  /**
   * Render program statistics
   */
  renderProgramStats() {
    const statsContainer = document.getElementById('program-stats')
    if (!statsContainer) return

    const stats = this.dataProcessor.getProgramStats()
    const progressSummary = this.progressTracker.getProgressSummary()
    const videoEngagement = progressSummary.videoEngagement

    const statsHtml = `
      <div class="stat-item">
        <div class="stat-value">${stats.totalWeeks}</div>
        <div class="stat-label">Weeks</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.totalDays}</div>
        <div class="stat-label">Training Days</div>
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
        <div class="stat-value">${progressSummary.completedDays}</div>
        <div class="stat-label">Completed Days</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${progressSummary.currentStreak}</div>
        <div class="stat-label">Current Streak</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${videoEngagement.watchedPercentage}%</div>
        <div class="stat-label">Videos Watched</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${stats.estimatedDuration}h</div>
        <div class="stat-label">Est. Duration</div>
      </div>
    `

    statsContainer.innerHTML = statsHtml
  }

  /**
   * Render progress chart
   */
  renderProgressChart() {
    const chartContainer = document.getElementById('progress-chart')
    if (!chartContainer) return

    // For now, create a simple progress visualization
    // In Phase 3, this will be replaced with Chart.js
    const weeklyProgress = this.progressTracker.getWeeklyProgressSummary()
    
    const chartHtml = `
      <div class="progress-chart-simple">
        <div class="chart-title">Weekly Progress</div>
        <div class="chart-bars">
          ${weeklyProgress.map(week => `
            <div class="chart-bar-container">
              <div class="chart-bar" style="height: ${week.progress}%">
                <div class="chart-bar-fill" style="background: ${this.getProgressColor(week.progress)}"></div>
              </div>
              <div class="chart-bar-label">W${week.week}</div>
              <div class="chart-bar-value">${week.progress}%</div>
            </div>
          `).join('')}
        </div>
      </div>
    `

    chartContainer.innerHTML = chartHtml
  }

  /**
   * Render training calendar
   */
  renderTrainingCalendar() {
    const calendarContainer = document.getElementById('training-calendar')
    if (!calendarContainer) return

    const weeks = this.dataProcessor.processedData.weeks
    
    const calendarHtml = `
      <div class="calendar-grid">
        ${weeks.map(week => `
          <div class="calendar-week" data-week="${week.weekNumber}">
            <div class="week-header">
              <h4>Week ${week.weekNumber}</h4>
              <div class="week-progress">
                ${this.progressTracker.getWeekProgress(week.weekNumber)}% Complete
              </div>
            </div>
            <div class="week-days">
              ${week.days.map(day => {
                const isComplete = this.progressTracker.isDayComplete(week.weekNumber, day.dayNumber)
                const isStarted = this.progressTracker.isDayStarted(week.weekNumber, day.dayNumber)
                const dayProgress = this.progressTracker.getDayProgress(week.weekNumber, day.dayNumber)
                
                return `
                  <div class="calendar-day ${isComplete ? 'completed' : ''} ${isStarted ? 'started' : ''}" 
                       data-week="${week.weekNumber}" 
                       data-day="${day.dayNumber}"
                       title="${day.focus} - ${dayProgress}% complete">
                    <div class="day-number">Day ${day.dayNumber}</div>
                    <div class="day-focus" style="color: ${day.focusColor}">
                      ${this.getFocusIcon(day.focus)}
                    </div>
                    <div class="day-progress">
                      <div class="day-progress-bar">
                        <div class="day-progress-fill" style="width: ${dayProgress}%"></div>
                      </div>
                    </div>
                    ${isComplete ? '<div class="day-checkmark">✓</div>' : ''}
                  </div>
                `
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `

    calendarContainer.innerHTML = calendarHtml

    // Add click handlers for calendar days
    this.setupCalendarInteractions()
  }

  /**
   * Update overall progress bar in header
   */
  updateProgressBar() {
    const progressFill = document.getElementById('overall-progress')
    const progressPercentage = document.getElementById('overall-percentage')
    
    const overallProgress = this.progressTracker.getOverallProgress()
    
    if (progressFill) {
      progressFill.style.width = `${overallProgress}%`
    }
    
    if (progressPercentage) {
      progressPercentage.textContent = `${overallProgress}%`
    }
  }

  /**
   * Setup calendar day click interactions
   */
  setupCalendarInteractions() {
    const calendarDays = document.querySelectorAll('.calendar-day')
    
    calendarDays.forEach(day => {
      day.addEventListener('click', (e) => {
        const weekNumber = parseInt(e.currentTarget.dataset.week)
        const dayNumber = parseInt(e.currentTarget.dataset.day)
        
        // Navigate to day view
        if (window.speedTrainingApp) {
          window.speedTrainingApp.showDay(weekNumber, dayNumber)
        }
      })
    })

    // Add week header click to navigate to week view
    const weekHeaders = document.querySelectorAll('.week-header')
    weekHeaders.forEach(header => {
      header.addEventListener('click', (e) => {
        const weekNumber = parseInt(e.currentTarget.closest('.calendar-week').dataset.week)
        
        if (window.speedTrainingApp) {
          window.speedTrainingApp.currentWeek = weekNumber
          window.speedTrainingApp.showView('week-view')
          window.speedTrainingApp.views.week.showWeek(weekNumber)
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
   * Get progress color based on percentage
   */
  getProgressColor(progress) {
    if (progress >= 80) return 'var(--success)'
    if (progress >= 60) return 'var(--primary-green)'
    if (progress >= 40) return 'var(--warning)'
    if (progress >= 20) return 'var(--primary-orange)'
    return 'var(--gray-400)'
  }

  /**
   * Apply filters (for consistency with other views)
   */
  applyFilters(filters) {
    // Dashboard doesn't typically need filtering, but can be extended
    console.log('Dashboard filters applied:', filters)
  }

  /**
   * Refresh the dashboard data
   */
  refresh() {
    this.render()
  }

  /**
   * Get dashboard data for export
   */
  getExportData() {
    return {
      type: 'dashboard',
      timestamp: new Date().toISOString(),
      stats: this.dataProcessor.getProgramStats(),
      progress: this.progressTracker.getProgressSummary()
    }
  }
} 