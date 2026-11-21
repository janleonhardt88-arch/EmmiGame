// Aufgaben-Generator (Lehrplan 2. Klasse)
const r = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const MATH_LEVELS = [
  null,
  { de: 'Stufe 1', info: 'Plus & Minus bis 20 mit Zehnerübergang' },
  { de: 'Stufe 2', info: 'Bis 100 ohne Zehnerübergang' },
  { de: 'Stufe 3', info: 'Bis 100 mit Zehnerübergang' },
  { de: 'Stufe 4', info: 'Platzhalter, Ergänzen bis 100, Verdoppeln & Halbieren' },
];

// Hilfs-Tipp für Plus mit Zehnerübergang
function addHint(a, b) {
  const tens = Math.floor(b / 10) * 10;
  const ones = b % 10;
  if (tens && ones) return `Erst die Zehner: ${a} + ${tens} = ${a + tens}, dann + ${ones}`;
  const toTen = 10 - (a % 10);
  if (toTen < 10 && b > toTen) return `Bis zum Zehner: ${a} + ${toTen} = ${a + toTen}, dann noch + ${b - toTen}`;
  return `Zähle von ${a} aus ${b} weiter.`;
}
function subHint(a, b) {
  const tens = Math.floor(b / 10) * 10;
  const ones = b % 10;
  if (tens && ones) return `Erst die Zehner: ${a} − ${tens} = ${a - tens}, dann − ${ones}`;
  const toTen = a % 10;
  if (toTen > 0 && b > toTen) return `Bis zum Zehner: ${a} − ${toTen} = ${a - toTen}, dann noch − ${b - toTen}`;
  return `Zähle von ${a} aus ${b} rückwärts.`;
}

const plus = (a, b) => ({ text: `${a} + ${b} = ?`, answer: a + b, hint: addHint(a, b) });
const minus = (a, b) => ({ text: `${a} − ${b} = ?`, answer: a - b, hint: subHint(a, b) });

export function gardenTask(level) {
  switch (level) {
    case 1: {
      if (Math.random() < 0.5) {
        const a = r(3, 9), b = r(11 - a, 9);
        return plus(a, b);
      }
      const a = r(11, 18), b = r(a - 9, 9);
      return minus(a, b);
    }
    case 2: {
      const t = r(0, 3);
      if (t === 0) { // Zehner + Zehner
        const a = r(1, 8) * 10, b = r(1, (100 - a) / 10) * 10;
        return Math.random() < 0.5 ? plus(a, b) : minus(a + b, b);
      }
      if (t === 1) { // ZE + E ohne Übergang
        const a = r(2, 9) * 10 + r(0, 7), b = r(1, 9 - (a % 10));
        return Math.random() < 0.5 ? plus(a, b) : minus(a + b, b);
      }
      // ZE + ZE ohne Übergang
      const a1 = r(1, 7), a0 = r(0, 8);
      const b1 = r(1, 9 - a1), b0 = r(1, 9 - a0);
      const a = a1 * 10 + a0, b = b1 * 10 + b0;
      return Math.random() < 0.5 ? plus(a, b) : minus(a + b, b);
    }
    case 3: {
      const t = r(0, 3);
      if (t === 0) { // ZE + E mit Übergang
        const a0 = r(3, 9), a = r(1, 8) * 10 + a0, b = r(11 - a0, 9);
        return plus(a, b);
      }
      if (t === 1) { // ZE − E mit Übergang
        const a0 = r(0, 7), a = r(2, 9) * 10 + a0, b = r(a0 + 1, 9);
        return minus(a, b);
      }
      if (t === 2) { // ZE + ZE mit Übergang
        const a0 = r(2, 9), b0 = r(11 - a0, 9);
        const a1 = r(1, 6), b1 = r(1, 8 - a1);
        return plus(a1 * 10 + a0, b1 * 10 + b0);
      }
      // ZE − ZE mit Übergang
      const a0 = r(0, 7), b0 = r(a0 + 1, 9);
      const a1 = r(3, 9), b1 = r(1, a1 - 2);
      return minus(a1 * 10 + a0, b1 * 10 + b0);
    }
    default: {
      const t = r(0, 4);
      if (t === 0) { // Platzhalter Plus
        const a = r(12, 60), x = r(11, 99 - a);
        return { text: `${a} + ? = ${a + x}`, answer: x, hint: `Rechne rückwärts: ${a + x} − ${a}` };
      }
      if (t === 1) { // Platzhalter Minus
        const a = r(40, 99), x = r(11, a - 10);
        return { text: `${a} − ? = ${a - x}`, answer: x, hint: `Wie weit ist es von ${a - x} bis ${a}?` };
      }
      if (t === 2) { // Ergänzen bis 100
        const a = r(11, 89);
        const nextTen = Math.ceil(a / 10) * 10;
        return { text: `${a} + ? = 100`, answer: 100 - a, hint: `Erst bis ${nextTen}, dann bis 100.` };
      }
      if (t === 3) { // Verdoppeln
        const a = r(11, 49);
        return { text: `Das Doppelte von ${a} = ?`, answer: a * 2, hint: `${a} + ${a}` };
      }
      const a = r(6, 49) * 2; // Halbieren
      return { text: `Die Hälfte von ${a} = ?`, answer: a / 2, hint: `Welche Zahl + sich selbst ergibt ${a}?` };
    }
  }
}

export function dojoTask(rows, withDivision) {
  const a = pick(rows), b = r(1, 10);
  const product = a * b;
  let text, answer, distract;
  if (withDivision && Math.random() < 0.35) {
    text = `${product} : ${a}`;
    answer = b;
    distract = [b + 1, b - 1, b + 2, b - 2, b + 3, a];
  } else {
    text = Math.random() < 0.5 ? `${a} · ${b}` : `${b} · ${a}`;
    answer = product;
    distract = [product + a, product - a, product + b, product - b, product + 1, product - 1, product + 10];
    const rev = Number(String(product).split('').reverse().join(''));
    if (product > 10) distract.push(rev);
  }
  const uniq = [...new Set(distract)].filter((n) => n > 0 && n !== answer);
  const choices = shuffle([answer, ...shuffle(uniq).slice(0, 3)]);
  return { text, answer, choices };
}

export function parentGate() {
  const a = r(12, 19), b = r(3, 9);
  return { text: `${a} × ${b} = ?`, answer: a * b, hint: '' };
}
