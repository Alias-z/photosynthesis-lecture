# Block C review: proton motive force, ATP synthesis, electron routes

26 October 2026. Scope: the `PLATE` texts and the figure labels of `src/pilot/figs/l10.ts` and `l11.ts`, checked against `research/light-reactions/ENERGY_ROUTES_AND_FVCB.md` and `research/review-2026-10-22/ENERGY_ACCOUNTING.md`. Findings already made in `research/review-2026-10-23-claude/B_L07-L11.md` and `REVIEW_SUMMARY.md` are not repeated. Where one is still open, it is listed only as "open (23 Oct)". No project file other than this report was changed.

**Evidence key:** FT = full text read · Abs = abstract read · Meta = Crossref metadata only · TB = textbook consensus · 23-Oct = read by the 23 Oct reviewer, not re-read. All 83 DOIs were checked against Crossref on 26 Oct 2026; see the appendix. None is retracted or corrected.

## Top fixes

1. **L11 figure c, and the 23 Oct sensitivity table: "at ≈ 4 H⁺ per ATP the gap closes" is wrong.** The value of ≈ 4.0 is a thermodynamic (equilibrium) ratio. Its own authors read it as about 85 % efficiency, with 14/3 ≈ 4.7 H⁺ still passing per ATP (Turina 2016). A c₁₄ rotor cannot make 3 ATP from fewer than 14 H⁺. Delete the clause and keep "assumes 14 H⁺ per 3 ATP (c₁₄ ring) and a full Q cycle".
2. **L11 point 3: "Cyclic flow protects PSI" → "PGR5 protects PSI".** In Arabidopsis, NDH does not protect PSI in fluctuating light (Suorsa 2012). High cyclic flow without a slower ATP synthase still loses PSI (Degen 2023). Whether PGR5 protects through cyclic flow or through ATP-synthase control is unresolved (Degen 2026; Nikkanen 2026).
3. **L10 figure e: "Δψ is 10–70 %" is contested.** Leaf measurements that removed overlapping pigment signals found almost no steady Δψ after about 60 s, so ΔpH carries most of the force (Wilson 2021). Lumen pH "5.7" is the extreme value at 50 ppm CO₂ (± 0.5): write "about 6 in strong light".
4. **L11 "to O₂" route:** it is drawn as large as cyclic flow. In flowering-plant C₃ leaves, the Mehler reaction carries less than about 10 % of electron flow, and the fast O₂ outlet of other plants (flavodiiron proteins, FLV) is missing (Badger 2000; Ilík 2017). Draw it thin and label it "large in algae, mosses and conifers; small in flowering plants". It is not photorespiration.
5. **Wording and one note error:**
   - L11 point 2 "Cyclic flow makes ATP only" → "Cyclic flow adds H⁺, not NADPH": its ΔpH also slows the chain.
   - Figure f draws cyclic flow 2.5 × as wide as linear flow. Rates that high are shown only in the first seconds after darkness (Joliot 2002).
   - `ENERGY_ROUTES_AND_FVCB.md` names *Flaveria* for Ermakova 2024; the study used *Setaria viridis*.

---

## 1. Claim check

### L10 A proton gradient powers ATP synthesis

