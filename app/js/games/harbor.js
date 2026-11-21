// ⛴️ Hafen & Schiffsreise – von Hafen zu Hafen fahren, Meerestiere entdecken, Knoten lernen, Kabine einrichten
import { state, save } from '../state.js';
import * as art from '../art.js';
import { sfx, speak } from '../audio.js';
import { PORTS, SEA_ANIMALS, SEA_QUESTIONS, SHIP_MATH, SHIP_WORDS, SHIP_PHRASES, langTasks, KNOTS, CABIN, HULLS, FUNNELS } from '../seefahrt.js';
import { COUNTRIES, GREETINGS, GREETING_WORDS } from '../erdkunde.js';
import { api, $, esc, pick, shuffle } from '../core.js';
import { runQuiz } from './quiz.js';

const LANG = langTasks();
let quiz = null;
let mode = 'home'; // home | cabin | knots | knot
let knot = null; // { k, order, next }
let leg = null; // { shells, animals }
let sailing = false;

const sh = () => {
  // Fehlende Felder ergänzen, ohne das Objekt auszutauschen (sonst gehen laufende Änderungen verloren)
  const d = { port: 0, trips: 0, shells: 0, album: {}, knots: {}, cabin: {}, owned: {}, hull: 'red', funnel: 'yellow', seen: {} };
  state.ship ||= {};
  for (const k of Object.keys(d)) if (state.ship[k] === undefined) state.ship[k] = d[k];
  return state.ship;
};
const shipLook = () => { const s = sh(); const h = HULLS[s.hull] || HULLS.red; return { hull: h.c, hullO: h.o, funnel: (FUNNELS[s.funnel] || FUNNELS.yellow).c, name: (state.name || 'Emmi').toUpperCase().slice(0, 8) }; };
const nextIdx = () => (sh().port + 1) % PORTS.length;
const shellBar = () => `<div class="wood-bar"><span>🐚 <b id="shell-n">${sh().shells}</b> Muscheln</span>${sh().trips ? `<span>🏆 ${sh().trips}× rundum</span>` : ''}</div>`;
const seaBg = (moving) => `<div class="sea-bg ${moving ? 'moving' : ''}"><div class="sea-sun"></div><div class="sea-cloud c1"></div><div class="sea-cloud c2"></div><div class="sea-water"><div class="wave w1"></div><div class="wave w2"></div><div class="wave w3"></div></div>${moving ? `<div class="sea-ship">${art.ship(shipLook())}</div>` : ''}</div>`;

