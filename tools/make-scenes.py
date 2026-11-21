#!/usr/bin/env python3
"""Erzeugt app/css/scenes.css: gezeichnete Dekorationen für die Hintergründe der Orte.

    python3 tools/make-scenes.py

Jede Deko ist ein kleines SVG, das als Hintergrundebene (data-URI) über die bisherigen
Hintergründe gelegt wird. So bleibt der Spielcode unverändert.
"""
import os
from urllib.parse import quote

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'app', 'css', 'scenes.css')


def url(w, h, body):
    s = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}">{body}</svg>'
    return f'url("data:image/svg+xml,{quote(s, safe=" =:/,.-()#")}")'.replace('#', '%23')


INK = '#3a2a35'

# ---------- Wimpelkette (für mehrere Orte) ----------
def bunting(colors):
    flags = ''.join(
        f'<path d="M{x} {6 + 4 * ((i % 4) in (1, 2))} l14 0 l-7 16z" fill="{colors[i % len(colors)]}" stroke="rgba(0,0,0,.12)" stroke-width="1"/>'
        for i, x in enumerate(range(4, 236, 20)))
    return url(240, 30, f'<path d="M0 4 Q60 16 120 8 T240 6" stroke="#b08a60" stroke-width="1.6" fill="none"/>{flags}')

# ---------- Dojo ----------
scroll = url(60, 150, f'''
  <rect x="4" y="2" width="52" height="6" rx="3" fill="#8a5a2e"/><path d="M30 2 L30 -10" stroke="#8a5a2e" stroke-width="2"/>
  <rect x="8" y="8" width="44" height="126" fill="#fffaf0" stroke="#d9c4a0" stroke-width="2"/>
  <circle cx="30" cy="40" r="14" fill="#ff5a5a" opacity=".85"/>
  <path d="M18 70 Q24 64 30 72 Q36 80 42 74 M20 88 Q30 82 40 92 M22 104 Q30 98 38 108" stroke="{INK}" stroke-width="3" fill="none" stroke-linecap="round"/>
  <rect x="4" y="132" width="52" height="7" rx="3.5" fill="#8a5a2e"/>''')
lantern = url(40, 80, f'''
  <path d="M20 0 V10" stroke="{INK}" stroke-width="1.5"/><rect x="12" y="8" width="16" height="4" rx="1.5" fill="{INK}"/>
  <ellipse cx="20" cy="38" rx="16" ry="26" fill="#ff6b5e" stroke="#c9443a" stroke-width="2"/>
  <path d="M6 30 H34 M5 40 H35 M6 50 H34" stroke="#c9443a" stroke-width="1.4"/>
  <ellipse cx="14" cy="30" rx="3" ry="8" fill="#fff" opacity=".35"/>
  <rect x="12" y="62" width="16" height="4" rx="1.5" fill="{INK}"/><path d="M20 66 V76" stroke="#ffd23b" stroke-width="2"/>''')
bonsai = url(80, 80, '''
  <path d="M18 62 H62 L58 76 H22Z" fill="#4f8fd6" stroke="#2f66a8" stroke-width="2"/>
  <path d="M40 62 Q36 48 44 40 Q50 34 46 26" stroke="#8a5a2e" stroke-width="5" fill="none" stroke-linecap="round"/>
  <ellipse cx="30" cy="38" rx="16" ry="9" fill="#62cc5c" stroke="#2f8f3a" stroke-width="2"/>
  <ellipse cx="54" cy="26" rx="18" ry="10" fill="#62cc5c" stroke="#2f8f3a" stroke-width="2"/>
  <ellipse cx="46" cy="14" rx="11" ry="7" fill="#7ed96f" stroke="#2f8f3a" stroke-width="2"/>''')
shelf = url(120, 30, '<rect x="0" y="22" width="120" height="7" rx="2" fill="#a8703e"/><path d="M14 29 L18 30 M106 29 L102 30" stroke="#8a5a2e" stroke-width="3"/>')
tatami = url(200, 100, '<rect x="2" y="2" width="96" height="46" rx="2" fill="#d8d49a" stroke="#6b8a4a" stroke-width="3"/><rect x="102" y="2" width="96" height="96" rx="2" fill="#dcd8a0" stroke="#6b8a4a" stroke-width="3"/><rect x="2" y="52" width="96" height="46" rx="2" fill="#d4d096" stroke="#6b8a4a" stroke-width="3"/>' + ''.join(f'<path d="M{x} 4 V96" stroke="rgba(120,110,40,.18)" stroke-width="1"/>' for x in range(110, 196, 8)))

