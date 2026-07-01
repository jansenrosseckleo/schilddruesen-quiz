# image-prompts.md — Prompts für Image Gen 2.0 (Ergebnisseiten-Fotos)

> **Zweck:** Fertige, einfügbare Prompts für die **Hero-Fotos je Ergebnis-Band (A/B/C)**.
> Erstellung durch Leo mit **ChatGPT Image Gen 2.0**. Ablage nach `app/assets/`.
> Die Engine bindet sie oben auf der Ergebnisseite mit `onerror`-Fallback ein — fehlt eine
> Datei, rendert die Seite sauber ohne Foto.

## Marken-/Bildsprache (gilt für alle drei)
miavola — ruhig, premium, editorial. Warme, natürliche Palette passend zum Design-System
(Creme `#FBF7F2`, Wein/Burgund `#7A3343`, Sage/Gold als leise Akzente). Weiches, natürliches
Licht, echte Haut, keine Stockfoto-Übertreibung, **kein Text im Bild**, keine grellen Farben,
keine Schlagschatten/harten Verläufe, kein AI-Slop. Querformat, oben auf der Ergebnisseite
platziert (Fokus liegt auf dem Ergebnis-Text darunter).

**Format je Datei:** ~1600 × 900 (16:9), JPG, für Web optimiert.

---

## A · `result-hero-a.jpg` — Band A „Deutliche Hinweise"
**Ton:** ernst genommen, entschlossen, zugewandt — „du gehst das jetzt an, du bist nicht allein".

> **Prompt:**
> Editorial lifestyle photograph, calm and premium, warm cream and soft burgundy tones. A
> woman in her 30s–40s sitting by a window in soft natural morning light, looking thoughtful
> but hopeful, one hand resting calmly. Muted, sophisticated color palette (cream, warm
> beige, subtle wine accents). Shallow depth of field, gentle film-like grain, no text, no
> logos, no harsh shadows. Quiet, reassuring, health-and-wellness editorial mood. 16:9.

## B · `result-hero-b.jpg` — Band B „Mögliche Hinweise"
**Ton:** aufmerksam, neugierig, in Balance — „ein guter Anlass, genauer hinzuschauen".

> **Prompt:**
> Editorial lifestyle photograph, calm and premium, warm cream tones with soft sage-green
> accents. A woman in soft natural daylight in a bright, minimal interior, a light and
> curious expression, holding a warm cup of tea. Muted, elegant palette, shallow depth of
> field, gentle grain, airy and reassuring. No text, no logos, no harsh shadows, no
> oversaturation. Wellness editorial mood. 16:9.

## C · `result-hero-c.jpg` — Band C „Wenig Hinweise"
**Ton:** erleichtert, leicht, wohltuend — „erst mal eine gute Nachricht, bleib neugierig".

> **Prompt:**
> Editorial lifestyle photograph, bright, light and calm, warm cream and soft golden light.
> A woman outdoors or by a large window, relaxed and at ease, subtle genuine smile, natural
> movement (walking, stretching, breathing). Fresh, airy, optimistic palette with gentle
> gold accents. Shallow depth of field, soft natural light, gentle grain. No text, no logos,
> no harsh shadows, no oversaturation. Premium wellness editorial mood. 16:9.

---

## Optional / später
- **Schmalere Varianten** (mobile 4:5) bei Bedarf — aktuell reicht ein 16:9-Bild je Band.
- **Einheitliches Model/Set** über A/B/C stärkt die Marke — Leo kann in den Prompts dieselbe
  Person/Location beibehalten.
- Nach Lieferung: Dateien in `app/assets/`, in `content.js → outcomes.list[].copy.heroImage`
  sind die Dateinamen bereits hinterlegt; ggf. `?v` in `index.html` hochzählen.
