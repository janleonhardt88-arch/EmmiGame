// 🥋 Karate-Dojo – Einmaleins: Bretter zerschlagen
import { state, save } from '../state.js';
import { beltIndex, DOJO_ROWS, DOJO_DIV_FROM_BELT, DOJO_BOARDS, DOJO_FAST_MS } from '../data.js';
import * as art from '../art.js';
import { sfx } from '../audio.js';
import { dojoTask } from '../math.js';
import { $, esc, hairColor, belt, openModal, closeModal, confetti, addStars, addXP } from '../ui.js';
import { quest } from '../daily.js';

let dojo = null;

// ============ Dojo ============
function dojoConfig() {
  const bi = beltIndex(state.xp);
  if (state.dojoRows && state.dojoRows.length) return { rows: state.dojoRows, div: state.dojoDiv };
  return { rows: DOJO_ROWS[Math.min(bi, DOJO_ROWS.length - 1)], div: bi >= DOJO_DIV_FROM_BELT };
}

function renderDojo() {
  if (dojo) return renderDojoRound();
  const { rows, div } = dojoConfig();
  $('#screen').innerHTML = `
    <div class="dojo">
      <div class="dojo-wall"></div><div class="dojo-floor"></div>
      <div class="dojo-start">
        <div class="avatar-big">${art.avatar(hairColor(), belt().color)}</div>
        <div class="dojo-card">
          <h1>Karate-Dojo</h1>
          <p>Zerschlage <b>${DOJO_BOARDS} Bretter</b> mit dem Einmaleins!<br>Je schneller, desto mehr Sterne. ⚡</p>
          <p class="rows">Heute: ${rows.join(', ')}er-Reihe${div ? ' + Geteilt' : ''}</p>
          ${state.dojoBest ? `<p class="best">Dein Rekord: ${state.dojoBest} von ${DOJO_BOARDS} beim ersten Versuch</p>` : ''}
          <button class="btn primary big" data-act="dojo-start">Hajime! 🥋</button>
        </div>
      </div>
    </div>`;
}

function startDojo() {
  const { rows, div } = dojoConfig();
  dojo = { i: 0, first: 0, fast: 0, rows, div, task: null, lock: false };
  nextBoard();
}

function nextBoard() {
  if (!dojo) return;
  if (dojo.i >= DOJO_BOARDS) return finishDojo();
  dojo.task = dojoTask(dojo.rows, dojo.div, state.facts);
  dojo.missed = false;
  dojo.lock = false;
  dojo.t0 = performance.now();
  renderDojoRound();
}

function renderDojoRound() {
  const t = dojo.task;
  const track = Array.from({ length: DOJO_BOARDS }, (_, k) => `<span class="mini-board ${k < dojo.i ? 'done' : k === dojo.i ? 'now' : ''}"></span>`).join('');
  $('#screen').innerHTML = `
    <div class="dojo round">
      <div class="dojo-wall"></div><div class="dojo-floor"></div>
      <div class="round-wrap">
        <div class="board-track">${track}</div>
        <div class="arena">
          <div class="fighter" id="fighter">${art.avatar(hairColor(), belt().color)}</div>
          <div class="board-wrap" id="board">
            <div class="half l">${art.boardHalf('l')}</div><div class="half r">${art.boardHalf('r')}</div>
            <div class="board-text">${t.text}</div>
            <div class="stand sl"></div><div class="stand sr"></div>
          </div>
        </div>
        <div class="speed"><span class="bolt">${art.bolt()}</span><div class="speed-track"><i style="animation-duration:${DOJO_FAST_MS}ms"></i></div></div>
        <div class="dojo-hint" id="dhint"></div>
        <div class="choices">${t.choices.map((c) => `<button class="choice" data-act="dojo-pick" data-v="${c}">${c}</button>`).join('')}</div>
      </div>
      <button class="btn ghost quit" data-act="dojo-quit">Aufhören</button>
    </div>`;
}

