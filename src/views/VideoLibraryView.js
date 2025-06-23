/**
 * VideoLibraryView - Browse all exercise demonstration videos
 */
export class VideoLibraryView {
  constructor(dataProcessor, progressTracker) {
    this.dataProcessor = dataProcessor
    this.progressTracker = progressTracker
    this.container = document.getElementById('video-library-view')
    this.currentFilter = 'all'
  }

  /**
   * Render the video library view
   */
  render() {
    if (!this.container) return
    this.renderVideoLibrary()
  }

  /**
   * Render video library content
   */
  renderVideoLibrary() {
    const libraryContent = document.getElementById('video-library-content')
    if (!libraryContent) return

    const allVideos = this.dataProcessor.getAllVideos()
    const videosByFocus = this.groupVideosByFocus()
    const videoEngagement = this.progressTracker.getVideoEngagement()

    const libraryHtml = `
      <div class="video-library-header">
        <div class="video-stats">
          <div class="video-stat">
            <span class="stat-value">${allVideos.length}</span>
            <span class="stat-label">Total Videos</span>
          </div>
          <div class="video-stat">
            <span class="stat-value">${videoEngagement.watchedVideos}</span>
            <span class="stat-label">Watched</span>
          </div>
          <div class="video-stat">
            <span class="stat-value">${videoEngagement.favoriteCount}</span>
            <span class="stat-label">Favorites</span>
          </div>
          <div class="video-stat">
            <span class="stat-value">${videoEngagement.watchedPercentage}%</span>
            <span class="stat-label">Progress</span>
          </div>
        </div>

        <div class="video-filters">
          <button class="filter-btn ${this.currentFilter === 'all' ? 'active' : ''}" 
                  data-filter="all">All Videos</button>
          <button class="filter-btn ${this.currentFilter === 'favorites' ? 'active' : ''}" 
                  data-filter="favorites">⭐ Favorites</button>
          <button class="filter-btn ${this.currentFilter === 'watched' ? 'active' : ''}" 
                  data-filter="watched">👁️ Watched</button>
          <button class="filter-btn ${this.currentFilter === 'unwatched' ? 'active' : ''}" 
                  data-filter="unwatched">⭕ Not Watched</button>
        </div>
      </div>

      <div class="video-sections">
        ${Object.entries(videosByFocus).map(([focus, videos]) => {
          const filteredVideos = this.filterVideos(videos)
          if (filteredVideos.length === 0) return ''
          
          return `
            <div class="video-section">
              <div class="section-header">
                <h3 class="section-title">
                  <span class="focus-icon">${this.getFocusIcon(focus)}</span>
                  ${focus}
                  <span class="video-count">(${filteredVideos.length})</span>
                </h3>
              </div>
              
              <div class="video-grid">
                ${filteredVideos.map(video => this.renderVideoCard(video)).join('')}
              </div>
            </div>
          `
        }).join('')}
      </div>
    `

    libraryContent.innerHTML = libraryHtml
    this.setupVideoLibraryInteractions()
  }

  /**
   * Render individual video card
   */
  renderVideoCard(video) {
    const isWatched = this.progressTracker.isVideoWatched(video.url)
    const isFavorited = this.progressTracker.isVideoFavorited(video.url)
    const watchData = this.progressTracker.videoAnalytics.watchHistory[video.url]

    return `
      <div class="video-card ${isWatched ? 'watched' : ''}" data-video-url="${video.url}">
        <div class="video-thumbnail" data-video-id="${video.videoId}">
          <img src="https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg" 
               alt="${video.exerciseName}"
               loading="lazy">
          <div class="video-overlay">
            <button class="play-btn" data-video-url="${video.url}">
              <span class="play-icon">▶️</span>
            </button>
          </div>
          ${isWatched ? '<div class="watched-indicator">✓</div>' : ''}
        </div>
        
        <div class="video-info">
          <h4 class="video-title">${video.exerciseName}</h4>
          <div class="video-meta">
            <span class="video-week">Week ${video.weekNumber}, Day ${video.dayNumber}</span>
            <span class="video-block">${video.blockName}</span>
          </div>
          
          <div class="video-actions">
            <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" 
                    data-video-url="${video.url}"
                    title="${isFavorited ? 'Remove from favorites' : 'Add to favorites'}">
              ${isFavorited ? '⭐' : '☆'}
            </button>
            
            <button class="goto-exercise-btn" 
                    data-week="${video.weekNumber}" 
                    data-day="${video.dayNumber}"
                    title="Go to exercise">
              🎯
            </button>
            
            ${watchData ? `
              <span class="watch-count" title="Watched ${watchData.watchCount} times">
                ${watchData.watchCount}x
              </span>
            ` : ''}
          </div>
        </div>
      </div>
    `
  }

