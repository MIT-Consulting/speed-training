/**
 * ThemeManager - Handles theme switching and persistence
 * Manages light/dark mode with system preference detection
 */
export class ThemeManager {
  constructor() {
    this.storageKey = 'speed-training-theme'
    this.themes = ['light', 'dark', 'system']
    this.currentTheme = this.loadTheme()
    
    // Listen for system theme changes
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    this.mediaQuery.addEventListener('change', this.handleSystemThemeChange.bind(this))
    
    // Apply initial theme
    this.applyTheme()
    
    // Update theme toggle icon
    this.updateThemeIcon()
  }

  /**
   * Load theme preference from localStorage
   */
  loadTheme() {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored && this.themes.includes(stored)) {
        return stored
      }
    } catch (error) {
      console.error('Error loading theme:', error)
    }
    
    // Default to system theme
    return 'system'
  }

  /**
   * Save theme preference to localStorage
   */
  saveTheme() {
    try {
      localStorage.setItem(this.storageKey, this.currentTheme)
    } catch (error) {
      console.error('Error saving theme:', error)
    }
  }

  /**
   * Get the effective theme (resolves 'system' to actual theme)
   */
  getEffectiveTheme() {
    if (this.currentTheme === 'system') {
      return this.mediaQuery.matches ? 'dark' : 'light'
    }
    return this.currentTheme
  }

  /**
   * Apply the current theme to the document
   */
  applyTheme() {
    const effectiveTheme = this.getEffectiveTheme()
    
    // Update document data attribute
    document.documentElement.setAttribute('data-theme', effectiveTheme)
    
    // Update body class for legacy support
    document.body.classList.remove('theme-light', 'theme-dark')
    document.body.classList.add(`theme-${effectiveTheme}`)
    
    // Dispatch theme change event
    this.dispatchThemeChangeEvent(effectiveTheme)
  }

  /**
   * Toggle between themes
   */
  toggleTheme() {
    const themeOrder = ['light', 'dark', 'system']
    const currentIndex = themeOrder.indexOf(this.currentTheme)
    const nextIndex = (currentIndex + 1) % themeOrder.length
    
    this.setTheme(themeOrder[nextIndex])
  }

  /**
   * Set a specific theme
   */
  setTheme(theme) {
    if (!this.themes.includes(theme)) {
      console.warn(`Invalid theme: ${theme}`)
      return
    }

    this.currentTheme = theme
    this.applyTheme()
    this.saveTheme()
    this.updateThemeIcon()
    
    // Add smooth transition
    this.addTransition()
  }

  /**
   * Handle system theme changes
   */
  handleSystemThemeChange() {
    if (this.currentTheme === 'system') {
      this.applyTheme()
      this.updateThemeIcon()
    }
  }

  /**
   * Update theme toggle icon
   */
  updateThemeIcon() {
    const themeToggle = document.getElementById('theme-toggle')
    const themeIcon = document.querySelector('.theme-icon')
    
    if (!themeIcon) return

    const effectiveTheme = this.getEffectiveTheme()
    const icons = {
      light: '🌙',
      dark: '☀️',
      system: '🔄'
    }

    // Use the icon for the NEXT theme in cycle
    const themeOrder = ['light', 'dark', 'system']
    const currentIndex = themeOrder.indexOf(this.currentTheme)
    const nextIndex = (currentIndex + 1) % themeOrder.length
    const nextTheme = themeOrder[nextIndex]

    themeIcon.textContent = icons[nextTheme]
    
    // Update tooltip/aria-label
    if (themeToggle) {
      const labels = {
        light: 'Switch to dark mode',
        dark: 'Switch to system theme',
        system: 'Switch to light mode'
      }
      themeToggle.setAttribute('aria-label', labels[nextTheme])
      themeToggle.setAttribute('title', labels[nextTheme])
    }
  }

  /**
   * Add smooth transition for theme changes
   */
  addTransition() {
    const css = document.createElement('style')
    css.textContent = `
      *, *::before, *::after {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
      }
    `
    document.head.appendChild(css)

    // Remove transition after animation
    setTimeout(() => {
      document.head.removeChild(css)
    }, 300)
  }

  /**
   * Dispatch custom theme change event
   */
  dispatchThemeChangeEvent(effectiveTheme) {
    const event = new CustomEvent('themechange', {
      detail: {
        theme: this.currentTheme,
        effectiveTheme: effectiveTheme,
        isDark: effectiveTheme === 'dark'
      }
    })
    
    document.dispatchEvent(event)
  }

  /**
   * Get current theme
   */
  getCurrentTheme() {
    return this.currentTheme
  }

  /**
   * Check if current effective theme is dark
   */
  isDarkMode() {
    return this.getEffectiveTheme() === 'dark'
  }

  /**
   * Check if current effective theme is light
   */
  isLightMode() {
    return this.getEffectiveTheme() === 'light'
  }

  /**
   * Check if using system theme
   */
  isSystemTheme() {
    return this.currentTheme === 'system'
  }

  /**
   * Get system preference
   */
  getSystemPreference() {
    return this.mediaQuery.matches ? 'dark' : 'light'
  }

  /**
   * Force theme update (useful for debugging)
   */
  forceUpdate() {
    this.applyTheme()
    this.updateThemeIcon()
  }

  /**
   * Reset to system theme
   */
  resetToSystem() {
    this.setTheme('system')
  }

  /**
   * Get theme statistics
   */
  getThemeStats() {
    return {
      currentTheme: this.currentTheme,
      effectiveTheme: this.getEffectiveTheme(),
      systemPreference: this.getSystemPreference(),
      isDark: this.isDarkMode(),
      isLight: this.isLightMode(),
      isSystem: this.isSystemTheme(),
      supportsSystemDetection: !!window.matchMedia
    }
  }

  /**
   * Add theme change listener
   */
  addEventListener(callback) {
    document.addEventListener('themechange', callback)
  }

  /**
   * Remove theme change listener
   */
  removeEventListener(callback) {
    document.removeEventListener('themechange', callback)
  }

  /**
   * Cleanup (remove event listeners)
   */
  destroy() {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.handleSystemThemeChange.bind(this))
    }
  }
} 