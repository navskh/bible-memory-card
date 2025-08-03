const CACHE_NAME = 'bible-memory-v2.1';
const urlsToCache = ['/', '/manifest.json', '/icons/512.png'];

// Service Worker 설치
self.addEventListener('install', event => {
  console.log('Service Worker 설치 중...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('캐시 열림:', CACHE_NAME);
      return cache.addAll(urlsToCache);
    }),
  );
  // 새로운 Service Worker가 즉시 활성화되도록 함
  self.skipWaiting();
});

// Service Worker 활성화
self.addEventListener('activate', event => {
  console.log('Service Worker 활성화 중...');
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('이전 캐시 삭제:', cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        // 모든 클라이언트에 새로운 Service Worker가 활성화되었음을 알림
        return self.clients.claim();
      }),
  );
});

// 네트워크 요청 가로채기
self.addEventListener('fetch', event => {
  // API 요청이나 동적 콘텐츠는 캐시하지 않음
  if (event.request.url.includes('/api/') || event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      // 캐시에서 찾으면 반환
      if (response) {
        return response;
      }

      // 캐시에 없으면 네트워크에서 가져오기
      return fetch(event.request).then(response => {
        // 유효한 응답이 아니면 그대로 반환
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // 응답을 복제하여 캐시에 저장
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    }),
  );
});

// 메시지 처리 (업데이트 알림용)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  // 캐시 무효화 요청
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            return caches.delete(cacheName);
          }),
        );
      }),
    );
  }
});

// 백그라운드 동기화 (선택사항)
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // 백그라운드에서 수행할 작업
  console.log('Background sync completed');
}

// 주기적으로 캐시 정리 (선택사항)
self.addEventListener('periodicsync', event => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupOldCaches());
  }
});

async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const currentTime = Date.now();
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7일

  for (const cacheName of cacheNames) {
    if (cacheName !== CACHE_NAME) {
      await caches.delete(cacheName);
    }
  }
}
