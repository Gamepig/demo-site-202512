/**
 * Nexus Bento - Core Utilities
 * DOM, Events, Storage, Toast, Modal utilities
 */

// ============================================
// 1. DOM Utilities
// ============================================

const DOM = {
  select: (selector) => document.querySelector(selector),
  selectAll: (selector) => document.querySelectorAll(selector),

  create: (tag, classes = '', html = '') => {
    const el = document.createElement(tag);
    if (classes) el.className = classes;
    if (html) el.innerHTML = html;
    return el;
  },

  addClass: (el, className) => el?.classList.add(className),
  removeClass: (el, className) => el?.classList.remove(className),
  toggleClass: (el, className) => el?.classList.toggle(className),
  hasClass: (el, className) => el?.classList.contains(className),
};

// ============================================
// 2. Event Utilities
// ============================================

const Events = {
  on: (el, event, handler) => el?.addEventListener(event, handler),
  off: (el, event, handler) => el?.removeEventListener(event, handler),

  trigger: (el, eventName, detail = {}) => {
    el?.dispatchEvent(new CustomEvent(eventName, { detail, bubbles: true }));
  },

  debounce: (func, delay = 300) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  },

  throttle: (func, limit = 300) => {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },
};

// ============================================
// 3. Storage Utilities
// ============================================

const Storage = {
  get: (key) => {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch {
      return localStorage.getItem(key);
    }
  },

  set: (key, value) => {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  },

  remove: (key) => localStorage.removeItem(key),
  clear: () => localStorage.clear(),
};

// ============================================
// 4. Toast System (Glassmorphism Style)
// ============================================

const Toast = {
  container: null,

  init: () => {
    if (!Toast.container) {
      Toast.container = DOM.create('div', 'toast-container');
      document.body.appendChild(Toast.container);
    }
  },

  show: (message, type = 'info', duration = 3000) => {
    Toast.init();

    const icons = {
      success: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>',
      error: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>',
      warning: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>',
      info: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
    };

    const colors = {
      success: 'var(--color-success-500)',
      error: 'var(--color-error-500)',
      warning: 'var(--color-warning-500)',
      info: 'var(--color-primary-500)',
    };

    const toast = DOM.create('div', `toast toast-${type}`, `
      <div class="toast-icon" style="color: ${colors[type]}">${icons[type]}</div>
      <div class="toast-content">
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Close">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    `);

    Toast.container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => toast.classList.add('toast-visible'));

    // Close handler
    const closeBtn = toast.querySelector('.toast-close');
    const removeToast = () => {
      toast.classList.remove('toast-visible');
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    };

    Events.on(closeBtn, 'click', removeToast);

    // Auto-close
    if (duration > 0) {
      setTimeout(removeToast, duration);
    }

    return toast;
  },

  success: (msg, duration) => Toast.show(msg, 'success', duration),
  error: (msg, duration) => Toast.show(msg, 'error', duration),
  warning: (msg, duration) => Toast.show(msg, 'warning', duration),
  info: (msg, duration) => Toast.show(msg, 'info', duration),
};

// ============================================
// 5. Modal System (Glassmorphism Style)
// ============================================

const Modal = {
  show: (id) => {
    const modal = DOM.select(`#${id}`);
    if (modal) {
      modal.classList.add('modal-visible');
      document.body.style.overflow = 'hidden';
    }
  },

  hide: (id) => {
    const modal = DOM.select(`#${id}`);
    if (modal) {
      modal.classList.remove('modal-visible');
      document.body.style.overflow = '';
    }
  },

  create: (options = {}) => {
    const { title = '', content = '', actions = [], id = `modal-${Date.now()}` } = options;

    const actionsHtml = actions.map(a =>
      `<button class="${a.class || 'btn btn-glass'}" data-action="${a.action || ''}">${a.label}</button>`
    ).join('');

    const modal = DOM.create('div', 'modal-backdrop', `
      <div class="modal glass-modal vt-modal" id="${id}">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
          <button class="modal-close glass-btn" aria-label="Close">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="modal-content">${content}</div>
        ${actionsHtml ? `<div class="modal-actions">${actionsHtml}</div>` : ''}
      </div>
    `);

    document.body.appendChild(modal);

    // Close handlers
    const closeBtn = modal.querySelector('.modal-close');
    const backdrop = modal;

    const closeModal = () => {
      modal.classList.remove('modal-visible');
      modal.addEventListener('transitionend', () => modal.remove(), { once: true });
      document.body.style.overflow = '';
    };

    Events.on(closeBtn, 'click', closeModal);
    Events.on(backdrop, 'click', (e) => {
      if (e.target === backdrop) closeModal();
    });

    // ESC key
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    // Show with animation
    requestAnimationFrame(() => modal.classList.add('modal-visible'));

    return { modal, close: closeModal };
  },

  init: () => {
    // Initialize existing modals
    document.querySelectorAll('[data-modal-trigger]').forEach(trigger => {
      Events.on(trigger, 'click', () => {
        const modalId = trigger.dataset.modalTrigger;
        Modal.show(modalId);
      });
    });

    document.querySelectorAll('.modal-close').forEach(btn => {
      Events.on(btn, 'click', () => {
        const modal = btn.closest('.modal-backdrop');
        if (modal) {
          modal.classList.remove('modal-visible');
          document.body.style.overflow = '';
        }
      });
    });
  },
};

