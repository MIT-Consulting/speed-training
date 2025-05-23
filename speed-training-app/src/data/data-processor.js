/**
 * DataProcessor - Handles loading and processing training plan data
 * Provides methods to query and manipulate the training data
 */
export class DataProcessor {
  constructor() {
    this.trainingPlan = null
    this.processedData = null
    this.videoData = null
  }

  /**
   * Load the training plan from JSON file
   */
  async loadTrainingPlan() {
    try {
      const response = await fetch('/src/data/training-plan.json')
      if (!response.ok) {
        throw new Error(`Failed to load training plan: ${response.statusText}`)
      }
      
      this.trainingPlan = await response.json()
      this.processData()
      this.extractVideoData()
      
      console.log('Training plan loaded successfully:', this.trainingPlan)
      return this.trainingPlan
      
    } catch (error) {
      console.error('Error loading training plan:', error)
      throw error
    }
  }

  /**
   * Process raw data into more usable formats
   */
  processData() {
    if (!this.trainingPlan) return

    this.processedData = {
      meta: {
        title: this.trainingPlan.program_title,
        goal: this.trainingPlan.program_goal,
        description: this.trainingPlan.program_description,
        totalWeeks: this.trainingPlan.weeks.length,
        totalDays: this.trainingPlan.weeks.reduce((sum, week) => sum + week.days.length, 0),
        totalExercises: this.getTotalExercises()
      },
      weeks: this.trainingPlan.weeks.map(week => this.processWeek(week)),
      focusAreas: this.getFocusAreas(),
      exercises: this.getAllExercises(),
      videos: this.getAllVideos()
    }
  }

  /**
   * Process individual week data
   */
  processWeek(week) {
    return {
      weekNumber: week.week_number,
      days: week.days.map(day => this.processDay(day, week.week_number)),
      totalExercises: week.days.reduce((sum, day) => sum + this.getDayExerciseCount(day), 0),
      focusDistribution: this.getWeekFocusDistribution(week)
    }
  }

  /**
   * Process individual day data
   */
  processDay(day, weekNumber) {
    return {
      dayNumber: day.day_number,
      weekNumber: weekNumber,
      focus: day.focus,
      focusColor: this.getFocusColor(day.focus),
      notes: day.notes_general_day || '',
      blocks: day.blocks.map(block => this.processBlock(block, weekNumber, day.day_number)),
      totalExercises: this.getDayExerciseCount(day),
      estimatedDuration: this.estimateDayDuration(day),
      videoCount: this.getDayVideoCount(day)
    }
  }

  /**
   * Process individual block data
   */
  processBlock(block, weekNumber, dayNumber) {
    return {
      name: block.block_name,
      exercises: block.exercises.map((exercise, index) => this.processExercise(exercise, block.block_name, weekNumber, dayNumber, index)),
      exerciseCount: block.exercises.length
    }
  }

  /**
   * Process individual exercise data
   */
  processExercise(exercise, blockName, weekNumber, dayNumber, exerciseIndex) {
    return {
      id: `w${weekNumber}-d${dayNumber}-${blockName.replace(/[^a-zA-Z0-9]/g, '')}-${exerciseIndex}`,
      name: exercise.name,
      setsReps: exercise.sets_reps || '',
      notes: exercise.notes || '',
      videoUrl: exercise.video_url || null,
      videoId: this.extractVideoId(exercise.video_url),
      hasVideo: !!exercise.video_url,
      blockName: blockName,
      weekNumber: weekNumber,
      dayNumber: dayNumber,
      exerciseIndex: exerciseIndex,
      estimatedDuration: this.estimateExerciseDuration(exercise),
      equipment: this.extractEquipment(exercise.notes || exercise.name)
    }
  }

