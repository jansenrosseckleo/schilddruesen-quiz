# Design: Visuelles Quiz-Backend (Typeform-artig) + Geschlechts-Frage

> Status: **Genehmigtes Design** (Brainstorming abgeschlossen 2026-06-30).
> Quelle der Wahrheit für die Implementierung. Nächster Schritt: Implementierungsplan
> (writing-plans). Phasen sind einzeln lauffähig.

## North-Star-Bezug
Education-first bleibt unangetastet. Das Backend ändert **nicht** das Quiz-Erlebnis,
sondern macht die bestehende Logik (Scoring, Bänder, Produktregeln, Ergebnistexte)
**sichtbar und für Leo/Eva editierbar** — ohne Code anzufassen. Die Jod-Sicherung und
„Band C = kein Produkt" bleiben als nicht abschaltbare Regeln bestehen.

---

## 1) Architektur (Ansatz B — JSON als Datenquelle)

### Datenfluss heute → künftig
- **Heute:** `app/content.js` (`window.QUIZ_CONTENT = {…}`, mit Kommentaren) wird per
  `<script>` synchron geladen; `app.js` liest `window.QUIZ_CONTENT` beim Modul-Start.
- **Künftig:**
  - **`app/content.json`** — reine Daten, **maschinelle Quelle der Wahrheit** (Fragen,
    Outcomes, Produkte, Ergebnistexte).
  - **`app.js`** lädt `content.json` per `fetch` in einem **async-Boot**, wendet einen
    optionalen **localStorage-Override** an, und startet dann die Engine.
  - **`/content/*.md`** bleiben die **inhaltlich/Compliance-geprüfte Referenz** (Prosa,
    die Eva/Compliance abzeichnen). Der Editor ersetzt nur den manuellen
    „md → content.js"-Übertragungsschritt, nicht die fachliche Freigabe.
  - **`app/content.js` entfällt** als Engine-Input (bleibt ggf. als generierter
    Lese-Export erhalten, ist aber nicht mehr die Quelle — siehe §5 Export).

### Engine-Anpassungen (`app.js`)
- IIFE-Body in eine `async function boot()` wrappen: zuerst Content laden, dann `FLOW`
  bauen und `render()`. `const C` wird erst nach dem Laden gesetzt.
- **Content-Loader** (Reihenfolge):
  1. `localStorage["quizContentOverride"]` vorhanden & valide → diesen nutzen.
  2. sonst `fetch("content.json")`.
  3. Fehlerfall → sichtbare Fehlermeldung (wie heute bei fehlendem `content.js`).
- **`Infinity`-Ersatz:** Temperatur-Bänder `{ below: Infinity }` → `{ below: null }`
  (JSON-fähig). `bandIndex()` behandelt `below: null` als „nach oben offen".
- Sonst bleibt die Auswertungslogik (`evaluate`, `selectProduct`, `condMet`, Tokens)
  **unverändert** — sie ist bereits rein datengetrieben.

### Hinweis: `fetch` braucht den Server
`content.json` per `fetch` funktioniert über `python3 -m http.server` (bereits in Gebrauch),
**nicht** über `file://`. Das ist bereits der dokumentierte Preview-Weg — keine neue Hürde.

### Editor-Dateien
- **`app/admin.html`** — eigenständige Editor-Seite (nicht Teil des Quiz-Flows).
- **`app/admin.js`** — Editor-Logik (Vanilla, keine Library, kein Build).
- **`app/admin.css`** — Editor-Styles auf den **Miavola Design-Tokens** (kein Magic-Color).
- Erreichbar unter `http://localhost:8765/admin.html`. Nicht aus dem Quiz verlinkt
  (internes Werkzeug).

---

## 2) Datenmodell (`content.json`)

Spiegelt die heutige `QUIZ_CONTENT`-Struktur 1:1, als reines JSON:
`meta`, `intro`, `flow[]`, `email`, `analysis`, `outcomes{…}`, `products{…}`, `result`.

Einzige Modell-Änderungen ggü. heute:
- `flow[].bands[].below: Infinity` → `null`.
- **Neu: Geschlechts-Frage** als erstes Flow-Element (siehe §6).
- **Neu: Zyklus-Gating** über `showWhen` (siehe §6).

Migration = 1× `content.js` → `content.json` transkribieren (verlustfrei bis auf die
dokumentierenden Kommentare; die wandern in dieses Spec / in den Editor als Hilfetexte).

---

## 3) Editor — die vier Panels

Tab-Layout: **Fragen · Scoring · Produkte · Ergebnistexte · Vorschau**. Globale Kopfleiste:
„Speichern (localStorage)", „Exportieren (content.json)", „Override zurücksetzen",
Validierungs-Status (grün/rot).

