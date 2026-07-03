# outcomes.md — Auswertungs-Logik (Scoring, Bänder, Flags, Produkt-Auswahl)

> **Status: Implementierungs-Entwurf nach Master-Spec §4.** Wird 1:1 nach
> `app/content.js → outcomes` übertragen. Schwellen sind **Richtwerte** (§4/§9.1) und
> **leicht kalibrierbar**. Medizinische Logik vor Livegang fachlich gegenlesen.
>
> Dieses File ist zugleich das **Entscheidungs-/Kalibrier-Log** des Scorings.

---

## 0) Modell

Ein **einziger Gesamt-Score** (Summe aller Signale) → **Band A/B/C** (§4), nicht
konkurrierende Outcomes. Dazu ein **Autoimmun-Flag** (ergänzender Hinweisblock) und die
**Produkt-Auswahl**. Frage-/Options-IDs siehe `questions.md` / `app/content.js → flow`.

`outcomes.model: "severity"` schaltet die Engine in diesen Modus (ohne `bands` läuft die
alte konkurrierende Logik — abwärtskompatibel).

---

## 1) Signal-Mapping (`outcomes.signalRules`)

Schlüssel = Antwort-Identität (`<qid>.<index>` single · `<qid>.<key>` multi ·
`<qid>.band:<i>` number), Wert = `{ score, flags? }`.

```
// ── Symptome F3–F6: je gewähltes Symptom +1 (kein Cap) ──
"q3.muede": {score:1}, "q3.gewicht": {score:1}, "q3.frieren": {score:1}, "q3.antrieb": {score:1},
"q4.haut":  {score:1}, "q4.haare":   {score:1}, "q4.naegel":  {score:1}, "q4.rillen": {score:1}, "q4.brauen": {score:1}, "q4.gesicht": {score:1},
"q5.fog":   {score:1}, "q5.down":    {score:1}, "q5.unruhe":  {score:1}, "q5.schlaf":  {score:1},
"q6.verstopfung": {score:1}, "q6.schmerzen": {score:1}, "q6.schwaeche": {score:1}, "q6.wasser": {score:1},

// ── Verlauf & Dauer ──
"q7.1": {score:1},   // 3–12 Monate
"q7.2": {score:2},   // länger als 1 Jahr
"q8.0": {score:1},   // werden mehr

// ── Frauengesundheit ──
"q13.stark": {score:1},   // stärkere/längere Blutungen

// ── Risikofaktoren (setzen zusätzlich das Autoimmun-Flag) ──
"q14.0": {score:2, flags:["autoimmune"]},   // Schilddrüse in Familie
"q14.1": {score:1, flags:["autoimmune"]},   // andere Autoimmunerkrankung in Familie
"q15.0": {score:2, flags:["autoimmune"]},   // eigene Autoimmunerkrankung

// ── Hals-/Kehl-Zeichen: Kategorie +2 (Cap, s. §2) ──
"q16.schwellung": {score:2}, "q16.kloss": {score:2}, "q16.heiser": {score:2},

// ── Selbstmessung (weich) ──
"q18.band:0": {score:1},     // Temperatur niedrig (<36,8 °C)

// ── Flag-only (kein Score) ──
"q12.3": {flags:["autoimmune"]},   // Geburt vor < 12 Monaten (postpartal)
```

**Nicht im Scoring** (nur Personalisierung/Ton, §4): F1, F2, F9, F10, F11, F12 (außer
postpartal-Flag), F17. F2 steuert Wording + Produkt-Eignung, **kein** Score.

---

## 2) Per-Frage-Cap (`outcomes.caps`)

