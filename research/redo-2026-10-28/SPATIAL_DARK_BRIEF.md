# The dark-reaction overview drawn in the real cell, like the 7m1 strip (lecturer, 28 Oct 2026, approved)

## What the lecturer wants
- **The idea.** The electron-transport figure is right because every protein sits where it really is, in the lipid bilayer. The dark-reaction overview must do the same:
  - Rubisco in the stroma;
  - transporters in the chloroplast envelope;
  - sucrose made in the cytosol;
  - the photorespiration steps inside the peroxisome and mitochondrion.
- **The membranes are drawn as bilayers.**
- **The picked C6 schemas (a, v10) only define the components and links,** not the drawing.
- **Your kA–kC figures (cycle diagrams with outlined organelles) are now live on C1–C8,** but they miss this idea. The new figures replace them: I will drop the kA–kC join once the new ones are in.

## Approved layout (left → right, continuing the 7m1 chain)
| Compartment | Membrane | Proteins (structure renders, true scale) | What happens there |
|---|---|---|---|
| Thylakoid (right end of 7m1) | thylakoid bilayer as in chain.ts | ATP synthase, FNR | ATP and NADPH released into the stroma |
| Stroma | none (soluble) | Rubisco + at most 2–3 cycle enzymes (e.g. phosphoribulokinase, GAPDH) | CO₂ + RuBP → 3-PGA → triose phosphate (carbon form); starch granule |
| Chloroplast envelope | 2 bilayers (outer + inner) | triose-phosphate translocator (TPT); glycolate/glycerate transporter (PLGG1) | triose phosphate out / Pᵢ in; glycolate out / glycerate in |
| Cytosol | none | — | triose phosphate → sucrose |
| Peroxisome | 1 bilayer | glycolate oxidase, catalase | glycolate → glycine; H₂O₂ → water |
| Mitochondrion | 2 bilayers (inner one may fold) | glycine decarboxylase (+ SHMT) in the matrix | 2 glycine → serine + CO₂ + NH₃ |
| Back in the chloroplast | — | glycerate kinase, glutamine synthetase (+ Fd-GOGAT) | glycerate → 3-PGA; NH₃ refixed |

## Step 1: check the facts first (about 30 min; report as a table)
- **For each protein in the table:**
  - its compartment and membrane side;
  - one structure: PDB, plant or closest homolog; an AlphaFold model only where no structure exists (e.g. PLGG1), and say so in the credit;
  - one reference.
- **Candidates to verify, not assume:** Rubisco 8RUC (already rendered); TPT 5Y78/5Y79 (Lee et al. 2017, Nat. Plants); spinach glycolate oxidase 1GOX; a plant catalase; the GDC H-protein (pea) or P-protein; SHMT; plant glutamine synthetase; PRK; A4- or A2B2-GAPDH.
- **Check how the organelles sit in C₃ mesophyll cells:** chloroplasts against the cell wall; peroxisomes and mitochondria pressed on the chloroplasts' vacuole side, and what that means for refixing photorespired CO₂ (Busch and others). This sets the "cell section" arrangement.
- Fetch structures with plain curl from RCSB or AlphaFold. No bot-check circumvention. If a site blocks you, say so and use what you have.

## Step 2: build
- **Style: the 7m1 look** (`chain.ts`):
  - bilayers with the same lipid heads and colours as the thylakoid;
  - proteins as flat-colour renders with dark outlines, at one scale with the chain's proteins (2.4 px per Å) where space allows; state any downscale;
  - molecules as atom balls / carbon form (`figs/carbon-form.ts`, live now), CO₂/O₂/H₂O balls, ATP/NADPH tags, NH₃;
  - names in ink, gas arrows grey, carbon arrows black, photorespiration in the deck's photorespiration colour.
- **Membrane proteins sit across their bilayer at the right depth;** soluble enzymes float in their compartment.
- **Two arrangements** (every slide gets both):
  - **Strip:** continues the 7m1 strip to the right. Its left edge sits flush against the 7m1 chain (same membrane y, same colours), so the linking animation can pan straight in. Shoot the combined frame.
  - **Cell section:** as in leaf micrographs. A piece of cell wall and plasma membrane, the chloroplast against it (envelope, a granum, stroma with Rubisco), the peroxisome and mitochondrion pressed against the chloroplast, the cytosol between them and the vacuole edge.
- **Spotlight per slide C1–C8** with your lit sets (`LIT_C1`–`LIT_C4`, rf-schema's `LIT_C5`–`LIT_C8`): lit parts in colour, the rest dimmed like the chain. C8 keeps the FvCB boxes as an option.
- **Counts:** per 3 CO₂ on the cycle and per 2 O₂ on the loop, as in kA–kC, but lighter. Only the lit part carries its counts; one key line states the units.
- **Variants per slide:**
  - `m1` strip, `m2` cell section;
  - `mz` a crop on the lit part for C2, C5 and C6;
  - no glow look.
- **Wiring:**
  - a new module `figs/cellv.ts` exporting `cellFigures(slide)`, joined in `plates.ts` after the picks loop with prefix `m` (as you did for cbbv);
  - report the lines; I edit `plates.ts`;
  - put the new drawing code in new files (e.g. `figs/cell-schema.ts/.css`);
  - do not change `cbb-schema.ts` output or any live file.

## Rules
- Work in your scratch copy. Re-sync live `src/` first: live has your cbb files, a new `figs/s11c.ts`, `anim/beats-atpsm.ts` and the cyclic files.
- Never edit `research/figure-briefs/picks.json`, `plates.ts`, `index.ts` or slide text.
- **QA:**
  - `tsc` must be clean;
  - screenshot every new variant and make contact sheets;
  - look at them: letters ≥ 11 px, no overlaps, proteins read as proteins, membranes read as bilayers.
- **Order:** step 1 table, then the strip for all slides (send "main" a short note with its contact sheet), then the cell section.
- **Final message:**
  1. the fact table with sources;
  2. files to copy;
  3. the `plates.ts` lines;
  4. the variant table;
  5. contact sheets and the combined frame;
  6. doubts.
