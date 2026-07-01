# Miavola Design System

A design system for **miavola** — a Berlin-based (monapure GmbH) supplement brand whose flagship products support thyroid health (*Schilddrüse*) and the connected liver pathway. The brand is German, female-leaning, premium-but-warm, and centred on trust, biochemistry literacy and a calm "studio" aesthetic.

## Sources

This system was distilled from the following inputs:

- **Website (live):** https://miavola.de/  — homepage, product pages (`/products/der-produzent`, `/products/der-umwandler`, `/products/das-heldenduo-60-tage-vorrat`, `/products/essentielle-aminosaeuren`, `/products/kollagen-mct`, `/products/der-magenfreund`), `/collections/komplexe`, `/pages/umwandler-inhaltsstoffe`.
- **Retail listings:** Amazon.de, medpex, DocMorris, Shop-Apotheke product pages (cross-checked copy, ingredient claims, EFSA wording).
- **Uploaded assets:** logo (black/white horizontal RGB), product packaging hero shots, lifestyle photography, bundle product graphics, garantie/guarantee compositions.
- No Figma file or codebase was provided. The system was reconstructed from packaging + photography + web copy.

## Products

| Product | Role | Color family | Day count |
|---|---|---|---|
| **Der Produzent®** | Schilddrüsen-Komplex (L-Tyrosin, Jod, Selen, Zink, Cordyceps…) | Wine / burgundy | 30 days, 60 caps |
| **Der Umwandler®** | Leber-Komplex (Glutathion, NAC, Mariendistel, Artischocke, CoQ10…) | Aubergine / muted plum | 30 days, 60 caps |
| **Das Heldenduo** | Bundle of Produzent + Umwandler | Dual wine + aubergine | 30 / 60 days |
| **Essentielle Aminosäuren** | EAA-Komplex, "Essentials" line | Cream / sage badge | ~30 days |
| **Kollagen-MCT** | Bioactive collagen + MCT pouch | Cream / butter seal | 30 portions |
| **Der Magenfreund®** | Verdauungs-Komplex (Löwenzahn, Kurkuma) | Forest green | 30 days |
| **Das Proteinbundle** | Bundle | — | — |
| **Schilddrüsen Masterclass** | Educational digital product | — | — |

## Index

- `colors_and_type.css` — design tokens (CSS custom properties) and base element styles
- `assets/` — logos, product packaging photography, lifestyle + product graphics
  - `assets/logos/` — `miavola-logo-horizontal-{black,white}.png`, `butterfly-mark.svg`
  - `assets/ornaments/butterflies/` — illustrative butterfly motif (trio + three individual crops) used as decorative brand element (see `preview/brand-butterflies.html`)
  - `assets/products/` — packaging hero shots for each product
  - `assets/lifestyle/` — model + studio shots used in editorial sections
  - `assets/graphics/` — bundle compositions, comparison graphics, guarantees
- `preview/` — design system cards (color, type, components, etc.) registered to the Design System tab
- `fonts/` — Cabinet Grotesk + Satoshi variable woff2
- `SKILL.md` — quick rules for any new Miavola design
- `README.md` — this file

## Content fundamentals

**Language.** German throughout the consumer-facing surface (English mirror exists on Amazon-international SKUs but the brand voice lives in German).

**Address.** Always **"du / dein / dir"** — direct, peer-to-peer, never "Sie". Examples surfaced from product pages: *"Bist du mit der Wirkung des Produktes nicht zufrieden, schicke einfach eine E-Mail an support@miavola.de"*, *"Du kannst es als Geschenk für deinen Körper, deine Leber und insgesamt dein Wohlbefinden ansehen."*, *"Wir empfehlen dir, vor der Einnahme mit deinem Arzt oder deiner Ärztin zu sprechen…"*.

**Tone.** Calm, knowledgeable, warmly clinical. Reads like a well-informed friend who happens to know biochemistry. Sentences are short and unrushed. Reassurance is foregrounded: *"Ganz einfach: …"*, *"Win-win."*, *"Auf jeden Fall."*. Disclaimers are present but never alarmist.

**Voice patterns.**
- Product names always carry the definite article: **Der Produzent®**, **Der Umwandler®**, **Das Heldenduo**, **Der Magenfreund®**. Never just "Produzent".
- Ingredients introduced with their function, not their hype: *"…liefert deinem Körper die wichtigsten Nährstoffe für eine gesunde Schilddrüse."* not *"Boost your thyroid!"*.
- EFSA-compliant function claims appear as small superscript-numbered footnotes (¹ ² ⁴ ⁵ …) directly below copy and again in a "Zugelassene Aussagen zur Wirkung" block. This is non-negotiable in the brand voice.
- Frequent "Wir empfehlen …" framing — guidance, not commands.
- Casing: Title case for headlines (**"In Ruhe testen mit unserer 90-Tage Geldzurück-Garantie"**), sentence case for body. **No ALL CAPS shouting** beyond tiny eyebrow chips like `ESSENTIALS` on packaging.

