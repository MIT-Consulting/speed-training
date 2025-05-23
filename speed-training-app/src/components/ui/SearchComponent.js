/**
 * SearchComponent - Enhanced search with semantic capabilities and summary integration
 * Features: Real-time search, result highlighting, movement pattern search, filters
 */

export class SearchComponent {
  constructor(dataProcessor, container) {
    this.dataProcessor = dataProcessor;
    this.container = container;
    this.searchInput = null;
    this.resultsContainer = null;
    this.currentResults = [];
    this.currentFilters = {};
    this.searchTimeout = null;
    this.isActive = false;
    
    this.init();
  }

  /**
   * Initialize the search component
   */
  init() {
    this.createSearchInterface();
    this.attachEventListeners();
  }

  /**
   * Create search interface HTML
   */
  createSearchInterface() {
    this.container.innerHTML = `
      <div class="search-wrapper">
        <div class="search-input-container">
          <input type="text" 
                 class="search-input" 
                 id="exercise-search" 
                 placeholder="Search exercises, movements, or descriptions..."
                 autocomplete="off"
                 spellcheck="false">
          <div class="search-icons">
            <button class="search-clear" id="search-clear" style="display: none;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
            <div class="search-loading" id="search-loading" style="display: none;">
              <div class="loading-spinner-small"></div>
            </div>
          </div>
        </div>
        
        <div class="search-filters" id="search-filters" style="display: none;">
          <div class="filter-group">
            <label>Focus Area:</label>
            <select id="focus-filter">
              <option value="">All Areas</option>
              <option value="Acceleration">Acceleration</option>
              <option value="Speed">Speed</option>
              <option value="Agility">Agility</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Complexity:</label>
            <select id="complexity-filter">
              <option value="">All Levels</option>
              <option value="1">Level 1 (Beginner)</option>
              <option value="2">Level 2 (Developing)</option>
              <option value="3">Level 3 (Intermediate)</option>
              <option value="4">Level 4 (Advanced)</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Equipment:</label>
            <select id="equipment-filter">
              <option value="">Any Equipment</option>
              <option value="hurdles">Hurdles</option>
              <option value="cones">Cones</option>
              <option value="wall">Wall</option>
              <option value="medicine ball">Medicine Ball</option>
              <option value="resistance band">Resistance Band</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Video:</label>
            <select id="video-filter">
              <option value="">All Exercises</option>
              <option value="true">With Video</option>
              <option value="false">Without Video</option>
            </select>
          </div>
          
          <button class="clear-filters-btn" id="clear-filters">Clear Filters</button>
        </div>
        
        <div class="search-suggestions" id="search-suggestions" style="display: none;">
          <div class="suggestions-header">
            <span>Popular searches:</span>
          </div>
          <div class="suggestions-list">
            <button class="suggestion-tag" data-query="sprint">Sprint</button>
            <button class="suggestion-tag" data-query="jump">Jump</button>
            <button class="suggestion-tag" data-query="lateral">Lateral</button>
            <button class="suggestion-tag" data-query="explosive">Explosive</button>
            <button class="suggestion-tag" data-query="coordination">Coordination</button>
            <button class="suggestion-tag" data-query="plyometric">Plyometric</button>
          </div>
        </div>
        
        <div class="search-results" id="search-results" style="display: none;">
          <div class="results-header" id="results-header">
            <span class="results-count">0 results</span>
            <button class="toggle-filters-btn" id="toggle-filters">
              <span>Filters</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>
          </div>
          <div class="results-list" id="results-list">
            <!-- Search results will be populated here -->
          </div>
        </div>
      </div>
    `;

    // Get references to elements
    this.searchInput = this.container.querySelector('#exercise-search');
    this.resultsContainer = this.container.querySelector('#search-results');
    this.resultsList = this.container.querySelector('#results-list');
    this.resultsHeader = this.container.querySelector('#results-header');
    this.resultsCount = this.container.querySelector('.results-count');
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Search input
    this.searchInput.addEventListener('input', (e) => {
      this.handleSearchInput(e.target.value);
    });

    this.searchInput.addEventListener('focus', () => {
      this.showSuggestions();
    });

    this.searchInput.addEventListener('blur', (e) => {
      // Delay hiding to allow clicking on results
      setTimeout(() => {
        if (!this.container.contains(document.activeElement)) {
          this.hideSuggestions();
        }
      }, 200);
    });

    // Clear button
    const clearBtn = this.container.querySelector('#search-clear');
    clearBtn.addEventListener('click', () => {
      this.clearSearch();
    });

    // Filter toggle
    const toggleFiltersBtn = this.container.querySelector('#toggle-filters');
    toggleFiltersBtn.addEventListener('click', () => {
      this.toggleFilters();
    });

    // Clear filters
    const clearFiltersBtn = this.container.querySelector('#clear-filters');
    clearFiltersBtn.addEventListener('click', () => {
      this.clearFilters();
    });

    // Filter inputs
    this.attachFilterListeners();

    // Suggestion tags
    const suggestionTags = this.container.querySelectorAll('.suggestion-tag');
    suggestionTags.forEach(tag => {
      tag.addEventListener('click', () => {
        const query = tag.getAttribute('data-query');
        this.executeSearch(query);
      });
    });

    // Click outside to close
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target)) {
        this.hideSuggestions();
        this.hideResults();
      }
    });
  }

  /**
   * Attach filter event listeners
   */
  attachFilterListeners() {
    const filters = ['focus-filter', 'complexity-filter', 'equipment-filter', 'video-filter'];
    
    filters.forEach(filterId => {
      const filterElement = this.container.querySelector(`#${filterId}`);
      if (filterElement) {
        filterElement.addEventListener('change', () => {
          this.updateFilters();
          this.performSearch();
        });
      }
    });
  }

  /**
   * Handle search input with debouncing
   */
  handleSearchInput(query) {
    // Clear existing timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Update clear button visibility
    const clearBtn = this.container.querySelector('#search-clear');
    clearBtn.style.display = query.length > 0 ? 'block' : 'none';

    // Show/hide suggestions
    if (query.length === 0) {
      this.showSuggestions();
      this.hideResults();
      return;
    } else {
      this.hideSuggestions();
    }

    // Debounce search
    this.searchTimeout = setTimeout(() => {
      this.performSearch(query);
    }, 300);

    // Show loading state for longer queries
    if (query.length > 2) {
      this.showLoading();
    }
  }

  /**
   * Perform the actual search
   */
  performSearch(query = null) {
    const searchQuery = query || this.searchInput.value.trim();
    
    if (searchQuery.length === 0) {
      this.hideResults();
      return;
    }

    this.showLoading();

    // Track search query
    if (this.dataProcessor.progressTracker) {
      this.dataProcessor.progressTracker.trackSearchQuery(searchQuery);
    }

    // Perform semantic search
    const searchResults = this.dataProcessor.semanticSearch(searchQuery);
    
    // Apply filters
    const filteredResults = this.applyFilters(searchResults);

    // Update current results
    this.currentResults = filteredResults;

    // Display results
    this.displayResults(filteredResults, searchQuery);
    
    this.hideLoading();
  }

  /**
   * Apply current filters to search results
   */
  applyFilters(searchResults) {
    return searchResults.filter(result => {
      const exercise = result.exercise;

      // Focus area filter
      if (this.currentFilters.focus && exercise.focusArea !== this.currentFilters.focus) {
        return false;
      }

      // Complexity filter
      if (this.currentFilters.complexity && exercise.complexity !== parseInt(this.currentFilters.complexity)) {
        return false;
      }

      // Equipment filter
      if (this.currentFilters.equipment && !exercise.equipment.includes(this.currentFilters.equipment)) {
        return false;
      }

      // Video filter
      if (this.currentFilters.video === 'true' && !exercise.hasVideo) {
        return false;
      }
      if (this.currentFilters.video === 'false' && exercise.hasVideo) {
        return false;
      }

      return true;
    });
  }

  /**
   * Update filters from form inputs
   */
  updateFilters() {
    this.currentFilters = {
      focus: this.container.querySelector('#focus-filter').value,
      complexity: this.container.querySelector('#complexity-filter').value,
      equipment: this.container.querySelector('#equipment-filter').value,
      video: this.container.querySelector('#video-filter').value
    };
  }

  /**
   * Display search results
   */
  displayResults(results, query) {
    this.resultsCount.textContent = `${results.length} result${results.length !== 1 ? 's' : ''}`;
    
    if (results.length === 0) {
      this.resultsList.innerHTML = `
        <div class="no-results">
          <p>No exercises found for "${query}"</p>
          <div class="search-suggestions-inline">
            <p>Try searching for:</p>
            <div class="suggestion-tags">
              <button class="suggestion-tag" data-query="acceleration">Acceleration</button>
              <button class="suggestion-tag" data-query="agility">Agility</button>
              <button class="suggestion-tag" data-query="plyometric">Plyometric</button>
            </div>
          </div>
        </div>
      `;
    } else {
      this.resultsList.innerHTML = results.map(result => this.createResultItem(result, query)).join('');
    }

    this.showResults();
    
    // Attach result item listeners
    this.attachResultListeners();
  }

  /**
   * Create individual result item HTML
   */
  createResultItem(result, query) {
    const exercise = result.exercise;
    const matchTypeIcon = this.getMatchTypeIcon(result.matchType);
    const complexityStars = '★'.repeat(exercise.complexity) + '☆'.repeat(4 - exercise.complexity);
    
    return `
      <div class="search-result-item" data-exercise-id="${exercise.id}">
        <div class="result-header">
          <div class="result-title">
            <span class="match-type-icon">${matchTypeIcon}</span>
            <h4 class="exercise-title">${this.highlightQuery(exercise.name, query)}</h4>
            <div class="result-meta">
              <span class="complexity-badge level-${exercise.complexity}">${complexityStars}</span>
              <span class="focus-badge" data-focus="${exercise.focusArea}">${exercise.focusArea}</span>
              ${exercise.hasVideo ? '<span class="video-badge">🎥</span>' : ''}
            </div>
          </div>
          <button class="view-exercise-btn" data-exercise-id="${exercise.id}">
            View Exercise
          </button>
        </div>
        
        <div class="result-content">
          <div class="result-excerpt">
            <p>${this.highlightQuery(result.excerpt, query)}</p>
          </div>
          
          <div class="result-details">
            <div class="exercise-info">
              ${exercise.setsReps ? `<span class="sets-reps">📋 ${exercise.setsReps}</span>` : ''}
              <span class="reading-time">📖 ${exercise.readingTime}s read</span>
              <span class="week-day">📅 Week ${exercise.weekNumber}, Day ${exercise.dayNumber}</span>
            </div>
            
            <div class="movement-tags">
              ${exercise.movementTags.map(tag => 
                `<span class="movement-tag">${this.highlightQuery(tag, query)}</span>`
              ).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Get icon for match type
   */
  getMatchTypeIcon(matchType) {
    const icons = {
      name: '🎯',
      summary: '📖',
      movement: '🏃',
      keyword: '🔍'
    };
    return icons[matchType] || '🔍';
  }

  /**
   * Highlight query terms in text
   */
  highlightQuery(text, query) {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  /**
   * Attach event listeners to result items
   */
  attachResultListeners() {
    // View exercise buttons
    const viewBtns = this.resultsList.querySelectorAll('.view-exercise-btn');
    viewBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const exerciseId = btn.getAttribute('data-exercise-id');
        this.navigateToExercise(exerciseId);
      });
    });

    // Result item clicks
    const resultItems = this.resultsList.querySelectorAll('.search-result-item');
    resultItems.forEach(item => {
      item.addEventListener('click', () => {
        const exerciseId = item.getAttribute('data-exercise-id');
        this.navigateToExercise(exerciseId);
      });
    });

    // Inline suggestion tags
    const inlineSuggestions = this.resultsList.querySelectorAll('.suggestion-tag');
    inlineSuggestions.forEach(tag => {
      tag.addEventListener('click', (e) => {
        e.stopPropagation();
        const query = tag.getAttribute('data-query');
        this.executeSearch(query);
      });
    });
  }

  /**
   * Navigate to specific exercise
   */
  navigateToExercise(exerciseId) {
    // Dispatch custom event for navigation
    document.dispatchEvent(new CustomEvent('navigateToExercise', {
      detail: { exerciseId }
    }));
    
    // Hide search results
    this.hideResults();
  }

  /**
   * Execute search with specific query
   */
  executeSearch(query) {
    this.searchInput.value = query;
    this.hideSuggestions();
    this.performSearch(query);
  }

  /**
   * Clear search
   */
  clearSearch() {
    this.searchInput.value = '';
    this.hideResults();
    this.showSuggestions();
    
    const clearBtn = this.container.querySelector('#search-clear');
    clearBtn.style.display = 'none';
  }

  /**
   * Clear all filters
   */
  clearFilters() {
    const filters = ['focus-filter', 'complexity-filter', 'equipment-filter', 'video-filter'];
    
    filters.forEach(filterId => {
      const filterElement = this.container.querySelector(`#${filterId}`);
      if (filterElement) {
        filterElement.value = '';
      }
    });

    this.currentFilters = {};
    this.performSearch();
  }

  /**
   * Toggle filters visibility
   */
  toggleFilters() {
    const filtersContainer = this.container.querySelector('#search-filters');
    const toggleBtn = this.container.querySelector('#toggle-filters');
    const isVisible = filtersContainer.style.display !== 'none';
    
    filtersContainer.style.display = isVisible ? 'none' : 'block';
    
    // Update button state
    toggleBtn.classList.toggle('active', !isVisible);
  }

  /**
   * Show suggestions
   */
  showSuggestions() {
    const suggestions = this.container.querySelector('#search-suggestions');
    if (this.searchInput.value.length === 0) {
      suggestions.style.display = 'block';
    }
  }

  /**
   * Hide suggestions
   */
  hideSuggestions() {
    const suggestions = this.container.querySelector('#search-suggestions');
    suggestions.style.display = 'none';
  }

  /**
   * Show search results
   */
  showResults() {
    this.resultsContainer.style.display = 'block';
    this.isActive = true;
  }

  /**
   * Hide search results
   */
  hideResults() {
    this.resultsContainer.style.display = 'none';
    this.isActive = false;
  }

  /**
   * Show loading state
   */
  showLoading() {
    const loading = this.container.querySelector('#search-loading');
    loading.style.display = 'block';
  }

  /**
   * Hide loading state
   */
  hideLoading() {
    const loading = this.container.querySelector('#search-loading');
    loading.style.display = 'none';
  }

  /**
   * Get current search state
   */
  getSearchState() {
    return {
      query: this.searchInput.value,
      filters: this.currentFilters,
      results: this.currentResults,
      isActive: this.isActive
    };
  }

  /**
   * Set search query programmatically
   */
  setSearchQuery(query) {
    this.searchInput.value = query;
    this.performSearch(query);
  }

  /**
   * Get popular search terms
   */
  getPopularSearches() {
    // This could be enhanced to track actual popular searches
    return [
      'sprint', 'jump', 'lateral', 'explosive', 
      'coordination', 'plyometric', 'acceleration', 
      'agility', 'balance', 'power'
    ];
  }

  /**
   * Export search data
   */
  exportSearchData() {
    return {
      recentSearches: [], // Could be implemented
      popularSearches: this.getPopularSearches(),
      currentState: this.getSearchState()
    };
  }

  /**
   * Destroy component and clean up
   */
  destroy() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    // Remove event listeners
    document.removeEventListener('click', this.handleDocumentClick);
    
    // Clear container
    this.container.innerHTML = '';
  }
} 