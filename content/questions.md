# questions.md — Fragen, Antwortoptionen, Typ & gesammelte Daten

> **Status: nach Master-Spec §3 transkribiert.** Die 18 Fragen (Block A–G) liegen live in
> `app/content.js → flow` und entsprechen dieser Liste. `wirkung` = Scoring /
> Personalisierung / Action-Point (Details Scoring → `outcomes.md`).
>
> Offene Wording-Punkte sind unten als **[bestätigen]** markiert.

---

## Architektur des Flows (§2)
Ein gerader Weg, **keine** Verzweigung. F2 verzweigt nicht (steuert nur Wording + Produkt).
**Skip-Regel:** keine Symptome in F3–F6 → F7–F11 werden übersprungen.
**Bedingt:** F13 nur bei menstruierenden Nutzerinnen (F12 = regelmäßiger/unregelmäßiger Zyklus).

---

## Block A · Einstieg

**F1 (`q1`, single, Personalisierung)** — „Was beschreibt am besten, warum du diesen Check machst?"
- nicht wie ich selbst · konkrete Beschwerden · Verdacht/Familie · Vorsorge

**F2 (`q2`, single, Personalisierung + Produkt-Eignung, verzweigt nicht)** — „Wurde bei dir schon einmal eine Schilddrüsenerkrankung festgestellt?"
- Nein, noch nie · Nein, aber Verdacht · **Ja** (Index 2 → diagnostiziert)

## Block B · Symptome (multi, je „Nichts davon"; immer sichtbar; Scoring +1 je Symptom)