// ---------- Seekarte ----------
const LAND = [
  'M30 3 L36 4 L38 10 L41 15 L40 20 L34 22 L28 20 L31 14 L28 8Z',
  'M21 10 Q26 8 27 13 Q27 18 22 18 Q19 14 21 10Z',
  'M53 0 L64 0 L61 6 L57 9 L54 7Z',
  'M40 22 L44 20 L48 15 L54 12 L60 10 L70 6 L100 4 L100 44 L88 46 L84 50 L82 54 L79 57 L76 50 L74 44 L70 38 L64 34 L58 33 L53 35 L49 36 L45 37 L42 38 L39 41 L34 43 L30 48 L26 52 L20 53 L15 50 L13 46 L11 40 L13 34 L18 30 L26 30 L32 28 L36 26Z',
  'M54 35 L58 35 L62 40 L67 46 L72 51 L73 55 L70 57 L68 53 L64 50 L59 45 L55 39Z',
  'M0 70 L10 67 L16 63 L24 60 L34 58 L48 60 L60 64 L76 66 L90 64 L100 66 L100 70Z',
  'M46 47 Q49 46 49 50 Q48 54 46 53 Q45 50 46 47Z',
];
// Wegpunkte von Hafen i-1 nach Hafen i
function legPoints(to) {
  if (to === 0) return [...PORTS].reverse().flatMap((p, i, arr) => [[p.x, p.y], ...(i < arr.length - 1 ? [...(p.via || [])].reverse() : [])]);
  const from = PORTS[to - 1];
  return [[from.x, from.y], ...(PORTS[to].via || []), [PORTS[to].x, PORTS[to].y]];
}
const routeD = () => {
  const pts = [[PORTS[0].x, PORTS[0].y]];
  for (let i = 1; i < PORTS.length; i++) pts.push(...(PORTS[i].via || []), [PORTS[i].x, PORTS[i].y]);
  return 'M' + pts.map((p) => p.join(' ')).join(' L');
};
function chart(pos, shipAt) {
  const [sx, sy] = shipAt || [PORTS[pos].x, PORTS[pos].y];
  return art.svg(`
    <rect width="100" height="70" rx="4" fill="#9fd8ff"/>
    ${LAND.map((d) => `<path d="${d}" fill="#f6e7bf" stroke="#d9bf86" stroke-width=".6" stroke-linejoin="round"/>`).join('')}
    <path d="${routeD()}" fill="none" stroke="#ff7eb6" stroke-width=".9" stroke-dasharray="1.6 1.6" stroke-linecap="round"/>
    ${PORTS.map((p, i) => `<g class="cport ${i <= pos ? 'been' : ''}">
      ${p.id === 'funchal' ? `<ellipse cx="${p.x}" cy="${p.y}" rx="3" ry="2" fill="#f6e7bf" stroke="#d9bf86" stroke-width=".5"/>` : ''}
      <circle cx="${p.x}" cy="${p.y}" r="1.6" fill="${i <= pos ? '#ff5a7a' : '#fff'}" stroke="#7a4a2c" stroke-width=".5"/>
      <text x="${p.x}" y="${p.y - 2.6}" text-anchor="middle" font-size="3" font-weight="800" fill="#3a2a35" font-family="Nunito, sans-serif">${p.de}</text></g>`).join('')}
    <text x="6" y="66" font-size="3" fill="#2f66a8" font-style="italic" font-family="Nunito, sans-serif">Atlantik</text>
    <text x="54" y="63" font-size="3" fill="#2f66a8" font-style="italic" font-family="Nunito, sans-serif">Mittelmeer</text>
    <text x="40" y="8" font-size="3" fill="#2f66a8" font-style="italic" font-family="Nunito, sans-serif">Nordsee</text>
    <g id="chart-ship" transform="translate(${sx} ${sy})"><text x="0" y="1.5" text-anchor="middle" font-size="7">🚢</text></g>
    <g transform="translate(92 12)"><circle r="5" fill="#fff" stroke="#d9bf86" stroke-width=".5"/><path d="M0 -4 L1.2 0 L0 4 L-1.2 0Z" fill="#ff5a5a"/><text y="-5.6" text-anchor="middle" font-size="2.6" font-weight="800" fill="#3a2a35">N</text></g>`,
  { vb: '0 0 100 70' });
}

// ---------- Startseite ----------
function render() {
  if (quiz || sailing) return;
  if (mode === 'cabin') return renderCabin();
  if (mode === 'knots') return renderKnots();
  if (mode === 'knot') return renderKnot();
  const s = sh();
  const here = PORTS[s.port];
  const next = PORTS[nextIdx()];
  const found = Object.keys(s.album).length;
  $('#screen').innerHTML = `
    <div class="harbor">
      ${seaBg(false)}
      ${shellBar()}
      <div class="stage-start">
        <div class="harbor-left">
          <div class="harbor-ship">${art.ship(shipLook())}</div>
          <div class="harbor-emmi">${art.avatar(api.hairColor(), '#fff', { outfit: 'casual' })}</div>
        </div>
        <div class="game-card harbor-card">
          <h1>Schiffsreise</h1>
          <div class="chart">${chart(s.port)}</div>
          <p>Du bist in <b>${here.de} ${here.flag}</b>. ${nextIdx() === 0 ? 'Jetzt geht es zurück nach' : 'Nächster Hafen:'} <b>${next.de} ${next.flag}</b></p>
          <button class="btn primary big" data-act="harbor-sail">Leinen los! ⛴️</button>
          <div class="harbor-tiles">
            <button class="htile" data-act="harbor-album"><span>🐬</span>Meeres-Album<small>${found} / ${Object.keys(SEA_ANIMALS).length}</small></button>
            <button class="htile" data-act="harbor-knots"><span>🪢</span>Knoten-Schule<small>${Object.keys(s.knots).length} / ${KNOTS.length}</small></button>
            <button class="htile" data-act="harbor-cabin"><span>🛏️</span>Meine Kabine<small>${Object.keys(s.cabin).length} / ${Object.keys(CABIN).length}</small></button>
            <button class="htile" data-act="harbor-paint"><span>🎨</span>Schiff bemalen</button>
            <button class="htile" data-act="harbor-words"><span>💬</span>Wörter an Bord</button>
          </div>
        </div>
      </div>
    </div>`;
}

