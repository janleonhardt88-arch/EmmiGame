// Wortschatz für die Singbühne: Deutsch / Englisch / Portugiesisch (Portugal)
import * as art from './art.js';
import { PLANTS, ANIMALS } from './data.js';

const COLORS = [
  ['red', '#ff4f4f', 'rot', 'red', 'vermelho'],
  ['blue', '#3b8cff', 'blau', 'blue', 'azul'],
  ['yellow', '#ffd23b', 'gelb', 'yellow', 'amarelo'],
  ['green', '#4cc35a', 'grün', 'green', 'verde'],
  ['orange', '#ff9a2e', 'orange', 'orange', 'laranja'],
  ['pink', '#ff8cc6', 'rosa', 'pink', 'cor-de-rosa'],
  ['purple', '#9b59d0', 'lila', 'purple', 'roxo'],
  ['black', '#2b2b2b', 'schwarz', 'black', 'preto'],
  ['white', '#ffffff', 'weiß', 'white', 'branco'],
  ['brown', '#9a5b2e', 'braun', 'brown', 'castanho'],
];

const NUMBERS = [
  ['eins', 'one', 'um'], ['zwei', 'two', 'dois'], ['drei', 'three', 'três'], ['vier', 'four', 'quatro'],
  ['fünf', 'five', 'cinco'], ['sechs', 'six', 'seis'], ['sieben', 'seven', 'sete'], ['acht', 'eight', 'oito'],
  ['neun', 'nine', 'nove'], ['zehn', 'ten', 'dez'], ['elf', 'eleven', 'onze'], ['zwölf', 'twelve', 'doze'],
];

const EXTRA_ANIMALS = [
  ['cat', 'die Katze', 'cat', 'o gato'],
  ['dog', 'der Hund', 'dog', 'o cão'],
  ['fish', 'der Fisch', 'fish', 'o peixe'],
  ['bird', 'der Vogel', 'bird', 'o pássaro'],
];

const FOOD = [
  ['apple', 'der Apfel', 'apple', 'a maçã'],
  ['banana', 'die Banane', 'banana', 'a banana'],
];

const NATURE = [
  ['sun', 'die Sonne', 'sun', 'o sol'],
  ['moon', 'der Mond', 'moon', 'a lua'],
  ['star', 'der Stern', 'star', 'a estrela'],
  ['flower', 'die Blume', 'flower', 'a flor'],
  ['tree', 'der Baum', 'tree', 'a árvore'],
  ['house', 'das Haus', 'house', 'a casa'],
  ['heart', 'das Herz', 'heart', 'o coração'],
  ['ball', 'der Ball', 'ball', 'a bola'],
];

const PHRASES = [
  ['hello', 'Hallo!', 'Hello!', 'Olá!'],
  ['morning', 'Guten Morgen!', 'Good morning!', 'Bom dia!'],
  ['night', 'Gute Nacht!', 'Good night!', 'Boa noite!'],
  ['thanks', 'Danke!', 'Thank you!', 'Obrigada!'],
  ['please', 'Bitte!', 'Please!', 'Por favor!'],
  ['sorry', 'Entschuldigung!', 'Sorry!', 'Desculpa!'],
  ['bye', 'Tschüss!', 'Goodbye!', 'Adeus!'],
  ['tomorrow', 'Bis morgen!', 'See you tomorrow!', 'Até amanhã!'],
  ['howareyou', 'Wie geht es dir?', 'How are you?', 'Como estás?'],
  ['fine', 'Mir geht es gut.', 'I am fine.', 'Estou bem.'],
  ['name', 'Ich heiße {name}.', 'My name is {name}.', 'Chamo-me {name}.'],
  ['sing', 'Ich singe gern.', 'I like singing.', 'Eu gosto de cantar.'],
  ['dance', 'Ich tanze gern.', 'I like dancing.', 'Eu gosto de dançar.'],
  ['climb', 'Ich klettere gern.', 'I like climbing.', 'Eu gosto de escalar.'],
  ['hungry', 'Ich habe Hunger.', 'I am hungry.', 'Tenho fome.'],
  ['love', 'Ich hab dich lieb!', 'I love you!', 'Adoro-te!'],
];

export const CATEGORIES = {
  colors: {
    de: 'Farben', icon: () => art.colorBlob('#ff8cc6'),
    words: COLORS.map(([id, c, de, en, pt]) => ({ id: 'c-' + id, de, en, pt, art: () => art.colorBlob(c) })),
  },
  numbers: {
    de: 'Zahlen', icon: () => art.numberCard(3),
    words: NUMBERS.map(([de, en, pt], i) => ({ id: 'n-' + (i + 1), de, en, pt, art: () => art.numberCard(i + 1) })),
  },
  animals: {
    de: 'Tiere', icon: () => art.thing('cat'),
    words: [
      ...Object.entries(ANIMALS).map(([id, a]) => ({ id: 'a-' + id, de: a.de, en: a.en, pt: a.pt, art: () => art.animal(id) })),
      ...EXTRA_ANIMALS.map(([id, de, en, pt]) => ({ id: 'a-' + id, de, en, pt, art: () => art.thing(id) })),
    ],
  },
  food: {
    de: 'Obst & Gemüse', icon: () => art.thing('apple'),
    words: [
      ...Object.entries(PLANTS).filter(([id]) => id !== 'sunflower').map(([id, p]) => ({ id: 'f-' + id, de: p.de, en: p.en, pt: p.pt, art: () => art.plant(id) })),
      ...FOOD.map(([id, de, en, pt]) => ({ id: 'f-' + id, de, en, pt, art: () => art.thing(id) })),
    ],
  },
  nature: {
    de: 'Rund ums Haus', icon: () => art.thing('house'),
    words: NATURE.map(([id, de, en, pt]) => ({ id: 'w-' + id, de, en, pt, art: () => art.thing(id) })),
  },
  phrases: {
    de: 'Sätze', icon: () => art.bubbleIcon(), phrases: true,
    words: PHRASES.map(([id, de, en, pt]) => ({ id: 's-' + id, de, en, pt })),
  },
};

// Alle Texte, die vorgelesen werden (für eigene Aufnahmen im Elternbereich)
export function allTexts(lang, name) {
  const key = lang.startsWith('pt') ? 'pt' : 'en';
  const out = [];
  for (const c of Object.values(CATEGORIES)) {
    out.push({ group: c.de, items: c.words.map((w) => w[key].replace('{name}', name)) });
  }
  out.push({ group: 'Pflanzen', items: Object.values(PLANTS).map((p) => p[key]) });
  return out;
}

export const LANGS = {
  pt: { flag: '🇵🇹', de: 'Portugiesisch', tts: 'pt-PT' },
  en: { flag: '🇬🇧', de: 'Englisch', tts: 'en-GB' },
};
