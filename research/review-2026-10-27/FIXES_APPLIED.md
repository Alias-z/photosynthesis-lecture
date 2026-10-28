# Lecture 2: order variant 1 and the 17 fixes, applied 27 Oct 2026

These are the fixes from §1 of [SUMMARY.md](SUMMARY.md) and the order of [ORDER_LECTURE2.md](../figure-briefs/ORDER_LECTURE2.md), variant 1. Both were approved by the lecturer. The missing topics (§2) are left for a separate draft.

## Order

| New | Slide | Was | Code |
|---|---|---|---|
| C1–C6 | Bridge … photorespiration (with C4b) | same | c01–c06, c04b |
| C7 | What a leaf's CO₂ exchange measures | C11 | c11.ts |
| C8 | FvCB on one C₃ curve | C12 (first half) | c12.ts |
| C9 | C₂ photosynthesis | C7 + C8 merged | c08.ts (C7's figures listed as k–t, drawn by c07.ts) |
| C10 | C₄ | C9 | c09.ts |
| C11 | CAM | C10 | c10.ts |
| C12 | Rising CO₂ helps C₃ more than C₄ | C12 (second half) | new c12b.ts (figures g, h from c12.ts) |
| C13 | From leaf to loaf | same | c13.ts |

## The 17 fixes

| # | Slide (new) | Now reads |
|---|---|---|
| 1 | C1 lead | "Rubisco fixes CO₂; ATP and NADPH from the light reactions turn it into sugar. Light also switches the cycle on." |
| 2 | C2 point 3 | "…spent later, to reduce 3-PGA and to rebuild RuBP" |
| 3 | C4 point 2 | "A ratio of 1.5; linear electron flow alone gives ≈ 1.3 (lecture 1, slide 11). Photorespiration raises both costs." |
| 4 | C4b lead and point 2; C13 figures e, h | Many leaves store starch; wheat stores sucrose, and stem fructans. Figure e: "day store: mainly sucrose, little starch". Figure h: "night stock = stored sucrose". Schnyder 1993 added |
| 5 | C13 point 3 | "In elite bread wheat, ear photosynthesis matched or exceeded the shoot's; the flag-leaf blade gave only 3–18 %." |
| 6 | C5 point 2, figure e | Specificity falls; CO₂ solubility falls faster than O₂'s. In figure e both gases now drop in the warm leaf. Sources: Jordan & Ogren 1984 instead of Walker 2016 |
| 7 | C5 point 3 sources | Bathellier 2018 and Flamholz 2019 added; Bouvier 2024 removed |
| 8 | C6 point 2 | "At 3 oxygenations per 10 carboxylations, each CO₂ gained costs ≈ 4.8 ATP + 3.1 NADPH instead of 3 + 2." |
| 9 | C6 point 3, figure g | "Mutants lacking a core step survive only in high CO₂; one bypass raised tobacco biomass by 11–24 % in small field trials." Cavanagh 2022 added |
| 10 | C9 point (from C7), figure p | "Grass C₄ arose where bundle sheaths were large". BEP: "close veins, small bundle-sheath cells"; PACMAD: "large bundle-sheath cells (> 15 % of leaf)" |
| 11 | C9 lead, points and figures | "mainly in the bundle sheath" in the text and 8 figure labels (also in C7's leaf-type figure). Point: "chloroplast CO₂ rises about 3-fold". Keerberg 2014 added |
| 12 | C9 figure f | "C\*: CO₂ compensation point without respiration" |
| 13 | C10 point 2 | "with some CO₂ leaking back, ≈ 5–6 ATP + 2 NADPH per CO₂ fixed". Wang 2022 added |
| 14 | C10 point 3, figure j | "more than 60 times" |
| 15 | C7 point 1, figures b, h | "stomatal conductance to CO₂ (water vapour's ÷ 1.6)"; "H₂O out − in"; "Cᵢ = Cₐ − 1.6 A / g_sw" |
| 16 | C8 points 1–2, figure a; C6 figure a | "Rubisco capacity (Vcmax) sets how steeply"; "Higher CO₂: RuBP regeneration sets the pace … (J), which light drives"; "Aj ~ J" (also in the shared scheme that C6 figure a reuses) |
| 17 | C12 (new slide), figure h | "C₃ crops gain ≈ 18 %: at +200 ppm CO₂ without stress; ≈ 10 % with low nitrogen or +2 °C." Sources: Ainsworth & Long 2021 instead of 2005; the grassland panel is labelled "biomass", "one trial; the cause … is debated" |

## Text written for the new structure

**C8 (FvCB), new third point** (its old one moved to C12): "The model has corners; leaves do not. It switches sharply between limits, as Blackman drew in 1905; measured curves round the corner (lecture 1, slide 15)." Sources: Busch et al. 2024 and Blackman 1905.

**C9 (C₂ merged), points:**
1. "C₃ leaves already refix some CO₂" (C7's point 1).
2. "Glycine decarboxylase moves to the bundle sheath … (slide C6)": the recall line back to photorespiration.
3. The glycine shuttle. C8's old third point (the Brassicaceae switch) is still shown in figure j.

**C12 (rising CO₂), new page text:**
- Lead: FACE, plus "extra CO₂ suppresses Rubisco's oxygenation (slide C5)".
- Three points:
  - C₃ crops gain ≈ 18 %.
  - C₄ crops gain only in drought.
  - Grain quality falls (zinc, iron, protein; Ainsworth & Long 2021).

**C13 course map:** zones relabelled for the new order. The atom-ledger note "the traced form from slide 9" follows lecture 1's renumbering.

## Checks
- **Build:** type-check passes.
- **Before vs after:** every lecture 2 page and lecture version (153 captures) was compared with the live version, with each slide mapped to its old position.
  - 124 figures are unchanged.
  - The 15 that changed differ only where a fix was made. Each was checked by eye, and every text column was read.
- **Layout fixes from the visual check:**
  - The C12 field-test condition text moved off the axis line.
  - Two labels that still carried fixed claims were corrected: "only in sheath" in C7's leaf-type figure, and "Aj ~ Jmax" in the shared scheme.
- **After copying in:** 14 renders from the live server match the checked copy.
- **Animations:** none in lecture 2.

## Not done
- The missing topics (SUMMARY §2).
- The smaller wording fixes, among them:
  - C10/C11 CAM's "C₄ chemistry";
  - the 12 H₂O equation in C4c;
  - "PGA" vs "3-PGA";
  - removing the limit braces from C6 figure a.
- The picks for lecture 2 slides: none had been made before.
