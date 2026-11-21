// 🎹 Klavier im Häuschen: frei spielen, Lieder nachspielen, Melodien-Echo
import { state, save } from './state.js';
import { audioCtx, speak } from './audio.js';
import { music } from './music.js';
import { api, $, esc, pick } from './core.js';

// Tastatur C4 bis G5 (deutsche Notennamen, H statt B)
const WHITE = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'H4', 'C5', 'D5', 'E5', 'F5', 'G5'];
const BLACK = { C4: 'Cis4', D4: 'Dis4', F4: 'Fis4', G4: 'Gis4', A4: 'Ais4', C5: 'Cis5', D5: 'Dis5', F5: 'Fis5' };
const SEMI = { C: 0, Cis: 1, D: 2, Dis: 3, E: 4, F: 5, Fis: 6, G: 7, Gis: 8, A: 9, Ais: 10, H: 11 };
const freq = (n) => { const [, name, oct] = n.match(/^([A-Za-z]+)(\d)$/); const midi = 12 * (Number(oct) + 1) + SEMI[name]; return 440 * 2 ** ((midi - 69) / 12); };
const label = (n) => n.replace(/\d$/, '').replace('is', '♯');
// Boomwhacker-Farben: jeder Ton hat seine Farbe, das hilft beim Nachspielen
const COLOR = { C: '#ff5a5a', D: '#ff9a2e', E: '#ffd23b', F: '#62cc5c', G: '#3fc7b4', A: '#4f8fd6', H: '#c77dff' };
const colorOf = (n) => COLOR[n[0]] || '#9b7bff';

// Lieder: [Ton, Dauer in Schlägen, Silbe]
const S = (txt) => txt.trim().split(/\s+/).map((t) => { const [n, d = '1', w = ''] = t.split('/'); return [n, Number(d), w.replace(/_/g, ' ')]; });
export const SONGS = [
  { id: 'entchen', de: 'Alle meine Entchen', ico: '🦆', tempo: 420, notes: S(`
    C4/1/Al D4/1/le E4/1/mei F4/1/ne G4/2/Ent G4/2/chen
    A4/1/schwim A4/1/men A4/1/auf A4/1/dem G4/4/See
    A4/1/schwim A4/1/men A4/1/auf A4/1/dem G4/4/See
    F4/1/Köpf F4/1/chen F4/1/in F4/1/das E4/2/Was E4/2/ser
    D4/1/Schwänz D4/1/chen D4/1/in D4/1/die C4/4/Höh`) },
  { id: 'haenschen', de: 'Hänschen klein', ico: '🎒', tempo: 400, notes: S(`
    G4/1/Häns E4/1/chen E4/2/klein F4/1/ging D4/1/al D4/2/lein
    C4/1/in D4/1/die E4/1/wei F4/1/te G4/1/Welt G4/1/hi G4/2/nein
    G4/1/Stock E4/1/und E4/2/Hut F4/1/steht D4/1/ihm D4/2/gut
    C4/1/ist E4/1/gar G4/1/wohl G4/1/ge C4/4/mut`) },
  { id: 'stern', de: 'Morgen kommt der Weihnachtsmann', ico: '⭐', tempo: 420, notes: S(`
    C4/1/Mor C4/1/gen G4/1/kommt G4/1/der A4/1/Weih A4/1/nachts G4/2/mann
    F4/1/kommt F4/1/mit E4/1/sei E4/1/nen D4/1/Ga D4/1/ben C4/2/Trom
    G4/1/mel G4/1/Pfei F4/1/fe F4/1/und E4/1/Ge E4/1/wehr D4/2/Fahn
    G4/1/und G4/1/Sä F4/1/bel F4/1/und E4/1/noch E4/1/viel D4/2/mehr
    C4/1/ja C4/1/ein G4/1/gan G4/1/zes A4/1/Krie A4/1/ges G4/2/heer
    F4/1/möcht F4/1/ich E4/1/ger E4/1/ne D4/1/ha D4/1/ben C4/2/!`) },
  { id: 'jakob', de: 'Bruder Jakob', ico: '🔔', tempo: 380, notes: S(`
    G4/1/Bru A4/1/der H4/1/Ja G4/1/kob G4/1/Bru A4/1/der H4/1/Ja G4/1/kob
    H4/1/schläfst C5/1/du D5/2/noch H4/1/schläfst C5/1/du D5/2/noch
    D5/0.5/hörst E5/0.5/du D5/0.5/nicht C5/0.5/die H4/1/Glo G4/1/cken
    D5/0.5/hörst E5/0.5/du D5/0.5/nicht C5/0.5/die H4/1/Glo G4/1/cken
    G4/1/ding D4/1/dang G4/2/dong G4/1/ding D4/1/dang G4/2/dong`) },
  { id: 'freude', de: 'Ode an die Freude', ico: '🎶', tempo: 400, notes: S(`
    E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 E4/1.5 D4/0.5 D4/2
    E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 D4/1.5 C4/0.5 C4/2`) },
  { id: 'geburtstag', de: 'Zum Geburtstag viel Glück', ico: '🎂', tempo: 400, notes: S(`
    G4/0.75/Zum G4/0.25/Ge A4/1/burts G4/1/tag C5/1/viel H4/2/Glück
    G4/0.75/zum G4/0.25/Ge A4/1/burts G4/1/tag D5/1/viel C5/2/Glück
    G4/0.75/zum G4/0.25/Ge G5/1/burts E5/1/tag C5/1/lie H4/1/be A4/2/Emmi
    F5/0.75/zum F5/0.25/Ge E5/1/burts C5/1/tag D5/1/viel C5/2/Glück`) },
];

