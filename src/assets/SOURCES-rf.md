# Lecture 2 chunk rf (C5–C8): RuBisCO's two reactions → photorespiration → FvCB (overnight build, 28 Oct 2026)

Files in `assets/rf/`. Crops and tone changes made with PIL (`python3 -P`); nothing painted over or retouched. Box = x0, y0, x1, y1 in pixels of the original file. Each figure also carries its own credit line in grey.

## The schema (`figs/rf-schema.ts`, all slides)

- Drawn after **Zhang H 2021**, MSc thesis, University of Copenhagen, **Fig. 2b** (CO₂ assimilation and photorespiration in the chloroplast stroma), itself a redraw of **von Caemmerer S 2000**, *Biochemical Models of Leaf Photosynthesis*, CSIRO Publishing, **Fig. 2.1**. Kept from the thesis: CO₂ and O₂ as atom balls, RuBP as a pentagon, ATP and NADPH tags, dashed arrows with open heads, red process labels, 5 of 6 regeneration vs 1 of 6 export with Pᵢ exchange, the brackets Ac ~ Vcmax, Aj ~ J (the thesis: Jmax), Ap ~ TPU.
- Added: the photorespiratory loop across peroxisome and mitochondrion, after **Peterhänsel C et al. 2010**, Photorespiration, *The Arabidopsis Book* 8: e0130, https://doi.org/10.1199/tab.0130 (§2.1–2.2: glycolate, glycine, 2 glycine → serine + CO₂ + NH₃, glycerate → PGA with ATP; NH₃ refixed by GS2/Fd-GOGAT with ATP and reduced ferredoxin).
- Look 'pdb' reuses the deck's chain renders `assets/chain/psii.webp`, `b6f.webp`, `psi.webp`, `atps.webp` (PDB 5XNL, 6RQF, 5L8R, 6FKF; see SOURCES.md) and the RuBisCO render below.
- Look 'tem' uses the three Frederick & Newcomb crops below.

## Images

