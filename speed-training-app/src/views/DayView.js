/**
 * DayView - Detailed workout view with exercise blocks and video integration
 */
export class DayView {
  constructor(dataProcessor, progressTracker) {
    this.dataProcessor = dataProcessor
    this.progressTracker = progressTracker
    this.container = document.getElementById('day-view')
    this.currentWeek = 1
    this.currentDay = 1
  }

  /**
   * Render the day view
   */
  render() {
    if (!this.container) return
    this.showDay(this.currentWeek, this.currentDay)
  }

  /**
   * Show a specific day
   */
  showDay(weekNumber, dayNumber) {
    this.currentWeek = weekNumber
    this.currentDay = dayNumber
    
    const day = this.dataProcessor.getDay(weekNumber, dayNumber)
    if (!day) return

    // Mark day as started when user views it
    this.progressTracker.startDay(weekNumber, dayNumber)

    this.updateDayTitle(day)
    this.renderDayContent(day)
  }

  /**
   * Update day title and description
   */
  updateDayTitle(day) {
    const dayTitle = document.getElementById('day-title')
    const dayDescription = document.getElementById('day-description')

    if (dayTitle) {
      dayTitle.textContent = `Day ${day.dayNumber} - ${day.focus}`
    }

    if (dayDescription) {
      const focusDescriptions = {
        'Acceleration': 'Focus on explosive starts and acceleration mechanics',
        'Top End Speed': 'Develop maximum velocity and speed maintenance',
        'Change of Direction/Lateral Movements/Agility': 'Improve agility, change of direction, and lateral movement skills'
      }
      dayDescription.textContent = focusDescriptions[day.focus] || 'Complete the workout blocks in order'
    }
  }

  /**
   * Render day content with exercise blocks
   */
  renderDayContent(day) {
    const dayContent = document.getElementById('day-content')
    if (!dayContent) return

    const dayProgress = this.progressTracker.getDayProgress(this.currentWeek, this.currentDay)
    
    const dayHtml = `
      <div class="day-overview">
        <div class="day-stats">
          <div class="day-stat">
            <span class="stat-label">Progress:</span>
            <span class="stat-value">${dayProgress}%</span>
          </div>
          <div class="day-stat">
            <span class="stat-label">Exercises:</span>
            <span class="stat-value">${day.totalExercises}</span>
          </div>
          <div class="day-stat">
            <span class="stat-label">Videos:</span>
            <span class="stat-value">${day.videoCount}</span>
          </div>
          <div class="day-stat">
            <span class="stat-label">Duration:</span>
            <span class="stat-value">~${day.estimatedDuration} min</span>
          </div>
        </div>
        
        <div class="day-progress-container">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${dayProgress}%"></div>
          </div>
          <span class="progress-text">${dayProgress}% Complete</span>
        </div>
      </div>

      <div class="workout-blocks">
        ${day.blocks.map((block, blockIndex) => {
          const blockProgress = this.getBlockProgress(day, block)
          const isBlockComplete = blockProgress === 100
          
          return `
            <div class="workout-block ${isBlockComplete ? 'completed' : ''}">
              <div class="block-header">
                <h3 class="block-title">${block.name}</h3>
                <div class="block-progress">
                  <span>${blockProgress}%</span>
                  ${isBlockComplete ? '<span class="block-checkmark">✓</span>' : ''}
                </div>
              </div>
              
              <div class="block-exercises">
                ${block.exercises.map((exercise, exerciseIndex) => {
                  const isComplete = this.progressTracker.isExerciseComplete(exercise.id)
                  const isWatched = exercise.hasVideo && this.progressTracker.isVideoWatched(exercise.videoUrl)
                  
                  return `
                    <div class="exercise-card ${isComplete ? 'completed' : ''}" data-exercise-id="${exercise.id}">
                      <div class="exercise-header">
                        <h4 class="exercise-name">${exercise.name}</h4>
                        <div class="exercise-controls">
                          ${exercise.hasVideo ? `
                            <button class="video-toggle-btn ${isWatched ? 'watched' : ''}" 
                                    title="${isWatched ? 'Watched' : 'Watch video'}"
                                    data-video-url="${exercise.videoUrl}">
                              🎥 ${isWatched ? '✓' : ''}
                            </button>
                          ` : ''}
                          <button class="exercise-complete-btn ${isComplete ? 'completed' : ''}" 
                                  data-exercise-id="${exercise.id}"
                                  title="${isComplete ? 'Mark incomplete' : 'Mark complete'}">
                            ${isComplete ? '✓' : '○'}
                          </button>
                        </div>
                      </div>
                      
                      <div class="exercise-content">
                        <div class="exercise-tabs">
                          <button class="tab-btn active" data-tab="info">Info</button>
                          ${exercise.hasVideo ? '<button class="tab-btn" data-tab="video">📹 Video</button>' : ''}
                          <button class="tab-btn" data-tab="notes">Notes</button>
                        </div>
                        
                        <div class="exercise-tab-content">
                          <div class="tab-panel active" data-tab="info">
                            <div class="exercise-details">
                              ${exercise.setsReps ? `<div class="sets-reps">${exercise.setsReps}</div>` : ''}
                              ${exercise.notes ? `<div class="exercise-notes">${exercise.notes}</div>` : ''}
                            </div>
                          </div>
                          
                          ${exercise.hasVideo ? `
                            <div class="tab-panel" data-tab="video">
                              <div class="video-container" data-video-id="${exercise.videoId}">
                                <div class="video-placeholder">
                                  <button class="video-load-btn" data-video-url="${exercise.videoUrl}">
                                    <span class="video-icon">▶️</span>
                                    <span>Load Video</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ` : ''}
                          
                          <div class="tab-panel" data-tab="notes">
                            <textarea class="personal-notes" 
                                      placeholder="Add your personal notes for this exercise..."
                                      data-exercise-id="${exercise.id}">${this.getPersonalNotes(exercise.id)}</textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  `
                }).join('')}
              </div>
            </div>
          `
        }).join('')}
      </div>
    `

    dayContent.innerHTML = dayHtml
    this.setupDayInteractions()
  }

