// Gemeinsame Oberfläche: Kopfzeile, Fenster, Effekte, Sterne & Gürtel, Zahlen-Aufgabe
import { state, save } from './state.js';
import { PLANTS, ANIMALS, BELTS, beltIndex, HAIR, PRAISE } from './data.js';
import * as art from './art.js';
import { sfx, speak } from './audio.js';
import { api, $, esc, pick } from './core.js';

export { $, esc, pick };
export const hairColor = () => (HAIR[state.hair] || HAIR.brown).color;
export const belt = () => BELTS[beltIndex(state.xp)];
const pending = []; // Feiern, die nach dem aktuellen Fenster kommen

export function renderTop() {
  const bi = beltIndex(state.xp);
  const b = BELTS[bi], next = BELTS[bi + 1];
  const pct = next ? Math.round(((state.xp - b.xp) / (next.xp - b.xp)) * 100) : 100;
  const onMap = !api.screen || api.screen() === 'map';
  $('#topbar').innerHTML = `
    <div class="who">
      ${onMap ? '' : `<button class="map-btn" data-act="goto" data-to="map" aria-label="Zur Karte"><span class="map-ico">${art.mapIcon()}</span>Karte</button>`}
      <div class="mini-avatar">${art.avatarHead(hairColor())}</div>
      <div class="who-text">
        <div class="name">${esc(state.name)}</div>
        <div class="belt-chip"><span class="belt-ico">${art.beltIcon(b.color)}</span>${b.de}</div>
        <div class="xpbar" title="Bis zum nächsten Gürtel"><i style="width:${pct}%"></i></div>
      </div>
    </div>
    <div class="top-right">
      <div class="stars-pill" id="stars"><span class="star-ico">${art.star()}</span><b>${state.stars}</b></div>
      <button class="icon-btn" data-act="sound" aria-label="Ton">${state.sound ? art.iconSound() : art.iconMute()}</button>
      <button class="icon-btn small" data-act="parents" aria-label="Eltern">${art.iconLock()}</button>
    </div>`;
}

// ============ Modals, Effekte ============
export function openModal(html, { cls = '', closable = true } = {}) {
  const layer = $('#modal-layer');
  layer.hidden = false;
  layer.innerHTML = `<div class="modal-backdrop"></div><div class="modal ${cls}" role="dialog">${closable ? '<button class="modal-x" data-act="close" aria-label="Schließen">✕</button>' : ''}${html}</div>`;
  return $('.modal', layer);
}
export function closeModal() {
  const layer = $('#modal-layer');
  layer.hidden = true;
  layer.innerHTML = '';
  if (pending.length) setTimeout(() => pending.shift()(), 250);
}
export const modalOpen = () => !$('#modal-layer').hidden;

export function toast(text) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = text;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2800);
}

export function floatText(html, x = innerWidth / 2, y = innerHeight / 2) {
  const f = document.createElement('div');
  f.className = 'float';
  f.innerHTML = html;
  f.style.left = x + 'px';
  f.style.top = y + 'px';
  $('#fx-layer').appendChild(f);
  setTimeout(() => f.remove(), 1300);
}

export function confetti(n = 70) {
  const colors = ['#ff7eb6', '#9b7bff', '#ffd23b', '#62cc5c', '#4fb3ff', '#ff9a2e'];
  for (let i = 0; i < n; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.background = pick(colors);
    c.style.animationDuration = 1.8 + Math.random() * 1.6 + 's';
    c.style.animationDelay = Math.random() * 0.5 + 's';
    c.style.setProperty('--rot', Math.random() * 720 - 360 + 'deg');
    c.style.setProperty('--dx', Math.random() * 120 - 60 + 'px');
    $('#fx-layer').appendChild(c);
    setTimeout(() => c.remove(), 4200);
  }
}

export function bumpStars() {
  renderTop();
  const s = $('#stars');
  if (s) { s.classList.remove('bump'); void s.offsetWidth; s.classList.add('bump'); }
}

export function addStars(n, at) {
  if (n <= 0) return;
  state.stars += n;
  save();
  sfx.coin();
  const s = $('#stars')?.getBoundingClientRect();
  floatText(`+${n} <span class="fi">${art.star()}</span>`, at?.x ?? (s ? s.left + s.width / 2 : innerWidth / 2), at?.y ?? (s ? s.bottom + 30 : 100));
  bumpStars();
}

