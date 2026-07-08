# Briefing für Claude Design — Produkt-Cards für die Ergebnis-Mail

> **Für Leo:** Den Abschnitt „Prompt für Claude Design" (zwischen den Linien) in Claude
> Design geben — einmal pro Card oder alle vier auf einmal. Die Texte stammen wortgleich
> aus den geprüften Quellen (`content/products.md` Registry + EFSA-Claims,
> `outcomes.productRules → reason`). **Nichts umformulieren lassen** — Claude Design
> gestaltet nur, textet nicht.
>
> Export je Card: **PNG, 1200 px breit** (wird in der Mail mit 600 px angezeigt → scharf
> auf Retina), Format ca. **4:5 hoch** (1200×1400–1500 px), weiße Karte mit weichen
> Rundungen direkt im Bild, Hintergrund um die Karte transparent oder Creme `#FBF7F2`.
> Dateinamen: `mail-card-produzent.png`, `mail-card-umwandler.png`,
> `mail-card-immungold.png`, `mail-card-magenfreund.png`.
>
> **Empfehlung:** Den Button NICHT mit ins Bild designen — der kommt in Klaviyo als
> echter Button unter die Card (bleibt klickbar, trackbar und änderbar; in manchen
> Mail-Programmen sind Bilder anfangs ausgeblendet, ein HTML-Button bleibt sichtbar).

---

## Prompt für Claude Design

Gestalte eine E-Mail-Produktkarte im miavola-Markenstil: ruhig, premium, editorial.
Farben: Creme `#FBF7F2`, tiefes Wein/Burgund `#7A3343` für Überschriften und Akzente,
Fließtext in dunklem Graubraun, dezente Sage/Gold-Akzente sparsam. Minimalistisch,
weiche Rundungen, viel Weißraum. Keine Verläufe, keine Schlagschatten, kein AI-Look.

Einheitlicher Aufbau (für alle vier Karten identisch — nur Inhalte tauschen):

1. **Oben:** Produktfoto auf Creme-Fläche (Foto liefere ich als Datei mit)
2. **Eyebrow** (klein, Versalien, Burgund): „Aus unserer Range"
3. **Produktname** (groß, Burgund) + **Unterzeile** (klein, grau)
4. **Abschnitt „Warum du das siehst"** — 2 kurze Sätze Fließtext
5. **Abschnitt „Was drin steckt"** — 1–2 Punkte mit Nährstoff-Claim, jeweils mit
   hochgestellter Fußnoten-Ziffer am Satzende
6. **Kleingedruckt** (klein, grau): Hinweiszeile

Übernimm alle Texte exakt wie angegeben (Wortlaut ist rechtlich geprüft — nichts
umformulieren, nichts ergänzen, keine Emojis).

### Karte 1 — Der Produzent®
- Name: „Der Produzent®" · Unterzeile: „Schilddrüsen-Komplex"
- Foto: `app/assets/produzent-hero.webp`
- Warum du das siehst: „Deine Antworten zeigen deutliche Hinweise, auch wenn eine ärztliche Abklärung noch aussteht. Aus unserer Range zeigen wir dir deshalb den Produzenten®, den Schilddrüsen-Komplex. Er ersetzt keine Abklärung: Lass deine Werte zuerst ärztlich prüfen, gerade weil er Jod enthält."
- Was drin steckt:
  - „Jod trägt zu einer normalen Produktion von Schilddrüsenhormonen und zu einer normalen Funktion der Schilddrüse bei.¹"
  - „Selen trägt zu einer normalen Schilddrüsenfunktion bei.²"
- Kleingedruckt: „Enthält Jod: nicht bei Überfunktion/Basedow ohne ärztliche Rücksprache. Kein Ersatz für deine Therapie."

