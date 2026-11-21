// ⏰ Spielzeit pro Tag mitzählen und – wenn Eltern es einstellen – freundlich begrenzen
import { state, save } from './state.js';
import * as art from './art.js';
import { parentGate } from './math.js';
import { today } from './daily.js';
import { $, openModal, closeModal, modalOpen } from './ui.js';

const TICK = 10; // Sekunden
let shown = false;

export function playedMinutes() {
  return state.play && state.play.date === today() ? Math.floor(state.play.sec / 60) : 0;
}

function tick() {
  if (document.visibilityState !== 'visible') return;
  if (!state.play || state.play.date !== today()) { state.play = { date: today(), sec: 0, extra: 0 }; shown = false; }
  state.play.sec += TICK;
  save();
  const limit = state.limitMin ? (state.limitMin + (state.play.extra || 0)) * 60 : 0;
  // Nicht mitten in eine Aufgabe platzen: nur zeigen, wenn gerade kein Fenster offen ist
  if (limit && state.play.sec >= limit && !shown && !modalOpen()) showPause();
}

function showPause() {
  shown = true;
  const gate = parentGate();
  let input = '';
  const m = openModal(`
    <div class="big-ico">${art.thing('moon')}</div>
    <h2>Für heute ist Schluss! 🌙</h2>
    <p class="big">Die Tiere gehen jetzt schlafen.<br>Morgen geht es weiter, ${state.name}!</p>
    <details class="pause-parents">
      <summary>Für Eltern: 10 Minuten verlängern</summary>
      <p>Bitte rechne: <b>${gate.text.replace(' = ?', '')}</b></p>
      <div class="task-q small"><span class="answer-box" id="pans">&nbsp;</span></div>
      <div class="numpad small">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button data-n="${n}">${n}</button>`).join('')}<button data-n="del" class="del">⌫</button><button data-n="0">0</button><button data-n="ok" class="ok">✓</button></div>
    </details>`, { closable: false, cls: 'pause-modal' });
  $('.numpad', m).addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const n = b.dataset.n;
    if (n === 'ok') {
      if (Number(input) === gate.answer) {
        state.play.extra = (state.play.extra || 0) + 10;
        save();
        shown = false;
        closeModal();
      } else { input = ''; $('#pans', m).textContent = ' '; }
      return;
    }
    if (n === 'del') input = input.slice(0, -1); else if (input.length < 3) input += n;
    $('#pans', m).textContent = input || ' ';
  });
}

export function startPlayTimer() {
  setInterval(tick, TICK * 1000);
}
