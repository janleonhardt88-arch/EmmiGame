// Rauchtest: spielt alle Orte einmal im Browser durch und meldet JavaScript-Fehler.
//
//   cd app && python3 -m http.server 8123 &
//   node tests/smoke.js [Ordner-für-Screenshots]
//
// Braucht Playwright (npm i -D playwright) – läuft ohne echtes Tablet.
const { chromium } = require('playwright');

const URL = process.env.APP_URL || 'http://localhost:8123/index.html';
const out = process.argv[2] || null;
const f = { force: true };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let page;
const errors = [];
const shot = async (name) => { if (out) await page.screenshot({ path: `${out}/${name}.png` }); };
const step = (name) => console.log('•', name);

async function closeModals() {
  for (let k = 0; k < 4; k++) {
    if (await page.$('#modal-layer:not([hidden]) [data-act="close"]')) { await page.click('#modal-layer [data-act="close"]', f); await sleep(600); }
  }
}
async function goto(id) {
  await closeModals();
  if (await page.$('.map-btn')) { await page.click('.map-btn', f); await sleep(250); }
  await page.click(`.place[data-to="${id}"]`, f);
  await sleep(350);
}
// Klickt Antworten durch, bis die richtige gefunden ist (für Aufgaben ohne berechenbare Lösung)
async function bruteForce(optSel, rounds, wait) {
  for (let i = 0; i < rounds; i++) {
    for (const o of await page.$$(`${optSel}:not([disabled])`)) {
      await o.click(f); await sleep(140);
      if (await page.$(`${optSel}.right`)) break;
    }
    await sleep(wait);
  }
}
function solveMath(text) {
  const t = text.replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
  let m;
  if ((m = t.match(/^(\d+) \+ (\d+) =/))) return +m[1] + +m[2];
  if ((m = t.match(/^(\d+) − (\d+) =/))) return +m[1] - +m[2];
  if ((m = t.match(/^(\d+) \+ = (\d+)/))) return +m[2] - +m[1];
  if ((m = t.match(/^(\d+) − = (\d+)/))) return +m[1] - +m[2];
  if ((m = t.match(/Doppelte von (\d+)/))) return +m[1] * 2;
  if ((m = t.match(/Hälfte von (\d+)/))) return +m[1] / 2;
  throw new Error('Unbekannte Aufgabe: ' + t);
}
async function typeNumber(n) {
  for (const d of String(n)) await page.click(`.numpad [data-n="${d}"]`, f);
  await page.click('.numpad [data-n="ok"]', f);
}

