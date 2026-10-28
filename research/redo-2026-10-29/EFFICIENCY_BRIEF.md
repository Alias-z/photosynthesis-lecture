# Carbon bookkeeping and the efficiency of photosynthesis, on slides and in animations (lecturer, 29 Oct 2026)

## The lecturer's questions
- "Why is 3 CO₂ the minimum?"
- "Why do 5 triose phosphates come back and only 1 is used? It seems very inefficient."
- "Make this clear on the slides and in the animation. Also the overall efficiency of photosynthesis. Make variations to show me."

## The answers, and the content to put on screen (all checked)
- **Why 3 CO₂.** Each CO₂ fixed gives 2 × 3-C. Per CO₂, 1 RuBP (5 C) must be rebuilt from whole triose phosphates (3 C each).
  - 1 CO₂: 5/3 = 1⅔ triose phosphates back ✗.
  - 2 CO₂: 10/3 ✗.
  - 3 CO₂: 15/3 = 5 back, 1 out ✓.
  - 15 is the smallest common multiple of 3 and 5.
- **Why 5 go back.**
  - RuBP is the CO₂ acceptor. Of the 18 C made per 3 CO₂, 15 C were already there as 3 RuBP; only 3 C came from the air.
  - The 15 C go round again as RuBP; the 1 triose phosphate that leaves holds exactly the 3 C fixed.
  - Carbon efficiency of the cycle: 100 %, apart from photorespiration.
- **Energy.**
  - Per 3 CO₂ the cycle uses 9 ATP + 6 NADPH, none made; ADP, Pᵢ and NADP⁺ go back to be recharged. Per CO₂: 3 ATP + 2 NADPH, ≈ 8–10 absorbed photons.
  - The energy invested in the 5 recycled triose phosphates is kept in RuBP. It is released in the RuBisCO reaction, so it is not lost.
- **Overall efficiency of photosynthesis.**
  - The maximum conversion of solar energy into biomass is ≈ 4.6 % for C₃ and ≈ 6.0 % for C₄ (Zhu, Long & Ort 2008, Curr Opin Biotechnol 19:153; and Zhu, Long & Ort 2010, Annu Rev Plant Biol 61:235).
  - Verify the exact loss steps in their Fig. 1: radiation outside 400–700 nm, reflection and transmission, photochemical inefficiency, carbohydrate synthesis, photorespiration, respiration. State every value exactly as published, with its basis (% of incident solar energy).
  - The lecturer is on the ETH VPN, so publisher full texts may load with plain curl or WebFetch. No bot-check circumvention.
  - Optional: realistic crop values, e.g. ≈ 1–2 % over a growing season, only if sourced.

## Build (scratch copy `$S/efficiency/deck`, rsync'd from live; vite on port 5270)
`$S` = /private/tmp/claude-502/-Users-zhongyua--codex-visualizations-2026-10-18-01a14e64-129b-7041-8fab-d6753ae41888-claude-handoff/5ab943f9-d753-4192-bfa6-3efc5cb53ace/scratchpad

### 1. New figure variants for C3b (regeneration of RuBP)
Live text is already updated, with the "Why 3 CO₂." point and an acceptor lead. Build them in the deck's dark-strip / carbon-form style, in a new module `figs/carbonbook.ts`, joined like the others; report the `plates.ts` lines.

| Variant | What it shows |
|---|---|
| k1 | **Carbon balance per 3 CO₂:** 3 RuBP (15 C, carbon balls) + 3 CO₂ (3 C) → 6 triose phosphates (18 C) → 5 back to 3 RuBP (15 C) + 1 out (3 C), with the acceptor's 15 C coloured differently from the new 3 C, so students see the new carbon leave. |
| k2 | **"Why 3 CO₂" table as a figure:** rows for 1, 2 and 3 CO₂ (carbon made / needed to rebuild RuBP / triose phosphates back / out), with ✗ ✗ ✓ and carbon balls. |
| k3 | **The acceptor as a loop:** a ring of RuBP carbons that stays, with the new carbons entering from CO₂ and leaving as triose phosphate. |

### 2. A new staging of the 'regeneration' animation
Staging 'b', listed after the existing one:
- **Beat 1:** the carbon count 18 C = 15 C (acceptor, its own colour) + 3 C (new). The new carbons are coloured from the moment CO₂ is fixed.
- **Beat 2:** the "why 3" counter: try 1 CO₂ (✗ 1⅔), 2 CO₂ (✗ 3⅓), 3 CO₂ (✓ 5).
- **Beat 3:** the 5 triose phosphates go back as 3 RuBP; the 1 with the new 3 C leaves.
- **Beat 4:** the energy ledger, ATP used 9, NADPH used 6.

Use the dark strip (anim/dk1-common.ts helpers, SPOT); one fixed framing; eased motion; numbers numbered. Report the `index.ts` line.

### 3. New slide C4e, "Efficiency of photosynthesis"
Placed after C4 (sucrose and starch) and before C6 (photorespiration); report the ORDER change.
- **Text** (lead in short lines; 3 points; 1 eq each; scientific terms):
  - lead: "At most ≈ 4.6 % of the solar energy is stored in biomass by C₃ plants, ≈ 6 % by C₄ plants." Use the exact published values.
  - points:
    - **Carbon** (the cycle keeps every fixed carbon);
    - **Energy per CO₂** (3 ATP + 2 NADPH, ≈ 8–10 photons);
    - **Energy losses** (the main steps, with numbers in the eq);
  - the last losses (photorespiration) lead into C6.
- **Figure variants (≥ 4):**
  - an energy-loss waterfall from 100 % sunlight to 4.6 %, redrawn from Zhu et al. 2008 Fig. 1 with a credit;
  - a Sankey-style band;
  - a C₃ vs C₄ comparison;
  - one drawing that links the losses to the parts already taught: light outside PAR (slide 3), photochemistry (slides 7–10), the cycle (C1–C3b), photorespiration (C6), respiration.
  - No meta text; values with sources; letters ≥ 11 px.
- **Animation key 'eff':**
  - 100 "units" of sunlight shown as a bar or a stream of photons;
  - each loss step peels off its share, labelled, in order;
  - ending at ≈ 4.6 units in sugar, and the question "<b>Photorespiration takes a large share: why does RuBisCO's oxygenation cost so much?</b>" (C6 next);
  - one fixed framing; ≤ 30 s.
- **Wiring:** a new module `figs/ce04e.ts` with `{ PLATE, VARIANTS, draw }`; report the `plates.ts` import and plate lines.

## QA and report
- **Checks:** `tsc` must be clean. Take headless Chrome shots of every variant and every beat end plus mid-motion frames, build a contact sheet with PIL (run `python3` without `-I`), and look at every frame yourself.
- **Final message:**
  1. fact table with sources and read depth;
  2. files to copy;
  3. `plates.ts` and `index.ts` lines;
  4. slide text for C4e;
  5. contact-sheet paths;
  6. doubts.
