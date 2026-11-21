// 🌍 Erdkunde: Länder, Flaggen, Hauptstädte, Kontinente, Flüsse, Himmelsrichtungen
// level: 1 = leicht (Nachbarländer, Flaggen), 2 = mittel, 3 = schwerer
export const COUNTRIES = [
  { id: 'de', flag: '🇩🇪', de: 'Deutschland', pt: 'a Alemanha', en: 'Germany', capital: 'Berlin', cont: 'Europa', level: 1 },
  { id: 'pt', flag: '🇵🇹', de: 'Portugal', pt: 'Portugal', en: 'Portugal', capital: 'Lissabon', cont: 'Europa', level: 1 },
  { id: 'fr', flag: '🇫🇷', de: 'Frankreich', pt: 'a França', en: 'France', capital: 'Paris', cont: 'Europa', level: 1 },
  { id: 'es', flag: '🇪🇸', de: 'Spanien', pt: 'a Espanha', en: 'Spain', capital: 'Madrid', cont: 'Europa', level: 1 },
  { id: 'it', flag: '🇮🇹', de: 'Italien', pt: 'a Itália', en: 'Italy', capital: 'Rom', cont: 'Europa', level: 1 },
  { id: 'gb', flag: '🇬🇧', de: 'Großbritannien', pt: 'o Reino Unido', en: 'the United Kingdom', capital: 'London', cont: 'Europa', level: 1 },
  { id: 'at', flag: '🇦🇹', de: 'Österreich', pt: 'a Áustria', en: 'Austria', capital: 'Wien', cont: 'Europa', level: 1 },
  { id: 'ch', flag: '🇨🇭', de: 'die Schweiz', pt: 'a Suíça', en: 'Switzerland', capital: 'Bern', cont: 'Europa', level: 1 },
  { id: 'nl', flag: '🇳🇱', de: 'die Niederlande', pt: 'os Países Baixos', en: 'the Netherlands', capital: 'Amsterdam', cont: 'Europa', level: 2 },
  { id: 'dk', flag: '🇩🇰', de: 'Dänemark', pt: 'a Dinamarca', en: 'Denmark', capital: 'Kopenhagen', cont: 'Europa', level: 2 },
  { id: 'pl', flag: '🇵🇱', de: 'Polen', pt: 'a Polónia', en: 'Poland', capital: 'Warschau', cont: 'Europa', level: 2 },
  { id: 'gr', flag: '🇬🇷', de: 'Griechenland', pt: 'a Grécia', en: 'Greece', capital: 'Athen', cont: 'Europa', level: 2 },
  { id: 'se', flag: '🇸🇪', de: 'Schweden', pt: 'a Suécia', en: 'Sweden', capital: 'Stockholm', cont: 'Europa', level: 3 },
  { id: 'ie', flag: '🇮🇪', de: 'Irland', pt: 'a Irlanda', en: 'Ireland', capital: 'Dublin', cont: 'Europa', level: 3 },
  { id: 'br', flag: '🇧🇷', de: 'Brasilien', pt: 'o Brasil', en: 'Brazil', capital: 'Brasília', cont: 'Südamerika', level: 1 },
  { id: 'us', flag: '🇺🇸', de: 'die USA', pt: 'os Estados Unidos', en: 'the United States', capital: 'Washington', cont: 'Nordamerika', level: 1 },
  { id: 'ca', flag: '🇨🇦', de: 'Kanada', pt: 'o Canadá', en: 'Canada', capital: 'Ottawa', cont: 'Nordamerika', level: 2 },
  { id: 'mx', flag: '🇲🇽', de: 'Mexiko', pt: 'o México', en: 'Mexico', capital: 'Mexiko-Stadt', cont: 'Nordamerika', level: 2 },
  { id: 'ar', flag: '🇦🇷', de: 'Argentinien', pt: 'a Argentina', en: 'Argentina', capital: 'Buenos Aires', cont: 'Südamerika', level: 3 },
  { id: 'jp', flag: '🇯🇵', de: 'Japan', pt: 'o Japão', en: 'Japan', capital: 'Tokio', cont: 'Asien', level: 1 },
  { id: 'cn', flag: '🇨🇳', de: 'China', pt: 'a China', en: 'China', capital: 'Peking', cont: 'Asien', level: 2 },
  { id: 'in', flag: '🇮🇳', de: 'Indien', pt: 'a Índia', en: 'India', capital: 'Neu-Delhi', cont: 'Asien', level: 3 },
  { id: 'au', flag: '🇦🇺', de: 'Australien', pt: 'a Austrália', en: 'Australia', capital: 'Canberra', cont: 'Australien', level: 2 },
  { id: 'eg', flag: '🇪🇬', de: 'Ägypten', pt: 'o Egito', en: 'Egypt', capital: 'Kairo', cont: 'Afrika', level: 2 },
  { id: 'za', flag: '🇿🇦', de: 'Südafrika', pt: 'a África do Sul', en: 'South Africa', capital: 'Pretoria', cont: 'Afrika', level: 3 },
];
export const CONTINENTS = ['Europa', 'Asien', 'Afrika', 'Nordamerika', 'Südamerika', 'Australien'];

