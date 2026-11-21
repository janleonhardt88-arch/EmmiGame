// 🧶 Bastelstube – Perlen-Armbänder: Muster und Zahlenfolgen
import { state, save } from '../state.js';
import * as art from '../art.js';
import { sfx } from '../audio.js';
import { api, $, esc, pick, rnd, shuffle } from '../core.js';
import { startBeads, beadActions, beadMini, stopBeads, origamiMenu, origamiActions, stopOrigami, ORIGAMI } from './craft2.js';

const STEPS = 8;
const PALETTE = ['#ff5a7a', '#ff9a2e', '#ffd23b', '#62cc5c', '#4fb3ff', '#9b7bff', '#ff8cc6', '#3fb8a8'];
const SHAPES = ['round', 'heart', 'star', 'flower', 'cube'];
export const CRAFT_LEVELS = [
  null,
  { de: 'Stufe 1', info: 'Farbmuster (AB, AAB, ABC)' },
  { de: 'Stufe 2', info: 'Farben & Formen gemischt' },
  { de: 'Stufe 3', info: 'Zahlenfolgen (+2, +5, +10, −3 …)' },
  { de: 'Stufe 4', info: 'Knifflige Zahlenfolgen (verdoppeln, wachsende Schritte)' },
];

let round = null;
const same = (a, b) => a.color === b.color && a.shape === b.shape && a.label === b.label;

function patternTask(level) {
  const patterns = level === 1 ? ['AB', 'AAB', 'ABB', 'ABC'] : ['AABB', 'ABAC', 'ABCD', 'ABBC', 'AABC', 'ABCB'];
  const pat = pick(patterns);
  const keys = [...new Set(pat)];
  const colors = shuffle(PALETTE);
  const shapes = shuffle(SHAPES);
  const look = {};
  keys.forEach((k, i) => {
    look[k] = level === 1 ? { color: colors[i], shape: 'round' } : { color: colors[i], shape: shapes[i % shapes.length] };
  });
  const len = level === 1 ? 6 + rnd(0, 1) : 7 + rnd(0, 1);
  const seq = Array.from({ length: len + 1 }, (_, i) => look[pat[i % pat.length]]);
  const answer = seq.pop();
  const opts = [answer, ...keys.map((k) => look[k]).filter((b) => !same(b, answer))];
  // ein „falscher Freund": richtige Farbe, falsche Form (oder neue Farbe)
  const trick = level === 1 ? { color: colors[keys.length], shape: 'round' } : { color: answer.color, shape: shapes[(shapes.indexOf(answer.shape) + 1) % shapes.length] };
  if (!opts.some((o) => same(o, trick))) opts.push(trick);
  return { seq, answer, options: shuffle(opts.slice(0, 4)), hint: 'Schau, welche Perlen sich immer wiederholen.' };
}

function numberTask(level) {
  let seq, hint;
  if (level === 3) {
    const step = pick([2, 2, 5, 10, 3, 4, -2, -5, -10, -3]);
    const start = step > 0 ? rnd(0, 30) : rnd(40, 90);
    seq = Array.from({ length: 6 }, (_, i) => start + i * step);
    hint = `Wie viel kommt immer ${step > 0 ? 'dazu' : 'weg'}? Vergleiche zwei Perlen nebeneinander.`;
  } else {
    const t = rnd(0, 3);
    if (t === 0) { const s = pick([1, 2, 3]); seq = Array.from({ length: 6 }, (_, i) => s * 2 ** i); hint = 'Jede Zahl wird verdoppelt.'; }
    else if (t === 1) { const s = rnd(1, 10); seq = [s]; for (let i = 1; i < 6; i++) seq.push(seq[i - 1] + i); hint = 'Der Schritt wird jedes Mal um 1 größer: +1, +2, +3 …'; }
    else if (t === 2) { const s = rnd(10, 30); seq = [s]; for (let i = 1; i < 6; i++) seq.push(seq[i - 1] + (i % 2 ? 10 : -1)); hint = 'Immer abwechselnd: erst +10, dann −1.'; }
    else { const step = pick([6, 7, 8, 9, -6, -7, -8]); const start = step > 0 ? rnd(1, 20) : rnd(60, 99); seq = Array.from({ length: 6 }, (_, i) => start + i * step); hint = 'Rechne den Abstand zwischen zwei Perlen aus.'; }
  }
  const color0 = rnd(0, PALETTE.length - 1);
  const beads = seq.map((n, i) => ({ color: PALETTE[(color0 + i) % PALETTE.length], shape: 'round', label: n }));
  const answer = beads.pop();
  const a = answer.label;
  const diff = a - seq[seq.length - 2];
  const wrong = [...new Set([a + 1, a - 1, a + diff, a + 10, a - 10, a + 2].filter((n) => n >= 0 && n !== a))];
  const options = shuffle([a, ...shuffle(wrong).slice(0, 3)]).map((n) => ({ color: answer.color, shape: 'round', label: n }));
  return { seq: beads, answer, options, hint };
}

