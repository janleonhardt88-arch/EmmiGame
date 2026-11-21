// 💶 Marktstand im Hofladen – Ernte verkaufen, Preise addieren, Wechselgeld geben
import { state, save } from '../state.js';
import { PLANTS, ANIMALS } from '../data.js';
import * as art from '../art.js';
import { sfx, speak } from '../audio.js';
import { api, $, esc, pick, rnd, shuffle } from '../core.js';

// Preise in Cent
export const PRICES = { radish: 50, carrot: 80, tomato: 120, strawberry: 150, sunflower: 200, pumpkin: 350 };
const COINS = [10, 20, 50, 100, 200, 500, 1000];
const CUSTOMERS = [
  ...Object.keys(ANIMALS).map((id) => ({ art: () => art.animal(id), name: ANIMALS[id].name })),
  { art: () => art.thing('cat'), name: 'Katze' },
  { art: () => art.thing('dog'), name: 'Hund' },
  { art: () => art.thing('bird'), name: 'Vogel' },
];
const PLURAL = { radish: 'Radieschen', carrot: 'Karotten', tomato: 'Tomaten', strawberry: 'Erdbeeren', sunflower: 'Sonnenblumen', pumpkin: 'Kürbisse' };

export const fmt = (c) => (c < 100 ? `${c} ct` : `${(c / 100).toFixed(2).replace('.', ',')} €`);

let sale = null;

function basketItems() {
  return Object.entries(state.basket || {}).filter(([, n]) => n > 0);
}

export function renderSell() {
  const el = $('#market');
  if (!el) return;
  if (sale) return renderSale(el);
  const items = basketItems();
  el.innerHTML = `
    <div class="market-idle">
      <h3>🧺 Dein Erntekorb</h3>
      ${items.length ? `<div class="basket">${items.map(([k, n]) => `
        <div class="bitem"><span class="count">${n}×</span><div class="art">${art.plant(k)}</div><b>${PLANTS[k].name}</b><span class="tag">${fmt(PRICES[k])}</span></div>`).join('')}</div>
        <button class="btn primary big" data-act="market-open">Kunden bedienen 🛎️</button>`
      : '<p class="note">Der Korb ist leer. Ernte im Garten – dann kannst du hier verkaufen!</p>'}
      <p class="note">Beim Verkaufen übst du Rechnen mit Euro und Cent.</p>
    </div>`;
}

function newCustomer() {
  const items = basketItems();
  const kinds = shuffle(items).slice(0, rnd(1, Math.min(2, items.length)));
  let total = 0;
  const order = kinds.map(([k, have]) => {
    const n = rnd(1, Math.min(have, kinds.length === 1 ? 3 : 2));
    total += n * PRICES[k];
    return { k, n };
  });
  const notes = [100, 200, 500, 1000, 2000].filter((x) => x > total);
  const paid = notes.length > 1 && Math.random() < 0.4 ? notes[1] : notes[0];
  // Antwort-Optionen für den Gesamtpreis
  const unitSum = order.reduce((s, o) => s + PRICES[o.k], 0);
  const wrong = [...new Set([total + 10, total - 10, total + 100, total - 100, total + 50, unitSum, total + 20].filter((x) => x > 0 && x !== total))];
  return {
    customer: pick(CUSTOMERS), order, total, paid,
    totalOpts: shuffle([total, ...shuffle(wrong).slice(0, 3)]),
    step: 1, tries: 0, firstOk: 0, given: [],
  };
}

function orderText(order) {
  const parts = order.map((o) => `${o.n} ${o.n === 1 ? PLANTS[o.k].name : PLURAL[o.k]}`);
  return parts.length > 1 ? `${parts.slice(0, -1).join(', ')} und ${parts.at(-1)}` : parts[0];
}

