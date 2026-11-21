// 🧶 Bastelstube, Teil 2: Bügelperlen-Bilder (Spiegelbild/Symmetrie) und Origami (Faltschritte ordnen)
import { state, save } from '../state.js';
import * as art from '../art.js';
import { sfx, speak } from '../audio.js';
import { api, $, esc, shuffle } from '../core.js';
import { ORIGAMI } from '../bastel.js';

export { ORIGAMI };

// ---------- Bügelperlen ----------
const COL = { R: '#ff5a5a', P: '#ff8cc6', Y: '#ffd23b', G: '#62cc5c', V: '#9b7bff', B: '#8a5a2e', K: '#3a2a35', O: '#ff9a2e', W: '#ffffff', S: '#f3dfb8', L: '#fff1d6', D: '#a8703e', U: '#4fb3ff' };
const NAMES = { R: 'Rot', P: 'Rosa', Y: 'Gelb', G: 'Grün', V: 'Lila', B: 'Braun', K: 'Schwarz', O: 'Orange', W: 'Weiß', S: 'Beige', L: 'Hellgelb', D: 'Dunkelbraun', U: 'Blau' };
export const PICTURES = {
  heart: { de: 'Herz', rows: ['........', '.RR..RR.', 'RPRRRRPR', 'RRRRRRRR', '.RRRRRR.', '..RRRR..', '...RR...', '........'] },
  star: { de: 'Stern', rows: ['...YY...', '...YY...', 'YYYYYYYY', '.YYYYYY.', '..YYYY..', '.YYYYYY.', '.YY..YY.', 'Y......Y'] },
  house: { de: 'Haus', rows: ['...RR...', '..RRRR..', '.RRRRRR.', 'RRRRRRRR', '.LLLLLL.', '.LULLUL.', '.LLDDLL.', '.LLDDLL.'] },
  flower: { de: 'Blume', rows: ['..PPPP..', '.PPYYPP.', '.PYYYYP.', '.PPYYPP.', '..PPPP..', '...GG...', 'GG.GG.GG', '...GG...'] },
  mushroom: { de: 'Fliegenpilz', rows: ['..RRRR..', '.RRWWRR.', 'RWRRRRWR', 'RRRRRRRR', '.SSSSSS.', '..SSSS..', '..SSSS..', '.GGGGGG.'] },
  butterfly: { de: 'Schmetterling', rows: ['..B..B..', 'VV.BB.VV', 'VYVBBVYV', 'VVVBBVVV', '.VVBBVV.', 'VVVBBVVV', 'VYVBBVYV', 'VV.BB.VV'] },
  ladybug: { de: 'Marienkäfer', rows: ['...KK...', '..KKKK..', '.RRKKRR.', 'RKRKKRKR', 'RRRKKRRR', 'RKRKKRKR', '.RRKKRR.', '..RKKR..'] },
  cat: { de: 'Katze', rows: ['O......O', 'OO....OO', 'OOOOOOOO', 'OKOOOOKO', 'OOOPPOOO', 'OOOOOOOO', '.OOOOOO.', '..OOOO..'] },
};
const N = 8;
let beads = null; // { id, cells[], color, prefilled:Set, tries }

const target = (id) => PICTURES[id].rows.join('').split('');
const isRight = (i) => i % N >= N / 2;
const symLevel = () => Math.min(3, Math.max(1, state.symLevel || 1));

export function startBeads(id) {
  const ids = Object.keys(PICTURES);
  const done = state.crafts?.beads || [];
  id ||= shuffle(ids.filter((x) => !done.includes(x)))[0] || shuffle(ids)[0];
  const t = target(id);
  const cells = t.map((c, i) => (isRight(i) ? '.' : c));
  // Leichter am Anfang: ein Teil der rechten Seite ist schon gesteckt
  const share = [0, 0.6, 0.3, 0][symLevel()];
  const prefilled = new Set();
  for (let i = 0; i < t.length; i++) if (isRight(i) && t[i] !== '.' && Math.random() < share) { cells[i] = t[i]; prefilled.add(i); }
  const used = [...new Set(t.filter((c) => c !== '.'))];
  beads = { id, cells, color: used[0], used, prefilled, tries: 0 };
  sfx.pop();
  renderBeads();
  speak('Steck die rechte Seite wie im Spiegel!', 'de-DE');
}

