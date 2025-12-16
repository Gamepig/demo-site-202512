# Nexus Bento - 2026 Web Design 展示網站

展示 2026 年最前沿 Web 設計趨勢的靜態網站模板，結合 **Bento Grid 便當盒佈局**、**Glassmorphism 玻璃擬態效果** 與 **Aurora 極光漸層**。

🌐 **線上預覽**: [https://gamepig.github.io/demo-site-202512/](https://gamepig.github.io/demo-site-202512/)

---

## 特色功能

### 設計系統

| 特色 | 說明 |
|------|------|
| **Bento Grid** | 12 欄響應式網格系統，6 種區塊尺寸（sm/md/lg/xl/hero/full） |
| **Glassmorphism** | 磨砂玻璃效果，支援 backdrop-filter 模糊與透明度 |
| **Aurora Gradient** | OKLCH 色彩空間的極光漸層，色彩更鮮豔飽和 |
| **Fluid Typography** | 使用 CSS clamp() 的流體排版，自動適應所有螢幕 |
| **View Transitions** | 原生頁面轉場動畫 API（Chrome/Edge 支援） |

### 互動效果

- **Scroll Storytelling** - 滾動觸發的序列入場動畫
- **Micro-Delights** - 按鈕水波紋、磁性吸附、游標光暈
- **Bento Interactions** - 卡片懸停放大、聚光燈效果、3D 傾斜
- **Ripple Effect** - Material Design 風格點擊回饋

### 無障礙支援

- Skip Link 跳過導航
- 完整鍵盤導航支援
- `prefers-reduced-motion` 減少動態偏好
- `prefers-contrast` 高對比模式
- WCAG 2.1 AA 等級焦點指示器

---

## 頁面一覽

| 頁面 | 說明 | 路徑 |
|------|------|------|
| Landing Page | 首頁，展示設計系統 | `index.html` |
| Dashboard | 儀表板，KPI 卡片與圖表 | `pages/dashboard.html` |
| JS Showcase | JavaScript 功能展示 | `pages/js-showcase.html` |
| Projects | 專案列表 | `pages/projects.html` |
| Profile | 個人檔案 | `pages/profile.html` |
| Settings | 設定頁面（3 個分頁） | `pages/settings-*.html` |
| Notifications | 通知中心 | `pages/notifications.html` |
| Pricing | 定價方案 | `pages/pricing.html` |
| About | 關於我們 | `pages/about.html` |
| Contact | 聯絡表單 | `pages/contact.html` |

---

## 技術規格

### 技術棧

- **HTML5** - 語意化標籤
- **Tailwind CSS v3** - 原子化 CSS 框架
- **ES6+ JavaScript** - 原生 JS，無框架依賴
- **CSS Custom Properties** - 設計令牌系統
- **OKLCH Color Space** - 下一代色彩空間

### 瀏覽器支援

| 瀏覽器 | 版本 | Glassmorphism | View Transitions |
|--------|------|---------------|------------------|
| Chrome | 111+ | ✅ | ✅ |
| Edge | 111+ | ✅ | ✅ |
| Safari | 15.4+ | ✅ | ❌ |
| Firefox | 103+ | ✅ | ❌ |

### 響應式斷點

| 斷點 | 寬度 | Grid 欄數 |
|------|------|-----------|
| Mobile | < 768px | 4 欄 |
| Tablet | 768-1023px | 8 欄 |
| Desktop | 1024-1399px | 12 欄 |
| Large | ≥ 1400px | 12 欄 |

---

## 專案結構

```
nexus-bento/
├── index.html                 # Landing Page
├── pages/                     # 內頁
│   ├── dashboard.html
│   ├── js-showcase.html
│   ├── projects.html
│   ├── profile.html
│   ├── settings-general.html
│   ├── settings-security.html
│   ├── settings-billing.html
│   ├── notifications.html
│   ├── pricing.html
│   ├── about.html
│   └── contact.html
├── css/
│   ├── tailwind.css           # Tailwind 入口
│   ├── core/
│   │   ├── design-tokens.css  # 設計令牌
│   │   └── accessibility.css  # 無障礙樣式
│   ├── layout/
│   │   └── bento-grid.css     # Bento Grid 系統
│   ├── effects/
│   │   ├── glassmorphism.css  # 玻璃擬態
│   │   ├── animations.css     # 動畫系統
│   │   └── view-transitions.css
│   └── components/
│       └── ui.css             # UI 元件
├── js/
│   ├── app.js                 # 應用程式入口
│   ├── core/
│   │   ├── main.js            # 核心工具
│   │   ├── theme-toggle.js    # 主題切換
│   │   └── navigation.js      # 導航系統
│   └── effects/
│       ├── scroll-storytelling.js
│       ├── micro-delights.js
│       └── bento-interactions.js
├── dist/
│   └── output.css             # 編譯後 CSS (51KB)
├── manifest.json              # PWA 配置
└── sw.js                      # Service Worker
```

---

## 本地開發

### 安裝依賴

```bash
npm install
```

### 開發模式（監聽 CSS 變更）

```bash
npm run dev
```

### 建置生產版本

```bash
npm run build
```

### 本地預覽

```bash
npx serve .
```

---

## 自訂指南

### 修改色彩

編輯 `css/core/design-tokens.css` 中的 OKLCH 色彩變數：

```css
:root {
  --color-primary-500: oklch(58% 0.30 280);  /* 主色 - Cyber Violet */
  --color-secondary-500: oklch(72% 0.20 195); /* 次色 - Electric Cyan */
  --color-accent-500: oklch(70% 0.22 25);     /* 強調色 - Neon Coral */
}
```

### 新增 Bento 區塊

使用預定義的區塊類別：

```html
<div class="bento-grid">
  <div class="bento-sm glass-card">小型區塊</div>
  <div class="bento-md glass-card">中型區塊</div>
  <div class="bento-lg glass-card">大型區塊</div>
  <div class="bento-hero glass-card">Hero 區塊</div>
</div>
```

### 新增滾動動畫

在元素上添加 `data-scroll` 屬性：

```html
<div data-scroll="fade-up">淡入上移</div>
<div data-scroll="scale-up" data-scroll-delay="200">延遲縮放</div>

<!-- 序列動畫 -->
<div data-scroll-stagger="100">
  <div data-scroll-item>項目 1</div>
  <div data-scroll-item>項目 2</div>
  <div data-scroll-item>項目 3</div>
</div>
```

可用動畫類型：`fade-up`、`fade-down`、`fade-left`、`fade-right`、`scale-up`、`blur-in`

---

## 授權條款

MIT License - 可自由使用於商業專案

---

## 聯絡資訊

如有任何問題或客製化需求，歡迎聯繫。

---

*Built with Tailwind CSS + Vanilla JS | 2026 Web Design Trends*
