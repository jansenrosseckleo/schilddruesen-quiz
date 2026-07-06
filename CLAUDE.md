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

## Deployment — WICHTIG
Die **Live-Seite** (GitHub Pages, `https://jansenrosseckleo.github.io/schilddruesen-quiz/`)
deployt aus dem **`gh-pages`-Branch** (Pages-Quelle = `gh-pages`, Pfad `/`), der den
**Inhalt von `app/` im Root** spiegelt (`index.html`, `app.js`, `content.js`, `content.json`,
`styles.css`, `_ds/`, `assets/`, plus `.nojekyll`). **Pushes auf `main` deployen NICHT** —
`main` ist nur das Quell-Repo. Nach Änderungen an `app/` **zusätzlich** deployen:
```bash
# aus dem Repo-Root, main committed & gepusht:
git worktree add -B gh-pages /tmp/ghpages origin/gh-pages
rsync -a --exclude='.DS_Store' --exclude='.git' app/ /tmp/ghpages/   # .nojekyll bleibt erhalten
git -C /tmp/ghpages add -A && git -C /tmp/ghpages commit -m "Deploy: <beschreibung>"
git -C /tmp/ghpages push origin gh-pages                              # löst Pages-Build aus
git worktree remove /tmp/ghpages --force
```
`.nojekyll` **muss** bleiben (sonst ignoriert Jekyll das `_ds/`-Design-System).
Cache: `?v=` in `index.html` bei jeder Änderung an `app.js`/`styles.css` hochzählen;
`content.json` wird per `fetch(..., {cache:"no-store"})` geladen.
Nach dem Push den Pages-Build prüfen (kann hängen bleiben — passiert, dann Rebuild anstoßen):
```bash
gh api repos/jansenrosseckleo/schilddruesen-quiz/pages/builds/latest --jq .status  # muss "built" werden
gh api -X POST repos/jansenrosseckleo/schilddruesen-quiz/pages/builds              # Rebuild bei Hänger
```

### Zweites Deploy-Ziel: Cloudways (lp.miavola.de/quiz) — NICHT VERGESSEN
Das Quiz läuft zusätzlich (produktiv!) auf dem Cloudways-Server unter
`https://lp.miavola.de/quiz/` (WordPress-Installation, Verzeichnis `public_html/quiz/`).
Deploy per `lftp`-Mirror über SFTP. Zugangsdaten liefert Leo (Host/User/Port/Passwort);
sie liegen NICHT im Repo — als `sftp_env.sh` (chmod 600, Variablen `SFTP_HOST`,
`SFTP_USER`, `SFTP_PW`, `SFTP_PORT`) im Session-Scratchpad ablegen und sourcen:
```bash
source sftp_env.sh
lftp -u "$SFTP_USER,$SFTP_PW" -p "$SFTP_PORT" sftp://"$SFTP_HOST" \
  -e "set sftp:auto-confirm yes; mirror -R --delete --parallel=3 --exclude .DS_Store app/ public_html/quiz/; bye"
curl -s "https://lp.miavola.de/quiz/index.html?cb=$(date +%s)" | grep -o 'app.js?v=[0-9]*'  # verifizieren
```
**Jedes Deployment gilt erst als fertig, wenn BEIDE Ziele (GitHub Pages + Cloudways)
die neue `?v=`-Version ausliefern.**