  /**
   * Extract YouTube video ID from URL
   */
  extractVideoId(url) {
    if (!url) return null
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  /**
   * Extract video data for easy access
   */
  extractVideoData() {
    if (!this.trainingPlan) return

    this.videoData = {
      allVideos: [],
      videosByFocus: {},
      videosByWeek: {},
      uniqueVideos: new Set()
    }

    this.trainingPlan.weeks.forEach(week => {
      week.days.forEach(day => {
        day.blocks.forEach(block => {
          block.exercises.forEach(exercise => {
            if (exercise.video_url) {
              const videoInfo = {
                url: exercise.video_url,
                videoId: this.extractVideoId(exercise.video_url),
                exerciseName: exercise.name,
                focus: day.focus,
                weekNumber: week.week_number,
                dayNumber: day.day_number,
                blockName: block.block_name
              }

              this.videoData.allVideos.push(videoInfo)

              // Group by focus
              if (!this.videoData.videosByFocus[day.focus]) {
                this.videoData.videosByFocus[day.focus] = []
              }
              this.videoData.videosByFocus[day.focus].push(videoInfo)

              // Group by week
              const weekKey = `week${week.week_number}`
              if (!this.videoData.videosByWeek[weekKey]) {
                this.videoData.videosByWeek[weekKey] = []
              }
              this.videoData.videosByWeek[weekKey].push(videoInfo)

              // Track unique videos
              this.videoData.uniqueVideos.add(exercise.video_url)
            }
          })
        })
      })
    })
  }

  /**
   * Get focus area color
   */
  getFocusColor(focus) {
    const focusColors = {
      'Acceleration': 'var(--acceleration)',
      'Top End Speed': 'var(--speed)',
      'Change of Direction/Lateral Movements/Agility': 'var(--agility)'
    }
    return focusColors[focus] || 'var(--gray-500)'
  }

  /**
   * Get all unique focus areas
   */
  getFocusAreas() {
    if (!this.trainingPlan) return []
    
    const focuses = new Set()
    this.trainingPlan.weeks.forEach(week => {
      week.days.forEach(day => {
        focuses.add(day.focus)
      })
    })
    return Array.from(focuses)
  }

  /**
   * Get all exercises with metadata
   */
  getAllExercises() {
    if (!this.processedData) return []
    
    const exercises = []
    this.processedData.weeks.forEach(week => {
      week.days.forEach(day => {
        day.blocks.forEach(block => {
          exercises.push(...block.exercises)
        })
      })
    })
    return exercises
  }

  /**
   * Get all videos
   */
  getAllVideos() {
    return this.videoData ? this.videoData.allVideos : []
  }

  /**
   * Get week data by week number
   */
  getWeek(weekNumber) {
    if (!this.processedData) return null
    return this.processedData.weeks.find(week => week.weekNumber === weekNumber)
  }

  /**
   * Get day data by week and day number
   */
  getDay(weekNumber, dayNumber) {
    const week = this.getWeek(weekNumber)
    if (!week) return null
    return week.days.find(day => day.dayNumber === dayNumber)
  }

  /**
   * Get exercise by ID
   */
  getExercise(exerciseId) {
    if (!this.processedData) return null
    
    for (const week of this.processedData.weeks) {
      for (const day of week.days) {
        for (const block of day.blocks) {
          const exercise = block.exercises.find(ex => ex.id === exerciseId)
          if (exercise) return exercise
        }
      }
    }
    return null
  }

  /**
   * Search exercises by name or notes
   */
  searchExercises(query) {
    if (!this.processedData || !query) return []
    
    const lowercaseQuery = query.toLowerCase()
    return this.processedData.exercises.filter(exercise => 
      exercise.name.toLowerCase().includes(lowercaseQuery) ||
      exercise.notes.toLowerCase().includes(lowercaseQuery) ||
      exercise.blockName.toLowerCase().includes(lowercaseQuery)
    )
  }

  /**
   * Filter exercises by criteria
   */
  filterExercises(filters) {
    if (!this.processedData) return []
    
    let exercises = this.processedData.exercises
    
    if (filters.focus) {
      exercises = exercises.filter(exercise => {
        const day = this.getDay(exercise.weekNumber, exercise.dayNumber)
        return day && day.focus === filters.focus
      })
    }
    
    if (filters.hasVideo !== undefined) {
      exercises = exercises.filter(exercise => exercise.hasVideo === filters.hasVideo)
    }
    
    if (filters.week) {
      exercises = exercises.filter(exercise => exercise.weekNumber === filters.week)
    }
    
    if (filters.equipment) {
      exercises = exercises.filter(exercise => 
        exercise.equipment.includes(filters.equipment)
      )
    }
    
    return exercises
  }

  /**
   * Get program statistics
   */
  getProgramStats() {
    if (!this.processedData) return null
    
    return {
      totalWeeks: this.processedData.meta.totalWeeks,
      totalDays: this.processedData.meta.totalDays,
      totalExercises: this.processedData.meta.totalExercises,
      totalVideos: this.videoData ? this.videoData.uniqueVideos.size : 0,
      focusAreas: this.processedData.focusAreas.length,
      estimatedDuration: this.getEstimatedProgramDuration(),
      exercisesByFocus: this.getExercisesByFocus()
    }
  }

  /**
   * Get total number of exercises
   */
  getTotalExercises() {
    if (!this.trainingPlan) return 0
    
    let total = 0
    this.trainingPlan.weeks.forEach(week => {
      week.days.forEach(day => {
        day.blocks.forEach(block => {
          total += block.exercises.length
        })
      })
    })
    return total
  }

  /**
   * Get total number of weeks
   */
  getTotalWeeks() {
    return this.trainingPlan ? this.trainingPlan.weeks.length : 0
  }

  /**
   * Get exercise count for a day
   */
  getDayExerciseCount(day) {
    return day.blocks.reduce((sum, block) => sum + block.exercises.length, 0)
  }

  /**
   * Get video count for a day
   */
  getDayVideoCount(day) {
    let count = 0
    day.blocks.forEach(block => {
      block.exercises.forEach(exercise => {
        if (exercise.video_url) count++
      })
    })
    return count
  }

  /**
   * Get focus distribution for a week
   */
  getWeekFocusDistribution(week) {
    const distribution = {}
    week.days.forEach(day => {
      distribution[day.focus] = (distribution[day.focus] || 0) + 1
    })
    return distribution
  }

  /**
   * Estimate exercise duration (in minutes)
   */
  estimateExerciseDuration(exercise) {
    // Basic estimation based on sets/reps
    const setsReps = exercise.sets_reps || ''
    if (setsReps.includes('3x')) return 3
    if (setsReps.includes('2x')) return 2
    if (setsReps.includes('x4')) return 4
    if (setsReps.includes('x5')) return 5
    return 2 // Default estimate
  }

  /**
   * Estimate day duration (in minutes)
   */
  estimateDayDuration(day) {
    let duration = 0
    day.blocks.forEach(block => {
      block.exercises.forEach(exercise => {
        duration += this.estimateExerciseDuration(exercise)
      })
    })
    return Math.max(30, duration) // Minimum 30 minutes per day
  }

  /**
   * Get estimated program duration
   */
  getEstimatedProgramDuration() {
    if (!this.processedData) return 0
    
    let totalMinutes = 0
    this.processedData.weeks.forEach(week => {
      week.days.forEach(day => {
        totalMinutes += day.estimatedDuration
      })
    })
    return Math.round(totalMinutes / 60 * 10) / 10 // Convert to hours with 1 decimal
  }

  /**
   * Get exercises grouped by focus area
   */
  getExercisesByFocus() {
    if (!this.processedData) return {}
    
    const byFocus = {}
    this.processedData.exercises.forEach(exercise => {
      const day = this.getDay(exercise.weekNumber, exercise.dayNumber)
      if (day) {
        if (!byFocus[day.focus]) byFocus[day.focus] = 0
        byFocus[day.focus]++
      }
    })
    return byFocus
  }

  /**
   * Extract equipment from exercise name or notes
   */
  extractEquipment(text) {
    const equipment = []
    const lowercaseText = text.toLowerCase()
    
    if (lowercaseText.includes('hurdle')) equipment.push('hurdles')
    if (lowercaseText.includes('cone')) equipment.push('cones')
    if (lowercaseText.includes('wall')) equipment.push('wall')
    if (lowercaseText.includes('timer')) equipment.push('timer')
    if (lowercaseText.includes('partner')) equipment.push('partner')
    
    return equipment
  }

  /**
   * Get videos by focus area
   */
  getVideosByFocus(focus) {
    return this.videoData ? (this.videoData.videosByFocus[focus] || []) : []
  }

  /**
   * Get videos by week
   */
  getVideosByWeek(weekNumber) {
    const weekKey = `week${weekNumber}`
    return this.videoData ? (this.videoData.videosByWeek[weekKey] || []) : []
  }

  /**
   * Validate video URL
   */
  isValidVideoUrl(url) {
    if (!url) return false
    return /^https:\/\/(www\.)?(youtube\.com|youtu\.be)/.test(url)
  }

  /**
   * Get YouTube embed URL
   */
  getEmbedUrl(videoUrl, options = {}) {
    const videoId = this.extractVideoId(videoUrl)
    if (!videoId) return null
    
    const params = new URLSearchParams({
      enablejsapi: '1',
      origin: window.location.origin,
      rel: '0',
      modestbranding: '1',
      ...options
    })
    
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
  }
} 