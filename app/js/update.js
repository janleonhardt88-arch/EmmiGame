// 🔄 Offline-Modus und Updates.
//  - Beim Start fragt die App den Server nach der neuesten Versionsnummer (version.json).
//    Gibt es eine neuere, wird sie sofort geladen und die App startet damit neu.
//  - Kommt eine neue Version während des Spielens, erscheint nur ein Hinweis zum Antippen.
//  - Der Spielstand (Gürtel, Sterne, Aussehen …) bleibt bei jedem Update erhalten:
//    er liegt getrennt im Speicher des Browsers und wird von Updates nicht angefasst.
import { BUILD } from './version.js';

const isDev = BUILD.startsWith('__');
const supported = () => 'serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost');
let registration = null;
let autoReload = false; // true, solange beim Start eine neue Version geholt wird

async function latestBuild() {
  const res = await fetch('version.json?t=' + Date.now(), { cache: 'no-store' });
  if (!res.ok) throw new Error('keine Versionsdatei');
  return (await res.json()).build;
}

function showBanner() {
  if (document.querySelector('.update-banner')) return;
  const b = document.createElement('button');
  b.className = 'update-banner';
  b.textContent = '🎉 Neue Version da – tippen zum Aktualisieren';
  b.addEventListener('click', () => location.reload());
  document.body.appendChild(b);
}

function showLoading() {
  const d = document.createElement('div');
  d.className = 'update-loading';
  d.innerHTML = '<div><span>🌻</span>Neue Version wird geladen …</div>';
  document.body.appendChild(d);
  return d;
}

// Prüft, ob es eine neuere Version gibt. Rückgabe: 'aktuell' | 'neu' | 'offline' | 'lokal'
export async function checkForUpdate() {
  if (isDev || !supported()) return 'lokal';
  let latest;
  try { latest = await latestBuild(); } catch (e) { return 'offline'; }
  if (latest === BUILD) return 'aktuell';
  try { await registration?.update(); } catch (e) { /* kommt beim nächsten Mal */ }
  return 'neu';
}

export function initUpdates() {
  try {
    if (!supported()) return;
    // Beim allerersten Start übernimmt der Service Worker ohne Hinweis; jede spätere Übernahme ist eine neue Version
    let controlled = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (controlled) { if (autoReload) location.reload(); else showBanner(); }
      controlled = true;
    });
    navigator.serviceWorker.register('sw.js').then(async (reg) => {
      registration = reg;
      const check = () => reg.update().catch(() => {});
      document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') check(); });
      setInterval(check, 30 * 60 * 1000);

      // Start-Prüfung: neuere Version? Dann gleich laden, bevor gespielt wird.
      if (isDev || !controlled) return;
      let latest;
      try { latest = await latestBuild(); } catch (e) { return; }
      if (latest === BUILD) return;
      autoReload = true;
      const overlay = showLoading();
      check();
      // Falls das Laden hängt (schlechtes Netz): nach 20 Sekunden einfach mit der alten Version weiterspielen
      setTimeout(() => { autoReload = false; overlay.remove(); }, 20000);
    }).catch(() => {});
  } catch (e) { /* z. B. in eingebetteten Ansichten nicht verfügbar */ }
}
