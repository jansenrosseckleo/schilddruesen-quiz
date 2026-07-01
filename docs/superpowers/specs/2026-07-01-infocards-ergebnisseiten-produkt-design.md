# Design-Spec — Info-Cards, individuellere Ergebnisseiten, Produkt-Begründung, Asset-Docs

> **Stand:** 2026-07-01 · **Status:** freigegeben (Design), Umsetzung folgt via writing-plans.
> **North Star (CLAUDE.md):** Education-first, echter Mehrwert ohne Kauf. Produktempfehlung
> ist natürliche Schlussfolgerung, kein Funnel.
> **Compliance:** `meta.placeholder` bleibt `true`; alle neuen Texte sind **Entwurf** und
> gehen vor Livegang durch HWG/EFSA-Freigabe (Leo/Compliance). Nichts erfunden — neue
> Inhalte zuerst in `/content/*.md`. Grafiken/Bilder werden nie improvisiert.

## Kontext & Ausgangslage
Die Engine (`app/app.js`) trennt Flow/Rendering strikt vom Content (`content.js` →
generiert `content.json`, Quelle der Wahrheit = `/content/*.md`). Vorhanden und
wiederverwendbar:
- `renderEducation(s)` mit Varianten `burg` und Stat — **noch nicht im Flow platziert**.
- Ergebnis-Rendering `renderOutcomeResult(ev)` mit Blöcken a) validation · b) mech ·
  c) advice · Autoimmun-Block · d) product · e) empower.
- Bedingte Personalisierung via `rich()` (Segment-Arrays `[{text, when?}]`) + `matches(when, ctx)`
  (Prädikate `{q,is/in/has/hasAny/band/skipped}`, `{flag}`, `{hasSymptoms}`, `{outcomeIn}`,
  `{anyOf/allOf/not}`) + Tokens `{{symptoms}}`, `{{autoimmuneFactor}}`.
- Produkt-Auswahl `selectProduct()` mit `reason` (aktuell String, ein Satz).
- `onerror`-Fallback-Muster für alle Bilder bereits etabliert.

## Bestätigte Entscheidungen
1. **Info-Cards:** genau die 3 geplanten — nach **F12** (Wechseljahre/Hormone), **F14**
   (Hashimoto/Familie), **F17** (TSH). Themen exakt wie in `content/questions.md` skizziert.
2. **Card-Aufbau:** Grafik oben + Wissenstext (Grafiken via Claude Design → Steckbriefe).
3. **Ergebnis-Bilder:** ein Hero-Foto je Band A/B/C (Fotos via Image Gen 2.0 → Prompts).
4. **Individualisierung:** umfangreich — inkl. neuer bedingter **Insights-Sektion**.

---

## Komponente 1 — Info-Cards (Education-Screens mit Grafik)