// ---------- Eine Etappe: Fragen unterwegs ----------
function makeLeg() {
  const s = sh();
  const score = (t) => (s.seen[t.q] || 0) + Math.random() * 2;
  const fresh = (list, n) => [...list].sort((a, b) => score(a) - score(b)).slice(0, n);
  const lang = (l) => { const t = pick(LANG.filter((x) => x.lang === l)); return { ...t, w: shuffle(t.pool.filter((x) => x !== t.a)).slice(0, 2), icoHTML: `<span>${t.ico}</span><span class="qflag">${t.flag}</span>` }; };
  return shuffle([...fresh(SEA_QUESTIONS, 2), ...fresh(SHIP_MATH, 2), lang('pt'), lang('en')]);
}

function start() {
  const s = sh();
  leg = { shells: 0, animals: [] };
  mode = 'home';
  sfx.pop();
  quiz = runQuiz({
    cls: 'harbor',
    bg: seaBg(true),
    top: shellBar,
    tasks: makeLeg(),
    onRight: (t, firstTry, btn) => {
      s.seen[t.q] = (s.seen[t.q] || 0) + (firstTry ? 1 : -1);
      const n = firstTry ? 2 : 1;
      s.shells += n;
      leg.shells += n;
      const r = btn.getBoundingClientRect();
      floatText(`+${n} 🐚`, r.left + r.width / 2, r.top);
      const el = $('#shell-n'); if (el) el.textContent = s.shells;
      if (t.kind === 'lang') setTimeout(() => speak(t.a, t.lang === 'pt' ? 'pt-PT' : 'en-GB'), 700);
      // Manchmal taucht ein Meerestier auf
      else if (Math.random() < 0.4) {
        const keys = Object.keys(SEA_ANIMALS);
        const unseen = keys.filter((k) => !s.album[k]);
        const k = unseen.length && Math.random() < 0.7 ? pick(unseen) : pick(keys);
        const a = SEA_ANIMALS[k];
        const isNew = !s.album[k];
        s.album[k] = (s.album[k] || 0) + 1;
        leg.animals.push(k);
        setTimeout(() => {
          api.toast(`${isNew ? 'Neu im Album: ' : 'Da! '}${a.ico} ${a.de.replace(/^(der|die|das) /, '')} – 🇵🇹 ${a.pt}`);
          speak(a.pt, 'pt-PT');
          spout(a.ico);
        }, 600);
      }
      save();
    },
    onDone: (res) => { quiz = null; sail(res); },
  });
}

function floatText(text, x, y) {
  const f = document.createElement('div');
  f.className = 'float';
  f.textContent = text;
  f.style.left = x + 'px';
  f.style.top = y + 'px';
  $('#fx-layer').appendChild(f);
  setTimeout(() => f.remove(), 1300);
}
// Meerestier springt kurz aus dem Wasser
function spout(ico) {
  const f = document.createElement('div');
  f.className = 'sea-jump';
  f.textContent = ico;
  $('#fx-layer').appendChild(f);
  setTimeout(() => f.remove(), 2200);
}

