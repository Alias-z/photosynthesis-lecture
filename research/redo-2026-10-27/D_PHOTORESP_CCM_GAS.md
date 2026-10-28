# D · Photorespiration, gas exchange, CO₂ concentration, FACE (lecture 2, C6–C16)

Agent D, 27 Oct 2026. Planned from scratch on the lecturer-approved order (`PLAN_SLIDES_6-C18.md`), not from the current slides. No project code was changed.

**Evidence key.** FT = full text read (scanned pages count). Abs = abstract only. Cap = figure caption read. TB = textbook. Calc = my arithmetic. Earlier reviews: `review-2026-10-27/B`, `C`, `D`.

**Figures** are in `scratchpad/redo/D-ccm/`, full path `/private/tmp/claude-502/-Users-zhongyua--codex-visualizations-2026-10-18-01a14e64-129b-7041-8fab-d6753ae41888-claude-handoff/f6794fc7-2bfb-4414-b287-6cd85fab7db3/scratchpad/redo/D-ccm/`. The contact sheet `sheet.png` has 29 numbered tiles; "#n" below refers to these tiles. Every file was checked with `file` and viewed.

---

## 1 · Slide table (C6–C16, ≈ 27 min)

| # | Topic | Take-home (one sentence; source) | Real graph or image (paper, fig., licence, file) | Illustration (redraw plainly, from) | Latest research (2017+) | min |
|---|---|---|---|---|---|---|
| C6 | Photorespiration | O₂ competes with CO₂: at 30 °C, a C₃ leaf's quantum yield is 0.052 in air but 0.073 in 2 % O₂ (C₄: 0.053 in both; Ehleringer & Björkman 1977, FT). Recycling 2-phosphoglycolate through chloroplast, peroxisome and mitochondrion returns 3 of 4 carbons, and at 25 °C releases CO₂ at 15–20 % of net uptake (Busch, Sage & Farquhar 2018, FT). Models put the yield loss at 36 % for US soybean and 20 % for US wheat (Walker et al. 2016, FT). | **#1** Ehleringer & Björkman 1977 Plant Physiol 59:86, Fig. 2 (21 vs 2 % O₂ vs Cᵢ, 30 °C), © ASPB, free in PMC542335, `ehleringer_bjorkman1977_fig2_O2_21vs2.png` (crop of page scan). **#2** South et al. 2019 Science, Fig. 1A (native pathway in grey across 3 organelles, bypasses in colour), PMC author manuscript **CC BY 4.0**, `south2019_fig1.jpg`. Optional **#4** Sage, Sage & Kocacinar 2012 Annu Rev Plant Biol, Fig. 4 (photorespiration/photosynthesis vs Cc and T, modelled), © Annual Reviews, `sage2012_fig4.png`. | None needed: crop #2 to panel A. If a cleaner look is wanted, redraw South 2019 Fig. 1A in grey only and add "2 glycine → serine + CO₂ + NH₃" at the mitochondrion. | South 2019 (FT): AP3 bypass + PLGG1 RNAi raised field biomass 20 % (2016) and 24 % (2017). Cavanagh 2022 (FT, via B): +26 % at +5 °C. Busch 2018 (FT): assimilating NO₃⁻ via photorespiration lifts A by ≈ 10 %. | 3 |
| C7 | How gas exchange is measured (IRGA) | CO₂ and H₂O absorb infrared in their own bands (CO₂ strongest at 4.26 µm; H₂O at ≈ 2.7 and 6.3 µm), while N₂ and O₂ do not (TB). An open chamber compares a reference and a sample analyser; flow, leaf area and the two readings give A and E (Busch et al. 2024, Box 1, FT; von Caemmerer & Farquhar 1981). | **#6** Busch et al. 2024 PCE, Figure Box 1 (open system, reference vs sample IRGA), **CC BY 4.0**, `busch2024_figbox1_open_system.png` (re-rendered from the PDF so the labels are kept). **#5** Wikimedia Commons "Atmospheric Transmission-en.svg" (lower panels: H₂O and CO₂ absorption bands), **CC0**, `commons_atmospheric_transmission_IR_bands.png`. | Redraw the CO₂ and H₂O absorbance from HITRAN line data (hitran.org): two traces, 2–7 µm, analyser bands marked. Add one line on eddy covariance: the same analyser on a tower, read fast with a sonic anemometer. | Busch et al. 2024 (FT): community guide; open systems, matching IRGAs, the dilution correction. | 2.5 |
| C8 | From fluxes to gₛ, Cᵢ and Cc | Water loss and leaf temperature give stomatal conductance (gₛ). A and gₛ give Cᵢ = Cₐ − 1.6 A/gₛ(water), because water vapour diffuses 1.6 × faster than CO₂. CO₂ then crosses the mesophyll: typical values at 25 °C are 420 → 300 → 200 µmol mol⁻¹ for Cₐ → Cᵢ → Cc (Busch et al. 2024, Table 1, FT, via D). | **#7** Busch et al. 2024, Fig. 2 (H₂O and CO₂ path; gb, gs, gm; Cₐ → Cᵢ → Cc), **CC BY 4.0**, `busch2024_fig2_diffusion_path.jpg`. **#8** tomato stoma, coloured SEM, Commons, **public domain**, `commons_tomato_stoma_SEM.jpg`. **#9** Earles et al. 2018 Plant Physiol 178:148, Fig. 2 (micro-CT of a C₃ vs a CAM bromeliad leaf, coloured by diffusive path length), [OPEN] ASPB, PMC6130031, `earles2018_fig2_microCT_C3_vs_CAM.jpg`. **#10** Harwood et al. 2020 New Phytol, Fig. 1 (3-D cells and chloroplasts), licence to confirm, `harwood2020_fig1_microCT_3D.jpg`. | None: #7 is the standard schematic. | Earles 2018 (Cap): 3-D airspace traits (tortuosity, path lengthening, connectivity). Théroux-Rancourt 2017 (Abs title): 2-D sections misestimate mesophyll surface. Salesse-Smith 2024 (Abs, via D): +28 % gm, +8 % field A in tobacco. | 2.5 |
| C9 | Light-response curve | In dim light, uptake rises linearly with absorbed photons (slope = quantum yield, ≈ 0.05 CO₂ per photon in C₃ in air at 30 °C; E&B 1977, FT). It crosses zero at the light compensation point (≈ 15 µmol m⁻² s⁻¹, typical at 25 °C; Busch 2024, Table 1, via D) and saturates in bright light. Shade leaves saturate earlier: **values UNVERIFIED**. | Not downloaded. Canonical data: Björkman 1981 (Encyclopedia Plant Physiol 12A) or Boardman 1977 (Annu Rev Plant Physiol 28:355), sun vs shade *Atriplex*/*Alocasia*: both paywalled, not fetched. | Redraw one measured sun and one shade curve from Boardman 1977. **Overlap:** lecture 1 L15 already teaches this curve, quantum yield and Blackman. Keep one home: either C9 or L15. | Yin et al. 2020 (Abs, via D): the Kok method overstates light inhibition of day respiration. | 2 |
| C10 | A/Cᵢ curve; FvCB fitted once | Fitting the FvCB model (Farquhar, von Caemmerer & Berry 1980) to one measured A/Cᵢ curve separates three limits. Rubisco (slope, Vcmax) limits at low Cᵢ; RuBP regeneration (J, Jmax) above it; triose-phosphate use (TPU) is a plateau, mostly at high CO₂ (Gregory et al. 2021, FT caption; D). **The only FvCB figure in the lecture.** | **#11** Gregory et al. 2021 PCE 44:3223, Fig. 2 (rice A/Cc; red Rubisco, blue RuBP, gold TPU fits), **CC BY 4.0**, PMC9291784, `gregory2021_fig2_rice_ACi_fits.jpg`. Crop to one pair of panels (A/B). | Optional build: the same curve with the supply line A = gₛ(Cₐ − Cᵢ) crossing it at today's Cₐ. | RACiR (Stinziano et al. 2017, PCE 40:1256) and dynamic assimilation (DAT, LI-COR) ramp CO₂ continuously; minutes per curve: **UNVERIFIED** (Wiley blocked). Lochocki 2025 PhotoGEA (Abs, via D). | 3 |
| C11 | Refixing photorespired CO₂ in C₃ | In rice mesophyll, chloroplasts and their extensions line the cell periphery while mitochondria sit inside, often surrounded by chloroplasts. Photorespired CO₂ must therefore cross stroma, where it can be refixed (Sage, Sage & Kocacinar 2012, FT, citing Sage & Sage 2009). Rice and wheat refix 24–38 % of photorespired and respired CO₂ (Busch et al. 2013, Abs). | The lecturer's micrographs (Sage & Sage 2009 PCP 50:756, rice mesophyll TEM and stromule images) are **blocked** (OUP Cloudflare). Interim real image: **#12** Khoshravesh et al. 2016 J Exp Bot 67:3065, Fig. 3 (white asterisk = mitochondrion surrounded by chloroplast), **CC BY 3.0**, PMC4867898, `khoshravesh2016_fig3.jpg`. | Simple cell section: mitochondrion → chloroplast layer → airspace, with a CO₂ arrow. Redraw from Busch 2013 Fig. 1 or Sage & Sage 2009 (both blocked here). | Busch, Sage & Farquhar 2018 (FT): photorespiration also assimilates nitrogen (+≈ 10 % A). Note: Sage 2012 quotes older refixation estimates of 50–80 %; Busch 2013's 24–38 % is the measured value to show. | 2 |
| C12 | C₂ glycine shuttle | In C₂ plants, glycine decarboxylase sits mainly in bundle-sheath mitochondria on the inner wall behind chloroplasts. Glycine moves there, and its CO₂ is released next to Rubisco. Refixation rises to 75–90 % and the CO₂ compensation point Γ falls to 20–50 % of C₃ values (Sage 2012, FT). | **#13** Khoshravesh 2016, Fig. 2 (bundle-sheath TEM, mitochondria on the inner wall, C₃ vs C₂ grasses), CC BY 3.0, `khoshravesh2016_fig2.jpg`. **#12** Fig. 3 (GLDP immunogold, bundle sheath vs mesophyll), `khoshravesh2016_fig3.jpg`. **#14** Fig. 1 (cross-sections), `khoshravesh2016_fig1.jpg`. | Sage 2012 Fig. 5 (C₂ scheme) is the canonical redraw source (not downloaded; same page as #22). **#15** Sage 2012 Fig. 7 (drawn C₃ → C₄ leaf series) is a redraw source only. | Triesch 2024 (Abs, via C): transposon insertions moved GLDP expression in ≥ 5 C₂ origins. Dickinson 2025 (FT, via C): MYC–MYB module. Leung 2024 (Abs): graded C\* in *Tribulus*. | 2 |
| C13 | C₄ mechanism | PEP carboxylase (PEPC) fixes HCO₃⁻ into C₄ acids in the mesophyll: in sugarcane, > 93 % of ¹⁴C was in C₄ acids after ≈ 1 s (Hatch & Slack 1966, FT). The acids release CO₂ in the bundle sheath at > 10 × the intercellular level (Sage 2012, FT). A C₄ leaf therefore saturates at low Cᵢ (Khoshravesh 2016, Fig. 4, 31 °C) and keeps its quantum yield as leaves warm, overtaking C₃ near 30 °C (E&B 1977, Fig. 3, FT). | **#17** maize leaf, Kranz anatomy, 200×, Commons (Kelvinsong), **CC BY 3.0**, `commons_zea_mays_kranz_200x.png`. **#18** Hatch & Slack 1966 Biochem J 101:103, Fig. 2 (¹⁴C: malate + aspartate first, then 3-PGA, hexose-P, sucrose), © Biochemical Society, free in PMC1270070, `hatch_slack1966_fig2_14C_timecourse.png`. **#16** Khoshravesh 2016, Fig. 4 (A/Cᵢ of C₃, C₂, C₄ grasses), CC BY 3.0, `khoshravesh2016_fig4.jpg`. **#19** E&B 1977, Fig. 3 (quantum yield vs leaf temperature, C₃ vs C₄), `ehleringer_bjorkman1977_fig3_QY_temperature.png`. **#21** RCSB 1JQO maize PEPC (PDB data CC0), `rcsb_1jqo_PEPC_maize.jpeg`. | NADP-ME C₄ pathway across mesophyll and bundle sheath: redraw from **#20** Sage 2012 Fig. 1 (© Annual Reviews, `sage2012_fig1.png`). | Om 2026 (Abs, via C): maize PEPC in rice works at < 2.1 % of in-vitro activity. Swift 2024 Nature (via C): bundle-sheath genes reuse an ancestral DOF code. | 3 |
| C14 | How C₄ evolved | C₄ evolved independently at least 66 times within the past 35 million years (Sage 2012, FT); Sage 2016 counts 61 principal lineages (Abs), so say "> 60". It arose as CO₂ fell: grass C₄ from 32–25 Mya (Christin 2008, Abs). The route runs C₃ → proto-Kranz → C₂ → C₄ (Sage 2012, Fig. 6). | **#22** Sage 2012, Fig. 2 (phylogeny, 47 angiosperm clades with C₄, red branches), © Annual Reviews, `sage2012_fig2.png`. **#23** Sage 2012, Fig. 6 (five-phase model with *Flaveria* and *Heliotropium* species), `sage2012_fig6.png`. Sage 2012 Fig. 3 (lineage ages vs CO₂ and δ¹⁸O) not downloaded; same URL pattern, `pp630019.f3.png`. | Fig. 6 can be used as it is. | Luo 2024 (Abs, via C): C₄ covers 17.1 % of land and makes 19.5 % of GPP, and its cover is falling. Lyu 2025 (via C): *Flaveria* genomes. | 2 |
| C15 | CAM | CAM plants open stomata at night, store CO₂ as malic acid and release it behind closed stomata by day. Agave leaves take up CO₂ in the dark and build malate at night, unlike C₃ *Arabidopsis* (Abraham 2016, Fig. 1, FT). This raises water-use efficiency up to six-fold over C₃ (Abraham 2016, FT, citing primary work). | **#24** Abraham et al. 2016 Nat Plants 2:16178, Fig. 1a, c (Agave diel net CO₂ uptake in 4 leaf ages; malate in Agave vs Arabidopsis), © Springer Nature, `abraham2016_fig1_agave_CAM.jpg`. **#25** Moreno-Villena et al. 2022 Sci Adv, Fig. 1A (*Portulaca* titratable acidity, watered vs 7-d drought), **CC BY-NC 4.0**, PMC9355352, `morenovillena2022_fig1_portulaca_acidity.jpg`; optional **#26** Fig. 5 (spatial transcriptomics, mesophyll vs bundle sheath). | Four-phase diel CO₂ trace, redrawn from Osmond 1978 (Annu Rev Plant Physiol 29:379; Meta only). | Moreno-Villena 2022: C₄ + CAM in the same leaf. Gilman 2023 (via C): ≥ 66 CAM origins, ≈ 7 % of vascular plants (the plan says 6 %; use Gilman's 7 % or cite the source of 6 %). Wu 2025 (Abs): "CAM-like" rice +20 % yield, no water-use gain. | 2.5 |
| C16 | Rising CO₂ (FACE) | At +200 ppm, C₃ crop yields rose ≈ 18 % (≈ 10 % with low N or +2 °C), and C₄ yields rose only in drought (Ainsworth & Long 2021, Abs, via D). At 546–586 ppm, wheat grain held 9.3 % less zinc, 5.1 % less iron and 6.3 % less protein (Myers 2014, FT). | **#27** Myers et al. 2014 Nature 510:139, Fig. 1 (% change in Zn, Fe, protein, phytate by crop, FACE), © Springer Nature, PMC author manuscript PMC4810679, `myers2014_fig1_nutrients_eCO2.jpg`. Ainsworth & Long 2021 GCB 27:27, yield figure: **blocked** (Wiley Cloudflare). Fetch it in a normal ETH browser session. | FACE ring photo: none fetched. Swiss FACE, ETH Eschikon (1993–2002; Hebeisen 1997, Lüscher): **not checked**. | Norby 2024 (FT, via D): mature oak, wood +9.8 % over 7 years at +150 ppm. Myers 2014 is pre-2017; A&L 2021 is the 2017+ synthesis. | 2.5 |

**Optional, not a slide:** the algal pyrenoid. Freeman Rosenzweig 2017 Cell, Fig. 4 (#28, PMC author manuscript) and Engel 2015 eLife, Fig. 4 (#29, CC BY 4.0). Use them for one line on C13 or C14 only if time allows.

---

## 2 · Logic and where each key fact lives

**Chain of reasoning.** C6 sets the problem: in air, O₂ costs C₃ ≈ 29 % of its quantum yield at 30 °C (0.052 vs 0.073; Calc from E&B 1977). C7–C10 show how that cost is measured: gas, then conductances, then light, then CO₂, then the FvCB limits. C11–C14 show how plants evolved to recapture or concentrate CO₂, in the lecturer's Sage sequence: refix → shuttle → pump → > 60 origins. C15 solves water rather than O₂, so it closes the CO₂-concentrating set. C16 asks what more CO₂ does now.

**Why measurement comes before C₂/C₄:** C₂ and C₄ are judged by Γ, Cᵢ and the shape of the A/Cᵢ curve, so those must come first. C11 also needs Cc (C8).

**Where each key fact lives (once only):**
- **C6:** O₂ inhibition (21 vs 2 %); 3 of 4 C recovered; glycine decarboxylase (GDC) in the mitochondrion; cost at 25 °C; yield loss; South bypass; Somerville & Ogren mutants (one line).
- **C7:** IR absorption; N₂/O₂ transparent; reference vs sample IRGA; eddy covariance.
- **C8:** gₛ, the factor 1.6, Cᵢ, gm, Cc; ≈ 200 H₂O per CO₂ (Calc, D); micro-CT.
- **C9:** quantum yield; light compensation point; sun vs shade (unless L15 keeps them).
- **C10:** FvCB, Vcmax, Jmax, TPU; RACiR/DAT. **No other slide shows an FvCB curve.**
- **C11:** chloroplast barrier; 24–38 % refixation.
- **C12:** GDC in bundle sheath; 75–90 % refixation; Γ 20–50 % of C₃.
- **C13:** Kranz; PEPC + HCO₃⁻; Hatch & Slack; bundle sheath > 10 × CO₂; C₃ vs C₄ A/Cᵢ (measured data, not FvCB); quantum-yield crossover near 30 °C; 2 ATP per CO₂.
- **C14:** > 60 origins; CO₂ fall; five-phase model; C₄ share of GPP.
- **C15:** night malate; WUE; *Portulaca*.
- **C16:** FACE yields; Zn/Fe/protein.

**Conflicts with `PLAN_SLIDES_6-C18.md` to fix:**
- C12, "glycine decarboxylase works only in bundle-sheath mitochondria": write "mainly" (Rawsthorne 1988; Leung 2024; reviewer C).
- C14, "at least 62 times (Sage, Christin & Edwards 2011)": correct for 2011, but Sage 2012 gives ≥ 66 and Sage 2016 gives 61 principal lineages. Write "> 60".
- C15, "≈ 6 % of vascular plant species": reviewer C has ≈ 7 % (Gilman 2023).
- C7, "4.26 µm and 2.59 µm in LI-COR analysers": the 4.26 µm CO₂ band is TB. The 2.59 µm H₂O filter value is **not verified**: the LI-COR support page loaded without text. Check it in the LI-6800 manual.
- C6, the brief's "≈ 25 % of fixed carbon at 25 °C" is imprecise. The sources say:
  - CO₂ released at 15–20 % of A at 25 °C (Busch 2018, FT);
  - ≈ 26 % of net assimilation at 25 °C and 350 ppm (Sharkey 1988, quoted in Walker 2016, FT);
  - photorespiration/photosynthesis exceeds 25 % only above 30–35 °C at today's CO₂ (Sage 2012, FT).

---

## 3 · Current slides: keep, drop or merge

The lecturer asked for planning from scratch, so this is a salvage list only.

| Current | Verdict | Why |
|---|---|---|
| c06 (C₂ photorespiration) | Drop the drawings; reuse the PLATE wording on 3 of 4 C, GDC and the mutants in new C6 | The cost line (4.8 ATP) is right but too dense for this pace; keep it as an instructor note |
| c11 (gas exchange) | Split into C7 + C8 | It already has A = gₛ(Cₐ − Cᵢ) with 1.6, and Γ; it lacked the IRGA principle and real figures |
| c12 (FvCB) | Replace with C10 (Gregory 2021 data) | The Blackman corner line can stay as one clause; drop all other FvCB drawings (three were present) |
| c08 (C₂) | Becomes C11 + C12 | The C₃-refix point becomes C11; the GDC/immunogold point becomes C12 with Khoshravesh TEMs |
| c09 (C₄) | Rebuild as C13 + C14 | Hatch & Slack and ATP wording are good; the evolution point moves to C14 |
| c10 (CAM) | Rebuild as C15 | Drop "algae half of fixation" unless the pyrenoid line is kept |
| c12b (rising CO₂) | Keep the PLATE text in C16 | The numbers are already right (A&L 2021); add Myers figure |
| c13 (closing) | Not in my block (C18, agent C) | — |

---

## 4 · Hooks (one line each)

- **C6.** In 1979, Somerville & Ogren grew Arabidopsis in high CO₂ and screened for plants that sicken in air. The first mutant lacked 2-PG phosphatase (Meta; Ogren 2003). The same logic found PLGG1, which the 2019 bypass silences.
- **C7.** Gaastra 1959 measured a single leaf with an infrared analyser in a Plexiglas chamber (FT, via D). Today's open systems are his chamber with two analysers.
- **C8.** Micro-CT turns a leaf into a 3-D map of airspace. A CAM bromeliad's tightly packed cells lengthen the CO₂ path (Earles 2018).
- **C10.** FvCB (1980) now runs inside land-surface models. Adding gm alone raised the modelled CO₂ fertilisation of global GPP by 16 % (Sun 2014, Abs, via D).
- **C11.** Rice "bubble-wraps" its mitochondria in chloroplasts (Sage & Sage 2009), a C₃ plant already half-way to a CO₂ trap.
- **C12.** In 1975, Krenzer found that only *Moricandia arvensis* (Γ = 26) and *Panicum milioides* (12–20) fell between the C₃ and C₄ groups (Abs, via C). Both proved to be C₂ plants.
- **C13.** Hatch & Slack (1966) killed sugarcane leaves within seconds of feeding them ¹⁴CO₂. Malate and aspartate, not 3-PGA, carried the label first.
- **C14.** C₄ is one of the most convergent traits in biology, with ≥ 66 origins (Sage 2012). The C₄ rice project still finds maize PEPC at < 2.1 % activity in rice (Om 2026).
- **C15.** Heyne tasted Bryophyllum leaves sour in the morning and bland by afternoon (1815; via C). Synthetic "CAM-like" rice in 2025 copies the night acid but not yet the water saving.
- **C16.** Chambers promised +33 % yield at doubled CO₂ (Kimball 1983). Open-air FACE gave about half that (Long 2006, via D).

---

## 5 · Access log

**Bot checks met (not bypassed).**
- **academic.oup.com (Cloudflare):** Sage & Sage 2009 PCP, Long & Bernacchi 2003 JXB, Sage 2016 JXB.
- **onlinelibrary.wiley.com (Cloudflare):** Busch et al. 2013 PCE, Sage 2004 New Phytol, Ainsworth & Long 2021 GCB, Stinziano 2017 PCE, Théroux-Rancourt 2017 New Phytol, and the Harwood 2020 licence.
- **pmc.ncbi.nlm.nih.gov via curl:** reCAPTCHA. I read the pages in the built-in browser instead; images came from cdn.ncbi.nlm.nih.gov.

**Worked:** Annual Reviews (ETH access), nature.com (ETH access), PMC in the browser, Europe PMC API, Wikimedia Commons API, the local Busch 2024 PDF.

**Still to fetch:**
- Sage & Sage 2009 rice micrographs (lecturer's request);
- Busch 2013, Fig. 1;
- A&L 2021 yield figure;
- Somerville 2001 Plant Physiol mutant photo (PMC1539316; the local `pdfs/somerville2001.pdf` is a bot page, not a PDF);
- a sun vs shade light curve;
- a LI-6800 photo (none on Commons);
- a Swiss FACE image.

**Unverified numbers (do not put on slides yet):**
- LI-COR 2.59 µm H₂O band;
- RACiR/DAT time savings;
- sun vs shade values;
- Swiss FACE dates;
- Harwood 2020 licence;
- RCSB 1JQO depositor (stated as maize PEPC; confirm on RCSB).
