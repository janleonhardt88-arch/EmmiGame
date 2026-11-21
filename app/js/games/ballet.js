// 🩰 Ballettstudio – Tanzschritte merken & Uhrzeit lesen
import { state, save } from '../state.js';
import * as art from '../art.js';
import { sfx, speak } from '../audio.js';
import { api, $, esc, pick, rnd, shuffle } from '../core.js';

const MOVES = [
  { id: 'up', label: 'Arme hoch', color: '#ff7eb6', f: 523 },
  { id: 'left', label: 'Links', color: '#4fb3ff', f: 659 },
  { id: 'right', label: 'Rechts', color: '#62cc5c', f: 784 },
  { id: 'spin', label: 'Drehung', color: '#ffd23b', f: 1047 },
];
const MOVE_ICONS = { up: '🙌', left: '⬅️', right: '➡️', spin: '🌀' };
const CLOCK_TASKS = 8;
export const CLOCK_LEVELS = [null,
  { de: 'Stufe 1', info: 'Volle und halbe Stunden' },
  { de: 'Stufe 2', info: 'Mit Viertel nach / Viertel vor' },
  { de: 'Stufe 3', info: 'In 5-Minuten-Schritten' },
];

let mode = null; // null | 'dance' | 'clock'
let g = null;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const dancerSvg = () => art.avatar(api.hairColor(), '#fff', { outfit: 'tutu' });
const studioBg = `<div class="studio-wall"><div class="mirror"></div><div class="barre"></div></div><div class="studio-floor"></div>`;

function render() {
  if (mode === 'dance') return renderDance();
  if (mode === 'clock') return renderClock();
  $('#screen').innerHTML = `
    <div class="studio">${studioBg}
      <div class="stage-start">
        <div class="avatar-big dancer">${dancerSvg()}</div>
        <div class="game-card">
          <h1>Ballettstudio</h1>
          <p>Was möchtest du heute üben?</p>
          <div class="mode-grid">
            <button class="mode-btn" data-act="ballet-dance"><span class="mi">🩰</span><b>Tanz merken</b><small>Schau zu und tanz nach!</small></button>
            <button class="mode-btn" data-act="ballet-clock"><span class="mi mi-svg">${art.clock(3, 0)}</span><b>Uhr-Ballett</b><small>Wie spät ist es?</small></button>
          </div>
          ${state.danceBest ? `<p class="best">Längster Tanz: ${state.danceBest} Schritte</p>` : ''}
        </div>
      </div>
    </div>`;
}

// ---------------- Tanz merken ----------------
function startDance() {
  mode = 'dance';
  g = { seq: [pick(MOVES).id, pick(MOVES).id, pick(MOVES).id], pos: 0, input: false, lives: 2, best: 0, msg: 'Schau gut zu!' };
  renderDance();
  setTimeout(showSeq, 700);
}

function renderDance() {
  $('#screen').innerHTML = `
    <div class="studio round">${studioBg}
      <div class="dance-round">
        <div class="dance-info"><span>Schritte: <b>${g.seq.length}</b></span><span>${'❤️'.repeat(g.lives)}${'🤍'.repeat(2 - g.lives)}</span></div>
        <div class="dance-mid">
          <div class="dancer big" id="dancer">${dancerSvg()}</div>
        </div>
        <div class="dance-msg" id="dmsg">${esc(g.msg)}</div>
        <div class="moves">${MOVES.map((m) => `<button class="move" data-act="ballet-move" data-m="${m.id}" style="--c:${m.color}"><span>${MOVE_ICONS[m.id]}</span>${m.label}</button>`).join('')}</div>
      </div>
      <button class="btn ghost quit" data-act="ballet-quit">Aufhören</button>
    </div>`;
}

function pose(id) {
  const d = $('#dancer');
  if (!d) return;
  d.className = 'dancer big';
  void d.offsetWidth;
  d.classList.add('pose-' + id);
  const btn = document.querySelector(`.move[data-m="${id}"]`);
  if (btn) { btn.classList.remove('lit'); void btn.offsetWidth; btn.classList.add('lit'); }
  sfx.note(MOVES.find((m) => m.id === id).f);
}

async function showSeq() {
  if (!g) return;
  g.input = false; g.pos = 0;
  $('#dmsg').textContent = 'Schau gut zu! 👀';
  document.querySelector('.moves')?.classList.add('watch');
  const gap = Math.max(450, 800 - g.seq.length * 30);
  const myG = g;
  for (const id of g.seq) {
    if (g !== myG) return;
    pose(id);
    await sleep(gap);
  }
  if (g !== myG) return;
  $('#dancer').className = 'dancer big';
  document.querySelector('.moves')?.classList.remove('watch');
  $('#dmsg').textContent = 'Jetzt du! 💃';
  g.input = true;
}

