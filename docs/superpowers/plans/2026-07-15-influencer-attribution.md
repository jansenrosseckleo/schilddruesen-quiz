# Influencer-Attribution (Linkster → Shopify → Quiz) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Quiz-Events (GTM/GA4) und Klaviyo-Leads tragen die Influencer-ID (= persönlicher Shopify-Rabattcode, z. B. `Brina10`) plus Klarname.

**Architecture:** Ein GTM-Custom-HTML-Tag auf miavola.de liest das Shopify-Cookie `discount_code`, spiegelt es als `mv_inf`-Cookie auf `.miavola.de` (90 Tage) und dekoriert Quiz-Links mit `?inf=<code>&utm_…`. Das Quiz (`app/app.js`) liest URL-Parameter > Cookie > sessionStorage, mappt Code→Name über `content.json → meta.influencers` und merged die Felder in jeden `dataLayer`-Push sowie in die Klaviyo-Profil-Properties.

**Tech Stack:** Vanilla JS (kein Build-Step), GTM (Container GTM-WQBJJR64), Klaviyo Client-API. Kein Test-Framework im Repo → Verifikation per `node --check`, JSON-Validierung und Browser-Checkliste.

## Global Constraints

- Attribution darf das Quiz **niemals** blockieren: alle neuen Pfade in try/catch, fire-and-forget (bestehende Konvention von `track()`/`subscribeKlaviyo()`).
- Engine (`app.js`) kennt keine Inhalte; das Mapping Code→Name lebt in `content.json → meta.influencers`.
- Alle Texte/Kommentare Deutsch mit voller Orthografie.
- Nach Änderung an `app.js`/`styles.css`: `?v=` in `app/index.html` hochzählen (27 → 28).
- Deploy erst fertig, wenn **beide** Ziele (GitHub Pages `gh-pages` + Cloudways `lp.miavola.de/quiz`) die neue `?v=`-Version ausliefern.
- Spec: `docs/superpowers/specs/2026-07-15-influencer-attribution-design.md`.

---

### Task 1: Mapping `meta.influencers` in content.json

**Files:**
- Modify: `app/content.json` (Objekt `meta`, direkt nach `"klaviyo": { … }`)

**Interfaces:**
- Produces: `C.meta.influencers` — Objekt `{ "<Rabattcode>": "<Influencer-Name>" }`, von Task 2 case-insensitiv gelesen.

- [ ] **Step 1: `meta.influencers` ergänzen**

In `app/content.json` innerhalb von `"meta"` nach dem `"klaviyo"`-Block einfügen (Komma beachten):

```json
    "influencers": {
      "Brina10": "brinabanko",
      "NO-CODE": "Linkster (ohne persönlichen Code)"
    }
```

`meta` sieht danach so aus:

```json
  "meta": {
    "placeholder": false,
    "placeholderLabel": "Entwurf · Inhalte vor Livegang HWG/EFSA-Freigabe",
    "klaviyo": {
      "companyId": "S2y7FE",
      "listId": "UEPkJi",
      "source": "Schilddrüsen-Quiz"
    },
    "influencers": {
      "Brina10": "brinabanko",
      "NO-CODE": "Linkster (ohne persönlichen Code)"
    }
  }
```

- [ ] **Step 2: JSON validieren**

