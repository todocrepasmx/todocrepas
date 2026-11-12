const CACHE = 'todocrepas-v2';
const ASSETS = [
  './',
  './index.html',
  './acceso-privado-todocrepas.html',
  './manifest.json',
  './img/portada.jpg',
  './img/linea.jpg',
  './img/prod-regular-bolsa.jpg',
  './img/prod-regular-cajita.jpg',
  './img/prod-ligera-bolsa.jpg',
  './img/prod-ligera-cajita.jpg',
  './img/prod-avena-bolsa.jpg',
  './img/prod-avena-cajita.jpg',
  './img/tabla-avena.jpg',
  './img/firma.jpg',
  './img/icono.jpg',
  './img/logo-conejo.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (/\.(mp4|pdf)$/i.test(new URL(e.request.url).pathname)) return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
