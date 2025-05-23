/**
 * ProgressTracker - Handles exercise progress, mastery tracking, and content analytics
 * Features: Exercise completion, mastery levels, summary engagement, video analytics
 */

export class ProgressTracker {
  constructor() {
    this.storageKey = 'speed-training-progress';
    this.analyticsKey = 'speed-training-analytics';
    this.data = this.loadProgress();
    this.analytics = this.loadAnalytics();
  }

  /**
   * Load progress data from localStorage
   */
  loadProgress() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      const data = stored ? JSON.parse(stored) : this.getDefaultProgressData();
      
      // Ensure data integrity - merge with defaults to fill any missing properties
      const defaultData = this.getDefaultProgressData();
      return {
        ...defaultData,
        ...data,
        overall: {
          ...defaultData.overall,
          ...(data.overall || {})
        }
      };
    } catch (error) {
      console.error('Error loading progress data:', error);
      return this.getDefaultProgressData();
    }
  }

  /**
   * Load analytics data from localStorage
   */
  loadAnalytics() {
    try {
      const stored = localStorage.getItem(this.analyticsKey);
      return stored ? JSON.parse(stored) : this.getDefaultAnalyticsData();
    } catch (error) {
      console.error('Error loading analytics data:', error);
      return this.getDefaultAnalyticsData();
    }
  }

  /**
   * Get default progress data structure
   */
  getDefaultProgressData() {
    return {
      exercises: {}, // Exercise ID -> progress data
      weeks: {}, // Week number -> week progress
      days: {}, // Week-Day key -> day progress
      overall: {
        startDate: null,
        lastActiveDate: null,
        totalTimeSpent: 0,
        streak: 0,
        longestStreak: 0
      }
    };
  }

  /**
   * Get default analytics data structure
   */
  getDefaultAnalyticsData() {
    return {
      summaryReads: {}, // Exercise ID -> read data
      videoWatches: {}, // Video URL -> watch data
      masteryProgression: {}, // Exercise ID -> mastery history
      timeSpent: {}, // Exercise ID -> time tracking
      searchQueries: [], // Search query analytics
      featureUsage: {} // Feature usage tracking
    };
  }

  /**
   * Save progress data to localStorage
   */
  saveProgress() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (error) {
      console.error('Error saving progress data:', error);
    }
  }

  /**
   * Save analytics data to localStorage
   */
  saveAnalytics() {
    try {
      localStorage.setItem(this.analyticsKey, JSON.stringify(this.analytics));
    } catch (error) {
      console.error('Error saving analytics data:', error);
    }
  }

  /**
   * Get exercise progress
   */
  getExerciseProgress(exerciseId) {
    return this.data.exercises[exerciseId] || null;
  }

  /**
   * Update exercise progress
   */
  updateExerciseProgress(exerciseId, progressData) {
    if (!this.data.exercises[exerciseId]) {
      this.data.exercises[exerciseId] = {
        completed: false,
        videoWatched: false,
        summaryRead: false,
        masteryLevel: 0,
        timeSpent: 0,
        firstCompleted: null,
        lastCompleted: null,
        completionCount: 0
      };
    }

    // Update progress data
    const current = this.data.exercises[exerciseId];
    Object.assign(current, progressData);

    // Track completion
    if (progressData.completed && !current.completed) {
      current.firstCompleted = Date.now();
      current.completionCount = 1;
    } else if (progressData.completed) {
      current.lastCompleted = Date.now();
      current.completionCount = (current.completionCount || 0) + 1;
    }

    // Track mastery progression
    if (progressData.masteryLevel !== undefined) {
      this.trackMasteryProgression(exerciseId, progressData.masteryLevel);
    }

    // Update overall progress
    this.updateOverallProgress();
    
    this.saveProgress();
  }

  /**
   * Track mastery progression
   */
  trackMasteryProgression(exerciseId, masteryLevel) {
    if (!this.analytics.masteryProgression[exerciseId]) {
      this.analytics.masteryProgression[exerciseId] = [];
    }

    this.analytics.masteryProgression[exerciseId].push({
      level: masteryLevel,
      timestamp: Date.now()
    });

    this.saveAnalytics();
  }

  /**
   * Track summary read
   */
  trackSummaryRead(exerciseId, timeSpent = 0) {
    if (!this.analytics.summaryReads[exerciseId]) {
      this.analytics.summaryReads[exerciseId] = {
        count: 0,
        firstRead: Date.now(),
        totalTime: 0,
        sessions: []
      };
    }

    const readData = this.analytics.summaryReads[exerciseId];
    readData.count++;
    readData.totalTime += timeSpent;
    readData.sessions.push({
      timestamp: Date.now(),
      duration: timeSpent
    });

    // Update exercise progress
    this.updateExerciseProgress(exerciseId, { 
      summaryRead: true,
      timeSpent: (this.data.exercises[exerciseId]?.timeSpent || 0) + timeSpent
    });

    this.saveAnalytics();
  }

  /**
   * Track video watch
   */
  trackVideoWatch(videoUrl, exerciseId, duration = 0, completed = false) {
    if (!this.analytics.videoWatches[videoUrl]) {
      this.analytics.videoWatches[videoUrl] = {
        count: 0,
        firstWatch: Date.now(),
        totalDuration: 0,
        completions: 0,
        sessions: []
      };
    }

    const watchData = this.analytics.videoWatches[videoUrl];
    watchData.count++;
    watchData.totalDuration += duration;
    if (completed) watchData.completions++;
    
    watchData.sessions.push({
      timestamp: Date.now(),
      duration: duration,
      completed: completed,
      exerciseId: exerciseId
    });

    // Update exercise progress
    if (exerciseId) {
      this.updateExerciseProgress(exerciseId, { 
        videoWatched: true,
        timeSpent: (this.data.exercises[exerciseId]?.timeSpent || 0) + duration
      });
    }

    this.saveAnalytics();
  }

  /**
   * Track search query
   */
  trackSearchQuery(query, resultCount = 0) {
    this.analytics.searchQueries.push({
      query: query,
      timestamp: Date.now(),
      resultCount: resultCount
    });

    // Keep only last 100 search queries
    if (this.analytics.searchQueries.length > 100) {
      this.analytics.searchQueries = this.analytics.searchQueries.slice(-100);
    }

    this.saveAnalytics();
  }

  /**
   * Track feature usage
   */
  trackFeatureUsage(feature, action = 'use') {
    const key = `${feature}_${action}`;
    if (!this.analytics.featureUsage[key]) {
      this.analytics.featureUsage[key] = {
        count: 0,
        firstUse: Date.now(),
        lastUse: Date.now()
      };
    }

    this.analytics.featureUsage[key].count++;
    this.analytics.featureUsage[key].lastUse = Date.now();

    this.saveAnalytics();
  }

  /**
   * Update overall progress metrics
   */
  updateOverallProgress() {
    // Ensure data structure integrity
    if (!this.data.overall) {
      this.data.overall = {
        startDate: null,
        lastActiveDate: null,
        totalTimeSpent: 0,
        streak: 0,
        longestStreak: 0
      };
    }

    if (!this.data.overall.startDate) {
      this.data.overall.startDate = Date.now();
    }
    
    this.data.overall.lastActiveDate = Date.now();
    
    // Calculate streak
    this.calculateStreak();
  }

  /**
   * Calculate current streak
   */
  calculateStreak() {
    // Ensure data structure integrity
    if (!this.data.overall) {
      this.data.overall = {
        startDate: null,
        lastActiveDate: null,
        totalTimeSpent: 0,
        streak: 0,
        longestStreak: 0
      };
    }

    const completedExercises = Object.values(this.data.exercises).filter(ex => ex.completed);
    
    if (completedExercises.length === 0) {
      this.data.overall.streak = 0;
      return;
    }

    // Sort by completion date
    completedExercises.sort((a, b) => (b.lastCompleted || b.firstCompleted) - (a.lastCompleted || a.firstCompleted));

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const exercise of completedExercises) {
      const completionDate = new Date(exercise.lastCompleted || exercise.firstCompleted);
      completionDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((currentDate - completionDate) / (1000 * 60 * 60 * 24));

      if (daysDiff <= 1) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    this.data.overall.streak = streak;
    this.data.overall.longestStreak = Math.max(this.data.overall.longestStreak || 0, streak);
  }

  /**
   * Get week progress
   */
  getWeekProgress(weekNumber) {
    return this.data.weeks[weekNumber] || {
      completed: false,
      exercisesCompleted: 0,
      totalExercises: 0,
      startDate: null,
      completionDate: null
    };
  }

  /**
   * Update week progress
   */
  updateWeekProgress(weekNumber, weekData) {
    if (!this.data.weeks[weekNumber]) {
      this.data.weeks[weekNumber] = this.getWeekProgress(weekNumber);
    }

    Object.assign(this.data.weeks[weekNumber], weekData);
    this.saveProgress();
  }

  /**
   * Get day progress
   */
  getDayProgress(weekNumber, dayNumber) {
    const key = `w${weekNumber}-d${dayNumber}`;
    return this.data.days[key] || {
      completed: false,
      exercisesCompleted: 0,
      totalExercises: 0,
      startDate: null,
      completionDate: null,
      timeSpent: 0
    };
  }

  /**
   * Update day progress
   */
  updateDayProgress(weekNumber, dayNumber, dayData) {
    const key = `w${weekNumber}-d${dayNumber}`;
    if (!this.data.days[key]) {
      this.data.days[key] = this.getDayProgress(weekNumber, dayNumber);
    }

    Object.assign(this.data.days[key], dayData);
    this.saveProgress();
  }

  /**
   * Calculate overall completion percentage
   */
  calculateOverallCompletion(totalExercises) {
    const completedExercises = Object.values(this.data.exercises).filter(ex => ex.completed).length;
    return totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;
  }

  /**
   * Calculate week completion percentage
   */
  calculateWeekCompletion(weekNumber, exercises) {
    const weekExercises = exercises.filter(ex => ex.weekNumber === weekNumber);
    const completed = weekExercises.filter(ex => this.data.exercises[ex.id]?.completed).length;
    return weekExercises.length > 0 ? Math.round((completed / weekExercises.length) * 100) : 0;
  }

  /**
   * Calculate day completion percentage
   */
  calculateDayCompletion(weekNumber, dayNumber, exercises) {
    const dayExercises = exercises.filter(ex => ex.weekNumber === weekNumber && ex.dayNumber === dayNumber);
    const completed = dayExercises.filter(ex => this.data.exercises[ex.id]?.completed).length;
    return dayExercises.length > 0 ? Math.round((completed / dayExercises.length) * 100) : 0;
  }

  /**
   * Get content engagement statistics
   */
  getContentEngagementStats() {
    const summaryReads = this.analytics.summaryReads || {};
    const videoWatches = this.analytics.videoWatches || {};

    const exerciseEngagement = Object.entries(summaryReads).map(([exerciseId, data]) => ({
      exerciseId: exerciseId,
      readCount: data.count,
      avgTimeSpent: data.totalTime / data.count,
      totalTimeSpent: data.totalTime
    }));

    return {
      totalSummariesRead: Object.keys(summaryReads).length,
      totalVideoWatches: Object.values(videoWatches).reduce((sum, watch) => sum + watch.count, 0),
      averageTimePerSummary: this.calculateAverageTime(summaryReads),
      mostReadExercises: exerciseEngagement.sort((a, b) => b.readCount - a.readCount).slice(0, 10),
      longestStudiedExercises: exerciseEngagement.sort((a, b) => b.totalTimeSpent - a.totalTimeSpent).slice(0, 10),
      videoCompletionRate: this.calculateVideoCompletionRate(videoWatches)
    };
  }

  /**
   * Calculate average time spent reading summaries
   */
  calculateAverageTime(summaryReads) {
    const totals = Object.values(summaryReads).reduce(
      (acc, read) => ({
        time: acc.time + read.totalTime,
        count: acc.count + read.count
      }),
      { time: 0, count: 0 }
    );

    return totals.count > 0 ? Math.round(totals.time / totals.count) : 0;
  }

  /**
   * Calculate video completion rate
   */
  calculateVideoCompletionRate(videoWatches) {
    const totals = Object.values(videoWatches).reduce(
      (acc, watch) => ({
        watches: acc.watches + watch.count,
        completions: acc.completions + watch.completions
      }),
      { watches: 0, completions: 0 }
    );

    return totals.watches > 0 ? Math.round((totals.completions / totals.watches) * 100) : 0;
  }

  /**
   * Generate learning insights
   */
  generateLearningInsights() {
    // Ensure data structure integrity
    if (!this.data.overall) {
      this.data.overall = {
        startDate: null,
        lastActiveDate: null,
        totalTimeSpent: 0,
        streak: 0,
        longestStreak: 0
      };
      this.saveProgress();
    }

    const engagement = this.getContentEngagementStats();
    const insights = [];

    // Time-based insights
    if (engagement.averageTimePerSummary > 60) {
      insights.push({
        type: 'positive',
        icon: '📚',
        message: 'Great job taking time to understand each exercise thoroughly!',
        detail: `You spend an average of ${Math.round(engagement.averageTimePerSummary)}s reading exercise descriptions.`
      });
    }

    // Progress insights
    if (engagement.totalSummariesRead > 50) {
      insights.push({
        type: 'achievement',
        icon: '🏆',
        message: 'Exercise Explorer: You\'ve read over 50 exercise descriptions!',
        detail: 'Your dedication to learning proper technique is impressive.'
      });
    }

    // Video engagement insights
    if (engagement.videoCompletionRate > 80) {
      insights.push({
        type: 'positive',
        icon: '🎥',
        message: 'Video Champion: You complete most of the videos you start!',
        detail: `${engagement.videoCompletionRate}% video completion rate shows great focus.`
      });
    }

    // Streak insights
    if (this.data.overall.streak > 0) {
      insights.push({
        type: 'streak',
        icon: '🔥',
        message: `${this.data.overall.streak} day streak!`,
        detail: this.data.overall.streak === 1 ? 'Keep it going!' : 'You\'re building great habits!'
      });
    }

    // Mastery insights
    const masteredExercises = Object.values(this.data.exercises).filter(ex => ex.masteryLevel >= 4).length;
    if (masteredExercises > 10) {
      insights.push({
        type: 'mastery',
        icon: '⭐',
        message: `Master of ${masteredExercises} exercises!`,
        detail: 'Your technique proficiency is excellent.'
      });
    }

    return insights;
  }

  /**
   * Get progress statistics for charts
   */
  getProgressChartData() {
    return {
      weeklyCompletion: this.getWeeklyCompletionData(),
      masteryDistribution: this.getMasteryDistributionData(),
      engagementTrends: this.getEngagementTrendsData(),
      streakHistory: this.getStreakHistoryData()
    };
  }

  /**
   * Get weekly completion data for charts
   */
  getWeeklyCompletionData() {
    const weeks = [];
    for (let i = 1; i <= 6; i++) {
      const weekProgress = this.getWeekProgress(i);
      weeks.push({
        week: i,
        completion: weekProgress.exercisesCompleted / (weekProgress.totalExercises || 1) * 100,
        exercisesCompleted: weekProgress.exercisesCompleted,
        totalExercises: weekProgress.totalExercises
      });
    }
    return weeks;
  }

  /**
   * Get mastery distribution data
   */
  getMasteryDistributionData() {
    const distribution = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    Object.values(this.data.exercises).forEach(exercise => {
      distribution[exercise.masteryLevel || 0]++;
    });
    return distribution;
  }

  /**
   * Get engagement trends data
   */
  getEngagementTrendsData() {
    // This would analyze trends over time
    // For now, return basic data
    return {
      summaryReads: Object.keys(this.analytics.summaryReads).length,
      videoWatches: Object.values(this.analytics.videoWatches).reduce((sum, watch) => sum + watch.count, 0),
      searchQueries: this.analytics.searchQueries.length
    };
  }

  /**
   * Get streak history data
   */
  getStreakHistoryData() {
    return {
      current: this.data.overall.streak,
      longest: this.data.overall.longestStreak,
      history: [] // Could be implemented to track daily activity
    };
  }

  /**
   * Export progress data
   */
  exportProgress() {
    return {
      progress: this.data,
      analytics: this.analytics,
      exportDate: Date.now(),
      version: '1.0'
    };
  }

  /**
   * Import progress data
   */
  importProgress(importData) {
    try {
      if (importData.progress) {
        this.data = { ...this.getDefaultProgressData(), ...importData.progress };
        this.saveProgress();
      }

      if (importData.analytics) {
        this.analytics = { ...this.getDefaultAnalyticsData(), ...importData.analytics };
        this.saveAnalytics();
      }

      return true;
    } catch (error) {
      console.error('Error importing progress data:', error);
      return false;
    }
  }

  /**
   * Reset all progress data
   */
  resetProgress() {
    this.data = this.getDefaultProgressData();
    this.analytics = this.getDefaultAnalyticsData();
    this.saveProgress();
    this.saveAnalytics();
  }
} 