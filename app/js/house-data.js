// 🏡 Daten fürs Häuschen: Bauschritte und Möbel
export const HOUSE_STAGES = [
  { de: 'Fundament', wood: 8, stars: 0, txt: 'Zuerst kommt ein stabiles Fundament aus Steinen.' },
  { de: 'Wände', wood: 15, stars: 0, txt: 'Aus Holzbrettern werden die Wände.' },
  { de: 'Dach', wood: 15, stars: 5, txt: 'Ein Dach schützt vor Regen.' },
  { de: 'Tür und Fenster', wood: 10, stars: 10, txt: 'Damit du hinein kannst und Licht hast.' },
  { de: 'Schornstein und Blumen', wood: 8, stars: 15, txt: 'Zum Schluss wird es richtig gemütlich.' },
];

// Möbel: Bild, Namen, Preis (Holz/Sterne) und Platz im Zimmer (Zimmer im Format 16:10).
// zone 'wall': Mitte bei x/y · zone 'floor': steht mit der Unterkante auf Höhe b · zone 'ceil': hängt von der Decke
// zone 'flat': liegt auf dem Boden (Teppich). Alle Angaben in Prozent, s = Breite in % der Zimmerbreite.
export const FURNITURE = {
  rug: { svg: 'rug', de: 'der Teppich', pt: 'o tapete', en: 'rug', wood: 0, stars: 15, zone: 'flat', x: 50, y: 89, s: 36 },
  bed: { ico: '🛏️', de: 'das Bett', pt: 'a cama', en: 'bed', wood: 10, stars: 0, zone: 'floor', x: 14, b: 86, s: 23 },
  sofa: { ico: '🛋️', de: 'das Sofa', pt: 'o sofá', en: 'sofa', wood: 12, stars: 10, zone: 'floor', x: 50, b: 80, s: 19 },
  table: { svg: 'table', de: 'der Tisch', pt: 'a mesa', en: 'table', wood: 8, stars: 0, zone: 'floor', x: 75, b: 97, s: 15 },
  chair: { ico: '🪑', de: 'der Stuhl', pt: 'a cadeira', en: 'chair', wood: 5, stars: 0, zone: 'floor', x: 89, b: 97, s: 10 },
  shelf: { svg: 'shelf', de: 'das Bücherregal', pt: 'a estante', en: 'bookshelf', wood: 8, stars: 5, zone: 'wall', x: 87, y: 30, s: 13 },
  lamp: { svg: 'ceilingLamp', de: 'die Lampe', pt: 'o candeeiro', en: 'lamp', wood: 2, stars: 8, zone: 'ceil', x: 37, s: 7 },
  picture: { ico: '🖼️', de: 'das Bild', pt: 'o quadro', en: 'picture', wood: 2, stars: 10, zone: 'wall', x: 25, y: 30, s: 10 },
  clock: { ico: '🕰️', de: 'die Uhr', pt: 'o relógio', en: 'clock', wood: 3, stars: 10, zone: 'wall', x: 70, y: 22, s: 7 },
  mirror: { ico: '🪞', de: 'der Spiegel', pt: 'o espelho', en: 'mirror', wood: 3, stars: 12, zone: 'wall', x: 8, y: 34, s: 9 },
  plant: { ico: '🪴', de: 'die Pflanze', pt: 'a planta', en: 'plant', wood: 0, stars: 8, zone: 'floor', x: 95, b: 82, s: 8 },
  teddy: { ico: '🧸', de: 'der Teddy', pt: 'o ursinho de peluche', en: 'teddy bear', wood: 0, stars: 12, zone: 'floor', x: 38, b: 95, s: 7 },
  tv: { svg: 'tvStand', de: 'der Fernseher', pt: 'a televisão', en: 'TV', wood: 0, stars: 25, zone: 'floor', x: 33, b: 80, s: 11 },
  piano: { ico: '🎹', de: 'das Klavier', pt: 'o piano', en: 'piano', wood: 15, stars: 20, zone: 'floor', x: 69, b: 80, s: 13 },
  // Deko zum Verschönern
  flowers: { ico: '💐', de: 'der Blumenstrauß', pt: 'o ramo de flores', en: 'bouquet', wood: 0, stars: 6, zone: 'floor', x: 60, b: 92, s: 7 },
  balloons: { ico: '🎈', de: 'der Luftballon', pt: 'o balão', en: 'balloon', wood: 0, stars: 5, zone: 'floor', x: 4, b: 84, s: 7 },
  kite: { ico: '🪁', de: 'der Drachen', pt: 'o papagaio de papel', en: 'kite', wood: 1, stars: 8, zone: 'wall', x: 60, y: 18, s: 8 },
  trophy: { ico: '🏆', de: 'der Pokal', pt: 'a taça', en: 'trophy', wood: 0, stars: 15, zone: 'floor', x: 82, b: 70, s: 6 },
  yarn: { ico: '🧶', de: 'das Wollknäuel', pt: 'o novelo de lã', en: 'ball of wool', wood: 0, stars: 4, zone: 'floor', x: 46, b: 97, s: 5 },
  rainbow: { ico: '🌈', de: 'der Regenbogen', pt: 'o arco-íris', en: 'rainbow', wood: 0, stars: 10, zone: 'wall', x: 40, y: 14, s: 11 },
  star: { ico: '🌟', de: 'der Stern', pt: 'a estrela', en: 'star', wood: 0, stars: 5, zone: 'wall', x: 18, y: 12, s: 6 },
  cat: { ico: '🐈', de: 'die Katze', pt: 'o gato', en: 'cat', wood: 0, stars: 20, zone: 'floor', x: 24, b: 96, s: 8 },
};

