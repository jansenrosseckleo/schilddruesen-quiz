/* ================================================================
   content.js — INHALTE des Schilddrüsen-Quiz
   ================================================================

   ⚠️  NICHT MEHR ENGINE-INPUT (Stand 2026-07-01):
       Die Engine (app.js) lädt Inhalte async aus »content.json« —
       generiert per  node -e "global.window={};require('./content.js');
       require('fs').writeFileSync('content.json',
       JSON.stringify(window.QUIZ_CONTENT,null,2)+'\n')".
       Diese Datei bleibt als lesbare/kommentierte Referenz erhalten.
       Künftig wird content.json über das Editor-Backend gepflegt.

   ⚠️  QUELLE DER WAHRHEIT für Inhalte sind die Dateien in /content/*.md.
       NICHTS hier erfinden.

   STAND:
   • flow (18 Fragen) = von Leo gelieferte Spec (Block A–G), 1:1 umgesetzt
     inkl. Anzeige-/Skip-Logik. Antwort-Wording & Design der Antwort-Steine
     werden im nächsten Schritt finalisiert.
   • outcomes / products / Ergebnis-Texte → weiterhin LEER → TODO-Ergebnisseite.
     Scoring/Personalisierung/Flags sind je Frage als `wirkung` dokumentiert,
     aber NICHT zu Ergebnissen verdrahtet (kommt mit outcomes.md).

   ── ANZEIGE-LOGIK (`showWhen`) — von der Engine interpretiert ──
   • "hasSymptoms"               → nur zeigen, wenn in den Symptomfragen
                                    (symptom:true) mind. 1 echtes Symptom gewählt ist
   • { q:"q12", inAnyOf:[0,1] }  → nur zeigen, wenn Antwort von q12 Index 0 oder 1 ist
   ── Multi-Optionen ──
   • exclusive:true  → „nichts davon"/„nein": schließt die anderen aus (und umgekehrt)
   ================================================================ */

