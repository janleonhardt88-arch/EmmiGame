// 🏪 Hofladen – kaufen (Samen, Tiere, Garten, Deko) und verkaufen (Marktstand)
import { state, save } from '../state.js';
import { PLANTS, ANIMALS, DECOS, MAX_PER_ANIMAL, BELTS, beltIndex, MAX_BEDS, START_BEDS, BED_PRICES } from '../data.js';
import * as art from '../art.js';
import { sfx, speak } from '../audio.js';
import { $, esc, toast, bumpStars } from '../ui.js';
import { renderSell, marketActions, leaveMarket } from './market.js';

let shopTab = 'seeds';

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
  } else if (shopTab === 'deco') {
    cards = Object.entries(DECOS).map(([k, d]) => shopCard({
      kind: 'deco', id: k, artHTML: art.deco(k), title: d.name, pt: d.pt, price: d.price, belt: 0,
      owned: 0, max: !!state.deco[k], info: state.deco[k] ? 'Steht in deinem Garten' : 'Schmückt deinen Garten',
    }, bi)).join('');
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
      <div class="tabs">${tab('seeds', 'Samen')}${tab('animals', 'Tiere')}${tab('garden', 'Beete')}${tab('deco', 'Deko')}${tab('sell', '💶 Verkaufen')}</div>
      ${cards === null ? '<div id="market"></div>' : `<div class="shop-grid">${cards}</div>`}
    </div>`;
  if (cards === null) renderSell();
}

function shopCard(c, bi) {
  const locked = bi < c.belt;
  const afford = state.stars >= c.price;
  let btn;
  if (locked) btn = `<div class="lock-note"><span class="belt-ico">${art.beltIcon(BELTS[c.belt].color)}</span>ab ${BELTS[c.belt].de}</div>`;
  else if (c.max) btn = `<div class="lock-note">✓ ${c.kind === 'deco' ? 'gekauft' : 'voll'}</div>`;
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
  else if (kind === 'deco') { price = DECOS[id].price; label = DECOS[id].name; }
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
  } else if (kind === 'deco') {
    state.deco[id] = true;
    speak(DECOS[id].pt, 'pt-PT');
  } else state.beds.push({ plant: null, water: 0 });
  save();
  sfx.pop();
  bumpStars();
  renderShop();
  toast(kind === 'animal' ? `${label} wohnt jetzt in deinem Garten! 🏡` : kind === 'deco' ? `${label} steht jetzt in deinem Garten! 🎀` : `Gekauft: ${label} ✓`);
}
export default {
  id: 'shop',
  label: 'Laden',
  render: renderShop,
  leave() { leaveMarket(); },
  actions: {
    tab: (el) => { if (shopTab === 'sell') leaveMarket(); shopTab = el.dataset.tab; sfx.tick(); renderShop(); },
    buy: (el) => buy(el.dataset.kind, el.dataset.id),
    ...marketActions,
  },
};