### Karte 2 — Der Umwandler®
- Name: „Der Umwandler®" · Unterzeile: „Leber-Komplex"
- Foto: `app/assets/umwandler-hero.webp`
- Warum du das siehst: „Deine Schilddrüse ist bereits ärztlich diagnostiziert. Dann geht es vor allem darum, sie im Alltag gut zu begleiten. Der Umwandler® ist der Leber-Komplex aus unserer Range, gedacht als Ergänzung zu deiner ärztlichen Therapie, nicht als Ersatz."
- Was drin steckt:
  - „Cholin trägt zur Aufrechterhaltung einer normalen Leberfunktion bei.¹"
  - „Selen trägt zu einer normalen Schilddrüsenfunktion bei.²"
- Kleingedruckt: „Kein Ersatz für deine Therapie. Bitte ärztlich besprechen."

### Karte 3 — Immungold®
- Name: „Immungold®" · Unterzeile: „Omega-3 + Vitamin D"
- Foto: `app/assets/immungold-hero.webp`
- Warum du das siehst: „Weil bei dir Autoimmun-Angaben vorkommen, zeigen wir dir aus unserer Range Immungold®. Es ist ein Komplex mit Vitamin D und Omega-3. Wenn Autoimmun-Themen bei dir eine Rolle spielen, kann eine gute Vitamin-D-Versorgung sinnvoll sein."
- Was drin steckt:
  - „Vitamin D trägt zu einer normalen Funktion des Immunsystems bei.¹"
- Kleingedruckt: „Kein Muss. Bitte besprich Veränderungen mit deinem Arzt."

### Karte 4 — Der Magenfreund®
- Name: „Der Magenfreund®" · Unterzeile: „Verdauungs-Komplex"
- Foto: **[BLOCKER — es gibt noch kein Magenfreund-Produktfoto** (`magenfreund-hero.*`
  fehlt laut TODO.md). Card erst gestalten, wenn das Foto da ist, oder bewusst als
  Text-Karte ohne Foto.]
- Warum du das siehst: „Du hast eine träge Verdauung genannt. Deshalb taucht der Magenfreund® hier als möglicher nächster Schritt auf. Er ist der Verdauungs-Komplex aus unserer Range, als ruhige Alltags-Ergänzung gedacht."
- Was drin steckt:
  - „Chlorid trägt zu einer normalen Verdauung bei, indem es zur Bildung von Magensäure beiträgt.¹"
- Kleingedruckt: „Kein Muss. Bitte besprich Veränderungen mit deinem Arzt."

---

## Buttons (in Klaviyo unter die jeweilige Card, nicht ins Bild)

| Card | Button-Text | Link |
|---|---|---|
| Produzent | „Mehr über den Produzenten" | https://miavola.de/products/der-produzent |
| Umwandler | „Mehr über den Umwandler" | https://miavola.de/products/der-umwandler |
| Immungold | „Mehr über Immungold" | https://miavola.de/products/immungold |
| Magenfreund | „Mehr über den Magenfreund" | https://miavola.de/products/der-magenfreund |

## Offene Punkte (Compliance / Leo)

- Die Fußnoten-Ziffern (¹ ²) verweisen auf das EFSA-Claim-Register in
  `content/products.md` — **Wortlaut vor Livegang final gegen VO (EU) 432/2012
  bestätigen (§9.5)**. Ob die Fußnote in der Mail eine Auflösungszeile braucht
  (z. B. unten „¹ ² Zugelassene Angaben nach VO (EU) 432/2012"), bitte mit
  Compliance klären.
- Die „Warum du das siehst"-Sätze duzen und beziehen sich auf die Quiz-Antworten —
  das passt, weil die Show/Hide-Logik sicherstellt, dass nur passende Personen die
  jeweilige Card sehen.
- Mehr Education (z. B. Einnahme, Inhaltsstoff-Geschichten) gibt es in den geprüften
  Quellen **nicht** — wenn gewünscht, müsste Leo neue Texte liefern und freigeben
  **[TODO]**. Erfunden wird nichts.
