# Lecture 2 chunk: why CO₂ is hard to get, and how plants cope: C₃ → C₂ → C₄ → CAM (lecturer, 28 Oct 2026, evening)

The lecturer is away and wants this built in the same structure as the electron-transport chain and the dark-reaction strip: real protein renders, one spatial schema, one part spotlighted per slide, an animation per slide. Quality first: check every fact and every frame yourself.

## The logic flow (lecturer, near verbatim)
- The slides before this chunk are live in `src/pilot/plates.ts` `ORDER`:
  - C0 bridge;
  - C2 RuBisCO, with the Earth-history animation;
  - C1 C₃ photosynthesis, C3 reduction, C3b regeneration, C4 sucrose and starch;
  - C6 photorespiration. Its animation ends "Why would a plant need this? Is getting CO₂ to RuBisCO so hard?"
- C10 "CO₂ uptake: from the air to RuBisCO" (live, `figs/cp10.ts`) answers: yes. CO₂ must pass the boundary layer, the stomata and the mesophyll, and every open stoma loses water. It ends "Getting CO₂ to RuBisCO is hard: how have plants coped?"
- Then this chunk:
  - **C₃** (temperate, cool, moist): RuBisCO takes CO₂ straight from the leaf air spaces; refixation of photorespired CO₂ in C₃ leaves (C11).
  - **C₂** (C11a): glycine moves to the bundle sheath, and its photorespired CO₂ is released and refixed next to RuBisCO.
  - **C₄** (C12): a CO₂ pump. PEP carboxylase in the mesophyll, the C₄ acid to the bundle sheath, CO₂ released around RuBisCO. It costs extra ATP, so C₄ plants dominate hot, bright, often dry regions (tropics, subtropics) and C₃ plants temperate regions.
  - **CAM** (C13): stomata open at night, CO₂ stored as malic acid in the vacuole; by day the stomata close and CO₂ is released to RuBisCO. Arid regions.
- **The driving force to show:** CO₂ is hard to get, and it's hardest when hot and dry, because stomata close and photorespiration rises. Each mechanism answers that under its conditions.
- **Show the conditions:** temperate vs tropical/hot vs arid, and day vs night, especially for CAM. Show how stomata relate: open and closed, day and night.

## Style (binding)
- **One spatial schema for the chunk,** new module `figs/leaf-schema.ts` (+ css), in the 7m1 / dark-strip look (`figs/cell-schema.ts`, `figs/chain.ts`):
  - a leaf section strip: outside air and boundary layer → stoma (2 guard cells) → air space → mesophyll cell (cell wall, plasma membrane, chloroplast, vacuole) → bundle-sheath cell (chloroplast, mitochondrion) → vein;
  - membranes as bilayers where the scale allows, otherwise as clean double lines in the deck's colours.
- **Proteins as real structure renders,** with the same pipeline and look as `scripts/cell_render.mjs` and `src/assets/cell/`.
  - Verify each PDB entry on RCSB first.
  - Candidates: RuBisCO 8RUC (have); PEP carboxylase (maize C₄ isoform, e.g. 5VYJ; check); carbonic anhydrase (plant β-CA, e.g. pea 1EKJ); NADP-malic enzyme (maize or *Flaveria*; check); pyruvate,phosphate dikinase (maize 1VBG; check); glycine decarboxylase (have).
  - Fetch structures with plain curl from RCSB only. No other downloads, no package installs, no bot-check circumvention.
- **Molecules:**
  - carbon form (`figs/carbon-form.ts`): PEP C–C–C(P), oxaloacetate/malate C–C–C–C, pyruvate C–C–C, glycine C–C–N, serine C–C–C–N;
  - CO₂ and O₂ as atom balls, HCO₃⁻ as a ball group with its label;
  - ATP and NADPH as the deck's tags.
- **Spotlight variants per slide (C10, C11, C11a, C12, C13):**
  - `m1` the whole schema with the slide's parts lit;
  - `m3` a zoom on the lit part.
  - **C10:** the CO₂ path and the conductances (gb, gs, gm) lit, with Cₐ ≈ 430, Cᵢ ≈ 300, C꜀ ≈ 200 ppm.
  - **C11:** C₃, with mesophyll RuBisCO lit and photorespired CO₂ partly refixed by chloroplasts lining the cell wall.
  - **C11a:** C₂, with the glycine shuttle and bundle-sheath glycine decarboxylase lit.
  - **C12:** C₄, with the pump (CA, PEPC, C₄ acid, decarboxylase, PPDK) and bundle-sheath RuBisCO lit.
  - **C13:** CAM, in one cell, with day and night as two panels: stomata open and closed, the vacuole filling with malic acid and emptying.
  - Plus one **conditions figure per slide:** a small climate strip with temperate (C₃), warm (C₂), tropical/hot and bright (C₄), arid (CAM), each with 1–2 example crops.
