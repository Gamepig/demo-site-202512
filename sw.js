/**
 * Service Worker - Nexus Bento
 * 2026 Web Design PWA Support
 */

const CACHE_NAME = 'nexus-bento-v1';
const STATIC_CACHE = 'nexus-bento-static-v1';
const DYNAMIC_CACHE = 'nexus-bento-dynamic-v1';

// 要快取的靜態資源
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/pages/dashboard.html',
  '/offline.html',
  '/dist/output.css',
  '/css/core/design-tokens.css',
  '/css/layout/bento-grid.css',
  '/css/effects/glassmorphism.css',
  '/js/core/main.js',
  '/js/core/navigation.js'
];

// 安裝事件
self.addEventListener('install', (event) => {
  console.log('[SW] Nexus Bento 安裝中...');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] 快取靜態資源');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// 啟用事件
self.addEventListener('activate', (event) => {
  console.log('[SW] Nexus Bento 啟用中...');

  event.waitUntil(
    caches.keys()
      .then(keys => {
        return Promise.all(
          keys
            .filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
            .map(key => {
              console.log('[SW] 刪除舊快取:', key);
              return caches.delete(key);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// 請求攔截
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 只處理同源請求
  if (url.origin !== location.origin) return;

  event.respondWith(
    caches.match(request)
      .then(cached => {
        if (cached) return cached;

        return fetch(request)
          .then(response => {
            // 不快取非成功的回應
            if (!response || response.status !== 200) {
              return response;
            }

            // 複製回應並存入動態快取
            const clone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then(cache => cache.put(request, clone));

            return response;
          })
          .catch(() => {
            // 離線時返回離線頁面
            if (request.headers.get('accept').includes('text/html')) {
              return caches.match('/offline.html');
            }
          });
      })
  );
});
