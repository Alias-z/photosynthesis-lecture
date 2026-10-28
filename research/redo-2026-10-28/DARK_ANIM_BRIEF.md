# Dark-reaction animations re-staged in the real-protein strip scene (lecturer, 28 Oct 2026)

## The lecturer's words, near verbatim
- "The animations should be in the similar scene, just like what we did in the electron transport."
- "Now we only use this kind of real protein-based thing. The other things are basically noise."
- "Notes like 'proteins at the chain scale, compartments cut to fit' are not needed in the handout, and not needed in animation at all."

## The scene
- **Use the dark-reaction strip:** `src/pilot/figs/cell-schema.ts`, arrangement 'strip'. It is one true-scale panorama to the right of the 7m1 electron-transport chain, with:
  - the thylakoid edge;
  - the stroma with Rubisco, GAPDH, PRK, glycerate kinase, GS and a starch granule;
  - the double-bilayer envelope with TPT and PLGG1;
  - the cytosol with sucrose;
  - the peroxisome (glycolate oxidase, catalase);
  - the mitochondrion (glycine decarboxylase, SHMT).
- **Your template:** the 'bridge' animation (`anim/bridge-common.ts`, `bridge-a.ts`, `bridge-b.ts`, `beats-bridge.ts`) already animates in this scene. Reuse its helpers by importing them; do not edit them.
- **Look and motion:** as in the electron-transport animations (`anim/psiim-common.ts`, `b6fq-common.ts`, `atpsm-common.ts`, `balance-common.ts`). Parts are lit per beat and the rest dimmed; molecules glide on eased paths.

## Rules for every animation (the lecturer's, all of them binding)
- **No meta text** anywhere on screen: no scale notes, no "cut to fit", no "schematic", no internal labels.
- **Counts belong to mechanism beats only.**
  - Use one unit per animation, stated once on screen. Per 3 CO₂ for the cycle (cb1, cb3, cb4). Per reaction for rf5. Per 2 O₂ for photorespiration (rf6).
  - Show every counted event in full, numbered on screen (e.g. "CO₂ 1–3", "3-PGA 1–6", "ATP 1–6"), with a tally that ticks in step.
  - Later repeats may run faster, but none may fade out or be skipped.
  - Concept beats carry 1 short line at most and no arithmetic.
- **Numerals,** never number words.
- **Molecules:**
  - carbon form (`figs/carbon-form.ts`: one C ball per carbon, a P disc per phosphate, an N ball per amino N);
  - CO₂ and O₂ as atom balls;
  - ATP and NADPH as the deck's tags.
- **Motion:** smooth, eased, gently curved paths. No zigzag, no jitter, and no zooming unless the beat needs it. One camera move per beat at most.
- **Length:** ≤ 40 s per animation, in the slide's style, ending on the caption's question that leads to the next slide.
- **Text:** minimal. Label only the lit parts; dimmed parts carry no labels.

## Captions
- Use the live beats (`anim/beats-cb.ts`, `beats-rf56.ts`, `beats-rf78.ts`). Do not rewrite captions: new caption drafts are awaiting the lecturer.
- The one approved structural change: rf5 loses its Temperature beat (`R5_TEMP` out of `RF5`; warming now lives on slide C5b). Its on-screen ratio is **5 carboxylations : 2 oxygenations** (leaf at 25 °C, chloroplast CO₂ ≈ 200 ppm), not 3 : 1.
- If a beat list must change for the new scene, report it as before → after; do not apply it.

## What to build
For each animation, build one new staging, id `s`, listed first. The old stagings become unlisted (they stay drawable), except anim-rf6 staging `a`, the lecturer's pick, which stays listed.

| Key | Slide | Mechanism to show in the strip |
|---|---|---|
| cb2 | C2 Rubisco | Rubisco lit. Its 8 active sites; CO₂ joins RuBP → 2 3-PGA (carbon form, numbered); "≈ 3 per second per site" as a ticking counter; bulk. Ends on the CO₂-vs-O₂ question. |
| rf5 | C5 carboxylation and oxygenation | At Rubisco: carboxylation (RuBP 5 C + CO₂ 1 C → 2 × 3 C) and oxygenation (RuBP 5 C + O₂ → 3 C + 2 C), 1966 Forrester as a small inset if it fits. Then a numbered run of 5 carboxylations and 2 oxygenations. |
| cb1 | C1 the cycle | 3 CO₂ fixed → 6 3-PGA → 6 ATP + 6 NADPH → 6 triose phosphate → 5 back to 3 RuBP (3 ATP), 1 out. All numbered per 3 CO₂. The 1950s ¹⁴C history beats from the live CB1 if they fit. |
| cb3 | C3 reduction and regeneration | GAPDH lit with 6 ATP + 6 NADPH numbered; PRK lit with 3 ATP numbered; ADP, Pᵢ and NADP⁺ glide back to the thylakoid edge. |
| cb4 | C4 sucrose and starch | Triose phosphate out through TPT (Pᵢ in) → sucrose in the cytosol; or in the stroma → starch granule (day/night). |
| rf6 | C6 photorespiration | Per 2 O₂: 2 2-phosphoglycolate → 2 glycolate through PLGG1 → peroxisome → 2 glycine → mitochondrion → serine + CO₂ + NH₃ → glycerate → back → 3-PGA. "4 C in, 3 C back, 1 C lost", ATP and ferredoxin costs, NH₃ refixed by GS. |
| rf7 | C7 light-response curve | Strip scene plus a graph panel at the side, as balance-s2/s3 did on 10b. As light rises the curve draws; the limiting part is lit in the strip: first electron transport (thylakoid edge, ATP/NADPH supply), then Rubisco and the cycle at the plateau. |
| rf8 | C8 FvCB | Strip plus an A/Cᵢ graph panel. As the 3 limits draw (A꜀ Rubisco, Aⱼ electron transport, Aₚ triose-phosphate use), the matching part of the strip lights: Rubisco; the thylakoid supply; TPT and sucrose. The lowest rate is shown as the actual rate. |

## Wiring and workflow
- **Two builders work in parallel.** Each puts its shared code in its own common file: builder 1 `anim/dk1-common.ts`, builder 2 `anim/dk2-common.ts` (+ css). Stagings go in `anim/dk-<key>.ts`.
- **Never edit** `cell-schema.ts`, `bridge-*.ts`, `plates.ts`, `index.ts`, `research/figure-briefs/picks.json` or the slide text modules. If you need a hook in `cell-schema.ts` (e.g. a part id or label toggle), report it.
- **Report:**
  1. the `index.ts` lines (new staging first, old ones removed from the list, rf6 `a` kept);
  2. any beat-list change, as before → after;
  3. contact sheets of every beat end and of the busiest mid-beat frame;
  4. doubts.
- **Setup:** a scratch copy rsync'd from live (see `GLYPH_BRIEF.md` §4), your own vite port, `tsc` clean, headless QA with screenshots that you look at yourself.
- **Order:**
  - builder 1: cb2, then rf5, cb1, cb3;
  - builder 2: cb4, then rf6, rf7, rf8.

  After the first animation is QA'd, send "main" a short note via SendMessage with its contact sheet, then continue.