- **Wiring:**
  - a new module `figs/leafv.ts` exporting `leafFigures(n)`, joined in `plates.ts` like `cellFigures` (prefix 'm');
  - the new m-variants are the only ones listed on C10–C13; old variants are unlisted (the lecturer: "delete the old schemas").
  - Report the `plates.ts` lines; I wire them.
- **Text rules:**
  - scientific terms only, no figurative words;
  - every abbreviation spelled out at first use;
  - numerals; one unit per slide, stated;
  - leads in short lines;
  - a lead plus at most 3 points, with at most 1 equation line each;
  - no meta text in figures or animations (no "schematic", "cut to fit", "not to scale").

## Animations (one per slide, keys 'lf10', 'lf11', 'lf11a', 'lf12', 'lf13')
- **Camera:** one fixed framing, no zoom. At most one slow pan, ≥ 2 s, eased.
- **Motion:** smooth eased curves, no jitter.
- **Counts:** the smallest whole unit, inputs drawn and numbered first, no molecule without a visible source; exchanges shown as exchanges.
- **Length:** ≤ 40 s. Each ends on a question that leads to the next slide.

| Key | What it shows |
|---|---|
| lf10 | CO₂ 1 travels air → boundary layer → stoma → air space → cell wall → chloroplast → RuBisCO, while H₂O leaves through the same stoma; the ppm values step down; then the stoma half-closes on a hot dry day, and Cᵢ and C꜀ fall. |
| lf11 | A temperate C₃ leaf at midday: CO₂ in, RuBisCO carboxylates; some oxygenation; the photorespired CO₂ from the mitochondrion is partly refixed by chloroplasts lining the wall. Then heat → more oxygenation. |
| lf11a | The C₂ glycine shuttle, per 2 O₂: glycine 1–2 move to the bundle sheath; glycine decarboxylase releases CO₂ 1 next to bundle-sheath RuBisCO; serine returns. |
| lf12 | C₄, per 1 CO₂: CO₂ → HCO₃⁻ (CA) → PEPC + PEP → C₄ acid → bundle sheath → decarboxylase → CO₂ at RuBisCO; pyruvate back → PPDK + ATP (2 ATP equivalents) → PEP. Then the climate strip: hot and bright → C₄ wins. |
| lf13 | CAM, day and night, in one cell: night: stomata open, CO₂ → HCO₃⁻ → PEPC → malic acid into the vacuole (numbered); day: stomata closed, malic acid out → CO₂ → RuBisCO behind closed stomata. Water loss drawn small. |

## Facts to verify (fact table with sources and read depth, in the report)
- C₄ cost: C₃ 3 ATP + 2 NADPH per CO₂; C₄ 5 ATP + 2 NADPH per CO₂ (NADP-ME type; von Caemmerer & Furbank).
- Where C₄ and CAM plants grow and why (Sage 2004/2016; Edwards et al. 2010, Science, C₄ grasslands; Still et al. 2003 C₄ distribution).
- CAM: share of species (≈ 6–7 %), water-use efficiency (Borland 2009; Males & Griffiths 2017).
- Bundle-sheath CO₂ in C₄ (≈ 10× air; von Caemmerer & Furbank 2003).
- Refixation in C₃ (Busch et al. 2013).
- C₂ (the existing C11a fact table in the cc11a.ts header).

## Workflow
- Scratch copy `$S/co2-coping/deck`, rsync'd from live, with `node_modules` symlinked. Vite on port 5250.
- **QA:**
  - `tsc` must be clean;
  - headless shots of every figure variant and every animation beat end plus the busiest frames;
  - look at them yourself: labels ≥ 11 px, nothing cut, proteins read as proteins, counts correct.
- Do not edit `research/figure-briefs/picks.json`, live `plates.ts` or live `index.ts`.
- **Slide text** for C10 (live, keep it unless a fact is wrong), C11, C11a, C12 and C13: write the new PLATE text in your scratch copies of `cc11.ts`, `cc11a.ts`, `cc12.ts` and `cc13.ts` and report it before → after. I review and apply.
- **Order:** C12 (C₄) first, since it is the centrepiece, then C13, C11a, C11, C10. Send "main" a short note with the C12 contact sheet when it is done.
- **Final message:** fact table; files; `plates.ts` and `index.ts` lines; text before → after; contact-sheet paths; doubts.
