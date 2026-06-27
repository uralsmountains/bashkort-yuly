const CACHE_NAME = 'bashkort-yuly-v2';
const urlsToCache = [
  './',
  './index.html',
  './dictionary.json',
  './manifest.json',
  './icon.png'
];

// Установка Service Worker и кэширование файлов
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Перехват запросов (работа без интернета)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Если файл есть в кэше — отдаем его, иначе качаем из интернета
        return response || fetch(event.request);
      })
  );
});