export function addXP(n) {
  if (n <= 0) return;
  const before = beltIndex(state.xp);
  state.xp += n;
  save();
  const after = beltIndex(state.xp);
  if (after > before) {
    const show = () => beltUp(after);
    if (modalOpen()) pending.push(show); else setTimeout(show, 400);
  }
  renderTop();
}

export function beltUp(idx) {
  const b = BELTS[idx];
  const news = [
    ...Object.values(PLANTS).filter((p) => p.belt === idx).map((p) => p.name),
    ...Object.values(ANIMALS).filter((a) => a.belt === idx).map((a) => a.name),
  ];
  confetti(100);
  sfx.fanfare();
  openModal(`
    <div class="belt-up">
      <div class="avatar-big">${art.avatar(hairColor(), b.color)}</div>
      <h2>Hurra, ${esc(state.name)}!</h2>
      <p class="big">Du hast jetzt <b>${b.dn.replace('der ', 'den ').replace('e Gürtel', 'en Gürtel')}</b>!</p>
      ${wordRows({ pt: b.pt, en: b.en, de: b.dn })}
      ${news.length ? `<p class="news">Neu im Laden: <b>${news.join(', ')}</b></p>` : ''}
      <button class="btn primary big" data-act="close">Juhu!</button>
    </div>`, { cls: 'celebrate' });
  setTimeout(() => speak(b.pt, 'pt-PT'), 1600);
}

export function wordRows(item) {
  const row = (flag, lang, text, cls = '') => `<button class="word ${cls}" data-act="say" data-lang="${lang}" data-text="${esc(text)}"><span class="flag">${flag}</span><span class="w">${esc(text)}</span><span class="spk">${art.iconSpeaker()}</span></button>`;
  return `<div class="words">${row('🇵🇹', 'pt-PT', item.pt, 'pt')}${row('🇬🇧', 'en-GB', item.en)}${row('🇩🇪', 'de-DE', item.de)}</div>`;
}

// ============ Zahlen-Aufgabe mit Ziffernblock ============
export function numberTask({ title, icon, task, onFinish }) {
  let input = '', tries = 0, locked = false;
  const q = esc(task.text).replace('?', '<span class="answer-box" id="ans">&nbsp;</span>');
  const m = openModal(`
    <div class="task-head"><div class="task-ico">${icon}</div><h2>${title}</h2></div>
    <div class="task-q">${q}</div>
    <div class="task-fb" id="fb">&nbsp;</div>
    <div class="numpad">
      ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button data-n="${n}">${n}</button>`).join('')}
      <button data-n="del" class="del">⌫</button><button data-n="0">0</button><button data-n="ok" class="ok">✓</button>
    </div>`, { cls: 'task-modal' });
  const ans = $('#ans', m), fb = $('#fb', m);
  const show = () => { ans.textContent = input || ' '; };

  $('.numpad', m).addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b || locked) return;
    const n = b.dataset.n;
    if (n === 'ok') { if (input) check(); return; }
    sfx.tick();
    if (n === 'del') input = input.slice(0, -1);
    else if (input.length < 3) input += n;
    show();
  });

  function check() {
    tries++;
    if (Number(input) === task.answer) {
      locked = true;
      ans.classList.add('right');
      const p = pick(PRAISE);
      fb.innerHTML = `<span class="good">${p}</span>`;
      sfx.correct();
      speak(p, 'de-DE');
      setTimeout(() => { closeModal(); onFinish({ correct: true, tries }); }, 950);
      return;
    }
    sfx.wrong();
    state.stats.wrong++;
    ans.classList.add('wrong');
    input = '';
    if (tries >= 3) {
      locked = true;
      fb.innerHTML = `Die Lösung ist <b>${task.answer}</b>. Beim nächsten Mal klappt's! 💪`;
      setTimeout(() => { ans.classList.remove('wrong'); ans.textContent = task.answer; }, 450);
      setTimeout(() => { closeModal(); onFinish({ correct: false, tries }); }, 2600);
      return;
    }
    fb.innerHTML = tries === 1 ? 'Fast! Probier es nochmal. 🙂' : `<span class="hint">💡 ${esc(task.hint)}</span>`;
    setTimeout(() => { ans.classList.remove('wrong'); show(); }, 450);
  }
}