  /**
   * Group videos by focus area
   */
  groupVideosByFocus() {
    const allVideos = this.dataProcessor.getAllVideos()
    const grouped = {}

    allVideos.forEach(video => {
      if (!grouped[video.focus]) {
        grouped[video.focus] = []
      }
      grouped[video.focus].push(video)
    })

    return grouped
  }

  /**
   * Filter videos based on current filter
   */
  filterVideos(videos) {
    switch (this.currentFilter) {
      case 'favorites':
        return videos.filter(video => this.progressTracker.isVideoFavorited(video.url))
      case 'watched':
        return videos.filter(video => this.progressTracker.isVideoWatched(video.url))
      case 'unwatched':
        return videos.filter(video => !this.progressTracker.isVideoWatched(video.url))
      default:
        return videos
    }
  }

  /**
   * Setup video library interactions
   */
  setupVideoLibraryInteractions() {
    this.setupFilterButtons()
    this.setupVideoCards()
    this.setupFavoriteButtons()
    this.setupGotoExerciseButtons()
  }

  /**
   * Setup filter buttons
   */
  setupFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn')
    
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active filter
        filterBtns.forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        
        this.currentFilter = btn.dataset.filter
        this.renderVideoLibrary()
      })
    })
  }

  /**
   * Setup video card interactions
   */
  setupVideoCards() {
    const playBtns = document.querySelectorAll('.play-btn')
    
    playBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        const videoUrl = btn.dataset.videoUrl
        this.openVideoModal(videoUrl)
      })
    })
  }

  /**
   * Setup favorite buttons
   */
  setupFavoriteButtons() {
    const favoriteBtns = document.querySelectorAll('.favorite-btn')
    
    favoriteBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        
        const videoUrl = btn.dataset.videoUrl
        const isFavorited = this.progressTracker.isVideoFavorited(videoUrl)
        
        if (isFavorited) {
          this.progressTracker.removeVideoFromFavorites(videoUrl)
          btn.textContent = '☆'
          btn.classList.remove('favorited')
          btn.title = 'Add to favorites'
        } else {
          this.progressTracker.addVideoToFavorites(videoUrl)
          btn.textContent = '⭐'
          btn.classList.add('favorited')
          btn.title = 'Remove from favorites'
        }
        
        // Update video card
        const videoCard = btn.closest('.video-card')
        videoCard.classList.toggle('favorited', !isFavorited)
      })
    })
  }

  /**
   * Setup goto exercise buttons
   */
  setupGotoExerciseButtons() {
    const gotoBtns = document.querySelectorAll('.goto-exercise-btn')
    
    gotoBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        
        const weekNumber = parseInt(btn.dataset.week)
        const dayNumber = parseInt(btn.dataset.day)
        
        if (window.speedTrainingApp) {
          window.speedTrainingApp.showDay(weekNumber, dayNumber)
        }
      })
    })
  }

  /**
   * Open video in modal
   */
  openVideoModal(videoUrl) {
    const modal = document.getElementById('modal-overlay')
    const modalBody = document.getElementById('modal-body')
    
    if (!modal || !modalBody) return

    const embedUrl = this.dataProcessor.getEmbedUrl(videoUrl)
    if (!embedUrl) return

    modalBody.innerHTML = `
      <div class="video-modal">
        <iframe 
          src="${embedUrl}"
          frameborder="0"
          allowfullscreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">
        </iframe>
      </div>
    `

    modal.classList.add('active')
    
    // Track video watch
    this.progressTracker.trackVideoWatch(videoUrl)

    // Setup modal close
    const closeBtn = document.getElementById('modal-close')
    const handleClose = () => {
      modal.classList.remove('active')
      modalBody.innerHTML = ''
    }

    closeBtn.addEventListener('click', handleClose)
    modal.addEventListener('click', (e) => {
      if (e.target === modal) handleClose()
    })

    // Update UI after watching
    setTimeout(() => {
      this.renderVideoLibrary()
    }, 1000)
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
    // Additional filtering beyond the built-in filters
    console.log('Video library filters applied:', filters)
  }
} 