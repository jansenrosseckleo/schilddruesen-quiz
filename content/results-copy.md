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

### Modularitäts-Regel (verbindlich — Design 2026-07-01)
Jeder Block **und** jedes Segment muss sich **eigenständig** lesen. Weil bedingte Blöcke
je nach Antworten **wegfallen**, gilt:
1. **Kein Block/Segment verweist auf einen nachfolgenden** (kein „wie unten", „im nächsten
   Abschnitt", „außerdem empfehlen wir dir gleich …").
2. Übergangswörter am Segment-Anfang („Auch …", „Zudem …") nur, wenn das Segment auch als
   erstes/einziges noch sinnvoll ist — sonst neutral formulieren.
3. **Keine Doppelung** über Blöcke: `validation` benennt Symptome, `mech` erklärt allgemein,
   `insights` erklärt **je Antwort-Cluster** — inhaltlich getrennt.
Verifikation: mehrere Personas durchspielen, jede gerenderte Seite auf hängende Verweise lesen.

### Hero-Bild je Band
Jedes Outcome trägt `heroImage` (+ `heroAlt`) → oben auf der Ergebnisseite (`onerror`-Fallback).
Dateien: A `result-hero-a.jpg` · B `result-hero-b.jpg` · C `result-hero-c.jpg`
(Prompts → `content/image-prompts.md`).

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
  1. „Anzeichen einer Unterfunktion sind oft unspezifisch — halten sie an oder nehmen zu, lohnt ein gezielter Blick auf die Schilddrüse." *(self-contained — auch ohne genannte Symptome, z. B. Risiko-only-Nutzer)*
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
2. `{q:"q2",is:2}` „Du hast bereits eine Diagnose — dass aktuell wenig zusätzliche Hinweise dazukommen, ist ein gutes Zeichen. Behalte deine Einstellung trotzdem im Blick." *(damit die Diagnose auch in Band C nicht ignoriert wird)*

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

## Insights-Sektion (`copy.insights`) — NEU, bedingt, nur A/B

Karten zwischen b) mech und c) advice: „Was deine Angaben im Einzelnen zeigen". Rein
**erklärend** (nicht handlungsleitend — das ist `advice`). Shape `{ when, icon, title, text }`,
Filter über `matches`. Kein Match → **Sektion entfällt komplett**. Jede Karte self-contained.
Buchstabe der Sektion: **c** (advice rückt auf d, product auf e).

Karten (identisch für A und B, außer Ton; C hat **keine** Insights):

1. `{q:"q3", hasAny:["frieren","muede","antrieb"]}` · `observe` — „Energie & Wärme im Haushalt"
   „Energie, Wärme und Antrieb hängen eng am Stoffwechsel: Läuft er langsamer, stellt der
   Körper weniger davon bereit. Das erklärt, warum sich mehrere solcher Beschwerden
   gleichzeitig zeigen können." *(bewusst allgemein — Trigger feuert schon bei einem Symptom)*
2. `{q:"q4", hasAny:["haut","haare","naegel"]}` · `observe` — „Haut, Haare & Nägel"
   „Haut, Haare und Nägel reagieren empfindlich auf den Stoffwechsel. Verändern sie sich ohne
   klaren Grund, kann das ein leises Signal sein — für sich allein aber kein Beweis."
3. `{q:"q5", hasAny:["fog","down"]}` · `observe` — „Kopf & Stimmung"
   „Kopf und Stimmung reagieren mit auf den Stoffwechsel: Die Schilddrüse beeinflusst, wie klar,
   wach und ausgeglichen du dich fühlst — ein Zusammenhang, der oft übersehen wird."
   *(bewusst allgemein — Trigger feuert schon bei einem Symptom)*
4. `{q:"q6", has:"verstopfung"}` · `observe` — „Träge Verdauung"
   „Eine langsamere Verdauung passt ins Bild eines gedrosselten Stoffwechsels. Sie ist häufig
   und lässt sich gut ansprechen."
5. `{q:"q16", hasAny:["schwellung","kloss","heiser"]}` · `warn` — „Zeichen am Hals"
   „Veränderungen im Hals- oder Kehlbereich gehören einmal ärztlich angeschaut. Häufig ist es
   harmlos — Klarheit bekommst du aber nur durch einen Blick darauf." *(deckt auch Heiserkeit-only)*
6. `{q:"q7", is:2}` · `clock` — „Das begleitet dich schon länger"
   „Beschwerden, die über ein Jahr anhalten, verdienen eine gezielte Abklärung — nicht, weil
   etwas Schlimmes sein muss, sondern damit du endlich Klarheit hast."
7. `{q:"q8", is:0}` · `clock` — „Es wird eher mehr"
   „Dass die Beschwerden zunehmen, ist ein guter Grund, jetzt hinzuschauen, statt weiter
   abzuwarten."

---

## Autoimmun-Block (`outcomes.autoimmuneBlock`) — zusätzlich bei A/B, wenn Flag

- **title:** „Ein Hinweis zu deinen Angaben"
- **text:**
  1. „Eine deiner Angaben — {{autoimmuneFactor}} — gehört zu den bekannten Risikofaktoren für Hashimoto, die häufigste Ursache einer Unterfunktion in Deutschland."
  2. „Sprich das beim Arzt aktiv an und bitte ausdrücklich um die TPO-Antikörper; sie werden nicht immer automatisch mitbestimmt."

---

## Globale Bausteine (in content.js gesetzt)
- `result.legalDisclaimer`: „Dieses Quiz ersetzt keine ärztliche Untersuchung oder Diagnose. Bei anhaltenden Beschwerden wende dich bitte an deine Ärztin oder deinen Arzt."
- EFSA-Claim-Fußnoten gehören an die Produkttexte (Register in `products.md`).

### TODO (Leo / Compliance)
- [ ] §9.6 Finaler HWG/EFSA-Check aller Texte.
- [ ] Evas Review (§9.7) einarbeiten.
- [ ] Titel/Ton je Band bestätigen.
