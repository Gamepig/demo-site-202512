/**
 * Scroll Storytelling - 滾動敘事動畫系統
 * 使用 IntersectionObserver 實現元素入場動畫
 */

(function() {
  'use strict';

  // 動畫配置
  const CONFIG = {
    threshold: 0.15,      // 觸發閾值
    rootMargin: '0px',    // 根元素邊距
    staggerDelay: 100,    // 序列動畫延遲 (ms)
  };

  // 動畫類別映射
  const ANIMATIONS = {
    'fade-up': {
      initial: { opacity: 0, transform: 'translateY(30px)' },
      final: { opacity: 1, transform: 'translateY(0)' }
    },
    'fade-down': {
      initial: { opacity: 0, transform: 'translateY(-30px)' },
      final: { opacity: 1, transform: 'translateY(0)' }
    },
    'fade-left': {
      initial: { opacity: 0, transform: 'translateX(30px)' },
      final: { opacity: 1, transform: 'translateX(0)' }
    },
    'fade-right': {
      initial: { opacity: 0, transform: 'translateX(-30px)' },
      final: { opacity: 1, transform: 'translateX(0)' }
    },
    'scale-up': {
      initial: { opacity: 0, transform: 'scale(0.9)' },
      final: { opacity: 1, transform: 'scale(1)' }
    },
    'blur-in': {
      initial: { opacity: 0, filter: 'blur(10px)' },
      final: { opacity: 1, filter: 'blur(0)' }
    }
  };

  /**
   * 初始化 Scroll Storytelling
   */
  function init() {
    // 檢查 reduced motion 偏好
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealAllImmediately();
      return;
    }

    // 設置初始狀態
    setupInitialStates();

    // 建立 Observer
    const observer = createObserver();

    // 觀察所有動畫元素
    observeElements(observer);
  }

  /**
   * 為減少動態偏好的用戶立即顯示所有元素
   */
  function revealAllImmediately() {
    document.querySelectorAll('[data-scroll]').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.filter = 'none';
      el.classList.add('revealed');
    });
  }

  /**
   * 設置元素初始狀態
   */
  function setupInitialStates() {
    document.querySelectorAll('[data-scroll]').forEach(el => {
      const animationType = el.dataset.scroll || 'fade-up';
      const animation = ANIMATIONS[animationType] || ANIMATIONS['fade-up'];

      // 設置初始樣式
      Object.assign(el.style, {
        ...animation.initial,
        transition: 'opacity 0.6s ease, transform 0.6s ease, filter 0.6s ease',
        willChange: 'opacity, transform, filter'
      });

      // 處理延遲
      const delay = el.dataset.scrollDelay;
      if (delay) {
        el.style.transitionDelay = `${delay}ms`;
      }
    });
  }

  /**
   * 建立 IntersectionObserver
   */
  function createObserver() {
    return new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          revealElement(entry.target);
        }
      });
    }, {
      threshold: CONFIG.threshold,
      rootMargin: CONFIG.rootMargin
    });
  }

  /**
   * 顯示元素
   */
  function revealElement(el) {
    const animationType = el.dataset.scroll || 'fade-up';
    const animation = ANIMATIONS[animationType] || ANIMATIONS['fade-up'];

    // 套用最終狀態
    Object.assign(el.style, animation.final);
    el.classList.add('revealed');

    // 清理 willChange 以釋放資源
    setTimeout(() => {
      el.style.willChange = 'auto';
    }, 700);
  }

  /**
   * 觀察所有動畫元素
   */
  function observeElements(observer) {
    // 基本動畫元素
    document.querySelectorAll('[data-scroll]').forEach(el => {
      observer.observe(el);
    });

    // 序列動畫容器
    document.querySelectorAll('[data-scroll-stagger]').forEach(container => {
      setupStaggerAnimation(container, observer);
    });
  }

  /**
   * 設置序列動畫
   */
  function setupStaggerAnimation(container, observer) {
    const children = container.querySelectorAll('[data-scroll-item]');
    const staggerDelay = parseInt(container.dataset.scrollStagger) || CONFIG.staggerDelay;

    children.forEach((child, index) => {
      // 設置初始狀態
      const animationType = child.dataset.scroll || container.dataset.scrollType || 'fade-up';
      const animation = ANIMATIONS[animationType] || ANIMATIONS['fade-up'];

      Object.assign(child.style, {
        ...animation.initial,
        transition: 'opacity 0.6s ease, transform 0.6s ease, filter 0.6s ease',
        transitionDelay: `${index * staggerDelay}ms`,
        willChange: 'opacity, transform, filter'
      });

      observer.observe(child);
    });
  }

  /**
   * 手動觸發元素動畫（供外部呼叫）
   */
  function reveal(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => revealElement(el));
  }

  /**
   * 重置元素動畫（供外部呼叫）
   */
  function reset(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.classList.remove('revealed');
      const animationType = el.dataset.scroll || 'fade-up';
      const animation = ANIMATIONS[animationType] || ANIMATIONS['fade-up'];
      Object.assign(el.style, animation.initial);
    });
  }

  // 導出 API
  window.ScrollStorytelling = {
    init,
    reveal,
    reset,
    ANIMATIONS
  };

  // DOM Ready 時自動初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
