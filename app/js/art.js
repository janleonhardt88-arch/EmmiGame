// Alle Grafiken als handgezeichnete SVGs (niedlich & bunt).
const INK = '#3a2a35';

export const svg = (body, { vb = '0 0 100 100', par = 'xMidYMid meet', cls = '' } = {}) =>
  `<svg viewBox="${vb}" preserveAspectRatio="${par}" class="${cls}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`;

// Niedliches Gesicht
export function face(x, y, s = 1, { mouth = true, eye = INK } = {}) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="-7" cy="0" rx="2.7" ry="3.3" fill="${eye}"/>
    <ellipse cx="7" cy="0" rx="2.7" ry="3.3" fill="${eye}"/>
    <circle cx="-6.1" cy="-1.3" r="1.05" fill="#fff"/>
    <circle cx="7.9" cy="-1.3" r="1.05" fill="#fff"/>
    ${mouth ? `<path d="M-3 4.2 Q0 7.4 3 4.2" stroke="${eye}" stroke-width="1.7" fill="none" stroke-linecap="round"/>` : ''}
    <ellipse cx="-11.5" cy="4.5" rx="3.2" ry="1.9" fill="#ff7aa8" opacity=".55"/>
    <ellipse cx="11.5" cy="4.5" rx="3.2" ry="1.9" fill="#ff7aa8" opacity=".55"/>
  </g>`;
}

const LEAF = 'fill="#62cc5c" stroke="#2f8f3a" stroke-width="2.2" stroke-linejoin="round"';

// ---------- Pflanzen ----------
const PLANT_ART = {
  carrot: () => `
    <path d="M50 34 C44 22 36 16 30 18 C36 23 42 29 47 36Z" ${LEAF}/>
    <path d="M50 34 C49 20 53 10 58 9 C56 18 54 26 53 36Z" ${LEAF}/>
    <path d="M51 35 C58 24 66 21 71 23 C65 27 59 31 54 37Z" ${LEAF}/>
    <path d="M33 40 Q50 30 67 40 Q65 62 50 94 Q35 62 33 40Z" fill="#ff9636" stroke="#d9661a" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M42 68 h6 M53 76 h6 M45 84 h4" stroke="#d9661a" stroke-width="2.2" stroke-linecap="round"/>
    ${face(50, 51, 0.9)}`,
  tomato: () => `
    <circle cx="50" cy="64" r="27" fill="#ff5a4e" stroke="#d63a30" stroke-width="2.6"/>
    <ellipse cx="38" cy="52" rx="6" ry="3.6" fill="#fff" opacity=".4" transform="rotate(-35 38 52)"/>
    <path d="M50 30 L50 40" stroke="#2f8f3a" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M50 37 L43 33 L46 39 L37 41 L46 43 L44 48 L50 44 L56 48 L54 43 L63 41 L54 39 L57 33Z" fill="#4cbb4a" stroke="#2f8f3a" stroke-width="2" stroke-linejoin="round"/>
    ${face(50, 66)}`,
  strawberry: () => `
    <path d="M50 94 C30 82 23 62 27 50 C31 40 42 38 50 42 C58 38 69 40 73 50 C77 62 70 82 50 94Z" fill="#ff4f6d" stroke="#d12f4f" stroke-width="2.6" stroke-linejoin="round"/>
    ${[[35, 54], [65, 54], [33, 67], [67, 67], [41, 79], [59, 79], [50, 87]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.6" ry="2.4" fill="#ffe27a"/>`).join('')}
    <path d="M50 45 L39 37 L46 36 L42 28 L50 33 L58 28 L54 36 L61 37Z" fill="#4cbb4a" stroke="#2f8f3a" stroke-width="2" stroke-linejoin="round"/>
    ${face(50, 61, 0.9)}`,
  pumpkin: () => `
    <path d="M50 40 L50 30 Q52 23 59 21" stroke="#6b8f2a" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <path d="M55 31 Q69 21 77 31 Q66 37 55 31Z" ${LEAF}/>
    <ellipse cx="31" cy="66" rx="16" ry="23" fill="#ff9a2e" stroke="#d96f12" stroke-width="2.6"/>
    <ellipse cx="69" cy="66" rx="16" ry="23" fill="#ff9a2e" stroke="#d96f12" stroke-width="2.6"/>
    <ellipse cx="50" cy="66" rx="18" ry="26" fill="#ffad48" stroke="#d96f12" stroke-width="2.6"/>
    ${face(50, 66)}`,
  sunflower: () => `
    <path d="M50 95 L50 52" stroke="#3fa34a" stroke-width="5" stroke-linecap="round"/>
    <path d="M50 80 Q36 68 28 74 Q38 86 50 82Z" ${LEAF}/>
    <path d="M50 73 Q64 61 72 67 Q62 79 50 75Z" ${LEAF}/>
    ${Array.from({ length: 12 }, (_, i) => `<ellipse cx="50" cy="18" rx="6.5" ry="11" fill="#ffd23b" stroke="#e6a100" stroke-width="2" transform="rotate(${i * 30} 50 36)"/>`).join('')}
    <circle cx="50" cy="36" r="14" fill="#b9813f" stroke="#8a5a26" stroke-width="2.4"/>
    ${face(50, 36, 0.78)}`,
  radish: () => `
    <path d="M49 46 C34 34 28 20 36 14 C45 15 50 30 49 46Z" ${LEAF}/>
    <path d="M51 46 C66 34 72 20 64 14 C55 15 50 30 51 46Z" ${LEAF}/>
    <path d="M50 84 Q51 90 48.5 96" stroke="#e8c4d2" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <circle cx="50" cy="64" r="22" fill="#ff4f9a" stroke="#cf2f78" stroke-width="2.6"/>
    <path d="M37 76 Q50 92 63 76 Q50 81 37 76Z" fill="#fff0f6"/>
    ${face(50, 61, 0.9)}`,
};

export function plant(type) {
  return svg((PLANT_ART[type] || PLANT_ART.carrot)(), { par: 'xMidYMax meet' });
}

// Keimling – wächst mit dem Fortschritt (0..1)
export function sprout(progress) {
  if (progress < 0.5) {
    return svg(`
      <path d="M50 95 Q50 84 50 76" stroke="#3fa34a" stroke-width="4" stroke-linecap="round" fill="none"/>
      <path d="M50 79 Q39 68 33 73 Q39 83 50 79Z" ${LEAF}/>
      <path d="M50 77 Q61 66 67 71 Q61 81 50 77Z" ${LEAF}/>`, { par: 'xMidYMax meet' });
  }
  return svg(`
    <path d="M50 95 Q48 76 50 56" stroke="#3fa34a" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    <path d="M50 84 Q36 74 29 80 Q37 90 50 86Z" ${LEAF}/>
    <path d="M50 76 Q64 66 71 72 Q63 82 50 78Z" ${LEAF}/>
    <path d="M50 64 Q40 52 34 57 Q40 67 50 66Z" ${LEAF}/>
    <path d="M50 60 Q60 48 66 53 Q60 63 50 62Z" ${LEAF}/>
    <circle cx="50" cy="53" r="5" fill="#a6e38a" stroke="#2f8f3a" stroke-width="2"/>`, { par: 'xMidYMax meet' });
}

// ---------- Tiere ----------
function spikes(cx, cy, rx, ry, n) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2;
    const k = i % 2 ? 0.8 : 1.08;
    pts.push(`${(cx + Math.cos(a) * rx * k).toFixed(1)},${(cy + Math.sin(a) * ry * k).toFixed(1)}`);
  }
  return pts.join(' ');
}

const ANIMAL_ART = {
  chicken: () => `
    <path d="M42 82 L41 93 M37 93 L45 93 M58 82 L59 93 M55 93 L63 93" stroke="#ff9a2e" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M24 58 Q12 60 17 72 Q24 71 28 64Z" fill="#f4ece4" stroke="#cdbfb3" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M76 58 Q88 60 83 72 Q76 71 72 64Z" fill="#f4ece4" stroke="#cdbfb3" stroke-width="2.4" stroke-linejoin="round"/>
    <ellipse cx="50" cy="60" rx="28" ry="26" fill="#fff" stroke="#cdbfb3" stroke-width="2.6"/>
    <path d="M42 36 Q39 26 46 28 Q48 19 53 27 Q57 20 59 30 Q61 35 56 36Z" fill="#ff5252" stroke="#d63333" stroke-width="2" stroke-linejoin="round"/>
    ${face(50, 54, 0.85, { mouth: false })}
    <path d="M45 59 L55 59 L50 66Z" fill="#ffb02e" stroke="#e08a00" stroke-width="1.6" stroke-linejoin="round"/>
    <ellipse cx="50" cy="69" rx="2.4" ry="3" fill="#ff5252"/>`,
  bunny: () => `
    <g transform="rotate(-12 38 34)"><ellipse cx="38" cy="22" rx="8" ry="19" fill="#fff" stroke="#cbc2d6" stroke-width="2.4"/><ellipse cx="38" cy="23" rx="4" ry="13" fill="#ffc2d8"/></g>
    <g transform="rotate(12 62 34)"><ellipse cx="62" cy="22" rx="8" ry="19" fill="#fff" stroke="#cbc2d6" stroke-width="2.4"/><ellipse cx="62" cy="23" rx="4" ry="13" fill="#ffc2d8"/></g>
    <ellipse cx="50" cy="78" rx="23" ry="16" fill="#fff" stroke="#cbc2d6" stroke-width="2.4"/>
    <ellipse cx="38" cy="92" rx="8" ry="4" fill="#fff" stroke="#cbc2d6" stroke-width="2.2"/>
    <ellipse cx="62" cy="92" rx="8" ry="4" fill="#fff" stroke="#cbc2d6" stroke-width="2.2"/>
    <circle cx="50" cy="54" r="21" fill="#fff" stroke="#cbc2d6" stroke-width="2.4"/>
    ${face(50, 52, 0.82, { mouth: false })}
    <ellipse cx="50" cy="58" rx="2.8" ry="2" fill="#ff7aa8"/>
    <path d="M50 60 Q47.5 63.5 45 61.5 M50 60 Q52.5 63.5 55 61.5" stroke="${INK}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,
  hedgehog: () => `
    <polygon points="${spikes(50, 58, 36, 32, 16)}" fill="#8a5a3b" stroke="#5e3a22" stroke-width="2.4" stroke-linejoin="round"/>
    <ellipse cx="38" cy="91" rx="7" ry="4" fill="#d9b48a"/>
    <ellipse cx="62" cy="91" rx="7" ry="4" fill="#d9b48a"/>
    <ellipse cx="50" cy="67" rx="21" ry="18" fill="#f5d6ad" stroke="#c9a074" stroke-width="2.4"/>
    ${face(50, 63, 0.8, { mouth: false })}
    <ellipse cx="50" cy="71" rx="3.6" ry="2.8" fill="${INK}"/>
    <circle cx="49" cy="70" r="1" fill="#fff"/>`,
  sheep: () => {
    const cl = [[30, 60, 13], [42, 52, 14], [58, 52, 14], [70, 60, 13], [62, 72, 14], [38, 72, 14], [50, 64, 16]];
    return `
    <rect x="35" y="78" width="7" height="16" rx="3" fill="#5a4a5e"/>
    <rect x="58" y="78" width="7" height="16" rx="3" fill="#5a4a5e"/>
    ${cl.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r + 2.4}" fill="#d9d2df"/>`).join('')}
    ${cl.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/>`).join('')}
    <ellipse cx="34" cy="50" rx="8" ry="4" fill="#ffe3d1" stroke="#d9b49c" stroke-width="2" transform="rotate(-25 34 50)"/>
    <ellipse cx="66" cy="50" rx="8" ry="4" fill="#ffe3d1" stroke="#d9b49c" stroke-width="2" transform="rotate(25 66 50)"/>
    <ellipse cx="50" cy="55" rx="14" ry="15" fill="#ffe3d1" stroke="#d9b49c" stroke-width="2.4"/>
    <circle cx="44" cy="40" r="6" fill="#fff" stroke="#d9d2df" stroke-width="2"/>
    <circle cx="50" cy="38" r="6.5" fill="#fff" stroke="#d9d2df" stroke-width="2"/>
    <circle cx="56" cy="40" r="6" fill="#fff" stroke="#d9d2df" stroke-width="2"/>
    ${face(50, 55, 0.72)}`;
  },
};

export function animal(type) {
  return svg((ANIMAL_ART[type] || ANIMAL_ART.chicken)(), { par: 'xMidYMax meet' });
}

// ---------- Emmi (frei gestaltbar: Frisur, Haarfarbe, Haut, Kleidung, Extras) ----------
export const SKINS = [['#ffdcc2', '#e8b896'], ['#f7cfa6', '#dba97c'], ['#e0ac7a', '#bf8a56'], ['#b97a4a', '#955c30'], ['#8a5a3b', '#683f25']];