function renderSale(el) {
  const s = sale;
  const given = s.given.reduce((a, b) => a + b, 0);
  let panel;
  if (s.step === 1) {
    panel = `
      <div class="receipt">${s.order.map((o) => `<div><span>${o.n} × ${PLANTS[o.k].name}</span><span>je ${fmt(PRICES[o.k])}</span></div>`).join('')}</div>
      <p class="prompt-text">Was kostet das zusammen?</p>
      <div class="task-fb" id="mfb">&nbsp;</div>
      <div class="price-opts">${s.totalOpts.map((v) => `<button class="popt" data-act="market-total" data-v="${v}">${fmt(v)}</button>`).join('')}</div>`;
  } else {
    panel = `
      <div class="paid-row">Der Kunde bezahlt <b>${fmt(s.total)}</b> mit <span class="paid-money">${art.money(s.paid)}</span></div>
      <p class="prompt-text">Gib das Wechselgeld! Tippe Münzen an.</p>
      <div class="tray">${s.given.length ? s.given.map((c, i) => `<button class="tcoin ${c >= 500 ? 'note' : ''}" data-act="market-untake" data-i="${i}">${art.money(c)}</button>`).join('') : '<span class="note">Hier hinein …</span>'}</div>
      <div class="tray-sum">Du gibst: <b>${fmt(given)}</b></div>
      <div class="task-fb" id="mfb">&nbsp;</div>
      <div class="coins">${COINS.filter((c) => c < s.paid).map((c) => `<button class="coin ${c >= 500 ? 'note' : ''}" data-act="market-give" data-c="${c}">${art.money(c)}</button>`).join('')}</div>
      <button class="btn primary big" data-act="market-change">Fertig ✓</button>`;
  }
  el.innerHTML = `
    <div class="sale">
      <div class="customer">
        <div class="cust-art">${s.customer.art()}</div>
        <div class="cust-bubble">Hallo! Ich möchte <b>${orderText(s.order)}</b>, bitte!</div>
      </div>
      <div class="sale-panel">${panel}</div>
    </div>`;
}

function onTotal(btn) {
  const v = Number(btn.dataset.v);
  if (v === sale.total) {
    btn.classList.add('right');
    sfx.correct();
    if (sale.tries === 0) sale.firstOk++;
    setTimeout(() => { sale.step = 2; sale.tries = 0; renderSell(); }, 800);
  } else {
    sale.tries++;
    btn.classList.add('wrong'); btn.disabled = true;
    sfx.wrong();
    $('#mfb').innerHTML = `<span class="hint">💡 ${sale.order.map((o) => `${o.n} × ${fmt(PRICES[o.k])}`).join(' + ')} – rechne Schritt für Schritt.</span>`;
  }
}

function onChange() {
  const change = sale.paid - sale.total;
  const given = sale.given.reduce((a, b) => a + b, 0);
  if (given === change) {
    sfx.coin();
    if (sale.tries === 0) sale.firstOk++;
    finishSale();
    return;
  }
  sale.tries++;
  sfx.wrong();
  const fb = $('#mfb');
  if (sale.tries >= 3) {
    fb.innerHTML = `Das Wechselgeld ist <b>${fmt(change)}</b>. Ich lege es dir hin.`;
    sale.given = greedy(change);
    setTimeout(() => { renderSell(); setTimeout(finishSale, 1500); }, 1200);
    return;
  }
  fb.innerHTML = `<span class="hint">💡 ${given > change ? 'Das ist zu viel!' : 'Das ist noch zu wenig.'} Rechne: ${fmt(sale.paid)} − ${fmt(sale.total)}. Tipp: Ergänze von ${fmt(sale.total)} bis ${fmt(sale.paid)}.</span>`;
}

function greedy(c) {
  const out = [];
  for (const v of [...COINS].reverse()) while (c >= v) { out.push(v); c -= v; }
  return out;
}

function finishSale() {
  const s = sale;
  for (const o of s.order) state.basket[o.k] -= o.n;
  state.stats.sold = (state.stats.sold || 0) + 1;
  save();
  const stars = Math.ceil(s.total / 100) + s.firstOk;
  sale = null;
  speak('Obrigado!', 'pt-PT');
  api.quest('market');
  api.openModal(`
    <div class="big-ico">${s.customer.art()}</div>
    <h2>Danke schön! 💛</h2>
    <p class="big">Verkauft für <b>${fmt(s.total)}</b>.</p>
    <p>${s.firstOk === 2 ? 'Alles beim ersten Versuch richtig! 🌟' : 'Gut gerechnet!'}</p>
    <div class="btn-row"><button class="btn big" data-act="close">Fertig</button>${basketItems().length ? '<button class="btn primary big" data-act="market-next">Nächster Kunde</button>' : ''}</div>`, { cls: 'celebrate' });
  setTimeout(() => api.addStars(stars), 300);
  api.addXP(s.firstOk);
  renderSell();
}

export const marketActions = {
  'market-open': () => { sale = newCustomer(); sfx.pop(); renderSell(); },
  'market-next': () => { api.closeModal(); sale = newCustomer(); renderSell(); },
  'market-total': (el) => onTotal(el),
  'market-give': (el) => { if (sale.given.length < 12) { sale.given.push(Number(el.dataset.c)); sfx.tick(); renderSell(); } },
  'market-untake': (el) => { sale.given.splice(Number(el.dataset.i), 1); sfx.tick(); renderSell(); },
  'market-change': () => onChange(),
};

export function leaveMarket() { sale = null; }
