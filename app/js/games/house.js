// 🏡 Mein Häuschen – mit Holz aus dem Wald Schritt für Schritt bauen, dann einrichten
import { state, save } from '../state.js';
import * as art from '../art.js';
import { sfx, speak } from '../audio.js';
import { api, $, esc } from '../core.js';
import { HOUSE_STAGES, FURNITURE, WALLS, FLOORS } from '../house-data.js';
import { openPiano } from '../piano.js';

export { HOUSE_STAGES, FURNITURE };

let inside = false;
let edit = false; // Einrichten-Modus: Möbel verschieben, Größe ändern, Tapete und Boden wählen
let sel = null; // ausgewähltes Möbelstück im Einrichten-Modus
let panel = 'shop'; // shop | wall | floor | store
const house = () => {
  const h = (state.house ||= { stage: 0, items: {} });
  h.pos ||= {}; h.hidden ||= {};
  return h;
};
const done = () => house().stage >= HOUSE_STAGES.length;
// Emojis stehen unten bündig, damit Möbel auf dem Boden stehen statt zu schweben
const furnArt = (f) => (f.svg ? art[f.svg]() : art.emoji(f.ico, 86, f.zone === 'floor' ? 52 : 50));
// Eigene Position/Größe aus dem Einrichten-Modus hat Vorrang vor dem Vorschlag in house-data.js
const place = (k) => { const f = FURNITURE[k]; const p = house().pos[k] || {}; return { x: p.x ?? f.x, y: p.y ?? f.y, b: p.b ?? f.b, s: f.s * (p.k || 1), flip: !!p.flip }; };
function furnStyle(f, k) {
  const q = k ? place(k) : f;
  const flip = q.flip ? ';--flip:-1' : '';
  if (f.zone === 'wall' || f.zone === 'flat') return `left:${q.x}%;top:${q.y}%;width:${q.s}%${flip}`;
  if (f.zone === 'ceil') return `left:${q.x}%;top:0;width:${q.s}%${flip}`;
  return `left:${q.x}%;bottom:${100 - q.b}%;width:${q.s}%;z-index:${Math.round(q.b)}${flip}`;
}
const price = (wood, stars) => [wood ? `${wood} 🪵` : '', stars ? `${stars} ⭐` : ''].filter(Boolean).join(' + ');
const canPay = (wood, stars) => state.wood >= wood && state.stars >= stars;

function woodBar() {
  return `<div class="wood-bar"><span>🪵 <b>${state.wood}</b> Holz</span><span>⭐ <b>${state.stars}</b></span></div>`;
}

function render() {
  if (inside && done()) return renderInside();
  const h = house();
  const next = HOUSE_STAGES[h.stage];
  let card;
  if (!next) {
    card = `<h1>Dein Häuschen ist fertig! 🎉</h1>
      <p>Jetzt kannst du es gemütlich einrichten.</p>
      <button class="btn primary big" data-act="house-enter">Hineingehen 🚪</button>`;
  } else {
    const ok = canPay(next.wood, next.stars);
    card = `<h1>Mein Häuschen</h1>
      <div class="build-steps">${HOUSE_STAGES.map((st, i) => `<span class="bstep ${i < h.stage ? 'done' : i === h.stage ? 'now' : ''}">${i < h.stage ? '✓' : i + 1}</span>`).join('')}</div>
      <p class="big">Nächster Schritt: <b>${next.de}</b></p>
      <p>${next.txt}</p>
      <p class="cost">Kostet: <b>${price(next.wood, next.stars)}</b></p>
      ${ok ? '<button class="btn primary big" data-act="house-build">Bauen! 🔨</button>'
        : `<p class="note">Dir fehlen noch ${Math.max(0, next.wood - state.wood) ? `${next.wood - state.wood} Holz` : ''}${next.wood > state.wood && next.stars > state.stars ? ' und ' : ''}${next.stars > state.stars ? `${next.stars - state.stars} Sterne` : ''}. Holz findest du im Wald!</p>
           <button class="btn big" data-act="goto" data-to="forest">Ab in den Wald 🌲</button>`}`;
  }
  $('#screen').innerHTML = `
    <div class="house-scene">
      <div class="map-sky"></div>
      ${woodBar()}
      <div class="stage-start">
        <div class="house-big" id="house-big">${art.homeStage(h.stage)}</div>
        <div class="game-card">${card}</div>
      </div>
    </div>`;
}

