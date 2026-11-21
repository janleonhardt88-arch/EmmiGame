// 🏡 Mein Häuschen – mit Holz aus dem Wald Schritt für Schritt bauen, dann einrichten
import { state, save } from '../state.js';
import * as art from '../art.js';
import { sfx, speak } from '../audio.js';
import { api, $, esc } from '../core.js';
import { HOUSE_STAGES, FURNITURE } from '../house-data.js';

export { HOUSE_STAGES, FURNITURE };

let inside = false;
const house = () => (state.house ||= { stage: 0, items: {} });
const done = () => house().stage >= HOUSE_STAGES.length;
const furnArt = (f) => (f.svg ? art[f.svg]() : art.emoji(f.ico));
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
  const shop = Object.entries(FURNITURE).filter(([k]) => !h.items[k]);
  $('#screen').innerHTML = `
    <div class="room-scene">
      ${woodBar()}
      <div class="room" id="room">
        <div class="room-wall"><div class="room-window"></div></div>
        <div class="room-floor"></div>
        ${owned.map((k) => { const f = FURNITURE[k]; return `<button class="furn ${f.svg === 'rug' ? 'flat' : ''}" data-act="house-say" data-k="${k}" style="left:${f.x}%;top:${f.y}%;width:${f.s}%">${furnArt(f)}<span class="bubble"></span></button>`; }).join('')}
        ${owned.length ? '' : '<div class="room-empty">Noch leer! Kauf unten deine ersten Möbel.</div>'}
      </div>
      <div class="furn-shop">
        <button class="btn ghost" data-act="house-leave">⬅ Raus</button>
        <div class="furn-list">${shop.length ? shop.map(([k, f]) => `
          <button class="furn-card ${canPay(f.wood, f.stars) ? '' : 'poor'}" data-act="house-buy" data-k="${k}">
            <span class="fc-art">${furnArt(f)}</span><b>${esc(f.de.replace(/^(der|die|das) /, ''))}</b><small>${price(f.wood, f.stars)}</small>
          </button>`).join('') : '<p class="note">Alles eingerichtet – wie schön! 🌟</p>'}
        </div>
      </div>
    </div>`;
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
  leave() { inside = false; },
  actions: {
    'house-build': () => build(),
    'house-enter': () => { inside = true; sfx.pop(); render(); },
    'house-leave': () => { inside = false; render(); },
    'house-buy': (el) => buy(el.dataset.k),
    'house-say': (el) => { const k = el.dataset.k; speak(FURNITURE[k].pt, 'pt-PT'); speak(FURNITURE[k].en, 'en-GB', { queue: true }); say(k); },
  },
};