// ---------- Fahrt auf der Seekarte ----------
function sail(res) {
  const s = sh();
  const to = nextIdx();
  const pts = legPoints(to);
  sailing = true;
  $('#screen').innerHTML = `
    <div class="harbor sailing">
      ${seaBg(true)}
      <div class="sail-box">
        <div class="chart big">${chart(s.port, pts[0])}</div>
        <p class="sail-note">Volle Fahrt voraus nach <b>${PORTS[to].de} ${PORTS[to].flag}</b>! 🌊</p>
      </div>
    </div>`;
  sfx.whoosh?.();
  const lens = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = lens.reduce((a, b) => a + b, 0);
  const dur = Math.min(5200, 1400 + total * 18);
  const t0 = performance.now();
  const step = (now) => {
    if (!sailing) return;
    let d = Math.min(1, (now - t0) / dur) * total;
    let i = 0;
    while (i < lens.length - 1 && d > lens[i]) { d -= lens[i]; i++; }
    const f = lens[i] ? Math.min(1, d / lens[i]) : 1;
    const x = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f;
    const y = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f;
    const g = document.getElementById('chart-ship');
    if (g) g.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
    if (now - t0 < dur) requestAnimationFrame(step);
    else setTimeout(() => arrive(to, res), 350);
  };
  requestAnimationFrame(step);
}

function arrive(to, { first, total }) {
  if (!sailing) return;
  sailing = false;
  const s = sh();
  const homecoming = to === 0;
  s.port = to;
  if (homecoming) s.trips++;
  const p = PORTS[to];
  let stamp = '';
  if (COUNTRIES.some((c) => c.id === p.country) && !state.stamps[p.country]) { state.stamps[p.country] = true; stamp = p.flag; }
  api.quest('harbor');
  save();
  render();
  const g = GREETINGS[p.country];
  const greet = (key) => `<button class="word greet" data-act="say" data-lang="${g.tts}" data-text="${esc(g[key].say)}"><span class="gw">${GREETING_WORDS[key]}</span><span class="w">${esc(g[key].say)}${g[key].say !== g[key].show ? `<small>${esc(g[key].show)}</small>` : ''}</span><span class="how">${esc(g[key].how)}</span><span class="spk">${art.iconSpeaker()}</span></button>`;
  const animals = leg?.animals.map((k) => SEA_ANIMALS[k].ico).join(' ');
  api.confetti(homecoming ? 120 : first >= 5 ? 70 : 30);
  sfx.fanfare();
  api.openModal(`
    <div class="postcard">
      <div class="pc-pic"><span class="pc-sight">${p.sight}</span><span class="pc-flag">${p.flag}</span></div>
      <h2>${homecoming ? `Rundreise geschafft! 🏆<br>Zurück in ${p.de}` : `Willkommen in ${p.de}!`}</h2>
      <p class="pc-fact">${esc(p.fact)} <button class="say-btn" data-act="say" data-lang="de-DE" data-text="${esc(p.fact)}" aria-label="Vorlesen">🔊</button></p>
      ${g && p.country !== 'de' ? `<div class="words">${greet('hi')}${greet('thanks')}${greet('bye')}</div>` : ''}
    </div>
    <div class="result-row"><span>Beim ersten Versuch</span><b>${first} von ${total}</b></div>
    <div class="result-row"><span>Gesammelte Muscheln</span><b>+${leg?.shells || 0} 🐚</b></div>
    ${animals ? `<div class="result-row"><span>Gesehen</span><b>${animals}</b></div>` : ''}
    ${stamp ? `<div class="result-row"><span>Neuer Stempel im Reisepass</span><b>${stamp}</b></div>` : ''}
    ${homecoming ? '<div class="result-row"><span>Bonus für die ganze Reise</span><b>+10 ⭐ +10 🐚</b></div>' : ''}
    <div class="btn-row">
      <button class="btn big" data-act="close">An Land gehen</button>
      <button class="btn primary big" data-act="harbor-again">Weiterfahren ⛴️</button>
    </div>`, { cls: 'celebrate' });
  speak(homecoming ? 'Rundreise geschafft!' : `Willkommen in ${p.de}!`, 'de-DE');
  if (g && p.country !== 'de') speak(g.hi.say, g.tts, { queue: true });
  if (homecoming) s.shells += 10;
  setTimeout(() => api.addStars(first + 1 + (homecoming ? 10 : 0)), 400);
  api.addXP(first);
  leg = null;
}

