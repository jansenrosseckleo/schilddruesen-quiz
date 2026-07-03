# Finale Anpassungen: Logik, Info-Card-Grafiken, Klaviyo-Opt-in — Design

**Datum:** 2026-07-03 · **Status:** von Leo freigegeben (Chat)

## Ziel

Letzte Runde vor Livegang: Logik-Korrekturen (Arzt-Befund schlägt Quiz-Score),
fehlende Symptom-Abfragen, neue Info-Card, Grafiken auf den Info-Cards,
E-Mail-Opt-in an Klaviyo, Entwurf-Banner raus.

## 1. Logik & Fragen (`app/content.js`, `app/app.js`)

### 1.1 q17 „Schilddrüsenwerte überprüft?" — neue Antwort

Neue Optionsreihenfolge (Index):

0. Ja, unauffällig
1. **Ja, auffällig** (neu)
2. Ja, kenne die Werte aber nicht
3. Nein, noch nie

Einziger bestehender Index-Verweis (`q17.is: 0`, Advice „Erwähne deine
bisherigen Werte") bleibt gültig; keine weiteren Verweise vorhanden.

### 1.2 Band-Override: ärztlicher Befund → immer Band A

Neue Engine-Fähigkeit `outcomes.bandOverrides` (Array `{ when, band }`,
erster Treffer gewinnt, ausgewertet NACH der Score-Band-Berechnung):

```js
bandOverrides: [
  { when: { q: "q2",  is: 2 }, band: "A" },   // diagnostiziert
  { when: { q: "q17", is: 1 }, band: "A" },   // Werte auffällig
],
```

Begründung: Das Quiz darf einem ärztlichen Befund nicht widersprechen
(„wenig Hinweise" trotz Diagnose war möglich, weil q2 keinen Score hat).
Die Band-A-Texte enthalten bereits eine Diagnose-Variante.

`when`-Auswertung nutzt den bestehenden `matches()`-Matcher.

### 1.3 Produktregeln: Diagnose vor Autoimmun

`productRules` gilt „erster Treffer gewinnt". Neue Reihenfolge:

1. **umwandler** (q2 = Ja, mit `also: produzent`) — rückt an Position 1
2. magenfreund (inaktiv/Stock)
3. immungold (Autoimmun-Flag) — greift damit nur noch bei Nicht-Diagnostizierten
4. kollagen
5. aminos

Jod-Sicherung (`coreProductIds` nur diagnostiziert) bleibt unverändert.
„Ja, auffällig" (q17) gilt NICHT als Diagnose → keine Core-Produkte.

### 1.4 q15-Infocard: Hashimoto ergänzen

Neuer Info-Text: „Gemeint ist eine Autoimmunerkrankung bei dir selbst, zum
Beispiel Hashimoto (eine Autoimmunerkrankung der Schilddrüse), Rheuma,
Typ-1-Diabetes, Zöliakie oder Schuppenflechte. Solche Erkrankungen treten
häufiger gemeinsam auf."

### 1.5 q4 „Haut, Haare & Äußeres": zwei neue Punkte

- `rillen` — „Längsrillen in den Fingernägeln" (inline: „Längsrillen in den Fingernägeln")
- `brauen` — „Ausdünnen der Augenbrauen (außen)" (inline: „ausgedünnte Augenbrauen")

Jeweils `score: 1` in `signalRules`; beide zusätzlich in die Kollagen-Regel
(`hasAny`) und in die „Haut & Haare"-Insights (`hasAny`) aufnehmen.

### 1.6 Neue Info-Card nach Frage 7 (Verlauf)

`type: "education", variant: "info", id: "eduSchaltzentrale"`,
`graphic: "edu-schaltzentrale.png"`.

