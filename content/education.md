# education.md — Info-Cards (Wissens-Einschübe im Flow)

> **Status: Entwurf nach Master-Spec §3 + Design 2026-07-01.** Wird nach
> `app/content.js → flow` (Typ `education`, Variante `info`) übertragen → `content.json`.
> **Education-first, HWG-neutral** — nur „kann/häufig", keine Symptom→Heilversprechen,
> kein Produkt. **Vor Livegang HWG-Gegenlesen** (mit den übrigen Texten, §9.6).
>
> Aufbau je Card: **Grafik oben** (Claude Design, s. `graphics-spec.md`) → Eyebrow →
> Titel → kurzer Wissenstext → „Weiter". Grafik über `onerror`-Fallback abgesichert
> (Card rendert sauber, auch bevor die Grafik geliefert ist).

---

## Platzierung im Flow

| Card-ID        | Position (nach) | Sichtbarkeit (`showWhen`)        | Grafik            |
|----------------|-----------------|----------------------------------|-------------------|
| `eduHormone`   | F12 (`q12`)     | `{ q:"q0", inAnyOf:[0,2] }` *(erbt Geschlechts-Gate von F12 — Männer sehen die Card nicht)* | `edu-hormone.png` |
| `eduHashimoto` | F15 (`q15`)     | immer *(nach F15 statt F14 → Abstand zur Hormon-Card, F14+F15 dazwischen)* | `edu-hashimoto.png` |
| `eduTsh`       | F17 (`q17`)     | immer                            | `edu-tsh.png`     |

Education zählt **nicht** als Frage (Fortschritts-Zähler bleibt stabil, kein Topbar/Counter).

---

## Card 1 — `eduHormone` (nach F12, nur weiblich/keine Angabe)
- **eyebrow:** „Gut zu wissen"
- **title:** „Hormone und Schilddrüse sprechen dieselbe Sprache"
- **text:** „Müdigkeit, Gewichtsveränderungen, Stimmungstiefs oder ein veränderter Zyklus
  werden oft allein den Wechseljahren oder ‚den Hormonen' zugeschrieben. Dahinter kann
  aber auch die Schilddrüse stecken — die Beschwerden ähneln sich stark. Genau deshalb
  lohnt es sich, beides im Blick zu behalten, statt vorschnell einzuordnen."
- **Grafik-Aussage:** Zwei überlappende Kreise „Hormonhaushalt" ↔ „Schilddrüse" mit
  gemeinsamer Schnittmenge (ähnliche Beschwerden). Details → `graphics-spec.md`.

## Card 2 — `eduHashimoto` (nach F15)
- **eyebrow:** „Gut zu wissen"
- **title:** „Die häufigste Ursache heißt Hashimoto"
- **text:** „Die meisten Schilddrüsenunterfunktionen in Deutschland entstehen durch
  Hashimoto — eine Autoimmun-Reaktion, bei der der Körper die eigene Schilddrüse angreift.
  Sie tritt familiär gehäuft auf: Gibt es Fälle in deiner Familie, kann dein eigenes Risiko
  erhöht sein. Kein Grund zur Sorge — aber ein guter Grund, aufmerksam zu sein."
- **Grafik-Aussage:** Stammbaum-/Vererbungs-Motiv, dezent, mit Schmetterlings-Schilddrüse
  als verbindendes Element. Details → `graphics-spec.md`.

## Card 3 — `eduTsh` (nach F17)
- **eyebrow:** „Gut zu wissen"
- **title:** „Ein ‚normaler' TSH ist nicht das ganze Bild"
- **text:** „Bei einem Verdacht wird oft nur der TSH-Wert bestimmt. Der kann im Normbereich
  liegen, obwohl die Schilddrüse noch nicht rund läuft — etwa am Anfang von Hashimoto.
  Ein vollständigeres Bild geben zusätzliche Werte wie fT3, fT4 und die TPO-Antikörper.
  Gut zu wissen fürs nächste Arztgespräch."
- **Grafik-Aussage:** Ein einzelner Wert (TSH) im „grünen Bereich", daneben weitere,
  noch nicht geprüfte Werte (fT3/fT4/TPO) als offene Felder — „ein Wert ≠ ganzes Bild".
  Details → `graphics-spec.md`.

---

## Datenshape (Referenz für `content.js → flow`)
```js
{ type: "education", variant: "info", id: "eduHashimoto",
  graphic: "edu-hashimoto.png",
  graphicAlt: "Vererbung: Schilddrüsen-Themen treten familiär gehäuft auf",
  eyebrow: "Gut zu wissen",
  title: "Die häufigste Ursache heißt Hashimoto",
  text: "…",
  cta: "Weiter" }
```

## TODO (Leo / Compliance)
- [ ] HWG-Gegenlesen der 3 Card-Texte (mit §9.6).
- [ ] Grafiken aus Claude Design liefern (Dateinamen s. Tabelle) → in `app/assets/`.
- [ ] Fakt „häufigste Ursache in Deutschland" belegen/abschwächen falls nötig.
