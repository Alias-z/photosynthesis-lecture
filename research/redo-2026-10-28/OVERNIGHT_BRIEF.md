# Overnight build, 28 Oct 2026: shared brief for every builder

The lecturer (call them "they") is asleep. They asked for the rest of the deck to be finished overnight, from slide 11 to C15, so that in the morning they can pick from many options. The deadline is Thursday 29 Oct. Work carefully: last night the slides 6+ were rejected as "childish, repetitive, no research". This brief is your only context, so read all of it before you start.

## 0. Read first (in this order)
1. `HANDOFF_2026-10-27_NIGHT.md`, all of it. It covers the principles, the text rules, the figure rules, the code map, the QA tricks and the mistakes not to repeat.
2. The lecturer's rules, one file per rule. Read every `lecture-*.md`, plus `msc-thesis-figure-reference.md` and `eva-rosenqvist-lecture.md`, in
   `~/.claude/projects/-Users-zhongyua--codex-visualizations-2026-10-18-01a14e64-129b-7041-8fab-d6753ae41888-claude-handoff/memory/`.
3. The research already done for your chunk (§6 lists the files). Use it, but check it against the full texts.
4. The model slide 4b, `src/pilot/figs/l05.ts`: title, a one-sentence lead with the cause, then 2–3 points. Also read slides 8–10b (`s08c.ts`–`s11c.ts`, with `l08c.ts` and `chain.ts`) for the lit-part pattern.

## 1. What the lecturer wants (the short version)
- **Less is more.** Each slide holds only what a bachelor student must remember forever, as function and connections. History, numbers and stories go only in the animation. Never use cofactor trivia, timescales or flash counts.
- **Text:**
  - every word physically exact; no vague amounts (write ≈ 300, not "hundreds");
  - every claim names its object;
  - headings are textbook terms, never slogans or "X, not Y";
  - no filler sentences, no citations in the slide text, no cross-references;
  - Chl *a* / *b* in italics; photosystem II (PSII) and photosystem I (PSI) spelled out;
  - both sides of a comparison labelled, organisms named.
- **Chunk method:** chunk → hook questions → essentials → reference images → slide text → figures → animation script.
  - Hook questions must be everyday, curious questions someone would ask at dinner, never a number puzzle. Each has its step-by-step answer, ending on the chunk's concepts.
- **Each fact and each figure appears ONCE in the deck.** §6 says which chunk owns which facts. Do not draw another chunk's figure.
- **Real images** from strong papers (micrographs, structures, classic data graphs):
  - restyle them to the deck's look (Bristol paper, deck fonts; `scripts/halftone.py` for photos);
  - credit each one on the figure in small grey type and in `src/assets/SOURCES-<prefix>.md` (a new file for your chunk; see `SOURCES-L2a.md` for the format);
  - copyrighted figures may be used in this lecture (the lecturer decided on 27 Oct); credit them exactly: authors, year, journal, figure number.
- **Many DIVERSE variants** (the lecturer, 28 Oct: "you cannot guarantee if I like it or not; make more"):
  - **at least 8 figure variants per slide**, drawn from at least four different approaches: (1) a restyled real image; (2) a clean drawing of the standard schematic; (3) a classic data graph redrawn from a paper; (4) a combination of real image and drawing; (5) a whole-schema view with this slide's part lit, where your chunk has a schema;
  - the variants must differ in idea, not only in colour or layout;
  - each variant shows only the takeaway terms, big and sparse; balanced, with no label crossing another label or an arrow.
- **Picks are untouchable:**
  - never edit `research/figure-briefs/picks.json`;
  - every variant the lecturer picked stays listed with its id unchanged; list picks first, then your new variants, then the older unpicked ones;
  - picks are read by the slide's pick key (§3);
  - new variant ids are `v1`, `v2`, … (check that they do not collide with any id already on that slide).

## 2. How to work (process and safety)
- **Your own copy.** Work ONLY in your own copy, never in the live project (`/Users/zhongyua/.codex/visualizations/2026/10/18/01a14e64-129b-7041-8fab-d6753ae41888/claude-handoff/photosynthesis-lecture-ethz`, served live on port 5174, which the lecturer uses). Set it up like this:
  ```
  SCR=/private/tmp/claude-502/-Users-zhongyua--claude-spares-spare-hM1lLo/5ab943f9-d753-4192-bfa6-3efc5cb53ace/scratchpad
  LIVE=/Users/zhongyua/.codex/visualizations/2026/10/18/01a14e64-129b-7041-8fab-d6753ae41888/claude-handoff/photosynthesis-lecture-ethz
  mkdir -p $SCR/<prefix> && rsync -a --exclude node_modules --exclude backups --exclude .git --exclude dist $LIVE/ $SCR/<prefix>/deck/
  ln -s $LIVE/node_modules $SCR/<prefix>/deck/node_modules
  cd $SCR/<prefix>/deck && npx vite --port <port> --strictPort   # run in the background
  ```
