/**
 * SearchComponent - Handles exercise search functionality
 */
export class SearchComponent {
  constructor(dataProcessor) {
    this.dataProcessor = dataProcessor
    this.searchResults = []
    this.currentQuery = ''
    
    this.init()
  }

  /**
   * Initialize search component
   */
  init() {
    // Search functionality is handled by event listeners in main app
    // This component provides the search logic
  }

  /**
   * Handle search input
   */
  handleSearch(query) {
    this.currentQuery = query.trim()
    
    if (this.currentQuery.length === 0) {
      this.clearSearch()
      return
    }

    if (this.currentQuery.length < 2) {
      // Don't search for single characters
      return
    }

    this.performSearch(this.currentQuery)
    this.showSearchResults()
  }

  /**
   * Perform the actual search
   */
  performSearch(query) {
    this.searchResults = this.dataProcessor.searchExercises(query)
  }

  /**
   * Show search results
   */
  showSearchResults() {
    // Create or update search results container
    let resultsContainer = document.getElementById('search-results')
    
    if (!resultsContainer) {
      resultsContainer = this.createSearchResultsContainer()
    }

    if (this.searchResults.length === 0) {
      resultsContainer.innerHTML = `
        <div class="search-no-results">
          <p>No exercises found for "${this.currentQuery}"</p>
        </div>
      `
    } else {
      const resultsHtml = `
        <div class="search-results-header">
          <h3>Search Results</h3>
          <span class="results-count">${this.searchResults.length} exercise${this.searchResults.length !== 1 ? 's' : ''} found</span>
        </div>
        <div class="search-results-list">
          ${this.searchResults.map(exercise => this.renderSearchResult(exercise)).join('')}
        </div>
      `
      resultsContainer.innerHTML = resultsHtml
    }

    resultsContainer.classList.add('active')
    this.setupSearchResultInteractions()
  }

  /**
   * Render individual search result
   */
  renderSearchResult(exercise) {
    const day = this.dataProcessor.getDay(exercise.weekNumber, exercise.dayNumber)
    const focusIcon = this.getFocusIcon(day?.focus)

    return `
      <div class="search-result-item" 
           data-week="${exercise.weekNumber}" 
           data-day="${exercise.dayNumber}"
           data-exercise-id="${exercise.id}">
        <div class="result-header">
          <h4 class="result-title">${exercise.name}</h4>
          <div class="result-meta">
            <span class="result-location">
              ${focusIcon} Week ${exercise.weekNumber}, Day ${exercise.dayNumber}
            </span>
            ${exercise.hasVideo ? '<span class="result-video">🎥</span>' : ''}
          </div>
        </div>
        
        <div class="result-content">
          <div class="result-block">${exercise.blockName}</div>
          ${exercise.setsReps ? `<div class="result-sets">${exercise.setsReps}</div>` : ''}
          ${exercise.notes ? `<div class="result-notes">${exercise.notes}</div>` : ''}
        </div>
        
        <div class="result-actions">
          <button class="result-goto-btn" 
                  data-week="${exercise.weekNumber}" 
                  data-day="${exercise.dayNumber}">
            Go to Exercise
          </button>
        </div>
      </div>
    `
  }

  /**
   * Create search results container
   */
  createSearchResultsContainer() {
    const container = document.createElement('div')
    container.id = 'search-results'
    container.className = 'search-results-container'
    
    // Insert after the search container
    const searchContainer = document.querySelector('.search-container')
    if (searchContainer && searchContainer.parentNode) {
      searchContainer.parentNode.insertBefore(container, searchContainer.nextSibling)
    }
    
    return container
  }

  /**
   * Setup search result interactions
   */
  setupSearchResultInteractions() {
    const gotoBtns = document.querySelectorAll('.result-goto-btn')
    const resultItems = document.querySelectorAll('.search-result-item')
    
    // Goto button clicks
    gotoBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        
        const weekNumber = parseInt(btn.dataset.week)
        const dayNumber = parseInt(btn.dataset.day)
        
        if (window.speedTrainingApp) {
          window.speedTrainingApp.showDay(weekNumber, dayNumber)
          this.clearSearch()
        }
      })
    })

    // Result item clicks
    resultItems.forEach(item => {
      item.addEventListener('click', () => {
        const weekNumber = parseInt(item.dataset.week)
        const dayNumber = parseInt(item.dataset.day)
        
        if (window.speedTrainingApp) {
          window.speedTrainingApp.showDay(weekNumber, dayNumber)
          this.clearSearch()
        }
      })
    })
  }

  /**
   * Clear search results
   */
  clearSearch() {
    this.currentQuery = ''
    this.searchResults = []
    
    const resultsContainer = document.getElementById('search-results')
    if (resultsContainer) {
      resultsContainer.classList.remove('active')
      resultsContainer.innerHTML = ''
    }
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
   * Get search suggestions (for future enhancement)
   */
  getSearchSuggestions(query) {
    // Could implement autocomplete suggestions based on exercise names
    const allExercises = this.dataProcessor.getAllExercises()
    const suggestions = []
    
    allExercises.forEach(exercise => {
      if (exercise.name.toLowerCase().includes(query.toLowerCase())) {
        suggestions.push(exercise.name)
      }
    })
    
    return [...new Set(suggestions)].slice(0, 5) // Remove duplicates and limit to 5
  }
} 