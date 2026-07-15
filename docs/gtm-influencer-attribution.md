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

---

## ⚠️ Update 2026-07-15: Umsetzung abweichend von Teil 1 — Shopify Custom Liquid statt GTM

Teil 1 (GTM-Tag) wurde NICHT umgesetzt, weil Leo keinen Zugriff auf den Container
GTM-WQBJJR64 hat (verwaltet vermutlich von tristan@tristanhahn.com; Leos Zugriff
beschränkt sich auf GTM-PGCZS7J6, der auf der Storefront nicht im Seiten-HTML läuft).

**Stattdessen live:** Eine verschlankte Variante des Skripts (ohne Hostname-Guard und
UTM-Zwischenspeicher) sitzt als **Custom-Liquid-Abschnitt** im Shopify-Customizer auf der
Vorlage `quiz-landing` (Seite `/pages/schilddruesencheck`, Theme „bd."). Funktion identisch:
`discount_code`-Cookie lesen → `mv_inf`-Cookie auf `.miavola.de` (90 Tage) → Quiz-Links
mit `?inf=<code>` dekorieren.

**E2E-verifiziert am 2026-07-15:** Linkster-Link → `?inf=Chariklia10` in der Quiz-URL →
Klaviyo-Profil mit `influencer_id: Chariklia10`. ✅

Weiterhin gültig: Teil 2 (GA4 — braucht Zugriff auf GTM-WQBJJR64, z. B. über Tristan),
Teil 3 (Mapping-Pflege + NO-CODE-Problem), Teil 4 (Testablauf). Wird das Theme gewechselt
oder die Seite neu aufgebaut, muss der Custom-Liquid-Abschnitt mit umziehen.