**Examples (copy, verbatim where lifted):**
- Hero: *"Zwei Nährstoffhelden, die sich ergänzen und gemeinsam mehr bewirken."*
- Promise: *"Gute Wahl für einen unbeschwerten Alltag"*
- Reassurance: *"In Ruhe testen mit unserer 90-Tage Geldzurück-Garantie"*
- FAQ-style: *"Soll ich neben dem Produzenten auch weiterhin meine Schilddrüsenmedikamente nehmen? Ja, auf jeden Fall! Bitte stoppe nicht mit der Einnahme deiner Medikamente."*
- Bundle pitch: *"Win-win."*

**Emoji.** Almost zero. A single **🚚** in the free-shipping bar (`Kostenloser Versand ab 50€ Bestellwert 🚚`) is the only one we see. The brand prefers icon glyphs and small ornamental marks (the butterfly).

**Numbers / units.** Decimal commas (German): `42,35 g`, `1,66 €`. Currency is `XX,XX €` with euro after the value. Day-counts: `30 Tage Vorrat`, `Täglich 2 Kapseln`. Discount discs always show `-XX %` with a hard hyphen-minus prefix.

## Visual foundations

**Colors.** A warm, cosmetic-pharmacy palette — three deep packaging tones (wine, aubergine, forest) plus a biscuit/blush studio backdrop, accented by buttery yellow discount discs and sage "Essentials" pills. There are *no* neon, no blue gradients, no purple — the saturation envelope sits firmly in earth-tone territory. Pure white is rare; surfaces lean cream (`#fbf7f2` → `#f5ede3`).

**Typography.** A single humanist geometric sans across the entire system, used in **Bold** for headlines and **Regular/Medium** for body. Headlines are tight (`-0.02em`), large, balanced, and almost always **left-aligned**. We've substituted **Inter Tight** from Google Fonts as the closest available match — see "Typography substitution" below.

**Backgrounds.** The dominant background is a near-uniform soft cream (`#fbf7f2` / `#f5ede3`). Photography is shot on the *same* cream so products dissolve into the page edge-to-edge. Full-bleed product shots are common; gradients are rare and never blue/purple. No repeating textures, no patterns, no hand-drawn illustration. The one decorative motif: a **gentle curved sweep** on every dose label that catches "light" (subtle white highlight) — see `.label-curve`.

**Animation.** Restrained. Marketing site uses fades and small `translateY` reveals on scroll, no bouncy/spring physics, no auto-playing video unless muted lifestyle. Tokens: `--dur-base: 220ms`, `--ease-out: cubic-bezier(0.22, 0.61, 0.36, 1)`.

**Hover states.** Primary CTA darkens (`wine-700` → `wine-800`). Secondary links underline-on-hover. Product cards lift `2px` and show `--shadow-md`. No color saturation jumps, no scale-up beyond `1.01`.

**Press states.** Translate down `1px` and use `--primary-active` (`wine-900`). No squish/scale animation.

**Borders.** Hairline `1px` in `--border` (`#d8cfc7`). Cards more often *float* on cream than wear a border; when they do, it's a single soft hairline.

**Shadows.** Two flavours: a neutral elevation set (`xs/sm/md/lg`) for UI, and a warm `--shadow-product` (`0 24px 60px rgba(74,31,42,0.18)`) tuned to the cream backdrop for product imagery. **No inner shadows.** **No glassmorphism / backdrop-blur** anywhere on the brand.

**Capsules vs gradients.** Strong preference for **solid color capsules** (pill badges) over gradient backgrounds. Eyebrow chips (`ESSENTIALS`, `BIO`) are sage or wine pills with white text. The discount disc is a flat butter-yellow circle (`#f4dc7a`) — no gradient, no shadow.

**Layout rules.** Full-bleed hero, content max-width `1280px`, generous vertical rhythm (`80–128px` between sections). Grid is 12-col with 24px gutters on desktop, single-col on mobile. Sticky elements: the top announcement bar and the primary nav.

**Transparency / blur.** Used essentially never. The label-curve highlight uses a `~12%` white overlay; that's the brand's entire transparency budget.

**Imagery vibe.** Warm, soft daylight; cream/blush backgrounds; female hands; muted neutrals; never grainy, never B&W, never cool-toned. Skin tones are visible, real, un-retouched-feeling. Product shots use the same cream backdrop so they composite cleanly into web sections.

