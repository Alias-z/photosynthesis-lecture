# CO₂-fixation overview schema in the electron-transport (7m1) style (lecturer, 28 Oct 2026)

The lecturer, near verbatim:

> For the electron transport chain we fixed one style, then used it to highlight each component at one time. For the dark part we should do the same: Rubisco and the oxygenation loop. Draw Rubisco as a protein render, put in the molecules (PGA and the others), and give one overview, then focus on one component at a time. Ideally this graph joins the ETC graph in the animation: after ATP and NADPH are made, the camera goes to the right, the cycle sits next to it, and NADPH and ATP flow to the dark side. The style is the ETC style; the schema relationships are those I picked on slide C6. Make enough variants to pick from, to speed things up.

## Read first
- `GLYPH_BRIEF.md` (same folder). Its standard, §3 (shared files) and §4 (workflow: scratch copy, own port, headless QA, no bot-check circumvention, report in the final message) apply to you.
  - Exception: you may NOT edit `figs/rf-schema.ts`, `figs/cb-common.ts`, `figs/cb0*.ts`, `figs/rf0*.ts` or `figs/rff0*.ts`. Unmerged work on those files is waiting.
  - Build in new files only.
- **The style reference, slide 7, variant 7m1:** `figs/chain.ts`, `chainSvg(id, 'pdb-bilayer', lit, { mol: true })`.
  - Proteins are space-filling renders: flat colour, dark outline, true scale, dimmed to grey when not lit.
  - The small proteins plastocyanin, ferredoxin and FNR are renders too (`carrierImg`).
  - Molecules are atom balls (`illus.ts`: `molecule`, `water`, `o2`, `co2`, `hplus`, `tag`; `chain.ts`: `hring`, `atoms`, `tagG`, `rowG`).
  - Labels are ink; gas arrows grey; e⁻ arrows black; H⁺ paths red dotted.
- **The schema relationships, slide C6's 2 picks** (open `pilot.html?solo=C6&v=a` and `&v=v10`):
  - **a:** the Calvin–Benson–Bassham cycle drawn upright.
    - Rubisco at the bottom, fed by CO₂ and O₂ balls.
    - Carboxylation → PGA → reduction (ATP, NADPH) → triose-P.
    - "1 of 6" goes to sugar; "5 of 6" regenerates RuBP (pentagon).
    - Oxygenation gives PGA + 2-PG → photorespiration → "3 of 4 C back", "1 of 4 C lost" (CO₂).
    - FvCB brackets: Ac ~ Vcmax (Rubisco), Aj ~ J (electron transport), Ap ~ TPU (triose-P use).
    - Code: the old figure module drawn as C6 'a'; find it via `figs/rff06.ts` → `c06`/`c5`.
  - **v10:** the line look of `figs/rf-schema.ts` (`schemaSvg('line', LIT_C6)`).
    - A chloroplast outline holding the thylakoid and the cycle.
    - The loop goes to a peroxisome and a mitochondrion beside it: 2-phosphoglycolate → glycolate → glycine → serine (+ CO₂, NH₃) → glycerate → PGA, with ATP and ferredoxin costs.
  - Reuse `rf-schema.ts`'s part vocabulary (`Part`, `LIT_C5`, `LIT_C6`, `LIT_C7`, `LIT_C8`, `LIT_C8C`, `LIT_C8J`, `LIT_C8P`, `LIT_ALL`) by importing it, so every slide maps directly. Add your own lit sets for C1–C4: cycle overview, carboxylation, reduction + regeneration, sucrose/starch export.
- **Assets to reuse:**
  - **Rubisco:** `assets/rf/rubisco-8ruc.png` + `rubisco-8ruc.json`, spinach L8S8 with CABP. Its render script is `scripts/rf_rubisco_render.mjs`.
    - Re-render with that script if you need it at chain.ts scale (2.4 px per Å), a different view or a grey copy.
    - Fetch `https://files.rcsb.org/download/8RUC.cif` with plain curl if the cif is missing.
  - **Carbon-form molecules:** copy `/private/tmp/claude-502/-Users-zhongyua--claude-spares-spare-hM1lLo/5ab943f9-d753-4192-bfa6-3efc5cb53ace/scratchpad/dark-prep/deck/src/pilot/figs/carbon-form.ts` (unmerged; another builder made it) into your scratch as `figs/carbon-form.ts` and use it.
    - One C ball per carbon, a P disc per phosphate, an N ball per amino N: RuBP PCCCCCP, PGA/triose-P CCCP, 2-PG CCP, glycolate CC, glycine CCN, serine CCCN, glycerate CCC.
