// Gemeinsamer Ablauf für Frage-Runden (Wald, Weltreise): Bild, Frage (wird vorgelesen), Antworten, Tipp
import { state, save } from '../state.js';
import { sfx, speak } from '../audio.js';
import { $, esc, shuffle } from '../core.js';

// opts: { cls, tasks, bg, top(), onRight(task, firstTry, btn) -> Promise|void, onDone(result) }
export function runQuiz(opts) {
  const q = { ...opts, i: 0, first: 0, tries: 0, lock: false };
  q.options = (t) => shuffle([t.a, ...t.w]);
  show(q);
  return {
    pick: (el) => pick(q, el),
    say: () => speak(q.tasks[q.i].q, 'de-DE'),
    stop: () => { q.stopped = true; },
  };
}

function show(q) {
  if (q.stopped) return;
  const t = q.tasks[q.i];
  q.tries = 0;
  q.lock = false;
  const dots = q.tasks.map((_, k) => `<span class="cdot ${k < q.i ? 'done' : k === q.i ? 'now' : ''}"></span>`).join('');
  $('#screen').innerHTML = `
    <div class="${q.cls} round">
      ${q.bg}
      ${q.top()}
      <div class="quiz-round">
        <div class="cdots">${dots}</div>
        <div class="quiz-card">
          <div class="quiz-ico">${t.icoHTML || `<span>${t.ico}</span>`}</div>
          <div class="quiz-q">${esc(t.q)} <button class="say-btn" data-act="quiz-say" aria-label="Vorlesen">🔊</button></div>
          <div class="task-fb" id="qfb">&nbsp;</div>
          <div class="quiz-opts">${q.options(t).map((o) => `<button class="qopt" data-act="quiz-pick" data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div>
        </div>
      </div>
      <button class="btn ghost quit" data-act="quiz-quit">Aufhören</button>
    </div>`;
  setTimeout(() => { if (!q.stopped && q.tasks[q.i] === t) speak(t.q, 'de-DE'); }, 300);
}

async function pick(q, el) {
  if (q.lock || q.stopped) return;
  const t = q.tasks[q.i];
  if (el.dataset.v === t.a) {
    q.lock = true;
    el.classList.add('right');
    sfx.correct();
    const firstTry = q.tries === 0;
    if (firstTry) q.first++;
    state.stats.correct += firstTry ? 1 : 0;
    save();
    await q.onRight?.(t, firstTry, el);
    if (q.stopped) return;
    setTimeout(() => {
      if (q.stopped) return;
      q.i++;
      if (q.i >= q.tasks.length) q.onDone({ first: q.first, total: q.tasks.length });
      else show(q);
    }, 1200);
  } else {
    q.tries++;
    state.stats.wrong++;
    el.classList.add('wrong');
    el.disabled = true;
    sfx.wrong();
    $('#qfb').innerHTML = `<span class="hint">💡 ${esc(t.tip || 'Lies die Frage nochmal genau.')}</span>`;
  }
}
