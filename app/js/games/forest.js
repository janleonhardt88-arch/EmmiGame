// 🌲 Wald – Sachkunde-Fragen beantworten, Holz sammeln, Naturschätze finden
import { state, save } from '../state.js';
import * as art from '../art.js';
import { sfx, speak } from '../audio.js';
import { NATURE_QUESTIONS, FINDS } from '../sachkunde.js';
import { api, $, esc, pick } from '../core.js';
import { runQuiz } from './quiz.js';

const ROUND = 8;
let quiz = null;
let gotWood = 0;
let gotFinds = [];

const bg = `<div class="forest-bg">${Array.from({ length: 9 }, (_, i) => `<span class="ftree t${i}"></span>`).join('')}</div>`;
const top = () => `<div class="wood-bar"><span>🪵 <b id="wood-n">${state.wood}</b> Holz</span></div>`;

function render() {
  if (quiz) return;
  const finds = Object.entries(FINDS);
  $('#screen').innerHTML = `
    <div class="forest">
      ${bg}
      ${top()}
      <div class="stage-start">
        <div class="avatar-big">${art.avatar(api.hairColor(), '#fff', { outfit: 'casual' })}</div>
        <div class="game-card">
          <h1>Im Wald</h1>
          <p>Beantworte Fragen über Tiere, Pflanzen und die Natur.<br>Für jede richtige Antwort bekommst du <b>Holz</b> 🪵 – damit baust du dein Häuschen!</p>
          <button class="btn primary big" data-act="forest-start">Los geht's! 🌲</button>
          <div class="finds">
            <div class="jb-head">Meine Naturschätze</div>
            <div class="finds-grid">${finds.map(([k, f]) => { const n = state.finds[k] || 0; return `<button class="find ${n ? '' : 'missing'}" ${n ? `data-act="say" data-lang="pt-PT" data-text="${esc(f.pt)}"` : ''} title="${esc(f.de)}"><span>${f.ico}</span>${n ? `<small>${n}×</small>` : ''}</button>`; }).join('')}</div>
          </div>
          <button class="btn" data-act="goto" data-to="house">Zum Häuschen 🏡</button>
        </div>
      </div>
    </div>`;
}

// Fragen, die noch nicht gut sitzen, kommen bevorzugt dran
function pickTasks() {
  const seen = state.natureSeen || (state.natureSeen = {});
  const score = (t) => (seen[t.q] || 0) + Math.random() * 2;
  return [...NATURE_QUESTIONS].sort((a, b) => score(a) - score(b)).slice(0, ROUND);
}

function start() {
  gotWood = 0;
  gotFinds = [];
  sfx.pop();
  quiz = runQuiz({
    cls: 'forest',
    bg,
    top,
    tasks: pickTasks(),
    onRight: (t, firstTry, btn) => {
      const seen = state.natureSeen;
      seen[t.q] = (seen[t.q] || 0) + (firstTry ? 1 : -1);
      const n = firstTry ? 2 : 1;
      state.wood += n;
      gotWood += n;
      const r = btn.getBoundingClientRect();
      floatWood(`+${n} 🪵`, r.left + r.width / 2, r.top);
      const wn = $('#wood-n'); if (wn) wn.textContent = state.wood;
      sfx.chop();
      save();
      // Ganz selten raschelt etwas am Wegesrand – höchstens einmal pro Spaziergang
      if (!gotFinds.length && Math.random() < 0.12) return discover();
      save();
    },
    onDone: finish,
  });
}

// „Oh, was ist denn das?" – ein Fund, den Emmi selbst aufdecken darf
function discover() {
  const [k, f] = pick(Object.entries(FINDS));
  state.finds[k] = (state.finds[k] || 0) + 1;
  gotFinds.push(k);
  save();
  return new Promise((done) => {
    setTimeout(() => {
      const host = $('#screen .forest');
      if (!host || !quiz) return done();
      const box = document.createElement('div');
      box.className = 'discover';
      box.innerHTML = `<button class="disc-card" data-disc="1">
          <span class="disc-bush">🌿</span>
          <b>Oh, was ist denn das? 👀</b>
          <small>Tipp aufs Gebüsch!</small>
        </button>`;
      host.appendChild(box);
      sfx.pop();
      speak('Oh, was ist denn das?', 'de-DE');
      box.addEventListener('click', (e) => {
        if (e.target.closest('[data-disc]')) {
          sfx.coin();
          api.confetti(25);
          box.innerHTML = `<div class="disc-card open">
              <span class="disc-find">${f.ico}</span>
              <b>Du hast ${esc(f.de.replace(/^der /, 'einen ').replace(/^die /, 'eine ').replace(/^das /, 'ein '))} gefunden!</b>
              <button class="word pt" data-act="say" data-lang="pt-PT" data-text="${esc(f.pt)}"><span class="flag">🇵🇹</span><span class="w">${esc(f.pt)}</span></button>
              <small>Das kommt zu deinen Naturschätzen.</small>
              <button class="btn primary" data-disc-go="1">Weiter 🌲</button>
            </div>`;
          speak(f.pt, 'pt-PT');
        } else if (e.target.closest('[data-disc-go]')) {
          box.remove();
          done();
        }
      });
    }, 900);
  });
}

function floatWood(text, x, y) {
  const f = document.createElement('div');
  f.className = 'float';
  f.textContent = text;
  f.style.left = x + 'px';
  f.style.top = y + 'px';
  $('#fx-layer').appendChild(f);
  setTimeout(() => f.remove(), 1300);
}

function finish({ first, total }) {
  quiz = null;
  api.quest('forest');
  save();
  render();
  api.confetti(first >= 6 ? 70 : 30);
  sfx.fanfare();
  const finds = gotFinds.map((k) => FINDS[k].ico).join(' ');
  api.openModal(`
    <div class="big-ico">${art.emoji('🌲')}</div>
    <h2>Toller Waldspaziergang, ${esc(state.name)}!</h2>
    <p class="big"><b>${first}</b> von ${total} beim ersten Versuch.</p>
    <div class="result-row"><span>Gesammeltes Holz</span><b>+${gotWood} 🪵</b></div>
    ${finds ? `<div class="result-row"><span>Gefunden</span><b>${finds}</b></div>` : ''}
    <div class="btn-row">
      <button class="btn big" data-act="goto" data-to="house">Zum Häuschen 🏡</button>
      <button class="btn primary big" data-act="forest-again">Nochmal!</button>
    </div>`, { cls: 'celebrate' });
  setTimeout(() => api.addStars(first + 1), 400);
  api.addXP(first);
}

export default {
  id: 'forest',
  label: 'Wald',
  render,
  leave() { quiz?.stop(); quiz = null; },
  actions: {
    'forest-start': () => start(),
    'forest-again': () => { api.closeModal(); start(); },
  },
  // Antworten und Vorlesen laufen über den gemeinsamen Frage-Ablauf
  quiz: () => quiz,
  quit: () => { quiz?.stop(); quiz = null; render(); },
};

