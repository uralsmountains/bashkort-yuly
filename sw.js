const CACHE_NAME = 'bashkort-yuly-v3'; // Поменяли версию на v3
const urlsToCache = [
  './',
  './index.html',
  './dictionary.json',
  './manifest.json',
  './icon.png'
];

// Установка и кэширование свежих файлов
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      }).then(() => self.skipWaiting()) // Сразу активируем новый воркер
  );
});

// Очистка ВСЕХ старых кэшей (исправляет баг с вечным старым сайтом)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Удаляем старый кэш:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Стратегия: сначала запрашиваем свежий сайт из сети, если интернета нет — берем из кэша
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
