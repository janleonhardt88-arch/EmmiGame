# Emmis Tierwelt 🌻

Ein Lern- und Spaßspiel für Emmi (2. Klasse) – gebaut für ihr Android-Tablet.

Emmi pflegt einen eigenen Garten mit Tieren. Mit Mathe-Aufgaben gießt sie ihre Pflanzen,
im Karate-Dojo zerschlägt sie Bretter mit dem Einmaleins. Für Sterne kauft sie Samen,
Tiere und neue Beete. Alle Pflanzen und Tiere sprechen Portugiesisch (Portugal),
Englisch und Deutsch.

Ideen & Konzept: [`docs/BRAINSTORMING.md`](docs/BRAINSTORMING.md)

## Was drin ist (v0.4)

Startbildschirm ist eine **Weltkarte**: Emmi tippt auf ein Gebäude und ist am Ort. Kleine Abzeichen zeigen,
wo etwas wartet (💧 gießen, 🧺 ernten, 🛎️ Kunden, ⭐ Tagesaufgabe).

- 🌱 **Garten** – säen, gießen (Plus/Minus bis 100, passt sich automatisch an), ernten; Deko aus dem Hofladen
- 🥋 **Karate-Dojo** – 10 Bretter mit dem Einmaleins; Aufgaben, die noch nicht sitzen, kommen öfter dran
- 🩰 **Ballettstudio** – *Tanz merken* und *Uhr-Ballett* (Uhrzeit lesen in 3 Stufen)
- 🎤 **Singbühne** – Vokabeln und Sätze auf Portugiesisch (Portugal) & Englisch; wenig geübte Wörter zuerst
- 🧶 **Bastelstube** – Perlen-Armbänder: Muster und Zahlenfolgen
- 🧗 **Kletterwand** – Deutsch: Wortarten, Rechtschreibung, Silben, Reime, Groß/klein
- 🏪 **Hofladen** – Samen, Tiere, Beete, Deko kaufen; Ernte verkaufen mit Wechselgeld (Euro & Cent)
- 🥋 **Gürtel** von Weiß bis Schwarz, ✅ **Tagesaufgaben** mit Bonus-Sternen
- 🎵 **Hintergrundmusik** – zwei echte Instrumentalstücke (MP3, mit ElevenLabs Music erzeugt), an Lernorten leiser, beim Vorlesen kurz abgesenkt; eigener Aus-Knopf
- 🎙️ **Eigene Stimmen** – Wörter und Sätze selbst aufnehmen (z. B. Mama auf Portugiesisch)
- 👗 **Figur gestalten** – Tipp auf den Namen oben links: 8 Frisuren, 9 Haarfarben, 5 Hauttöne, 8 Outfits, 5 Tutu-Farben, 7 Extras (Krone, Brille, Katzenohren …); vieles kostet Sterne
- 🗣️ **Eingebaute Stimmen** – 440 vorab erzeugte Sprachdateien statt der Tablet-Stimme: Deutsch und Englisch mit Piper (`tools/make-voices.py`), Portugiesisch mit einer Microsoft-Stimme (`tools/make-voices-edge.py`, inoffizieller Weg, nur für privaten Gebrauch)
- 🔒 **Elternbereich** – Fortschritt, schwierige Einmaleins-Aufgaben, Schwierigkeiten, tägliches Spielzeit-Limit, Name, Haarfarbe, Aufnahmen

## Technik

- Reines HTML/CSS/JavaScript, keine Abhängigkeiten, kein Build-Schritt
- PWA: offline spielbar, auf dem Android-Startbildschirm installierbar
- Spielstand bleibt lokal auf dem Gerät – keine Werbung, kein Tracking
- Code liegt in [`app/`](app/): `js/main.js` (Karte & Navigation), `js/games/*.js` (ein Modul pro Ort), `js/ui.js`, `js/parents.js`, `js/music.js` …
- Rauchtest: `node tests/smoke.js` spielt alle Orte im Browser durch (braucht Playwright und einen lokalen Server, siehe Datei-Kopf)

## Lokal ausprobieren

```bash
cd app && python3 -m http.server 8000
# dann http://localhost:8000 im Browser öffnen
```

## Aufs Tablet bringen (GitHub Pages)

1. Im Repo: **Settings → Pages → Source: „GitHub Actions"**
2. Workflow **„Spiel auf GitHub Pages veröffentlichen"** läuft bei jedem Push auf `main`
   (oder manuell unter *Actions*)
3. Auf dem Tablet die Pages-Adresse in **Chrome** öffnen → Menü ⋮ → **„Zum Startbildschirm hinzufügen"**

**Portugiesische Stimme:** Android-Einstellungen → Bedienungshilfen → Text-in-Sprache →
Google-Sprachausgabe → Sprachdaten installieren → *Português (Portugal)*.
Im Elternbereich kann man testen, welche Stimme verwendet wird.
