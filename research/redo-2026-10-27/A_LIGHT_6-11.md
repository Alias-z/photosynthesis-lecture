# A-light: lecture 1, slides 6–11 (redo, 27 Oct 2026)

These slides are planned from scratch in the order the lecturer approved; the current slides were not used as a basis. The block takes about 18 min.

All figures are in `/private/tmp/claude-502/-Users-zhongyua--codex-visualizations-2026-10-18-01a14e64-129b-7041-8fab-d6753ae41888-claude-handoff/f6794fc7-2bfb-4414-b287-6cd85fab7db3/scratchpad/redo/A-light/`. The paths below are relative to that folder, and `tile n` refers to `A-light/sheet.png`. Licences are given in short form: "© publisher, credit" means a copyrighted figure used for teaching with a credit line.

## 1. Slide plan

| # | Topic | Take-home (one sentence, numbers sourced) | Real graph or image | Illustration (plain redraw, canonical source) | Latest research (2017 or later) | min |
|---|---|---|---|---|---|---|
| 6 | Antenna: energy path to the reaction centre; PSII and PSI antennas differ | Absorbed energy, not an electron, hops between chlorophylls (Chl) 0.9–2.4 nm apart. Chl b → Chl a takes ~1 ps, and the energy reaches P680 ~150 ps after absorption. Photosystem I (PSI) adds far-red "red forms" (emission ≈ 730 nm) and traps in ~50 ps. So 84–91 % (PSII) and ≈ 100 % (PSI) of absorbed photons drive charge separation. *Sources: Croce & van Amerongen 2014 Fig 4 caption (~1 ps, 150 ps); own Mg–Mg distances from PDB 5XNL; Croce & van Amerongen 2013 PSI review text (~50 ps, ≈ 100 %) and Fig 3 (77 K emission); Wientjes et al. 2013 JPCB (0.84–0.91).* | **Study page A (recommended):** Kouřil et al. 2012 BBA 1817:2, Fig 2, energy-transfer routes in C₂S₂M₂, © Elsevier, credit, `kouril2012_bba/gr2_lrg.jpg` (tile 2) · Croce & van Amerongen 2014 Nat Chem Biol 10:492, Fig 4b, energy ladder, © Springer Nature, credit, `croce2014_natchembio/Croce2014_Fig4.jpg` crop 481,0,1050,619 (tile 3) · Croce & van Amerongen 2013 Photosynth Res 116:153, Fig 3, Lhca red forms, CC BY, `croce2013_photosynthres_psi/Croce2013PSI_Fig3.jpg` (tile 5). **Study page B:** our 5XNL still `own_5xnl_energypath/still_3200x1800.png` (tile 1) in place of Kouřil. **Lead page:** the 5XNL pigment map with the path hidden and one Chl b glowing; prompt: "Energy lands here. How does it reach P680?" **Animation:** `scratchpad/lhc6/energy-path.html` (19 hops, with a ps clock). | None needed: the pigment positions come from the structure. If a plainer ladder is wanted, redraw Chl b and carotenoid → Chl a ≈ P680 (PSII), with red forms below P700 (PSI), after Croce & van Amerongen 2014 Fig 4b and 2013 Fig 4. | Su et al. 2017 Science 357:815: in pea C₂S₂M₂ (2.7 Å), the M-LHCII trimer with CP24–CP29 builds a pigment network into the core. Croce & van Amerongen 2020 Science 369:eaay2058 reviews cryo-EM supercomplexes together with spectroscopy of the energy-transfer pathways. | 4 |
| 7 | Charge separation in the reaction centre | Within ~3 ps the excited reaction-centre chlorophylls pass an electron to pheophytin (Pheo). Ever slower hops (to quinone Q_A in ~250 ps, to Q_B in 0.2–0.7 ms) pull the charges apart before they recombine. They leave P680⁺ at ≈ +1.25 V, one of the strongest oxidants in biology. *Source: Shevela et al. 2023 text (~3 ps, 250 ps, ~+1.25 V citing Diner & Rappaport 2002) and Fig 6b (0.2–0.7 ms).* | Shevela et al. 2023 Photosynth Res 156:279, Fig 6 (a: primary charge separation; b: PSII steps with times), CC BY, `shevela2023_photosynthres/Fig6.png` (tile 7) · Jordan et al. 2001 Nature 411:909, Fig 2, PSI cofactors P700 → A₀ → A₁ → F_X → F_A/F_B, © Springer Nature, credit, `jordan2001_nature/jordan2001_nature_fig2.jpg` (tile 8). | Two plain cofactor ladders side by side (PSII and PSI), with the membrane drawn and the times marked, from Shevela 2023 Fig 6b and Jordan 2001 Fig 2. | Baikie et al. 2023 Nature 615:836 drew electrons directly out of photoexcited PSI and PSII within a few ps, in living cyanobacteria. Romero et al. 2017 Nature 543:355 reviews the design principles of fast, efficient charge separation. | 2.5 |
| 8 | Water oxidation: Mn₄CaO₅ and the Kok cycle | The Mn₄CaO₅ cluster (4 Mn, 1 Ca, 5 oxo bridges, 4 bound waters) stores one oxidising equivalent per PSII charge separation (S₀ → S₄). So dark-adapted thylakoids release O₂ on flashes 3, 7, 11 and 15, and each O₂ needs four photons: 2 H₂O → O₂ + 4 H⁺ + 4 e⁻. *Sources: Umena et al. 2011 (cluster, 4 waters); Joliot et al. 1969 and Kok et al. 1970, as shown in Lubitz et al. 2019 Fig 3 and Shevela et al. 2023 (S₁ is dark-stable; S₄ → S₀ needs no light).* | Lubitz, Chrysina & Cox 2019 Photosynth Res 142:105, Fig 3 (A: O₂ per flash, spinach thylakoids at 4 °C, data from Messinger & Renger 2008; B: Kok cycle with step times), CC BY, `lubitz2019_photosynthres/Fig3.png` (tile 9) · Umena et al. 2011 Nature 473:55, Fig 2b, © Springer Nature, credit, `umena2011_nature/umena2011_nature_fig2.jpg` (tile 10). Alternative: Shevela 2023 Fig 8 (flash pattern + Kok cycle + S-state structures), CC BY (tile 11). **Lead page:** a dark-adapted sample and a flash train; prompt: "On which flash does O₂ appear?" | Kok clock S₀–S₄ after Kok et al. 1970. Lubitz 2019 Fig 3B is a CC BY version that can be used directly. | Bhowmick et al. 2023 Nature 617:629 (CC BY; Fig 5, tile 12): room-temperature X-ray free-electron laser snapshots of S₃ → S₀. The extra O atom O_x disappears ~700 µs after the third flash, and O₂ formation starts at ~1,200 µs. Kern et al. 2018 Nature 563:421 has the structures of the earlier S-states. | 3 |
| 9 | Two photosystems in series: Z-scheme, Emerson enhancement, b₆f link, grana vs stroma lamellae | Two photosystems in series move electrons from water (+0.82 V) to NADP⁺ (−0.32 V). Light beyond 685 nm alone works poorly unless shorter-wave light is added (Emerson enhancement). Plastoquinone (PQ), cytochrome b₆f (b₆f) and plastocyanin (PC) carry electrons from PSII in the stacked grana to PSI in the unstacked stroma lamellae. *Sources: Johnson 2016 (+820 and −320 mV; PSI and ATP synthase excluded from grana); Emerson et al. 1957 p 133 and Fig 3 (with added light, the half-yield point moves from 690 to 718 nm); Wietrzynski et al. 2020, 2025.* | Emerson, Chalmers & Cederstrand 1957 PNAS 43:133, Fig 3, PMC scan, © PNAS (free access), credit, `emerson1957_pnas/Emerson1957_Fig3_crop.png` (tile 13). Use it as the **lead page** ("Why does far-red light work better when red light is added?"). · Wietrzynski et al. 2025 eLife 14:RP105496, Fig 5 (spinach cryo-electron tomography: PSII and b₆f in grana, PSI and ATP synthase in stroma lamellae), CC BY, `wietrzynski2025_elife/wietrzynski2025_elife_fig5.jpg` (tile 16) · Malone et al. 2019 Nature 575:535, Fig 1 (b₆f dimer), © Springer Nature, credit, `malone2019_nature/malone2019_nature_fig1.png` (tile 18). Alternative: Wietrzynski 2020 Fig 3, CC BY (tile 17). | **Z-scheme on a midpoint-potential axis**, redrawn from Govindjee & Veit 2010 (`govindjee_zscheme/NewZScheme.jpg`, tile 14), with values checked against Johnson 2016 Fig 5 (CC BY, tile 15). Johnson's figure is only 775 px wide, so redraw it. Each carrier is named and spelled out at first use: PQ, b₆f, PC, ferredoxin (Fd), ferredoxin–NADP⁺ reductase (FNR). | Wietrzynski et al. 2020 eLife 9:e53740: PSI and PSII are strictly segregated at the borders between appressed and non-appressed membranes, in situ in *Chlamydomonas*. Wietrzynski et al. 2025 found the same blueprint in intact spinach chloroplasts. Malone et al. 2019 resolved spinach b₆f at 3.6 Å with up to 3 bound PQ, giving the structural basis of the Q cycle and of b₆f's redox-sensing role. | 3 |
| 10 | Proton gradient → ATP: Q cycle, c₁₄ ring, Jagendorf acid bath | Per O₂, linear flow moves 12 H⁺ into the lumen: 4 from water and 8 via the b₆f Q cycle. 14 H⁺ turn the c₁₄ rotor once to make 3 ATP (4.67 H⁺ per ATP). A pH jump alone (pH 3.8 → 8) makes ATP in the dark. *Sources: Johnson 2016 (the Q cycle doubles the lumen H⁺ per PQH₂; 4.67 H⁺/ATP; 12 is the derived sum); Seelert et al. 2000 (14 subunits); Hahn et al. 2018 (c₁₄); Jagendorf & Uribe 1966 Table 1 (141 vs 12 nmol ATP (mg Chl)⁻¹ without the jump).* | Jagendorf & Uribe 1966 PNAS 55:170, Table 1, PMC scan, © PNAS (free access), credit, `jagendorf1966_pnas/Jagendorf1966_Table1_crop.png` (tile 20). Use it as the **lead page** ("Can chloroplasts make ATP in the dark?"). · Hahn et al. 2018 Science 360:eaat4318, Fig 1A, © AAAS, credit, `hahn2018_science/hahn2018_science_fig1.jpeg` (tile 22) · Seelert et al. 2000 Nature 405:418, Fig 2 (AFM micrograph with the 14 c-subunits numbered), © Springer Nature, credit, `seelert2000_nature/Fig2.jpg` (tile 23). | Q cycle from Johnson 2016 Fig 14B (CC BY, tile 21; usable directly). The acid-bath experiment as a two-step strip, after the Methods of Jagendorf & Uribe 1966: thylakoids at pH 3.8 in succinate, then pH 8.0 with ADP and phosphate, in the dark at 0 °C. | Hahn et al. 2018 Science: the complete chloroplast ATP synthase by cryo-EM. A β-hairpin redox switch in subunit γ blocks rotation in the dark, and one turn has three unequal steps. | 3 |
| 11 | Balancing ATP and NADPH: 3 : 2 arithmetic, cyclic flow, state transitions | Fixing one CO₂ needs 3 ATP + 2 NADPH (1.5 ATP per NADPH), but linear flow gives 12 H⁺ ÷ 4.67 ≈ 2.6 ATP per 2 NADPH (1.28). Cyclic flow around PSI (via PGR5 or the NAD(P)H dehydrogenase-like complex, NDH) adds H⁺ without NADPH. State transitions move LHCII to PSI to balance the two photosystems. *Sources: Johnson 2016 (9 ATP + 6 NADPH per triose phosphate; 1.5; 1.28 at 4.67 H⁺/ATP); Munekage et al. 2004; Pan et al. 2018; Bellafiore et al. 2005 (STN7 kinase).* | Munekage et al. 2004 Nature 429:579, Fig 2 (plants lacking both cyclic routes stay small), © Springer Nature, credit, `munekage2004_nature/Fig2.jpg` (tile 24) · Pan et al. 2018 Science 360:1109, Fig 1 (PSI–LHCI–LHCII), © AAAS, credit, `pan2018_science/pan2018_science_fig1.jpeg` (tile 26). Alternative: Munekage Fig 1 (electron transport collapses in the double mutants, tile 25). | A plain H⁺ budget bar: 12 H⁺ → 2.57 ATP vs 3 ATP needed per 2 NADPH, from Johnson 2016's numbers. The cyclic loop Fd → PQ is drawn on the membrane strip of Shevela 2023 Fig 1 (CC BY, tile 19). | Degen et al. 2026 Nat Plants 12:1679 (CC BY; Fig 2, tile 27): in *pgr5* mutants the proton motive force is 50–75 % of wild type, yet stromal MgATP is unchanged. The authors conclude that cyclic flow is not required to raise ATP. Pan et al. 2018: LHCII docks at PsaO, and chlorophyll pairs relay energy into PSI. Suorsa et al. 2012 Plant Cell (pre-2017): PGR5 protects PSI in fluctuating light, and *pgr5* dies more often in the field. | 2.5 |

