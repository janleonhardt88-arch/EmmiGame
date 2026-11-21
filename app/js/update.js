// 🔄 Offline-Modus anmelden und melden, wenn eine neue Version bereitsteht.
// Der Service Worker lädt neue Versionen im Hintergrund; sobald er übernommen hat,
// zeigt die App einen Hinweis – ein Tipp darauf lädt die neue Version.
export function initUpdates() {
  try {
    if (!('serviceWorker' in navigator)) return;
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') return;
    // Beim allerersten Start übernimmt der Service Worker ohne Hinweis; jede spätere Übernahme ist eine neue Version
    let controlled = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (controlled) showBanner();
      controlled = true;
    });
    navigator.serviceWorker.register('sw.js').then((reg) => {
      const check = () => reg.update().catch(() => {});
      document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') check(); });
      setInterval(check, 30 * 60 * 1000);
    }).catch(() => {});
  } catch (e) { /* z. B. in eingebetteten Ansichten nicht verfügbar */ }
}

function showBanner() {
  if (document.querySelector('.update-banner')) return;
  const b = document.createElement('button');
  b.className = 'update-banner';
  b.textContent = '🎉 Neue Version da – tippen zum Aktualisieren';
  b.addEventListener('click', () => location.reload());
  document.body.appendChild(b);
}