- **New files only, with your prefix.** Do not edit shared files other than `plates.ts`, and report your `plates.ts` lines; the main thread merges them by hand.
  - Text modules go in `src/pilot/figs/<prefix>NN.ts`. Leave the old text modules (`k0x.ts`, `s12r.ts`, `text-c10.ts`, …) untouched.
  - Figure modules also go in `src/pilot/figs/<prefix>NN.ts`. A new figure module lists picks + new + old, and delegates the old ids to the old figure module.
  - Your own CSS file is fine.
- **Do not change `figs/chain.ts` output.** The slide 7–10b animations parse its markup. If you need new parts, draw them in your own module, or add them to chain.ts strictly additively, and prove that every existing call renders byte-identical (diff the strings before and after).
- **Reading papers:**
  - prefer full texts that are openly reachable with WebFetch (PMC, eLife, PLOS, publisher open access, bioRxiv);
  - the built-in browser (`mcp__Claude_Browser__*`) is allowed only in a tab you create yourself, closed when done; never use the user's Chrome;
  - if a paper is behind a bot check, use the reference board's images and list the paper as "to read" in your report;
  - never invent a figure, a number or a quote: every number on a slide or figure must come from a paper you read, and is named in the sources line.
- **Reference boards** live in `src/assets/refs/<board>/` (`refs.json` + images). Your chunk's board is in §6. You may add images to YOUR board only, appending entries in the same format. The lecturer has not yet picked from the boards for these chunks. Use the board images: they are already collected.
- **Progress file.** Keep `$SCR/<prefix>/PROGRESS.md` updated after each step (what is done, what is next), so the work can be resumed if your process dies.
- **No questions.** The lecturer is asleep and the main thread is merging. Decide with the defaults in this brief, and record every doubt in the report.
- **Hook questions:** write `src/pilot/hooks/<hook-file>.json`, in the format of `src/pilot/hooks/L5-electron-transport.json`.
  - At least 4 candidates, with ids a, b, c, …, each with its story, steps, concepts and "see".
  - Its `slides` lists your slides by their displayed numbers.
- **QA before you report:**
  - `npx tsc --noEmit -p .` must be clean;
  - take a headless Chrome screenshot of every variant (`pilot.html?solo=<n>&v=<id>` on your port; the command is in the handoff §3) and LOOK at each one;
  - fix any overflow (elements with scrollHeight − clientHeight > 2), any label touching another label or an arrow, any empty lopsided area, and any text too small to read from the back of a lecture hall (under ≈ 20 px at 1600 wide);
  - keep the screenshots in `$SCR/<prefix>/shots/`.
- **Never** commit, push, touch port 5174, touch `picks.json`, or delete anything in the live project.

## 3. Lecture 2 order A (live since 28 Oct 2026, lecturer-approved) and pick keys
Moved slides keep their old number as pick key (`pick` in PlateText, see `types.ts`), so their picks stay with them.

| Shown | Slide | Current modules (text, figures) | Pick key |
|---|---|---|---|
| C1–C4 | the cycle | k01–k04 with c01, c02, c03, c04b | C1–C4 |
| C5 | Rubisco oxygenation | k05, c05 | C5 |
| C6 | Photorespiration | k06, c06 | C6 |
| C7 | Light-response curve | k09, l15 | C8 |
| C8 | FvCB model | k10, c12 | C9 (pick: a) |
| C9 | Measuring leaf gas exchange | k07, c11 | C7 |
| C10 | NEW: the CO₂ path (chunk cp) | — | C10n |
| C11 | C₃ → C₂ | text-c10 C11, c08 | C11 |
| C12 | C₄ | text-c10 C10, c09 | C10 |
| C13 | CAM | text-c10 C12, c10 | C12 |
| C14 | Rising CO₂ | text-c10 C13, c12b | C13 |
| C15 | From leaf to loaf | text-c10 C15, c13 | C15 |

Lecture 1 slides 11–13 keep their numbers. Their figure picks are:
- 11: a, b (figures of `l12.ts`);
- 12: b (`l13.ts`, "Thesis inset").

These picks are the direction the lecturer liked: build toward them.

A chunk may propose merging or splitting a slide, but must NOT change the numbering itself. Put the proposal in the report, and build the default (the slides above).

