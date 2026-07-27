const CACHE = 'circuits-v1';
const SHELL = ['./circuits-autobus.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Réseau d'abord (les tuiles de carte et le calcul d'itinéraire ont besoin d'internet),
// avec repli sur le cache local seulement pour les fichiers de l'application elle-même.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if(SHELL.some(f => url.pathname.endsWith(f.replace('./','')))){
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