| # | Slide claim | Verdict | Evidence | Suggested wording |
|---|---|---|---|---|
| 10.1 | Lead: protons loaded into the lumen flow back through ATP synthase and make ATP in the stroma | OK | TB; [Hahn 2018](https://doi.org/10.1126/science.aat4318) (23-Oct) | — |
| 10.2 | "Water splitting releases H⁺ inside; PQ and the b₆f Q cycle move more in from the stroma." | OK | [Sacksteder 2000](https://doi.org/10.1073/pnas.97.26.14283) (23-Oct): 3 H⁺ per electron with the Q cycle always engaged. "Water splitting" conflicts with the "water is oxidised" fix in report B of 26 Oct (top fix 3). | "Water oxidation releases H⁺ inside…" |
| 10.3 | "Lumen pH falls to about 5.7–6 in strong light, not the 4–5 of many textbooks." | **Imprecise** | [Takizawa 2007](https://doi.org/10.1016/j.bbabio.2007.07.006) Abs: about 7.5 in weak light at ambient CO₂, and about 5.7 only at **50 ppm CO₂** and saturating light, ± 0.5 units. The estimate partly rests on the ECS-based Δψ/ΔpH split (10.4), which is now disputed. If Δψ is smaller, the same pmf means a more acidic lumen. | "In strong light the lumen reaches about pH 6 (± 0.5), less acidic than the 4–5 often quoted." |
| 10.4 | Figure e: "split varies: Δψ is 10–70 %" | **Contradicted by newer work; unresolved** | Kramer lab: Δψ fraction 0.1–0.7 in Arabidopsis ([Takizawa 2007](https://doi.org/10.1016/j.bbabio.2007.07.006), Abs). Johnson/Ruban lab: no steady-state ECS signal after about 60 s ([Johnson & Ruban 2014](https://doi.org/10.1007/s11120-013-9817-2), Abs). The "Δψ" read by the ECS parsing method is mostly overlap from zeaxanthin (ΔA505) and qE (ΔA535) absorption changes. In *npq1 npq4*, which lacks both overlapping signals, Δψ is < 10 % of pmf up to 417 µmol m⁻² s⁻¹ and about 0 above that (72–1396 tested; [Wilson 2021](https://doi.org/10.1093/plphys/kiab270), FT). Both sides agree that Δψ is large in the first seconds and is tuned by KEA3/VCCN1 during transients ([Li 2021](https://doi.org/10.1038/s41477-021-00947-5), Abs). | "Voltage dominates the first seconds; in steady light most of the force is ΔpH. How much voltage remains is debated." |
| 10.5 | "ATP is made in the stroma… where the Calvin–Benson cycle uses it." | OK, with useful support | Mature chloroplasts do not import cytosolic ATP; stromal ATP supply relies on exporting surplus reductant ([Voon 2018](https://doi.org/10.1073/pnas.1711497115), Abs). This supports the malate-valve route in L11. | — |
| 10.6 | Figure b: "c₁₄ ring (spinach): 14 H⁺ per turn → 3 ATP" | OK | [Seelert 2000](https://doi.org/10.1038/35013148) (Meta); [Hahn 2018](https://doi.org/10.1126/science.aat4318) (23-Oct) | — |
| 10.7 | Figure g: "2 H⁺ moved per e⁻ sent on to PC" | OK | [Sacksteder 2000](https://doi.org/10.1073/pnas.97.26.14283) (23-Oct) | — |
| 10.8 | Figure j: "Two ways in, one way out" | **Imprecise** (minor) | H⁺ also leave the lumen through the K⁺/H⁺ antiporter KEA3. This matters after a step from high to low light ([Armbruster 2014](https://doi.org/10.1038/ncomms6439), Meta; [Li 2021](https://doi.org/10.1038/s41477-021-00947-5), Abs). | "Two ways in, one way out that makes ATP" |
| 10.9 | Figure d: acid bath (Jagendorf & Uribe 1966) | OK (23-Oct) | New context for the story: Hind & Jagendorf 1963 had already split photophosphorylation into a light stage and a dark stage (§3). | — |

### L11 Electron routes make the system flexible

| # | Slide claim | Verdict | Evidence | Suggested wording |
|---|---|---|---|---|
| 11.1 | Lead: "Switching between them tunes the ATP-to-NADPH ratio and protects PSI." | OK in principle | Rerouting changes H⁺ per NADPH by definition. Whether C₃ leaves *use* cyclic flow for this is the 2026 debate ([Degen 2026](https://doi.org/10.1038/s41477-026-02374-w), FT). | "…changes how many H⁺ are pumped per NADPH and helps protect PSI." |
| 11.2 | "It gives ≈ 1.29 ATP per NADPH; the Calvin–Benson cycle needs 1.5." | OK as bookkeeping | 18/7 ÷ 2 = 1.286. Degen 2026 uses the same gap (1.28 vs 1.5). It holds only for c₁₄ and a full Q cycle, so show the assumption. Leaf demand is not exactly 1.5: photorespiration raises it (open, 23 Oct), and nitrate assimilation may offset part of the gap (posed as a question by [Noctor & Foyer 1998](https://doi.org/10.1093/jxb/49.329.1895), Meta). | "≈ 1.3 (if 14 H⁺ make 3 ATP)" |
| 11.3 | Figure c footnote: "at ≈ 4 H⁺ per ATP the gap closes" | **Contradicted** (misreads its source) | Thermodynamic H⁺/ATP = 4.0 ± 0.1 against a structural c/β = 4.7. The authors infer that 0.7 H⁺ per ATP "flow through the enzyme" without shifting equilibrium, an efficiency of 0.85 ([Turina 2016](https://doi.org/10.1016/j.bbabio.2016.02.019), Abs). The thermodynamic ratio "is not identical to the c/β ratio" ([Petersen 2012](https://doi.org/10.1073/pnas.1202799109), Abs). Slip can only *add* H⁺ per ATP. Also correct the 23 Oct B report (10.6 and the "4.0" sensitivity row) and the "h = 4" row in `ENERGY_ROUTES_AND_FVCB.md`. | "Assumes 14 H⁺ per 3 ATP (c₁₄ ring) and a full Q cycle." |
| 11.4 | "Cyclic flow makes ATP only." | **Imprecise** | Cyclic flow makes ΔpH, which serves ATP synthesis *and* acts as a brake (NPQ, slowing of b₆f). The ATP role is the debated part ([Degen 2026](https://doi.org/10.1038/s41477-026-02374-w); [Degen & Johnson 2024](https://doi.org/10.1093/plcell/koae133), Abs). | "Cyclic flow adds H⁺, not NADPH." |
| 11.5 | "Electrons loop around PSI, pumping H⁺ but making no NADPH." | OK | [Yamori & Shikanai 2016](https://doi.org/10.1146/annurev-arplant-043015-112002), Abs; NDH also pumps ([Strand 2017](https://doi.org/10.1074/jbc.M116.770792), 23-Oct) | — |
| 11.6 | "Cyclic flow protects PSI. Its ΔpH slows electron flow to PSI, which has no dedicated repair cycle." | **Imprecise** | (a) Protection is shown for **PGR5**. NDH did not contribute in Arabidopsis under fluctuating light ([Suorsa 2012](https://doi.org/10.1105/tpc.112.097162), Abs), though it does in rice ([Yamori 2016](https://doi.org/10.1038/srep20147), Abs). (b) Cyclic flow alone is not enough: *hope2*, an ATP-synthase mutant, has very high PGR5-dependent cyclic flow and wild-type ΔpH, yet lacks photosynthetic control and loses PSI ([Degen 2023](https://doi.org/10.1093/plphys/kiad084), Abs). (c) PGR5's mechanism is open: "Our data do not resolve whether PGR5 acts primarily in CET or in direct regulation of ATP synthase" (Degen 2026, FT). (d) The review wording is "lack a dedicated *rapid*-repair cycle" ([Degen & Johnson 2024](https://doi.org/10.1093/plcell/koae133)). PSI recovers over days ([Lima-Melo 2019](https://doi.org/10.1111/tpj.14177), Abs). | "**PGR5 protects PSI.** An acid lumen slows b₆f, so fewer electrons reach PSI, which has no fast repair cycle." |
| 11.7 | Figures g/h: "*pgr5* mutant: PSI damaged in fluctuating light" | OK, with a caveat for notes | The classic *pgr5-1* line carries second-site mutations and a harmful G130S allele that exaggerate the phenotype. CRISPR *pgr5* is still seedling-lethal in fluctuating light ([Penzler 2022](https://doi.org/10.1093/plphys/kiac362), Abs; [Wada 2021](https://doi.org/10.3390/cells10112884), Abs, MDPI). Degen 2026 used the CRISPR line. | — |
| 11.8 | Figure h: "Agreed: it protects PSI" | **Imprecise** | As 11.6 | "Agreed: PGR5 protects PSI" |
| 11.9 | Figure f band widths after a light jump: cyclic 15, linear 6 | **Imprecise** | Cyclic flow near the maximum photosynthetic rate is seen only in the first seconds of illuminating dark-adapted leaves ([Joliot 2002](https://doi.org/10.1073/pnas.102306999), Abs). Steady-state estimates are much lower (open, 23 Oct), and every in vivo method has flaws ([Fan 2016](https://doi.org/10.1007/s11120-016-0223-4), Abs). | Cyclic band no wider than linear, or label it "first seconds" |
| 11.10 | Figures a, b, d, i, j: "to O₂ … no net O₂ … H⁺ gradient only" | Chemistry OK; **emphasis imprecise** | In C₃ and CAM plants the Mehler reaction probably carries less than 10 % of electron flow. Most light-dependent O₂ uptake is Rubisco oxygenation ([Badger 2000](https://doi.org/10.1098/rstb.2000.0704), Abs; [Ruuska 2000](https://doi.org/10.1093/jexbot/51.suppl_1.357), Abs). Angiosperms have no FLV ([Ilík 2017](https://doi.org/10.1111/nph.14536), Abs). | Thin line; label "small in flowering plants" |
| 11.11 | Figure c: "malate export removes spare NADPH" | OK as mechanism; size unknown | Mechanism: [Scheibe 2004](https://doi.org/10.1111/j.0031-9317.2004.0222.x) (Meta) and [Voon 2018](https://doi.org/10.1073/pnas.1711497115) (Abs). Degen 2026's figure of "≈ 15 %" export is a calculation; the authors say it "requires further testing", and their biosensor support is a preprint. | — |

### The 2026 PGR5 controversy: where it stands

| | Status (26 Oct 2026) | Sources |
|---|---|---|
| **Agreed** | Without PGR5, pmf is lower in high light, photosynthetic control and NPQ are weaker, and PSI is lost in fluctuating light. This holds in Arabidopsis, rice and *Setaria*, and also with CRISPR knockouts. | Suorsa 2012; Yamori 2016; Penzler 2022; Nikkanen 2026; Degen 2026 |
| **Disputed 1: what PGR5 does** | Nikkanen: PGR5 is *not* needed for cyclic flow; it acts as a thiol-redox brake on ATP synthase and binds CF₁γ in planta. Degen: cyclic flow is lower in *pgr5*, but this was inferred, not measured directly. Degen also says the data "do not resolve" the mechanism. Earlier, the high gH⁺ of *pgr5* was read as secondary to the low pmf, not a proton leak ([Yamamoto & Shikanai 2020](https://doi.org/10.1104/pp.20.00850), Abs). | [Nikkanen 2026](https://doi.org/10.1016/j.bbabio.2026.149596) Abs; Degen 2026 FT |
| **Disputed 2: is cyclic flow needed for ATP in C₃ leaves?** | Degen: no. The MgATP²⁻ pool is unchanged while pmf is at 50–75 %, and reductant export may close the gap. The test was limited: one pool measurement (not flux), detached leaves, ≤ 390 µmol m⁻² s⁻¹, CO₂-saturated. No independent replication was found. | Degen 2026; [Yadav & Subramanyam 2026 N&V](https://doi.org/10.1038/s41477-026-02399-1) (Meta) |
| **Not disputed: C₄ bundle sheath and algae** | Cyclic flow is the main route in C₄ bundle-sheath chloroplasts: 84 % of PSI electrons, mostly via NDH ([Ermakova 2024](https://doi.org/10.1111/nph.19982), Abs; Nakamura 2026). In *Chlamydomonas*, cyclic flow plus FLV power the CO₂-concentrating mechanism ([Burlacot 2022](https://doi.org/10.1038/s41586-022-04662-9), Abs). | — |
| **Teach** | "PGR5 is essential to protect PSI. Whether it works by driving cyclic flow or by braking ATP synthase, and whether C₃ leaves need cyclic flow for ATP, was argued in two 2026 papers and is open." | — |

---

## 2. Alternative routes

**Size scale:** shares of linear electron flow (LEF) in unstressed C₃ angiosperm leaves, unless stated otherwise.

### 2.1 Cyclic flow (PGR5/PGRL1 and NDH)
- **What:** electrons go from Fd back to PQ and then through b₆f and PC to PSI. The result is H⁺ pumping without NADPH. PGR5/PGRL1 is the main, antimycin-sensitive pathway; NDH is the second. NDH takes electrons from Fd, not NAD(P)H, and pumps H⁺ itself ([Peltier 2016](https://doi.org/10.1146/annurev-arplant-043014-114752), Abs; Strand 2017). In barley, NDH binds two PSI ([Shen 2022](https://doi.org/10.1038/s41586-021-04277-6), Abs).
- **Organisms:**
  - PGR5-type: cyanobacteria (a homolog, not crucial in fluctuating light; [Allahverdiyeva 2013](https://doi.org/10.1073/pnas.1221194110)), green algae and land plants.
  - NDH-1: cyanobacteria and most land plants. It has been lost from the chloroplast genome of pines ([Wakasugi 1994](https://doi.org/10.1073/pnas.91.21.9794), Meta) and in many algae, which use a non-pumping NDH-2 (Peltier 2016).
- **Size in C₃ leaves:**
  - Steady state: below about 14 % of linear flow in unstressed leaves (Kramer & Evans 2011, 23-Oct).
  - First seconds after darkness: near the maximum photosynthetic rate (Joliot 2002).
  - No in vivo method is clean (Fan 2016).
  - NDH is minor in C₃ mesophyll but dominant in C₄ bundle sheath (Ermakova 2024).
- **Controversies:**
  - What PGR5 does: cyclic flow or an ATP-synthase brake (see the 2026 box).
  - The identity of the Fd→PQ reductase: PGRL1 was proposed ([Hertle 2013](https://doi.org/10.1016/j.molcel.2012.11.030)) and later discounted (open, 23 Oct).
  - Whether cyclic flow supplies ATP in C₃ leaves (Degen 2026).
  - Old *pgr5-1* data exaggerate the phenotype (Penzler 2022).
- **Key sources:** [Munekage 2002](https://doi.org/10.1016/S0092-8674(02)00867-X), [2004](https://doi.org/10.1038/nature02598); Yamori & Shikanai 2016; Degen & Johnson 2024.

### 2.2 Water–water cycle (Mehler–Asada)
- **What:** PSI reduces O₂ to superoxide. SOD converts it to H₂O₂, and ascorbate peroxidase converts that to water. Ascorbate is then regenerated with Fd or NAD(P)H. Net effect: water → O₂ at PSII, O₂ → water at PSI, with H⁺ pumped and no NADPH or net O₂ ([Asada 1999](https://doi.org/10.1146/annurev.arplant.50.1.601), Abs).
- **Organisms:** the chemistry occurs in all chloroplasts. In cyanobacteria, most light-driven O₂ reduction runs through FLV instead, without producing ROS ([Helman 2003](https://doi.org/10.1016/S0960-9822(03)00046-0), Abs).
- **Size in C₃ leaves:** small, and contested by method.
  - Isotope (¹⁸O₂) mass spectrometry finds it small. In C₃ and CAM plants it is probably below 10 % ([Badger 2000](https://doi.org/10.1098/rstb.2000.0704)). In tobacco with less Rubisco it was not significant ([Ruuska 2000](https://doi.org/10.1093/jexbot/51.suppl_1.357)).
  - In bean it was absent at high CO₂. At the CO₂ compensation point with 3 % O₂ it carried 30 % of a much smaller linear flow; in maize it was negligible ([Driever & Baker 2011](https://doi.org/10.1111/j.1365-3040.2011.02288.x), Abs).
  - Fluorescence-based estimates are larger: about 15–19 µmol e⁻ m⁻² s⁻¹ of O₂-dependent flow in watermelon ([Miyake & Yokota 2000](https://doi.org/10.1093/pcp/41.3.335), Abs).
- **Controversies:**
  - Its size, which depends on the method.
  - Whether it protects or harms: superoxide made inside the membrane damages PSI itself ([Takagi 2016](https://doi.org/10.1104/pp.16.00246), Abs).
- **Key source:** Badger 2000 (rates); Asada 1999 (mechanism).

### 2.3 Pseudo-cyclic flow via flavodiiron proteins (FLV)
- **What:** an FLVA/FLVB pair takes electrons just after PSI and reduces O₂ straight to water, without ROS. It acts fast and briefly after a light increase.
- **Organisms:** cyanobacteria, green algae, mosses and every non-flowering plant group up to gymnosperms. Angiosperms lost it ([Ilík 2017](https://doi.org/10.1111/nph.14536), Abs; [Chaux 2017](https://doi.org/10.1104/pp.17.00421) and [Traverso 2025](https://doi.org/10.1111/tpj.70052), Abs).
- **Size:**
  - Zero in native angiosperms.
  - In *Chlamydomonas* it "drives most of the photosynthetic electron flow during the induction" (Chaux 2017).
  - In moss it is the main sink for the first seconds ([Gerotto 2016](https://doi.org/10.1073/pnas.1606685113), Abs).
- **Controversies:**
  - Why angiosperms lost it. One hypothesis is that other routes took over ([Alboresi 2019](https://doi.org/10.1111/nph.15372), Abs). Another is that too much FLV costs growth (Traverso 2025, moss).
  - Whether putting it back helps crops. Moss FLV protects PSI in Arabidopsis ([Yamamoto 2016](https://doi.org/10.1038/nplants.2016.12), Abs). In rice it replaced cyclic flow "without competing [with] CO₂ assimilation" ([Wada 2018](https://doi.org/10.1104/pp.17.01335), Abs). In tobacco it competes with cyclic flow ([Rizzetto 2025](https://doi.org/10.1111/ppl.70453)).
  - No field yield data were found (UNVERIFIED that none exist).
- **Key source:** Ilík 2017.

### 2.4 Malate valve
- **What:** thioredoxin-activated NADP-MDH reduces oxaloacetate to malate with NADPH. Malate is exported and reoxidised in the cytosol, mitochondria or peroxisomes. The valve moves reductant out, not ATP in ([Selinski & Scheibe 2019](https://doi.org/10.1111/plb.12869), Meta; [Dao 2022](https://doi.org/10.1016/j.tplants.2021.11.007), Meta).
- **Organisms:** plants and algae (Dao 2022). Diatoms go further and couple plastids to mitochondria to supply ATP ([Bailleul 2015](https://doi.org/10.1038/nature14599), Meta).
- **Size in C₃ leaves:** unknown.
  - *nadp-mdh* knockouts look like wild type, even in high light ([Hebbelmann 2012](https://doi.org/10.1093/jxb/err386), Abs). The valve is therefore small or backed up by other routes.
  - Stromal ATP depends on mitochondria dissipating photosynthetic reductant ([Voon 2018](https://doi.org/10.1073/pnas.1711497115), Abs).
  - Degen 2026 calculates that about 15 % of NADPH would have to be exported (a hypothesis).
- **Controversies:**
  - Its size.
  - Its direction: photorespiration pushes NADH back through the shuttles, and stromal NADPH rises only when glycine decarboxylation runs ([Lim 2020](https://doi.org/10.1038/s41467-020-17056-0), Abs).
- **Key source:** Voon 2018.

### 2.5 Chlororespiration and PTOX
- **What:** in darkness, NDH (in plants) or NDA2 (in *Chlamydomonas*) reduces PQ, and the plastid terminal oxidase (PTOX) passes PQH₂ electrons to O₂, making water. PTOX was found through the variegated *immutans* mutant; it is needed for phytoene desaturation in carotenoid synthesis ([Carol 1999](https://doi.org/10.1105/tpc.11.1.57); [Wu 1999](https://doi.org/10.1105/tpc.11.1.43), Abs).
- **Organisms:** algae and plants, from a cyanobacterial ancestor ([Nawrocki 2015](https://doi.org/10.1146/annurev-arplant-043014-114744), Abs).
- **Size in C₃ leaves:** negligible in light. Its turnover is "very low" compared with photosynthetic flow; its main job is setting the PQ redox state in darkness (Nawrocki 2015). One study reported up to 30 % of PSII flow in salt-stressed *Thellungiella* ([Stepien & Johnson 2009](https://doi.org/10.1104/pp.108.132407), Abs); this is a single-study claim.
- **Controversies:** whether PTOX ever acts as a real sink in stress-tolerant species.
- **Key source:** Nawrocki 2015.

### 2.6 State transitions (STN7)
- **What:** this is an antenna process, not an electron route. A reduced PQ pool activates the STN7 kinase. Phosphorylated LHCII docks on PSI and the TAP38/PPH1 phosphatase reverses it. The process rebalances the two photosystems and so sets how reduced PQ is ([Allen 1981](https://doi.org/10.1038/291025a0), Meta; [Bellafiore 2005](https://doi.org/10.1038/nature03286), Meta; PSI–LHCI–LHCII structure in [Pan 2018](https://doi.org/10.1126/science.aat1156), Abs).
- **Organisms:**
  - Plants and green algae (Stt7 in [Depège 2003](https://doi.org/10.1126/science.1081397)).
  - Red algae and cyanobacteria, which have phycobilisomes and use a different mechanism. The effect was discovered in a red alga and a green alga in 1969 (§3).
- **Size in C₃ leaves:** modest.
  - Mainly loosely bound "L" trimers move ([Galka 2012](https://doi.org/10.1105/tpc.112.100339), Abs).
  - In most natural light, LHCII already serves both photosystems ([Wientjes 2013](https://doi.org/10.1016/j.bbabio.2012.12.009), Abs).
  - Thioredoxin switches STN7 off in high light ([Rintamäki 2000](https://doi.org/10.1073/pnas.180054297), Meta).
  - *stn7* plants lose growth only in fluctuating light ([Grieco 2012](https://doi.org/10.1104/pp.112.206466), Abs).
- **Controversies:**
  - In *Chlamydomonas* the amplitude is large. Whether detached LHCII goes to PSI or is quenched is disputed ([Ünlü 2014](https://doi.org/10.1073/pnas.1319164111) vs [Nawrocki 2016](https://doi.org/10.1038/nplants.2016.31), Abs).
  - The textbook "LHCII moves only under PSII light" is outdated for plants.
- **Key sources:** Wientjes 2013; Grieco 2012.

**Not routes, but students will confuse them:**
- *Photorespiration* is the largest O₂-linked electron sink in C₃ leaves (Badger 2000). It belongs in Lecture 2 and is not the "to O₂" line.
- *Nitrite reduction* is an Fd-dependent sink that may ease the ATP:NADPH mismatch (Noctor & Foyer 1998, Meta).

### Recommendation for the 3-minute BSc slide

Show **three** outlets after PSI, sized for a C₃ leaf. Leave state transitions to L13, where they foreshadow antenna regulation, and leave PTOX to instructor notes.

1. **Linear** (thick, the reference) and **cyclic** (medium; PGR5 main, NDH minor). Spend about 90 s here:
   - the 1.3 vs 1.5 gap, using the corrected figure c footnote;
   - "PGR5 protects PSI";
   - the 2026 debate, using figure h with the PGR5 fix.
2. **To O₂, told as evolution** (thin line, about 45 s):
   - "Algae, mosses and conifers dump electrons on O₂ with FLV; flowering plants lost FLV and rely on PGR5."
   - Mention that FLV has been put back into Arabidopsis, rice and tobacco.
   - This is the most memorable item, and it rests on firm evidence.
3. **Malate valve** (a single word-arrow "spare NADPH exported as malate" in the gap panel, about 15 s). This is the 2026 alternative to cyclic flow for balancing ATP.

Variant c (two bars plus the routes), followed by h (agreed vs debated), already carries this. Only the fixes in §1 are needed.

---

## 3. History stories ("then → now")

New stories only. Arnon 1954 and Mitchell/Jagendorf are in the 23 Oct report; two additions to those are given at the end of this section.

**A. The leaf that breathes O₂ in the light (top pick for L11).**
- **Then:** Mehler showed that illuminated chloroplasts reduce O₂ ([1951](https://doi.org/10.1016/0003-9861(51)90082-3), Meta). With ¹⁸O₂, Mehler & Brown showed that O₂ is made and consumed at the same time ([1952](https://doi.org/10.1016/0003-9861(52)90042-8), Meta). Asada traced the pathway through superoxide ([1974](https://doi.org/10.1016/S0021-9258(19)42815-9), Meta) and ascorbate peroxidase ([Nakano & Asada 1981](https://doi.org/10.1093/oxfordjournals.pcp.a076232), Meta), and named it the water–water cycle (1999).
- **Now:**
  - In flowering-plant leaves the cycle is small (Badger 2000; Driever & Baker 2011).
  - The fast O₂ outlet of cyanobacteria is a different enzyme, FLV, which makes no ROS (Helman 2003). Every non-flowering plant group keeps it; angiosperms lost it (Ilík 2017).
  - Since 2016 it has been put back into Arabidopsis, rice and tobacco (Yamamoto 2016; Wada 2018; Rizzetto 2025).
- **Message:** the fast "electrons to O₂" outlet is a tool of algae, mosses and conifers that flowering plants dropped. What flowering plants keep, the Mehler–Asada cycle, is small.

**B. A pigment voltmeter, and a running argument about voltage (for L10 figure e).**
- **Then:** a light-induced absorption change near 515 nm was seen in *Chlorella* ([Duysens 1954](https://doi.org/10.1126/science.120.3113.353), Meta). Witt's group read it as an electrochromic shift: pigments responding to the membrane field ([Junge & Witt 1968](https://doi.org/10.1515/znb-1968-0222), Meta; the attribution comes from secondary sources).
- **Now:**
  - The signal is used in leaves to split pmf into Δψ and ΔpH (Takizawa 2007: 10–70 % Δψ).
  - The Johnson/Ruban lab shows that much of the steady "Δψ" is overlap from zeaxanthin and quenching signals (Johnson & Ruban 2014; Wilson 2021).
- **Message:** the same 1960s probe is still the tool, and the answer it gives is still argued.

**C. Antenna that changes sides (for L13, or a one-line note at the PQ pool in L11).**
- **Then:** in 1969, independent studies found that light favouring one photosystem shifts excitation to the other: [Bonaventura & Myers](https://doi.org/10.1016/0005-2728(69)90168-6) in *Chlorella* and [Murata](https://doi.org/10.1016/0005-2728(69)90067-x) in the red alga *Porphyridium* (Meta). Allen et al. (1981) tied the shift to LHCII phosphorylation controlled by the redox state of PQ. The kinase was identified in 2003 (Stt7) and 2005 (STN7).
- **Now:**
  - The maize PSI–LHCI–LHCII structure was solved (Pan 2018).
  - In plants, LHCII feeds both photosystems most of the time (Wientjes 2013).
  - The *stn7* mutant suffers only in fluctuating light (Grieco 2012).

**Additions to the 23 Oct stories:**
- **Arnon 1954:** Frenkel reported light-driven phosphorylation in bacterial preparations in the same year ([Frenkel 1954](https://doi.org/10.1021/ja01650a097), Meta).
- **Jagendorf & Uribe 1966:** Hind & Jagendorf had first separated a light stage from a dark ATP-forming stage ([1963](https://doi.org/10.1073/pnas.49.5.715), Meta). This made the acid bath the natural next test of [Mitchell 1961](https://doi.org/10.1038/191144a0).

---

## 4. Latest findings, 2022–2026 (one line each)

- **[Burlacot 2022, Nature](https://doi.org/10.1038/s41586-022-04662-9):** in *Chlamydomonas*, cyclic flow (PGRL1) plus FLV O₂ photoreduction acidify the lumen to power the CO₂-concentrating mechanism. Chloroplast-to-mitochondria electron flow energises carbon transporters.
- **[Penzler 2022, Plant Physiol](https://doi.org/10.1093/plphys/kiac362):** the standard *pgr5-1* line carries second-site mutations and a harmful allele. Read pre-2022 *pgr5* data with care.
- **[Degen 2023, Plant Physiol](https://doi.org/10.1093/plphys/kiad084):** "supercharged" PGR5-dependent cyclic flow keeps ΔpH but cannot protect PSI without ATP-synthase regulation.
- **[Degen & Johnson 2024, Plant Cell](https://doi.org/10.1093/plcell/koae133)** (review): photosynthetic control at b₆f is the PSI safeguard; plants "lack a dedicated rapid-repair cycle" for PSI.
- **[Ermakova 2024, New Phytol](https://doi.org/10.1111/nph.19982):** in *Setaria* bundle-sheath cells, cyclic flow carries 84 % of PSI electrons, mostly via NDH. Extra CO₂ does not rescue *ndhO* mutants.
- **[Traverso 2025, Plant J](https://doi.org/10.1111/tpj.70052):** moss overaccumulating FLV gains no extra protection and grows worse. This is a hypothesis for why angiosperms lost FLV.
- **[Degen 2026, Nat Plants](https://doi.org/10.1038/s41477-026-02374-w) + [N&V](https://doi.org/10.1038/s41477-026-02399-1) vs [Nikkanen 2026, BBA](https://doi.org/10.1016/j.bbabio.2026.149596):** **CONTESTED.** See the box in §1.
- **Preprint, not peer-reviewed:** Degen et al. 2026 bioRxiv, "Loss of PSAE redirects PGRL1 to PSI and enhances PGR5-dependent CET" ([doi](https://doi.org/10.64898/2026.06.04.730083); title only read). It suggests the Johnson lab still treats PGR5 as a cyclic-flow factor.
- **Older but needed to correct L10:** [Wilson 2021, Plant Physiol](https://doi.org/10.1093/plphys/kiab270): ΔpH dominates the steady pmf. **CONTESTED** by the Kramer lab's ECS work.

---

## Unverified or not found

- **In vivo lumen pH sensors:** no peer-reviewed sensor-based lumen pH value for leaves was found for 2022–2026. Only 2024 conference abstracts (Münster) turned up.
- **Pre-1990 primary texts:** the contents of Mehler 1951/1952, Duysens 1954, Junge & Witt 1968, Allen 1981 and Hind & Jagendorf 1963 were checked by metadata only; the story details come from secondary sources.
- **Unread:** the Yadav & Subramanyam 2026 News & Views (behind a paywall).
- **Not found:** field-yield data for FLV crops.
- **Kept off the page:** the figure "≈ 15–20 % of LHCII is mobile in Arabidopsis" was found only in a thesis.

---

## Appendix: Crossref check (26 Oct 2026)

Year as returned by Crossref (print year where given).

| DOI | First author | Year | Journal | Title (as returned, shortened) |
|---|---|---|---|---|
| 10.1126/science.aat4318 | Hahn | 2018 | Science | Structure, mechanism, and regulation of the chloroplast ATP synthase |
| 10.1073/pnas.97.26.14283 | Sacksteder | 2000 | Proceedings of the National Academy of Sciences | The proton to electron stoichiometry of steady-state photosynthesis in living plants: A… |
| 10.1016/j.bbabio.2007.07.006 | Takizawa | 2007 | Biochimica et Biophysica Acta (BBA) - Bioenergetics | The thylakoid proton motive force in vivo. Quantitative, non-invasive probes, energetic… |
| 10.1007/s11120-013-9817-2 | Johnson | 2014 | Photosynthesis Research | Rethinking the existence of a steady-state Δψ component of the proton motive force acro… |
| 10.1093/plphys/kiab270 | Wilson | 2021 | Plant Physiology | Proton motive force in plant photosynthesis dominated by ΔpH in both low and high light |
| 10.1038/s41477-021-00947-5 | Li | 2021 | Nature Plants | Impact of ion fluxes across thylakoid membranes on photosynthetic electron transport an… |
| 10.1073/pnas.1711497115 | Voon | 2018 | Proceedings of the National Academy of Sciences | ATP compartmentation in plastids and cytosol of Arabidopsis thaliana revealed by fluore… |
| 10.1038/35013148 | Seelert | 2000 | Nature | Proton-powered turbine of a plant motor |
| 10.1038/ncomms6439 | Armbruster | 2014 | Nature Communications | Ion antiport accelerates photosynthetic acclimation in fluctuating light environments |
| 10.1038/s41477-026-02374-w | Degen | 2026 | Nature Plants | Disequilibrium between chloroplast proton motive force and ATP levels in Arabidopsis |
| 10.1093/jxb/49.329.1895 | Noctor | 1998 | Journal of Experimental Botany | A re-evaluation of the ATP :NADPH budget during C3 photosynthesis: a contribution from… |
| 10.1016/j.bbabio.2016.02.019 | Turina | 2016 | Biochimica et Biophysica Acta (BBA) - Bioenergetics | Thermodynamics of proton transport coupled ATP synthesis |
| 10.1073/pnas.1202799109 | Petersen | 2012 | Proceedings of the National Academy of Sciences | Comparison of the H + /ATP ratios of the H + -ATP synthases from yeast and from chlorop… |
| 10.1093/plcell/koae133 | Degen | 2024 | The Plant Cell | Photosynthetic control at the cytochrome b 6 f complex |
| 10.1146/annurev-arplant-043015-112002 | Yamori | 2016 | Annual Review of Plant Biology | Physiological Functions of Cyclic Electron Transport Around Photosystem I in Sustaining… |
| 10.1074/jbc.M116.770792 | Strand | 2017 | Journal of Biological Chemistry | The higher plant plastid NAD(P)H dehydrogenase-like complex (NDH) is a high efficiency… |
| 10.1105/tpc.112.097162 | Suorsa | 2012 | The Plant Cell | PROTON GRADIENT REGULATION5 Is Essential for Proper Acclimation of Arabidopsis Photosys… |
| 10.1038/srep20147 | Yamori | 2016 | Scientific Reports | A physiological role of cyclic electron transport around photosystem I in sustaining ph… |
| 10.1093/plphys/kiad084 | Degen | 2023 | Plant Physiology | High cyclic electron transfer via the PGR5 pathway in the absence of photosynthetic con… |
| 10.1111/tpj.14177 | Lima‐Melo | 2019 | The Plant Journal | Consequences of photosystem‐I damage and repair on photosynthesis and carbon use in Ara… |
| 10.1093/plphys/kiac362 | Penzler | 2022 | Plant Physiology | Commonalities and specialties in photosynthetic functions of PROTON GRADIENT REGULATION… |
| 10.3390/cells10112884 | Wada | 2021 | Cells | Identification of a Novel Mutation Exacerbated the PSI Photoinhibition in pgr5/pgrl1 Mu… |
| 10.1073/pnas.102306999 | Joliot | 2002 | Proceedings of the National Academy of Sciences | Cyclic electron transfer in plant leaf |
| 10.1007/s11120-016-0223-4 | Fan | 2016 | Photosynthesis Research | Obstacles in the quantification of the cyclic electron flux around Photosystem I in lea… |
| 10.1098/rstb.2000.0704 | Badger | 2000 | Philosophical Transactions of the Royal Society of London. Series B: Biological Sciences | Electron flow to oxygen in higher plants and algae: rates and control of direct photore… |
| 10.1093/jexbot/51.suppl_1.357 | Ruuska | 2000 | Journal of Experimental Botany | Photosynthetic electron sinks in transgenic tobacco with reduced amounts of Rubisco: li… |
| 10.1111/nph.14536 | Ilík | 2017 | New Phytologist | Alternative electron transport mediated by flavodiiron proteins is operational in organ… |
| 10.1111/j.0031-9317.2004.0222.x | Scheibe | 2004 | Physiologia Plantarum | Malate valves to balance cellular energy supply |
| 10.1104/pp.20.00850 | Yamamoto | 2020 | Plant Physiology | Does the Arabidopsis proton gradient regulation5 Mutant Leak Protons from the Thylakoid… |
| 10.1016/j.bbabio.2026.149596 | Nikkanen | 2026 | Biochimica et Biophysica Acta (BBA) - Bioenergetics | PGR5 is needed for regulation of ATP synthase in plant chloroplasts |
| 10.1038/s41477-026-02399-1 | Yadav | 2026 | Nature Plants | Rethinking ATP balance in photosynthesis |
| 10.1111/nph.19982 | Ermakova | 2024 | New Phytologist | Chloroplast NADH dehydrogenase‐like complex‐mediated cyclic electron flow is the main e… |
| 10.1038/s41586-022-04662-9 | Burlacot | 2022 | Nature | Alternative photosynthesis pathways drive the algal CO2-concentrating mechanism |
| 10.1146/annurev-arplant-043014-114752 | Peltier | 2016 | Annual Review of Plant Biology | NDH-1 and NDH-2 Plastoquinone Reductases in Oxygenic Photosynthesis |
| 10.1038/s41586-021-04277-6 | Shen | 2022 | Nature | Architecture of the chloroplast PSI–NDH supercomplex in Hordeum vulgare |
| 10.1073/pnas.1221194110 | Allahverdiyeva | 2013 | Proceedings of the National Academy of Sciences | Flavodiiron proteins Flv1 and Flv3 enable cyanobacterial growth and photosynthesis unde… |
| 10.1073/pnas.91.21.9794 | Wakasugi | 1994 | Proceedings of the National Academy of Sciences | Loss of all ndh genes as determined by sequencing the entire chloroplast genome of the… |
| 10.1016/j.molcel.2012.11.030 | Hertle | 2013 | Molecular Cell | PGRL1 Is the Elusive Ferredoxin-Plastoquinone Reductase in Photosynthetic Cyclic Electr… |
| 10.1016/S0092-8674(02)00867-X | Munekage | 2002 | Cell | PGR5 Is Involved in Cyclic Electron Flow around Photosystem I and Is Essential for Phot… |
| 10.1038/nature02598 | Munekage | 2004 | Nature | Cyclic electron flow around photosystem I is essential for photosynthesis |
| 10.1146/annurev.arplant.50.1.601 | Asada | 1999 | Annual Review of Plant Physiology and Plant Molecular Biology | THE WATER-WATER CYCLE IN CHLOROPLASTS: Scavenging of Active Oxygens and Dissipation of… |
| 10.1016/S0960-9822(03)00046-0 | Helman | 2003 | Current Biology | Genes Encoding A-Type Flavoproteins Are Essential for Photoreduction of O2 in Cyanobact… |
| 10.1111/j.1365-3040.2011.02288.x | Driever | 2011 | Plant, Cell & Environment | The water–water cycle in leaves is not a major alternative electron sink for dissipatio… |
| 10.1093/pcp/41.3.335 | Miyake | 2000 | Plant and Cell Physiology | Determination of the Rate of Photoreduction of O2 in the Water-Water Cycle in Watermelo… |
| 10.1104/pp.16.00246 | Takagi | 2016 | Plant Physiology | Superoxide and Singlet Oxygen Produced within the Thylakoid Membranes Both Cause Photos… |
| 10.1104/pp.17.00421 | Chaux | 2017 | Plant Physiology | Flavodiiron Proteins Promote Fast and Transient O2 Photoreduction in Chlamydomonas |
| 10.1111/tpj.70052 | Traverso | 2025 | The Plant Journal | Flavodiiron proteins in Physcomitrium patens: navigating the edge between photoprotecti… |
| 10.1073/pnas.1606685113 | Gerotto | 2016 | Proceedings of the National Academy of Sciences | Flavodiiron proteins act as safety valve for electrons in Physcomitrella patens |
| 10.1111/nph.15372 | Alboresi | 2019 | New Phytologist | Balancing protection and efficiency in the regulation of photosynthetic electron transp… |
| 10.1038/nplants.2016.12 | Yamamoto | 2016 | Nature Plants | Artificial remodelling of alternative electron flow by flavodiiron proteins in Arabidopsis |
| 10.1104/pp.17.01335 | Wada | 2018 | Plant Physiology | Flavodiiron Protein Substitutes for Cyclic Electron Flow without Competing CO2 Assimila… |
| 10.1111/ppl.70453 | Rizzetto | 2025 | Physiologia Plantarum | Flavodiiron Protein Activity Outcompetes Cyclic Electron Transport When Expressed in An… |
| 10.1111/plb.12869 | Selinski | 2019 | Plant Biology | Malate valves: old shuttles with new perspectives |
| 10.1016/j.tplants.2021.11.007 | Dao | 2022 | Trends in Plant Science | Physiological functions of malate shuttles in plants and algae |
| 10.1038/nature14599 | Bailleul | 2015 | Nature | Energetic coupling between plastids and mitochondria drives CO2 assimilation in diatoms |
| 10.1093/jxb/err386 | Hebbelmann | 2012 | Journal of Experimental Botany | Multiple strategies to prevent oxidative stress in Arabidopsis plants lacking the malat… |
| 10.1038/s41467-020-17056-0 | Lim | 2020 | Nature Communications | In planta study of photosynthesis and photorespiration using NADPH and NADH/NAD+ fluore… |
| 10.1105/tpc.11.1.57 | Carol | 1999 | The Plant Cell | Mutations in the Arabidopsis Gene IMMUTANS Cause a Variegated Phenotype by Inactivating… |
| 10.1105/tpc.11.1.43 | Wu | 1999 | The Plant Cell | The IMMUTANS Variegation Locus of Arabidopsis Defines a Mitochondrial Alternative Oxida… |
| 10.1146/annurev-arplant-043014-114744 | Nawrocki | 2015 | Annual Review of Plant Biology | The Plastid Terminal Oxidase: Its Elusive Function Points to Multiple Contributions to… |
| 10.1104/pp.108.132407 | Stepien | 2009 | Plant Physiology | Contrasting Responses of Photosynthesis to Salt Stress in the Glycophyte Arabidopsis an… |
| 10.1038/291025a0 | Allen | 1981 | Nature | Chloroplast protein phosphorylation couples plastoquinone redox state to distribution o… |
| 10.1038/nature03286 | Bellafiore | 2005 | Nature | State transitions and light adaptation require chloroplast thylakoid protein kinase STN7 |
| 10.1126/science.aat1156 | Pan | 2018 | Science | Structure of the maize photosystem I supercomplex with light-harvesting complexes I and II |
| 10.1126/science.1081397 | DepèGe | 2003 | Science | Role of Chloroplast Protein Kinase Stt7 in LHCII Phosphorylation and State Transition i… |
| 10.1105/tpc.112.100339 | Galka | 2012 | The Plant Cell | Functional Analyses of the Plant Photosystem I–Light-Harvesting Complex II Supercomplex… |
| 10.1016/j.bbabio.2012.12.009 | Wientjes | 2013 | Biochimica et Biophysica Acta (BBA) - Bioenergetics | LHCII is an antenna of both photosystems after long-term acclimation |
| 10.1073/pnas.180054297 | Rintamäki | 2000 | Proceedings of the National Academy of Sciences | Cooperative regulation of light-harvesting complex II phosphorylation via the plastoqui… |
| 10.1104/pp.112.206466 | Grieco | 2012 | Plant Physiology | Steady-State Phosphorylation of Light-Harvesting Complex II Proteins Preserves Photosys… |
| 10.1073/pnas.1319164111 | Ünlü | 2014 | Proceedings of the National Academy of Sciences | State transitions in Chlamydomonas reinhardtii strongly modulate the functional size of… |
| 10.1038/nplants.2016.31 | Nawrocki | 2016 | Nature Plants | State transitions redistribute rather than dissipate energy between the two photosystem… |
| 10.1016/0003-9861(51)90082-3 | Mehler | 1951 | Archives of Biochemistry and Biophysics | Studies on reactions of illuminated chloroplasts |
| 10.1016/0003-9861(52)90042-8 | Mehler | 1952 | Archives of Biochemistry and Biophysics | Studies on reactions of illuminated chloroplasts. III. Simultaneous photoproduction and… |
| 10.1016/S0021-9258(19)42815-9 | Asada | 1974 | Journal of Biological Chemistry | Univalent Reduction of Molecular Oxygen by Spinach Chloroplasts on Illumination |
| 10.1093/oxfordjournals.pcp.a076232 | Nakano | 1981 | Plant and Cell Physiology | Hydrogen Peroxide is Scavenged by Ascorbate-specific Peroxidase in Spinach Chloroplasts |
| 10.1126/science.120.3113.353 | Duysens | 1954 | Science | Reversible Changes in the Absorption Spectrum of Chlorella upon Irradiation |
| 10.1515/znb-1968-0222 | Junge | 1968 | Zeitschrift für Naturforschung B | On the ion transport system of photosynthesis — Investigations on a molecular level — |
| 10.1016/0005-2728(69)90168-6 | Bonaventura | 1969 | Biochimica et Biophysica Acta (BBA) - Bioenergetics | Fluorescence and oxygen evolution from Chlorella pyrenoidosa |
| 10.1016/0005-2728(69)90067-x | Murata | 1969 | Biochimica et Biophysica Acta (BBA) - Bioenergetics | Control of excitation transfer in photosynthesis I. Light-induced change of chlorophyll… |
| 10.1021/ja01650a097 | Frenkel | 1954 | Journal of the American Chemical Society | LIGHT INDUCED PHOSPHORYLATION BY CELL-FREE PREPARATIONS OF PHOTOSYNTHETIC BACTERIA1 |
| 10.1073/pnas.49.5.715 | Hind | 1963 | Proceedings of the National Academy of Sciences | SEPARATION OF LIGHT AND DARK STAGES IN PHOTOPHOSPHORYLATION |
| 10.1038/191144a0 | Mitchell | 1961 | Nature | Coupling of Phosphorylation to Electron and Hydrogen Transfer by a Chemi-Osmotic type o… |
| 10.64898/2026.06.04.730083 | Degen | 2026 | (preprint/posted content) | Loss of PSAE redirects PGRL1 to photosystem I and enhances PGR5-dependent cyclic electr… |

All 83 DOIs resolved. Crossref lists no retraction or correction notice for any of them.
