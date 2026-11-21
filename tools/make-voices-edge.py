#!/usr/bin/env python3
"""Erzeugt Sprachdateien mit Microsofts Online-Stimmen (über das freie Werkzeug edge-tts).

    pip install edge-tts
    python3 tools/make-voices-edge.py pt-PT            # Sprache(n), die neu erzeugt werden sollen

Überschreibt die MP3s in app/voice/<sprache>/ (gleiche Dateinamen wie tools/make-voices.py).
Danach in app/sw.js die Zahl in MEDIA erhöhen, damit Tablets die neuen Dateien laden.

Hinweis: edge-tts nutzt den Vorlese-Dienst von Microsoft Edge auf inoffiziellem Weg –
gedacht für den privaten Gebrauch, nicht für veröffentlichte Produkte.
"""
import asyncio, hashlib, json, os, subprocess, sys
import edge_tts

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'app', 'voice')
PROXY = os.environ.get('HTTPS_PROXY') or os.environ.get('https_proxy')
# Sprache -> (Stimme, Tempo)
VOICES = {
    'pt-PT': ('pt-PT-RaquelNeural', '-22%'),
    'en-GB': ('en-GB-SoniaNeural', '-12%'),
    'de-DE': ('de-DE-KatjaNeural', '-5%'),
}
FILTER = 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,apad=pad_dur=0.12,loudnorm=I=-18:TP=-2'


async def main():
    langs = sys.argv[1:]
    if not langs:
        sys.exit('Bitte mindestens eine Sprache angeben, z. B. pt-PT')
    texts = json.loads(subprocess.check_output(['node', os.path.join(ROOT, 'tools', 'list-voice-texts.mjs')]))
    made = 0
    for item in texts:
        lang, text = item['lang'], item['text']
        if lang not in langs:
            continue
        voice, rate = VOICES[lang]
        name = hashlib.sha1(f'{lang}|{text}'.encode()).hexdigest()[:12] + '.mp3'
        target = os.path.join(OUT, lang.split('-')[0], name)
        spoken = text if text[-1] in '.!?' else text + '.'
        for attempt in range(3):
            try:
                await edge_tts.Communicate(spoken, voice, rate=rate, proxy=PROXY).save('/tmp/_edge.mp3')
                break
            except Exception as e:  # Netzwerk-Schluckauf: kurz warten und nochmal
                if attempt == 2:
                    raise
                await asyncio.sleep(2)
        subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', '/tmp/_edge.mp3', '-af', FILTER,
                               '-ac', '1', '-ar', '24000', '-codec:a', 'libmp3lame', '-b:a', '48k', target])
        made += 1
    print(f'{made} Dateien neu erzeugt')

asyncio.run(main())
