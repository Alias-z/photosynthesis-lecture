# Lecture 2 preparation (dark-prep builder, 28 Oct 2026, about 10:20). Held back: the lecturer is reviewing lecture 1 first

The builder's changes are only in its scratch copy:
`/private/tmp/claude-502/-Users-zhongyua--claude-spares-spare-hM1lLo/5ab943f9-d753-4192-bfa6-3efc5cb53ace/scratchpad/dark-prep/deck` (vite on 5213).

Nothing is merged. Merge by hand later. The glyphs-l2fig follow-up landed live after the builder's 09:47 copy and touched `cc12.ts`, `rff06.ts`, `cc-kit.ts`, `cc-schema.ts`, `cr*.ts`, `c09.ts` and `l2-glyphs.ts`, so diff `cc12.ts` and `rff06.ts` three ways before copying them.

## Files changed in scratch (relative to src/pilot/)
| File | What changed |
|---|---|
| `figs/carbon-form.ts` (new) | One C ball per carbon, a P disc per phosphate, an N ball per amino N, on a bond line. Covers RuBP, PGA/triose phosphate, 2-PG, glycolate, glycine, serine, glycerate, PEP, pyruvate and the C₄ acid. |
| `figs/cb-common.ts` | `carbons()` gets a `'p'` kind; `cycleWheel` gets the `cform` option: C1 v1, C2 v7, C3 v3, C4 v7, cb3. |
| `figs/cb01.ts` | v2 labels per item and in total ("3 × 5 C = 15 C", and so on). |
| `figs/cb02.ts` | v3 and v8 carbon rows; "5 C + 1 C = 6 C = 2 × 3 C". |
| `figs/cb03.ts` | v4 per 3 CO₂ (9 ATP + 6 NADPH); v8 carbon form. |
| `figs/cb04.ts` | v8 triose phosphate via `carbons('cccp')`. |
| `figs/rf-schema.ts` | Carbon-form rows beside PGA, triose phosphate, 2-PG, glycolate, glycerate, glycine and serine. They also show in rf5–rf8; check for doubling with the moving beads. |
| `figs/rff05.ts` | v10 rebuilt with counts. |
| `figs/rff06.ts` | v9: the full chain per 2 O₂: 4 C in, 3 C back (75 %), 1 C lost. |
| `figs/rff07.ts` | v7 conversion line. |
| `figs/rff08.ts` | A/Cc axes in ppm; conversion line. |
| `figs/cc12.ts` | v3 PEP, C₄ acid and pyruvate glyphs. |

## Numbers audit: text proposals (before → after, not applied)
- **C1:**
  - every count is per 3 CO₂, e.g. "Per 3 CO₂: Rubisco adds 3 CO₂ (3 × 1 C) to 3 RuBP (3 × 5 C) … 6 3-PGA (6 × 3 C = 18 C)";
  - "5 triose phosphate (5 × 3 C = 15 C) rebuild 3 RuBP (3 × 5 C = 15 C) / 1 triose phosphate (3 C) leaves the cycle".
- **C2:** "A three-carbon product" → "A 3-carbon product (3 C)".
- **C3:**
  - lead: "…9 ATP and 6 NADPH per 3 CO₂ fixed (per triose phosphate exported)";
  - reduction: "Per 3 CO₂: 6 ATP + 6 NADPH turn 6 3-PGA into 6 triose phosphate (each: 1 ATP + 1 NADPH)";
  - regeneration: "Per 3 CO₂: 3 ATP, 1 per RuBP".
- **C5:**
  - "RuBP (5 C) + CO₂ (1 C) → 2 PGA (2 × 3 C) / RuBP (5 C) + O₂ → PGA (3 C) + 2-phosphoglycolate (2 C)";
  - "≈ 1 oxygenation per 3 carboxylations" → "≈ 2 oxygenations per 5 carboxylations" (2Γ*/Cc = 2 × 40/200 = 0.4). The rf5 tally (3 : 1) then needs 5 : 2; not yet changed.
- **C6:**
  - "2 glycine (2 × 2 C) → 1 serine (3 C) + 1 CO₂ (1 C) + 1 NH₃";
  - "Per 2 O₂: 2 2-PG (4 C) → 1 PGA (3 C) + 1 CO₂ (1 C lost) / Per oxygenation: 3.5 ATP + 2 NADPH (per carboxylation: 3 ATP + 2 NADPH)".
- **C12:**
  - "PEP carboxylase adds HCO₃⁻ (1 C) to PEP (3 C): a C₄ acid (4 C)";
  - "per 3 CO₂: 15 ATP + 6 NADPH (C₃: 9 ATP + 6 NADPH)".
- **Captions:**
  - cb "The fuel" → "Per 3 CO₂: reduction 6 ATP + 6 NADPH, regeneration 3 ATP; total 9 ATP + 6 NADPH";
  - rf56: numerals throughout and "≈ 2 oxygenations per 5 carboxylations";
  - rf78: "4 CO₂ levels, 170 to 1500 ppm";
  - cc and cp: numerals throughout.

## Lecturer's choices pending
- **CO₂ unit:** "ppm" vs "µmol mol⁻¹". Recommend ppm.
- **Water per CO₂:** C10 says "150–500 H₂O per CO₂"; C13 v5 gives mmol CO₂ per mol H₂O. The two differ by about 4×; pick one unit and state the basis.
- **Quantum yield form:** 0.052 mol mol⁻¹ vs "53 per 1000 photons".
- **Rubisco mass:** "7 × 10¹⁴ g = 0.7 billion tonnes".
- **Air CO₂:** 420 vs 427 ppm.
- **Gaastra's CO₂:** given in %; use ppm instead.
- **South 2019:** the corrected values are +19–37 %, not 40 %.
- **C8:** the variable is Cc vs Cᵢ.

## Checked correct
- C1–C4 wheel numbers.
- rf8 FvCB parameters.
- E&B 1977 crossover.
- C11 refixation shares.
- C14 FACE numbers.
- C15 energy chain.

## Rubisco evolution
Draft: `research/redo-2026-10-28/DARK_RUBISCO_EVOLUTION.md` (hooks, 5 checked facts, slide options A/B/C, 10 figure and animation concepts, placement C5b).

**Corrections:**
- Bouvier 2024 is in PNAS, not Science.
- Zhu 2004: Rubisco is optimal for 210 ppm; a faster, less specific enzyme gives only +3 %.
- Atmospheric CO₂: glacial 172, pre-industrial 278, 2025 427.35 ppm.
- Flamholz: C₃ median S꜀/ₒ 98; the trade-off is weak.
- "Faster than evolution can follow" is our inference; no paper says it.

## Not done
- Carbon form in the animation kits (cb-kit, rf56-kit, cc-anim-kit) and in cc-schema.
- The older c0x/k0x variants.