### Panel 1 — Fragen & Antworten
- Liste aller Flow-Fragen, **umsortierbar** (Hoch/Runter-Pfeile), **hinzufügen/löschen**.
- Pro Frage editierbar: Fragetext, `sub`, Typ (single/multi/number), Optionen
  (Label, bei multi `key` + `exclusive`, bei number `min/max/unit/bands`).
- **Anzeige-/Skip-Bedingung** (`showWhen`) per geführtem Feld: „immer" · „hasSymptoms" ·
  „Frage X ∈ Antworten […]".
- Beim Umbenennen/Löschen von Optionen: Hinweis auf abhängige Scoring-/Produkt-/Text-Regeln
  (§7 Validierung).

### Panel 2 — Scoring & Bänder
- **Signal-Tabelle:** je Antwort-Identität (`<qid>.<index|key|band:i>`) Punkte + Flags.
  Darstellung gruppiert nach Frage; nur sinnvolle Antworten anklickbar.
- **Caps** (z. B. `q16: 2`) editierbar.
- **Bänder A/B/C** (Schwellen 8/4) als Felder; Live-Hinweis „Score N → Band X".
- **Read-only Übersicht** „max. erreichbarer Score" zur Plausibilität.

### Panel 3 — Produkte & Produktregeln
- **Registry:** je Produkt Name, `sub`, `text`, `claims[]`, `cta`, `link`, `image`,
  `disclaimer`, `pending`-Schalter.
- **Produktregeln:** geordnete Liste „Bedingung → Produkt (+ `reason`)", **umsortierbar**
  (Reihenfolge = Priorität, „erste passende gewinnt" sichtbar erklärt).
- **`coreProductIds` / Jod-Sicherung** sichtbar und als **gesperrte Regel** markiert
  (Core nur bei Diagnose; nicht abschaltbar).
- **Bedingungs-Builder** wie in Panel 4 (Frage=Antwort / `has` / `hasAny` / `flag`).

### Panel 4 — Ergebnistexte (voll-visueller Bedingungs-Builder)
- Pro Band A/B/C die Bausteine **a–e** (`validation`, `mech`, `advice`, `productId`-Slot,
  `empower`) sowie `autoimmuneBlock` und `autoimmuneFactors`.
- Jeder **Rich-Text-Baustein** (`{ text, when? }`) editierbar:
  - **Text** in Textfeld; **Token-Einfügung** per Button (`{{symptoms}}`,
    `{{autoimmuneFactor}}`).
  - **`when`-Bedingung** per visuellem Builder: Typ wählen
    (`hasSymptoms` · `q = index` · `q hasAny […]` · `flag` · `band` · `skipped` ·
    `anyOf[…]`), Werte aus den real existierenden Fragen/Antworten als Dropdown.
  - Bausteine umsortierbar, hinzufügbar, löschbar.
- `advice`-Einträge zusätzlich mit `icon`-Auswahl (vorhandene Icon-Keys) + `title`/`text`.

---

## 4) Live-Vorschau & Speicherfluss

- **Vorschau-Tab** rendert das **echte Quiz** mit den aktuellen Editor-Daten: das Quiz
  liest beim Laden den localStorage-Override. Umsetzung: Vorschau lädt `index.html` in
  einem `<iframe>`; der Editor schreibt vor dem (Neu-)Laden den aktuellen Stand nach
  `localStorage["quizContentOverride"]`.
- **Speichern** = Schreiben nach localStorage (automatisch + manuell). Übersteht
  Browser-Reload, gilt nur lokal/diesem Browser.
- **Exportieren** = Download einer fertigen `content.json` (für Livegang/Teilen/Commit).
- **Override zurücksetzen** = localStorage löschen → Quiz nutzt wieder die ausgelieferte
  `content.json`.

---

## 5) Export-Format

- Primär: **`content.json`** (Download), ersetzt die ausgelieferte Datei.
- `Infinity` existiert im JSON nicht → als `null` (s. §1). Keine Funktionen im Content,
  daher JSON vollständig ausreichend.
- **Optional** (nice-to-have, nicht blockierend): zusätzlich ein generierter
  `content.js`-Lese-Export für Diff/Review-Zwecke. Nicht Teil des MVP.

---

## 6) Phase 0 — Geschlechts-Frage (unabhängig, zuerst)

**Problem (Evas Feedback):** Quiz fragt aktuell alle nach Zyklus/Menstruation; Block E
heißt „Frauengesundheit" und ist für alle sichtbar.

**Lösung:**
- **Neue erste Frage `q0` (single), vor `q1`:**
  - Text: „Welches biologische Geschlecht hast du?" mit kurzem Grund-Hinweis
    (`sub`): „Wir fragen das nur, weil dein Hormonhaushalt deine Schilddrüse direkt
    beeinflusst — und manche Fragen dadurch nur für bestimmte Menschen relevant sind."
  - Optionen: **Weiblich** (0) · **Männlich** (1) · **Keine Angabe** (2).
  - **Kein Scoring**, reine Steuerung (wie q1/q2).
  - „Divers" wird bewusst **nicht** verwendet (rechtliche/Identitäts-Kategorie, nicht
    biologisch). „Keine Angabe" deckt Zurückhaltung ab.
