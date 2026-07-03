/* ================================================================
   app.js — ENGINE des Schilddrüsen-Quiz
   ================================================================
   Strikt getrennt vom Content: alle Texte/Fragen/Outcomes liegen in
   content.js (window.QUIZ_CONTENT). Diese Datei kennt nur Flow, State,
   Navigation, Auswertung, Validierung und Rendering — keine Inhalte.

   AUSWERTUNG (Outcome-Branching):
   Antworten → Signal-Mapping (outcomes.signalRules) → Score je Outcome →
   1 primäres Ergebnis + sekundäre Hinweise (Priorisierung).
   Solange kein Outcome-Modell konfiguriert ist, rendert die Engine eine
   sichtbare TODO-Ergebnisseite — es wird NICHTS erfunden.
   ================================================================ */
(() => {
  "use strict";

  let C;  // wird in boot() gesetzt (async aus content.json + optionalem localStorage-Override)

  // Content laden: localStorage-Override (Editor-Vorschau) > content.json. Liefert Objekt oder null.
  async function loadContent() {
    try {
      const raw = localStorage.getItem("quizContentOverride");
      if (raw) return JSON.parse(raw);
    } catch (e) { /* defekter Override → ignorieren, content.json nutzen */ }
    try {
      const res = await fetch("content.json", { cache: "no-store" });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) { return null; }
  }

  const ASSET = "assets/";

  /* ----------------------------------------------------------------
     SVG-Icons (präsentational → Engine). Content referenziert per Key.
     ---------------------------------------------------------------- */
  const ICONS = {
    chevronLeft: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>',
    check: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 5 10-12"/></svg>',
    checkSmall: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 5 10-12"/></svg>',
    checkSage: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l4 5 10-12"/></svg>',
    clock: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7a3343" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    arrow: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7a3343" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    heart: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7a3343" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.5-7 10-7 10z"/></svg>',
    info: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.5"/></svg>',
    warn: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 8v5M12 16.5v.5"/><circle cx="12" cy="12" r="9"/></svg>',
    observe: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    doctor: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6 6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>',
    leaf: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21c5-3 8-7 8-12a8 8 0 0 0-8 8 8 8 0 0 0-8-8c0 5 3 9 8 12z"/></svg>',
    // Themen-spezifische Icons (klare Standard-Line-Icons, kein Freihand-Slop)
    thermometer: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>',
    sparkles: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"/></svg>',
    mind: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5 3 3 0 0 0 1 5 3 3 0 0 0 3 2V4zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5 3 3 0 0 1-1 5 3 3 0 0 1-3 2V4z"/></svg>',
    clipboard: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 12h6"/><path d="M9 16h4"/></svg>',
    calendar: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>',
    sym_tired: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#7a3343" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a4 4 0 0 0-4 4c0 2 1 3 1 5s-2 3-2 5a3 3 0 0 0 5 2 3 3 0 0 0 5-2c0-2-2-3-2-5s1-3 1-5a4 4 0 0 0-4-4z"/></svg>',
    sym_cold: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#7a3343" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M4 7l16 10M20 7L4 17M12 2l-3 3M12 2l3 3M12 22l-3-3M12 22l3-3"/></svg>',
    sym_hair: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#7a3343" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4c0 4-3 5-3 9a4 4 0 0 0 8 0c0-3-2-4-2-7M14 6c0 3 3 4 3 8a3 3 0 0 1-3 3"/></svg>',
    sym_weight: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#7a3343" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v6M5 9h14l-1.5 9a2 2 0 0 1-2 1.7H8.5a2 2 0 0 1-2-1.7L5 9z"/></svg>',
    sym_brain: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#7a3343" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5 3 3 0 0 0 1 5 3 3 0 0 0 3 2V4zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5 3 3 0 0 1-1 5 3 3 0 0 1-3 2V4z"/></svg>',
    sym_mood: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#7a3343" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8.5 15c1 .8 2.2 1 3.5 1s2.5-.2 3.5-1M9 9.5v.5M15 9.5v.5"/></svg>',
  };
  const icon = (key) => ICONS[key] || "";

  /* ----------------------------------------------------------------
     FLOW: Intro + Content-Flow + Email + Analyse + Ergebnis
     ---------------------------------------------------------------- */
  let FLOW, MAX_QUESTIONS;
  const QUESTION_TYPES = new Set(["single", "multi", "number"]);
  // FLOW/MAX_QUESTIONS werden in boot() gesetzt, sobald C geladen ist.

  /* ----------------------------------------------------------------
     Bedingte Sichtbarkeit (Skip-Logik) — interpretiert `showWhen`
     ---------------------------------------------------------------- */
  function anySymptom() {
    return FLOW.some((s) => {
      if (!s.symptom) return false;
      const a = state.answers[s.id];
      if (!a || !a.keys) return false;
      const excl = new Set(s.options.filter((o) => o.exclusive).map((o) => o.key));
      return a.keys.some((k) => !excl.has(k));
    });
  }
  function condMet(showWhen) {
    if (!showWhen) return true;
    if (showWhen === "hasSymptoms") return anySymptom();
    if (showWhen.q) {
      const a = state.answers[showWhen.q];
      if (!a) return false;
      if (showWhen.inAnyOf) return showWhen.inAnyOf.includes(a.index);
    }
    return true;
  }
  function isVisible(i) {
    const s = FLOW[i];
    return s ? condMet(s.showWhen) : false;
  }

  // Für den Fortschritts-ZÄHLER wird optimistisch gezählt: eine bedingte Frage
  // zählt mit, solange sie noch erscheinen KANN (Bedingung noch nicht definitiv
  // ausgeschlossen). So startet der Zähler stabil (z. B. /18) und wird nur
  // KLEINER, wenn ein Zweig wegfällt — statt mitten im Quiz nach oben zu springen.
  function symptomsPossible() {
    if (anySymptom()) return true;
    return FLOW.some((s) => s.symptom && !state.answers[s.id]); // noch nicht alle Symptomfragen beantwortet
  }
  function condCountable(showWhen) {
    if (!showWhen) return true;
    if (showWhen === "hasSymptoms") return symptomsPossible();
    if (showWhen.q) {
      const a = state.answers[showWhen.q];
      if (!a) return true;                          // Trigger-Frage noch offen → optimistisch zählen
      if (showWhen.inAnyOf) return showWhen.inAnyOf.includes(a.index);
    }
    return true;
  }
  function countableQuestionIndices() {
    const out = [];
    for (let i = 0; i < FLOW.length; i++) if (QUESTION_TYPES.has(FLOW[i].type) && condCountable(FLOW[i].showWhen)) out.push(i);
    return out;
  }
  function totalQuestions() { return countableQuestionIndices().length; }

  /* ----------------------------------------------------------------
     STATE
     ---------------------------------------------------------------- */
  const state = { step: 0, answers: {}, email: "", optIn: false };
  const app = document.getElementById("app");

  /* ---------------- Helpers ---------------- */
  function fmt(n) { return String(n).replace(".", ","); }
  function parseNum(str) {
    if (!str) return null;
    const cleaned = String(str).trim().replace(/,/g, ".");
    if (!/^\d+(\.\d+)?$/.test(cleaned)) return null;   // genau eine Zahl, eine optionale Nachkommastelle
    const v = parseFloat(cleaned);
    return Number.isFinite(v) ? v : null;
  }
  function el(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function questionNumber(stepIndex) {
    const set = countableQuestionIndices();
    const pos = set.indexOf(stepIndex);
    return pos >= 0 ? pos + 1 : set.filter((i) => i <= stepIndex).length + 1;
  }
  function nextVisibleIndex(from, dir) {
    let i = from + dir;
    while (i >= 0 && i < FLOW.length && !isVisible(i)) i += dir;
    return i;
  }
  // Info-/Meilenstein-Screens sind reine Vorwärts-Einschübe (nur „Weiter", kein Zurück).
  // Bei Rückwärts-Navigation werden sie übersprungen, damit man die vorige Frage erreicht
  // (sonst Sackgasse: Zurück landet auf der Info-Card, die nur vorwärts führt).
  const FORWARD_ONLY = new Set(["education", "milestone"]);
  function go(delta) {
    // delta ist immer ±1; überspringt unsichtbare (geskippte) Schritte
    const dir = delta < 0 ? -1 : 1;
    let ni = nextVisibleIndex(state.step, dir);
    if (dir < 0) {
      while (ni >= 0 && ni < FLOW.length && FORWARD_ONLY.has(FLOW[ni].type)) ni = nextVisibleIndex(ni, dir);
    }
    if (ni < 0 || ni >= FLOW.length) return;
    state.step = ni;
    render();
    window.scrollTo(0, 0);
    focusScreen();
  }
  function goTo(index) { state.step = index; render(); window.scrollTo(0, 0); focusScreen(); }
  // Fokus bei Schrittwechsel deterministisch setzen (A11y): bevorzugt ein
  // Auto-Fokus-Feld (z. B. Zahleneingabe), sonst die Überschrift des Screens.
  function focusScreen() {
    const target = app.querySelector("[data-autofocus]") ||
                   app.querySelector("h1, h2, .todo-banner__tag");
    if (!target) return;
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    try { target.focus({ preventScroll: true }); } catch (_) { target.focus(); }
  }

  /* ----------------------------------------------------------------
     AUSWERTUNG (Outcome-Branching)
     Liest outcomes.signalRules (aus outcomes.md) und summiert Signale.
     Liefert IMMER eine Antwort-Zusammenfassung (für QA/Outcome-Design),
     auch wenn das Modell noch leer ist.
     ---------------------------------------------------------------- */
  function bandIndex(s, v) {
    if (v == null || !s.bands) return -1;
    for (let i = 0; i < s.bands.length; i++) { const b = s.bands[i].below; if (b == null || v < b) return i; }
    return -1;
  }
  // Prädikat-Matcher: interpretiert `when`-Bedingungen (aus content.js) gegen
  // die gegebenen Antworten + berechnete Flags. Rein strukturell, kennt keine Inhalte.
  function questionById(qid) { return FLOW.find((s) => s && s.id === qid); }
  function matches(when, ctx) {
    if (!when) return true;
    if (when.anyOf) return when.anyOf.some((w) => matches(w, ctx));
    if (when.allOf) return when.allOf.every((w) => matches(w, ctx));
    if (when.not)   return !matches(when.not, ctx);
    if (when.flag)  return !!(ctx.flags && ctx.flags[when.flag]);
    if (when.hasSymptoms) return !!ctx.hasSymptoms;
    if (when.outcomeIn) return when.outcomeIn.includes(ctx.band);
    if (when.q) {
      const a = state.answers[when.q];
      const s = questionById(when.q);
      if (when.is != null)   return !!a && a.index === when.is;
      if (when.in)           return !!a && when.in.includes(a.index);
      if (when.has)          return !!a && !!a.keys && a.keys.includes(when.has);
      if (when.hasAny)       return !!a && !!a.keys && when.hasAny.some((k) => a.keys.includes(k));
      if (when.band != null) { if (!a || a.value == null || !s) return false; return bandIndex(s, a.value) === when.band; }
      if (when.skipped)      return !!a && a.value == null;   // Zahlfrage „weiß nicht“
    }
    return false;
  }

  // Tokens + Rich-Text-Segmente (geordnete Arrays mit optionalem `when`).
  function joinNatural(arr) {
    if (!arr.length) return "";
    if (arr.length === 1) return arr[0];
    return arr.slice(0, -1).join(", ") + " und " + arr[arr.length - 1];
  }
  function selectedSymptomLabels() {
    const out = [];
    FLOW.forEach((s) => {
      if (!s.symptom) return;
      const a = state.answers[s.id];
      if (!a || !a.keys) return;
      const excl = new Set(s.options.filter((o) => o.exclusive).map((o) => o.key));
      s.options.forEach((o) => { if (!excl.has(o.key) && a.keys.includes(o.key)) out.push(o.inlineLabel || o.label); });
    });
    return out;
  }
  function resolveAutoimmuneFactor(ctx) {
    const list = (C.outcomes && C.outcomes.autoimmuneFactors) || [];
    for (const f of list) if (matches(f.when, ctx)) return f.phrase;
    return "einer deiner Angaben";
  }
  function tok(str, ctx) {
    if (!str) return "";
    return String(str)
      .replace(/\{\{symptoms\}\}/g, (ctx && ctx.symptomText) || "")
      .replace(/\{\{autoimmuneFactor\}\}/g, (ctx && ctx.autoimmuneFactor) || "einer deiner Angaben");
  }
  function rich(field, ctx) {
    if (field == null) return "";
    if (typeof field === "string") return tok(field, ctx);
    if (Array.isArray(field)) return field.filter((seg) => matches(seg.when, ctx)).map((seg) => tok(seg.text, ctx)).join(" ");
    return "";
  }

  // Auswertungs-Kontext (Flags, Diagnose, Symptome, Tokens) für Prädikate/Texte.
  function buildCtx(flags, band) {
    const ctx = {
      flags: flags || {}, band,
      diagnosed: !!(state.answers.q2 && state.answers.q2.index === 2),
      hasSymptoms: anySymptom(),
      symptomText: joinNatural(selectedSymptomLabels()),
    };
    ctx.autoimmuneFactor = resolveAutoimmuneFactor(ctx);
    return ctx;
  }
  // Produkt-Auswahl: erste passende Regel, Jod-Sicherung (core nur diagnostiziert),
  // `pending` (unbestätigter Claim) übersprungen, bei Band C nie ein Produkt.
  function selectProduct(ctx, band) {
    const O = C.outcomes || {};
    if (band === "C") return null;
    const rules = O.productRules || [];
    const core = new Set(O.coreProductIds || []);
    const products = C.products || {};
    for (const r of rules) {
      if (!matches(r.when, ctx)) continue;
      const p = products[r.productId];
      if (!p || p.pending || p.active === false) continue;   // pending/nicht verfügbar (Stock) überspringen
      if (core.has(r.productId) && !ctx.diagnosed) continue;
      return r;                                          // ganze Regel (inkl. reason)
    }
    return null;
  }

  // AUSWERTUNG: ein Gesamt-Score (mit per-Frage-Caps) → Band A/B/C + Flags + Produkt.
  // Liefert IMMER eine Antwort-Zusammenfassung (für QA/TODO-Seite), auch unkonfiguriert.
  function evaluate() {
    const O = C.outcomes || {};
    const rules = O.signalRules || {};
    const caps = O.caps || {};
    const summary = [];
    const perQ = {};
    const flags = {};

    for (let i = 0; i < FLOW.length; i++) {
      const s = FLOW[i];
      if (!QUESTION_TYPES.has(s.type)) continue;
      if (!isVisible(i)) continue;            // übersprungene Fragen nicht werten/zeigen
      const a = state.answers[s.id];
      let firedKeys = [];
      if (s.type === "single") {
        const label = (a && s.options[a.index]) ? s.options[a.index].label : "—";
        summary.push({ cat: s.cat, q: s.q, a: label });
        if (a) firedKeys = [`${s.id}.${a.index}`];
      } else if (s.type === "multi") {
        const labels = a && a.keys ? s.options.filter((o) => a.keys.includes(o.key)).map((o) => o.label) : [];
        summary.push({ cat: s.cat, q: s.q, a: labels.length ? labels.join(", ") : "—" });
        if (a && a.keys) firedKeys = a.keys.map((k) => `${s.id}.${k}`);
      } else { // number
        const has = a && a.value != null;
        summary.push({ cat: s.cat, q: s.q, a: has ? fmt(a.value) + (s.unit ? " " + s.unit : "") : "übersprungen" });
        if (has) { const bi = bandIndex(s, a.value); if (bi >= 0) firedKeys = [`${s.id}.band:${bi}`]; }
      }
      firedKeys.forEach((key) => {
        const r = rules[key];
        if (!r) return;
        if (r.score) perQ[s.id] = (perQ[s.id] || 0) + r.score;
        if (r.flags) r.flags.forEach((f) => { flags[f] = true; });
      });
    }

    let total = 0;
    for (const qid in perQ) {
      let v = perQ[qid];
      if (caps[qid] != null) v = Math.min(v, caps[qid]);
      total += v;
    }

    const list = O.list || [];
    const bands = O.bands || [];
    const configured = bands.length > 0 && list.length > 0 && Object.keys(rules).length > 0;
    if (!configured) {
      return { configured: false, primary: null, band: null, total, flags, productId: null, secondary: [], summary, ctx: buildCtx(flags, null) };
    }

    let bandId = null;
    const sorted = bands.slice().sort((x, y) => y.min - x.min);
    for (const b of sorted) { if (total >= b.min) { bandId = b.id; break; } }
    if (bandId == null && sorted.length) bandId = sorted[sorted.length - 1].id;
    // Band-Overrides (outcomes.bandOverrides): ärztlicher Befund schlägt Score —
    // z. B. Diagnose oder auffällige Werte → immer Band A. Erster Treffer gewinnt.
    for (const ov of (O.bandOverrides || [])) {
      if (ov && ov.band != null && matches(ov.when, { flags })) { bandId = ov.band; break; }
    }
    const primary = list.find((o) => o.id === bandId) || null;
    const ctx = buildCtx(flags, bandId);
    const sel = primary ? selectProduct(ctx, bandId) : null;
    const productId = sel ? sel.productId : null;
    const productReason = sel && sel.reason ? rich(sel.reason, ctx) : "";  // rich() akzeptiert String ODER Segment-Array
    const secondary = buildSecondary(sel, ctx);                            // Zusatz-Produkte (`also`), gleiche Sicherungen
    return { configured: !!primary, primary, band: bandId, total, flags, productId, productReason, secondary, summary, ctx };
  }

  // Zusatz-Produkte einer Regel (`also`): gleiche Gates wie das Primärprodukt
  // (pending übersprungen, Core nur diagnostiziert). Begründung optional — sonst
  // greift im Render der Registry-Text (products[id].text). KEIN erfundenes Produkt.
  function buildSecondary(sel, ctx) {
    if (!sel || !Array.isArray(sel.also)) return [];
    const O = C.outcomes || {};
    const core = new Set(O.coreProductIds || []);
    const products = C.products || {};
    const out = [];
    for (const item of sel.also) {
      const id = typeof item === "string" ? item : item.productId;
      const p = products[id];
      if (!p || p.pending || p.active === false) continue;   // pending/nicht verfügbar (Stock) überspringen
      if (core.has(id) && !ctx.diagnosed) continue;
      out.push({ productId: id, reason: (item && item.reason) ? rich(item.reason, ctx) : "" });
    }
    return out;
  }

  /* ----------------------------------------------------------------
     RENDER — Router
     ---------------------------------------------------------------- */
  function _render() {
    const s = FLOW[state.step];
    app.innerHTML = "";
    app.removeAttribute("data-outcome");
    // Sichtbares Signal, solange Inhalte Platzhalter sind (content.js → meta).
    if (C.meta && C.meta.placeholder) {
      const ribbon = el(`<div class="placeholder-ribbon">${icon("info")}<span></span></div>`);
      ribbon.querySelector("span").textContent = C.meta.placeholderLabel || "Platzhalter-Inhalte";
      app.appendChild(ribbon);
    }
    let node;
    switch (s.type) {
      case "intro":      node = renderIntro(); break;
      case "single":     node = renderSingle(s); break;
      case "multi":      node = renderMulti(s); break;
      case "number":     node = renderNumber(s); break;
      case "education":  node = renderEducation(s); break;
      case "milestone":  node = renderMilestone(s); break;
      case "email":      node = renderEmail(); break;
      case "analysis":   node = renderAnalysis(); break;
      case "result":     node = renderResult(); break;
    }
    if (node) app.appendChild(node);
  }
  function render() {
    const old = app.firstElementChild;
    if (old && old._timers) old._timers.forEach(clearTimeout);
    _render();
  }

  /* ---------------- Top bar (Fragen) ---------------- */
  function topbar() {
    const total = totalQuestions();
    const n = questionNumber(state.step);
    const pct = Math.round((n / Math.max(total, 1)) * 100);
    const bar = el(`
      <div class="topbar">
        <button class="topbar__back" aria-label="Zurück">${icon("chevronLeft")}</button>
        <div class="progress"><div class="progress__bar" style="width:${pct}%"></div></div>
        <span class="topbar__count">${n}/${total}</span>
      </div>`);
    bar.querySelector(".topbar__back").addEventListener("click", () => go(-1));
    return bar;
  }

  /* ---------------- INTRO ---------------- */
  function renderIntro() {
    const t = C.intro;
    const wide = window.matchMedia("(min-width: 880px)").matches;
    const screen = el(`<section class="screen"></section>`);

    if (wide) {
      screen.appendChild(el(`
        <div class="wrap">
          <div class="intro__inner-wide">
            <div class="intro__col-text">
              <img src="${ASSET}logo-black.png" alt="miavola" style="height:72px;width:auto;opacity:.9;margin-bottom:34px;align-self:flex-start;">
              <span class="pill pill--sage" style="align-self:flex-start;margin-bottom:22px;">${t.badgeWide}</span>
              <h2 class="intro__title intro__title--wide">${t.title}</h2>
              <p class="intro__lead" style="font-size:17px;max-width:42ch;">${t.leadWide}</p>
              <div style="display:flex;gap:14px;align-items:center;">
                <button class="mv-btn mv-btn--burg mv-btn--lg" id="start">${t.cta}</button>
                <span style="font-size:13px;color:var(--miavola-ink-400);">Kein Login nötig</span>
              </div>
            </div>
            <div class="intro__col-media"><img src="${ASSET}butterflies-trio.png" alt=""></div>
          </div>
        </div>`));
    } else {
      const facts = t.facts.map((f) =>
        `<div class="fact">${icon(f.icon)}<span>${f.text.replace("{N}", MAX_QUESTIONS)}</span></div>`).join("");
      screen.appendChild(el(`
        <div class="intro">
          <div class="intro__logobar"><img src="${ASSET}logo-black.png" alt="miavola"></div>
          <div class="wrap intro__body">
            <div class="intro__hero">
              <span class="pill pill--sage">${t.badge}</span>
              <img src="${ASSET}butterflies-trio.png" alt="">
            </div>
            <h2 class="intro__title">${t.title}</h2>
            <p class="intro__lead">${t.lead}</p>
            <div class="facts">${facts}</div>
          </div>
          <div class="wrap q__foot">
            <button class="mv-btn mv-btn--burg mv-btn--block" id="start">${t.cta}</button>
            <p class="intro__note">${t.note}</p>
          </div>
        </div>`));
    }
    screen.querySelector("#start").addEventListener("click", () => go(1));
    return screen;
  }

  /* ---------------- Frage-Info („Was ist gemeint?") ----------------
     Optionales `s.info` je Frage: dezenter, ausklappbarer Erklär-Hinweis
     unter der Frage (barrierefrei: aria-expanded/-controls). Nur wenn gesetzt. */
  let infoSeq = 0;
  function questionInfoHTML(s) {
    if (!s.info) return "";
    const pid = `qinfo-${++infoSeq}`;
    return `
      <div class="q-info">
        <button class="q-info__toggle" type="button" aria-expanded="false" aria-controls="${pid}">
          ${icon("info")}<span>Was ist gemeint?</span>
        </button>
        <div class="q-info__panel" id="${pid}" hidden></div>
      </div>`;
  }
  function wireQuestionInfo(scope, s) {
    if (!s.info) return;
    const toggle = scope.querySelector(".q-info__toggle");
    const panel = scope.querySelector(".q-info__panel");
    if (!toggle || !panel) return;
    panel.textContent = s.info;                 // Inhalt sicher als Text (kein HTML-Inject)
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
      toggle.classList.toggle("is-open", !open);
      panel.hidden = open;
    });
  }

  /* ---------------- SINGLE-SELECT ---------------- */
  function renderSingle(s) {
    const screen = el(`<section class="screen"></section>`);
    screen.appendChild(topbar());
    const current = state.answers[s.id]?.index;

    const q = el(`
      <div class="q">
        <div class="wrap q__body">
          <div class="eyebrow">${s.cat}</div>
          <h2 class="q__title" tabindex="-1">${s.q}</h2>
          ${s.sub ? `<p class="q__sub">${s.sub}</p>` : ""}
          ${questionInfoHTML(s)}
          <div class="options" role="radiogroup" aria-label="${s.q}"></div>
        </div>
      </div>`);
    wireQuestionInfo(q, s);

    const list = q.querySelector(".options");
    const optionEls = [];
    let advanceTimer = null;
    screen._timers = [];

    function rollFocus(i) {
      const n = optionEls[(i + optionEls.length) % optionEls.length];
      optionEls.forEach((x) => { x.tabIndex = -1; });
      n.tabIndex = 0; n.focus();
    }
    function select(idx) {
      optionEls.forEach((n, i) => {
        const on = i === idx;
        n.setAttribute("aria-checked", on ? "true" : "false");
        n.tabIndex = on ? 0 : -1;
      });
      state.answers[s.id] = { index: idx };
      // Auto-Weiter: kurze Verzögerung, damit die Auswahl sichtbar quittiert wird.
      if (advanceTimer) clearTimeout(advanceTimer);
      advanceTimer = setTimeout(() => go(1), 280);
      screen._timers = [advanceTimer];
    }

    s.options.forEach((opt, idx) => {
      const initTab = current === idx || (current == null && idx === 0);
      const o = el(`
        <button class="option" role="radio" aria-checked="${current === idx}" tabindex="${initTab ? 0 : -1}">
          <span class="option__dot"></span>
          <span class="option__label"></span>
        </button>`);
      o.querySelector(".option__label").textContent = opt.label;
      o.addEventListener("click", () => select(idx));
      o.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); rollFocus(idx + 1); }
        else if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); rollFocus(idx - 1); }
        else if (e.key === "Home") { e.preventDefault(); rollFocus(0); }
        else if (e.key === "End") { e.preventDefault(); rollFocus(optionEls.length - 1); }
      });
      optionEls.push(o);
      list.appendChild(o);
    });
    screen.appendChild(q);
    return screen;
  }

  /* ---------------- MULTI-SELECT ---------------- */
  function renderMulti(s) {
    const screen = el(`<section class="screen"></section>`);
    screen.appendChild(topbar());
    const sel = new Set(state.answers[s.id]?.keys || []);
    const useCards = s.options.some((o) => o.icon);          // Bildkarten nur wenn Icons vorhanden
    const exclusiveKeys = new Set(s.options.filter((o) => o.exclusive).map((o) => o.key));
    const hasExclusive = exclusiveKeys.size > 0;

    const q = el(`
      <div class="q">
        <div class="wrap q__body">
          <div style="margin-bottom:12px;"><span class="pill pill--sage">Mehrfachauswahl</span></div>
          <h2 class="q__title" tabindex="-1">${s.q}</h2>
          ${s.sub ? `<p class="q__sub">${s.sub}</p>` : ""}
          ${questionInfoHTML(s)}
          <div class="${useCards ? "cards" : "options"}"></div>
        </div>
        <div class="wrap q__foot">
          <button class="mv-btn mv-btn--burg mv-btn--block" id="next" aria-describedby="multihint"></button>
          <p class="q__hint" id="multihint" hidden>Bitte wähle eine Option — oder „Nichts davon“.</p>
        </div>
      </div>`);
    wireQuestionInfo(q, s);

    const grid = q.querySelector(useCards ? ".cards" : ".options");
    const nextBtn = q.querySelector("#next");
    const multihint = q.querySelector("#multihint");
    function syncNext() {
      nextBtn.textContent = sel.size ? `Weiter · ${sel.size} gewählt` : "Weiter";
      // Bei expliziter „Nichts davon"-Option muss aktiv etwas gewählt werden.
      nextBtn.disabled = hasExclusive && sel.size === 0;
      multihint.hidden = !nextBtn.disabled;
    }
    function syncAria() {
      [...grid.children].forEach((n, i) => n.setAttribute("aria-checked", sel.has(s.options[i].key)));
    }

    s.options.forEach((opt) => {
      const node = useCards
        ? el(`<button class="card-opt" role="checkbox" aria-checked="${sel.has(opt.key)}"><span class="card-opt__box">${icon("check")}</span><span class="card-opt__ico">${icon(opt.icon)}</span><span class="card-opt__label"></span></button>`)
        : el(`<button class="option option--check" role="checkbox" aria-checked="${sel.has(opt.key)}"><span class="option__box">${icon("check")}</span><span class="option__label"></span></button>`);
      node.querySelector(useCards ? ".card-opt__label" : ".option__label").textContent = opt.label;
      node.addEventListener("click", () => {
        if (sel.has(opt.key)) {
          sel.delete(opt.key);
        } else {
          if (opt.exclusive) sel.clear();                    // „Nichts davon" leert die anderen
          else exclusiveKeys.forEach((k) => sel.delete(k));  // ein echtes Symptom hebt „Nichts davon" auf
          sel.add(opt.key);
        }
        syncAria();
        syncNext();
      });
      grid.appendChild(node);
    });
    syncNext();

    function commit() { state.answers[s.id] = { keys: [...sel] }; go(1); }
    nextBtn.addEventListener("click", () => { if (!nextBtn.disabled) commit(); });

    // Fallback-Link nur, wenn es KEINE explizite „Nichts davon"-Option gibt
    if (!hasExclusive) {
      const link = el(`<button class="link-btn link-btn--muted" id="none">Trifft nichts zu</button>`);
      link.addEventListener("click", () => { sel.clear(); commit(); });
      q.querySelector(".q__foot").appendChild(link);
    }
    screen.appendChild(q);
    return screen;
  }

  /* ---------------- NUMBER ---------------- */
  function renderNumber(s) {
    const screen = el(`<section class="screen"></section>`);
    screen.appendChild(topbar());
    const prev = state.answers[s.id]?.value;

    const q = el(`
      <div class="q">
        <div class="wrap q__body">
          <div class="eyebrow">${s.cat}</div>
          <h2 class="q__title" tabindex="-1">${s.q}</h2>
          ${s.sub ? `<p class="q__sub">${s.sub}</p>` : ""}
          ${questionInfoHTML(s)}
          <label class="numfield" for="numinput">
            <input id="numinput" type="text" inputmode="decimal" autocomplete="off" data-autofocus
                   placeholder="${s.placeholder}" value="${prev != null ? fmt(prev) : ""}" aria-label="${s.q}">
            <span class="numfield__unit">${s.unit}</span>
          </label>
          <div class="field-hint" id="hint" aria-live="polite"></div>
          <label class="numskip" for="numskip">
            <input type="checkbox" id="numskip">
            <span>${s.skipLabel}</span>
          </label>
        </div>
        <div class="wrap q__foot">
          <button class="mv-btn mv-btn--burg mv-btn--block" id="next">Weiter</button>
        </div>
      </div>`);
    wireQuestionInfo(q, s);

    const field = q.querySelector(".numfield");
    const input = q.querySelector("#numinput");
    const hint = q.querySelector("#hint");
    const defaultHint = `${icon("info")}<span>${s.hint}</span>`;
    hint.innerHTML = defaultHint;

    function setError(msg) {
      field.classList.add("numfield--error");
      hint.classList.add("field-hint--error");
      hint.innerHTML = `${icon("warn")}<span></span>`;
      hint.querySelector("span").textContent = msg;
    }
    function clearError() {
      field.classList.remove("numfield--error");
      hint.classList.remove("field-hint--error");
      hint.innerHTML = defaultHint;
    }
    input.addEventListener("input", clearError);
    // Fokus übernimmt focusScreen() via [data-autofocus].

    function commit() {
      const v = parseNum(input.value);
      if (v == null) { setError("Bitte gib eine Zahl ein, z. B. 36,5."); return; }
      if (v < s.min || v > s.max) { setError(`Bitte einen Wert zwischen ${fmt(s.min)} und ${fmt(s.max)} eingeben.`); return; }
      state.answers[s.id] = { value: v };
      go(1);
    }
    q.querySelector("#next").addEventListener("click", commit);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") commit(); });
    q.querySelector("#numskip").addEventListener("change", (e) => {
      // „weiß nicht / noch nie gemessen“ → weich überspringen und direkt weiter
      if (e.target.checked) { state.answers[s.id] = { value: null }; go(1); }
    });
    screen.appendChild(q);
    return screen;
  }

  /* ---------------- EDUCATION ---------------- */
  function renderEducation(s) {
    const screen = el(`<section class="screen"></section>`);
    if (s.variant === "burg") {
      screen.appendChild(el(`
        <div class="edu">
          <img class="edu__mark" src="${ASSET}butterfly-mark.png" alt="">
          <div class="edu__inner">
            <div class="edu__eyebrow">${s.eyebrow}</div>
            <div class="edu__content">
              <h2 class="edu__title">${s.title}</h2>
              <p class="edu__text">${s.text}</p>
              ${s.src ? `<p class="edu__src">${s.src}</p>` : ""}
            </div>
          </div>
          <div class="edu__foot"><button class="mv-btn mv-btn--block mv-btn--light" id="next">${s.cta}</button></div>
        </div>`));
    } else if (s.variant === "info") {
      // Info-Card (Wissens-Einschub im Flow): helle Karte, Grafik oben + Text.
      // Grafik über onerror-Fallback abgesichert — Card rendert sauber ohne Bild.
      const node = el(`
        <div class="edu edu--info">
          <div class="edu__inner edu__inner--info">
            ${s.graphic ? `<img class="edu__graphic" src="${ASSET}${s.graphic}" alt="" onerror="this.style.display='none'">` : ""}
            <div class="edu__eyebrow edu__eyebrow--info">${s.eyebrow || "Gut zu wissen"}</div>
            <h2 class="edu__title edu__title--info">${s.title}</h2>
            <p class="edu__text edu__text--info">${s.text}</p>
            ${s.src ? `<p class="edu__src edu__src--info">${s.src}</p>` : ""}
          </div>
          <div class="edu__foot"><button class="mv-btn mv-btn--burg mv-btn--block" id="next">${s.cta || "Weiter"}</button></div>
        </div>`);
      if (s.graphicAlt) { const g = node.querySelector(".edu__graphic"); if (g) g.setAttribute("alt", s.graphicAlt); }
      screen.appendChild(node);
    } else {
      screen.appendChild(el(`
        <div class="edu">
          <img class="edu__mark" src="${ASSET}butterfly-mark.png" alt="">
          <div class="edu__inner" style="justify-content:center;">
            <div class="edu__eyebrow" style="margin-bottom:0;padding-top:0;">${s.eyebrow}</div>
            <div class="edu__content" style="padding-top:18px;">
              <div class="edu__stat">${s.stat}</div>
              <p class="edu__text" style="max-width:32ch;">${s.text}</p>
            </div>
          </div>
          <div class="edu__foot"><button class="mv-btn mv-btn--block mv-btn--light" id="next">${s.cta}</button></div>
        </div>`));
    }
    screen.querySelector("#next").addEventListener("click", () => go(1));
    return screen;
  }

  /* ---------------- MILESTONE ---------------- */
  function renderMilestone(s) {
    const n = questionNumber(state.step);
    const pct = Math.round((n / Math.max(totalQuestions(), 1)) * 100);
    const screen = el(`<section class="screen"></section>`);
    screen.appendChild(el(`
      <div class="milestone">
        <img src="${ASSET}butterfly-rose.png" alt="">
        <div class="milestone__bar"><div style="width:${pct}%"></div></div>
        <h2>${s.title}</h2>
        <p>${s.text}</p>
        <button class="mv-btn mv-btn--burg" style="min-width:200px;" id="next">Weiter</button>
      </div>`));
    screen.querySelector("#next").addEventListener("click", () => go(1));
    return screen;
  }

  /* ---------------- EMAIL CAPTURE ---------------- */
  function renderEmail() {
    const t = C.email;
    const screen = el(`<section class="screen"></section>`);
    const node = el(`
      <div class="email">
        <div class="wrap email__body">
          <div class="eyebrow">${t.eyebrow}</div>
          <h2 class="email__title">${t.title}</h2>
          <p class="email__lead">${t.lead}</p>
          <label class="textfield" id="emailfield">
            <input id="email" type="email" inputmode="email" autocomplete="email" placeholder="${t.placeholder}" value="">
          </label>
          <div class="field-hint" id="emailhint" aria-live="polite" hidden></div>
          <label class="checkline">
            <input type="checkbox" id="optin">
            <span class="checkline__box">${icon("check")}</span>
            <span>${t.optInLabel}</span>
          </label>
        </div>
        <div class="wrap q__foot">
          <button class="mv-btn mv-btn--burg mv-btn--block" id="next">${t.cta}</button>
        </div>
      </div>`);

    const field = node.querySelector("#emailfield");
    const input = node.querySelector("#email");
    input.value = state.email;
    node.querySelector("#optin").checked = state.optIn;
    const hint = node.querySelector("#emailhint");
    const validEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

    node.querySelector("#next").addEventListener("click", () => {
      const v = input.value.trim();
      state.optIn = node.querySelector("#optin").checked;
      if (v && !validEmail(v)) {
        field.classList.add("textfield--error");
        hint.hidden = false; hint.classList.add("field-hint--error");
        hint.innerHTML = `${icon("warn")}<span></span>`;
        hint.querySelector("span").textContent = t.error;
        return;
      }
      state.email = v;
      if (v && state.optIn) subscribeKlaviyo(v);   // fire-and-forget, blockiert nie
      go(1);
    });
    input.addEventListener("input", () => { field.classList.remove("textfield--error"); hint.hidden = true; });
    screen.appendChild(node);
    return screen;
  }

  /* ---------------- KLAVIYO OPT-IN (client-seitig, ohne Backend) ----------------
     Konfiguration: content → meta.klaviyo { companyId, listId, source }.
     Double-Opt-in übernimmt Klaviyo (Listen-Einstellung). Fire-and-forget:
     Fehler landen nur in der Konsole und blockieren nie den Weg zum Ergebnis. */
  function subscribeKlaviyo(email) {
    const k = C.meta && C.meta.klaviyo;
    if (!k || !k.companyId || !k.listId) return;
    let props = {};
    try {
      const r = evaluate();
      props = {
        quiz_band: r.band || "",
        quiz_produkt: r.productId || "",
        quiz_autoimmun: !!(r.flags && r.flags.autoimmune),
      };
    } catch (e) { /* Ergebnis-Properties sind optional */ }
    const body = {
      data: {
        type: "subscription",
        attributes: {
          custom_source: k.source || "Quiz",
          profile: { data: { type: "profile", attributes: { email, properties: props } } },
        },
        relationships: { list: { data: { type: "list", id: k.listId } } },
      },
    };
    fetch(`https://a.klaviyo.com/client/subscriptions/?company_id=${encodeURIComponent(k.companyId)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", revision: "2024-10-15" },
      body: JSON.stringify(body),
      keepalive: true,
    }).then((res) => {
      if (!res.ok) console.warn("Klaviyo-Opt-in: HTTP", res.status);
    }).catch((e) => console.warn("Klaviyo-Opt-in fehlgeschlagen:", e));
  }

  /* ---------------- ANALYSIS ---------------- */
  function renderAnalysis() {
    const t = C.analysis;
    const screen = el(`<section class="screen"></section>`);
    const stepsHtml = t.steps.map((label, i) =>
      `<div class="step ${i === 0 ? "is-done" : ""}" data-i="${i}"><span class="step__dot">${icon("checkSmall")}</span>${label}</div>`).join("");
    const node = el(`
      <div class="analysis">
        <div class="spinner">
          <div class="spinner__track"></div>
          <div class="spinner__arc"></div>
          <img src="${ASSET}butterfly-mark.png" alt="">
        </div>
        <h2>${t.title}</h2>
        <div class="steps" aria-live="polite">${stepsHtml}</div>
      </div>`);
    screen.appendChild(node);

    const steps = node.querySelectorAll(".step");
    const timers = [];
    timers.push(setTimeout(() => { steps[1]?.classList.add("is-active"); }, 150));
    timers.push(setTimeout(() => { steps[1]?.classList.remove("is-active"); steps[1]?.classList.add("is-done"); steps[2]?.classList.add("is-active"); }, 1300));
    timers.push(setTimeout(() => { steps[2]?.classList.remove("is-active"); steps[2]?.classList.add("is-done"); }, 2400));
    timers.push(setTimeout(() => { if (FLOW[state.step].type === "analysis") go(1); }, 2900));
    screen._timers = timers;
    return screen;
  }

  /* ================================================================
     RESULT
     Konfiguriertes Outcome-Modell → echtes Ergebnis.
     Sonst → sichtbare TODO-Ergebnisseite (es wird nichts erfunden).
     ================================================================ */
  function renderResult() {
    const ev = evaluate();
    if (ev.configured && ev.primary) return renderOutcomeResult(ev);
    return renderTodoResult(ev);
  }

  function renderOutcomeResult(ev) {
    const R = C.result;
    const o = ev.primary;
    const cp = o.copy || {};
    const ctx = ev.ctx;
    app.setAttribute("data-outcome", o.id);
    const wide = window.matchMedia("(min-width:880px)").matches;
    const screen = el(`<section class="screen ${wide ? "result--wide" : ""}"></section>`);

    // Hero-Bild je Band (onerror-Fallback → Block verschwindet, Seite bleibt intakt).
    const heroHTML = cp.heroImage ? `
      <div class="result__hero">
        <img src="${ASSET}${cp.heroImage}" alt="${cp.heroAlt || ""}" onerror="this.closest('.result__hero').style.display='none'">
      </div>` : "";

    const headerHTML = `
      <div class="result__header">
        <img class="bgmark" src="${ASSET}butterfly-mark.png" alt="" onerror="this.style.display='none'">
        <div class="eyebrow">${cp.headerEyebrow || R.headerEyebrow}</div>
        <h2 class="result__title">${cp.title || ""}</h2>
      </div>`;

    const aText = rich(cp.validation, ctx);
    const a = aText ? `
      <div class="result__section result__section--first">
        <div class="sec-head"><span class="eyebrow">Das sehen wir bei dir</span></div>
        <p class="lead-text">${aText}</p>
      </div>` : "";

    const mech = cp.mech || {};
    const mechText = rich(mech.text, ctx);
    const b = (mech.title || mechText || mech.note) ? `
      <div class="result__section">
        <div class="sec-head"><span class="eyebrow">Was wahrscheinlich los ist</span></div>
        ${mech.title ? `<h3 class="mech-title">${mech.title}</h3>` : ""}
        ${mechText ? `<p class="mech-text">${mechText}</p>` : ""}
        ${mech.note ? `<div class="note-box"><strong>Wichtig:</strong> ${mech.note}</div>` : ""}
      </div>` : "";

    // Insights (c): erklärende Karten je Antwort-Cluster; leer → Sektion entfällt (modular).
    const insightItems = (cp.insights || []).filter((it) => matches(it.when, ctx));
    const cInsights = insightItems.length ? `
      <div class="result__section">
        <div class="sec-head"><span class="eyebrow">Was deine Angaben im Einzelnen zeigen</span></div>
        <div class="advice">
          ${insightItems.map((it) => `
            <div class="advice-card">${icon(it.icon)}
              <div><div class="advice-card__title">${it.title}</div><p>${tok(it.text, ctx)}</p></div>
            </div>`).join("")}
        </div>
      </div>` : "";

    // Action-Points (d): handlungsleitend.
    const adviceItems = (cp.advice || []).filter((ad) => matches(ad.when, ctx));
    const dAdvice = adviceItems.length ? `
      <div class="result__section">
        <div class="sec-head"><span class="eyebrow">Was das für dich heißt</span></div>
        <div class="advice">
          ${adviceItems.map((ad) => `
            <div class="advice-card">${icon(ad.icon)}
              <div><div class="advice-card__title">${ad.title}</div><p>${tok(ad.text, ctx)}</p></div>
            </div>`).join("")}
        </div>
      </div>` : "";

    // Autoimmun-Hinweis: zusätzlich bei A/B (nicht C), wenn Flag gesetzt.
    const ab = C.outcomes && C.outcomes.autoimmuneBlock;
    const autoimmune = (ab && ctx.flags && ctx.flags.autoimmune && o.id !== "C") ? `
      <div class="result__section">
        <div class="flag-note">
          <div class="flag-note__tag">${icon("info")}<span>${ab.title || "Ein Hinweis zu deinen Angaben"}</span></div>
          <p>${rich(ab.text, ctx)}</p>
        </div>
      </div>` : "";

    // Produkt (e): aus der Auswahllogik — kein Treffer → kein Block (kein erfundenes Produkt).
    const eProduct = ev.productId ? renderProductSection(ev.productId, ev.productReason, ev.secondary) : "";

    const empower = cp.empower ? `
      <div class="empower">
        <img src="${ASSET}butterfly-mark.png" alt="" onerror="this.style.display='none'">
        <h3>${cp.empower.title || ""}</h3>
        <p>${cp.empower.text || ""}</p>
      </div>` : "";

    const cta = `
      <div class="result__cta" id="cta"></div>
      <p class="result__legal">${R.legalDisclaimer}</p>`;

    screen.appendChild(el(`
      <div class="result">
        <div class="result__logobar"><img src="${ASSET}logo-black.png" alt="miavola" onerror="this.style.display='none'"></div>
        ${heroHTML}
        ${headerHTML}
        ${a}${a ? '<div class="sec-divider"></div>' : ""}
        ${b}${b ? '<div class="sec-divider"></div>' : ""}
        ${cInsights}${cInsights ? '<div class="sec-divider"></div>' : ""}
        ${dAdvice}${dAdvice ? '<div class="sec-divider"></div>' : ""}
        ${autoimmune}
        ${eProduct}${empower}${cta}
      </div>`));

    renderCta(screen.querySelector("#cta"));
    return screen;
  }

  // Produktblock (Abschnitt e) — gekoppelt an products-Registry / products.md.
  // Kein Mapping/Produkt → sichtbarer TODO-Hinweis, KEIN Produkt erfunden.
  // Primärprodukt + optionale Zusatz-Produkte (`secondary`) in EINER Sektion.
  function renderProductSection(productId, reason, secondary) {
    const R = C.result;
    const p = productId ? (C.products || {})[productId] : null;
    if (!p) {
      return `
        <div class="result__section">
          <div class="sec-head"><span class="eyebrow">Ein möglicher nächster Schritt</span></div>
          <div class="todo-note">${R.todo.productSlot}</div>
        </div>`;
    }
    const cards = productCard(p, reason, false)
      + (secondary || []).map((s) => {
          const sp = (C.products || {})[s.productId];
          return sp ? productCard(sp, s.reason, true) : "";
        }).join("");
    return `
      <div class="result__section">
        <div class="sec-head"><span class="eyebrow">Ein möglicher nächster Schritt</span></div>
        ${cards}
      </div>`;
  }

  // Einzelne Produktkarte. `secondaryFlag` → dezentere „Ergänzend dazu"-Auszeichnung.
  // Ohne `reason` greift der Registry-Text (products[id].text).
  function productCard(p, reason, secondaryFlag) {
    const claims = (p.claims || []).map((cl) => `<div class="product__claim">${icon("checkSage")}${cl}</div>`).join("");
    const eyebrow = secondaryFlag ? "Ergänzend dazu" : "Passend zu deinem Ergebnis";
    return `
      <div class="product${secondaryFlag ? " product--secondary" : ""}">
        <div class="product__top">
          ${p.image ? `<img class="product__img" src="${ASSET}${p.image}" alt="${p.name || ""}" onerror="this.style.display='none'">` : ""}
          <div>
            <div class="eyebrow" style="margin-bottom:5px;">${eyebrow}</div>
            <div class="product__name">${p.name || ""}</div>
            <div class="product__sub">${p.sub || ""}</div>
          </div>
        </div>
        <div class="product__body">
          ${(reason || p.text) ? `<p class="product__why">${reason || p.text}</p>` : ""}
          ${claims ? `<div class="product__claims">${claims}</div>` : ""}
          <button class="mv-btn mv-btn--ghost mv-btn--block js-product-more" data-link="${p.link || ""}">${p.cta || "Mehr erfahren"}</button>
          ${p.disclaimer ? `<p class="product__disclaimer">${p.disclaimer}</p>` : ""}
        </div>
      </div>`;
  }

  /* ---------------- TODO-Ergebnisseite (Content-Gate) ---------------- */
  function renderTodoResult(ev) {
    const R = C.result, T = R.todo;
    const screen = el(`<section class="screen"></section>`);

    const sections = T.sections.map((s) => `
      <div class="todo-slot">
        <span class="todo-slot__alpha">${s.alpha}</span>
        <div>
          <div class="todo-slot__label">${s.label}</div>
          <code class="todo-slot__field">${s.field}</code>
        </div>
      </div>`).join("");

    const qaRows = ev.summary.map((r) => {
      const row = el(`<div class="qa-row"><span class="qa-row__q"></span><span class="qa-row__a"></span></div>`);
      row.querySelector(".qa-row__q").textContent = r.q;
      row.querySelector(".qa-row__a").textContent = r.a;
      return row;
    });

    const node = el(`
      <div class="result todo-result">
        <div class="result__logobar"><img src="${ASSET}logo-black.png" alt="miavola"></div>
        <div class="todo-banner">
          <div class="todo-banner__tag">${icon("info")}<span>${T.banner}</span></div>
          <p>${T.bannerText}</p>
        </div>
        <div class="result__section result__section--first">
          <div class="eyebrow">Vorgesehene Ergebnis-Struktur (education-first)</div>
          <div class="todo-slots">${sections}</div>
        </div>
        <div class="sec-divider"></div>
        <div class="result__section">
          <div class="eyebrow">${T.qaHeading}</div>
          <div class="qa-list" id="qa"></div>
        </div>
        <div class="result__cta" id="cta"></div>
        <p class="result__legal">${R.legalDisclaimer}</p>
      </div>`);

    const qa = node.querySelector("#qa");
    qaRows.forEach((r) => qa.appendChild(r));
    screen.appendChild(node);
    renderCta(node.querySelector("#cta"));
    return screen;
  }

  function renderCta(cta) {
    if (!cta) return;
    const R = C.result;
    cta.innerHTML = "";
    // „Ergebnis per Mail sichern" bewusst entfernt (Leo, 2026-07-03) — kommt später
    // als Klaviyo-Event + Flow zurück. Bis dahin: zurück zum Shop + Neustart.
    if (R.backLink) {
      const back = el(`<a class="mv-btn mv-btn--burg mv-btn--block" style="text-align:center;text-decoration:none;"></a>`);
      back.textContent = R.ctaBack || "Zurück zu miavola.de";
      back.setAttribute("href", R.backLink);
      cta.appendChild(back);
    }
    const restart = el(`<button class="link-btn link-btn--muted" style="align-self:center;"></button>`);
    restart.textContent = R.restart;
    restart.addEventListener("click", () => {
      state.answers = {}; state.email = ""; state.optIn = false;
      goTo(0);
    });
    cta.appendChild(restart);
  }

  /* ---------------- Produkt-Link (Schnittstelle) ----------------
     Verlinkt auf die echte Produktseite, sobald `link` aus products.md
     gesetzt ist. Ohne Link: sichtbarer Hinweis (kein Dead-End). */
  app.addEventListener("click", (e) => {
    const btn = e.target.closest(".js-product-more");
    if (!btn) return;
    const link = btn.getAttribute("data-link");
    if (link) window.open(link, "_blank", "noopener");
    else window.alert("TODO: Produktlink aus content/products.md (Feld `link`) ergänzen.");
  });

  /* ---------------- Start ---------------- */
  async function boot() {
    C = await loadContent();
    if (!C) { document.getElementById("app").textContent = "Inhalte (content.json) konnten nicht geladen werden. Bitte über einen lokalen Server öffnen (python3 -m http.server)."; return; }
    FLOW = [{ type: "intro" }, ...C.flow, { type: "email" }, { type: "analysis" }, { type: "result" }];
    MAX_QUESTIONS = FLOW.filter((s) => QUESTION_TYPES.has(s.type)).length;
    render();
  }
  boot();

  // Test-/Editor-Hook: interner Zugriff für Logik-Tests und die spätere Editor-Vorschau.
  // Rendert nichts und verändert kein Verhalten.
  window.__quiz = { state, evaluate, goTo, get content() { return C; }, get flow() { return FLOW; } };
})();
