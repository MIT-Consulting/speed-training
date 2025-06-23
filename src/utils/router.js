/**
 * Router - Simple client-side routing for the Speed Training Dashboard
 * Handles navigation and URL management without page reloads
 */
export class Router {
  constructor() {
    this.routes = new Map()
    this.currentRoute = null
    this.basePath = ''
    this.isHandlingNotFound = false // Add guard for infinite recursion
    
    // Listen for browser navigation
    window.addEventListener('popstate', this.handlePopState.bind(this))
    
    // Initialize with current URL
    this.handleInitialRoute()
  }

  /**
   * Register a route with a handler
   */
  addRoute(path, handler) {
    this.routes.set(path, handler)
  }

  /**
   * Navigate to a route
   */
  navigateTo(path, state = {}) {
    const url = this.basePath + path
    
    // Update browser history
    window.history.pushState(state, '', url)
    
    // Execute route handler
    this.executeRoute(path, state)
  }

  /**
   * Replace current route
   */
  replaceTo(path, state = {}) {
    const url = this.basePath + path
    
    // Replace current history entry
    window.history.replaceState(state, '', url)
    
    // Execute route handler
    this.executeRoute(path, state)
  }

  /**
   * Go back in history
   */
  goBack() {
    window.history.back()
  }

  /**
   * Go forward in history
   */
  goForward() {
    window.history.forward()
  }

  /**
   * Handle browser back/forward buttons
   */
  handlePopState(event) {
    const path = this.getCurrentPath()
    const state = event.state || {}
    
    this.executeRoute(path, state)
  }

  /**
   * Handle initial route on page load
   */
  handleInitialRoute() {
    const path = this.getCurrentPath()
    this.executeRoute(path)
  }

  /**
   * Execute route handler
   */
  executeRoute(path, state = {}) {
    this.currentRoute = path
    
    // Find matching route handler
    const handler = this.routes.get(path)
    
    if (handler) {
      handler(state)
    } else {
      // Handle unknown routes
      this.handleNotFound(path)
    }
  }

  /**
   * Handle 404/not found routes
   */
  handleNotFound(path) {
    console.warn(`Route not found: ${path}`)
    
    // Prevent infinite recursion
    if (this.isHandlingNotFound) {
      console.error('Infinite recursion detected in router. Stopping navigation.')
      return
    }
    
    this.isHandlingNotFound = true
    
    // Check if dashboard route exists before redirecting
    if (this.routes.has('dashboard') && path !== 'dashboard') {
      this.navigateTo('dashboard')
    } else if (this.routes.has('') && path !== '') {
      // Try root route as fallback
      this.navigateTo('')
    } else {
      // No fallback available, just log the error
      console.error(`No fallback route available. Available routes:`, Array.from(this.routes.keys()))
    }
    
    this.isHandlingNotFound = false
  }

  /**
   * Get current path from URL
   */
  getCurrentPath() {
    const hash = window.location.hash
    
    if (hash.startsWith('#/')) {
      return hash.substring(2) // Remove '#/'
    } else if (hash.startsWith('#')) {
      return hash.substring(1) // Remove '#'
    }
    
    // Default to dashboard
    return 'dashboard'
  }

  /**
   * Generate URL for a path
   */
  generateUrl(path) {
    return this.basePath + '#/' + path
  }

  /**
   * Get current route
   */
  getCurrentRoute() {
    return this.currentRoute
  }

  /**
   * Check if current route matches
   */
  isCurrentRoute(path) {
    return this.currentRoute === path
  }

  /**
   * Parse route parameters (for future use with parameterized routes)
   */
  parseParams(pattern, path) {
    const patternParts = pattern.split('/')
    const pathParts = path.split('/')
    const params = {}

    if (patternParts.length !== pathParts.length) {
      return null
    }

    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i]
      const pathPart = pathParts[i]

      if (patternPart.startsWith(':')) {
        // This is a parameter
        const paramName = patternPart.substring(1)
        params[paramName] = pathPart
      } else if (patternPart !== pathPart) {
        // Parts don't match
        return null
      }
    }

    return params
  }

  /**
   * Add query parameters to current URL
   */
  addQueryParam(key, value) {
    const url = new URL(window.location)
    url.searchParams.set(key, value)
    window.history.replaceState({}, '', url)
  }

  /**
   * Remove query parameter from current URL
   */
  removeQueryParam(key) {
    const url = new URL(window.location)
    url.searchParams.delete(key)
    window.history.replaceState({}, '', url)
  }

  /**
   * Get query parameter value
   */
  getQueryParam(key) {
    const url = new URL(window.location)
    return url.searchParams.get(key)
  }

  /**
   * Get all query parameters
   */
  getQueryParams() {
    const url = new URL(window.location)
    const params = {}
    
    for (const [key, value] of url.searchParams) {
      params[key] = value
    }
    
    return params
  }

  /**
   * Set multiple query parameters
   */
  setQueryParams(params) {
    const url = new URL(window.location)
    
    // Clear existing params
    url.search = ''
    
    // Add new params
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.set(key, value)
      }
    })
    
    window.history.replaceState({}, '', url)
  }

  /**
   * Clear all query parameters
   */
  clearQueryParams() {
    const url = new URL(window.location)
    url.search = ''
    window.history.replaceState({}, '', url)
  }
} 