// ---------- Meeres-Album ----------
function album() {
  const s = sh();
  sfx.pop();
  api.openModal(`
    <h2>Mein Meeres-Album 🐬</h2>
    <p class="note">Auf der Fahrt tauchen manchmal Meerestiere auf. Tipp ein Tier an!</p>
    <div class="album-grid">${Object.entries(SEA_ANIMALS).map(([k, a]) => s.album[k]
      ? `<button class="album-card" data-act="harbor-animal" data-k="${k}"><span>${a.ico}</span><small>${esc(a.de.replace(/^(der|die|das) /, ''))}</small></button>`
      : '<span class="album-card missing"><span>?</span></span>').join('')}</div>`);
}
function animalCard(k) {
  const a = SEA_ANIMALS[k];
  sfx.pop();
  api.openModal(`
    <div class="big-ico">${art.emoji(a.ico)}</div>
    <h2>${esc(a.de.replace(/^./, (c) => c.toUpperCase()))}</h2>
    <p class="pc-fact">${esc(a.fact)} <button class="say-btn" data-act="say" data-lang="de-DE" data-text="${esc(a.fact)}" aria-label="Vorlesen">🔊</button></p>
    ${api.wordRows({ pt: a.pt, en: a.en, de: a.de })}
    <div class="btn-row"><button class="btn big" data-act="harbor-album">← Zum Album</button></div>`);
  speak(a.pt, 'pt-PT');
}

// ---------- Wörter an Bord ----------
function words() {
  sfx.pop();
  const row = (w) => `<div class="sw-row"><span class="sw-ico">${w.ico}</span><span class="sw-de">${esc(w.de)}</span>
    <button class="word pt" data-act="say" data-lang="pt-PT" data-text="${esc(w.pt)}"><span class="flag">🇵🇹</span><span class="w">${esc(w.pt)}</span></button>
    <button class="word" data-act="say" data-lang="en-GB" data-text="${esc(w.en)}"><span class="flag">🇬🇧</span><span class="w">${esc(w.en)}</span></button></div>`;
  api.openModal(`
    <h2>Wörter an Bord 💬</h2>
    <p class="note">Tipp ein Wort an, dann hörst du es.</p>
    <div class="ship-words">${SHIP_WORDS.map(row).join('')}<h3>Sätze für die Reise</h3>${SHIP_PHRASES.map(row).join('')}</div>`, { cls: 'wide' });
}