# ---------- Ballett ----------
wall_lamp = url(50, 70, '''
  <path d="M25 70 V40" stroke="#d9a86a" stroke-width="3"/><rect x="17" y="60" width="16" height="6" rx="3" fill="#d9a86a"/>
  <path d="M10 40 L40 40 L33 14 L17 14Z" fill="#fff6e0" stroke="#e6c070" stroke-width="2" stroke-linejoin="round"/>
  <ellipse cx="25" cy="42" rx="20" ry="5" fill="#fff3b0" opacity=".6"/>''')
pointe = url(90, 50, f'''
  <path d="M8 40 Q6 28 22 26 Q38 24 44 34 Q46 42 30 44 Q14 46 8 40Z" fill="#ffb3d1" stroke="#e27aa8" stroke-width="2"/>
  <path d="M46 40 Q44 28 60 26 Q76 24 82 34 Q84 42 68 44 Q52 46 46 40Z" fill="#ffb3d1" stroke="#e27aa8" stroke-width="2"/>
  <path d="M24 26 Q30 8 48 4 M62 26 Q58 10 40 2" stroke="#ff8cc6" stroke-width="2" fill="none"/>''')
stars_pink = url(160, 160, ''.join(f'<path d="M{x} {y - 5} L{x + 1.5} {y - 1.5} L{x + 5} {y} L{x + 1.5} {y + 1.5} L{x} {y + 5} L{x - 1.5} {y + 1.5} L{x - 5} {y} L{x - 1.5} {y - 1.5}Z" fill="#ffc2dc" opacity=".8"/>' for x, y in [(20, 24), (90, 60), (140, 20), (50, 120), (120, 130)]))

# ---------- Bühne ----------
lights = url(200, 40, '<path d="M0 6 Q50 26 100 10 T200 8" stroke="#3a2a35" stroke-width="1.6" fill="none"/>' + ''.join(
    f'<circle cx="{x}" cy="{y}" r="5" fill="{c}"/><circle cx="{x}" cy="{y}" r="10" fill="{c}" opacity=".25"/>'
    for x, y, c in [(14, 13, '#ffd23b'), (40, 19, '#ff7eb6'), (66, 18, '#7cf0ff'), (92, 12, '#b8ff7a'), (118, 12, '#ffd23b'), (144, 16, '#ff7eb6'), (170, 13, '#7cf0ff'), (194, 9, '#b8ff7a')]))
