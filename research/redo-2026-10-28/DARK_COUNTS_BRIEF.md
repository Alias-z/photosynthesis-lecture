# Dark-reaction animations: clear counts (lecturer, 28 Oct 2026, evening; approved, build now)

## The lecturer's complaints, near verbatim
- "In reduction, why start with 3 sets of molecules, 6 molecules, without even showing the 3 CO₂ input? Why not illustrate with 1 CO₂? Why make it complicated?"
- "ATP binds 3-PGA, goes back, then waits for NADPH… Either ATP and NADPH bind at one go, don't separate them; otherwise confusing."
- "Why 3 triose phosphates out? Not clear. The triose phosphate export doesn't even show the phosphate imported from the cytosol."
- "If you show products, show how much input you put in in the previous step. Check everything."
- Quality first: check every frame yourself before handing over.

## Rules for every dark-reaction animation
1. **Smallest whole unit.**
   - State it once on screen at the start.
   - Draw and number the inputs first: CO₂ 1…, RuBP 1….
2. **No molecule without a visible source.**
   - Every output is made from inputs the viewer saw arrive.
   - When a step uses the previous step's products, they glide in from where they were made, with a short line such as "from carboxylation".
3. **ATP and NADPH bind each 3-PGA together, in one go:**
   - 3-PGA + ATP + NADPH → triose phosphate + ADP + Pᵢ + NADP⁺;
   - no intermediate 1,3-bisphosphoglycerate step and no waiting.
4. **Exchanges are shown as exchanges.** At TPT each triose phosphate going out passes 1 Pᵢ coming in from the cytosol, at the same moment, numbered in pairs.
5. **Counters** tick in step with the drawn molecules. Totals equal the number of molecules drawn.
6. **Motion and camera** follow the existing rules: one fixed framing, no zoom, smooth eased curves.
7. **Spelling:** RuBisCO, 3-PGA, 2-PG, triose phosphate, Pᵢ. Abbreviations are spelled out at first use in captions.

## Per animation
| Key · slide | Unit | Inputs first | Then |
|---|---|---|---|
| rubisco · C2 (superseded by c2story; leave as is) | — | — | — |
| cb1 · C1 C₃ photosynthesis (the cycle) | per 3 CO₂ | CO₂ 1–3 arrive; RuBP 1–3 rise into RuBisCO | 6 3-PGA → each + 1 ATP + 1 NADPH together → 6 triose phosphate; 5 → 3 RuBP (+ 3 ATP at PRK); 1 out. Caption: "3 CO₂ is the smallest number for which the cycle closes with whole molecules." |
| reduction · C3 | **per 1 CO₂** | CO₂ 1 + RuBP 1 at RuBisCO → 3-PGA 1–2 | Each 3-PGA takes ATP + NADPH together at GAPDH → triose phosphate 1–2; ADP, Pᵢ and NADP⁺ glide back. Ledger: ATP 2, NADPH 2. Light-off beat: per 1 CO₂ too (3-PGA accumulates while no ATP and NADPH arrive). |
| regeneration · C3b | per 3 CO₂ | 1 short recap beat: CO₂ 1–3 + RuBP 1–3 → 6 3-PGA → (6 ATP + 6 NADPH) → 6 triose phosphate, ≤ 5 s, with the line "3 CO₂: the smallest number that gives whole RuBP" | 5 triose phosphate (15 C) → 3 ribulose-5-phosphate (15 C) → + ATP 1–3 at PRK → RuBP 1–3 back to RuBisCO. Triose phosphate 6 moves to TPT and waits: "→ C4". |
| rf5 (no slide now; keep as is) | — | — | — |

Owner: builder 1 (dk1 files).

| Key · slide | Unit | Inputs first | Then |
|---|---|---|---|
| cb4 · C4 sucrose and starch | per triose phosphate | Beat 1: 1 triose phosphate (label "from 3 CO₂ fixed") at TPT | Out through TPT while Pᵢ 1 comes in from the cytosol, simultaneously. Beat 2, sucrose: 4 triose phosphates (from 12 CO₂), each swapped 1-for-1 with Pᵢ 1–4 → 1 sucrose (12 C) in the cytosol. Beat 3, starch: by day, a triose phosphate stays in the chloroplast → starch; at night starch → sucrose (keep the Graf curve panel). Remove the old "per 18 CO₂" ledger. |
| rf6 · C6 photorespiration | per 2 O₂ | **New script below** | |

Owner: builder 2 (dk2 files).

## rf6, new script (slide text now live in `figs/rf06.ts`)
The lecturer's story: first what respiration is, then what photorespiration is; that it is often seen as wasteful; its function, recycling toxic 2-PG back into 3-PGA, with 1 CO₂ released. The pathway details (organelles, glycine, serine) may show, but the key takeaway is the recycling.

1. **Respiration.** A small inset of a mitochondrion icon: O₂ in, CO₂ out. Caption: "Respiration takes up O₂ and releases CO₂."
2. **Oxygenation of RuBP.** At RuBisCO: RuBP 1–2 + O₂ 1–2 → 3-PGA 1–2 + 2-PG 1–2. The 2-PG glow red with a short tag "toxic: inhibits enzymes of the cycle". Caption: "Oxygenation of RuBP makes 2-phosphoglycolate (2-PG), which inhibits enzymes of the Calvin–Benson–Bassham cycle (Flügel et al. 2017)."
3. **Recycling.**
   - The 2 2-PG travel the loop in one smooth run. Organelles are named small and dim; no enzyme names on screen.
   - 1 CO₂ (numbered) leaves from the mitochondrion; 3-PGA 1 (3 C) comes back to the cycle.
   - A takeaway card stays on screen: "2 × 2-PG (4 C) → 3-PGA (3 C) + CO₂ (1 C)".
   - Caption: "Photorespiration recycles 2-PG: 3 of its 4 carbons return as 3-PGA, 1 is released as CO₂."
4. **Why "photorespiration".** Highlight O₂ taken up at RuBisCO and CO₂ released at the mitochondrion together, side by side with the respiration inset. Caption: "Like respiration it takes up O₂ and releases CO₂, but only in the light: photorespiration."
5. **Waste or function?** Two cards:
   - "loss: at 30 °C ≈ 29 % less CO₂ fixed per absorbed photon in air than in 2 % O₂ (Ehleringer & Björkman 1977)";
   - "function: removes toxic 2-PG; mutants that cannot recycle it die in air (Somerville & Ogren 1979)".

   Caption ends "<b>The CO₂ is released in the mitochondrion: can the leaf fix it again?</b>" (C11 next).

- Replace the current RF6 beats with these 5 (new file `beats-rf6n.ts`, export `RF6N`).
- One fixed framing. Counts per 2 O₂ only in beats 2–3.

## Delivery
- Re-sync live first: `figs/rf06.ts`, `figs/cb03.ts`, `ledger.ts`, `cell-schema.ts` and the beats files changed.
- Check every beat end and the busiest frames yourself.
- Hand over the files, the index lines and the contact sheets.