// Städte an Flüssen
export const RIVERS = [
  { city: 'Köln', river: 'am Rhein', w: ['an der Elbe', 'an der Donau'], level: 2 },
  { city: 'Hamburg', river: 'an der Elbe', w: ['am Rhein', 'an der Spree'], level: 2 },
  { city: 'Dresden', river: 'an der Elbe', w: ['am Main', 'an der Isar'], level: 3 },
  { city: 'Berlin', river: 'an der Spree', w: ['am Rhein', 'an der Weser'], level: 2 },
  { city: 'Frankfurt', river: 'am Main', w: ['an der Elbe', 'an der Spree'], level: 3 },
  { city: 'München', river: 'an der Isar', w: ['am Rhein', 'an der Elbe'], level: 3 },
  { city: 'Bremen', river: 'an der Weser', w: ['an der Donau', 'an der Isar'], level: 3 },
  { city: 'Wien', river: 'an der Donau', w: ['am Rhein', 'an der Seine'], level: 2 },
  { city: 'Paris', river: 'an der Seine', w: ['an der Themse', 'am Tejo'], level: 2 },
  { city: 'London', river: 'an der Themse', w: ['an der Seine', 'an der Donau'], level: 2 },
  { city: 'Lissabon', river: 'am Tejo', w: ['am Douro', 'an der Seine'], level: 1 },
  { city: 'Porto', river: 'am Douro', w: ['am Tejo', 'an der Themse'], level: 1 },
];

