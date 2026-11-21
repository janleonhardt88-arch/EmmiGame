// 🗺️ Kleine Details für die Weltkarte: Bucht, Windmühle, Büsche, Steine, Boote, Möwen, Schmetterlinge …
import { svg, face, shipInner } from './art.js';

const INK = '#3a2a35';
const O = (c, w = 2.2) => `stroke="${c}" stroke-width="${w}" stroke-linejoin="round"`;

// Bucht unten in der Mitte (wird gestreckt, daher nur weiche Formen)
export function bayLayer(portrait) {
  return svg(`<defs><linearGradient id="sea${portrait ? 'p' : 'l'}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fd8f7"/><stop offset="1" stop-color="#3b97dc"/></linearGradient></defs>
    ${portrait
    ? `<path d="M20 100 C22 89 34 82 50 82 C66 82 78 89 80 100Z" fill="#f6e2b0"/>
       <path d="M24 100 C26 91 36 85.5 50 85.5 C64 85.5 74 91 76 100Z" fill="url(#seap)"/>
       <path d="M24 100 C26 91 36 85.5 50 85.5 C64 85.5 74 91 76 100" fill="none" stroke="#fff" stroke-width=".6" opacity=".7"/>`
    : `<path d="M29 100 C30 85 40 76 50 76 C60 76 70 85 71 100Z" fill="#f6e2b0"/>
       <path d="M32.5 100 C33.5 88 42 79.5 50 79.5 C58 79.5 66.5 88 67.5 100Z" fill="url(#seal)"/>
       <path d="M32.5 100 C33.5 88 42 79.5 50 79.5 C58 79.5 66.5 88 67.5 100" fill="none" stroke="#fff" stroke-width=".5" opacity=".75"/>`}`,
  { par: 'none' });
}

