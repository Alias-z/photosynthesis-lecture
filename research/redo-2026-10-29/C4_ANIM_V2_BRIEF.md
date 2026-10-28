# C4 "Sucrose and starch" animation 'cb4', version 2: only the key points (lecturer, 29 Oct 2026, evening)

The lecture is today. The lecturer has asked many times for only the essential, so follow that strictly.

## The lecturer, near verbatim
- **On the live staging s** (`anim/dk-cb4.ts`): "The text is outside the box. The counting isn't correct. The animation doesn't go in a logical order. Things are not clear."
- "There are already too many numbers in this calculation; it is overwhelming. Make things as simple as possible. Only leave the key information. Leave all the crazy stuff alone."
- The key information:
  1. Exporting triose phosphate needs Pᵢ imported from the cytosol. Hence the triose-phosphate use (TPU) limit, which the FvCB model has.
  2. Sucrose is made in the cytosol and exported to growing organs and grains.
  3. Starch is made in the chloroplast by day and broken down at night to make sucrose.

## Captions: `CB4V2` in `anim/beats-cb4n.ts` (exact; 5 beats; do not edit)
1. **Export:** triose phosphate out through TPT, 1 Pᵢ in from the cytosol.
2. **Sucrose:** made in the cytosol from triose phosphates, exported to growing organs and the grain; its phosphate is freed and returns.
3. **TPU:** sucrose made too slowly → too little Pᵢ returns → no phosphate to make ATP → photosynthesis slows: the TPU limit.
4. **Starch by day, sucrose at night:** so the plant keeps growing at night.
5. **Sunlight in sugar:** the question that leads to C4e.

## Rules for all 3 stagings
- **No numbers on screen,** except where the caption has one (1 Pᵢ per triose phosphate, shown by pairing, not by a counter).
  - No ledgers, carbon counts, percentages, graphs, clocks with hours or "per 3 CO₂" labels.
  - The Graf et al. 2010 starch curve is out.
- **Counting is still exact** where molecules are drawn:
  - every triose phosphate out is paired with 1 Pᵢ in;
  - 1 sucrose forms from 4 triose phosphates and frees 4 Pᵢ;
  - starch forms from triose phosphate in the stroma, and its Pᵢ is freed there;
  - at night, starch gives sugars that leave and make sucrose in the cytosol.
  Otherwise draw flows as arrows, not counted molecules.
- **Logical order.** Show only what the current caption says, in the caption's order. Nothing appears before it is named.
- **Text:**
  - at most 1 short label per element (TPT, Pᵢ, triose phosphate, sucrose, starch, ATP synthase);
  - every label inside its box on every frame; letters ≥ 12 px;
  - captions ≤ 3 lines; no meta text; words before symbols; numerals; RuBisCO.
- **Camera:** one fixed framing per beat, at most one slow, eased move, never a zoom in and then out. Eased motion; ≤ 35 s.
- **Style:** the deck's real-protein style:
  - the dark-reaction strip `anim/dk2-common.ts` / `figs/cell-schema.ts`, with its TPT, envelope bilayers, starch granule, ATP synthase;
  - atom-ball molecules;
  - tags `figs/chain.ts` tagG.

## The 3 stagings (one builder each; new files only)
| Id | File | Idea |
|---|---|---|
| s2 | `anim/dk-cb4b.ts` | **The strip, simplified.** The live strip framing, rebuilt from `dk-cb4.ts`, but only the 5 beats, in order:
- 1: triose phosphate out paired with Pᵢ in at TPT;
- 2: 4 triose phosphates join into 1 sucrose in the cytosol, 4 Pᵢ freed and drifting back to TPT; sucrose leaves towards the plant;
- 3: sucrose synthesis slows, the returning Pᵢ stops, the stroma's Pᵢ runs out at ATP synthase (ADP + Pᵢ → ATP dims), the cycle dims;
- 4: day: triose phosphate into the starch granule, which grows; night (a gentle veil): the granule shrinks and sugars leave for sucrose;
- 5: RuBisCO with CO₂ and RuBP.
No graph. |
| p | `anim/cb4-p.ts` | **The phosphate loop.** A close-up across the chloroplast envelope, one fixed framing. TPT large in the centre; stroma on the left with ATP synthase at a thylakoid edge; cytosol on the right with a sucrose-making station and an exit arrow "to growing organs and the grain".
- Pᵢ circulates as a visible loop: in through TPT, used for ATP, carried out in triose phosphate, freed by sucrose synthesis, back to TPT.
- Beat 3 slows the loop (sucrose station slows, Pᵢ thins out, ATP synthase dims).
- Beat 4 adds a starch granule in the stroma under a day/night band. |
| d | `anim/cb4-n.ts` | **Leaf to grain, day and night.** A wheat leaf cell (chloroplast + cytosol), phloem, and a growing grain, drawn in the deck's style.
- Beat 1: a small round TPT inset (triose phosphate out, Pᵢ in).
- Beat 2: sucrose flows through the phloem to the grain.
- Beat 3: the inset shows the Pᵢ return stopping and ATP dimming.
- Beat 4: the sky band turns from day to night. By day the chloroplast's starch grows; at night it shrinks, and sucrose still flows to the grain. Use the real TEM of chloroplasts at the end of the day and the end of the night, already in the deck: `src/assets/photos/c4-streb.jpg`, Streb & Zeeman 2012 Fig. 4, © ASPB, credit as in `figs/cb04.ts`. |

## Ownership, setup, QA, report
- **Write only your own new files.**
- **Never edit:**
  - `beats-cb4n.ts`, `beats-cb.ts`, `dk-cb4.ts`, `dk2-common.ts` or `cell-schema.ts`; write helpers in your own file;
  - `index.ts` or `plates.ts`; report the line;
  - `research/figure-briefs/picks.json`.
- **Don't commit.**
- **Scratch copy:** `$S/c4-<id>/deck`, made with `rsync -a --exclude node_modules --exclude .git --exclude dist --exclude backups` from `/Users/zhongyua/.codex/visualizations/2026/10/18/01a14e64-129b-7041-8fab-d6753ae41888/claude-handoff/photosynthesis-lecture-ethz/`.
  - Symlink `node_modules`, and run vite on your port: s2 5331, p 5332, d 5333.
  - `$S` = `/private/tmp/claude-502/-Users-zhongyua--codex-visualizations-2026-10-18-01a14e64-129b-7041-8fab-d6753ae41888-claude-handoff/5ab943f9-d753-4192-bfa6-3efc5cb53ace/scratchpad`
- **Wire it in your scratch only:** add `{ ...yourStaging, beats: CB4V2 }` to the `cb4` entry in your scratch `anim/index.ts`.
- **Checks:**
  - `tsc --noEmit` clean;
  - headless Chrome shots of every beat, at its end and in mid-motion;
  - a PIL contact sheet (`python3` without `-I`);
  - look at every frame yourself: text inside boxes, counts exact, order logical, nothing extra.
- **Report:** the files to copy, the index.ts line, the contact-sheet path and your doubts.