// Tapeten und Böden zum Aussuchen (CSS-Hintergründe)
export const WALLS = {
  pink: { de: 'Rosa Streifen', css: 'repeating-linear-gradient(90deg, #ffe3ec 0 6%, #ffd6e4 6% 12%)' },
  dots: { de: 'Blaue Punkte', css: 'radial-gradient(circle, #9fd0ff 0 18%, transparent 20%) 0 0 / 7% 11%, #e8f4ff' },
  mint: { de: 'Mintgrün', css: 'repeating-linear-gradient(90deg, #dff7ee 0 8%, #cdf0e2 8% 16%)' },
  sun: { de: 'Sonnengelb', css: 'radial-gradient(circle, #fff 0 14%, transparent 16%) 0 0 / 9% 14%, #fff2c2' },
  stars: { de: 'Sternenhimmel', css: 'radial-gradient(circle, #fff6a0 0 8%, transparent 10%) 0 0 / 8% 12%, radial-gradient(circle, #fff 0 5%, transparent 7%) 4% 6% / 8% 12%, #6e5bc7' },
  hearts: { de: 'Herzchen', css: 'radial-gradient(circle at 35% 40%, #ff9ccb 0 14%, transparent 15%) 0 0 / 8% 13%, radial-gradient(circle at 65% 40%, #ff9ccb 0 14%, transparent 15%) 0 0 / 8% 13%, #fff0f6' },
  rainbow: { de: 'Regenbogen', css: 'linear-gradient(90deg, #ffd1d1, #ffe7c2, #fff6c2, #d8f5cf, #d4ecff, #e7dcff)' },
  wood: { de: 'Holzwand', css: 'repeating-linear-gradient(90deg, #f3dfc4 0 10%, #ead2b0 10% 10.4%)' },
};
export const FLOORS = {
  wood: { de: 'Holz', css: 'repeating-linear-gradient(90deg, #d9a86a 0 9%, #c99257 9% 9.3%)' },
  light: { de: 'Helles Holz', css: 'repeating-linear-gradient(90deg, #f0d2a4 0 9%, #e3c08c 9% 9.3%)' },
  tiles: { de: 'Fliesen', css: 'repeating-conic-gradient(#fff 0 25%, #d9ecff 0 50%) 0 0 / 10% 25%' },
  carpet: { de: 'Blauer Teppich', css: 'radial-gradient(circle, rgba(255,255,255,.25) 0 1px, transparent 2px) 0 0 / 10px 10px, #8fb8ef' },
  pinkc: { de: 'Rosa Teppich', css: 'radial-gradient(circle, rgba(255,255,255,.3) 0 1px, transparent 2px) 0 0 / 10px 10px, #f7a9cb' },
  grass: { de: 'Wiese', css: 'radial-gradient(circle, #a8e68a 0 2px, transparent 3px) 0 0 / 14px 12px, #7fcf62' },
};
