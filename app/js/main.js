// Emmis Tierwelt – Start, Weltkarte und Navigation zwischen den Orten
import { state, save } from './state.js';
import { HAIR } from './data.js';
import * as art from './art.js';
import { sfx, speak, setAudioPrefs, initVoices } from './audio.js';
import { api, $, esc } from './core.js';
import * as ui from './ui.js';
import { dailyPill, dailyActions, quest, questPlaces } from './daily.js';
import { PLANTS } from './data.js';
import garden from './games/garden.js';
import dojo from './games/dojo.js';
import ballet from './games/ballet.js';
import stage from './games/stage.js';
import craft from './games/craft.js';
import climb from './games/climb.js';
import shop from './games/shop.js';
import forest from './games/forest.js';
import house, { HOUSE_STAGES } from './games/house.js';
import globe from './games/globe.js';
import { parentsGate } from './parents.js';
import { initClips } from './recorder.js';
import { startPlayTimer } from './playtime.js';
import { music } from './music.js';
import { openWardrobe, wardrobeActions } from './wardrobe.js';
import { initUpdates } from './update.js';

// Orte auf der Karte: Position [x, y] in Prozent für Quer- und Hochformat
const PLACES = [
  { mod: dojo, label: 'Karate-Dojo', pos: [12, 24], ppos: [18, 15] },
  { mod: ballet, label: 'Ballettstudio', pos: [37, 21], ppos: [50, 15] },
  { mod: stage, label: 'Singbühne', pos: [63, 21], ppos: [82, 15] },
  { mod: climb, label: 'Kletterwand', pos: [88, 24], ppos: [18, 38] },
  { mod: craft, label: 'Bastelstube', pos: [12, 54], ppos: [50, 38] },
  { mod: forest, label: 'Wald', pos: [37, 52], ppos: [82, 38] },
  { mod: globe, label: 'Weltreise', pos: [63, 52], ppos: [18, 61] },
  { mod: house, label: 'Häuschen', pos: [88, 54], ppos: [50, 61] },
  { mod: garden, label: 'Garten', pos: [30, 83], ppos: [82, 61] },
  { mod: shop, label: 'Hofladen', pos: [70, 83], ppos: [35, 85] },
];
const BY_ID = Object.fromEntries(PLACES.map((p) => [p.mod.id, p.mod]));

let screen = 'map';

setAudioPrefs({ sound: state.sound, speech: state.speech });
music.setEnabled(state.music);

function go(to) {
  if (screen !== to) BY_ID[screen]?.leave?.();
  screen = BY_ID[to] ? to : 'map';
  render();
}

function render() {
  document.body.dataset.screen = screen;
  music.setPlace(screen);
  ui.renderTop();
  if (screen === 'map') renderMap(); else BY_ID[screen].render();
}

// ============ Weltkarte ============
function badgeFor(id, open) {
  if (id === 'garden') {
    const beds = state.beds.filter((b) => b.plant);
    if (beds.some((b) => b.water >= PLANTS[b.plant].water)) return '🧺';
    if (beds.length) return '💧';
  }
  if (id === 'shop' && Object.values(state.basket).some((n) => n > 0)) return '🛎️';
  if (id === 'house') {
    const next = HOUSE_STAGES[state.house?.stage || 0];
    if (next && state.wood >= next.wood && state.stars >= next.stars) return '🔨';
  }
  return open.has(id) ? '⭐' : '';
}

function renderMap() {
  const open = questPlaces();
  $('#screen').innerHTML = `
    <div class="map">
      <div class="map-sky">
        <div class="sun">${art.sun()}</div>
        <div class="cloud c1"></div><div class="cloud c2"></div><div class="cloud c3"></div>
      </div>
      <div class="map-hills">${art.hills()}</div>
      <div class="map-path">${art.mapPath()}</div>
      <div class="map-deco t1">${art.thing('tree')}</div><div class="map-deco t2">${art.thing('tree')}</div>
      <div class="map-deco f1">${art.thing('flower')}</div><div class="map-deco f2">${art.thing('flower')}</div>
      ${dailyPill()}
      ${PLACES.map((p) => {
        const badge = badgeFor(p.mod.id, open);
        return `<button class="place" data-act="goto" data-to="${p.mod.id}" style="--x:${p.pos[0]};--y:${p.pos[1]};--px:${p.ppos[0]};--py:${p.ppos[1]}">
          ${badge ? `<span class="place-badge">${badge}</span>` : ''}
          <span class="place-art">${art.place(p.mod.id, state.house?.stage || 0)}</span>
          <span class="place-sign">${p.label}</span>
        </button>`;
      }).join('')}
      <button class="map-emmi" data-act="emmi-hi">
        <span class="bubble" id="emmi-bubble"></span>
        ${art.avatar(ui.hairColor(), ui.belt().color, { outfit: 'casual' })}
      </button>
    </div>`;
}

const GREETINGS = [['🇵🇹', 'Olá!', 'pt-PT'], ['🇬🇧', 'Hello!', 'en-GB'], ['🇵🇹', 'Bom dia!', 'pt-PT'], ['🇬🇧', 'Good morning!', 'en-GB'], ['🇵🇹', 'Como estás?', 'pt-PT'], ['🇬🇧', 'How are you?', 'en-GB']];
let greetI = 0;
function emmiHi(el) {
  const [flag, text, lang] = GREETINGS[greetI++ % GREETINGS.length];
  const b = $('#emmi-bubble');
  b.textContent = `${flag} ${text}`;
  b.classList.add('show');
  clearTimeout(b._t);
  b._t = setTimeout(() => b.classList.remove('show'), 2400);
  el.classList.remove('hop'); void el.offsetWidth; el.classList.add('hop');
  sfx.hop();
  speak(text, lang);
}