// ============================================
// 6. Form Utilities
// ============================================

const Form = {
  validateEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  validateRequired: (value) => value?.trim().length > 0,

  getData: (formSelector) => {
    const form = DOM.select(formSelector);
    return form ? Object.fromEntries(new FormData(form)) : null;
  },

  setData: (formSelector, data) => {
    const form = DOM.select(formSelector);
    if (!form) return;
    Object.entries(data).forEach(([key, value]) => {
      if (form.elements[key]) form.elements[key].value = value;
    });
  },

  clear: (formSelector) => DOM.select(formSelector)?.reset(),
};

// ============================================
// 7. Scroll Utilities
// ============================================

const Scroll = {
  to: (selector, offset = 80) => {
    const element = DOM.select(selector);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  },

  toTop: () => window.scrollTo({ top: 0, behavior: 'smooth' }),

  isInViewport: (el) => {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  },
};

// ============================================
// 8. Animation Utilities
// ============================================

const Animate = {
  fadeIn: (el, duration = 300) => {
    el.style.opacity = '0';
    el.style.transition = `opacity ${duration}ms var(--ease-smooth)`;
    requestAnimationFrame(() => el.style.opacity = '1');
  },

  fadeOut: (el, duration = 300) => {
    el.style.transition = `opacity ${duration}ms var(--ease-smooth)`;
    el.style.opacity = '0';
  },

  slideDown: (el, duration = 300) => {
    el.style.maxHeight = '0';
    el.style.overflow = 'hidden';
    el.style.transition = `max-height ${duration}ms var(--ease-smooth)`;
    requestAnimationFrame(() => el.style.maxHeight = el.scrollHeight + 'px');
  },

  slideUp: (el, duration = 300) => {
    el.style.maxHeight = el.scrollHeight + 'px';
    el.style.overflow = 'hidden';
    el.style.transition = `max-height ${duration}ms var(--ease-smooth)`;
    requestAnimationFrame(() => el.style.maxHeight = '0');
  },
};

// ============================================
// 9. Utility Functions
// ============================================

const Utils = {
  randomId: () => Math.random().toString(36).substr(2, 9),

  formatDate: (date, format = 'YYYY-MM-DD') => {
    const d = new Date(date);
    return format
      .replace('YYYY', d.getFullYear())
      .replace('MM', String(d.getMonth() + 1).padStart(2, '0'))
      .replace('DD', String(d.getDate()).padStart(2, '0'));
  },

  clone: (obj) => JSON.parse(JSON.stringify(obj)),
  merge: (target, source) => ({ ...target, ...source }),
  getQueryParam: (param) => new URLSearchParams(window.location.search).get(param),
};

// ============================================
// 10. Tabs System
// ============================================

const Tabs = {
  init: () => {
    DOM.selectAll('.tabs').forEach(tabContainer => {
      const buttons = tabContainer.querySelectorAll('.tab-item');
      const panels = tabContainer.closest('.tab-wrapper')?.querySelectorAll('.tab-panel');

      buttons.forEach((btn, index) => {
        Events.on(btn, 'click', (e) => {
          e.preventDefault();

          // Update buttons
          buttons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          // Update panels
          if (panels) {
            panels.forEach(p => p.classList.remove('active'));
            panels[index]?.classList.add('active');
          }

          Events.trigger(tabContainer, 'tabchange', { tab: btn.textContent, index });
        });
      });
    });
  },
};

// ============================================
// 11. Dropdown System
// ============================================

const Dropdown = {
  init: () => {
    DOM.selectAll('.dropdown').forEach(dropdown => {
      const trigger = dropdown.querySelector('.dropdown-trigger');

      Events.on(trigger, 'click', (e) => {
        e.stopPropagation();

        // Close other dropdowns
        DOM.selectAll('.dropdown.active').forEach(d => {
          if (d !== dropdown) d.classList.remove('active');
        });

        dropdown.classList.toggle('active');
      });
    });

    // Close on outside click
    Events.on(document, 'click', () => {
      DOM.selectAll('.dropdown.active').forEach(d => d.classList.remove('active'));
    });
  },
};

// ============================================
// 12. Lazy Load
// ============================================

const LazyLoad = {
  init: () => {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    DOM.selectAll('img.lazy').forEach(img => observer.observe(img));
  },
};

// ============================================
// Expose globally
// ============================================
if (typeof window !== 'undefined') {
  window.NexusBento = {
    DOM,
    Events,
    Storage,
    Toast,
    Modal,
    Form,
    Scroll,
    Animate,
    Utils,
    Tabs,
    Dropdown,
    LazyLoad,
  };
}
