/**
 * ExerciseCard - Enhanced exercise card component with summary integration
 * Features: Summary tab, video integration, mastery tracking, related exercises
 */

import { ProgressTracker } from '../progress/ProgressTracker.js';
import { VideoPlayer } from '../video/VideoPlayer.js';

export class ExerciseCard {
  constructor(exercise, blockName, dataProcessor) {
    this.exercise = exercise;
    this.blockName = blockName;
    this.dataProcessor = dataProcessor;
    this.completed = false;
    this.activeTab = 'summary'; // 'summary', 'video', 'details', 'notes'
    this.videoWatched = false;
    this.summaryRead = false;
    this.masteryLevel = 0; // 0-5 scale based on user self-assessment
    this.progressTracker = new ProgressTracker();
    this.videoPlayer = null;
    
    this.loadProgress();
  }

  /**
   * Load progress data from storage
   */
  loadProgress() {
    const progress = this.progressTracker.getExerciseProgress(this.exercise.id);
    if (progress) {
      this.completed = progress.completed || false;
      this.videoWatched = progress.videoWatched || false;
      this.summaryRead = progress.summaryRead || false;
      this.masteryLevel = progress.masteryLevel || 0;
    }
  }

  /**
   * Save progress data to storage
   */
  saveProgress() {
    this.progressTracker.updateExerciseProgress(this.exercise.id, {
      completed: this.completed,
      videoWatched: this.videoWatched,
      summaryRead: this.summaryRead,
      masteryLevel: this.masteryLevel,
      lastUpdated: Date.now()
    });
  }

  /**
   * Render the exercise card
   */
  render() {
    const cardElement = document.createElement('div');
    cardElement.className = `exercise-card ${this.completed ? 'completed' : ''}`;
    cardElement.setAttribute('data-mastery', this.masteryLevel);
    cardElement.setAttribute('data-exercise-id', this.exercise.id);

    cardElement.innerHTML = `
      <div class="exercise-header">
        <h4 class="exercise-name">${this.exercise.name}</h4>
        <div class="exercise-meta">
          <span class="mastery-indicator" title="Mastery Level: ${this.masteryLevel}/5">
            ${'★'.repeat(this.masteryLevel)}${'☆'.repeat(5-this.masteryLevel)}
          </span>
          <button class="complete-btn" data-completed="${this.completed}">
            ${this.completed ? '✓' : '○'}
          </button>
        </div>
      </div>
      
      <div class="exercise-preview">
        <p class="summary-preview">${this.getSummaryPreview()}</p>
        ${this.exercise.setsReps ? `<span class="sets-reps-badge">${this.exercise.setsReps}</span>` : ''}
        <div class="exercise-indicators">
          <span class="complexity-indicator level-${this.exercise.complexity}">
            Level ${this.exercise.complexity}/4
          </span>
          <span class="focus-area-indicator" data-focus="${this.exercise.focusArea}">
            ${this.exercise.focusArea}
          </span>
          ${this.exercise.hasVideo ? '<span class="video-indicator">🎥</span>' : ''}
        </div>
      </div>
      
      <div class="exercise-tabs">
        <button class="tab ${this.activeTab === 'summary' ? 'active' : ''}" 
                data-tab="summary">
          📖 Summary ${this.summaryRead ? '✓' : ''}
        </button>
        ${this.exercise.hasVideo ? `
          <button class="tab ${this.activeTab === 'video' ? 'active' : ''}" 
                  data-tab="video">
            📹 Video ${this.videoWatched ? '✓' : ''}
          </button>
        ` : ''}
        <button class="tab ${this.activeTab === 'details' ? 'active' : ''}" 
                data-tab="details">⚙️ Details</button>
        <button class="tab ${this.activeTab === 'notes' ? 'active' : ''}" 
                data-tab="notes">📝 Notes</button>
      </div>
      
      <div class="exercise-content">
        ${this.renderTabContent()}
      </div>
      
      <div class="exercise-actions">
        ${this.renderActionButtons()}
      </div>
    `;

    this.attachEventListeners(cardElement);
    return cardElement;
  }

