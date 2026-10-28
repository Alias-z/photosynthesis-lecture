# New slide C11a "C₂ photosynthesis" (lecturer, 28 Oct 2026)

## Where it sits
- **Lecture-2 order** (live in `src/pilot/plates.ts`, `ORDER`): … the dark side (C1, C3, C4, C6–C8) → **escaping photorespiration:** C11 "Refixation of photorespired CO₂" → **new C11a "C₂ photosynthesis"** → C12 "C₄ photosynthesis" → C13 "CAM" → crops C14, C15.
- **The lecturer wants this chunk lighter and more interesting:** "talk about the evolution of C₃ to C₂ plants, then to C₄ plants, and CAM plants".
- **C11a bridges refixation and C₄.** C₂ plants move photorespiratory glycine into the bundle sheath, where glycine decarboxylase releases CO₂ next to Rubisco. This is the photorespiratory CO₂ pump, and a common step on the way from C₃ to C₄.

## Read first
- **Slides C11, C12, C13:** `figs/cc11.ts`, `cc12.ts`, `cc13.ts` and their kits `cc-kit.ts`, `cc-schema.ts`. Match their look and text style.
- **`research/redo-2026-10-28/GLYPH_BRIEF.md`:** the glyph standard and §4 workflow (scratch copy, own vite port, headless QA, report in the final message).
- **Other decks from this week on this topic:** `research/redo-2026-10-28/cc-ANIM_SCRIPTS.md`.

## Facts to check (report a table with sources and read depth)
- **What C₂ photosynthesis is:**
  - glycine decarboxylase confined to the bundle sheath;
  - glycine shuttle from mesophyll to bundle sheath;
  - the CO₂ build-up there;
  - the CO₂ compensation point between C₃ and C₄.
- **Examples:** *Flaveria* species (e.g. *F. ramosissima*), *Moricandia*, *Heliotropium*, *Panicum milioides*. Which are C₂ and which C₃–C₄ intermediate.
- **Evolution:** C₂ as a step on the path to C₄. The model of Heckmann et al. 2013 Cell (a smooth fitness landscape); Sage, Sage & Kocacinar 2012 Annu Rev Plant Biol; Sage 2014; Monson 1984; Schlüter & Weber 2016; Bräutigam & Gowik 2016. How many times C₄ evolved (≥ 60 lineages).
- **Sources:**
  - open access via plain curl/WebFetch;
  - no bot-check circumvention; if blocked, say so and use the abstract.

## Build (new scratch copy `$S/c2-slide/deck`, rsync'd from live)
- **The slide `figs/cc11a.ts` (+ css):** `{ PLATE, VARIANTS, draw }`, n 'C11a', status 'draft'.
  - A teaching title.
  - A lead.
  - At most 3 short points.
  - Numerals; numbers in `eq` blocks.
- **≥ 6 figure variants, truly different from each other:**
  - real figures from strong papers (restyled, credited, licence noted), e.g. leaf cross-sections of C₃ vs C₂ vs C₄ *Flaveria* and the Sage/Heckmann evolution path;
  - drawings in the deck's lecture-2 style: atom-ball CO₂/O₂, carbon-form molecules from `figs/carbon-form.ts`, the Rubisco render;
  - a 3-panel C₃ → C₂ → C₄ comparison of where glycine decarboxylase and Rubisco sit;
  - one "evolution path" figure.
- **Animation script only** (≤ 40 s, slide style, leading into C12 C₄). Do not build it.
- **Rules:**
  - never edit `picks.json`, `plates.ts`, `index.ts` or existing slide modules;
  - report the `plates.ts` import and plate lines, and the `ORDER` insert after 'C11';
  - `tsc` must be clean;
  - headless shots of every variant and contact sheets; look at them (letters ≥ 11 px, no overlaps).

## Final message
1. The fact table.
2. Files to copy.
3. The `plates.ts` lines.
4. The variant table.
5. Contact-sheet paths.
6. The animation script.
7. Doubts.