### Energy-path figure for slide 6 (the lecturer's priority)

| Element | Proposal | Why |
|---|---|---|
| Lead page | 5XNL pigment map: Chl a dark green, Chl b light green, one absorbing Chl b glowing, P680 marked, no path | It asks the question without giving the answer. Every dot is a real pigment position. |
| Animation | `lhc6/energy-path.html`: Chl b → Chl a (~1 ps), hops through LHCII, a jump between complexes (~10 ps), CP47, arrival at P680 (~150 ps on average), then a + and − pair | It shows one walk, step by step, on the real structure. |
| Study page | Kouřil 2012 Fig 2, with its key written below: yellow = core antenna → reaction centre, blue = within the supercomplex, green = between neighbouring complexes · Croce 2014 Fig 4b · Croce 2013 Fig 3 small | The animation already shows one path. The study page shows all route types (Kouřil), why energy flows from Chl b to Chl a but wanders among the Chl a (Croce 2014 Fig 4b), and how the PSI antenna differs (red forms). No panel repeats another. |
| Not used | Croce 2014 Fig 4a (random-walk path) | It duplicates the animation. Use it only if the animation is dropped. |

Caveat: Kouřil's arrows are proposed routes drawn on a 2009 model, not measured paths. The caption could not be read because ScienceDirect blocked access. The key above follows Rosenqvist's slide 7.

