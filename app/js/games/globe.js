// ✈️ Flughafen – auf der Weltkarte ein Land antippen, hinfliegen, Fragen beantworten, Stempel sammeln
import { state, save } from '../state.js';
import * as art from '../art.js';
import { sfx, speak, speechDone } from '../audio.js';
import { COUNTRIES, allGeoTasks, GREETINGS, GREETING_WORDS, inCountry } from '../erdkunde.js';
import { LAND, SHAPES } from '../worldmap.js';
import { api, $, esc, shuffle } from '../core.js';
import { runQuiz } from './quiz.js';

const ROUND = 6;
const ALL = allGeoTasks();
let quiz = null;
let flying = false;
let view = null; // 'world' | 'europe'
let target = null;

// Lage der Stecknadeln (Länge, Breite) – bei kleinen Ländern etwas zur Landesmitte geschoben
const LONLAT = {
  de: [10.4, 51.2], pt: [-8.2, 39.6], fr: [2.4, 46.8], es: [-3.7, 40.2], it: [12.6, 42.6], gb: [-1.8, 52.8], at: [14.6, 47.6],
  ch: [8.2, 46.8], nl: [5.4, 52.3], dk: [9.4, 56.1], pl: [19.4, 52.1], gr: [22.2, 39.4], se: [15.6, 61.5], ie: [-8, 53.2],
  br: [-50, -10], us: [-98, 39], ca: [-100, 58], mx: [-102, 23.5], ar: [-65, -35], jp: [138.5, 36.5], cn: [104, 34],
  in: [79, 22], au: [134, -25], eg: [30, 26.5], za: [24, -29.5],
};
const XY = (id) => [LONLAT[id][0] + 180, 90 - LONLAT[id][1]];
const EUROPE = new Set(COUNTRIES.filter((c) => c.cont === 'Europa').map((c) => c.id));
const VIEWS = { world: [0, 8, 360, 150], europe: [152, 25, 72, 30] };
const here = () => state.geoAt || 'de';
const byId = (id) => COUNTRIES.find((c) => c.id === id);
const level = () => Math.min(3, Math.max(1, state.geoLevel || 1));
const cname = (c) => c.de.replace(/^(die|der|das) /, (m) => m[0].toUpperCase() + m.slice(1));

const top = () => `<div class="wood-bar"><span>🛂 <b>${Object.keys(state.stamps).length}</b> / ${COUNTRIES.length} Stempel</span><span>📍 ${byId(here()).flag} ${esc(byId(here()).de.replace(/^(die|der|das) /, ''))}</span></div>`;
const bg = '<div class="globe-bg"></div>';

// Kleines Flugzeug, zeigt nach rechts
const PLANE = `<g class="plane-ico"><path d="M-6 -.9 L4 -.9 Q7 0 4 .9 L-6 .9Z" fill="#fff" stroke="#3a2a35" stroke-width=".35"/>
  <path d="M-1 -.6 L-3.4 -4.2 L-1.6 -4.2 L2 -.6Z M-1 .6 L-3.4 4.2 L-1.6 4.2 L2 .6Z" fill="#ff7eb6" stroke="#3a2a35" stroke-width=".3"/>
  <path d="M-5.6 -.6 L-7 -2.6 L-6 -2.6 L-4.2 -.6Z M-5.6 .6 L-7 2.6 L-6 2.6 L-4.2 .6Z" fill="#ff7eb6" stroke="#3a2a35" stroke-width=".3"/>
  <circle cx="2.4" cy="0" r=".45" fill="#7cc8ff"/><circle cx=".8" cy="0" r=".45" fill="#7cc8ff"/><circle cx="-.8" cy="0" r=".45" fill="#7cc8ff"/></g>`;

