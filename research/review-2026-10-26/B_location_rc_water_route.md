# Block B review: location, reaction centres, water oxidation, electron route

26 October 2026. Scope: the `PLATE` texts and the figure labels of `src/pilot/figs/l01.ts`, `l07.ts`, `l08.ts` and `l09.ts`, and the L07–L09 part of `research/figure-briefs/ORDER_AFTER_4.md`. Findings already made in `research/review-2026-10-23-claude/B_L07-L11.md` and `REVIEW_SUMMARY.md` are not repeated; where one is still open, it is listed only as "open (23 Oct)". No project file other than this report was changed.

**Evidence key:** FT = full text read · Abs = abstract read · Meta = Crossref metadata only · TB = textbook consensus · 23-Oct = read by the 23 Oct reviewer, not re-read. All DOIs were checked against Crossref on 26 Oct 2026; see the appendix.

## Top fixes

1. **L07, point 1:** "PSI and ATP synthase in the unstacked stroma lamellae" leaves out where else they sit. In situ cryo-ET puts PSI and ATP synthase in *all* unstacked membrane, including the grana end membranes, and b₆f in both domains. Suggested: "PSII in stacked grana; PSI and ATP synthase in unstacked membrane; b₆f in both."
2. **L07 figure and slide 8 of the reorder:** the PSII quantum yield of 92 % is at the top of the measured range of 84–91 %. Use "PSII ≈ 85–90 %, PSI ≈ 97 %". Replace "ps time scale" with numbers: charge separation takes about 5 ps; delivery from the antenna takes about 50 ps (PSI) to 0.2–0.3 ns (PSII).
3. **L01:** "Water is split" and the "Split water" label contradict L08 ("Light does not split water directly"). Use "Water is oxidised". Also change "ATP and NADPH fix CO₂" to "Rubisco fixes CO₂; ATP and NADPH make it into sugar".
4. **L09:**
   - Add FNR to the route.
   - Reword "both photosystems absorb at once" to "both absorb all the time, independently; the carriers link them".
   - Add b₆f as the slow step and control point, and PQ and PC as the mobile carriers between the two membrane domains. This answers the lecturer's question about location.
5. **Origins, in one line on L07 or L08:** chloroplasts are captured cyanobacteria (open, 23 Oct), and fossil cells already had thylakoids 1.75 billion years ago (Demoulin 2024). Keep the O–O chemistry described as "debated": a 2026 Nat Commun paper supports the extra oxygen in S₃, but the field is not settled.

---

## 1. Claim check

### L01 Photosynthesis (opening)