  /**
   * Get summary preview (first 100 characters)
   */
  getSummaryPreview() {
    const summary = this.exercise.summary || '';
    return summary.length > 100 ? summary.substring(0, 100) + '...' : summary;
  }

  /**
   * Render tab content based on active tab
   */
  renderTabContent() {
    switch(this.activeTab) {
      case 'summary':
        return this.renderSummaryTab();
      case 'video':
        return this.renderVideoTab();
      case 'details':
        return this.renderDetailsTab();
      case 'notes':
        return this.renderNotesTab();
      default:
        return '';
    }
  }

  /**
   * Render summary tab content
   */
  renderSummaryTab() {
    return `
      <div class="exercise-summary-content">
        <div class="full-summary">
          <p class="exercise-summary">${this.exercise.summary || 'No summary available'}</p>
        </div>
        ${this.exercise.summary ? `
          <div class="summary-actions">
            <button class="read-aloud-btn" data-action="read-aloud">
              🔊 Read Aloud
            </button>
            <button class="highlight-btn" data-action="highlight">
              🖍️ Highlight
            </button>
            <button class="bookmark-btn" data-action="bookmark">
              🔖 Bookmark
            </button>
          </div>
          <div class="reading-stats">
            <span class="reading-time">📖 ${this.exercise.readingTime}s read</span>
            <span class="word-count">${this.getWordCount()} words</span>
          </div>
        ` : ''}
        <div class="exercise-metadata">
          <div class="movement-tags">
            ${this.exercise.movementTags.map(tag => 
              `<span class="movement-tag">${tag}</span>`
            ).join('')}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render video tab content
   */
  renderVideoTab() {
    if (!this.exercise.hasVideo) {
      return '<p class="no-video">No video demonstration available for this exercise.</p>';
    }

    return `
      <div class="video-container">
        <div class="video-summary-sync">
          <button class="sync-btn" data-action="sync-video-summary">
            🔗 Sync with Summary
          </button>
        </div>
        <div class="video-player-container" id="video-player-${this.exercise.id}">
          <!-- Video player will be inserted here -->
        </div>
        <div class="video-controls">
          <button class="video-bookmark" data-action="bookmark-video">
            🔖 Bookmark
          </button>
          <button class="video-fullscreen" data-action="fullscreen">
            ⛶ Fullscreen
          </button>
          <button class="video-summary-overlay" data-action="show-summary-overlay">
            📖 Show Summary Overlay
          </button>
        </div>
        <div class="video-info">
          <p class="video-description">Watch the demonstration for proper form and technique.</p>
        </div>
      </div>
    `;
  }

  /**
   * Render details tab content
   */
  renderDetailsTab() {
    return `
      <div class="exercise-details">
        <div class="sets-reps-detail">
          <h5>Sets & Reps</h5>
          <p class="sets-reps">${this.exercise.setsReps || 'Not specified'}</p>
        </div>
        ${this.exercise.notes ? `
          <div class="exercise-notes-detail">
            <h5>Coaching Notes</h5>
            <p class="exercise-notes">${this.exercise.notes}</p>
          </div>
        ` : ''}
        <div class="exercise-analysis">
          <h5>Movement Analysis</h5>
          <div class="movement-tags">
            ${this.exercise.movementTags.map(tag => 
              `<span class="movement-tag">${tag}</span>`
            ).join('')}
          </div>
        </div>
        ${this.exercise.equipment.length > 0 ? `
          <div class="equipment-needed">
            <h5>Equipment Needed</h5>
            <div class="equipment-list">
              ${this.exercise.equipment.map(item => 
                `<span class="equipment-item">${item}</span>`
              ).join('')}
            </div>
          </div>
        ` : ''}
        <div class="difficulty-assessment">
          <h5>Difficulty Assessment</h5>
          <div class="mastery-controls">
            <label>Rate your mastery (1-5):</label>
            <div class="star-rating">
              ${[1,2,3,4,5].map(i => `
                <button class="star ${i <= this.masteryLevel ? 'filled' : ''}" 
                        data-mastery="${i}">★</button>
              `).join('')}
            </div>
            <p class="mastery-description">${this.getMasteryDescription()}</p>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render notes tab content
   */
  renderNotesTab() {
    const personalNotes = this.getPersonalNotes();
    const relatedExercises = this.getRelatedExercises();

    return `
      <div class="personal-notes-section">
        <textarea class="personal-notes" 
                  placeholder="Add your personal notes and observations...">${personalNotes}</textarea>
        <div class="notes-actions">
          <button class="save-notes-btn" data-action="save-notes">
            💾 Save Notes
          </button>
          <button class="voice-notes-btn" data-action="voice-note">
            🎤 Voice Note
          </button>
        </div>
        <div class="related-exercises">
          <h5>Related Exercises</h5>
          <div class="related-list">
            ${relatedExercises.map(rel => `
              <div class="related-item" data-exercise-id="${rel.exercise.id}">
                <span class="related-name">${rel.exercise.name}</span>
                <span class="related-similarity">${rel.similarity}% similar</span>
                <div class="related-tags">
                  ${rel.commonTags.map(tag => `<span class="common-tag">${tag}</span>`).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render action buttons
   */
  renderActionButtons() {
    return `
      <div class="action-buttons">
        <button class="mark-complete-btn ${this.completed ? 'completed' : ''}" 
                data-action="toggle-completion">
          ${this.completed ? '✅ Completed' : '⭕ Mark Complete'}
        </button>
        <button class="find-similar-btn" data-action="find-similar">
          🔍 Find Similar
        </button>
        <button class="share-btn" data-action="share">
          📤 Share
        </button>
      </div>
    `;
  }

  /**
   * Attach event listeners to the card
   */
  attachEventListeners(cardElement) {
    // Tab switching
    cardElement.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabName = e.target.getAttribute('data-tab');
        this.switchTab(tabName, cardElement);
      });
    });