night_stars = url(240, 160, ''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#fff" opacity="{o}"/>' for x, y, r, o in [(20, 30, 1.6, .7), (70, 12, 1.2, .5), (130, 40, 1.8, .6), (190, 18, 1.3, .5), (220, 70, 1.6, .6), (40, 90, 1.2, .4), (160, 100, 1.4, .5), (100, 130, 1.2, .4)]))
footlights = url(120, 30, '<rect x="0" y="16" width="120" height="14" fill="#5a3a20"/>' + ''.join(f'<path d="M{x - 9} 16 Q{x} 2 {x + 9} 16Z" fill="#fff3b0"/><ellipse cx="{x}" cy="6" rx="16" ry="10" fill="#fff6c2" opacity=".25"/>' for x in (30, 90)))

# ---------- Bastelstube ----------
craft_shelf = url(220, 120, '''
  <rect x="0" y="96" width="220" height="10" rx="3" fill="#c99257"/><path d="M20 106 V116 M200 106 V116" stroke="#a8703e" stroke-width="5"/>
  <rect x="10" y="50" width="34" height="46" rx="6" fill="#dff3ff" stroke="#9cc8e6" stroke-width="2"/><circle cx="20" cy="80" r="7" fill="#ff7eb6"/><circle cx="33" cy="84" r="7" fill="#ffd23b"/><circle cx="26" cy="68" r="7" fill="#9b7bff"/>
  <rect x="52" y="40" width="10" height="56" rx="4" fill="#ff5a5a"/><rect x="64" y="46" width="10" height="50" rx="4" fill="#4fb3ff"/><rect x="76" y="36" width="10" height="60" rx="4" fill="#62cc5c"/><rect x="88" y="50" width="10" height="46" rx="4" fill="#ffd23b"/>
  <circle cx="124" cy="82" r="14" fill="#ff8cc6" stroke="#e2559a" stroke-width="2"/><path d="M112 76 Q124 70 136 78 M112 86 Q124 80 136 88" stroke="#e2559a" stroke-width="1.6" fill="none"/>
  <circle cx="156" cy="84" r="12" fill="#7cc8ff" stroke="#3b8fd6" stroke-width="2"/><path d="M146 80 Q156 74 166 82" stroke="#3b8fd6" stroke-width="1.6" fill="none"/>
  <path d="M180 96 L196 60 M196 96 L180 60" stroke="#9b7bff" stroke-width="3" stroke-linecap="round"/><circle cx="180" cy="98" r="0" /><circle cx="178" cy="56" r="5" fill="none" stroke="#9b7bff" stroke-width="2.6"/><circle cx="198" cy="56" r="5" fill="none" stroke="#9b7bff" stroke-width="2.6"/>''')
pinboard = url(150, 110, f'''
  <rect x="4" y="4" width="142" height="102" rx="8" fill="#e8c493" stroke="#b07a42" stroke-width="5"/>
  <g transform="rotate(-6 40 46)"><rect x="18" y="22" width="44" height="50" fill="#fff"/><circle cx="40" cy="40" r="10" fill="#ffd23b"/><path d="M22 66 Q32 54 42 62 T60 60 V70 H22Z" fill="#62cc5c"/></g>
  <g transform="rotate(5 104 50)"><rect x="80" y="20" width="48" height="40" fill="#fff4f8"/><path d="M104 46 C96 38 92 34 96 30 C100 27 103 29 104 32 C105 29 108 27 112 30 C116 34 112 38 104 46Z" fill="#ff5a7a"/></g>
  <rect x="86" y="70" width="40" height="26" fill="#dff3ff" transform="rotate(-3 106 83)"/><path d="M92 86 L100 78 L108 86 L116 76 L122 86" stroke="#4fb3ff" stroke-width="3" fill="none"/>
  <circle cx="40" cy="22" r="3.5" fill="#ff5a5a"/><circle cx="104" cy="20" r="3.5" fill="#4fb3ff"/><circle cx="106" cy="70" r="3.5" fill="#62cc5c"/>''')
cutmat = url(160, 60, '<rect x="2" y="2" width="156" height="56" rx="6" fill="#62bf8a" stroke="#3f9a68" stroke-width="2"/>' + ''.join(f'<path d="M{x} 2 V58" stroke="#8fdcb0" stroke-width=".8"/>' for x in range(14, 160, 12)) + ''.join(f'<path d="M2 {y} H158" stroke="#8fdcb0" stroke-width=".8"/>' for y in range(12, 60, 12)))

# ---------- Kletterhalle ----------
holds = url(240, 240, ''.join(
    f'<path d="M{x - 9} {y + 2} Q{x - 8} {y - 9} {x + 1} {y - 8} Q{x + 10} {y - 6} {x + 8} {y + 4} Q{x + 2} {y + 10} {x - 9} {y + 2}Z" fill="{c}" opacity=".55" stroke="rgba(0,0,0,.18)" stroke-width="1.2"/><circle cx="{x}" cy="{y}" r="1.6" fill="rgba(0,0,0,.3)"/>'
    for x, y, c in [(30, 40, '#ff7eb6'), (110, 20, '#ffd23b'), (190, 60, '#62cc5c'), (60, 120, '#4fb3ff'), (150, 110, '#9b7bff'), (210, 170, '#ff9a2e'), (90, 200, '#ff5a5a'), (20, 200, '#3fc7b4')]))
chalk = url(80, 80, f'''
  <path d="M20 30 H60 L56 70 H24Z" fill="#ff7eb6" stroke="#e2559a" stroke-width="2"/><ellipse cx="40" cy="30" rx="20" ry="6" fill="#fff" stroke="#e2559a" stroke-width="2"/>
  <path d="M20 40 Q4 44 10 60" stroke="{INK}" stroke-width="2" fill="none"/>''')
rope = url(40, 300, '<path d="M20 0 Q30 75 18 150 T22 300" stroke="#e8a040" stroke-width="5" fill="none"/><path d="M20 0 Q30 75 18 150 T22 300" stroke="#fff" stroke-width="1.5" stroke-dasharray="4 6" fill="none"/>')

# ---------- Wald ----------
rays = url(400, 300, ''.join(f'<path d="M{x} 0 L{x + 40} 0 L{x + 160} 300 L{x + 90} 300Z" fill="#fffbe0" opacity="{o}"/>' for x, o in [(40, .18), (150, .12), (260, .16)]))
forest_floor = url(300, 70, f'''
  <path d="M0 40 Q40 30 80 40 T160 38 T240 42 T300 38 V70 H0Z" fill="#4f9a48"/>
  <path d="M30 40 Q34 28 38 40 M44 40 Q47 30 50 40 M200 40 Q204 26 208 40 M214 40 Q217 30 220 40" stroke="#7ed96f" stroke-width="3" fill="none" stroke-linecap="round"/>
  <rect x="117" y="30" width="6" height="12" rx="2" fill="#fff6e8"/><path d="M108 32 Q120 14 132 32Z" fill="#ff5a5a"/><circle cx="116" cy="26" r="2" fill="#fff"/><circle cx="125" cy="24" r="2" fill="#fff"/>
  <ellipse cx="260" cy="38" rx="18" ry="7" fill="#9aa0a8"/><ellipse cx="256" cy="35" rx="6" ry="2" fill="#fff" opacity=".4"/>
  <path d="M70 44 l6 -4 l2 6z M160 46 l7 -2 l-1 6z M230 46 l5 -5 l3 6z" fill="#e6a100"/>''')
far_hills = url(400, 120, '<path d="M0 80 Q60 30 120 70 Q180 20 260 66 Q330 30 400 70 V120 H0Z" fill="#a6d79a"/><path d="M0 100 Q80 70 160 96 Q240 66 320 92 Q360 80 400 94 V120 H0Z" fill="#8fc983"/>')

# ---------- Garten & Häuschen ----------
garden_hills = url(400, 100, '<path d="M0 70 Q50 30 110 58 Q170 18 240 56 Q310 26 400 60 V100 H0Z" fill="#c6ecaa"/><path d="M0 86 Q90 60 180 82 Q270 58 400 80 V100 H0Z" fill="#b2e494"/>')
meadow = url(200, 200, ''.join(f'<g transform="translate({x} {y})"><circle r="3" fill="{c}"/><circle r="1.2" fill="#ffd23b"/></g>' for x, y, c in [(20, 30, '#fff'), (120, 60, '#ff8cc6'), (70, 140, '#fff'), (170, 170, '#ffd23b'), (150, 110, '#fff'), (40, 90, '#c9a7ff')]) + ''.join(f'<path d="M{x} {y} q2 -7 4 0 M{x + 6} {y} q2 -6 3 0" stroke="#6fbf52" stroke-width="1.6" fill="none"/>' for x, y in [(90, 30), (10, 170), (130, 150), (180, 80), (60, 70)]))

# ---------- Flughafen ----------
runway = url(300, 60, '<rect x="0" y="20" width="300" height="40" fill="#8a8f9c"/><rect x="0" y="16" width="300" height="5" fill="#62cc5c"/>' + ''.join(f'<rect x="{x}" y="38" width="26" height="4" rx="2" fill="#fff"/>' for x in range(10, 300, 50)) + ''.join(f'<circle cx="{x}" cy="24" r="2" fill="#ffd23b"/>' for x in range(5, 300, 30)))

# ---------- Kleiderschrank ----------
boutique = url(200, 260, '''
  <ellipse cx="100" cy="238" rx="80" ry="16" fill="#ffd1e3"/><ellipse cx="100" cy="236" rx="62" ry="11" fill="#ffe6f1" stroke="#ffb8d6" stroke-width="2" stroke-dasharray="5 4"/>
  <path d="M30 20 Q100 -6 170 20" stroke="#f4c0d8" stroke-width="3" fill="none"/>
  <path d="M60 14 L66 26 L72 12 M128 12 L134 26 L140 14" stroke="#ffd23b" stroke-width="2" fill="none"/>
  <path d="M20 60 L23 66 L30 67 L25 72 L26 79 L20 75 L14 79 L15 72 L10 67 L17 66Z M180 90 L182 94 L187 95 L183 98 L184 103 L180 100 L176 103 L177 98 L173 95 L178 94Z" fill="#ffd23b" opacity=".7"/>''')

css = f'''/* Gezeichnete Hintergrund-Dekorationen – erzeugt mit tools/make-scenes.py, bitte nicht von Hand ändern */

/* Dojo: Schriftrolle, Laternen, Bonsai, Tatami-Matten */
.dojo-wall {{ background:
  {lantern} 22% 0 / auto 26% no-repeat,
  {lantern} 78% 0 / auto 26% no-repeat,
  {scroll} 6% 20% / auto 62% no-repeat,
  {bonsai} 95% 66% / auto 24% no-repeat,
  {shelf} 96% 90% / auto 9% no-repeat,
  linear-gradient(#c9995f 0 5px, transparent 5px) 0 0 / 130px 100px, linear-gradient(90deg, #c9995f 0 5px, transparent 5px) 0 0 / 130px 100px, #fbf1df; opacity: 1; }}
.dojo-floor {{ background: {tatami} 0 0 / 260px auto repeat, #d8d49a; border-top-color: #8a6a3a; }}

/* Ballettstudio: Wimpel, Wandlampen, Spitzenschuhe */
.studio-wall {{ background:
  {bunting(['#ff8cc6', '#ffd23b', '#c9a7ff', '#fff'])} 0 0 / 280px auto repeat-x,
  {wall_lamp} 1.5% 40% / 7% auto no-repeat,
  {wall_lamp} 98.5% 40% / 7% auto no-repeat,
  {stars_pink} 0 0 / 220px 220px repeat,
  linear-gradient(90deg, #ffd9e8 0 2px, transparent 2px) 0 0 / 90px 100%, #fff0f5; }}
.studio-floor {{ background:
  {pointe} 95% 70% / auto 46% no-repeat,
  linear-gradient(rgba(255, 255, 255, .35), transparent 40%),
  repeating-linear-gradient(90deg, #f3cfa0 0 110px, #e9c08c 110px 114px); }}

/* Singbühne: Lichterkette, Sterne, Rampenlicht */
.stage {{ background:
  {lights} 0 2% / 300px auto repeat-x,
  {night_stars} 0 0 / 300px 200px repeat,
  radial-gradient(ellipse at 50% 30%, #5b3f8c, #2d1f4a 75%); }}
.stage-floor {{ background: {footlights} 0 0 / 240px 34px repeat-x, repeating-linear-gradient(90deg, #c98a4c 0 120px, #b47a40 120px 124px); }}

/* Bastelstube: Wimpel, Regal, Pinnwand, Schneidematte */
.craft-wall {{ background:
  {bunting(['#ff7eb6', '#4fb3ff', '#ffd23b', '#62cc5c', '#9b7bff'])} 0 0 / 260px auto repeat-x,
  {craft_shelf} 3% 92% / auto 40% no-repeat,
  {pinboard} 97% 30% / auto 44% no-repeat,
  radial-gradient(circle at 20px 20px, #ffd1e3 0 5px, transparent 6px) 0 0 / 60px 60px, #fff1f6; }}
.craft-table {{ background: {cutmat} 50% 40% / auto 70% no-repeat, linear-gradient(#f0c48a, #e0ac6c); }}

/* Kletterhalle: bunte Griffe, Seil, Kreidebeutel */
.climb > .climb-wall {{ background:
  {rope} 8% 0 / auto 100% no-repeat,
  {rope} 93% 0 / auto 100% no-repeat,
  {holds} 0 0 / 260px 260px repeat,
  linear-gradient(135deg, rgba(255, 255, 255, .25) 25%, transparent 25%) 0 0 / 80px 80px, #b8c7d9; }}
.climb-floor {{ background: {chalk} 4% 0 / auto 100% no-repeat, repeating-linear-gradient(90deg, #4a90d9 0 90px, #3f7fc4 90px 94px); }}

/* Wald: Lichtstrahlen, Hügel, Waldboden */
.forest {{ background:
  {rays} 50% 0 / 100% 70% no-repeat,
  {far_hills} 0 62% / 100% 30% no-repeat,
  linear-gradient(#bfe6c0, #7fc77a 60%, #5aa857); }}
.forest-bg {{ background: {forest_floor} 0 100% / 520px 16% repeat-x; }}

/* Garten und Häuschen: Hügel und Blumenwiese */
.garden-top {{ background: {garden_hills} 0 100% / 100% 55% no-repeat, linear-gradient(#a6dcff, #e4f6ff 75%); }}
.garden {{ background: {meadow} 0 0 / 200px 200px repeat, var(--grass); }}
.house-scene {{ background:
  {garden_hills} 0 calc(45% + 1px) / 100% 22% no-repeat,
  {meadow} 0 100% / 200px 200px repeat-x,
  linear-gradient(#a6dcff, #e4f6ff 55%, #8fd46b 55%); }}

/* Flughafen: Landebahn unter den Fragen */
.globe.round {{ background: {runway} 0 100% / 360px 10% repeat-x, radial-gradient(ellipse at 50% 120%, #9fd8ff, #cfeaff 55%, #eaf6ff); }}

/* Kleiderschrank: Laufsteg mit Teppich */
.w-preview {{ background: {boutique} 50% 100% / 100% auto no-repeat, radial-gradient(ellipse at 50% 85%, #ffe6f1, #fff7fb 70%); }}
.w-tile {{ background-image: linear-gradient(#fff, #fdf8ff); }}
.w-tile.sel {{ background-image: linear-gradient(#fbf7ff, #efe6ff); }}
'''
open(OUT, 'w').write(css)
print('geschrieben:', OUT, len(css), 'Zeichen')
