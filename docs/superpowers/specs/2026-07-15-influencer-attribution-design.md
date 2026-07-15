# Influencer-Attribution: Linkster → Shopify → Quiz — Design

**Datum:** 2026-07-15 · **Status:** Entwurf zur Freigabe

## Ziel

Jeder Quiz-Besuch, jedes Quiz-Event (Start, Abschluss, Lead) und jeder Klaviyo-Lead
soll dem Influencer zugeordnet werden können, über dessen Linkster-Link die Besucherin
gekommen ist — auswertbar in GA4 (per GTM) und am Klaviyo-Profil.

## Ausgangslage (verifiziert am 2026-07-15)

Redirect-Kette eines Influencer-Links (Beispiel brinabanko):

```
https://serv.linkster.co/r/kEgK3FzDWM
  → trck.linkster.co/trck/eclick/?campaign_id=510&…        (Linkster-Klicktracking)
  → miavola.de/discount/Brina10?redirect=/pages/schilddruesencheck&emid=<klick-id>
  → miavola.de/pages/schilddruesencheck?emid=<klick-id>
```

Messergebnisse:

1. **`emid` wechselt bei jedem Klick** (3× getestet, 3 Werte) → als Influencer-ID unbrauchbar.
2. **An `serv.linkster.co/r/…` angehängte Parameter** (`?linkster_id=…`, `?utm_…=…`)
   werden von der Redirect-Kette **verschluckt** — sie kommen auf der Shopify-Seite nicht an.
3. **Der Shopify-Discount-Redirect ist das stabile Unterscheidungsmerkmal:** Jeder
   Influencer-Link läuft über seinen persönlichen Rabattcode (`/discount/Brina10`).
   Shopify setzt dabei das Cookie `discount_code=Brina10` (Session-Cookie, `path=/`,
   **nicht** HttpOnly → per JavaScript lesbar).
4. Der Button „Jetzt Quiz starten" auf `miavola.de/pages/schilddruesencheck` ist ein
   statischer Link `<a href="https://lp.miavola.de/quiz/">` — Parameter gehen hier verloren.
5. miavola.de und das Quiz (lp.miavola.de/quiz + GitHub Pages) nutzen **denselben
   GTM-Container** `GTM-WQBJJR64`.

**Kernentscheidung:** Die Influencer-ID ist der **persönliche Shopify-Rabattcode**
(z. B. `Brina10`). Er ist stabil pro Influencer, kommt heute schon an und erfordert
keine Änderung an den Links der Influencer.

**Bekannte Lücke:** Influencer ohne persönlichen Code laufen über `/discount/NO-CODE`
(z. B. cherazbero) und sind untereinander **nicht unterscheidbar**. Abhilfe ist
organisatorisch (Baustein A): eigener Code pro Influencer in der Linkster-Kampagne.
Bis dahin werden sie gesammelt als `NO-CODE` → „Linkster (ohne persönlichen Code)" getrackt.

## Architektur — drei Bausteine

### Baustein A — Organisation (Leo, kein Code)

- Leo liefert die Mapping-Liste **Rabattcode ↔ Influencer-Name** (Start: `Brina10 → brinabanko`).
- Influencer mit `NO-CODE` erhalten perspektivisch eigene Codes (Linkster-Kampagnen-Config,
  Advertiser-seitig; die Influencer-Links selbst bleiben unverändert).
- Neue Influencer = neuer Eintrag in der Mapping-Liste (siehe Baustein C, `meta.influencers`).

### Baustein B — GTM-Tag „Quiz Attribution — Link Decorator" (miavola.de)

Custom-HTML-Tag im bestehenden Container `GTM-WQBJJR64`, Trigger **DOM Ready, alle Seiten**;
das Skript selbst guarded auf `location.hostname`, sodass es nur auf der Shopify-Domain
aktiv wird (der Container läuft auch auf dem Quiz).

Verhalten:

1. Liest `discount_code` aus `document.cookie` sowie `utm_source/medium/campaign/content/term`
   aus `location.search`.
2. Persistiert gefundene Werte in `sessionStorage` (`mv_quiz_attr`) — die UTM-Parameter
   überleben so auch Zwischen-Navigation auf miavola.de (das Cookie überlebt ohnehin).
3. Hängt die Werte an alle Links zu `lp.miavola.de/quiz` an:
   `?inf=<discount_code>&utm_source=…&…` — sowohl per DOM-Dekoration (DOM Ready) als
   auch per Klick-Listener in der Capture-Phase (fängt spät gerenderte Buttons).
