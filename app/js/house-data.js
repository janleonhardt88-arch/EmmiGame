// 🏡 Daten fürs Häuschen: Bauschritte und Möbel
export const HOUSE_STAGES = [
  { de: 'Fundament', wood: 8, stars: 0, txt: 'Zuerst kommt ein stabiles Fundament aus Steinen.' },
  { de: 'Wände', wood: 15, stars: 0, txt: 'Aus Holzbrettern werden die Wände.' },
  { de: 'Dach', wood: 15, stars: 5, txt: 'Ein Dach schützt vor Regen.' },
  { de: 'Tür und Fenster', wood: 10, stars: 10, txt: 'Damit du hinein kannst und Licht hast.' },
  { de: 'Schornstein und Blumen', wood: 8, stars: 15, txt: 'Zum Schluss wird es richtig gemütlich.' },
];

// Möbel: Bild, Namen, Preis (Holz/Sterne), Platz im Zimmer (x, y in %, Größe in % der Zimmerbreite)
export const FURNITURE = {
  rug: { svg: 'rug', de: 'der Teppich', pt: 'o tapete', en: 'rug', wood: 0, stars: 15, x: 48, y: 88, s: 34 },
  bed: { ico: '🛏️', de: 'das Bett', pt: 'a cama', en: 'bed', wood: 10, stars: 0, x: 16, y: 72, s: 22 },
  table: { svg: 'table', de: 'der Tisch', pt: 'a mesa', en: 'table', wood: 8, stars: 0, x: 70, y: 76, s: 17 },
  chair: { ico: '🪑', de: 'der Stuhl', pt: 'a cadeira', en: 'chair', wood: 5, stars: 0, x: 84, y: 76, s: 12 },
  sofa: { ico: '🛋️', de: 'das Sofa', pt: 'o sofá', en: 'sofa', wood: 12, stars: 10, x: 46, y: 72, s: 21 },
  shelf: { ico: '📚', de: 'das Bücherregal', pt: 'a estante', en: 'bookshelf', wood: 8, stars: 5, x: 88, y: 36, s: 11 },
  lamp: { ico: '💡', de: 'die Lampe', pt: 'o candeeiro', en: 'lamp', wood: 2, stars: 8, x: 50, y: 9, s: 9 },
  picture: { ico: '🖼️', de: 'das Bild', pt: 'o quadro', en: 'picture', wood: 2, stars: 10, x: 30, y: 30, s: 12 },
  clock: { ico: '🕰️', de: 'die Uhr', pt: 'o relógio', en: 'clock', wood: 3, stars: 10, x: 66, y: 28, s: 10 },
  mirror: { ico: '🪞', de: 'der Spiegel', pt: 'o espelho', en: 'mirror', wood: 3, stars: 12, x: 11, y: 34, s: 11 },
  plant: { ico: '🪴', de: 'die Pflanze', pt: 'a planta', en: 'plant', wood: 0, stars: 8, x: 95, y: 72, s: 10 },
  teddy: { ico: '🧸', de: 'der Teddy', pt: 'o ursinho de peluche', en: 'teddy bear', wood: 0, stars: 12, x: 24, y: 64, s: 8 },
  tv: { ico: '📺', de: 'der Fernseher', pt: 'a televisão', en: 'TV', wood: 0, stars: 25, x: 47, y: 40, s: 12 },
  piano: { ico: '🎹', de: 'das Klavier', pt: 'o piano', en: 'piano', wood: 15, stars: 20, x: 28, y: 88, s: 15 },
};
