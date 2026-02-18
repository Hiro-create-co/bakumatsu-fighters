const CACHE_NAME = 'bakumatsu-v3';
const ASSETS = [
  '/game.html',
  '/game.js',
  '/favicon.svg',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/manifest.json',
  '/sprites/ryoma/idle.gif',
  '/sprites/ryoma/attack.gif',
  '/sprites/ryoma/special.gif',
  '/sprites/ryoma/super.gif',
  '/sprites/katsu/idle.gif',
  '/sprites/katsu/attack.gif',
  '/sprites/katsu/special.gif',
  '/sprites/katsu/super.gif',
  '/sprites/shoin/idle.gif',
  '/sprites/shoin/attack.gif',
  '/sprites/shoin/special.gif',
  '/sprites/shoin/super.gif',
  '/sprites/yoshinobu/idle.gif',
  '/sprites/yoshinobu/attack.gif',
  '/sprites/yoshinobu/special.gif',
  '/sprites/yoshinobu/super.gif',
  '/sprites/saigo/idle.gif',
  '/sprites/saigo/attack.gif',
  '/sprites/saigo/special.gif',
  '/sprites/saigo/super.gif',
];

// Install: cache all assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first strategy
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