// Weitere Fragen (mit Bild)
export const GEO_QUESTIONS = [
  { ico: '🌅', q: 'Wo geht die Sonne auf?', a: 'im Osten', w: ['im Westen', 'im Norden'], fun: 'hinter dem Kühlschrank', level: 1, tip: 'O wie Osten, O wie „Oh, guten Morgen!".' },
  { ico: '🌇', q: 'Wo geht die Sonne unter?', a: 'im Westen', w: ['im Osten', 'im Süden'], level: 1, tip: 'Gegenüber von dort, wo sie aufgeht.' },
  { ico: '🧭', q: 'Wohin zeigt die Kompassnadel?', a: 'nach Norden', w: ['nach Süden', 'nach Osten'], fun: 'zum Eisladen', level: 1, tip: 'Oben auf der Landkarte ist …' },
  { ico: '🗺️', q: 'Was ist auf einer Landkarte meistens oben?', a: 'Norden', w: ['Süden', 'Westen'], level: 1, tip: 'Dorthin zeigt auch die Kompassnadel.' },
  { ico: '🏔️', q: 'Wie heißt der höchste Berg Deutschlands?', a: 'die Zugspitze', w: ['der Brocken', 'der Feldberg'], level: 3, tip: 'Er liegt in den Alpen.' },
  { ico: '🌊', q: 'An welchem Meer liegt Portugal?', a: 'am Atlantik', w: ['an der Ostsee', 'am Schwarzen Meer'], level: 1, tip: 'Ein riesiger Ozean zwischen Europa und Amerika.' },
  { ico: '⛵', q: 'Welche Meere liegen im Norden Deutschlands?', a: 'Nordsee und Ostsee', w: ['Mittelmeer und Atlantik', 'Rotes Meer und Totes Meer'], level: 2, tip: 'Eines heißt wie eine Himmelsrichtung.' },
  { ico: '🦘', q: 'Wo leben Kängurus?', a: 'in Australien', w: ['in Europa', 'in Südamerika'], fun: 'in der Badewanne', level: 1, tip: 'Ein Kontinent und ein Land mit demselben Namen.' },
  { ico: '🐻‍❄️', q: 'Wo leben Eisbären?', a: 'am Nordpol', w: ['am Südpol', 'in der Wüste'], fun: 'im Freibad', level: 1, tip: 'Pinguine leben am anderen Ende der Welt.' },
  { ico: '🐧', q: 'Wo leben Pinguine im Eis?', a: 'am Südpol', w: ['am Nordpol', 'in Deutschland'], level: 1, tip: 'Eisbären leben am anderen Ende der Welt.' },
  { ico: '🐫', q: 'Wo ist es sehr heiß und trocken?', a: 'in der Wüste', w: ['am Nordpol', 'im Wald'], fun: 'im Kühlschrank', level: 1, tip: 'Dort gibt es viel Sand und Kamele.' },
  { ico: '🌍', q: 'Wie heißt unser Planet?', a: 'die Erde', w: ['der Mars', 'der Mond'], fun: 'der Pfannkuchen', level: 1, tip: 'Auf ihr wachsen auch Erdbeeren.' },
  { ico: '🌐', q: 'Was ist ein Globus?', a: 'eine Weltkugel', w: ['ein Fernrohr', 'ein Kompass'], fun: 'ein Riesen-Fußball', level: 1, tip: 'Man kann ihn drehen und alle Länder sehen.' },
  { ico: '🏝️', q: 'Was ist eine Insel?', a: 'Land mit Wasser rundherum', w: ['ein hoher Berg', 'ein großer Fluss'], fun: 'ein schwimmender Kuchen', level: 1, tip: 'Madeira und die Azoren sind Inseln von Portugal.' },
];

// Grammatik-Hilfen für Fragen („von der Schweiz", „liegen die USA")
const DAT = { ch: 'der Schweiz', nl: 'den Niederlanden', us: 'den USA' };
const PLURAL = new Set(['nl', 'us']);
const bare = (name) => name.replace(/^(der|die|das|den) /, '');

// Alle möglichen Erdkunde-Aufgaben. pool = Liste, aus der falsche Antworten gezogen werden.
export function allGeoTasks() {
  const tasks = [];
  for (const c of COUNTRIES) {
    tasks.push({ kind: 'flag', level: c.level, ico: c.flag, q: 'Welches Land hat diese Flagge?', a: c.de, pool: COUNTRIES.map((x) => x.de), fun: 'das Schlaraffenland', country: c, tip: `Der Name beginnt mit „${bare(c.de)[0]}".` });
    tasks.push({ kind: 'capital', level: Math.min(3, c.level + 1), ico: c.flag, q: `Wie heißt die Hauptstadt von ${DAT[c.id] || c.de}?`, a: c.capital, pool: COUNTRIES.map((x) => x.capital), fun: 'Entenhausen', country: c, tip: `Sie beginnt mit „${c.capital[0]}".` });
    tasks.push({ kind: 'cont', level: c.level, ico: c.flag, q: `Auf welchem Kontinent ${PLURAL.has(c.id) ? 'liegen' : 'liegt'} ${c.de}?`, a: c.cont, pool: CONTINENTS, fun: 'auf dem Mond', country: c, tip: c.cont === 'Europa' ? 'Es liegt bei uns in der Nähe.' : 'Es ist weit weg – man fliegt lange dorthin.' });
  }
  for (const r of RIVERS) tasks.push({ kind: 'river', level: r.level, ico: '🏞️', q: `An welchem Fluss liegt ${r.city}?`, a: r.river, w: r.w, fun: 'am Kakao-Fluss', tip: 'Große Städte liegen oft an Flüssen – früher kamen die Waren mit dem Schiff.' });
  for (const g of GEO_QUESTIONS) tasks.push({ kind: 'geo', level: g.level, ico: g.ico, q: g.q, a: g.a, w: g.w, tip: g.tip, fun: g.fun });
  tasks.push(...greetingTasks());
  return tasks;
}