Run: `python3 -m json.tool "app/content.json" > /dev/null && echo OK`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add app/content.json
git commit -m "Attribution: meta.influencers-Mapping (Rabattcode → Influencer-Name)"
```

---

### Task 2: Attribution in app.js (Erfassen, track(), Klaviyo) + Versions-Bump

**Files:**
- Modify: `app/app.js` (neuer Block vor dem TRACKING-Abschnitt ~Zeile 417; `track()` ~Zeile 421–424; `subscribeKlaviyo()` ~Zeile 906–917)
- Modify: `app/index.html` (Zeile 18: `styles.css?v=27` → `v=28`; Zeile 56: `app.js?v=27` → `v=28`)

**Interfaces:**
- Consumes: `C.meta.influencers` aus Task 1 (Lookup erst zur Laufzeit von `attributionParams()`, da `C` async lädt — `ATTR` selbst darf NICHT auf `C` zugreifen).
- Produces: `attributionParams()` → Objekt mit optionalen Feldern `influencer_id`, `influencer_name`, `utm_source`, `utm_medium`, `utm_campaign` (nur gesetzte Felder enthalten; leeres Objekt wenn keine Attribution).

- [ ] **Step 1: Attributions-Block einfügen**

In `app/app.js` direkt VOR dem Kommentarblock `/* ---------------- TRACKING (GTM dataLayer + Meta Pixel) ----------------` einfügen:

```js
  /* ---------------- ATTRIBUTION (Influencer / UTM) ----------------
     Woher kam die Besucherin? Quelle in dieser Priorität:
     URL-Parameter (?inf=<Rabattcode>&utm_…, vom GTM-Link-Decorator auf
     miavola.de angehängt) > Cookie mv_inf (von GTM auf .miavola.de
     gesetzt, auf lp.miavola.de lesbar) > sessionStorage (Reload-sicher).
     Fire-and-forget: Fehler dürfen das Quiz nie beeinflussen. */
  const ATTR_KEYS = ["inf", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  const ATTR = (() => {
    let attr = {};
    try { attr = JSON.parse(sessionStorage.getItem("quizAttribution") || "{}") || {}; } catch (e) {}
    try {
      const p = new URLSearchParams(location.search);
      ATTR_KEYS.forEach((k) => { const v = p.get(k); if (v) attr[k] = v; });
      if (!attr.inf) {
        const m = document.cookie.match(/(?:^|;\s*)mv_inf=([^;]+)/);
        if (m) attr.inf = decodeURIComponent(m[1]);
      }
    } catch (e) { /* Attribution nie blockierend */ }
    try {
      if (Object.keys(attr).length) sessionStorage.setItem("quizAttribution", JSON.stringify(attr));
    } catch (e) { /* z. B. Private Mode → still degradieren */ }
    return attr;
  })();

  // Attributions-Felder für dataLayer/Klaviyo. Name-Lookup läuft zur Laufzeit
  // (C lädt async) und case-insensitiv — Shopify-Rabattcodes sind nicht case-sensitiv.
  function attributionParams() {
    const out = {};
    try {
      if (ATTR.inf) {
        out.influencer_id = ATTR.inf;
        const map = (C && C.meta && C.meta.influencers) || {};
        const hit = Object.keys(map).find((k) => k.toLowerCase() === ATTR.inf.toLowerCase());
        if (hit) out.influencer_name = map[hit];
      }
      ["utm_source", "utm_medium", "utm_campaign"].forEach((k) => { if (ATTR[k]) out[k] = ATTR[k]; });
    } catch (e) { /* Attribution nie blockierend */ }
    return out;
  }
```

- [ ] **Step 2: `track()` erweitern**

In `track()` die dataLayer-Zeile ändern von:

```js
      window.dataLayer.push(Object.assign({ event: event }, params || {}));
```

zu:

```js
      window.dataLayer.push(Object.assign({ event: event }, attributionParams(), params || {}));
```

- [ ] **Step 3: `subscribeKlaviyo()` erweitern**

In `subscribeKlaviyo()` direkt nach dem `try/catch`-Block, der `props` aus `evaluate()` befüllt (nach `} catch (e) { /* Ergebnis-Properties sind optional */ }`), einfügen:

```js
    try { Object.assign(props, attributionParams()); } catch (e) { /* optional */ }
```

- [ ] **Step 4: `?v=` in index.html auf 28 heben**

`app/index.html`: `styles.css?v=27` → `styles.css?v=28` und `app.js?v=27` → `app.js?v=28`.

- [ ] **Step 5: Syntax prüfen**

Run: `node --check "app/app.js" && echo OK`
Expected: `OK`

- [ ] **Step 6: Commit**

```bash
git add app/app.js app/index.html
git commit -m "Attribution: Influencer-ID/UTM erfassen, an alle GTM-Events + Klaviyo-Props hängen; v=28"
```

---

### Task 3: Browser-Verifikation (lokal)

**Files:** keine Änderungen — reine Verifikation.

**Interfaces:**
- Consumes: `ATTR`/`attributionParams()` aus Task 2, Mapping aus Task 1.

- [ ] **Step 1: Preview-Server starten**

Run: `cd app && python3 -m http.server 8765` (Hintergrund)
Expected: Server läuft, `curl -s -o /dev/null -w "%{http_code}" http://localhost:8765/index.html` → `200`

