// Offline-Unterstützung.
// Jede veröffentlichte Version bekommt einen eigenen Cache mit allen Programmdateien –
// so passen HTML, CSS und JavaScript immer zusammen. __BUILD__ wird beim Veröffentlichen
// (GitHub-Workflow) durch die Versionsnummer ersetzt.
const BUILD = '__BUILD__';
const CACHE = 'emmigame-app-' + BUILD;
// Musik und Sprachdateien bleiben über Versionen hinweg gespeichert.
// Die Zahl erhöhen, wenn vorhandene Audiodateien durch neue ersetzt werden.
const MEDIA = 'emmigame-media-4';

const FILES = [
  './', 'index.html', 'manifest.webmanifest', 'css/style.css',
  'js/main.js', 'js/version.js', 'js/art.js', 'js/audio.js', 'js/data.js', 'js/math.js', 'js/state.js',
  'js/core.js', 'js/vocab.js', 'js/words.js', 'js/ui.js', 'js/daily.js', 'js/parents.js', 'js/playtime.js',
  'js/recorder.js', 'js/music.js', 'js/wardrobe.js', 'js/update.js',
  'js/games/garden.js', 'js/games/dojo.js', 'js/games/shop.js', 'js/games/market.js',
  'js/games/stage.js', 'js/games/craft.js', 'js/games/climb.js', 'js/games/ballet.js',
  'js/games/forest.js', 'js/games/house.js', 'js/games/globe.js', 'js/games/quiz.js',
  'js/sachkunde.js', 'js/erdkunde.js', 'js/house-data.js',
  'voice/index.json',
  'fonts/nunito-latin-600-normal.woff2', 'fonts/nunito-latin-800-normal.woff2',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/icon-180.png',
];
const isMedia = (url) => /\/(voice|music)\/.+\.mp3$/.test(url);

self.addEventListener('install', (e) => {
  // cache: 'reload' umgeht den Zwischenspeicher des Browsers, damit wirklich die neuen Dateien geholt werden
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES.map((f) => new Request(f, { cache: 'reload' })))));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== MEDIA).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const url = e.request.url;
  if (e.request.method !== 'GET' || new URL(url).origin !== location.origin) return;
  if (url.includes('/version.json')) return; // Versionsprüfung immer frisch aus dem Netz

  if (isMedia(url)) {
    // Audio wird in Teilen angefragt (Range); wir holen immer die ganze Datei, damit sie in den Cache passt
    e.respondWith(caches.open(MEDIA).then(async (cache) => {
      const hit = await cache.match(url);
      if (hit) return hit;
      const res = await fetch(url);
      if (res.status === 200) cache.put(url, res.clone());
      return res;
    }));
    return;
  }

  // Programmdateien: immer aus dem Cache dieser Version, sonst aus dem Netz
  e.respondWith(caches.open(CACHE).then(async (cache) => (await cache.match(e.request, { ignoreSearch: true })) || fetch(e.request)));
});