4. Fehlertolerant: try/catch um alles; ohne Attributionsdaten bleibt der Link unverändert.

Kein eigenes Cookie, kein Shopify-/Theme-Eingriff. Einschränkung: Blockiert das
Consent-Banner GTM bis zur Einwilligung, greift die Dekoration erst nach Consent —
wird beim E2E-Test geprüft und im Ergebnis dokumentiert.

**Deliverable:** fertiger Tag-Code + Klick-für-Klick-GTM-Anleitung in
`docs/gtm-influencer-attribution.md`.

### Baustein C — Quiz (app/app.js + content.json)

1. **Erfassen (boot):** URL-Parameter `inf`, `utm_source`, `utm_medium`, `utm_campaign`,
   `utm_content`, `utm_term` lesen. Vorhandene URL-Werte überschreiben gespeicherte
   (Last-Touch); sonst Fallback auf `sessionStorage.quizAttribution` (überlebt Reloads).
   Kein Wert → keine Attribution (Quiz verhält sich exakt wie heute).
2. **Mapping:** `content.json → meta.influencers` = `{ "<code>": "<name>", … }`
   (case-insensitiver Lookup, da Shopify-Codes nicht case-sensitiv sind).
   Start-Einträge: `Brina10 → brinabanko`, `NO-CODE → Linkster (ohne persönlichen Code)`.
   Unbekannter Code: `influencer_id` wird getrackt, `influencer_name` entfällt —
   Liste nachpflegen genügt, keine Code-Änderung nötig.
3. **Tracking:** Die zentrale `track()`-Funktion (app.js) merged automatisch in **jeden**
   dataLayer-Push: `influencer_id`, `influencer_name`, `utm_source`, `utm_medium`,
   `utm_campaign` (nur gesetzte Felder). Betrifft `quiz_start`, `quiz_complete`, `quiz_lead`.
4. **Klaviyo:** `subscribeKlaviyo()` ergänzt die bestehenden `properties` um
   `influencer_id`, `influencer_name`, `utm_source`, `utm_medium`, `utm_campaign`.
5. **GTM/GA4-Konfiguration (Anleitung für Leo):** dataLayer-Variablen anlegen, an die
   GA4-Event-Tags als Event-Parameter hängen, in GA4 als Custom Dimensions
   (event-scoped: `influencer_id`, `influencer_name`) registrieren.
   Bonus: Da die Quiz-URL nun `utm_`-Parameter trägt, stimmt auch die
   GA4-Session-Attribution automatisch.

### Fehlerbehandlung

- Alle neuen Codepfade fire-and-forget bzw. try/catch — Attribution darf das Quiz
  **niemals** blockieren (bestehende Konvention von `track()`/`subscribeKlaviyo()`).
- `sessionStorage` nicht verfügbar (Private Mode o. Ä.) → Attribution nur aus URL, still degradieren.

### Datenschutz

- Es werden keine neuen Cookies gesetzt; genutzt werden ein von Shopify ohnehin
  gesetztes Cookie (lesend), URL-Parameter und `sessionStorage`.
- Getrackt wird ein pseudonymer Code (Rabattcode) — keine personenbezogenen Daten
  der Besucherin zusätzlich zu dem, was GTM/Pixel heute schon erfassen.

## Testplan

1. **Lokal:** `localhost:8765/?inf=Brina10&utm_source=linkster` → dataLayer prüfen
   (alle drei Events tragen die Felder), Reload-Persistenz, Durchlauf ohne Parameter unverändert.
2. **E2E nach Deploy + GTM-Publish:** echten brinabanko-Link klicken → Button →
   Quiz-URL enthält `inf=Brina10` → GTM Preview / GA4 DebugView zeigt Parameter →
   Test-Opt-in → Klaviyo-Profil trägt die Properties.
3. **Negativfall:** Direktaufruf des Quiz ohne Parameter → Events ohne Attributionsfelder, kein Fehler.

## Deploy

Wie in CLAUDE.md: beide Ziele (GitHub Pages `gh-pages` + Cloudways per lftp),
`?v=` in `index.html` hochzählen, Pages-Build prüfen.

## Außerhalb des Scopes

- Kauf-Attribution im Shop nach dem Quiz (Weitertragen der ID an Produktlinks) — von Leo
  vorerst nicht ausgewählt; später ergänzbar, da die Attribution im Quiz bereits vorliegt.
- Serverseitiges Tracking / Linkster-Postbacks.
