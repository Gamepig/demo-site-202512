/**
 * Nexus Bento - Application Entry Point
 * Initializes all core modules and features
 */

// ============================================
// App Initialization
// ============================================

const App = {
  version: '1.1.0',

  init: () => {
    console.log(`🚀 Nexus Bento v${App.version} initialized`);

    // Core features (from main.js)
    if (window.NexusBento) {
      const { Tabs, Dropdown, LazyLoad, Modal } = window.NexusBento;
      Tabs?.init();
      Dropdown?.init();
      LazyLoad?.init();
      Modal?.init();
    }

    // Theme toggle (from theme-toggle.js)
    if (window.ThemeToggle) {
      window.ThemeToggle.init();
    }

    // Navigation (from navigation.js)
    if (window.Navigation) {
      window.Navigation.init();
      window.Navigation.initScrollReveal();
    }

    // Effects modules (Phase 5)
    // ScrollStorytelling is auto-initialized
    // MicroDelights is auto-initialized
    // BentoInteractions is auto-initialized

    // Fallback: Initialize built-in effects if modules not loaded
    if (!window.BentoInteractions) {
      App.initBentoInteractions();
    }
    if (!window.MicroDelights) {
      App.initMagneticButtons();
      App.initCursorGlow();
    }
  },

  // Bento card 3D tilt effect
  initBentoInteractions: () => {
    const cards = document.querySelectorAll('.bento-item, .glass-card');

    cards.forEach(card => {
      if (card.classList.contains('no-tilt')) return;

      card.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 768) return; // Disable on mobile

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  },

  // Magnetic button effect
  initMagneticButtons: () => {
    const buttons = document.querySelectorAll('.btn-magnetic, .magnetic');

    buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  },

  // Cursor glow effect
  initCursorGlow: () => {
    const glowElements = document.querySelectorAll('.cursor-glow');

    glowElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        el.style.setProperty('--glow-x', `${x}px`);
        el.style.setProperty('--glow-y', `${y}px`);
      });
    });
  },

  // Public API for showing toasts
  toast: {
    success: (msg) => window.NexusBento?.Toast.success(msg),
    error: (msg) => window.NexusBento?.Toast.error(msg),
    warning: (msg) => window.NexusBento?.Toast.warning(msg),
    info: (msg) => window.NexusBento?.Toast.info(msg),
  },

  // Public API for modals
  modal: {
    show: (id) => window.NexusBento?.Modal.show(id),
    hide: (id) => window.NexusBento?.Modal.hide(id),
    create: (options) => window.NexusBento?.Modal.create(options),
  },
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', App.init);

// Global access
if (typeof window !== 'undefined') {
  window.App = App;
}
