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

// ---------- Emmi ----------
function head(hair) {
  return `
    <circle cx="50" cy="14" r="9" fill="${hair}"/>
    <circle cx="50" cy="40" r="23" fill="#ffdcc2" stroke="#e8b896" stroke-width="2.4"/>
    <path d="M27 42 Q25 15 50 15 Q75 15 73 42 Q68 29 58 28 Q52 23 46 29 Q35 29 27 42Z" fill="${hair}"/>
    ${face(50, 44, 0.95)}`;
}

export function avatarHead(hair) {
  return svg(head(hair), { vb: '22 6 56 62' });
}

export function avatar(hair, beltColor = '#ffffff', { outfit = 'gi', mic = false } = {}) {
  const out = '#c9c2d6', skin = '#ffdcc2', skinO = '#e8b896';
  const beltStroke = beltColor.toLowerCase() === '#ffffff' ? '#d8d0e2' : 'rgba(0,0,0,.18)';
  const arm = (d, sleeve, sleeveO) => `
      <path d="${d}" stroke="${sleeveO}" stroke-width="12" fill="none" stroke-linecap="round"/>
      <path d="${d}" stroke="${sleeve}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
  const armL = 'M35 70 Q22 80 27 93', armR = 'M65 70 Q80 66 88 56';
  let legs, torso, sleeve, sleeveO;
  if (outfit === 'tutu') {
    sleeve = skin; sleeveO = skinO;
    legs = `
      <path d="M44 100 L42 131 M56 100 L58 131" stroke="#f0b4cf" stroke-width="10" stroke-linecap="round"/>
      <path d="M44 100 L42 131 M56 100 L58 131" stroke="#ffd9ea" stroke-width="6.5" stroke-linecap="round"/>
      <ellipse cx="40" cy="134" rx="6.5" ry="3.4" fill="#ff8cc6" stroke="#e2559a" stroke-width="1.6"/>
      <ellipse cx="60" cy="134" rx="6.5" ry="3.4" fill="#ff8cc6" stroke="#e2559a" stroke-width="1.6"/>`;
    torso = `
      <path d="M36 67 Q50 60 64 67 L62 99 L38 99Z" fill="#ff8cc6" stroke="#e2559a" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M22 101 Q50 88 78 101 Q74 110 64 107 Q57 113 50 108 Q43 113 36 107 Q26 110 22 101Z" fill="#ffc2dc" stroke="#ff8cc6" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M28 100 Q50 92 72 100" stroke="#fff" stroke-width="2" fill="none" opacity=".7"/>
      <circle cx="50" cy="72" r="2.4" fill="#fff"/>`;
  } else if (outfit === 'casual') {
    sleeve = skin; sleeveO = skinO;
    legs = `
      <path d="M37 100 L34 131 L46 131 L50 108 L54 131 L66 131 L63 100Z" fill="#7b5bd6" stroke="#5a3fb0" stroke-width="2.4" stroke-linejoin="round"/>
      <ellipse cx="39" cy="134" rx="8" ry="4" fill="#fff" stroke="#c9c2d6" stroke-width="1.8"/>
      <ellipse cx="61" cy="134" rx="8" ry="4" fill="#fff" stroke="#c9c2d6" stroke-width="1.8"/>`;
    torso = `
      <path d="M32 67 Q50 59 68 67 L66 102 L34 102Z" fill="#ff7eb6" stroke="#e2559a" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M50 92 C44 86 40 82 43 78 C45 75 49 76 50 79 C51 76 55 75 57 78 C60 82 56 86 50 92Z" fill="#fff"/>`;
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
    ${legs}
    <g class="arm-l">${arm(armL, sleeve, sleeveO)}<circle cx="27" cy="95" r="5" fill="${skin}" stroke="${skinO}" stroke-width="1.8"/></g>
    ${torso}
    <g class="arm-r">${arm(armR, sleeve, sleeveO)}${micSvg}<ellipse cx="90" cy="53" rx="4" ry="6.5" fill="${skin}" stroke="${skinO}" stroke-width="1.8" transform="rotate(35 90 53)"/></g>
    ${head(hair)}`, { vb: '0 0 100 140', par: 'xMidYMax meet' });
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
