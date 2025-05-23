/**
 * DataProcessor - Handles loading and processing training plan data
 * Provides methods to query and manipulate the training data with enhanced summary processing
 */
export class DataProcessor {
  constructor() {
    this.trainingPlan = null
    this.processedData = null
    this.videoData = null
    this.searchIndex = {}
    this.summaryIndex = {}
    this.keywordIndex = {}
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
      this.buildSearchIndices()
      
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
   * Process individual exercise data with enhanced summary analysis
   */
  processExercise(exercise, blockName, weekNumber, dayNumber, exerciseIndex) {
    const summary = exercise.exercise_summary || '';
    
    return {
      id: `w${weekNumber}-d${dayNumber}-${blockName.replace(/[^a-zA-Z0-9]/g, '')}-${exerciseIndex}`,
      name: exercise.name,
      setsReps: exercise.sets_reps || '',
      notes: exercise.notes || '',
      summary: summary,
      summaryPreview: this.getSummaryPreview(summary),
      videoUrl: exercise.video_url || null,
      videoId: this.extractVideoId(exercise.video_url),
      hasVideo: !!exercise.video_url,
      blockName: blockName,
      weekNumber: weekNumber,
      dayNumber: dayNumber,
      exerciseIndex: exerciseIndex,
      estimatedDuration: this.estimateExerciseDuration(exercise),
      equipment: this.extractEquipment(exercise.notes || exercise.name),
      // Enhanced summary-based properties
      focusArea: this.determineFocusAreaFromSummary(summary),
      complexity: this.determineComplexityFromSummary(summary),
      movementTags: this.generateMovementTags(summary),
      keywords: this.extractKeywordsFromSummary(summary),
      readingTime: this.estimateReadingTime(summary)
    }
  }

  /**
   * Build search indices for enhanced search functionality
   */
  buildSearchIndices() {
    if (!this.processedData) return;

    this.searchIndex = {};
    this.summaryIndex = {};
    this.keywordIndex = {};

    this.processedData.exercises.forEach(exercise => {
      this.indexExercise(exercise);
    });
  }

  /**
   * Index exercise for search
   */
  indexExercise(exercise) {
    // Index exercise name, summary, and notes for search
    const searchText = [
      exercise.name,
      exercise.summary,
      exercise.notes
    ].filter(text => text).join(' ').toLowerCase();

    // Create keyword index
    const keywords = this.extractKeywords(searchText);
    keywords.forEach(keyword => {
      if (!this.keywordIndex[keyword]) {
        this.keywordIndex[keyword] = [];
      }
      this.keywordIndex[keyword].push(exercise);
    });

    // Index summary content separately for semantic search
    if (exercise.summary) {
      const summaryWords = exercise.summary.toLowerCase().split(/\W+/);
      summaryWords.forEach(word => {
        if (word.length > 2) {
          if (!this.summaryIndex[word]) {
            this.summaryIndex[word] = [];
          }
          this.summaryIndex[word].push(exercise);
        }
      });
    }
  }

  /**
   * Get summary preview (first 100 characters)
   */
  getSummaryPreview(summary) {
    if (!summary) return '';
    return summary.length > 100 ? summary.substring(0, 100) + '...' : summary;
  }

  /**
   * Determine focus area from exercise summary
   */
  determineFocusAreaFromSummary(summary) {
    if (!summary) return 'General';
    
    const summaryLower = summary.toLowerCase();
    if (summaryLower.includes('acceleration') || summaryLower.includes('explosive') || summaryLower.includes('starting')) {
      return 'Acceleration';
    }
    if (summaryLower.includes('speed') || summaryLower.includes('top speed') || summaryLower.includes('sprint')) {
      return 'Speed';
    }
    if (summaryLower.includes('lateral') || summaryLower.includes('agility') || summaryLower.includes('direction') || summaryLower.includes('cutting')) {
      return 'Agility';
    }
    return 'General';
  }

  /**
   * Determine complexity from exercise summary
   */
  determineComplexityFromSummary(summary) {
    if (!summary) return 1;
    
    const summaryLower = summary.toLowerCase();
    let complexity = 1;
    
    // Advanced indicators
    if (summaryLower.includes('advanced') || summaryLower.includes('complex') || summaryLower.includes('coordination')) {
      complexity = 4;
    }
    // Intermediate indicators
    else if (summaryLower.includes('multiple') || summaryLower.includes('combines') || summaryLower.includes('sequence')) {
      complexity = 3;
    }
    // Beginner indicators
    else if (summaryLower.includes('basic') || summaryLower.includes('simple') || summaryLower.includes('fundamental')) {
      complexity = 1;
    }
    // Default intermediate
    else {
      complexity = 2;
    }
    
    return complexity;
  }

  /**
   * Generate movement tags from exercise summary
   */
  generateMovementTags(summary) {
    if (!summary) return ['General Movement'];
    
    const summaryLower = summary.toLowerCase();
    const tags = [];
    
    if (summaryLower.includes('jump') || summaryLower.includes('hop') || summaryLower.includes('bound')) {
      tags.push('Plyometric');
    }
    if (summaryLower.includes('lateral') || summaryLower.includes('sideways') || summaryLower.includes('side')) {
      tags.push('Lateral');
    }
    if (summaryLower.includes('sprint') || summaryLower.includes('run') || summaryLower.includes('dash')) {
      tags.push('Sprint');
    }
    if (summaryLower.includes('balance') || summaryLower.includes('stability') || summaryLower.includes('stable')) {
      tags.push('Balance');
    }
    if (summaryLower.includes('coordination') || summaryLower.includes('rhythm') || summaryLower.includes('timing')) {
      tags.push('Coordination');
    }
    if (summaryLower.includes('power') || summaryLower.includes('explosive') || summaryLower.includes('force')) {
      tags.push('Power');
    }
    if (summaryLower.includes('hip') || summaryLower.includes('core') || summaryLower.includes('trunk')) {
      tags.push('Core');
    }
    if (summaryLower.includes('reactive') || summaryLower.includes('quick') || summaryLower.includes('rapid')) {
      tags.push('Reactive');
    }
    
    return tags.length > 0 ? tags : ['General Movement'];
  }

  /**
   * Extract keywords from exercise summary
   */
  extractKeywordsFromSummary(summary) {
    if (!summary) return [];
    
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    
    return summary.toLowerCase()
      .split(/\W+/)
      .filter(word => word.length > 2 && !stopWords.includes(word))
      .slice(0, 10); // Limit to top 10 keywords
  }

  /**
   * Estimate reading time for summary (words per minute)
   */
  estimateReadingTime(summary) {
    if (!summary) return 0;
    
    const wordsPerMinute = 200;
    const wordCount = summary.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute * 60); // Return seconds
  }

