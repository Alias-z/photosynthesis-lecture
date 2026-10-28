# C2 "RuBisCO through Earth's history", version 3: the whole story, plus 3 new variants (lecturer, 29 Oct 2026, evening)

The lecture is today. Quality comes first: the lecturer judges every frame.

## The lecturer's critique of v2 (live: `anim/dk-c2story.ts`, staging 'v2')
1. "Human beings are walking backwards." The hunters face left and walk left, but their knees bend to the right (`hunter()` in `anim/c2story-scenes.ts`, legs `M0,-50 L4,-26 L0,0`).
2. "The illustration of RuBisCO is not clear." A protein render sits under the beam with no role.
3. "The text is outside the box." For example, "carboxylation" crosses the panel's left edge.
4. "RuBisCO seems to be affected only by the environment; it never changes itself. It must change its efficiency or evolve somehow."
   - v2 holds one enzyme fixed (today's land-plant RuBisCO) and changes only the air and the temperature.
5. "The leaf temperature always moves at the end, while carboxylation and oxygenation move with CO₂ and temperature. Very confusing."
   - In v2 the numbers and the leaf temperature switch only when the marker arrives at an era. The balance eases after that.

## The take-home (the whole story, approved)
How often RuBisCO takes up O₂ depends on 3 things: the air (CO₂, O₂), the temperature and RuBisCO itself.
- The air changed a lot.
- RuBisCO changed only slowly, and with a trade-off: more selective enzymes are slower.
- So many organisms concentrate CO₂ around RuBisCO instead.

## Captions: `C2STORY3` in `anim/beats-c2story.ts` (exact, approved; 8 beats)
1. **3 factors:** the balance and its 3 inputs.
2. **Origin and O₂:** ≈ 3 billion years ago, then the Great Oxidation Event (≈ 2.4 billion years ago).
3. **RuBisCO changed:** today's RuBisCOs compared. Land plants prefer CO₂ about twice as strongly as cyanobacteria, and are slower.
4. **Concentrating CO₂:** cyanobacteria and many algae raise CO₂ around a fast, less selective RuBisCO.
5. **Plants on land:** ≈ 470 million years ago; the Carboniferous (O₂ ≈ 30 %, low CO₂).
6. **Heat and cold:** dinosaurs (much CO₂, great heat), then ice-age humans (little CO₂, cold).
7. **Today:** since 1750, CO₂ up, warming, a hot, dry day.
8. **A better RuBisCO?:** clippings, then the question that leads to C1.

Do not edit the captions. If one does not fit your staging, say so in your report.

## Science (keep exactly; all in shared modules; read only)
- **`anim/c2story-model.ts`:**
  - oxygenations per 100 carboxylations = 100 × 2Γ*/C꜀;
  - Γ*(T) from Bernacchi 2001, scaled by O₂/20.95;
  - C꜀ = (200/427) × Cₐ, and 0.35 × Cₐ on a dry day;
  - leaf temperature = 25 °C + change in global mean temperature.
- **`anim/c2story-data.ts`:** the CO₂, O₂ and temperature records.
- **`anim/c2story-enzyme.ts` (new), RuBisCO itself:** the specificity factor S and kcat for cyanobacteria, green algae, land plants and red algae. `oxPer100S(s, t, ca, o2, k)` scales the readout by S_PLANT/s.
  - The values are provisional and are being checked against their papers now. Never hard-code them: always read `ENZYMES`, `enzyme()` and `S_PLANT`.
- **Beat 4, concentrating CO₂:** show it as a higher C꜀ at RuBisCO. In the cyanobacterium, use C꜀ = 10 × the air-equilibrium value. It is illustrative and stays unlabelled, but it is never shown as a measured number.
- **The 100-million-year point:** its leaf temperature, 42.8 °C, lies outside the fit range of the Γ* temperature response (to ≈ 40 °C). Keep the model, but do not print a precise number there; show "≈" and the direction only.

## Rules for every staging
- **One state drives every readout.** Each frame, compute the state from the time under the marker (or the dial setting): CO₂, O₂, leaf temperature, the enzyme's S and C꜀/Cₐ. The balance tilt, every number, the leaf temperature and the preference bar all follow that state, so they move together and stop together. No value may switch at the end of a beat.
  - The data are continuous, so values between eras are read from the records, not invented.
- **RuBisCO is drawn as on slide C2:**
  - the deck's RuBisCO render with RuBP below;
  - CO₂ arriving on the carboxylation side (left), O₂ on the oxygenation side (right);
  - atom-ball molecules (`figs/cell-schema.ts` `balls`; see `figs/rubside.ts` and `figs/cb02.ts`, the C2 variant mr3).
  - Students must see what RuBisCO does at a glance.
- **Text:**
  - every label inside its box on every frame;
  - letters ≥ 12 px;
  - captions ≤ 3 lines;
  - no meta text ("schematic", slide references);
  - words first, then a symbol in brackets ("CO₂ preference (S)"), never a bare symbol;
  - numerals; the spelling RuBisCO.
- **People and animals** face the way they walk, and their knees bend forwards.
- **Camera:** one fixed framing per beat, at most one slow, eased move, never a zoom in and then out. ≤ 40 s in all.
- **Style:** the deck's palette, atom balls, tags and protein renders. Compare your frames with `anim/dk-c2story.ts` v2, the C2 figure mr3 and the electron-transport chain 7m1.

## The 4 stagings (one builder each; each staging is a new file; together they play `C2STORY3`)
| Id | File | Idea |
|---|---|---|
| v3 | `anim/dk-c2story3.ts` (+ `dk-c2story3.css` if needed) | **v2 fixed.** The broken time axis with the CO₂ and temperature curves, the moving scenes, the balance and the readouts, all driven by one state. Beat 3 swaps the enzyme in the balance (cyanobacteria → green algae → land plants → red algae) in today's air at 25 °C, with the S and speed readouts; beat 4 raises C꜀ in the cyanobacterium. Beat 6 shows the dinosaur scene, then the ice-age scene. No farming beat. The hunters fixed (you own `c2story-scenes.ts`). v2 stays in its file, unlisted. |
| v4 | `anim/c2story-v4.ts` | **Three dials.** No time chart. In the centre, the RuBisCO active site, large: CO₂ and O₂ atom balls arrive from left and right at rates that follow the model. Below it, 3 round gauges, "air: CO₂ and O₂", "leaf temperature", "RuBisCO's CO₂ preference (S)", and one big counter, "O₂ taken up per 100 CO₂ fixed". Along the bottom, a thin era ribbon (small era vignettes or icons) with a marker. Each beat turns the dials smoothly and the counter follows. |
| v5 | `anim/c2story-v5.ts` | **Tree of life through time.** A log time axis from 3.5 billion years ago to today, with a lineage tree: cyanobacteria, red algae, green algae, land plants, C₄ plants (≈ 30 million years ago). Each tip carries its RuBisCO (S, plus a speed bar) and a CO₂-concentrating icon where it has one. Behind the tree, the air as 2 soft bands (CO₂ and O₂ from c2story-data). A moving marker carries a small balance for the spotlit lineage. Branching times must be sourced (verify; give the fact table). |
| v6 | `anim/c2story-v6.ts` | **Molecules at the active site.** A close-up of the stroma in the strip style: CO₂ and O₂ atom balls drift, in numbers proportional to their dissolved concentrations at C꜀ and the era's O₂ and leaf temperature. A few RuBisCO renders catch them, each capture weighted so that the tally matches the model. The tally reads "per 100 carboxylations: … oxygenations". A corner card shows the era (year, CO₂, temperature) and a small sparkline. Beat 3 swaps the RuBisCO type, and beat 4 crowds CO₂ around RuBisCO. |

## Ownership (to merge without conflicts)
- **Write only your own new files.** The v3 builder alone may also edit `anim/c2story-scenes.ts`.
- **Never edit:**
  - `beats-c2story.ts`, `c2story-enzyme.ts`, `c2story-model.ts` or `c2story-data.ts`. If you need a helper, write it in your own file.
  - `index.ts` or `plates.ts`; report the line instead.
  - `research/figure-briefs/picks.json`.
- **Don't commit.**

## Setup, QA and report
- **Scratch copy:** your own scratch copy of the live deck under `$S/<id>/deck`, made with `rsync -a --exclude node_modules --exclude .git --exclude dist --exclude backups` from `/Users/zhongyua/.codex/visualizations/2026/10/18/01a14e64-129b-7041-8fab-d6753ae41888/claude-handoff/photosynthesis-lecture-ethz/`.
  - Symlink `node_modules`, and run vite on your port: v3 5311, v4 5312, v5 5313, v6 5314.
  - `$S` = `/private/tmp/claude-502/-Users-zhongyua--codex-visualizations-2026-10-18-01a14e64-129b-7041-8fab-d6753ae41888-claude-handoff/5ab943f9-d753-4192-bfa6-3efc5cb53ace/scratchpad`
- **Wire it in your scratch only:** add your staging to the `c2story` entry in your scratch `anim/index.ts`, as `{ ...yourStaging, beats: C2STORY3 }`.
- **Checks:**
  - `tsc --noEmit` clean;
  - headless Chrome shots of every beat, at its end and in mid-motion;
  - a PIL contact sheet (`python3` without `-I`);
  - look at every frame yourself: overflow, overlaps, ≥ 12 px, readouts moving together.
- **Report:** the files to copy, the index.ts line, the contact-sheet path and your doubts. If a value you show is not computed from the shared modules, say where it comes from.