    // Action buttons
    cardElement.addEventListener('click', (e) => {
      const action = e.target.getAttribute('data-action');
      if (action) {
        e.preventDefault();
        this.handleAction(action, e.target, cardElement);
      }
    });

    // Mastery rating stars
    cardElement.querySelectorAll('.star').forEach(star => {
      star.addEventListener('click', (e) => {
        const rating = parseInt(e.target.getAttribute('data-mastery'));
        this.setMastery(rating, cardElement);
      });
    });

    // Complete button
    cardElement.querySelector('.complete-btn').addEventListener('click', () => {
      this.toggleCompletion(cardElement);
    });

    // Personal notes auto-save
    const notesTextarea = cardElement.querySelector('.personal-notes');
    if (notesTextarea) {
      notesTextarea.addEventListener('input', () => {
        this.autoSaveNotes(notesTextarea.value);
      });
    }
  }

  /**
   * Switch between tabs
   */
  switchTab(tabName, cardElement) {
    this.activeTab = tabName;
    
    // Update tab buttons
    cardElement.querySelectorAll('.tab').forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-tab') === tabName);
    });

    // Update content
    const contentContainer = cardElement.querySelector('.exercise-content');
    contentContainer.innerHTML = this.renderTabContent();

    // Initialize video player if video tab is opened
    if (tabName === 'video' && this.exercise.hasVideo) {
      this.initializeVideoPlayer(cardElement);
    }

    // Mark summary as read if summary tab is opened
    if (tabName === 'summary' && !this.summaryRead) {
      this.markSummaryAsRead(cardElement);
    }

    // Re-attach event listeners for new content
    this.attachTabSpecificListeners(cardElement);
  }

  /**
   * Initialize video player
   */
  initializeVideoPlayer(cardElement) {
    const container = cardElement.querySelector(`#video-player-${this.exercise.id}`);
    if (container && this.exercise.videoUrl) {
      this.videoPlayer = new VideoPlayer(this.exercise.videoUrl, container);
      this.videoPlayer.onVideoEnd = () => {
        this.markVideoAsWatched(cardElement);
      };
    }
  }

  /**
   * Mark summary as read
   */
  markSummaryAsRead(cardElement) {
    this.summaryRead = true;
    this.saveProgress();
    
    // Update tab indicator
    const summaryTab = cardElement.querySelector('[data-tab="summary"]');
    if (summaryTab && !summaryTab.textContent.includes('✓')) {
      summaryTab.innerHTML = '📖 Summary ✓';
    }
  }

  /**
   * Mark video as watched
   */
  markVideoAsWatched(cardElement) {
    this.videoWatched = true;
    this.saveProgress();
    
    // Update tab indicator
    const videoTab = cardElement.querySelector('[data-tab="video"]');
    if (videoTab && !videoTab.textContent.includes('✓')) {
      videoTab.innerHTML = '📹 Video ✓';
    }
  }

  /**
   * Handle various actions
   */
  handleAction(action, target, cardElement) {
    switch(action) {
      case 'read-aloud':
        this.readAloud();
        break;
      case 'highlight':
        this.toggleHighlight(target);
        break;
      case 'bookmark':
        this.bookmarkExercise();
        break;
      case 'sync-video-summary':
        this.syncVideoWithSummary();
        break;
      case 'toggle-completion':
        this.toggleCompletion(cardElement);
        break;
      case 'find-similar':
        this.showSimilarExercises();
        break;
      case 'share':
        this.shareExercise();
        break;
      case 'save-notes':
        this.saveNotes(cardElement);
        break;
      case 'voice-note':
        this.recordVoiceNote();
        break;
    }
  }

  /**
   * Toggle completion status
   */
  toggleCompletion(cardElement) {
    this.completed = !this.completed;
    this.saveProgress();
    
    // Update UI
    cardElement.classList.toggle('completed', this.completed);
    const completeBtn = cardElement.querySelector('.complete-btn');
    completeBtn.textContent = this.completed ? '✓' : '○';
    completeBtn.setAttribute('data-completed', this.completed);
    
    const actionBtn = cardElement.querySelector('.mark-complete-btn');
    actionBtn.textContent = this.completed ? '✅ Completed' : '⭕ Mark Complete';
    actionBtn.classList.toggle('completed', this.completed);

    // Dispatch completion event
    cardElement.dispatchEvent(new CustomEvent('exerciseCompleted', {
      detail: { exercise: this.exercise, completed: this.completed }
    }));
  }

  /**
   * Set mastery level
   */
  setMastery(level, cardElement) {
    this.masteryLevel = level;
    this.saveProgress();
    
    // Update stars
    cardElement.querySelectorAll('.star').forEach((star, index) => {
      star.classList.toggle('filled', index < level);
    });
    
    // Update mastery indicator in header
    const masteryIndicator = cardElement.querySelector('.mastery-indicator');
    masteryIndicator.innerHTML = '★'.repeat(level) + '☆'.repeat(5-level);
    masteryIndicator.setAttribute('title', `Mastery Level: ${level}/5`);
    
    // Update description
    const description = cardElement.querySelector('.mastery-description');
    if (description) {
      description.textContent = this.getMasteryDescription();
    }
  }

  /**
   * Get mastery description
   */
  getMasteryDescription() {
    const descriptions = {
      0: 'Not started',
      1: 'Beginner - Learning the basics',
      2: 'Developing - Can perform with guidance',
      3: 'Competent - Can perform independently',
      4: 'Proficient - Consistent performance',
      5: 'Expert - Can teach others'
    };
    return descriptions[this.masteryLevel] || descriptions[0];
  }

  /**
   * Get word count for summary
   */
  getWordCount() {
    return this.exercise.summary ? this.exercise.summary.split(/\s+/).length : 0;
  }

  /**
   * Read aloud functionality
   */
  readAloud() {
    if ('speechSynthesis' in window && this.exercise.summary) {
      const utterance = new SpeechSynthesisUtterance(this.exercise.summary);
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      speechSynthesis.speak(utterance);
    }
  }

  /**
   * Get personal notes from storage
   */
  getPersonalNotes() {
    const notes = localStorage.getItem(`exercise-notes-${this.exercise.id}`);
    return notes || '';
  }

  /**
   * Auto-save notes
   */
  autoSaveNotes(notes) {
    localStorage.setItem(`exercise-notes-${this.exercise.id}`, notes);
  }

  /**
   * Save notes manually
   */
  saveNotes(cardElement) {
    const textarea = cardElement.querySelector('.personal-notes');
    if (textarea) {
      this.autoSaveNotes(textarea.value);
      
      // Show save confirmation
      const saveBtn = cardElement.querySelector('.save-notes-btn');
      const originalText = saveBtn.textContent;
      saveBtn.textContent = '✅ Saved';
      setTimeout(() => {
        saveBtn.textContent = originalText;
      }, 2000);
    }
  }

  /**
   * Get related exercises
   */
  getRelatedExercises() {
    if (this.dataProcessor) {
      return this.dataProcessor.findSimilarExercises(this.exercise, 3);
    }
    return [];
  }

  /**
   * Show similar exercises
   */
  showSimilarExercises() {
    const similarExercises = this.getRelatedExercises();
    
    // Dispatch event to show similar exercises
    document.dispatchEvent(new CustomEvent('showSimilarExercises', {
      detail: { 
        exercise: this.exercise,
        similarExercises: similarExercises
      }
    }));
  }

  /**
   * Share exercise
   */
  shareExercise() {
    if (navigator.share) {
      navigator.share({
        title: `Speed Training Exercise: ${this.exercise.name}`,
        text: this.exercise.summary || this.exercise.name,
        url: window.location.href
      });
    } else {
      // Fallback to clipboard
      const shareText = `${this.exercise.name}\n\n${this.exercise.summary || ''}`;
      navigator.clipboard.writeText(shareText).then(() => {
        // Show success message
        console.log('Exercise copied to clipboard');
      });
    }
  }

  /**
   * Bookmark exercise
   */
  bookmarkExercise() {
    const bookmarks = JSON.parse(localStorage.getItem('exercise-bookmarks') || '[]');
    const isBookmarked = bookmarks.includes(this.exercise.id);
    
    if (isBookmarked) {
      const index = bookmarks.indexOf(this.exercise.id);
      bookmarks.splice(index, 1);
    } else {
      bookmarks.push(this.exercise.id);
    }
    
    localStorage.setItem('exercise-bookmarks', JSON.stringify(bookmarks));
    
    // Update UI feedback
    console.log(isBookmarked ? 'Exercise unbookmarked' : 'Exercise bookmarked');
  }

  /**
   * Sync video with summary
   */
  syncVideoWithSummary() {
    // Implementation for showing summary overlay on video
    console.log('Syncing video with summary...');
  }

  /**
   * Record voice note
   */
  recordVoiceNote() {
    // Implementation for voice recording
    console.log('Recording voice note...');
  }

  /**
   * Toggle highlight
   */
  toggleHighlight(target) {
    target.classList.toggle('highlighted');
    console.log('Toggled highlight');
  }

  /**
   * Attach tab-specific event listeners
   */
  attachTabSpecificListeners(cardElement) {
    // Re-attach listeners for dynamically added content
    const stars = cardElement.querySelectorAll('.star');
    stars.forEach(star => {
      star.addEventListener('click', (e) => {
        const rating = parseInt(e.target.getAttribute('data-mastery'));
        this.setMastery(rating, cardElement);
      });
    });

    // Related exercise navigation
    const relatedItems = cardElement.querySelectorAll('.related-item');
    relatedItems.forEach(item => {
      item.addEventListener('click', () => {
        const exerciseId = item.getAttribute('data-exercise-id');
        document.dispatchEvent(new CustomEvent('navigateToExercise', {
          detail: { exerciseId }
        }));
      });
    });
  }

  /**
   * Update exercise data
   */
  updateExercise(newExerciseData) {
    this.exercise = { ...this.exercise, ...newExerciseData };
  }

  /**
   * Destroy card and clean up
   */
  destroy() {
    if (this.videoPlayer) {
      this.videoPlayer.destroy();
    }
  }
} 