function makeTask() {
  const lv = Math.min(4, Math.max(1, state.craftLevel || 2));
  return lv <= 2 ? patternTask(lv) : numberTask(lv);
}

function braceletSvg(beads, { r = 36 } = {}) {
  const n = Math.max(beads.length, 1);
  const parts = beads.map((b, i) => {
    const a = (i / Math.max(n, 8)) * Math.PI * 2 - Math.PI / 2;
    const x = 50 + Math.cos(a) * r, y = 50 + Math.sin(a) * r;
    const s = 0.16;
    return `<g transform="translate(${(x - 50 * s).toFixed(1)} ${(y - 50 * s).toFixed(1)}) scale(${s})">${art.beadBody({ ...b, label: null })}</g>`;
  }).join('');
  return art.svg(`<circle cx="50" cy="50" r="${r}" fill="none" stroke="#e2c9a8" stroke-width="2.5"/>${parts}`);
}

function render() {
  if (round) return renderRound();
  const saved = (state.bracelets || []).slice(-4).reverse();
  const pics = [...new Set((state.crafts?.beads || []).slice().reverse())].slice(0, 6);
  const folded = ORIGAMI.filter((o) => state.crafts?.origami?.[o.id]);
  const works = [
    ...saved.map((b) => `<div class="jb-item">${braceletSvg(b)}</div>`),
    ...pics.map((id) => `<div class="jb-item">${beadMini(id)}</div>`),
    ...folded.map((o) => `<div class="jb-item ori">${o.ico}</div>`),
  ];
  $('#screen').innerHTML = `
    <div class="craft">
      <div class="craft-wall"></div><div class="craft-table"></div>
      <div class="yarn y1">${art.yarnIcon()}</div><div class="yarn y2">${art.yarnIcon()}</div>
      <div class="stage-start">
        <div class="avatar-big">${art.avatar(api.hairColor(), '#fff', { outfit: 'casual' })}</div>
        <div class="game-card">
          <h1>Bastelstube</h1>
          <p>Was möchtest du heute basteln?</p>
          <div class="craft-choice">
            <button class="ctile" data-act="craft-start"><span>📿</span><b>Perlen-Armband</b><small>Finde die nächste Perle im Muster</small></button>
            <button class="ctile" data-act="craft-beads"><span>🎨</span><b>Bügelperlen-Bild</b><small>Steck die andere Hälfte wie im Spiegel</small></button>
            <button class="ctile" data-act="craft-origami"><span>🦢</span><b>Origami falten</b><small>Bring die Faltschritte in die richtige Reihenfolge</small></button>
          </div>
          <div class="jewel-box">
            <div class="jb-head"><span class="jb-ico">${art.box()}</span> Meine Bastelwerke</div>
            <div class="jb-list">${works.length ? works.join('') : '<p class="note">Noch leer – bastel dein erstes Werk!</p>'}</div>
          </div>
        </div>
      </div>
    </div>`;
}

function start() {
  round = { i: 0, first: 0, made: [], task: makeTask(), tries: 0, lock: false };
  sfx.pop();
  renderRound();
}