// ============ Begrüßung beim ersten Start ============
function welcome() {
  const m = ui.openModal(`
    <div class="avatar-mid" id="w-avatar">${art.avatar(ui.hairColor(), '#ffffff', { outfit: 'casual' })}</div>
    <h2>Willkommen in deiner Welt! 🌻</h2>
    <p>Wie heißt du?</p>
    <input id="w-name" class="big-input" value="${esc(state.name)}" maxlength="14" autocomplete="off">
    <p>Welche Haarfarbe hast du?</p>
    <div class="chips center" id="w-hair">${Object.entries(HAIR).filter(([, h]) => !h.price).map(([k, h]) => `<button class="chip ${state.hair === k ? 'on' : ''}" data-hair="${k}"><i style="background:${h.color}"></i>${h.de}</button>`).join('')}</div>
    <button class="btn primary big" id="w-go" style="margin-top:16px">Los geht's!</button>`, { closable: false });
  $('#w-hair', m).addEventListener('click', (e) => {
    const b = e.target.closest('[data-hair]'); if (!b) return;
    state.hair = b.dataset.hair;
    m.querySelectorAll('[data-hair]').forEach((x) => x.classList.toggle('on', x === b));
    $('#w-avatar', m).innerHTML = art.avatar(ui.hairColor(), '#ffffff', { outfit: 'casual' });
    sfx.tick();
  });
  $('#w-go', m).addEventListener('click', () => {
    state.name = $('#w-name', m).value.trim() || 'Emmi';
    state.welcomed = true;
    save();
    ui.closeModal();
    render();
    ui.confetti(50);
    sfx.fanfare();
    setTimeout(() => ui.toast(`Hallo ${state.name}! Tippe auf einen Ort, um loszulegen. 👆`), 500);
  });
}

// ============ Ereignisse ============
const actions = {
  goto: (el) => { if (ui.modalOpen()) ui.closeModal(); sfx.tick(); go(el.dataset.to); },
  close: () => ui.closeModal(),
  sound: () => { state.sound = !state.sound; setAudioPrefs({ sound: state.sound }); save(); ui.renderTop(); sfx.pop(); },
  music: () => { state.music = !state.music; music.setEnabled(state.music); save(); ui.renderTop(); sfx.tick(); },
  parents: () => parentsGate(),
  wardrobe: () => { sfx.tick(); openWardrobe(); },
  say: (el) => speak(el.dataset.text, el.dataset.lang),
  'emmi-hi': (el) => emmiHi(el),
  'fun-reveal': (el) => {
    const box = el.closest('.fun-box');
    box.querySelector('.fun-answer').hidden = false;
    el.remove();
    sfx.correct();
    speak(el.dataset.q, 'de-DE');
    speak(el.dataset.a, 'de-DE', { queue: true });
  },
  'quiz-pick': (el) => BY_ID[screen]?.quiz?.()?.pick(el),
  'quiz-say': () => BY_ID[screen]?.quiz?.()?.say(),
  'quiz-quit': () => BY_ID[screen]?.quit?.(),
  ...dailyActions,
  ...wardrobeActions,
};
for (const p of PLACES) Object.assign(actions, p.mod.actions);

// Schnittstelle für die Spiel-Module
Object.assign(api, {
  openModal: ui.openModal, closeModal: ui.closeModal, toast: ui.toast, confetti: ui.confetti,
  addStars: ui.addStars, addXP: ui.addXP, renderTop: ui.renderTop, wordRows: ui.wordRows,
  hairColor: ui.hairColor, belt: ui.belt,
  go, render, quest, screen: () => screen,
});

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el || el.disabled) return;
  actions[el.dataset.act]?.(el, e);
});
document.addEventListener('pointerdown', () => { sfx.unlock(); music.unlock(); }, { once: true });
document.addEventListener('contextmenu', (e) => e.preventDefault());

initClips();
render();
// Sprachdateien laden und einmalig für den Offline-Betrieb vormerken
initVoices().then((index) => {
  const files = Object.values(index);
  const mark = `voices-${files.length}`;
  let done = null;
  try { done = localStorage.getItem('emmigame-voices-m4'); } catch (e) { /* egal */ }
  if (!files.length || done === mark || !navigator.serviceWorker?.controller) return;
  (async () => {
    for (const f of files) { try { await fetch('voice/' + f); } catch (e) { return; } }
    try { localStorage.setItem('emmigame-voices-m4', mark); } catch (e) { /* egal */ }
  })();
});
// Ältere Spielstände (vor der Begrüßung) nicht noch einmal begrüßen
if (!state.welcomed && (state.xp > 0 || state.stats.correct > 0)) { state.welcomed = true; save(); }
if (!state.welcomed) welcome();
// Den Browser bitten, den Spielstand dauerhaft zu behalten (nicht bei Speicherknappheit zu löschen)
try { navigator.storage?.persist?.().catch(() => {}); } catch (e) { /* nicht überall verfügbar */ }
startPlayTimer();

initUpdates();