export const OUTFITS = {
  heart: { shirt: '#ff7eb6', shirtO: '#e2559a', legs: '#7b5bd6', legsO: '#5a3fb0', emblem: 'heart' },
  star: { shirt: '#3fb8a8', shirtO: '#2a8f82', legs: '#2f4a8a', legsO: '#213566', emblem: 'star' },
  stripes: { shirt: '#ffffff', shirtO: '#c9c2d6', legs: '#3b8cff', legsO: '#2a66c9', stripes: '#ff5a7a' },
  sport: { shirt: '#62cc5c', shirtO: '#3fa34a', legs: '#3a2a35', legsO: '#241a22', emblem: 'bolt' },
  flower: { shirt: '#ffd23b', shirtO: '#e6a100', skirt: '#ff8cc6', skirtO: '#e2559a', emblem: 'flower' },
  overalls: { shirt: '#ffd23b', shirtO: '#e6a100', legs: '#4f8fd6', legsO: '#2f66a8', overall: true },
  rainbow: { shirt: '#9b7bff', shirtO: '#7356e0', skirt: '#ff8cc6', skirtO: '#e2559a', rainbow: true, emblem: 'star' },
  princess: { shirt: '#c9a7ff', shirtO: '#9b7bff', skirt: '#b38cff', skirtO: '#8a63e0', long: true, emblem: 'gem' },
  dino: { shirt: '#62cc5c', shirtO: '#3fa34a', legs: '#4f8fd6', legsO: '#2f66a8', emblem: 'dino' },
  unicorn: { shirt: '#fff0f8', shirtO: '#f0a8c8', skirt: '#d9ccff', skirtO: '#a98bff', long: true, rainbow: true, emblem: 'horn' },
  pajama: { shirt: '#bfe0ff', shirtO: '#7fb3e6', legs: '#bfe0ff', legsO: '#7fb3e6', emblem: 'moon', dots: '#fff6a0' },
  hero: { shirt: '#ff5a5a', shirtO: '#c9443a', legs: '#3b6fd6', legsO: '#2a4fa8', emblem: 'bolt', cape: '#e2453c' },
  mermaid: { shirt: '#5fd3c0', shirtO: '#2a9f8c', skirt: '#3fb8a8', skirtO: '#2a8f82', long: true, emblem: 'shell', fin: true },
  raincoat: { shirt: '#ffd23b', shirtO: '#e6a100', legs: '#4f8fd6', legsO: '#2f66a8', coat: true },
  winter: { shirt: '#ff8cc6', shirtO: '#e2559a', legs: '#5a4a5e', legsO: '#3a2a35', emblem: 'snow', scarf: '#4fb3ff' },
  sailor: { shirt: '#ffffff', shirtO: '#c9c2d6', skirt: '#2f4a8a', skirtO: '#213566', sailor: true },
};
export const EYES = { dark: '#3a2a35', brown: '#7a4a2c', blue: '#2f7fd6', green: '#2f8f3a', violet: '#7356e0', grey: '#6f7a88' };
export const SHOES = {
  white: ['#ffffff', '#c9c2d6'], pink: ['#ff8cc6', '#e2559a'], purple: ['#9b7bff', '#7356e0'], red: ['#ff5a5a', '#c9443a'],
  boots: ['#ffd23b', '#e6a100'], gold: ['#f4c430', '#c99a00'],
};

export const TUTUS = {
  pink: { body: '#ff8cc6', bodyO: '#e2559a', skirt: '#ffc2dc', tights: '#ffd9ea', tightsO: '#f0b4cf' },
  lila: { body: '#a98bff', bodyO: '#7356e0', skirt: '#d9ccff', tights: '#ece6ff', tightsO: '#c9bdf0' },
  mint: { body: '#5fd3c0', bodyO: '#2a9f8c', skirt: '#bff0e8', tights: '#e3f8f4', tightsO: '#aadfd5' },
  sun: { body: '#ffc93b', bodyO: '#e6a100', skirt: '#ffe9a6', tights: '#fff5d6', tightsO: '#ecd9a0' },
  sky: { body: '#5aa9ff', bodyO: '#2f7fd6', skirt: '#c4e0ff', tights: '#e4f1ff', tightsO: '#b0cdeb' },
};

const HO = 'stroke="rgba(0,0,0,.16)" stroke-width="1.6" stroke-linejoin="round"';
const normLook = (x) => ({ hair: '#7a4a2c', style: 'bun', skin: 0, acc: 'none', casual: 'heart', tutu: 'pink', eyes: 'dark', cheek: 'none', shoes: 'white', ...(typeof x === 'string' ? { hair: x } : (x || {})) });

