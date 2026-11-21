// ⛴️ Schiffsreise – Häfen, Meerestiere, Seefahrer-Wissen, Rechenaufgaben, Schiffswörter, Knoten, Kabine

// Route: Hamburg → Amsterdam → Lissabon → Madeira → Barcelona → Marseille → Genua → Athen
// x/y: Lage auf der Seekarte (viewBox 0 0 100 70); via: Wegpunkte bis zu diesem Hafen
export const PORTS = [
  { id: 'hamburg', de: 'Hamburg', country: 'de', flag: '🇩🇪', x: 57, y: 13, sight: '⚓',
    fact: 'Hamburg hat einen riesigen Hafen an der Elbe. Hier legen jeden Tag große Containerschiffe an.' },
  { id: 'amsterdam', de: 'Amsterdam', country: 'nl', flag: '🇳🇱', x: 47, y: 17, sight: '🚲', via: [[52, 9], [46, 11]],
    fact: 'In Amsterdam gibt es mehr Fahrräder als Menschen – und über tausend Brücken über die Kanäle.' },
  { id: 'lisboa', de: 'Lissabon', country: 'pt', flag: '🇵🇹', x: 12, y: 44, sight: '🚋', via: [[40, 21], [30, 26], [20, 30], [10, 36]],
    fact: 'Lissabon ist die Hauptstadt von Portugal. Gelbe Straßenbahnen fahren dort die steilen Hügel hinauf.' },
  { id: 'funchal', de: 'Madeira', country: 'pt', flag: '🇵🇹', x: 5, y: 61, sight: '🌺', via: [[8, 52]],
    fact: 'Madeira ist eine portugiesische Insel mitten im Atlantik. Dort blühen das ganze Jahr Blumen.' },
  { id: 'barcelona', de: 'Barcelona', country: 'es', flag: '🇪🇸', x: 36, y: 45, sight: '⛪', via: [[14, 57], [21, 56], [29, 53]],
    fact: 'In Barcelona steht die Sagrada Família – eine Kirche, an der schon seit über 140 Jahren gebaut wird.' },
  { id: 'marseille', de: 'Marseille', country: 'fr', flag: '🇫🇷', x: 43, y: 40, sight: '🐟', via: [[40, 43]],
    fact: 'Marseille ist eine der ältesten Städte Frankreichs. Im alten Hafen verkaufen Fischer morgens frischen Fisch.' },
  { id: 'genova', de: 'Genua', country: 'it', flag: '🇮🇹', x: 51, y: 37, sight: '🏰', via: [[47, 39]],
    fact: 'Genua liegt in Italien. Der Seefahrer Christoph Kolumbus wurde hier geboren.' },
  { id: 'athina', de: 'Athen', country: 'gr', flag: '🇬🇷', x: 80, y: 55, sight: '🏛️', via: [[52, 44], [58, 54], [66, 60], [74, 60]],
    fact: 'Athen ist die Hauptstadt von Griechenland. Auf einem Hügel steht ein Tempel, der fast 2500 Jahre alt ist.' },
];

