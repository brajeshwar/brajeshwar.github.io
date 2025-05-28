class ThemeToggle extends HTMLElement {
  constructor() {
    super();
    this.themes = ['auto', 'light', 'dark'];
    this.currentThemeIndex = 0;
    this.init();
  }

  init() {
    // Create button element
    this.button = document.createElement('button');
    this.button.setAttribute('aria-label', 'Toggle theme');
    this.button.classList.add('theme-toggle');

    // Create icon container
    this.iconContainer = document.createElement('span');
    this.iconContainer.classList.add('theme-toggle-icon');
    this.button.appendChild(this.iconContainer);

    // Add click handler
    this.button.addEventListener('click', () => this.toggleTheme());

    // Add button to component
    this.appendChild(this.button);

    // Set initial theme
    this.setTheme(this.getCurrentTheme());
  }

  getCurrentTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && this.themes.includes(savedTheme)) {
      this.currentThemeIndex = this.themes.indexOf(savedTheme);
      return savedTheme;
    }
    return 'auto';
  }

  setTheme(theme) {
    // Remove any existing theme classes
    document.documentElement.classList.remove('theme-light', 'theme-dark');

    if (theme === 'light') {
      document.documentElement.classList.add('theme-light');
    } else if (theme === 'dark') {
      document.documentElement.classList.add('theme-dark');
    } else {
      // Auto theme - use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
    }

    // Update icon
    this.updateIcon(theme);

    // Save theme preference
    localStorage.setItem('theme', theme);
  }

  updateIcon(theme) {
    const icons = {
      auto: `<svg viewBox="0 0 24 24" width="24" height="24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
        <path fill="currentColor" d="M12,2v20c5.523,0,10-4.477,10-10S17.523,2,12,2z"/>
      </svg>`,
      light: `<svg viewBox="0 0 24 24" width="24" height="24">
        <path fill="currentColor" d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
      </svg>`,
      dark: `<svg viewBox="0 0 24 24" width="24" height="24">
        <path fill="currentColor" d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
      </svg>`
    };

    this.iconContainer.innerHTML = icons[theme];
  }

  toggleTheme() {
    this.currentThemeIndex = (this.currentThemeIndex + 1) % this.themes.length;
    const newTheme = this.themes[this.currentThemeIndex];
    this.setTheme(newTheme);
  }
}

// Register custom element
customElements.define('mode-toggle', ThemeToggle);
