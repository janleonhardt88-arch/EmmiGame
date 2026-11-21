// 😄 Für zwischendurch: Kinderwitze und „Wusstest du?"-Fakten (erscheinen am Ende einer Runde)
export const JOKES = [
  ['Was ist grün und klopft an die Tür?', 'Ein Klopfsalat!'],
  ['Welches Tier kann höher springen als ein Haus?', 'Jedes Tier – Häuser können nämlich gar nicht springen!'],
  ['Was macht ein Pirat am Computer?', 'Er drückt die Enter-Taste!'],
  ['Warum können Geister so schlecht lügen?', 'Weil man durch sie hindurchsehen kann!'],
  ['Was ist gelb und kann nicht schwimmen?', 'Ein Bagger!'],
  ['Wie nennt man einen Bumerang, der nicht zurückkommt?', 'Einen Stock!'],
  ['Was liegt am Strand und spricht undeutlich?', 'Eine Nuschel!'],
  ['Warum sind Fische so schlau?', 'Weil sie in Schulen leben!'],
  ['Was steht mitten in Paris?', 'Ein R!'],
  ['Wie nennt man ein Schaf ohne Beine?', 'Eine Wolke!'],
  ['Was ist ein Keks unter einem Baum?', 'Ein schattiges Plätzchen!'],
  ['Welcher Bus ist über den Ozean gefahren?', 'Kolumbus!'],
  ['Was macht ein Clown im Büro?', 'Faxen!'],
  ['Was ist grau und hat vier Beine und einen Rüssel?', 'Eine Maus im Urlaub!'],
  ['Warum summen Bienen?', 'Weil sie den Text vergessen haben!'],
  ['Wo wohnen Katzen?', 'Im Miezhaus!'],
  ['Warum hat die Giraffe so einen langen Hals?', 'Weil ihr Kopf so weit weg vom Körper ist!'],
  ['Was sagt das Meer zum Strand?', 'Nichts – es winkt nur!'],
  ['Was ist orange und läuft durch den Wald?', 'Eine Wanderine!'],
  ['Was ist rot und schlecht für die Zähne?', 'Ein Ziegelstein!'],
  ['Treffen sich zwei Schnecken. Sagt die eine: „Schnell, rüber über die Straße!"', '„Lieber nicht – da hinten kommt ein Auto. Es ist erst drei Stunden weit weg!"'],
  ['Warum geht der Tannenbaum nie zum Friseur?', 'Weil er schon Nadeln hat!'],
  ['Was ist schwarz-weiß und hüpft auf und ab?', 'Ein Pinguin auf dem Trampolin!'],
  ['Was trinkt eine Kuh am liebsten?', 'Muh-Saft!'],
];

export const FACTS = [
  'Ein Igel hat etwa 7.000 Stacheln.',
  'Ein Oktopus hat drei Herzen.',
  'Flamingos sind rosa, weil sie kleine rosa Krebse fressen.',
  'Bienen tanzen, um anderen Bienen den Weg zu den Blüten zu zeigen.',
  'Ein Schmetterling schmeckt mit seinen Füßen.',
  'Eulen können ihren Kopf fast einmal ganz nach hinten drehen.',
  'Kängurus können nicht rückwärts hüpfen.',
  'Pinguine können nicht fliegen – aber super schwimmen.',
  'Der Blauwal ist das größte Tier, das es je gegeben hat.',
  'Elefanten können nicht springen.',
  'Schnecken haben Tausende winzige Zähne.',
  'Fast drei Viertel der Erde sind mit Wasser bedeckt.',
  'Der Mond leuchtet nicht selbst – er wird von der Sonne angestrahlt.',
  'Aus Portugal kommt der meiste Kork der Welt – zum Beispiel für Flaschenkorken.',
  'In Brasilien sprechen die Menschen auch Portugiesisch.',
  'Karate kommt aus Japan. Karate heißt „leere Hand".',
  'Beim Ballett tanzen die Profis auf den Zehenspitzen – mit Spitzenschuhen.',
  'Giraffen schlafen oft nur ein paar Minuten am Stück.',
  'Ein Faultier bewegt sich so langsam, dass auf seinem Fell Algen wachsen.',
  'Kühe haben beste Freundinnen und sind gern mit ihnen zusammen.',
];

export const PRAISE_WRONG = ['Hoppla! 🙈', 'Knapp daneben! 😄', 'Fast! Probier es nochmal.', 'Oh-oh, das war nicht ganz richtig.', 'Ups! Aber du schaffst das! 💪'];

let last = -1;
// Kleines Kästchen mit Witz (Auflösung zum Antippen) oder Fakt
export function funBox() {
  let i;
  do { i = Math.floor(Math.random() * (JOKES.length + FACTS.length)); } while (i === last);
  last = i;
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  if (i < JOKES.length) {
    const [q, a] = JOKES[i];
    return `<div class="fun-box joke">
      <div class="fun-head">😂 Witz</div>
      <p>${esc(q)}</p>
      <button class="btn fun-reveal" data-act="fun-reveal" data-q="${esc(q)}" data-a="${esc(a)}">Auflösung? 🤔</button>
      <p class="fun-answer" hidden>${esc(a)}</p>
    </div>`;
  }
  const fact = FACTS[i - JOKES.length];
  return `<div class="fun-box fact">
    <div class="fun-head">💡 Wusstest du?</div>
    <p>${esc(fact)}</p>
    <button class="say-btn" data-act="say" data-lang="de-DE" data-text="${esc(fact)}" aria-label="Vorlesen">🔊</button>
  </div>`;
}
