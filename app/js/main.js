import { state, save, resetState } from './state.js';
import {
  PLANTS, ANIMALS, MAX_PER_ANIMAL, BELTS, beltIndex, MAX_BEDS, START_BEDS, BED_PRICES,
  DOJO_ROWS, DOJO_DIV_FROM_BELT, DOJO_BOARDS, DOJO_FAST_MS, HAIR, PRAISE,
} from './data.js';
import * as art from './art.js';
import { sfx, speak, setAudioPrefs, voiceInfo } from './audio.js';
import { gardenTask, dojoTask, parentGate, MATH_LEVELS } from './math.js';
import { api } from './core.js';
import stage from './games/stage.js';
import craft, { CRAFT_LEVELS } from './games/craft.js';
import climb from './games/climb.js';
import ballet, { CLOCK_LEVELS } from './games/ballet.js';
import { renderSell, marketActions, leaveMarket } from './games/market.js';
import { initClips, canRecord, clipUrl, clipCount, saveClip, deleteClip, startRecording } from './recorder.js';
import { allTexts } from './vocab.js';

const GAMES = { ballet, stage, craft, climb };

const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const hairColor = () => (HAIR[state.hair] || HAIR.brown).color;
const belt = () => BELTS[beltIndex(state.xp)];

// ============ Tagesaufgaben ============
const QUESTS = {
  water: { goal: 3, text: (g) => `${g} Pflanzen gießen`, ico: '💧' },
  harvest: { goal: 2, text: (g) => `${g} Pflanzen ernten`, ico: '🧺' },
  dojo: { goal: 1, text: () => 'Eine Runde im Dojo', ico: '🥋' },
  stage: { goal: 1, text: () => 'Ein Lied auf der Bühne', ico: '🎤' },
  craft: { goal: 1, text: () => 'Ein Armband basteln', ico: '📿' },
  climb: { goal: 1, text: () => 'Einmal bis zur Glocke klettern', ico: '🧗' },
  ballet: { goal: 1, text: () => 'Im Ballettstudio üben', ico: '🩰' },
  market: { goal: 1, text: () => 'Einen Kunden im Hofladen bedienen', ico: '🛎️' },
};
const DAILY_REWARD = 10;
const today = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
function daily() {
  if (!state.daily || state.daily.date !== today()) {
    const ids = Object.keys(QUESTS).sort(() => Math.random() - 0.5);
    const chosen = ['water', ...ids.filter((x) => x !== 'water').slice(0, 2)];
    state.daily = { date: today(), quests: chosen.map((id) => ({ id, n: 0 })), claimed: false };
    save();
  }
  return state.daily;
}
function quest(id) {
  const d = daily();
  const q = d.quests.find((x) => x.id === id);
  if (!q || q.n >= QUESTS[id].goal) return;
  q.n++;
  save();
  if (q.n === QUESTS[id].goal) setTimeout(() => toast(`✅ Tagesaufgabe geschafft: ${QUESTS[id].text(QUESTS[id].goal)}`), 900);
}
function dailyHTML() {
  const d = daily();
  const all = d.quests.every((q) => q.n >= QUESTS[q.id].goal);
  if (d.claimed) return `<div class="daily done"><b>Heute alles geschafft! 🌟</b><small>Morgen gibt's neue Aufgaben.</small></div>`;
  return `<div class="daily">
    <b>Heute</b>
    ${d.quests.map((q) => { const Q = QUESTS[q.id], ok = q.n >= Q.goal; return `<div class="dq ${ok ? 'ok' : ''}"><span>${ok ? '✅' : Q.ico}</span>${Q.text(Q.goal)}${Q.goal > 1 && !ok ? ` <small>${q.n}/${Q.goal}</small>` : ''}</div>`; }).join('')}
    ${all ? `<button class="btn primary claim" data-act="daily-claim">+${DAILY_REWARD} <span class="bi">${art.star()}</span> abholen</button>` : ''}
  </div>`;
}

let screen = 'garden';
let shopTab = 'seeds';
let dojo = null;
const pending = []; // Feiern, die nach dem aktuellen Fenster kommen

setAudioPrefs({ sound: state.sound, speech: state.speech });

// ============ Rahmen ============
function go(to) {
  if (screen === 'dojo' && to !== 'dojo') dojo = null;
  if (screen !== to) GAMES[screen]?.leave?.();
  if (screen === 'shop' && to !== 'shop') leaveMarket();
  screen = to;
  render();
}

function render() {
  renderTop();
  renderNav();
  if (GAMES[screen]) GAMES[screen].render();
  else ({ garden: renderGarden, dojo: renderDojo, shop: renderShop })[screen]();
}

function renderTop() {
  const bi = beltIndex(state.xp);
  const b = BELTS[bi], next = BELTS[bi + 1];
  const pct = next ? Math.round(((state.xp - b.xp) / (next.xp - b.xp)) * 100) : 100;
  $('#topbar').innerHTML = `
    <div class="who">
      <div class="mini-avatar">${art.avatarHead(hairColor())}</div>
      <div class="who-text">
        <div class="name">${esc(state.name)}</div>
        <div class="belt-chip"><span class="belt-ico">${art.beltIcon(b.color)}</span>${b.de}</div>
        <div class="xpbar" title="Bis zum nächsten Gürtel"><i style="width:${pct}%"></i></div>
      </div>
    </div>
    <div class="top-right">
      <div class="stars-pill" id="stars"><span class="star-ico">${art.star()}</span><b>${state.stars}</b></div>
      <button class="icon-btn" data-act="sound" aria-label="Ton">${state.sound ? art.iconSound() : art.iconMute()}</button>
      <button class="icon-btn small" data-act="parents" aria-label="Eltern">${art.iconLock()}</button>
    </div>`;
}