**Corner radii.** `4 / 8 / 12 / 18 / 28 / 999`. The CTA on miavola.de is **fully pill** (`--radius-pill`). Cards use `--radius-lg` (`18px`). Inputs use `--radius-md` (`12px`).

**Cards.** Cream surface or white, `--radius-lg`, `--shadow-sm`, no border. Image fills top half, content in `--space-6` padding.

## Iconography

The brand uses **almost no decorative icons**. What it does use:

1. **The butterfly mark** — a stylised two-petal/two-wing glyph that doubles as the "i" dot in the wordmark and appears alone (white) on every product label and (black) on the cream pouch. Stored at `assets/logos/butterfly-mark.svg`. We've reconstructed it as a clean SVG — flag below.
2. **A small ✓ checkmark** in feature lists ("Vegan", "Made in Germany", "Laborgeprüft").
3. **The 🚚 emoji** in the announcement bar.
4. **Functional UI icons** (search, cart, hamburger, account, chevron, plus/minus) — thin-stroke (1.5px), rounded line caps. We use **Lucide** (CDN) as the default match: same humanist proportions, same stroke weight. If a custom icon is needed and not in Lucide, draw it at the same 24×24, stroke 1.5, rounded ends.

**Substitutions flagged:**
- The butterfly SVG in `assets/logos/butterfly-mark.svg` is a **simplified reconstruction** of the Miavola mark, drawn from photographs. Please replace with the official vector when available.
- Lucide stands in for any custom Miavola UI icon set we don't have.

## Typography

Miavola uses two typefaces, both provided by the brand:

- **Cabinet Grotesk** — display / headline. Used at Bold (700) for hero and section headlines, Medium (500) for sub-headlines and quieter display copy. Tight tracking (`-0.02em`), large sizes, left-aligned. Extrabold/Black are available in the variable font but are **not used** in the brand voice — keep things calm.
- **Satoshi** — text / UI. Regular (400) for body, Medium (500) for emphasis and small UI labels, Bold (700) for buttons.

Both are loaded as variable woff2 from `fonts/cabinet-grotesk/` and `fonts/satoshi/`. License files are included in the original Fontshare bundles (FFL).

## How designs use this system

- Pull tokens from `colors_and_type.css`. Don't redefine colors inline; reach for `--miavola-wine-700`, `--miavola-cream-100`, etc.
- Lift product photography from `assets/products/` directly. Don't re-render packaging in CSS.
- For decorative pages, the **butterfly mark** is the primary brand ornament — never invent new ornaments.
- Headlines: bold, large, tight tracking, left-aligned, sentence-case for short ones, title-case for long ones with a colon-and-clause structure.
- CTA: pill button, `--miavola-wine-700` background, white text, `--space-4 --space-8` padding.

---

## Iterations from review

The following patterns and assets were settled in design-review with the brand owner. They live in `supplementary_tokens.css` and complement the foundations above. Pull from these tokens when building new surfaces.

### Signature button shape

Buttons use an **asymmetric radius** — large on top-left & bottom-right, small on top-right & bottom-left. This is miavola's signature CTA silhouette; never use a plain pill or plain rounded-rect for a primary CTA. Inputs share the same shape, 4–6px tighter so they read as "contained" rather than "actionable".

```css
--mv-r-btn-sm:  20px 6px 20px 6px;
--mv-r-btn:     28px 8px 28px 8px;     /* default */
--mv-r-btn-lg:  34px 10px 34px 10px;
--mv-r-field:   22px 6px 22px 6px;
```

Use `.mv-btn` (`.mv-btn--ink|--burg|--ghost`, sizes `--sm|--lg|--block`) and `.mv-field` for default styling.

### Brand mark — butterfly (extracted)

The **butterfly** is part of the horizontal lockup but is also used standalone (favicons, avatars, stamps, guarantee cards, seals). Never use the parent-company "monapure" bildmarke; the miavola butterfly is a different glyph extracted from the horiz lockup.

- `assets/logos/miavola-butterfly-black.svg` — for light grounds
- `assets/logos/miavola-butterfly-white.svg` — for dark grounds
- Always balanced, never cropped, never rotated.
- Min sizes: 16px (favicon), 24px (inline), 40px (seals).

### Hand-drawn line icon system

The brand uses a **thin-stroke line-icon vocabulary** for product claims (e.g. "Mit Cholin für eine normale Leberfunktion", "Selen schützt die Zellen vor oxidativem Stress"). Drawn directly from a thyroid icon supplied by the brand:

- 24×25 viewBox
- 0.6 stroke weight
- single colour `#833241` (`--miavola-wine-700`)
- rounded `stroke-linecap` and `stroke-linejoin`
- **anatomical / botanical metaphors only** — no geometric primitives, no filled shapes, no rounded-square containers