function build() {
  const h = house();
  const next = HOUSE_STAGES[h.stage];
  if (!next || !canPay(next.wood, next.stars)) return;
  state.wood -= next.wood;
  state.stars -= next.stars;
  h.stage++;
  save();
  api.renderTop();
  sfx.chop();
  setTimeout(() => sfx.chop(), 220);
  setTimeout(() => sfx.correct(), 480);
  render();
  $('#house-big')?.classList.add('grow');
  api.addXP(3);
  if (done()) {
    api.confetti(120);
    sfx.fanfare();
    setTimeout(() => api.toast('Dein Häuschen ist fertig! Geh hinein und richte es ein. 🏡'), 600);
  } else api.toast(`${next.de} gebaut! 🔨`);
}

function renderInside() {
  const h = house();
  const owned = Object.keys(FURNITURE).filter((k) => h.items[k]);
  const shown = owned.filter((k) => !h.hidden[k]);
  const stored = owned.filter((k) => h.hidden[k]);
  const shop = Object.entries(FURNITURE).filter(([k]) => !h.items[k]);
  const wall = WALLS[h.wall] || WALLS.pink;
  const floor = FLOORS[h.floor] || FLOORS.wood;
  if (sel && (!h.items[sel] || h.hidden[sel])) sel = null;
  let bar;
  if (!edit) {
    bar = `<button class="btn ghost" data-act="house-leave">⬅ Raus</button>
      <button class="btn primary" data-act="house-edit">✏️ Einrichten</button>
      <div class="furn-list">${shop.length ? shop.map(([k, f]) => `
        <button class="furn-card ${canPay(f.wood, f.stars) ? '' : 'poor'}" data-act="house-buy" data-k="${k}">
          <span class="fc-art">${furnArt(f)}</span><b>${esc(f.de.replace(/^(der|die|das) /, ''))}</b><small>${price(f.wood, f.stars)}</small>
        </button>`).join('') : '<p class="note">Alles gekauft – wie schön! 🌟</p>'}
      </div>`;
  } else {
    const tabs = `<div class="edit-tabs">
        <button class="tab ${panel === 'wall' ? 'active' : ''}" data-act="house-panel" data-p="wall">🎨 Tapete</button>
        <button class="tab ${panel === 'floor' ? 'active' : ''}" data-act="house-panel" data-p="floor">🟫 Boden</button>
        <button class="tab ${panel === 'store' ? 'active' : ''}" data-act="house-panel" data-p="store">📦 Kiste (${stored.length})</button>
      </div>`;
    let list = '';
    if (panel === 'wall') list = Object.entries(WALLS).map(([id, w]) => `<button class="swatch-card ${h.wall === id || (!h.wall && id === 'pink') ? 'sel' : ''}" data-act="house-wall" data-id="${id}"><span style="background:${w.css}"></span><b>${esc(w.de)}</b></button>`).join('');
    else if (panel === 'floor') list = Object.entries(FLOORS).map(([id, w]) => `<button class="swatch-card ${h.floor === id || (!h.floor && id === 'wood') ? 'sel' : ''}" data-act="house-floor" data-id="${id}"><span style="background:${w.css}"></span><b>${esc(w.de)}</b></button>`).join('');
    else list = stored.length ? stored.map((k) => `<button class="furn-card" data-act="house-unstore" data-k="${k}"><span class="fc-art">${furnArt(FURNITURE[k])}</span><b>${esc(FURNITURE[k].de.replace(/^(der|die|das) /, ''))}</b><small>aufstellen</small></button>`).join('') : '<p class="note">Die Kiste ist leer. Wenn du ein Möbelstück wegräumst, landet es hier.</p>';
    bar = `<button class="btn primary" data-act="house-edit-done">✓ Fertig</button>
      <div class="edit-panel">${tabs}<div class="furn-list">${list}</div></div>`;
  }
  const tools = edit && sel ? `<div class="furn-tools" style="${toolPos(sel)}">
      <button data-act="house-size" data-d="-1" aria-label="Kleiner">➖</button>
      <button data-act="house-size" data-d="1" aria-label="Größer">➕</button>
      <button data-act="house-flip" aria-label="Spiegeln">↔️</button>
      <button data-act="house-store" aria-label="Wegräumen">📦</button>
    </div>` : '';
  $('#screen').innerHTML = `
    <div class="room-scene ${edit ? 'editing' : ''}">
      ${woodBar()}
      ${edit ? '<div class="edit-hint">✋ Schieb die Möbel mit dem Finger hin und her. Tipp eins an, dann kannst du es größer, kleiner oder spiegeln.</div>' : ''}
      <div class="room-wrap"><div class="room" id="room">
        <div class="room-wall" style="background:${wall.css}"><div class="room-window"></div></div>
        <div class="room-floor" style="background:${floor.css}"></div>
        ${shown.map((k) => { const f = FURNITURE[k]; return `<button class="furn z-${f.zone} ${sel === k ? 'sel' : ''}" ${edit ? '' : 'data-act="house-say"'} data-k="${k}" style="${furnStyle(f, k)}">${furnArt(f)}<span class="bubble"></span></button>`; }).join('')}
        ${tools}
        ${owned.length ? '' : '<div class="room-empty">Noch leer! Kauf unten deine ersten Möbel.</div>'}
      </div></div>
      <div class="furn-shop">${bar}</div>
    </div>`;
  if (edit) { enableDrag(); keepToolsInside(); }
}

