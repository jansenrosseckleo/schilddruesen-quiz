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

## ✅ Stand 2026-07-01 — Info-Cards · individuellere Ergebnisseiten · Produkt-Begründung · Frage-Info
Umgesetzt nach `docs/superpowers/specs/2026-07-01-infocards-ergebnisseiten-produkt-design.md`.
Adversariales Multi-Agent-Review (26 Roh-Funde → 12 „minor" → alle behoben; 0 Blocker/HWG).
- ✅ **Info-Cards** (`type:"education", variant:"info"`, Grafik oben + Text) nach **F12**
  (`eduHormone`, nur weiblich/keine Angabe), **F15** (`eduHashimoto`), **F17** (`eduTsh`).
  Quelle `content/education.md`. Reine Vorwärts-Einschübe (bei Zurück übersprungen, keine
  Sackgasse); zählen nicht im Fortschritt.
- ✅ **Ergebnisseiten individueller**: neue bedingte **Insights-Sektion** (c) „Was deine
  Angaben im Einzelnen zeigen"; mehr `when`-Segmente; **Modularität** verifiziert (kein Block
  verweist auf einen weglassbaren Folgeblock; Personas P1–P7 gelesen). **Hero-Bild je Band**
  (`heroImage`, `onerror`-Fallback).
- ✅ **Produkt-Begründung** `reason` = rich-Text-Array (mehrsätzig, modular, HWG-neutral;
  keine Claim-/Disclaimer-Doppelung).