- **Block-E-Gating (Zyklus/Frauengesundheit, `q12`/`q13`):**
  - `q12` zeigen, wenn `q0 ∈ {0 (weiblich), 2 (keine Angabe)}`. Bei „männlich" übersprungen.
  - `q13` bleibt zusätzlich an `q12 ∈ {0,1}` gekoppelt (bestehende Regel).
  - `showWhen` unterstützt dafür `inAnyOf` auf `q0` (bereits vorhanden) — ggf. mehrere
    Bedingungen kombinierbar machen (`q12` hängt nur an `q0`; `q13` an `q12`).
- **Umbenennung** Block-Label „Frauengesundheit" → neutraler, z. B. **„Zyklus & Hormone"**.
- **Engine:** `showWhen` kann bereits `{ q, inAnyOf }`. Kein neuer Mechanismus nötig;
  nur Content-Änderung + Label.
- **Wichtig:** Diese Phase **braucht den Editor nicht** und kann sofort ausgeliefert
  werden. Sie wird in `content.js` (heute) bzw. `content.json` (nach Phase 1) gepflegt.

---

## 7) Sicherheitsnetz (Validierung)

Da Nicht-Entwickler editieren:
- **Referenz-Validierung:** Warnung, wenn eine Scoring-/Produkt-/Text-Bedingung auf eine
  **nicht (mehr) existierende** Frage/Antwort/Produkt-ID zeigt. Liste der Treffer + Sprung
  zur Fundstelle.
- **Gesperrte Invarianten** sichtbar markiert und nicht abschaltbar:
  - Band C → nie ein Produkt.
  - `coreProductIds` (jodhaltig) nur bei Diagnose (`q2 = Ja`).
- **`pending`-Produkte** klar als „wird nicht angezeigt" markiert.
- **Export blockiert** bei kaputten Referenzen, mit klarer Meldung. Speichern (localStorage)
  bleibt erlaubt (Zwischenstand), Export nicht.

---

## 8) Phasen (jede einzeln lauffähig)

- **Phase 0 — Geschlechts-Frage** (§6). Reine Content-Änderung, sofort auslieferbar.
- **Phase 1 — Migration** `content.js` → `content.json`, Engine-async-Boot,
  `Infinity`→`null`, localStorage-Override-Hook. Quiz verhält sich identisch.
- **Phase 2 — Editor-Grundgerüst** (`admin.html/js/css`), Tab-Shell, Fragen-Panel,
  Live-Vorschau (iframe + localStorage), Speichern/Export/Reset.
- **Phase 3 — Scoring-Panel + Produkte-Panel.**
- **Phase 4 — Ergebnistexte-Panel** mit voll-visuellem Bedingungs-Builder + Validierung (§7).

---

## 9) Bewusst draußen (YAGNI)
- Kein Login / Mehrbenutzer / Rollen.
- Keine Cloud-Sync, kein Server-Backend, keine Datenbank.
- Keine Versionierung/History/Undo über localStorage hinaus.
- Kein WYSIWYG-Styling der Ergebnisseite (nur Inhalt, nicht Layout/CSS).
- Kein Editieren der statischen UI-Texte (`intro`, `email`, `analysis`) im MVP —
  optional später, kein Blocker.

---

## 10) Offene Punkte (vor/while Implementierung mit Leo klären)
- Genauer Wortlaut der `q0`-Frage + `sub` (Compliance-/Ton-Abnahme durch Eva/Leo).
- Soll „Keine Angabe" den Zyklus-Block **zeigen** (aktuell: ja) oder **überspringen**?
- Neues Block-Label final („Zyklus & Hormone"?).
- Editor-Zugang: rein lokal (Empfehlung) — falls gehostet, müsste `admin.html` vom
  Deployment ausgeschlossen/geschützt werden (nicht im MVP-Scope, aber notieren).

---

> Hinweis: Das Projekt ist **kein** Git-Repo. Spec wird daher nur als Datei abgelegt,
> nicht committet. Bei Bedarf Git initialisieren.
