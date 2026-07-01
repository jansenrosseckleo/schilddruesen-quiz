# Fundament: Geschlechts-Frage + JSON-Migration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Das Quiz um eine biologische Geschlechts-Frage (mit Zyklus-Gating) erweitern und die Content-Quelle von `content.js` auf `content.json` umstellen (async-Boot + localStorage-Override), ohne das Quiz-Erlebnis sonst zu verändern.

**Architecture:** Phase 0 ändert nur Content in `app/content.js` (neue Frage `q0`, Gating von Block E, Label). Phase 1 zieht denselben Content nach `app/content.json` um, lässt die Engine ihn per `fetch` (mit optionalem `localStorage`-Override) async laden und ersetzt `Infinity` durch `null`. Die Auswertungslogik bleibt unverändert.

**Tech Stack:** Vanilla HTML/CSS/JS, kein Build-Step. Lokaler Server: `python3 -m http.server`. Node nur für JSON-Validierung in der Verifikation.

## Global Constraints

- Alle Inhalte auf **Deutsch**, volle Orthografie (Umlaute/ß). (CLAUDE.md)
- **Engine kennt keine Inhalte.** Texte/Fragen/Outcomes nur in Content. (CLAUDE.md Architektur)
- **Keine** medizinischen Aussagen/Produktempfehlungen/Ergebnis-Texte erfinden. (CLAUDE.md)
- **Keine** neuen Dependencies, **kein** Build-Step. (Tech-Stack-Entscheidung)
- Nur Design-Tokens, keine Magic-Colors. (CLAUDE.md) — in diesem Plan nicht relevant (kein neues CSS).
- „Divers" wird **nicht** verwendet (rechtliche/Identitäts-Kategorie, nicht biologisch). (Spec §6)
- Jod-Sicherung & „Band C = kein Produkt" bleiben unangetastet. (Spec)
- Preview/`fetch` laufen über `cd app && python3 -m http.server 8765` → `http://localhost:8765`.

---

## Datei-Struktur

| Datei | Verantwortung | Phase |
|---|---|---|
| `app/content.js` | Content-Quelle (heute). Bekommt `q0` + Gating + Label. Nach Phase 1 nicht mehr Engine-Input. | 0 |
| `app/content.json` | **Neu.** Maschinelle Content-Quelle (reines JSON). | 1 |
| `app/app.js` | Engine. Async-Boot + Loader + `Infinity`-Handling. | 1 |
| `app/index.html` | Lädt nur noch `app.js` (kein `content.js`-Script mehr). | 1 |

---

## PHASE 0 — Geschlechts-Frage + Zyklus-Gating

### Task 0.1: Neue Frage `q0` als erstes Flow-Element einfügen

**Files:**
- Modify: `app/content.js` (flow-Array, direkt vor `// F1 — Motivation`)

**Interfaces:**
- Produces: Flow-Frage mit `id: "q0"`, `type: "single"`, Optionen-Indizes `0=weiblich`, `1=männlich`, `2=keine Angabe`. Kein Scoring (kein Eintrag in `signalRules`).

- [ ] **Step 1: `q0` einfügen**

In `app/content.js`, im `flow: [`-Array, als allererstes Element (vor dem `// F1 — Motivation`-Block) einfügen:

```javascript
    // F0 — Biologisches Geschlecht (Personalisierung + Block-E-Gating; kein Scoring)
    { type: "single", id: "q0", cat: "Einstieg", wirkung: "Steuert Zyklus-Block (Block E); kein Score",
      q: "Welches biologische Geschlecht hast du?",
      sub: "Wir fragen das nur, weil dein Hormonhaushalt deine Schilddrüse direkt beeinflusst — dadurch sind manche Fragen nur für bestimmte Menschen relevant.",
      options: [
        { label: "Weiblich" },         // 0
        { label: "Männlich" },         // 1
        { label: "Keine Angabe" },     // 2
      ] },

```

- [ ] **Step 2: Browser-Check — q0 erscheint zuerst**

