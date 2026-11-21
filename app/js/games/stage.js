// 🎤 Singbühne – Vokabeln auf Portugiesisch und Englisch
import { state, save } from '../state.js';
import * as art from '../art.js';
import { sfx, speak, voiceInfo, SONG } from '../audio.js';
import { CATEGORIES, LANGS } from '../vocab.js';
import { api, $, esc, pick, shuffle } from '../core.js';

const ROUND = 8;
let round = null;

function canListen(lang) {
  return state.speech && 'speechSynthesis' in window && voiceInfo(LANGS[lang].tts).text !== 'keine Stimme gefunden';
}

function render() {
  if (round) return renderRound();
  const lang = state.stageLang || 'pt';
  const langBtn = (id) => `<button class="chip lang ${lang === id ? 'on' : ''}" data-act="stage-lang" data-lang="${id}">${LANGS[id].flag} ${LANGS[id].de}</button>`;
  const learned = Object.values(state.vocab || {}).filter((v) => (v[lang] || 0) >= 2).length;
  $('#screen').innerHTML = `
    <div class="stage">
      <div class="curtain l"></div><div class="curtain r"></div><div class="valance"></div>
      <div class="spot"></div><div class="stage-floor"></div>
      <div class="stage-start">
        <div class="avatar-big">${art.avatar(api.hairColor(), '#fff', { outfit: 'tutu', mic: true })}</div>
        <div class="game-card">
          <h1>Singbühne</h1>
          <p>Hör gut zu und finde das richtige Bild! 🎵<br>Jede richtige Antwort ist ein Ton für dein Lied.</p>
          <div class="chips center">${langBtn('pt')}${langBtn('en')}</div>
          <div class="cat-grid">${Object.entries(CATEGORIES).map(([id, c]) => `
            <button class="cat-btn" data-act="stage-start" data-cat="${id}"><span class="cat-ico">${c.icon()}</span>${c.de}</button>`).join('')}
          </div>
          <p class="best">Schon gut gelernt: <b>${learned}</b> Wörter ${LANGS[lang].flag}</p>
        </div>
      </div>
    </div>`;
}

function start(cat) {
  const lang = state.stageLang || 'pt';
  const words = CATEGORIES[cat].words;
  let targets = shuffle(words);
  while (targets.length < ROUND) targets = targets.concat(shuffle(words));
  targets = targets.slice(0, ROUND);
  const listen = canListen(lang);
  round = {
    cat, lang, i: 0, first: 0, results: [],
    qs: targets.map((w) => {
      const r = Math.random();
      const type = listen ? (r < 0.5 ? 'listen' : r < 0.75 ? 'read' : 'picture') : (r < 0.5 ? 'read' : 'picture');
      const others = shuffle(words.filter((x) => x.id !== w.id)).slice(0, 3);
      return { w, type, options: shuffle([w, ...others]) };
    }),
  };
  sfx.pop();
  nextQ();
}

function nextQ() {
  if (!round) return;
  if (round.i >= ROUND) return finish();
  round.missed = false;
  round.lock = false;
  renderRound();
  const q = round.qs[round.i];
  if (q.type === 'listen') setTimeout(() => sayTarget(), 350);
}

function sayTarget() {
  const q = round?.qs[round.i];
  if (q) speak(q.w[round.lang], LANGS[round.lang].tts);
}