## 4. Animations (phase 2; phase 1 writes the scripts only)
- **Script:** beats with tag, caption and cite; the clicks; about 30–40 s; ending on the question the next slide answers.
  - One click per camera view or talking point; cause and effect in one click.
  - Brisk motion: each move ≈ 0.8–1.2 s.
  - Minimal moving parts: portraits, clippings and labels just appear.
  - Halftone portraits, newspaper or journal clippings, Bristol paper, deck fonts.
  - Every element named; one history story at most, where it helps.
- **3–4 stagings per animation**, different in story or camera, not in colour. For example: (A) zoom into the slide's own figure and back out; (B) history-led, with the classic experiment's apparatus or data; (C) real-image-led (micrograph or structure); (D) side-by-side comparison.
- The animation must match the slide figure exactly where it reuses it.
- The engine: `src/pilot/anim/` (`types.ts`, `player.ts`, `index.ts`, and `b6f8-common.ts` + `b6f8-a.ts` as the model).
  - Beats go in your own `anim/beats-<prefix>.ts`, not in `beats.ts`.
  - Animation keys start with your prefix.

## 5. What to deliver (phase 1: text + figures + hooks + animation scripts)
Write `$SCR/<prefix>/REPORT.md` with:
1. **Plot:** concepts to take home (table), the hook candidates (ids), and the line from this chunk into the next.
2. **Per slide:**
   - BEFORE / AFTER text table (title, lead, points);
   - the variant list (id, one-line idea, approach 1–5);
   - the sources used;
   - the animation script table (beats, clicks, captions, cites) plus 3–4 staging ideas.
3. **Files:** every file created or changed (paths relative to deck/), and the exact `plates.ts` lines (imports + PLATES entries) to paste.
4. **Doubts:** anything uncertain, any paper you could not read, any proposal to merge or split a slide.

Your final message to the main thread: at most 250 words, with the REPORT.md path.

## 6. The chunks (prefix · port · slides · board · hook file · facts owned)

### pp · 5181 · Lecture 1 chunk 6, Photoprotection with chlorophyll fluorescence · slides 11, 12, 13
- **Board and hooks:** board `L6-photoprotection`; hook file `L6-photoprotection.json`.
- **Theory:** the c2c chain (figs/chain.ts, look 'bil' = c2c, 'glow' = c2c3) with the photoprotection parts lit, continuing slides 7–10b. Example lit parts:
  - the antenna overflowing at PSII when light exceeds what the chain uses;
  - lumen H⁺ switching on PsbS and zeaxanthin in the antenna (heat);
  - damaged D1 in PSII and its repair;
  - fluorescence leaving PSII.
- **Facts owned:**
  - excess light (absorbed light rises linearly while CO₂ uptake saturates);
  - the fates of absorbed energy (photochemistry, heat/NPQ, fluorescence);
  - NPQ: ΔpH, PsbS, the xanthophyll cycle (Li et al. 2000);
  - photoinhibition and the D1 repair cycle;
  - chlorophyll fluorescence: Kautsky, PAM, Fv/Fm ≈ 0.83, used to measure stress;
  - SIF from space;
  - faster NPQ relaxation in field tobacco (VPZ, Kromdijk et al. 2016).
- **Sources:** Eva Rosenqvist's lecture (`~/Downloads/ERO_PhDcourse2021_ChlFluor.pdf`, strong teaching graphics; do not reuse the data marked unpublished); Maxwell & Johnson 2000; Baker 2008; Ruban 2016; Murchie & Niyogi 2011; Järvi et al. 2015; Tyystjärvi & Aro 1996; Porcar-Castell et al. 2021.
- **Existing research:** `research/redo-2026-10-27/B_PROTECT_FLUOR.md`.
- **The existing `fates` animation** (`l12.ts` plays it): keep it listed; your new animation scripts are separate.

### cb · 5182 · Lecture 2 chunk 1, the Calvin–Benson–Bassham cycle with sucrose and starch · slides C1–C4
- **Board and hooks:** board `C1-cbb-cycle`; hook file `C1-cbb-cycle.json`.
- **Theory:** one cycle, told by its three phases plus the export:
  - carboxylation (Rubisco: RuBP + CO₂ → 2 PGA);
  - reduction (PGA → triose phosphate, using ATP and NADPH from lecture 1);
  - regeneration (5 of 6 triose phosphates rebuild RuBP);
  - export: triose phosphate to sucrose in the cytosol by day, starch in the chloroplast for the night.
