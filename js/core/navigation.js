/**
 * Nexus Bento - Navigation System
 * Mobile sidebar, View Transitions, scroll behavior
 */

const Navigation = {
  sidebar: null,
  overlay: null,
  hamburger: null,

  init: () => {
    Navigation.sidebar = document.querySelector('.sidebar');
    Navigation.hamburger = document.querySelector('.hamburger-menu, [data-hamburger]');

    if (Navigation.sidebar) {
      Navigation.createOverlay();
      Navigation.bindSidebarEvents();
    }

    Navigation.initViewTransitions();
    Navigation.initScrollBehavior();
    Navigation.initActiveLinks();
  },

  // Create sidebar overlay for mobile
  createOverlay: () => {
    Navigation.overlay = document.querySelector('.sidebar-overlay');
    if (!Navigation.overlay) {
      Navigation.overlay = document.createElement('div');
      Navigation.overlay.className = 'sidebar-overlay glass-backdrop';
      document.body.appendChild(Navigation.overlay);
    }
  },

  bindSidebarEvents: () => {
    // Hamburger toggle
    if (Navigation.hamburger) {
      Navigation.hamburger.addEventListener('click', Navigation.toggleSidebar);
    }

    // Overlay click closes sidebar
    if (Navigation.overlay) {
      Navigation.overlay.addEventListener('click', Navigation.closeSidebar);
    }

    // ESC key closes sidebar
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && Navigation.sidebar?.classList.contains('active')) {
        Navigation.closeSidebar();
      }
    });

    // Close on link click (mobile)
    Navigation.sidebar?.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 1024) {
          Navigation.closeSidebar();
        }
      });
    });

    // Close on resize to desktop
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth >= 1024 && Navigation.sidebar?.classList.contains('active')) {
          Navigation.closeSidebar();
        }
      }, 100);
    });
  },

  toggleSidebar: () => {
    Navigation.sidebar?.classList.toggle('active');
    Navigation.overlay?.classList.toggle('active');
    document.body.classList.toggle('sidebar-open');
  },

  openSidebar: () => {
    Navigation.sidebar?.classList.add('active');
    Navigation.overlay?.classList.add('active');
    document.body.classList.add('sidebar-open');
  },

  closeSidebar: () => {
    Navigation.sidebar?.classList.remove('active');
    Navigation.overlay?.classList.remove('active');
    document.body.classList.remove('sidebar-open');
  },

  // View Transitions API integration
  initViewTransitions: () => {
    if (!document.startViewTransition) return;

    // Intercept internal navigation
    document.addEventListener('click', async (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;

      const url = new URL(link.href, window.location.origin);

      // Only handle same-origin navigation
      if (url.origin !== window.location.origin) return;

      // Skip if modifier keys pressed
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;

      // Skip anchor links
      if (url.pathname === window.location.pathname && url.hash) return;

      e.preventDefault();

      // Perform view transition
      const transition = document.startViewTransition(async () => {
        const response = await fetch(url.href);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Update content
        document.title = doc.title;
        document.querySelector('main').innerHTML = doc.querySelector('main').innerHTML;

        // Update URL
        history.pushState({}, '', url.href);

        // Re-init scripts
        Navigation.initActiveLinks();
        Navigation.initScrollReveal();
      });

      try {
        await transition.finished;
      } catch (e) {
        // Fallback to regular navigation on error
        window.location.href = url.href;
      }
    });

    // Handle back/forward navigation
    window.addEventListener('popstate', async () => {
      if (!document.startViewTransition) {
        window.location.reload();
        return;
      }

      document.startViewTransition(async () => {
        const response = await fetch(window.location.href);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        document.title = doc.title;
        document.querySelector('main').innerHTML = doc.querySelector('main').innerHTML;

        Navigation.initActiveLinks();
        Navigation.initScrollReveal();
      });
    });
  },

  // Scroll behavior
  initScrollBehavior: () => {
    const header = document.querySelector('header');
    let lastScroll = 0;

    // Hide/show header on scroll
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;

      if (currentScroll > 100) {
        header?.classList.add('scrolled');

        if (currentScroll > lastScroll && currentScroll > 300) {
          header?.classList.add('hidden');
        } else {
          header?.classList.remove('hidden');
        }
      } else {
        header?.classList.remove('scrolled', 'hidden');
      }

      lastScroll = currentScroll;
    }, { passive: true });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const offset = 80; // Header height
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  },

  // Highlight active navigation links
  initActiveLinks: () => {
    const currentPath = window.location.pathname;

    document.querySelectorAll('nav a, .sidebar a').forEach(link => {
      const linkPath = new URL(link.href, window.location.origin).pathname;
      link.classList.toggle('active', linkPath === currentPath);
    });
  },

  // Initialize scroll reveal animations
  initScrollReveal: () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
      observer.observe(el);
    });
  },
};

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
  Navigation.init();
  Navigation.initScrollReveal();
});

// Expose globally
if (typeof window !== 'undefined') {
  window.Navigation = Navigation;
}