(async () => {
  const browser = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, permissions: ['microphone'] });
  page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

  await page.goto(URL);
  await page.evaluate(() => localStorage.clear());
  await page.reload(); await sleep(500);

  step('Begrüßung');
  await shot('01-welcome');
  await page.fill('#w-name', 'Emmi');
  await page.click('[data-hair="blond"]', f);
  await page.click('#w-go', f); await sleep(600);
  await shot('02-map');

  step('Figur gestalten');
  await page.click('[data-act="wardrobe"]', f); await sleep(300);
  await page.click('[data-w="pigtails"]', f); await sleep(150);
  await page.click('[data-w-tab="acc"]', f); await sleep(150);
  await page.click('[data-w="bow"]', f); await sleep(150);
  await page.click('[data-w-buy]', f); await sleep(200);
  await shot('02b-wardrobe');
  await page.click('[data-act="wardrobe-done"]', f); await sleep(300);
  const look = await page.evaluate(() => JSON.parse(localStorage.getItem('emmigame-v1')).look);
  if (look.style !== 'pigtails' || look.acc !== 'bow') errors.push('Figur wurde nicht gespeichert: ' + JSON.stringify(look));

  step('Garten: pflanzen, gießen, ernten');
  await goto('garden');
  await page.click('.bed[data-i="0"]', f); await sleep(300);
  await page.click('.seed-card', f); await sleep(300);
  for (let k = 0; k < 2; k++) {
    await page.click('.bed[data-i="0"]', f); await sleep(400);
    if (k === 0) await shot('03-garden-task');
    await typeNumber(solveMath(await page.textContent('.task-q')));
    await sleep(1400);
  }
  await shot('04-garden-ready');
  await page.click('.bed[data-i="0"]', f); await sleep(500);
  await shot('05-harvest');
  await page.click('[data-act="collect"]', f); await sleep(400);

  step('Hofladen: kaufen, Deko, verkaufen');
  await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('emmigame-v1')); s.stars = 200; s.basket = { carrot: 3, tomato: 2 }; localStorage.setItem('emmigame-v1', JSON.stringify(s)); });
  await page.reload(); await sleep(500);
  await goto('shop');
  await page.click('[data-kind="seed"][data-id="tomato"]', f); await sleep(200);
  await page.click('[data-tab="animals"]', f); await sleep(200);
  await page.click('[data-kind="animal"][data-id="chicken"]', f); await sleep(200);
  await page.click('[data-tab="deco"]', f); await sleep(200);
  for (const d of ['bench', 'balloons', 'birdhouse', 'pond', 'rainbow']) { await page.click(`[data-kind="deco"][data-id="${d}"]`, f); await sleep(150); }
  await shot('06-shop-deco');
  await page.click('[data-tab="sell"]', f); await sleep(200);
  await page.click('[data-act="market-open"]', f); await sleep(300);
  let total = 0;
  for (const o of await page.$$('.popt')) { await o.click(f); await sleep(150); const r = await page.$('.popt.right'); if (r) { total = Number(await r.getAttribute('data-v')); break; } }
  await sleep(1000);
  let change = Math.round(parseFloat(await page.textContent('.paid-money text')) * 100) - total;
  for (const c of [1000, 500, 200, 100, 50, 20, 10]) while (change >= c) { await page.click(`.coin[data-c="${c}"]`, f); change -= c; await sleep(100); }
  await shot('07-market-change');
  await page.click('[data-act="market-change"]', f); await sleep(700);
  await goto('garden'); await sleep(300);
  await shot('08-garden-deco');

  step('Dojo');
  await goto('dojo');
  await page.click('[data-act="dojo-start"]', f); await sleep(400);
  for (let i = 0; i < 10; i++) {
    const t = await page.textContent('.board-text');
    const [a, b] = t.split(/[·:]/).map(Number);
    const v = t.includes(':') ? a / b : a * b;
    await page.click(`.choice[data-v="${v}"]`, f);
    if (i === 0) { await sleep(350); await shot('09-dojo'); }
    await sleep(1150);
  }
  await sleep(500);

  step('Ballett: Uhr');
  await goto('ballet');
  await shot('10-ballet');
  await page.click('[data-act="ballet-clock"]', f); await sleep(300);
  for (let i = 0; i < 8; i++) {
    const [h, m] = await page.evaluate(() => {
      const ps = [...document.querySelectorAll('.big-clock path')];
      const rot = (c) => Number(ps.find((x) => x.getAttribute('stroke') === c).getAttribute('transform').match(/rotate\(([\d.]+)/)[1]);
      let hh = Math.floor((rot('#ff5a9a') + 0.01) / 30); if (hh === 0) hh = 12;
      return [hh, Math.round(rot('#7356e0') / 6)];
    });
    await page.click(`.topt[data-h="${h}"][data-m="${m}"]`, f);
    await sleep(1600);
  }
  await sleep(400);

  step('Ballett: Tanz');
  await closeModals();
  await page.evaluate(() => {
    window.__lit = [];
    new MutationObserver((ms) => ms.forEach((m) => {
      const t = m.target;
      if (t.classList?.contains('move') && !(m.oldValue || '').includes('lit') && t.classList.contains('lit') && t.closest('.moves')?.classList.contains('watch')) {
        const now = performance.now(), last = window.__lit[window.__lit.length - 1];
        if (!(last && last.m === t.dataset.m && now - last.t < 120)) window.__lit.push({ m: t.dataset.m, t: now });
      }
    })).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'], attributeOldValue: true });
  });
  await page.click('[data-act="ballet-dance"]', f);
  await page.waitForFunction(() => document.querySelector('#dmsg')?.textContent.includes('Jetzt du'), null, { timeout: 15000 });
  for (const m of await page.evaluate(() => window.__lit.map((x) => x.m))) { await page.click(`.move[data-m="${m}"]`, f); await sleep(250); }
  await sleep(600);
  await page.click('[data-act="ballet-quit"]', f); await sleep(200);

  step('Singbühne');
  await goto('stage');
  await shot('11-stage');
  await page.click('[data-cat="phrases"]', f); await sleep(400);
  await bruteForce('.opt', 8, 1400);
  await sleep(600);

  step('Bastelstube');
  await goto('craft');
  await page.click('[data-act="craft-start"]', f); await sleep(300);
  await bruteForce('.bead-opt', 8, 1100);
  await sleep(500);

  step('Kletterwand');
  await goto('climb');
  await page.click('[data-act="climb-start"]', f); await sleep(300);
  await bruteForce('.copt', 8, 1200);
  await sleep(1900);

  step('Wald');
  await goto('forest');
  await page.click('[data-act="forest-start"]', f); await sleep(300);
  await bruteForce('.qopt', 8, 1400);
  await sleep(600);
  const wood = await page.evaluate(() => JSON.parse(localStorage.getItem('emmigame-v1')).wood);
  if (!(wood >= 8)) errors.push('Kein Holz gesammelt: ' + wood);

  step('Häuschen bauen und einrichten');
  await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('emmigame-v1')); s.wood = 100; s.stars = 200; localStorage.setItem('emmigame-v1', JSON.stringify(s)); });
  await page.reload(); await sleep(500);
  await goto('house');
  for (let k = 0; k < 5; k++) { await closeModals(); await page.click('[data-act="house-build"]', f); await sleep(400); }
  await closeModals();
  await page.click('[data-act="house-enter"]', f); await sleep(300);
  await page.click('[data-act="house-buy"][data-k="bed"]', f); await sleep(300);
  if (!(await page.$('.furn[data-k="bed"]'))) errors.push('Bett wurde nicht ins Zimmer gestellt');
  await shot('12b-room');

  step('Weltreise');
  await goto('globe');
  await page.click('[data-act="globe-start"]', f); await sleep(300);
  await bruteForce('.qopt', 8, 1400);
  await sleep(600);

  step('Karte & Tagesaufgaben');
  await closeModals();
  await page.click('.map-btn', f); await sleep(300);
  await page.click('[data-act="daily-open"]', f); await sleep(300);
  await shot('12-daily');
  await closeModals();
  await shot('13-map-later');

  step('Elternbereich & Aufnahme');
  await page.click('[data-act="parents"]', f); await sleep(300);
  const [a, c] = (await page.textContent('.modal p b')).split('×').map((s) => Number(s.trim()));
  await typeNumber(a * c); await sleep(300);
  await shot('14-parents');
  await page.click('#p-rec', f); await sleep(300);
  await page.click('.rec-row [data-r="rec"]', f); await sleep(1000);
  await page.click('.rec-row [data-r="rec"].on', f); await sleep(1200);
  const rec = await page.$$eval('.rec-row.has', (x) => x.length);
  if (rec !== 1) errors.push(`Aufnahme nicht gespeichert (${rec})`);
  await page.click('[data-r="back"]', f); await sleep(200);
  await page.click('[data-min="15"]', f); await sleep(200);
  await closeModals();

  step('Zeitlimit');
  await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('emmigame-v1')); s.play.sec = 15 * 60 - 5; localStorage.setItem('emmigame-v1', JSON.stringify(s)); });
  await page.reload(); await sleep(11500);
  if (!(await page.$('.pause-modal'))) errors.push('Pause-Fenster erschien nicht');
  await shot('15-pause');

  step('Hochformat');
  await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('emmigame-v1')); s.limitMin = 0; localStorage.setItem('emmigame-v1', JSON.stringify(s)); });
  await page.setViewportSize({ width: 800, height: 1280 });
  await page.reload(); await sleep(600);
  await shot('16-map-portrait');
  await goto('garden'); await sleep(300);
  await shot('17-garden-portrait');

  await browser.close();
  if (errors.length) { console.error('FEHLER:\n' + errors.join('\n')); process.exit(1); }
  console.log('Alles in Ordnung ✓');
})().catch((e) => { console.error(e); process.exit(1); });