## 2. Logic and where each fact lives

**Slide 6** defines the light-harvesting complex (LHC), energy transfer vs electron transfer, P680 and P700, and red forms. It builds on slide 4a (S₁; excess energy lost as heat in < 1 ps) and slide 5 (pigment–protein complexes).

**Slide 7** defines charge separation, Pheo, Q_A, Q_B, A₀, A₁ and the iron–sulphur clusters, and explains the P680/P700 naming (absorption bleaching at 680/700 nm; P700: Kok 1956). It builds on the energy arriving at P680 on slide 6.

**Slide 8** defines the Mn₄CaO₅ cluster, S-states, the Kok cycle and the tyrosine Y_Z. It builds on P680⁺ ≈ +1.25 V from slide 7.

**Slide 9** puts slides 6–8 in series. It defines PQ, b₆f, PC, Fd, FNR, the Z-scheme and the midpoint potential. It builds on slides 5 (grana and stroma lamellae) and 7–8.

**Slide 10** defines the proton motive force (pmf = ΔpH + Δψ), the Q cycle, F₀/F₁ and the c-ring. It builds on slide 8 (H⁺ from water) and slide 9 (PQ and b₆f).

**Slide 11** defines linear and cyclic flow, PGR5, NDH and state transitions. It builds on slide 10 (12 H⁺, 4.67) and slide 6 (LHCII). It leads into photoprotection and lecture 2 (Calvin–Benson demand).

