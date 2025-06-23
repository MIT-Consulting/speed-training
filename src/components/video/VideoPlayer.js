/**
 * VideoPlayer - Enhanced YouTube video player component
 * Features: Lazy loading, progress tracking, accessibility, custom controls
 */

export class VideoPlayer {
  constructor(videoUrl, container, options = {}) {
    this.videoUrl = videoUrl;
    this.container = container;
    this.options = {
      autoplay: false,
      controls: true,
      modestbranding: true,
      rel: 0,
      enablejsapi: 1,
      ...options
    };
    
    this.player = null;
    this.videoId = this.extractVideoId(videoUrl);
    this.isLoaded = false;
    this.isPlaying = false;
    this.duration = 0;
    this.currentTime = 0;
    
    // Callbacks
    this.onReady = null;
    this.onStateChange = null;
    this.onVideoEnd = null;
    this.onProgress = null;
    
    this.init();
  }

  /**
   * Initialize the video player
   */
  async init() {
    if (!this.videoId || !this.container) {
      console.error('Invalid video URL or container');
      return;
    }

    // Create player container
    this.createPlayerContainer();
    
    // Load YouTube API if not already loaded
    await this.loadYouTubeAPI();
    
    // Initialize player
    this.createPlayer();
  }

  /**
   * Create player container HTML
   */
  createPlayerContainer() {
    this.container.innerHTML = `
      <div class="video-player-wrapper">
        <div class="video-player-loading" id="loading-${this.videoId}">
          <div class="loading-spinner"></div>
          <p>Loading video...</p>
        </div>
        <div class="video-player-iframe" id="player-${this.videoId}"></div>
        <div class="video-player-overlay" id="overlay-${this.videoId}">
          <button class="video-play-button" id="play-btn-${this.videoId}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <span>Play Video</span>
          </button>
        </div>
        <div class="video-player-error" id="error-${this.videoId}" style="display: none;">
          <p>Unable to load video. Please check your connection and try again.</p>
          <button class="retry-btn" id="retry-${this.videoId}">Retry</button>
        </div>
      </div>
    `;

    // Add click handler for overlay
    const overlay = this.container.querySelector(`#overlay-${this.videoId}`);
    const playBtn = this.container.querySelector(`#play-btn-${this.videoId}`);
    const retryBtn = this.container.querySelector(`#retry-${this.videoId}`);

    if (overlay) {
      overlay.addEventListener('click', () => this.loadAndPlay());
    }

    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.loadAndPlay();
      });
    }

    if (retryBtn) {
      retryBtn.addEventListener('click', () => this.retry());
    }
  }

  /**
   * Load YouTube iframe API
   */
  loadYouTubeAPI() {
    return new Promise((resolve, reject) => {
      // Check if API is already loaded
      if (window.YT && window.YT.Player) {
        resolve();
        return;
      }

      // Check if script is already loading
      if (window.YTScriptLoading) {
        // Wait for existing script to load
        const checkLoaded = () => {
          if (window.YT && window.YT.Player) {
            resolve();
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
        return;
      }

      // Mark as loading
      window.YTScriptLoading = true;

      // Create script element
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      
      // Set up callback for when API is ready
      window.onYouTubeIframeAPIReady = () => {
        window.YTScriptLoading = false;
        resolve();
      };

      script.onerror = () => {
        window.YTScriptLoading = false;
        reject(new Error('Failed to load YouTube API'));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Create YouTube player
   */
  createPlayer() {
    if (!window.YT || !window.YT.Player) {
      console.error('YouTube API not loaded');
      this.showError();
      return;
    }

    try {
      this.player = new window.YT.Player(`player-${this.videoId}`, {
        height: '315',
        width: '560',
        videoId: this.videoId,
        playerVars: {
          ...this.options,
          origin: window.location.origin
        },
        events: {
          onReady: this.onPlayerReady.bind(this),
          onStateChange: this.onPlayerStateChange.bind(this),
          onError: this.onPlayerError.bind(this)
        }
      });
    } catch (error) {
      console.error('Error creating YouTube player:', error);
      this.showError();
    }
  }

  /**
   * Handle player ready event
   */
  onPlayerReady(event) {
    this.isLoaded = true;
    this.duration = this.player.getDuration();
    
    // Hide loading indicator
    const loading = this.container.querySelector(`#loading-${this.videoId}`);
    if (loading) loading.style.display = 'none';

    // Hide overlay
    const overlay = this.container.querySelector(`#overlay-${this.videoId}`);
    if (overlay) overlay.style.display = 'none';

    // Show player
    const playerDiv = this.container.querySelector(`#player-${this.videoId}`);
    if (playerDiv) playerDiv.style.display = 'block';

    // Set up progress tracking
    this.startProgressTracking();

    // Call ready callback
    if (this.onReady) {
      this.onReady(event);
    }

    console.log('Video player ready:', this.videoId);
  }

  /**
   * Handle player state change
   */
  onPlayerStateChange(event) {
    const state = event.data;
    
    switch (state) {
      case window.YT.PlayerState.PLAYING:
        this.isPlaying = true;
        break;
      case window.YT.PlayerState.PAUSED:
        this.isPlaying = false;
        break;
      case window.YT.PlayerState.ENDED:
        this.isPlaying = false;
        if (this.onVideoEnd) {
          this.onVideoEnd();
        }
        break;
      case window.YT.PlayerState.BUFFERING:
        // Handle buffering if needed
        break;
    }

    // Call state change callback
    if (this.onStateChange) {
      this.onStateChange(event);
    }
  }

  /**
   * Handle player error
   */
  onPlayerError(event) {
    console.error('YouTube player error:', event.data);
    this.showError();
  }

  /**
   * Show error state
   */
  showError() {
    const loading = this.container.querySelector(`#loading-${this.videoId}`);
    const overlay = this.container.querySelector(`#overlay-${this.videoId}`);
    const error = this.container.querySelector(`#error-${this.videoId}`);

    if (loading) loading.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
    if (error) error.style.display = 'block';
  }

  /**
   * Load and play video (lazy loading)
   */
  async loadAndPlay() {
    if (!this.isLoaded) {
      // Show loading state
      const overlay = this.container.querySelector(`#overlay-${this.videoId}`);
      const loading = this.container.querySelector(`#loading-${this.videoId}`);
      
      if (overlay) overlay.style.display = 'none';
      if (loading) loading.style.display = 'block';

      // Wait for player to be ready
      await this.waitForPlayerReady();
    }

    // Play video
    if (this.player && this.player.playVideo) {
      this.player.playVideo();
    }
  }

  /**
   * Wait for player to be ready
   */
  waitForPlayerReady() {
    return new Promise((resolve) => {
      const checkReady = () => {
        if (this.isLoaded) {
          resolve();
        } else {
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
    });
  }

  /**
   * Retry loading the video
   */
  retry() {
    const error = this.container.querySelector(`#error-${this.videoId}`);
    const overlay = this.container.querySelector(`#overlay-${this.videoId}`);
    
    if (error) error.style.display = 'none';
    if (overlay) overlay.style.display = 'block';

    // Reset player
    this.isLoaded = false;
    this.player = null;
    
    // Recreate player
    this.createPlayer();
  }

  /**
   * Start progress tracking
   */
  startProgressTracking() {
    this.progressInterval = setInterval(() => {
      if (this.player && this.isPlaying) {
        try {
          this.currentTime = this.player.getCurrentTime();
          
          if (this.onProgress) {
            this.onProgress({
              currentTime: this.currentTime,
              duration: this.duration,
              percentage: (this.currentTime / this.duration) * 100
            });
          }
        } catch (error) {
          // Player might not be ready yet
        }
      }
    }, 1000);
  }

  /**
   * Stop progress tracking
   */
  stopProgressTracking() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  /**
   * Extract video ID from YouTube URL
   */
  extractVideoId(url) {
    if (!url) return null;
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  /**
   * Play video
   */
  play() {
    if (this.player && this.player.playVideo) {
      this.player.playVideo();
    } else {
      this.loadAndPlay();
    }
  }

  /**
   * Pause video
   */
  pause() {
    if (this.player && this.player.pauseVideo) {
      this.player.pauseVideo();
    }
  }

  /**
   * Stop video
   */
  stop() {
    if (this.player && this.player.stopVideo) {
      this.player.stopVideo();
    }
  }

  /**
   * Seek to specific time
   */
  seekTo(seconds) {
    if (this.player && this.player.seekTo) {
      this.player.seekTo(seconds, true);
    }
  }

  /**
   * Set volume (0-100)
   */
  setVolume(volume) {
    if (this.player && this.player.setVolume) {
      this.player.setVolume(Math.max(0, Math.min(100, volume)));
    }
  }

  /**
   * Get current time
   */
  getCurrentTime() {
    if (this.player && this.player.getCurrentTime) {
      return this.player.getCurrentTime();
    }
    return 0;
  }

  /**
   * Get duration
   */
  getDuration() {
    if (this.player && this.player.getDuration) {
      return this.player.getDuration();
    }
    return this.duration;
  }

  /**
   * Get video URL
   */
  getVideoUrl() {
    if (this.player && this.player.getVideoUrl) {
      return this.player.getVideoUrl();
    }
    return this.videoUrl;
  }

  /**
   * Enter fullscreen
   */
  enterFullscreen() {
    const playerElement = this.container.querySelector(`#player-${this.videoId}`);
    if (playerElement) {
      if (playerElement.requestFullscreen) {
        playerElement.requestFullscreen();
      } else if (playerElement.webkitRequestFullscreen) {
        playerElement.webkitRequestFullscreen();
      } else if (playerElement.msRequestFullscreen) {
        playerElement.msRequestFullscreen();
      }
    }
  }

  /**
   * Exit fullscreen
   */
  exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }

  /**
   * Toggle fullscreen
   */
  toggleFullscreen() {
    if (document.fullscreenElement) {
      this.exitFullscreen();
    } else {
      this.enterFullscreen();
    }
  }

  /**
   * Set playback rate
   */
  setPlaybackRate(rate) {
    if (this.player && this.player.setPlaybackRate) {
      this.player.setPlaybackRate(rate);
    }
  }

  /**
   * Get available playback rates
   */
  getAvailablePlaybackRates() {
    if (this.player && this.player.getAvailablePlaybackRates) {
      return this.player.getAvailablePlaybackRates();
    }
    return [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  }

  /**
   * Mute video
   */
  mute() {
    if (this.player && this.player.mute) {
      this.player.mute();
    }
  }

  /**
   * Unmute video
   */
  unMute() {
    if (this.player && this.player.unMute) {
      this.player.unMute();
    }
  }

  /**
   * Check if video is muted
   */
  isMuted() {
    if (this.player && this.player.isMuted) {
      return this.player.isMuted();
    }
    return false;
  }

  /**
   * Get video title
   */
  getVideoTitle() {
    if (this.player && this.player.getVideoData) {
      const data = this.player.getVideoData();
      return data.title || 'Exercise Demonstration';
    }
    return 'Exercise Demonstration';
  }

  /**
   * Get video thumbnail URL
   */
  getThumbnailUrl(quality = 'mqdefault') {
    if (this.videoId) {
      return `https://img.youtube.com/vi/${this.videoId}/${quality}.jpg`;
    }
    return null;
  }

  /**
   * Check if video is playing
   */
  isVideoPlaying() {
    return this.isPlaying;
  }

  /**
   * Check if video is loaded
   */
  isVideoLoaded() {
    return this.isLoaded;
  }

  /**
   * Get player state
   */
  getPlayerState() {
    if (this.player && this.player.getPlayerState) {
      return this.player.getPlayerState();
    }
    return -1; // Unstarted
  }

  /**
   * Add event listener
   */
  addEventListener(event, callback) {
    switch (event) {
      case 'ready':
        this.onReady = callback;
        break;
      case 'statechange':
        this.onStateChange = callback;
        break;
      case 'ended':
        this.onVideoEnd = callback;
        break;
      case 'progress':
        this.onProgress = callback;
        break;
    }
  }

  /**
   * Remove event listener
   */
  removeEventListener(event) {
    switch (event) {
      case 'ready':
        this.onReady = null;
        break;
      case 'statechange':
        this.onStateChange = null;
        break;
      case 'ended':
        this.onVideoEnd = null;
        break;
      case 'progress':
        this.onProgress = null;
        break;
    }
  }

  /**
   * Resize player
   */
  resize(width, height) {
    if (this.player && this.player.setSize) {
      this.player.setSize(width, height);
    }
  }

  /**
   * Update video URL
   */
  updateVideo(newVideoUrl) {
    const newVideoId = this.extractVideoId(newVideoUrl);
    
    if (newVideoId && newVideoId !== this.videoId) {
      this.videoUrl = newVideoUrl;
      this.videoId = newVideoId;
      
      if (this.player && this.player.loadVideoById) {
        this.player.loadVideoById(this.videoId);
      } else {
        // Recreate player with new video
        this.destroy();
        this.init();
      }
    }
  }

  /**
   * Destroy player and clean up
   */
  destroy() {
    // Stop progress tracking
    this.stopProgressTracking();
    
    // Destroy YouTube player
    if (this.player && this.player.destroy) {
      try {
        this.player.destroy();
      } catch (error) {
        console.warn('Error destroying YouTube player:', error);
      }
    }
    
    // Clear container
    if (this.container) {
      this.container.innerHTML = '';
    }
    
    // Reset state
    this.player = null;
    this.isLoaded = false;
    this.isPlaying = false;
    this.onReady = null;
    this.onStateChange = null;
    this.onVideoEnd = null;
    this.onProgress = null;
  }

  /**
   * Get video embed URL
   */
  getEmbedUrl(options = {}) {
    if (!this.videoId) return null;
    
    const params = new URLSearchParams({
      enablejsapi: '1',
      origin: window.location.origin,
      rel: '0',
      modestbranding: '1',
      ...this.options,
      ...options
    });
    
    return `https://www.youtube.com/embed/${this.videoId}?${params.toString()}`;
  }

  /**
   * Create static thumbnail with play button
   */
  createThumbnail() {
    const thumbnailUrl = this.getThumbnailUrl();
    
    return `
      <div class="video-thumbnail" onclick="this.loadAndPlay()">
        <img src="${thumbnailUrl}" alt="Video thumbnail" loading="lazy">
        <div class="play-overlay">
          <svg width="68" height="48" viewBox="0 0 68 48">
            <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path>
            <path d="M 45,24 27,14 27,34" fill="#fff"></path>
          </svg>
        </div>
      </div>
    `;
  }
} 