// Meerestiere fürs Album
export const SEA_ANIMALS = {
  dolphin: { ico: '🐬', de: 'der Delfin', pt: 'o golfinho', en: 'dolphin', fact: 'Delfine sind keine Fische, sondern Säugetiere. Sie atmen Luft durch ein Loch auf dem Kopf.' },
  whale: { ico: '🐳', de: 'der Wal', pt: 'a baleia', en: 'whale', fact: 'Der Blauwal ist das größte Tier, das je gelebt hat – größer als jeder Dinosaurier!' },
  octopus: { ico: '🐙', de: 'der Krake', pt: 'o polvo', en: 'octopus', fact: 'Ein Krake hat acht Arme und sogar drei Herzen.' },
  squid: { ico: '🦑', de: 'der Tintenfisch', pt: 'a lula', en: 'squid', fact: 'Tintenfische spritzen Tinte ins Wasser, um sich zu verstecken.' },
  turtle: { ico: '🐢', de: 'die Meeresschildkröte', pt: 'a tartaruga', en: 'turtle', fact: 'Meeresschildkröten legen ihre Eier am Strand in den warmen Sand.' },
  crab: { ico: '🦀', de: 'die Krabbe', pt: 'o caranguejo', en: 'crab', fact: 'Krabben laufen am liebsten seitwärts.' },
  seal: { ico: '🦭', de: 'die Robbe', pt: 'a foca', en: 'seal', fact: 'Robben können lange tauchen und schlafen manchmal sogar im Wasser.' },
  shark: { ico: '🦈', de: 'der Hai', pt: 'o tubarão', en: 'shark', fact: 'Haie bekommen ihr ganzes Leben lang immer wieder neue Zähne.' },
  puffer: { ico: '🐡', de: 'der Kugelfisch', pt: 'o peixe-balão', en: 'pufferfish', fact: 'Bei Gefahr pumpt sich der Kugelfisch zu einer stacheligen Kugel auf.' },
  fish: { ico: '🐠', de: 'der Tropenfisch', pt: 'o peixe tropical', en: 'tropical fish', fact: 'Viele bunte Fische leben zwischen Korallen und verstecken sich dort.' },
  lobster: { ico: '🦞', de: 'der Hummer', pt: 'a lagosta', en: 'lobster', fact: 'Hummer haben zwei große Scheren: eine zum Knacken und eine zum Schneiden.' },
  shrimp: { ico: '🦐', de: 'die Garnele', pt: 'o camarão', en: 'shrimp', fact: 'Wenn Garnelen fliehen, schwimmen sie ganz schnell rückwärts.' },
  oyster: { ico: '🦪', de: 'die Auster', pt: 'a ostra', en: 'oyster', fact: 'In manchen Austern wächst eine glänzende Perle.' },
  otter: { ico: '🦦', de: 'der Seeotter', pt: 'a lontra', en: 'sea otter', fact: 'Seeotter halten sich beim Schlafen an den Pfoten, damit sie nicht wegtreiben.' },
};

