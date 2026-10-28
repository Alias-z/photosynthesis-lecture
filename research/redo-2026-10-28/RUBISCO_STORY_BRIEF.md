# The Rubisco story: new slides C5a–C5c (lecturer, 28 Oct 2026)

## Where it sits (new lecture order, live in plates.ts `ORDER`)
- **Order:** electron transport (7–10b) → a light → dark bridge (C0, built separately) → **the Rubisco story:** C2 "Rubisco" (slow, abundant) → C5 "carboxylation and oxygenation" → **new C5a, C5b, C5c** → the dark side in full (C1, C3, C4, C6–C8) → C₃ → C₂ → C₄ → CAM → crops.
- **The lecturer's words, near verbatim:** "a light, interesting story about Rubisco: how plants' Rubisco evolved, including the super red Rubisco research; how the CO₂ level over time affects Rubisco; how the industrial revolution changes it now; we still face the problem of Rubisco's affinity; global warming: the warmer it gets, the more Rubisco favours O₂ over CO₂ because of how the gases dissolve. A light story; once students have a clue about Rubisco, we do the whole dark side."
- **Correct the physics:** both CO₂ and O₂ dissolve *less* in warmer water. CO₂ loses more, so the CO₂ : O₂ ratio at Rubisco falls, and Rubisco's own CO₂/O₂ specificity also falls with temperature. Verify both with sources (e.g. Jordan & Ogren 1984 Planta; Brooks & Farquhar 1985; Sage & Kubien 2007; Bernacchi 2001 for Γ*(T)).

## Start from
- `research/redo-2026-10-28/DARK_RUBISCO_EVOLUTION.md`: checked facts, hooks, slide options and figure concepts. Reuse them.
- Its corrections stand: Bouvier 2024 is in PNAS; Zhu 2004 gives a 210 ppm optimum, +3 % for a "today-tuned" plant Rubisco, and > 25 % only for foreign Rubiscos above the trade-off; South 2019 is +19–37 %.
- **Still to verify:**
  1. "Super" red-algal Rubisco: specificity (*Galdieria partita* ≈ 238; *Griffithsia monilis*). Attempts to put red-algal or other foreign Rubiscos into plants: Whitney et al. 2001 Plant J (expressed but not assembled in tobacco?); Lin et al. 2014 Nature (cyanobacterial Rubisco in tobacco). Any newer work: assembly chaperones, directed evolution (e.g. Wilson/Hanson/Whitney), ancestral reconstruction (Shih 2016; Lin 2022?). Report what really worked and what did not.
  2. The temperature numbers: the CO₂/O₂ solubility ratio and specificity from about 15 to 35 °C, and Γ* across the same range.
  3. CO₂ history numbers (glacial ≈ 180, pre-industrial 278, 2025 ≈ 427 ppm) and O₂ history (the Great Oxidation Event).
- Sources:
  - Open access via plain curl/WebFetch (PMC, PNAS, Nature Comms, CC BY journals).
  - No bot-check circumvention. If a page is blocked, say so and use the abstract or a citing review, stating the read depth as the draft did.

## Build (in a NEW scratch copy)
- **Folder:** `$S/rubisco-story/deck`, rsync'd from live as in GLYPH_BRIEF §4. Leave `$S/dark-prep/deck` untouched: its numbers work is unmerged.
- **Three slides, light in tone and on the page,** in the style of slides 1–5 and C1–C15:
  - each has a title (a textbook term or exact fact, never a slogan), a lead, and at most 3 short points with numerals;
  - numbers in `eq` blocks;
  - status 'draft';
  - suggested split:
    - **C5a, Rubisco's history:** born ≈ 3 billion years ago in air with much CO₂ and almost no O₂ → O₂ rose and CO₂ fell → crop Rubisco tuned to ≈ 210 ppm → industry has pushed CO₂ to ≈ 427 ppm.
    - **C5b, Warming favours oxygenation:** the solubility ratio and specificity fall as leaves warm, so oxygenation rises. Rising CO₂ pushes the other way.
    - **C5c, A better Rubisco?:** red-algal Rubiscos are far more specific, but trade-offs and assembly block simple transplants; what engineering has achieved so far.
  - If the facts suggest 2 slides tell it better than 3, build both versions and say which you recommend.
- **Hook question:** C5a opens the chunk with one. Follow the pattern of the lead pages (`figs/lead07.ts`, `LEADS` in `plates.ts`): a common, curious question on the slide, with candidate answers and explanations in a "?" box. The draft's hook a is a good start.
- **Figures:** ≥ 6 variants per slide, truly different from each other.
  - Mix real figures from strong papers (restyled, credited, licence noted) with drawings; the draft's §4 concepts are a start.
  - Use the deck's glyph standard: atom-ball CO₂/O₂, the Rubisco render `assets/rf/rubisco-8ruc.png`.
  - Numerals only. One unit per number, stated.
- **Animation:** a script only (≤ 40 s, slide style, leading into the next slide), for C5a or C5b. Do not build it.
- **Wiring:**
  - new modules, e.g. `figs/rb5a.ts`, `rb5b.ts`, `rb5c.ts` (+ css), each exporting `{ PLATE, VARIANTS, draw }`;
  - report the `plates.ts` lines (import, plate entries) and the `ORDER` change (insert after 'C5'). I edit `plates.ts`.
- **Rules:**
  - never edit `picks.json`, `plates.ts`, `index.ts` or existing slide modules;
  - `tsc` must be clean;
  - headless shots of every variant and contact sheets; look at them (letters ≥ 11 px, no overlaps).

## Final message
1. A fact table with sources and read depth.
2. Files to copy.
3. The `plates.ts` lines.
4. A variant table per slide.
5. Contact-sheet paths.
6. The animation script.
7. Doubts.
