# RuBisCO's two reactions, drawn so each side is unmistakable (lecturer, 28 Oct 2026, urgent)

## What the lecturer wants (near verbatim)
- "What's common to RuBisCO? The input is always RuBP, the 5-carbon molecule. So put the 5-carbon molecule on the bottom side."
- "Then on the left side you say this is carboxylation, on the right side you label it oxygenation, then the outputs."
- "It's similar to our very first slide, where we put photo and synthesis on two sides. So it's clear which side does carboxylation and which does oxygenation, and the common thing is the shared RuBP input."
- "Pay attention to details. Rushing doesn't mean low quality. Make more variations to show me how you'll illustrate this."

## The design rule (all variants)
- **RuBP at the bottom**, centred under RuBisCO, in carbon form (P–C–C–C–C–C–P), labelled "RuBP" with "5 C" where counts show. One arrow goes up into RuBisCO. It is the shared input.
- **Left side, carboxylation:**
  - CO₂ enters from the left;
  - the header "carboxylation" sits on the left;
  - the product, 2 × 3-PGA, leaves up-left, towards the cycle.
- **Right side, oxygenation:**
  - O₂ enters from the right;
  - the header "oxygenation" sits on the right;
  - the products, 3-PGA + 2-phosphoglycolate, leave up-right: 3-PGA back to the cycle, 2-phosphoglycolate to photorespiration.
- **Mirror symmetry** about RuBisCO's vertical axis, so the two sides read as a pair, as slide 1 sets light reactions against carbon reactions. Optionally a faint vertical divider or two pale side tints.
- **Text:** names and the two headers only, plus per-reaction carbon counts on C5 variants ("5 C + 1 C = 2 × 3 C" / "5 C = 3 C + 2 C"). No meta text and no extra labels.
- **Glyph standard:**
  - RuBisCO as the 8RUC render;
  - molecules in carbon form; CO₂ and O₂ as atom balls;
  - gas arrows grey, carbon arrows ink, photorespiration arrows in the deck's photorespiration colour;
  - spelling: "RuBisCO", "3-PGA".

## Variants to build (new module, e.g. `figs/rubside.ts` + css, exporting builders used from `cellv.ts`)
| id | Variant |
|---|---|
| r1 | **In the strip:** re-lay the RuBisCO region of the dark-reaction strip (`cell-schema.ts`) by the rule. PRK's RuBP path routes round to come up from below RuBisCO. GAPDH is upper left, so 2 × 3-PGA flows up-left into reduction; 2-phosphoglycolate flows right to PLGG1. Move RuBisCO up if the bottom needs room. Update `SPOT` so the animations follow. |
| r2 | **Two-sided panel, like slide 1:** a standalone figure. RuBisCO in the centre, pale left/right tints with the headers "carboxylation" and "oxygenation" at the top of each half, RuBP from the bottom centre, CO₂ from the left edge, O₂ from the right edge, products to the upper corners ("→ Calvin–Benson–Bassham cycle" and "→ photorespiration" as small destination labels). |
| r3 | **Y-shape:** RuBP at the bottom; one arrow up to RuBisCO; RuBisCO branches up-left (+ CO₂ → 2 × 3-PGA) and up-right (+ O₂ → 3-PGA + 2-phosphoglycolate). It reads like two equations sharing a root. |
| r4 | **Active-site close-up:** the 8RUC render with the active site ringed, RuBP docked at the site from below in carbon form, CO₂ arriving from the left and O₂ from the right, the outputs leaving on their sides. |

- **C2** gets r1–r4 without counts.
- **C5** gets r1–r3 with per-reaction carbon counts.
- List the new variants first on C2 and C5. The existing m-variants stay listed after them for comparison.

## Order and speed
1. Re-sync live `src/` first. Live `cell-schema.ts` holds a manual geometry edit of mine (`SPOT`: co2 (192,476), o2 (478,532), pg2 (520,446), labels). Drop your unmerged "sides" version and build r1 on top of live.
2. Deliver r2 and r3 first (standalone, fast), within about 15 minutes, with a contact sheet. Then r1 (the strip and `SPOT`) and r4.
3. Keep `bridge-common.ts` reading `SPOT` (your earlier change) and the m2/m4 gas-side fixes; re-apply them on top of live.
4. **QA:** `tsc` clean; look at every variant yourself, checking symmetry, no crossings, labels ≥ 11 px and nothing cut at the edges.