### Engine (`app.js → renderEducation`)
Neue Variante `variant: "info"`: Grafik (`<img>` mit `onerror`-Fallback → `display:none`)
oben, darunter `eyebrow`, `title`, `text`, CTA-Button (`cta`, Default „Weiter"). Bestehende
Varianten bleiben unverändert. Kein Topbar/Counter (Education ist keine Frage → zählt nicht
im Fortschritt; `QUESTION_TYPES` unverändert).

### Datenshape (`content.js → flow`, an drei Positionen eingefügt)
```js
{ type: "education", variant: "info", id: "eduHormone",
  showWhen: { q: "q0", inAnyOf: [0, 2] },   // erbt Geschlechts-Gate von F12
  graphic: "edu-hormone.png", graphicAlt: "…",
  eyebrow: "Gut zu wissen",
  title: "…", text: "…", cta: "Weiter" }
```
- Position: **nach q12** (`eduHormone`, mit gleichem `showWhen` wie F12), **nach q14**
  (`eduHashimoto`, unbedingt), **nach q17** (`eduTsh`, unbedingt).
- `graphic`-Dateien liefert Leo aus Claude Design; bis dahin greift der `onerror`-Fallback
  (Card rendert sauber ohne Bild).

### Content-Quelle
Neu: `content/education.md` — je Card: Eyebrow, Titel, Text (education-first, HWG-neutral),
Position, `showWhen`, Grafik-Dateiname. Danach nach `content.js` → `content.json`.

### Styles (`styles.css`)
Neue Klassen für die Info-Card-Grafik (z. B. `.edu--info`, `.edu__graphic`) über
Design-Tokens; Cache-Buster `?v` in `index.html` erhöhen.

---

## Komponente 2 — Ergebnisseiten: individueller & modular

### 2a · Mehr bedingte Segmente (bestehende Blöcke a/b)
`validation` und `mech.text` je Band um weitere `{when, text}`-Segmente ergänzen, angebunden
an konkrete Antworten: Dauer (F7), Verlauf (F8), Alltags-Einschränkung (F9), Erfahrung
(F10/F11), Werte-Status (F17), Temperatur (F18 band/skipped), Zyklus (F13), Lebensphase
(F12), Hals/Kehle (F16), Motivation (F1). Alle Segmente self-contained.

### 2b · NEU: Insights-Sektion (bedingt, self-contained)
Neue Sektion zwischen b) mech und c) advice: „Was deine Angaben im Einzelnen zeigen".
Erklärende (nicht handlungsleitende) Karten, je mit `when`. Kein Match → Sektion entfällt
komplett (wie `advice` heute: `length ? … : ""`).

Datenshape (pro Outcome in `outcomes.list[].copy`):
```js
insights: [
  { when: { q: "q16", hasAny: ["schwellung","kloss","heiser"] },
    icon: "observe", title: "…", text: "…" },
  { when: { q: "q9", in: [2,3] }, icon: "…", title: "…", text: "…" },
  …
]
```
Engine: analog zum `advice`-Block rendern (Filter über `matches`, `tok()` auf `text`),
eigenes Eyebrow, eigener Alpha-Buchstabe; Sektion nur wenn ≥1 Karte matcht.

**Abschnitts-Buchstaben (in `renderOutcomeResult` hartcodiert, daher explizit):** Die
Alpha-Buchstaben werden neu durchnummeriert, damit die Sequenz durchgängig bleibt:
`a` validation · `b` mech · **`c` insights (NEU)** · `d` advice · `e` product · empower ohne
Buchstabe. Der Autoimmun-Block trägt weiterhin keinen Buchstaben. Fällt eine Sektion (z. B.
insights) weg, bleibt die Reihenfolge lesbar; die Buchstaben sind rein visuelle Marker (keine
inhaltlichen Verweise), daher unkritisch bei Wegfall — ggf. akzeptieren wir eine Lücke, statt
zur Laufzeit umzunummerieren. Reihenfolge der Ergebnisseite: header (+ Hero-Bild) →
`a` validation → `b` mech → `c` insights → `d` advice → Autoimmun-Block → `e` product → empower.

### 2c · Harte Modularitäts-Regel (Kernanforderung)
1. Jeder Block **und** jedes Segment liest sich eigenständig korrekt.
2. **Kein Block/Segment verweist auf einen nachfolgenden** (der wegfallen kann) — keine
   Formulierungen wie „wie unten", „im nächsten Abschnitt", „außerdem empfehlen wir dir
   gleich …".
3. Übergangswörter am Segment-Anfang („Auch …", „Zudem …") nur, wenn das Segment auch als
   erstes/einziges sinnvoll bleibt — sonst neutral formulieren.
4. **Verifikation:** nach dem Build mehrere Personas (min. 5, u. a. Rand-Kombinationen)
   durchspielen und jede gerenderte Ergebnisseite auf hängende Verweise/Doppelungen lesen.

### 2d · Hero-Bild je Band
Feld `heroImage` (+ `heroAlt`) je Outcome A/B/C. Render oben in `renderOutcomeResult`
(über/hinter dem Header) mit `onerror`-Fallback. Dateien via Image Gen 2.0 (Leo);
bis dahin Fallback → kein Bild, Seite intakt.

---

