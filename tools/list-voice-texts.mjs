// Listet alle Texte auf, die das Spiel vorliest – als JSON-Zeilen {lang, text}.
// Wird von tools/make-voices.py benutzt, um die Sprachdateien in app/voice/ zu erzeugen.
import { PLANTS, ANIMALS, BELTS, DECOS, PRAISE } from '../app/js/data.js';
import { CATEGORIES } from '../app/js/vocab.js';
import { NOUNS, VERBS, ADJECTIVES, SPELLING, SYLLABLE_WORDS, RHYMES } from '../app/js/words.js';
import { NATURE_QUESTIONS, FINDS } from '../app/js/sachkunde.js';
import { COUNTRIES, allGeoTasks } from '../app/js/erdkunde.js';
import { FURNITURE } from '../app/js/house-data.js';

const NAME = 'Emmi';
const out = new Map();
const add = (lang, text) => { const t = text.replace('{name}', NAME); out.set(`${lang}|${t}`, { lang, text: t }); };

for (const c of Object.values(CATEGORIES)) {
  for (const w of c.words) { add('pt-PT', w.pt); add('en-GB', w.en); }
}
for (const x of [...Object.values(PLANTS), ...Object.values(ANIMALS), ...Object.values(DECOS)]) {
  add('pt-PT', x.pt); add('en-GB', x.en); add('de-DE', x.de);
}
for (const b of BELTS) { add('pt-PT', b.pt); add('en-GB', b.en); add('de-DE', b.dn); }
for (const t of ['Olá!', 'Bom dia!', 'Como estás?', 'Muito bem!', 'Obrigado!']) add('pt-PT', t);
for (const t of ['Hello!', 'Good morning!', 'How are you?', 'Well done!']) add('en-GB', t);

// Deutsch: Lob, Kletterwand-Wörter, Uhrzeiten
for (const t of [...PRAISE, ...NOUNS, ...VERBS, ...ADJECTIVES]) add('de-DE', t);
for (const [right] of SPELLING) add('de-DE', right);
for (const [w] of SYLLABLE_WORDS) add('de-DE', w.replace(/-/g, ''));
for (const [w] of RHYMES) add('de-DE', w);

const nh = (h) => (h % 12) + 1;
function timeLabel(h, m) {
  if (m === 0) return `${h} Uhr`;
  if (m === 30) return `halb ${nh(h)}`;
  if (m === 15) return `Viertel nach ${h}`;
  if (m === 45) return `Viertel vor ${nh(h)}`;
  if (m < 25) return `${m} nach ${h}`;
  if (m === 25) return `5 vor halb ${nh(h)}`;
  if (m === 35) return `5 nach halb ${nh(h)}`;
  return `${60 - m} vor ${nh(h)}`;
}
for (let h = 1; h <= 12; h++) for (let m = 0; m < 60; m += 5) add('de-DE', `Es ist ${timeLabel(h, m)}.`);

// Wald, Weltreise, Häuschen
for (const t of NATURE_QUESTIONS) add('de-DE', t.q);
for (const f of Object.values(FINDS)) { add('pt-PT', f.pt); add('en-GB', f.en); add('de-DE', f.de); }
for (const t of allGeoTasks()) add('de-DE', t.q);
for (const c of COUNTRIES) { add('pt-PT', c.pt); add('en-GB', c.en); }
for (const f of Object.values(FURNITURE)) { add('pt-PT', f.pt); add('en-GB', f.en); add('de-DE', f.de); }

console.log(JSON.stringify([...out.values()]));