- Eyebrow: „Gut zu wissen"
- Titel: „Deine Schilddrüse: die Schaltzentrale des Körpers"
- Text (Entwurf, edukativ, keine Health-Claims): „Die Schilddrüse ist nur
  wenige Zentimeter groß, aber ihre Hormone wirken praktisch überall: Sie
  beeinflussen Energie, Körpertemperatur, Herzschlag, Verdauung, Haut und
  Haare, sogar Stimmung und Konzentration. Arbeitet sie langsamer, kann sich
  das an vielen Stellen gleichzeitig bemerkbar machen. Genau deshalb fragen
  wir so breit durch den ganzen Körper."

Die Card erscheint immer (auch wenn q7 wegen „keine Symptome" übersprungen wird).

### 1.7 Entwurf-Banner entfernen

`meta.placeholder: false` — der Ribbon „ENTWURF · INHALTE VOR LIVEGANG
HWG/EFSA-FREIGABE" verschwindet. (Die HWG/EFSA-Freigabe selbst bleibt als
Punkt in TODO.md.)

## 2. Grafiken auf den Info-Cards

Engine rendert `graphic` bereits (mit `onerror`-Fallback). Es fehlen nur die
Dateien in `app/assets/`:

- `edu-hormone.png` · `edu-hashimoto.png` · `edu-tsh.png` · `edu-schaltzentrale.png`

Claude liefert 4 Bild-Prompts (ChatGPT Image Gen 2.0, miavola-Markenrahmen:
Wein #7A3343, Creme #FBF7F2, einfarbige Linien-Illustration, transparenter
Hintergrund, 1024², kein Text im Bild). Leo generiert + legt Dateien ab.

## 3. E-Mail-Screen + Klaviyo-Opt-in

### UX (Screen „Dein Ergebnis ist fertig.")

- Skip-Link „Direkt zum Ergebnis, ohne E-Mail" **entfällt**.
- Ein Button „Ergebnis ansehen":
  - Feld leer → direkt weiter (kein Fehler).
  - Feld gefüllt + gültig → weiter; wenn Opt-in-Checkbox gesetzt →
    Klaviyo-Subscribe im Hintergrund (fire-and-forget).
  - Feld gefüllt + ungültig → Fehlerhinweis (Text ohne Skip-Verweis:
    „Bitte gib eine gültige E-Mail-Adresse ein oder lass das Feld leer.").
- Ein Klaviyo-/Netzwerkfehler blockiert **nie** den Weg zum Ergebnis.

### Klaviyo (client-seitig, ohne Backend)

- `POST https://a.klaviyo.com/client/subscriptions/?company_id=QQjWAk`
  (Header `revision`, Content-Type `application/json`)
- Liste: **UEPkJi** („Schilddrüsen-Quiz Leads (neu)"), Double-Opt-in via Klaviyo.
- `custom_source: "Schilddrüsen-Quiz"`; Profil-Properties aus dem Ergebnis:
  `quiz_band` (A/B/C), `quiz_produkt` (Produkt-ID oder leer), `quiz_autoimmun` (bool).
- Konfiguration in `content.js → meta.klaviyo` (über Backend/Editor pflegbar):
  `{ companyId: "QQjWAk", listId: "UEPkJi", source: "Schilddrüsen-Quiz" }`.

### Ergebnisseite

- Button „Ergebnis per Mail sichern" (`ctaSave`, `state.saved`) wird
  **entfernt** — Ergebnis-Mail-Versand ist bewusst verschoben (späteres
  Paket: Klaviyo-Event + Flow). Es bleibt „Quiz neu starten".

## 4. Nacharbeiten

- `content/questions.md` + `content/outcomes.md` nachziehen (Quelle der Wahrheit).
- `content.json` regenerieren; `index.html` Cache-Version `?v=15`.
- TODO.md aktualisieren.
- Deploy: main + gh-pages (gemäß CLAUDE.md).

## Nicht-Ziele

- Kein Ergebnis-Mail-Versand (später: Klaviyo-Event „Quiz abgeschlossen" + Flow).
- Kein Ausbau des visuellen Editors in dieser Runde.