Where each key fact lives, so none repeats:

| Slide | Facts that live there |
|---|---|
| 6 | ≤ 10 photons s⁻¹ per Chl in full sun (lead text) · Chl b → Chl a ~1 ps · ~10 ps between complexes · 150 ps to P680 · 50 ps in PSI · 0.84–0.91 and ≈ 1 efficiency · red forms ≈ 730 nm · LHCII has 8 Chl a, 6 Chl b and 4 carotenoids (optional handout line) |
| 7 | ~3 ps charge separation · ChlD1 as the start (optional) · 250 ps · 0.2–0.7 ms · Q_B takes 2 e⁻ + 2 H⁺ → PQH₂ · +1.25 V · PSI cofactor order · P700 = Chl a/a′ pair |
| 8 | Flash peaks 3, 7, 11, 15 · S₁ dark-stable · S₄ → S₀ needs no light · 2 H₂O → O₂ + 4 H⁺ + 4 e⁻ · 4 Mn + Ca, 5 oxo, 4 waters |
| 9 | +0.82 / −0.32 V · ≥ 8 photons per O₂ (2 per electron) · Emerson red drop and enhancement (690 → 718 nm) · grana/stroma-lamellae segregation · carrier names |
| 10 | Jagendorf 141 vs 12 · 12 H⁺ per O₂ (4 + 8) · c₁₄ · 3 ATP per turn · 4.67 H⁺/ATP · ATP made in the stroma |
| 11 | 3 ATP + 2 NADPH per CO₂ (1.5) · 1.28 from linear flow · cyclic routes · state transitions (STN7, LHCII → PSI) |

The ATP/NADPH ratio lives only on slide 11; slide 10 gives only H⁺ per ATP. "Lumen ≈ pH 6" is not placed anywhere, because it was not re-checked this session.

## 3. Number check log

