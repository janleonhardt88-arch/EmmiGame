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
};
