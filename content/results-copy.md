# results-copy.md — Texte je Ergebnisseite (education-first)

> **Status: Entwurf nach Master-Spec §5.** Wird nach `app/content.js → outcomes.list[].copy`
> + `outcomes.autoimmuneBlock` übertragen. **Vor Livegang HWG/EFSA-Gegenlesen** (§9.6).
> Durchgehend „Anzeichen, die … in Verbindung stehen **können**" — nie „du hast".
> **Nichts erfunden** — Wording aus §5.

---

## Personalisierung — Schreibweise

Felder `validation`, `mech.text` und der Autoimmun-`text` sind **geordnete Segment-Arrays**:
`[{ text }, { when, text }, …]`. Die Engine rendert die `text` aller Segmente, deren `when`
zutrifft, in Reihenfolge. `advice`-Karten tragen optional `when` (Filter).

**Prädikate (`when`):** `{q,is}` `{q,in}` `{q,has}` `{q,hasAny}` `{q,band}` `{q,skipped}`
`{flag}` `{hasSymptoms}` `{outcomeIn}` `{anyOf}` `{allOf}` `{not}`.
**Tokens:** `{{symptoms}}` (gewählte Symptome F3–F6), `{{autoimmuneFactor}}` (Risikofaktor-Phrase).

Gemeinsame Bausteine (mehrfach verwendet):
- **Wechseljahre-Einschub** `{q:"q12", is:4}`: „Gerade in den Wechseljahren werden solche Beschwerden leicht den Hormonen zugeschrieben — die Schilddrüse lohnt den gezielten Blick."
- **Zyklus-Einschub** `{q:"q13", hasAny:["stark","unregel"]}`: „Auch stärkere oder unregelmäßige Blutungen können mit der Schilddrüse zusammenhängen."
- **mech.note (immer):** „Das ist eine Einordnung, keine Diagnose. Sicherheit gibt nur ein Blutbild."

---

## Ergebnis A — „Deutliche Hinweise"

- **headerEyebrow:** „Deine Einschätzung"
- **title:** „Deine Antworten zeigen deutliche Hinweise"

**a) validation**
1. „Deine Antworten zeigen mehrere Anzeichen, die mit einer Schilddrüsenunterfunktion in Verbindung stehen können."
2. `{hasSymptoms}` „Konkret: {{symptoms}}."
3. „Das ist keine Diagnose — aber genug, um es ernst zu nehmen und ärztlich abklären zu lassen."
4. `{q:"q2",is:2}` „Du hast bereits eine Diagnose — dann deuten deine Antworten darauf hin, dass du aktuell nicht optimal eingestellt sein könntest. Auch das gehört ärztlich besprochen."
5. `{anyOf:[{q:"q10",is:2},{q:"q11",hasAny:["stress","alter","familie","anstellen"]}]}` „Wenn du oft gehört hast, das sei „nur Stress" oder „die Hormone" — du bildest dir das nicht ein."

**b) mech**
- title: „Was dahinterstecken kann"
- text:
  1. „Die Schilddrüse steuert Stoffwechsel, Energie, Temperatur und Stimmung. Produziert sie zu wenig Hormone, zeigt sich das schleichend in genau solchen Beschwerden."
  2. Wechseljahre-Einschub
  3. Zyklus-Einschub
- note: (gemeinsame mech.note)

**c) advice**
1. `doctor` „Sprich zeitnah mit ärztlicher Begleitung" — „Nimm deine Beschwerden ernst und such dir zeitnah einen Termin."
2. `doctor` „Bitte gezielt um die richtigen Werte" — „TSH, fT3, fT4 und TPO-Antikörper."
3. `{q:"q17",is:0}` `observe` „Erwähne deine bisherigen Werte" — „Sag, dass deine Werte als unauffällig galten, du aber weiter Beschwerden hast."
4. `{q:"q18",band:0}` `observe` „Sprich deine Temperatur an" — „Deine morgendliche Temperatur liegt eher niedrig — ein zusätzliches Zeichen, das du erwähnen kannst."
5. `{q:"q18",skipped:true}` `observe` „Miss eine Woche morgens" — „Liegt die Aufwach-Temperatur wiederholt unter ~36,8 °C, nimm die Werte mit zum Termin."

