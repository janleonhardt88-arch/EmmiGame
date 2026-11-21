// Alle Grafiken als handgezeichnete SVGs (niedlich & bunt).
const INK = '#3a2a35';

const svg = (body, { vb = '0 0 100 100', par = 'xMidYMid meet', cls = '' } = {}) =>
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

export function avatar(hair, beltColor) {
  const out = '#c9c2d6';
  const beltStroke = beltColor.toLowerCase() === '#ffffff' ? '#d8d0e2' : 'rgba(0,0,0,.18)';
  return svg(`
    <ellipse cx="50" cy="136" rx="26" ry="4" fill="rgba(0,0,0,.12)"/>
    <path d="M37 100 L33 132 L46 132 L50 108 L54 132 L67 132 L63 100Z" fill="#fff" stroke="${out}" stroke-width="2.4" stroke-linejoin="round"/>
    <ellipse cx="39" cy="134" rx="7" ry="3.4" fill="#ffdcc2" stroke="#e8b896" stroke-width="1.8"/>
    <ellipse cx="61" cy="134" rx="7" ry="3.4" fill="#ffdcc2" stroke="#e8b896" stroke-width="1.8"/>
    <g class="arm-l">
      <path d="M35 70 Q22 80 27 93" stroke="${out}" stroke-width="12" fill="none" stroke-linecap="round"/>
      <path d="M35 70 Q22 80 27 93" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round"/>
      <circle cx="27" cy="95" r="5" fill="#ffdcc2" stroke="#e8b896" stroke-width="1.8"/>
    </g>
    <path d="M32 67 Q50 59 68 67 L66 102 L34 102Z" fill="#fff" stroke="${out}" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M42 64 L55 90 M58 64 L48 84" stroke="${out}" stroke-width="2.4" stroke-linecap="round"/>
    <rect x="33" y="87" width="34" height="7" rx="2.5" fill="${beltColor}" stroke="${beltStroke}" stroke-width="1.5"/>
    <path d="M48 94 L44 106 M52 94 L56 106" stroke="${beltColor}" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M48 94 L44 106 M52 94 L56 106" stroke="${beltStroke}" stroke-width="1" stroke-linecap="round" fill="none" opacity=".6"/>
    <g class="arm-r">
      <path d="M65 70 Q80 66 88 56" stroke="${out}" stroke-width="12" fill="none" stroke-linecap="round"/>
      <path d="M65 70 Q80 66 88 56" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round"/>
      <ellipse cx="90" cy="53" rx="4" ry="6.5" fill="#ffdcc2" stroke="#e8b896" stroke-width="1.8" transform="rotate(35 90 53)"/>
    </g>
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
