// 🌱 Garten – säen, mit Mathe gießen, ernten; Tiere sprechen drei Sprachen
import { state, save } from '../state.js';
import { PLANTS, ANIMALS, DECOS } from '../data.js';
import * as art from '../art.js';
import { sfx, speak } from '../audio.js';
import { gardenTask } from '../math.js';
import { $, openModal, closeModal, numberTask, toast, addStars, addXP, wordRows } from '../ui.js';
import { quest } from '../daily.js';

// ============ Garten ============
function renderGarden() {
  const n = state.beds.length;
  const beds = state.beds.map(bedHTML).join('');
  const animals = state.animals.map((a, i) =>
    `<button class="animal" data-act="animal" data-i="${i}" style="left:${a.x}%;--d:${5 + (i % 4) * 1.7}s;animation-delay:-${(i * 1.3) % 5}s">
      <div class="animal-inner">${art.animal(a.type)}</div><div class="bubble"></div></button>`).join('');
  $('#screen').innerHTML = `
    <div class="garden">
      <div class="garden-top">
        <div class="sun">${art.sun()}</div>
        <div class="cloud c1"></div><div class="cloud c2"></div><div class="cloud c3"></div>
        <div class="hills">${art.hills()}</div>
        ${state.deco.rainbow ? decoBtn('rainbow') : ''}
        <div class="fence">${art.fence()}</div>
        ${['birdhouse', 'bench', 'balloons', 'pond'].filter((d) => state.deco[d]).map(decoBtn).join('')}
        <div class="animals">${animals || '<div class="hint-bubble">Im Laden warten Tiere auf dich! 🐣</div>'}</div>
      </div>
      <div class="beds" data-n="${n}">${beds}</div>
    </div>`;
}

function decoBtn(id) {
  return `<button class="deco d-${id}" data-act="say" data-lang="pt-PT" data-text="${DECOS[id].pt}" aria-label="${DECOS[id].name}">${art.deco(id)}</button>`;
}

function bedHTML(bed, i) {
  if (!bed.plant) {
    return `<button class="bed empty" data-act="bed" data-i="${i}"><div class="soil"></div><span class="plus">+</span><span class="bed-label">Pflanzen</span></button>`;
  }
  const p = PLANTS[bed.plant];
  const ready = bed.water >= p.water;
  const drops = ready ? '' : `<div class="drops">${Array.from({ length: p.water }, (_, k) => `<span class="${k < bed.water ? 'full' : ''}">${art.drop()}</span>`).join('')}</div>`;
  return `<button class="bed ${ready ? 'ready' : 'thirsty'}" data-act="bed" data-i="${i}">
    <div class="soil"></div>
    <div class="plant">${ready ? art.plant(bed.plant) : art.sprout(bed.water / p.water)}</div>
    ${drops}
    ${ready ? '<span class="spark s1">✦</span><span class="spark s2">✦</span><span class="spark s3">✦</span>' : ''}
    <span class="bed-label">${ready ? 'Ernten!' : 'Gießen'}</span>
  </button>`;
}

function bedEl(i) { return document.querySelector(`.bed[data-i="${i}"]`); }

function onBed(i) {
  const bed = state.beds[i];
  if (!bed.plant) return seedPicker(i);
  const p = PLANTS[bed.plant];
  if (bed.water >= p.water) return harvest(i);
  waterTask(i);
}

function seedPicker(i) {
  const owned = Object.entries(state.seeds).filter(([, n]) => n > 0);
  if (!owned.length) {
    openModal(`<div class="big-ico">${art.basket()}</div><h2>Keine Samen mehr</h2>
      <p>Im Laden kannst du mit Sternen neue Samen kaufen.</p>
      <button class="btn primary big" data-act="goto" data-to="shop">Zum Laden</button>`);
    return;
  }
  const m = openModal(`<h2>Was möchtest du pflanzen?</h2>
    <div class="seed-grid">${owned.map(([k, n]) => `
      <button class="seed-card" data-k="${k}">
        <span class="count">${n}×</span>
        <div class="art">${art.plant(k)}</div>
        <b>${PLANTS[k].name}</b><small class="pt">${PLANTS[k].pt}</small>
      </button>`).join('')}</div>`);
  m.querySelectorAll('.seed-card').forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.k;
    state.seeds[k]--;
    state.beds[i] = { plant: k, water: 0 };
    save();
    closeModal();
    sfx.pop();
    renderGarden();
    bedEl(i)?.classList.add('popin');
  }));
}

