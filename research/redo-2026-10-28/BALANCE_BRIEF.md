# Slide 10b becomes "Balancing ATP and NADPH" (lecturer, 28 Oct 2026, approved script)

## The storyline
- **Slide 10 (ATP synthase) is the mechanism slide, with counts.** Its animation now ends on the gap. The caption (already live): "Per O₂ the chain makes ≈ 2.6 ATP and 2 NADPH, but fixing CO₂ needs 3 ATP per 2 NADPH. **Who fills the gap of 2 H⁺?**"
- **Slide 10b answers that question at concept level, with no counts.** The lecturer: "I don't expect you to remember the numbers… just demonstrate that there are other ways to fill the gap… it's able to balance ATP and NADPH… mention in what real conditions the plant runs the cycles… a very flexible system."
- **No H⁺, e⁻, photon or ATP counts on screen or in captions.** No n/14, no 12 + 2, no % and no ratio numerals anywhere in 10b.

## Already live (do not edit)
- **Slide 10b text,** `figs/s11c.ts`:
  - title "Balancing ATP and NADPH";
  - points "Cyclic electron flow / Other valves / Flexible".
- **Slide 10's last beat caption,** `anim/beats-atpsm.ts`.

## Build: animation (anim key stays `cyclic`; slide 10b plays it)
- **New files:**
  - `anim/beats-balance.ts` exporting `BALANCE: Beat[]`;
  - `anim/balance-common.ts/.css`;
  - `anim/balance-s1.ts`, `balance-s2.ts`, `balance-s3.ts`, with staging ids `s1`, `s2` and `s3`.
- **Reuse** `cyclicm-common.ts` helpers by importing them: `chainScene`, `condIcon`, `clippingSvg`, the bars, and so on. Do not change the cyclic m1–m3 output. Those stay drawable by id but are unlisted.
- **index.ts entry** (report it; I edit index.ts):
  `{ key: 'cyclic', title: 'Balancing ATP and NADPH', beats: BALANCE, stagings: [balS1, balS2, balS3, { ...cyc10bA, beats: CYCLIC }] }`.
  The old staging `a` is the lecturer's pick and must stay listed with its own beats.
- **Scene:** the whole 7m1 chain (`chainSvg(…, 'pdb-bilayer', lit, { mol: true })`), parts lit per beat.
- **Route colours:** take them from the picked slide-10c figures (`figs/l11.ts`): cyclic violet, to-O₂ teal. Linear flow keeps the chain's black e⁻ arrows.
- **Motion:** smooth and eased, no jitter. Total ≤ 40 s. Click holds are allowed.
- **Beats and captions (exact):**

| # | tag | On screen | say |
|---|---|---|---|
| 1 | The gap | The balance indicator shows too little ATP for the NADPH made; the chain's linear flow runs once | Linear flow makes too little ATP for its NADPH. Plants have several ways to close the gap. |
| 2 | Cyclic flow | Violet loop: PSI → ferredoxin → plastoquinone → b₆f → plastocyanin → PSI. Uncounted H⁺ rings drop into the lumen, the rotor turns, ATP leaves the head and the ATP side rises. No NADPH | Electrons from photosystem I return to plastoquinone: more ATP, no NADPH. The main route in flowering plants. |
| 3 | Electrons to O₂ | A thin teal line: PSI → O₂ → water (2-ball O₂, water glyph). H⁺ pumped along the chain, the ATP side rises a little. No NADPH | Water–water cycle: electrons go to O₂ and form water again: more ATP, no NADPH. Small in flowering plants, larger in algae and mosses. |
| 4 | Malate valve | A spare NADPH tag turns into a "malate" tag and leaves the chloroplast (arrow off the stroma, labelled "to the cytosol"); the NADPH side gets lighter | Spare NADPH leaves the chloroplast as malate. |
| 5 | Flexible | 3 condition icons appear one by one: strong or flickering light, first minute of light (new icon, e.g. a sunrise), cold. Each thickens the cyclic loop; the indicator wobbles, then levels. Then the Munekage et al. 2004 clipping (plants lacking cyclic flow stay tiny) | Plants turn these routes up when they need to; without cyclic flow they barely grow. <b>What happens when light brings more energy than the chain can use?</b> |

- **Cites:**
  - 1: Kramer & Evans 2011;
  - 2: Yamori & Shikanai 2016, Joliot & Joliot 2006;
  - 3: Badger et al. 2000;
  - 4: Scheibe 2004, Physiol. Plant. (https://doi.org/10.1111/j.0031-9317.2004.0222.x);
  - 5: Yamori et al. 2016, Munekage et al. 2004, Suorsa et al. 2012.
- **The 3 stagings differ only in the balance indicator:**
  - **s1, beam balance** beside the chain: an ATP pan and an NADPH pan (deck tags). Tipped toward NADPH at beat 1; each route brings it toward level; in beat 5 it wobbles and re-levels.
  - **s2, bars** (the m1 sidebar look, without numbers): an ATP bar short of a dashed "needed for CO₂ fixation" mark and an NADPH bar at its mark. Routes fill the ATP bar; malate trims NADPH.
  - **s3, valves:** 3 valve dials under the chain (cyclic, to O₂, malate) plus 1 needle gauge "ATP : NADPH" with a "needed" band. Each beat opens its valve; in beat 5 the conditions turn the cyclic valve up and the needle stays in the band.

## Build: slide figure
- **Add variant `11m2` "the 3 routes"** to `figs/l11c.ts`, listed after `11m1`: the 7m1 chain with the cyclic loop, the thin O₂ → water route and the malate exit drawn and lit, in the same colours as the animation.
- **If you add these routes as parts in `figs/chain.ts`,** keep them off unless asked for. Every existing figure must stay pixel-identical. Check by screenshot diff of 7m1, 8m1, 9m1, 10m1, 11m1 and 1 frame each of the psii, b6f, psi, atps and cyclic-m1 animations, before and after.

## Rules
- Work in your own scratch copy. Re-sync live `src/` first: live changed `figs/s11c.ts` and `anim/beats-atpsm.ts`.
- Never edit `research/figure-briefs/picks.json`, `plates.ts`, `index.ts` or the slide text files.
- No bot-check circumvention.
- **QA:**
  - `tsc` must be clean;
  - headless shots of every beat end and the busiest mid-beat frame per staging, plus contact sheets;
  - look at them: letters ≥ 11 px, no overlaps, no numerals of stoichiometry anywhere.
- **Final message:**
  1. files to copy;
  2. the index.ts entry;
  3. the l11c.ts change;
  4. contact-sheet paths;
  5. the pixel-identity check result;
  6. doubts.
