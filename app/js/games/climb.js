// 🧗 Kletterwand – Deutsch: Wortarten, Rechtschreibung, Silben, Reime
import { state, save } from '../state.js';
import * as art from '../art.js';
import { sfx, speak } from '../audio.js';
import { NOUNS, VERBS, ADJECTIVES, SPELLING, SYLLABLE_WORDS, RHYMES } from '../words.js';
import { api, $, esc, pick, shuffle } from '../core.js';

const HOLDS = 8;
const HOLD_COLORS = ['#ff7eb6', '#ffd23b', '#62cc5c', '#4fb3ff', '#9b7bff', '#ff9a2e', '#ff5a7a', '#3fb8a8'];
// Positionen der Griffe (x in %, y in % von unten)
const POS = Array.from({ length: HOLDS }, (_, i) => ({ x: i % 2 ? 64 : 34, y: 6 + i * 10.6 }));

let round = null;

function makeQ() {
  const t = pick(['wortart', 'wortart', 'spelling', 'spelling', 'syllables', 'rhyme', 'case']);
  if (t === 'wortart') {
    const kind = pick(['n', 'v', 'a']);
    const word = pick(kind === 'n' ? NOUNS : kind === 'v' ? VERBS : ADJECTIVES);
    return {
      type: t, title: 'Was für ein Wort ist das?', word,
      options: [
        { key: 'n', label: 'Nomen', sub: 'Namenwort' },
        { key: 'v', label: 'Verb', sub: 'Tuwort' },
        { key: 'a', label: 'Adjektiv', sub: 'Wiewort' },
      ],
      answer: kind,
      hint: 'Nomen: man kann der/die/das davor sagen. Verb: das kann man tun. Adjektiv: so ist etwas.',
    };
  }
  if (t === 'spelling') {
    const [right, ...wrong] = pick(SPELLING);
    return {
      type: t, title: 'Welches Wort ist richtig geschrieben?', word: null,
      options: shuffle([right, ...wrong]).map((w) => ({ key: w, label: w })), answer: right, say: right,
      hint: 'Sprich das Wort ganz langsam und deutlich.',
    };
  }
  if (t === 'syllables') {
    const [w, n] = pick(SYLLABLE_WORDS);
    const max = Math.max(4, n);
    return {
      type: t, title: 'Wie viele Silben hat das Wort?', word: w.replace(/-/g, ''), split: w,
      options: Array.from({ length: max }, (_, k) => ({ key: String(k + 1), label: '👏'.repeat(k + 1), sub: String(k + 1) })),
      answer: String(n), hint: 'Klatsch das Wort langsam mit: bei jedem Klatscher eine Silbe.',
    };
  }
  if (t === 'rhyme') {
    const [w, r, wrong] = pick(RHYMES);
    return {
      type: t, title: `Was reimt sich auf »${w}«?`, word: null, say: w,
      options: shuffle([r, ...wrong]).map((x) => ({ key: x, label: x })), answer: r,
      hint: 'Hör genau auf das Ende vom Wort.',
    };
  }
  // Groß oder klein
  const kind = pick(['n', 'n', 'v', 'a']);
  const word = pick(kind === 'n' ? NOUNS : kind === 'v' ? VERBS : ADJECTIVES);
  const lower = word.charAt(0).toLowerCase() + word.slice(1);
  const upper = word.charAt(0).toUpperCase() + word.slice(1);
  return {
    type: 'case', title: 'Groß oder klein? Was ist richtig?', word: null, say: word,
    options: shuffle([upper, lower]).map((x) => ({ key: x, label: x })), answer: word,
    hint: 'Nomen schreibt man groß. Alle anderen Wörter klein.',
  };
}

function render() {
  if (round) return renderRound();
  $('#screen').innerHTML = `
    <div class="climb">
      <div class="climb-wall">${wallDecor()}</div>
      <div class="climb-floor"></div>
      <div class="stage-start">
        <div class="avatar-big">${art.avatar(api.hairColor(), '#fff', { outfit: 'casual' })}</div>
        <div class="game-card">
          <h1>Kletterwand</h1>
          <p>Klettere bis zur Glocke! 🔔<br>Jeder Griff ist eine <b>Deutsch-Aufgabe</b>: Wortarten, Rechtschreibung, Silben und Reime.</p>
          <button class="btn primary big" data-act="climb-start">Los geht's!</button>
          ${state.climbTops ? `<p class="best">Schon ${state.climbTops}× oben angekommen</p>` : ''}
        </div>
      </div>
    </div>`;
}

function wallDecor() {
  let s = '';
  for (let i = 0; i < 26; i++) {
    s += `<span class="deco-hold" style="left:${(i * 37) % 97}%;top:${(i * 53) % 93}%;background:${HOLD_COLORS[i % HOLD_COLORS.length]}"></span>`;
  }
  return s;
}

