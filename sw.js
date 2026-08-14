const CACHE_NAME = 'goal-tracker-pwa-v4';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './app-icon.svg',
  './congrats.gif',
  './creatorshome-select-002-337219.mp3',
  './universfield-error-08-206492.mp3',
  './universfield-level-up-04-243762.mp3',
  './goal complete.mp3',
  './basketball-svgrepo-com.svg',
  './biohazard-symbol-svgrepo-com.svg',
  './book-svgrepo-com.svg',
  './cloud-svgrepo-com.svg',
  './computer-svgrepo-com.svg',
  './controller-svgrepo-com.svg',
  './dumbbell-8-svgrepo-com.svg',
  './exclamation-warning-sign-svgrepo-com.svg',
  './fire.svg',
  './food-restaurant-svgrepo-com.svg',
  './headphones-square-svgrepo-com.svg',
  './heart-svgrepo-com.svg',
  './idea-svgrepo-com.svg',
  './meditation-meditate-mindful-mindfulness-svgrepo-com.svg',
  './money-sign-money-dollar-sign-svgrepo-com.svg',
  './music-note-svgrepo-com.svg',
  './phone-calling-svgrepo-com.svg',
  './photo-svgrepo-com.svg',
  './poison-svgrepo-com.svg',
  './star-svgrepo-com.svg',
  './test-svgrepo-com.svg',
  './write-svgrepo-com.svg'
];

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);
const IS_LOCAL_DEV = LOCAL_HOSTS.has(self.location.hostname);

self.addEventListener('install', event => {
  if (IS_LOCAL_DEV) {
    self.skipWaiting();
    return;
  }
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME || IS_LOCAL_DEV)
          .map(key => caches.delete(key))
      )
    ).then(async () => {
      if (IS_LOCAL_DEV) {
        const registrations = await self.registration.unregister().catch(() => false);
        return registrations;
      }
      return true;
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (IS_LOCAL_DEV) return;
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);
  const isDocumentRequest = event.request.mode === 'navigate'
    || event.request.destination === 'document'
    || requestUrl.pathname.endsWith('/index.html')
    || requestUrl.pathname === '/';

  if (isDocumentRequest) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          return cached || caches.match('./index.html');
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request)
        .then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});