| # | Slide claim | Verdict | Evidence | Suggested wording |
|---|---|---|---|---|
| 1.1 | "Photosynthesis converts light energy into chemical energy." | OK | TB | — |
| 1.2 | "Water is split, O₂ is released" (and figure label "Split water") | **Imprecise** (inconsistent within the deck) | L08 teaches that light does not split water: P680⁺ oxidises it through the Mn₄CaO₅ cluster. The 23 Oct summary lists "light splits water" as a misconception. [Johnson 2025](https://doi.org/10.1038/s41580-025-00847-y) (23-Oct) | "Water is oxidised: it gives up electrons, and O₂ is released" |
| 1.3 | "ATP and NADPH fix CO₂ into sugar" | **Imprecise** | TB: Rubisco fixes CO₂ without ATP or NADPH. ATP and NADPH reduce the product (3-PGA) and regenerate RuBP. [Raines 2003](https://doi.org/10.1023/A:1022421515027) (Meta) | "Rubisco fixes CO₂; ATP and NADPH turn it into sugar" |
| 1.4 | Classic equation 6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂ | OK | Balanced. L08 upgrades it correctly. | — |

### L07 From excitation to charge separation

| # | Slide claim | Verdict | Evidence | Suggested wording |
|---|---|---|---|---|
| 7.1 | Lead: "an excited chlorophyll pair hands an electron to an acceptor" | OK for BSc (simplified) | The ChlD1 point is open (23 Oct). New for instructor notes: spectroscopically, P680 is a weakly coupled multimer of the central chlorins, not a dimer ([Durrant 1995](https://doi.org/10.1073/pnas.92.11.4798), Abs). The first electron leaves ChlD1 within ~5.5 ps ([Holzwarth 2006](https://doi.org/10.1073/pnas.0505371103), Abs). In PSI, whether P700 or an accessory Chl is the primary donor is **contested** ([Holzwarth 2006 BJ](https://doi.org/10.1529/biophysj.105.059824), Abs). | Keep. Notes: "the named pair is where the + ends up, not necessarily where the electron leaves first" |
| 7.2 | "PSII is in the stacked grana; PSI and ATP synthase in the unstacked stroma lamellae." | **Imprecise** | In intact spinach chloroplasts: PSII only in appressed membrane; PSI only in non-appressed membrane, i.e. stroma lamellae, grana margins *and* grana end membranes; "Cyt b6f is present in both domains". The stroma-exposed head of ATP synthase (~12 nm) cannot enter the 3.2 nm stromal gap. [Wietrzynski 2025](https://doi.org/10.7554/eLife.105496) (FT). ATP synthase is confined to grana end membranes and stroma lamellae ([Daum 2010](https://doi.org/10.1105/tpc.109.071431), Abs). The 1980 fractionation already placed grana PSI at end membranes and margins ([Andersson & Anderson 1980](https://doi.org/10.1016/0005-2728(80)90078-X), Abs). | "PSII sits in stacked grana; PSI and ATP synthase in unstacked membrane (stroma lamellae, grana ends); b₆f in both." |
| 7.3 | Textbook "grana margin" as a third, mixed PSI/PSII domain (not on the slide, but common in textbooks) | **Contradicted by newer work** | Albertsson's three-domain model ([2001](https://doi.org/10.1016/s1360-1385(01)02021-0), Meta) is not supported in situ: "no evidence for a distinct grana margin region where these complexes have been proposed to intermix" (Wietrzynski 2025, FT). | Notes only: "a sharp border, no mixing zone" |
| 7.4 | Textbook EM images of PSII in crystalline grana arrays | **Outdated** | In intact chloroplasts PSII is non-crystalline. Lattices appear only in ruptured or isolated membranes and are probably an extraction artefact (Wietrzynski 2025 FT, against Daum 2010). | Do not draw PSII as a lattice |
| 7.5 | "They work at the same time. PSII refills its chlorophyll pair from water; PSI from the electron chain." | OK | TB. PSI is refilled by PC. | — |
| 7.6 | "P680 and P700 are Chl a pairs." | OK for BSc | Adopted from the 23 Oct review. Instructor nuance: see 7.1 (multimer) and P700 = Chl a/a′ (23 Oct). | — |
| 7.7 | "Each is named after the wavelength (nm) where its absorption bleaches." | OK | P700: absorbance change at 705 mμ ([Kok 1956](https://doi.org/10.1016/0006-3002(56)90172-x), Meta). P680: found as "Chl-a_II" in Witt's Berlin lab ([Döring 1967](https://doi.org/10.1515/znb-1967-0614), [1969](https://doi.org/10.1515/znb-1969-0911), Meta; attribution in [Govindjee 2017](https://doi.org/10.1007/s11120-016-0333-z), FT). The exact wavelength in the 1967 text is **UNVERIFIED** (primary not opened). | — |
| 7.8 | Figure: "quantum yield, weak light: PSII ≈ 92 % · PSI ≈ 97 %" | PSI OK; **PSII imprecise** | PSII in Arabidopsis thylakoids: 91 % in high-light-grown and 84 % in low-light-grown plants, depending on antenna size ([Wientjes 2013](https://doi.org/10.1021/jp401663w), Abs). PSI: 97 % even with 235 Chl, average trapping ~50 ps, the same as in plants ([Le Quiniou 2015](https://doi.org/10.1016/j.bbabio.2015.02.001), Abs). Leaf Fv/Fm, often taught as "max PSII yield", is 0.83 ([Björkman & Demmig 1987](https://doi.org/10.1007/BF00402983), Abs), so 92 % would clash with any later Fv/Fm slide. | "PSII ≈ 85–90 % · PSI ≈ 97 %" |
| 7.9 | Zoom figure (leaf → mesophyll cell → chloroplast → granum) | **Incomplete** | The double envelope is drawn but not labelled, and panel D has no b₆f. See §2, M1–M2. | Label "envelope (2 membranes)"; add b₆f to both regions |

### L08 Water supplies electrons and O₂

| # | Slide claim | Verdict | Evidence | Suggested wording |
|---|---|---|---|---|
| 8.1 | Lead: PSII replaces each lost electron with one from water; O₂ is the by-product | OK | TB | — |
| 8.2 | "Four light steps release one O₂. 2 H₂O → O₂ + 4 H⁺ + 4 e⁻, one electron per PSII charge separation." | OK | [Kok 1970](https://doi.org/10.1111/j.1751-1097.1970.tb06017.x); [Joliot 1969](https://doi.org/10.1111/j.1751-1097.1969.tb05696.x) (Meta; content 23-Oct). New nuance for notes: the cluster first stores four oxidising equivalents, and the O–O bond forms only in the last step, S₃ → S₀ ([Bhowmick 2026](https://doi.org/10.1038/s41467-026-76805-9), Abs; see §4). | — |
| 8.3 | "Light does not split water directly. Oxidised P680 takes electrons from water via a tyrosine and the Mn₄CaO₅ cluster." | OK | TB; 23-Oct | — |
| 8.4 | "All the O₂ comes from water … 6 CO₂ + 12 H₂O → C₆H₁₂O₆ + 6 O₂ + 6 H₂O" | OK | Atoms balance (C 6, H 24, O 24). **Open (23 Oct):** the limitation of Ruben's 1941 design is still UNVERIFIED from the primary text. Only a low-quality secondary page mentions bicarbonate–water O exchange. Keep the figure key "after Ruben et al. 1941; confirmed by mass spectrometry". | — |
| 8.5 | Figure: S-clock "rests in S₁ in the dark", "4 H⁺ per cycle", first O₂ on flash 3 | OK | Kok 1970; Joliot 1969 (Meta). | — |
| 8.6 | Figure: GOE "first rise ≈ 2.43, permanent ≈ 2.22" Ga; "cyanobacteria; later chloroplasts" | OK | [Poulton 2021](https://doi.org/10.1038/s41586-021-03393-7) (Meta; checked 23 Oct) | — |
| 8.7 | XFEL chemistry: **no claim on the slide now** | — | Good: keep it that way (§4). | — |

### L09 Two light-driven steps, one electron route

| # | Slide claim | Verdict | Evidence | Suggested wording |
|---|---|---|---|---|
| 9.1 | Lead: two photosystems in series carry electrons from water to NADP⁺ | OK | TB; [Hill & Bendall 1960](https://doi.org/10.1038/186136a0), [Duysens 1961](https://doi.org/10.1038/190510a0) (Meta) | — |
| 9.2 | "H₂O → PSII → PQ → b₆f → PC → PSI → Fd → NADP⁺" | **Imprecise** (FNR missing; the figure has it) | b₆f oxidises PQH₂ and reduces PC and PQ through the Q cycle ([Malone 2019](https://doi.org/10.1038/s41586-019-1746-6), Abs); FNR is the last step (TB) | "… → PSI → Fd → FNR → NADPH" |
| 9.3 | "Two boosts in series: the Z-scheme. Each electron needs two photons, one at each photosystem." | OK | Govindjee 2017 (FT): the series scheme was clinched by Duysens' 1961 cyt f push–pull experiment. Measured ≈ 9.4 photons per O₂ against the ideal 8 is open (23 Oct). | — |
| 9.4 | "Water, the electron source, enters there; both photosystems absorb at once." | **Imprecise** (wording) | "At once" can be read as synchronised, or as both photosystems needing the same photon. In reality each absorbs whenever light arrives. Their spectra differ (PSI reaches further into the far-red), so the leaf rebalances excitation by moving LHCII between them (state transitions, STN7: [Bellafiore 2005](https://doi.org/10.1038/nature03286), Meta). | "Both photosystems absorb all the time, independently; a shared carrier pool links them." |
| 9.5 | Figure "two-light test": light 1 oxidises cyt f, light 2 re-reduces it (*Porphyridium*) | OK | Govindjee 2017 (FT): red light (light 1) oxidised cyt f; adding light 2 reduced it. This experiment produced the names Light/Photosystem I and II. | Option: "PSI is 'I' because it was found first, not because electrons reach it first" |
| 9.6 | Figure grana map: "PQ: within the membrane; PC: through the lumen" | OK | TB; Wietrzynski 2025 (FT) | — |

### ORDER_AFTER_4 (L07–L09 part)

- Putting the overview (Z-scheme plus membrane map) first: **OK**. This is the standard order, and the membrane map must then carry the fixes from 7.2 and 9.2.
- Slide 8, "ps time scale, ~92–97 % quantum efficiency": **imprecise**. Use 7.8. Times: primary charge separation ≈ 5.5 ps in PSII cores (Holzwarth 2006, Abs). Overall trapping takes ≈ 50 ps in PSI (Le Quiniou 2015, Abs) and ≈ 180–310 ps in PSII in thylakoids (Wientjes 2013, Abs).

---

## 2. Missing topics

"Open (23 Oct)" means the gap was named on 23 Oct and the slides still lack it; I only add the source or angle that is new.

| # | Topic | Priority | One-line content | Source |
|---|---|---|---|---|
| M1 | **Compartments** | **must** | Leaf → mesophyll cell → chloroplast (double **envelope**) → **stroma** (CBB cycle; Fd, FNR, NADPH and ATP made here) → **thylakoid membrane** (all four complexes) → **lumen** (water oxidation, H⁺, PC). The zoom figure exists, but the envelope is unlabelled and the plate text names neither stroma nor lumen. | [Kirchhoff 2019](https://doi.org/10.1111/nph.15730) (Abs) |
| M2 | **Who sits where, and why** | **must** | PSII–LHCII in stacked grana; PSI and ATP synthase in all unstacked membrane; b₆f in both. Why: the stromal heads of PSI (~3.5 nm) and ATP synthase (~12 nm) do not fit the 3.2 nm gap between stacked discs. | [Wietrzynski 2025](https://doi.org/10.7554/eLife.105496) (FT) |
| M3 | **Mobile carriers bridge the two domains** | **must** | PQ (in the membrane; carries 2 e⁻ + 2 H⁺), PC (soluble Cu protein in the lumen; 1 e⁻), Fd (stroma; 1 e⁻). The lumen swells in light, which frees PC diffusion (Kirchhoff 2011). Measured widths: ≈ 4.5 nm (Daum 2010, light state not stated) and 10.8 nm in chloroplasts from plants given 1 h of light (Wietrzynski 2025). Give no single number. | [Kirchhoff 2011](https://doi.org/10.1073/pnas.1104141109) (Abs); [Daum 2010](https://doi.org/10.1105/tpc.109.071431) (Abs); Wietrzynski 2025 (FT) |
| M4 | **b₆f, Q cycle, slow step** | **must** (open, 23 Oct) | PQH₂ is oxidised at b₆f's lumen-side site. The Q cycle sends one e⁻ to PC and returns the other to PQ, doubling the H⁺ moved. b₆f is a "key control point" of electron transport. Raising its Rieske subunit increases electron transport and growth (Arabidopsis, *Setaria*), but in sorghum it only speeds induction (§4). Johnson 2025 gives ~200–300 e⁻ s⁻¹ (23-Oct, not re-read). | [Malone 2019](https://doi.org/10.1038/s41586-019-1746-6) (Abs); [Mitchell 1975](https://doi.org/10.1016/0014-5793(75)80359-0) (Meta); [Ermakova 2019](https://doi.org/10.1038/s42003-019-0561-9) (Abs) |
| M5 | **Endosymbiosis** | **must** (open, 23 Oct) | Chloroplasts are former cyanobacteria. Only in the L08 sky figure so far; not on the plate. | 23 Oct sources (Ponce-Toledo 2017; Coale 2024) |
| M6 | One connected membrane | nice | Grana and stroma lamellae form one connected network around one lumen. Stroma lamellae wind helically around the grana; the handedness is debated (right-handed: Austin & Staehelin 2011; mixed right- and left-handed: Bussi 2019). | [Shimoni 2005](https://doi.org/10.1105/tpc.105.035030), [Austin & Staehelin 2011](https://doi.org/10.1104/pp.110.170647), [Bussi 2019](https://doi.org/10.1073/pnas.1905994116) (Abs) |
| M7 | Excitation balance | nice | The two photosystems have different spectra; LHCII moves between them (state transitions). This makes "both absorb" precise and sets up L12–L13. | [Bellafiore 2005](https://doi.org/10.1038/nature03286) (Meta); [Li 2026](https://doi.org/10.1038/s41586-026-10847-3) (Abs, PSI–LHCI–LHCII seen in situ) |
| M8 | Time scales | nice | Charge separation in ~ps, trapping in 50–300 ps, PQH₂ oxidation in ms: a ladder of speeds that stabilises the separated charge. | Holzwarth 2006; Le Quiniou 2015; Wientjes 2013 (Abs) |
| M9 | Thylakoids evolved inside cyanobacteria | nice | *Gloeobacter*-like cyanobacteria still lack thylakoids. Fossil cells already had them 1.78–1.73 billion years ago. Oxygenic photosynthesis is unique to cyanobacteria and their plastid descendants. | [Demoulin 2024](https://doi.org/10.1038/s41586-023-06896-7) (Abs) |
| M10 | One ancestral reaction centre | nice | PSI, PSII and the bacterial reaction centres share a 5-helix core, implying common ancestry with < 10 % sequence identity. This explains why the two photosystems look alike. | [Sadekar 2006](https://doi.org/10.1093/molbev/msl079) (Abs) |

---

## 3. History stories ("then → now")

The 23 Oct review already proposed six stories: flashes → XFEL, Ruben → Li 2024, two lights → two places, quantum-yield war, chemiosmosis, cyclic flow. These three are new and fit the location and reaction-centre slides.

**A. "Named by a dip" (reaction centres, slide 8 of the reorder)**
- **Then:** Kok saw a light-induced bleaching at 705 mμ and called the pigment P700 ([Kok 1956](https://doi.org/10.1016/0006-3002(56)90172-x)). Witt's Berlin lab found a second one, "Chl-a_II", later P680 ([Döring et al. 1967](https://doi.org/10.1515/znb-1967-0614); [1969](https://doi.org/10.1515/znb-1969-0911)). Duysens' 1961 push–pull experiment named "light 1 / light 2", which is why PSI is "I" although electrons reach PSII first ([Duysens 1961](https://doi.org/10.1038/190510a0); [Govindjee 2017](https://doi.org/10.1007/s11120-016-0333-z), FT).
- **Now:** P680 behaves as a multimer ([Durrant 1995](https://doi.org/10.1073/pnas.92.11.4798)), and the first electron leaves a neighbouring Chl (ChlD1) within ~5 ps ([Holzwarth 2006](https://doi.org/10.1073/pnas.0505371103)). In PSI the same question is still contested.
- **Message:** the names stuck; the molecules turned out more interesting.

**B. "Where are the photosystems?" (location, slide 7 of the reorder)**
- **Then:** fractionating spinach thylakoids showed that PSII is enriched in stacked grana and PSI in stroma lamellae. This "lateral heterogeneity" was a surprise in 1980 ([Andersson & Anderson 1980](https://doi.org/10.1016/0005-2728(80)90078-X)). Electron tomography then showed ATP synthase confined to unstacked membrane ([Daum 2010](https://doi.org/10.1105/tpc.109.071431)).
- **Now:**
  - In situ cryo-ET of intact chloroplasts shows a sharp PSI/PSII border with no mixed margin, and no PSII lattices ([Wietrzynski 2025](https://doi.org/10.7554/eLife.105496)).
  - In rice chloroplasts, PSII–LHCII is larger than any purified form and is proposed to act as the "skeleton" that stacks grana ([Li 2026](https://doi.org/10.1038/s41586-026-10847-3); a proposal).
- **Message:** location is function. The separation is why PQ and PC must travel.

**C. "The bottleneck" (b₆f, L09)**
- **Then:** Witt's lab placed plastoquinone between the two light reactions as the slow, pool-forming step ([Stiehl & Witt 1969](https://doi.org/10.1515/znb-1969-1219), Meta; the often-quoted "20 ms" half-time is **UNVERIFIED**). Mitchell proposed the Q cycle ([1975](https://doi.org/10.1016/0014-5793(75)80359-0)).
- **Now:** the spinach b₆f structure shows the Q-cycle sites and bound PQ ([Malone 2019](https://doi.org/10.1038/s41586-019-1746-6)). More Rieske protein raised electron transport and biomass in Arabidopsis ([Simkin 2017](https://doi.org/10.1104/pp.17.00622)) and CO₂ assimilation in *Setaria* ([Ermakova 2019](https://doi.org/10.1038/s42003-019-0561-9)). In sorghum it gave no steady-state gain, only faster induction and more grain in the glasshouse ([Ermakova 2023](https://doi.org/10.1111/pbi.14030)).
- **Message:** the slowest step is a target for engineering, but not the only limit (**contested**).

**Reserve (one line each):**
- Hill showed that isolated chloroplasts evolve O₂ with an artificial acceptor and no CO₂ ([1937](https://doi.org/10.1038/139881a0); [1939](https://doi.org/10.1098/rspb.1939.0017)). Today, artificial water splitting reaches 9.2 % solar-to-hydrogen, but only with concentrated light at ~70 °C ([Zhou 2023](https://doi.org/10.1038/s41586-022-05399-1)).
- Franck & Herzfeld hinted at two light reactions in 1941, Rabinowitch in 1945–56, and Emerson's 1957 enhancement made it testable (Govindjee 2017, FT). This adds depth to the 23 Oct "two lights" story.

---

## 4. Latest findings, 2022–2026 (one line each)

**Water oxidation**
- **O6 in S₃ supported again, but contested.** Two-energy anomalous XFEL data show the extra oxygen (O6/Ox) bound to Mn1 and Ca in S₃. Its distance to O5 (~2.1 Å) means the O–O bond is not yet formed, so it forms in S₃ → S₀ ([Bhowmick 2026, Nat Commun](https://doi.org/10.1038/s41467-026-76805-9), Abs). This is the third paper in the Wang 2024 vs Li/Suga/Shen 2026 dispute (23 Oct). **Contested.**
- **Hydrogens seen.** A 1.71 Å cryo-EM structure of PSII locates more than half of its H atoms and new partially occupied water sites, mapping substrate-water and Q_B protonation paths ([Hussein 2024, Science](https://doi.org/10.1126/science.adn6541), Abs; erratum [2025](https://doi.org/10.1126/science.aee4204), content not checked).

**Thylakoid architecture**
- **Cryo-ET of intact chloroplasts:** a two-domain membrane, b₆f in both domains, no mixed grana margin, PSII not crystalline, lumen 10.8 nm in light-acclimated chloroplasts ([Wietrzynski 2025, eLife](https://doi.org/10.7554/eLife.105496), FT).
- **Rice in situ:** a C₂S₂M₂L₄ PSII–LHCII with four extra LHCII trimers that are lost on purification; PSII dimers across lumen and stroma are proposed to scaffold the grana; PSI–LHCI–LHCII imaged in situ ([Li 2026, Nature](https://doi.org/10.1038/s41586-026-10847-3), Abs). The scaffold role is **proposed**.
- **Doublets at dawn:** at the dark-to-light transition, "stacked thylakoid doublets" bring PSI and PSII closer and favour linear flow ([Garty 2024, Nature Plants](https://doi.org/10.1038/s41477-024-01628-9), Abs; correction exists). This is in some tension with the strict-segregation picture, and the method differs (freeze-fracture cryo-SEM).

**PSII assembly and repair**
- **Assembly:** a cryo-EM assembly intermediate (Psb27/28/34) shows the acceptor side reshaped like an anoxygenic bacterial reaction centre, protecting PSII until water splitting starts ([Zabret 2021, Nature Plants](https://doi.org/10.1038/s41477-021-00895-0), Abs; just before 2022).
- **Repair:** a *Chlamydomonas* repair intermediate carries TEF14, PRF1 and PRF2, which probably release PsbO, strip the antenna and block Q_B ([Li 2024, Nat Commun](https://doi.org/10.1038/s41467-024-49532-2), Abs).

**Evolution**
- The oldest thylakoids are in 1.78–1.73 billion-year-old fossil cells, extending the record by ≥ 1.2 billion years ([Demoulin 2024, Nature](https://doi.org/10.1038/s41586-023-06896-7), Abs).

**b₆f engineering**
- In sorghum, more Rieske protein gave no steady-state gain but faster induction and more biomass and grain in the glasshouse ([Ermakova 2023, PBJ](https://doi.org/10.1111/pbi.14030), Abs). There are no field data. **Not the only limit.**

**Artificial photosynthesis comparison**
- Photocatalytic water splitting has reached 9.2 % solar-to-hydrogen in the lab (concentrated light, ~70 °C) and 6.2 % in a 257 W outdoor system ([Zhou 2023, Nature](https://doi.org/10.1038/s41586-022-05399-1), Abs). A 100 m² panel array reached 0.76 % ([Nishiyama 2021, Nature](https://doi.org/10.1038/s41586-021-03907-3), Abs).
- Photovoltaic-driven electrolysis beats photosynthesis over a year, but under optimal conditions photosynthesis comes within 2–3× of it ([Blankenship 2011, Science](https://doi.org/10.1126/science.1200165), Abs).
- Teach it as a comparison, not a race: the leaf repairs and rebuilds its catalyst from cheap Mn.

---

## Appendix: DOI check (Crossref, 26 Oct 2026)

Title, journal and year are as Crossref returns them; titles are shortened with "…" only where very long. "Upd" lists Crossref `updated-by` notices. No retractions were found.

| DOI | Title (Crossref) | Journal | Year | Read | Upd |
|---|---|---|---|---|---|
| 10.7554/eLife.105496 | Molecular architecture of thylakoid membranes within intact spinach chloroplasts | eLife | 2025 | FT | — |
| 10.1038/s41586-026-10847-3 | In situ structures of plant photosystem supercomplexes | Nature | 2026 | Abs | — |
| 10.1016/0005-2728(80)90078-X | Lateral heterogeneity in the distribution of chlorophyll-protein complexes of the thylakoid membranes of spinach chloroplasts | BBA – Bioenergetics | 1980 | Abs | — |
| 10.1105/tpc.109.071431 | Arrangement of Photosystem II and ATP Synthase in Chloroplast Membranes of Spinach and Pea | The Plant Cell | 2010 | Abs | — |
| 10.1104/pp.110.170647 | Three-Dimensional Architecture of Grana and Stroma Thylakoids of Higher Plants as Determined by Electron Tomography | Plant Physiology | 2011 | Abs | — |
| 10.1073/pnas.1905994116 | Fundamental helical geometry consolidates the plant photosynthetic membrane | PNAS | 2019 | Abs | — |
| 10.1105/tpc.105.035030 | Three-Dimensional Organization of Higher-Plant Chloroplast Thylakoid Membranes Revealed by Electron Tomography | The Plant Cell | 2005 | Abs | — |
| 10.1073/pnas.1104141109 | Dynamic control of protein diffusion within the granal thylakoid lumen | PNAS | 2011 | Abs | — |
| 10.1111/nph.15730 | Chloroplast ultrastructure in plants | New Phytologist | 2019 | Abs | correction 10.1111/nph.16090 (not read) |
| 10.1016/s1360-1385(01)02021-0 | A quantitative model of the domain structure of the photosynthetic membrane | Trends in Plant Science | 2001 | Meta | — |
| 10.1038/s41477-024-01628-9 | Thylakoid membrane stacking controls electron transport mode during the dark-to-light transition by adjusting the distances between PSI and PSII | Nature Plants | 2024 | Abs | correction 10.1038/s41477-024-01712-0 (not read) |
| 10.1021/jp401663w | Quantum Yield of Charge Separation in Photosystem II: Functional Effect of Changes in the Antenna Size upon Light Acclimation | J. Phys. Chem. B | 2013 | Abs | — |
| 10.1016/j.bbabio.2015.02.001 | PSI–LHCI of Chlamydomonas reinhardtii: Increasing the absorption cross section without losing efficiency | BBA – Bioenergetics | 2015 | Abs | — |
| 10.1007/BF00402983 | Photon yield of O2 evolution and chlorophyll fluorescence characteristics at 77 K among vascular plants of diverse origins | Planta | 1987 | Abs | — |
| 10.1073/pnas.92.11.4798 | A multimer model for P680, the primary electron donor of photosystem II | PNAS | 1995 | Abs | — |
| 10.1073/pnas.0505371103 | Kinetics and mechanism of electron transfer in intact photosystem II and in the isolated reaction center: Pheophytin is the primary electron acceptor | PNAS | 2006 | Abs | — |
| 10.1529/biophysj.105.059824 | Ultrafast Transient Absorption Studies on Photosystem I Reaction Centers from Chlamydomonas reinhardtii. 2: Mutations near the P700 Reaction Center Chlorophylls Provide New Insight into the Nature of the Primary Electron Donor | Biophysical Journal | 2006 | Abs | — |
| 10.1016/0006-3002(56)90172-x | On the reversible absorption change at 705 mμ in photosynthetic organisms | Biochimica et Biophysica Acta | 1956 | Meta | — |
| 10.1515/znb-1967-0614 | A Second Chlorophyll Reaction in the Electron Chain of Photosynthesis — Registration by the Repetitive Excitation Technique — | Z. Naturforsch. B | 1967 | Meta | — |
| 10.1515/znb-1969-0911 | Properties of the Photoactive Chlorophyll-a_II in Photosynthesis | Z. Naturforsch. B | 1969 | Meta | — |
| 10.1515/znb-1969-1219 | Quantitative Treatment of the Function of Plastoquinone in Photosynthesis | Z. Naturforsch. B | 1969 | Meta | — |
| 10.1007/s11120-016-0333-z | Evolution of the Z-scheme of photosynthesis: a perspective | Photosynthesis Research | 2017 | FT | — |
| 10.1038/190510a0 | Two Photochemical Systems in Photosynthesis | Nature | 1961 | Meta | — |
| 10.1038/186136a0 | Function of the Two Cytochrome Components in Chloroplasts: A Working Hypothesis | Nature | 1960 | Meta | — |
| 10.1016/0014-5793(75)80359-0 | The protonmotive Q cycle: A general formulation | FEBS Letters | 1975 | Meta | — |
| 10.1038/s41586-019-1746-6 | Cryo-EM structure of the spinach cytochrome b6f complex at 3.6 Å resolution | Nature | 2019 | Abs | — |
| 10.1104/pp.17.00622 | Overexpression of the RieskeFeS Protein Increases Electron Transport Rates and Biomass Yield | Plant Physiology | 2017 | Abs | — |
| 10.1038/s42003-019-0561-9 | Overexpression of the Rieske FeS protein of the Cytochrome b6f complex increases C4 photosynthesis in Setaria viridis | Communications Biology | 2019 | Abs | — |
| 10.1111/pbi.14030 | Faster induction of photosynthesis increases biomass and grain yield in glasshouse-grown transgenic Sorghum bicolor overexpressing Rieske FeS | Plant Biotechnology Journal | 2023 | Abs | — |
| 10.1038/s41580-025-00847-y | Structure, regulation and assembly of the photosynthetic electron transport chain | Nat. Rev. Mol. Cell Biol. | 2025 | 23-Oct FT | correction 10.1038/s41580-025-00877-6 |
| 10.1038/nature03286 | State transitions and light adaptation require chloroplast thylakoid protein kinase STN7 | Nature | 2005 | Meta | — |
| 10.1038/s41467-026-76805-9 | An additional water is introduced into the manganese cluster during the formation of the S3 state of photosystem II | Nature Communications | 2026 | Abs | — |
| 10.1126/science.adn6541 | Cryo–electron microscopy reveals hydrogen positions and water networks in photosystem II | Science | 2024 | Abs | erratum 10.1126/science.aee4204 (2025, not read) |
| 10.1111/j.1751-1097.1970.tb06017.x | Cooperation of charges in photosynthetic O2 evolution–I. A linear four step mechanism | Photochemistry and Photobiology | 1970 | Meta | — |
| 10.1111/j.1751-1097.1969.tb05696.x | Un nouveau modele des centres photochimiques du systeme II | Photochemistry and Photobiology | 1969 | Meta | — |
| 10.1038/139881a0 | Oxygen Evolved by Isolated Chloroplasts | Nature | 1937 | Meta | — |
| 10.1098/rspb.1939.0017 | Oxygen produced by isolated chloroplasts | Proc. R. Soc. Lond. B | 1939 | Meta | — |
| 10.1038/s41477-021-00895-0 | Structural insights into photosystem II assembly | Nature Plants | 2021 | Abs | — |
| 10.1038/s41467-024-49532-2 | Structural basis for an early stage of the photosystem II repair cycle in Chlamydomonas reinhardtii | Nature Communications | 2024 | Abs | — |
| 10.1038/s41586-023-06896-7 | Oldest thylakoids in fossil cells directly evidence oxygenic photosynthesis | Nature | 2024 | Abs | — |
| 10.1093/molbev/msl079 | Conservation of Distantly Related Membrane Proteins: Photosynthetic Reaction Centers Share a Common Structural Core | Mol. Biol. Evol. | 2006 | Abs | — |
| 10.1038/s41586-021-03393-7 | A 200-million-year delay in permanent atmospheric oxygenation | Nature | 2021 | Meta | — |
| 10.1038/s41586-022-05399-1 | Solar-to-hydrogen efficiency of more than 9% in photocatalytic water splitting | Nature | 2023 | Abs | — |
| 10.1038/s41586-021-03907-3 | Photocatalytic solar hydrogen production from water on a 100-m2 scale | Nature | 2021 | Abs | — |
| 10.1126/science.1200165 | Comparing Photosynthetic and Photovoltaic Efficiencies and Recognizing the Potential for Improvement | Science | 2011 | Abs | — |
| 10.1023/A:1022421515027 | The Calvin cycle revisited | Photosynthesis Research | 2003 | Meta | — |

**Still UNVERIFIED:**
- The limitation of Ruben's 1941 design.
- The exact P680 wavelength in Döring 1967.
- Any plastoquinol-oxidation half-time, such as "20 ms".
- Johnson 2025's "~200–300 e⁻ s⁻¹" (not re-read by me).
- The content of the Hussein 2024, Garty 2024 and Kirchhoff 2019 corrections.