function mapSvg({ fly = false } = {}) {
  const [vx, vy, vw, vh] = VIEWS[view];
  const k = vw / 360 * 1.6; // Größe der Nadeln passend zum Ausschnitt
  const pins = COUNTRIES.filter((c) => (view === 'europe' ? EUROPE.has(c.id) : !EUROPE.has(c.id)));
  const pin = (c) => {
    const [x, y] = XY(c.id);
    const done = state.stamps[c.id];
    return `<g class="pin ${done ? 'done' : ''} ${c.id === here() ? 'here' : ''}" ${fly ? '' : `data-act="globe-pick" data-id="${c.id}"`} transform="translate(${x} ${y}) scale(${k})">
      <circle r="4.6" fill="${c.id === here() ? '#ff7eb6' : done ? '#ffd23b' : '#fff'}" stroke="#3a2a35" stroke-width=".5"/>
      <text y="1.9" text-anchor="middle" font-size="5.4">${c.flag}</text>
      ${done ? '<circle cx="3.6" cy="-3.4" r="1.7" fill="#62cc5c" stroke="#fff" stroke-width=".4"/><path d="M2.8 -3.4 L3.4 -2.7 L4.4 -4" stroke="#fff" stroke-width=".55" fill="none"/>' : ''}
    </g>`;
  };
  const eu = view === 'world' ? `<g class="pin cluster" ${fly ? '' : 'data-act="globe-view" data-v="europe"'} transform="translate(193 38) scale(${k})">
      <rect x="-14.5" y="-5.6" width="29" height="11.2" rx="5.6" fill="#9b7bff" stroke="#fff" stroke-width=".7"/>
      <text y="1.9" text-anchor="middle" font-size="4.6" font-weight="800" fill="#fff" font-family="Nunito, sans-serif">Europa 🔍</text></g>` : '';
  const shapes = Object.entries(SHAPES).map(([id, d]) => (state.stamps[id] || id === here()
    ? `<path d="${d}" fill="${id === here() ? '#ffb8d6' : '#ffe27a'}" stroke="#e6a100" stroke-width="${0.25 * vw / 72}"/>` : '')).join('');
  return art.svg(`
    <defs><radialGradient id="ocean" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#bfe8ff"/><stop offset="1" stop-color="#7cc4f2"/></radialGradient></defs>
    <rect x="-20" y="-20" width="400" height="220" fill="url(#ocean)"/>
    <path d="${LAND}" fill="#c9eba5" stroke="#8cc46a" stroke-width="${0.35 * vw / 120}" stroke-linejoin="round"/>
    ${shapes}
    <path id="fly-trail" d="" fill="none" stroke="#ff5a7a" stroke-width="${vw / 260}" stroke-dasharray="${vw / 120} ${vw / 120}" stroke-linecap="round"/>
    ${pins.map(pin).join('')}${eu}
    <g id="fly-plane" transform="translate(-50 -50)"><g transform="scale(${k * 1.2})">${PLANE}</g></g>`,
  { vb: VIEWS[view].join(' '), par: 'xMidYMid slice' });
}

function render() {
  if (quiz || flying) return;
  if (!view) view = EUROPE.has(here()) ? 'europe' : 'world';
  $('#screen').innerHTML = `
    <div class="globe airport">
      ${bg}
      ${top()}
      <div class="wmap-box">
        <div class="wmap-head">
          <b>Wohin fliegen wir? ✈️</b>
          <div class="wmap-tabs">
            <button class="tab ${view === 'world' ? 'active' : ''}" data-act="globe-view" data-v="world">🌍 Welt</button>
            <button class="tab ${view === 'europe' ? 'active' : ''}" data-act="globe-view" data-v="europe">🇪🇺 Europa</button>
            <button class="tab" data-act="globe-pass">🛂 Reisepass</button>
          </div>
        </div>
        <div class="wmap-scroll"><div class="wmap">${mapSvg()}</div></div>
        <p class="note">Tipp auf eine Flagge, dann fliegst du hin! Für jedes Land gibt es einen Stempel.</p>
      </div>
    </div>`;
  centerOn(here());
}

// Auf schmalen Bildschirmen ist die Karte breiter als der Bildschirm: zum Land scrollen
function centerOn(id) {
  const sc = $('.wmap-scroll');
  if (!sc || sc.scrollWidth <= sc.clientWidth) return;
  const [vx, , vw] = VIEWS[view];
  const f = (XY(id)[0] - vx) / vw;
  sc.scrollLeft = Math.max(0, f * sc.scrollWidth - sc.clientWidth / 2);
}

function pick(id) {
  const c = byId(id);
  sfx.pop();
  if (id === here()) { api.toast(`Hier bist du gerade: ${c.flag} ${cname(c)}`); return countryCard(id); }
  api.openModal(`
    <div class="country-card"><div class="flag-huge">${c.flag}</div></div>
    <h2>Flug nach ${esc(cname(c))}?</h2>
    <p class="big">🌍 ${esc(c.cont)} ${state.stamps[c.id] ? '· ✅ Stempel hast du schon' : '· 🛂 Neuer Stempel!'}</p>
    <div class="btn-row">
      <button class="btn big" data-act="close">Lieber nicht</button>
      <button class="btn primary big" data-act="globe-fly" data-id="${id}">Abflug! ✈️</button>
    </div>`);
  speak(c.pt, 'pt-PT');
}

