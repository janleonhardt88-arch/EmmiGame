// 🔒 Elternbereich – Fortschritt, Einstellungen, eigene Aufnahmen
import { state, save, resetState } from './state.js';
import { BELTS, DOJO_BOARDS, HAIR } from './data.js';
import { speak, setAudioPrefs, voiceInfo, bundledCount } from './audio.js';
import { parentGate, MATH_LEVELS } from './math.js';
import { api } from './core.js';
import { $, esc, belt, openModal, closeModal, toast, addStars, renderTop } from './ui.js';
import { currentMathLevel } from './games/garden.js';
import { dojoConfig } from './games/dojo.js';
import { CRAFT_LEVELS } from './games/craft.js';
import { CLOCK_LEVELS } from './games/ballet.js';
import { canRecord, clipUrl, clipCount, saveClip, deleteClip, startRecording } from './recorder.js';
import { allTexts } from './vocab.js';
import { playedMinutes } from './playtime.js';

// ============ Elternbereich ============
export function parentsGate() {
  const t = parentGate();
  let input = '';
  const m = openModal(`
    <h2>Für Eltern</h2>
    <p>Bitte rechne: <b>${t.text.replace(' = ?', '')}</b></p>
    <div class="task-q small"><span class="answer-box" id="gans">&nbsp;</span></div>
    <div class="numpad small">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button data-n="${n}">${n}</button>`).join('')}<button data-n="del" class="del">⌫</button><button data-n="0">0</button><button data-n="ok" class="ok">✓</button></div>`, { cls: 'task-modal' });
  $('.numpad', m).addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    const n = b.dataset.n;
    if (n === 'ok') {
      if (Number(input) === t.answer) parentsPanel(); else closeModal();
      return;
    }
    if (n === 'del') input = input.slice(0, -1); else if (input.length < 3) input += n;
    $('#gans', m).textContent = input || ' ';
  });
}

export function parentsPanel() {
  const { rows } = dojoConfig();
  const auto = !state.dojoRows;
  const pv = voiceInfo('pt-PT'), ev = voiceInfo('en-GB');
  const s = state.stats;
  const hard = Object.entries(state.facts).filter(([, f]) => f.bad > f.ok * 0.5).sort((a, b) => (b[1].bad - b[1].ok * 0.5) - (a[1].bad - a[1].ok * 0.5)).slice(0, 6);
  const m = openModal(`
    <div class="parents">
      <h2>Elternbereich</h2>
      <section>
        <h3>Fortschritt</h3>
        <div class="stat-grid">
          <div><b>${s.correct}</b><span>richtige Aufgaben</span></div>
          <div><b>${s.wrong}</b><span>Fehlversuche</span></div>
          <div><b>${s.harvested}</b><span>geerntet</span></div>
          <div><b>${s.boards}</b><span>Bretter</span></div>
          <div><b>${state.xp}</b><span>Punkte · ${belt().de}</span></div>
          <div><b>${state.dojoBest}/${DOJO_BOARDS}</b><span>Dojo-Rekord</span></div>
          <div><b>${Object.values(state.vocab).filter((v) => (v.pt || 0) >= 2).length}</b><span>Wörter 🇵🇹 gelernt</span></div>
          <div><b>${Object.values(state.vocab).filter((v) => (v.en || 0) >= 2).length}</b><span>Wörter 🇬🇧 gelernt</span></div>
          <div><b>${state.bracelets.length} · ${state.climbTops}</b><span>Armbänder · Gipfel</span></div>
        </div>
      </section>
      <section>
        <h3>Spielzeit pro Tag</h3>
        <div class="chips" id="p-limit">
          ${[0, 15, 30, 45, 60].map((v) => `<button class="chip ${state.limitMin === v ? 'on' : ''}" data-min="${v}">${v ? v + ' Min.' : 'Kein Limit'}</button>`).join('')}
        </div>
        <p class="note">Heute gespielt: <b>${playedMinutes()} Minuten</b>. Ist die Zeit um, gehen die Tiere „schlafen" – eine laufende Aufgabe darf noch fertig werden.</p>
      </section>
      ${hard.length ? `<section>
        <h3>Einmaleins: braucht noch Übung</h3>
        <div class="chips">${hard.map(([k, f]) => `<span class="chip">${k.replace('x', ' · ')} <small>(${f.bad}× falsch)</small></span>`).join('')}</div>
        <p class="note">Diese Aufgaben kommen im Dojo automatisch öfter dran.</p>
      </section>` : ''}
      <section>
        <h3>Name & Aussehen</h3>
        <label class="field">Name <input id="p-name" value="${esc(state.name)}" maxlength="14"></label>
        <div class="chips" id="p-hair">${Object.entries(HAIR).filter(([k, h]) => !h.price || state.hair === k).map(([k, h]) => `<button class="chip ${state.hair === k ? 'on' : ''}" data-hair="${k}"><i style="background:${h.color}"></i>${h.de}</button>`).join('')}</div>
      </section>
      <section>
        <h3>Garten-Mathe</h3>
        <div class="chips" id="p-math">
          <button class="chip ${state.mathAuto ? 'on' : ''}" data-lv="auto">Automatisch</button>
          ${[1, 2, 3, 4].map((l) => `<button class="chip ${!state.mathAuto && state.mathLevel === l ? 'on' : ''}" data-lv="${l}">${l}</button>`).join('')}
        </div>
        <p class="note">Aktuell: <b>${MATH_LEVELS[currentMathLevel()].de}</b> – ${MATH_LEVELS[currentMathLevel()].info}</p>
      </section>
      <section>
        <h3>Bastelstube: Muster & Zahlenfolgen</h3>
        <div class="chips" id="p-craft">
          <button class="chip ${state.craftAuto ? 'on' : ''}" data-lv="auto">Automatisch</button>
          ${[1, 2, 3, 4].map((l) => `<button class="chip ${!state.craftAuto && state.craftLevel === l ? 'on' : ''}" data-lv="${l}">${l}</button>`).join('')}
        </div>
        <p class="note">Aktuell: <b>${CRAFT_LEVELS[state.craftLevel].de}</b> – ${CRAFT_LEVELS[state.craftLevel].info}</p>
      </section>
      <section>
        <h3>Ballett: Uhrzeit</h3>
        <div class="chips" id="p-clock">
          <button class="chip ${state.clockAuto ? 'on' : ''}" data-lv="auto">Automatisch</button>
          ${[1, 2, 3].map((l) => `<button class="chip ${!state.clockAuto && state.clockLevel === l ? 'on' : ''}" data-lv="${l}">${l}</button>`).join('')}
        </div>
        <p class="note">Aktuell: <b>${CLOCK_LEVELS[state.clockLevel].de}</b> – ${CLOCK_LEVELS[state.clockLevel].info}</p>
      </section>
      <section>
        <h3>Dojo: Einmaleins-Reihen</h3>
        <div class="chips" id="p-rows">
          <button class="chip ${auto ? 'on' : ''}" data-row="auto">Nach Gürtel</button>
          ${[2, 3, 4, 5, 6, 7, 8, 9, 10].map((r) => `<button class="chip ${!auto && rows.includes(r) ? 'on' : ''}" data-row="${r}">${r}</button>`).join('')}
          <button class="chip ${!auto && state.dojoDiv ? 'on' : ''}" data-row="div">+ Geteilt</button>
        </div>
        <p class="note">Aktuell: ${rows.join(', ')}${dojoConfig().div ? ' + Geteilt' : ''}</p>
      </section>
      <section>
        <h3>Ton & Sprache</h3>
        <div class="chips">
          <button class="chip ${state.sound ? 'on' : ''}" data-tog="sound">Geräusche</button>
          <button class="chip ${state.speech ? 'on' : ''}" data-tog="speech">Vorlesen</button>
        </div>
        <p class="note">Eingebaute Sprachdateien: 🇵🇹 ${bundledCount('pt-PT')} · 🇬🇧 ${bundledCount('en-GB')} · 🇩🇪 ${bundledCount('de-DE')}. Nur was dort fehlt, liest die Stimme des Tablets vor:</p>
        <p class="note">Portugiesisch: <b class="${pv.ok ? 'ok' : 'warn'}">${esc(pv.text)}</b> <button class="link" data-act="say" data-lang="pt-PT" data-text="Olá ${esc(state.name)}! Como estás?">▶ testen</button><br>
        Englisch: <b class="${ev.ok ? 'ok' : 'warn'}">${esc(ev.text)}</b> <button class="link" data-act="say" data-lang="en-GB" data-text="Hello ${esc(state.name)}! How are you?">▶ testen</button></p>
        ${pv.ok ? '' : `<p class="note warn-box">Für europäisches Portugiesisch auf Android: Einstellungen → Bedienungshilfen → Text-in-Sprache → Google-Sprachausgabe → Sprachdaten installieren → <b>Português (Portugal)</b>.</p>`}
      </section>
      <section>
        <h3>Eigene Stimmen 🎙️</h3>
        <p class="note">Nehmt Wörter und Sätze selbst auf (z. B. Mama auf Portugiesisch). Das Spiel spielt dann eure Aufnahme statt der Computerstimme. Bisher: <b>${clipCount()}</b> Aufnahmen.</p>
        <button class="btn" id="p-rec">Aufnahmen verwalten</button>
      </section>
      <section>
        <h3>Sonstiges</h3>
        <div class="btn-row">
          <button class="btn" id="p-stars">+20 Sterne geben</button>
          <button class="btn danger" id="p-reset">Spielstand löschen</button>
        </div>
      </section>
      <button class="btn primary big" data-act="close">Fertig</button>
    </div>`, { cls: 'parents-modal' });

  $('#p-name', m).addEventListener('input', (e) => { state.name = e.target.value.trim() || 'Emmi'; save(); renderTop(); });
  $('#p-hair', m).addEventListener('click', (e) => {
    const b = e.target.closest('[data-hair]'); if (!b) return;
    state.hair = b.dataset.hair; save(); api.render(); parentsPanel();
  });
  $('#p-math', m).addEventListener('click', (e) => {
    const b = e.target.closest('[data-lv]'); if (!b) return;
    if (b.dataset.lv === 'auto') state.mathAuto = true;
    else { state.mathAuto = false; state.mathLevel = Number(b.dataset.lv); }
    save(); parentsPanel();
  });
  $('#p-craft', m).addEventListener('click', (e) => {
    const b = e.target.closest('[data-lv]'); if (!b) return;
    if (b.dataset.lv === 'auto') state.craftAuto = true;
    else { state.craftAuto = false; state.craftLevel = Number(b.dataset.lv); }
    save(); parentsPanel();
  });
  $('#p-clock', m).addEventListener('click', (e) => {
    const b = e.target.closest('[data-lv]'); if (!b) return;
    if (b.dataset.lv === 'auto') state.clockAuto = true;
    else { state.clockAuto = false; state.clockLevel = Number(b.dataset.lv); }
    save(); parentsPanel();
  });
  $('#p-rec', m).addEventListener('click', () => recordPanel());
  $('#p-limit', m).addEventListener('click', (e) => {
    const b = e.target.closest('[data-min]'); if (!b) return;
    state.limitMin = Number(b.dataset.min);
    save(); parentsPanel();
  });
  $('#p-rows', m).addEventListener('click', (e) => {
    const b = e.target.closest('[data-row]'); if (!b) return;
    const v = b.dataset.row;
    if (v === 'auto') { state.dojoRows = null; state.dojoDiv = false; }
    else {
      const cur = state.dojoRows ? [...state.dojoRows] : [...dojoConfig().rows];
      if (!state.dojoRows) state.dojoDiv = dojoConfig().div;
      if (v === 'div') state.dojoDiv = !state.dojoDiv;
      else {
        const r = Number(v), idx = cur.indexOf(r);
        if (idx >= 0) { if (cur.length > 1) cur.splice(idx, 1); } else cur.push(r);
      }
      state.dojoRows = cur.sort((a, b2) => a - b2);
    }
    save(); parentsPanel();
  });
  m.querySelectorAll('[data-tog]').forEach((b) => b.addEventListener('click', () => {
    state[b.dataset.tog] = !state[b.dataset.tog];
    setAudioPrefs({ sound: state.sound, speech: state.speech });
    save(); renderTop(); parentsPanel();
  }));
  $('#p-stars', m).addEventListener('click', () => { addStars(20); });
  $('#p-reset', m).addEventListener('click', (e) => {
    if (e.target.dataset.confirm) {
      resetState(); setAudioPrefs({ sound: state.sound, speech: state.speech });
      closeModal(); api.go('map'); toast('Spielstand gelöscht.');
    } else { e.target.dataset.confirm = '1'; e.target.textContent = 'Wirklich löschen?'; }
  });
}

// ============ Eigene Aufnahmen ============
let recLang = 'pt-PT';
let recording = null;
function recordPanel(scroll = 0) {
  const pt = recLang === 'pt-PT';
  const groups = allTexts(recLang, state.name);
  groups.push({ group: 'Lob & Gürtel', items: pt ? ['Olá!', 'Muito bem!', 'Obrigado!', ...BELTS.map((b) => b.pt)] : ['Hello!', 'Well done!', ...BELTS.map((b) => b.en)] });
  const row = (t) => {
    const has = !!clipUrl(recLang, t);
    return `<div class="rec-row ${has ? 'has' : ''}" data-t="${esc(t)}"><span class="rt">${esc(t)}</span>
      <button class="rb" data-r="play" aria-label="Anhören">▶</button>
      <button class="rb rec" data-r="rec" aria-label="Aufnehmen">●</button>
      ${has ? '<button class="rb" data-r="del" aria-label="Löschen">🗑</button>' : '<span class="rb-space"></span>'}</div>`;
  };
  const m = openModal(`
    <div class="parents rec">
      <h2>Eigene Stimmen 🎙️</h2>
      <p class="note">● antippen, Wort sprechen, ■ zum Stoppen (höchstens 5 Sekunden). ✓ = eigene Aufnahme vorhanden.</p>
      <div class="chips center">
        <button class="chip ${pt ? 'on' : ''}" data-rl="pt-PT">🇵🇹 Portugiesisch</button>
        <button class="chip ${!pt ? 'on' : ''}" data-rl="en-GB">🇬🇧 Englisch</button>
      </div>
      ${canRecord() ? '' : '<p class="note warn-box">Aufnehmen geht hier nicht – es braucht eine https-Adresse und ein Mikrofon.</p>'}
      ${groups.map((g) => `<section><h3>${esc(g.group)}</h3>${[...new Set(g.items)].map(row).join('')}</section>`).join('')}
      <div class="btn-row"><button class="btn big" data-r="back">Zurück</button></div>
    </div>`, { cls: 'parents-modal' });
  m.scrollTop = scroll;
  m.addEventListener('click', async (e) => {
    const lb = e.target.closest('[data-rl]');
    if (lb) { recLang = lb.dataset.rl; recordPanel(); return; }
    const b = e.target.closest('[data-r]');
    if (!b) return;
    const act = b.dataset.r;
    if (act === 'back') { recording?.stop(); parentsPanel(); return; }
    const t = b.closest('.rec-row')?.dataset.t;
    if (!t) return;
    if (act === 'play') speak(t, recLang, { force: true });
    else if (act === 'del') { await deleteClip(recLang, t); recordPanel(m.scrollTop); }
    else if (act === 'rec') {
      if (recording) { recording.stop(); return; }
      try {
        recording = await startRecording(5000);
        b.classList.add('on');
        b.textContent = '■';
        const blob = await recording.done;
        recording = null;
        if (blob.size > 0) { await saveClip(recLang, t, blob); toast('Gespeichert ✓'); }
        recordPanel(m.scrollTop);
        if (blob.size > 0) speak(t, recLang, { force: true });
      } catch (err) {
        recording = null;
        toast('Mikrofon nicht verfügbar 😕');
      }
    }
  });
}
