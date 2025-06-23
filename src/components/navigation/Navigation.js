/**
 * NavigationComponent - Manages sidebar navigation and week listing
 */
export class NavigationComponent {
  constructor(dataProcessor, progressTracker) {
    this.dataProcessor = dataProcessor
    this.progressTracker = progressTracker
    this.weeksNavContainer = document.getElementById('weeks-nav')
    
    this.init()
  }

  /**
   * Initialize navigation
   */
  init() {
    this.renderWeeksNavigation()
  }

  /**
   * Render weeks navigation in sidebar
   */
  renderWeeksNavigation() {
    if (!this.weeksNavContainer) return

    const stats = this.dataProcessor.getProgramStats()
    if (!stats) return

    const weeksHtml = []
    
    for (let week = 1; week <= stats.totalWeeks; week++) {
      const weekProgress = this.progressTracker.getWeekProgress(week)
      const isCompleted = this.progressTracker.isWeekComplete(week)
      const isStarted = this.progressTracker.isWeekStarted(week)
      
      weeksHtml.push(`
        <li>
          <a href="#week-${week}" 
             class="nav-link week-link ${isCompleted ? 'completed' : ''} ${isStarted ? 'started' : ''}" 
             data-week="${week}"
             title="Week ${week} - ${weekProgress}% complete">
            <span class="week-number">Week ${week}</span>
            <div class="week-progress-mini">
              <div class="progress-bar-mini">
                <div class="progress-fill-mini" style="width: ${weekProgress}%"></div>
              </div>
              <span class="progress-text-mini">${weekProgress}%</span>
            </div>
            ${isCompleted ? '<span class="week-checkmark">✓</span>' : ''}
          </a>
        </li>
      `)
    }

    this.weeksNavContainer.innerHTML = weeksHtml.join('')
    this.setupWeekNavigation()
  }

  /**
   * Setup week navigation click handlers
   */
  setupWeekNavigation() {
    const weekLinks = document.querySelectorAll('.week-link')
    
    weekLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault()
        
        const weekNumber = parseInt(link.dataset.week)
        
        if (window.speedTrainingApp) {
          window.speedTrainingApp.currentWeek = weekNumber
          window.speedTrainingApp.showView('week-view')
          window.speedTrainingApp.views.week.showWeek(weekNumber)
        }
      })
    })
  }

  /**
   * Update navigation progress
   */
  updateProgress() {
    this.renderWeeksNavigation()
  }

  /**
   * Highlight current week
   */
  highlightCurrentWeek(weekNumber) {
    const weekLinks = document.querySelectorAll('.week-link')
    
    weekLinks.forEach(link => {
      link.classList.toggle('current', parseInt(link.dataset.week) === weekNumber)
    })
  }
} 