function renderRound() {
  const t = round.task;
  $('#screen').innerHTML = `
    <div class="craft round">
      <div class="craft-wall"></div><div class="craft-table"></div>
      <div class="craft-round">
        <div class="my-bracelet">
          <div class="mb-ring">${braceletSvg(round.made)}</div>
          <div class="mb-text">Dein Armband: <b>${round.i} / ${STEPS}</b> Perlen</div>
        </div>
        <div class="puzzle">
          <p class="prompt-text">Welche Perle kommt als Nächstes?</p>
          <div class="string">
            ${t.seq.map((b) => `<span class="pb">${art.bead(b)}</span>`).join('')}
            <span class="pb q" id="slot">?</span>
          </div>
          <div class="task-fb" id="cfb">&nbsp;</div>
        </div>
        <div class="bead-opts">${t.options.map((b, k) => `<button class="bead-opt" data-act="craft-pick" data-k="${k}">${art.bead(b)}</button>`).join('')}</div>
      </div>
      <button class="btn ghost quit" data-act="craft-quit">Aufhören</button>
    </div>`;
}

function onPick(btn) {
  if (!round || round.lock) return;
  const t = round.task;
  const b = t.options[Number(btn.dataset.k)];
  if (same(b, t.answer)) {
    round.lock = true;
    btn.classList.add('right');
    const slot = $('#slot');
    slot.classList.remove('q');
    slot.classList.add('filled');
    slot.innerHTML = art.bead(t.answer);
    sfx.correct();
    if (round.tries === 0) { round.first++; adapt(true); } else adapt(false);
    round.made.push(t.answer);
    round.i++;
    setTimeout(() => {
      if (round.i >= STEPS) return finish();
      round.task = makeTask(); round.tries = 0; round.lock = false;
      renderRound();
    }, 1000);
  } else {
    round.tries++;
    btn.classList.add('wrong');
    btn.disabled = true;
    sfx.wrong();
    $('#cfb').innerHTML = round.tries === 1 ? 'Fast! Schau nochmal genau. 🙂' : `<span class="hint">💡 ${esc(t.hint)}</span>`;
  }
}

function adapt(ok) {
  if (state.craftAuto === false) return;
  if (ok) {
    state.cStreak = (state.cStreak || 0) + 1; state.cWrong = 0;
    if (state.cStreak >= 5 && state.craftLevel < 4) { state.craftLevel++; state.cStreak = 0; }
  } else {
    state.cWrong = (state.cWrong || 0) + 1; state.cStreak = 0;
    if (state.cWrong >= 2 && state.craftLevel > 1) { state.craftLevel--; state.cWrong = 0; }
  }
}

function finish() {
  const { first, made } = round;
  round = null;
  state.bracelets = [...(state.bracelets || []), made].slice(-30);
  api.quest('craft');
  save();
  render();
  api.confetti(70);
  sfx.fanfare();
  api.openModal(`
    <div class="bracelet-big">${braceletSvg(made)}</div>
    <h2>Dein Armband ist fertig! 📿</h2>
    <p class="big"><b>${first}</b> von ${STEPS} Perlen beim ersten Versuch.</p>
    <p>Es liegt jetzt in deinem Schmuckkästchen.</p>
    <div class="btn-row">
      <button class="btn big" data-act="close">Fertig</button>
      <button class="btn primary big" data-act="craft-again">Noch eins!</button>
    </div>`, { cls: 'celebrate' });
  setTimeout(() => api.addStars(first + 2), 400);
  api.addXP(first);
}

export default {
  id: 'craft',
  label: 'Basteln',
  icon: () => art.yarnIcon(),
  render,
  leave() { round = null; stopBeads(); stopOrigami(); },
  actions: {
    'craft-start': () => start(),
    'craft-again': () => { api.closeModal(); start(); },
    'craft-pick': (el) => onPick(el),
    'craft-quit': () => { round = null; stopBeads(); render(); },
    'craft-home': () => { api.closeModal(); round = null; stopBeads(); stopOrigami(); render(); },
    'craft-beads': () => { api.closeModal(); startBeads(); },
    ...beadActions,
    ...origamiActions,
  },
};