Run: `cd "app" && python3 -m http.server 8765` (Hintergrund), Browser `http://localhost:8765`.
Quiz starten. **Expected:** Erste Frage nach dem Intro ist „Welches biologische Geschlecht hast du?" mit drei Optionen und dem Hinweistext. Weiter zu F1 möglich.

- [ ] **Step 3: Commit-Surrogat (kein Git-Repo)**

Kein Git-Repo vorhanden → kein `git commit`. Stattdessen Fortschritt in `TODO.md` notieren ist optional; weiter zu Task 0.2.

---

### Task 0.2: Zyklus-Block (q12) an q0 koppeln + Label umbenennen

**Files:**
- Modify: `app/content.js` — `q12` (Block E) `showWhen` + `cat`; `q13` `cat`.

**Interfaces:**
- Consumes: `q0` aus Task 0.1 (Indizes 0/1/2).
- Produces: `q12` zeigt nur bei `q0 ∈ {0,2}`. Block-Label „Zyklus & Hormone".

**Hintergrund:** `app.js → condMet`/`condCountable` interpretieren `showWhen: { q, inAnyOf: [...] }` bereits (app.js:70–73, 94–96). `q12` hat heute **kein** `showWhen` (immer sichtbar). `q13` hat `showWhen: { q: "q12", inAnyOf: [0,1] }` — bleibt unverändert (kaskadiert korrekt, da `q13` nur erscheint, wenn `q12` beantwortet wurde).

- [ ] **Step 1: `q12` gaten + umbenennen**

In `app/content.js` den `q12`-Block ändern. Vorher:

```javascript
    { type: "single", id: "q12", cat: "Frauengesundheit",
      wirkung: "Personalisierung (Wechseljahre-Überlagerung) + Flag (Geburt < 12 Monate → Autoimmun-Hinweis)",
      q: "In welcher Lebensphase befindest du dich gerade?",
```

Nachher:

```javascript
    { type: "single", id: "q12", cat: "Zyklus & Hormone", showWhen: { q: "q0", inAnyOf: [0, 2] },
      wirkung: "Personalisierung (Wechseljahre-Überlagerung) + Flag (Geburt < 12 Monate → Autoimmun-Hinweis). Nur bei q0 ∈ {weiblich, keine Angabe}.",
      q: "In welcher Lebensphase befindest du dich gerade?",
```

- [ ] **Step 2: `q13` Label angleichen**

In `app/content.js` beim `q13`-Block nur `cat` ändern: `cat: "Frauengesundheit"` → `cat: "Zyklus & Hormone"`. `showWhen` und alles andere unverändert lassen.

- [ ] **Step 3: Browser-Check — männlich überspringt Block E**

Server läuft. Quiz starten, bei q0 **„Männlich"** wählen, durchklicken.
**Expected:** Die Frage „In welcher Lebensphase befindest du dich gerade?" (q12) **erscheint nicht**; ebenso nicht q13. Fortschrittszähler springt nicht ins Leere (q12/q13 werden auch nicht mitgezählt).

- [ ] **Step 4: Browser-Check — weiblich zeigt Block E**

Quiz neu starten, bei q0 **„Weiblich"** wählen.
**Expected:** q12 erscheint; bei q12 = „Regelmäßiger Zyklus"/„Unregelmäßiger Zyklus" erscheint zusätzlich q13. Block-Überschrift/Kategorie zeigt „Zyklus & Hormone".

- [ ] **Step 5: Browser-Check — „Keine Angabe" zeigt Block E**

