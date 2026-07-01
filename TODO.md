# TODO — miavola Schilddrüsen-Quiz

Status-Legende: ✅ fertig · 🟡 in Arbeit / Entwurf · ⛔ blockiert · ⬜ offen

## 🚩 Content-Gate — GELÖST (Entwurf, vor Livegang Compliance-Freigabe)
Die Master-Spec (§3–§6) wurde geliefert und in die Content-Dateien transkribiert.
Die Engine rendert jetzt echte Ergebnisse (keine TODO-Seite mehr).
- ✅ **`content/outcomes.md`** — Scoring (Severity-Bänder A/B/C), Signal-Mapping, Caps,
  Autoimmun-Flag, Produkt-Auswahlregeln.
- ✅ **`content/results-copy.md`** — Ergebnistexte A/B/C + Autoimmun-Block, personalisiert.
- ✅ **`content/products.md`** — Inventar, Eignungsregeln (Jod-Sicherung), EFSA-Claims (Entwurf).
- ✅ **`content/questions.md`** — 18 Fragen (Block A–G) dokumentiert.

## Build-Stand
1. ✅ Engine: Flow, State, Navigation, Fortschritt, Antwort-Typen, Skip-/Anzeige-Logik
2. ✅ **Scoring** — Severity-Modell: ein Gesamt-Score → Band A/B/C (`≥8`/`4–7`/`<4`),
   per-Frage-Cap (q16=2), Autoimmun-Flag. (`app.js → evaluate()`, `outcomes.signalRules`)
3. ✅ **Ergebnisseiten** — a) Validierung → b) Mechanismus → c) Action-Points →
   (Autoimmun-Block bei A/B mit Flag) → d) Produkt → e) Empowerment.
   Personalisierung über `when`-Prädikate + Tokens `{{symptoms}}`/`{{autoimmuneFactor}}`.
4. ✅ **Produktempfehlungen** — deklarative `productRules`, harte Jod-Sicherung
   (Core-Produkte nur bei Diagnose F2=Ja), `pending` (unbestätigte Claims) ausgeblendet,
   bei Band C kein Produkt. **Personalisierte „Warum das zu dir passt"-Begründung** je Produkt.
5. ✅ **Bug #1** (Ergebnis-Bilder): nur existierende Assets referenziert + `onerror`-Fallback.
6. ✅ **Bug #2** (falsches Produkt): kein hartcodiertes Produkt — Auswahl rein logik-/diagnose-gesteuert.
7. ✅ Adversariales Review (Schema/Syntax · Scoring-Mathematik · HWG/EFSA · Personalisierung/
   Integration · No-Hallucination) — **0 Findings**, 5 Test-Personas korrekt.

## ✅ Stand 2026-07-01 — Fundament (Geschlechts-Frage + JSON-Migration)
Umgesetzt nach `docs/superpowers/specs/2026-06-30-quiz-backend-editor-design.md`
(Plan: `docs/superpowers/plans/2026-06-30-fundament-geschlechtsfrage-und-json-migration.md`):
- ✅ **Geschlechts-Frage `q0`** (Weiblich/Männlich/Keine Angabe, kein Scoring) als erste Frage.
  Block E („Zyklus & Hormone", vorher „Frauengesundheit") nur bei `q0 ∈ {weiblich, keine Angabe}`.
  → deckt Evas Punkt (§9.7) teilweise ab.
- ✅ **Content-Migration**: Engine lädt async aus `app/content.json` (statt `content.js`);
  `content.js` bleibt nur noch kommentierte Referenz. `Infinity`-Band → `null`.
  localStorage-Override (`quizContentOverride`) als Hook für die Editor-Vorschau.

## ⬜ Nächstes Subsystem — Visuelles Editor-Backend (Phasen 2–4)
Eigener Plan noch zu schreiben. Spec §3/§5/§7: 4 Panels (Fragen · Scoring · Produkte ·
Ergebnistexte mit Bedingungs-Builder) + Live-Vorschau + Export `content.json` + Validierung.

## ⛔ Vor Livegang — nur Leo / Compliance (meta.placeholder bleibt true bis dahin)
- ⬜ **§9.6 Finaler HWG/EFSA-Check** aller Ergebnis- & Produkttexte. Danach
  `content.js → meta.placeholder = false`.
- ⬜ **§9.5 EFSA-Claims** im exakten Register-Wortlaut bestätigen. **Kollagen-MCT & Aminosäuren**
  haben noch *keinen* bestätigten Claim → bleiben `pending` (werden nicht gezeigt), bis geliefert.
- ⬜ **§9.1 Schwellen** 8 / 4 mit echten Personas kalibrieren (`outcomes.bands`).
- ⬜ **§9.2 Produkt-Scoring** final: Produzent vs. Umwandler vs. Heldenduo bei Diagnose
  (+ ggf. Frage „Produktion vs. Umwandlung"); Jod-/Selen-Eigeneinnahme-Gegenregel.
- ⬜ **§9.3 Temperatur-Schwelle** 36,5 vs. 36,8 °C final (aktuell `band:0` = <36,5).
- ⬜ **§9.7 Evas Review** zu Fragen + Ergebnisseiten einarbeiten.

## Offene technische Punkte (nicht blockierend)
- ⬜ **E-Mail-Backend**: `app.js → renderEmail()`/`renderCta()` haben `TODO(Backend)`-Hooks
  (an CRM/Newsletter, z. B. Klaviyo, anbinden). Aktuell nur State.
- ⬜ **Produktlinks** (miavola.de) in `content.js → products[id].link` bestätigen.
- 🟡 **Produkt-Key-Visuals** (Stand 2026-07-01): echte PDP-Visuals eingebunden als `.webp`
  (`produzent-hero.webp` [neu], `umwandler-hero.webp`, `immungold-hero.webp`,
  `kollagen-hero.webp`, `aminos-hero.webp`); Produktkarte zeigt sie als volles Banner
  (kein `multiply`-Thumbnail mehr). **Fehlt noch: `magenfreund-hero.webp`** (kein reales
  Foto geliefert) → Magenfreund läuft bis dahin ohne Bild (Engine-Fallback greift).
- ⬜ **Immungold®** (in §6 eingeführt): Katalog/Bild bestätigen (nicht im gefundenen Katalog).
- ⬜ **Wissens-Einschübe** (nach F12/F14/F17) im Flow platzieren (Engine kann `education`-Screens).

## Von Leo zu bestätigen (Spec-Treue / Wording)
- [ ] **F0 / q0** Wortlaut Frage + Hinweistext („Welches biologische Geschlecht hast du?") ok?
- [ ] **q0 „Keine Angabe"** — Zyklus-Block zeigen (aktuell: ja) oder überspringen?
- [ ] **Block-Label** „Zyklus & Hormone" final ok (vorher „Frauengesundheit")?
- [ ] **F4** „Nichts davon" behalten (in §3 nicht gelistet)?
- [ ] **F9 / F15** Fragetexte (rekonstruiert) bestätigen.
- [ ] **F3–F6** Fragesätze (aus Themen-Labels ausformuliert) — Wording ok?
- [ ] **§9.4** F13 auch bei Kinderwunsch (F12=2) zeigen?
- [ ] Ergebnis-Titel je Band („Deutliche/Mögliche/Wenig Hinweise") bestätigen.