// 👋 Hallo, Tschüss und Danke in der Sprache des Landes
// say = so wird es geschrieben/gesprochen, show = lateinische Schrift, how = Aussprache-Hilfe für Kinder
const W = (say, show, how) => ({ say, show: show || say, how });
export const GREETINGS = {
  de: { lang: 'Deutsch', tts: 'de-DE', hi: W('Hallo', '', 'HA-lo'), bye: W('Tschüss', '', 'TSCHÜSS'), thanks: W('Danke', '', 'DAN-ke') },
  pt: { lang: 'Portugiesisch', tts: 'pt-PT', hi: W('Olá', '', 'o-LA'), bye: W('Adeus', '', 'a-DE-usch'), thanks: W('Obrigada', '', 'o-bri-GA-da') },
  fr: { lang: 'Französisch', tts: 'fr-FR', hi: W('Bonjour', '', 'bon-SCHUR'), bye: W('Au revoir', '', 'o rö-WUAR'), thanks: W('Merci', '', 'mär-SI') },
  es: { lang: 'Spanisch', tts: 'es-ES', hi: W('Hola', '', 'O-la'), bye: W('Adiós', '', 'a-DJOS'), thanks: W('Gracias', '', 'GRA-thias') },
  it: { lang: 'Italienisch', tts: 'it-IT', hi: W('Ciao', '', 'TSCHAU'), bye: W('Arrivederci', '', 'a-ri-we-DER-tschi'), thanks: W('Grazie', '', 'GRA-tsje') },
  gb: { lang: 'Englisch', tts: 'en-GB', hi: W('Hello', '', 'hä-LOU'), bye: W('Goodbye', '', 'gud-BAI'), thanks: W('Thank you', '', 'THÄNK-ju') },
  at: { lang: 'Deutsch (Österreich)', tts: 'de-AT', hi: W('Servus', '', 'SER-wus'), bye: W('Baba', '', 'BA-ba'), thanks: W('Danke', '', 'DAN-ke') },
  ch: { lang: 'Schweizerdeutsch', tts: 'de-CH', hi: W('Grüezi', '', 'GRÜE-tsi'), bye: W('Ade', '', 'a-DE'), thanks: W('Merci', '', 'MER-si') },
  nl: { lang: 'Niederländisch', tts: 'nl-NL', hi: W('Hallo', '', 'HA-lo'), bye: W('Doei', '', 'DUI'), thanks: W('Dank je', '', 'DANK-je') },
  dk: { lang: 'Dänisch', tts: 'da-DK', hi: W('Hej', '', 'HAI'), bye: W('Farvel', '', 'far-WEL'), thanks: W('Tak', '', 'TACK') },
  pl: { lang: 'Polnisch', tts: 'pl-PL', hi: W('Cześć', '', 'TSCHESCHTSCH'), bye: W('Do widzenia', '', 'do wi-DSE-nja'), thanks: W('Dziękuję', '', 'dschen-KU-je') },
  gr: { lang: 'Griechisch', tts: 'el-GR', hi: W('Γειά σου', 'Jassu', 'JA-ssu'), bye: W('Αντίο', 'Andio', 'an-DI-o'), thanks: W('Ευχαριστώ', 'Efcharisto', 'ef-cha-ri-STO') },
  se: { lang: 'Schwedisch', tts: 'sv-SE', hi: W('Hej', '', 'HEJ'), bye: W('Hej då', '', 'hej DOO'), thanks: W('Tack', '', 'TACK') },
  ie: { lang: 'Irisch', tts: 'ga-IE', hi: W('Dia duit', '', 'DJI-a gwitsch'), bye: W('Slán', '', 'SLAAN'), thanks: W('Go raibh maith agat', '', 'go ro MA a-gat') },
  br: { lang: 'Portugiesisch (Brasilien)', tts: 'pt-BR', hi: W('Oi', '', 'OI'), bye: W('Tchau', '', 'TSCHAU'), thanks: W('Obrigada', '', 'o-bri-GA-da') },
  us: { lang: 'Englisch (Amerika)', tts: 'en-US', hi: W('Hi', '', 'HAI'), bye: W('Bye', '', 'BAI'), thanks: W('Thanks', '', 'THÄNKS') },
  ca: { lang: 'Französisch (Kanada)', tts: 'fr-CA', hi: W('Bonjour', '', 'bon-SCHUR'), bye: W('Salut', '', 'sa-LÜ'), thanks: W('Merci', '', 'mär-SI') },
  mx: { lang: 'Spanisch (Mexiko)', tts: 'es-MX', hi: W('Hola', '', 'O-la'), bye: W('Adiós', '', 'a-DJOS'), thanks: W('Gracias', '', 'GRA-sjas') },
  ar: { lang: 'Spanisch (Argentinien)', tts: 'es-AR', hi: W('Hola', '', 'O-la'), bye: W('Chau', '', 'TSCHAU'), thanks: W('Gracias', '', 'GRA-sjas') },
  jp: { lang: 'Japanisch', tts: 'ja-JP', hi: W('こんにちは', 'Konnichiwa', 'kon-ni-tschi-WA'), bye: W('さようなら', 'Sayonara', 'sa-JO-na-ra'), thanks: W('ありがとう', 'Arigato', 'a-ri-GA-to') },
  cn: { lang: 'Chinesisch', tts: 'zh-CN', hi: W('你好', 'Ni hao', 'ni HAU'), bye: W('再见', 'Zaijian', 'dsai-DJEN'), thanks: W('谢谢', 'Xiexie', 'SCHJE-schje') },
  in: { lang: 'Hindi', tts: 'hi-IN', hi: W('नमस्ते', 'Namaste', 'na-MAS-te'), bye: W('अलविदा', 'Alvida', 'al-WI-da'), thanks: W('धन्यवाद', 'Dhanyavaad', 'dan-ja-WAAD') },
  au: { lang: 'Englisch (Australien)', tts: 'en-AU', hi: W("G'day", '', 'ge-DEI'), bye: W('Bye', '', 'BAI'), thanks: W('Thanks', '', 'THÄNKS') },
  eg: { lang: 'Arabisch', tts: 'ar-EG', hi: W('مرحبا', 'Marhaba', 'MAR-ha-ba'), bye: W('مع السلامة', 'Maa salama', 'MA-a sa-LA-ma'), thanks: W('شكرا', 'Shukran', 'SCHU-kran') },
  za: { lang: 'Zulu', tts: 'zu-ZA', hi: W('Sawubona', '', 'sa-wu-BO-na'), bye: W('Hamba kahle', '', 'HAM-ba GA-hle'), thanks: W('Ngiyabonga', '', 'ngi-ja-BON-ga') },
};
export const GREETING_WORDS = { hi: 'Hallo', bye: 'Tschüss', thanks: 'Danke' };
const IN_DAT = { ch: 'in der Schweiz', nl: 'in den Niederlanden', us: 'in den USA', gb: 'in Großbritannien' };
export const inCountry = (c) => IN_DAT[c.id] || `in ${c.de}`;

// Zusätzliche Fragen: „Wie sagt man ‚Hallo' in Frankreich?"
export function greetingTasks() {
  const tasks = [];
  for (const c of COUNTRIES) {
    const g = GREETINGS[c.id];
    if (!g || c.id === 'de') continue;
    for (const [key, word] of Object.entries(GREETING_WORDS)) {
      const pool = [...new Set(Object.values(GREETINGS).map((x) => x[key].show).filter((s) => s !== g[key].show && s !== GREETINGS.de[key].show))];
      tasks.push({
        kind: 'greet', level: key === 'hi' ? Math.max(2, c.level) : 3, ico: c.flag, country: c, greet: g[key], tts: g.tts,
        q: `Wie sagt man „${word}" ${inCountry(c)}?`, a: g[key].show, pool, tip: `Dort spricht man ${g.lang}.`,
      });
    }
  }
  return tasks;
}