  /**
   * Enhanced semantic search across exercises
   */
  semanticSearch(query) {
    if (!query) return [];
    
    const queryLower = query.toLowerCase();
    const results = [];
    const seen = new Set();
    
    // Direct name matches (highest priority)
    const nameMatches = this.processedData.exercises.filter(ex => 
      ex.name.toLowerCase().includes(queryLower)
    );
    
    // Summary content matches (high priority)
    const summaryMatches = this.processedData.exercises.filter(ex => 
      ex.summary && ex.summary.toLowerCase().includes(queryLower)
    );
    
    // Keyword matches (medium priority)
    const keywordMatches = this.searchKeywords(queryLower);
    
    // Movement tag matches (medium priority)
    const tagMatches = this.processedData.exercises.filter(ex =>
      ex.movementTags.some(tag => tag.toLowerCase().includes(queryLower))
    );
    
    // Combine and rank results
    return this.rankSearchResults(nameMatches, summaryMatches, keywordMatches, tagMatches, query);
  }

  /**
   * Search by keywords
   */
  searchKeywords(query) {
    const queryWords = query.split(' ');
    const matches = new Set();
    
    queryWords.forEach(word => {
      Object.keys(this.keywordIndex).forEach(keyword => {
        if (keyword.includes(word)) {
          this.keywordIndex[keyword].forEach(exercise => matches.add(exercise));
        }
      });
    });
    
    return Array.from(matches);
  }