const INSTRUMENTS = {
  piano: { de: 'Klavier', ico: '🎹' },
  bells: { de: 'Glockenspiel', ico: '🔔' },
  flute: { de: 'Flöte', ico: '🪈' },
  music: { de: 'Spieluhr', ico: '🎠' },
};

// ---------- Klang ----------
function play(n, dur = 1) {
  const c = audioCtx();
  if (!c) return;
  const f = freq(n);
  const t = c.currentTime;
  const out = c.createGain();
  out.connect(c.destination);
  const inst = state.pianoSound || 'piano';
  const osc = (type, mul, vol, decay, attack = 0.006) => {
    const o = c.createOscillator(); const g = c.createGain();
    o.type = type; o.frequency.value = f * mul;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    o.connect(g).connect(out); o.start(t); o.stop(t + decay + 0.05);
    return o;
  };
  if (inst === 'bells') { osc('sine', 1, 0.22, 1.6); osc('sine', 2.76, 0.06, 0.5); osc('sine', 5.4, 0.03, 0.25); }
  else if (inst === 'flute') {
    const d = Math.max(0.35, 0.45 * dur);
    const o = osc('sine', 1, 0.2, d + 0.3, 0.08); osc('triangle', 2, 0.025, d + 0.2, 0.08);
    const lfo = c.createOscillator(); const lg = c.createGain(); lfo.frequency.value = 5; lg.gain.value = f * 0.006;
    lfo.connect(lg).connect(o.frequency); lfo.start(t); lfo.stop(t + d + 0.4);
  } else if (inst === 'music') { osc('sine', 2, 0.16, 1.1); osc('sine', 4, 0.05, 0.4); osc('triangle', 1, 0.04, 0.8); }
  else { osc('triangle', 1, 0.24, 1.8); osc('sine', 2, 0.08, 1.0); osc('sine', 3, 0.03, 0.5); osc('sine', 0.5, 0.03, 1.2); }
}

// ---------- Ansicht ----------
let mode = 'free'; // free | song | echo
let song = null; // { s, i, wrong, demo }
let echo = null; // { seq, i, best, listening }
let timers = [];
const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
const later = (ms, fn) => timers.push(setTimeout(() => { if ($('.piano-modal')) fn(); }, ms));

function keyboard() {
  const names = state.pianoNames !== false;
  return `<div class="pkeys">${WHITE.map((n) => `
      <button class="pkey white" data-n="${n}" style="--c:${colorOf(n)}">${names ? `<span>${label(n)}</span>` : ''}</button>
      ${BLACK[n] ? `<button class="pkey black" data-n="${BLACK[n]}"></button>` : ''}`).join('')}</div>`;
}

