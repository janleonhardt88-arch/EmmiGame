// Offline-Unterstützung: Dateien aus dem Cache liefern, im Hintergrund aktualisieren.
const CACHE = 'emmigame-v7';
const FILES = [
  './', 'index.html', 'manifest.webmanifest', 'css/style.css',
  'js/main.js', 'js/art.js', 'js/audio.js', 'js/data.js', 'js/math.js', 'js/state.js',
  'js/core.js', 'js/vocab.js', 'js/words.js', 'js/games/stage.js', 'js/games/craft.js', 'js/games/climb.js',
  'js/games/ballet.js', 'js/games/market.js', 'js/recorder.js',
  'js/music.js', 'js/wardrobe.js', 'voice/index.json', 'music/garten-1.mp3', 'music/garten-2.mp3',
  'js/ui.js', 'js/daily.js', 'js/parents.js', 'js/playtime.js', 'js/games/garden.js', 'js/games/dojo.js', 'js/games/shop.js',
  'fonts/nunito-latin-600-normal.woff2', 'fonts/nunito-latin-800-normal.woff2',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/icon-180.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(e.request, { ignoreSearch: true });
      // Audio wird in Teilen angefragt (Range); wir holen immer die ganze Datei, damit sie in den Cache passt
      const req = e.request.headers.has('range') ? new Request(e.request.url) : e.request;
      const network = fetch(req).then((res) => {
        if (res.status === 200) cache.put(req, res.clone());
        return res;
      }).catch(() => cached);
      return cached || network;
    }),
  );
});
