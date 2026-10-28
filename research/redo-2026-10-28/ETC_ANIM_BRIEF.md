# Electron-transport animations in the 7m1 style (lecturer, 28 Oct 2026)

Five animations are rebuilt:
- `psii` (slide 7)
- `b6f` (slide 8)
- `psi` (slide 9)
- `atps` (slide 10)
- `cyclic` (slide 10b)

Each one plays on its slide's figure, which is now **only** the 7m1 look:
- slide 7: `focusSvg(id, { look: 'bil', lit: LIT_PSII, g: { mol: true }, say })`, which draws the same chain as `chainSvg(id, 'pdb-bilayer', LIT_PSII, { mol: true })`;
- slide 8: `LIT_B6F`;
- slide 9: `LIT_PSI`;
- slide 10: `LIT_ATPS`;
- slide 10b: `LIT_CYCLIC`, all in `figs/chain.ts`.

Read `GLYPH_BRIEF.md` (same folder) first. Its glyph standard and its §3 and §4 (shared files, workflow) apply to you unchanged.

## What the lecturer asked for (28 Oct 2026, near verbatim)

**Point, then do.**
- "In a normal textbook, first point out what is that, and then do it."
- Every part is named with a leader label, and briefly glows, before it acts or moves: the reaction centre, plastoquinone, plastocyanin, ferredoxin, FNR, ATP synthase's rotor and head.
- The unlabelled yellow oval in the PSII zoom confused the lecturer.

**Plastoquinone is a small molecule.** It is not a protein; it floats in the lipids. Draw it as a small molecule:
- the lettered PQ lozenge of `chain.ts` named mode, or a quinone ring with a tail;
- once it has 2 e⁻ and 2 H⁺, its label changes to **plastoquinol (PQH₂)**.

Plastocyanin (a small copper protein) and ferredoxin (a small iron–sulfur protein) are proteins.

**Carriers stay where the story leaves them.**
- In the b₆f animation, plastocyanin snapped back to its slide place at the zoom-out, and the lecturer was angry: "If the plastocyanin moves away, then let it stay moved away."
- Plastocyanin ends docked under photosystem I, where the PSI animation starts.

**One molecule style:** atom balls, ringed H⁺, tags (GLYPH_BRIEF §1). This applies on the stage and in every experiment card.

**Experiments use the slide's colours.**
- Ruben & Kamen: ¹⁸O is purple. Draw it as purple O balls in the flask's water *and* in the O₂ bubble, with a key "¹⁸O = an oxygen isotope". Labels read H₂¹⁸O and ¹⁸O₂. Never write "heavy-oxygen water".
- Emerson: real red (680 nm, `#c8361e`) and far-red (> 700 nm, deep maroon `#7a1f17`) light, never the generic amber "light". Photosystems II and I are highlighted. The difference and its consequence are written on the image.

**ATP synthase is not a pump.**
- H⁺ flow *down their gradient* from the lumen back to the stroma through the rotor; the turning rotor makes the head join ADP + Pᵢ into ATP.
- ADP, Pᵢ and ATP must be visible tags entering and leaving the head; the earlier version "looks like you just pumped out a proton".
- Chloroplast c-ring: 14 H⁺ per turn → 3 ATP (Hahn et al. 2018, Science 360: eaat4318).

**Cyclic flow was "too fast to capture".**
- Add click stops for each step, or a loop.
- Show the ATP : NADPH ratio **all the time**, not only at the end.
- Use exact numbers, never "more protons".
- Show when and why plants use it.

## Rules carried over (memory of earlier rounds)
- **Length and ending:** about 30–40 s per animation; end on the question the next slide answers.
- **Pace:** about 7 s per beat. Each move takes ≈ 0.8–1.2 s. Put a click stop (`holds`) between two distinct events.
- **Camera:** zoom into the slide figure and back out (copy the camera of `psii7-common.ts` / `b6f8-common.ts`). Text is counter-scaled so labels stay 21–28 px.
- **What moves:** minimal moving parts. Only the motion that teaches moves; labels, cards and portraits appear whole.
- **Experiment cards:** newsprint clippings with halftone portraits (existing assets: `assets/anim/psii/ruben.png`, `kamen.png`; `assets/anim/antenna/emerson-nas.png`; the Jagendorf & Uribe card and Munekage clipping in `atps10-common.ts` / `cyc10b-common.ts`).
- **Citations:** each beat's `cite` shows on screen. Use real, strong papers only.
- **Stagings:** at least **2 per animation**, differing in story or camera, not colour. The ids are new (`m1`, `m2`, …).
  - The old stagings are replaced, except the picked `cyclic` staging `a`, which stays listed after yours.

## The scripts (desired state)

### psii (slide 7): stagings m1 (one flask), m2 (two flasks: water vs CO₂)

