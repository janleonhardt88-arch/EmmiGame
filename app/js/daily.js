// ✅ Tagesaufgaben – drei kleine Ziele pro Tag mit Bonus-Sternen
import { state, save } from './state.js';
import * as art from './art.js';
import { sfx } from './audio.js';
import { api } from './core.js';
import { toast, openModal, closeModal, confetti, addStars } from './ui.js';

export const QUESTS = {
  water: { goal: 3, text: (g) => `${g} Pflanzen gießen`, ico: '💧', place: 'garden' },
  harvest: { goal: 2, text: (g) => `${g} Pflanzen ernten`, ico: '🧺', place: 'garden' },
  dojo: { goal: 1, text: () => 'Eine Runde im Dojo', ico: '🥋', place: 'dojo' },
  stage: { goal: 1, text: () => 'Ein Lied auf der Bühne', ico: '🎤', place: 'stage' },
  craft: { goal: 1, text: () => 'Ein Armband basteln', ico: '📿', place: 'craft' },
  climb: { goal: 1, text: () => 'Einmal bis zur Glocke klettern', ico: '🧗', place: 'climb' },
  ballet: { goal: 1, text: () => 'Im Ballettstudio üben', ico: '🩰', place: 'ballet' },
  market: { goal: 1, text: () => 'Einen Kunden im Hofladen bedienen', ico: '🛎️', place: 'shop' },
};
export const DAILY_REWARD = 10;

export const today = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };

export function daily() {
  if (!state.daily || state.daily.date !== today()) {
    const ids = Object.keys(QUESTS).filter((x) => x !== 'water' && x !== 'market').sort(() => Math.random() - 0.5);
    state.daily = { date: today(), quests: ['water', ...ids.slice(0, 2)].map((id) => ({ id, n: 0 })), claimed: false };
    save();
  }
  return state.daily;
}

const isDone = (q) => q.n >= QUESTS[q.id].goal;

export function quest(id) {
  const d = daily();
  const q = d.quests.find((x) => x.id === id);
  if (!q || isDone(q)) return;
  q.n++;
  save();
  if (isDone(q)) setTimeout(() => toast(`✅ Tagesaufgabe geschafft: ${QUESTS[id].text(QUESTS[id].goal)}`), 900);
}

// Orte, an denen heute noch eine Aufgabe wartet (für Sternchen auf der Karte)
export function questPlaces() {
  const d = daily();
  return new Set(d.claimed ? [] : d.quests.filter((q) => !isDone(q)).map((q) => QUESTS[q.id].place));
}

// Kompakte Anzeige auf der Karte
export function dailyPill() {
  const d = daily();
  if (d.claimed) return `<button class="daily-pill done" data-act="daily-open">🌟 Heute alles geschafft!</button>`;
  const all = d.quests.every(isDone);
  if (all) return `<button class="daily-pill ready" data-act="daily-open">🎁 Belohnung abholen!</button>`;
  return `<button class="daily-pill" data-act="daily-open"><b>Heute:</b>${d.quests.map((q) => `<span class="${isDone(q) ? 'ok' : ''}">${isDone(q) ? '✅' : QUESTS[q.id].ico}</span>`).join('')}</button>`;
}

function openDaily() {
  const d = daily();
  const all = d.quests.every(isDone);
  openModal(`
    <h2>${d.claimed ? 'Heute alles geschafft! 🌟' : 'Deine Aufgaben für heute'}</h2>
    <div class="daily-list">
      ${d.quests.map((q) => { const Q = QUESTS[q.id], ok = isDone(q); return `<button class="dq ${ok ? 'ok' : ''}" data-act="goto" data-to="${Q.place}"><span class="dq-ico">${ok ? '✅' : Q.ico}</span><span class="dq-text">${Q.text(Q.goal)}</span>${Q.goal > 1 ? `<small>${Math.min(q.n, Q.goal)}/${Q.goal}</small>` : ''}</button>`; }).join('')}
    </div>
    ${d.claimed ? '<p>Morgen gibt es neue Aufgaben.</p>'
      : all ? `<button class="btn primary big" data-act="daily-claim">+${DAILY_REWARD} <span class="bi">${art.star()}</span> abholen</button>`
        : `<p class="note">Schaffst du alle drei? Dann gibt es ${DAILY_REWARD} Sterne extra!</p>`}`);
}

export const dailyActions = {
  'daily-open': () => { sfx.tick(); openDaily(); },
  'daily-claim': () => {
    const d = daily();
    if (d.claimed) return;
    d.claimed = true;
    save();
    closeModal();
    confetti(80);
    sfx.fanfare();
    addStars(DAILY_REWARD);
    api.render();
  },
};
