// 👗 Figur gestalten – Frisur, Haarfarbe, Haut, Kleidung, Tutu, Extras. Manches kostet Sterne.
import { state, save } from './state.js';
import { HAIR } from './data.js';
import * as art from './art.js';
import { sfx } from './audio.js';
import { api } from './core.js';
import { $, esc, openModal, hairColor, renderTop, confetti, belt } from './ui.js';

// field = Schlüssel im Aussehen; items: id -> { de, price? }
const TABS = [
  {
    id: 'style', de: 'Frisur', preview: 'head',
    items: {
      bun: { de: 'Dutt' }, pigtails: { de: 'Zöpfe' }, ponytail: { de: 'Pferdeschwanz' },
      short: { de: 'Kurz', price: 10 }, bob: { de: 'Bob', price: 15 }, long: { de: 'Lang', price: 15 },
      buns2: { de: 'Zwei Dutts', price: 20 }, braid: { de: 'Flechtzopf', price: 25 },
    },
  },
  { id: 'hair', de: 'Haarfarbe', preview: 'head', items: Object.fromEntries(Object.entries(HAIR).map(([k, h]) => [k, { de: h.de, price: h.price }])) },
  { id: 'skin', de: 'Haut', preview: 'head', items: { 0: { de: 'Hell' }, 1: { de: 'Sand' }, 2: { de: 'Honig' }, 3: { de: 'Braun' }, 4: { de: 'Dunkel' } } },
  {
    id: 'casual', de: 'Kleidung', preview: 'casual',
    items: {
      heart: { de: 'Herz-Shirt' }, star: { de: 'Sternen-Shirt', price: 20 }, stripes: { de: 'Ringelshirt', price: 20 },
      sport: { de: 'Sport', price: 25 }, flower: { de: 'Blumenrock', price: 30 }, overalls: { de: 'Latzhose', price: 30 },
      rainbow: { de: 'Regenbogen', price: 45 }, princess: { de: 'Prinzessin', price: 60 },
    },
  },
  {
    id: 'tutu', de: 'Tutu', preview: 'tutu',
    items: { pink: { de: 'Rosa' }, lila: { de: 'Lila', price: 20 }, mint: { de: 'Türkis', price: 20 }, sun: { de: 'Sonnengelb', price: 20 }, sky: { de: 'Himmelblau', price: 20 } },
  },
  {
    id: 'acc', de: 'Extras', preview: 'head',
    items: {
      none: { de: 'Nichts' }, bow: { de: 'Schleife', price: 10 }, flower: { de: 'Blume', price: 10 },
      headband: { de: 'Haarreif', price: 15 }, star: { de: 'Sternspange', price: 15 }, glasses: { de: 'Brille', price: 20 },
      catears: { de: 'Katzenohren', price: 30 }, crown: { de: 'Krone', price: 50 },
    },
  },
];

let tab = 'style';
let pending = null; // { field, id } – ausgesucht, aber noch nicht gekauft

const cur = (field) => (field === 'hair' ? state.hair : state.look[field]);
const key = (field, id) => `${field}:${id}`;
const isOwned = (field, id, item) => !item.price || state.owned[key(field, id)] || String(cur(field)) === String(id);

// Aussehen für die Vorschau: aktueller Stand plus die gerade ausgesuchte (noch nicht gekaufte) Option
function lookWith(field, id) {
  const base = { ...hairColor() };
  if (field === 'hair') base.hair = HAIR[id].color;
  else if (field) base[field] = field === 'skin' ? Number(id) : id;
  return base;
}

function tile(t, id, item) {
  const look = lookWith(t.id, id);
  const pic = t.preview === 'head' ? art.avatarHead(look) : art.avatar(look, belt().color, { outfit: t.preview });
  const selected = pending ? (pending.field === t.id && pending.id === id) : String(cur(t.id)) === String(id);
  const owned = isOwned(t.id, id, item);
  return `<button class="w-tile ${selected ? 'sel' : ''} ${t.preview === 'head' ? 'head' : 'body'}" data-w="${id}">
    <span class="w-pic">${pic}</span>
    <span class="w-name">${item.de}</span>
    ${owned ? (selected ? '<span class="w-tag ok">✓</span>' : '') : `<span class="w-tag price">${item.price} <i>${art.star()}</i></span>`}
  </button>`;
}

function render(m) {
  const t = TABS.find((x) => x.id === tab);
  const look = pending ? lookWith(pending.field, pending.id) : hairColor();
  const outfit = tab === 'tutu' ? 'tutu' : 'casual';
  let bar = '<p class="note">Tippe an, was dir gefällt. Manches kostet Sterne.</p>';
  if (pending) {
    const item = TABS.find((x) => x.id === pending.field).items[pending.id];
    const missing = item.price - state.stars;
    bar = missing > 0
      ? `<div class="w-buy poor"><b>${item.de}</b> kostet ${item.price} Sterne – dir fehlen noch ${missing}. ⭐</div>`
      : `<div class="w-buy"><b>${item.de}</b><button class="btn primary" data-w-buy="1">Für ${item.price} <span class="bi">${art.star()}</span> kaufen</button></div>`;
  }
  $('.w-body', m).innerHTML = `
    <div class="w-left">
      <div class="w-preview">${art.avatar(look, belt().color, { outfit })}</div>
      <input id="w-name" class="big-input" value="${esc(state.name)}" maxlength="14" autocomplete="off" aria-label="Name">
      <div class="w-stars"><span class="star-ico">${art.star()}</span><b>${state.stars}</b></div>
    </div>
    <div class="w-right">
      <div class="w-tabs">${TABS.map((x) => `<button class="tab ${x.id === tab ? 'active' : ''}" data-w-tab="${x.id}">${x.de}</button>`).join('')}</div>
      <div class="w-grid">${Object.entries(t.items).map(([id, item]) => tile(t, id, item)).join('')}</div>
      <div class="w-bar">${bar}</div>
    </div>`;
}

function apply(field, id) {
  if (field === 'hair') state.hair = id;
  else state.look[field] = field === 'skin' ? Number(id) : id;
  save();
  renderTop();
}

export function openWardrobe() {
  pending = null;
  const m = openModal(`<h2>So sehe ich aus!</h2><div class="w-body"></div><button class="btn primary big" data-act="wardrobe-done">Fertig</button>`, { cls: 'wardrobe-modal', closable: false });
  render(m);
  m.addEventListener('click', (e) => {
    const tb = e.target.closest('[data-w-tab]');
    if (tb) { tab = tb.dataset.wTab; pending = null; sfx.tick(); render(m); return; }
    if (e.target.closest('[data-w-buy]') && pending) {
      const t = TABS.find((x) => x.id === pending.field);
      const item = t.items[pending.id];
      if (state.stars < item.price) return;
      state.stars -= item.price;
      state.owned[key(pending.field, pending.id)] = true;
      apply(pending.field, pending.id);
      pending = null;
      sfx.coin();
      confetti(30);
      render(m);
      return;
    }
    const tl = e.target.closest('[data-w]');
    if (tl) {
      const t = TABS.find((x) => x.id === tab);
      const id = tl.dataset.w;
      sfx.pop();
      if (isOwned(t.id, id, t.items[id])) { pending = null; apply(t.id, id); } else pending = { field: t.id, id };
      render(m);
    }
  });
  m.addEventListener('input', (e) => {
    if (e.target.id !== 'w-name') return;
    state.name = e.target.value.trim() || 'Emmi';
    save();
  });
}

export const wardrobeActions = {
  'wardrobe-done': () => { pending = null; api.closeModal(); api.render(); },
};