function boardSvg(cells, { wrong = new Set(), small = false } = {}) {
  const s = 10;
  const dots = cells.map((c, i) => {
    const x = (i % N) * s + s / 2, y = Math.floor(i / N) * s + s / 2;
    const fill = c === '.' ? '#f4eee8' : COL[c];
    return `<g ${small ? '' : `data-act="sym-cell" data-cell="${i}"`} class="${small ? '' : isRight(i) ? 'bcell r' : 'bcell'}">
      <circle cx="${x}" cy="${y}" r="${c === '.' ? 1.6 : 4.3}" fill="${fill}" stroke="${c === '.' ? '#e2d6c6' : 'rgba(0,0,0,.18)'}" stroke-width=".7"/>
      ${c !== '.' ? `<circle cx="${x}" cy="${y}" r="1.4" fill="rgba(255,255,255,.55)"/>` : ''}
      ${!small ? `<rect x="${x - s / 2}" y="${y - s / 2}" width="${s}" height="${s}" fill="transparent"/>` : ''}
      ${wrong.has(i) ? `<circle cx="${x}" cy="${y}" r="4.8" fill="none" stroke="#ff2f5a" stroke-width="1.2" stroke-dasharray="2 1.4"/>` : ''}
    </g>`;
  }).join('');
  return art.svg(`<rect x="0" y="0" width="80" height="80" rx="4" fill="#fffaf3"/>${dots}${small ? '' : '<path d="M40 -2 V82" stroke="#9b7bff" stroke-width=".9" stroke-dasharray="2.4 1.6"/>'}`, { vb: '0 0 80 80' });
}

function renderBeads(wrong) {
  const b = beads;
  const p = PICTURES[b.id];
  $('#screen').innerHTML = `
    <div class="craft round">
      <div class="craft-wall"></div><div class="craft-table"></div>
      <div class="sym-wrap">
        <div class="sym-head"><b>Bügelperlen: ${esc(p.de)}</b><span>Die linke Seite ist fertig. Steck die <b>rechte Seite</b> genau wie im <b>Spiegel</b>! 🪞</span></div>
        <div class="sym-main">
          <div class="sym-board">${boardSvg(b.cells, { wrong })}</div>
          <div class="sym-side">
            <div class="sym-colors">${[...b.used, '.'].map((c) => `<button class="sym-col ${b.color === c ? 'sel' : ''}" data-act="sym-color" data-c="${c}" style="--c:${c === '.' ? '#fff' : COL[c]}" aria-label="${c === '.' ? 'Wegnehmen' : NAMES[c]}">${c === '.' ? '🧽' : ''}</button>`).join('')}</div>
            <div class="task-fb" id="sfb">&nbsp;</div>
            <button class="btn primary big" data-act="sym-check">Fertig! ✓</button>
          </div>
        </div>
      </div>
      <button class="btn ghost quit" data-act="craft-quit">Aufhören</button>
    </div>`;
}

function beadsClick(g) {
  if (!beads) return;
  const i = Number(g.dataset.cell);
  if (!isRight(i)) {
    // Links tippen zeigt, wo die Spiegelperle hingehört
    const m = Math.floor(i / N) * N + (N - 1 - (i % N));
    const el = document.querySelector(`[data-cell="${m}"]`);
    el?.classList.add('flash');
    setTimeout(() => el?.classList.remove('flash'), 700);
    sfx.tick();
    return;
  }
  if (beads.prefilled.has(i)) return;
  beads.cells[i] = beads.cells[i] === beads.color ? '.' : beads.color;
  sfx.tick();
  renderBeads();
}

export const beadActions = {
  'sym-cell': (el) => beadsClick(el),
  'sym-color': (el) => { beads.color = el.dataset.c; sfx.pop(); renderBeads(); },
  'sym-check': () => {
    const t = target(beads.id);
    const wrong = new Set(beads.cells.map((c, i) => (c !== t[i] ? i : -1)).filter((i) => i >= 0));
    if (wrong.size) {
      beads.tries++;
      sfx.wrong();
      renderBeads(beads.tries > 1 ? wrong : undefined);
      $('#sfb').innerHTML = beads.tries > 1
        ? `<span class="hint">💡 ${wrong.size} ${wrong.size === 1 ? 'Perle stimmt' : 'Perlen stimmen'} noch nicht – sie sind rot umkreist.</span>`
        : `<span class="oops">Fast! ${wrong.size} ${wrong.size === 1 ? 'Perle stimmt' : 'Perlen stimmen'} noch nicht.</span> <span class="hint">Tipp links auf eine Perle – dann blinkt ihr Spiegelplatz.</span>`;
      return;
    }
    const first = beads.tries === 0;
    if (first && symLevel() < 3) state.symLevel = symLevel() + 1;
    if (beads.tries >= 3 && symLevel() > 1) state.symLevel = symLevel() - 1;
    state.crafts ||= {};
    state.crafts.beads = [...(state.crafts.beads || []), beads.id].slice(-40);
    api.quest('craft');
    save();
    const id = beads.id;
    beads = null;
    api.confetti(70);
    sfx.fanfare();
    api.openModal(`
      <div class="bead-big">${boardSvg(target(id), { small: true })}</div>
      <h2>Bügelperlen-Bild „${esc(PICTURES[id].de)}“ ist fertig! 🎨</h2>
      <p class="big">${first ? 'Perfekt gespiegelt – beim ersten Versuch!' : 'Super gespiegelt!'}</p>
      <p class="note">Beide Seiten sind gleich, nur gespiegelt. Das nennt man <b>symmetrisch</b>. 🦋</p>
      <div class="btn-row"><button class="btn big" data-act="craft-home">Fertig</button><button class="btn primary big" data-act="craft-beads">Noch ein Bild!</button></div>`, { cls: 'celebrate' });
    setTimeout(() => api.addStars(first ? 6 : 4), 400);
    api.addXP(first ? 5 : 3);
  },
};
export const beadMini = (id) => boardSvg(target(id), { small: true });
export const beadsActive = () => !!beads;
export const stopBeads = () => { beads = null; };