```
caps: { q16: 2 }
```
Hals-/Kehl-Zeichen zählen als **eine** Kategorie (max +2), nicht +2 je Zeichen. §4 nennt
F16 als einzelnen „+2"-Faktor; ohne Cap könnte eine Multi-Frage allein ein A erzwingen.
Symptomfragen F3–F6 haben **keinen** Cap (§4: „+1 je Symptom").

---

## 3) Bänder (`outcomes.bands`) — Richtwerte §4

```
bands: [
  { id: "A", min: 8 },   // Deutliche Hinweise
  { id: "B", min: 4 },   // Mögliche Hinweise   (4–7)
  { id: "C", min: 0 },   // Wenig Hinweise      (<4, inkl. 0)
]
```
Erste Regel, deren `min ≤ total`, gewinnt. **TODO/Leo (§9.1):** Schwellen 8 / 4 mit echten
Personas kalibrieren.

### Band-Overrides (`outcomes.bandOverrides`) — NEU 2026-07-03 (Leo)
Ärztlicher Befund schlägt Score — das Quiz widerspricht keinem Arzt. Nach der
Score-Band-Berechnung geprüft, erster Treffer gewinnt:
```
bandOverrides: [
  { when: { q:"q2",  is:2 }, band:"A" },   // Schilddrüsenerkrankung diagnostiziert
  { when: { q:"q17", is:1 }, band:"A" },   // Werte in den letzten 12 Monaten auffällig
]
```
„Ja, auffällig" (q17) gilt dabei **nicht** als Diagnose → Jod-Sicherung (§5,
`coreProductIds` nur bei F2 = „Ja") bleibt unberührt.

---

## 4) Autoimmun-Flag & -Block

- **Flag** gesetzt, wenn eine Flag-Quelle feuert: F14 (Schilddrüse/Autoimmun in Familie),
  F15 (eigene Autoimmun), F12 (Geburt < 12 Mon).
- **Block** (Autoimmun-Hinweis, TPO-AK) wird **zusätzlich** bei **A oder B** gerendert,
  wenn Flag gesetzt. Bei **C nicht** (§5). Text in `results-copy.md` → `outcomes.autoimmuneBlock`.
- Welcher Risikofaktor genannt wird, steuert `outcomes.autoimmuneFactors` (Token
  `{{autoimmuneFactor}}`, erster Treffer):
```
autoimmuneFactors: [
  { when:{q:"q15", is:0}, phrase:"eine eigene Autoimmunerkrankung" },
  { when:{q:"q14", is:0}, phrase:"eine Schilddrüsenerkrankung in deiner Familie" },
  { when:{q:"q14", is:1}, phrase:"eine Autoimmunerkrankung in deiner Familie" },
  { when:{q:"q12", is:3}, phrase:"eine Geburt in den letzten 12 Monaten" },
]
```

---

## 5) Produkt-Auswahl (`outcomes.productRules` + `coreProductIds`)

Details + Claims in `products.md`. Logik:
- **Bei Band C: kein Produkt** (Engine erzwingt).
- **Erste passende Regel gewinnt** (Reihenfolge = provisorisches Produkt-Scoring, §9.2).
- **Harte Jod-Sicherung:** `coreProductIds` werden nur bei **F2 = „Ja"** (diagnostiziert)
  gezeigt — doppelt gesichert (Regel-Bedingung **und** Engine-Gate).
- Produkte mit Status `pending` (unbestätigter EFSA-Claim) werden **übersprungen**.
- Jede Regel trägt eine `reason` — die personalisierte „warum passt das zu dir"-Begründung,
  die im Produktblock über den Claims erscheint (bezieht sich auf den Auswahlgrund, **kein**
  Heilversprechen; die zugelassene Wirkung steht separat in `products[id].claims`).
- **`reason` ist ein rich-Text-Array** `[{text, when?}]` (Design 2026-07-01) → 2–4 Sätze,
  bedingt/modular, gerendert über `rich()`. Aufbau: *warum ausgewählt (aus deinen Antworten)*
  → *wie es zu deiner Situation passt* → sanfter „kein Muss"-Rahmen. **Modularitäts-Regel**
  (results-copy.md) gilt: kein Segment verweist auf ein nachfolgendes; Claims werden **nicht**
  in der `reason` wiederholt (sie stehen in `claims`). Tokens (`{{autoimmuneFactor}}`) erlaubt.

```
coreProductIds: ["heldenduo"],   // Jod-haltig → nur diagnostiziert.
// Umwandler von der Core-Liste genommen (Leo, 2026-07-03): Cholin + Selen, kein Jod
// → als Zweit-Empfehlung auch ohne Diagnose zulässig. [TODO Leo: Etikett bestätigen]
// Produzent von der Core-Liste genommen (Leo, 2026-07-03): wird bei Band A auch ohne
// Diagnose empfohlen (Regel unten). Ausnahme: q17 = „Ja, auffällig" (unklar ob Über-/
// Unterfunktion → kein Jod vor ärztlicher Klärung). ⚠️ HWG-Check vor Livegang!

productRules: [
  { productId: "umwandler",   when: { q:"q2", is:2 } },                               // Bestseller-Default bei Diagnose (+ produzent als Zweit-Empfehlung)
  { productId: "magenfreund", when: { q:"q6", has:"verstopfung" } },                 // Verdauung
  { productId: "immungold",   when: { flag:"autoimmune" },                            // Immun (kein Jod) — nur noch Nicht-Diagnostizierte
    also: [{ productId:"umwandler" }] },                                              // + Umwandler ergänzend (Leo, 2026-07-03)
  { productId: "produzent",   when: { allOf: [{ outcomeIn:["A"] }, { not: { q:"q17", is:1 } }] } },  // Band A ohne Diagnose (Leo, 2026-07-03)
  { productId: "kollagen",    when: { q:"q4", hasAny:["haut","haare","naegel","rillen","brauen","gesicht"] } }, // pending
  { productId: "aminos",      when: { q:"q3", hasAny:["muede","antrieb"] } },         // pending
]
```

> **Entscheidung Leo (2026-07-03):** Diagnose-Regel an Position 1 — Diagnostizierte
> bekamen wegen „erster Treffer gewinnt" zu oft Immungold (Autoimmun-Flag feuert
> schon bei Familien-Fällen). Jetzt: diagnostiziert → immer Umwandler + Produzent.
Kein Treffer → **kein** Produktblock (nur Action-Points) — North-Star-konform.