function renderNav() {
  const btn = (id, ico, label) => `<button class="nav-btn ${screen === id ? 'active' : ''}" data-act="goto" data-to="${id}"><span class="ico">${ico}</span>${label}</button>`;
  $('#nav').innerHTML = btn('garden', art.sproutIcon(), 'Garten') + btn('dojo', art.dojoIcon(), 'Dojo')
    + Object.values(GAMES).map((g) => btn(g.id, g.icon(), g.label)).join('') + btn('shop', art.basket(), 'Laden');
}

// ============ Modals, Effekte ============
function openModal(html, { cls = '', closable = true } = {}) {
  const layer = $('#modal-layer');
  layer.hidden = false;
  layer.innerHTML = `<div class="modal-backdrop"></div><div class="modal ${cls}" role="dialog">${closable ? '<button class="modal-x" data-act="close" aria-label="Schließen">✕</button>' : ''}${html}</div>`;
  return $('.modal', layer);
}
function closeModal() {
  const layer = $('#modal-layer');
  layer.hidden = true;
  layer.innerHTML = '';
  if (pending.length) setTimeout(() => pending.shift()(), 250);
}
const modalOpen = () => !$('#modal-layer').hidden;

function toast(text) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = text;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2800);
}

function floatText(html, x = innerWidth / 2, y = innerHeight / 2) {
  const f = document.createElement('div');
  f.className = 'float';
  f.innerHTML = html;
  f.style.left = x + 'px';
  f.style.top = y + 'px';
  $('#fx-layer').appendChild(f);
  setTimeout(() => f.remove(), 1300);
}

function confetti(n = 70) {
  const colors = ['#ff7eb6', '#9b7bff', '#ffd23b', '#62cc5c', '#4fb3ff', '#ff9a2e'];
  for (let i = 0; i < n; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.background = pick(colors);
    c.style.animationDuration = 1.8 + Math.random() * 1.6 + 's';
    c.style.animationDelay = Math.random() * 0.5 + 's';
    c.style.setProperty('--rot', Math.random() * 720 - 360 + 'deg');
    c.style.setProperty('--dx', Math.random() * 120 - 60 + 'px');
    $('#fx-layer').appendChild(c);
    setTimeout(() => c.remove(), 4200);
  }
}

function bumpStars() {
  renderTop();
  const s = $('#stars');
  if (s) { s.classList.remove('bump'); void s.offsetWidth; s.classList.add('bump'); }
}

function addStars(n, at) {
  if (n <= 0) return;
  state.stars += n;
  save();
  sfx.coin();
  const s = $('#stars')?.getBoundingClientRect();
  floatText(`+${n} <span class="fi">${art.star()}</span>`, at?.x ?? (s ? s.left + s.width / 2 : innerWidth / 2), at?.y ?? (s ? s.bottom + 30 : 100));
  bumpStars();
}

function addXP(n) {
  if (n <= 0) return;
  const before = beltIndex(state.xp);
  state.xp += n;
  save();
  const after = beltIndex(state.xp);
  if (after > before) {
    const show = () => beltUp(after);
    if (modalOpen()) pending.push(show); else setTimeout(show, 400);
  }
  renderTop();
}

function beltUp(idx) {
  const b = BELTS[idx];
  const news = [
    ...Object.values(PLANTS).filter((p) => p.belt === idx).map((p) => p.name),
    ...Object.values(ANIMALS).filter((a) => a.belt === idx).map((a) => a.name),
  ];
  confetti(100);
  sfx.fanfare();
  openModal(`
    <div class="belt-up">
      <div class="avatar-big">${art.avatar(hairColor(), b.color)}</div>
      <h2>Hurra, ${esc(state.name)}!</h2>
      <p class="big">Du hast jetzt <b>${b.dn.replace('der ', 'den ').replace('e Gürtel', 'en Gürtel')}</b>!</p>
      ${wordRows({ pt: b.pt, en: b.en, de: b.dn })}
      ${news.length ? `<p class="news">Neu im Laden: <b>${news.join(', ')}</b></p>` : ''}
      <button class="btn primary big" data-act="close">Juhu!</button>
    </div>`, { cls: 'celebrate' });
  setTimeout(() => speak(b.pt, 'pt-PT'), 1600);
}

function wordRows(item) {
  const row = (flag, lang, text, cls = '') => `<button class="word ${cls}" data-act="say" data-lang="${lang}" data-text="${esc(text)}"><span class="flag">${flag}</span><span class="w">${esc(text)}</span><span class="spk">${art.iconSpeaker()}</span></button>`;
  return `<div class="words">${row('🇵🇹', 'pt-PT', item.pt, 'pt')}${row('🇬🇧', 'en-GB', item.en)}${row('🇩🇪', 'de-DE', item.de)}</div>`;
}

