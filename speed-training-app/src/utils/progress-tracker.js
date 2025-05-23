/**
 * ProgressTracker - Manages user progress through the training program
 * Handles completion tracking, statistics, and local storage
 */
export class ProgressTracker {
  constructor(dataProcessor) {
    this.dataProcessor = dataProcessor
    this.storageKey = 'speed-training-progress'
    this.videoStorageKey = 'speed-training-video-analytics'
    this.progress = this.loadProgress()
    this.videoAnalytics = this.loadVideoAnalytics()
  }

  /**
   * Load progress from local storage
   */
  loadProgress() {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error loading progress:', error)
    }

    // Return default progress structure
    return {
      weeks: {},
      exercises: {},
      startDate: null,
      lastActive: null,
      totalSessions: 0,
      currentStreak: 0,
      longestStreak: 0,
      preferences: {
        preferredDays: ['monday', 'wednesday', 'friday'],
        restDayReminders: true,
        completionNotifications: true
      }
    }
  }

  /**
   * Load video analytics from local storage
   */
  loadVideoAnalytics() {
    try {
      const stored = localStorage.getItem(this.videoStorageKey)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error loading video analytics:', error)
    }

    return {
      watchHistory: {},
      favorites: [],
      watchTime: {},
      playbackPreferences: {
        defaultSpeed: 1,
        defaultQuality: 'auto',
        autoplay: false
      }
    }
  }

  /**
   * Save progress to local storage
   */
  saveProgress() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.progress))
    } catch (error) {
      console.error('Error saving progress:', error)
    }
  }

  /**
   * Save video analytics to local storage
   */
  saveVideoAnalytics() {
    try {
      localStorage.setItem(this.videoStorageKey, JSON.stringify(this.videoAnalytics))
    } catch (error) {
      console.error('Error saving video analytics:', error)
    }
  }

  /**
   * Mark an exercise as complete
   */
  markExerciseComplete(exerciseId) {
    const exercise = this.dataProcessor.getExercise(exerciseId)
    if (!exercise) return false

    // Update exercise completion
    this.progress.exercises[exerciseId] = {
      completed: true,
      completedAt: new Date().toISOString(),
      attempts: (this.progress.exercises[exerciseId]?.attempts || 0) + 1
    }

    // Update week/day progress
    const weekKey = `week${exercise.weekNumber}`
    const dayKey = `day${exercise.dayNumber}`

    if (!this.progress.weeks[weekKey]) {
      this.progress.weeks[weekKey] = { days: {} }
    }

    if (!this.progress.weeks[weekKey].days[dayKey]) {
      this.progress.weeks[weekKey].days[dayKey] = {
        started: false,
        completed: false,
        startedAt: null,
        completedAt: null,
        exercises: {}
      }
    }

    this.progress.weeks[weekKey].days[dayKey].exercises[exerciseId] = true

    // Check if day is complete
    this.updateDayCompletion(exercise.weekNumber, exercise.dayNumber)

    // Update general stats
    this.updateGeneralStats()

    this.saveProgress()
    return true
  }

  /**
   * Mark an exercise as incomplete
   */
  markExerciseIncomplete(exerciseId) {
    const exercise = this.dataProcessor.getExercise(exerciseId)
    if (!exercise) return false

    // Remove exercise completion
    if (this.progress.exercises[exerciseId]) {
      this.progress.exercises[exerciseId].completed = false
    }

    // Update week/day progress
    const weekKey = `week${exercise.weekNumber}`
    const dayKey = `day${exercise.dayNumber}`

    if (this.progress.weeks[weekKey]?.days[dayKey]?.exercises) {
      delete this.progress.weeks[weekKey].days[dayKey].exercises[exerciseId]
    }

    // Update day completion status
    this.updateDayCompletion(exercise.weekNumber, exercise.dayNumber)

    this.saveProgress()
    return true
  }

  /**
   * Start a workout day
   */
  startDay(weekNumber, dayNumber) {
    const weekKey = `week${weekNumber}`
    const dayKey = `day${dayNumber}`

    if (!this.progress.weeks[weekKey]) {
      this.progress.weeks[weekKey] = { days: {} }
    }

    if (!this.progress.weeks[weekKey].days[dayKey]) {
      this.progress.weeks[weekKey].days[dayKey] = {
        started: false,
        completed: false,
        startedAt: null,
        completedAt: null,
        exercises: {}
      }
    }

    if (!this.progress.weeks[weekKey].days[dayKey].started) {
      this.progress.weeks[weekKey].days[dayKey].started = true
      this.progress.weeks[weekKey].days[dayKey].startedAt = new Date().toISOString()
      
      // Initialize start date if first workout
      if (!this.progress.startDate) {
        this.progress.startDate = new Date().toISOString()
      }
    }

    this.progress.lastActive = new Date().toISOString()
    this.saveProgress()
  }

  /**
   * Update day completion status
   */
  updateDayCompletion(weekNumber, dayNumber) {
    const day = this.dataProcessor.getDay(weekNumber, dayNumber)
    if (!day) return

    const weekKey = `week${weekNumber}`
    const dayKey = `day${dayNumber}`

    if (!this.progress.weeks[weekKey]?.days[dayKey]) return

    // Count completed exercises for this day
    const dayExercises = []
    day.blocks.forEach(block => {
      block.exercises.forEach(exercise => {
        dayExercises.push(exercise.id)
      })
    })

    const completedExercises = dayExercises.filter(exerciseId => 
      this.progress.weeks[weekKey].days[dayKey].exercises[exerciseId]
    )

    const isComplete = completedExercises.length === dayExercises.length && dayExercises.length > 0

    if (isComplete && !this.progress.weeks[weekKey].days[dayKey].completed) {
      this.progress.weeks[weekKey].days[dayKey].completed = true
      this.progress.weeks[weekKey].days[dayKey].completedAt = new Date().toISOString()
      this.progress.totalSessions++
    } else if (!isComplete && this.progress.weeks[weekKey].days[dayKey].completed) {
      this.progress.weeks[weekKey].days[dayKey].completed = false
      this.progress.weeks[weekKey].days[dayKey].completedAt = null
      this.progress.totalSessions = Math.max(0, this.progress.totalSessions - 1)
    }
  }

  /**
   * Update general statistics
   */
  updateGeneralStats() {
    this.updateStreak()
  }

  /**
   * Update current streak
   */
  updateStreak() {
    const completedDays = this.getCompletedDays()
    
    if (completedDays.length === 0) {
      this.progress.currentStreak = 0
      return
    }

    // Sort by completion date
    completedDays.sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt))

    let currentStreak = 1
    const today = new Date()
    const lastCompleted = new Date(completedDays[completedDays.length - 1].completedAt)

    // Check if streak is current (within last 2 days to account for rest days)
    const daysDiff = Math.floor((today - lastCompleted) / (1000 * 60 * 60 * 24))
    if (daysDiff > 2) {
      this.progress.currentStreak = 0
      return
    }

    // Count consecutive days
    for (let i = completedDays.length - 2; i >= 0; i--) {
      const current = new Date(completedDays[i + 1].completedAt)
      const previous = new Date(completedDays[i].completedAt)
      const diff = Math.floor((current - previous) / (1000 * 60 * 60 * 24))

      if (diff <= 2) { // Allow for rest days
        currentStreak++
      } else {
        break
      }
    }

    this.progress.currentStreak = currentStreak
    this.progress.longestStreak = Math.max(this.progress.longestStreak, currentStreak)
  }

  /**
   * Get completed days
   */
  getCompletedDays() {
    const completed = []
    
    Object.keys(this.progress.weeks).forEach(weekKey => {
      const weekNumber = parseInt(weekKey.replace('week', ''))
      Object.keys(this.progress.weeks[weekKey].days).forEach(dayKey => {
        const dayNumber = parseInt(dayKey.replace('day', ''))
        const dayProgress = this.progress.weeks[weekKey].days[dayKey]
        
        if (dayProgress.completed) {
          completed.push({
            weekNumber,
            dayNumber,
            completedAt: dayProgress.completedAt
          })
        }
      })
    })

    return completed
  }

  /**
   * Get overall progress percentage
   */
  getOverallProgress() {
    const stats = this.dataProcessor.getProgramStats()
    if (!stats) return 0

    const totalDays = stats.totalDays
    const completedDays = this.getCompletedDays().length

    return Math.round((completedDays / totalDays) * 100)
  }

  /**
   * Get week progress percentage
   */
  getWeekProgress(weekNumber) {
    const week = this.dataProcessor.getWeek(weekNumber)
    if (!week) return 0

    const totalDays = week.days.length
    let completedDays = 0

    week.days.forEach(day => {
      if (this.isDayComplete(weekNumber, day.dayNumber)) {
        completedDays++
      }
    })

    return Math.round((completedDays / totalDays) * 100)
  }

  /**
   * Get day progress percentage
   */
  getDayProgress(weekNumber, dayNumber) {
    const day = this.dataProcessor.getDay(weekNumber, dayNumber)
    if (!day) return 0

    const totalExercises = day.totalExercises
    let completedExercises = 0

    day.blocks.forEach(block => {
      block.exercises.forEach(exercise => {
        if (this.isExerciseComplete(exercise.id)) {
          completedExercises++
        }
      })
    })

    return Math.round((completedExercises / totalExercises) * 100)
  }

  /**
   * Check if exercise is complete
   */
  isExerciseComplete(exerciseId) {
    return this.progress.exercises[exerciseId]?.completed || false
  }

  /**
   * Check if day is complete
   */
  isDayComplete(weekNumber, dayNumber) {
    const weekKey = `week${weekNumber}`
    const dayKey = `day${dayNumber}`
    return this.progress.weeks[weekKey]?.days[dayKey]?.completed || false
  }

  /**
   * Check if day is started
   */
  isDayStarted(weekNumber, dayNumber) {
    const weekKey = `week${weekNumber}`
    const dayKey = `day${dayNumber}`
    return this.progress.weeks[weekKey]?.days[dayKey]?.started || false
  }

  /**
   * Get current day (next incomplete day)
   */
  getCurrentDay() {
    const stats = this.dataProcessor.getProgramStats()
    if (!stats) return { week: 1, day: 1 }

    // Find first incomplete day
    for (let week = 1; week <= stats.totalWeeks; week++) {
      const weekData = this.dataProcessor.getWeek(week)
      if (!weekData) continue

      for (const day of weekData.days) {
        if (!this.isDayComplete(week, day.dayNumber)) {
          return { week, day: day.dayNumber }
        }
      }
    }

    // All days complete, return last day
    const lastWeek = this.dataProcessor.getWeek(stats.totalWeeks)
    return { 
      week: stats.totalWeeks, 
      day: lastWeek ? lastWeek.days[lastWeek.days.length - 1].dayNumber : 1 
    }
  }

  /**
   * Get next workout
   */
  getNextWorkout() {
    return this.getCurrentDay()
  }

  /**
   * Track video watch
   */
  trackVideoWatch(videoUrl, duration = 0) {
    if (!this.videoAnalytics.watchHistory[videoUrl]) {
      this.videoAnalytics.watchHistory[videoUrl] = {
        watchCount: 0,
        totalWatchTime: 0,
        firstWatched: new Date().toISOString(),
        lastWatched: null
      }
    }

    this.videoAnalytics.watchHistory[videoUrl].watchCount++
    this.videoAnalytics.watchHistory[videoUrl].totalWatchTime += duration
    this.videoAnalytics.watchHistory[videoUrl].lastWatched = new Date().toISOString()

    this.saveVideoAnalytics()
  }

  /**
   * Check if video has been watched
   */
  isVideoWatched(videoUrl) {
    return this.videoAnalytics.watchHistory[videoUrl]?.watchCount > 0 || false
  }

  /**
   * Add video to favorites
   */
  addVideoToFavorites(videoUrl) {
    if (!this.videoAnalytics.favorites.includes(videoUrl)) {
      this.videoAnalytics.favorites.push(videoUrl)
      this.saveVideoAnalytics()
    }
  }

  /**
   * Remove video from favorites
   */
  removeVideoFromFavorites(videoUrl) {
    const index = this.videoAnalytics.favorites.indexOf(videoUrl)
    if (index > -1) {
      this.videoAnalytics.favorites.splice(index, 1)
      this.saveVideoAnalytics()
    }
  }

  /**
   * Check if video is favorited
   */
  isVideoFavorited(videoUrl) {
    return this.videoAnalytics.favorites.includes(videoUrl)
  }

  /**
   * Get video engagement analytics
   */
  getVideoEngagement() {
    const totalVideos = this.dataProcessor.getAllVideos().length
    const watchedVideos = Object.keys(this.videoAnalytics.watchHistory).length
    
    return {
      totalVideos,
      watchedVideos,
      watchedPercentage: totalVideos ? Math.round((watchedVideos / totalVideos) * 100) : 0,
      totalWatchTime: Object.values(this.videoAnalytics.watchHistory)
        .reduce((sum, video) => sum + video.totalWatchTime, 0),
      favoriteCount: this.videoAnalytics.favorites.length,
      mostWatchedVideos: this.getMostWatchedVideos(5)
    }
  }

  /**
   * Get most watched videos
   */
  getMostWatchedVideos(limit = 5) {
    return Object.entries(this.videoAnalytics.watchHistory)
      .sort(([,a], [,b]) => b.watchCount - a.watchCount)
      .slice(0, limit)
      .map(([url, data]) => ({ url, ...data }))
  }

  /**
   * Get progress summary
   */
  getProgressSummary() {
    const overallProgress = this.getOverallProgress()
    const completedDays = this.getCompletedDays()
    const videoEngagement = this.getVideoEngagement()
    
    return {
      overallProgress,
      completedDays: completedDays.length,
      totalSessions: this.progress.totalSessions,
      currentStreak: this.progress.currentStreak,
      longestStreak: this.progress.longestStreak,
      startDate: this.progress.startDate,
      lastActive: this.progress.lastActive,
      videoEngagement,
      weeklyProgress: this.getWeeklyProgressSummary()
    }
  }

  /**
   * Get weekly progress summary
   */
  getWeeklyProgressSummary() {
    const stats = this.dataProcessor.getProgramStats()
    if (!stats) return []

    const weekly = []
    for (let week = 1; week <= stats.totalWeeks; week++) {
      weekly.push({
        week,
        progress: this.getWeekProgress(week),
        started: this.isWeekStarted(week),
        completed: this.isWeekComplete(week)
      })
    }

    return weekly
  }

  /**
   * Check if week is started
   */
  isWeekStarted(weekNumber) {
    const week = this.dataProcessor.getWeek(weekNumber)
    if (!week) return false

    return week.days.some(day => this.isDayStarted(weekNumber, day.dayNumber))
  }

  /**
   * Check if week is complete
   */
  isWeekComplete(weekNumber) {
    const week = this.dataProcessor.getWeek(weekNumber)
    if (!week) return false

    return week.days.every(day => this.isDayComplete(weekNumber, day.dayNumber))
  }

  /**
   * Export progress data
   */
  exportProgress() {
    return {
      progress: this.progress,
      videoAnalytics: this.videoAnalytics,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }
  }

  /**
   * Import progress data
   */
  importProgress(data) {
    try {
      if (data.progress) {
        this.progress = { ...this.progress, ...data.progress }
        this.saveProgress()
      }
      
      if (data.videoAnalytics) {
        this.videoAnalytics = { ...this.videoAnalytics, ...data.videoAnalytics }
        this.saveVideoAnalytics()
      }
      
      return true
    } catch (error) {
      console.error('Error importing progress:', error)
      return false
    }
  }

  /**
   * Reset all progress
   */
  resetProgress() {
    this.progress = {
      weeks: {},
      exercises: {},
      startDate: null,
      lastActive: null,
      totalSessions: 0,
      currentStreak: 0,
      longestStreak: 0,
      preferences: this.progress.preferences || {
        preferredDays: ['monday', 'wednesday', 'friday'],
        restDayReminders: true,
        completionNotifications: true
      }
    }

    this.saveProgress()
  }

  /**
   * Reset video analytics
   */
  resetVideoAnalytics() {
    this.videoAnalytics = {
      watchHistory: {},
      favorites: [],
      watchTime: {},
      playbackPreferences: this.videoAnalytics.playbackPreferences || {
        defaultSpeed: 1,
        defaultQuality: 'auto',
        autoplay: false
      }
    }

    this.saveVideoAnalytics()
  }
} 