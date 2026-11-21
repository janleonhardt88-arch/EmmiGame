// Spielinhalte: Pflanzen, Tiere, Gürtel, Preise.
// Portugiesisch = europäisches Portugiesisch (pt-PT), mit Artikel.

export const PLANTS = {
  radish: {
    de: 'das Radieschen', deAkk: 'das Radieschen', deIndef: 'ein Radieschen', name: 'Radieschen',
    en: 'radish', pt: 'o rabanete',
    price: 2, water: 2, reward: 5, belt: 0,
  },
  carrot: {
    de: 'die Karotte', deAkk: 'die Karotte', deIndef: 'eine Karotte', name: 'Karotte',
    en: 'carrot', pt: 'a cenoura',
    price: 3, water: 2, reward: 7, belt: 0,
  },
  tomato: {
    de: 'die Tomate', deAkk: 'die Tomate', deIndef: 'eine Tomate', name: 'Tomate',
    en: 'tomato', pt: 'o tomate',
    price: 4, water: 3, reward: 10, belt: 0,
  },
  strawberry: {
    de: 'die Erdbeere', deAkk: 'die Erdbeere', deIndef: 'eine Erdbeere', name: 'Erdbeere',
    en: 'strawberry', pt: 'o morango',
    price: 5, water: 3, reward: 12, belt: 1,
  },
  sunflower: {
    de: 'die Sonnenblume', deAkk: 'die Sonnenblume', deIndef: 'eine Sonnenblume', name: 'Sonnenblume',
    en: 'sunflower', pt: 'o girassol',
    price: 6, water: 4, reward: 16, belt: 2,
  },
  pumpkin: {
    de: 'der Kürbis', deAkk: 'den Kürbis', deIndef: 'einen Kürbis', name: 'Kürbis',
    en: 'pumpkin', pt: 'a abóbora',
    price: 8, water: 5, reward: 22, belt: 3,
  },
};

export const ANIMALS = {
  chicken: { de: 'das Huhn', name: 'Huhn', en: 'chicken', pt: 'a galinha', price: 15, belt: 0, sound: 'Gack gack!' },
  bunny: { de: 'der Hase', name: 'Hase', en: 'rabbit', pt: 'o coelho', price: 25, belt: 1, sound: 'Schnupper!' },
  hedgehog: { de: 'der Igel', name: 'Igel', en: 'hedgehog', pt: 'o ouriço', price: 35, belt: 2, sound: 'Schnuff!' },
  sheep: { de: 'das Schaf', name: 'Schaf', en: 'sheep', pt: 'a ovelha', price: 50, belt: 3, sound: 'Mähhh!' },
};
export const MAX_PER_ANIMAL = 3;

// Gürtel: werden nach oben hin immer seltener (ca. 1 Punkt pro richtiger Aufgabe)
export const BELTS = [
  { de: 'Weißer Gürtel', dn: 'der weiße Gürtel', color: '#ffffff', xp: 0, pt: 'o cinto branco', en: 'white belt' },
  { de: 'Gelber Gürtel', dn: 'der gelbe Gürtel', color: '#ffd93b', xp: 40, pt: 'o cinto amarelo', en: 'yellow belt' },
  { de: 'Oranger Gürtel', dn: 'der orange Gürtel', color: '#ff9a3b', xp: 120, pt: 'o cinto laranja', en: 'orange belt' },
  { de: 'Grüner Gürtel', dn: 'der grüne Gürtel', color: '#4cc35a', xp: 250, pt: 'o cinto verde', en: 'green belt' },
  { de: 'Blauer Gürtel', dn: 'der blaue Gürtel', color: '#3b8cff', xp: 450, pt: 'o cinto azul', en: 'blue belt' },
  { de: 'Brauner Gürtel', dn: 'der braune Gürtel', color: '#9a5b2e', xp: 750, pt: 'o cinto castanho', en: 'brown belt' },
  { de: 'Schwarzer Gürtel', dn: 'der schwarze Gürtel', color: '#2b2b2b', xp: 1150, pt: 'o cinto preto', en: 'black belt' },
  { de: 'Bronze-Gürtel', dn: 'der Bronze-Gürtel', color: '#cd7f32', xp: 1700, pt: 'o cinto de bronze', en: 'bronze belt' },
  { de: 'Silber-Gürtel', dn: 'der Silber-Gürtel', color: '#c3c9d3', xp: 2400, pt: 'o cinto de prata', en: 'silver belt' },
  { de: 'Gold-Gürtel', dn: 'der Gold-Gürtel', color: '#f4c430', xp: 3300, pt: 'o cinto de ouro', en: 'gold belt' },
  { de: 'Diamant-Gürtel', dn: 'der Diamant-Gürtel', color: '#8fe3ff', xp: 4500, pt: 'o cinto de diamante', en: 'diamond belt' },
];
// Gürtel-Grenzen der ersten Version – für die Umrechnung alter Spielstände
export const OLD_BELT_XP = [0, 25, 60, 110, 180, 270, 400];

export function beltIndex(xp) {
  let i = 0;
  while (i + 1 < BELTS.length && xp >= BELTS[i + 1].xp) i++;
  return i;
}

export const DECOS = {
  bench: { name: 'Gartenbank', de: 'die Bank', en: 'bench', pt: 'o banco', price: 20 },
  balloons: { name: 'Luftballons', de: 'die Luftballons', en: 'balloons', pt: 'os balões', price: 25 },
  birdhouse: { name: 'Vogelhaus', de: 'das Vogelhaus', en: 'birdhouse', pt: 'a casa dos pássaros', price: 30 },
  pond: { name: 'Ententeich', de: 'der Teich', en: 'pond', pt: 'o lago', price: 45 },
  rainbow: { name: 'Regenbogen', de: 'der Regenbogen', en: 'rainbow', pt: 'o arco-íris', price: 60 },
};

export const START_BEDS = 4;
export const MAX_BEDS = 8;
export const BED_PRICES = [15, 25, 35, 50];

// Einmaleins-Reihen je nach Gürtel (falls Eltern nichts festlegen)
export const DOJO_ROWS = [
  [2, 5, 10],
  [2, 3, 4, 5, 10],
  [2, 3, 4, 5, 6, 10],
  [2, 3, 4, 5, 6, 7, 8, 9, 10],
];
// Geteilt-Aufgaben nur, wenn Eltern sie einschalten (automatisch zu schwer für die 2. Klasse)
export const DOJO_DIV_FROM_BELT = 99;
export const DOJO_BOARDS = 10;
export const DOJO_FAST_MS = 6000;

export const HAIR = {
  brown: { de: 'Braun', color: '#7a4a2c' },
  light: { de: 'Hellbraun', color: '#a8703e' },
  blond: { de: 'Blond', color: '#e3b34c' },
  black: { de: 'Schwarz', color: '#2e2430' },
  red: { de: 'Rot', color: '#c8562a' },
  pink: { de: 'Pink', color: '#ff6fb0', price: 20 },
  lila: { de: 'Lila', color: '#9b6bff', price: 20 },
  blue: { de: 'Blau', color: '#4f9bff', price: 20 },
  mint: { de: 'Türkis', color: '#3fc7b4', price: 20 },
};

export const PRAISE = ['Super!', 'Toll!', 'Klasse!', 'Richtig!', 'Spitze!', 'Prima!', 'Wunderbar!', 'Genial!', 'Fantastisch!', 'Megastark!', 'Weiter so!', 'Bombastisch!', 'Du bist ein Profi!', 'Hammer!', 'Sensationell!'];
