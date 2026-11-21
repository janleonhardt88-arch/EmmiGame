// Spielstand – lokal auf dem Gerät gespeichert.
import { START_BEDS } from './data.js';

const KEY = 'emmigame-v1';

export function defaults() {
  return {
    v: 1,
    name: 'Emmi',
    hair: 'brown',
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
    speech: true,
    stats: { correct: 0, wrong: 0, harvested: 0, boards: 0 },
    collection: {},
  };
}

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && s.v === 1) {
      const d = defaults();
      return { ...d, ...s, stats: { ...d.stats, ...(s.stats || {}) } };
    }
  } catch (e) { /* ignorieren */ }
  return defaults();
}

export const state = load();

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignorieren */ }
}

export function resetState() {
  const d = defaults();
  for (const k of Object.keys(state)) delete state[k];
  Object.assign(state, d);
  save();
}
