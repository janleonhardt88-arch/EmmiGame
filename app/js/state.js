// Spielstand – lokal auf dem Gerät gespeichert.
import { START_BEDS } from './data.js';

const KEY = 'emmigame-v1';

export function defaults() {
  return {
    v: 1,
    name: 'Emmi',
    hair: 'brown',
    look: { style: 'bun', skin: 0, acc: 'none', casual: 'heart', tutu: 'pink' },
    owned: {}, // gekaufte Frisuren, Kleider, Extras
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
    limitMin: 0, // Spielzeit-Limit pro Tag in Minuten (0 = aus)
    play: null,
    daily: null,
  };
}

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && s.v === 1) {
      const d = defaults();
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
