# miavola Schilddrüsen-Quiz — Projektkontext

> Diese Datei ist der verbindliche Kontext für **alle** Sessions an diesem Projekt.
> North Star, Architektur und Konventionen hier haben Vorrang.

## North Star
Der Nutzer nimmt **echten Mehrwert** mit — auch ohne Kauf. Die Produktempfehlung ist
eine **natürliche Schlussfolgerung**, nicht der Zweck. Das Quiz muss von Influencern
guten Gewissens empfehlbar sein („mach das kostenlose Quiz auf miavola.de und lass
deine Situation einschätzen"). **Education-first, kein Funnel.**

## Was neu/anders ist (vs. altem Quiz)
- Nicht mehr salesy → education-first
- Schärfere Fragen, stärker auf Zielgruppe + Problematik zugeschnitten
- Auswertungsseiten education-first (nicht „Antwort gegeben → kauf das Produkt")
- **Mehrere mögliche Ergebnisse** statt Funnel auf ein einziges Produkt
- Bugs aus dem alten Quiz fixen:
  1. Bilder auf der Auswertungsseite laden nicht korrekt
  2. Am Ende wurde das falsche / alte Produkt empfohlen

## Tech-Stack (Entscheidung 2026-06)
- **Vanilla HTML/CSS/JS** — kein Build-Step. Läuft über statischen Server.
- Baut auf dem mitgelieferten **Miavola Design System** (`app/_ds/…`) auf — nur Tokens,
  keine Magic-Colors.
- **Quiz-Engine strikt getrennt vom Content** (siehe Architektur).

## Architektur
| Ebene | Datei | Regel |
|-------|-------|-------|
| **Engine** | `app/app.js` | Flow, State, Navigation, Auswertung, Rendering. Kennt **keine** Inhalte. |
| **Content** | `app/content.js` | Alle Texte/Fragen/Outcomes/Produkte als Daten. Vom Engine konsumiert. Editierbar. |
| **Styles** | `app/styles.css` | Nur über Design-Tokens. |
| **Design-Quelle** | `extracted/Schilddruesen-Quiz.dc.html` | Claude-Design-Export (Screens & Komponenten). |

`app/content.js` wird aus den `/content/*.md`-Dateien gepflegt. Ändert sich dort etwas,
hier nachziehen. **Niemals Inhalte nur in `content.js` erfinden** — sie gehören in
`/content/*.md` (geprüft) und werden von dort übernommen.

### Auswertung (Severity-Bänder) — IMPLEMENTIERT mit Inhalten (Stand 2026-06-24)
`app.js → evaluate()` liest `content.js → outcomes` (Modell `"severity"`):
- `outcomes.signalRules`: Antwort-Identität → `{ score, flags? }`
  (`"<qid>.<index>"` single · `"<qid>.<key>"` multi · `"<qid>.band:<i>"` number).
- `outcomes.caps`: per-Frage-Cap (z. B. `q16: 2`). `outcomes.bands`: **ein** Gesamt-Score → Band A/B/C.
- `outcomes.list`: Outcome je Band inkl. `copy` (a–e). Texte sind **Rich-Text-Segmente**
  `[{ text, when? }]` mit `when`-Prädikaten + Tokens (`{{symptoms}}`, `{{autoimmuneFactor}}`).
- `outcomes.autoimmuneBlock` (Flag-Block bei A/B), `outcomes.productRules` (inkl. `reason`) und
  `coreProductIds` (Jod-Sicherung: Core-Produkte nur diagnostiziert) steuern Produkt + Zusatzblock.
- Produktblock liest `content.js → products[productId]`; `pending`-Produkte werden ausgeblendet.

**Sind `outcomes.bands`/`list`/`signalRules` leer**, rendert die Engine eine sichtbare
**TODO-Ergebnisseite** — es wird **kein** Ergebnis, Outcome oder Produkt erfunden.

## INPUT-DATEIEN (Content — Quelle der Wahrheit)
- `extracted/` (= „/design")  → Screens & Komponenten aus Claude Design ✅ vorhanden
- `content/products.md`       → Produktrange + Eignung + EFSA-Claims  **[✅ geliefert, Entwurf]**
- `content/outcomes.md`       → Scoring (Severity-Bänder) + Signal-Mapping + Produktregeln  **[✅ geliefert, Entwurf]**
- `content/questions.md`      → 18 Fragen (Block A–G) + Typ + gesammelte Daten  **[✅ geliefert]**
- `content/results-copy.md`   → Texte je Ergebnisseite (education-first)  **[✅ geliefert, Entwurf]**

## Quiz-Logik (Severity-Bänder) — umgesetzt
- Antworten → **ein Gesamt-Score** → Band **A** (deutliche) / **B** (mögliche) / **C** (wenig Hinweise).
- Zusätzlich **Autoimmun-Flag** (ergänzender Hinweisblock bei A/B) — keine konkurrierenden Outcomes.
- Ergebnis- & Produkttexte personalisiert über `when`-Prädikate. Regeln/Schwellen: `content/outcomes.md`.

> ✅ **Stand 2026-06-24:** Scoring (Severity-Bänder A/B/C), Ergebnisseiten (personalisiert)
> und Produktempfehlungen (mit Eignungs-/Jod-Regeln) sind **gebaut + review-geprüft**.
> Inhalte liegen als **Entwurf** vor (`meta.placeholder = true`) — **vor Livegang
> HWG/EFSA-Freigabe** durch Leo/Compliance. Offene Kalibrier-/Claim-Punkte: `TODO.md`.

## Konventionen
- Alle Inhalte auf **Deutsch**, volle Orthografie (Umlaute/ß).
- **Compliance:** Health-Claims müssen **HWG / EFSA-konform** sein. Keine direkten
  Symptom→Heilversprechen. Geprüfte Texte kommen aus `results-copy.md`.
- `TODO.md` für Fortschritt über Sessions hinweg pflegen.

## Grafiken, Icons & Assets — NICHT improvisieren
Grafische Elemente (Icons, Illustrationen, Bilder, Hero-Visuals) werden **nicht selbst
gebastelt**: keine handgezeichneten Inline-SVGs, keine Notlösungen, kein „schnell hinmalen".
Wenn der Build eine Grafik braucht:
1. **Bedarf melden** — klar sagen, welche Grafik wofür fehlt, und nicht improvisieren.
2. **Generierungs-Prompt liefern** — einen fertigen, einfügbaren Prompt für **ChatGPT
   Image Gen 2.0** (markenkonform, s. u.). Leo generiert das Bild.
3. Leo legt die Datei in `app/assets/` → Claude verdrahtet sie (z. B. Inline-SVG → `<img>`),
   immer mit `onerror`-Fallback. Dateinamen/Format vorher absprechen.

**Markenrahmen für jeden Bild-Prompt:** miavola — ruhig, premium, editorial, Schmetterlings-
Motiv. Farben aus dem Design-System (Wein/Burgund `#7A3343`, Creme `#FBF7F2`, Sage/Gold-
Akzente). Stil minimalistisch, weiche Rundungen. **Icons:** einfarbig (tiefes Wein),
gleichmäßige Strichstärke, **transparenter** Hintergrund, groß exportiert (1024², damit sie
klein scharf bleiben). **Kein** AI-Slop, keine Schlagschatten, keine Verläufe, kein Text im Bild.

## WICHTIG — was NICHT erfunden wird
Keine eigenen medizinischen Aussagen, Produktempfehlungen oder Ergebnis-Texte erfinden.
Verwende ausschließlich, was in den `/content`-Dateien steht. Fehlt Content →
**deutlich als `TODO` / `[BLOCKER]` markieren**, aber nichts dazuhalluzinieren.

## Preview
```bash
cd app && python3 -m http.server 8765   # → http://localhost:8765
```