// ============ Zahlen-Aufgabe mit Ziffernblock ============
function numberTask({ title, icon, task, onFinish }) {
  let input = '', tries = 0, locked = false;
  const q = esc(task.text).replace('?', '<span class="answer-box" id="ans">&nbsp;</span>');
  const m = openModal(`
    <div class="task-head"><div class="task-ico">${icon}</div><h2>${title}</h2></div>
    <div class="task-q">${q}</div>
    <div class="task-fb" id="fb">&nbsp;</div>
    <div class="numpad">
      ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button data-n="${n}">${n}</button>`).join('')}
      <button data-n="del" class="del">⌫</button><button data-n="0">0</button><button data-n="ok" class="ok">✓</button>
    </div>`, { cls: 'task-modal' });
  const ans = $('#ans', m), fb = $('#fb', m);
  const show = () => { ans.textContent = input || ' '; };

  $('.numpad', m).addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b || locked) return;
    const n = b.dataset.n;
    if (n === 'ok') { if (input) check(); return; }
    sfx.tick();
    if (n === 'del') input = input.slice(0, -1);
    else if (input.length < 3) input += n;
    show();
  });

  function check() {
    tries++;
    if (Number(input) === task.answer) {
      locked = true;
      ans.classList.add('right');
      const p = pick(PRAISE);
      fb.innerHTML = `<span class="good">${p}</span>`;
      sfx.correct();
      speak(p, 'de-DE');
      setTimeout(() => { closeModal(); onFinish({ correct: true, tries }); }, 950);
      return;
    }
    sfx.wrong();
    state.stats.wrong++;
    ans.classList.add('wrong');
    input = '';
    if (tries >= 3) {
      locked = true;
      fb.innerHTML = `Die Lösung ist <b>${task.answer}</b>. Beim nächsten Mal klappt's! 💪`;
      setTimeout(() => { ans.classList.remove('wrong'); ans.textContent = task.answer; }, 450);
      setTimeout(() => { closeModal(); onFinish({ correct: false, tries }); }, 2600);
      return;
    }
    fb.innerHTML = tries === 1 ? 'Fast! Probier es nochmal. 🙂' : `<span class="hint">💡 ${esc(task.hint)}</span>`;
    setTimeout(() => { ans.classList.remove('wrong'); show(); }, 450);
  }
}

// ============ Garten ============
function renderGarden() {
  const n = state.beds.length;
  const beds = state.beds.map(bedHTML).join('');
  const animals = state.animals.map((a, i) =>
    `<button class="animal" data-act="animal" data-i="${i}" style="left:${a.x}%;--d:${5 + (i % 4) * 1.7}s;animation-delay:-${(i * 1.3) % 5}s">
      <div class="animal-inner">${art.animal(a.type)}</div><div class="bubble"></div></button>`).join('');
  $('#screen').innerHTML = `
    <div class="garden">
      <div class="garden-top">
        <div class="sun">${art.sun()}</div>
        ${dailyHTML()}
        <div class="cloud c1"></div><div class="cloud c2"></div><div class="cloud c3"></div>
        <div class="hills">${art.hills()}</div>
        <div class="fence">${art.fence()}</div>
        <div class="animals">${animals || '<div class="hint-bubble">Im Laden warten Tiere auf dich! 🐣</div>'}</div>
      </div>
      <div class="beds" data-n="${n}">${beds}</div>
    </div>`;
}

function bedHTML(bed, i) {
  if (!bed.plant) {
    return `<button class="bed empty" data-act="bed" data-i="${i}"><div class="soil"></div><span class="plus">+</span><span class="bed-label">Pflanzen</span></button>`;
  }
  const p = PLANTS[bed.plant];
  const ready = bed.water >= p.water;
  const drops = ready ? '' : `<div class="drops">${Array.from({ length: p.water }, (_, k) => `<span class="${k < bed.water ? 'full' : ''}">${art.drop()}</span>`).join('')}</div>`;
  return `<button class="bed ${ready ? 'ready' : 'thirsty'}" data-act="bed" data-i="${i}">
    <div class="soil"></div>
    <div class="plant">${ready ? art.plant(bed.plant) : art.sprout(bed.water / p.water)}</div>
    ${drops}
    ${ready ? '<span class="spark s1">✦</span><span class="spark s2">✦</span><span class="spark s3">✦</span>' : ''}
    <span class="bed-label">${ready ? 'Ernten!' : 'Gießen'}</span>
  </button>`;
}

function bedEl(i) { return document.querySelector(`.bed[data-i="${i}"]`); }

function onBed(i) {
  const bed = state.beds[i];
  if (!bed.plant) return seedPicker(i);
  const p = PLANTS[bed.plant];
  if (bed.water >= p.water) return harvest(i);
  waterTask(i);
}

function seedPicker(i) {
  const owned = Object.entries(state.seeds).filter(([, n]) => n > 0);
  if (!owned.length) {
    openModal(`<div class="big-ico">${art.basket()}</div><h2>Keine Samen mehr</h2>
      <p>Im Laden kannst du mit Sternen neue Samen kaufen.</p>
      <button class="btn primary big" data-act="goto" data-to="shop">Zum Laden</button>`);
    return;
  }
  const m = openModal(`<h2>Was möchtest du pflanzen?</h2>
    <div class="seed-grid">${owned.map(([k, n]) => `
      <button class="seed-card" data-k="${k}">
        <span class="count">${n}×</span>
        <div class="art">${art.plant(k)}</div>
        <b>${PLANTS[k].name}</b><small class="pt">${PLANTS[k].pt}</small>
      </button>`).join('')}</div>`);
  m.querySelectorAll('.seed-card').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.k;
    state.seeds[k]--;
    state.beds[i] = { plant: k, water: 0 };
    save();
    closeModal();
    sfx.pop();
    renderGarden();
    bedEl(i)?.classList.add('popin');
  }));
}

function currentMathLevel() { return Math.min(4, Math.max(1, state.mathLevel)); }

function waterTask(i) {
  const p = PLANTS[state.beds[i].plant];
  numberTask({
    title: `Gieß ${p.deAkk}!`,
    icon: art.wateringCan(),
    task: gardenTask(currentMathLevel()),
    onFinish: ({ correct, tries }) => {
      state.beds[i].water++;
      quest('water');
      if (correct) {
        state.stats.correct++;
        adaptMath(tries === 1);
      } else {
        adaptMath(false);
      }
      save();
      renderGarden();
      const el = bedEl(i);
      if (el) {
        el.classList.add('watered');
        const rain = document.createElement('div');
        rain.className = 'rain';
        rain.innerHTML = Array.from({ length: 7 }, (_, k) => `<i style="left:${12 + k * 12}%;animation-delay:${k * 0.06}s"></i>`).join('');
        el.appendChild(rain);
      }
      sfx.water();
      if (correct) {
        const r = el?.getBoundingClientRect();
        const at = r ? { x: r.left + r.width / 2, y: r.top + 20 } : undefined;
        if (tries === 1) addStars(1, at);
        if (tries <= 2) addXP(1);
      }
      if (state.beds[i].water >= p.water) setTimeout(() => toast(`${p.name} ist reif! Tipp drauf zum Ernten.`), 600);
    },
  });
}

