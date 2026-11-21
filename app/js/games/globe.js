// 🌍 Weltreise – Erdkunde: Flaggen, Hauptstädte, Kontinente, Flüsse; Stempel im Reisepass sammeln
import { state, save } from '../state.js';
import * as art from '../art.js';
import { sfx, speak } from '../audio.js';
import { COUNTRIES, allGeoTasks } from '../erdkunde.js';
import { api, $, esc, shuffle } from '../core.js';
import { runQuiz } from './quiz.js';

const ROUND = 8;
const ALL = allGeoTasks();
let quiz = null;
let newStamps = [];

const bg = '<div class="globe-bg"></div>';
const top = () => `<div class="wood-bar"><span>🛂 <b>${Object.keys(state.stamps).length}</b> / ${COUNTRIES.length} Stempel</span></div>`;
const level = () => Math.min(3, Math.max(1, state.geoLevel || 1));

function render() {
  if (quiz) return;
  $('#screen').innerHTML = `
    <div class="globe">
      ${bg}
      ${top()}
      <div class="stage-start">
        <div class="globe-big">${art.place('globe')}</div>
        <div class="game-card">
          <h1>Weltreise</h1>
          <p>Reise um die Welt: Flaggen, Länder, Hauptstädte und Flüsse.<br>Für jedes Land bekommst du einen <b>Stempel</b> in deinen Reisepass!</p>
          <button class="btn primary big" data-act="globe-start">Abflug! ✈️</button>
          <div class="passport">
            <div class="jb-head">Mein Reisepass</div>
            <div class="stamps">${COUNTRIES.map((c) => state.stamps[c.id]
              ? `<button class="stamp" data-act="say" data-lang="pt-PT" data-text="${esc(c.pt)}" title="${esc(c.de)}">${c.flag}</button>`
              : '<span class="stamp missing">?</span>').join('')}</div>
          </div>
        </div>
      </div>
    </div>`;
}

function makeRound() {
  const lv = level();
  const pool = ALL.filter((t) => t.level <= lv);
  const picked = shuffle(pool).slice(0, ROUND);
  return picked.map((t) => {
    if (t.w) return t;
    const wrong = shuffle(t.pool.filter((x) => x !== t.a)).slice(0, 2);
    return { ...t, w: wrong, icoHTML: t.kind === 'flag' || t.kind === 'capital' || t.kind === 'cont' ? `<span class="flag-big">${t.ico}</span>` : null };
  });
}

function adapt(ok) {
  if (state.geoAuto === false) return;
  state.geoLevel = level();
  if (ok) {
    state.gStreak = (state.gStreak || 0) + 1; state.gWrong = 0;
    if (state.gStreak >= 8 && state.geoLevel < 3) { state.geoLevel++; state.gStreak = 0; }
  } else {
    state.gWrong = (state.gWrong || 0) + 1; state.gStreak = 0;
    if (state.gWrong >= 3 && state.geoLevel > 1) { state.geoLevel--; state.gWrong = 0; }
  }
}

function start() {
  newStamps = [];
  sfx.pop();
  quiz = runQuiz({
    cls: 'globe',
    bg,
    top,
    tasks: makeRound(),
    onRight: (t, firstTry) => {
      adapt(firstTry);
      const c = t.country;
      if (c) {
        if (!state.stamps[c.id]) { state.stamps[c.id] = true; newStamps.push(c); }
        const fb = $('#qfb');
        if (fb) fb.innerHTML = `<span class="good">${c.flag} 🇵🇹 ${esc(c.pt)} · 🇬🇧 ${esc(c.en)}</span>`;
        setTimeout(() => speak(c.pt, 'pt-PT'), 300);
      }
      save();
    },
    onDone: finish,
  });
}

function finish({ first, total }) {
  quiz = null;
  api.quest('globe');
  save();
  render();
  api.confetti(first >= 6 ? 70 : 30);
  sfx.fanfare();
  api.openModal(`
    <div class="big-ico">${art.place('globe')}</div>
    <h2>Gute Reise, ${esc(state.name)}! ✈️</h2>
    <p class="big"><b>${first}</b> von ${total} beim ersten Versuch.</p>
    ${newStamps.length ? `<div class="result-row"><span>Neue Stempel</span><b>${newStamps.map((c) => c.flag).join(' ')}</b></div>` : ''}
    <div class="btn-row">
      <button class="btn big" data-act="close">Fertig</button>
      <button class="btn primary big" data-act="globe-again">Nochmal!</button>
    </div>`, { cls: 'celebrate' });
  setTimeout(() => api.addStars(first + 1), 400);
  api.addXP(first);
}

export default {
  id: 'globe',
  label: 'Weltreise',
  render,
  leave() { quiz?.stop(); quiz = null; },
  actions: {
    'globe-start': () => start(),
    'globe-again': () => { api.closeModal(); start(); },
  },
  quiz: () => quiz,
  quit: () => { quiz?.stop(); quiz = null; render(); },
};
