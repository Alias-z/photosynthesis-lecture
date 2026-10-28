# Chunk cb (C1–C4, Calvin–Benson–Bassham cycle): phase-1 report

The builder (28 Oct 2026, night) returned this report in its message. The main thread saved it here because the builder could not write files. The work is merged live as `figs/cb01–cb04.ts`, `figs/cb-common.ts`, `figs/cb.css`, `hooks/C1-cbb-cycle.json`, `assets/SOURCES-cb.md`, plus the photos `assets/photos/cb-*`. The backup is in `backups/before-cb-2026-10-28/`. The animation scripts, with full beat tables, are in `research/redo-2026-10-28/CB_ANIM_SCRIPTS.md`.

## Theory of the chunk
One cycle, told as a carbon path (C1), its enzyme (C2), its energy (C3) and its exit (C4).

**Hooks** (`C1-cbb-cycle.json`):

| id | Question |
|---|---|
| a | Where does a tree's wood come from? (van Helmont) |
| b | What does a plant live on at night? |
| c | Can a leaf make sugar in the dark? |
| d | Why so much nitrogen fertiliser? |
| e | Why is kitchen sugar sucrose from beet and cane? |
| f | How do we see a leaf's first second? (¹⁴C) |

Recommended: a, with b as the alternative.

## Text, BEFORE → AFTER (AFTER is live)

**C1**

| | Before | After |
|---|---|---|
| Title | From light to carbon | Calvin–Benson–Bassham cycle |
| Lead | In the stroma, the Calvin–Benson cycle uses ATP and NADPH from the light reactions to fix CO₂ into sugar. | In the stroma, the Calvin–Benson–Bassham cycle fixes CO₂ into triose phosphate, using ATP and NADPH from the light reactions. |
| 1 | ATP and NADPH | **Carboxylation.** Rubisco adds CO₂ to ribulose 1,5-bisphosphate (RuBP, 5 C) / The product splits into two 3-phosphoglycerate (3-PGA, 3 C) |
| 2 | Light activation | **Reduction.** 3-PGA is reduced to triose phosphate (3 C) |
| 3 | Photosynthetic induction | **Regeneration.** Per 3 CO₂ fixed, 6 triose phosphates are made / 5 rebuild 3 RuBP; 1 leaves the cycle |

**C2**

| | Before | After |
|---|---|---|
| Title | Carboxylation by Rubisco | Rubisco |
| Lead | Rubisco attaches CO₂ to RuBP; the product splits into two 3-PGA. | Rubisco, the enzyme that fixes CO₂, works slowly, so leaves hold large amounts of it. |
| 1 | Discovery | **First product: 3-PGA.** ¹⁴CO₂ fed to algae for fractions of a second labels 3-PGA first / A three-carbon product: hence "C₃ photosynthesis" |
| 2 | Rubisco | **Turnover number.** *k*cat ≈ 3 CO₂ per second per active site, at 25 °C |
| 3 | Carboxylation | **Abundance.** ≈ 20 % of the nitrogen of a C₃ leaf / ≈ 40 % of its soluble protein |

**C3**

| | Before | After |
|---|---|---|
| Lead | ATP and NADPH reduce 3-PGA to triose phosphate; most triose phosphate is used to regenerate RuBP. | Reducing 3-PGA and regenerating RuBP use the ATP and NADPH of the light reactions: 3 ATP and 2 NADPH per CO₂ fixed. |
| 1 | Reduction | **Reduction.** Per CO₂: 2 ATP + 2 NADPH turn two 3-PGA into two triose phosphates |
| 2 | Regeneration | **Regeneration.** Per CO₂: 1 ATP, in the last step to RuBP |
| 3 | Cost | **Light–dark transient.** Light off: 3-PGA accumulates, RuBP falls to near zero within a minute (*Chlorella*) / Without RuBP, Rubisco stops fixing CO₂ |

**C4**

| | Before | After |
|---|---|---|
| Lead | Triose phosphate becomes sucrose for export by day and starch for use at night. | Triose phosphate leaves the chloroplast to make sucrose for the whole plant, or stays to make starch for the night. |
| 1 | Sucrose | **Sucrose.** Triose phosphate leaves the chloroplast in exchange for phosphate (Pᵢ) / Sucrose is made in the cytosol and exported to growing organs |
| 2 | Starch | **Starch.** Made from part of the triose phosphate, inside the chloroplast, by day |
| 3 | Starch degradation at night | **Starch degradation at night.** Near-constant rate: ≈ 95 % of the starch is used by dawn (*Arabidopsis*) / After an early dusk, breakdown slows, so starch still lasts until dawn |

## Variants (v1–v8 per slide; old ids a–j listed after)

| Slide | Variants |
|---|---|
| C1 | v1 three-phase wheel · v2 carbon squares 15 C + 3 C = 18 C · v3 the 1954 first drawing of the cycle, phases coloured · v4 Michelet 2013 Fig. 1 coloured · v5 phase ring, names only · v6 three turns make one triose phosphate · v7 wheel in a drawn chloroplast · v8 30 s chromatogram mapped onto the wheel |
| C2 | v1 5 s chromatogram · v2 lollipop photo + 5 s result · v3 RuBP + CO₂ → 2 3-PGA in carbon squares · v4 Goodsell spinach L₈S₈ · v5 leaf-N and soluble-protein bars · v6 structure + N column · v7 wheel with carboxylation lit · v8 reaction drawn over the 5 s spots |
| C3 | v1 Calvin Fig. 15 scan (light off) · v2 Fig. 15 redrawn · v3 wheel with ATP/NADPH chips · v4 stacked chips per CO₂ · v5 light-off wheel + curves · v6 Sharkey 2019 Fig. 3 band · v7 thylakoid feeding the wheel · v8 –COO⁻ → –CHO, what reduction means |
| C4 | v1 Graf Fig. 1A as published · v2 Graf redrawn · v3 TEM end of day vs end of night · v4 TEMs pinned to the curve · v5 cell by day, two routes · v6 day vs night cells · v7 wheel exit splits into sucrose and starch · v8 the translocator, one out and one in |

## Doubts the builder flagged
1. **Light activation is now in no chunk.** Fd–thioredoxin, Rubisco activase and the ≈ 15 min induction were on old C1. Possible line for C3: "Light also switches on four cycle enzymes through ferredoxin and thioredoxin".
2. **The lollipop** as the short-pulse apparatus is called a textbook simplification by Sharkey 2019, whose full text could not be read. Check C2 v2, hook f and animation beat 1.
3. **C4 is dense.** Possible trim: drop "and exported to growing organs", which C15 covers. Wheat and other grasses store the day's carbon mostly as sucrose and fructans, not leaf starch, so C4 names *Arabidopsis*.
4. **Image edits:**
   - C1 v3 has Sharkey's later labels removed from the 1954 drawing (a pixel edit).
   - The C4 TEMs are low resolution.
   - The C3 v6 crop shows label fragments at its edge.
5. **Numbers:**
   - kcat is Bar-On & Milo's land-plant value at 25 °C.
   - The ≈ 55 % "other chloroplast N" is the builder's own subtraction (75 − 20).
6. **To read:** Sharkey 2019, Benson 2002, Raines 2003, Stitt & Zeeman 2012, Bassham/Benson/Calvin 1950.
7. **Hook e** still needs a beet or cane photo.
8. **Main thread's note:** C2 point 1 and C3 point 3 are experiments (¹⁴C pulse; light-off transient). The rule says stories go in the animation. Keep them as take-homes, or move them into the animation?