- **Name:** always "Calvin–Benson–Bassham cycle".
- **Facts owned:**
  - the ¹⁴C experiments: lollipop flask, autoradiograms after 5 s and 30 s, the light-off PGA/RuBP jump;
  - Rubisco as the carboxylase, and its abundance in leaves;
  - the cycle's stoichiometry: 3 ATP + 2 NADPH per CO₂;
  - sucrose vs starch; the night-time starch use, nearly exhausted by dawn (Graf et al. 2010).
- **Sources:** Bassham, Benson & Calvin 1950; Benson 2002; Sharkey 2019 (Photosynth. Res., history); Raines 2003; Stitt & Zeeman 2012; Graf et al. 2010 PNAS; Smith & Stitt 2007.
- **Existing research:** `research/redo-2026-10-27/C_CYCLE_RUBISCO.md`, `research/review-2026-10-27/A_cycle_export.md`.
- **Not yours:** oxygenation and photorespiration (rf), FvCB (rf).

### rf · 5183 · Lecture 2 chunk 2, Rubisco's two reactions → photorespiration → FvCB · slides C5, C6, C7, C8 · THE SPOTLIGHT SCHEMA
- **Board and hooks:** board `C2-photorespiration` (also read, but do not edit, the FvCB and light-response images j–n of `C3-gas-exchange`); hook file `C2-rubisco-fvcb.json`.
- **Theory:** ONE whole schema, used like the electron-transport chain on slides 7–10b. Each slide lights the part it teaches and dims the rest; the animations zoom into that part and back out.
- **The schema's base** is the lecturer's own MSc-thesis Figure 2b, a redraw of von Caemmerer 2000 Fig. 2.1:
  - the PDF path is in `msc-thesis-figure-reference.md`; read p. 7 with the Read tool (`pages: "7"`);
  - CO₂ and O₂ drawn as atom balls;
  - Rubisco's carboxylation and oxygenation;
  - PGA reduction with ATP and NADPH from the light reactions;
  - 5/6 regeneration vs 1/6 carbon gain;
  - triose-phosphate export with Pᵢ exchange;
  - brackets Ac ~ Vcmax, Aj ~ Jmax, Ap ~ TPU.
- **Extend the schema with the photorespiratory loop:**
  - 2-phosphoglycolate → peroxisome → mitochondrion (CO₂ and NH₃ released) → peroxisome → glycerate back to the chloroplast;
  - name only what a bachelor student needs.
- **Build:**
  - `figs/rf-schema.ts`, exporting `schemaSvg(look, lit)`;
  - **5–6 looks** (e.g. the thesis-style clean redraw; organelles drawn over a real TEM of a peroxisome between chloroplasts, Frederick & Newcomb 1969, which is on the board; flat icons; structure-based with a rendered Rubisco; minimal line art);
  - every part wrapped in `<g data-p="<part>" class="on|off">`, so the animations can find the parts; keep that markup stable;
  - lit sets: C5 Rubisco's two reactions (CO₂ vs O₂); C6 the photorespiratory loop; C7 the light reactions' supply of ATP + NADPH to RuBP regeneration (the light-response curve as the electron-transport limit); C8 FvCB with three sub-lits (Rubisco limit · RuBP-regeneration limit · triose-phosphate-export limit).
- **On every slide:** besides the schema variants, the other approaches (real data graphs: O₂ inhibition, Forrester 1966; quantum yield at 2 % vs 21 % O₂, Ehleringer 1977; A/Ci with Ac/Aj, the wheat curve in the thesis Fig. 5; light-response curves of sun and shade leaves; Rubisco specificity vs speed; …).
- **Facts owned:**
  - O₂ competes with CO₂ at Rubisco, and oxygenation rises with temperature;
  - the photorespiratory pathway across three organelles, and its cost (CO₂ and NH₃ released, ATP and NADPH spent);
  - mutants that need high CO₂ (Somerville & Ogren 1979);
  - the light-response curve;
  - the FvCB model (the ONLY FvCB figure in the deck);
  - optionally, as a candidate point for C6, the benefit that photorespiration supplies nitrate assimilation (Busch, Sage & Farquhar 2018, Nature Plants); put it in the report as a proposal.
- **Sources:** Ogren & Bowes 1971; Bowes, Ogren & Hageman 1971; Somerville & Ogren 1979; Peterhänsel et al. 2010; Sage, Sage & Kocacinar 2012; Farquhar, von Caemmerer & Berry 1980; von Caemmerer 2000; Busch 2020 (Plant J.); Walker et al. 2016.
- **Existing research:** `research/review-2026-10-27/B_rubisco_photorespiration.md`, `D_leaf_fvcb_climate.md`; `research/redo-2026-10-27/D_PHOTORESP_CCM_GAS.md`.
- **Not yours:** CO₂ recapture by the arrangement of chloroplasts and mitochondria (cc), the photorespiration bypass in crops (cr), stomata and mesophyll conductance (cp).