function adaptMath(firstTry) {
  if (!state.mathAuto) return;
  if (firstTry) {
    state.mStreak++; state.mWrong = 0;
    if (state.mStreak >= 5 && state.mathLevel < 4) {
      state.mathLevel++; state.mStreak = 0;
      setTimeout(() => toast('Die Aufgaben werden etwas kniffliger! 🌟'), 1200);
    }
  } else {
    state.mWrong++; state.mStreak = 0;
    if (state.mWrong >= 2 && state.mathLevel > 1) { state.mathLevel--; state.mWrong = 0; }
  }
}

function harvest(i) {
  const k = state.beds[i].plant, p = PLANTS[k];
  state.beds[i] = { plant: null, water: 0 };
  state.stats.harvested++;
  quest('harvest');
  state.collection[k] = (state.collection[k] || 0) + 1;
  state.basket[k] = (state.basket[k] || 0) + 1;
  save();
  sfx.harvest();
  renderGarden();
  openModal(`
    <div class="harvest-art">${art.plant(k)}</div>
    <h2>Du hast ${p.deIndef} geerntet!</h2>
    ${wordRows(p)}
    <p class="note">🧺 Liegt jetzt auch im Erntekorb – im Hofladen kannst du sie verkaufen.</p>
    <button class="btn primary big" data-act="collect" data-n="${p.reward}">+${p.reward} <span class="bi">${art.star()}</span> einsammeln</button>`, { closable: false, cls: 'celebrate' });
  setTimeout(() => { speak(p.pt, 'pt-PT'); speak(p.en, 'en-GB', { queue: true }); }, 500);
}

function onAnimal(el) {
  const a = state.animals[+el.dataset.i];
  if (!a) return;
  const info = ANIMALS[a.type];
  const langs = [['🇵🇹', info.pt, 'pt-PT'], ['🇬🇧', info.en, 'en-GB'], ['🇩🇪', info.de, 'de-DE']];
  a._l = ((a._l ?? -1) + 1) % langs.length;
  const [flag, word, lang] = langs[a._l];
  const bub = $('.bubble', el);
  bub.textContent = `${flag} ${word}`;
  bub.classList.add('show');
  clearTimeout(bub._t);
  bub._t = setTimeout(() => bub.classList.remove('show'), 2200);
  el.classList.remove('hop'); void el.offsetWidth; el.classList.add('hop');
  sfx.hop();
  speak(word, lang);
}

// ============ Laden ============
function renderShop() {
  const bi = beltIndex(state.xp);
  let cards = '';
  if (shopTab === 'seeds') {
    cards = Object.entries(PLANTS).map(([k, p]) => shopCard({
      kind: 'seed', id: k, artHTML: art.plant(k), title: p.name, pt: p.pt, price: p.price, belt: p.belt,
      owned: state.seeds[k] || 0, info: `${p.water}× gießen · bringt ${p.reward}⭐`,
    }, bi)).join('');
  } else if (shopTab === 'animals') {
    cards = Object.entries(ANIMALS).map(([k, a]) => {
      const owned = state.animals.filter((x) => x.type === k).length;
      return shopCard({
        kind: 'animal', id: k, artHTML: art.animal(k), title: a.name, pt: a.pt, price: a.price, belt: a.belt,
        owned, max: owned >= MAX_PER_ANIMAL, info: owned >= MAX_PER_ANIMAL ? 'Dein Garten ist voll davon!' : 'Wohnt in deinem Garten',
      }, bi);
    }).join('');
  } else if (shopTab === 'sell') {
    cards = null;
  } else {
    const n = state.beds.length;
    cards = n < MAX_BEDS
      ? shopCard({ kind: 'bed', id: 'bed', artHTML: `<div class="mini-bed"><div class="soil"></div></div>`, title: 'Neues Beet', pt: 'o canteiro', price: BED_PRICES[n - START_BEDS], belt: 0, owned: n, info: `Du hast ${n} von ${MAX_BEDS} Beeten` }, bi)
      : `<div class="card"><h3>Alle Beete gekauft! 🎉</h3><p class="info">Mehr Deko kommt bald.</p></div>`;
  }
  const tab = (id, label) => `<button class="tab ${shopTab === id ? 'active' : ''}" data-act="tab" data-tab="${id}">${label}</button>`;
  $('#screen').innerHTML = `
    <div class="shop">
      <div class="awning"></div>
      <div class="shop-sign">Hofladen</div>
      <div class="tabs">${tab('seeds', 'Samen')}${tab('animals', 'Tiere')}${tab('garden', 'Garten')}${tab('sell', '💶 Verkaufen')}</div>
      ${cards === null ? '<div id="market"></div>' : `<div class="shop-grid">${cards}</div>`}
    </div>`;
  if (cards === null) renderSell();
}