function renderRound() {
  const q = round.qs[round.i];
  const L = LANGS[round.lang];
  const notes = Array.from({ length: ROUND }, (_, k) => `<span class="note ${k < round.i ? (round.results[k] ? 'hit' : 'meh') : k === round.i ? 'now' : ''}">♪</span>`).join('');
  let prompt, options;
  if (q.type === 'listen') {
    prompt = `<button class="listen-btn" data-act="stage-say">${art.iconSpeaker()}</button><p class="prompt-text">Was hörst du? ${L.flag}</p>`;
  } else if (q.type === 'read') {
    prompt = `<div class="read-word">${L.flag} ${esc(q.w[round.lang])}</div><p class="prompt-text">Welches Bild passt?</p>`;
  } else {
    prompt = `<div class="prompt-pic">${q.w.art()}</div><p class="prompt-text">Wie heißt das auf ${L.de}?</p>`;
  }
  if (q.type === 'picture') {
    options = q.options.map((o) => `<button class="opt word-opt" data-act="stage-pick" data-id="${o.id}">${esc(o[round.lang])}</button>`).join('');
  } else {
    options = q.options.map((o) => `<button class="opt pic-opt" data-act="stage-pick" data-id="${o.id}">${o.art()}</button>`).join('');
  }
  $('#screen').innerHTML = `
    <div class="stage round">
      <div class="curtain l"></div><div class="curtain r"></div><div class="valance"></div>
      <div class="spot"></div><div class="stage-floor"></div>
      <div class="stage-round">
        <div class="notes">${notes}</div>
        <div class="stage-mid">
          <div class="singer" id="singer">${art.avatar(api.hairColor(), '#fff', { outfit: 'tutu', mic: true })}</div>
          <div class="prompt">${prompt}</div>
        </div>
        <div class="opts ${q.type === 'picture' ? 'words' : 'pics'}">${options}</div>
      </div>
      <button class="btn ghost quit" data-act="stage-quit">Aufhören</button>
    </div>`;
}

function onPick(btn) {
  if (!round || round.lock) return;
  const q = round.qs[round.i];
  if (btn.dataset.id === q.w.id) {
    round.lock = true;
    btn.classList.add('right');
    round.results[round.i] = !round.missed;
    if (!round.missed) round.first++;
    const v = (state.vocab[q.w.id] ||= {});
    if (!round.missed) v[round.lang] = (v[round.lang] || 0) + 1;
    sfx.note(SONG[round.i % SONG.length]);
    $('#singer')?.classList.add('sing');
    const fly = document.createElement('div');
    fly.className = 'fly-note';
    fly.textContent = pick(['♪', '♫', '♬']);
    $('#singer')?.appendChild(fly);
    if (q.type !== 'listen') setTimeout(() => speak(q.w[round.lang], LANGS[round.lang].tts), 250);
    round.i++;
    save();
    setTimeout(nextQ, 1300);
  } else {
    round.missed = true;
    btn.classList.add('wrong');
    btn.disabled = true;
    sfx.wrong();
    if (q.type === 'listen') setTimeout(sayTarget, 500);
  }
}

function finish() {
  const { first, lang, cat } = round;
  const song = SONG.slice(0, ROUND).filter((_, k) => round.results[k]);
  round = null;
  state.stats.words = (state.stats.words || 0) + first;
  save();
  render();
  api.confetti(first >= 6 ? 80 : 30);
  setTimeout(() => sfx.melody(song.length ? song : [523, 659, 784]), 300);
  api.openModal(`
    <div class="avatar-mid">${art.avatar(api.hairColor(), '#fff', { outfit: 'tutu', mic: true })}</div>
    <h2>Bravo, ${esc(state.name)}! 👏</h2>
    <p class="big">Dein Lied hat <b>${first}</b> von ${ROUND} Tönen.</p>
    <p>${LANGS[lang].flag} ${CATEGORIES[cat].de}</p>
    <div class="btn-row">
      <button class="btn big" data-act="close">Fertig</button>
      <button class="btn primary big" data-act="stage-again" data-cat="${cat}">Nochmal!</button>
    </div>`, { cls: 'celebrate' });
  speak(lang === 'pt' ? 'Muito bem!' : 'Well done!', LANGS[lang].tts);
  if (first) setTimeout(() => api.addStars(first), 400);
  api.addXP(first);
}

export default {
  id: 'stage',
  label: 'Bühne',
  icon: () => art.micIcon(),
  render,
  leave() { round = null; },
  actions: {
    'stage-lang': (el) => { state.stageLang = el.dataset.lang; save(); sfx.tick(); render(); speak(el.dataset.lang === 'pt' ? 'Olá!' : 'Hello!', LANGS[el.dataset.lang].tts); },
    'stage-start': (el) => start(el.dataset.cat),
    'stage-again': (el) => { api.closeModal(); start(el.dataset.cat); },
    'stage-say': () => sayTarget(),
    'stage-pick': (el) => onPick(el),
    'stage-quit': () => { round = null; render(); },
  },
};
