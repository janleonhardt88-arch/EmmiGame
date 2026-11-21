#!/usr/bin/env python3
"""Erzeugt alle Sprachdateien des Spiels mit Microsofts Online-Stimmen (über das freie Werkzeug edge-tts).

    pip install edge-tts
    python3 tools/make-voices-edge.py              # nur fehlende Dateien erzeugen
    python3 tools/make-voices-edge.py --alle       # alle neu erzeugen (z. B. nach Tempo-Änderung)
    python3 tools/make-voices-edge.py --alle pt-PT # nur eine Sprache neu erzeugen

Schreibt MP3s nach app/voice/<sprache>/ und das Verzeichnis app/voice/index.json.
Nach dem Ersetzen vorhandener Dateien in app/sw.js die Zahl in MEDIA erhöhen,
damit Tablets die neuen Dateien laden.

Hinweis: edge-tts nutzt den Vorlese-Dienst von Microsoft Edge auf inoffiziellem Weg –
gedacht für den privaten Gebrauch, nicht für veröffentlichte Produkte.
"""
import asyncio, hashlib, json, os, subprocess, sys
import edge_tts

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'app', 'voice')
PROXY = os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy')
# Sprache -> (Stimme, Tempo). Alles etwas langsamer als normal, damit Kinder gut folgen können.
VOICES = {
    'pt-PT': ('pt-PT-RaquelNeural', '-30%'),
    'en-GB': ('en-GB-SoniaNeural', '-25%'),
    'de-DE': ('de-DE-KatjaNeural', '-15%'),
}
FILTER = ('silenceremove=start_periods=1:start_threshold=-45dB,areverse,'
          'silenceremove=start_periods=1:start_threshold=-45dB,areverse,apad=pad_dur=0.15,loudnorm=I=-18:TP=-2')
PARALLEL = 6


def file_for(lang, text):
    return lang.split('-')[0] + '/' + hashlib.sha1(f'{lang}|{text}'.encode()).hexdigest()[:12] + '.mp3'


async def make(sem, lang, text, target, counter):
    voice, rate = VOICES[lang]
    spoken = text if text[-1] in '.!?' else text + '.'
    tmp = target + '.tmp.mp3'
    async with sem:
        for attempt in range(4):
            try:
                await edge_tts.Communicate(spoken, voice, rate=rate, proxy=PROXY).save(tmp)
                break
            except Exception:
                if attempt == 3:
                    print('FEHLER bei', lang, text)
                    return
                await asyncio.sleep(2 + attempt * 2)
        proc = await asyncio.create_subprocess_exec(
            'ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', FILTER, '-ac', '1', '-ar', '24000',
            '-codec:a', 'libmp3lame', '-b:a', '48k', target)
        await proc.wait()
        os.remove(tmp)
        counter[0] += 1
        if counter[0] % 50 == 0:
            print(counter[0], 'erzeugt …', flush=True)


async def main():
    args = sys.argv[1:]
    force_all = '--alle' in args
    langs = [a for a in args if not a.startswith('--')] or list(VOICES)
    texts = json.loads(subprocess.check_output(['node', os.path.join(ROOT, 'tools', 'list-voice-texts.mjs')]))
    index, jobs = {}, []
    sem, counter = asyncio.Semaphore(PARALLEL), [0]
    for item in texts:
        lang, text = item['lang'], item['text']
        rel = file_for(lang, text)
        index[f'{lang}|{text}'] = rel
        target = os.path.join(OUT, rel)
        os.makedirs(os.path.dirname(target), exist_ok=True)
        if lang in langs and (force_all or not os.path.exists(target)):
            jobs.append(make(sem, lang, text, target, counter))
    await asyncio.gather(*jobs)
    # Nicht mehr benutzte Dateien aufräumen
    used = set(index.values())
    for sub in ('de', 'en', 'pt'):
        d = os.path.join(OUT, sub)
        for f in os.listdir(d) if os.path.isdir(d) else []:
            if f'{sub}/{f}' not in used:
                os.remove(os.path.join(d, f))
    with open(os.path.join(OUT, 'index.json'), 'w', encoding='utf-8') as f:
        json.dump(index, f, ensure_ascii=False, indent=0, sort_keys=True)
    print(f'{len(index)} Texte, {counter[0]} neu erzeugt')

asyncio.run(main())