  /**
   * Rank search results with scoring
   */
  rankSearchResults(nameMatches, summaryMatches, keywordMatches, tagMatches, query) {
    const scored = [];
    const seen = new Set();
    
    // Score and combine results
    nameMatches.forEach(ex => {
      if (!seen.has(ex.id)) {
        scored.push({
          exercise: ex,
          score: 100,
          matchType: 'name',
          excerpt: this.getSearchExcerpt(ex, query)
        });
        seen.add(ex.id);
      }
    });
    
    summaryMatches.forEach(ex => {
      if (!seen.has(ex.id)) {
        scored.push({
          exercise: ex,
          score: 80,
          matchType: 'summary',
          excerpt: this.getSearchExcerpt(ex, query)
        });
        seen.add(ex.id);
      }
    });
    
    tagMatches.forEach(ex => {
      if (!seen.has(ex.id)) {
        scored.push({
          exercise: ex,
          score: 70,
          matchType: 'movement',
          excerpt: this.getSearchExcerpt(ex, query)
        });
        seen.add(ex.id);
      }
    });
    
    keywordMatches.forEach(ex => {
      if (!seen.has(ex.id)) {
        scored.push({
          exercise: ex,
          score: 60,
          matchType: 'keyword',
          excerpt: this.getSearchExcerpt(ex, query)
        });
        seen.add(ex.id);
      }
    });
    
    return scored.sort((a, b) => b.score - a.score);
  }

  /**
   * Get search excerpt with highlighted query
   */
  getSearchExcerpt(exercise, query) {
    const summary = exercise.summary || '';
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

  /**
   * Find similar exercises based on movement patterns
   */
  findSimilarExercises(exercise, limit = 5) {
    if (!exercise || !this.processedData) return [];
    
    const similar = [];
    const exerciseTags = new Set(exercise.movementTags);
    
    this.processedData.exercises.forEach(otherEx => {
      if (otherEx.id === exercise.id) return;
      
      const otherTags = new Set(otherEx.movementTags);
      const intersection = new Set([...exerciseTags].filter(x => otherTags.has(x)));
      const union = new Set([...exerciseTags, ...otherTags]);
      
      const similarity = intersection.size / union.size;
      
      if (similarity > 0.2) { // At least 20% similarity
        similar.push({
          exercise: otherEx,
          similarity: Math.round(similarity * 100),
          commonTags: Array.from(intersection)
        });
      }
    });
    
    return similar
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
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
                exerciseSummary: exercise.exercise_summary || '',
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
   * Search exercises by name or notes (deprecated - use semanticSearch instead)
   */
  searchExercises(query) {
    return this.semanticSearch(query).map(result => result.exercise);
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

    if (filters.complexity) {
      exercises = exercises.filter(exercise => exercise.complexity === filters.complexity)
    }

    if (filters.movementTag) {
      exercises = exercises.filter(exercise => 
        exercise.movementTags.includes(filters.movementTag)
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
      exercisesByFocus: this.getExercisesByFocus(),
      complexityDistribution: this.getComplexityDistribution(),
      movementTagDistribution: this.getMovementTagDistribution()
    }
  }

  /**
   * Get complexity distribution
   */
  getComplexityDistribution() {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0 };
    this.processedData.exercises.forEach(exercise => {
      distribution[exercise.complexity]++;
    });
    return distribution;
  }

  /**
   * Get movement tag distribution
   */
  getMovementTagDistribution() {
    const distribution = {};
    this.processedData.exercises.forEach(exercise => {
      exercise.movementTags.forEach(tag => {
        distribution[tag] = (distribution[tag] || 0) + 1;
      });
    });
    return distribution;
  }

  /**
   * Extract keywords for indexing
   */
  extractKeywords(text) {
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    return text.split(/\W+/)
               .filter(word => word.length > 2 && !stopWords.includes(word))
               .map(word => word.toLowerCase());
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
    if (lowercaseText.includes('medicine ball') || lowercaseText.includes('medball')) equipment.push('medicine ball')
    if (lowercaseText.includes('band')) equipment.push('resistance band')
    if (lowercaseText.includes('box') || lowercaseText.includes('bench')) equipment.push('box/bench')
    
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