Set: `assets/icons/thyroid.svg`, `liver.svg`, `cell-shield.svg`, `flask.svg`, `leaves.svg`. Draw new icons in this vocabulary when needed (likely future glyphs: droplet, heart, bone, brain, capsule, shield-cross). Use the `.mv-claim-list` / `.mv-claim-row` pattern to lay them out.

### Product catalog & family tints

The catalog is **10 SKUs across three categories**:

- **Signature** (Schilddrüse & Leber): Der Produzent®, Der Umwandler®, Das Heldenduo
- **Essentials**: Selen, Jod, Essentielle Aminosäuren, Der Magenfreund®, Kollagen + MCT, Immungold®
- **Bundles**: Protein Bundle (Aminosäuren + Kollagen MCT)

Every product has a paired **"Ruhe"-tint** (`--mv-tint-{slug}`) used as KV/hero background and on swatches. Each tint is a soft paper-toned variant of the product's label colour. Never use these tints for text containers, buttons, or general surfaces — only as backgrounds for product imagery.

### Trust seal — flat sticker

Sealing on packaging and PDPs uses a **flat circular sticker**: solid fill, black butterfly + black type, two arcs of copy with two em-dashes flanking the butterfly at 9 o'clock and 3 o'clock.

- **Never** use a gradient, drop-shadow, ring stroke, or 3D treatment.
- Fills: `--mv-seal-gold` (`#E8C659`, dense — Signature) and `--mv-seal-soft` (`#F2E084`, soft yellow — promo / number-led stickers).
- Two layouts: arced-copy + butterfly (trust) and big-numeral (promo: −15%, 30 Tage Vorrat, NEU).

### Knowledge card pattern

`.mv-knowledge` ("Schon gewusst?") — editorial sidebar inside PDPs, advertorials and emails. Always shows the heading "Schon gewusst?" and the miavola butterfly mark in the top-right as a quiet brand stamp. Two grounds: `--miavola-cream-100` (default) and `--miavola-wine-700` (`.mv-knowledge--burg`, for editorial contrast).

### Newsletter / inputs pattern

The newsletter block (sand background, centred copy, stacked field + dark CTA) is the canonical input pattern. Fields use the asymmetric `--mv-r-field` shape, the dark "Jetzt anmelden" CTA uses `.mv-btn--ink`. See `.mv-field` for default styling, error state, sizes (`sm` 11/16, `md` 16/22 default, `lg` 20/26).

### Guarantee card

`.mv-guarantee` — burgundy overlay on warm radial imagery, headline top, butterfly mark bottom-left, "100% Zufriedenheitsgarantie von miavola" signature line bottom-right. Min height 360px, used at full width inside PDPs and editorial sections.

### Illustrated butterfly ornament — decorative brand element

Separate from the mono **butterfly mark** (logo glyph), miavola has an **illustrative butterfly motif** — a painterly trio of two rosé/wine butterflies and one forest butterfly. Used as a soft, editorial **brand ornament**, never as a logo replacement.

- `assets/ornaments/butterflies/butterflies-trio.png` — full composition (889×885, transparent)
- `assets/ornaments/butterflies/butterfly-illustrated-rose-a.png` — small tilted rosé (288×274)
- `assets/ornaments/butterflies/butterfly-illustrated-forest.png` — large frontal forest (517×453)
- `assets/ornaments/butterflies/butterfly-illustrated-rose-b.png` — medium frontal rosé (344×346)

**Rules.** 1–3 per layout, only on cream / blush / soft product tints; mono `butterfly-mark.png` for anything dark or below 40px. Light rotation (±6°–14°) and bleeding off edges is encouraged. Never recolour, mirror, drop-shadow, or treat as a logo. See `preview/brand-butterflies.html` for the full pairing matrix and do/don'ts.

### Hero compositing — Produzent on tinted ground

To bring a Signature product (Produzent, with its existing burgundy label) into the **Essentials family** visual rhythm — flat tinted ground like Jod (sage), Selen (yellow), Immungold (amber) — composite the real product photo on a richer Produzent tint with `mix-blend-mode: multiply`. This drops out the studio background and unifies the hero with the rest of the line. Recommended grounds: `#E8D3D2` (signature), `#D9BFBE` (deeper editorial), `#EFDFDC` (softer).

### Iconography rules — what NOT to do

Reinforced from review: **no decorative SVG illustrations of products** (trying to "draw" a bottle or box in SVG looks amateur). When a hero needs the product, use the real photograph; when a hero needs a metaphor, use the thin-stroke icon vocabulary. The brand's whole aesthetic budget for "drawing" goes into the line-icon set — everything else is photography or typography.
