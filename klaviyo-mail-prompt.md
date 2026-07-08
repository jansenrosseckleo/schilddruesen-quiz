# Prompt für die Klaviyo-KI — Ergebnis-Mail Schilddrüsen-Quiz

> **Für Leo:** Alles zwischen den Linien in die Klaviyo-KI kopieren.
> Texte stammen wortgleich aus `content/results-copy.md` + `content.json` (Stand 2026-07-06).
> Mit **[NEU — Freigabe Leo]** markierte Stellen sind die einzigen neuen Texte (Betreff,
> Übergangssätze) — bitte vor dem Livegang kurz absegnen. Genereller Vorbehalt: Alle
> Inhalte sind Entwurf, finaler HWG/EFSA-Check (§9.6) steht noch aus.

---

Erstelle mir einen Flow mit einer E-Mail. Halte dich exakt an diese Vorgaben. **Wichtig: Alle Texte in Anführungszeichen sind rechtlich geprüft (HWG) und müssen wortgleich übernommen werden — nichts umformulieren, nichts kürzen, keine eigenen Gesundheitsaussagen oder Emojis ergänzen.** Sprache: Deutsch, Du-Form.

## 1. Kontext

- Es gibt die Liste **„Schilddrüsen-Quiz Leads (neu)"** (List-ID `UEPkJi`) mit aktivem Double-Opt-in. Ein Quiz auf unserer Website trägt Personen dort ein.
- Jedes Profil hat drei Custom Properties, die das Quiz mitschickt:
  - `quiz_band` = `A`, `B` oder `C` (Ergebnis-Stufe)
  - `quiz_autoimmun` = `true` oder `false`
  - `quiz_produkt` = `produzent`, `umwandler`, `immungold`, `magenfreund`, `kollagen`, `aminos` oder leer
- Wir erheben **keinen Vornamen** → Anrede immer generisch, keine `first_name`-Variablen verwenden.

## 2. Flow

- Name: **„Schilddrüsen-Quiz · Ergebnis-Mail"**
- Trigger: **Added to List** → Liste „Schilddrüsen-Quiz Leads (neu)" (`UEPkJi`)
- Kein Zeitversatz — die E-Mail folgt direkt auf den Trigger.
- **Smart Sending für diese E-Mail deaktivieren** (jede Person soll ihr Ergebnis erhalten, auch wenn sie kürzlich eine andere Mail bekam).
- UTM-Tracking aktivieren.
- Flow als **Entwurf** anlegen (Manual), nicht live schalten.

## 3. E-Mail-Einstellungen

- Betreff: **„Deine Einschätzung aus dem Schilddrüsen-Check"** [NEU — Freigabe Leo; Alternativen: „Dein Ergebnis aus dem Schilddrüsen-Check — zum Nachlesen" / „Deine Zusammenfassung: Schilddrüsen-Check von miavola"]
- Preview-Text: **„Deine persönliche Einordnung und deine nächsten Schritte — zum Nachlesen."** [NEU — Freigabe Leo]
- Absender: Account-Standard.

## 4. Design

- Ruhig, premium, minimalistisch. Hintergrund Creme `#FBF7F2`, Inhaltskarten weiß, Überschriften und Buttons Burgund `#7A3343`, Fließtext dunkles Graubraun.
- Keine Verläufe, keine Schlagschatten, abgerundete Buttons, viel Weißraum.
- miavola-Logo oben zentriert. Eine Spalte, mobil-optimiert.

## 5. Blöcke — genau diese Reihenfolge, mit Anzeige-Bedingungen

Baue **eine** E-Mail aus folgenden Blöcken. „Bedingung" = Display Condition am Block (Profil-Eigenschaft). Blöcke ohne Bedingung sehen alle.

### Block 1 — Header (immer)
miavola-Logo, darunter kleine Eyebrow-Zeile: „Deine Einschätzung"

### Block 2 — Intro (immer)
„Hallo! Schön, dass du dir die Zeit für den Schilddrüsen-Check genommen hast. Hier ist deine Zusammenfassung zum Nachlesen." [NEU — Freigabe Leo]

