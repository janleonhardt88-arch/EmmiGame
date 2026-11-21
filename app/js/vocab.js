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
  ['age', 'Wie alt bist du?', 'How old are you?', 'Quantos anos tens?'],
  ['where', 'Wo wohnst du?', 'Where do you live?', 'Onde moras?'],
  ['live', 'Ich wohne in Deutschland.', 'I live in Germany.', 'Eu moro na Alemanha.'],
  ['play', 'Wollen wir spielen?', 'Shall we play?', 'Vamos brincar?'],
  ['yes', 'Ja, gern!', 'Yes, please!', 'Sim, por favor!'],
  ['help', 'Kannst du mir helfen?', 'Can you help me?', 'Podes ajudar-me?'],
  ['understand', 'Ich verstehe nicht.', "I don't understand.", 'Não percebo.'],
  ['again', 'Noch einmal, bitte.', 'Once more, please.', 'Outra vez, por favor.'],
  ['thirsty', 'Ich habe Durst.', 'I am thirsty.', 'Tenho sede.'],
  ['tired', 'Ich bin müde.', 'I am tired.', 'Estou cansada.'],
  ['happy', 'Ich bin glücklich.', 'I am happy.', 'Estou feliz.'],
  ['color', 'Meine Lieblingsfarbe ist Rosa.', 'My favourite colour is pink.', 'A minha cor preferida é cor-de-rosa.'],
  ['weather', 'Heute scheint die Sonne.', 'The sun is shining today.', 'Hoje está sol.'],
  ['rain', 'Es regnet.', "It's raining.", 'Está a chover.'],
];