| Beat | What happens | Caption |
|---|---|---|
| 1 Charge separation | Zoom into PSII. Leaders name "photosystem II", then "reaction centre (P680)", then "plastoquinone (PQ)", which slides into its site at Q_B. Light (amber wave) arrives; one e⁻ jumps P680 → PQ; P680 shows an empty place. | The reaction centre uses the energy to send an electron across the membrane, to plastoquinone. **Where does it get a new electron?** |
| 2 Water or CO₂? | A Ruben & Kamen card (portraits, 1941). m1: one flask of H₂¹⁸O molecules (purple O); a purple ¹⁸O₂ bubble rises. m2: two flasks, H₂¹⁸O and C¹⁸O₂; only the water flask gives purple ¹⁸O₂, the CO₂ flask gives yellow O₂. Key: purple = ¹⁸O, an oxygen isotope. | 1941, Ruben and Kamen labelled the algae's water or their CO₂ with the oxygen isotope ¹⁸O. Only ¹⁸O from water came out as O₂: the O₂, and the electrons, come from water. *(approved wording)* |
| 3 Water splitting | 2 H₂O molecules come to the water-splitting site on the lumen side (named). They split: the O atoms pair into O₂ (two balls), which leaves; 4 ringed H⁺ stay in the lumen; 4 e⁻ go up one by one and refill P680. | Photosystem II splits water: 2 H₂O → O₂ + 4 H⁺ + 4 e⁻. The electrons refill the reaction centre; the H⁺ stay in the lumen. |
| 4 Plastoquinol | Light again; a second e⁻ reaches PQ; 2 ringed H⁺ come from the stroma onto it; the label changes to "plastoquinol (PQH₂)"; it moves off along the membrane. Zoom out; b₆f starts to light. | Plastoquinone takes two electrons and two H⁺ from the stroma and, as plastoquinol (PQH₂), carries them on in the membrane. **Where do they go next?** |

### b6f (slide 8): stagings m1 (zoom on b₆f), m2 (the camera follows plastocyanin to PSI)

| Beat | What happens | Caption |
|---|---|---|
| 1 Hand-over | Leaders name "cytochrome b₆f" and "plastoquinol (PQH₂)". PQH₂, carrying 2 e⁻ and 2 ringed H⁺, docks at b₆f. Its 2 H⁺ drop into the lumen; its 2 e⁻ enter b₆f. | Plastoquinol docks at cytochrome b₆f and hands over its two electrons; its two H⁺ are released into the lumen. |
| 2 Plastocyanin | The leader "plastocyanin, a small copper protein" appears *before* it moves. One e⁻ passes to it. It travels through the lumen to photosystem I and docks under it, **and stays there**. | Cytochrome b₆f passes the electrons one at a time to plastocyanin, which carries each through the lumen to photosystem I. |
| 3 H⁺ in the lumen | Zoom out. More ringed H⁺ collect in the lumen; photosystem I starts to light; plastocyanin stays docked at PSI (no snap back). | With every plastoquinol, more H⁺ collect in the lumen. **What does photosystem I do with the electron?** |

### psi (slide 9): stagings m1–m4, the same first two beats, differing in the Emerson beats (the lecturer: "Emerson experiment should really be more illustrated. So make more variations on this one.")

