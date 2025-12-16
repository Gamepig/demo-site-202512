/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './pages/**/*.html',
    './js/**/*.js'
  ],
  theme: {
    extend: {
      // 2026 Aurora Palette
      colors: {
        // 主色系 - Cyber Violet
        primary: {
          50: 'oklch(98% 0.02 280)',
          100: 'oklch(94% 0.06 280)',
          200: 'oklch(88% 0.12 280)',
          300: 'oklch(78% 0.18 280)',
          400: 'oklch(68% 0.24 280)',
          500: 'oklch(58% 0.30 280)',
          600: 'oklch(48% 0.28 280)',
          700: 'oklch(40% 0.24 280)',
          800: 'oklch(32% 0.20 280)',
          900: 'oklch(24% 0.16 280)',
        },
        // 次色系 - Electric Cyan
        secondary: {
          400: 'oklch(78% 0.16 195)',
          500: 'oklch(72% 0.20 195)',
          600: 'oklch(62% 0.18 195)',
        },
        // 強調色 - Neon Coral
        accent: {
          400: 'oklch(76% 0.18 25)',
          500: 'oklch(70% 0.22 25)',
          600: 'oklch(60% 0.20 25)',
        },
        // 成功 - Mint
        success: {
          500: 'oklch(75% 0.18 155)',
        },
        // 警告 - Gold
        warning: {
          500: 'oklch(85% 0.18 85)',
        },
        // 背景層級
        surface: {
          base: 'oklch(15% 0.01 280)',
          elevated: 'oklch(20% 0.01 280)',
          card: 'oklch(25% 0.01 280)',
          overlay: 'oklch(30% 0.01 280)',
        },
        // Glass 效果
        glass: {
          bg: 'oklch(25% 0.01 250 / 0.6)',
          border: 'oklch(100% 0 0 / 0.1)',
        },
      },
      // 流體字型
      fontSize: {
        'fluid-xs': ['clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)', { lineHeight: '1.5' }],
        'fluid-sm': ['clamp(0.875rem, 0.8rem + 0.35vw, 1rem)', { lineHeight: '1.5' }],
        'fluid-base': ['clamp(1rem, 0.9rem + 0.5vw, 1.125rem)', { lineHeight: '1.6' }],
        'fluid-lg': ['clamp(1.125rem, 1rem + 0.65vw, 1.375rem)', { lineHeight: '1.5' }],
        'fluid-xl': ['clamp(1.25rem, 1.1rem + 0.8vw, 1.625rem)', { lineHeight: '1.4' }],
        'fluid-2xl': ['clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem)', { lineHeight: '1.3' }],
        'fluid-3xl': ['clamp(1.875rem, 1.4rem + 2.4vw, 3rem)', { lineHeight: '1.2' }],
        'fluid-4xl': ['clamp(2.25rem, 1.6rem + 3.25vw, 4rem)', { lineHeight: '1.1' }],
        'fluid-5xl': ['clamp(3rem, 2rem + 5vw, 5.5rem)', { lineHeight: '1.05' }],
      },
      // 流體間距
      spacing: {
        'fluid-1': 'clamp(0.25rem, 0.2rem + 0.25vw, 0.375rem)',
        'fluid-2': 'clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem)',
        'fluid-4': 'clamp(1rem, 0.8rem + 1vw, 1.5rem)',
        'fluid-6': 'clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem)',
        'fluid-8': 'clamp(2rem, 1.6rem + 2vw, 3rem)',
        'fluid-12': 'clamp(3rem, 2.4rem + 3vw, 4.5rem)',
        'bento-gap': 'clamp(0.75rem, 0.5rem + 1.25vw, 1.5rem)',
      },
      // Bento 圓角
      borderRadius: {
        'bento': 'clamp(16px, 1rem + 0.5vw, 28px)',
        'bento-sm': 'clamp(8px, 0.5rem + 0.25vw, 16px)',
        'bento-lg': 'clamp(24px, 1.5rem + 0.75vw, 36px)',
      },
      // Glass 模糊
      backdropBlur: {
        'glass': '20px',
        'glass-lg': '30px',
      },
      // 陰影
      boxShadow: {
        'glass': '0 8px 32px oklch(0% 0 0 / 0.15), inset 0 1px 0 oklch(100% 0 0 / 0.05)',
        'glass-hover': '0 16px 48px oklch(0% 0 0 / 0.2), 0 0 40px oklch(58% 0.30 280 / 0.15)',
        'glow-primary': '0 0 30px oklch(58% 0.30 280 / 0.4)',
        'glow-secondary': '0 0 30px oklch(72% 0.20 195 / 0.4)',
        'bento': '0 4px 20px oklch(0% 0 0 / 0.1)',
        'bento-hover': '0 8px 30px oklch(0% 0 0 / 0.15)',
      },
      // 動畫時間函數
      transitionTimingFunction: {
        'bounce-sm': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'bounce-lg': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
      },
      // 動畫
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease forwards',
        'fade-in': 'fade-in 0.3s ease forwards',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px oklch(58% 0.30 280 / 0.3)' },
          '50%': { boxShadow: '0 0 40px oklch(58% 0.30 280 / 0.5)' },
        },
        'slide-up': {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },
      // 背景漸層
      backgroundImage: {
        'aurora': 'linear-gradient(135deg, oklch(65% 0.25 280) 0%, oklch(70% 0.22 220) 50%, oklch(75% 0.18 155) 100%)',
        'aurora-soft': 'linear-gradient(135deg, oklch(65% 0.25 280 / 0.8) 0%, oklch(70% 0.22 220 / 0.6) 50%, oklch(75% 0.18 155 / 0.4) 100%)',
        'mesh': 'radial-gradient(ellipse at 20% 30%, oklch(58% 0.30 280 / 0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, oklch(72% 0.20 195 / 0.12) 0%, transparent 50%)',
      },
    },
  },
  plugins: [],
}