> **Entscheidung Leo (2026-07-01):** Diagnostiziert → Default ist **`umwandler`** (Bestseller).
> `produzent` und `heldenduo` bleiben in der Registry, werden aber **nicht** auto-empfohlen.
> Offen (§9.2): ggf. Frage „Produktion vs. Umwandlung" zur weiteren Differenzierung;
> Jod-/Selen-Eigeneinnahme-Frage (§6) noch nicht abgefragt → keine Gegen-Regel implementiert.

---

## 6) Outcome-Liste (`outcomes.list`)

Drei Bänder; `copy`-Blöcke (a–e) stehen in `results-copy.md`.
```
{ id:"A", copy:{…} }   // Deutliche Hinweise
{ id:"B", copy:{…} }   // Mögliche Hinweise
{ id:"C", copy:{…} }   // Wenig Hinweise (kein Produkt, kein Autoimmun-Block)
```

## 7) Prioritisierung
Im Severity-Modell **keine** sekundären Outcomes (das Spec-Modell kennt nur A/B/C +
Autoimmun-Block). `prioritization` bleibt für Abwärtskompatibilität, wird hier nicht genutzt.

---

## Offene Punkte (Leo / Compliance)
- [ ] §9.1 Schwellen 8 / 4 kalibrieren (Personas).
- [ ] §9.2 Produkt-Scoring final (Reihenfolge + Jod-Eigeneinnahme-Regel).
- [x] §9.3 Temperatur-Schwelle final: **36,8 °C** (Engine `band:0` = < 36,8). Entscheidung Leo, 2026-07-01.
- [ ] Fachliche Freigabe der Signal-Gewichte (HWG/EFSA-neutral, da reine Einordnung).