// Haare hinter dem Kopf / Körper
function hairBack(L) {
  const h = L.hair;
  switch (L.style) {
    case 'bun': return `<circle cx="50" cy="14" r="9" fill="${h}" ${HO}/>`;
    case 'buns2': return `<circle cx="31" cy="19" r="8.5" fill="${h}" ${HO}/><circle cx="69" cy="19" r="8.5" fill="${h}" ${HO}/>`;
    case 'pigtails': return `<path d="M29 36 Q12 42 16 66 Q24 72 30 58Z" fill="${h}" ${HO}/><path d="M71 36 Q88 42 84 66 Q76 72 70 58Z" fill="${h}" ${HO}/>`;
    case 'ponytail': return `<path d="M66 20 Q94 16 91 50 Q89 68 78 72 Q85 52 75 38Z" fill="${h}" ${HO}/>`;
    case 'long': return `<path d="M26 36 Q18 70 26 90 L74 90 Q82 70 74 36Z" fill="${h}" ${HO}/>`;
    case 'wavy': return `<path d="M26 36 Q16 60 24 72 Q18 82 28 92 Q38 86 44 94 Q50 88 56 94 Q62 86 72 92 Q82 82 76 72 Q84 60 74 36Z" fill="${h}" ${HO}/>`;
    case 'curly': return [[28, 30], [24, 44], [26, 58], [32, 68], [72, 30], [76, 44], [74, 58], [68, 68], [36, 18], [50, 13], [64, 18]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="${h}" ${HO}/>`).join('');
    case 'afro': return `<circle cx="50" cy="34" r="31" fill="${h}" ${HO}/>${[[22, 22], [30, 9], [50, 4], [70, 9], [78, 22], [82, 40], [18, 40]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${h}"/>`).join('')}`;
    case 'sidepony': return `<path d="M28 30 Q8 34 10 58 Q12 74 22 80 Q16 60 30 44Z" fill="${h}" ${HO}/>`;
    case 'twobraids': return '';
    default: return '';
  }
}

// Haare vor dem Gesicht (Pony) und über den Schultern
function hairFront(L) {
  const h = L.hair;
  let s = `<path d="M27 42 Q25 15 50 15 Q75 15 73 42 Q68 29 58 28 Q52 23 46 29 Q35 29 27 42Z" fill="${h}"/>`;
  if (L.style === 'bob') s += `<path d="M27 38 Q21 56 30 66 Q37 56 33 38Z" fill="${h}" ${HO}/><path d="M73 38 Q79 56 70 66 Q63 56 67 38Z" fill="${h}" ${HO}/>`;
  if (L.style === 'pigtails') s += `<circle cx="27" cy="39" r="3.4" fill="#ff5a9a"/><circle cx="73" cy="39" r="3.4" fill="#ff5a9a"/>`;
  if (L.style === 'ponytail') s += `<circle cx="70" cy="23" r="3.4" fill="#ff5a9a"/>`;
  if (L.style === 'curly') s += [[32, 22], [42, 18], [54, 18], [66, 22]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="${h}"/>`).join('');
  if (L.style === 'sidepony') s += `<circle cx="27" cy="30" r="3.4" fill="#ffd23b"/>`;
  if (L.style === 'twobraids') {
    for (const side of [-1, 1]) {
      s += [[50 + side * 23, 46], [50 + side * 26, 55], [50 + side * 27, 64], [50 + side * 26, 73]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4.8" ry="5.2" fill="${h}" ${HO}/>`).join('')
        + `<circle cx="${50 + side * 26}" cy="79" r="2.6" fill="#ff5a9a"/>`;
    }
  }
  if (L.style === 'braid') {
    s += [[73, 46], [76, 55], [77, 64], [76, 73], [75, 82]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="5.2" ry="5.6" fill="${h}" ${HO}/>`).join('')
      + `<circle cx="75" cy="88" r="2.8" fill="#ff5a9a"/><path d="M73 90 L75 97 L77 90Z" fill="${h}"/>`;
  }
  return s;
}

// Gesicht: Sommersprossen, Glitzer, Aufkleber
function cheek(L) {
  switch (L.cheek) {
    case 'freckles': return [[37, 47], [40, 49], [35, 50], [63, 47], [60, 49], [65, 50]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.9" fill="#b8754a"/>`).join('');
    case 'heart': return '<path d="M38 52 C36.5 50.5 35.5 49.5 36.2 48.5 C37 47.8 37.8 48.2 38 49 C38.2 48.2 39 47.8 39.8 48.5 C40.5 49.5 39.5 50.5 38 52Z" fill="#ff5a7a"/>';
    case 'star': return '<path d="M62 46.5 L62.9 48.8 L65.3 49 L63.5 50.5 L64.1 52.9 L62 51.6 L59.9 52.9 L60.5 50.5 L58.7 49 L61.1 48.8Z" fill="#ffd23b" stroke="#e6a100" stroke-width=".5"/>';
    case 'glitter': return [[36, 46], [64, 46], [39, 50], [61, 50]].map(([x, y]) => `<path d="M${x} ${y - 1.6} L${x + 0.5} ${y - 0.5} L${x + 1.6} ${y} L${x + 0.5} ${y + 0.5} L${x} ${y + 1.6} L${x - 0.5} ${y + 0.5} L${x - 1.6} ${y} L${x - 0.5} ${y - 0.5}Z" fill="#c9a7ff"/>`).join('');
    case 'rosy': return '<ellipse cx="38" cy="49" rx="4.5" ry="2.6" fill="#ff5a9a" opacity=".45"/><ellipse cx="62" cy="49" rx="4.5" ry="2.6" fill="#ff5a9a" opacity=".45"/>';
    default: return '';
  }
}

function accessory(L) {
  switch (L.acc) {
    case 'captain': return '<path d="M26 30 Q26 12 50 11 Q74 12 74 30Z" fill="#fff" stroke="#c9c2d6" stroke-width="1.8"/><rect x="26" y="26" width="48" height="6" rx="2" fill="#2f4a8a"/><path d="M30 31 Q50 40 70 31 Q50 35 30 31Z" fill="#213566"/><circle cx="50" cy="20" r="4.5" fill="#ffd23b" stroke="#e6a100" stroke-width="1"/><path d="M50 17.5 V22.5 M47.8 19 Q50 23 52.2 19" stroke="#2f4a8a" stroke-width="1" fill="none"/>';
    case 'sunglasses': return '<path d="M35 40 H65" stroke="#3a2a35" stroke-width="2"/><rect x="35" y="39" width="12" height="8" rx="3.5" fill="#3a2a35"/><rect x="53" y="39" width="12" height="8" rx="3.5" fill="#3a2a35"/><path d="M37 41 L40 41" stroke="#fff" stroke-width="1.2" opacity=".7"/><path d="M55 41 L58 41" stroke="#fff" stroke-width="1.2" opacity=".7"/>';
    case 'headphones': return '<path d="M26 40 Q26 12 50 12 Q74 12 74 40" stroke="#9b7bff" stroke-width="4" fill="none"/><rect x="21" y="36" width="9" height="14" rx="4" fill="#ff7eb6" stroke="#e2559a" stroke-width="1.6"/><rect x="70" y="36" width="9" height="14" rx="4" fill="#ff7eb6" stroke="#e2559a" stroke-width="1.6"/>';
    case 'flowercrown': return [[30, 24, '#ff8cc6'], [38, 18, '#ffd23b'], [46, 15, '#9b7bff'], [54, 15, '#ff8cc6'], [62, 18, '#ffd23b'], [70, 24, '#9b7bff']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="3.6" fill="${c}" stroke="#fff" stroke-width="1"/><circle cx="${x}" cy="${y}" r="1.2" fill="#fff6c2"/>`).join('') + '<path d="M28 27 Q50 9 72 27" stroke="#62cc5c" stroke-width="1.6" fill="none"/>';
    case 'bunnyears': return '<ellipse cx="40" cy="8" rx="5" ry="13" fill="#fff" stroke="#cbc2d6" stroke-width="1.6" transform="rotate(-12 40 8)"/><ellipse cx="40" cy="9" rx="2.4" ry="8" fill="#ffc2d8" transform="rotate(-12 40 9)"/><ellipse cx="60" cy="8" rx="5" ry="13" fill="#fff" stroke="#cbc2d6" stroke-width="1.6" transform="rotate(12 60 8)"/><ellipse cx="60" cy="9" rx="2.4" ry="8" fill="#ffc2d8" transform="rotate(12 60 9)"/><path d="M33 18 Q50 10 67 18" stroke="#ff8cc6" stroke-width="3" fill="none"/>';
    case 'unicorn': return '<path d="M46 18 L50 -4 L54 18Z" fill="#ffe27a" stroke="#e6b400" stroke-width="1.4" stroke-linejoin="round"/><path d="M47 13 L53 11 M48 7 L52 5" stroke="#e6b400" stroke-width="1.2"/><circle cx="38" cy="20" r="3" fill="#ff8cc6"/><circle cx="62" cy="20" r="3" fill="#9b7bff"/>';
    case 'cap': return '<path d="M27 30 Q28 14 50 14 Q72 14 73 30Z" fill="#4fb3ff" stroke="#2a86d6" stroke-width="1.8"/><path d="M60 29 Q78 28 86 33 Q74 35 60 33Z" fill="#2a86d6"/><circle cx="50" cy="15" r="2.4" fill="#2a86d6"/>';
    case 'witchhat': return '<path d="M24 26 Q50 20 76 26 Q50 32 24 26Z" fill="#7b5bd6" stroke="#5a3fb0" stroke-width="1.6"/><path d="M36 25 L54 -6 Q58 6 64 25Z" fill="#9b7bff" stroke="#5a3fb0" stroke-width="1.6" stroke-linejoin="round"/><path d="M38 22 H62" stroke="#ffd23b" stroke-width="3"/><path d="M50 8 L51 11 L54 11 L51.6 13 L52.5 16 L50 14.2 L47.5 16 L48.4 13 L46 11 L49 11Z" fill="#ffd23b"/>';
    case 'bow': return `<path d="M67 21 L56 13 L57 28Z M67 21 L78 13 L77 28Z" fill="#ff5a9a" stroke="#d12f78" stroke-width="1.6" stroke-linejoin="round"/><circle cx="67" cy="21" r="3.6" fill="#ff8cc6" stroke="#d12f78" stroke-width="1.4"/>`;
    case 'flower': return `${Array.from({ length: 5 }, (_, i) => `<circle cx="31" cy="20.5" r="3.6" fill="#fff" stroke="#f0a8c8" stroke-width="1" transform="rotate(${i * 72} 31 25)"/>`).join('')}<circle cx="31" cy="25" r="3" fill="#ffd23b"/>`;
    case 'headband': return `<path d="M28 33 Q50 11 72 33" stroke="#ff5a9a" stroke-width="4.5" fill="none" stroke-linecap="round"/><circle cx="62" cy="21" r="3.5" fill="#ffd23b"/>`;
    case 'star': return `<path d="M33 19 L35.4 25 L41.8 25.4 L36.8 29.4 L38.4 35.6 L33 32.2 L27.6 35.6 L29.2 29.4 L24.2 25.4 L30.6 25Z" fill="#ffd23b" stroke="#e6a100" stroke-width="1.4" stroke-linejoin="round"/>`;
    case 'glasses': return `<circle cx="43.3" cy="44" r="6.6" fill="rgba(255,255,255,.3)" stroke="#7356e0" stroke-width="2"/><circle cx="56.7" cy="44" r="6.6" fill="rgba(255,255,255,.3)" stroke="#7356e0" stroke-width="2"/><path d="M36.7 43 L29 40 M63.3 43 L71 40" stroke="#7356e0" stroke-width="2" stroke-linecap="round"/>`;
    case 'catears': return `<path d="M30 25 L27 5 L45 17Z" fill="${L.hair}" ${HO}/><path d="M32 20 L31 11 L40 17Z" fill="#ffc2d8"/><path d="M70 25 L73 5 L55 17Z" fill="${L.hair}" ${HO}/><path d="M68 20 L69 11 L60 17Z" fill="#ffc2d8"/>`;
    case 'crown': return `<path d="M35 20 L37 4 L45 13 L50 2 L55 13 L63 4 L65 20Z" fill="#ffd23b" stroke="#e6a100" stroke-width="1.8" stroke-linejoin="round"/><circle cx="50" cy="14" r="2.4" fill="#ff5a7a"/><circle cx="41" cy="15.5" r="1.8" fill="#4fb3ff"/><circle cx="59" cy="15.5" r="1.8" fill="#62cc5c"/>`;
    default: return '';
  }
}

function headFront(L) {
  const [skin, skinO] = SKINS[L.skin] || SKINS[0];
  return `<circle cx="50" cy="40" r="23" fill="${skin}" stroke="${skinO}" stroke-width="2.4"/>${hairFront(L)}${face(50, 44, 0.95, { eye: EYES[L.eyes] || EYES.dark })}${cheek(L)}${accessory(L)}`;
}

export function avatarHead(look) {
  const L = normLook(look);
  return svg(hairBack(L) + headFront(L), { vb: '10 -8 80 80' });
}

const EMBLEMS = {
  dino: '<path d="M40 92 Q40 82 48 80 Q52 74 58 76 Q62 78 60 82 L56 82 Q60 86 58 92 L55 92 L54 88 L48 88 L47 92Z" fill="#fff" opacity=".9"/><circle cx="57" cy="78.5" r=".9" fill="#3fa34a"/>',
  horn: '<path d="M47 92 L50 74 L53 92Z" fill="#ffe27a" stroke="#e6b400" stroke-width="1"/><circle cx="43" cy="80" r="1.6" fill="#ff8cc6"/><circle cx="57" cy="80" r="1.6" fill="#9b7bff"/>',
  moon: '<path d="M54 76 A8 8 0 1 0 54 92 A6 6 0 1 1 54 76Z" fill="#fff6a0"/>',
  shell: '<path d="M42 90 Q50 72 58 90Z" fill="#ffc2dc" stroke="#e2559a" stroke-width="1"/><path d="M50 76 V90 M46 80 L48 90 M54 80 L52 90" stroke="#e2559a" stroke-width=".8"/>',
  snow: '<path d="M50 76 V92 M43 80 L57 88 M57 80 L43 88" stroke="#fff" stroke-width="2" stroke-linecap="round"/>',
  heart: '<path d="M50 92 C44 86 40 82 43 78 C45 75 49 76 50 79 C51 76 55 75 57 78 C60 82 56 86 50 92Z" fill="#fff"/>',
  star: '<path d="M50 75 L52.6 81.4 L59.5 81.9 L54.2 86.3 L55.9 93 L50 89.3 L44.1 93 L45.8 86.3 L40.5 81.9 L47.4 81.4Z" fill="#fff"/>',
  flower: `${Array.from({ length: 5 }, (_, i) => `<circle cx="50" cy="79" r="3.6" fill="#fff" transform="rotate(${i * 72} 50 84)"/>`).join('')}<circle cx="50" cy="84" r="3" fill="#ff8cc6"/>`,
  bolt: '<path d="M53 74 L44 86 L50 86 L47 95 L57 82 L51 82Z" fill="#fff"/>',
  gem: '<path d="M50 76 L56 82 L50 92 L44 82Z" fill="#fff" opacity=".9"/><path d="M38 70 L39 73 L42 74 L39 75 L38 78 L37 75 L34 74 L37 73Z M62 88 L63 91 L66 92 L63 93 L62 96 L61 93 L58 92 L61 91Z" fill="#fff" opacity=".8"/>',
};

export function avatar(look, beltColor = '#ffffff', { outfit = 'gi', mic = false } = {}) {
  const L = normLook(look);
  const out = '#c9c2d6';
  const [skin, skinO] = SKINS[L.skin] || SKINS[0];
  const beltStroke = beltColor.toLowerCase() === '#ffffff' ? '#d8d0e2' : 'rgba(0,0,0,.18)';
  const arm = (d, sleeve, sleeveO) => `
      <path d="${d}" stroke="${sleeveO}" stroke-width="12" fill="none" stroke-linecap="round"/>
      <path d="${d}" stroke="${sleeve}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
  const armL = 'M35 70 Q22 80 27 93', armR = 'M65 70 Q80 66 88 56';
  const bareLegs = (c, cO) => `
      <path d="M44 100 L42 131 M56 100 L58 131" stroke="${cO}" stroke-width="10" stroke-linecap="round"/>
      <path d="M44 100 L42 131 M56 100 L58 131" stroke="${c}" stroke-width="6.5" stroke-linecap="round"/>`;
  const [shoeC, shoeO] = SHOES[L.shoes] || SHOES.white;
  const sneakers = L.shoes === 'boots'
    ? `<path d="M33 124 H45 V134 Q45 137 41 137 H31 Q30 133 33 131Z M55 124 H67 V131 Q70 133 69 137 H59 Q55 137 55 134Z" fill="${shoeC}" stroke="${shoeO}" stroke-width="1.8" stroke-linejoin="round"/>`
    : `<ellipse cx="39" cy="134" rx="8" ry="4" fill="${shoeC}" stroke="${shoeO}" stroke-width="1.8"/>
      <ellipse cx="61" cy="134" rx="8" ry="4" fill="${shoeC}" stroke="${shoeO}" stroke-width="1.8"/>
      ${L.shoes === 'gold' || L.shoes === 'purple' ? '<circle cx="36" cy="133" r=".9" fill="#fff"/><circle cx="64" cy="133" r=".9" fill="#fff"/>' : ''}`;
  let cape = '';
  let legs, torso, sleeve = skin, sleeveO = skinO;
  if (outfit === 'tutu') {
    const T = TUTUS[L.tutu] || TUTUS.pink;
    legs = `${bareLegs(T.tights, T.tightsO)}
      <ellipse cx="40" cy="134" rx="6.5" ry="3.4" fill="${T.body}" stroke="${T.bodyO}" stroke-width="1.6"/>
      <ellipse cx="60" cy="134" rx="6.5" ry="3.4" fill="${T.body}" stroke="${T.bodyO}" stroke-width="1.6"/>`;
    torso = `
      <path d="M36 67 Q50 60 64 67 L62 99 L38 99Z" fill="${T.body}" stroke="${T.bodyO}" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M22 101 Q50 88 78 101 Q74 110 64 107 Q57 113 50 108 Q43 113 36 107 Q26 110 22 101Z" fill="${T.skirt}" stroke="${T.body}" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M28 100 Q50 92 72 100" stroke="#fff" stroke-width="2" fill="none" opacity=".7"/>
      <circle cx="50" cy="72" r="2.4" fill="#fff"/>`;
  } else if (outfit === 'casual') {
    const O = OUTFITS[L.casual] || OUTFITS.heart;
    if (O.cape) cape = `<path d="M34 66 Q22 100 26 126 Q50 132 74 126 Q78 100 66 66Z" fill="${O.cape}" stroke="#a82a24" stroke-width="2" stroke-linejoin="round"/>`;
    legs = O.skirt
      ? bareLegs(skin, skinO) + sneakers
      : `<path d="M37 100 L34 131 L46 131 L50 108 L54 131 L66 131 L63 100Z" fill="${O.legs}" stroke="${O.legsO}" stroke-width="2.4" stroke-linejoin="round"/>${sneakers}`;
    torso = `<path d="M32 67 Q50 59 68 67 L66 102 L34 102Z" fill="${O.shirt}" stroke="${O.shirtO}" stroke-width="2.4" stroke-linejoin="round"/>`;
    if (O.dots) torso += [[40, 72], [58, 70], [46, 96], [62, 94], [38, 88]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="${O.dots}"/>`).join('');
    if (O.coat) torso += `<path d="M32 67 Q50 59 68 67 L70 116 L30 116Z" fill="${O.shirt}" stroke="${O.shirtO}" stroke-width="2.4" stroke-linejoin="round"/><path d="M50 66 V116" stroke="${O.shirtO}" stroke-width="2"/>${[76, 88, 100].map((y) => `<circle cx="54" cy="${y}" r="1.8" fill="${O.shirtO}"/>`).join('')}`;
    if (O.sailor) torso += '<path d="M36 66 L50 84 L64 66 L60 64 L50 76 L40 64Z" fill="#2f4a8a"/><path d="M47 82 L50 92 L53 82Z" fill="#ff5a5a"/>';
    if (O.stripes) torso += `<path d="M34 73 H66 M34 81 H66 M35 89 H65 M35 97 H65" stroke="${O.stripes}" stroke-width="3.2"/>`;
    if (O.overall) torso += `<path d="M42 78 L40 65 M58 78 L60 65" stroke="${O.legs}" stroke-width="4" stroke-linecap="round"/><rect x="40" y="76" width="20" height="18" rx="3" fill="${O.legs}" stroke="${O.legsO}" stroke-width="2"/><path d="M34 92 H66 L66 102 H34Z" fill="${O.legs}" stroke="${O.legsO}" stroke-width="2" stroke-linejoin="round"/><circle cx="50" cy="84" r="2.6" fill="#ffd23b"/>`;
    else if (O.emblem) torso += EMBLEMS[O.emblem];
    if (O.skirt) {
      torso += O.long
        ? `<path d="M33 96 Q50 90 67 96 L80 127 Q50 137 20 127Z" fill="${O.skirt}" stroke="${O.skirtO}" stroke-width="2.4" stroke-linejoin="round"/><path d="M24 121 Q50 130 76 121" stroke="#fff" stroke-width="2" fill="none" opacity=".6"/>`
        : `<path d="M31 97 Q50 91 69 97 L76 116 Q50 125 24 116Z" fill="${O.skirt}" stroke="${O.skirtO}" stroke-width="2.4" stroke-linejoin="round"/>`;
      if (O.fin) torso += `<path d="M20 127 Q10 138 22 138 L36 131 M80 127 Q90 138 78 138 L64 131" fill="${O.skirt}" stroke="${O.skirtO}" stroke-width="2"/>${[[38, 108], [50, 112], [62, 108], [44, 120], [56, 120]].map(([x, y]) => `<path d="M${x - 4} ${y} Q${x} ${y + 5} ${x + 4} ${y}" stroke="${O.skirtO}" stroke-width="1.4" fill="none"/>`).join('')}`;
      if (O.rainbow) torso += `<path d="M27 107 Q50 115 73 107" stroke="#ffd23b" stroke-width="3" fill="none"/><path d="M26 111.5 Q50 119.5 74 111.5" stroke="#4fb3ff" stroke-width="3" fill="none"/>`;
    }
  } else {
    sleeve = '#fff'; sleeveO = out;
    legs = `
      <path d="M37 100 L33 132 L46 132 L50 108 L54 132 L67 132 L63 100Z" fill="#fff" stroke="${out}" stroke-width="2.4" stroke-linejoin="round"/>
      <ellipse cx="39" cy="134" rx="7" ry="3.4" fill="${skin}" stroke="${skinO}" stroke-width="1.8"/>
      <ellipse cx="61" cy="134" rx="7" ry="3.4" fill="${skin}" stroke="${skinO}" stroke-width="1.8"/>`;
    torso = `
      <path d="M32 67 Q50 59 68 67 L66 102 L34 102Z" fill="#fff" stroke="${out}" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M42 64 L55 90 M58 64 L48 84" stroke="${out}" stroke-width="2.4" stroke-linecap="round"/>
      <rect x="33" y="87" width="34" height="7" rx="2.5" fill="${beltColor}" stroke="${beltStroke}" stroke-width="1.5"/>
      <path d="M48 94 L44 106 M52 94 L56 106" stroke="${beltColor}" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M48 94 L44 106 M52 94 L56 106" stroke="${beltStroke}" stroke-width="1" stroke-linecap="round" fill="none" opacity=".6"/>`;
  }
  const micSvg = mic ? `<g transform="rotate(-25 90 52)"><rect x="87.5" y="50" width="5" height="15" rx="2" fill="#5a4a5e"/><circle cx="90" cy="46" r="6" fill="#d9d2df" stroke="#8a7a96" stroke-width="1.8"/></g>` : '';
  return svg(`
    <ellipse cx="50" cy="136" rx="26" ry="4" fill="rgba(0,0,0,.12)"/>
    ${cape}
    ${hairBack(L)}
    ${legs}
    <g class="arm-l">${arm(armL, sleeve, sleeveO)}<circle cx="27" cy="95" r="5" fill="${skin}" stroke="${skinO}" stroke-width="1.8"/></g>
    ${torso}
    <g class="arm-r">${arm(armR, sleeve, sleeveO)}${micSvg}<ellipse cx="90" cy="53" rx="4" ry="6.5" fill="${skin}" stroke="${skinO}" stroke-width="1.8" transform="rotate(35 90 53)"/></g>
    ${headFront(L)}
    ${outfit === 'casual' && (OUTFITS[L.casual] || {}).scarf ? `<path d="M36 62 Q50 70 64 62 L64 68 Q50 76 36 68Z M56 66 L60 84 L54 84 L52 68Z" fill="${OUTFITS[L.casual].scarf}" stroke="#2a86d6" stroke-width="1.4" stroke-linejoin="round"/>` : ''}`, { vb: '0 -8 100 148', par: 'xMidYMax meet' });
}

// ---------- Kleinteile & Icons ----------
export const star = () => svg(`<path d="M50 9 L61 36 L90 38 L68 57 L75 86 L50 70 L25 86 L32 57 L10 38 L39 36Z" fill="#ffd23b" stroke="#e6a100" stroke-width="6" stroke-linejoin="round"/><ellipse cx="40" cy="42" rx="5" ry="3" fill="#fff" opacity=".6" transform="rotate(-30 40 42)"/>`);

export const drop = () => svg(`<path d="M50 8 C50 8 20 46 20 64 A30 30 0 0 0 80 64 C80 46 50 8 50 8Z" fill="#4fb3ff" stroke="#2a86d6" stroke-width="6"/><ellipse cx="38" cy="62" rx="5" ry="8" fill="#fff" opacity=".6"/>`);

export const beltIcon = (color) => svg(`
  <rect x="2" y="14" width="96" height="16" rx="5" fill="${color}" stroke="rgba(0,0,0,.25)" stroke-width="2.5"/>
  <path d="M44 28 L34 48 M56 28 L66 48" stroke="${color}" stroke-width="9" stroke-linecap="round"/>
  <path d="M44 28 L34 48 M56 28 L66 48" stroke="rgba(0,0,0,.2)" stroke-width="1.5" stroke-linecap="round"/>
  <rect x="40" y="10" width="20" height="24" rx="5" fill="${color}" stroke="rgba(0,0,0,.25)" stroke-width="2.5"/>`, { vb: '0 0 100 50' });

export const wateringCan = () => svg(`
  <path d="M70 46 L92 26 L96 30 L76 56Z" fill="#8fd0ff" stroke="#3b8fd6" stroke-width="3" stroke-linejoin="round"/>
  <ellipse cx="94" cy="27" rx="5" ry="7" fill="#8fd0ff" stroke="#3b8fd6" stroke-width="3" transform="rotate(45 94 27)"/>
  <path d="M30 34 Q30 18 50 18 Q70 18 70 34" stroke="#ff7eb6" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M22 36 L78 36 L72 86 Q50 92 28 86Z" fill="#ff9ccb" stroke="#e2559a" stroke-width="3.2" stroke-linejoin="round"/>
  ${face(50, 60, 1)}`);

export const basket = () => svg(`
  <path d="M30 46 Q50 6 70 46" stroke="#c97a35" stroke-width="7" fill="none" stroke-linecap="round"/>
  <circle cx="40" cy="44" r="12" fill="#ff5a4e" stroke="#d63a30" stroke-width="3"/>
  <path d="M60 50 L66 26 M62 30 L70 22 M62 30 L56 22" stroke="#2f8f3a" stroke-width="4" stroke-linecap="round"/>
  <path d="M16 46 L84 46 L76 86 Q50 92 24 86Z" fill="#ffb86b" stroke="#c97a35" stroke-width="4" stroke-linejoin="round"/>
  <path d="M22 60 L78 60 M26 74 L74 74" stroke="#c97a35" stroke-width="3"/>`);

export const sproutIcon = () => svg(`
  <path d="M14 78 Q50 66 86 78 L86 92 L14 92Z" fill="#a8754d" stroke="#734a2e" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M50 76 Q50 56 50 46" stroke="#3fa34a" stroke-width="5" stroke-linecap="round" fill="none"/>
  <path d="M50 52 Q30 32 18 42 Q30 60 50 52Z" ${LEAF}/>
  <path d="M50 48 Q68 26 82 36 Q70 56 50 48Z" ${LEAF}/>`);

export const dojoIcon = () => svg(`
  <path d="M10 40 L50 14 L90 40Z" fill="#e2453c" stroke="#a82a24" stroke-width="3.5" stroke-linejoin="round"/>
  <rect x="20" y="40" width="60" height="46" fill="#fff4e0" stroke="#b98245" stroke-width="3.5"/>
  <path d="M50 40 L50 86 M20 62 L80 62" stroke="#b98245" stroke-width="3"/>
  <rect x="26" y="68" width="48" height="8" rx="2" fill="#3a2a35"/>`);

export const iconSound = () => svg(`<path d="M18 38 L36 38 L56 20 L56 80 L36 62 L18 62Z" fill="#9b7bff" stroke="#6d4fd6" stroke-width="4" stroke-linejoin="round"/><path d="M68 34 Q78 50 68 66 M76 24 Q92 50 76 76" stroke="#6d4fd6" stroke-width="6" fill="none" stroke-linecap="round"/>`);
export const iconMute = () => svg(`<path d="M18 38 L36 38 L56 20 L56 80 L36 62 L18 62Z" fill="#cfc3e6" stroke="#9a8cb8" stroke-width="4" stroke-linejoin="round"/><path d="M68 38 L88 62 M88 38 L68 62" stroke="#e2559a" stroke-width="7" stroke-linecap="round"/>`);
export const iconLock = () => svg(`<path d="M32 44 V32 Q32 14 50 14 Q68 14 68 32 V44" stroke="#9a8cb8" stroke-width="8" fill="none"/><rect x="22" y="42" width="56" height="44" rx="10" fill="#cfc3e6" stroke="#9a8cb8" stroke-width="4"/><circle cx="50" cy="62" r="6" fill="#7a6a96"/>`);
export const iconSpeaker = () => svg(`<path d="M18 38 L36 38 L56 20 L56 80 L36 62 L18 62Z" fill="#ff9ccb" stroke="#e2559a" stroke-width="4" stroke-linejoin="round"/><path d="M68 34 Q78 50 68 66 M76 24 Q92 50 76 76" stroke="#e2559a" stroke-width="6" fill="none" stroke-linecap="round"/>`);
export const bolt = () => svg(`<path d="M58 6 L22 56 L46 56 L38 94 L78 40 L54 40Z" fill="#ffd23b" stroke="#e6a100" stroke-width="5" stroke-linejoin="round"/>`);

export const sun = () => svg(`
  <g class="rays">${Array.from({ length: 12 }, (_, i) => `<path d="M50 4 L54 16 L46 16Z" fill="#ffc93b" transform="rotate(${i * 30} 50 50)"/>`).join('')}</g>
  <circle cx="50" cy="50" r="30" fill="#ffe14d" stroke="#f5b400" stroke-width="3"/>
  ${face(50, 50, 1.3)}`);

export const hills = () => svg(`
  <path d="M0 70 Q15 30 35 52 Q55 20 75 48 Q90 32 100 46 L100 100 L0 100Z" fill="#b7e79a"/>
  <path d="M0 82 Q25 50 50 72 Q75 52 100 70 L100 100 L0 100Z" fill="#9edb7c"/>
  <path d="M0 92 Q50 74 100 90 L100 100 L0 100Z" fill="#8fd46b"/>`, { par: 'none' });

export const fence = () => {
  let p = '';
  for (let x = 2; x < 400; x += 22) {
    p += `<path d="M${x} 46 L${x} 14 L${x + 7} 6 L${x + 14} 14 L${x + 14} 46Z" fill="#fff6e8" stroke="#d9b98f" stroke-width="2.5" stroke-linejoin="round"/>`;
  }
  return svg(`<rect x="0" y="18" width="400" height="7" rx="3" fill="#f3dfc4" stroke="#d9b98f" stroke-width="2"/><rect x="0" y="34" width="400" height="7" rx="3" fill="#f3dfc4" stroke="#d9b98f" stroke-width="2"/>${p}`, { vb: '0 0 400 50', par: 'xMinYMax slice' });
};

export const boardHalf = (side) => {
  const body = side === 'l'
    ? `<path d="M4 6 L100 6 L94 26 L102 46 L95 66 L100 94 L4 94Z" fill="#eebd7f" stroke="#b98245" stroke-width="4" stroke-linejoin="round"/>
       <path d="M16 30 Q50 24 84 32 M14 62 Q46 70 82 60" stroke="#d09a5a" stroke-width="3" fill="none" stroke-linecap="round"/>`
    : `<path d="M0 6 L96 6 L96 94 L0 94 L-5 66 L2 46 L-6 26Z" fill="#eebd7f" stroke="#b98245" stroke-width="4" stroke-linejoin="round"/>
       <path d="M10 32 Q46 26 84 30 M12 60 Q50 68 84 62" stroke="#d09a5a" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  return svg(body, { vb: '0 0 100 100', par: 'none' });
};

export const appIcon = () => svg(`
  <rect width="100" height="100" fill="#bfe8ff"/>
  <path d="M0 70 Q50 56 100 70 L100 100 L0 100Z" fill="#8fd46b"/>
  <g transform="translate(14 6) scale(.72)">${PLANT_ART.sunflower()}</g>`);

// ---------- Vokabel-Bilder ----------
const O = (c) => `stroke="${c}" stroke-width="2.6" stroke-linejoin="round"`;
const THINGS = {
  cat: () => `
    <path d="M28 44 L26 18 L46 34Z" fill="#ffb066" ${O('#d98a3a')}/><path d="M72 44 L74 18 L54 34Z" fill="#ffb066" ${O('#d98a3a')}/>
    <path d="M31 38 L30 25 L41 34Z" fill="#ffc2d8"/><path d="M69 38 L70 25 L59 34Z" fill="#ffc2d8"/>
    <ellipse cx="50" cy="58" rx="30" ry="26" fill="#ffb066" ${O('#d98a3a')}/>
    <path d="M44 36 L46 44 M50 34 L50 43 M56 36 L54 44" stroke="#e8913f" stroke-width="3" stroke-linecap="round"/>
    ${face(50, 56, 0.9, { mouth: false })}
    <path d="M47 62 L53 62 L50 65Z" fill="#ff7aa8"/>
    <path d="M50 65 Q47 69 44 67 M50 65 Q53 69 56 67" stroke="${INK}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M24 60 L10 57 M24 65 L10 67 M76 60 L90 57 M76 65 L90 67" stroke="#d98a3a" stroke-width="1.6" stroke-linecap="round"/>`,
  dog: () => `
    <ellipse cx="25" cy="50" rx="10" ry="20" fill="#a8703e" ${O('#7a4a2c')} transform="rotate(15 25 50)"/>
    <ellipse cx="75" cy="50" rx="10" ry="20" fill="#a8703e" ${O('#7a4a2c')} transform="rotate(-15 75 50)"/>
    <ellipse cx="50" cy="55" rx="27" ry="27" fill="#ecc89e" ${O('#b98d62')}/>
    <ellipse cx="62" cy="44" rx="8" ry="7" fill="#d9a974"/>
    <ellipse cx="50" cy="68" rx="13" ry="10" fill="#fff3e4"/>
    ${face(50, 52, 0.9, { mouth: false })}
    <ellipse cx="50" cy="63" rx="4.5" ry="3.2" fill="${INK}"/>
    <path d="M50 66 L50 70 Q46 74 43 71 M50 70 Q54 74 57 71" stroke="${INK}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M47 72 Q50 80 53 72Z" fill="#ff7aa8"/>`,
  fish: () => `
    <path d="M74 52 L94 36 L92 68Z" fill="#ff9a2e" ${O('#d96f12')}/>
    <path d="M44 34 Q52 20 62 34Z" fill="#ff9a2e" ${O('#d96f12')}/>
    <ellipse cx="46" cy="52" rx="32" ry="21" fill="#4fb3ff" ${O('#2a86d6')}/>
    <path d="M56 38 Q62 52 56 66" stroke="#2a86d6" stroke-width="2.4" fill="none"/>
    <circle cx="30" cy="48" r="4.5" fill="${INK}"/><circle cx="31.5" cy="46.5" r="1.4" fill="#fff"/>
    <path d="M20 58 Q25 62 30 58" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <ellipse cx="37" cy="57" rx="3.2" ry="1.9" fill="#ff7aa8" opacity=".6"/>
    <circle cx="12" cy="34" r="3" fill="none" stroke="#7cc8ff" stroke-width="2"/><circle cx="18" cy="24" r="2" fill="none" stroke="#7cc8ff" stroke-width="2"/>`,
  bird: () => `
    <path d="M46 34 Q44 22 52 24 Q50 28 54 32" fill="#ffb02e" ${O('#e08a00')}/>
    <path d="M42 86 L40 94 M58 86 L60 94" stroke="#ff9a2e" stroke-width="3" stroke-linecap="round"/>
    <circle cx="50" cy="60" r="28" fill="#ffd23b" ${O('#e6a100')}/>
    <path d="M24 62 Q12 56 16 72 Q24 74 30 68Z" fill="#ffc21a" ${O('#e6a100')}/>
    <path d="M76 62 Q88 56 84 72 Q76 74 70 68Z" fill="#ffc21a" ${O('#e6a100')}/>
    ${face(50, 56, 0.85, { mouth: false })}
    <path d="M45 61 L55 61 L50 67Z" fill="#ff8a2e" ${O('#e06a00')}/>`,
  apple: () => `
    <path d="M50 30 Q50 22 54 16" stroke="#7a4a2c" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M53 26 Q64 14 74 22 Q64 32 53 26Z" ${LEAF}/>
    <path d="M50 32 C38 24 20 30 22 54 C24 76 38 90 50 84 C62 90 76 76 78 54 C80 30 62 24 50 32Z" fill="#ff4f4f" ${O('#d12f2f')}/>
    <ellipse cx="34" cy="46" rx="5" ry="8" fill="#fff" opacity=".35" transform="rotate(20 34 46)"/>
    ${face(50, 58)}`,
  banana: () => `
    <path d="M80 18 Q86 54 60 78 Q36 96 16 82 Q14 78 20 78 Q44 82 60 60 Q74 40 72 20Z" fill="#ffe14d" ${O('#e6b400')}/>
    <path d="M72 20 L74 12 L82 14 L80 18Z" fill="#8a6a2a" ${O('#5e4515')}/>
    <path d="M16 82 L12 84" stroke="#5e4515" stroke-width="4" stroke-linecap="round"/>
    ${face(58, 64, 0.8)}`,
  sun: () => `${Array.from({ length: 12 }, (_, i) => `<path d="M50 4 L55 18 L45 18Z" fill="#ffc93b" transform="rotate(${i * 30} 50 50)"/>`).join('')}
    <circle cx="50" cy="50" r="28" fill="#ffe14d" ${O('#f5b400')}/>${face(50, 50, 1.2)}`,
  moon: () => `
    <path d="M62 12 A38 38 0 1 0 88 66 A30 30 0 1 1 62 12Z" fill="#ffe27a" ${O('#e6b400')}/>
    <path d="M28 52 Q32 56 36 52 M44 60 Q48 64 52 60" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M36 66 Q40 70 44 66" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <ellipse cx="30" cy="62" rx="3.2" ry="1.9" fill="#ff7aa8" opacity=".55"/>
    <path d="M80 22 L82 28 L88 30 L82 32 L80 38 L78 32 L72 30 L78 28Z" fill="#ffd23b"/>`,
  star: () => `<path d="M50 9 L61 36 L90 38 L68 57 L75 86 L50 70 L25 86 L32 57 L10 38 L39 36Z" fill="#ffd23b" stroke="#e6a100" stroke-width="4" stroke-linejoin="round"/>${face(50, 52, 0.8)}`,
  flower: () => `
    <path d="M50 94 L50 56" stroke="#3fa34a" stroke-width="5" stroke-linecap="round"/>
    <path d="M50 82 Q36 70 28 76 Q38 88 50 84Z" ${LEAF}/>
    ${Array.from({ length: 6 }, (_, i) => `<circle cx="50" cy="20" r="13" fill="#ff8cc6" stroke="#e2559a" stroke-width="2.4" transform="rotate(${i * 60} 50 38)"/>`).join('')}
    <circle cx="50" cy="38" r="12" fill="#ffd23b" ${O('#e6a100')}/>${face(50, 38, 0.65)}`,
  tree: () => `
    <path d="M44 94 L46 60 L54 60 L56 94Z" fill="#a8703e" ${O('#7a4a2c')}/>
    <circle cx="34" cy="46" r="18" fill="#62cc5c" ${O('#2f8f3a')}/><circle cx="66" cy="46" r="18" fill="#62cc5c" ${O('#2f8f3a')}/>
    <circle cx="50" cy="32" r="22" fill="#62cc5c" ${O('#2f8f3a')}/><circle cx="50" cy="52" r="18" fill="#62cc5c"/>
    <circle cx="30" cy="50" r="3.5" fill="#ff4f4f"/><circle cx="68" cy="40" r="3.5" fill="#ff4f4f"/><circle cx="58" cy="58" r="3.5" fill="#ff4f4f"/>
    ${face(48, 40, 0.8)}`,
  house: () => `
    <rect x="22" y="46" width="56" height="44" rx="3" fill="#ffe3b8" ${O('#d9a86a')}/>
    <path d="M14 50 L50 18 L86 50Z" fill="#ff6b5e" ${O('#c9443a')}/>
    <rect x="62" y="22" width="9" height="16" fill="#b0806a" ${O('#7a5040')}/>
    <path d="M42 90 L42 70 Q50 62 58 70 L58 90Z" fill="#a8703e" ${O('#7a4a2c')}/>
    <rect x="28" y="56" width="11" height="11" rx="2" fill="#8fd0ff" ${O('#3b8fd6')}/>
    <rect x="61" y="56" width="11" height="11" rx="2" fill="#8fd0ff" ${O('#3b8fd6')}/>
    <path d="M50 38 C47 35 45 33 46.5 31 C48 30 49.5 30.5 50 32 C50.5 30.5 52 30 53.5 31 C55 33 53 35 50 38Z" fill="#fff"/>`,
  heart: () => `<path d="M50 88 C20 66 8 48 16 32 C24 16 44 18 50 32 C56 18 76 16 84 32 C92 48 80 66 50 88Z" fill="#ff5a7a" ${O('#d12f4f')}/>
    <ellipse cx="30" cy="36" rx="6" ry="4" fill="#fff" opacity=".45" transform="rotate(-35 30 36)"/>${face(50, 50, 0.95)}`,
  ball: () => `
    <circle cx="50" cy="52" r="34" fill="#fff" ${O('#c9c2d6')}/>
    <path d="M50 18 A34 34 0 0 1 84 52 L50 52Z" fill="#ff7eb6"/><path d="M16 52 A34 34 0 0 0 50 86 L50 52Z" fill="#4fb3ff"/>
    <path d="M50 18 A34 34 0 0 0 16 52 L50 52Z" fill="#ffd23b"/>
    <circle cx="50" cy="52" r="34" fill="none" ${O('#9a8cb8')}/>
    <ellipse cx="36" cy="34" rx="7" ry="4" fill="#fff" opacity=".6" transform="rotate(-35 36 34)"/>`,
};

export function thing(id) { return svg((THINGS[id] || THINGS.star)()); }

export function colorBlob(color) {
  const stroke = color.toLowerCase() === '#ffffff' ? '#c9c2d6' : 'rgba(0,0,0,.22)';
  return svg(`<path d="M50 12 C66 10 74 22 84 28 C96 36 90 50 88 60 C86 74 92 86 76 90 C62 94 56 84 44 88 C28 92 12 86 12 70 C12 58 4 48 12 36 C20 24 34 14 50 12Z" fill="${color}" stroke="${stroke}" stroke-width="3"/>
    <ellipse cx="34" cy="34" rx="9" ry="5" fill="#fff" opacity=".45" transform="rotate(-30 34 34)"/>`);
}

const NUM_COLORS = ['#ff7eb6', '#9b7bff', '#4fb3ff', '#62cc5c', '#ff9a2e', '#ff5a7a', '#3fb8a8', '#e6a100', '#7b5bd6', '#ff6b5e'];
export function numberCard(n) {
  const c = NUM_COLORS[(n - 1) % NUM_COLORS.length];
  return svg(`<circle cx="50" cy="50" r="40" fill="${c}" stroke="rgba(0,0,0,.15)" stroke-width="3"/>
    <text x="50" y="52" text-anchor="middle" dominant-baseline="central" font-family="Nunito, sans-serif" font-weight="800" font-size="52" fill="#fff">${n}</text>`);
}

// ---------- Perlen ----------
export function beadBody(b) {
  const { color = '#ff7eb6', shape = 'round', label = null } = b || {};
  const dark = 'rgba(0,0,0,.22)';
  let body;
  if (shape === 'heart') body = `<path d="M50 86 C22 66 10 50 18 34 C26 18 44 20 50 34 C56 20 74 18 82 34 C90 50 78 66 50 86Z" fill="${color}" stroke="${dark}" stroke-width="4"/>`;
  else if (shape === 'star') body = `<path d="M50 8 L61 36 L91 38 L68 57 L76 88 L50 71 L24 88 L32 57 L9 38 L39 36Z" fill="${color}" stroke="${dark}" stroke-width="4" stroke-linejoin="round"/>`;
  else if (shape === 'flower') body = `${Array.from({ length: 5 }, (_, i) => `<circle cx="50" cy="26" r="17" fill="${color}" stroke="${dark}" stroke-width="3.5" transform="rotate(${i * 72} 50 50)"/>`).join('')}<circle cx="50" cy="50" r="14" fill="#fff6c2" stroke="${dark}" stroke-width="3"/>`;
  else if (shape === 'cube') body = `<rect x="14" y="14" width="72" height="72" rx="14" fill="${color}" stroke="${dark}" stroke-width="4"/>`;
  else body = `<circle cx="50" cy="50" r="38" fill="${color}" stroke="${dark}" stroke-width="4"/>`;
  const shine = `<ellipse cx="36" cy="34" rx="9" ry="6" fill="#fff" opacity=".5" transform="rotate(-30 36 34)"/>`;
  const txt = label != null ? `<text x="50" y="52" text-anchor="middle" dominant-baseline="central" font-family="Nunito, sans-serif" font-weight="800" font-size="${String(label).length > 2 ? 28 : 36}" fill="#fff" stroke="rgba(0,0,0,.25)" stroke-width="1.5" paint-order="stroke">${label}</text>` : '';
  return body + shine + txt;
}
export const bead = (b) => svg(beadBody(b));

export const box = () => svg(`
  <path d="M12 44 L88 44 L82 88 Q50 94 18 88Z" fill="#ffb3d6" stroke="#e2559a" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M8 34 Q50 22 92 34 L90 46 Q50 36 10 46Z" fill="#ff8cc6" stroke="#e2559a" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M50 28 L50 90" stroke="#ffd23b" stroke-width="6"/>
  <path d="M50 28 C40 14 30 18 36 26 C40 30 46 30 50 28 C54 30 60 30 64 26 C70 18 60 14 50 28Z" fill="#ffd23b" stroke="#e6a100" stroke-width="2.5"/>`);

export const micIcon = () => svg(`
  <path d="M30 50 Q30 72 50 72 Q70 72 70 50" stroke="#9b7bff" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M50 72 L50 88 M38 90 L62 90" stroke="#9b7bff" stroke-width="6" stroke-linecap="round"/>
  <rect x="38" y="10" width="24" height="50" rx="12" fill="#ff8cc6" stroke="#e2559a" stroke-width="4"/>
  <path d="M42 24 H58 M42 34 H58 M42 44 H58" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>`);

export const yarnIcon = () => svg(`
  <circle cx="46" cy="54" r="32" fill="#ff8cc6" stroke="#e2559a" stroke-width="4"/>
  <path d="M20 40 Q46 30 72 44 M16 56 Q46 44 76 60 M22 72 Q46 60 70 76 M40 24 Q30 54 44 86 M58 24 Q70 54 58 84" stroke="#e2559a" stroke-width="3" fill="none"/>
  <path d="M76 70 Q90 80 84 94" stroke="#e2559a" stroke-width="4" fill="none" stroke-linecap="round"/>`);

export const climbIcon = () => svg(`
  <path d="M18 92 L30 8 L82 8 L90 92Z" fill="#b8c7d9" stroke="#7d8fa6" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="44" cy="26" r="7" fill="#ff7eb6"/><circle cx="64" cy="44" r="7" fill="#ffd23b"/><circle cx="42" cy="60" r="7" fill="#62cc5c"/><circle cx="66" cy="76" r="7" fill="#9b7bff"/>
  <path d="M58 8 L58 0" stroke="#e2453c" stroke-width="3"/>`);

export const bell = () => svg(`
  <path d="M50 10 L50 18" stroke="#c99257" stroke-width="5" stroke-linecap="round"/>
  <path d="M26 70 Q26 26 50 20 Q74 26 74 70 L82 78 L18 78Z" fill="#ffd23b" stroke="#e6a100" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="50" cy="84" r="7" fill="#e6a100"/>
  <ellipse cx="40" cy="40" rx="5" ry="10" fill="#fff" opacity=".5" transform="rotate(15 40 40)"/>`);

export function hold(color, i) {
  const shapes = [
    'M20 50 C20 26 40 16 56 22 C78 28 84 52 74 70 C62 88 30 86 20 50Z',
    'M16 40 C24 18 64 14 80 30 C92 44 82 72 60 80 C38 88 10 64 16 40Z',
    'M30 18 C52 10 86 30 82 56 C78 80 44 90 26 74 C10 60 12 26 30 18Z',
  ];
  return svg(`<path d="${shapes[i % 3]}" fill="${color}" stroke="rgba(0,0,0,.25)" stroke-width="4"/><ellipse cx="40" cy="38" rx="8" ry="5" fill="#fff" opacity=".45" transform="rotate(-25 40 38)"/><circle cx="52" cy="52" r="5" fill="rgba(0,0,0,.25)"/>`);
}

// ---------- Uhr ----------
export function clock(h, m) {
  const ha = ((h % 12) + m / 60) * 30, ma = m * 6;
  const nums = Array.from({ length: 12 }, (_, i) => {
    const n = i + 1, a = (n * 30 - 90) * Math.PI / 180;
    return `<text x="${(50 + Math.cos(a) * 33).toFixed(1)}" y="${(50 + Math.sin(a) * 33).toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-family="Nunito, sans-serif" font-weight="800" font-size="9" fill="#4a3552">${n}</text>`;
  }).join('');
  const ticks = Array.from({ length: 60 }, (_, i) => `<path d="M50 6 L50 ${i % 5 ? 8 : 10}" stroke="${i % 5 ? '#d9cfe2' : '#9b7bff'}" stroke-width="${i % 5 ? 1 : 2}" transform="rotate(${i * 6} 50 50)"/>`).join('');
  return svg(`
    <circle cx="50" cy="50" r="47" fill="#fff" stroke="#ff8cc6" stroke-width="5"/>
    ${ticks}${nums}
    <path d="M50 50 L50 28" stroke="#ff5a9a" stroke-width="5.5" stroke-linecap="round" transform="rotate(${ha} 50 50)"/>
    <path d="M50 50 L50 13" stroke="#7356e0" stroke-width="3.2" stroke-linecap="round" transform="rotate(${ma} 50 50)"/>
    <circle cx="50" cy="50" r="4" fill="#4a3552"/>`);
}

// ---------- Geld ----------
export function money(c) {
  if (c >= 500) {
    const col = c === 500 ? '#9bb7a8' : c === 1000 ? '#e89a8a' : '#8ab0e8';
    return svg(`<rect x="2" y="22" width="96" height="56" rx="6" fill="${col}" stroke="rgba(0,0,0,.25)" stroke-width="3"/>
      <rect x="8" y="28" width="84" height="44" rx="4" fill="none" stroke="#fff" stroke-width="2" opacity=".6"/>
      <circle cx="74" cy="50" r="12" fill="#fff" opacity=".35"/>
      <text x="34" y="51" text-anchor="middle" dominant-baseline="central" font-family="Nunito, sans-serif" font-weight="800" font-size="26" fill="#fff" stroke="rgba(0,0,0,.25)" stroke-width="1" paint-order="stroke">${c / 100} €</text>`);
  }
  const euro = c >= 100;
  const r = { 10: 30, 20: 34, 50: 38, 100: 36, 200: 40 }[c] || 32;
  const outer = euro ? (c === 200 ? '#e3b34c' : '#c9ccd4') : '#e3b34c';
  const inner = euro ? (c === 200 ? '#c9ccd4' : '#e3b34c') : '#efc75e';
  const label = euro ? `${c / 100} €` : `${c}`;
  return svg(`<circle cx="50" cy="50" r="${r}" fill="${outer}" stroke="rgba(0,0,0,.25)" stroke-width="3"/>
    <circle cx="50" cy="50" r="${r * 0.72}" fill="${inner}"/>
    <text x="50" y="${euro ? 51 : 47}" text-anchor="middle" dominant-baseline="central" font-family="Nunito, sans-serif" font-weight="800" font-size="${euro ? 20 : 24}" fill="#5a4320">${label}</text>
    ${euro ? '' : '<text x="50" y="66" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="800" font-size="11" fill="#5a4320">CENT</text>'}`);
}

export const balletIcon = () => svg(`
  <path d="M30 70 Q50 52 70 70 Q62 78 50 74 Q38 78 30 70Z" fill="#ffc2dc" stroke="#ff8cc6" stroke-width="3"/>
  <path d="M40 24 Q50 18 60 24 L58 58 L42 58Z" fill="#ff8cc6" stroke="#e2559a" stroke-width="3" stroke-linejoin="round"/>
  <path d="M22 86 Q34 74 44 84 Q36 94 22 86Z M78 86 Q66 74 56 84 Q64 94 78 86Z" fill="#ff8cc6" stroke="#e2559a" stroke-width="3"/>
  <path d="M44 84 L40 72 M56 84 L60 72" stroke="#ff8cc6" stroke-width="3" stroke-linecap="round"/>`);

export const bubbleIcon = () => svg(`
  <path d="M14 22 Q14 12 26 12 L74 12 Q86 12 86 22 L86 56 Q86 66 74 66 L44 66 L26 84 L30 66 L26 66 Q14 66 14 56Z" fill="#fff" stroke="#9b7bff" stroke-width="4" stroke-linejoin="round"/>
  <text x="50" y="40" text-anchor="middle" dominant-baseline="central" font-family="Nunito, sans-serif" font-weight="800" font-size="24" fill="#9b7bff">Olá!</text>`);

// ---------- Weltkarte: Gebäude ----------
const inner = (s) => s.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
const put = (s, x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})">${inner(s)}</g>`;
const SHADOW = '<ellipse cx="60" cy="101" rx="50" ry="7" fill="rgba(0,0,0,.13)"/>';

function house({ wall, wallO, roof, roofO, roofPath = 'M10 52 L60 12 L110 52Z', door = '#a8703e', emblem }) {
  return `${SHADOW}
    <rect x="22" y="48" width="76" height="52" rx="4" fill="${wall}" stroke="${wallO}" stroke-width="3"/>
    <path d="${roofPath}" fill="${roof}" stroke="${roofO}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M50 100 L50 80 Q60 70 70 80 L70 100Z" fill="${door}" stroke="rgba(0,0,0,.2)" stroke-width="2"/>
    <rect x="29" y="62" width="14" height="14" rx="3" fill="#bfe8ff" stroke="${wallO}" stroke-width="2.5"/>
    <rect x="77" y="62" width="14" height="14" rx="3" fill="#bfe8ff" stroke="${wallO}" stroke-width="2.5"/>
    <circle cx="60" cy="40" r="15" fill="#fff" stroke="${roofO}" stroke-width="3"/>
    ${put(emblem, 48, 28, 0.24)}`;
}

const PLACE_ART = {
  harbor: () => `
    <ellipse cx="60" cy="92" rx="58" ry="16" fill="#7cc8ff" stroke="#3b8fd6" stroke-width="3"/>
    <path d="M18 92 q6 -4 12 0 t12 0 M70 98 q6 -4 12 0 t12 0" stroke="#fff" stroke-width="2.4" fill="none" opacity=".8"/>
    <rect x="4" y="76" width="34" height="8" rx="2" fill="#c99257" stroke="#8a5a2e" stroke-width="2"/>
    <path d="M10 84 V96 M32 84 V96" stroke="#8a5a2e" stroke-width="3"/>
    <path d="M100 82 L104 36 L114 36 L118 82Z" fill="#fff" stroke="#c9c2d6" stroke-width="2"/>
    <path d="M102.6 54 L115.4 54 L116.4 66 L101.6 66Z M103.7 40 L114.3 40 L114.9 46 L103.1 46Z" fill="#ff5a5a"/>
    <rect x="102" y="28" width="14" height="9" rx="2" fill="#ffd23b" stroke="#e6a100" stroke-width="2"/>
    <path d="M100 28 L109 20 L118 28Z" fill="#ff5a5a" stroke="#c9443a" stroke-width="2" stroke-linejoin="round"/>
    <g transform="translate(26 44) scale(.46)">${shipInner({ flags: false, name: '' })}</g>`,
  garden: () => `
    <ellipse cx="60" cy="96" rx="56" ry="11" fill="#7cc35a"/>
    <path d="M12 92 Q60 80 108 92 L108 98 Q60 106 12 98Z" fill="#9b6a45"/>
    ${put(plant('sunflower'), -6, 14, 0.82)}
    ${put(plant('carrot'), 58, 40, 0.56)}
    ${put(plant('tomato'), 38, 62, 0.36)}
    ${Array.from({ length: 8 }, (_, i) => { const x = 6 + i * 14; return `<path d="M${x} 104 L${x} 90 L${x + 4.5} 85 L${x + 9} 90 L${x + 9} 104Z" fill="#fff6e8" stroke="#d9b98f" stroke-width="2" stroke-linejoin="round"/>`; }).join('')}`,
  dojo: () => `${SHADOW}${put(dojoIcon(), 6, 4, 1.08)}`,
  ballet: () => house({ wall: '#ffe6f0', wallO: '#f0a8c8', roof: '#ff8cc6', roofO: '#e2559a', roofPath: 'M12 52 Q60 -8 108 52Z', door: '#e2559a', emblem: balletIcon() }),
  stage: () => `${SHADOW}
    <path d="M34 32 Q60 4 86 32Z" fill="#ffd23b" stroke="#e6a100" stroke-width="3" stroke-linejoin="round"/>
    <text x="60" y="27" text-anchor="middle" font-size="14" font-weight="800" fill="#8a5a00">♪</text>
    <rect x="14" y="30" width="92" height="70" rx="6" fill="#7b5bd6" stroke="#5a3fb0" stroke-width="3"/>
    <rect x="24" y="42" width="72" height="50" fill="#2d1f4a"/>
    <rect x="24" y="90" width="72" height="10" fill="#c98a4c"/>
    ${put(micIcon(), 44, 48, 0.32)}
    <path d="M24 42 L50 42 Q44 74 24 88Z" fill="#d6334a"/><path d="M96 42 L70 42 Q76 74 96 88Z" fill="#d6334a"/>
    <path d="M20 36 H100 V46 Q92 54 84 46 Q76 54 68 46 Q60 54 52 46 Q44 54 36 46 Q28 54 20 46Z" fill="#e8485f" stroke="#b52238" stroke-width="2" stroke-linejoin="round"/>`,
  craft: () => `<rect x="78" y="18" width="10" height="22" fill="#c9a074" stroke="#9a744a" stroke-width="2.5"/>${house({ wall: '#fff3d6', wallO: '#e0c08a', roof: '#9b7bff', roofO: '#7356e0', emblem: yarnIcon() })}`,
  climb: () => `${SHADOW}${put(climbIcon(), 10, 8, 1)}
    <path d="M68 16 L68 2" stroke="#8a6a52" stroke-width="3" stroke-linecap="round"/><path d="M68 2 L86 7 L68 12Z" fill="#ff5a7a" stroke="#d12f4f" stroke-width="1.5" stroke-linejoin="round"/>`,
  shop: () => `${SHADOW}
    <rect x="20" y="40" width="6" height="60" fill="#c99257"/><rect x="94" y="40" width="6" height="60" fill="#c99257"/>
    <rect x="16" y="74" width="88" height="26" rx="4" fill="#f0c48a" stroke="#c99257" stroke-width="3"/>
    ${put(basket(), 36, 40, 0.48)}
    <path d="M8 46 L20 18 L100 18 L112 46Z" fill="#fff" stroke="#d6566a" stroke-width="3" stroke-linejoin="round"/>
    <path d="M20 18 L36 18 L29 46 L8 46Z M52 18 L68 18 L70 46 L50 46Z M84 18 L100 18 L112 46 L91 46Z" fill="#ff7e8a"/>
    <path d="M8 46 Q18.4 58 28.8 46 Q39.2 58 49.6 46 Q60 58 70.4 46 Q80.8 58 91.2 46 Q101.6 58 112 46Z" fill="#ff7e8a" stroke="#d6566a" stroke-width="2.5" stroke-linejoin="round"/>`,
};
PLACE_ART.forest = () => `<ellipse cx="60" cy="101" rx="52" ry="8" fill="rgba(0,0,0,.12)"/>
    ${[[24, 30, 1], [60, 10, 1.25], [96, 30, 1]].map(([x, y, k]) => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M-3 62 V72 H3 V62Z" fill="#8a5a2e"/><path d="M0 0 L-20 34 H-10 L-24 60 H24 L10 34 H20Z" fill="#3fa34a" stroke="#2a7a33" stroke-width="2.5" stroke-linejoin="round"/></g>`).join('')}
    <path d="M44 100 Q44 90 54 90 Q64 90 64 100Z" fill="#ff5a4e" stroke="#c9443a" stroke-width="2"/><rect x="51" y="99" width="6" height="7" rx="2" fill="#fff6e8"/>
    <circle cx="50" cy="95" r="1.6" fill="#fff"/><circle cx="57" cy="93" r="1.6" fill="#fff"/>
    ${[[82, 98], [92, 98], [87, 92]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#d9a86a" stroke="#8a5a2e" stroke-width="2"/>`).join('')}`;
PLACE_ART.globe = () => `<ellipse cx="60" cy="102" rx="54" ry="6" fill="rgba(0,0,0,.12)"/>
    <rect x="4" y="96" width="112" height="8" rx="3" fill="#8a8f9c"/><path d="M12 100 H28 M40 100 H56 M68 100 H84 M96 100 H110" stroke="#fff" stroke-width="1.6"/>
    <rect x="10" y="64" width="62" height="32" rx="4" fill="#eaf6ff" stroke="#7fa8c9" stroke-width="2.5"/>
    <path d="M8 64 Q41 50 74 64Z" fill="#9b7bff" stroke="#7356e0" stroke-width="2.2" stroke-linejoin="round"/>
    ${[18, 30, 42, 54].map((x) => `<rect x="${x}" y="72" width="8" height="12" rx="2" fill="#7cc8ff" stroke="#3b8fd6" stroke-width="1.4"/>`).join('')}
    <rect x="62" y="80" width="8" height="16" rx="1.5" fill="#ffd23b" stroke="#e6a100" stroke-width="1.4"/>
    <rect x="82" y="40" width="10" height="56" fill="#eaf6ff" stroke="#7fa8c9" stroke-width="2.2"/>
    <path d="M76 40 L98 40 L95 28 L79 28Z" fill="#7cc8ff" stroke="#3b8fd6" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M78 28 Q87 20 96 28Z" fill="#ff5a7a" stroke="#c9443a" stroke-width="2"/><circle cx="87" cy="21" r="2" fill="#ff5a7a"/>
    <g transform="translate(70 18) rotate(-14)">
      <path d="M-26 -3 L14 -3 Q24 0 14 3 L-26 3Z" fill="#fff" stroke="#3a2a35" stroke-width="1.6"/>
      <path d="M-6 -2 L-14 -16 L-8 -16 L6 -2Z M-6 2 L-14 16 L-8 16 L6 2Z" fill="#ff7eb6" stroke="#3a2a35" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M-24 -2 L-30 -10 L-26 -10 L-19 -2Z" fill="#ff7eb6" stroke="#3a2a35" stroke-width="1.3" stroke-linejoin="round"/>
      ${[8, 2, -4, -10, -16].map((x) => `<circle cx="${x}" cy="0" r="1.3" fill="#7cc8ff"/>`).join('')}
    </g>
    <path d="M30 22 Q20 26 8 24" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/>`;

export function place(id, stage = 0) {
  if (id === 'house') return svg(`<g transform="translate(-10 -12) scale(.7)">${inner(homeStage(stage))}</g>`, { vb: '0 0 120 110', par: 'xMidYMax meet' });
  return svg((PLACE_ART[id] || PLACE_ART.garden)(), { vb: '0 0 120 110', par: 'xMidYMax meet' });
}

export const mapIcon = () => svg(`
  <path d="M10 26 L36 16 L64 26 L90 16 L90 78 L64 88 L36 78 L10 88Z" fill="#fff3d6" stroke="#c99257" stroke-width="5" stroke-linejoin="round"/>
  <path d="M36 16 V78 M64 26 V88" stroke="#e0c08a" stroke-width="4"/>
  <path d="M50 28 C38 28 34 42 50 62 C66 42 62 28 50 28Z" fill="#ff5a7a" stroke="#d12f4f" stroke-width="3"/><circle cx="50" cy="40" r="4.5" fill="#fff"/>`);

export const mapPath = () => svg(`
  <path d="M-2 62 C14 40 30 76 50 58 S 82 34 102 52" fill="none" stroke="#f3dfb8" stroke-width="7" stroke-linecap="round"/>
  <path d="M-2 62 C14 40 30 76 50 58 S 82 34 102 52" fill="none" stroke="#e6cc9a" stroke-width="7" stroke-linecap="round" stroke-dasharray="0.5 5" opacity=".7"/>
  <path d="M50 58 C46 74 54 86 50 102" fill="none" stroke="#f3dfb8" stroke-width="6" stroke-linecap="round"/>`, { par: 'none' });

// ---------- Garten-Deko ----------
const DECO_ART = {
  rainbow: () => ['#ff5a5a', '#ff9a2e', '#ffd23b', '#62cc5c', '#4fb3ff', '#9b7bff'].map((c, i) => `<path d="M${8 + i * 5} 80 A${42 - i * 5} ${42 - i * 5} 0 0 1 ${92 - i * 5} 80" fill="none" stroke="${c}" stroke-width="5.4"/>`).join('')
    + `<g fill="#fff"><circle cx="10" cy="80" r="9"/><circle cx="22" cy="82" r="8"/><circle cx="90" cy="80" r="9"/><circle cx="78" cy="82" r="8"/></g>`,
  pond: () => `
    <ellipse cx="50" cy="72" rx="46" ry="18" fill="#7cc8ff" stroke="#3b8fd6" stroke-width="3"/>
    <ellipse cx="36" cy="68" rx="14" ry="4" fill="#fff" opacity=".4"/>
    <ellipse cx="72" cy="78" rx="10" ry="4.5" fill="#62cc5c" stroke="#2f8f3a" stroke-width="2"/><circle cx="74" cy="75" r="3.5" fill="#ff8cc6"/>
    <ellipse cx="42" cy="66" rx="13" ry="10" fill="#ffd23b" stroke="#e6a100" stroke-width="2.5"/><circle cx="52" cy="56" r="8" fill="#ffd23b" stroke="#e6a100" stroke-width="2.5"/>
    <path d="M59 56 L66 58 L59 60Z" fill="#ff8a2e"/><circle cx="54" cy="54" r="1.6" fill="${INK}"/>`,
  bench: () => `
    <path d="M22 92 L22 62 M78 92 L78 62" stroke="#8a5a2e" stroke-width="6" stroke-linecap="round"/>
    <rect x="14" y="44" width="72" height="9" rx="4" fill="#d9a86a" stroke="#a8703e" stroke-width="2.5"/>
    <rect x="14" y="56" width="72" height="9" rx="4" fill="#d9a86a" stroke="#a8703e" stroke-width="2.5"/>
    <rect x="10" y="72" width="80" height="10" rx="4" fill="#e8b97a" stroke="#a8703e" stroke-width="2.5"/>
    <path d="M50 50 C47 47 45 45 46.5 43 C48 42 49.5 42.5 50 44 C50.5 42.5 52 42 53.5 43 C55 45 53 47 50 50Z" fill="#ff5a7a"/>`,
  birdhouse: () => `
    <path d="M50 96 L50 52" stroke="#8a5a2e" stroke-width="6" stroke-linecap="round"/>
    <rect x="32" y="26" width="36" height="30" rx="3" fill="#ffe3b8" stroke="#d9a86a" stroke-width="2.5"/>
    <path d="M26 30 L50 8 L74 30Z" fill="#ff6b5e" stroke="#c9443a" stroke-width="2.5" stroke-linejoin="round"/>
    <circle cx="50" cy="38" r="6.5" fill="#5a3d2b"/><path d="M44 50 L56 50" stroke="#8a5a2e" stroke-width="3" stroke-linecap="round"/>
    <circle cx="70" cy="18" r="6" fill="#4fb3ff" stroke="#2a86d6" stroke-width="2"/><path d="M75 18 L80 19.5 L75 21Z" fill="#ff8a2e"/><circle cx="71.5" cy="16.5" r="1.2" fill="${INK}"/>`,
  balloons: () => `
    <path d="M36 44 Q44 70 50 94 M64 40 Q56 70 50 94 M50 34 L50 94" stroke="#9a8cb8" stroke-width="1.6" fill="none"/>
    <ellipse cx="34" cy="28" rx="13" ry="16" fill="#ff7eb6" stroke="#e2559a" stroke-width="2.5"/>
    <ellipse cx="66" cy="24" rx="13" ry="16" fill="#4fb3ff" stroke="#2a86d6" stroke-width="2.5"/>
    <ellipse cx="50" cy="18" rx="13" ry="16" fill="#ffd23b" stroke="#e6a100" stroke-width="2.5"/>
    <ellipse cx="45" cy="12" rx="3" ry="5" fill="#fff" opacity=".5" transform="rotate(20 45 12)"/>`,
};
export function deco(id) { return svg((DECO_ART[id] || DECO_ART.bench)(), { par: 'xMidYMax meet' }); }

export const iconMusic = (on = true) => svg(`
  <path d="M38 70 V24 L78 16 V62" fill="none" stroke="${on ? '#e2559a' : '#9a8cb8'}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  <ellipse cx="28" cy="72" rx="12" ry="9" fill="${on ? '#ff8cc6' : '#cfc3e6'}" stroke="${on ? '#e2559a' : '#9a8cb8'}" stroke-width="4"/>
  <ellipse cx="68" cy="64" rx="12" ry="9" fill="${on ? '#ff8cc6' : '#cfc3e6'}" stroke="${on ? '#e2559a' : '#9a8cb8'}" stroke-width="4"/>
  ${on ? '' : '<path d="M14 14 L86 86" stroke="#e2559a" stroke-width="7" stroke-linecap="round"/>'}`);

// Bild aus einem Emoji (für Vokabeln, Möbel, Fundstücke …)
export const emoji = (e, size = 74, y = 54) => svg(`<text x="50" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="${size}" font-family="'Noto Color Emoji','Apple Color Emoji','Segoe UI Emoji',sans-serif">${e}</text>`);

// ---------- Häuschen (wächst mit dem Bau: Stufe 0 bis 5) ----------
export function homeStage(stage) {
  const s = stage;
  let b = '<ellipse cx="100" cy="150" rx="92" ry="14" fill="#8fd46b"/>';
  if (s === 0) {
    b += `<path d="M62 150 L62 104" stroke="#a8703e" stroke-width="5" stroke-linecap="round"/>
      <rect x="36" y="92" width="52" height="22" rx="4" fill="#fff6e8" stroke="#c99257" stroke-width="3"/>
      <text x="62" y="107" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="800" font-size="10" fill="#6b3f1a">Hier baue ich!</text>`;
  }
  // Holzstapel liegt immer daneben, bis das Haus fertig ist
  if (s < 5) {
    b += [[118, 140], [134, 140], [150, 140], [126, 128], [142, 128], [134, 116]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" fill="#d9a86a" stroke="#8a5a2e" stroke-width="2.5"/><circle cx="${x}" cy="${y}" r="3.5" fill="none" stroke="#b07a42" stroke-width="1.5"/>`).join('');
  }
  if (s >= 1) b += `<rect x="36" y="134" width="128" height="14" rx="3" fill="#b8b2c4" stroke="#7d7590" stroke-width="2.5"/>${[48, 70, 92, 114, 136, 156].map((x) => `<path d="M${x} 134 V148" stroke="#7d7590" stroke-width="1.6"/>`).join('')}`;
  if (s >= 2) b += `<rect x="46" y="72" width="108" height="62" fill="#e8b97a" stroke="#a8703e" stroke-width="3"/>${[84, 96, 108, 120].map((y) => `<path d="M46 ${y} H154" stroke="#c99257" stroke-width="2"/>`).join('')}`;
  if (s >= 5) b += `<rect x="124" y="30" width="14" height="30" fill="#c9443a" stroke="#8a2a24" stroke-width="2.5"/><circle cx="134" cy="22" r="6" fill="#e6e6ee" opacity=".9"/><circle cx="142" cy="12" r="8" fill="#eeeef4" opacity=".8"/>`;
  if (s >= 3) b += `<path d="M34 76 L100 26 L166 76Z" fill="#ff6b5e" stroke="#c9443a" stroke-width="3" stroke-linejoin="round"/><path d="M58 58 H142 M76 44 H124" stroke="#e2453c" stroke-width="2"/>`;
  if (s >= 4) {
    b += `<path d="M88 134 V104 Q100 92 112 104 V134Z" fill="#a8703e" stroke="#6b3f1a" stroke-width="2.5"/><circle cx="107" cy="120" r="2.2" fill="#ffd23b"/>`;
    b += [56, 128].map((x) => `<rect x="${x}" y="88" width="20" height="20" rx="2" fill="#8fd0ff" stroke="#6b3f1a" stroke-width="2.5"/><path d="M${x + 10} 88 V108 M${x} 98 H${x + 20}" stroke="#6b3f1a" stroke-width="2"/>`).join('');
  }
  if (s >= 5) {
    b += [56, 128].map((x) => `<rect x="${x - 2}" y="108" width="24" height="6" rx="2" fill="#a8703e"/><circle cx="${x + 4}" cy="106" r="3" fill="#ff7eb6"/><circle cx="${x + 11}" cy="105" r="3" fill="#ffd23b"/><circle cx="${x + 18}" cy="106" r="3" fill="#9b7bff"/>`).join('');
    b += `<path d="M100 112 C97 109 95 107 96.5 105 C98 104 99.5 104.5 100 106 C100.5 104.5 102 104 103.5 105 C105 107 103 109 100 112Z" fill="#ff7eb6"/>`;
  }
  return svg(b, { vb: '0 0 200 165', par: 'xMidYMax meet' });
}

export const table = () => svg(`
  <rect x="10" y="34" width="80" height="12" rx="4" fill="#d9a86a" stroke="#8a5a2e" stroke-width="3"/>
  <path d="M20 46 V88 M80 46 V88" stroke="#8a5a2e" stroke-width="6" stroke-linecap="round"/>
  <ellipse cx="38" cy="30" rx="10" ry="4" fill="#fff" stroke="#c9c2d6" stroke-width="2"/><circle cx="62" cy="26" r="6" fill="#ff5a4e"/>`);
export const rug = () => svg(`<ellipse cx="50" cy="50" rx="48" ry="20" fill="#ff9ccb" stroke="#e2559a" stroke-width="3"/><ellipse cx="50" cy="50" rx="36" ry="13" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="6 5"/>`, { par: 'none' });

// Möbel mit eigener Zeichnung
export const ceilingLamp = () => svg(`
  <path d="M50 0 V58" stroke="#8a7a96" stroke-width="3"/>
  <path d="M24 92 L34 58 H66 L76 92Z" fill="#ffd23b" stroke="#e6a100" stroke-width="3.5" stroke-linejoin="round"/>
  <ellipse cx="50" cy="96" rx="12" ry="5" fill="#fff6c2"/>
  <ellipse cx="50" cy="104" rx="30" ry="8" fill="#fff6a0" opacity=".45"/>`, { vb: '0 0 100 112', par: 'xMidYMin meet' });
export const shelf = () => svg(`
  <rect x="4" y="66" width="92" height="8" rx="2" fill="#a8703e" stroke="#6b3f1a" stroke-width="2.5"/>
  <path d="M14 74 L18 86 M86 74 L82 86" stroke="#6b3f1a" stroke-width="4" stroke-linecap="round"/>
  ${[['#ff7eb6', 12, 40], ['#4fb3ff', 23, 46], ['#ffd23b', 34, 38], ['#62cc5c', 45, 44], ['#9b7bff', 56, 40]].map(([c, x, h]) => `<rect x="${x}" y="${66 - h}" width="10" height="${h}" rx="2" fill="${c}" stroke="rgba(0,0,0,.25)" stroke-width="2"/>`).join('')}
  <path d="M68 66 L78 28 L88 30 L80 66Z" fill="#ff9a2e" stroke="rgba(0,0,0,.25)" stroke-width="2"/>`);
export const tvStand = () => svg(`
  <rect x="10" y="74" width="80" height="22" rx="4" fill="#d9a86a" stroke="#8a5a2e" stroke-width="3"/>
  <circle cx="50" cy="85" r="3" fill="#8a5a2e"/>
  <rect x="16" y="22" width="68" height="46" rx="6" fill="#3a2a35" stroke="#241a22" stroke-width="3"/>
  <rect x="22" y="28" width="56" height="34" rx="3" fill="#8fd0ff"/>
  <path d="M22 54 Q38 40 50 50 T78 46 V62 H22Z" fill="#62cc5c"/><circle cx="66" cy="38" r="5" fill="#ffd23b"/>
  <path d="M44 68 H56 V74 H44Z" fill="#241a22"/>`);

// ⛴️ Emmis Schiff – Rumpf- und Schornsteinfarbe frei wählbar
export function shipInner({ hull = '#ff5a5a', hullO = '#c9443a', funnel = '#ffd23b', name = 'EMMI', flags = true } = {}) {
  const fun = funnel === 'rainbow'
    ? ['#ff5a5a', '#ffb02e', '#ffd23b', '#62cc5c', '#4fb3ff', '#9b7bff'].map((c, i) => `<rect x="99" y="${14 + i * 4}" width="16" height="4" fill="${c}"/>`).join('')
    : `<rect x="99" y="14" width="16" height="24" fill="${funnel}"/>`;
  return `
    <ellipse cx="80" cy="93" rx="70" ry="5" fill="rgba(0,60,120,.18)"/>
    <path d="M112 6 Q120 0 128 4 Q122 8 116 6" fill="#fff" opacity=".8"/>
    ${fun}<rect x="99" y="14" width="16" height="24" fill="none" stroke="${INK}" stroke-opacity=".25" stroke-width="2"/>
    <rect x="97" y="10" width="20" height="6" rx="2" fill="#3a2a35"/>
    <rect x="52" y="24" width="56" height="18" rx="5" fill="#fff" stroke="#c9c2d6" stroke-width="2.2"/>
    ${[60, 72, 84, 96].map((x) => `<rect x="${x - 4}" y="29" width="8" height="7" rx="2" fill="#7cc8ff" stroke="#3b8fd6" stroke-width="1.4"/>`).join('')}
    <rect x="34" y="40" width="96" height="20" rx="5" fill="#fff" stroke="#c9c2d6" stroke-width="2.2"/>
    ${[44, 56, 68, 80, 92, 104, 116].map((x) => `<circle cx="${x}" cy="50" r="3.6" fill="#7cc8ff" stroke="#3b8fd6" stroke-width="1.4"/>`).join('')}
    <path d="M30 40 V22 M30 22 L44 26 L30 30" stroke="${INK}" stroke-width="1.8" fill="#ff7eb6" stroke-linejoin="round"/>
    ${flags ? `<path d="M10 58 Q40 30 54 24 M108 24 Q132 36 150 58" stroke="#8a7a90" stroke-width="1" fill="none"/>
      ${[[16, 50, '#ff5a5a'], [24, 43, '#ffd23b'], [33, 36, '#4fb3ff'], [42, 30, '#62cc5c'], [118, 30, '#ff7eb6'], [127, 36, '#9b7bff'], [136, 43, '#ffd23b'], [144, 51, '#4fb3ff']].map(([x, y, c]) => `<path d="M${x - 3} ${y} L${x + 3} ${y} L${x} ${y + 6}Z" fill="${c}"/>`).join('')}` : ''}
    <path d="M6 58 L154 58 L140 86 Q80 94 20 86Z" fill="${hull}" stroke="${hullO}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M12 66 L148 66" stroke="#fff" stroke-width="3" opacity=".85"/>
    <text x="80" y="81" text-anchor="middle" font-size="11" font-weight="800" fill="#fff" font-family="Nunito, sans-serif" letter-spacing="2">${name}</text>
    <circle cx="26" cy="74" r="3" fill="#fff" opacity=".8"/><circle cx="134" cy="74" r="3" fill="#fff" opacity=".8"/>`;
}
export const ship = (o) => svg(shipInner(o), { vb: '0 0 160 100', par: 'xMidYMax meet' });

// Möwe (Begleiter)
const gull = () => `
  <ellipse cx="50" cy="66" rx="22" ry="15" fill="#fff" stroke="#c9c2d6" stroke-width="2.4"/>
  <path d="M34 60 Q22 46 10 54 Q24 58 34 70Z" fill="#c3c7d4" stroke="#9aa0b0" stroke-width="2" stroke-linejoin="round"/>
  <circle cx="66" cy="50" r="12" fill="#fff" stroke="#c9c2d6" stroke-width="2.4"/>
  <path d="M76 50 L90 53 L76 56Z" fill="#ffb02e" stroke="#e6a100" stroke-width="1.4" stroke-linejoin="round"/>
  <circle cx="69" cy="47" r="2.2" fill="${INK}"/><circle cx="69.7" cy="46.3" r=".7" fill="#fff"/>
  <path d="M44 80 V88 M56 80 V88" stroke="#ffb02e" stroke-width="2.6" stroke-linecap="round"/>`;

// 🐾 Begleiter an Emmis Seite
const PET_ART = {
  kitten: () => thing('cat'), puppy: () => thing('dog'), bunny: () => animal('bunny'), chick: () => animal('chicken'),
  hedgehog: () => animal('hedgehog'), bird: () => thing('bird'),
  gull: () => svg(gull()), dolphin: () => emoji('🐬', 80, 56), seal: () => emoji('🦭', 80, 56),
  panda: () => emoji('🐼', 80, 56), unicorn: () => emoji('🦄', 80, 56), dragon: () => emoji('🐉', 80, 56), fox: () => emoji('🦊', 80, 56),
};
export function pet(id) { return PET_ART[id] ? PET_ART[id]() : ''; }
