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

   STAND (2026-07-01):
   • flow = 18 Fragen (Block A–G) + 4 Info-Cards (type:"education", variant:"info")
     nach F7/F12/F15/F17 (Quelle: content/education.md) + Inline-„info"-Toggle je Frage.
     Anzeige-/Skip-Logik aktiv; Info-Cards sind reine Vorwärts-Einschübe.
   • outcomes / products / Ergebnis-Texte = KONFIGURIERT (Entwurf, meta.placeholder=true).
     Severity-Bänder A/B/C, personalisierte Segmente + bedingte Insights-Sektion,
     Hero-Bild je Band, Produkt-Auswahl mit rich-Text-`reason`.
     Quellen: content/outcomes.md · content/results-copy.md · content/products.md.

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
    // Entwurfs-Ribbon aus (Leo, 2026-07-03). Die HWG/EFSA-Freigabe selbst bleibt als Punkt in TODO.md.
    placeholder: false,
    placeholderLabel: "Entwurf · Inhalte vor Livegang HWG/EFSA-Freigabe",
    // Klaviyo-Anbindung (Opt-in auf dem E-Mail-Screen; client-seitig, kein Backend)
    klaviyo: {
      companyId: "QQjWAk",              // Public API Key (Site-ID) des miavola-Kontos
      listId: "UEPkJi",                 // Liste „Schilddrüsen-Quiz Leads (neu)" — Double-Opt-in via Klaviyo
      source: "Schilddrüsen-Quiz",      // custom_source am Profil
    },
  },

  /* ----- INTRO -------------------------------------------------- */
  intro: {
    badge: "Kostenlos",
    badgeWide: "Kostenlos · 3 Min",
    title: "Wie geht es deiner Schilddrüse?",
    lead: "Eine kostenlose Selbsteinschätzung. In wenigen Minuten bekommst du eine verständliche, ehrliche Einordnung deiner Situation, ganz ohne Diagnose-Versprechen.",
    leadWide: "Eine kostenlose Selbsteinschätzung mit verständlicher, ehrlicher Einordnung deiner Situation, ganz ohne Diagnose-Versprechen.",
    facts: [
      { icon: "clock", text: "Wenige Minuten, {N} kurze Fragen" },
      { icon: "arrow", text: "Dein Ergebnis sofort, verständlich erklärt" },
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
      sub: "Wir fragen das nur, weil dein Hormonhaushalt deine Schilddrüse direkt beeinflusst. Dadurch sind manche Fragen nur für bestimmte Menschen relevant.",
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
        { key: "gewicht",  label: "Gewichtszunahme / schwer abzunehmen", inlineLabel: "Gewichtszunahme" },
        { key: "frieren",  label: "Frieren" },
        { key: "kalt",     label: "Kalte Hände und Füße", inlineLabel: "kalte Hände und Füße" },
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
        { key: "haut",     label: "Trockene Haut", inlineLabel: "trockene Haut" },
        { key: "haare",    label: "Haarausfall" },
        { key: "naegel",   label: "Brüchige Nägel", inlineLabel: "brüchige Nägel" },
        { key: "rillen",   label: "Längsrillen in den Fingernägeln", inlineLabel: "Längsrillen in den Fingernägeln" },
        { key: "brauen",   label: "Ausdünnen der Augenbrauen (außen)", inlineLabel: "ausgedünnte Augenbrauen" },
        { key: "gesicht",  label: "Aufgedunsenes Gesicht", inlineLabel: "ein aufgedunsenes Gesicht" },
        { key: "none",     label: "Nichts davon", exclusive: true },
      ] },

    // F5 — Kopf & Stimmung
    { type: "multi", id: "q5", cat: "Symptome", symptom: true, wirkung: "Scoring + Ergebnis",
      q: "Was trifft auf Kopf und Stimmung zu?",
      sub: "Wähle alles, was zutrifft.",
      info: "Mit „Brain Fog“ ist ein benommenes, vernebeltes Gefühl im Kopf gemeint: Du bist zerstreut, vergisst Dinge oder kannst dich schlechter konzentrieren als sonst.",
      options: [
        { key: "fog",      label: "Brain Fog" },
        { key: "down",     label: "Niedergeschlagenheit" },
        { key: "unruhe",   label: "Innere Unruhe", inlineLabel: "innere Unruhe" },
        { key: "schlaf",   label: "Schlafprobleme" },
        { key: "none",     label: "Nichts davon", exclusive: true },
      ] },

    // F6 — Körper & Verdauung
    { type: "multi", id: "q6", cat: "Symptome", symptom: true, wirkung: "Scoring + Ergebnis (Verstopfung → ggf. Magenfreund)",
      q: "Was trifft auf Körper und Verdauung zu?",
      sub: "Wähle alles, was zutrifft.",
      options: [
        { key: "verstopfung", label: "Verstopfung" },
        { key: "schmerzen",   label: "Muskel- / Gelenkschmerzen", inlineLabel: "Muskel- oder Gelenkschmerzen" },
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

    // ── Info-Card nach F7 (immer — auch ohne Symptome sinnvoll) ──
    { type: "education", variant: "info", id: "eduSchaltzentrale",
      graphic: "edu-schaltzentrale.png",
      graphicAlt: "Die Schilddrüse beeinflusst viele Körperfunktionen gleichzeitig",
      eyebrow: "Gut zu wissen",
      title: "Deine Schilddrüse: die Schaltzentrale des Körpers",
      text: "Die Schilddrüse ist nur wenige Zentimeter groß, aber ihre Hormone wirken praktisch überall: Sie beeinflussen Energie, Körpertemperatur, Herzschlag, Verdauung, Haut und Haare, sogar Stimmung und Konzentration. Arbeitet sie langsamer, kann sich das an vielen Stellen gleichzeitig bemerkbar machen. Genau deshalb fragen wir so breit durch den ganzen Körper.",
      cta: "Weiter" },

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

    // ── Info-Card nach F12 (nur weiblich/keine Angabe — erbt Geschlechts-Gate von F12) ──
    { type: "education", variant: "info", id: "eduHormone",
      showWhen: { q: "q0", inAnyOf: [0, 2] },
      graphic: "edu-hormone.png",
      graphicAlt: "Hormonhaushalt und Schilddrüse verursachen überlappende Beschwerden",
      eyebrow: "Gut zu wissen",
      title: "Hormone und Schilddrüse sprechen dieselbe Sprache",
      text: "Müdigkeit, Gewichtsveränderungen, Stimmungstiefs oder ein veränderter Zyklus werden oft allein den Wechseljahren oder „den Hormonen“ zugeschrieben. Dahinter kann aber auch die Schilddrüse stecken, denn die Beschwerden ähneln sich stark. Genau deshalb lohnt es sich, beides im Blick zu behalten, statt vorschnell einzuordnen.",
      cta: "Weiter" },

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
      info: "Autoimmunerkrankungen sind Erkrankungen, bei denen sich das Immunsystem gegen den eigenen Körper richtet, zum Beispiel Hashimoto, Rheuma, Typ-1-Diabetes, Zöliakie oder Schuppenflechte. Gemeint sind Fälle bei Eltern, Geschwistern oder Großeltern.",
      options: [
        { label: "Ja, Schilddrüse" },
        { label: "Ja, andere Autoimmunerkrankung" },
        { label: "Nein" },
        { label: "Weiß nicht" },
      ] },

    // F15 — Eigene Autoimmunerkrankung
    { type: "single", id: "q15", cat: "Risikofaktoren", wirkung: "Scoring + Autoimmun-Flag",
      q: "Hast du selbst eine andere Autoimmunerkrankung?",
      info: "Gemeint ist eine Autoimmunerkrankung bei dir selbst, zum Beispiel Hashimoto (eine Autoimmunerkrankung der Schilddrüse), Rheuma, Typ-1-Diabetes, Zöliakie oder Schuppenflechte. Solche Erkrankungen treten häufiger gemeinsam auf.",
      options: [
        { label: "Ja" },
        { label: "Nein" },
        { label: "Weiß nicht" },
      ] },

    // ── Info-Card nach F15 (immer) — Abstand zur Hormon-Card (nach F12); F14+F15 dazwischen ──
    { type: "education", variant: "info", id: "eduHashimoto",
      graphic: "edu-hashimoto.png",
      graphicAlt: "Hashimoto ist die häufigste Ursache und tritt familiär gehäuft auf",
      eyebrow: "Gut zu wissen",
      title: "Die häufigste Ursache heißt Hashimoto",
      text: "Die meisten Schilddrüsenunterfunktionen in Deutschland entstehen durch Hashimoto, eine Autoimmun-Reaktion, bei der der Körper die eigene Schilddrüse angreift. Sie tritt familiär gehäuft auf: Gibt es Fälle in deiner Familie, kann dein eigenes Risiko erhöht sein. Kein Grund zur Sorge, aber ein guter Grund, aufmerksam zu sein.",
      cta: "Weiter" },

    // F16 — Hals-/Kehlbereich
    { type: "multi", id: "q16", cat: "Risikofaktoren", wirkung: "Scoring + Personalisierung",
      q: "Bemerkst du etwas im Hals- oder Kehlbereich?",
      sub: "Wähle alles, was zutrifft.",
      info: "Taste dazu locker deinen vorderen Hals unterhalb des Kehlkopfs ab und schluck einmal. Achte auf eine sichtbare Schwellung, ein Druck- oder Enge-Gefühl oder das Gefühl, einen „Kloß“ zu schlucken.",
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
      info: "Gemeint ist eine Blutabnahme, bei der Schilddrüsenwerte bestimmt wurden, meist der TSH-Wert, manchmal auch fT3/fT4. „Unauffällig“ heißt: die Werte lagen im Normbereich.",
      options: [
        { label: "Ja, unauffällig" },                    // 0
        { label: "Ja, auffällig" },                      // 1 → Band-Override A (ärztlicher Befund)
        { label: "Ja, kenne die Werte aber nicht" },     // 2
        { label: "Nein, noch nie" },                     // 3
      ] },

    // ── Info-Card nach F17 (immer) ──
    { type: "education", variant: "info", id: "eduTsh",
      graphic: "edu-tsh.png",
      graphicAlt: "Ein einzelner Normwert wie TSH schließt nicht alles aus",
      eyebrow: "Gut zu wissen",
      title: "Ein „normaler“ TSH ist nicht das ganze Bild",
      text: "Bei einem Verdacht wird oft nur der TSH-Wert bestimmt. Der kann im Normbereich liegen, obwohl die Schilddrüse noch nicht rund läuft, etwa am Anfang von Hashimoto. Ein vollständigeres Bild geben zusätzliche Werte wie fT3, fT4 und die TPO-Antikörper. Gut zu wissen fürs nächste Arztgespräch.",
      cta: "Weiter" },

    // F18 — Körpertemperatur (Barnes-Selbsttest)
    { type: "number", id: "q18", cat: "Werte & Selbstmessung",
      wirkung: "weicher Zusatz-Hinweis (niedrig ≈ <36,8 °C). Kein diagnostisches Kriterium.",
      q: "Kennst du deine Körpertemperatur, morgens direkt nach dem Aufwachen gemessen?",
      sub: "Miss am besten morgens, noch im Liegen. Deine Basaltemperatur ist ein weicher Zusatz-Hinweis, kein Beweis und ersetzt keine ärztliche Untersuchung.",
      info: "So misst du richtig: Miss deine Temperatur morgens direkt nach dem Aufwachen (noch im Liegen), mittags und abends, möglichst zu ähnlichen Uhrzeiten. Notiere alle drei Werte pro Tag und bilde daraus den Tagesdurchschnitt. Bleib eine Woche dran, also an sieben Tagen hintereinander. Aus den sieben Tagesdurchschnitten bildest du am Ende deinen Wochendurchschnitt. Wenn du noch deine Periode hast, miss vier Wochen lang, weil deine Körpertemperatur über den Zyklus schwankt.",
      unit: "°C", placeholder: "36,8", min: 34.0, max: 42.0,
      hint: "Gültig zwischen 34,0 und 42,0 °C. Komma oder Punkt sind okay.",
      skipLabel: "Das weiß ich nicht / noch nie gemessen",
      bands: [ { below: 36.8 }, { below: Infinity } ] }, // band:0 = niedrig, band:1 = normal/hoch
  ],

  /* ----- E-MAIL-CAPTURE (soft, optional, kein Gate) -------------
     Feld leer → direkt weiter. Mail + Opt-in → Klaviyo-Subscribe (meta.klaviyo),
     fire-and-forget: ein Fehler blockiert nie den Weg zum Ergebnis. */
  email: {
    eyebrow: "Fast geschafft",
    title: "Dein Ergebnis ist fertig.",
    lead: "Du bekommst es gleich direkt auf dem Bildschirm. Wenn du magst, schicken wir dir zusätzlich vertiefende Infos passend zu deinen Antworten per Mail.",
    placeholder: "deine@email.de",
    optInLabel: "Ja, schickt mir vertiefende Infos zu meinem Ergebnis. Abmeldung jederzeit.",
    cta: "Ergebnis ansehen",
    error: "Bitte gib eine gültige E-Mail-Adresse ein oder lass das Feld leer.",
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

    // ── Band-Overrides: ärztlicher Befund schlägt Score (erster Treffer gewinnt) ──
    // Das Quiz widerspricht keinem Arzt: Diagnose oder auffällige Werte → immer Band A.
    bandOverrides: [
      { when: { q: "q2", is: 2 }, band: "A" },         // Schilddrüsenerkrankung diagnostiziert
      { when: { q: "q17", is: 1 }, band: "A" },        // Werte in den letzten 12 Monaten auffällig
    ],
    coreProductIds: ["produzent", "umwandler", "heldenduo"],  // jodhaltig → nur diagnostiziert

    // ── Signal-Mapping: Antwort-Identität → { score, flags? } ──
    signalRules: {
      // Symptome F3–F6: je gewähltes Symptom +1
      "q3.muede": { score: 1 }, "q3.gewicht": { score: 1 }, "q3.frieren": { score: 1 }, "q3.kalt": { score: 1 }, "q3.antrieb": { score: 1 },
      "q4.haut": { score: 1 }, "q4.haare": { score: 1 }, "q4.naegel": { score: 1 }, "q4.rillen": { score: 1 }, "q4.brauen": { score: 1 }, "q4.gesicht": { score: 1 },
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
    // `reason` = personalisierte „warum passt das zu dir"-Begründung als rich-Text-Array
    //  [{ text, when? }] (2–4 modulare Sätze, gerendert über rich()). Aufbau: warum
    //  ausgewählt → wie es zu deiner Situation passt → sanfter „kein Muss"-Rahmen.
    //  KEIN Heilversprechen; zugelassene Wirkung steht separat in products[id].claims
    //  (wird hier NICHT wiederholt). Modularitäts-Regel: kein Segment verweist auf ein
    //  nachfolgendes. Tokens ({{autoimmuneFactor}}) erlaubt.
    productRules: [
      // Diagnose zuerst (Leo, 2026-07-03): Diagnostizierte bekommen immer Umwandler + Produzent,
      // nie Immungold — das Autoimmun-Flag feuerte vorher zu breit (z. B. Familie).
      { productId: "umwandler", when: { q: "q2", is: 2 },                  // core, nur diagnostiziert — Bestseller-Default bei Diagnose
        reason: [
          { text: "Deine Schilddrüse ist bereits ärztlich diagnostiziert. Dann geht es vor allem darum, sie im Alltag gut zu begleiten." },
          { text: "Der Umwandler® ist der Leber-Komplex aus unserer Range, gedacht als Ergänzung zu deiner ärztlichen Therapie, nicht als Ersatz." },
        ],
        also: [{ productId: "produzent" }] },                             // Zweit-Empfehlung bei Diagnose (Begründung = products.produzent.text)
      { productId: "magenfreund", when: { q: "q6", has: "verstopfung" },
        reason: [
          { text: "Du hast eine träge Verdauung genannt. Deshalb taucht der Magenfreund® hier als möglicher nächster Schritt auf." },
          { text: "Er ist der Verdauungs-Komplex aus unserer Range, als ruhige Alltags-Ergänzung gedacht." },
        ] },
      { productId: "immungold", when: { flag: "autoimmune" },
        reason: [
          { text: "Weil bei dir Autoimmun-Angaben vorkommen, zeigen wir dir aus unserer Range Immungold®." },
          { text: "Es ist ein Komplex mit Vitamin D und Omega-3." },
        ] },
      { productId: "kollagen", when: { q: "q4", hasAny: ["haut", "haare", "naegel", "rillen", "brauen", "gesicht"] },  // pending
        reason: [
          { text: "Du hast Veränderungen an Haut, Haaren oder Nägeln genannt." },
          { text: "Kollagen-MCT ist als Ergänzung rund um Haut, Haare und Nägel gedacht, kein Muss." },
        ] },
      { productId: "aminos", when: { q: "q3", hasAny: ["muede", "antrieb"] },                       // pending
        reason: [
          { text: "Müdigkeit und wenig Antrieb sind bei dir Thema." },
          { text: "Essentielle Aminosäuren sind ein möglicher Baustein rund um Energie und Muskeln, kein Muss." },
        ] },
    ],

    // ── Autoimmun-Hinweis (zusätzlich bei A/B, wenn Flag) ──
    autoimmuneBlock: {
      title: "Ein Hinweis zu deinen Angaben",
      text: [
        { text: "Eine deiner Angaben, {{autoimmuneFactor}}, gehört zu den bekannten Risikofaktoren für Hashimoto, die häufigste Ursache einer Unterfunktion in Deutschland." },
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
        heroImage: "result-hero-a.jpg",
        heroAlt: "",
        validation: [
          { text: "Deine Antworten zeigen mehrere Anzeichen, die mit einer Schilddrüsenunterfunktion in Verbindung stehen können." },
          { when: { hasSymptoms: true }, text: "Konkret: {{symptoms}}." },
          { text: "Das ist keine Diagnose, aber genug, um es ernst zu nehmen und ärztlich abklären zu lassen." },
          { when: { q: "q2", is: 2 }, text: "Du hast bereits eine Diagnose. Dann deuten deine Antworten darauf hin, dass du aktuell nicht optimal eingestellt sein könntest. Auch das gehört ärztlich besprochen." },
          { when: { anyOf: [{ q: "q10", is: 2 }, { q: "q11", hasAny: ["stress", "alter", "familie", "anstellen"] }] }, text: "Wenn du oft gehört hast, das sei „nur Stress“ oder „die Hormone“: Du bildest dir das nicht ein." },
        ],
        mech: {
          title: "Was dahinterstecken kann",
          text: [
            { text: "Die Schilddrüse steuert Stoffwechsel, Energie, Temperatur und Stimmung. Produziert sie zu wenig Hormone, zeigt sich das schleichend in genau solchen Beschwerden." },
            { when: { q: "q12", is: 4 }, text: "Gerade in den Wechseljahren werden solche Beschwerden leicht den Hormonen zugeschrieben. Die Schilddrüse lohnt den gezielten Blick." },
            { when: { q: "q13", hasAny: ["stark", "unregel"] }, text: "Auch stärkere oder unregelmäßige Blutungen können mit der Schilddrüse zusammenhängen." },
          ],
          note: "Das ist eine Einordnung, keine Diagnose. Sicherheit gibt nur ein Blutbild.",
        },
        // ── Insights (c): erklärende Karten je Antwort-Cluster; leer → Sektion entfällt ──
        insights: [
          { when: { q: "q3", hasAny: ["frieren", "muede", "antrieb", "kalt"] }, icon: "thermometer", title: "Frieren & wenig Energie", text: "Energie, Wärme und Antrieb hängen eng am Stoffwechsel: Läuft er langsamer, stellt der Körper weniger davon bereit. Das erklärt, warum sich mehrere solcher Beschwerden gleichzeitig zeigen können." },
          { when: { q: "q4", hasAny: ["haut", "haare", "naegel", "rillen", "brauen"] }, icon: "sparkles", title: "Haut, Haare & Nägel", text: "Haut, Haare und Nägel reagieren empfindlich auf den Stoffwechsel. Verändern sie sich ohne klaren Grund, kann das ein leises Signal sein, für sich allein aber kein Beweis." },
          { when: { q: "q5", hasAny: ["fog", "down"] }, icon: "mind", title: "Kopf & Stimmung", text: "Auch Kopf und Stimmung reagieren auf den Stoffwechsel: Die Schilddrüse beeinflusst, wie klar, wach und ausgeglichen du dich fühlst. Ein Zusammenhang, der oft übersehen wird." },
          { when: { q: "q6", has: "verstopfung" }, icon: "leaf", title: "Träge Verdauung", text: "Eine langsamere Verdauung passt ins Bild eines gedrosselten Stoffwechsels. Sie ist häufig und lässt sich gut ansprechen." },
          { when: { q: "q16", hasAny: ["schwellung", "kloss", "heiser"] }, icon: "warn", title: "Zeichen am Hals", text: "Veränderungen im Hals- oder Kehlbereich gehören einmal ärztlich angeschaut. Häufig ist es harmlos, Klarheit bekommst du aber nur durch einen Blick darauf." },
          { when: { q: "q7", is: 2 }, icon: "clock", title: "Das begleitet dich schon länger", text: "Beschwerden, die über ein Jahr anhalten, verdienen eine gezielte Abklärung. Nicht, weil etwas Schlimmes sein muss, sondern damit du endlich Klarheit hast." },
          { when: { q: "q8", is: 0 }, icon: "clock", title: "Es wird eher mehr", text: "Dass die Beschwerden zunehmen, ist ein guter Grund, jetzt hinzuschauen, statt weiter abzuwarten." },
        ],
        advice: [
          { icon: "doctor", title: "Sprich zeitnah mit ärztlicher Begleitung", text: "Nimm deine Beschwerden ernst und such dir zeitnah einen Termin." },
          { icon: "doctor", title: "Bitte gezielt um die richtigen Werte", text: "TSH, fT3, fT4 und TPO-Antikörper." },
          { when: { q: "q17", is: 0 }, icon: "clipboard", title: "Erwähne deine bisherigen Werte", text: "Sag, dass deine Werte als unauffällig galten, du aber weiter Beschwerden hast." },
          { when: { q: "q18", band: 0 }, icon: "thermometer", title: "Sprich deine Temperatur an", text: "Deine morgendliche Temperatur liegt eher niedrig, ein zusätzliches Zeichen, das du erwähnen kannst." },
          { when: { q: "q18", skipped: true }, icon: "thermometer", title: "Miss eine Woche morgens", text: "Wenn du magst, nimm dir bei Gelegenheit einmal eine Woche Zeit und miss morgens, mittags und abends deine Temperatur. Aus den Tageswerten bildest du den Wochendurchschnitt und kannst ihn beim Termin erwähnen." },
        ],
        empower: { title: "Du musst da nicht allein durch.", text: "Mit den richtigen Werten bekommst du endlich Antworten, wir begleiten dich mit verständlichem Wissen." },
      } },

      /* ===== B — Mögliche Hinweise ===== */
      { id: "B", label: "Mögliche Hinweise", copy: {
        headerEyebrow: "Deine Einschätzung",
        title: "Deine Antworten zeigen einige mögliche Hinweise",
        heroImage: "result-hero-b.jpg",
        heroAlt: "",
        validation: [
          { text: "Deine Antworten zeigen einige Anzeichen, die mit einer Unterfunktion in Verbindung stehen können, aktuell aber kein eindeutiges Bild." },
          { when: { hasSymptoms: true }, text: "Konkret: {{symptoms}}." },
          { text: "Keine Diagnose, kein Grund zur Sorge, aber ein guter Anlass, genauer hinzuschauen." },
          { when: { q: "q2", is: 2 }, text: "Hast du bereits eine Diagnose, lohnt der Blick, ob deine aktuelle Einstellung noch gut zu dir passt." },
        ],
        mech: {
          title: "Was dahinterstecken kann",
          text: [
            { text: "Anzeichen einer Unterfunktion sind oft unspezifisch. Halten sie an oder nehmen zu, lohnt ein gezielter Blick auf die Schilddrüse." },
            { when: { q: "q12", is: 4 }, text: "Gerade in den Wechseljahren werden solche Beschwerden leicht den Hormonen zugeschrieben. Die Schilddrüse lohnt den gezielten Blick." },
            { when: { q: "q13", hasAny: ["stark", "unregel"] }, text: "Auch stärkere oder unregelmäßige Blutungen können mit der Schilddrüse zusammenhängen." },
          ],
          note: "Das ist eine Einordnung, keine Diagnose. Sicherheit gibt nur ein Blutbild.",
        },
        // ── Insights (c): erklärende Karten je Antwort-Cluster; leer → Sektion entfällt ──
        insights: [
          { when: { q: "q3", hasAny: ["frieren", "muede", "antrieb", "kalt"] }, icon: "thermometer", title: "Frieren & wenig Energie", text: "Energie, Wärme und Antrieb hängen eng am Stoffwechsel: Läuft er langsamer, stellt der Körper weniger davon bereit. Das erklärt, warum sich mehrere solcher Beschwerden gleichzeitig zeigen können." },
          { when: { q: "q4", hasAny: ["haut", "haare", "naegel", "rillen", "brauen"] }, icon: "sparkles", title: "Haut, Haare & Nägel", text: "Haut, Haare und Nägel reagieren empfindlich auf den Stoffwechsel. Verändern sie sich ohne klaren Grund, kann das ein leises Signal sein, für sich allein aber kein Beweis." },
          { when: { q: "q5", hasAny: ["fog", "down"] }, icon: "mind", title: "Kopf & Stimmung", text: "Auch Kopf und Stimmung reagieren auf den Stoffwechsel: Die Schilddrüse beeinflusst, wie klar, wach und ausgeglichen du dich fühlst. Ein Zusammenhang, der oft übersehen wird." },
          { when: { q: "q6", has: "verstopfung" }, icon: "leaf", title: "Träge Verdauung", text: "Eine langsamere Verdauung passt ins Bild eines gedrosselten Stoffwechsels. Sie ist häufig und lässt sich gut ansprechen." },
          { when: { q: "q16", hasAny: ["schwellung", "kloss", "heiser"] }, icon: "warn", title: "Zeichen am Hals", text: "Veränderungen im Hals- oder Kehlbereich gehören einmal ärztlich angeschaut. Häufig ist es harmlos, Klarheit bekommst du aber nur durch einen Blick darauf." },
          { when: { q: "q7", is: 2 }, icon: "clock", title: "Das begleitet dich schon länger", text: "Beschwerden, die über ein Jahr anhalten, verdienen eine gezielte Abklärung. Nicht, weil etwas Schlimmes sein muss, sondern damit du endlich Klarheit hast." },
          { when: { q: "q8", is: 0 }, icon: "clock", title: "Es wird eher mehr", text: "Dass die Beschwerden zunehmen, ist ein guter Grund, jetzt hinzuschauen, statt weiter abzuwarten." },
        ],
        advice: [
          { icon: "calendar", title: "Beobachte die nächsten Wochen", text: "Ein kurzes Beschwerde-Tagebuch hilft, Muster zu erkennen." },
          { icon: "doctor", title: "Sprich es beim nächsten Arztbesuch an", text: "Frag nach einer Basisdiagnostik (TSH, ggf. fT3/fT4)." },
          { when: { q: "q18", skipped: true }, icon: "thermometer", title: "Kleiner Selbsttest", text: "Wenn du magst, miss eine Woche lang morgens, mittags und abends deine Temperatur und bilde daraus deinen Wochendurchschnitt." },
        ],
        empower: { title: "Du musst nicht warten, bis es „schlimm genug“ ist.", text: "Wir geben dir das Wissen für ein gutes Gespräch." },
      } },

      /* ===== C — Wenig Hinweise (kein Produkt, kein Autoimmun-Block) ===== */
      { id: "C", label: "Wenig Hinweise", copy: {
        headerEyebrow: "Deine Einschätzung",
        title: "Aktuell sprechen deine Antworten für wenig Hinweise",
        heroImage: "result-hero-c.jpg",
        heroAlt: "",
        validation: [
          { text: "Deine Antworten sprechen aktuell wenig für eine Unterfunktion. Erst einmal eine gute Nachricht." },
          { when: { q: "q2", is: 2 }, text: "Du hast bereits eine Diagnose. Dass aktuell wenig zusätzliche Hinweise dazukommen, ist ein gutes Zeichen. Behalte deine Einstellung trotzdem im Blick." },
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
      active: false,   // Stock-Toggle: aktuell nicht verfügbar → Engine empfiehlt ihn nicht (im Backend umschaltbar)
      // TODO(Leo): Magenfreund-Key-Visual fehlt noch → Datei nach app/assets/ legen
      //            (Konvention: magenfreund-hero.webp), dann image-Feld ergänzen.
      text: "Eine ruhige Ergänzung, wenn deine Verdauung träge ist, kein Muss.",
      claims: ["Chlorid trägt zu einer normalen Verdauung bei, indem es zur Bildung von Magensäure beiträgt.<sup>1</sup>"],
      cta: "Mehr über den Magenfreund", link: "https://miavola.de/products/magenfreund",
      disclaimer: "Kein Muss. Bitte besprich Veränderungen mit deinem Arzt.",
    },
    immungold: {
      name: "Immungold®", sub: "Omega-3 + Vitamin D",
      image: "immungold-hero.webp",
      text: "Wenn Autoimmun-Themen bei dir eine Rolle spielen, kann eine gute Vitamin-D-Versorgung sinnvoll sein.",
      claims: ["Vitamin D trägt zu einer normalen Funktion des Immunsystems bei.<sup>2</sup>"],
      cta: "Mehr über Immungold", link: "https://miavola.de/products/immungold",
      disclaimer: "Kein Muss. Bitte besprich Veränderungen mit deinem Arzt.",
    },
    produzent: {
      name: "Der Produzent®", sub: "Schilddrüsen-Komplex",
      image: "produzent-hero.webp",
      text: "Für eine bereits diagnostizierte Schilddrüse: als Ergänzung zur ärztlichen Therapie, nicht als Ersatz.",
      claims: [
        "Jod trägt zu einer normalen Produktion von Schilddrüsenhormonen und zu einer normalen Funktion der Schilddrüse bei.<sup>3</sup>",
        "Selen trägt zu einer normalen Schilddrüsenfunktion bei.<sup>4</sup>",
      ],
      cta: "Mehr über den Produzenten", link: "https://miavola.de/products/der-produzent",
      disclaimer: "Enthält Jod: nicht bei Überfunktion/Basedow ohne ärztliche Rücksprache. Kein Ersatz für deine Therapie.",
    },
    umwandler: {
      name: "Der Umwandler®", sub: "Leber-Komplex",
      image: "umwandler-hero.webp",
      text: "Unterstützung rund um Leber und Hormon-Umwandlung, für diagnostizierte Verläufe.",
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
      text: "Produzent und Umwandler im Set, für diagnostizierte Verläufe, die beides abdecken möchten.",
      claims: [
        "Jod trägt zu einer normalen Produktion von Schilddrüsenhormonen bei.<sup>3</sup>",
        "Selen trägt zu einer normalen Schilddrüsenfunktion bei.<sup>4</sup>",
      ],
      cta: "Mehr über das Heldenduo", link: "https://miavola.de/products/heldenduo",
      disclaimer: "Enthält Jod: nicht bei Überfunktion ohne ärztliche Rücksprache.",
    },
    // pending → Engine zeigt diese (noch) NICHT (EFSA-Claim unbestätigt, §9.5)
    kollagen: {
      name: "Kollagen-MCT", sub: "Kollagen + MCT",
      image: "kollagen-hero.webp",
      text: "Für Haut, Haare & Nägel.",
      claims: [], pending: true,
      cta: "Mehr über Kollagen-MCT", link: "https://miavola.de/products/kollagen-mct",
      disclaimer: "Kein Muss.",
    },
    aminos: {
      name: "Essentielle Aminosäuren", sub: "EAA-Komplex",
      image: "aminos-hero.webp",
      text: "Bausteine für Energie & Muskeln.",
      claims: [], pending: true,
      cta: "Mehr über Essentielle Aminosäuren", link: "https://miavola.de/products/essentielle-aminosaeuren",
      disclaimer: "Kein Muss.",
    },
  },

  /* ----- ERGEBNISSEITE: statische UI-Bausteine (kein medizinischer Claim) */
  result: {
    headerEyebrow: "Deine Einschätzung",
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