function shopCard(c, bi) {
  const locked = bi < c.belt;
  const afford = state.stars >= c.price;
  let btn;
  if (locked) btn = `<div class="lock-note"><span class="belt-ico">${art.beltIcon(BELTS[c.belt].color)}</span>ab ${BELTS[c.belt].de}</div>`;
  else if (c.max) btn = `<div class="lock-note">✓ voll</div>`;
  else btn = `<button class="btn buy ${afford ? 'primary' : 'poor'}" data-act="buy" data-kind="${c.kind}" data-id="${c.id}">${c.price} <span class="bi">${art.star()}</span></button>`;
  const ownedBadge = c.kind === 'bed' || !c.owned ? '' : `<span class="owned">${c.owned}×</span>`;
  return `<div class="card ${locked ? 'locked' : ''}">
    ${ownedBadge}
    <div class="art">${c.artHTML}</div>
    <h3>${c.title}</h3>
    <button class="pt-say" data-act="say" data-lang="pt-PT" data-text="${esc(c.pt)}">🇵🇹 ${c.pt}</button>
    <div class="info">${c.info}</div>
    ${btn}
  </div>`;
}

function buy(kind, id) {
  let price, label;
  if (kind === 'seed') { price = PLANTS[id].price; label = `Samen: ${PLANTS[id].name}`; }
  else if (kind === 'animal') { price = ANIMALS[id].price; label = ANIMALS[id].name; }
  else { price = BED_PRICES[state.beds.length - START_BEDS]; label = 'Neues Beet'; }
  if (state.stars < price) {
    sfx.wrong();
    toast(`Dir fehlen noch ${price - state.stars} Sterne. Gieß Pflanzen oder geh ins Dojo!`);
    return;
  }
  state.stars -= price;
  if (kind === 'seed') state.seeds[id] = (state.seeds[id] || 0) + 1;
  else if (kind === 'animal') {
    state.animals.push({ type: id, x: 6 + Math.random() * 80 });
    speak(ANIMALS[id].pt, 'pt-PT');
  } else state.beds.push({ plant: null, water: 0 });
  save();
  sfx.pop();
  bumpStars();
  renderShop();
  toast(kind === 'animal' ? `${label} wohnt jetzt in deinem Garten! 🏡` : `Gekauft: ${label} ✓`);
}

// ============ Dojo ============
function dojoConfig() {
  const bi = beltIndex(state.xp);
  if (state.dojoRows && state.dojoRows.length) return { rows: state.dojoRows, div: state.dojoDiv };
  return { rows: DOJO_ROWS[Math.min(bi, DOJO_ROWS.length - 1)], div: bi >= DOJO_DIV_FROM_BELT };
}

function renderDojo() {
  if (dojo) return renderDojoRound();
  const { rows, div } = dojoConfig();
  $('#screen').innerHTML = `
    <div class="dojo">
      <div class="dojo-wall"></div><div class="dojo-floor"></div>
      <div class="dojo-start">
        <div class="avatar-big">${art.avatar(hairColor(), belt().color)}</div>
        <div class="dojo-card">
          <h1>Karate-Dojo</h1>
          <p>Zerschlage <b>${DOJO_BOARDS} Bretter</b> mit dem Einmaleins!<br>Je schneller, desto mehr Sterne. ⚡</p>
          <p class="rows">Heute: ${rows.join(', ')}er-Reihe${div ? ' + Geteilt' : ''}</p>
          ${state.dojoBest ? `<p class="best">Dein Rekord: ${state.dojoBest} von ${DOJO_BOARDS} beim ersten Versuch</p>` : ''}
          <button class="btn primary big" data-act="dojo-start">Hajime! 🥋</button>
        </div>
      </div>
    </div>`;
}

function startDojo() {
  const { rows, div } = dojoConfig();
  dojo = { i: 0, first: 0, fast: 0, rows, div, task: null, lock: false };
  nextBoard();
}

function nextBoard() {
  if (!dojo) return;
  if (dojo.i >= DOJO_BOARDS) return finishDojo();
  dojo.task = dojoTask(dojo.rows, dojo.div);
  dojo.missed = false;
  dojo.lock = false;
  dojo.t0 = performance.now();
  renderDojoRound();
}

function renderDojoRound() {
  const t = dojo.task;
  const track = Array.from({ length: DOJO_BOARDS }, (_, k) => `<span class="mini-board ${k < dojo.i ? 'done' : k === dojo.i ? 'now' : ''}"></span>`).join('');
  $('#screen').innerHTML = `
    <div class="dojo round">
      <div class="dojo-wall"></div><div class="dojo-floor"></div>
      <div class="round-wrap">
        <div class="board-track">${track}</div>
        <div class="arena">
          <div class="fighter" id="fighter">${art.avatar(hairColor(), belt().color)}</div>
          <div class="board-wrap" id="board">
            <div class="half l">${art.boardHalf('l')}</div><div class="half r">${art.boardHalf('r')}</div>
            <div class="board-text">${t.text}</div>
            <div class="stand sl"></div><div class="stand sr"></div>
          </div>
        </div>
        <div class="speed"><span class="bolt">${art.bolt()}</span><div class="speed-track"><i style="animation-duration:${DOJO_FAST_MS}ms"></i></div></div>
        <div class="choices">${t.choices.map((c) => `<button class="choice" data-act="dojo-pick" data-v="${c}">${c}</button>`).join('')}</div>
      </div>
      <button class="btn ghost quit" data-act="dojo-quit">Aufhören</button>
    </div>`;
}

function dojoPick(btn) {
  if (!dojo || dojo.lock) return;
  const v = Number(btn.dataset.v);
  const board = $('#board');
  if (v === dojo.task.answer) {
    dojo.lock = true;
    const ms = performance.now() - dojo.t0;
    if (!dojo.missed) {
      dojo.first++;
      if (ms < DOJO_FAST_MS) dojo.fast++;
    }
    btn.classList.add('right');
    $('#fighter').classList.add('chop');
    setTimeout(() => {
      board.classList.add('broken');
      sfx.chop();
      const hai = document.createElement('div');
      hai.className = 'hai';
      hai.textContent = ms < DOJO_FAST_MS && !dojo.missed ? 'HAI! ⚡' : 'HAI!';
      board.appendChild(hai);
    }, 160);
    dojo.i++;
    state.stats.boards++;
    setTimeout(nextBoard, 1000);
  } else {
    dojo.missed = true;
    state.stats.wrong++;
    btn.classList.add('wrong');
    btn.disabled = true;
    board.classList.remove('wobble'); void board.offsetWidth; board.classList.add('wobble');
    sfx.wrong();
  }
}

