// Eigene Sprachaufnahmen (z. B. Mama auf Portugiesisch), gespeichert in IndexedDB auf dem Gerät.
const DB = 'emmigame-audio';
const STORE = 'clips';
let db = null;
const urls = new Map();

function openDb() {
  return new Promise((resolve, reject) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE);
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

export const clipKey = (lang, text) => `${lang}|${text}`;

export async function initClips() {
  try {
    db = await openDb();
    await new Promise((resolve) => {
      const req = db.transaction(STORE).objectStore(STORE).openCursor();
      req.onsuccess = () => {
        const c = req.result;
        if (c) { urls.set(c.key, URL.createObjectURL(c.value)); c.continue(); } else resolve();
      };
      req.onerror = () => resolve();
    });
  } catch (e) { /* IndexedDB nicht verfügbar – dann eben ohne Aufnahmen */ }
}

export function clipUrl(lang, text) { return urls.get(clipKey(lang, text)) || null; }
export function clipCount() { return urls.size; }

function tx(mode, fn) {
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    fn(t.objectStore(STORE));
    t.oncomplete = () => resolve();
    t.onerror = () => reject(t.error);
  });
}

export async function saveClip(lang, text, blob) {
  if (!db) db = await openDb();
  const k = clipKey(lang, text);
  await tx('readwrite', (st) => st.put(blob, k));
  if (urls.has(k)) URL.revokeObjectURL(urls.get(k));
  urls.set(k, URL.createObjectURL(blob));
}

export async function deleteClip(lang, text) {
  if (!db) db = await openDb();
  const k = clipKey(lang, text);
  await tx('readwrite', (st) => st.delete(k));
  if (urls.has(k)) URL.revokeObjectURL(urls.get(k));
  urls.delete(k);
}

export function canRecord() {
  return !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder && window.indexedDB);
}

// Startet eine Aufnahme. Rückgabe: { stop(), done: Promise<Blob> }
export async function startRecording(maxMs = 5000) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mr = new MediaRecorder(stream);
  const chunks = [];
  mr.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
  const done = new Promise((resolve) => {
    mr.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      resolve(new Blob(chunks, { type: mr.mimeType || 'audio/webm' }));
    };
  });
  mr.start();
  const timer = setTimeout(() => { if (mr.state !== 'inactive') mr.stop(); }, maxMs);
  return { stop() { clearTimeout(timer); if (mr.state !== 'inactive') mr.stop(); }, done };
}
