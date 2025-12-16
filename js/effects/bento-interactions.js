/**
 * Bento Interactions - Bento Grid 互動效果系統
 * 包含展開、焦點、群組互動等效果
 */

(function() {
  'use strict';

  // 配置
  const CONFIG = {
    expand: {
      scale: 1.02,
      duration: 300,
      zIndex: 10
    },
    spotlight: {
      dimOpacity: 0.5,
      duration: 200
    }
  };

  /**
   * ========== Bento Hover Expand ==========
   * 懸停時卡片微微放大突出
   */
  function initHoverExpand() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.querySelectorAll('.bento-grid > .glass-card, [data-bento-expand]').forEach(el => {
      el.style.transition = `transform ${CONFIG.expand.duration}ms ease-out, z-index 0ms`;

      el.addEventListener('mouseenter', () => {
        el.style.transform = `scale(${CONFIG.expand.scale})`;
        el.style.zIndex = CONFIG.expand.zIndex;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        // 延遲重置 z-index 避免閃爍
        setTimeout(() => {
          el.style.zIndex = '';
        }, CONFIG.expand.duration);
      });
    });
  }

  /**
   * ========== Spotlight Effect ==========
   * 聚光燈效果：懸停時其他卡片變暗
   */
  function initSpotlight() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const grids = document.querySelectorAll('[data-bento-spotlight]');

    grids.forEach(grid => {
      const cards = grid.querySelectorAll('.glass-card');

      cards.forEach(card => {
        card.style.transition = `opacity ${CONFIG.spotlight.duration}ms ease-out`;

        card.addEventListener('mouseenter', () => {
          cards.forEach(c => {
            if (c !== card) {
              c.style.opacity = CONFIG.spotlight.dimOpacity;
            }
          });
        });

        card.addEventListener('mouseleave', () => {
          cards.forEach(c => {
            c.style.opacity = '';
          });
        });
      });
    });
  }

  /**
   * ========== Sequential Reveal ==========
   * 序列顯示 Bento 卡片
   */
  function initSequentialReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('[data-bento-reveal]').forEach(grid => {
        grid.querySelectorAll('.glass-card').forEach(card => {
          card.style.opacity = '1';
          card.style.transform = 'none';
        });
      });
      return;
    }

    const grids = document.querySelectorAll('[data-bento-reveal]');

    grids.forEach(grid => {
      const cards = grid.querySelectorAll('.glass-card');
      const delay = parseInt(grid.dataset.bentoReveal) || 100;

      // 設置初始狀態
      cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      });

      // 使用 IntersectionObserver 觸發
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            revealCards(cards, delay);
            observer.disconnect();
          }
        });
      }, { threshold: 0.1 });

      observer.observe(grid);
    });
  }

  function revealCards(cards, delay) {
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * delay);
    });
  }

  /**
   * ========== Interactive Border ==========
   * 互動邊框光效
   */
  function initInteractiveBorder() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if ('ontouchstart' in window) return;

    document.querySelectorAll('[data-bento-border]').forEach(el => {
      el.addEventListener('mousemove', updateBorderGlow);
      el.addEventListener('mouseleave', removeBorderGlow);
    });
  }

  function updateBorderGlow(e) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();

    // 計算滑鼠相對位置（百分比）
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    el.style.background = `
      linear-gradient(var(--glass-bg, oklch(25% 0.01 250 / 0.6)), var(--glass-bg, oklch(25% 0.01 250 / 0.6))) padding-box,
      linear-gradient(
        ${Math.atan2(y - 50, x - 50) * 180 / Math.PI + 90}deg,
        oklch(72% 0.20 195) 0%,
        oklch(58% 0.30 280) 50%,
        oklch(70% 0.22 25) 100%
      ) border-box
    `;
    el.style.borderColor = 'transparent';
  }

  function removeBorderGlow(e) {
    const el = e.currentTarget;
    el.style.background = '';
    el.style.borderColor = '';
  }

  /**
   * ========== Click Feedback ==========
   * 點擊回饋動畫
   */
  function initClickFeedback() {
    document.querySelectorAll('[data-bento-click]').forEach(el => {
      el.addEventListener('mousedown', () => {
        el.style.transform = 'scale(0.98)';
      });

      el.addEventListener('mouseup', () => {
        el.style.transform = '';
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  /**
   * ========== Lazy Load Enhancement ==========
   * 強化延遲載入效果
   */
  function initLazyLoadEffect() {
    const images = document.querySelectorAll('[data-bento-lazy]');

    if (!images.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.bentoLazy;

          if (src) {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';

            if (img.tagName === 'IMG') {
              img.src = src;
              img.onload = () => {
                img.style.opacity = '1';
              };
            } else {
              img.style.backgroundImage = `url(${src})`;
              img.style.opacity = '1';
            }
          }

          observer.unobserve(img);
        }
      });
    }, { threshold: 0.1, rootMargin: '50px' });

    images.forEach(img => observer.observe(img));
  }

  /**
   * ========== 主初始化 ==========
   */
  function init() {
    initHoverExpand();
    initSpotlight();
    initSequentialReveal();
    initInteractiveBorder();
    initClickFeedback();
    initLazyLoadEffect();
  }

  // 導出 API
  window.BentoInteractions = {
    init,
    initHoverExpand,
    initSpotlight,
    initSequentialReveal,
    initInteractiveBorder,
    initClickFeedback,
    initLazyLoadEffect,
    CONFIG
  };

  // DOM Ready 時自動初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
