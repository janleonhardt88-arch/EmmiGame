// Deutsch-Aufgaben für die Kletterwand (2. Klasse)

export const NOUNS = ['Hund', 'Garten', 'Blume', 'Karate', 'Ballett', 'Schule', 'Mama', 'Sonne', 'Apfel', 'Baum', 'Tisch', 'Katze',
  'Kürbis', 'Wolle', 'Bühne', 'Lied', 'Freundin', 'Haus', 'Fenster', 'Pferd', 'Wasser', 'Igel', 'Stern', 'Buch', 'Seil', 'Gürtel'];
export const VERBS = ['laufen', 'singen', 'tanzen', 'klettern', 'basteln', 'häkeln', 'lesen', 'spielen', 'springen', 'gießen',
  'schreiben', 'malen', 'lachen', 'essen', 'schlafen', 'rechnen', 'flechten', 'pflanzen', 'turnen', 'schwimmen'];
export const ADJECTIVES = ['schnell', 'groß', 'klein', 'lustig', 'bunt', 'leise', 'laut', 'stark', 'müde', 'warm', 'kalt',
  'schön', 'weich', 'hoch', 'mutig', 'fröhlich', 'nass', 'süß', 'hell', 'dunkel'];

// [richtig, falsch, falsch?]
export const SPELLING = [
  ['Sonne', 'Sone'], ['Mutter', 'Muter'], ['Puppe', 'Pupe'], ['Teller', 'Teler'], ['Ballett', 'Balett'],
  ['Biene', 'Bine'], ['Spiegel', 'Spigel'], ['Lied', 'Lid', 'Liet'], ['Wiese', 'Wise'], ['vier', 'vir'],
  ['Zucker', 'Zuker', 'Zukker'], ['Decke', 'Deke'], ['Rücken', 'Rüken'], ['backen', 'baken'],
  ['Katze', 'Kaze', 'Kazze'], ['Mütze', 'Müze'], ['sitzen', 'sizen'], ['Platz', 'Plaz'],
  ['Fahrrad', 'Farrad', 'Farad'], ['Uhr', 'Ur'], ['Zahl', 'Zal'], ['fahren', 'faren'],
  ['Bäume', 'Beume'], ['Häuser', 'Heuser'], ['Äpfel', 'Epfel'],
  ['Stern', 'Schtern'], ['Spinne', 'Schpinne'], ['springen', 'schpringen'],
  ['Hund', 'Hunt'], ['Wald', 'Walt'], ['Kind', 'Kint'], ['Berg', 'Berk'],
  ['Vogel', 'Fogel'], ['Vater', 'Fater'], ['klettern', 'klätern', 'klettan'],
];

// Silben: Wort mit Trennstrichen, Anzahl
export const SYLLABLE_WORDS = [
  ['Ball', 1], ['Hund', 1], ['Baum', 1], ['Stern', 1], ['Schaf', 1],
  ['Son-ne', 2], ['Blu-me', 2], ['Gar-ten', 2], ['Kat-ze', 2], ['Schu-le', 2], ['I-gel', 2], ['Wol-ke', 2], ['Häs-chen', 2],
  ['Ba-na-ne', 3], ['To-ma-te', 3], ['Ka-rot-te', 3], ['Ka-nin-chen', 3], ['Kro-ko-dil', 3], ['E-le-fant', 3], ['Ra-dies-chen', 3],
  ['Schmet-ter-ling', 3], ['Bal-le-ri-na', 4], ['Mar-me-la-de', 4], ['Son-nen-blu-me', 4], ['Kat-zen-kör-be', 4], ['Was-ser-me-lo-ne', 5],
];

export const RHYMES = [
  ['Haus', 'Maus', ['Hund', 'Baum']], ['Hund', 'Mund', ['Haus', 'Ball']], ['Baum', 'Traum', ['Bein', 'Hut']],
  ['Ball', 'Stall', ['Bein', 'Tisch']], ['Hose', 'Rose', ['Hand', 'Kuh']], ['Kanne', 'Tanne', ['Kuchen', 'Lied']],
  ['Tisch', 'Fisch', ['Topf', 'Stuhl']], ['Bein', 'Stein', ['Bus', 'Nase']], ['Hand', 'Sand', ['Hund', 'Hut']],
  ['Katze', 'Tatze', ['Kater', 'Kuh']], ['Kuchen', 'suchen', ['kochen', 'Kuh']], ['Biene', 'Schiene', ['Birne', 'Blume']],
  ['Nase', 'Hase', ['Nest', 'Haus']], ['Sonne', 'Tonne', ['Sand', 'Seil']], ['singen', 'springen', ['sagen', 'Sand']],
  ['tanzen', 'Ranzen', ['tauchen', 'Tante']], ['Wolle', 'Rolle', ['Wolke', 'Wald']], ['Stern', 'gern', ['Stall', 'Stuhl']],
];