window.QUIZ_CONTENT = {

  /* ----- META --------------------------------------------------- */
  meta: {
    // Sichtbares Entwurfs-Signal: Inhalte stehen, aber Compliance-Freigabe fehlt.
    // Auf false setzen, sobald HWG/EFSA-Freigabe erteilt ist.
    placeholder: true,
    placeholderLabel: "Entwurf · Inhalte vor Livegang HWG/EFSA-Freigabe",
  },

  /* ----- INTRO -------------------------------------------------- */
  intro: {
    badge: "Kostenlos",
    badgeWide: "Kostenlos · 3 Min",
    title: "Wie geht es deiner Schilddrüse?",
    lead: "Eine kostenlose Selbsteinschätzung. In wenigen Minuten bekommst du eine verständliche, ehrliche Einordnung deiner Situation — ganz ohne Diagnose-Versprechen.",
    leadWide: "Eine kostenlose Selbsteinschätzung mit verständlicher, ehrlicher Einordnung deiner Situation — ganz ohne Diagnose-Versprechen.",
    facts: [
      { icon: "clock", text: "Wenige Minuten, {N} kurze Fragen" },
      { icon: "arrow", text: "Dein Ergebnis sofort — verständlich erklärt" },
      { icon: "heart", text: "Mehrwert auch ohne Kauf" },
    ],
    cta: "Quiz starten",
    note: "Kein Login. Keine Diagnose. Du entscheidest, was du teilst.",
  },

  /* ================================================================
     FLOW — 18 Fragen, Block A–G (Spec von Leo)
     ================================================================ */
  flow: [

    /* ----- Block A · Einstieg ----- */

    // F0 — Biologisches Geschlecht (Personalisierung + Block-E-Gating; kein Scoring)
    { type: "single", id: "q0", cat: "Einstieg", wirkung: "Steuert Zyklus-Block (Block E); kein Score",
      q: "Welches biologische Geschlecht hast du?",
      sub: "Wir fragen das nur, weil dein Hormonhaushalt deine Schilddrüse direkt beeinflusst — dadurch sind manche Fragen nur für bestimmte Menschen relevant.",
      options: [
        { label: "Weiblich" },         // 0
        { label: "Männlich" },         // 1
        { label: "Keine Angabe" },     // 2
      ] },

    // F1 — Motivation
    { type: "single", id: "q1", cat: "Einstieg", wirkung: "Personalisierung (Ton)",
      q: "Was beschreibt am besten, warum du diesen Check machst?",
      options: [
        { label: "Ich fühle mich nicht wie ich selbst" },
        { label: "Ich habe konkrete Beschwerden" },
        { label: "Verdacht oder Fälle in der Familie" },
        { label: "Reine Vorsorge" },
      ] },

    // F2 — Diagnose-Status (verzweigt nicht)
    { type: "single", id: "q2", cat: "Einstieg", wirkung: "Personalisierung (Ergebnis-Ton) + später Produkt-Logik",
      q: "Wurde bei dir schon einmal eine Schilddrüsenerkrankung festgestellt?",
      options: [
        { label: "Nein, noch nie" },
        { label: "Nein, aber Verdacht" },
        { label: "Ja" },
      ] },

    /* ----- Block B · Symptome ----- */

    // F3 — Energie & Körpergefühl
    { type: "multi", id: "q3", cat: "Symptome", symptom: true, wirkung: "Scoring + Ergebnis",
      q: "Was trifft auf deine Energie und dein Körpergefühl zu?",
      sub: "Wähle alles, was zutrifft.",
      options: [
        { key: "muede",    label: "Müdigkeit" },
        { key: "gewicht",  label: "Gewichtszunahme / schwer abzunehmen" },
        { key: "frieren",  label: "Frieren" },
        { key: "antrieb",  label: "Antriebslosigkeit" },
        { key: "none",     label: "Nichts davon", exclusive: true },
      ] },

    // F4 — Haut, Haare & Äußeres
    // Annahme: „Nichts davon" ergänzt (in der Spec nicht gelistet) — für einheitliche
    // Skip-Logik über F3–F6. Bitte bestätigen/entfernen.
    { type: "multi", id: "q4", cat: "Symptome", symptom: true, wirkung: "Scoring + Ergebnis",
      q: "Was trifft auf Haut, Haare und Äußeres zu?",
      sub: "Wähle alles, was zutrifft.",
      options: [
        { key: "haut",     label: "Trockene Haut" },
        { key: "haare",    label: "Haarausfall" },
        { key: "naegel",   label: "Brüchige Nägel" },
        { key: "gesicht",  label: "Aufgedunsenes Gesicht" },
        { key: "none",     label: "Nichts davon", exclusive: true },
      ] },

    // F5 — Kopf & Stimmung
    { type: "multi", id: "q5", cat: "Symptome", symptom: true, wirkung: "Scoring + Ergebnis",
      q: "Was trifft auf Kopf und Stimmung zu?",
      sub: "Wähle alles, was zutrifft.",
      options: [
        { key: "fog",      label: "Brain Fog" },
        { key: "down",     label: "Niedergeschlagenheit" },
        { key: "unruhe",   label: "Innere Unruhe" },
        { key: "schlaf",   label: "Schlafprobleme" },
        { key: "none",     label: "Nichts davon", exclusive: true },
      ] },

    // F6 — Körper & Verdauung
    { type: "multi", id: "q6", cat: "Symptome", symptom: true, wirkung: "Scoring + Ergebnis (Verstopfung → ggf. Magenfreund)",
      q: "Was trifft auf Körper und Verdauung zu?",
      sub: "Wähle alles, was zutrifft.",
      options: [
        { key: "verstopfung", label: "Verstopfung" },
        { key: "schmerzen",   label: "Muskel- / Gelenkschmerzen" },
        { key: "schwaeche",   label: "Muskelschwäche" },
        { key: "wasser",      label: "Wassereinlagerungen" },
        { key: "none",        label: "Nichts davon", exclusive: true },
      ] },

    /* ----- Block C · Verlauf & Belastung (nur bei Symptomen) ----- */

    // F7 — Dauer
    { type: "single", id: "q7", cat: "Verlauf & Belastung", showWhen: "hasSymptoms",
      wirkung: "Scoring (anhaltend = stärker) + Dringlichkeit",
      q: "Seit wann bestehen diese Beschwerden ungefähr?",
      options: [
        { label: "Weniger als 3 Monate" },
        { label: "3–12 Monate" },
        { label: "Länger als 1 Jahr" },
        { label: "Nicht sicher" },
      ] },

    // F8 — Verlauf
    { type: "single", id: "q8", cat: "Verlauf & Belastung", showWhen: "hasSymptoms",
      wirkung: "Scoring (leicht) + Personalisierung",
      q: "Und wie entwickeln sie sich?",
      options: [
        { label: "Sie werden mehr" },
        { label: "Sie bleiben gleich" },
        { label: "Sie werden weniger" },
        { label: "Schwankend" },
      ] },

    // F9 — Alltags-Einschränkung
    { type: "single", id: "q9", cat: "Verlauf & Belastung", showWhen: "hasSymptoms",
      wirkung: "Personalisierung (Ton / Dringlichkeit)",
      q: "Wie stark schränken sie dich im Alltag ein?",
      options: [
        { label: "Kaum" },
        { label: "Etwas" },
        { label: "Deutlich" },
        { label: "Massiv" },
      ] },

    /* ----- Block D · Deine Erfahrung (nur Personalisierung, nur bei Symptomen) ----- */

    // F10 — Ernst genommen
    { type: "single", id: "q10", cat: "Deine Erfahrung", showWhen: "hasSymptoms",
      wirkung: "Personalisierung (validierende Ansprache)",
      q: "Hast du das Gefühl, mit deinen Beschwerden bisher ernst genommen zu werden?",
      options: [
        { label: "Ja, gut begleitet" },
        { label: "Teils abgetan" },
        { label: "Nicht ernst genommen" },
        { label: "Noch nicht angesprochen" },
      ] },

    // F11 — Fehl-Zuordnung
    { type: "multi", id: "q11", cat: "Deine Erfahrung", showWhen: "hasSymptoms",
      wirkung: "Personalisierung",
      q: "Hast du deine Beschwerden schon einmal auf etwas anderes geschoben?",
      sub: "Wähle alles, was zutrifft.",
      options: [
        { key: "stress",   label: "Stress" },
        { key: "alter",    label: "Alter / Wechseljahre" },
        { key: "familie",  label: "Familie / Muttersein" },
        { key: "anstellen",label: "„Ich stell mich nur an“" },
        { key: "none",     label: "Nein", exclusive: true },
      ] },

    /* ----- Block E · Zyklus & Hormone (nur bei q0 ∈ {weiblich, keine Angabe}) ----- */

    // F12 — Lebensphase
    { type: "single", id: "q12", cat: "Zyklus & Hormone", showWhen: { q: "q0", inAnyOf: [0, 2] },
      wirkung: "Personalisierung (Wechseljahre-Überlagerung) + Flag (Geburt < 12 Monate → Autoimmun-Hinweis). Nur bei q0 ∈ {weiblich, keine Angabe}.",
      q: "In welcher Lebensphase befindest du dich gerade?",
      options: [
        { label: "Regelmäßiger Zyklus" },          // 0
        { label: "Unregelmäßiger Zyklus" },         // 1
        { label: "Kinderwunsch / schwanger" },      // 2
        { label: "Geburt vor weniger als 12 Monaten" }, // 3
        { label: "Wechseljahre" },                  // 4
        { label: "Keine Menstruation (anderer Grund)" }, // 5
      ] },

    // F13 — Zyklusveränderungen (nur bei regelmäßigem/unregelmäßigem Zyklus)
    { type: "multi", id: "q13", cat: "Zyklus & Hormone", showWhen: { q: "q12", inAnyOf: [0, 1] },
      wirkung: "Scoring (stärkere Blutungen) + Personalisierung",
      q: "Hat sich an deiner Periode etwas verändert?",
      sub: "Wähle alles, was zutrifft.",
      options: [
        { key: "stark",   label: "Stärkere / längere Blutungen" },
        { key: "unregel", label: "Unregelmäßiger" },
        { key: "pms",     label: "Stärkeres PMS" },
        { key: "none",    label: "Keine Veränderung", exclusive: true },
      ] },

    /* ----- Block F · Risikofaktoren & körperliche Zeichen ----- */

    // F14 — Familie
    { type: "single", id: "q14", cat: "Risikofaktoren", wirkung: "Scoring + Autoimmun-Flag",
      q: "Gibt es in deiner Familie Schilddrüsen- oder Autoimmunerkrankungen?",
      options: [
        { label: "Ja, Schilddrüse" },
        { label: "Ja, andere Autoimmunerkrankung" },
        { label: "Nein" },
        { label: "Weiß nicht" },
      ] },

    // F15 — Eigene Autoimmunerkrankung
    { type: "single", id: "q15", cat: "Risikofaktoren", wirkung: "Scoring + Autoimmun-Flag",
      q: "Hast du selbst eine andere Autoimmunerkrankung?",
      options: [
        { label: "Ja" },
        { label: "Nein" },
        { label: "Weiß nicht" },
      ] },

    // F16 — Hals-/Kehlbereich
    { type: "multi", id: "q16", cat: "Risikofaktoren", wirkung: "Scoring + Personalisierung",
      q: "Bemerkst du etwas im Hals- oder Kehlbereich?",
      sub: "Wähle alles, was zutrifft.",
      options: [
        { key: "schwellung", label: "Schwellung / Druck" },
        { key: "kloss",      label: "Kloßgefühl / Schluckgefühl" },
        { key: "heiser",     label: "Heiserkeit" },
        { key: "none",       label: "Nein", exclusive: true },
      ] },

    /* ----- Block G · Werte & Selbstmessung ----- */

    // F17 — Blutwerte
    { type: "single", id: "q17", cat: "Werte & Selbstmessung", wirkung: "Action-Point-Steuerung",
      q: "Wurden bei dir in den letzten 12 Monaten die Schilddrüsenwerte überprüft?",
      options: [
        { label: "Ja, unauffällig" },
        { label: "Ja, kenne die Werte aber nicht" },
        { label: "Nein, noch nie" },
      ] },

    // F18 — Körpertemperatur (Barnes-Selbsttest)
    { type: "number", id: "q18", cat: "Werte & Selbstmessung",
      wirkung: "weicher Zusatz-Hinweis (niedrig ≈ <36,8 °C). Kein diagnostisches Kriterium.",
      q: "Kennst du deine Körpertemperatur — morgens direkt nach dem Aufwachen gemessen?",
      sub: "Miss am besten morgens, noch im Liegen. Die Basaltemperatur ist ein weicher, unterstützender Hinweis — kein Beweis.",
      unit: "°C", placeholder: "36,8", min: 34.0, max: 42.0,
      hint: "Gültig zwischen 34,0 und 42,0 °C. Komma oder Punkt sind okay.",
      skipLabel: "Das weiß ich nicht / noch nie gemessen",
      bands: [ { below: 36.8 }, { below: Infinity } ] }, // band:0 = niedrig, band:1 = normal/hoch
  ],

  /* ----- E-MAIL-CAPTURE (soft, optional, kein Gate) -------------
     ⚠️ Backend offen: Absenden speichert nur im State. CRM/Newsletter → TODO.md. */
  email: {
    eyebrow: "Fast geschafft",
    title: "Dein Ergebnis ist fertig.",
    lead: "Du bekommst es gleich direkt auf dem Bildschirm. Wenn du magst, schicken wir dir zusätzlich vertiefende Infos passend zu deinen Antworten per Mail.",
    placeholder: "deine@email.de",
    optInLabel: "Ja, schickt mir vertiefende Infos zu meinem Ergebnis. Abmeldung jederzeit.",
    cta: "Ergebnis ansehen",
    skip: "Direkt zum Ergebnis — ohne E-Mail",
    error: "Bitte gib eine gültige E-Mail-Adresse ein — oder geh ohne E-Mail weiter.",
  },

  /* ----- ANALYSE-ÜBERGANG --------------------------------------- */
  analysis: {
    title: "Wir werten deine<br>Antworten aus …",
    steps: ["Antworten zusammengeführt", "Muster erkennen …", "Einordnung vorbereiten"],
  },

  /* ================================================================
     OUTCOME-MODELL — Severity-Bänder (Spec §4–§5)
     Quelle: content/outcomes.md (Scoring) + content/results-copy.md (Texte).
     ⚠️ ENTWURF — vor Livegang HWG/EFSA-Freigabe. Schwellen = Richtwerte.
     ============================================================== */
  outcomes: {
    model: "severity",
    caps: { q16: 2 },                                  // Hals-/Kehl-Zeichen = eine Kategorie (+2)
    bands: [                                           // erster mit min ≤ total gewinnt
      { id: "A", min: 8 },                             // Deutliche Hinweise
      { id: "B", min: 4 },                             // Mögliche Hinweise (4–7)
      { id: "C", min: 0 },                             // Wenig Hinweise (<4)
    ],
    coreProductIds: ["produzent", "umwandler", "heldenduo"],  // jodhaltig → nur diagnostiziert

    // ── Signal-Mapping: Antwort-Identität → { score, flags? } ──
    signalRules: {
      // Symptome F3–F6: je gewähltes Symptom +1
      "q3.muede": { score: 1 }, "q3.gewicht": { score: 1 }, "q3.frieren": { score: 1 }, "q3.antrieb": { score: 1 },
      "q4.haut": { score: 1 }, "q4.haare": { score: 1 }, "q4.naegel": { score: 1 }, "q4.gesicht": { score: 1 },
      "q5.fog": { score: 1 }, "q5.down": { score: 1 }, "q5.unruhe": { score: 1 }, "q5.schlaf": { score: 1 },
      "q6.verstopfung": { score: 1 }, "q6.schmerzen": { score: 1 }, "q6.schwaeche": { score: 1 }, "q6.wasser": { score: 1 },
      // Verlauf & Dauer
      "q7.1": { score: 1 }, "q7.2": { score: 2 },       // 3–12 Mon / > 1 Jahr
      "q8.0": { score: 1 },                             // werden mehr
      // Zyklus & Hormone
      "q13.stark": { score: 1 },                        // stärkere/längere Blutungen
      // Risikofaktoren (+ Autoimmun-Flag)
      "q14.0": { score: 2, flags: ["autoimmune"] },     // Schilddrüse in Familie
      "q14.1": { score: 1, flags: ["autoimmune"] },     // andere Autoimmun in Familie
      "q15.0": { score: 2, flags: ["autoimmune"] },     // eigene Autoimmunerkrankung
      // Hals-/Kehl-Zeichen (Kategorie +2 via caps.q16)
      "q16.schwellung": { score: 2 }, "q16.kloss": { score: 2 }, "q16.heiser": { score: 2 },
      // Selbstmessung (weich)
      "q18.band:0": { score: 1 },                       // Temperatur niedrig (<36,8 °C)
      // Flag-only (kein Score)
      "q12.3": { flags: ["autoimmune"] },               // Geburt < 12 Monaten (postpartal)
    },

    // ── Welcher Risikofaktor wird im Autoimmun-Hinweis genannt (erster Treffer) ──
    autoimmuneFactors: [
      { when: { q: "q15", is: 0 }, phrase: "eine eigene Autoimmunerkrankung" },
      { when: { q: "q14", is: 0 }, phrase: "eine Schilddrüsenerkrankung in deiner Familie" },
      { when: { q: "q14", is: 1 }, phrase: "eine Autoimmunerkrankung in deiner Familie" },
      { when: { q: "q12", is: 3 }, phrase: "eine Geburt in den letzten 12 Monaten" },
    ],

    // ── Produkt-Auswahl: erste passende Regel (Details/Claims → products) ──
    // `reason` = kurze, personalisierte „warum passt das zu dir"-Begründung
    // (bezieht sich auf den Auswahlgrund; KEIN Heilversprechen — die zugelassene
    //  Wirkung steht separat in products[id].claims).
    productRules: [
      { productId: "magenfreund", when: { q: "q6", has: "verstopfung" },
        reason: "Du hast Verdauungsbeschwerden genannt — deshalb könnte der Magenfreund® zu dir passen." },
      { productId: "immungold", when: { flag: "autoimmune" },
        reason: "Bei dir spielen Autoimmun-Themen eine Rolle — deshalb könnte Immungold® mit Vitamin D zu dir passen." },
      { productId: "umwandler", when: { q: "q2", is: 2 },                  // core, nur diagnostiziert — Bestseller-Default bei Diagnose
        reason: "Deine Schilddrüse ist bereits diagnostiziert — als Ergänzung zu deiner ärztlichen Therapie könnte Der Umwandler® zu dir passen." },
      { productId: "kollagen", when: { q: "q4", hasAny: ["haut", "haare", "naegel", "gesicht"] },  // pending
        reason: "Du hast Veränderungen an Haut, Haaren oder Nägeln genannt — deshalb könnte Kollagen-MCT zu dir passen." },
      { productId: "aminos", when: { q: "q3", hasAny: ["muede", "antrieb"] },                       // pending
        reason: "Müdigkeit und Antrieb sind bei dir Thema — deshalb könnten essentielle Aminosäuren zu dir passen." },
    ],

    // ── Autoimmun-Hinweis (zusätzlich bei A/B, wenn Flag) ──
    autoimmuneBlock: {
      title: "Ein Hinweis zu deinen Angaben",
      text: [
        { text: "Einer deiner Angaben — {{autoimmuneFactor}} — gehört zu den bekannten Risikofaktoren für Hashimoto, die häufigste Ursache einer Unterfunktion in Deutschland." },
        { text: "Sprich das beim Arzt aktiv an und bitte ausdrücklich um die TPO-Antikörper; sie werden nicht immer automatisch mitbestimmt." },
      ],
    },

    prioritization: { secondaryThreshold: 1, maxSecondary: 2 },  // im Severity-Modell ungenutzt

    // ── Outcome-Liste (a–e-Texte aus results-copy.md) ──
    list: [
      /* ===== A — Deutliche Hinweise ===== */
      { id: "A", label: "Deutliche Hinweise", copy: {
        headerEyebrow: "Deine Einschätzung",
        title: "Deine Antworten zeigen deutliche Hinweise",
        validation: [
          { text: "Deine Antworten zeigen mehrere Anzeichen, die mit einer Schilddrüsenunterfunktion in Verbindung stehen können." },
          { when: { hasSymptoms: true }, text: "Konkret: {{symptoms}}." },
          { text: "Das ist keine Diagnose — aber genug, um es ernst zu nehmen und ärztlich abklären zu lassen." },
          { when: { q: "q2", is: 2 }, text: "Du hast bereits eine Diagnose — dann deuten deine Antworten darauf hin, dass du aktuell nicht optimal eingestellt sein könntest. Auch das gehört ärztlich besprochen." },
          { when: { anyOf: [{ q: "q10", is: 2 }, { q: "q11", hasAny: ["stress", "alter", "familie", "anstellen"] }] }, text: "Wenn du oft gehört hast, das sei „nur Stress“ oder „die Hormone“ — du bildest dir das nicht ein." },
        ],
        mech: {
          title: "Was dahinterstecken kann",
          text: [
            { text: "Die Schilddrüse steuert Stoffwechsel, Energie, Temperatur und Stimmung. Produziert sie zu wenig Hormone, zeigt sich das schleichend in genau solchen Beschwerden." },
            { when: { q: "q12", is: 4 }, text: "Gerade in den Wechseljahren werden solche Beschwerden leicht den Hormonen zugeschrieben — die Schilddrüse lohnt den gezielten Blick." },
            { when: { q: "q13", hasAny: ["stark", "unregel"] }, text: "Auch stärkere oder unregelmäßige Blutungen können mit der Schilddrüse zusammenhängen." },
          ],
          note: "Das ist eine Einordnung, keine Diagnose. Sicherheit gibt nur ein Blutbild.",
        },
        advice: [
          { icon: "doctor", title: "Sprich zeitnah mit ärztlicher Begleitung", text: "Nimm deine Beschwerden ernst und such dir zeitnah einen Termin." },
          { icon: "doctor", title: "Bitte gezielt um die richtigen Werte", text: "TSH, fT3, fT4 und TPO-Antikörper." },
          { when: { q: "q17", is: 0 }, icon: "observe", title: "Erwähne deine bisherigen Werte", text: "Sag, dass deine Werte als unauffällig galten, du aber weiter Beschwerden hast." },
          { when: { q: "q18", band: 0 }, icon: "observe", title: "Sprich deine Temperatur an", text: "Deine morgendliche Temperatur liegt eher niedrig — ein zusätzliches Zeichen, das du erwähnen kannst." },
          { when: { q: "q18", skipped: true }, icon: "observe", title: "Miss eine Woche morgens", text: "Liegt die Aufwach-Temperatur wiederholt unter ~36,8 °C, nimm die Werte mit zum Termin." },
        ],
        empower: { title: "Du musst da nicht allein durch.", text: "Mit den richtigen Werten bekommst du endlich Antworten — wir begleiten dich mit verständlichem Wissen." },
      } },

      /* ===== B — Mögliche Hinweise ===== */
      { id: "B", label: "Mögliche Hinweise", copy: {
        headerEyebrow: "Deine Einschätzung",
        title: "Deine Antworten zeigen einige mögliche Hinweise",
        validation: [
          { text: "Deine Antworten zeigen einige Anzeichen, die mit einer Unterfunktion in Verbindung stehen können — aktuell aber kein eindeutiges Bild." },
          { when: { hasSymptoms: true }, text: "Konkret: {{symptoms}}." },
          { text: "Keine Diagnose, kein Grund zur Sorge — aber ein guter Anlass, genauer hinzuschauen." },
          { when: { q: "q2", is: 2 }, text: "Du hast bereits eine Diagnose — dann lohnt der Blick, ob deine aktuelle Einstellung noch gut zu dir passt." },
        ],
        mech: {
          title: "Was dahinterstecken kann",
          text: [
            { text: "Viele dieser Beschwerden sind unspezifisch. Halten sie an oder werden mehr, lohnt ein gezielter Blick auf die Schilddrüse." },
            { when: { q: "q12", is: 4 }, text: "Gerade in den Wechseljahren werden solche Beschwerden leicht den Hormonen zugeschrieben — die Schilddrüse lohnt den gezielten Blick." },
            { when: { q: "q13", hasAny: ["stark", "unregel"] }, text: "Auch stärkere oder unregelmäßige Blutungen können mit der Schilddrüse zusammenhängen." },
          ],
          note: "Das ist eine Einordnung, keine Diagnose. Sicherheit gibt nur ein Blutbild.",
        },
        advice: [
          { icon: "observe", title: "Beobachte die nächsten Wochen", text: "Ein kurzes Beschwerde-Tagebuch hilft, Muster zu erkennen." },
          { icon: "doctor", title: "Sprich es beim nächsten Arztbesuch an", text: "Frag nach einer Basisdiagnostik (TSH, ggf. fT3/fT4)." },
          { when: { q: "q18", skipped: true }, icon: "observe", title: "Kleiner Selbsttest", text: "Miss eine Woche lang morgens deine Temperatur." },
        ],
        empower: { title: "Du musst nicht warten, bis es „schlimm genug“ ist.", text: "Wir geben dir das Wissen für ein gutes Gespräch." },
      } },

      /* ===== C — Wenig Hinweise (kein Produkt, kein Autoimmun-Block) ===== */
      { id: "C", label: "Wenig Hinweise", copy: {
        headerEyebrow: "Deine Einschätzung",
        title: "Aktuell sprechen deine Antworten für wenig Hinweise",
        validation: [
          { text: "Deine Antworten sprechen aktuell wenig für eine Unterfunktion. Erst einmal eine gute Nachricht." },
        ],
        mech: {
          title: "Trotzdem gut zu wissen",
          text: [
            { text: "Eine Unterfunktion kann sich schleichend entwickeln. Behalte im Blick: anhaltende Müdigkeit, Frieren, Gewichtsveränderungen, trockene Haut, Haarausfall oder Niedergeschlagenheit." },
          ],
          note: "Das ist eine Einordnung, keine Diagnose. Sicherheit gibt nur ein Blutbild.",
        },
        advice: [
          { icon: "doctor", title: "Bei neuen oder anhaltenden Beschwerden", text: "Treten solche Beschwerden neu auf oder halten an, sprich ärztlich darüber." },
          { when: { flag: "autoimmune" }, icon: "observe", title: "Risikofaktor im Blick behalten", text: "Weil {{autoimmuneFactor}} vorliegt, kann ein gelegentlicher Check sinnvoll sein." },
        ],
        empower: { title: "Bleib neugierig auf deinen Körper.", text: "Wir sind da, wenn du mehr wissen möchtest." },
      } },
    ],
  },

  /* ================================================================
     PRODUKT-REGISTRY (Spec §6) — Quelle: content/products.md
     ⚠️ EFSA-Claims = ENTWURF, Wortlaut vor Livegang gegen Register prüfen.
     `pending: true` → Engine zeigt das Produkt NICHT (Claim unbestätigt).
     ============================================================== */
  products: {
    magenfreund: {
      name: "Der Magenfreund®", sub: "Verdauungs-Komplex",
      text: "Eine ruhige Ergänzung, wenn deine Verdauung träge ist — kein Muss.",
      claims: ["Chlorid trägt zu einer normalen Verdauung bei, indem es zur Bildung von Magensäure beiträgt.<sup>1</sup>"],
      cta: "Mehr über den Magenfreund", link: "https://miavola.de/products/magenfreund",
      disclaimer: "Kein Muss. Bitte besprich Veränderungen mit deinem Arzt.",
    },
    immungold: {
      name: "Immungold®", sub: "Omega-3 + Vitamin D",
      text: "Wenn Autoimmun-Themen bei dir eine Rolle spielen, kann eine gute Vitamin-D-Versorgung sinnvoll sein.",
      claims: ["Vitamin D trägt zu einer normalen Funktion des Immunsystems bei.<sup>2</sup>"],
      cta: "Mehr über Immungold", link: "https://miavola.de/products/immungold",
      disclaimer: "Kein Muss. Bitte besprich Veränderungen mit deinem Arzt.",
    },
    produzent: {
      name: "Der Produzent®", sub: "Schilddrüsen-Komplex",
      image: "produzent-hero.png",
      text: "Für eine bereits diagnostizierte Schilddrüse — als Ergänzung zur ärztlichen Therapie, nicht als Ersatz.",
      claims: [
        "Jod trägt zu einer normalen Produktion von Schilddrüsenhormonen und zu einer normalen Funktion der Schilddrüse bei.<sup>3</sup>",
        "Selen trägt zu einer normalen Schilddrüsenfunktion bei.<sup>4</sup>",
      ],
      cta: "Mehr über den Produzenten", link: "https://miavola.de/products/der-produzent",
      disclaimer: "Enthält Jod — nicht bei Überfunktion/Basedow ohne ärztliche Rücksprache. Kein Ersatz für deine Therapie.",
    },
    umwandler: {
      name: "Der Umwandler®", sub: "Leber-Komplex",
      text: "Unterstützung rund um Leber und Hormon-Umwandlung — für diagnostizierte Verläufe.",
      claims: [
        "Cholin trägt zur Aufrechterhaltung einer normalen Leberfunktion bei.<sup>5</sup>",
        "Selen trägt zu einer normalen Schilddrüsenfunktion bei.<sup>4</sup>",
      ],
      cta: "Mehr über den Umwandler", link: "https://miavola.de/products/der-umwandler",
      disclaimer: "Kein Ersatz für deine Therapie. Bitte ärztlich besprechen.",
    },
    heldenduo: {
      name: "Das Heldenduo", sub: "Produzent + Umwandler",
      image: "heldenduo-30-tage.jpg",
      text: "Produzent und Umwandler im Set — für diagnostizierte Verläufe, die beides abdecken möchten.",
      claims: [
        "Jod trägt zu einer normalen Produktion von Schilddrüsenhormonen bei.<sup>3</sup>",
        "Selen trägt zu einer normalen Schilddrüsenfunktion bei.<sup>4</sup>",
      ],
      cta: "Mehr über das Heldenduo", link: "https://miavola.de/products/heldenduo",
      disclaimer: "Enthält Jod — nicht bei Überfunktion ohne ärztliche Rücksprache.",
    },
    // pending → Engine zeigt diese (noch) NICHT (EFSA-Claim unbestätigt, §9.5)
    kollagen: {
      name: "Kollagen-MCT", sub: "Kollagen + MCT",
      text: "Für Haut, Haare & Nägel.",
      claims: [], pending: true,
      cta: "Mehr über Kollagen-MCT", link: "https://miavola.de/products/kollagen-mct",
      disclaimer: "Kein Muss.",
    },
    aminos: {
      name: "Essentielle Aminosäuren", sub: "EAA-Komplex",
      text: "Bausteine für Energie & Muskeln.",
      claims: [], pending: true,
      cta: "Mehr über Essentielle Aminosäuren", link: "https://miavola.de/products/essentielle-aminosaeuren",
      disclaimer: "Kein Muss.",
    },
  },

  /* ----- ERGEBNISSEITE: statische UI-Bausteine (kein medizinischer Claim) */
  result: {
    headerEyebrow: "Deine Einschätzung",
    ctaSave: "Ergebnis per Mail sichern",
    restart: "Quiz neu starten",
    legalDisclaimer: "Dieses Quiz ersetzt keine ärztliche Untersuchung oder Diagnose. Bei anhaltenden Beschwerden wende dich bitte an deine Ärztin oder deinen Arzt.",
    todo: {
      banner: "Ergebnis-Modell noch nicht konfiguriert",
      bannerText: "Sobald content/outcomes.md, content/results-copy.md und content/products.md geliefert sind, erscheint hier das echte, education-first Ergebnis. Erfundene Inhalte werden bewusst nicht angezeigt.",
      sections: [
        { alpha: "a", label: "Das sehen wir bei dir (Validierung)", field: "outcome.copy.validation" },
        { alpha: "b", label: "Was wahrscheinlich los ist (Mechanismus)", field: "outcome.copy.mech" },
        { alpha: "c", label: "Was das für dich heißt (Action-Points)", field: "outcome.copy.advice" },
        { alpha: "d", label: "Ein möglicher nächster Schritt (Produkt)", field: "outcome.copy.productId → products.md" },
        { alpha: "e", label: "Empowerment", field: "outcome.copy.empower" },
      ],
      qaHeading: "Erfasste Antworten (für die Outcome-Definition)",
      productSlot: "TODO: Produkt aus Produkt↔Outcome-Mapping (content/products.md). Bis dahin wird kein Produkt empfohlen.",
    },
  },
};