// ---------- Knoten-Schule ----------
function renderKnots() {
  const s = sh();
  $('#screen').innerHTML = `
    <div class="harbor">
      ${seaBg(false)}
      ${shellBar()}
      <div class="stage-start">
        <div class="game-card">
          <h1>Knoten-Schule 🪢</h1>
          <p>Seeleute müssen viele Knoten können! Bring die Schritte in die richtige Reihenfolge.</p>
          <div class="knot-list">${KNOTS.map((k) => `<button class="htile" data-act="harbor-knot" data-k="${k.id}"><span>${k.ico}</span>${esc(k.de)}${s.knots[k.id] ? '<small>✓ gelernt</small>' : '<small>+3 🐚</small>'}</button>`).join('')}</div>
          <button class="btn" data-act="harbor-home">← Zurück zum Hafen</button>
        </div>
      </div>
    </div>`;
}
function startKnot(id) {
  const k = KNOTS.find((x) => x.id === id);
  knot = { k, order: shuffle(k.steps.map((_, i) => i)), next: 0 };
  mode = 'knot';
  sfx.pop();
  render();
  speak('Was kommt zuerst?', 'de-DE');
}
function renderKnot() {
  const { k, order, next } = knot;
  $('#screen').innerHTML = `
    <div class="harbor">
      ${seaBg(false)}
      ${shellBar()}
      <div class="stage-start">
        <div class="game-card knot-card">
          <h1>${k.ico} ${esc(k.de)}</h1>
          <p class="note">Tipp die Schritte in der richtigen Reihenfolge an.</p>
          <ol class="knot-done">${k.steps.map((st, i) => `<li class="${i < next ? 'ok' : ''}">${i < next ? esc(st) : '…'}</li>`).join('')}</ol>
          <div class="knot-opts">${order.filter((i) => i >= next).map((i) => `<button class="kopt" data-act="harbor-step" data-i="${i}">${esc(k.steps[i])}</button>`).join('')}</div>
          <button class="btn ghost" data-act="harbor-knots">← Andere Knoten</button>
        </div>
      </div>
    </div>`;
}
function knotStep(el) {
  const i = Number(el.dataset.i);
  if (i !== knot.next) {
    el.classList.add('wrong');
    sfx.wrong();
    setTimeout(() => el.classList.remove('wrong'), 600);
    api.toast(knot.next === 0 ? 'Was macht man ganz am Anfang? 🤔' : 'Hmm, was kommt direkt danach?');
    return;
  }
  sfx.correct();
  speak(knot.k.steps[i], 'de-DE');
  knot.next++;
  if (knot.next < knot.k.steps.length) return renderKnot();
  const s = sh();
  const firstTime = !s.knots[knot.k.id];
  s.knots[knot.k.id] = (s.knots[knot.k.id] || 0) + 1;
  s.shells += 3;
  save();
  renderKnot();
  api.confetti(50);
  sfx.fanfare();
  api.openModal(`
    <div class="big-ico">${art.emoji(knot.k.ico)}</div>
    <h2>${firstTime ? 'Neuer Knoten gelernt!' : 'Super geknotet!'}</h2>
    <p class="big">${esc(knot.k.de)} – 🇵🇹 ${esc(knot.k.pt)}</p>
    <div class="result-row"><span>Belohnung</span><b>+3 🐚 ${firstTime ? '+3 ⭐' : '+1 ⭐'}</b></div>
    <p class="note">Probier den Knoten doch mal mit einer echten Schnur aus! 🧶</p>
    <div class="btn-row"><button class="btn big" data-act="harbor-knots">Noch ein Knoten</button><button class="btn primary big" data-act="harbor-home">Zum Hafen</button></div>`, { cls: 'celebrate' });
  speak(knot.k.pt, 'pt-PT');
  setTimeout(() => api.addStars(firstTime ? 3 : 1), 400);
  api.addXP(2);
}

// ---------- Kabine ----------
function renderCabin() {
  const s = sh();
  const items = Object.entries(CABIN);
  $('#screen').innerHTML = `
    <div class="harbor cabin-scene">
      ${shellBar()}
      <div class="cabin">
        <div class="cabin-wall"></div>
        <div class="porthole"><div class="ph-sea"><span class="ph-fish">🐟</span></div></div>
        <div class="cabin-shelf"></div>
        <div class="cabin-floor"></div>
        ${items.filter(([k]) => s.cabin[k]).map(([k, c]) => `<button class="citem ci-${k}" data-act="harbor-citem" data-k="${k}" style="left:${c.x}%;top:${c.y}%;width:${c.s}%">${art.emoji(c.ico, 86, 50)}</button>`).join('')}
        <div class="cabin-bubble" id="cabin-bubble"></div>
      </div>
      <div class="cabin-shop">
        <button class="btn" data-act="harbor-home">← Zurück</button>
        ${items.map(([k, c]) => s.cabin[k]
          ? `<button class="cshop own" data-act="harbor-citem" data-k="${k}"><span>${c.ico}</span><small>✓</small></button>`
          : `<button class="cshop ${s.shells >= c.price ? '' : 'poor'}" data-act="harbor-buy" data-k="${k}"><span>${c.ico}</span><small>${c.price} 🐚</small></button>`).join('')}
      </div>
    </div>`;
}
function buyCabin(k) {
  const s = sh();
  const c = CABIN[k];
  if (s.shells < c.price) { sfx.wrong(); api.toast(`Dafür brauchst du ${c.price} 🐚 – sammle unterwegs noch ${c.price - s.shells} Muscheln!`); return; }
  s.shells -= c.price;
  s.cabin[k] = true;
  save();
  sfx.coin();
  api.confetti(20);
  renderCabin();
  sayCabin(k);
}
function sayCabin(k) {
  const c = CABIN[k];
  const b = $('#cabin-bubble');
  if (b) { b.innerHTML = `${c.ico} 🇵🇹 ${esc(c.pt)} · 🇬🇧 ${esc(c.en)}`; b.style.left = `${Math.min(78, Math.max(22, c.x))}%`; b.style.top = `${Math.max(8, c.y - 14)}%`; b.classList.add('show'); }
  speak(c.pt, 'pt-PT');
}