// Sachkunde Meer und Seefahrer-Wissen
const Q = (ico, q, a, w, tip, fun) => ({ ico, q, a, w, tip, fun });
export const SEA_QUESTIONS = [
  Q('🌊', 'Wie schmeckt Meerwasser?', 'salzig', ['süß', 'sauer'], 'Im Meer ist ganz viel Salz gelöst.', 'nach Erdbeere'),
  Q('⬅️', 'Wie heißt die linke Seite eines Schiffes?', 'Backbord', ['Steuerbord', 'Heck'], 'Steuerbord ist rechts, Backbord ist links.'),
  Q('➡️', 'Wie heißt die rechte Seite eines Schiffes?', 'Steuerbord', ['Backbord', 'Bug'], 'Steuerbord ist rechts, Backbord ist links.'),
  Q('🚢', 'Wie heißt die Spitze vorne am Schiff?', 'der Bug', ['das Heck', 'der Mast'], 'Vorne ist der Bug, hinten das Heck.'),
  Q('🚢', 'Wie heißt das hintere Ende des Schiffes?', 'das Heck', ['der Bug', 'das Deck'], 'Vorne ist der Bug, hinten das Heck.'),
  Q('🧭', 'Was zeigt ein Kompass an?', 'die Himmelsrichtung', ['die Uhrzeit', 'das Wetter'], 'Mit dem Kompass findet man Norden, Süden, Osten und Westen.', 'das Mittagessen'),
  Q('🧭', 'Wohin zeigt die Kompassnadel immer?', 'nach Norden', ['nach Süden', 'nach Osten'], 'Die Nadel ist ein kleiner Magnet.'),
  Q('🗼', 'Wozu ist ein Leuchtturm da?', 'Er zeigt Schiffen den Weg', ['Er heizt das Meer', 'Er fängt Fische'], 'Sein helles Licht sieht man nachts von weit her.'),
  Q('⚓', 'Womit bleibt ein Schiff an einer Stelle stehen?', 'mit dem Anker', ['mit dem Segel', 'mit dem Schornstein'], 'Er ist schwer und hakt sich am Meeresboden fest.'),
  Q('🦺', 'Was zieht man auf dem Boot zur Sicherheit an?', 'eine Rettungsweste', ['einen Schal', 'eine Krone'], 'Sie hält dich im Wasser oben.', 'einen Taucherhelm aus Pappe'),
  Q('🏖️', 'Wie nennt man es, wenn das Wasser am Strand zurückgeht?', 'Ebbe', ['Flut', 'Welle'], 'Bei Ebbe kann man im Watt laufen.'),
  Q('🌊', 'Wie nennt man es, wenn das Wasser am Strand wieder steigt?', 'Flut', ['Ebbe', 'Pfütze'], 'Erst Ebbe, dann Flut.'),
  Q('🌙', 'Wie oft kommt die Flut ungefähr an einem Tag?', 'zweimal', ['einmal im Jahr', 'nie'], 'Ebbe und Flut wechseln sich etwa alle sechs Stunden ab.'),
  Q('👩‍✈️', 'Wer bestimmt auf einem Schiff, wohin es fährt?', 'der Kapitän', ['der Koch', 'der Passagier'], 'Die Chefin oder der Chef auf dem Schiff.', 'die Möwe'),
  Q('🛏️', 'Wie heißt das Zimmer, in dem man auf dem Schiff schläft?', 'die Kabine', ['die Garage', 'der Dachboden'], 'Sie hat oft ein rundes Fenster.'),
  Q('🏝️', 'Was ist eine Insel?', 'Land mit Wasser rundherum', ['ein Schiff ohne Segel', 'ein großer Fisch'], 'Madeira ist zum Beispiel eine Insel.'),
  Q('🌍', 'Welches Meer liegt zwischen Europa und Amerika?', 'der Atlantik', ['das Mittelmeer', 'die Ostsee'], 'Es ist ein riesiger Ozean.', 'der Gartenteich'),
  Q('☀️', 'An welchem Meer liegen Barcelona, Marseille und Genua?', 'am Mittelmeer', ['an der Nordsee', 'am Bodensee'], 'Es liegt mitten zwischen Europa und Afrika.'),
  Q('🏞️', 'Auf welchem Fluss fahren die Schiffe nach Hamburg?', 'auf der Elbe', ['auf dem Rhein', 'auf der Donau'], 'Der Fluss heißt so ähnlich wie ein Fabelwesen mit spitzen Ohren.'),
  Q('🐙', 'Wie viele Arme hat ein Krake?', '8', ['6', '10'], 'Doppelt so viele wie vier.'),
  Q('🐬', 'Ist ein Delfin ein Fisch?', 'Nein, ein Säugetier', ['Ja, ein Fisch', 'Nein, ein Vogel'], 'Delfine atmen Luft – wie wir.'),
  Q('🐳', 'Welches ist das größte Tier der Welt?', 'der Blauwal', ['der Elefant', 'der Hai'], 'Es lebt im Meer.'),
  Q('🐟', 'Womit atmen Fische unter Wasser?', 'mit Kiemen', ['mit der Nase', 'mit einem Schnorchel'], 'Sie sitzen seitlich am Kopf.'),
  Q('⛴️', 'Wie heißt ein Schiff, das Autos und Menschen über das Wasser bringt?', 'eine Fähre', ['ein U-Boot', 'ein Floß'], 'Sie fährt immer hin und her.'),
  Q('🌊', 'Welches Schiff kann unter Wasser fahren?', 'ein U-Boot', ['ein Segelboot', 'eine Fähre'], 'U steht für Unterwasser.'),
  Q('⛵', 'Was treibt ein Segelboot an?', 'der Wind', ['der Mond', 'der Regen'], 'Er bläst in das Segel.', 'ein Motor aus Schokolade'),
  Q('🆘', 'Welches Notsignal kennen Seeleute auf der ganzen Welt?', 'SOS', ['ABC', 'OK'], 'Drei Buchstaben: kurz, lang, kurz.'),
  Q('🐢', 'Wo legen Meeresschildkröten ihre Eier ab?', 'im Sand am Strand', ['auf Bäumen', 'in einem Nest aus Algen'], 'Die Sonne wärmt dort die Eier.'),
  Q('🚢', 'Wie heißt der Boden draußen auf dem Schiff, auf dem man spazieren geht?', 'das Deck', ['der Keller', 'das Dach'], 'Auf dem Sonnendeck kann man sich sonnen.'),
  Q('🛟', 'Wofür ist ein Rettungsring?', 'Er hält dich im Wasser oben', ['Er ist ein Schmuckstück', 'Er ist ein Spielzeug für Fische'], 'Man wirft ihn jemandem zu, der ins Wasser gefallen ist.', 'Er ist ein riesiger Donut'),
  Q('🦀', 'Wie laufen Krabben am liebsten?', 'seitwärts', ['rückwärts im Kreis', 'auf einem Bein'], 'Schau mal, wie sie am Strand krabbeln.'),
  Q('🧂', 'Kann man Meerwasser trinken?', 'Nein, es ist zu salzig', ['Ja, es ist gesund', 'Nur mit Strohhalm'], 'Salzwasser macht noch durstiger.'),
];