function finishDojo() {
  const { first, fast } = dojo;
  dojo = null;
  const stars = first + Math.floor(fast / 2);
  quest('dojo');
  const isBest = first > state.dojoBest;
  if (isBest) state.dojoBest = first;
  state.stats.correct += first;
  save();
  renderDojo();
  confetti(first >= 8 ? 90 : 40);
  sfx.fanfare();
  openModal(`
    <div class="avatar-mid">${art.avatar(hairColor(), belt().color)}</div>
    <h2>${first >= 8 ? 'Wahnsinn' : first >= 5 ? 'Super' : 'Gut gemacht'}, ${esc(state.name)}!</h2>
    <p class="big">Alle ${DOJO_BOARDS} Bretter zerschlagen! 🥋</p>
    <div class="result-row"><span>Beim ersten Versuch</span><b>${first} / ${DOJO_BOARDS}</b></div>
    <div class="result-row"><span>Blitzschnell ⚡</span><b>${fast}</b></div>
    ${isBest ? '<p class="news">🏆 Neuer Rekord!</p>' : ''}
    <div class="btn-row">
      <button class="btn big" data-act="close">Fertig</button>
      <button class="btn primary big" data-act="dojo-again">Nochmal!</button>
    </div>`, { cls: 'celebrate' });
  if (stars) setTimeout(() => addStars(stars), 300);
  addXP(first);
}