**d) productId:** aus `productRules` (Engine wählt). **e) empower:**
- title: „Du musst da nicht allein durch."
- text: „Mit den richtigen Werten bekommst du endlich Antworten — wir begleiten dich mit verständlichem Wissen."

---

## Ergebnis B — „Mögliche Hinweise"

- **title:** „Deine Antworten zeigen einige mögliche Hinweise"

**a) validation**
1. „Deine Antworten zeigen einige Anzeichen, die mit einer Unterfunktion in Verbindung stehen können — aktuell aber kein eindeutiges Bild."
2. `{hasSymptoms}` „Konkret: {{symptoms}}."
3. „Keine Diagnose, kein Grund zur Sorge — aber ein guter Anlass, genauer hinzuschauen."
4. `{q:"q2",is:2}` „Du hast bereits eine Diagnose — dann lohnt der Blick, ob deine aktuelle Einstellung noch gut zu dir passt."

**b) mech**
- title: „Was dahinterstecken kann"
- text:
  1. „Viele dieser Beschwerden sind unspezifisch. Halten sie an oder werden mehr, lohnt ein gezielter Blick auf die Schilddrüse."
  2. Wechseljahre-Einschub
  3. Zyklus-Einschub
- note: (gemeinsame mech.note)

**c) advice**
1. `observe` „Beobachte die nächsten Wochen" — „Ein kurzes Beschwerde-Tagebuch hilft, Muster zu erkennen."
2. `doctor` „Sprich es beim nächsten Arztbesuch an" — „Frag nach einer Basisdiagnostik (TSH, ggf. fT3/fT4)."
3. `{q:"q18",skipped:true}` `observe` „Kleiner Selbsttest" — „Miss eine Woche lang morgens deine Temperatur."

**d) productId:** aus `productRules` (dezent). **e) empower:**
- title: „Du musst nicht warten, bis es „schlimm genug" ist."
- text: „Wir geben dir das Wissen für ein gutes Gespräch."

---

## Ergebnis C — „Wenig Hinweise" (kein Produkt, kein Autoimmun-Block)

- **title:** „Aktuell sprechen deine Antworten für wenig Hinweise"

**a) validation**
1. „Deine Antworten sprechen aktuell wenig für eine Unterfunktion. Erst einmal eine gute Nachricht."

**b) mech**
- title: „Trotzdem gut zu wissen"
- text:
  1. „Eine Unterfunktion kann sich schleichend entwickeln. Behalte im Blick: anhaltende Müdigkeit, Frieren, Gewichtsveränderungen, trockene Haut, Haarausfall oder Niedergeschlagenheit."
- note: (gemeinsame mech.note)

**c) advice**
1. `doctor` „Bei neuen oder anhaltenden Beschwerden" — „Treten solche Beschwerden neu auf oder halten an, sprich ärztlich darüber."
2. `{flag:"autoimmune"}` `observe` „Risikofaktor im Blick behalten" — „Da bei dir {{autoimmuneFactor}} vorliegt, kann ein gelegentlicher Check sinnvoll sein."

**d) productId:** `null` (bei wenig Hinweisen kein Produkt). **e) empower:**
- title: „Bleib neugierig auf deinen Körper."
- text: „Wir sind da, wenn du mehr wissen möchtest."

---

## Autoimmun-Block (`outcomes.autoimmuneBlock`) — zusätzlich bei A/B, wenn Flag

- **title:** „Ein Hinweis zu deinen Angaben"
- **text:**
  1. „Einer deiner Angaben — {{autoimmuneFactor}} — gehört zu den bekannten Risikofaktoren für Hashimoto, die häufigste Ursache einer Unterfunktion in Deutschland."
  2. „Sprich das beim Arzt aktiv an und bitte ausdrücklich um die TPO-Antikörper; sie werden nicht immer automatisch mitbestimmt."

---

## Globale Bausteine (in content.js gesetzt)
- `result.legalDisclaimer`: „Dieses Quiz ersetzt keine ärztliche Untersuchung oder Diagnose. Bei anhaltenden Beschwerden wende dich bitte an deine Ärztin oder deinen Arzt."
- EFSA-Claim-Fußnoten gehören an die Produkttexte (Register in `products.md`).

### TODO (Leo / Compliance)
- [ ] §9.6 Finaler HWG/EFSA-Check aller Texte.
- [ ] Evas Review (§9.7) einarbeiten.
- [ ] Titel/Ton je Band bestätigen.