// Werkzeugleiste nie über den Zimmerrand hinausragen lassen
function keepToolsInside() {
  const t = $('.furn-tools'); const room = $('#room');
  if (!t || !room) return;
  const r = room.getBoundingClientRect(); const b = t.getBoundingClientRect();
  if (b.left < r.left + 4) t.style.left = `${((b.width / 2 + 4) / r.width) * 100}%`;
  else if (b.right > r.right - 4) t.style.left = `${100 - ((b.width / 2 + 4) / r.width) * 100}%`;
}

function toolPos(k) {
  const f = FURNITURE[k]; const q = place(k);
  const top = f.zone === 'floor' ? Math.max(2, q.b - q.s * 1.6 - 9) : f.zone === 'ceil' ? 30 : Math.max(2, q.y - q.s * 0.8 - 9);
  return `left:${Math.min(86, Math.max(14, q.x))}%;top:${top}%`;
}

// Grenzen je nach Art: Wandbilder an die Wand, Möbel auf den Boden, Lampe an die Decke
function clampPos(f, x, y) {
  x = Math.min(97, Math.max(3, x));
  if (f.zone === 'wall') return { x, y: Math.min(58, Math.max(6, y)) };
  if (f.zone === 'flat') return { x, y: Math.min(95, Math.max(72, y)) };
  if (f.zone === 'ceil') return { x };
  return { x, b: Math.min(100, Math.max(68, y)) };
}

