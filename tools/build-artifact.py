#!/usr/bin/env python3
"""Baut eine Kopie der App für das Claude-Artefakt (dort sind höchstens 511 Dateien erlaubt).

    python3 tools/build-artifact.py <Zielordner>

Kopiert app/ ohne die einzelnen Sprachdateien und packt diese stattdessen pro Sprache in
eine Sammeldatei (voice/<sprache>-pack.mp3). voice/index.json verweist dann auf
[Sammeldatei, Start, Länge] – die App spielt beides ab.
"""
import json, os, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(ROOT, 'app')
OUT = sys.argv[1]

if os.path.exists(OUT):
    shutil.rmtree(OUT)
shutil.copytree(APP, OUT, ignore=shutil.ignore_patterns('voice', 'sw.js', 'index.html', 'manifest.webmanifest'))
os.makedirs(os.path.join(OUT, 'voice'))

index = json.load(open(os.path.join(APP, 'voice', 'index.json'), encoding='utf-8'))
packs, packed = {}, {}
for key, rel in sorted(index.items(), key=lambda kv: kv[1]):
    sub = rel.split('/')[0]
    data = open(os.path.join(APP, 'voice', rel), 'rb').read()
    buf = packs.setdefault(sub, bytearray())
    packed[key] = [f'{sub}-pack.mp3', len(buf), len(data)]
    buf.extend(data)
for sub, buf in packs.items():
    open(os.path.join(OUT, 'voice', f'{sub}-pack.mp3'), 'wb').write(buf)
with open(os.path.join(OUT, 'voice', 'index.json'), 'w', encoding='utf-8') as f:
    json.dump(packed, f, ensure_ascii=False, separators=(',', ':'))

files = []
for d, _, names in os.walk(OUT):
    for n in names:
        files.append(os.path.relpath(os.path.join(d, n), OUT))
print(json.dumps([{'path': p} for p in sorted(files)]))