// Rechnen an Bord (feste Aufgaben, damit sie vorgelesen werden können)
const M = (q, a, w, tip) => ({ ico: '🧮', q, a: String(a), w: w.map(String), tip });
export const SHIP_MATH = [
  M('Das Schiff muss 50 Seemeilen fahren. 30 hat es schon geschafft. Wie viele fehlen noch?', 20, [80, 30], '50 minus 30.'),
  M('Das Schiff muss 75 Seemeilen fahren. 40 hat es schon geschafft. Wie viele fehlen noch?', 35, [45, 25], '75 minus 40.'),
  M('Bis zur Insel sind es 64 Seemeilen. 24 sind geschafft. Wie viele fehlen noch?', 40, [30, 88], '64 minus 24.'),
  M('Auf dem Schiff gibt es 6 Rettungsboote. In jedes passen 8 Kinder. Wie viele Kinder passen hinein?', 48, [42, 14], '6 mal 8.'),
  M('Auf jedem Deck hängen 5 Rettungsringe. Das Schiff hat 7 Decks. Wie viele Rettungsringe sind es?', 35, [30, 12], '7 mal 5.'),
  M('Emmi findet 7 Muscheln und dann noch 9. Wie viele Muscheln hat sie?', 16, [15, 17], '7 plus 9.'),
  M('Emmi sieht 8 Delfine. 3 tauchen ab. Wie viele sieht sie noch?', 5, [11, 4], '8 minus 3.'),
  M('Das Schiff legt um 2 Uhr ab und fährt 3 Stunden. Um wie viel Uhr kommt es an?', '5 Uhr', ['6 Uhr', '4 Uhr'], '2 Uhr plus 3 Stunden.'),
  M('Das Schiff legt um 9 Uhr ab und fährt 4 Stunden. Um wie viel Uhr kommt es an?', '13 Uhr', ['12 Uhr', '5 Uhr'], '9 plus 4.'),
  M('Das Abendessen ist um 18 Uhr. Jetzt ist es 16 Uhr. Wie viele Stunden dauert es noch?', 2, [3, 34], '18 minus 16.'),
  M('In einer Kabine schlafen 4 Kinder. Wie viele Kinder schlafen in 3 Kabinen?', 12, [7, 10], '3 mal 4.'),
  M('Am Buffet liegen 30 Pfannkuchen. 18 werden gegessen. Wie viele sind noch da?', 12, [48, 22], '30 minus 18.'),
  M('20 Möwen sitzen auf dem Mast. Die Hälfte fliegt weg. Wie viele bleiben sitzen?', 10, [5, 20], 'Die Hälfte von 20.'),
  M('Ein Ausflugsboot hat 9 Sitzreihen mit je 6 Plätzen. Wie viele Plätze sind das?', 54, [15, 56], '9 mal 6.'),
  M('Emmi schickt an jedem Hafen 2 Postkarten. Es gibt 8 Häfen. Wie viele Karten sind das?', 16, [10, 18], '8 mal 2.'),
  M('Das Schiff ist 90 Meter lang. Ein Ruderboot ist 10 Meter lang. Wie viele Ruderboote passen hintereinander daneben?', 9, [80, 100], 'Wie oft passt 10 in 90?'),
  M('Auf dem Sonnendeck stehen 4 Reihen mit je 10 Liegestühlen. Wie viele Liegestühle sind das?', 40, [14, 44], '4 mal 10.'),
  M('Emmi hat 25 Muscheln. Sie schenkt ihrer Mama 9. Wie viele behält sie?', 16, [34, 14], '25 minus 9.'),
];