// ============ Elternbereich ============
function parentsGate() {
  const t = parentGate();
  let input = '';
  const m = openModal(`
    <h2>Für Eltern</h2>
    <p>Bitte rechne: <b>${t.text.replace(' = ?', '')}</b></p>
    <div class="task-q small"><span class="answer-box" id="gans">&nbsp;</span></div>
    <div class="numpad small">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button data-n="${n}">${n}</button>`).join('')}<button data-n="del" class="del">⌫</button><button data-n="0">0</button><button data-n="ok" class="ok">✓</button></div>`, { cls: 'task-modal' });
  $('.numpad', m).addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const n = b.dataset.n;
    if (n === 'ok') {
      if (Number(input) === t.answer) parentsPanel(); else closeModal();
      return;
    }
    if (n === 'del') input = input.slice(0, -1); else if (input.length < 3) input += n;
    $('#gans', m).textContent = input || ' ';
  });
}

function parentsPanel() {
  const { rows } = dojoConfig();
  const auto = !state.dojoRows;
  const pv = voiceInfo('pt-PT'), ev = voiceInfo('en-GB');
  const s = state.stats;
  const m = openModal(`
    <div class="parents">
      <h2>Elternbereich</h2>
      <section>
        <h3>Fortschritt</h3>
        <div class="stat-grid">
          <div><b>${s.correct}</b><span>richtige Aufgaben</span></div>
          <div><b>${s.wrong}</b><span>Fehlversuche</span></div>
          <div><b>${s.harvested}</b><span>geerntet</span></div>
          <div><b>${s.boards}</b><span>Bretter</span></div>
          <div><b>${state.xp}</b><span>Punkte · ${belt().de}</span></div>
          <div><b>${state.dojoBest}/${DOJO_BOARDS}</b><span>Dojo-Rekord</span></div>
          <div><b>${Object.values(state.vocab).filter((v) => (v.pt || 0) >= 2).length}</b><span>Wörter 🇵🇹 gelernt</span></div>
          <div><b>${Object.values(state.vocab).filter((v) => (v.en || 0) >= 2).length}</b><span>Wörter 🇬🇧 gelernt</span></div>
          <div><b>${state.bracelets.length} · ${state.climbTops}</b><span>Armbänder · Gipfel</span></div>
        </div>
      </section>
      <section>
        <h3>Name & Aussehen</h3>
        <label class="field">Name <input id="p-name" value="${esc(state.name)}" maxlength="14"></label>
        <div class="chips" id="p-hair">${Object.entries(HAIR).map(([k, h]) => `<button class="chip ${state.hair === k ? 'on' : ''}" data-hair="${k}"><i style="background:${h.color}"></i>${h.de}</button>`).join('')}</div>
      </section>
      <section>
        <h3>Garten-Mathe</h3>
        <div class="chips" id="p-math">
          <button class="chip ${state.mathAuto ? 'on' : ''}" data-lv="auto">Automatisch</button>
          ${[1, 2, 3, 4].map((l) => `<button class="chip ${!state.mathAuto && state.mathLevel === l ? 'on' : ''}" data-lv="${l}">${l}</button>`).join('')}
        </div>
        <p class="note">Aktuell: <b>${MATH_LEVELS[currentMathLevel()].de}</b> – ${MATH_LEVELS[currentMathLevel()].info}</p>
      </section>
      <section>
        <h3>Bastelstube: Muster & Zahlenfolgen</h3>
        <div class="chips" id="p-craft">
          <button class="chip ${state.craftAuto ? 'on' : ''}" data-lv="auto">Automatisch</button>
          ${[1, 2, 3, 4].map((l) => `<button class="chip ${!state.craftAuto && state.craftLevel === l ? 'on' : ''}" data-lv="${l}">${l}</button>`).join('')}
        </div>
        <p class="note">Aktuell: <b>${CRAFT_LEVELS[state.craftLevel].de}</b> – ${CRAFT_LEVELS[state.craftLevel].info}</p>
      </section>
      <section>
        <h3>Ballett: Uhrzeit</h3>
        <div class="chips" id="p-clock">
          <button class="chip ${state.clockAuto ? 'on' : ''}" data-lv="auto">Automatisch</button>
          ${[1, 2, 3].map((l) => `<button class="chip ${!state.clockAuto && state.clockLevel === l ? 'on' : ''}" data-lv="${l}">${l}</button>`).join('')}
        </div>
        <p class="note">Aktuell: <b>${CLOCK_LEVELS[state.clockLevel].de}</b> – ${CLOCK_LEVELS[state.clockLevel].info}</p>
      </section>
      <section>
        <h3>Dojo: Einmaleins-Reihen</h3>
        <div class="chips" id="p-rows">
          <button class="chip ${auto ? 'on' : ''}" data-row="auto">Nach Gürtel</button>
          ${[2, 3, 4, 5, 6, 7, 8, 9, 10].map((r) => `<button class="chip ${!auto && rows.includes(r) ? 'on' : ''}" data-row="${r}">${r}</button>`).join('')}
          <button class="chip ${!auto && state.dojoDiv ? 'on' : ''}" data-row="div">+ Geteilt</button>
        </div>
        <p class="note">Aktuell: ${rows.join(', ')}${dojoConfig().div ? ' + Geteilt' : ''}</p>
      </section>
      <section>
        <h3>Ton & Sprache</h3>
        <div class="chips">
          <button class="chip ${state.sound ? 'on' : ''}" data-tog="sound">Geräusche</button>
          <button class="chip ${state.speech ? 'on' : ''}" data-tog="speech">Vorlesen</button>
        </div>
        <p class="note">Portugiesisch: <b class="${pv.ok ? 'ok' : 'warn'}">${esc(pv.text)}</b> <button class="link" data-act="say" data-lang="pt-PT" data-text="Olá ${esc(state.name)}! Como estás?">▶ testen</button><br>
        Englisch: <b class="${ev.ok ? 'ok' : 'warn'}">${esc(ev.text)}</b> <button class="link" data-act="say" data-lang="en-GB" data-text="Hello ${esc(state.name)}! How are you?">▶ testen</button></p>
        ${pv.ok ? '' : `<p class="note warn-box">Für europäisches Portugiesisch auf Android: Einstellungen → Bedienungshilfen → Text-in-Sprache → Google-Sprachausgabe → Sprachdaten installieren → <b>Português (Portugal)</b>.</p>`}
      </section>
      <section>
        <h3>Eigene Stimmen 🎙️</h3>
        <p class="note">Nehmt Wörter und Sätze selbst auf (z. B. Mama auf Portugiesisch). Das Spiel spielt dann eure Aufnahme statt der Computerstimme. Bisher: <b>${clipCount()}</b> Aufnahmen.</p>
        <button class="btn" id="p-rec">Aufnahmen verwalten</button>
      </section>
      <section>
        <h3>Sonstiges</h3>
        <div class="btn-row">
          <button class="btn" id="p-stars">+20 Sterne geben</button>
          <button class="btn danger" id="p-reset">Spielstand löschen</button>
        </div>
      </section>
      <button class="btn primary big" data-act="close">Fertig</button>
    </div>`, { cls: 'parents-modal' });

  $('#p-name', m).addEventListener('input', (e) => { state.name = e.target.value.trim() || 'Emmi'; save(); renderTop(); });
  $('#p-hair', m).addEventListener('click', (e) => {
    const b = e.target.closest('[data-hair]'); if (!b) return;
    state.hair = b.dataset.hair; save(); render(); parentsPanel();
  });
  $('#p-math', m).addEventListener('click', (e) => {
    const b = e.target.closest('[data-lv]'); if (!b) return;
    if (b.dataset.lv === 'auto') state.mathAuto = true;
    else { state.mathAuto = false; state.mathLevel = Number(b.dataset.lv); }
    save(); parentsPanel();
  });
  $('#p-craft', m).addEventListener('click', (e) => {
    const b = e.target.closest('[data-lv]'); if (!b) return;
    if (b.dataset.lv === 'auto') state.craftAuto = true;
    else { state.craftAuto = false; state.craftLevel = Number(b.dataset.lv); }
    save(); parentsPanel();
  });
  $('#p-clock', m).addEventListener('click', (e) => {
    const b = e.target.closest('[data-lv]'); if (!b) return;
    if (b.dataset.lv === 'auto') state.clockAuto = true;
    else { state.clockAuto = false; state.clockLevel = Number(b.dataset.lv); }
    save(); parentsPanel();
  });
  $('#p-rec', m).addEventListener('click', () => recordPanel());
  $('#p-rows', m).addEventListener('click', (e) => {
    const b = e.target.closest('[data-row]'); if (!b) return;
    const v = b.dataset.row;
    if (v === 'auto') { state.dojoRows = null; state.dojoDiv = false; }
    else {
      const cur = state.dojoRows ? [...state.dojoRows] : [...dojoConfig().rows];
      if (!state.dojoRows) state.dojoDiv = dojoConfig().div;
      if (v === 'div') state.dojoDiv = !state.dojoDiv;
      else {
        const r = Number(v), idx = cur.indexOf(r);
        if (idx >= 0) { if (cur.length > 1) cur.splice(idx, 1); } else cur.push(r);
      }
      state.dojoRows = cur.sort((a, b2) => a - b2);
    }
    save(); parentsPanel();
  });
  m.querySelectorAll('[data-tog]').forEach((b) => b.addEventListener('click', () => {
    state[b.dataset.tog] = !state[b.dataset.tog];
    setAudioPrefs({ sound: state.sound, speech: state.speech });
    save(); renderTop(); parentsPanel();
  }));
  $('#p-stars', m).addEventListener('click', () => { addStars(20); });
  $('#p-reset', m).addEventListener('click', (e) => {
    if (e.target.dataset.confirm) {
      resetState(); setAudioPrefs({ sound: state.sound, speech: state.speech });
      dojo = null; closeModal(); go('garden'); toast('Spielstand gelöscht.');
    } else { e.target.dataset.confirm = '1'; e.target.textContent = 'Wirklich löschen?'; }
  });
}

// ============ Eigene Aufnahmen ============
let recLang = 'pt-PT';
let recording = null;
function recordPanel(scroll = 0) {
  const pt = recLang === 'pt-PT';
  const groups = allTexts(recLang, state.name);
  groups.push({ group: 'Lob & Gürtel', items: pt ? ['Olá!', 'Muito bem!', 'Obrigado!', ...BELTS.map((b) => b.pt)] : ['Hello!', 'Well done!', ...BELTS.map((b) => b.en)] });
  const row = (t) => {
    const has = !!clipUrl(recLang, t);
    return `<div class="rec-row ${has ? 'has' : ''}" data-t="${esc(t)}"><span class="rt">${esc(t)}</span>
      <button class="rb" data-r="play" aria-label="Anhören">▶</button>
      <button class="rb rec" data-r="rec" aria-label="Aufnehmen">●</button>
      ${has ? '<button class="rb" data-r="del" aria-label="Löschen">🗑</button>' : '<span class="rb-space"></span>'}</div>`;
  };
  const m = openModal(`
    <div class="parents rec">
      <h2>Eigene Stimmen 🎙️</h2>
      <p class="note">● antippen, Wort sprechen, ■ zum Stoppen (höchstens 5 Sekunden). ✓ = eigene Aufnahme vorhanden.</p>
      <div class="chips center">
        <button class="chip ${pt ? 'on' : ''}" data-rl="pt-PT">🇵🇹 Portugiesisch</button>
        <button class="chip ${!pt ? 'on' : ''}" data-rl="en-GB">🇬🇧 Englisch</button>
      </div>
      ${canRecord() ? '' : '<p class="note warn-box">Aufnehmen geht hier nicht – es braucht eine https-Adresse und ein Mikrofon.</p>'}
      ${groups.map((g) => `<section><h3>${esc(g.group)}</h3>${[...new Set(g.items)].map(row).join('')}</section>`).join('')}
      <div class="btn-row"><button class="btn big" data-r="back">Zurück</button></div>
    </div>`, { cls: 'parents-modal' });
  m.scrollTop = scroll;
  m.addEventListener('click', async (e) => {
    const lb = e.target.closest('[data-rl]');
    if (lb) { recLang = lb.dataset.rl; recordPanel(); return; }
    const b = e.target.closest('[data-r]');
    if (!b) return;
    const act = b.dataset.r;
    if (act === 'back') { recording?.stop(); parentsPanel(); return; }
    const t = b.closest('.rec-row')?.dataset.t;
    if (!t) return;
    if (act === 'play') speak(t, recLang, { force: true });
    else if (act === 'del') { await deleteClip(recLang, t); recordPanel(m.scrollTop); }
    else if (act === 'rec') {
      if (recording) { recording.stop(); return; }
      try {
        recording = await startRecording(5000);
        b.classList.add('on');
        b.textContent = '■';
        const blob = await recording.done;
        recording = null;
        if (blob.size > 0) { await saveClip(recLang, t, blob); toast('Gespeichert ✓'); }
        recordPanel(m.scrollTop);
        if (blob.size > 0) speak(t, recLang, { force: true });
      } catch (err) {
        recording = null;
        toast('Mikrofon nicht verfügbar 😕');
      }
    }
  });
}

// ============ Ereignisse ============
const actions = {
  goto: (el) => { if (modalOpen()) closeModal(); sfx.tick(); go(el.dataset.to); },
  close: () => closeModal(),
  sound: () => { state.sound = !state.sound; setAudioPrefs({ sound: state.sound }); save(); renderTop(); sfx.pop(); },
  parents: () => parentsGate(),
  bed: (el) => onBed(Number(el.dataset.i)),
  animal: (el) => onAnimal(el),
  say: (el) => speak(el.dataset.text, el.dataset.lang),
  collect: (el) => { const n = Number(el.dataset.n); closeModal(); addStars(n); },
  tab: (el) => { if (shopTab === 'sell') leaveMarket(); shopTab = el.dataset.tab; sfx.tick(); renderShop(); },
  buy: (el) => buy(el.dataset.kind, el.dataset.id),
  'dojo-start': () => { sfx.pop(); startDojo(); },
  'dojo-pick': (el) => dojoPick(el),
  'dojo-quit': () => { dojo = null; renderDojo(); },
  'dojo-again': () => { closeModal(); startDojo(); },
  'daily-claim': () => {
    if (state.daily.claimed) return;
    state.daily.claimed = true;
    save();
    confetti(80);
    sfx.fanfare();
    addStars(DAILY_REWARD);
    renderGarden();
  },
};
for (const g of Object.values(GAMES)) Object.assign(actions, g.actions);
Object.assign(actions, marketActions);

Object.assign(api, {
  openModal, closeModal, toast, confetti, addStars, addXP, renderTop, wordRows,
  hairColor, belt, go, quest,
});

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el || el.disabled) return;
  actions[el.dataset.act]?.(el, e);
});
document.addEventListener('pointerdown', () => sfx.unlock(), { once: true });
document.addEventListener('contextmenu', (e) => e.preventDefault());

initClips();
render();

if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