**F3 (`q3`)** Energie & Körpergefühl — Müdigkeit · Gewichtszunahme/schwer abzunehmen · Frieren · Antriebslosigkeit
**F4 (`q4`)** Haut, Haare & Äußeres — trockene Haut · Haarausfall · brüchige Nägel · aufgedunsenes Gesicht  · **[bestätigen: „Nichts davon" ergänzt — in §3 nicht gelistet, für einheitliche Skip-Logik]**
**F5 (`q5`)** Kopf & Stimmung — Brain Fog · Niedergeschlagenheit · innere Unruhe · Schlafprobleme
**F6 (`q6`)** Körper & Verdauung — Verstopfung · Muskel-/Gelenkschmerzen · Muskelschwäche · Wassereinlagerungen *(Verstopfung → ggf. Magenfreund)*

## Block C · Verlauf & Belastung (übersprungen ohne Symptome)

**F7 (`q7`, single, Scoring + Dringlichkeit)** — „Seit wann ungefähr?" — < 3 Mon · 3–12 Mon (+1) · > 1 Jahr (+2) · nicht sicher
**F8 (`q8`, single, Scoring leicht)** — „Wie entwickeln sie sich?" — werden mehr (+1) · gleich · weniger · schwankend
**F9 (`q9`, single, Personalisierung)** — „Wie stark schränken sie dich im Alltag ein?" — kaum · etwas · deutlich · massiv  · **[bestätigen: Fragetext rekonstruiert]**

## Block D · Erfahrung (übersprungen ohne Symptome; nur Personalisierung)

**F10 (`q10`, single)** — „Hast du das Gefühl, mit deinen Beschwerden ernst genommen zu werden?" — gut begleitet · teils abgetan · nicht ernst genommen · noch nicht angesprochen
**F11 (`q11`, multi)** — „Schon mal auf etwas anderes geschoben?" — Stress · Alter/Wechseljahre · Familie/Muttersein · „stell mich nur an" · nein

## Block E · Frauengesundheit

**F12 (`q12`, single, Personalisierung + postpartal-Flag)** — „In welcher Lebensphase befindest du dich?" — regelmäßiger Zyklus (0) · unregelmäßiger Zyklus (1) · Kinderwunsch/schwanger (2) · Geburt < 12 Mon (3, Flag) · Wechseljahre (4) · keine Menstruation (5)
**F13 (`q13`, multi, Scoring + Personalisierung; nur F12 ∈ {0,1})** — „Hat sich an deiner Periode etwas verändert?" — stärkere/längere Blutungen (+1) · unregelmäßiger · stärkeres PMS · keine Veränderung
> **[offen §9.4]** F13 auch bei Kinderwunsch (F12=2) zeigen? Aktuell nein.

## Block F · Risikofaktoren

**F14 (`q14`, single, Scoring + Autoimmun-Flag)** — „Schilddrüsen- oder Autoimmunerkrankungen in der Familie?" — Schilddrüse (+2, Flag) · andere Autoimmun (+1, Flag) · nein · weiß nicht
**F15 (`q15`, single, Scoring + Autoimmun-Flag)** — „Hast du selbst eine andere Autoimmunerkrankung?" — Ja (+2, Flag) · nein · weiß nicht  · **[bestätigen: Fragetext rekonstruiert]**
**F16 (`q16`, multi, Scoring +2 Kategorie-Cap)** — „Bemerkst du etwas im Hals- oder Kehlbereich?" — Schwellung/Druck · Kloßgefühl/Schlucken · Heiserkeit · nein

## Block G · Werte & Selbstmessung

**F17 (`q17`, single, Action-Point)** — „In den letzten 12 Monaten Schilddrüsenwerte überprüft?" — ja, unauffällig · ja, kenne Werte nicht · nein, noch nie
**F18 (`q18`, number, weicher Zusatz-Hinweis)** — „Kennst du deine Körpertemperatur morgens nach dem Aufwachen?" — Zahl °C (34–42, 1 Nachkommastelle, Komma/Punkt) **oder** „weiß ich nicht".
- Bänder: `band:0` < 36,8 °C (niedrig, +1) · `band:1` ≥ 36,8 (normal/hoch, 0)

## Wissens-Einschübe (Info-Cards, kein Produkt) — §3 · PLATZIERT (2026-07-01)
Ganzseitige Info-Cards (`type:"education", variant:"info"`, Grafik oben + Text). Quelle:
`content/education.md`. Reine Vorwärts-Einschübe (bei Rückwärts-Navigation übersprungen).
- **nach F12** (`eduHormone`, nur weiblich/keine Angabe): „Hormone und Schilddrüse sprechen dieselbe Sprache."
- **nach F15** (`eduHashimoto`): „Die häufigste Ursache heißt Hashimoto." *(nach F15 statt F14 → Abstand zur Hormon-Card)*
- **nach F17** (`eduTsh`): „Ein ‚normaler' TSH ist nicht das ganze Bild."

## Inline-Frage-Erklärung (`info`) — NEU 2026-07-01
Optionales Feld `info` je Frage → dezenter, ausklappbarer Hinweis „ⓘ Was ist gemeint?" unter
der Frage (barrierefrei, nur bei Bedarf; identisch Desktop/Mobil). Gesetzt bei Fragen mit
Fachbegriff/Selbst-Check-Bedarf: **F5** (Brain Fog), **F14** (Autoimmun – Familie),
**F15** (Autoimmun – selbst), **F16** (Hals-/Kehl-Selbstcheck), **F17** (Blutwerte/TSH).
Texte = Entwurf (HWG-neutral, Alltagssprache), erweiterbar. Vor Livegang gegenlesen.

---

## Offene Entscheidungen (TODO.md / §9)
- [ ] F4 „Nichts davon" behalten?
- [ ] F9- / F15-Fragetexte bestätigen (rekonstruiert).
- [ ] F3–F6 Fragesätze (aus Themen-Labels ausformuliert) — Wording ok?
- [ ] §9.4 F13 bei Kinderwunsch zeigen?
- [ ] Wissens-Einschübe platzieren.
- [ ] Zähler-Sprung (F13 erscheint bedingt) — so lassen oder reiner %-Balken?
