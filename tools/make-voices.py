#!/usr/bin/env python3
"""Erzeugt die Sprachdateien für das Spiel mit Piper (freie, lokale Sprachsynthese).

    pip install piper-tts
    python3 tools/make-voices.py <Ordner mit den .onnx-Stimmen> [Sprache, die neu erzeugt werden soll …]

Beispiel: `python3 tools/make-voices.py stimmen pt-PT` erzeugt alle portugiesischen Dateien neu.
Danach in app/sw.js die Zahl in MEDIA erhöhen, damit Tablets die neuen Dateien laden.

Schreibt MP3s nach app/voice/<sprache>/ und das Verzeichnis app/voice/index.json.
Bereits vorhandene Dateien werden übersprungen. Um bessere Stimmen einzubauen
(z. B. ElevenLabs), reicht es, die MP3s unter demselben Namen zu ersetzen.
"""
import hashlib, json, os, subprocess, sys, wave
from piper import PiperVoice, SynthesisConfig

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'app', 'voice')
MODELS = sys.argv[1] if len(sys.argv) > 1 else '.'
FORCE = set(sys.argv[2:])
# Sprache -> (Modell, Einstellungen). length_scale: größer = langsamer;
# noise_scale / noise_w_scale: kleiner = ruhiger und gleichmäßiger gesprochen
VOICES = {
    'de-DE': ('de_DE-thorsten-high.onnx', dict(length_scale=1.0)),
    'en-GB': ('en_GB-cori-high.onnx', dict(length_scale=1.12)),
    'pt-PT': ('pt_PT-tugao-medium.onnx', dict(length_scale=1.45, noise_scale=0.45, noise_w_scale=0.5)),
}

texts = json.loads(subprocess.check_output(['node', os.path.join(ROOT, 'tools', 'list-voice-texts.mjs')]))
index, made = {}, 0
for lang, (model, settings) in VOICES.items():
    voice = PiperVoice.load(os.path.join(MODELS, model))
    cfg = SynthesisConfig(**settings)
    sub = lang.split('-')[0]
    os.makedirs(os.path.join(OUT, sub), exist_ok=True)
    for item in texts:
        if item['lang'] != lang:
            continue
        text = item['text']
        name = hashlib.sha1(f'{lang}|{text}'.encode()).hexdigest()[:12] + '.mp3'
        rel = f'{sub}/{name}'
        index[f'{lang}|{text}'] = rel
        target = os.path.join(OUT, rel)
        if os.path.exists(target) and lang not in FORCE:
            continue
        spoken = text if text[-1] in '.!?' else text + '.'
        with wave.open('/tmp/_voice.wav', 'wb') as w:
            voice.synthesize_wav(spoken, w, syn_config=cfg)
        subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-i', '/tmp/_voice.wav',
                               '-af', 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,apad=pad_dur=0.12,loudnorm=I=-18:TP=-2',
                               '-ac', '1', '-ar', '22050', '-codec:a', 'libmp3lame', '-b:a', '48k', target])
        made += 1

with open(os.path.join(OUT, 'index.json'), 'w', encoding='utf-8') as f:
    json.dump(index, f, ensure_ascii=False, indent=0, sort_keys=True)
print(f'{len(index)} Texte, {made} neu erzeugt')