### Block 3 — Ergebnis Band A · Bedingung: `quiz_band` equals `A`
- Überschrift (H1, Burgund): „Deine Antworten zeigen deutliche Hinweise"
- Absatz: „Deine Antworten zeigen mehrere Anzeichen, die mit einer Schilddrüsenunterfunktion in Verbindung stehen können. Das ist keine Diagnose — aber genug, um es ernst zu nehmen und ärztlich abklären zu lassen."
- Zwischenüberschrift: „Was dahinterstecken kann"
- Absatz: „Die Schilddrüse steuert Stoffwechsel, Energie, Temperatur und Stimmung. Produziert sie zu wenig Hormone, zeigt sich das schleichend in genau solchen Beschwerden."
- Hinweiszeile (kleiner, kursiv): „Das ist eine Einordnung, keine Diagnose. Sicherheit gibt nur ein Blutbild."
- Zwischenüberschrift: „Deine nächsten Schritte" [NEU — Freigabe Leo]
- Aufzählung:
  - „Sprich zeitnah mit ärztlicher Begleitung: Nimm deine Beschwerden ernst und such dir zeitnah einen Termin."
  - „Bitte gezielt um die richtigen Werte: TSH, fT3, fT4 und TPO-Antikörper."

### Block 4 — Ergebnis Band B · Bedingung: `quiz_band` equals `B`
- Überschrift (H1, Burgund): „Deine Antworten zeigen einige mögliche Hinweise"
- Absatz: „Deine Antworten zeigen einige Anzeichen, die mit einer Unterfunktion in Verbindung stehen können — aktuell aber kein eindeutiges Bild. Keine Diagnose, kein Grund zur Sorge — aber ein guter Anlass, genauer hinzuschauen."
- Zwischenüberschrift: „Was dahinterstecken kann"
- Absatz: „Anzeichen einer Unterfunktion sind oft unspezifisch — halten sie an oder nehmen zu, lohnt ein gezielter Blick auf die Schilddrüse."
- Hinweiszeile (kleiner, kursiv): „Das ist eine Einordnung, keine Diagnose. Sicherheit gibt nur ein Blutbild."
- Zwischenüberschrift: „Deine nächsten Schritte" [NEU — Freigabe Leo]
- Aufzählung:
  - „Beobachte die nächsten Wochen: Ein kurzes Beschwerde-Tagebuch hilft, Muster zu erkennen."
  - „Sprich es beim nächsten Arztbesuch an: Frag nach einer Basisdiagnostik (TSH, ggf. fT3/fT4)."

### Block 5 — Ergebnis Band C · Bedingung: `quiz_band` equals `C`
- Überschrift (H1, Burgund): „Aktuell sprechen deine Antworten für wenig Hinweise"
- Absatz: „Deine Antworten sprechen aktuell wenig für eine Unterfunktion. Erst einmal eine gute Nachricht."
- Zwischenüberschrift: „Trotzdem gut zu wissen"
- Absatz: „Eine Unterfunktion kann sich schleichend entwickeln. Behalte im Blick: anhaltende Müdigkeit, Frieren, Gewichtsveränderungen, trockene Haut, Haarausfall oder Niedergeschlagenheit."
- Hinweiszeile (kleiner, kursiv): „Das ist eine Einordnung, keine Diagnose. Sicherheit gibt nur ein Blutbild."
- Aufzählung (ein Punkt): „Treten solche Beschwerden neu auf oder halten an, sprich ärztlich darüber."

### Block 6 — Autoimmun-Hinweis · Bedingung: `quiz_autoimmun` equals `true` UND `quiz_band` ist NICHT `C`
Dezent abgesetzte Karte:
- Titel: „Ein Hinweis zu deinen Angaben"
- Text: „Eine deiner Angaben gehört zu den bekannten Risikofaktoren für Hashimoto, die häufigste Ursache einer Unterfunktion in Deutschland. Sprich das beim Arzt aktiv an und bitte ausdrücklich um die TPO-Antikörper; sie werden nicht immer automatisch mitbestimmt." [Anmerkung: Original nennt an der Gedankenstrich-Stelle den konkreten Risikofaktor der Person — das kann die Mail nicht; gekürzte Fassung von Leo freigeben]

### Blöcke 7–10 — Produkt-Card (je ein Block: fertiges Card-Bild + Button darunter)
Die Produkt-Cards sind **fertig gestaltete Bilder** aus der Bildbibliothek (in Claude
Design erstellt, Briefing: `claude-design-cards-brief.md`). Jeder Block besteht aus:
Bild-Element (volle Breite, 600 px Anzeigebreite) + direkt darunter ein Button.
**Beide Elemente bekommen dieselbe Display-Bedingung.**