function start() {
  round = { i: 0, first: 0, q: makeQ(), tries: 0, lock: false };
  sfx.pop();
  renderRound();
}

function climberPos() {
  if (round.i >= HOLDS) return { x: 50, y: 88 };
  const p = POS[round.i];
  return { x: p.x, y: p.y };
}

function renderRound() {
  const q = round.q;
  const pos = climberPos();
  const holds = POS.map((p, k) => `<span class="hold ${k < round.i ? 'done' : k === round.i ? 'now' : ''}" style="left:${p.x}%;bottom:${p.y}%">${art.hold(HOLD_COLORS[k], k)}</span>`).join('');
  const wordHTML = q.word ? `<div class="big-word">${esc(q.word)} <button class="say-btn" data-act="climb-say">${art.iconSpeaker()}</button></div>` : (q.say ? `<button class="say-btn solo" data-act="climb-say">${art.iconSpeaker()}</button>` : '');
  $('#screen').innerHTML = `
    <div class="climb round">
      <div class="climb-floor"></div>
      <div class="climb-round">
        <div class="route">
          <div class="climb-wall">${wallDecor()}</div>
          <div class="bell" id="bell">${art.bell()}</div>
          ${holds}
          <div class="climber" id="climber" style="left:${pos.x}%;bottom:${pos.y}%">${art.avatar(api.hairColor(), '#fff', { outfit: 'casual' })}</div>
        </div>
        <div class="climb-q">
          <div class="q-card">
            <p class="q-title">${esc(q.title)}</p>
            ${wordHTML}
            <div class="task-fb" id="lfb">&nbsp;</div>
            <div class="climb-opts ${q.type}">${q.options.map((o) => `<button class="copt" data-act="climb-pick" data-k="${esc(o.key)}">${esc(o.label)}${o.sub ? `<small>${esc(o.sub)}</small>` : ''}</button>`).join('')}</div>
          </div>
          <div class="progress-text">Griff ${Math.min(round.i + 1, HOLDS)} von ${HOLDS}</div>
        </div>
      </div>
      <button class="btn ghost quit" data-act="climb-quit">Aufhören</button>
    </div>`;
}

function onPick(btn) {
  if (!round || round.lock) return;
  const q = round.q;
  if (btn.dataset.k === q.answer) {
    round.lock = true;
    btn.classList.add('right');
    sfx.correct();
    if (q.type === 'syllables') $('#lfb').innerHTML = `<span class="good">${esc(q.split)}</span>`;
    else $('#lfb').innerHTML = `<span class="good">${pick(['Super!', 'Richtig!', 'Klasse!', 'Spitze!'])}</span>`;
    if (round.tries === 0) round.first++;
    round.i++;
    const pos = climberPos();
    const c = $('#climber');
    c.style.left = pos.x + '%';
    c.style.bottom = pos.y + '%';
    c.classList.add('up');
    setTimeout(() => {
      if (round.i >= HOLDS) return top();
      round.q = makeQ(); round.tries = 0; round.lock = false;
      renderRound();
    }, 1100);
  } else {
    round.tries++;
    btn.classList.add('wrong');
    btn.disabled = true;
    sfx.slip();
    const c = $('#climber');
    c.classList.remove('slip'); void c.offsetWidth; c.classList.add('slip');
    $('#lfb').innerHTML = round.tries === 1 ? 'Huch, gerutscht! Versuch es nochmal. 🙂' : `<span class="hint">💡 ${esc(q.hint)}</span>`;
  }
}

function top() {
  const { first } = round;
  $('#bell')?.classList.add('ring');
  sfx.bell();
  state.climbTops = (state.climbTops || 0) + 1;
  api.quest('climb');
  state.stats.correct += first;
  save();
  setTimeout(() => {
    round = null;
    render();
    api.confetti(70);
    api.openModal(`
      <div class="big-ico">${art.bell()}</div>
      <h2>Ganz oben, ${esc(state.name)}! 🧗‍♀️</h2>
      <p class="big"><b>${first}</b> von ${HOLDS} Griffen beim ersten Versuch.</p>
      <div class="btn-row">
        <button class="btn big" data-act="close">Fertig</button>
        <button class="btn primary big" data-act="climb-again">Nochmal klettern!</button>
      </div>`, { cls: 'celebrate' });
    setTimeout(() => api.addStars(first + 2), 400);
    api.addXP(first);
  }, 1400);
}

export default {
  id: 'climb',
  label: 'Klettern',
  icon: () => art.climbIcon(),
  render,
  leave() { round = null; },
  actions: {
    'climb-start': () => start(),
    'climb-again': () => { api.closeModal(); start(); },
    'climb-pick': (el) => onPick(el),
    'climb-say': () => { const q = round?.q; if (q) speak(q.say || q.word, 'de-DE'); },
    'climb-quit': () => { round = null; render(); },
  },
};
