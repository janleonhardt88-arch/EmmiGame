// 🦢 Origami-Figuren für die Bastelstube: Faltschritte in der richtigen Reihenfolge
export const ORIGAMI = [
  { id: 'plane', de: 'Papierflieger', ico: '✈️', steps: [
    'Falte das Blatt der Länge nach in der Mitte und öffne es wieder.',
    'Knicke die beiden oberen Ecken zur Mittellinie.',
    'Knicke die neuen schrägen Kanten noch einmal zur Mitte.',
    'Klappe den Flieger an der Mittellinie zusammen.',
    'Knicke beide Flügel nach unten – und los, lass ihn fliegen!'] },
  { id: 'boat', de: 'Papierschiff', ico: '⛵', steps: [
    'Falte das Blatt in der Mitte von oben nach unten.',
    'Knicke die oberen Ecken zur Mitte – so entsteht ein Hut.',
    'Falte die unteren Streifen vorne und hinten nach oben.',
    'Öffne den Hut unten und drück ihn flach zu einem Viereck.',
    'Zieh die oberen Spitzen vorsichtig auseinander – fertig ist das Schiff!'] },
  { id: 'dog', de: 'Hundegesicht', ico: '🐶', steps: [
    'Falte ein quadratisches Blatt zu einem Dreieck.',
    'Dreh es so, dass die Spitze nach unten zeigt.',
    'Knicke die beiden oberen Ecken als Ohren nach unten.',
    'Knicke die untere Spitze ein kleines Stück nach oben.',
    'Male Augen, Nase und Mund auf.'] },
  { id: 'fortune', de: 'Himmel und Hölle', ico: '🔺', steps: [
    'Falte ein quadratisches Blatt zweimal schräg und öffne es wieder.',
    'Falte alle vier Ecken genau zur Mitte.',
    'Dreh das Papier um.',
    'Falte wieder alle vier Ecken zur Mitte.',
    'Klappe es in der Mitte zusammen und steck die Finger in die Taschen.'] },
  { id: 'cup', de: 'Papierbecher', ico: '🥤', steps: [
    'Falte ein quadratisches Blatt schräg zu einem Dreieck.',
    'Knicke die linke Ecke zur gegenüberliegenden Kante.',
    'Knicke die rechte Ecke genauso hinüber.',
    'Falte die obere Spitze vorne nach unten.',
    'Falte die andere Spitze nach hinten – fertig ist der Becher!'] },
];

export const craftVoiceTexts = () => [...ORIGAMI.flatMap((o) => o.steps), 'Steck die rechte Seite wie im Spiegel!'];