// Weitere Wortfelder mit Emoji-Bildern: [Emoji, Deutsch, Englisch, Portugiesisch (Portugal)]
const MORE_COLORS = [['grey', '#9aa0a6', 'grau', 'grey', 'cinzento']];
const MORE_NUMBERS = [
  ['dreizehn', 'thirteen', 'treze'], ['vierzehn', 'fourteen', 'catorze'], ['fünfzehn', 'fifteen', 'quinze'],
  ['sechzehn', 'sixteen', 'dezasseis'], ['siebzehn', 'seventeen', 'dezassete'], ['achtzehn', 'eighteen', 'dezoito'],
  ['neunzehn', 'nineteen', 'dezanove'], ['zwanzig', 'twenty', 'vinte'],
];
const FARM = [
  ['🐴', 'das Pferd', 'horse', 'o cavalo'], ['🐮', 'die Kuh', 'cow', 'a vaca'], ['🐷', 'das Schwein', 'pig', 'o porco'],
  ['🦆', 'die Ente', 'duck', 'o pato'], ['🐐', 'die Ziege', 'goat', 'a cabra'], ['🐭', 'die Maus', 'mouse', 'o rato'],
];
const FRUIT = [
  ['🍊', 'die Orange', 'orange', 'a laranja'], ['🍇', 'die Weintrauben', 'grapes', 'as uvas'], ['🍐', 'die Birne', 'pear', 'a pera'],
  ['🍋', 'die Zitrone', 'lemon', 'o limão'], ['🍉', 'die Wassermelone', 'watermelon', 'a melancia'], ['🍒', 'die Kirschen', 'cherries', 'as cerejas'],
  ['🍍', 'die Ananas', 'pineapple', 'o ananás'], ['🍑', 'der Pfirsich', 'peach', 'o pêssego'], ['🥝', 'die Kiwi', 'kiwi', 'o kiwi'],
];
const EMOJI_CATS = {
  wild: ['Wilde Tiere', '🦁', [
    ['🐘', 'der Elefant', 'elephant', 'o elefante'], ['🦁', 'der Löwe', 'lion', 'o leão'], ['🐒', 'der Affe', 'monkey', 'o macaco'],
    ['🦒', 'die Giraffe', 'giraffe', 'a girafa'], ['🐻', 'der Bär', 'bear', 'o urso'], ['🐯', 'der Tiger', 'tiger', 'o tigre'],
    ['🐧', 'der Pinguin', 'penguin', 'o pinguim'], ['🦓', 'das Zebra', 'zebra', 'a zebra'], ['🐢', 'die Schildkröte', 'turtle', 'a tartaruga'],
    ['🐬', 'der Delfin', 'dolphin', 'o golfinho'], ['🦋', 'der Schmetterling', 'butterfly', 'a borboleta'], ['🦊', 'der Fuchs', 'fox', 'a raposa'],
    ['🦉', 'die Eule', 'owl', 'a coruja'],
  ]],
  body: ['Körper', '✋', [
    ['👁️', 'das Auge', 'eye', 'o olho'], ['👂', 'das Ohr', 'ear', 'a orelha'], ['👃', 'die Nase', 'nose', 'o nariz'],
    ['👄', 'der Mund', 'mouth', 'a boca'], ['🦷', 'der Zahn', 'tooth', 'o dente'], ['👅', 'die Zunge', 'tongue', 'a língua'],
    ['✋', 'die Hand', 'hand', 'a mão'], ['🦶', 'der Fuß', 'foot', 'o pé'], ['🦵', 'das Bein', 'leg', 'a perna'],
    ['💪', 'der Arm', 'arm', 'o braço'], ['💇‍♀️', 'die Haare', 'hair', 'o cabelo'],
  ]],
  clothes: ['Kleidung', '👗', [
    ['👕', 'das T-Shirt', 'T-shirt', 'a t-shirt'], ['👗', 'das Kleid', 'dress', 'o vestido'], ['👖', 'die Hose', 'trousers', 'as calças'],
    ['👟', 'die Turnschuhe', 'trainers', 'os ténis'], ['🧦', 'die Socken', 'socks', 'as meias'], ['🧢', 'die Kappe', 'cap', 'o boné'],
    ['👒', 'der Hut', 'hat', 'o chapéu'], ['🧥', 'die Jacke', 'jacket', 'o casaco'], ['🧤', 'die Handschuhe', 'gloves', 'as luvas'],
    ['🧣', 'der Schal', 'scarf', 'o cachecol'], ['👓', 'die Brille', 'glasses', 'os óculos'], ['🩱', 'der Badeanzug', 'swimsuit', 'o fato de banho'],
    ['🩰', 'die Ballettschuhe', 'ballet shoes', 'as sapatilhas de ballet'],
  ]],
  meals: ['Essen & Trinken', '🍕', [
    ['🍞', 'das Brot', 'bread', 'o pão'], ['🧀', 'der Käse', 'cheese', 'o queijo'], ['🥛', 'die Milch', 'milk', 'o leite'],
    ['🥚', 'das Ei', 'egg', 'o ovo'], ['🍕', 'die Pizza', 'pizza', 'a pizza'], ['🍦', 'das Eis', 'ice cream', 'o gelado'],
    ['🍰', 'der Kuchen', 'cake', 'o bolo'], ['🍫', 'die Schokolade', 'chocolate', 'o chocolate'], ['💧', 'das Wasser', 'water', 'a água'],
    ['🧃', 'der Saft', 'juice', 'o sumo'], ['🍝', 'die Nudeln', 'pasta', 'a massa'], ['🍚', 'der Reis', 'rice', 'o arroz'],
    ['🥣', 'die Suppe', 'soup', 'a sopa'], ['🍪', 'der Keks', 'biscuit', 'a bolacha'],
  ]],
  family: ['Familie', '👨‍👩‍👧', [
    ['👩', 'die Mama', 'mum', 'a mãe'], ['👨', 'der Papa', 'dad', 'o pai'], ['👧', 'die Schwester', 'sister', 'a irmã'],
    ['👦', 'der Bruder', 'brother', 'o irmão'], ['👵', 'die Oma', 'grandma', 'a avó'], ['👴', 'der Opa', 'grandpa', 'o avô'],
    ['👶', 'das Baby', 'baby', 'o bebé'], ['👭', 'die Freundin', 'friend', 'a amiga'], ['👨‍👩‍👧', 'die Familie', 'family', 'a família'],
    ['🧑‍🏫', 'die Lehrerin', 'teacher', 'a professora'],
  ]],
  school: ['Schule', '🎒', [
    ['📚', 'das Buch', 'book', 'o livro'], ['✏️', 'der Bleistift', 'pencil', 'o lápis'], ['🖍️', 'der Buntstift', 'crayon', 'o lápis de cor'],
    ['🎒', 'der Schulranzen', 'school bag', 'a mochila'], ['✂️', 'die Schere', 'scissors', 'a tesoura'], ['📏', 'das Lineal', 'ruler', 'a régua'],
    ['🏫', 'die Schule', 'school', 'a escola'], ['📓', 'das Heft', 'exercise book', 'o caderno'], ['🖊️', 'der Füller', 'pen', 'a caneta'],
    ['🧮', 'der Rechenrahmen', 'abacus', 'o ábaco'],
  ]],
  weather: ['Wetter & Jahreszeiten', '🌦️', [
    ['🌧️', 'der Regen', 'rain', 'a chuva'], ['❄️', 'der Schnee', 'snow', 'a neve'], ['🌈', 'der Regenbogen', 'rainbow', 'o arco-íris'],
    ['☁️', 'die Wolke', 'cloud', 'a nuvem'], ['⛈️', 'das Gewitter', 'thunderstorm', 'a trovoada'], ['💨', 'der Wind', 'wind', 'o vento'],
    ['🌷', 'der Frühling', 'spring', 'a primavera'], ['🏖️', 'der Sommer', 'summer', 'o verão'], ['🍂', 'der Herbst', 'autumn', 'o outono'],
    ['⛄', 'der Winter', 'winter', 'o inverno'],
  ]],
  vehicles: ['Fahrzeuge', '🚗', [
    ['🚗', 'das Auto', 'car', 'o carro'], ['🚌', 'der Bus', 'bus', 'o autocarro'], ['🚂', 'der Zug', 'train', 'o comboio'],
    ['✈️', 'das Flugzeug', 'plane', 'o avião'], ['🚲', 'das Fahrrad', 'bike', 'a bicicleta'], ['⛵', 'das Boot', 'boat', 'o barco'],
    ['🚁', 'der Hubschrauber', 'helicopter', 'o helicóptero'], ['🚀', 'die Rakete', 'rocket', 'o foguetão'],
    ['🚒', 'das Feuerwehrauto', 'fire engine', 'o carro dos bombeiros'], ['🛴', 'der Roller', 'scooter', 'a trotinete'],
    ['🚜', 'der Traktor', 'tractor', 'o trator'],
  ]],
  hobbies: ['Was ich gern mache', '💃', [
    ['💃', 'tanzen', 'to dance', 'dançar'], ['🎤', 'singen', 'to sing', 'cantar'], ['🧗‍♀️', 'klettern', 'to climb', 'escalar'],
    ['🏊‍♀️', 'schwimmen', 'to swim', 'nadar'], ['🏃‍♀️', 'laufen', 'to run', 'correr'], ['📖', 'lesen', 'to read', 'ler'],
    ['✍️', 'schreiben', 'to write', 'escrever'], ['🎨', 'malen', 'to paint', 'pintar'], ['😴', 'schlafen', 'to sleep', 'dormir'],
    ['🍽️', 'essen', 'to eat', 'comer'], ['🥋', 'Karate machen', 'to do karate', 'fazer karaté'], ['🧶', 'häkeln', 'to crochet', 'fazer croché'],
    ['🌱', 'gärtnern', 'to garden', 'jardinar'],
  ]],
  home: ['Zuhause', '🛋️', [
    ['🛏️', 'das Bett', 'bed', 'a cama'], ['🪑', 'der Stuhl', 'chair', 'a cadeira'], ['🚪', 'die Tür', 'door', 'a porta'],
    ['🪟', 'das Fenster', 'window', 'a janela'], ['🛁', 'die Badewanne', 'bathtub', 'a banheira'], ['🛋️', 'das Sofa', 'sofa', 'o sofá'],
    ['💡', 'die Lampe', 'lamp', 'o candeeiro'], ['🧸', 'der Teddy', 'teddy bear', 'o ursinho de peluche'], ['📺', 'der Fernseher', 'TV', 'a televisão'],
    ['⏰', 'der Wecker', 'alarm clock', 'o despertador'], ['🔑', 'der Schlüssel', 'key', 'a chave'], ['🪞', 'der Spiegel', 'mirror', 'o espelho'],
  ]],
};
const emojiWords = (prefix, list) => list.map(([e, de, en, pt]) => ({ id: `${prefix}-${en.replace(/\W+/g, '_')}`, de, en, pt, art: () => art.emoji(e) }));