- [ ] **Step 2: Checkliste im Browser (Leo oder Screenshot-Tool)**

`http://localhost:8765/?inf=Brina10&utm_source=linkster&utm_medium=influencer` öffnen, DevTools-Konsole:

1. `window.dataLayer` nach Klick auf „Quiz starten“ → letzter Push enthält
   `event: "quiz_start"`, `influencer_id: "Brina10"`, `influencer_name: "brinabanko"`,
   `utm_source: "linkster"`, `utm_medium: "influencer"`.
2. `sessionStorage.getItem("quizAttribution")` → JSON mit `inf`, `utm_source`, `utm_medium`.
3. Seite neu laden OHNE Parameter (`http://localhost:8765/`) → Quiz starten →
   Push enthält weiterhin die Attributions-Felder (sessionStorage-Fallback).
4. Neuer Tab (frische Session) `http://localhost:8765/` → Push enthält KEINE
   Attributions-Felder, keine Konsolen-Fehler.
5. `http://localhost:8765/?inf=UnbekannterCode` → Push enthält
   `influencer_id: "UnbekannterCode"`, aber kein `influencer_name`.

Expected: alle 5 Punkte wie beschrieben, keine Fehler in der Konsole.

- [ ] **Step 3: Server stoppen**

---

### Task 4: GTM-Tag-Code + Anleitung (`docs/gtm-influencer-attribution.md`)

**Files:**
- Create: `docs/gtm-influencer-attribution.md`

**Interfaces:**
- Consumes: Quiz erwartet `?inf=<code>` bzw. Cookie `mv_inf` (Task 2); Mapping-Pflege in `app/content.json → meta.influencers` (Task 1).

- [ ] **Step 1: Dokument anlegen** — vollständiger Inhalt:

````markdown
# GTM: Influencer-Attribution für das Schilddrüsen-Quiz

Anleitung für Container **GTM-WQBJJR64** (läuft auf miavola.de UND lp.miavola.de/quiz).
Hintergrund/Spec: `docs/superpowers/specs/2026-07-15-influencer-attribution-design.md`.

## Teil 1 — Tag „Quiz Attribution“ anlegen (einmalig, ~5 Minuten)