async function onMove(el) {
  if (!g || !g.input) return;
  const my = g; // falls zwischendurch „Aufhören" getippt wird
  const id = el.dataset.m;
  pose(id);
  if (id === g.seq[g.pos]) {
    g.pos++;
    if (g.pos === g.seq.length) {
      g.input = false;
      g.best = g.seq.length;
      $('#dmsg').textContent = pick(['Wunderschön! ✨', 'Bravo! 👏', 'Super getanzt!']);
      await sleep(500);
      if (g !== my) return;
      sfx.correct();
      await sleep(700);
      if (g !== my) return;
      g.seq.push(pick(MOVES).id);
      g.msg = 'Ein Schritt mehr!';
      renderDance();
      setTimeout(showSeq, 600);
    }
  } else {
    g.input = false;
    g.lives--;
    sfx.wrong();
    el.classList.add('wrong');
    $('#dmsg').textContent = 'Hoppla! 🙈';
    if (g.lives > 0) {
      g.msg = 'Hoppla! Ich zeige es dir nochmal.';
      await sleep(900);
      if (g !== my) return;
      renderDance();
      setTimeout(showSeq, 500);
    } else {
      await sleep(700);
      if (g !== my) return;
      finishDance();
    }
  }
}

function finishDance() {
  const best = g.best;
  mode = null; g = null;
  const isBest = best > (state.danceBest || 0);
  if (isBest) state.danceBest = best;
  save();
  api.quest('ballet');
  render();
  const stars = Math.max(0, best - 2);
  api.confetti(best >= 6 ? 80 : 30);
  sfx.fanfare();
  api.openModal(`
    <div class="avatar-mid">${dancerSvg()}</div>
    <h2>Toll getanzt, ${esc(state.name)}! 🩰</h2>
    <p class="big">Du hast dir <b>${best}</b> Schritte gemerkt.</p>
    ${isBest ? '<p class="news">🏆 Neuer Rekord!</p>' : ''}
    <div class="btn-row"><button class="btn big" data-act="close">Fertig</button><button class="btn primary big" data-act="ballet-dance-again">Nochmal!</button></div>`, { cls: 'celebrate' });
  if (stars) setTimeout(() => api.addStars(stars), 400);
  api.addXP(Math.max(0, best - 2));
}

// ---------------- Uhr-Ballett ----------------
const nh = (h) => (h % 12) + 1;
export function timeLabel(h, m) {
  if (m === 0) return `${h} Uhr`;
  if (m === 30) return `halb ${nh(h)}`;
  if (m === 15) return `Viertel nach ${h}`;
  if (m === 45) return `Viertel vor ${nh(h)}`;
  if (m < 25) return `${m} nach ${h}`;
  if (m === 25) return `5 vor halb ${nh(h)}`;
  if (m === 35) return `5 nach halb ${nh(h)}`;
  return `${60 - m} vor ${nh(h)}`;
}
const digital = (h, m) => `${h}:${String(m).padStart(2, '0')}`;

function clockTask() {
  const lv = Math.min(3, Math.max(1, state.clockLevel || 1));
  const mins = lv === 1 ? [0, 30] : lv === 2 ? [0, 15, 30, 45] : Array.from({ length: 12 }, (_, i) => i * 5);
  const h = rnd(1, 12), m = pick(mins);
  const key = (a, b) => `${a}:${b}`;
  const cand = [
    [h % 12 + 1, m], [(h + 10) % 12 + 1, m],
    [h, (m + 30) % 60],
    m === 15 ? [h, 45] : m === 45 ? [h, 15] : [h, (m + 15) % 60],
  ];
  if (m % 5 === 0 && m !== 0) cand.push([m / 5, (h % 12) * 5]); // Zeiger vertauscht
  if (m === 30) cand.push([nh(h), 30]); // „halb" falsch verstanden
  const seen = new Set([key(h, m)]);
  const opts = [];
  for (const [a, b] of shuffle(cand)) {
    const k = key(a, b);
    if (a >= 1 && a <= 12 && !seen.has(k)) { seen.add(k); opts.push([a, b]); }
    if (opts.length === 3) break;
  }
  while (opts.length < 3) { const a = rnd(1, 12), b = pick(mins); if (!seen.has(key(a, b))) { seen.add(key(a, b)); opts.push([a, b]); } }
  return { h, m, options: shuffle([[h, m], ...opts]) };
}

