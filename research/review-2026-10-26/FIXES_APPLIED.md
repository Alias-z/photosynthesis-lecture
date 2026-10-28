# The 20 wrong-claim fixes, applied 26 Oct 2026

These are the fixes from §1 of [SUMMARY.md](SUMMARY.md), approved by the lecturer. Each fix covers the slide text, its figure labels in every listed variant, and the same claim wherever else it appeared.

| # | Where | Now reads | Also changed |
|---|---|---|---|
| 1 | Slide 1 | "Water is oxidised, O₂ is released"; figure step "Oxidise water" | Slide 10: "Water oxidation releases H⁺"; figure labels "water oxidation" |
| 2 | Slide 1 | "Rubisco fixes CO₂ / ATP and NADPH make it into sugar" | Slide 15 figure: ATP and NADPH "used to make sugar" |
| 3 | Slide 3, figures X and Y | "far-red: plants use it with PAR / some cyanobacteria use it alone"; source Zhen et al. 2022 added | Figure X: "human vision" label set beside its bracket to make room |
| 4 | Slide 4b | "Red photons reach S₁, blue a higher state (Sₙ)"; "From Sₙ the electron drops…"; the 430 nm level is labelled Sₙ in all five variants; source Reimers et al. 2013 added | The same level is labelled Sₙ on slide 12 and in the pigments (B) and fates (A, B) animations |
| 5 | Slide 5b | "Chlorophyll removes most blue and red / Less green is absorbed, so more is reflected and transmitted" | — |
| 6 | Slide 6 | "LHCII feeds mainly photosystem II (PSII) / and PSI too"; figure headings "PSII + LHCII", "PSI + LHCI" instead of one-way arrows; source Wientjes et al. 2013 (BBA) added | — |
| 7 | LIFE animation, "Primates" | "Our primate ancestors gained a third colour receptor: red fruit and young leaves stand out against green."; Melin et al. 2017 added | — |
| 8 | LIFE animation, "Bees" | "Bees see ultraviolet, blue and green; red looks dark to them."; Peitsch et al. 1992 added | — |
| 9 | Slide 7 | "PSII sits in the stacked grana; PSI and ATP synthase in all unstacked membrane (stroma lamellae, grana ends); b₆f in both." | — |
| 10 | Slide 7, figure B | "PSII ≈ 85–90 % · PSI ≈ 97 %"; Wientjes et al. 2013 (JPCB) added | ORDER_AFTER_4.md, slide 8 row |
| 11 | Slide 12, all variants; fates animation A (stopwatch) and B (badge) | Photochemistry "~300 ps" instead of "< 100 ps"; time-zoom and race-lane bars now end at 300 ps | — |
| 12 | Slide 12 point 3; FATES beat 6 | "…carotenoids catch triplets in the antenna, but not in the PSII reaction centre"; "When excitation lingers, a triplet can form…"; figure labels "carotenoids (antenna)"; Telfer 2014 added | — |
| 13 | Slide 10 | "In strong light the lumen reaches about pH 6 (± 0.5)…"; figure E: pH mark 5.5–6.5, "first seconds: mostly Δψ / steady light: mostly ΔpH (debated)"; Wilson et al. 2021 added | Slide 13 figures: lumen pH "≈ 6" |
| 14 | Slide 11, figure C | Footnote "assumes 14 H⁺ per 3 ATP (c₁₄ ring) and a full Q cycle" | — |
| 15 | Slide 11 | "Cyclic flow adds H⁺, not NADPH. / …whether C₃ leaves need it for ATP is debated."; "PGR5 protects PSI. / An acid lumen slows b₆f, so fewer electrons reach PSI, which has no fast repair cycle."; figure H "Agreed: PGR5 protects PSI"; figure J "protected by an acid lumen (needs PGR5)" | — |
| 16 | Slide 11, all figures | The to-O₂ route drawn thinner (also its band in figure F), with "small in flowering plants" beside every to-O₂ label | — |
| 17 | Slide 13 point 1 | "The protein PsbS senses the low pH and switches the antenna to dissipate heat (NPQ); the carotenoid zeaxanthin strengthens it." | — |
| 18 | Slide 13 point 2 | "In shade the fast part relaxes in a minute, the zeaxanthin part in 10–15 min; a model puts the cost at 13–32 % of canopy CO₂ uptake."; Nilkens et al. 2010 and Zhu et al. 2004 added | — |
| 19 | Slide 13, figure I | Potato card "no gain; lower in fluctuating light" (marked worse). The Arabidopsis 2020 card was already there | — |
| 20 | Slide 14, figure H | "stays low: damaged PSII / or locked-in quenching / recovers over hours or longer"; Verhoeven 2014 added | — |

**Layout changes needed by the fixes**
- The sources line is wider: 1330 instead of 1240 px, on every page. With the two new sources, slide 13's line had wrapped.
- Some labels were moved so the longer text does not collide: slide 11 figures B and D, slide 10 figure E, and slide 3 figure X.

**Not changed (outside the 20)**
- The "smaller wording fixes" in SUMMARY.md §1.
- The research-note errors.
- The missing topics in §2.
- Unlisted (hidden) figure variants.

**Checks**
- **Method:** the fixes were made and checked in a scratch copy, then copied in. Type-check and production build pass.
- **What was captured:** every listed variant of slides 1–15, the lead pages, the lecture versions, and every animation frame (16 time points per beat). That is 925 images, each captured before and after the change.
- **Unchanged:** 574 images are pixel-identical. These are all sky frames, pigments A, slides 4, 5, 8 and 9, and the LIFE beats that were not edited.
- **Changed:** 351 images differ, and only where an edit was made. In the animations the difference is confined to the edited label or caption: the Sₙ subscript, the ~300 ps badge, or the caption bar.
- **Visual check:** every changed page and beat was inspected by eye. The captions fit on two lines and no label collides.
- **After copying in:** 16 renders from the live server are pixel-identical to the checked copy.