// ---------- Flug ----------
function fly(id) {
  api.closeModal();
  target = id;
  const from = here();
  view = EUROPE.has(from) && EUROPE.has(id) ? 'europe' : 'world';
  flying = true;
  $('#screen').innerHTML = `
    <div class="globe airport">
      ${bg}
      ${top()}
      <div class="wmap-box">
        <div class="wmap-head"><b>Wir fliegen nach ${byId(id).flag} ${esc(cname(byId(id)))} … 🌤️</b></div>
        <div class="wmap-scroll"><div class="wmap">${mapSvg({ fly: true })}</div></div>
      </div>
    </div>`;
  sfx.whoosh?.();
  const [x0, y0] = XY(from);
  const [x1, y1] = XY(id);
  // Bogen: Kontrollpunkt über der Mitte
  const d = Math.hypot(x1 - x0, y1 - y0);
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2 - d * 0.35;
  const P = (t) => [(1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t * t * x1, (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t * t * y1];
  const dur = Math.min(4200, 1800 + d * (view === 'europe' ? 60 : 14));
  const t0 = performance.now();
  const plane = document.getElementById('fly-plane');
  const trail = document.getElementById('fly-trail');
  const step = (now) => {
    if (!flying) return;
    const t = Math.min(1, (now - t0) / dur);
    const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
    const [x, y] = P(e);
    const [xa, ya] = P(Math.min(1, e + 0.01));
    const ang = Math.atan2(ya - y, xa - x) * 180 / Math.PI;
    plane?.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${ang.toFixed(1)})`);
    const pts = []; for (let i = 0; i <= 24; i++) pts.push(P(e * i / 24).map((v) => v.toFixed(2)).join(' '));
    trail?.setAttribute('d', 'M' + pts.join(' L'));
    centerOn2(x);
    if (t < 1) requestAnimationFrame(step);
    else setTimeout(() => land(id), 400);
  };
  requestAnimationFrame(step);
}
function centerOn2(x) {
  const sc = $('.wmap-scroll');
  if (!sc || sc.scrollWidth <= sc.clientWidth) return;
  const [vx, , vw] = VIEWS[view];
  sc.scrollLeft = Math.max(0, ((x - vx) / vw) * sc.scrollWidth - sc.clientWidth / 2);
}

function land(id) {
  if (!flying) return;
  flying = false;
  sfx.correct();
  const c = byId(id);
  const g = GREETINGS[id];
  speak(welcome(c), 'de-DE');
  if (g && id !== 'de') speak(g.hi.say, g.tts, { queue: true });
  // Begrüßung ausreden lassen, dann geht es mit den Fragen los
  const head = $('.wmap-head b');
  if (head) head.textContent = `🛬 ${welcome(c)}${g && id !== 'de' ? ` ${g.hi.show}!` : ''}`;
  Promise.race([speechDone(), new Promise((r) => setTimeout(r, 6000))])
    .then(() => new Promise((r) => setTimeout(r, 500)))
    .then(() => { if (!flying && !quiz && api.screen() === 'globe') startQuiz(id); });
}

export const welcome = (c) => `Willkommen ${inCountry(c)}!`;

// ---------- Fragen im Land ----------
function makeRound(id) {
  const lv = level();
  const mine = shuffle(ALL.filter((t) => t.country?.id === id && t.kind !== 'flag')).slice(0, 3);
  const pool = ALL.filter((t) => t.level <= lv && t.country?.id !== id && t.kind !== 'greet');
  const rest = shuffle(pool).slice(0, ROUND - mine.length);
  return shuffle([...mine, ...rest]).map((t) => {
    if (t.w) return t;
    const wrong = shuffle(t.pool.filter((x) => x !== t.a)).slice(0, 2);
    return { ...t, w: wrong, icoHTML: ['flag', 'capital', 'cont', 'greet'].includes(t.kind) ? `<span class="flag-big">${t.ico}</span>` : null };
  });
}

function adapt(ok) {
  if (state.geoAuto === false) return;
  state.geoLevel = level();
  if (ok) {
    state.gStreak = (state.gStreak || 0) + 1; state.gWrong = 0;
    if (state.gStreak >= 8 && state.geoLevel < 3) { state.geoLevel++; state.gStreak = 0; }
  } else {
    state.gWrong = (state.gWrong || 0) + 1; state.gStreak = 0;
    if (state.gWrong >= 3 && state.geoLevel > 1) { state.geoLevel--; state.gWrong = 0; }
  }
}

function startQuiz(id) {
  quiz = runQuiz({
    cls: 'globe',
    bg: `<div class="globe-bg"></div><div class="landed-flag">${byId(id).flag}</div>`,
    top,
    tasks: makeRound(id),
    onRight: (t, firstTry) => {
      adapt(firstTry);
      const c = t.country;
      if (c) {
        const fb = $('#qfb');
        const g = GREETINGS[c.id];
        if (t.kind === 'greet') {
          if (fb) fb.innerHTML = `<span class="good">${c.flag} ${esc(t.greet.say)}${t.greet.say !== t.greet.show ? ` (${esc(t.greet.show)})` : ''} – sprich: <i>${esc(t.greet.how)}</i></span>`;
          speak(t.greet.say, t.tts, { queue: true });
        } else {
          if (fb) fb.innerHTML = `<span class="good">${c.flag} 🇵🇹 ${esc(c.pt)} · 🇬🇧 ${esc(c.en)}${g && c.id !== 'de' ? ` · 👋 ${esc(g.hi.show)}!` : ''}</span>`;
          speak(c.pt, 'pt-PT', { queue: true });
        }
      }
      save();
    },
    onDone: (res) => finish(id, res),
  });
}

// Länderkarte: Namen, Hauptstadt und Grüße zum Anhören
function cardHtml(id) {
  const c = byId(id);
  const g = GREETINGS[id];
  const row = (key) => `<button class="word greet" data-act="say" data-lang="${g.tts}" data-text="${esc(g[key].say)}">
      <span class="gw">${GREETING_WORDS[key]}</span><span class="w">${esc(g[key].say)}${g[key].say !== g[key].show ? `<small>${esc(g[key].show)}</small>` : ''}</span><span class="how">${esc(g[key].how)}</span><span class="spk">${art.iconSpeaker()}</span></button>`;
  return `
    <div class="country-card">
      <div class="flag-huge">${c.flag}</div>
      <h2>${esc(cname(c))}</h2>
      <div class="country-facts">
        <span>🏙️ Hauptstadt: <b>${esc(c.capital)}</b></span>
        <span>🌍 Kontinent: <b>${esc(c.cont)}</b></span>
        <span>🗣️ Sprache: <b>${esc(g.lang)}</b></span>
      </div>
      <div class="words">${row('hi')}${row('bye')}${row('thanks')}</div>
      <p class="note">🇵🇹 ${esc(c.pt)} · 🇬🇧 ${esc(c.en)}</p>
    </div>`;
}
function countryCard(id) {
  sfx.pop();
  api.openModal(cardHtml(id));
  const g = GREETINGS[id];
  speak(g.hi.say, g.tts);
}

function passport() {
  sfx.pop();
  api.openModal(`
    <h2>Mein Reisepass 🛂</h2>
    <p class="note">${Object.keys(state.stamps).length} von ${COUNTRIES.length} Ländern. Tipp auf einen Stempel!</p>
    <div class="stamps big">${COUNTRIES.map((c) => state.stamps[c.id]
      ? `<button class="stamp" data-act="globe-country" data-id="${c.id}" title="${esc(c.de)}">${c.flag}</button>`
      : '<span class="stamp missing">?</span>').join('')}</div>`);
}

function finish(id, { first, total }) {
  quiz = null;
  const isNew = !state.stamps[id];
  state.stamps[id] = true;
  state.geoAt = id;
  view = EUROPE.has(id) ? 'europe' : 'world';
  api.quest('globe');
  save();
  render();
  api.confetti(isNew ? 80 : 40);
  sfx.fanfare();
  api.openModal(`
    ${cardHtml(id)}
    <div class="result-row"><span>Beim ersten Versuch</span><b>${first} von ${total}</b></div>
    ${isNew ? `<div class="result-row"><span>Neuer Stempel im Reisepass</span><b>${byId(id).flag} +3 ⭐</b></div>` : ''}
    <div class="btn-row">
      <button class="btn primary big" data-act="close">Weiterreisen ✈️</button>
    </div>`, { cls: 'celebrate' });
  setTimeout(() => api.addStars(first + 1 + (isNew ? 3 : 0)), 400);
  api.addXP(first);
}

export default {
  id: 'globe',
  label: 'Flughafen',
  render,
  leave() { quiz?.stop(); quiz = null; flying = false; },
  actions: {
    'globe-pick': (el) => pick(el.dataset.id),
    'globe-fly': (el) => fly(el.dataset.id),
    'globe-view': (el) => { view = el.dataset.v; sfx.tick(); render(); },
    'globe-pass': () => passport(),
    'globe-country': (el) => countryCard(el.dataset.id),
  },
  quiz: () => quiz,
  quit: () => { quiz?.stop(); quiz = null; render(); },
};
