// Soundeffekte (synthetisch, keine Dateien nötig) und Sprachausgabe.
const prefs = { sound: true, speech: true };
export function setAudioPrefs(p) { Object.assign(prefs, p); }

let ctx = null;
function ac() {
  if (!ctx) {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    ctx = new C();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(f, t0, dur, { type = 'sine', vol = 0.16, slide = null } = {}) {
  const c = ac(); if (!c) return;
  const t = c.currentTime + t0;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t); o.stop(t + dur + 0.03);
}

function noise(t0, dur, { vol = 0.3, freq = 1200, q = 0.8 } = {}) {
  const c = ac(); if (!c) return;
  const t = c.currentTime + t0;
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = c.createBufferSource(); src.buffer = buf;
  const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q;
  const g = c.createGain(); g.gain.value = vol;
  src.connect(f).connect(g).connect(c.destination);
  src.start(t);
}

const S = (fn) => (...a) => { if (prefs.sound) fn(...a); };

export const sfx = {
  unlock() { ac(); },
  tick: S(() => tone(700, 0, 0.05, { type: 'triangle', vol: 0.07 })),
  pop: S(() => tone(380, 0, 0.14, { slide: 900 })),
  correct: S(() => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.08, 0.2, { type: 'triangle', vol: 0.14 }))),
  wrong: S(() => { tone(320, 0, 0.18, { slide: 220, vol: 0.12 }); tone(250, 0.16, 0.24, { slide: 170, vol: 0.12 }); }),
  chop: S(() => { noise(0, 0.18, { freq: 1600, vol: 0.6 }); tone(170, 0, 0.22, { slide: 55, vol: 0.35 }); }),
  water: S(() => { for (let i = 0; i < 6; i++) tone(700 + Math.random() * 700, i * 0.07, 0.09, { slide: 1500 + Math.random() * 500, vol: 0.06 }); }),
  coin: S(() => { tone(988, 0, 0.09, { type: 'square', vol: 0.05 }); tone(1319, 0.09, 0.28, { type: 'square', vol: 0.05 }); }),
  harvest: S(() => [392, 523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.07, 0.22, { type: 'triangle', vol: 0.12 }))),
  fanfare: S(() => {
    const m = [[523, 0, 0.15], [523, 0.16, 0.15], [523, 0.32, 0.15], [659, 0.5, 0.45], [784, 1.0, 0.2], [659, 1.2, 0.15], [784, 1.38, 0.6]];
    m.forEach(([f, t, d]) => { tone(f, t, d, { type: 'triangle', vol: 0.14 }); tone(f / 2, t, d, { type: 'sine', vol: 0.08 }); });
  }),
  hop: S(() => tone(500, 0, 0.12, { slide: 1100, vol: 0.1 })),
};

// ---------- Sprachausgabe ----------
let voices = [];
function loadVoices() { voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : []; }
if ('speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices);
}
const norm = (l) => (l || '').toLowerCase().replace('_', '-');

export function findVoice(lang) {
  if (!voices.length) loadVoices();
  const L = norm(lang), base = L.split('-')[0];
  const exact = voices.filter((v) => norm(v.lang) === L);
  if (exact.length) return exact.find((v) => v.localService) || exact[0];
  return voices.find((v) => norm(v.lang).startsWith(base)) || null;
}

export function speak(text, lang = 'de-DE', { queue = false } = {}) {
  if (!prefs.speech || !('speechSynthesis' in window)) return;
  const syn = window.speechSynthesis;
  if (!queue) syn.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  const v = findVoice(lang);
  if (v) u.voice = v;
  u.rate = lang.startsWith('de') ? 1 : 0.85;
  syn.speak(u);
}

export function voiceInfo(lang) {
  if (!('speechSynthesis' in window)) return { ok: false, text: 'Sprachausgabe wird nicht unterstützt' };
  const v = findVoice(lang);
  if (!v) return { ok: false, text: 'keine Stimme gefunden' };
  return { ok: norm(v.lang) === norm(lang), text: `${v.name} (${v.lang})` };
}