Quiz neu starten, bei q0 **„Keine Angabe"** wählen.
**Expected:** q12 erscheint (wie bei weiblich). (Offener Punkt §10: ob „Keine Angabe" gezeigt wird — aktuell ja; mit Leo final bestätigen.)

- [ ] **Step 6: Regressions-Check — Auswertung unbeeinflusst**

Quiz mit weiblich + mehreren Symptomen + Familie Schilddrüse durchspielen bis zum Ergebnis.
**Expected:** Ergebnisseite rendert wie zuvor (Band + ggf. Autoimmun-Block + Produkt). `q0` taucht in keiner Scoring-/Produkt-Begründung auf (kein Score, keine Regel referenziert q0).

---

## PHASE 1 — Migration `content.js` → `content.json`

### Task 1.1: `content.json` aus `content.js` erzeugen (Infinity → null)

**Files:**
- Create: `app/content.json`
- Read: `app/content.js`

**Interfaces:**
- Produces: `app/content.json` mit identischer Struktur wie `window.QUIZ_CONTENT`, als reines JSON. Einzige Wert-Änderung: Temperatur-Band `{ "below": Infinity }` → `{ "below": null }`.

- [ ] **Step 1: JSON aus dem Content-Objekt ableiten**

Das Objekt aus `app/content.js` (alles nach `window.QUIZ_CONTENT =` bis zum abschließenden `};`) nach `app/content.json` übertragen, als gültiges JSON:
- Führende `window.QUIZ_CONTENT =` und Kommentare entfernen.
- Alle Keys in `"..."` setzen; trailing commas entfernen; einfache → doppelte Anführungszeichen.
- **`q18.bands`**: `[ { below: 36.5 }, { below: Infinity } ]` → `[ { "below": 36.5 }, { "below": null } ]`.
- Inhalt (inkl. `q0` aus Phase 0) bleibt **wertgleich**, nichts erfinden/auslassen.

- [ ] **Step 2: JSON-Validität prüfen (Node)**

Run: `cd "app" && node -e "const c=require('./content.json'); console.log('flow:', c.flow.length, 'q18 last band below:', c.flow.find(q=>q.id==='q18').bands.slice(-1)[0].below)"`
Expected: `flow: 19 q18 last band below: null` (18 Original-Fragen + `q0`).

- [ ] **Step 3: Vollständigkeits-Check gegen content.js (Node)**

Run: `cd "app" && node -e "global.window={}; require('./content.js'); const a=JSON.stringify(Object.keys(window.QUIZ_CONTENT).sort()); const b=JSON.stringify(Object.keys(require('./content.json')).sort()); console.log(a===b ? 'TOP-LEVEL-KEYS OK' : 'MISMATCH:\n'+a+'\n'+b)"`
Expected: `TOP-LEVEL-KEYS OK` (gleiche Top-Level-Schlüssel: meta, intro, flow, email, analysis, outcomes, products, result).

---

### Task 1.2: Engine auf async-Boot + Loader umstellen

**Files:**
- Modify: `app/app.js` (Kopf um `const C`/`FLOW`/`MAX_QUESTIONS` herum + Boot-Aufruf am Dateiende)

**Interfaces:**
- Consumes: `app/content.json` (Task 1.1), optional `localStorage["quizContentOverride"]`.
- Produces: `async function boot()` lädt Content, setzt `C`/`FLOW`/`MAX_QUESTIONS`, ruft `render()`. Loader-Funktion `loadContent()` → liefert Content-Objekt oder `null`.

**Hintergrund:** Heute (app.js:17) `const C = window.QUIZ_CONTENT;`, (app.js:50) `const FLOW = [...]`, (app.js:53) `const MAX_QUESTIONS = ...` werden **synchron beim Modul-Start** ausgewertet. Diese müssen zu `let` werden und erst nach dem Laden gesetzt werden. Alle übrigen Funktionen referenzieren `C`/`FLOW` als Closure und werden erst nach `boot()` aufgerufen — sie bleiben unverändert.

- [ ] **Step 1: Kopf umbauen (`const C` → Loader + `let`)**

In `app/app.js` ersetzen. Vorher (app.js:17–18):

```javascript
  const C = window.QUIZ_CONTENT;
  if (!C) { document.getElementById("app").textContent = "Inhalte (content.js) konnten nicht geladen werden."; return; }
```

Nachher:

```javascript
  let C;  // wird in boot() gesetzt (async aus content.json + optionalem localStorage-Override)

  // Content laden: localStorage-Override (Editor-Vorschau) > content.json. Liefert Objekt oder null.
  async function loadContent() {
    try {
      const raw = localStorage.getItem("quizContentOverride");
      if (raw) return JSON.parse(raw);
    } catch (e) { /* defekter Override → ignorieren, content.json nutzen */ }
    try {
      const res = await fetch("content.json", { cache: "no-store" });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) { return null; }
  }
```

- [ ] **Step 2: `FLOW`/`MAX_QUESTIONS` von `const` auf `let` (noch ohne Wert)**

In `app/app.js` ersetzen. Vorher (app.js:50–53):

```javascript
  const FLOW = [{ type: "intro" }, ...C.flow, { type: "email" }, { type: "analysis" }, { type: "result" }];
  const QUESTION_TYPES = new Set(["single", "multi", "number"]);
  // Obergrenze (alle Fragen, ohne Skip) — nur für die Intro-Schätzung.
  const MAX_QUESTIONS = FLOW.filter((s) => QUESTION_TYPES.has(s.type)).length;
```

Nachher:

```javascript
  let FLOW, MAX_QUESTIONS;
  const QUESTION_TYPES = new Set(["single", "multi", "number"]);
  // FLOW/MAX_QUESTIONS werden in boot() gesetzt, sobald C geladen ist.
```

- [ ] **Step 3: Boot-Funktion am Dateiende ergänzen / `render()`-Aufruf ersetzen**

Den heutigen initialen `render()`-Aufruf am Dateiende suchen. Run zum Finden:
`cd "app" && grep -n "render();" app.js | tail -5`
Den **letzten, modul-initialen** `render();`-Aufruf (außerhalb von Event-Handlern, ganz unten vor `})();`) ersetzen durch:

```javascript
  async function boot() {
    C = await loadContent();
    if (!C) { document.getElementById("app").textContent = "Inhalte (content.json) konnten nicht geladen werden. Bitte über einen lokalen Server öffnen (python3 -m http.server)."; return; }
    FLOW = [{ type: "intro" }, ...C.flow, { type: "email" }, { type: "analysis" }, { type: "result" }];
    MAX_QUESTIONS = FLOW.filter((s) => QUESTION_TYPES.has(s.type)).length;
    render();
  }
  boot();
```

(Falls der initiale Aufruf nicht exakt `render();` heißt, die initiale Render-Zeile entsprechend ersetzen; Event-Handler-`render()`-Aufrufe **nicht** anfassen.)

- [ ] **Step 4: `Infinity`-Band-Handling in `bandIndex`**

Run zum Finden: `cd "app" && grep -n "below" app.js`
Die `bandIndex`-Schleife (app.js ~165–166) behandelt `below`. Vorher:

```javascript
    for (let i = 0; i < s.bands.length; i++) if (v < s.bands[i].below) return i;
```

Nachher (`below: null` = nach oben offen):

```javascript
    for (let i = 0; i < s.bands.length; i++) { const b = s.bands[i].below; if (b == null || v < b) return i; }
```

- [ ] **Step 5: Syntax-Check (Node)**

Run: `cd "app" && node --check app.js`
Expected: kein Output (Syntax OK).

---

### Task 1.3: `index.html` — `content.js`-Script entfernen

**Files:**
- Modify: `app/index.html:30`

**Interfaces:**
- Consumes: `app.js` lädt jetzt selbst `content.json` (Task 1.2).

- [ ] **Step 1: `content.js`-Script-Tag entfernen**

In `app/index.html` die Zeile entfernen:

```html
  <script src="content.js?v=5" defer></script>
```

`app.js`-Script-Tag bleibt. (Kommentar darüber ggf. anpassen: Inhalte werden jetzt von `app.js` aus `content.json` geladen.)

- [ ] **Step 2: Browser-Check — Quiz lädt aus content.json**

Server neu (falls nötig), Browser-Hard-Reload (Cache leeren) auf `http://localhost:8765`.
**Expected:** Quiz lädt normal, Intro + q0 + restlicher Flow funktionieren. In DevTools → Network ist ein erfolgreicher Request auf `content.json` zu sehen, **kein** `content.js`-Request.

- [ ] **Step 3: Regressions-Walkthrough — komplettes Quiz**

Komplettes Quiz durchspielen (weiblich, mehrere Symptome, Dauer > 1 Jahr, Familie Schilddrüse, Hals-Schwellung, Temperatur 36,2).
**Expected:** Ergebnis = Band A, Autoimmun-Block sichtbar, ein Produkt empfohlen. Temperatur-Hinweis („eher niedrig") erscheint → bestätigt, dass `below: null`-Band korrekt greift. Identisch zum Verhalten vor der Migration.

- [ ] **Step 4: Override-Smoke-Test (Vorbereitung Editor-Phase)**

In der Browser-Konsole auf der Quiz-Seite:
`localStorage.setItem("quizContentOverride", JSON.stringify({...(await (await fetch("content.json")).json()), intro:{...(await (await fetch("content.json")).json()).intro, title:"OVERRIDE-TEST"}}))` dann Reload.
**Expected:** Intro-Titel zeigt „OVERRIDE-TEST" → localStorage-Override greift. Danach `localStorage.removeItem("quizContentOverride")` + Reload → Original-Titel zurück.

---

### Task 1.4: Aufräumen & Doku

**Files:**
- Modify: `TODO.md`
- Optional: `app/content.js` (Kopf-Kommentar: „nicht mehr Engine-Input; Quelle ist content.json")

- [ ] **Step 1: `content.js` als Nicht-Engine-Input kennzeichnen**

Oben in `app/content.js` einen Hinweis ergänzen, dass die Datei **nicht mehr** von der Engine geladen wird (Quelle = `content.json`), und sie als Referenz/Altstand verbleibt (oder in Folge-Cleanup gelöscht wird — nicht in diesem Plan).

- [ ] **Step 2: TODO.md aktualisieren**

In `TODO.md` vermerken: Geschlechts-Frage (q0) + Zyklus-Gating umgesetzt (§9.7 Eva teilweise), Content-Migration auf `content.json` erfolgt; Editor (Phasen 2–4) = eigener Plan offen. Offene §10-Punkte (q0-Wortlaut, „Keine Angabe"-Verhalten, Label) als „von Leo zu bestätigen" eintragen.

- [ ] **Step 3: Abschluss-Check**

Run: `cd "app" && node --check app.js && node -e "require('./content.json'); console.log('content.json valid')"`
Expected: `content.json valid`, keine Syntaxfehler.

---

## Self-Review (gegen Spec)

- **Spec §6 (Geschlechts-Frage):** Task 0.1/0.2 ✓ (q0, Gating, Label, kein „divers", kein Scoring).
- **Spec §1 (Architektur B):** Task 1.1–1.3 ✓ (content.json, async-Boot, fetch, localStorage-Override, Infinity→null).
- **Spec §4 (localStorage-Override):** Task 1.2 Loader + Task 1.3 Step 4 Smoke-Test ✓.
- **Spec §1 (/content/*.md bleiben Referenz):** unberührt ✓.
- **Editor-Panels (§3), Validierung (§7), Export (§5):** bewusst **nicht** in diesem Plan — eigener Editor-Plan (Phasen 2–4). ✓ Scope-Schnitt dokumentiert.
- **Placeholder-Scan:** keine „TBD/TODO" in Steps; Code vollständig gezeigt. ✓
- **Verifikation ohne Test-Framework:** Node-Checks + konkrete Browser-Walkthroughs mit erwarteten Ergebnissen. ✓
- **Offene §10-Punkte** (q0-Wortlaut, „Keine Angabe", Label) als „von Leo zu bestätigen" in Task 1.4 verankert. ✓
