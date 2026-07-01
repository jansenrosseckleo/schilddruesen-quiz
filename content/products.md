# products.md — Produktrange, Eignung & EFSA-Claims

> **Status: Implementierungs-Entwurf nach Master-Spec §6.** Wird nach
> `app/content.js → products` (Registry) + `outcomes.productRules` (Auswahl, s. `outcomes.md`)
> übertragen. **EFSA-Claims vor Livegang im exakten Register-Wortlaut bestätigen** (§9.5).
>
> Behebt den Alt-Bug „falsches Produkt empfohlen": **kein hartcodiertes Produkt** mehr,
> Auswahl rein aus der Logik (`outcomes.productRules`), gegated nach Diagnose + Claim-Status.

---

## Prinzip (zwei Ebenen)

Medizinische Einschätzung (A/B/C + Action-Points) steht vorn. Produktblock ist
**sekundär, optional, nach den Action-Points** — „könnte zu dir passen", nie Haupt-CTA.
**Bei Ergebnis C: kein Produkt.**

### Eignungsregeln (§6)
- **Undiagnostiziert (F2 ≠ Ja):** nur allgemeine, symptombasierte Produkte. **Keine**
  Schilddrüsen-Kernprodukte (jodhaltig → Risiko bei möglicher Überfunktion). Arzt-Abklärung
  bleibt Haupt-CTA.
- **Diagnostiziert (F2 = Ja):** Schilddrüsen-Kernprodukte zulässig.
- **Harte Sicherung:** `coreProductIds = ["produzent","umwandler","heldenduo"]` — Engine zeigt
  diese nur bei F2 = „Ja" (doppelt: Regel-Bedingung **und** Engine-Gate).
- **`pending: true`** (unbestätigter Claim) → Produkt wird **nicht** gezeigt.

---

## Registry (`products[id]`)

```
"magenfreund": {
  name: "Der Magenfreund®", sub: "Verdauungs-Komplex",
  text: "Eine ruhige Ergänzung, wenn deine Verdauung träge ist — kein Muss.",
  claims: ["Chlorid trägt zu einer normalen Verdauung bei, indem es zur Bildung von Magensäure beiträgt.<sup>1</sup>"],
  cta: "Mehr über den Magenfreund", link: "https://miavola.de/products/magenfreund",
  disclaimer: "Kein Muss. Bitte besprich Veränderungen mit deinem Arzt.",
}

"immungold": {                       // §6 neu eingeführt (Omega-3 + Vitamin D), KEIN Jod
  name: "Immungold®", sub: "Omega-3 + Vitamin D",
  text: "Wenn Autoimmun-Themen bei dir eine Rolle spielen, kann eine gute Vitamin-D-Versorgung sinnvoll sein.",
  claims: ["Vitamin D trägt zu einer normalen Funktion des Immunsystems bei.<sup>2</sup>"],
  cta: "Mehr über Immungold", link: "https://miavola.de/products/immungold",
  disclaimer: "Kein Muss. Bitte besprich Veränderungen mit deinem Arzt.",
  // TODO: Katalog/Bild bestätigen (nicht im gefundenen Katalog).
}

"produzent": {                       // CORE — nur diagnostiziert
  name: "Der Produzent®", sub: "Schilddrüsen-Komplex",
  image: "produzent-hero.png",
  text: "Für eine bereits diagnostizierte Schilddrüse — als Ergänzung zur ärztlichen Therapie, nicht als Ersatz.",
  claims: [
    "Jod trägt zu einer normalen Produktion von Schilddrüsenhormonen und zu einer normalen Funktion der Schilddrüse bei.<sup>3</sup>",
    "Selen trägt zu einer normalen Schilddrüsenfunktion bei.<sup>4</sup>",
  ],
  cta: "Mehr über den Produzenten", link: "https://miavola.de/products/der-produzent",
  disclaimer: "Enthält Jod — nicht bei Überfunktion/Basedow ohne ärztliche Rücksprache. Kein Ersatz für deine Therapie.",
}

"umwandler": {                       // CORE — nur diagnostiziert · BESTSELLER, Default-Empfehlung bei Diagnose (Leo 2026-07-01)
  name: "Der Umwandler®", sub: "Leber-Komplex",
  text: "Unterstützung rund um Leber und Hormon-Umwandlung — für diagnostizierte Verläufe.",
  claims: [
    "Cholin trägt zur Aufrechterhaltung einer normalen Leberfunktion bei.<sup>5</sup>",
    "Selen trägt zu einer normalen Schilddrüsenfunktion bei.<sup>4</sup>",
  ],
  cta: "Mehr über den Umwandler", link: "https://miavola.de/products/der-umwandler",
  disclaimer: "Kein Ersatz für deine Therapie. Bitte ärztlich besprechen.",
}

"heldenduo": {                       // CORE-Bundle — nur diagnostiziert (nicht auto-empfohlen)
  name: "Das Heldenduo", sub: "Produzent + Umwandler",
  image: "heldenduo-30-tage.jpg",
  text: "Produzent und Umwandler im Set — für diagnostizierte Verläufe, die beides abdecken möchten.",
  claims: [
    "Jod trägt zu einer normalen Produktion von Schilddrüsenhormonen bei.<sup>3</sup>",
    "Selen trägt zu einer normalen Schilddrüsenfunktion bei.<sup>4</sup>",
  ],
  cta: "Mehr über das Heldenduo", link: "https://miavola.de/products/heldenduo",
  disclaimer: "Enthält Jod — nicht bei Überfunktion ohne ärztliche Rücksprache.",
}

"kollagen": {                        // PENDING — Claim unbestätigt → nicht gezeigt
  name: "Kollagen-MCT", sub: "Kollagen + MCT",
  text: "Für Haut, Haare & Nägel.",
  claims: [],            // ⛔ kein bestätigter EFSA-Claim → leer lassen
  pending: true,
  cta: "Mehr über Kollagen-MCT", link: "https://miavola.de/products/kollagen-mct",
  disclaimer: "Kein Muss.",
}

"aminos": {                          // PENDING — Claim unbestätigt → nicht gezeigt
  name: "Essentielle Aminosäuren", sub: "EAA-Komplex",
  text: "Bausteine für Energie & Muskeln.",
  claims: [],            // ⛔ kein bestätigter EFSA-Claim → leer lassen
  pending: true,
  cta: "Mehr über Essentielle Aminosäuren", link: "https://miavola.de/products/essentielle-aminosaeuren",
  disclaimer: "Kein Muss.",
}
```