export const CATEGORIES = {
  colors: {
    de: 'Farben', icon: () => art.colorBlob('#ff8cc6'),
    words: [...COLORS, ...MORE_COLORS].map(([id, c, de, en, pt]) => ({ id: 'c-' + id, de, en, pt, art: () => art.colorBlob(c) })),
  },
  numbers: {
    de: 'Zahlen', icon: () => art.numberCard(3),
    words: [...NUMBERS, ...MORE_NUMBERS].map(([de, en, pt], i) => ({ id: 'n-' + (i + 1), de, en, pt, art: () => art.numberCard(i + 1) })),
  },
  animals: {
    de: 'Tiere', icon: () => art.thing('cat'),
    words: [
      ...Object.entries(ANIMALS).map(([id, a]) => ({ id: 'a-' + id, de: a.de, en: a.en, pt: a.pt, art: () => art.animal(id) })),
      ...EXTRA_ANIMALS.map(([id, de, en, pt]) => ({ id: 'a-' + id, de, en, pt, art: () => art.thing(id) })),
      ...emojiWords('a', FARM),
    ],
  },
  food: {
    de: 'Obst & Gemüse', icon: () => art.thing('apple'),
    words: [
      ...Object.entries(PLANTS).filter(([id]) => id !== 'sunflower').map(([id, p]) => ({ id: 'f-' + id, de: p.de, en: p.en, pt: p.pt, art: () => art.plant(id) })),
      ...FOOD.map(([id, de, en, pt]) => ({ id: 'f-' + id, de, en, pt, art: () => art.thing(id) })),
      ...emojiWords('f', FRUIT),
    ],
  },
  nature: {
    de: 'Rund ums Haus', icon: () => art.thing('house'),
    words: NATURE.map(([id, de, en, pt]) => ({ id: 'w-' + id, de, en, pt, art: () => art.thing(id) })),
  },
  ...Object.fromEntries(Object.entries(EMOJI_CATS).map(([key, [de, ico, list]]) => [key, { de, icon: () => art.emoji(ico), words: emojiWords(key, list) }])),
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