- ✅ **Inline-Frage-Erklärung** `info` (ausklappbar „ⓘ Was ist gemeint?") bei F5/F14/F15/F16/F17.
- ✅ **Inline-Symptomliste** sauber (`inlineLabel` für „Konkret: …").
- ✅ **Deliverable-Docs** für Leo: `content/graphics-spec.md` (Grafik-Steckbriefe + Produktbild-
  Liste) · `content/image-prompts.md` (Image-Gen-2.0-Prompts der 3 Band-Hero-Fotos).

## ✅ Stand 2026-07-03 — Finale Anpassungen (Logik · Klaviyo · E-Mail-Screen)
Umgesetzt nach `docs/superpowers/specs/2026-07-03-finale-anpassungen-design.md`:
- ✅ **q17 neue Antwort „Ja, auffällig"** (Index 1).
- ✅ **`outcomes.bandOverrides`** (neue Engine-Fähigkeit): Diagnose (q2=Ja) oder
  auffällige Werte (q17=1) → **immer Band A** — das Quiz widerspricht keinem Arzt.
- ✅ **Produktregeln umsortiert**: Diagnose-Regel (Umwandler + Produzent) vor Immungold —
  Diagnostizierte bekamen vorher zu oft Immungold (Autoimmun-Flag feuert breit).
- ✅ **q4 + „Längsrillen in den Fingernägeln" + „Ausdünnen der Augenbrauen (außen)"**
  (je +1, in Kollagen-Regel + Insights aufgenommen).
- ✅ **q15-Info + Hashimoto**; **neue Info-Card nach F7** (`eduSchaltzentrale`).
- ✅ **Klaviyo-Opt-in** (client-seitig): E-Mail + Häkchen → Subscribe Liste `UEPkJi`
  („Schilddrüsen-Quiz Leads (neu)", Double-Opt-in) mit `quiz_band`/`quiz_produkt`/
  `quiz_autoimmun` als Profil-Properties. Config: `content → meta.klaviyo`. Fire-and-forget.
- ✅ **E-Mail-Screen**: Skip-Link raus — ein Button, Feld leer → direkt weiter.
- ✅ **„Ergebnis per Mail sichern"-Button entfernt** (Ergebnis-Mail = späteres Paket:
  Klaviyo-Event „Quiz abgeschlossen" + Flow + Template).
- ✅ **Entwurf-Ribbon aus** (`meta.placeholder=false`) — HWG/EFSA-Freigabe bleibt unten offen!

### ⬜ Von Leo zu liefern (Assets für diese Features)
- ⬜ **4 Info-Card-Grafiken** (Image Gen 2.0, Prompts von Claude geliefert 2026-07-03):
  `edu-hormone.png` · `edu-hashimoto.png` · `edu-tsh.png` · `edu-schaltzentrale.png`
  → `app/assets/` (Steckbriefe: `content/graphics-spec.md`).
- ⬜ **3 Band-Hero-Fotos** (Image Gen 2.0): `result-hero-a.jpg` · `-b.jpg` · `-c.jpg`
  (Prompts: `content/image-prompts.md`).
- ⬜ **`magenfreund-hero.*`** (einziges sichtbares Produkt ohne Bild) → danach `image`-Feld setzen.
- ⬜ **HWG-Gegenlesen** der neuen Texte (Info-Cards, Insights, Produkt-`reason`, Frage-`info`).

## ⬜ Nächstes Subsystem — Visuelles Editor-Backend (Phasen 2–4)
Eigener Plan noch zu schreiben. Spec §3/§5/§7: 4 Panels (Fragen · Scoring · Produkte ·
Ergebnistexte mit Bedingungs-Builder) + Live-Vorschau + Export `content.json` + Validierung.

## ⛔ Vor Livegang — nur Leo / Compliance
**Achtung:** Der Entwurf-Ribbon ist seit 2026-07-03 auf Leos Wunsch **aus**
(`meta.placeholder=false`) — die Freigabe selbst steht aber noch aus:
- ⬜ **§9.6 Finaler HWG/EFSA-Check** aller Ergebnis- & Produkttexte
  (inkl. neuer Texte: eduSchaltzentrale-Card, q4-Ergänzungen).
- ⬜ **§9.5 EFSA-Claims** im exakten Register-Wortlaut bestätigen. **Kollagen-MCT & Aminosäuren**
  haben noch *keinen* bestätigten Claim → bleiben `pending` (werden nicht gezeigt), bis geliefert.
- ⬜ **§9.1 Schwellen** 8 / 4 mit echten Personas kalibrieren (`outcomes.bands`).
- ⬜ **§9.2 Produkt-Scoring** final: Produzent vs. Umwandler vs. Heldenduo bei Diagnose
  (+ ggf. Frage „Produktion vs. Umwandlung"); Jod-/Selen-Eigeneinnahme-Gegenregel.
- ⬜ **§9.3 Temperatur-Schwelle** 36,5 vs. 36,8 °C final (aktuell `band:0` = <36,5).
- ⬜ **Umwandler-Etikett bestätigen** (2026-07-03): von der Jod-Core-Liste genommen
  (Cholin + Selen laut products.md, kein Jod) und als Zweit-Empfehlung zu Immungold
  auch ohne Diagnose freigegeben. Falls doch Jod enthalten → zurück in `coreProductIds`!
- ⬜ **⚠️ Produzent ohne Diagnose (Leo, 2026-07-03) HWG-prüfen:** Der Produzent (enthält
  Jod!) wird jetzt bei Band A auch ohne Diagnose empfohlen (Leos ausdrückliche
  Entscheidung). Eingebaute Ausnahme: bei q17 = „Ja, auffällig" (Befund unklar, könnte
  Überfunktion sein) wird KEIN Jod-Produkt gezeigt. Bitte mit Compliance gegenprüfen.
- ⬜ **§9.7 Evas Review** zu Fragen + Ergebnisseiten einarbeiten.

## Offene technische Punkte (nicht blockierend)
- ✅ **E-Mail-Backend (Opt-in)**: Klaviyo-Subscribe angebunden (s. Stand 2026-07-03).
- ⬜ **Ergebnis-Mail** (Audit 2026-07-06, Ultracode-Workflow, alle Befunde gegengeprüft):
  Quiz-Seite ist fertig (E-Mail-Screen ✅, Subscribe an Liste `UEPkJi` ✅, Properties
  `quiz_band`/`quiz_produkt`/`quiz_autoimmun` gehen mit ✅ — vom offiziellen API-Schema
  bestätigt, auch bei Double-Opt-in). Fehlt nur Klaviyo-Seite:
  1. DOI-Bestätigungsmail branden (Liste → Settings → Consent),
  2. **ein** Template mit Conditional Blocks (`person|lookup:'quiz_band' = 'A'` etc. —
     3 Band-Blöcke + Autoimmun-Block + Produktblöcke; Aufwand ~1–2 h),
  3. Flow mit Trigger „Added to list" (feuert bei DOI-Listen erst NACH Bestätigung —
     Properties sind dann am Profil), 4. End-to-End-Test.
  Produktbilder dafür in Klaviyo-Bildbibliothek hochladen (oder Live-URL nutzen).
- ⬜ **[BLOCKER · DSGVO] Datenschutz-Link fehlt im ganzen Quiz** (Audit 2026-07-06):
  E-Mail-Feld erhebt Marketing-Einwilligung ohne Verweis auf Datenschutzerklärung
  (Art. 13 DSGVO). Fix: Satz + Link bei der Opt-in-Checkbox → **URL von Leo nötig**.
- ⬜ **[BLOCKER · HWG] Mail-Betreffzeilen fehlen** — nicht in `content/*.md`, dürfen nicht
  erfunden werden → Vorschläge von Claude, Freigabe durch Leo/Compliance.
- ⬜ **Mail-Texte**: aus `results-copy.md` kürzen (validation + mech + 1–2 advice +
  Autoimmun-Block + Produktblock + legalDisclaimer) — keine neuen Aussagen; Freigabe Leo.
- ⬜ **UX-Edge-Case E-Mail-Screen**: Opt-in-Häkchen gesetzt + Feld leer → verpufft ohne
  Hinweis. Kleinen Hinweistext ergänzen.
- ⬜ **Klaviyo-API-Revision anheben**: `app.js` pinnt `2024-10-15` — seit 10/2025
  deprecated, **Retirement 15.10.2026** → auf `2026-04-15` (o. neuer) umstellen, sonst
  fällt das Opt-in ab Oktober still aus (fire-and-forget, nur console.warn).
- ⬜ **Opt-in-Label**: DOI-Hinweis ergänzen („…du bekommst gleich eine Bestätigungs-Mail")
  — sonst wundern sich Leute, warum nichts kommt.
- ✅ **Produktlinks** gegen den Shop verifiziert (2026-07-03, alle 200): 3 Slugs korrigiert
  (`der-magenfreund`, `das-heldenduo-30-tage-vorrat`, `essentielle-aminosauren`).
- 🟡 **Produkt-Key-Visuals** (Stand 2026-07-01): echte PDP-Visuals eingebunden als `.webp`
  (`produzent-hero.webp` [neu], `umwandler-hero.webp`, `immungold-hero.webp`,
  `kollagen-hero.webp`, `aminos-hero.webp`); Produktkarte zeigt sie als volles Banner
  (kein `multiply`-Thumbnail mehr). **Fehlt noch: `magenfreund-hero.webp`** (kein reales
  Foto geliefert) → Magenfreund läuft bis dahin ohne Bild (Engine-Fallback greift).
- ⬜ **Immungold®** (in §6 eingeführt): Katalog/Bild bestätigen (nicht im gefundenen Katalog).
- ✅ **Wissens-Einschübe** platziert (nach F12/F15/F17, `variant:"info"`) — s. Stand 2026-07-01.

## Von Leo zu bestätigen (Spec-Treue / Wording)
- [ ] **F0 / q0** Wortlaut Frage + Hinweistext („Welches biologische Geschlecht hast du?") ok?
- [ ] **q0 „Keine Angabe"** — Zyklus-Block zeigen (aktuell: ja) oder überspringen?
- [ ] **Block-Label** „Zyklus & Hormone" final ok (vorher „Frauengesundheit")?
- [ ] **F4** „Nichts davon" behalten (in §3 nicht gelistet)?
- [ ] **F9 / F15** Fragetexte (rekonstruiert) bestätigen.
- [ ] **F3–F6** Fragesätze (aus Themen-Labels ausformuliert) — Wording ok?
- [ ] **§9.4** F13 auch bei Kinderwunsch (F12=2) zeigen?
- [ ] Ergebnis-Titel je Band („Deutliche/Mögliche/Wenig Hinweise") bestätigen.
