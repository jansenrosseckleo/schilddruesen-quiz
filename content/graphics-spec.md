# graphics-spec.md — Grafik-Steckbriefe für Claude Design

> **Zweck:** Diese Grafiken werden **von Leo in Claude Design erstellt** (nicht in Code
> improvisiert, s. CLAUDE.md). Pro Grafik: Motiv, Kern-Aussage, Stil, Format, Dateiname.
> Ablage nach `app/assets/`. Die Engine bindet sie mit `onerror`-Fallback ein — fehlt eine
> Datei, rendert der Screen sauber ohne Bild.

## Markenrahmen (für ALLE Grafiken)
- **Marke:** miavola — ruhig, premium, editorial, Schmetterlings-Motiv.
- **Farben (Design-System):** Wein/Burgund `#7A3343`, Creme `#FBF7F2`, Sage & Gold als
  Akzente. **Keine** Magic-Colors.
- **Stil:** minimalistisch, weiche Rundungen, gleichmäßige Strichstärke.
- **Icons/Illustrationen:** möglichst einfarbig (tiefes Wein) auf **transparentem**
  Hintergrund, groß exportiert (**1024²**, damit klein noch scharf).
- **Verboten:** AI-Slop, Schlagschatten, Verläufe, **Text im Bild**.

---

## A · Info-Card-Grafiken (3×) — quadratisch/breit, transparent

### 1) `edu-hormone.png` — Card „Hormone & Schilddrüse"
- **Kern-Aussage:** Hormonhaushalt und Schilddrüse verursachen **überlappende**
  Beschwerden — schwer auseinanderzuhalten.
- **Motiv:** Zwei sich überlappende, weiche Kreise (Venn). Linker Kreis dezent mit
  Mond-/Zyklus-Symbol (Hormone), rechter Kreis mit stilisierter Schmetterlings-Schilddrüse.
  Schnittmenge sanft hervorgehoben (Sage/Gold-Ton).
- **Format:** 1024 × 1024, transparent, PNG.

### 2) `edu-hashimoto.png` — Card „Hashimoto / Vererbung"
- **Kern-Aussage:** Hashimoto ist die häufigste Ursache und tritt **familiär gehäuft** auf.
- **Motiv:** Drei dezent verbundene Personen-/Punkt-Silhouetten (Generationen) mit einer
  feinen Verbindungslinie; an der Linie ein kleines Schmetterlings-Schilddrüsen-Symbol als
  gemeinsames Element. Minimalistisch, kein Familien-Klischee.
- **Format:** 1024 × 1024, transparent, PNG.

### 3) `edu-tsh.png` — Card „TSH ist nicht das ganze Bild"
- **Kern-Aussage:** Ein einzelner Normwert (TSH) schließt nicht alles aus — weitere Werte
  fehlen.
- **Motiv:** Vier Wert-Felder in einer Reihe: das erste (TSH) mit Häkchen/„im Bereich",
  die drei weiteren (fT3, fT4, TPO) als offene, noch ungeprüfte Felder (gestrichelt). Keine
  echten Zahlen, keine Beschriftung im Bild (Labels macht die UI).
- **Format:** 1024 × 1024 oder 4:3 breit, transparent, PNG.

---

## B · Produktbilder (5 fehlend) — von Leo geliefert
> Freisteller-Produktfotos, quadratisch, auf **transparent** oder Creme. Die Engine zeigt
> sie im Produktblock (84×84, `mix-blend-mode: multiply`). `onerror`-Fallback aktiv.

| Produkt        | Dateiname (in `content.js` verdrahtet) | Status                    |
|----------------|------------------------|---------------------------|
| Der Produzent® | `produzent-hero.webp`  | ✅ vorhanden               |
| Das Heldenduo  | `heldenduo-30-tage.jpg`| ✅ vorhanden               |
| Immungold®     | `immungold-hero.webp`  | ✅ vorhanden (Katalog noch klären) |
| Der Umwandler® | `umwandler-hero.webp`  | ✅ vorhanden               |
| Kollagen-MCT   | `kollagen-hero.webp`   | ✅ vorhanden (Produkt `pending`, aktuell ausgeblendet) |
| Essentielle Aminosäuren | `aminos-hero.webp` | ✅ vorhanden (Produkt `pending`, ausgeblendet) |
| Der Magenfreund®| `magenfreund-hero.*`  | ⬜ **fehlt** — als einziges sichtbares Produkt ohne Bild; nach Lieferung `image`-Feld in `content.js → products.magenfreund` ergänzen |

- **Format:** vorhandene Bilder sind `.webp` (empfohlen; JPG/PNG ok), transparent/Creme.
- Die Dateinamen sind in `content.js → products[id].image` hinterlegt — sobald die Datei in
  `app/assets/` liegt, erscheint sie automatisch (bis dahin `onerror`-Fallback).

---

## Hinweise
- Hero-**Fotos** der Ergebnisseiten sind **keine** Claude-Design-Grafiken → sie kommen aus
  Image Gen 2.0, Prompts in `content/image-prompts.md`.
- Nach Lieferung: Datei in `app/assets/` legen → in `app/index.html` den `?v`-Cache-Buster
  hochzählen (falls nötig).
