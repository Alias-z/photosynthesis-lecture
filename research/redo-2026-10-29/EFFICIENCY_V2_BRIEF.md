# C4e "Efficiency of photosynthesis", version 2: beautiful, in the deck's style, explaining why (lecturer, 29 Oct 2026)

The lecturer: "What you're drawing now is ugly. You can have that slide, but make it pretty, make it explain why this is happening, and fit our style."

The current variants e1–e4 are bar charts, Sankey and tiles, which read as generic charts. Replace them. Keep the numbers (Zhu, Long & Ort 2008/2010, already verified).

## One figure: the journey of sunlight through a leaf (variant f1, listed first; e1–e4 unlisted)
- **The scene, in the deck's own drawing style.** Use the same palette, line weights, atom balls, tags and protein renders as the electron-transport chain (`figs/chain.ts`, 7m1), the dark-reaction strip (`figs/cell-schema.ts`) and the leaf section (`figs/leaf-schema.ts`). It reads left to right as one picture, not a chart:
  1. **Sunlight:** a sun at the left sends a broad beam drawn as a soft spectrum band (UV violet → visible rainbow → infrared deep red), 100 units wide.
  2. **The leaf surface:** a leaf in cross-section (the leaf-section look). The infrared and UV part of the band passes by or turns to heat (−51.3). A thin slice bounces off as reflection and passes through as transmission (−4.9), in green tones.
  3. **The thylakoid:** a small inset of the 7m1 chain strip (photosystem II and photosystem I renders). The blue part of the band narrows to the red level: "every photon works as a red photon", the extra energy shed as heat (−6.6). Echo slide 4a's excitation diagram as a tiny level icon: blue → S₂ → relaxes to S₁ → heat.
  4. **The stroma:** the ATP and NADPH tags flow to a small cycle icon (the Calvin–Benson–Bassham ring from the strip), with sugar coming out. Most of the band leaves here as heat (−24.6): 8 photons per CO₂, but sugar keeps only about a third of their energy.
  5. **RuBisCO with O₂:** the 8RUC render with an O₂ ball; a rust slice peels off as photorespiration (−6.1).
  6. **The mitochondrion** (the strip's mitochondrion): a slice peels off as respiration (−1.9).
  7. **At the right:** sugar becoming the bread glyph (`figs/grain.ts`), with "4.6" in large type.
- **The band.** Its width is proportional to energy (100 units, honest proportions) and shrinks smoothly as each loss peels off at the place where it happens. Each loss is a soft curl leaving the band, with one short label: the term plus its number ("outside 400–700 nm −51.3"). Losses are warm greys, photorespiration rust, the remaining energy amber.
- **Quiet, airy and elegant:** generous white space, a gentle paper texture, no axes, no gridlines, no boxes around everything. Letters ≥ 12 px. One small credit line: "values: Zhu, Long & Ort 2008, 2010 · C₃ leaf, 30 °C".
- **Variant f2:** the same scene with C₄ shown as a second, slightly wider final stream. No photorespiration curl in C₄, a larger sugar step (−28.7), and 6.0 at the end.
- **Variant f3:** the same scene, zoomed to the 3 "why" places (surface, thylakoid, stroma). Use a fixed crop, not a camera move.

## The animation 'eff', rebuilt in the f1 scene (≤ 30 s, one fixed framing, no zoom)
- The beam is a smooth flow of photon particles, coloured by wavelength.
- At each place, the particles that are lost peel away with an eased drift, and the label and number fade in.
- A running "energy left" readout sits under the bread: 100 → 48.7 → 43.8 → 37.2 → 12.6 → 6.5 → 4.6.

| Beat | What it shows | Caption (exact; ≤ 3 lines) |
|---|---|---|
| 1 · Light outside 400–700 nm | UV and infrared particles peel off | "Chlorophyll uses only photons from 400–700 nm; the rest of sunlight, 51.3 %, cannot drive photochemistry." |
| 2 · Reflection and transmission | green particles bounce off or pass through | "The leaf reflects or transmits ≈ 10 % of this light: 4.9 %." |
| 3 · Photochemical inefficiency | blue particles shrink to red with a heat shimmer | "A blue photon carries more energy than a red one, but both drive 1 electron: the excess, 6.6 %, is lost as heat." |
| 4 · Carbohydrate synthesis | ATP and NADPH go into the cycle; most energy leaves as heat; sugar forms | "8 photons drive 3 ATP + 2 NADPH per CO₂, but sugar stores only about a third of their energy: 24.6 % is lost." |
| 5 · Photorespiration and respiration | the RuBisCO + O₂ curl, then the mitochondrion curl; bread appears with 4.6 | "Photorespiration takes 6.1 % and respiration 1.9 %: at most 4.6 % of sunlight ends up in biomass. <b>Why does RuBisCO's oxygenation cost so much?</b>" |

## Slide text (exact; replace the current text in `figs/ce04e.ts`)
- **Lead:** "At most ≈ 4.6 % of the solar energy ends up in biomass in C₃ plants, ≈ 6 % in C₄."
- **Light outside PAR and reflection.**
  - text: "Chlorophyll uses only 400–700 nm; the leaf reflects or transmits ≈ 10 % of it"
  - eq: "−51.3 · −4.9 % of solar energy"
- **Photochemical inefficiency.**
  - text: "Every absorbed photon drives 1 electron at the energy of a red photon; the excess becomes heat"
  - eq: "−6.6 %"
- **Carbohydrate synthesis and photorespiration.**
  - text: "Sugar keeps about a third of the energy of the 8 photons per CO₂; photorespiration and respiration take more"
  - eq: "−24.6 · −6.1 · −1.9 → 4.6 % left"
- **Refs:** unchanged.

## Workflow
- **Scratch copy:** re-sync your efficiency scratch copy from live first. Since your build, live has changed `ce04e.ts` (2 wording edits) and much else.
- **Rules:**
  - build in new or existing `ce04e` files and `anim/eff.ts`;
  - do not touch other live files;
  - `tsc` must be clean;
  - headless shots of f1–f3 and of every animation beat, at its end and mid-motion; look at them yourself;
  - the lecturer judges beauty: compare with the deck's best figures (7m1, the strip, the leaf section) before handing over.
- **Report:**
  - the files to copy;
  - the `plates.ts` change, which unlists e1–e4 and lists f1–f3;
  - the contact-sheet paths.