---

## Auswahl-Logik
Siehe `outcomes.md §5` (`productRules` + `coreProductIds`). Kurz: erste passende Regel
gewinnt, `pending` wird übersprungen, Core nur bei Diagnose, Band C nie.

## Bilder (Bug #1) — Update 2026-07-01
Vorhanden in `app/assets/`: `produzent-hero.png`, `heldenduo-30-tage.jpg`.
**Erwartete Dateinamen** sind jetzt für alle sichtbaren Produkte in `content.js →
products[id].image` **hinterlegt** (Konvention `<id>-hero.png`): `magenfreund-hero.png`,
`immungold-hero.png`, `umwandler-hero.png`. Sobald Leo die Datei in `app/assets/` legt,
erscheint sie automatisch; bis dahin greift der `onerror`-Fallback (kein `<img>`, Block intakt).
`pending`-Produkte (kollagen, aminos) werden ohnehin nicht gezeigt — Dateinamen dennoch
vermerkt (`kollagen-hero.png`, `aminos-hero.png`). Specs → `content/graphics-spec.md`.

## EFSA-Claim-Register (Wortlaut final gegen VO (EU) 432/2012 bestätigen — §9.5)
- `[1]` Chlorid — normale Verdauung (Magensäure)
- `[2]` Vitamin D — normale Funktion des Immunsystems
- `[3]` Jod — normale Produktion von Schilddrüsenhormonen / normale Schilddrüsenfunktion
- `[4]` Selen — normale Schilddrüsenfunktion
- `[5]` Cholin — Aufrechterhaltung einer normalen Leberfunktion

### TODO (Leo / Compliance)
- [ ] EFSA-Claims im **exakten** zugelassenen Wortlaut + Quellennummer bestätigen.
- [ ] Kollagen-MCT & Aminosäuren: Claim liefern → `pending` entfernen, sonst bleiben sie ausgeblendet.
- [ ] Immungold: Katalog/Bild bestätigen (in §6 eingeführt, nicht im gefundenen Katalog).
- [ ] Produktlinks (miavola.de) bestätigen.
- [x] §9.2 Diagnose-Default final: **Umwandler** (Bestseller, Leo 2026-07-01). Produzent/Heldenduo bleiben in Registry, nicht auto-empfohlen.
- [ ] **Hero-Bild für den Umwandler liefern** — wird jetzt aktiv empfohlen, hat aber noch kein `image` (rendert sonst ohne Bild).
- [ ] Jod-/Selen-Eigeneinnahme abfragen → Gegen-Regel ergänzen.