1. [tagmanager.google.com](https://tagmanager.google.com) öffnen → Container **GTM-WQBJJR64**.
2. Links **Tags** → **Neu** → Name: `Quiz Attribution – Cookie + Link-Decorator`.
3. **Tag-Konfiguration** → Typ **Benutzerdefiniertes HTML** → den kompletten Code unten einfügen.
4. **Trigger** → **DOM ist bereit** (falls nicht vorhanden: Trigger neu anlegen,
   Typ „DOM ist bereit“, alle Seiten). Das Skript selbst stellt sicher, dass es
   nur auf der Shopify-Domain etwas tut.
5. **Speichern** → oben rechts **Senden/Veröffentlichen**.

```html
<script>
(function () {
  try {
    var h = location.hostname;
    // Nur auf der Shopify-Domain laufen (der Container läuft auch auf dem Quiz).
    if (h === "lp.miavola.de" || !/(^|\.)miavola\.de$/.test(h)) return;

    // 1) Rabattcode lesen — Shopify setzt bei /discount/<CODE> das Cookie discount_code.
    var m = document.cookie.match(/(?:^|;\s*)discount_code=([^;]+)/);
    var code = m ? decodeURIComponent(m[1]) : "";

    // 2) Code als First-Party-Cookie auf .miavola.de spiegeln (90 Tage) —
    //    das Quiz auf lp.miavola.de kann es direkt lesen.
    if (code) {
      document.cookie = "mv_inf=" + encodeURIComponent(code) +
        "; domain=.miavola.de; path=/; max-age=" + 60 * 60 * 24 * 90 +
        "; SameSite=Lax; Secure";
    }

    // 3) UTM-Parameter der Ankunfts-URL merken (überleben so die Navigation im Tab).
    var utms = {};
    var found = false;
    var sp = new URLSearchParams(location.search);
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach(function (k) {
      var v = sp.get(k);
      if (v) { utms[k] = v; found = true; }
    });
    try {
      if (found) sessionStorage.setItem("mv_quiz_attr", JSON.stringify(utms));
      else utms = JSON.parse(sessionStorage.getItem("mv_quiz_attr") || "{}") || {};
    } catch (e) {}

    // 4) Alle Quiz-Links dekorieren: ?inf=<code>&utm_… anhängen (doppelter Boden
    //    zum Cookie + korrekte GA4-Kampagnen-Zuordnung auf dem Quiz).
    function decorate(a) {
      try {
        var u = new URL(a.href);
        if (u.hostname !== "lp.miavola.de" || u.pathname.indexOf("/quiz") !== 0) return;
        if (code) u.searchParams.set("inf", code);
        Object.keys(utms).forEach(function (k) { u.searchParams.set(k, utms[k]); });
        a.href = u.toString();
      } catch (e) {}
    }
    var links = document.querySelectorAll('a[href*="lp.miavola.de/quiz"]');
    for (var i = 0; i < links.length; i++) decorate(links[i]);
    document.addEventListener("click", function (ev) {
      var t = ev.target;
      var a = t && t.closest ? t.closest('a[href*="lp.miavola.de/quiz"]') : null;
      if (a) decorate(a);
    }, true);
  } catch (e) {}
})();
</script>
```

## Teil 2 — GA4: Event-Parameter sichtbar machen (~10 Minuten)

Damit `influencer_id`/`influencer_name` in GA4-Berichten auftauchen:

1. **GTM, Variablen anlegen** (Typ „Datenschichtvariable“), je einmal:
   `influencer_id`, `influencer_name`, `utm_source`, `utm_medium`, `utm_campaign`
   (Variablenname = Datenschichtvariablen-Name, Version 2).
2. **GTM, GA4-Event-Tags erweitern:** In jedem GA4-Tag, das die Quiz-Events
   (`quiz_start`, `quiz_complete`, `quiz_lead`) an GA4 meldet, unter
   **Event-Parameter** hinzufügen: Parametername `influencer_id` → Wert
   `{{influencer_id}}` (analog für die übrigen vier).
3. **GA4-Admin → Benutzerdefinierte Definitionen → Benutzerdefinierte Dimension
   erstellen**, zweimal: Dimensionsname `Influencer ID`, Umfang **Ereignis**,
   Ereignisparameter `influencer_id` — und analog `Influencer Name` / `influencer_name`.
   (utm_* braucht keine Dimension — das macht GA4 über die Kampagnen-Berichte selbst.)
4. Veröffentlichen. Prüfung: GA4 **DebugView** (siehe Teil 4).

## Teil 3 — Mapping pflegen: Rabattcode → Influencer-Name

Die Zuordnung lebt in `app/content.json → meta.influencers`:

```json
"influencers": {
  "Brina10": "brinabanko",
  "NO-CODE": "Linkster (ohne persönlichen Code)"
}
```

- **Neuer Influencer:** Zeile ergänzen (`"Code": "Name"`), dann Quiz deployen
  (beide Ziele!). Unbekannte Codes werden trotzdem als `influencer_id` getrackt —
  es geht nur der Klarname verloren, nichts ist kaputt.
- **⚠️ Influencer ohne persönlichen Code** laufen alle über `/discount/NO-CODE`
  und sind NICHT unterscheidbar. Fix: In der Linkster-Kampagne (Advertiser-Seite,
  campaign_id 510) pro Publisher einen persönlichen Shopify-Rabattcode als
  Ziel-URL hinterlegen (wie `Brina10`). Die Links der Influencer bleiben unverändert.
  Vorlage für den Linkster-Support:

  > Hallo, bitte hinterlegt in unserer Kampagne (ID 510, miavola) für jeden
  > Publisher eine individuelle Ziel-URL nach dem Muster
  > `https://miavola.de/discount/<PERSÖNLICHER-CODE>?redirect=/pages/schilddruesencheck`
  > — analog zur bestehenden Konfiguration des Publishers mit dem Code `Brina10`.
  > Hintergrund: Wir attribuieren Conversions über den Rabattcode; Publisher
  > ohne eigenen Code (`NO-CODE`) können wir aktuell nicht unterscheiden.

## Teil 4 — End-to-End-Test (nach GTM-Publish + Quiz-Deploy)

1. Echten Influencer-Link klicken (z. B. brinabanko: `https://serv.linkster.co/r/kEgK3FzDWM`).
2. Auf `miavola.de/pages/schilddruesencheck`: Cookie-Banner akzeptieren, dann in
   DevTools → Konsole: `document.cookie` muss `mv_inf=Brina10` enthalten.
3. „Jetzt Quiz starten“ klicken → Quiz-URL muss `?inf=Brina10` enthalten
   (falls nicht: Cookie greift trotzdem — weiter mit 4).
4. Im Quiz: Konsole → `window.dataLayer` → Einträge `quiz_start` etc. enthalten
   `influencer_id: "Brina10"` und `influencer_name: "brinabanko"`.
5. GA4 **DebugView** (Admin → DebugView, mit GTM-Preview verbunden): Events
   zeigen die Parameter.
6. Test-E-Mail im Quiz eintragen (Opt-in) → Klaviyo → Profil suchen →
   Eigenschaften `influencer_id`, `influencer_name`, `utm_source` vorhanden.
7. Negativtest: Quiz direkt öffnen (Inkognito, ohne Link) → Events ohne
   Attributions-Felder, Quiz funktioniert normal.

**Bekannte Einschränkung Consent:** Feuert GTM erst nach Einwilligung, greift
die Attribution nur für Besucherinnen, die dem Banner zustimmen — identisch zum
restlichen Tracking (GA4/Pixel), also konsistent.
````

- [ ] **Step 2: Commit**

```bash
git add docs/gtm-influencer-attribution.md
git commit -m "Docs: GTM-Tag + GA4-Anleitung für Influencer-Attribution"
```

---

### Task 5: Deploy auf beide Ziele

**Files:** keine Quell-Änderungen — Deployment gemäß CLAUDE.md.

- [ ] **Step 1: main pushen**

```bash
git push origin main
```

- [ ] **Step 2: GitHub Pages (gh-pages-Branch)**

```bash
git worktree add -B gh-pages /tmp/ghpages origin/gh-pages
rsync -a --exclude='.DS_Store' --exclude='.git' app/ /tmp/ghpages/
git -C /tmp/ghpages add -A && git -C /tmp/ghpages commit -m "Deploy: Influencer-Attribution (inf/UTM → GTM-Events + Klaviyo), v=28"
git -C /tmp/ghpages push origin gh-pages
git worktree remove /tmp/ghpages --force
```

Dann: `gh api repos/jansenrosseckleo/schilddruesen-quiz/pages/builds/latest --jq .status`
Expected: `built` (bei Hänger: `gh api -X POST repos/jansenrosseckleo/schilddruesen-quiz/pages/builds`)

- [ ] **Step 3: Cloudways (lp.miavola.de/quiz)**

```bash
source .env
lftp -u "$SFTP_USER,$SFTP_PW" -p "$SFTP_PORT" sftp://"$SFTP_HOST" \
  -e "set sftp:auto-confirm yes; mirror -R --delete --parallel=3 --exclude .DS_Store app/ public_html/quiz/; bye"
```

- [ ] **Step 4: Beide Ziele verifizieren**

```bash
curl -s "https://lp.miavola.de/quiz/index.html?cb=$(date +%s)" | grep -o 'app.js?v=[0-9]*'
curl -s "https://jansenrosseckleo.github.io/schilddruesen-quiz/index.html?cb=$(date +%s)" | grep -o 'app.js?v=[0-9]*'
```

Expected: beide `app.js?v=28`. Zusätzlich Live-Smoke-Test:
`https://lp.miavola.de/quiz/?inf=Brina10` → dataLayer-Check wie Task 3.

---

## Nach dem Plan (Leo, manuell — nicht automatisierbar)

1. GTM-Tag laut `docs/gtm-influencer-attribution.md` Teil 1 anlegen + veröffentlichen.
2. GA4-Variablen/Dimensionen laut Teil 2.
3. Vollständige Rabattcode-Liste liefern → `meta.influencers` erweitern (+ Deploy).
4. E2E-Test laut Teil 4; `NO-CODE`-Publisher via Linkster-Support umstellen (Teil 3).