// Schiffswörter
const W = (ico, de, pt, en) => ({ ico, de, pt, en });
export const SHIP_WORDS = [
  W('🚢', 'das Schiff', 'o navio', 'ship'),
  W('🚤', 'das Boot', 'o barco', 'boat'),
  W('🌊', 'das Meer', 'o mar', 'sea'),
  W('🌊', 'die Welle', 'a onda', 'wave'),
  W('⚓', 'der Hafen', 'o porto', 'harbour'),
  W('🏖️', 'der Strand', 'a praia', 'beach'),
  W('🏝️', 'die Insel', 'a ilha', 'island'),
  W('🗼', 'der Leuchtturm', 'o farol', 'lighthouse'),
  W('⚓', 'der Anker', 'a âncora', 'anchor'),
  W('👩‍✈️', 'die Kapitänin', 'a capitã', 'captain'),
  W('🛏️', 'die Kabine', 'a cabine', 'cabin'),
  W('🐦', 'die Möwe', 'a gaivota', 'seagull'),
  W('🐚', 'die Muschel', 'a concha', 'shell'),
  W('🏜️', 'der Sand', 'a areia', 'sand'),
  W('💨', 'der Wind', 'o vento', 'wind'),
  W('🧳', 'der Koffer', 'a mala', 'suitcase'),
  W('🦺', 'die Rettungsweste', 'o colete salva-vidas', 'life jacket'),
  W('🐟', 'der Fisch', 'o peixe', 'fish'),
  W('🗺️', 'die Landkarte', 'o mapa', 'map'),
  W('🧭', 'der Kompass', 'a bússola', 'compass'),
];
export const SHIP_PHRASES = [
  W('🛏️', 'Wo ist meine Kabine?', 'Onde é a minha cabine?', 'Where is my cabin?'),
  W('🐬', 'Ich sehe Delfine!', 'Vejo golfinhos!', 'I can see dolphins!'),
  W('🌊', 'Das Meer ist blau.', 'O mar é azul.', 'The sea is blue.'),
  W('🧳', 'Gute Reise!', 'Boa viagem!', 'Have a good trip!'),
  W('🤢', 'Mir ist ein bisschen schlecht.', 'Estou um pouco enjoada.', 'I feel a bit seasick.'),
  W('⚓', 'Wann kommen wir an?', 'Quando chegamos?', 'When do we arrive?'),
];

// Sprachfragen (Deutsch vorgelesen, Antwort in der Fremdsprache)
export function langTasks() {
  const out = [];
  for (const [lang, name, flag] of [['pt', 'Portugiesisch', '🇵🇹'], ['en', 'Englisch', '🇬🇧']]) {
    for (const w of SHIP_WORDS) out.push({ kind: 'lang', lang, ico: w.ico, flag, q: `Was heißt „${w.de}“ auf ${name}?`, a: w[lang], pool: SHIP_WORDS.map((x) => x[lang]) });
    for (const w of SHIP_PHRASES) out.push({ kind: 'lang', lang, ico: w.ico, flag, q: `Wie sagt man „${w.de}“ auf ${name}?`, a: w[lang], pool: SHIP_PHRASES.map((x) => x[lang]) });
  }
  return out;
}

// Knoten-Schule: Schritte in die richtige Reihenfolge bringen
export const KNOTS = [
  { id: 'bow', de: 'Schleife', ico: '🎀', pt: 'o laço', steps: [
    'Mach einen einfachen Knoten.',
    'Forme mit einem Band eine Schlaufe.',
    'Leg das andere Band um die Schlaufe herum.',
    'Schieb es durch das Loch zu einer zweiten Schlaufe.',
    'Zieh beide Schlaufen fest.'] },
  { id: 'eight', de: 'Achterknoten', ico: '8️⃣', pt: 'o nó em oito', steps: [
    'Leg mit dem Seilende eine Schlaufe.',
    'Führe das Ende hinter dem Seil herum.',
    'Steck das Ende von vorne durch die Schlaufe.',
    'Zieh fest – fertig ist die Acht!'] },
  { id: 'reef', de: 'Kreuzknoten', ico: '🪢', pt: 'o nó direito', steps: [
    'Leg das linke Ende über das rechte und schling es herum.',
    'Leg jetzt das rechte Ende über das linke.',
    'Schling es wieder herum und durch.',
    'Zieh an beiden Seiten fest.'] },
  { id: 'braid', de: 'Seil flechten', ico: '💇‍♀️', pt: 'a trança', steps: [
    'Nimm drei Stränge nebeneinander.',
    'Leg den rechten Strang über den mittleren.',
    'Leg den linken Strang über den neuen mittleren.',
    'Wiederhole das, bis das Seil fertig ist.'] },
];