// ---------- Schiff bemalen ----------
function paint() {
  const s = sh();
  const opt = (field, id, o) => {
    const own = !o.price || s.owned[`${field}:${id}`];
    const sel = s[field] === id;
    const sw = o.c === 'rainbow' ? 'linear-gradient(90deg,#ff5a5a,#ffd23b,#62cc5c,#4fb3ff,#9b7bff)' : o.c;
    return `<button class="paint-opt ${sel ? 'sel' : ''}" data-act="harbor-color" data-f="${field}" data-id="${id}"><span class="swatch" style="background:${sw}"></span>${o.de}${own ? (sel ? ' ✓' : '') : `<small>${o.price} 🐚</small>`}</button>`;
  };
  api.openModal(`
    <h2>Schiff bemalen 🎨</h2>
    <div class="paint-ship">${art.ship(shipLook())}</div>
    <h3>Rumpf</h3><div class="paint-row">${Object.entries(HULLS).map(([id, o]) => opt('hull', id, o)).join('')}</div>
    <h3>Schornstein</h3><div class="paint-row">${Object.entries(FUNNELS).map(([id, o]) => opt('funnel', id, o)).join('')}</div>
    <p class="note">Du hast <b>${s.shells}</b> 🐚</p>
    <div class="btn-row"><button class="btn primary big" data-act="harbor-paint-done">Fertig</button></div>`);
}
function setColor(field, id) {
  const s = sh();
  const o = (field === 'hull' ? HULLS : FUNNELS)[id];
  const key = `${field}:${id}`;
  if (o.price && !s.owned[key]) {
    if (s.shells < o.price) { sfx.wrong(); api.toast(`Dafür brauchst du ${o.price} 🐚`); return; }
    s.shells -= o.price;
    s.owned[key] = true;
    sfx.coin();
  } else sfx.pop();
  s[field] = id;
  save();
  paint();
}

export default {
  id: 'harbor',
  label: 'Hafen',
  render,
  leave() { quiz?.stop(); quiz = null; sailing = false; mode = 'home'; },
  actions: {
    'harbor-sail': () => start(),
    'harbor-again': () => { api.closeModal(); start(); },
    'harbor-album': () => album(),
    'harbor-animal': (el) => animalCard(el.dataset.k),
    'harbor-words': () => words(),
    'harbor-knots': () => { api.closeModal(); mode = 'knots'; knot = null; render(); },
    'harbor-knot': (el) => startKnot(el.dataset.k),
    'harbor-step': (el) => knotStep(el),
    'harbor-home': () => { api.closeModal(); mode = 'home'; render(); },
    'harbor-cabin': () => { mode = 'cabin'; sfx.pop(); render(); },
    'harbor-buy': (el) => buyCabin(el.dataset.k),
    'harbor-citem': (el) => sayCabin(el.dataset.k),
    'harbor-paint': () => paint(),
    'harbor-color': (el) => setColor(el.dataset.f, el.dataset.id),
    'harbor-paint-done': () => { api.closeModal(); render(); },
  },
  quiz: () => quiz,
  quit: () => { quiz?.stop(); quiz = null; leg = null; render(); },
};