### cp · 5184 · Lecture 2 chunk 3, the CO₂ path into the chloroplast · slides C9, C10 (C10 is new, pick key `C10n`)
- **Board and hooks:** board `C3-gas-exchange` (leave its images j–n to rf); hook file `C3-co2-path.json`.
- **Theory:** conductances in series. CO₂ crosses the leaf boundary layer, then the stomata, then the mesophyll (intercellular air → cell wall → membranes → chloroplast stroma), and its concentration drops at each step (Ca → Cs → Ci → Cc):
  - flux = conductance × concentration difference (Fick);
  - the same stomata let water vapour out.
- **Default split:** C9 measuring leaf gas exchange (IRGA, A and transpiration, Ci calculated); C10 the CO₂ path with its three conductances. Propose another split if it teaches better, but build the default.
- **Real images:** SEM of a stoma; a leaf cross-section (light micrograph or SEM) with the path drawn on it; the IRGA instrument.
- **Facts owned:**
  - boundary-layer, stomatal and mesophyll conductance;
  - Ci vs Cc;
  - stomata trade CO₂ in against water out;
  - how gas exchange is measured.
- **Sources:** Lawson & Blatt 2014; Flexas et al. 2008 and 2012; Evans 2021 (New Phytol., mesophyll conductance: walls, membranes and spatial complexity); Terashima et al. 2011; Long & Bernacchi 2003.
- **Existing research:** `research/review-2026-10-27/D_leaf_fvcb_climate.md`.
- **Not yours:** FvCB and the light-response curve (rf).

### cc · 5185 · Lecture 2 chunk 4, C₃ → C₂ → C₄, plus CAM · slides C11, C12, C13
- **Board and hooks:** board `C4-co2-concentration`; hook file `C4-co2-concentration.json`.
- **Theory:** where photorespired or fixed CO₂ is released, relative to Rubisco:
  - C₃ leaves already recapture part of their photorespired CO₂ inside one cell, because chloroplasts and stromules line the cell wall and the mitochondria sit behind them (Sage & Sage 2009, Plant Cell Physiol., rice TEMs; Busch, Sage, Cousins & Sage 2013, Plant Cell Environ.). The lecturer calls this an advantage, and wants this research shown;
  - C₂ photosynthesis moves glycine to the bundle sheath, where glycine decarboxylase releases the CO₂ next to Rubisco (Rawsthorne 1988; Sage et al. 2012 and 2014, proto-Kranz → C₂ → C₄);
  - C₄ pumps CO₂ into the bundle sheath with PEPC (Kranz anatomy; Hatch & Slack 1966);
  - CAM separates uptake (night) from Rubisco (day).
- **Default slides:** C11 C₃ recapture → C₂; C12 C₄; C13 CAM.
- **Sources:** Sage & Sage 2009; Busch et al. 2013; Sage, Sage & Kocacinar 2012 (Annu. Rev. Plant Biol.); Sage, Khoshravesh & Sage 2014 (J. Exp. Bot.); Hatch 1987; Edwards & Ku; Borland et al. 2009 or Males & Griffiths 2017 for CAM.
- **Existing research:** `research/review-2026-10-27/C_ccm_c2_c4_cam.md`; `research/redo-2026-10-27/D_PHOTORESP_CCM_GAS.md`.
- **Not yours:** the photorespiratory pathway itself (rf), FACE (cr).

### cr · 5186 · Lecture 2 chunk 5, photosynthesis and crops · slides C14, C15
- **Board and hooks:** board `C5-crops`; hook file `C5-crops.json`.
- **Theory:** what the lecture's mechanisms mean for crops:
  - rising CO₂ helps C₃ more than C₄, because it suppresses oxygenation (FACE; Ainsworth & Long 2005/2021; Long et al. 2006);
  - lower grain zinc, iron and protein (Myers et al. 2014);
  - the efficiency ceiling (Zhu, Long & Ort 2008/2010);
  - engineering photorespiration (South et al. 2019);
  - from leaf to grain (C15).
- **Facts owned:** the ones above.
- **Existing research:** `research/review-2026-10-27/D_leaf_fvcb_climate.md`, `research/redo-2026-10-27/DRAFT_PAGES_LECTURE2.md`.
- **Not yours:** VPZ and NPQ (pp), the FvCB figure (rf).
