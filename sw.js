const CACHE_NAME = 'goal-tracker-pwa-v3';
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

self.addEventListener('install', event => {
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
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

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
