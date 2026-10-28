# C1–C5, C17, C18: carbon reactions, Rubisco, improving photosynthesis (redo, 27 Oct 2026)

Planned from scratch for the approved lecture-2 order (PLAN_SLIDES_6-C18.md). No current slide is reused. Project code untouched.

**Evidence key.**
- **FT**: full text read in this session.
- **Abs**: abstract read in this session (Europe PMC or Crossref).
- **A** or **B**: verified earlier in `review-2026-10-27/A_cycle_export.md` or `B_rubisco_photorespiration.md`, at the level stated there.
- **Calc**: my own arithmetic.

**Figures.** All files are in `/private/tmp/claude-502/-Users-zhongyua--codex-visualizations-2026-10-18-01a14e64-129b-7041-8fab-d6753ae41888-claude-handoff/f6794fc7-2bfb-4414-b287-6cd85fab7db3/scratchpad/redo/C-cycle/`. The tile numbers on `sheet.png` are given as "tile n".

---

## 1. Slide table

| # | Topic | Take-home (one sentence; sources) | Real graph or image | Illustration (redraw plainly) | Latest research (2017+) |
|---|---|---|---|---|---|
| **C1** · 3 min | From light to carbon | Light both fuels the stroma (ATP, NADPH) and switches the cycle on. A wheat flag leaf moved from shade to sun needs **≈ 15 min** to regain full photosynthesis, mainly while Rubisco activates. Sources: [Taylor & Long 2017](https://doi.org/10.1098/rstb.2016.0543) (FT). | **(a)** Taylor & Long 2017, *Phil Trans R Soc B*, **Fig. 1b**: CO₂ uptake vs time after 50 → 1200 µmol m⁻² s⁻¹. Licence: CC BY 4.0. File: `taylor2017_rstb_fig1b.jpg` (tile 2). Panel a is a light-response curve, which repeats lecture 1, so it is cropped off. **(b)** [Stotz et al. 2011](https://doi.org/10.1038/nsmb.2171), *NSMB*, **Fig. 2**: tobacco Rubisco activase (Rca) hexamer. © Springer Nature; lecture use with credit. File: `stotz2011_nsmb_fig2.jpg` (tile 1). | Thylakoid → stroma bridge: ATP and NADPH in; ADP, Pᵢ and NADP⁺ back; light → ferredoxin (Fd) → thioredoxin (Trx) → "4 cycle enzymes"; H⁺ pumped into the lumen raises stromal pH. Redraw from [Michelet et al. 2013](https://doi.org/10.3389/fpls.2013.00470) **Fig. 3** (the Fd/Trx system; CC BY). Do not name the four enzymes here; C3 names them on the cycle. | Taylor & Long 2017: slow induction may cost wheat **≥ 21 %** of productivity (title; modelled). [Scafaro et al. 2023](https://doi.org/10.1038/s41467-023-38496-4) (B, Abs): above the temperature optimum, Rubisco deactivation and slower electron transport explain most of the decline. |
| **C2** · 4 min | Discovery: Rubisco fixes CO₂ | After seconds of ¹⁴CO₂, the label sits first in 3-phosphoglycerate (3-PGA; **> 80–90 %** of fixed ¹⁴C in fractions of a second), made by Rubisco. Rubisco is so slow (**≈ 3 s⁻¹** per site) that leaves hold it in bulk: **≈ 0.7 Gt** on Earth. Sources: [Calvin, Nobel lecture 1961](https://www.nobelprize.org/prizes/chemistry/1961/calvin/lecture/) (FT); [Bar-On & Milo 2019](https://doi.org/10.1073/pnas.1816654116) (FT). | **(a)** Calvin, Nobel lecture 1961: **Fig. 3** ("lollipop"), **Fig. 6** (5 s autoradiogram), **Fig. 5** (30 s, spots named). © The Nobel Foundation 1961. The nobelprize.org terms allow non-profit classroom use without asking, provided the figure is not altered and carries © and "www.nobelprize.org". Files: `calvin1961_nobel_fig3_lollipop.png`, `calvin1961_nobel_fig6_5s.png`, `calvin1961_nobel_fig5_30s.png` (tiles 3–5). **(b)** Rubisco L₈S₈ (plant) vs L₂ (bacterial), D. S. Goodsell, [PDB-101 Molecule of the Month 11](https://pdb101.rcsb.org/motm/11). CC BY 4.0, verified on the PDB-101 download page. File: `goodsell_motm11_rubisco.png` (tile 6). Alternative: RCSB [8RUC](https://www.rcsb.org/structure/8RUC) image (500 px), `rcsb_8ruc_assembly1.jpeg` (tile 7). **(c)** Optional: Bar-On & Milo 2019 **Fig. 3** (global rate estimate). CC BY-NC-ND 4.0. File: `baron2019_pnas_fig3.jpg` (tile 8). | RuBP (5 C) + CO₂ → 2 × 3-PGA (3 C), with the new carbon in the carboxyl group of one 3-PGA (A, TB). Plain molecule-free carbon boxes. This is the only place the carboxylation equation appears as text. | Bar-On & Milo 2019 (FT): **≈ 0.7 Gt**; **≈ 2.5–3 %** of leaf dry mass; on land **≈ 0.03 s⁻¹**, about **1 %** of k_cat. Whether Rubisco is the most abundant protein "is not clear". [McDonald et al. 2026](https://doi.org/10.1126/sciadv.aeh3246) (B, FT): machine-learning-guided evolution of tobacco Rubisco gave k_cat 3.5 → 4.5 s⁻¹ and k_cat/K_C(air) +43 %, with S_C/O unchanged; not yet tested in plants. |
| **C3** · 4 min | Reduction, regeneration, cost | Each CO₂ costs **3 ATP + 2 NADPH**: 2 ATP + 2 NADPH reduce two 3-PGA to triose phosphate (triose-P), and 1 ATP rebuilds RuBP. So one exported triose-P costs **9 ATP + 6 NADPH**, and **5 of every 6** triose-P stay in the cycle. Sources: Calc; [Raines 2022](https://doi.org/10.1111/nph.18394) (FT: 11 enzymes, 3 phases). | Calvin, Nobel lecture 1961. **Fig. 15** (Bassham's data): light off → 3-PGA rises, RuBP falls to ≈ 0, so the reduction and RuBP regeneration need light products. **Fig. 17** ([Wilson & Calvin 1955](https://doi.org/10.1021/ja01627a050)): CO₂ cut from 1 % to 0.003 % → RuBP rises, 3-PGA falls, so RuBP is the CO₂ acceptor. © The Nobel Foundation 1961, terms as in C2. Files: `calvin1961_nobel_fig15_lightdark.png`, `calvin1961_nobel_fig17_co2drop.png` (tiles 9–10). | The cycle in 3 coloured phases, with carbon counts per 3 CO₂ (15 C → 18 C; 1 triose-P out) and ATP/NADPH at each step. Mark the 4 Trx-activated enzymes (GAPDH; FBPase, SBPase, PRK) with one symbol, following Michelet 2013 Fig. 1. Redraw from Raines 2022 **Fig. 1b** (CC BY 4.0; reference copy `raines2022_nph_fig1.jpg`, tile 11). Leave out its engineering ovals and the photorespiration branch. Do not copy its caption's "2-phosphoglycerate": it means 2-phosphoglycolate. | [Xu et al. 2022](https://doi.org/10.1073/pnas.2121531119), *PNAS* (Abs here; FT in A): ¹³C labelling shows that sugar carbon from the cytosol and vacuole re-enters the cycle, ≈ 5 % of net fixation. The cycle is not sealed; the size of the shunt is model-based. |
| **C4** · 3.5 min | Sucrose by day, starch at night | Triose-P leaves the chloroplast only in exchange for phosphate and becomes sucrose for export. Part of the day's carbon stays as starch, which Arabidopsis leaves break down almost linearly so that **≈ 95 %** is used by dawn, even after an unexpected early night. Sources: [Flügge 1999](https://doi.org/10.1146/annurev.arplant.50.1.27) (Abs); [Graf et al. 2010](https://doi.org/10.1073/pnas.0914299107) (FT). | **(a)** Graf et al. 2010, *PNAS*, **Fig. 1A**: starch over 12 h light / 12 h dark, and with a night starting at 8 h instead of 12 h. © 2010 NAS; lecture use with credit. File: `graf2010_pnas_fig1.jpg` (tile 12); crop to panel A. **(b)** [Streb & Zeeman 2012](https://doi.org/10.1199/tab.0160), *Arabidopsis Book*, **Fig. 4**: TEM of mesophyll chloroplasts full of starch at the end of the day and empty at the end of the night; only guard-cell plastids keep starch. © 2012 ASPB; lecture use with credit. File: `streb2012_tab_fig4.jpg` (tile 13); use panels C and G. Zeeman lab, ETH: a local hook. | Chloroplast | cytosol: phosphate translocator (triose-P out, Pᵢ in) → sucrose → phloem; starch in the stroma by day; maltose out at night ([Niittylä 2004](https://doi.org/10.1126/science.1091811), Abs). Redraw from [Sharkey 2024](https://doi.org/10.1093/plphys/kiad601) **Fig. 1** (CC BY-NC-ND: redraw, do not modify; reference copy `sharkey2024_plphys_fig1.jpg`, tile 14). | Zeeman lab: [Seung et al. 2017](https://doi.org/10.1105/tpc.17.00222), *Plant Cell* (Abs). Mesophyll chloroplasts normally hold 5–7 starch granules; *ptst2* mutants have 0 or 1, so PTST2 helps start granules. [Moraes et al. 2022](https://doi.org/10.1093/plphys/kiac226) (Abs): the triple clock mutant *lhy cca1 elf3* still paces starch to dawn, so the timer remains unexplained. |
| **C5** · 3.5 min | Rubisco also reacts with O₂ | Rubisco arose before O₂ built up in the air (Great Oxidation Event ≈ 2.4 Ga). In today's ≈ 21 % O₂ and ≈ 0.04 % CO₂, a C₃ Rubisco that prefers CO₂ ≈ 100-fold (median S_C/O **98**) still oxygenates about **once per 3 carboxylations** (spinach in air: R_C ≈ 1.2, R_O ≈ 0.4 s⁻¹). Sources: [Lyons et al. 2014](https://doi.org/10.1038/nature13068) Fig. 1; [Flamholz et al. 2019](https://doi.org/10.1021/acs.biochem.9b00237) (FT). | **(a)** Lyons et al. 2014, *Nature*, **Fig. 1**: atmospheric O₂ over 4 Gyr. © Springer Nature; lecture use with credit. File: `lyons2014_nature_fig1.jpg` (tile 15). **(b)** Flamholz et al. 2019, *Biochemistry*, **Fig. 5A**: k_cat,C vs S_C/O for about 300 Rubiscos, with the earlier data set (Tcherkez 2006; Savir 2010) outlined. ACS AuthorChoice: non-commercial copying and adaptation allowed (verified in the PMC licence text). File: `flamholz2019_biochem_fig5.jpg` (tile 16). Only 694 px wide; for a sharper version, redraw panel A from the paper's supplementary data. | One active site, two gases: RuBP + CO₂ → 2 × 3-PGA; RuBP + O₂ → 3-PGA + 2-phosphoglycolate (2-PG). End on an arrow: "2-PG must be recycled → photorespiration (next)". Redraw from Flamholz 2019 **Fig. 1A** (same licence). | [Schulz et al. 2022](https://doi.org/10.1126/science.abq1416), *Science* (Abs). Resurrected ancestral Rubiscos show that form I gained its small subunit, and with it higher CO₂ specificity and carboxylation efficiency, before O₂ was in the air. Flamholz 2019 (FT): the speed–specificity correlation weakens from R ≈ 0.9 to ≈ −0.6 with the larger data set, while S_C/O varies by only ≈ 30 % among form I Rubiscos. |
| **C17** · 3 min | Improving photosynthesis | Crops convert at most **4.6 %** (C₃) or **6 %** (C₄) of solar energy into biomass. Field trials that speed up single steps have raised tobacco biomass by **≈ 15–40 %** and soybean seed yield by up to **33 %**; the soybean result is disputed. Sources: [Zhu, Long & Ort 2008](https://doi.org/10.1016/j.copbio.2008.02.004) (Abs); [Kromdijk 2016](https://doi.org/10.1126/science.aai8878) (Abs); [South 2019](https://doi.org/10.1126/science.aat9077) (FT); [López-Calcagno 2020](https://doi.org/10.1038/s41477-020-0740-1) (FT); [De Souza 2022](https://doi.org/10.1126/science.adc9831) (Abs). | **(a)** South et al. 2019, *Science*, **Fig. 6A**: 2017 field trial, AP3 bypass + PLGG1 RNAi, total dry biomass **+24 %**. The PMC version is CC BY 4.0. File: `south2019_science_fig6.jpg` (tile 17); crop to panel A. **(b)** López-Calcagno et al. 2020, *Nat Plants*, **Fig. 4**: tobacco field trials; FBP/SBPase alone gave +22–40 % growth and biomass in young 2016 plants. © Springer Nature. File: `lopezcalcagno2020_natplants_fig4.png` (tile 18). Use one of (a) or (b), not both. | **(a)** The energy-loss cascade, sunlight → biomass (100 % → 4.6 % / 6 %): redraw from Zhu, Long & Ort 2008. The figure number is unconfirmed because ScienceDirect blocked access. **(b)** A plain bar chart of field gains, one bar per paper, numbers from the papers. NPQ mechanism: slide 13 only. If slide 13 already shows the Kromdijk or De Souza numbers, drop those bars here. | [De Souza et al. 2022](https://doi.org/10.1126/science.adc9831): up to +33 % seed yield in 5 soybean events. A [Comment (Sinclair et al. 2023)](https://doi.org/10.1126/science.ade8506) calls the field design flawed; there is a [Response](https://doi.org/10.1126/science.adf2189) (both Abs). [Cavanagh et al. 2022](https://doi.org/10.1111/pbi.13750) (B, FT): the same bypass gave +11 % at ambient temperature and +26 % at +5 °C. |
| **C18** · 2 min | From leaf to loaf | The carbon in bread was fixed by Rubisco. Plant reproductive organs are **≈ 45 %** carbon. Wheat keeps the day's carbon mainly as sucrose (not starch), stores fructan in stems, and ships it as sucrose into the grain's starch. Sources: [Ma et al. 2018](https://doi.org/10.5194/bg-15-693-2018) (Abs: 45.0 % in reproductive organs, 4318 species); [Schnyder 1993](https://doi.org/10.1111/j.1469-8137.1993.tb03731.x) (Abs). | **(a)** Wheat ear, photo by A S M Jobaer, [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Wheat_ear_close-up_in_a_field_Bangladesh_01.jpg). CC BY-SA 4.0. File: `commons_wheat_ear_jobaer01.jpg` (tile 19). **(b)** Streb & Zeeman 2012, **Fig. 2A**: SEM of wheat endosperm starch granules, adapted there from Li et al. 2011. © 2012 ASPB; credit both. File: `streb2012_tab_fig2A_wheat.jpg` (tile 20); low resolution (275 × 369 px). | CO₂ → Rubisco → triose-P → sucrose → phloem → grain → starch → flour. Plain chain on a photo strip, closing on the lecture-1 equation (a callback, not a new derivation). Draw it new; reusing C3/C4 drawings would repeat a figure. | [Ding et al. 2025](https://doi.org/10.1002/csc2.70005), *Crop Sci* (A, Abs): 273 wheat varieties (1890–2019). Yield rose 0.84 % yr⁻¹ and light-saturated photosynthesis during seed fill 0.58 % yr⁻¹; the link holds only during seed fill (a correlation). |

Total time: C1–C5 ≈ 18 min; C17 + C18 ≈ 5 min at the end of the lecture.

### Supporting lines (≤ 3 per slide, terse, for the slide body)

- **C1**
  - Stroma pH rises by ≈ 1 unit in light. CO₂ fixation peaks at pH 8.1 and is ≈ 0 below 7.3 ([Werdan 1975](https://doi.org/10.1016/0005-2728(75)90041-9), Abs). Stromal Mg²⁺ also rises in light ([Portis & Heldt 1976](https://doi.org/10.1016/0005-2728(76)90154-7), Abs).
  - Each Rubisco site needs CO₂ + Mg²⁺ bound as a lysine carbamate before it works ([Lorimer 1976](https://doi.org/10.1021/bi00648a012), Abs; [Lorimer & Miziorko 1980](https://doi.org/10.1021/bi00564a027), title).
  - Rca, an AAA+ hexamer, uses ATP to pull inhibitory sugar phosphates from Rubisco sites (Stotz 2011, Abs). Trx regulates the larger Rca isoform ([Portis 2003](https://doi.org/10.1023/a:1022458108678), Abs).
- **C2**
  - Rubisco L₈S₈: 8 large (475 aa) + 8 small (123 aa) subunits, M_r ≈ 550 000 ([Andersson 1996](https://doi.org/10.1006/jmbi.1996.0310), Abs); 8 active sites (Bar-On & Milo 2019, FT).
  - By 30 s, the label has spread to sugar phosphates, sucrose and amino acids (Nobel lecture, FT; Fig. 5).
  - Nobel Prize in Chemistry 1961 to Calvin alone, "for his research on the carbon dioxide assimilation in plants" (nobelprize.org). Name Benson and Bassham on the slide.
- **C3**
  - 11 enzymes in 3 phases: carboxylation, reduction, regeneration (Raines 2022, FT; Michelet 2013, FT). Do not use "13 reactions": not verified.
  - The 3 : 2 ATP : NADPH ratio is the 1.5 from lecture 1. Say it once as a callback; do not restate ≈ 1.3.
- **C4**
  - The phosphate translocator swaps triose-P for Pᵢ (Flügge 1999, Abs; Sharkey 2024, FT).
  - At night starch leaves the chloroplast mainly as maltose, through MEX1 (Niittylä 2004, Abs).
  - Arabidopsis pattern. Wheat leaves store mainly sucrose (Schnyder 1993, Abs) → C18.
- **C5**
  - Oxygenation gives 3-PGA + 2-PG; the cycle cannot use 2-PG (B; Cavanagh 2022, FT).
  - Warmth lowers specificity: spinach S_C/O ≈ 160 at 5 °C, ≈ 50 at 40 °C ([Jordan & Ogren 1984](https://doi.org/10.1007/BF00398720), Abs).
  - k_cat,C varies by only ≈ 50 % among form I Rubiscos (Flamholz 2019, FT); "nearly perfectly optimized" ([Tcherkez 2006](https://doi.org/10.1073/pnas.0600605103), Abs) is now debated.
- **C17**
  - South 2019's abstract says "> 40 %", but the 2017 full-text data give +24 % total biomass. An erratum exists ([10.1126/science.aay8818](https://doi.org/10.1126/science.aay8818)); its content was not read. Use 24 %.
  - Kromdijk 2016: ≈ 15 % more dry matter in tobacco in fluctuating light (Abs).
  - Bypass field trials are "limited by small size and low statistical power" ([Meacham-Hensold 2026](https://doi.org/10.1111/nph.70724), B, FT).
- **C18**
  - Fructan is wheat's main longer-term reserve, stored in internodes and sheaths and later lost to the grain (Schnyder 1993, Abs).

---

## 2. Logic and where each key fact lives

**Logic.**
1. C1: the energy arrives and the switches turn on.
2. C2: what is made first (¹⁴C), and by which enzyme (Rubisco: slow, so abundant).
3. C3: how the loop closes, shown by the two Calvin transients, and what it costs.
4. C4: where the product goes, by day and by night.
5. C5: Rubisco's flaw, its origin, and the trade-off, ending on 2-PG → photorespiration (next block).
6. C17 and C18 close the lecture: how to do better, and back to the grain.

**Where each fact lives** (each fact on one slide only):

| Fact | Slide |
|---|---|
| ATP/NADPH supply; Trx and pH switch; Rca; carbamylation; induction ≈ 15 min | C1 |
| ¹⁴C pulse, 3-PGA first, Nobel 1961; RuBP + CO₂ → 2 × 3-PGA (the only text equation for carboxylation); L₈S₈; 0.7 Gt; k_cat ≈ 3 s⁻¹; 0.03 s⁻¹ in the field | C2 |
| Light-off and CO₂-drop transients; 11 enzymes; names of the 4 Trx enzymes; 3 ATP + 2 NADPH per CO₂; 9 + 6 per triose-P; 5 of 6 recycled | C3 |
| Phosphate translocator; sucrose; starch by day and night; 95 % by dawn; maltose/MEX1 | C4 |
| Wheat stores sucrose and fructan, not leaf starch | C18 (C4 has a one-word caveat only) |
| GOE timing; S_C/O 98; 1 oxygenation per 3 carboxylations; temperature effect on S_C/O; speed–specificity data; 2-PG | C5 |
| 4.6 % / 6 % ceiling; field gains | C17 |
| 45 % carbon; equation callback | C18 |
| FvCB, Γ*, photorespiration cost | not here (C10 and the next block) |

**Old c01–c05.** Nothing is reused. Do not carry these over:
- "Earth's most abundant enzyme/protein" as fact. Bar-On & Milo 2019 (FT) say this is not established.
- The cycle sum restated on several slides.
- A second equation slide.
- Cartoon analogies (coins, doors, sacks).

---

## 3. Hooks (one line each)

- **1940, ¹⁴C.** Ruben and Kamen found carbon-14; from 1945 Calvin's group had it cheaply (Nobel lecture, FT).
- **Lollipop.** Algae were fed ¹⁴CO₂ for fractions of a second to minutes, then dropped into ≈ 4 volumes of alcohol to stop the reactions (Nobel lecture, FT).
- **Ten years to name the spots.** "Our principal chore for the succeeding ten years was to properly label those blackened areas" (Nobel lecture, FT).
- **The Nobel went to Calvin alone.** Benson's role and the rift between them: [Sharkey 2019](https://doi.org/10.1007/s11120-018-0600-2) (A, Abs; details unverified).
- **0.04 → 0.7 Gt.** Ellis estimated 0.04 Gt in one paragraph in 1979; Bar-On & Milo (2019) found ≈ 0.7 Gt, working at ≈ 1 % of k_cat.
- **A mutant that cannot switch Rubisco on.** [Somerville et al. 1982](https://doi.org/10.1104/pp.70.2.381) → the activase protein ([Salvucci et al. 1985](https://doi.org/10.1007/bf00037012)) (both titles only, Crossref).
- **Plants do division.** After an early night, starch breakdown slows at once so that it lasts until the expected dawn (Graf 2010, FT); how is still open (Moraes 2022).
- **Resurrected enzymes.** Ancestral Rubiscos rebuilt in the lab show specificity rose before O₂ did (Schulz 2022).
- **A contested yield jump.** Soybean +33 % (De Souza 2022) vs the Sinclair 2023 Comment, with a Response.

---

## 4. Licences, access problems, open items

**Licence summary.**

| Licence | Figures |
|---|---|
| CC BY 4.0 | Taylor & Long 2017; Raines 2022; South 2019 (PMC version); Goodsell MotM; Commons wheat ear (CC BY-SA 4.0) |
| CC BY | Michelet 2013 |
| CC BY-NC-ND | Bar-On & Milo 2019; Sharkey 2024 |
| ACS AuthorChoice | Flamholz 2019 |
| © publisher; lecture use with credit | Nobel Foundation (educational terms checked); NAS/PNAS (Graf 2010; reuse policy not re-checked); ASPB (Streb & Zeeman 2012); Springer Nature (Stotz 2011; Lyons 2014; López-Calcagno 2020) |
| RCSB 8RUC image | Licence taken from the earlier structures index; not re-checked |

**Bot checks and blocks (not bypassed).**

| Source | Problem | What I did |
|---|---|---|
| PMC pages via curl | reCAPTCHA | Used the browser to find image URLs, then curl on the NCBI CDN |
| science.org (Schulz 2022) | Cloudflare "Just a moment" | No figure; the abstract came from Europe PMC |
| sciencedirect.com (Zhu 2008) | Error page | No figure number |
| PDB-101 TIFF | 429 rate limit | Retry succeeded |
| ACS large image | 410 Gone | Used the PMC image |
| Europe PMC image endpoint | Returned HTML | Not a bot check; used the PMC CDN |

**Open items.**
- Figure number of the Zhu 2008 cascade.
- A Schulz 2022 figure (needs manual access).
- Content of the South 2019 erratum.
- Content of the Sinclair 2023 Comment (abstract only).
- Ding 2025 numbers are taken from review A (abstract), not re-read.
- Ma 2018's 45.0 % is the global figure for reproductive organs, not wheat grain specifically.
- Low-resolution files: Flamholz Fig. 5 (694 px) and the wheat starch panel (275 px).
- Nobel figures are 1-bit scans. The lollipop photo (tile 3) is coarse; a sharper original would need the LBNL archive or Bassham 2003 / Benson 2002 (not checked).
