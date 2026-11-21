# Emmis Tierwelt 🌻

Ein Lern- und Spaßspiel für Emmi (2. Klasse) – gebaut für ihr Android-Tablet.

Emmi pflegt einen eigenen Garten mit Tieren. Mit Mathe-Aufgaben gießt sie ihre Pflanzen,
im Karate-Dojo zerschlägt sie Bretter mit dem Einmaleins. Für Sterne kauft sie Samen,
Tiere und neue Beete. Alle Pflanzen und Tiere sprechen Portugiesisch (Portugal),
Englisch und Deutsch.

Ideen & Konzept: [`docs/BRAINSTORMING.md`](docs/BRAINSTORMING.md)

## Was drin ist (v0.2)

- 🌱 **Garten** – säen, gießen (Plus/Minus bis 100, passt sich automatisch an), ernten
- 🥋 **Karate-Dojo** – 10 Bretter mit dem Einmaleins, Blitz-Bonus fürs schnelle Rechnen
- 🎤 **Singbühne** – Vokabeln auf Portugiesisch & Englisch: hören, lesen, Bild ↔ Wort (Farben, Zahlen, Tiere, Obst & Gemüse, Rund ums Haus); jede richtige Antwort ist ein Ton im Lied
- 🧶 **Bastelstube** – Perlen-Armbänder: Muster fortsetzen und Zahlenfolgen (adaptiv), fertige Armbänder landen im Schmuckkästchen
- 🧗 **Kletterwand** – Deutsch: Nomen/Verb/Adjektiv, Rechtschreibung (ie, ck, tz, Doppelkonsonant, Dehnungs-h …), Silben klatschen, Reime, Groß/klein
- 🏪 **Hofladen** – Samen, Tiere, neue Beete; manches erst ab einem bestimmten Gürtel
- 🥋 **Gürtel** von Weiß bis Schwarz als Fortschritt
- 🇵🇹🇬🇧🇩🇪 Vokabeln zum Antippen und Anhören (Sprachausgabe des Tablets)
- 🔒 **Elternbereich** (Rechenaufgabe als Sperre): Fortschritt, Schwierigkeit, Einmaleins-Reihen, Name, Haarfarbe

## Technik

- Reines HTML/CSS/JavaScript, keine Abhängigkeiten, kein Build-Schritt
- PWA: offline spielbar, auf dem Android-Startbildschirm installierbar
- Spielstand bleibt lokal auf dem Gerät – keine Werbung, kein Tracking
- Code liegt in [`app/`](app/)

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