// Einzelne Details (jeweils eigenes SVG, damit nichts verzerrt wird)
const ART = {
  windmill: () => `
    <path d="M40 98 L44 46 L56 46 L60 98Z" fill="#fff6e8" ${O('#d9b98f')}/>
    <path d="M38 48 L50 34 L62 48Z" fill="#ff7e6b" ${O('#c9443a')}/>
    <rect x="46" y="80" width="8" height="18" rx="4" fill="#a8703e"/>
    <circle cx="50" cy="62" r="4" fill="#7cc8ff" ${O('#3b8fd6', 1.5)}/>
    <g class="mill-blades" style="transform-origin:50px 40px">${[0, 90, 180, 270].map((a) => `<g transform="rotate(${a} 50 40)"><path d="M50 40 L50 6" stroke="#a8703e" stroke-width="2.4"/><rect x="51" y="8" width="9" height="26" rx="1.5" fill="#fff" ${O('#c9c2d6', 1.6)}/></g>`).join('')}</g>
    <circle cx="50" cy="40" r="3.4" fill="#a8703e"/>`,
  bush: () => `
    <ellipse cx="50" cy="92" rx="36" ry="5" fill="rgba(0,0,0,.1)"/>
    <circle cx="32" cy="76" r="16" fill="#55bd52" ${O('#2f8f3a')}/><circle cx="68" cy="76" r="16" fill="#55bd52" ${O('#2f8f3a')}/>
    <circle cx="50" cy="66" r="20" fill="#62cc5c" ${O('#2f8f3a')}/><rect x="22" y="78" width="56" height="14" rx="7" fill="#55bd52"/>
    <path d="M40 58 Q46 52 54 54" stroke="#9be58a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="36" cy="72" r="3" fill="#ff8cc6"/><circle cx="62" cy="64" r="3" fill="#fff"/><circle cx="66" cy="80" r="3" fill="#ff8cc6"/>`,
  rocks: () => `
    <ellipse cx="50" cy="92" rx="38" ry="5" fill="rgba(0,0,0,.1)"/>
    <path d="M18 92 Q16 74 32 70 Q46 66 50 80 Q52 92 18 92Z" fill="#b9b3c4" ${O('#8a8496')}/>
    <path d="M44 92 Q46 64 66 62 Q84 62 84 92Z" fill="#cfc9d8" ${O('#8a8496')}/>
    <path d="M58 70 Q64 66 72 68" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/>
    <path d="M24 90 Q28 84 34 88 M70 90 Q74 82 80 88" stroke="#62cc5c" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  mushrooms: () => `
    <rect x="28" y="66" width="10" height="24" rx="4" fill="#fff6e8" ${O('#d9b98f', 1.8)}/>
    <path d="M14 70 Q33 40 52 70Z" fill="#ff5a5a" ${O('#c9443a')}/><circle cx="26" cy="60" r="3" fill="#fff"/><circle cx="38" cy="56" r="3.4" fill="#fff"/>
    <rect x="62" y="76" width="8" height="16" rx="3" fill="#fff6e8" ${O('#d9b98f', 1.6)}/>
    <path d="M52 79 Q66 58 80 79Z" fill="#ff5a5a" ${O('#c9443a')}/><circle cx="66" cy="70" r="2.4" fill="#fff"/>
    <path d="M10 92 Q50 84 90 92" stroke="#62cc5c" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  flowers: () => [[22, 78, '#ff8cc6'], [40, 70, '#ffd23b'], [58, 76, '#9b7bff'], [76, 70, '#ff5a7a'], [32, 86, '#fff'], [66, 86, '#ffd23b']].map(([x, y, c]) => `
    <path d="M${x} ${y} L${x} 96" stroke="#3fa34a" stroke-width="2.4"/>
    ${[0, 72, 144, 216, 288].map((a) => `<circle cx="${x}" cy="${y - 5}" r="4" fill="${c}" stroke="rgba(0,0,0,.15)" stroke-width=".8" transform="rotate(${a} ${x} ${y})"/>`).join('')}
    <circle cx="${x}" cy="${y}" r="2.6" fill="#ffb02e"/>`).join(''),
  pines: () => [[30, 1], [62, 1.2], [80, .85]].map(([x, k]) => `<g transform="translate(${x} 96) scale(${k})">
    <rect x="-3" y="-12" width="6" height="12" fill="#8a5a2e"/>
    <path d="M0 -70 L-20 -34 L-12 -34 L-24 -10 L24 -10 L12 -34 L20 -34Z" fill="#3fa34a" ${O('#2a7a33', 2)}/>
    <path d="M-4 -56 L-10 -42" stroke="#7ed96f" stroke-width="2.4" stroke-linecap="round"/></g>`).join(''),
  sailboat: () => `
    <path d="M24 70 L76 70 L68 84 L32 84Z" fill="#ff7eb6" ${O('#e2559a')}/>
    <path d="M50 68 V18" stroke="#8a5a2e" stroke-width="2.4"/>
    <path d="M52 20 Q72 44 74 64 L52 64Z" fill="#fff" ${O('#c9c2d6', 1.8)}/>
    <path d="M48 26 Q34 46 30 64 L48 64Z" fill="#fff6c2" ${O('#e6c96a', 1.8)}/>
    <path d="M50 18 L60 22 L50 26Z" fill="#4fb3ff"/>
    <path d="M14 88 Q22 84 30 88 T46 88 T62 88 T78 88 T90 88" stroke="#fff" stroke-width="2.4" fill="none" opacity=".8"/>`,
  gull: () => '<path d="M14 50 Q30 34 50 50 Q70 34 86 50" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M14 50 Q30 34 50 50 Q70 34 86 50" stroke="#8a8496" stroke-width="2" fill="none" stroke-linecap="round"/>',
  butterfly: () => `
    <g class="bfly-wings"><path d="M50 50 Q30 22 18 38 Q14 54 50 54Z M50 50 Q70 22 82 38 Q86 54 50 54Z" fill="#ff8cc6" ${O('#e2559a', 2)}/>
    <path d="M50 54 Q32 70 28 62 Q30 54 50 54Z M50 54 Q68 70 72 62 Q70 54 50 54Z" fill="#ffd23b" ${O('#e6a100', 2)}/></g>
    <rect x="47.5" y="40" width="5" height="26" rx="2.5" fill="${INK}"/>
    <path d="M49 41 Q44 30 40 30 M51 41 Q56 30 60 30" stroke="${INK}" stroke-width="1.6" fill="none"/>`,
  balloon: () => `
    <path d="M50 10 C26 10 22 40 34 54 L44 68 L56 68 L66 54 C78 40 74 10 50 10Z" fill="#ff7eb6" ${O('#e2559a')}/>
    <path d="M50 10 C42 18 40 44 46 68 M50 10 C58 18 60 44 54 68" stroke="#ffd23b" stroke-width="5" fill="none"/>
    <path d="M30 34 Q50 40 70 34" stroke="#fff" stroke-width="3" fill="none" opacity=".6"/>
    <path d="M44 68 L45 78 M56 68 L55 78" stroke="#8a5a2e" stroke-width="1.6"/>
    <rect x="42" y="77" width="16" height="12" rx="2" fill="#c99257" ${O('#8a5a2e', 1.8)}/>`,
  fence: () => `${[14, 32, 50, 68, 86].map((x) => `<path d="M${x - 5} 92 V62 L${x} 56 L${x + 5} 62 V92Z" fill="#fff6e8" ${O('#d9b98f', 2)}/>`).join('')}
    <rect x="4" y="66" width="92" height="6" rx="3" fill="#f3dfc4" ${O('#d9b98f', 1.6)}/><rect x="4" y="80" width="92" height="6" rx="3" fill="#f3dfc4" ${O('#d9b98f', 1.6)}/>`,
  pond: () => `
    <ellipse cx="50" cy="74" rx="44" ry="18" fill="#7cc8ff" ${O('#3b8fd6', 2.6)}/>
    <ellipse cx="38" cy="68" rx="14" ry="4" fill="#fff" opacity=".45"/>
    <ellipse cx="68" cy="78" rx="10" ry="4.6" fill="#62cc5c" ${O('#2f8f3a', 1.8)}/><circle cx="70" cy="75" r="3.4" fill="#ff8cc6"/>
    <path d="M10 70 V50 M14 72 V56 M88 72 V52" stroke="#3fa34a" stroke-width="2.6" stroke-linecap="round"/>
    <ellipse cx="10" cy="48" rx="2.6" ry="6" fill="#8a5a2e"/><ellipse cx="88" cy="50" rx="2.6" ry="6" fill="#8a5a2e"/>`,
  sheep: () => `
    <ellipse cx="50" cy="94" rx="30" ry="4" fill="rgba(0,0,0,.1)"/>
    <path d="M36 80 V92 M46 82 V93 M58 82 V93 M66 80 V92" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    ${[[34, 64], [46, 58], [60, 60], [68, 70], [56, 74], [40, 76]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="12" fill="#fff" ${O('#cbc2d6', 2)}/>`).join('')}
    <ellipse cx="24" cy="62" rx="10" ry="9" fill="#5a4a5e"/>${face(24, 62, 0.42, { mouth: false, eye: '#fff' })}`,
  bridge: () => `
    <path d="M8 74 Q50 44 92 74" stroke="#a8703e" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M8 74 Q50 44 92 74" stroke="#d9a86a" stroke-width="5" fill="none" stroke-linecap="round"/>
    ${[18, 34, 50, 66, 82].map((x, i) => `<path d="M${x} ${[66, 56, 52, 56, 66][i]} V${[52, 42, 38, 42, 52][i]}" stroke="#8a5a2e" stroke-width="3"/>`).join('')}
    <path d="M18 52 Q50 26 82 52" stroke="#8a5a2e" stroke-width="2.6" fill="none"/>`,
  boat: () => `<g transform="translate(6 30) scale(.55)">${shipInner({ flags: false, name: '' })}</g>`,
};
export const detail = (id) => svg(ART[id]());