function enableDrag() {
  const room = $('#room');
  if (!room) return;
  room.querySelectorAll('.furn').forEach((el) => {
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      const k = el.dataset.k; const f = FURNITURE[k];
      const r = room.getBoundingClientRect();
      const start = { x: e.clientX, y: e.clientY };
      const q = place(k);
      const anchorY = f.zone === 'floor' ? q.b : q.y;
      let moved = false;
      try { el.setPointerCapture(e.pointerId); } catch (err) { /* ältere Geräte */ }
      el.classList.add('dragging');
      const move = (ev) => {
        const dx = ((ev.clientX - start.x) / r.width) * 100;
        const dy = ((ev.clientY - start.y) / r.height) * 100;
        if (Math.abs(ev.clientX - start.x) + Math.abs(ev.clientY - start.y) > 6) moved = true;
        if (!moved) return;
        const p = clampPos(f, q.x + dx, (anchorY ?? 0) + dy);
        const h = house();
        h.pos[k] = { ...(h.pos[k] || {}), ...p };
        el.setAttribute('style', furnStyle(f, k));
        room.querySelector('.furn-tools')?.remove();
      };
      const up = () => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerup', up);
        el.removeEventListener('pointercancel', up);
        el.classList.remove('dragging');
        if (moved) { save(); sfx.pop(); sel = k; } else { sel = sel === k ? null : k; sfx.tick(); }
        renderInside();
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
    });
  });
}

function setLook(field, id) {
  house()[field] = id;
  save();
  sfx.pop();
  renderInside();
}

function buy(k) {
  const f = FURNITURE[k];
  if (!canPay(f.wood, f.stars)) {
    sfx.wrong();
    api.toast(state.wood < f.wood ? 'Dafür brauchst du mehr Holz – sammle es im Wald! 🌲' : 'Dafür brauchst du mehr Sterne. ⭐');
    return;
  }
  state.wood -= f.wood;
  state.stars -= f.stars;
  house().items[k] = true;
  save();
  api.renderTop();
  sfx.pop();
  renderInside();
  speak(f.pt, 'pt-PT');
  say(k);
}

function say(k) {
  const f = FURNITURE[k];
  const el = document.querySelector(`.furn[data-k="${k}"]`);
  if (!el) return;
  const b = el.querySelector('.bubble');
  b.innerHTML = `🇵🇹 ${esc(f.pt)}<br>🇬🇧 ${esc(f.en)}`;
  b.classList.add('show');
  clearTimeout(b._t);
  b._t = setTimeout(() => b.classList.remove('show'), 2600);
  el.classList.remove('hop'); void el.offsetWidth; el.classList.add('hop');
}

export default {
  id: 'house',
  label: 'Häuschen',
  render,
  leave() { inside = false; edit = false; sel = null; },
  actions: {
    'house-build': () => build(),
    'house-enter': () => { inside = true; sfx.pop(); render(); },
    'house-leave': () => { inside = false; edit = false; sel = null; render(); },
    'house-edit': () => { edit = true; sel = null; panel = 'wall'; sfx.pop(); renderInside(); },
    'house-edit-done': () => { edit = false; sel = null; save(); sfx.fanfare?.(); api.toast('So schön eingerichtet! 🏡✨'); renderInside(); },
    'house-panel': (el) => { panel = el.dataset.p; sfx.tick(); renderInside(); },
    'house-wall': (el) => setLook('wall', el.dataset.id),
    'house-floor': (el) => setLook('floor', el.dataset.id),
    'house-size': (el) => {
      const h = house(); const p = (h.pos[sel] ||= {});
      p.k = Math.round(Math.min(1.8, Math.max(0.6, (p.k || 1) + Number(el.dataset.d) * 0.15)) * 100) / 100;
      save(); sfx.tick(); renderInside();
    },
    'house-flip': () => { const h = house(); const p = (h.pos[sel] ||= {}); p.flip = !p.flip; save(); sfx.tick(); renderInside(); },
    'house-store': () => { house().hidden[sel] = true; sel = null; save(); sfx.pop(); renderInside(); },
    'house-unstore': (el) => { delete house().hidden[el.dataset.k]; sel = el.dataset.k; save(); sfx.pop(); renderInside(); },
    'house-buy': (el) => buy(el.dataset.k),
    'house-say': (el) => { const k = el.dataset.k; if (k === 'piano') { say(k); return openPiano(); } speak(FURNITURE[k].pt, 'pt-PT'); speak(FURNITURE[k].en, 'en-GB', { queue: true }); say(k); },
  },
};