function currentMathLevel() { return Math.min(4, Math.max(1, state.mathLevel)); }

function waterTask(i) {
  const p = PLANTS[state.beds[i].plant];
  numberTask({
    title: `Gieß ${p.deAkk}!`,
    icon: art.wateringCan(),
    task: gardenTask(currentMathLevel()),
    onFinish: ({ correct, tries }) => {
      state.beds[i].water++;
      quest('water');
      if (correct) {
        state.stats.correct++;
        adaptMath(tries === 1);
      } else {
        adaptMath(false);
      }
      save();
      renderGarden();
      const el = bedEl(i);
      if (el) {
        el.classList.add('watered');
        const rain = document.createElement('div');
        rain.className = 'rain';
        rain.innerHTML = Array.from({ length: 7 }, (_, k) => `<i style="left:${12 + k * 12}%;animation-delay:${k * 0.06}s"></i>`).join('');
        el.appendChild(rain);
      }
      sfx.water();
      if (correct) {
        const r = el?.getBoundingClientRect();
        const at = r ? { x: r.left + r.width / 2, y: r.top + 20 } : undefined;
        if (tries === 1) addStars(1, at);
        if (tries <= 2) addXP(1);
      }
      if (state.beds[i].water >= p.water) setTimeout(() => toast(`${p.name} ist reif! Tipp drauf zum Ernten.`), 600);
    },
  });
}

function adaptMath(firstTry) {
  if (!state.mathAuto) return;
  if (firstTry) {
    state.mStreak++; state.mWrong = 0;
    if (state.mStreak >= 5 && state.mathLevel < 4) {
      state.mathLevel++; state.mStreak = 0;
      setTimeout(() => toast('Die Aufgaben werden etwas kniffliger! 🌟'), 1200);
    }
  } else {
    state.mWrong++; state.mStreak = 0;
    if (state.mWrong >= 2 && state.mathLevel > 1) { state.mathLevel--; state.mWrong = 0; }
  }
}

function harvest(i) {
  const k = state.beds[i].plant, p = PLANTS[k];
  state.beds[i] = { plant: null, water: 0 };
  state.stats.harvested++;
  quest('harvest');
  state.collection[k] = (state.collection[k] || 0) + 1;
  state.basket[k] = (state.basket[k] || 0) + 1;
  save();
  sfx.harvest();
  renderGarden();
  openModal(`
    <div class="harvest-art">${art.plant(k)}</div>
    <h2>Du hast ${p.deIndef} geerntet!</h2>
    ${wordRows(p)}
    <p class="note">🧺 Liegt jetzt auch im Erntekorb – im Hofladen kannst du sie verkaufen.</p>
    <button class="btn primary big" data-act="collect" data-n="${p.reward}">+${p.reward} <span class="bi">${art.star()}</span> einsammeln</button>`, { closable: false, cls: 'celebrate' });
  setTimeout(() => { speak(p.pt, 'pt-PT'); speak(p.en, 'en-GB', { queue: true }); }, 500);
}

function onAnimal(el) {
  const a = state.animals[+el.dataset.i];
  if (!a) return;
  const info = ANIMALS[a.type];
  const langs = [['🇵🇹', info.pt, 'pt-PT'], ['🇬🇧', info.en, 'en-GB'], ['🇩🇪', info.de, 'de-DE']];
  a._l = ((a._l ?? -1) + 1) % langs.length;
  const [flag, word, lang] = langs[a._l];
  const bub = $('.bubble', el);
  bub.textContent = `${flag} ${word}`;
  bub.classList.add('show');
  clearTimeout(bub._t);
  bub._t = setTimeout(() => bub.classList.remove('show'), 2200);
  el.classList.remove('hop'); void el.offsetWidth; el.classList.add('hop');
  sfx.hop();
  speak(word, lang);
}
export { currentMathLevel };

export default {
  id: 'garden',
  label: 'Garten',
  render: renderGarden,
  actions: {
    bed: (el) => onBed(Number(el.dataset.i)),
    animal: (el) => onAnimal(el),
    collect: (el) => { const n = Number(el.dataset.n); closeModal(); addStars(n); },
  },
};
