// Spielstand – lokal auf dem Gerät gespeichert.
import { START_BEDS, BELTS, OLD_BELT_XP } from './data.js';

const KEY = 'emmigame-v1';

export function defaults() {
  return {
    v: 1,
    name: 'Emmi',
    hair: 'brown',
    look: { style: 'bun', skin: 0, acc: 'none', casual: 'heart', tutu: 'pink', eyes: 'dark', cheek: 'none', shoes: 'white', pet: 'none' },
    owned: {}, // gekaufte Frisuren, Kleider, Extras
    ship: { port: 0, trips: 0, shells: 0, album: {}, knots: {}, cabin: {}, owned: {}, hull: 'red', funnel: 'yellow', seen: {} },
    stars: 12,
    xp: 0,
    seeds: { radish: 1, carrot: 1 },
    beds: Array.from({ length: START_BEDS }, () => ({ plant: null, water: 0 })),
    animals: [],
    mathLevel: 2,
    mathAuto: true,
    mStreak: 0,
    mWrong: 0,
    dojoRows: null, // null = automatisch nach Gürtel
    dojoDiv: false,
    dojoBest: 0,
    sound: true,
    music: true,
    speech: true,
    stats: { correct: 0, wrong: 0, harvested: 0, boards: 0 },
    collection: {},
    stageLang: 'pt',
    vocab: {},
    craftLevel: 2,
    craftAuto: true,
    bracelets: [],
    climbTops: 0,
    basket: {},
    clockLevel: 1,
    clockAuto: true,
    danceBest: 0,
    deco: {},
    facts: {}, // Einmaleins: wie oft richtig/falsch je Aufgabe
    welcomed: false,
    beltV: 2,
    wood: 0,
    finds: {},
    house: { stage: 0, items: {} },
    stamps: {},
    limitMin: 0, // Spielzeit-Limit pro Tag in Minuten (0 = aus)
    play: null,
    daily: null,
  };
}

// Gürtel-Umstellung (längere Gürtel): bereits erreichten Gürtel behalten
function migrate(s) {
  if (s.beltV) return;
  let i = 0;
  while (i + 1 < OLD_BELT_XP.length && (s.xp || 0) >= OLD_BELT_XP[i + 1]) i++;
  s.xp = Math.max(s.xp || 0, BELTS[i].xp);
  s.beltV = 2;
}

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && s.v === 1) {
      const d = defaults();
      migrate(s);
      return { ...d, ...s, stats: { ...d.stats, ...(s.stats || {}) }, look: { ...d.look, ...(s.look || {}) } };
    }
  } catch (e) { /* ignorieren */ }
  return defaults();
}

export const state = load();

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignorieren */ }
}

// Spielstand aus einer Sicherungsdatei übernehmen
export function importState(data) {
  migrate(data);
  const d = defaults();
  for (const k of Object.keys(state)) delete state[k];
  Object.assign(state, d, data, { stats: { ...d.stats, ...(data.stats || {}) }, look: { ...d.look, ...(data.look || {}) } });
  save();
}

export function resetState() {
  const d = defaults();
  for (const k of Object.keys(state)) delete state[k];
  Object.assign(state, d);
  save();
}
