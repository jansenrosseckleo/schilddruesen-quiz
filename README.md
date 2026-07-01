# Schilddrüsen-Quiz — miavola

Interaktive Umsetzung des Design-Katalogs `Schilddruesen-Quiz.dc.html`.
Vanilla HTML/CSS/JS, baut direkt auf dem mitgelieferten **Miavola Design System** auf.

## Starten

Die App nutzt relative Pfade und lädt Schriften/CSS aus `_ds/` — sie muss daher
über einen lokalen Server (nicht per `file://`) geöffnet werden:

```bash
cd app
python3 -m http.server 8765
# dann http://localhost:8765 im Browser öffnen
```

Oder mit Node: `npx serve` bzw. jeder andere statische Server.

## Struktur

| Datei        | Inhalt |
|--------------|--------|
| `index.html` | App-Shell, lädt Design-System-CSS + `styles.css` + `app.js` |
| `styles.css` | App-Styles, nur über Design-Tokens (keine Magic-Colors) |
| `app.js`     | Quiz-Engine: Flow, 12 Fragen, Scoring, alle Screens |
| `_ds/`       | Miavola Design System (Tokens, Fonts, Buttons) — unverändert |
| `assets/`    | Logos, Schmetterlinge, Produkt-Hero |

## Der Flow

Intro → 12 Fragen (Single-Select, Multi-Select-Bildkarten, Zahleneingabe mit
Validierung) → 2 Education-Einschübe + 1 Motivations-Moment → optionales
E-Mail-Capture (kein Gate) → Analyse-Übergang → **Ergebnisseite** (Abschnitte
a–e, education-first).

## Scoring & Ergebnis-Stufen

Jede Antwort trägt ein Punkte-Gewicht. Aus der Summe relativ zum Maximum ergibt
sich die Stufe:

- **niedrig** (< 30 %) — sage-grüner Header, Produktblock entfällt → reiner Wissens-Hinweis
- **möglich** (30–58 %) — butter-gelber Header, sanfter Produktblock
- **deutlich** (> 58 %) — wine-roter Header, vollständiger Soft-Product-Block

Aufbau a–e und Ton bleiben über alle Stufen identisch — nur Header-Tint,
Pill-Text, Mechanismus-Klartext und die Stärke der Empfehlung variieren (gemäß
Design-Logik-Hinweis).

## Haltung (North Star)

Education-Produkt, kein Funnel. Mehrwert zuerst, warm & begleitend, ehrlich
einordnen, kein Preis-Geschrei. **Keine Diagnose** — Hinweise verweisen aufs
Blutbild beim Arzt. Produktempfehlung nur als ruhige Schlussfolgerung am Ende.

## Offene Anschluss-Punkte

- `#product-more` öffnet aktuell nur einen Platzhalter-Alert → mit echter Produktseite verlinken.
- E-Mail-Capture speichert nur clientseitig im State → an Newsletter-/CRM-Backend anbinden (z. B. Klaviyo).
- Score-Schwellen (30 % / 58 %) sind als Startwerte gesetzt und leicht in `app.js` (`computeTier`) justierbar.
