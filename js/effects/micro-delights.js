/**
 * Micro-Delights - 微歡愉動效系統
 * 包含 Ripple、Magnetic、Cursor Glow 等互動效果
 */

(function() {
  'use strict';

  // 配置
  const CONFIG = {
    ripple: {
      duration: 600,
      color: 'rgba(255, 255, 255, 0.3)'
    },
    magnetic: {
      strength: 0.3,
      distance: 100
    },
    cursorGlow: {
      size: 300,
      opacity: 0.15
    }
  };

  /**
   * ========== Ripple Effect ==========
   * 點擊水波紋效果
   */
  function initRipple() {
    document.querySelectorAll('[data-ripple], .btn').forEach(el => {
      // 確保元素有相對定位
      if (getComputedStyle(el).position === 'static') {
        el.style.position = 'relative';
      }
      el.style.overflow = 'hidden';

      el.addEventListener('click', createRipple);
    });
  }

  function createRipple(e) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();

    // 計算點擊位置
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 計算水波紋大小
    const size = Math.max(rect.width, rect.height) * 2;

    // 建立水波紋元素
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: ${CONFIG.ripple.color};
      width: ${size}px;
      height: ${size}px;
      left: ${x - size / 2}px;
      top: ${y - size / 2}px;
      transform: scale(0);
      opacity: 1;
      pointer-events: none;
      animation: ripple-animation ${CONFIG.ripple.duration}ms ease-out forwards;
    `;

    el.appendChild(ripple);

    // 動畫結束後移除
    setTimeout(() => ripple.remove(), CONFIG.ripple.duration);
  }

  // 注入 Ripple 動畫 CSS
  function injectRippleStyles() {
    if (document.getElementById('ripple-styles')) return;

    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = `
      @keyframes ripple-animation {
        to {
          transform: scale(1);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * ========== Magnetic Effect ==========
   * 磁性吸引按鈕效果
   */
  function initMagnetic() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.querySelectorAll('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', magneticMove);
      el.addEventListener('mouseleave', magneticReset);
    });
  }

  function magneticMove(e) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const strength = parseFloat(el.dataset.magneticStrength) || CONFIG.magnetic.strength;

    // 計算滑鼠相對元素中心的位置
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // 套用變換
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    el.style.transition = 'transform 0.1s ease-out';
  }

  function magneticReset(e) {
    const el = e.currentTarget;
    el.style.transform = 'translate(0, 0)';
    el.style.transition = 'transform 0.3s ease-out';
  }

  /**
   * ========== Cursor Glow Effect ==========
   * 游標光暈效果（適用於 glass-card）
   */
  function initCursorGlow() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if ('ontouchstart' in window) return; // 觸控裝置跳過

    document.querySelectorAll('[data-glow], .glass-card').forEach(el => {
      el.addEventListener('mousemove', updateGlow);
      el.addEventListener('mouseleave', removeGlow);
    });
  }

  function updateGlow(e) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    el.style.setProperty('--glow-x', `${x}px`);
    el.style.setProperty('--glow-y', `${y}px`);
    el.style.setProperty('--glow-opacity', CONFIG.cursorGlow.opacity);
  }

  function removeGlow(e) {
    const el = e.currentTarget;
    el.style.setProperty('--glow-opacity', 0);
  }

  // 注入 Cursor Glow CSS
  function injectGlowStyles() {
    if (document.getElementById('glow-styles')) return;

    const style = document.createElement('style');
    style.id = 'glow-styles';
    style.textContent = `
      [data-glow]::before,
      .glass-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: inherit;
        background: radial-gradient(
          ${CONFIG.cursorGlow.size}px circle at var(--glow-x, 50%) var(--glow-y, 50%),
          oklch(72% 0.20 195 / var(--glow-opacity, 0)),
          transparent 50%
        );
        pointer-events: none;
        z-index: 0;
        transition: opacity 0.3s ease;
      }

      [data-glow] > *,
      .glass-card > * {
        position: relative;
        z-index: 1;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * ========== Tilt Effect ==========
   * 3D 傾斜效果
   */
  function initTilt() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if ('ontouchstart' in window) return;

    document.querySelectorAll('[data-tilt]').forEach(el => {
      el.addEventListener('mousemove', tiltMove);
      el.addEventListener('mouseleave', tiltReset);
      el.style.transformStyle = 'preserve-3d';
      el.style.transition = 'transform 0.1s ease-out';
    });
  }

  function tiltMove(e) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const maxTilt = parseFloat(el.dataset.tiltMax) || 10;

    // 計算傾斜角度
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

    el.style.transform = `perspective(1000px) rotateX(${-y * maxTilt}deg) rotateY(${x * maxTilt}deg)`;
  }

  function tiltReset(e) {
    const el = e.currentTarget;
    el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    el.style.transition = 'transform 0.5s ease-out';
  }

  /**
   * ========== Hover Scale ==========
   * 懸停縮放效果
   */
  function initHoverScale() {
    document.querySelectorAll('[data-hover-scale]').forEach(el => {
      const scale = el.dataset.hoverScale || 1.02;
      el.style.transition = 'transform 0.2s ease-out';

      el.addEventListener('mouseenter', () => {
        el.style.transform = `scale(${scale})`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });
    });
  }

  /**
   * ========== 主初始化 ==========
   */
  function init() {
    injectRippleStyles();
    injectGlowStyles();
    initRipple();
    initMagnetic();
    initCursorGlow();
    initTilt();
    initHoverScale();
  }

  // 導出 API
  window.MicroDelights = {
    init,
    initRipple,
    initMagnetic,
    initCursorGlow,
    initTilt,
    initHoverScale,
    CONFIG
  };

  // DOM Ready 時自動初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
