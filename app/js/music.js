// 🎵 Hintergrundmusik – echte Musikstücke (MP3), leise im Hintergrund.
// Die Stücke werden einmal komplett geladen (funktioniert dadurch auch offline) und abwechselnd gespielt.
// Neue Stücke: MP3 in app/music/ legen, hier in TRACKS und in sw.js eintragen.

const TRACKS = ['music/garten-1.mp3', 'music/garten-2.mp3'];

// An Lernorten läuft die Musik leiser, damit sie beim Nachdenken nicht stört
const VOL_NORMAL = 0.22;
const VOL_FOCUS = 0.12;
const VOL_DUCKED = 0.05;
const FOCUS_PLACES = new Set(['dojo', 'ballet', 'stage', 'craft', 'climb']);

let enabled = true;
let unlocked = false;
let playing = false;
let focus = false;
let ducked = false;
let el = null;
let index = Math.floor(Math.random() * TRACKS.length);
let fadeTimer = null;
const blobs = new Map();

const targetVolume = () => (ducked ? VOL_DUCKED : focus ? VOL_FOCUS : VOL_NORMAL);

async function urlFor(src) {
  if (blobs.has(src)) return blobs.get(src);
  const res = await fetch(src);
  if (!res.ok) throw new Error('Musik fehlt: ' + src);
  const url = URL.createObjectURL(await res.blob());
  blobs.set(src, url);
  return url;
}

function fadeTo(audio, target, ms, then) {
  clearInterval(fadeTimer);
  const steps = Math.max(1, Math.round(ms / 50));
  const delta = (target - audio.volume) / steps;
  let n = 0;
  fadeTimer = setInterval(() => {
    n++;
    audio.volume = Math.min(1, Math.max(0, n >= steps ? target : audio.volume + delta));
    if (n >= steps) { clearInterval(fadeTimer); then?.(); }
  }, 50);
}

async function playNext() {
  index = (index + 1) % TRACKS.length;
  let url;
  try { url = await urlFor(TRACKS[index]); } catch (e) { playing = false; return; }
  if (!playing) return;
  const a = new Audio(url);
  a.volume = 0;
  a.addEventListener('ended', () => { if (el === a && playing) playNext(); });
  el = a;
  a.play().then(() => fadeTo(a, targetVolume(), 900)).catch(() => { playing = false; });
}

function apply() {
  const should = enabled && unlocked && document.visibilityState === 'visible';
  if (should && !playing) {
    playing = true;
    if (el) el.play().then(() => fadeTo(el, targetVolume(), 600)).catch(() => {});
    else playNext();
  } else if (!should && playing) {
    playing = false;
    if (el) { const a = el; fadeTo(a, 0, 300, () => a.pause()); }
  }
}

export const music = {
  setEnabled(on) { enabled = on; apply(); },
  // Browser erlauben Musik erst nach dem ersten Antippen
  unlock() { if (!unlocked) { unlocked = true; apply(); } },
  setPlace(place) {
    focus = FOCUS_PLACES.has(place);
    if (el && playing) fadeTo(el, targetVolume(), 500);
  },
  // Beim Vorlesen wird die Musik kurz leiser
  duck(on) {
    if (ducked === on) return;
    ducked = on;
    if (el && playing) fadeTo(el, targetVolume(), 250);
  },
  isPlaying: () => playing,
};

document.addEventListener('visibilitychange', apply);