function strip() {
  if (mode === 'song' && song) {
    const notes = song.s.notes;
    const from = Math.max(0, song.i - 3);
    return `<div class="pstrip">${notes.slice(from, from + 12).map(([n, , w], k) => {
      const i = from + k;
      return `<span class="pnote ${i < song.i ? 'done' : i === song.i ? 'now' : ''}" style="--c:${colorOf(n)}"><b>${label(n)}</b>${w ? `<small>${esc(w === 'Emmi' ? state.name : w)}</small>` : ''}</span>`;
    }).join('')}</div>
    <div class="pprog"><i style="width:${Math.round((song.i / notes.length) * 100)}%"></i></div>`;
  }
  if (mode === 'echo' && echo) {
    return `<div class="pecho">${echo.listening ? '👂 Hör gut zu …' : `🎹 Jetzt du! Ton ${echo.i + 1} von ${echo.seq.length}`}
      <span class="pecho-dots">${echo.seq.map((_, k) => `<i class="${k < echo.i ? 'ok' : ''}"></i>`).join('')}</span>
      <small>Rekord: ${state.pianoEcho || 0} Töne</small></div>`;
  }
  if (mode === 'song') return '<p class="note">Such dir ein Lied aus! Erst hörst du es, dann leuchtet immer die nächste Taste. ✨</p>';
  return '<p class="note">Spiel einfach drauflos! 🎶 Jede Farbe ist ein Ton.</p>';
}

function render() {
  const m = $('.piano-modal');
  if (!m) return;
  const inst = state.pianoSound || 'piano';
  $('.pbody', m).innerHTML = `
    <div class="ptabs">
      <button class="tab ${mode === 'free' ? 'active' : ''}" data-pmode="free">🎵 Frei spielen</button>
      <button class="tab ${mode === 'song' ? 'active' : ''}" data-pmode="song">📖 Lied lernen</button>
      <button class="tab ${mode === 'echo' ? 'active' : ''}" data-pmode="echo">👂 Nachspielen</button>
    </div>
    ${mode === 'song' && !song ? `<div class="psongs">${SONGS.map((s) => `<button class="psong" data-song="${s.id}"><span>${s.ico}</span>${esc(s.de)}${(state.pianoSongs || {})[s.id] ? '<small>⭐ gelernt</small>' : ''}</button>`).join('')}</div>` : ''}
    ${mode === 'song' && song ? `<div class="psong-head"><b>${song.s.ico} ${esc(song.s.de)}</b>
        <button class="btn small" data-pdo="demo">▶ Vorspielen</button><button class="btn small ghost" data-pdo="songs">Anderes Lied</button></div>` : ''}
    ${mode === 'echo' && !echo ? '<div class="psong-head"><span>Das Klavier spielt ein paar Töne – spiel sie nach! Es werden immer mehr.</span><button class="btn primary" data-pdo="echo-start">Los geht’s!</button></div>' : ''}
    ${strip()}
    ${keyboard()}
    <div class="popts">
      ${Object.entries(INSTRUMENTS).map(([id, x]) => `<button class="popt ${inst === id ? 'sel' : ''}" data-inst="${id}">${x.ico} ${x.de}</button>`).join('')}
      <button class="popt ${state.pianoNames !== false ? 'sel' : ''}" data-pdo="names">🔤 Notennamen</button>
    </div>`;
  highlight();
}

function highlight() {
  document.querySelectorAll('.pkey.hint').forEach((k) => k.classList.remove('hint'));
  if (mode === 'song' && song && !song.demo) {
    const n = song.s.notes[song.i]?.[0];
    document.querySelector(`.pkey[data-n="${n}"]`)?.classList.add('hint');
  }
}

function flash(n, cls = 'down') {
  const k = document.querySelector(`.pkey[data-n="${n}"]`);
  if (!k) return;
  k.classList.add(cls);
  setTimeout(() => k.classList.remove(cls), 260);
}

// Lied vorspielen (Tasten leuchten mit)
function demo(notes, tempo, done) {
  clearTimers();
  let t = 300;
  notes.forEach(([n, d]) => {
    later(t, () => { play(n, d); flash(n, 'demo'); });
    t += d * tempo;
  });
  later(t + 200, done);
}