| Beat | What happens | Caption |
|---|---|---|
| 1 Second light reaction | Plastocyanin is already docked (b₆f's end). Leaders name "photosystem I", "reaction centre (P700)", "plastocyanin" and "ferredoxin (Fd)". Light arrives; e⁻ P700 → ferredoxin; plastocyanin's e⁻ refills P700. | Light at photosystem I sends an electron across the membrane to ferredoxin; plastocyanin refills the reaction centre. |
| 2 NADPH | A leader names "FNR". Fd → FNR; tags NADP⁺ + ringed H⁺ → NADPH form in the stroma. | Ferredoxin passes the electrons to FNR, which makes NADPH from NADP⁺ + H⁺ in the stroma. |
| 3 Emerson's enhancement (1957) | Emerson's card (portrait), then the staging's own illustration, all with the red 680 nm and far-red > 700 nm colours and PSII and PSI highlighted. **m1:** two lamps on the chain, red onto PSII, far-red onto PSI, with an O₂ counter for red alone, far-red alone and both (more than the sum). **m2:** Emerson's quantum-yield "red drop" redrawn in slide colours (wavelength axis coloured), then the enhancement bars. **m3:** the PSII and PSI absorption spectra with the two lamp bands over them (680 nm excites both, > 700 nm mostly PSI). **m4:** the Z-scheme (Hill & Bendall 1960), red lifting at PSII, far-red at PSI; with far-red only, the PSII step is missing. | 1957, Emerson: far-red light (beyond 680 nm) alone gave little O₂ per photon; added to shorter red light, it gave more than the two separately. |
| 4 Two photosystems in series | Written on the image: "far-red alone: PSI runs, PSII barely → few electrons from water → little O₂"; "red + far-red: both run → more O₂ than the two apart". Zoom out; ATP synthase starts to light. | Photosystem II and photosystem I work in series, and each needs its own light. **What else does the chain make besides NADPH?** |

### atps (slide 10): stagings m1 (zoom on the slide), m2 (close-up cross-section of ATP synthase with a turn counter)

| Beat | What happens | Caption |
|---|---|---|
| 1 Proton gradient | Ringed H⁺ from water splitting and from b₆f collect in the lumen. Small pH labels: lumen ≈ 6, stroma ≈ 8 (Kramer et al. 1999). | H⁺ from water splitting and from cytochrome b₆f collect in the lumen: it becomes more acidic than the stroma (about pH 6 against 8). |
| 2 ATP in the dark | The Jagendorf & Uribe 1966 card: chloroplasts in acid (pH 4), then moved to a basic buffer (pH 8) with ADP + Pᵢ (tags) → ATP (tag), in the dark. | 1966, Jagendorf and Uribe soaked chloroplasts in acid, then moved them to a basic buffer with ADP: they made ATP in the dark. The H⁺ gradient alone drives ATP synthesis. |
| 3 The rotor | Leaders name "rotor (c-ring)" in the membrane and "head" in the stroma. Ringed H⁺ pass one by one from the lumen through the c-ring into the stroma, and the rotor turns. ADP + Pᵢ tags enter the head; an ATP tag leaves. A counter reads "14 H⁺ → 1 turn → 3 ATP". | H⁺ flow back, down their gradient, through ATP synthase: the flow turns its rotor, and its head joins ADP + Pᵢ into ATP. 14 H⁺ make one turn and 3 ATP. |
| 4 NADPH and ATP | Zoom out; NADPH and ATP tags sit in the stroma. | Light has made NADPH and ATP in the stroma. **Does the chain make them in the right ratio?** |

### cyclic (slide 10b): stagings m1 (slide zoom with click stops), m2 (loop with an H⁺ counter filling a 14-slot rotor dial), m3 (conditions panel); staging `a` stays listed. A readout of ATP : NADPH bars and an H⁺ count is on screen from the first frame to the last.

| Beat | What happens | Caption |
|---|---|---|
| 1 The gap | Readout: linear flow, 4 e⁻ move 12 H⁺ → ≈ 2.6 ATP : 2 NADPH; CO₂ fixation needs 3 : 2; the missing 0.4 ATP is a dashed gap. | Linear flow: 4 e⁻ move 12 H⁺ into the lumen, enough for ≈ 2.6 ATP per 2 NADPH. Fixing CO₂ needs 3 ATP per 2 NADPH. |
| 2 The cycle (3 click stops) | (a) Light at PSI; e⁻ → ferredoxin → back to plastoquinone along the cyclic route (FNR dim). (b) PQ takes 2 H⁺ from the stroma, moves to b₆f and releases them into the lumen; H⁺ count +2. (c) e⁻ → plastocyanin → back to PSI. No NADPH. | Cyclic flow: ferredoxin hands the electron back to plastoquinone; through b₆f it moves 2 more H⁺ into the lumen and returns to photosystem I. No NADPH is made. |
| 3 One full turn | The count reads 12 + 2 = 14 H⁺ = one turn of ATP synthase = 3 ATP; the bars become 3 : 2. | About one cycled electron per four linear ones adds the missing 2 H⁺: 14 H⁺, one full turn, 3 ATP per 2 NADPH. |
| 4 When and why | Conditions as small icons: high or fluctuating light, drought (stomata closed), cold, C₄ bundle-sheath cells. Consequence: the acidic lumen switches on heat dissipation and protects PSI. Evidence clipping: Munekage et al. 2004 (plants lacking both routes grow poorly) and/or Suorsa et al. 2012 (*pgr5* loses PSI in fluctuating light). | Plants use more cyclic flow in high or fluctuating light, drought and cold, and C₄ bundle-sheath cells rely on it; the acidic lumen also protects photosystem I. **What happens when light brings more energy than the chain can use?** |

**Facts for the cyclic beats:**
- Linear flow: 4 e⁻ → 4 H⁺ from water + 8 H⁺ via the Q cycle = 12 H⁺. With 14 H⁺ per 3 ATP, that is 2.57 ATP per 2 NADPH.
- Cyclic flow via PGR5: 2 H⁺ per e⁻.
- Sources: Kramer & Evans 2011; Yamori & Shikanai 2016; Munekage et al. 2004; Suorsa et al. 2012; Hahn et al. 2018.

## Files
**New files only:**
- `anim/<key>m-common.ts` (a new story module copied from the existing `<key>`-common file and reworked), `anim/<key>-m1.ts`, `-m2.ts` … and CSS;
- `anim/beats-<key>m.ts` for the beats;
- assets in `src/assets/anim/<key>/`.

**Don't edit** `index.ts`, `beats.ts` or `chain.ts`. Report the exact `index.ts` lines (imports and the `ANIMATIONS` entry with its stagings in order). If chain.ts needs a change, report it instead of making it; overlays in your own files are fine.

**QA:** screenshot every beat of every staging (start, each hold, end), look at each one, and keep the shots in `$W/shots/`.

**Final message:**
1. files created;
2. `index.ts` lines;
3. the final scripts as tables (captions exact);
4. one line per staging;
5. doubts.