`rf/rubisco-8ruc.png` (+ `rubisco-8ruc.json`, active-site anchors): our own render of **PDB 8RUC**, activated spinach RuBisCO with CABP (Andersson I 1996, *J Mol Biol* 259: 160–174, https://doi.org/10.1006/jmbi.1996.0310). Coordinates from https://files.rcsb.org/download/8RUC.cif (the file holds L₄S₄; the L₈S₈ assembly made with its crystal operator −x, y, −z + 100.65). Space-filling, flat colour with dark outlines, side view along the four-fold axis turned 22°, made by `scripts/rf_rubisco_render.mjs` (helpers copied from `scripts/chain_render.mjs`). Large subunits orange/brown (alternate dimers), small subunits blue. Used in C5 v3, v5; C7 v3; C8 v7.

`rf/fn6-whole.jpg`, `rf/fn6-perox.jpg` (box 45, 30, 445, 360), `rf/fn6-mito.jpg` (box 418, 198, 562, 342), `rf/fn6-granum.jpg` (box 355, 352, 575, 490): **Frederick SE, Newcomb EH 1969**, Cytochemical localization of catalase in leaf microbodies (peroxisomes), *J Cell Biol* 43: 343–353, https://doi.org/10.1083/jcb.43.2.343, **Fig. 6** (tobacco leaf: peroxisome with crystal pressed against chloroplasts, mitochondrion beside it). From the board copy `refs/C2-photorespiration/frederick1969-peroxisome-between-chloroplasts.jpg` (600 × 490), greys mapped to a warm range (black 38,34,30 → white 250,248,240). JCB archive licence CC BY-NC-SA. Used in C6 v2, v5 and the 'tem' look.

`rf/forrester1966-fig2.png`: **Forrester ML, Krotkov G, Nelson CD 1966**, Effect of oxygen on photosynthesis, photorespiration and respiration in detached leaves. I. Soybean, *Plant Physiol* 41: 422–427, https://doi.org/10.1104/pp.41.3.422, **Fig. 2** (board copy, 355 × 457, unchanged). © ASPB, free in PMC (PMC1086359). C5 v7 shows the scan; C5 v6 redraws only the two exponential fits printed in the figure (Y = 56.45 e^(−0.02X) at 275 ppm CO₂, Y = 24.29 e^(−0.02X) − 10 at 73 ppm; µg CO₂ min⁻¹ per leaf; X = % O₂).

`rf/sage2012-fig4.jpg`: **Sage RF, Sage TL, Kocacinar F 2012**, Photorespiration and the evolution of C₄ photosynthesis, *Annu Rev Plant Biol* 63: 19–47, https://doi.org/10.1146/annurev-arplant-042811-105511, **Fig. 4** (modelled photorespiration/photosynthesis against chloroplast CO₂ and leaf temperature; board copy, journal footer already cropped). © Annual Reviews, lecture use with credit. C5 v8.

`rf/schwarte2007-fig1.jpg`: **Schwarte S, Bauwe H 2007**, Identification of the photorespiratory 2-phosphoglycolate phosphatase, PGLP1, in Arabidopsis, *Plant Physiol* 144: 1580–1586, https://doi.org/10.1104/pp.107.099192, **Fig. 1B–E** (board copy, 415 × 281). C6 v6 shows panel B (box 0, 43, 205, 140: wild type and pglp1 in air, 3 weeks) and panel D (box 0, 182, 108, 280: pglp1 in 0.3 % CO₂, 4 months). © ASPB, lecture use with credit.

`rf/huang2014-fig1c.jpg`: **Huang W, Zhang S-B, Hu H 2014**, Sun leaves up-regulate the photorespiratory pathway to maintain a high rate of CO₂ assimilation in tobacco, *Front Plant Sci* 5: 688, https://doi.org/10.3389/fpls.2014.00688, **Fig. 1C** (board copy, 1156 × 895). CC BY 4.0. C7 v5 shows it; C7 v6 and v9 redraw the points read off the figure (axis calibration: PPFD 0 at x 263, 0.417 px per µmol m⁻² s⁻¹; A = 0 at y 589, 22.35 px per unit).

`rf/boardman1977-fig1.png`: **Boardman NK 1977**, Comparative photosynthesis of sun and shade plants, *Annu Rev Plant Physiol* 28: 355–377, https://doi.org/10.1146/annurev.pp.28.060177.002035, **Fig. 1** (*Atriplex patula*, data of Björkman et al. 1972). Board copy 1600 × 1422; C7 v7 shows box 0, 0, 1600, 1215 (caption left out, credited instead). © Annual Reviews.

`rf/gaastra1959-fig12.png`: **Gaastra P 1959**, Photosynthesis of crop plants as influenced by light, carbon dioxide, temperature, and stomatal diffusion resistance, *Meded Landbouwhogeschool Wageningen* 59(13): 1–68, https://edepot.wur.nl/291215, **Fig. 12A** (spinach). Board copy 970 × 880; C7 v8 shows box 0, 0, 478, 340 (panel A, spinach). Open WUR archive.

`rf/gregory2021-fig2.png`: **Gregory LM, McClain AM, Kramer DM, et al. 2021**, The triose phosphate utilization limitation of photosynthetic rate: out of global models but important for leaf models, *Plant Cell Environ* 44: 3223–3226, https://doi.org/10.1111/pce.14153, **Fig. 2B** (rice; data of Xiao et al. 2021). Board copy 1510 × 540; C8 v4 shows box 790, 62, 1510, 540 (panel B; the panel letter left out). CC BY 4.0. C8 v3 and v6 redraw the three fitted curves and the measured points, read off panel B by colour (axis calibration: Cc 0 at x 911, 5.59 px per Pa; A = 0 at y 424, 6.88 px per µmol m⁻² s⁻¹).

`rf/zhang2021-fig5.png`: **Zhang H 2021**, MSc thesis, University of Copenhagen, **Fig. 5** (wheat A/Ci from the FvCB model; the lecturer's own figure; board copy 1600 × 1103, unchanged). C8 v5, with a dashed line at Ci ≈ 300 ppm (typical C₃ leaf at 25 °C, Busch et al. 2024, Table 1, "indicative only").

## Numbers on the figures (and where they come from)

| Number | Source | Read |
|---|---|---|
| spinach RuBisCO CO₂/O₂ specificity ≈ 160 at 5 °C, ≈ 50 at 40 °C; kinetics 2/3, solubility 1/3 of the temperature effect | Jordan & Ogren 1984, Planta 161:308 | abstract |
| ≈ 1 oxygenation per 3 carboxylations, spinach RuBisCO, air, 25 °C (R_C ≈ 1.2, R_O ≈ 0.4 s⁻¹) | Flamholz et al. 2019, Biochemistry 58:3365, Results 3.1 (ratio our arithmetic) | full text |
| C₃ quantum yield at 30 °C: 0.0524 (21 % O₂), 0.0733 (2 % O₂) mol CO₂ per mol absorbed photons; ≈ 29 % lower in air (our arithmetic) | Ehleringer & Björkman 1977, Plant Physiol 59:86 | abstract |
| mutant screen: 1 % CO₂, air ≈ 0.03 % CO₂ | Peterhänsel et al. 2010, §1.2 and Fig. 2 (Somerville & Ogren 1979) | full text |
| tobacco sun 21.8 vs shade 13.1 µmol m⁻² s⁻¹ at 2000; light compensation points 32 vs 20; growth light 95 % vs 28 % | Huang, Zhang & Hu 2014, Fig. 1C, Table 1, Methods | full text |
| typical C₃ Ci ≈ 300 µmol mol⁻¹ at 25 °C | Busch et al. 2024, Plant Cell Environ 47:3344, Table 1 | full text |

## Animations rf5 (C5) and rf6 (C6) (anim/rf5-*.ts, rf6-*.ts; animation builder, 28 Oct 2026, night)

No new image files. The animations reuse:
- the schema `figs/rf-schema.ts` in the slides' looks (C5: thesis, glow, pdb, flat; C6: thesis, tem, glow, line);
- `rf/rubisco-8ruc.png` (our render of PDB 8RUC, Andersson 1996) and its active-site anchor `sites[0]` from `rf/rubisco-8ruc.json`;
- `rf/forrester1966-fig2.png` (Forrester, Krotkov & Nelson 1966, Fig. 2), whole, with a dashed line at 21 % O₂ (image x = 70 + 2.55 × % O₂, the calibration of rff05 v7);
- `rf/sage2012-fig4.jpg` (Sage, Sage & Kocacinar 2012, Fig. 4), whole;
- `rf/fn6-whole.jpg` (Frederick & Newcomb 1969, Fig. 6), whole, placed under the tem look's peroxisome cut-out at 0.5 figure units per pixel (the crop `fn6-perox.jpg` is box 45, 30, 445, 360 of it), with the pathway arrows of rff06 v5;
- `refs/C2-photorespiration/peterhansel2010-mutant-screen.jpg` (**Peterhänsel C et al. 2010**, Photorespiration, *The Arabidopsis Book* 8: e0130, https://doi.org/10.1199/tab.0130, **Fig. 2**, the Somerville & Ogren 1979 screen as the field draws it; © ASPB, free in PMC), the three trays cropped side by side (boxes 4, 2, 304, 302 · 4, 359, 304, 659 · 4, 714, 304, 1014; the figure's own text cut away and replaced by short labels).

Numbers shown, and where they come from: CO₂/O₂ specificity of spinach RuBisCO ≈ 160 at 5 °C, ≈ 50 at 40 °C (Jordan & Ogren 1984, abstract; no values between are shown); 3 carboxylations to 1 oxygenation in air at 25 °C (Flamholz et al. 2019, as on slide C5); 4 C in, 3 C back as PGA, 1 C lost as CO₂ (Peterhänsel et al. 2010, as on slide C6); 0.052 vs 0.073 mol CO₂ per mol absorbed photons, C₃ leaves at 30 °C, ≈ 29 % lower in air (Ehleringer & Björkman 1977, abstract; the percentage is our arithmetic; as rff06 v8).
The 1971 clipping is typeset (journal, year, title, authors of Bowes, Ogren & Hageman 1971, Biochem Biophys Res Commun 45: 716), not a scan.

## Animations rf7 (C7) and rf8 (C8) (rf-anim-b, overnight 28 Oct 2026)

No new image files. The animations draw the slide schema (`figs/rf-schema.ts`, all its credits above) and reuse these existing files: `rf/huang2014-fig1c.jpg` (rf7 A, C: clipping), `rf/gaastra1959-fig12.png` (rf7 B: clipping of panel A, box 0, 0, 478, 362), `rf/zhang2021-fig5.png` (rf8 B: the instrument panel, box 30, 0, 1600, 1078), and through the schema's looks `rf/rubisco-8ruc.png` and `chain/*.webp`.

| Number on screen | Source | Read |
|---|---|---|
| rf7 light curve (tobacco grown in 95 % sunlight; and 28 % in rf7 D): the points of slide C7 v6 | Huang, Zhang & Hu 2014, Fig. 1C, Table 1 | full text (values read off the figure) |
| rf8 A/Cᵢ curve: FvCB A_c and A_j with V = 104, J/4 = 40.3 µmol m⁻² s⁻¹, Γ* = 40 ppm, K = 710 ppm, R = 1 µmol m⁻² s⁻¹, fitted here to the lecturer's thesis Fig. 5 (within 1.4 µmol m⁻² s⁻¹ at 24 points; switch at ≈ 320 ppm); the parameters are not shown on screen | Zhang 2021, MSc thesis, Fig. 5; Γ* ≈ 40 from Busch et al. 2024, Table 1 | figure pixels |
| rf8 A_p = 33 µmol m⁻² s⁻¹ (meets A_j at ≈ 690 ppm): schematic, flagged on the panel ("A_p (TPU) added") | none (the thesis leaves A_p out) | — |
| "today: Cᵢ ≈ 300 ppm" | Busch et al. 2024, Table 1 | full text |
| Paper cards: Farquhar, von Caemmerer & Berry 1980, Planta 149: 78–90, "A biochemical model of photosynthetic CO₂ assimilation in leaves of C₃ species"; Sharkey 1985, Plant Physiol 78: 71–75, "O₂-insensitive photosynthesis in C₃ plants: its occurrence and a possible explanation" | the papers' title pages (titles as cited) | citation only |