function dojoPick(btn) {
  if (!dojo || dojo.lock) return;
  const v = Number(btn.dataset.v);
  const board = $('#board');
  if (v === dojo.task.answer) {
    dojo.lock = true;
    const fact = (state.facts[dojo.task.key] ||= { ok: 0, bad: 0 });
    if (dojo.missed) fact.bad++; else fact.ok++;
    const ms = performance.now() - dojo.t0;
    if (!dojo.missed) {
      dojo.first++;
      if (ms < DOJO_FAST_MS) dojo.fast++;
    }
    btn.classList.add('right');
    $('#fighter').classList.add('chop');
    setTimeout(() => {
      board.classList.add('broken');
      sfx.chop();
      const hai = document.createElement('div');
      hai.className = 'hai';
      hai.textContent = ms < DOJO_FAST_MS && !dojo.missed ? 'HAI! ⚡' : 'HAI!';
      board.appendChild(hai);
    }, 160);
    dojo.i++;
    state.stats.boards++;
    setTimeout(nextBoard, 1000);
  } else {
    dojo.missed = true;
    state.stats.wrong++;
    btn.classList.add('wrong');
    btn.disabled = true;
    board.classList.remove('wobble'); void board.offsetWidth; board.classList.add('wobble');
    sfx.wrong();
    $('#dhint').textContent = '💡 ' + hintFor(dojo.task.text);
  }
}

// Rechentipp nach einem Fehler: Malaufgabe als Plusaufgabe oder über eine leichte Kernaufgabe
function hintFor(text) {
  if (text.includes(':')) {
    const [p, d] = text.split(':').map((x) => Number(x.trim()));
    return `Welche Zahl mal ${d} ergibt ${p}? Zähl in ${d}er-Schritten: ${d}, ${2 * d}, ${3 * d} …`;
  }
  const [a, b] = text.split('·').map((x) => Number(x.trim()));
  if (a <= 5) return `${a} · ${b} = ${Array(a).fill(b).join(' + ')}`;
  if (b <= 5) return `${a} · ${b} = ${Array(b).fill(a).join(' + ')}`;
  if (a === 10 || b === 10) return `Bei mal 10 hängst du eine 0 an.`;
  return `Erst 5 · ${b} = ${5 * b}, dann noch ${a - 5} · ${b} = ${(a - 5) * b} dazu.`;
}

function finishDojo() {
  const { first, fast } = dojo;
  dojo = null;
  const stars = first + Math.floor(fast / 2);
  quest('dojo');
  const isBest = first > state.dojoBest;
  if (isBest) state.dojoBest = first;
  state.stats.correct += first;
  save();
  renderDojo();
  confetti(first >= 8 ? 90 : 40);
  sfx.fanfare();
  openModal(`
    <div class="avatar-mid">${art.avatar(hairColor(), belt().color)}</div>
    <h2>${first >= 8 ? 'Wahnsinn' : first >= 5 ? 'Super' : 'Gut gemacht'}, ${esc(state.name)}!</h2>
    <p class="big">Alle ${DOJO_BOARDS} Bretter zerschlagen! 🥋</p>
    <div class="result-row"><span>Beim ersten Versuch</span><b>${first} / ${DOJO_BOARDS}</b></div>
    <div class="result-row"><span>Blitzschnell ⚡</span><b>${fast}</b></div>
    ${isBest ? '<p class="news">🏆 Neuer Rekord!</p>' : ''}
    <div class="btn-row">
      <button class="btn big" data-act="close">Fertig</button>
      <button class="btn primary big" data-act="dojo-again">Nochmal!</button>
    </div>`, { cls: 'celebrate' });
  if (stars) setTimeout(() => addStars(stars), 300);
  addXP(first);
}
export { dojoConfig };

export default {
  id: 'dojo',
  label: 'Dojo',
  render: renderDojo,
  leave() { dojo = null; },
  actions: {
    'dojo-start': () => { sfx.pop(); startDojo(); },
    'dojo-pick': (el) => dojoPick(el),
    'dojo-quit': () => { dojo = null; renderDojo(); },
    'dojo-again': () => { closeModal(); startDojo(); },
  },
};