| Number | Source | Where checked |
|---|---|---|
| Chl b/carotenoid → Chl a ~1 ps; charge separation on average 150 ps after absorption; rates in ps⁻¹ | Croce & van Amerongen 2014, Fig 4 caption | Caption on nature.com (browser) |
| Mg–Mg 0.9–2.4 nm per hop | Own path on PDB 5XNL | `lhc6/data/path.json` |
| PSI ~50 ps, internal quantum efficiency close to 100 %; red-form spectra at 77 K | Croce & van Amerongen 2013 PSI (PMC3825136) | Full text and Fig 3 caption |
| ~3 ps; 250 ps; ~+1.25 V ("one of the highest known") | Shevela et al. 2023 | Full text (PMC) |
| Q_A → Q_B 0.2–0.7 ms; Y_Z 20 ns–35 µs; Mn 0.1–2 ms | Shevela et al. 2023 | Fig 6b labels |
| O₂ peaks after flash 3, then every 4; S₁ dark-stable; S₄ → S₀ needs no light | Shevela 2023 text; Lubitz 2019 Fig 3 caption | Full text |
| Mn₄CaO₅, 5 oxo bridges, 4 waters | Umena et al. 2011 | Abstract and text (cached HTML) |
| O_x gone ~700 µs; O₂ onset ~1,200 µs | Bhowmick et al. 2023 | Abstract |
| +820, −320, +1200 mV; 4.67 H⁺/ATP; 1.5 vs 1.28; Q cycle doubles H⁺; PSI and ATP synthase excluded from grana | Johnson 2016 (PMC5264509) | Full text |
| Red drop beyond 685 nm; half-yield points 690 nm (20 °C) vs 718 nm (20 °C + added light) | Emerson et al. 1957 | Page scans, pp 133 and 137–138 |
| 141 vs 12 nmol ATP (mg Chl)⁻¹; acid stage pH 3.8; second stage pH 8.0 | Jagendorf & Uribe 1966 | Table 1 scan |
| 14 c-subunits | Seelert et al. 2000; Hahn et al. 2018 | Abstracts; Fig 2 |
| pmf 50–75 % of wild type, MgATP unchanged | Degen et al. 2026 | Abstract |
| C₂S₂ monomer: 105 Chl | Wei et al. 2016 | Abstract (cached HTML); optional |
| Derived, not quoted: 12 H⁺ per O₂; ≥ 8 photons per O₂ | Arithmetic from the facts above | Shown as arithmetic on the slide |

Not re-checked here: lumen pH ≈ 6 (left out); Kouřil 2012 Fig 2 caption (ScienceDirect block).

## 4. History hooks (optional, one line each)

- **6:** Emerson & Arnold 1932: one O₂ per ~2,480 Chl per flash, the first "photosynthetic unit".
- **7:** Kok 1956 found P700 by its absorption bleaching. Deisenhofer, Huber and Michel solved the first reaction-centre structure (bacterial), Nobel 1988.
- **8:** Ruben et al. 1941: ¹⁸O-labelled water gives labelled O₂. Joliot 1969 flash pattern; Kok 1970 S-state clock.
- **9:** Hill & Bendall 1960 Nature proposed the Z-scheme from two cytochromes. Duysens 1961 showed the opposite effects of the two photosystems on cytochrome f.
- **10:** Mitchell 1961 chemiosmosis (Nobel 1978). Jagendorf & Uribe 1966 acid bath. Boyer (binding change) and Walker (F₁ structure, Abrahams 1994), Nobel 1997. Noji 1997 filmed the rotation. Seelert 2000 counted 14 c-subunits where 12 had been predicted.
- **11:** Munekage 2002 and 2004: the *pgr5* mutant and the PGR5/NDH double mutants.

## 5. Access notes

- **Bot checks hit (not bypassed):**
  - ScienceDirect: Kouřil 2012 page refused, error CPE00001. The figures came from the Elsevier image CDN, without the caption.
  - Wiley Cloudflare: Joliot 1969 and Kok 1970 originals. Lubitz 2019 and Shevela 2023 reproduce the experiment instead (CC BY).
  - Springer Link "Client Challenge" for curl; the pages worked in the browser.
  - Portland Press Cloudflare.
  - PMC reCAPTCHA for curl after about 10 pages; Europe PMC was used afterwards.
- **PDF only (not opened in the browser):** Hill & Bendall 1960, Duysens 1961, Noji 1997, Joliot 2003. Their figures are not collected.
- **Current slides (l06–l11):** not used as a basis, per the lecturer on 27 Oct.
