const CACHE_NAME = 'mozup-v9'; // Altere a versão!
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Adiciona recursos um por um para identificar falhas
        return Promise.all(
          ASSETS.map(asset => {
            return cache.add(asset).catch(error => {
              console.error('Falha ao armazenar:', asset, error);
              throw error;
            });
          })
        );
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});