// Kabine einrichten (bezahlt mit Muscheln). x/y = Mitte in Prozent, s = Breite in Prozent
export const CABIN = {
  bed: { ico: '🛏️', de: 'das Bett', pt: 'a cama', en: 'bed', price: 10, x: 20, y: 74, s: 24 },
  teddy: { ico: '🧸', de: 'der Teddy', pt: 'o peluche', en: 'teddy bear', price: 6, x: 27, y: 66, s: 8 },
  lamp: { ico: '🏮', de: 'die Laterne', pt: 'a lanterna', en: 'lantern', price: 6, x: 6, y: 34, s: 7 },
  map: { ico: '🗺️', de: 'die Schatzkarte', pt: 'o mapa do tesouro', en: 'treasure map', price: 8, x: 46, y: 26, s: 12 },
  ring: { ico: '🛟', de: 'der Rettungsring', pt: 'a boia', en: 'lifebuoy', price: 6, x: 64, y: 26, s: 10 },
  anchor: { ico: '⚓', de: 'der Anker', pt: 'a âncora', en: 'anchor', price: 5, x: 78, y: 24, s: 8 },
  globe: { ico: '🌍', de: 'der Globus', pt: 'o globo', en: 'globe', price: 8, x: 70, y: 49, s: 8 },
  compass: { ico: '🧭', de: 'der Kompass', pt: 'a bússola', en: 'compass', price: 8, x: 80, y: 49, s: 7 },
  shells: { ico: '🐚', de: 'die Muschelsammlung', pt: 'as conchas', en: 'shells', price: 5, x: 89, y: 49, s: 7 },
  scope: { ico: '🔭', de: 'das Fernrohr', pt: 'o telescópio', en: 'telescope', price: 10, x: 44, y: 72, s: 12 },
  guitar: { ico: '🎸', de: 'die Gitarre', pt: 'a guitarra', en: 'guitar', price: 12, x: 58, y: 70, s: 11 },
  tank: { ico: '🐠', de: 'das Aquarium', pt: 'o aquário', en: 'aquarium', price: 15, x: 76, y: 74, s: 12 },
  plant: { ico: '🪴', de: 'die Pflanze', pt: 'a planta', en: 'plant', price: 6, x: 92, y: 76, s: 9 },
};

// Schiff bemalen
export const HULLS = {
  red: { de: 'Rot', c: '#ff5a5a', o: '#c9443a' }, blue: { de: 'Blau', c: '#4f8fd6', o: '#2f66a8', price: 10 },
  pink: { de: 'Rosa', c: '#ff7eb6', o: '#e2559a', price: 10 }, purple: { de: 'Lila', c: '#9b7bff', o: '#7356e0', price: 10 },
  green: { de: 'Grün', c: '#4fbf5a', o: '#2f8f3a', price: 10 }, yellow: { de: 'Gelb', c: '#ffd23b', o: '#e6a100', price: 10 },
};
export const FUNNELS = {
  yellow: { de: 'Gelb', c: '#ffd23b' }, pink: { de: 'Pink', c: '#ff7eb6', price: 8 }, mint: { de: 'Türkis', c: '#3fc7b4', price: 8 }, rainbow: { de: 'Regenbogen', c: 'rainbow', price: 15 },
};

// Alle vorgelesenen deutschen Texte (für die Sprachdateien)
export function seaVoiceTexts() {
  return {
    de: [
      ...SEA_QUESTIONS.map((t) => t.q), ...SHIP_MATH.map((t) => t.q), ...langTasks().map((t) => t.q),
      ...PORTS.map((p) => p.fact), ...Object.values(SEA_ANIMALS).flatMap((a) => [a.de, a.fact]),
      ...KNOTS.flatMap((k) => k.steps), ...Object.values(CABIN).map((c) => c.de),
      ...PORTS.map((p) => `Willkommen in ${p.de}!`),
    ],
    pt: [...SHIP_WORDS, ...SHIP_PHRASES, ...Object.values(SEA_ANIMALS), ...Object.values(CABIN)].map((w) => w.pt).concat(KNOTS.map((k) => k.pt)),
    en: [...SHIP_WORDS, ...SHIP_PHRASES, ...Object.values(SEA_ANIMALS), ...Object.values(CABIN)].map((w) => w.en),
  };
}