  /**
   * Get block completion progress
   */
  getBlockProgress(day, block) {
    const totalExercises = block.exercises.length
    let completedExercises = 0

    block.exercises.forEach(exercise => {
      if (this.progressTracker.isExerciseComplete(exercise.id)) {
        completedExercises++
      }
    })

    return totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0
  }

  /**
   * Setup day interactions
   */
  setupDayInteractions() {
    this.setupExerciseCompletion()
    this.setupVideoInteractions()
    this.setupTabSwitching()
    this.setupNotesHandling()
  }

  /**
   * Setup exercise completion toggles
   */
  setupExerciseCompletion() {
    const completeBtns = document.querySelectorAll('.exercise-complete-btn')
    
    completeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        
        const exerciseId = btn.dataset.exerciseId
        const isComplete = this.progressTracker.isExerciseComplete(exerciseId)
        
        if (isComplete) {
          this.progressTracker.markExerciseIncomplete(exerciseId)
          btn.textContent = '○'
          btn.classList.remove('completed')
          btn.title = 'Mark complete'
        } else {
          this.progressTracker.markExerciseComplete(exerciseId)
          btn.textContent = '✓'
          btn.classList.add('completed')
          btn.title = 'Mark incomplete'
        }
        
        // Update exercise card appearance
        const exerciseCard = btn.closest('.exercise-card')
        exerciseCard.classList.toggle('completed', !isComplete)
        
        // Update block and day progress
        this.updateProgressDisplay()
      })
    })
  }

  /**
   * Setup video interactions
   */
  setupVideoInteractions() {
    const videoLoadBtns = document.querySelectorAll('.video-load-btn')
    const videoToggleBtns = document.querySelectorAll('.video-toggle-btn')
    
    videoLoadBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        const videoUrl = btn.dataset.videoUrl
        this.loadVideo(btn.parentElement, videoUrl)
      })
    })

    videoToggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        const exerciseCard = btn.closest('.exercise-card')
        const videoTab = exerciseCard.querySelector('[data-tab="video"]')
        
        // Switch to video tab
        if (videoTab) {
          this.switchTab(exerciseCard, 'video')
        }
      })
    })
  }

  /**
   * Load video in container
   */
  loadVideo(container, videoUrl) {
    const embedUrl = this.dataProcessor.getEmbedUrl(videoUrl)
    if (!embedUrl) return

    container.innerHTML = `
      <iframe 
        src="${embedUrl}"
        frameborder="0"
        allowfullscreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        loading="lazy">
      </iframe>
    `

    // Track video watch
    this.progressTracker.trackVideoWatch(videoUrl)
    
    // Update video toggle button
    const exerciseCard = container.closest('.exercise-card')
    const videoToggleBtn = exerciseCard.querySelector('.video-toggle-btn')
    if (videoToggleBtn) {
      videoToggleBtn.classList.add('watched')
      videoToggleBtn.innerHTML = '🎥 ✓'
      videoToggleBtn.title = 'Watched'
    }
  }

  /**
   * Setup tab switching
   */
  setupTabSwitching() {
    const tabBtns = document.querySelectorAll('.tab-btn')
    
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        
        const exerciseCard = btn.closest('.exercise-card')
        const tabName = btn.dataset.tab
        
        this.switchTab(exerciseCard, tabName)
      })
    })
  }

  /**
   * Switch exercise card tab
   */
  switchTab(exerciseCard, tabName) {
    // Update tab buttons
    const tabBtns = exerciseCard.querySelectorAll('.tab-btn')
    tabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName)
    })

    // Update tab panels
    const tabPanels = exerciseCard.querySelectorAll('.tab-panel')
    tabPanels.forEach(panel => {
      panel.classList.toggle('active', panel.dataset.tab === tabName)
    })
  }

  /**
   * Setup notes handling
   */
  setupNotesHandling() {
    const notesTextareas = document.querySelectorAll('.personal-notes')
    
    notesTextareas.forEach(textarea => {
      textarea.addEventListener('blur', () => {
        const exerciseId = textarea.dataset.exerciseId
        const notes = textarea.value
        this.savePersonalNotes(exerciseId, notes)
      })
    })
  }

  /**
   * Get personal notes for exercise
   */
  getPersonalNotes(exerciseId) {
    try {
      const notes = localStorage.getItem(`exercise-notes-${exerciseId}`)
      return notes || ''
    } catch (error) {
      return ''
    }
  }

  /**
   * Save personal notes for exercise
   */
  savePersonalNotes(exerciseId, notes) {
    try {
      localStorage.setItem(`exercise-notes-${exerciseId}`, notes)
    } catch (error) {
      console.error('Error saving notes:', error)
    }
  }

  /**
   * Update progress display
   */
  updateProgressDisplay() {
    // Re-render to update all progress indicators
    const day = this.dataProcessor.getDay(this.currentWeek, this.currentDay)
    if (day) {
      this.renderDayContent(day)
    }
  }

  /**
   * Apply filters
   */
  applyFilters(filters) {
    // Could filter exercises by completion, video availability, etc.
    console.log('Day view filters applied:', filters)
  }
} 