**Block 7 · Bedingung: `quiz_produkt` equals `produzent`**
- Bild: `mail-card-produzent.png` — Alt-Text: „Der Produzent® — Schilddrüsen-Komplex"
- Button: „Mehr über den Produzenten" → https://miavola.de/products/der-produzent

**Block 8 · Bedingung: `quiz_produkt` equals `umwandler`**
- Bild: `mail-card-umwandler.png` — Alt-Text: „Der Umwandler® — Leber-Komplex"
- Button: „Mehr über den Umwandler" → https://miavola.de/products/der-umwandler

**Block 9 · Bedingung: `quiz_produkt` equals `immungold`**
- Bild: `mail-card-immungold.png` — Alt-Text: „Immungold® — Omega-3 + Vitamin D"
- Button: „Mehr über Immungold" → https://miavola.de/products/immungold

**Block 10 · Bedingung: `quiz_produkt` equals `magenfreund`**
- Bild: `mail-card-magenfreund.png` — Alt-Text: „Der Magenfreund® — Verdauungs-Komplex"
- Button: „Mehr über den Magenfreund" → https://miavola.de/products/der-magenfreund

*(Für `quiz_produkt` = `kollagen`, `aminos` oder leer erscheint bewusst kein Produktblock.)*

### Blöcke 11–13 — Abschluss-Zeile je Band
**Block 11 · Bedingung: `quiz_band` equals `A`:** „**Du musst da nicht allein durch.** Mit den richtigen Werten bekommst du endlich Antworten — wir begleiten dich mit verständlichem Wissen."
**Block 12 · Bedingung: `quiz_band` equals `B`:** „**Du musst nicht warten, bis es „schlimm genug" ist.** Wir geben dir das Wissen für ein gutes Gespräch."
**Block 13 · Bedingung: `quiz_band` equals `C`:** „**Bleib neugierig auf deinen Körper.** Wir sind da, wenn du mehr wissen möchtest."

### Block 14 — Rechtlicher Hinweis (immer, kleiner grauer Text)
„Dieses Quiz ersetzt keine ärztliche Untersuchung oder Diagnose. Bei anhaltenden Beschwerden wende dich bitte an deine Ärztin oder deinen Arzt."

### Block 15 — Standard-Footer (immer)
Unser üblicher miavola-Footer mit Abmeldelink und Impressum.

## 6. Nach dem Bauen

Zeig mir die Vorschau für drei Test-Fälle und prüfe, dass jeweils **nur** die passenden Blöcke sichtbar sind:
1. `quiz_band` = A, `quiz_autoimmun` = true, `quiz_produkt` = immungold → Block 3 + 6 + 9 + 11
2. `quiz_band` = B, `quiz_autoimmun` = false, `quiz_produkt` = umwandler → Block 4 + 8 + 12
3. `quiz_band` = C, `quiz_autoimmun` = false, `quiz_produkt` leer → Block 5 + 13 (kein Produkt, kein Autoimmun-Hinweis)

---

## Checkliste für Leo (nicht Teil des KI-Prompts)

- [ ] Vorher: Produkt-Cards in Claude Design gestalten (Briefing + geprüfte Texte:
      `claude-design-cards-brief.md`), als PNG (1200 px breit) exportieren und als
      `mail-card-produzent.png`, `mail-card-umwandler.png`, `mail-card-immungold.png`,
      `mail-card-magenfreund.png` in die Klaviyo-Bildbibliothek hochladen.
      ⚠️ Magenfreund: Produktfoto fehlt noch (bekannter TODO-Punkt).
- [ ] [NEU]-Stellen freigeben: Betreff + Preview, Intro-Satz, „Deine nächsten Schritte", „Aus unserer Range", gekürzter Autoimmun-Satz.
- [ ] Double-Opt-in-Bestätigungsmail der Liste branden (Liste → Settings → Consent).
- [ ] Testlauf: Quiz mit eigener Mail durchspielen (je einmal Richtung A und C), DOI bestätigen, Mail prüfen.
- [ ] Flow erst nach HWG/EFSA-Freigabe (§9.6) live schalten.