## Komponente 3 — Produkt-Begründung länger & personalisiert
- `productRules[].reason`: von String → **rich-Text-Array** `[{text, when?}]` (2–4 Sätze,
  bedingt/modular). Aufbau: *warum ausgewählt (aus deinen Antworten)* → *wie es zu deiner
  Situation passt* → sanfter „kein Muss"-Rahmen.
- Engine: in `evaluate()` `productReason` künftig via `rich(sel.reason, ctx)` statt
  `tok(sel.reason, ctx)` (String bleibt abwärtskompatibel, da `rich()` Strings akzeptiert).
- **HWG-sicher:** `reason` = Auswahl-Begründung, kein Symptom→Heilversprechen; zugelassene
  Wirkung bleibt in `products[id].claims`. Modularitäts-Regel (2c) gilt auch hier.
- **Produktbilder** (Leo liefert): `image` je Produkt verdrahten, `onerror`-Fallback.
  Fehlend: `umwandler`, `magenfreund`, `immungold`, `kollagen`, `aminos`
  (vorhanden: `produzent-hero.png`, `heldenduo-30-tage.jpg`).

---

## Komponente 4 — Deliverable-Dokumente
- **`content/graphics-spec.md`** — pro Info-Card (3×) ein Grafik-Steckbrief für Claude Design:
  Motiv, Kern-Aussage, Stil (miavola-Markenrahmen: Wein/Burgund `#7A3343`, Creme `#FBF7F2`,
  Sage/Gold; minimalistisch, weiche Rundungen, transparenter Hintergrund, groß exportiert,
  kein Text im Bild, kein AI-Slop), Format/Größe, Dateiname.
- **`content/image-prompts.md`** — fertige, einfügbare Image-Gen-2.0-Prompts für die 3
  Band-Hero-Fotos (A/B/C), markenkonform (ruhig, premium, editorial), + Dateinamen.
- **Produktbild-Liste** — kurzer Abschnitt (in `graphics-spec.md` oder `products.md`): welche
  Produktbilder fehlen, Format/Größe/Dateiname.

---

## Engine-Änderungen (Zusammenfassung, `app/app.js`)
1. `renderEducation`: Variante `info` (Grafik + Text + CTA, `onerror`).
2. `renderOutcomeResult`: Hero-Bild oben; Insights-Sektion zwischen mech und advice.
3. `evaluate`: `productReason` via `rich()`.
4. Danach `content.json` neu generieren (node-Befehl aus `content.js`-Header).
5. `styles.css` erweitern; `?v` in `index.html` erhöhen.

Alles **additiv** — keine Breaking Changes an bestehenden Flows/Outcomes.

## Content-Pipeline (Reihenfolge je Änderung)
`/content/*.md` (Wahrheit) → `app/content.js` (lesbar, kommentiert) →
`app/content.json` (generiert, Engine-Input). Änderung immer in dieser Reihenfolge.

## Verifikation (nach Umsetzung)
- Info-Cards: erscheinen an F12/F14/F17; F12-Card nur bei weiblich/keine Angabe; Zähler stabil.
- Ergebnisseiten: 5+ Personas → Bänder korrekt, bedingte Segmente/Insights matchen,
  **keine hängenden Verweise** (Modularität), Hero-Fallback greift.
- Produkt: `reason` länger & personalisiert, HWG-neutral, Jod-Sicherung intakt, `pending`
  weiter ausgeblendet, Band C ohne Produkt.
- Adversariales Review (Schema/Syntax · Personalisierung/Integration · HWG/EFSA ·
  No-Hallucination), analog zum bestehenden Review-Setup.

## Nicht in diesem Umfang (bleibt in TODO.md)
E-Mail-/CRM-Backend, Schwellen-Kalibrierung (§9.1), finaler EFSA-Wortlaut (§9.5),
Produkt-Scoring diagnostiziert (§9.2), Temperatur-Schwelle final (§9.3), Evas Review (§9.7).

## Offene Punkte (Leo liefert später)
- Grafik-Dateien (Claude Design) je Info-Card.
- Hero-Fotos (Image Gen 2.0) je Band A/B/C.
- Produktbilder (5 fehlende).
- HWG/EFSA-Freigabe aller neuen Texte vor Livegang.