// ---------- Origami ----------
let ori = null; // { o, order, next, tries }

export function startOrigami(id) {
  const o = ORIGAMI.find((x) => x.id === id);
  ori = { o, order: shuffle(o.steps.map((_, i) => i)), next: 0, tries: 0 };
  sfx.pop();
  renderOrigami();
  speak('Was kommt zuerst?', 'de-DE');
}
export function origamiMenu() {
  const made = state.crafts?.origami || {};
  $('#screen').innerHTML = `
    <div class="craft">
      <div class="craft-wall"></div><div class="craft-table"></div>
      <div class="stage-start">
        <div class="game-card">
          <h1>Origami falten 🦢</h1>
          <p>Lies die Faltschritte und bring sie in die richtige Reihenfolge. Danach kannst du es mit echtem Papier nachfalten!</p>
          <div class="knot-list">${ORIGAMI.map((o) => `<button class="htile" data-act="ori-start" data-id="${o.id}"><span>${o.ico}</span>${esc(o.de)}${made[o.id] ? '<small>✓ gefaltet</small>' : ''}</button>`).join('')}</div>
          <button class="btn" data-act="craft-home">← Zurück</button>
        </div>
      </div>
    </div>`;
}
function renderOrigami() {
  const { o, order, next } = ori;
  $('#screen').innerHTML = `
    <div class="craft">
      <div class="craft-wall"></div><div class="craft-table"></div>
      <div class="stage-start">
        <div class="game-card knot-card">
          <h1>${o.ico} ${esc(o.de)}</h1>
          <p class="note">Tipp die Faltschritte in der richtigen Reihenfolge an.</p>
          <ol class="knot-done">${o.steps.map((st, i) => `<li class="${i < next ? 'ok' : ''}">${i < next ? esc(st) : '…'}</li>`).join('')}</ol>
          <div class="knot-opts">${order.filter((i) => i >= next).map((i) => `<button class="kopt" data-act="ori-step" data-i="${i}">${esc(o.steps[i])}</button>`).join('')}</div>
          <button class="btn ghost" data-act="craft-origami">← Andere Figur</button>
        </div>
      </div>
    </div>`;
}
export const origamiActions = {
  'craft-origami': () => { api.closeModal(); ori = null; sfx.pop(); origamiMenu(); },
  'ori-start': (el) => startOrigami(el.dataset.id),
  'ori-step': (el) => {
    const i = Number(el.dataset.i);
    if (i !== ori.next) {
      ori.tries++;
      el.classList.add('wrong');
      sfx.wrong();
      setTimeout(() => el.classList.remove('wrong'), 600);
      api.toast(ori.next === 0 ? 'Womit fängt man an? Mit dem ganzen Blatt! 📄' : 'Hmm, was kommt direkt danach?');
      return;
    }
    sfx.correct();
    speak(ori.o.steps[i], 'de-DE');
    ori.next++;
    if (ori.next < ori.o.steps.length) return renderOrigami();
    state.crafts ||= {};
    state.crafts.origami ||= {};
    const firstTime = !state.crafts.origami[ori.o.id];
    state.crafts.origami[ori.o.id] = (state.crafts.origami[ori.o.id] || 0) + 1;
    api.quest('craft');
    save();
    renderOrigami();
    api.confetti(50);
    sfx.fanfare();
    const good = ori.tries <= 1;
    api.openModal(`
      <div class="big-ico">${art.emoji(ori.o.ico)}</div>
      <h2>${esc(ori.o.de)} gefaltet!</h2>
      <p class="big">${good ? 'Alle Schritte richtig geordnet! 🌟' : 'Geschafft! 💪'}</p>
      <p class="note">Hol dir ein Blatt Papier und falte es in echt nach! 📄✂️</p>
      <div class="btn-row"><button class="btn big" data-act="craft-home">Fertig</button><button class="btn primary big" data-act="craft-origami">Noch eine Figur</button></div>`, { cls: 'celebrate' });
    setTimeout(() => api.addStars((firstTime ? 3 : 1) + (good ? 2 : 0)), 400);
    api.addXP(3);
  },
};
export const stopOrigami = () => { ori = null; };