function startClock() {
  mode = 'clock';
  g = { i: 0, first: 0, tries: 0, lock: false, task: clockTask() };
  sfx.pop();
  renderClock();
}

function renderClock() {
  const t = g.task;
  const dots = Array.from({ length: CLOCK_TASKS }, (_, k) => `<span class="cdot ${k < g.i ? 'done' : k === g.i ? 'now' : ''}"></span>`).join('');
  $('#screen').innerHTML = `
    <div class="studio round">${studioBg}
      <div class="clock-round">
        <div class="cdots">${dots}</div>
        <div class="clock-mid">
          <div class="dancer small" id="dancer">${dancerSvg()}</div>
          <div class="big-clock">${art.clock(t.h, t.m)}</div>
        </div>
        <p class="prompt-text">Wie spät ist es?</p>
        <div class="task-fb" id="tfb">&nbsp;</div>
        <div class="time-opts">${t.options.map(([h, m]) => `<button class="topt" data-act="ballet-time" data-h="${h}" data-m="${m}">${timeLabel(h, m)}<small>${digital(h, m)}</small></button>`).join('')}</div>
      </div>
      <button class="btn ghost quit" data-act="ballet-quit">Aufhören</button>
    </div>`;
}

function onTime(el) {
  if (!g || g.lock) return;
  const t = g.task;
  const h = Number(el.dataset.h), m = Number(el.dataset.m);
  if (h === t.h && m === t.m) {
    g.lock = true;
    el.classList.add('right');
    sfx.correct();
    speak(`Es ist ${timeLabel(h, m)}.`, 'de-DE');
    const d = $('#dancer'); d.classList.add('pose-spin');
    if (g.tries === 0) { g.first++; adapt(true); } else adapt(false);
    g.i++;
    setTimeout(() => {
      if (g.i >= CLOCK_TASKS) return finishClock();
      g.task = clockTask(); g.tries = 0; g.lock = false;
      renderClock();
    }, 1400);
  } else {
    g.tries++;
    el.classList.add('wrong');
    el.disabled = true;
    sfx.wrong();
    $('#tfb').innerHTML = g.tries === 1
      ? '<span class="hint">💡 Der kurze rosa Zeiger zeigt die Stunde, der lange lila Zeiger die Minuten.</span>'
      : `<span class="hint">💡 ${t.m === 30 ? '„Halb" heißt: eine halbe Stunde bis zur nächsten vollen Stunde.' : 'Wo steht der lange Zeiger? Oben = volle Stunde, unten = halb.'}</span>`;
  }
}

function adapt(ok) {
  if (state.clockAuto === false) return;
  state.clockLevel = state.clockLevel || 1;
  if (ok) {
    state.kStreak = (state.kStreak || 0) + 1; state.kWrong = 0;
    if (state.kStreak >= 6 && state.clockLevel < 3) { state.clockLevel++; state.kStreak = 0; }
  } else {
    state.kWrong = (state.kWrong || 0) + 1; state.kStreak = 0;
    if (state.kWrong >= 2 && state.clockLevel > 1) { state.clockLevel--; state.kWrong = 0; }
  }
}

function finishClock() {
  const { first } = g;
  mode = null; g = null;
  state.stats.correct += first;
  save();
  api.quest('ballet');
  render();
  api.confetti(60);
  sfx.fanfare();
  api.openModal(`
    <div class="big-ico">${art.clock(10, 10)}</div>
    <h2>Du kannst die Uhr lesen! 🕐</h2>
    <p class="big"><b>${first}</b> von ${CLOCK_TASKS} beim ersten Versuch.</p>
    <div class="btn-row"><button class="btn big" data-act="close">Fertig</button><button class="btn primary big" data-act="ballet-clock-again">Nochmal!</button></div>`, { cls: 'celebrate' });
  setTimeout(() => api.addStars(first + 1), 400);
  api.addXP(first);
}

export default {
  id: 'ballet',
  label: 'Ballett',
  icon: () => art.balletIcon(),
  render,
  leave() { mode = null; g = null; },
  actions: {
    'ballet-dance': () => startDance(),
    'ballet-dance-again': () => { api.closeModal(); startDance(); },
    'ballet-move': (el) => onMove(el),
    'ballet-clock': () => startClock(),
    'ballet-clock-again': () => { api.closeModal(); startClock(); },
    'ballet-time': (el) => onTime(el),
    'ballet-quit': () => { mode = null; g = null; render(); },
  },
};