- **Lecture 2 order and texts:** `src/pilot/plates.ts`, and the slide modules `cb01–cb04` (C1–C4), `rf05–rf08` + `rff05–rff08` (C5–C8).

## What to build
1. **`figs/cbb-schema.ts` (+ css): `cbbSvg(id, layout, look, lit, opts)`, one overview of CO₂ fixation in the 7m1 style.**
   - Rubisco as the 8RUC render, at scale with the chain's proteins where the layout allows.
   - Molecules in carbon form, with their names in ink: CO₂, O₂, RuBP, 3-PGA, triose phosphate, 2-phosphoglycolate, glycolate, glycine, serine, glycerate, NH₃.
   - ATP and NADPH as the same tags as the chain, coming in from the light reactions; ADP + Pᵢ and NADP⁺ going back.
   - Sugar export: triose phosphate → sucrose (cytosol) / starch (chloroplast) as tags or C chains.
   - The photorespiration loop through a peroxisome and a mitochondrion, drawn as organelle outlines in the same quiet line style.
   - **Counts on the figure, per 3 CO₂ fixed.** Numerals only, each with its unit:
     - 3 CO₂ + 3 RuBP (3 × 5 C) → 6 3-PGA (6 × 3 C = 18 C);
     - reduction 6 ATP + 6 NADPH → 6 triose-P;
     - 5 triose-P → 3 RuBP, using 3 ATP;
     - 1 triose-P (3 C) exported.
     - The oxygenation loop per 2 O₂: 4 C in, 3 C back, 1 C lost as CO₂, plus NH₃.
   - FvCB brackets (Ac / Aj / Ap) as an option for C8.
   - Lit parts in colour; dimmed parts as in the chain (grey renders, glyphs at reduced opacity).
2. **Layouts.** The lecturer wants many to pick from:
   - **A "cycle":** pick a's upright cycle, with the photorespiration loop to the right as in v10.
   - **B "joins the chain":** the thylakoid membrane strip of the chain enters at the left edge. Use `chainSvg`/`focusSvg` cropped, or a slim strip drawn in the same style. Its ATP and NADPH tags flow right into the cycle, with the organelles further right. This layout is the one the linking animation will pan into, so its left edge must be able to sit flush against the right edge of the 7m1 chain figure: same membrane height, same colours.
   - **C "chloroplast frame":** v10's arrangement (chloroplast outline with a thylakoid stack, cycle inside, organelles outside) in the 7m1 style.
   - **Looks:** `bil` (as 7m1) and `glow` (as c2c3: lit parts glow, the rest pale silhouettes).
3. **Variants for C1–C8:** 3 layouts × 2 looks = 6 per slide, each lighting that slide's part (C1 all of the cycle; C2 Rubisco carboxylation; C3 reduction + regeneration; C4 export; C5 carboxylation vs oxygenation; C6 the loop; C7 the light-energy supply; C8 the FvCB limits, with brackets).
   - Optional extra: a crop/zoom variant on the lit part for C2, C5 and C6.
   - **Wiring:** don't edit the slide modules. Make a new module `figs/cbbv.ts` exporting `{ VARIANTS, draw }` per slide (e.g. `cbbFigures('C5')`). Report the `plates.ts` lines that join them after each slide's existing figures with `joinFigures(existing, cbb, 'k')` (or a similar prefix), so existing ids and picks are untouched (C6 picks a and v10; C9 pick a).
4. **QA:**
   - `tsc` must be clean.
   - Screenshot every new variant (`pilot.html?solo=C<n>&v=k…`) and make contact sheets.
   - Look at them: legible ≥ 11 px letters, nothing overlapping, counts adding up, the proteins reading as proteins.
   - Shoot one combined frame: layout B placed to the right of slide 7m1's chain (`chainSvg(…, { mol: true })` with all parts lit), showing that the 2 join.

## Not now
- **The linking animation** (light → dark pan). It comes after the lecturer picks a style.
- **Slide text:** do not edit it. Propose a per-slide "Per 3 CO₂" ledger (component · C · ATP · NADPH) as before → after in your report, in the deck's equation-block style (`Point.eq`, table via `figs/ledger.ts`).

## Final message
1. Files created.
2. The `plates.ts` join lines.
3. A variant table per slide.
4. Contact-sheet paths.
5. The combined chain + layout B frame path.
6. Proposed ledgers.
7. Doubts.

Aim for about 2 hours. Finish layouts A and B first for all slides, then C.