function press(n) {
  play(n, 1);
  flash(n);
  if (mode === 'song' && song && !song.demo) {
    const want = song.s.notes[song.i][0];
    if (n !== want) { song.wrong++; flash(want, 'wrongkey'); return; }
    song.i++;
    if (song.i >= song.s.notes.length) return songDone();
    render();
  } else if (mode === 'echo' && echo && !echo.listening) {
    if (n !== echo.seq[echo.i]) {
      flash(echo.seq[echo.i], 'wrongkey');
      const reached = echo.seq.length - 1;
      api.toast(reached >= 3 ? `Toll! Du hast dir ${reached} Töne gemerkt. 🌟` : 'Hoppla! Hör nochmal gut zu. 🙂');
      if (reached > (state.pianoEcho || 0)) { state.pianoEcho = reached; save(); }
      echo = null;
      later(700, render);
      return;
    }
    echo.i++;
    if (echo.i >= echo.seq.length) {
      if (echo.seq.length >= 3 && echo.seq.length % 2 === 1) api.addStars(1);
      if (echo.seq.length > (state.pianoEcho || 0)) { state.pianoEcho = echo.seq.length; save(); }
      echo.seq.push(pick(WHITE.slice(0, 8)));
      echo.i = 0;
      render();
      later(800, echoPlay);
    } else render();
  }
}

function echoPlay() {
  if (!echo) return;
  echo.listening = true;
  render();
  echo.seq.forEach((n, k) => later(k * 600 + 200, () => { play(n); flash(n, 'demo'); }));
  later(echo.seq.length * 600 + 300, () => { if (echo) { echo.listening = false; render(); } });
}

function songDone() {
  const s = song.s;
  const first = !(state.pianoSongs || {})[s.id];
  state.pianoSongs = { ...(state.pianoSongs || {}), [s.id]: true };
  save();
  const stars = (first ? 5 : 1) + (song.wrong <= 2 ? 2 : 0);
  api.confetti(60);
  api.addStars(stars);
  api.addXP(3);
  api.toast(`🎉 ${s.de} geschafft!${song.wrong <= 2 ? ' Fast ohne Fehler!' : ''} +${stars} ⭐`);
  song = null;
  render();
}

export function openPiano() {
  mode = 'free'; song = null; echo = null; clearTimers();
  music.duck(true);
  const m = api.openModal('<h2>🎹 Mein Klavier</h2><div class="pbody"></div><div class="btn-row"><button class="btn primary big" data-act="piano-close">Fertig</button></div>', { cls: 'piano-modal wide', closable: false });
  render();
  speak('o piano', 'pt-PT');
  m.addEventListener('pointerdown', (e) => {
    const k = e.target.closest('.pkey');
    if (k) { e.preventDefault(); press(k.dataset.n); }
  });
  m.addEventListener('click', (e) => {
    const t = e.target.closest('[data-pmode],[data-song],[data-pdo],[data-inst]');
    if (!t) return;
    clearTimers();
    if (t.dataset.pmode) { mode = t.dataset.pmode; song = null; echo = null; }
    else if (t.dataset.song) { song = { s: SONGS.find((x) => x.id === t.dataset.song), i: 0, wrong: 0 }; render(); return startDemo(); }
    else if (t.dataset.inst) { state.pianoSound = t.dataset.inst; save(); play('C5'); }
    else if (t.dataset.pdo === 'names') { state.pianoNames = state.pianoNames === false; save(); }
    else if (t.dataset.pdo === 'songs') song = null;
    else if (t.dataset.pdo === 'demo' && song) return startDemo();
    else if (t.dataset.pdo === 'echo-start') { echo = { seq: [pick(WHITE.slice(0, 5)), pick(WHITE.slice(0, 5))], i: 0 }; render(); later(500, echoPlay); return; }
    render();
  });
}
function startDemo() {
  song.demo = true;
  song.i = 0;
  highlight();
  demo(song.s.notes, song.s.tempo, () => { if (song) { song.demo = false; song.i = 0; render(); api.toast('Jetzt du! Tipp die leuchtende Taste. ✨'); } });
}

export const pianoActions = {
  'piano-close': () => { clearTimers(); song = null; echo = null; music.duck(false); api.closeModal(); },
};
