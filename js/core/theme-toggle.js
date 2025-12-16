/**
 * Nexus Bento - Theme Toggle
 * Dark/Light theme switching with system preference detection
 */

const ThemeToggle = {
  STORAGE_KEY: 'nexus-bento-theme',
  currentTheme: 'dark',

  init: () => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    const savedTheme = localStorage.getItem(ThemeToggle.STORAGE_KEY);
    ThemeToggle.currentTheme = savedTheme || systemTheme;

    ThemeToggle.applyTheme(ThemeToggle.currentTheme);
    ThemeToggle.bindEvents();

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      if (!localStorage.getItem(ThemeToggle.STORAGE_KEY)) {
        ThemeToggle.applyTheme(e.matches ? 'light' : 'dark');
      }
    });
  },

  applyTheme: (theme) => {
    ThemeToggle.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);

    // Update toggle buttons
    const toggles = document.querySelectorAll('[data-theme-toggle]');
    toggles.forEach(btn => {
      const icon = btn.querySelector('.theme-icon');
      const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

      btn.setAttribute('title', label);
      btn.setAttribute('aria-label', label);

      if (icon) {
        icon.innerHTML = theme === 'dark'
          ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>'
          : '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>';
      }
    });

    // Dispatch theme change event
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  },

  toggle: () => {
    const newTheme = ThemeToggle.currentTheme === 'dark' ? 'light' : 'dark';
    ThemeToggle.applyTheme(newTheme);
    localStorage.setItem(ThemeToggle.STORAGE_KEY, newTheme);
  },

  bindEvents: () => {
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', ThemeToggle.toggle);
    });
  },
};

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => ThemeToggle.init());

// Expose globally
if (typeof window !== 'undefined') {
  window.ThemeToggle = ThemeToggle;
}
