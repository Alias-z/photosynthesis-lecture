# Review C: CO₂ recapture and concentration (C7–C10)

Reviewer: Claude, 27 Oct 2026. Scope: `src/pilot/figs/c07.ts`–`c10.ts`. I checked the PLATE text and every figure label in each `VARIANTS` list that makes a factual claim. Context: `c05.ts`, `c06.ts`, `c11.ts`, `c12.ts`, `LECTURE_OUTLINE.md`, `LECTURE_OVERVIEW.md`. I do not repeat 23 Oct findings. Where a 23 Oct finding is still not applied, it appears as "open (23 Oct)".

**Method.** I checked every DOI on Crossref, including `updated-by`. None of the works cited here has a correction or retraction notice (Appendix A). Abstracts come from Europe PMC; full texts from PMC where noted.

**Evidence levels.** FT = full text read. Abs = abstract. Meta = Crossref metadata only. TB = textbook consensus or my own arithmetic.

**Verdicts.** OK / imprecise / contradicted / outdated.

---

## Top fixes

1. **C8 overstates C₂.** "Decarboxylated **only** in the bundle sheath" and "refixed **instead of escaping** the leaf" both claim too much.
   - In M. arvensis, GDC activity is 7.5-fold enriched in the bundle sheath (BS) and glycine is decarboxylated "predominantly" there (Rawsthorne 1988b).
   - C₂ species allocate 85–86 % of GDC to the BS, not 100 % (Leung 2024; Alvarenga 2025).
   - Give the size of the effect instead: the shuttle raises chloroplast CO₂ about 3-fold (Keerberg 2014, Abs).
2. **C7 grass evidence is partly contradicted.** C7 point 3 says "close veins first", and figure C7f labels BEP "veins far apart". Christin 2013 (FT) says otherwise:
   - The enabler is a large bundle sheath (> 15 % of leaf tissue), which comes from close bundles plus large BS cells.
   - Bundles moved closer **before** the BEP–PACMAD split. BEP then lost BS cell size.
   - So the BEP/PACMAD difference is BS cell size, not vein spacing.
3. **C9 numbers need scope.**
   - "About 5 ATP + 2 NADPH per CO₂" assumes no leakage. At the measured leakiness of 0.2–0.3 the cost is 5.5–5.9 ATP (Wang 2022; Tazoe 2008; arithmetic).
   - "Evolved 61 times" understates the count. Sage 2016 gives 61 principal lineages, with ancillary origins possible in 12 of them. Sage 2012 says ≥ 66, and recent papers say "> 60". Write "> 60 times".
4. **C8f mislabels C\*.** Leung's C\* is the CO₂ compensation point **without respiration** (≈ Γ\*), not "the CO₂ compensation point" Γ. The difference matters because C11 separates Γ and Γ\*.
   - The block never defines Γ, yet C8 and C9 compare compensation points.
   - Define Γ once and give the classic values: C₃ ≥ 40, C₂ ≈ 12–26, C₄ ≤ 10 µl l⁻¹ (Krenzer 1975, Abs).
5. **Order (§5).**
   - Teach C11 (gas exchange, stomata, Γ) and C12 (C₃ A–Ci curve) **before** C₂/C₄/CAM.
   - Fold C7 into C8.
   - Put CAM after C₄, folded or as 1 min.
   - Move C12's C₃-vs-C₄ curve and the FACE line into C9.
   - Two things the block uses are never taught: leaf anatomy (mesophyll, bundle sheath, Kranz) and the fact that PEPC uses HCO₃⁻ and ignores O₂.

---

## §1 Claim check

### C7 Evolution often begins with CO₂ recapture

| # | Where | Claim | Verdict | Evidence | Suggested wording |
|---|---|---|---|---|---|
| 1 | Lead | A leaf can refix released CO₂; a rearranged BS starts some routes to C₄ | OK | Sage 2012 (Abs): moving mitochondria into the BS is "one of the earliest steps" | — |
| 2 | Point 1; fig. b "all CO₂ released by mitochondria" | Rice and wheat refix 24–38 % of the CO₂ their mitochondria release | Imprecise | Busch 2013 (Abs): "24–38 % of photorespired **and respired** CO₂ … reassimilated within the cell". C11 says R_L sources are debated and not only mitochondrial. The paper also gives a usable number: photosynthesis is 8–11 % higher at ambient CO₂ | "Rice and wheat refix 24–38 % of their photorespired and respired CO₂ (+8–11 % photosynthesis)." Fig. b: "all photorespired + respired CO₂" |
| 3 | Point 2; fig. c "more, larger, on the vein side" | Proto-Kranz Flaveria: BS mitochondria and chloroplasts cluster by the veins; may help refixation slightly | OK; "larger" is too broad in fig. c | Sage TL 2013 (Abs): more mitochondria and chloroplasts, **larger mitochondria**, more organelles on the inner periphery; Γ "slightly lower", refixation offered as a possible cause. Chloroplast size is not in the abstract | Fig. c: "more organelles, larger mitochondria, on the vein side" |
| 4 | Point 3 | Grass C₄ needed close veins first | Imprecise | Christin 2013 (FT): evolvability rises when BS > 15 % of leaf tissue (short BS distance **and** large BS cells). Distance shrank before the BEP–PACMAD split; BEP (Bambusoideae, Pooideae) have "very small" BS cells | "Grass C₄ arose only where the bundle sheath was already large." |
| 5 | Fig. f labels | BEP "veins far apart, small bundle sheath, 0 origins"; PACMAD "veins close, large bundle sheath, 22–24" | Contradicted ("veins far apart"); counts OK | Christin 2013 (FT), as in row 4 | BEP: "small bundle-sheath cells"; PACMAD: "large bundle-sheath cells (> 15 % of leaf)" |
| 6 | Point 3 "C₂ also persists in its own right"; fig. e "C₂ persists" | C₂ is a stable strategy | OK, but weakly cited. Open (23 Oct): Walsh 2023 not added | The Lundgren & Christin 2017 abstract frames C₃–C₄ lineages as a **bridge** to C₄. Stronger support: C₂ evolved ≥ 5 times in Brassicaceae, which has no C₄ species (Triesch 2024, Abs); stress-resilience hypothesis (Walsh 2023, Abs) | Cite Triesch 2024 + Walsh 2023 |
| 7 | Fig. a, d, g, h, i, j | Schematic labels ("glycine split only in sheath", "CO₂ meets chloroplasts first", "more paths covered, more refixed") | OK as schematics | Fig. h matches Busch's mechanism (a chloroplast layer blocks CO₂ exit) better than proto-Kranz | — |
| 8 | Slide uses "proto-Kranz" | Kranz is never defined | Open (23 Oct) | — | Define at first use (§2) |

### C8 C₂ photosynthesis moves CO₂ release

| # | Where | Claim | Verdict | Evidence | Suggested wording |
|---|---|---|---|---|---|
| 1 | Lead; fig. a "mitochondrion: no GDC" | Glycine is decarboxylated **only** in the BS | Imprecise | Rawsthorne 1988b (Abs): GDC 7.5-fold enriched in the BS; mesophyll has "only a low capacity"; decarboxylation is "predominantly" in the BS. Leung 2024 (Abs): 86 % (C₂) and 30 % (sub-C₂) of GDC in the BS. Alvarenga 2025 (Abs): > 85 % | "…is decarboxylated mainly in the bundle sheath, releasing CO₂ next to Rubisco." |
| 2 | Point 1; fig. e | Immunogold found GDC only in BS mitochondria of C₃–C₄ intermediates | OK (historical result) | Rawsthorne 1988a; Hylton 1988 (Abs): four genera, plus C₄ species | — |
| 3 | Point 2 | Released beside Rubisco, the CO₂ is refixed **instead of escaping** the leaf | Imprecise (all-or-nothing) | Keerberg 2014 (Abs): C₂ raises chloroplast CO₂ about 3-fold in F. pubescens vs C₃ | "The glycine shuttle raises CO₂ at sheath Rubisco about 3-fold." |
| 4 | Point 3; fig. j | In Brassicaceae, C₂ reuses a BS GDC switch already present in C₃ | OK | Dickinson 2025 (FT): a MYC–MYB module drives BS expression of GLDP1 in Arabidopsis **and** in C₃ and C₂ Moricandia. In C₂ M. arvensis, transposon insertion disrupted the mesophyll M-box (Triesch 2024, Abs) | Fig. j footer "mechanism shown mainly in Arabidopsis" undersells it: write "shown in Arabidopsis and Moricandia". Optional label: "mesophyll switch broken by a transposon" |
| 5 | Fig. f titles | "CO₂ compensation point at 42 °C · C\*" | Imprecise | Leung 2024 (Abs): C\* is "the photosynthetic CO₂ compensation point in the absence of respiration". Values 73 / 55 / 21 and GDC 11 / 30 / 86 % are correct | "CO₂ compensation point without respiration (C\*), 42 °C" |
| 6 | Fig. h | "Traits accumulate one at a time" | Imprecise | Williams 2013 (Abs): "the order of C₄ trait acquisition is flexible". Roberts 2026 (Abs): C₂ and C₄ Alternanthera use different traits to improve mesophyll–BS connectivity | "Traits accumulate stepwise, in different orders" |
| 7 | Fig. h | "more, larger sheath organelles" | Imprecise (minor) | Sage TL 2013 (Abs): larger mitochondria | "more organelles, larger mitochondria" |
| 8 | Fig. h | "All four forms occur in Blepharis" | OK | Stata 2025 (Abs): C₃, proto-Kranz, C₂, C₄-like, C₄ | — |
| 9 | Fig. c, i | "4 C → 3 C + CO₂"; serine back, NH₃ released and recycled | OK | TB; Walsh 2023 and Mallmann 2014 on NH₃ | — |

### C9 C₄ photosynthesis concentrates CO₂ for Rubisco

| # | Where | Claim | Verdict | Evidence | Suggested wording |
|---|---|---|---|---|---|
| 1 | Lead | PEPC first fixes carbon into C₄ acids, which release CO₂ around BS Rubisco | OK, but omits the reason it works | PEPC fixes HCO₃⁻, not CO₂ (von Caemmerer 2021, FT), and is "oxygen-insensitive" (Sun 2026, Abs) | "…PEPC, which uses HCO₃⁻ and does not react with O₂, first fixes carbon into C₄ acids…" |
| 2 | Point 1; fig. d | Sugarcane: > 93 % of ¹⁴C in C₄ acids after ≈ 1 s; label first on C-4, later in 3-PGA and sugars | OK | Hatch & Slack 1966 (Abs): "more than 93 %" in malate, aspartate and oxaloacetate; first label in C-4 of the acids and C-1 of 3-PGA | — |
| 3 | Point 2 | PEP regeneration 2 ATP per CO₂; about 5 ATP + 2 NADPH per CO₂ fixed | Imprecise (holds only at zero leakage) | 2 ATP per cycle, 2 of 5 ATP in the mesophyll (von Caemmerer 2021, FT). Leakiness φ ≈ 0.2 at steady state in maize and sorghum, > 0.35 during induction (Wang 2022, Abs); ≈ 0.3 in Amaranthus above 200 µmol m⁻² s⁻¹ (Tazoe 2008, Abs). Cost = 3 + 2/(1−φ) = 5.5–5.9 ATP (TB) | "PEP regeneration costs 2 ATP per CO₂ pumped: ≥ 5 ATP + 2 NADPH per CO₂ fixed (≈ 5.5–6 with typical 20–30 % leakage)." |
| 4 | Fig. e | Break-even ≈ 0.33 oxygenations per carboxylation; "C₄, no leakage" | OK as labelled (arithmetic checked) | With φ = 0.2–0.3 the break-even moves to 0.40–0.44 (TB) | Optional dashed line "C₄, 20–30 % leakage" |
| 5 | Point 3 title; fig. j alt text | "evolved 61 times" | Imprecise | Sage 2016 (Abs): 61 principal lineages, "ancillary C₄ origins possible in 12". Sage 2012 (Abs): "at least 66". Christin 2013: "more than 62". Swift 2024, Hua 2025, Sun 2026: "> 60" | "A trade-off that evolved > 60 times." |
| 6 | Point 3 | About 8,100 C₄ species | OK, still the newest count | Sage 2016 (Abs): ~8,100 (5,044 grasses, 1,322 sedges, 1,777 eudicots). I found no newer species count (Europe PMC search, 2020–2026) | — |
| 7 | Point 3 | Incl. maize and sugarcane, they do one-fifth of land photosynthesis | OK | Luo 2024 (Abs): 19.5 % of global (land) photosynthetic assimilation; C₄ cover fell 17.7 → 17.1 % (2001–2019). Lavergne 2026 (Abs, model): C₄ share of biomass fell from ~16 % to 12 % (1982–2016) | — |
| 8 | Fig. j rows | Maize PEPC in rice < 2.1 % of in vitro; five enzymes: PEPC flux ×10, ≈ 2 % of maize; more sheath organelles; C₄-like vein pattern; little C₄-acid flux into the CBC | OK | Om 2026, Ermakova 2021, Lin 2020, Wang 2017 (Abs); Dong 2023 (Meta: title only) | — |
| 9 | Fig. b | "Kranz = wreath"; veins close together | OK | TB | Promote this definition to the first slide that says "proto-Kranz" |
| 10 | Fig. f | "C₄ suppresses oxygenation; it does not abolish it" | OK | TB; leakage (row 3) | — |
| 11 | Fig. h meter | CO₂ around BS Rubisco rises C₃ < C₂ < C₄ (schematic 1 : 3 : 6) | OK as schematic | C₂ ≈ 3× (Keerberg 2014, Abs). C₄ BS inorganic carbon 160–990 µM, mostly CO₂ (Furbank & Hatch 1987, Abs), against ≈ 13 µM CO₂ in air-equilibrated water at 25 °C (TB, Henry's law) | Can be made semi-quantitative; see Unverified |
| 12 | Fig. c, i | Bus analogy; "Net: CO₂ (mesophyll) + 2 ATP → CO₂ (BS)"; "The pump fixes no net carbon" | OK | TB | — |

### C10 CAM separates carbon capture in time

| # | Where | Claim | Verdict | Evidence | Suggested wording |
|---|---|---|---|---|---|
| 1 | Lead; point 1 | Night: CO₂ fixed by PEPC, stored as malic acid in the vacuole | OK | Black & Osmond 2003 (Abs) | — |
| 2 | Point 2; fig. a, c, d, f | Day: stomata closed; malate releases CO₂ to the Calvin–Benson cycle | Imprecise (minor) | Black & Osmond 2003 (Abs): "in mid to late afternoon the stomata can open and mostly C₃ photosynthesis occurs" (phase IV). The same abstract gives the concentrating effect: internal CO₂ reaches 0.2–2.5 % during decarboxylation | "Day: Rubisco works behind closed stomata for most of the day; leaf CO₂ rises to 0.2–2.5 %." |
| 3 | Point 3 | "C₄ chemistry, separated in time" | Imprecise wording | CAM did not derive from C₄; both use PEPC, then Rubisco (Ludwig 2024, Abs) | "Same PEPC-then-Rubisco chemistry as C₄, separated in time." |
| 4 | Point 3 | CAM saves water | OK | Yang 2023/24 (Abs): WUE "much higher" than C₃ or C₄. Borland 2009 (Abs): CAM crops give similar yields with about 20 % of the water | — |
| 5 | Fig. i | Portulaca: C₄ by day, CAM at night under drought, same cells; acid probably feeds C₄ | OK | Moreno-Villena 2022 (Abs). Gilman 2022 (Abs): a weak CAM cycle runs constitutively and is upregulated in drought. Koch & Kennedy 1980 (Abs): night acid mostly from refixed respiratory CO₂ | Optional: "night acid mostly from respired CO₂" |
| 6 | Fig. h | "succulent CAM plant, thick leaf, large cells"; "malic acid: 4 carbons" | OK | TB | — |
| 7 | Whole slide | Scale of CAM missing | Open (23 Oct): ≥ 66 origins, ~7 % of vascular species (Gilman 2023) | — | — |
| 8 | Refs | "Yang et al. 2024" | OK | Crossref: online 5 Dec 2023; PMC: issue 2024, 16(4) | — |

---

## §2 Missing topics

| Rank | Topic | One line | Slot | Source |
|---|---|---|---|---|
| Must | Leaf anatomy: mesophyll, bundle sheath, Kranz | Nothing before C7 shows what a bundle sheath is, yet C7–C9 depend on it. Open (23 Oct) for Kranz | First panel of merged C7/C8 (reuse the C9b zoom) | Hylton 1988; Christin 2013 (FT); TB |
| Must | PEPC uses HCO₃⁻ and ignores O₂ | This is why a C₄ pump can work at all | C9 lead | von Caemmerer 2021 (FT); Sun 2026 (Abs) |
| Must | CO₂ compensation point Γ as the yardstick | C₃ ≥ 40, C₂ ≈ 12–26, C₄ ≤ 10 µl l⁻¹. The two misfits in Krenzer's survey (Moricandia arvensis 26; Panicum milioides 12–20) were C₂ plants | Define in C11 (if moved earlier) or C8; values on C9 | Krenzer 1975 (Abs) |
| Must | How much C₂ concentrates | ≈ 3-fold chloroplast CO₂ | C8 point 2 | Keerberg 2014 (Abs) |
| Must | Why C₄ wins where it is hot, bright, dry or low in CO₂ | At 30 °C, C₃ and C₄ quantum yields were already equal (0.052 vs 0.053); C₃ falls further as it warms. The first grass C₄ arose 32–25 Mya with falling CO₂; C₄ grasslands spread 3–8 Mya. Rising CO₂ is now shrinking C₄ grass cover. Open (23 Oct) in part | C9 point 3 (fig. e already shows the ATP crossover) | Ehleringer & Björkman 1977; Christin 2008; Edwards 2010; Luo 2024 (all Abs) |
| Must (one line) | Algal and cyanobacterial CCMs | Cyanobacteria and algae do about half of Earth's CO₂ fixation, using biophysical CCMs (carboxysome, pyrenoid). Open (23 Oct) | Opener of the CCM block or C9 Context | Hennacy & Jonikas 2020 (Abs); Field 1998 (Abs) |
| Nice | δ¹³C fingerprint | Two plant groups: −24 to −34 ‰ (C₃) and −6 to −19 ‰ (C₄); CAM spans the range, set by the day/night share of fixation. Open (23 Oct) | C9 Context | Smith & Epstein 1971 (Abs); Cernusak 2013 (Abs); Jahren & Schubert 2026 (Abs) |
| Nice | CAM scale | ≥ 66 origins, ~7 % of vascular species; strong CAM arose in 46 of 48 clades in the last 30 Myr. Open (23 Oct) | C10 or the C9 fold | Gilman 2023; Sage 2023 (Abs) |
| Nice | Leakiness | 20–30 % of pumped CO₂ leaks back; worse in low light and induction | C9 point 2 | Wang 2022; Tazoe 2008 (Abs) |
| Nice | Single-cell C₄ | Kranz is not essential (Suaeda/Borszczowia aralocaspica) | C9 footnote | Voznesenskaya 2001 (Abs) |
| Nice | Why C₂ leads to C₄ | NH₃ released in the BS unbalances nitrogen between cells; parts of a C₄ cycle fix it | C8 Context | Mallmann 2014; Tang 2024 (Abs) |
| Nice | CAM phases | Phase IV: afternoon stomata open, direct C₃ fixation | C10 Context | Black & Osmond 2003 (Abs); Osmond 1978 (Meta) |

---

## §3 History stories ("then → now")

The 23 Oct list already holds Hatch & Slack → C₄ rice, Rawsthorne → Dickinson, Koch & Kennedy → Moreno-Villena, and FACE → Reich. The stories below are new angles.

| # | Then (primary) | Now | Why it works |
|---|---|---|---|
| 1 | **Morning-sour leaves.** In India, Benjamin Heyne tasted Bryophyllum (*Cotyledon calycina*) leaves that were acid in the morning and bland by afternoon (Trans Linn Soc 11:213–215; dated 1815, Crossref prints 1816; Meta). Black & Osmond 2003 (Abs) trace the acid taste to Roman times. Malic acid and starch were identified 1940–1954, and CAM was "rigorously outlined" by about 1980 | Synthetic "CAM-like" rice stores malate at night and gives ≈ +20 % yield over two field years, but **no** gain in WUE or drought tolerance (Wu 2025, Abs). SynCAM programmes (Lim 2025). A weak CAM cycle in a C₄ crop "might be possible" (Ferrari 2026, Abs) | A taste test becomes engineering. We can copy the night chemistry, but not yet the water saving. Fits the C10 animation |
| 2 | **The plants that did not fit.** Krenzer, Moss & Crookston 1975 measured Γ in several hundred species. Almost all fell into ≥ 40 or ≤ 10 µl l⁻¹; only *Moricandia arvensis* (26) and *Panicum milioides* (12–20) did not (Abs). Kennedy & Laetsch 1974 had already reported the first intermediate, *Mollugo verticillata* (Abs) | Graded C\* in *Tribulus*, 73 → 55 → 21 (Leung 2024). C₂ arose ≥ 5 times in Brassicaceae, which has no C₄ species (Triesch 2024). A transposon broke the mesophyll switch (Triesch 2024; Dickinson 2025, FT) | Teaches Γ and "C₂ is a state of its own" with one bar chart. A new angle on the 23 Oct GDC story |
| 3 | **Two kinds of carbon.** Smith & Epstein 1971 and Bender 1971: plants fall into two δ¹³C groups, −24 to −34 ‰ and −6 to −19 ‰ (Abs; Bender Meta) | δ¹³C of 92 herbarium specimens shows C₂–C₄ variation within *Blepharis* species (Stata 2025, Abs). C₃/C₄ shifts change the δ¹³C of atmospheric CO₂ (Lavergne 2026, Abs) | Introduces the δ¹³C fingerprint and shows that a 1971 tool still drives discovery |

**Reserves**
- Badger, Kaplan & Berry 1980: *Chlamydomonas* concentrates CO₂ up to 40-fold (Abs). Now: α-carboxysomes from 9 genes in tobacco chloroplasts support growth, but only at elevated CO₂ (Chen 2023, Abs). A proto-pyrenoid formed in Arabidopsis (Atkinson 2020, Abs).
- Hibberd, Sheehy & Langdale 2008: rice yields must rise ≥ 50 % by 2050, and C₄ is "50 %" more efficient (Abs). Now: maize PEPC works at < 2.1 % in planta (Om 2026). The promise against the status; partly overlaps 23 Oct #5.
- Kortschak, Hartt & Burr 1965 (Meta): already cited in fig. C9d. The details of their earlier sugarcane work are UNVERIFIED.
- **Naming of CAM.** The brief credits Ranson & Thomas (1960) with the name. Thomas 1949 already has "crassulacean acid metabolism" in its title (New Phytol 48:390, Meta). Ranson & Thomas 1960 is the first Annual Review under that title (Meta). Do not credit 1960 with the name.

---

## §4 Latest findings (2022–2026)

**C₂ and C₄ evolution**
- **Solid.** C₄ bundle-sheath genes gained an ancestral DOF cis-code already present in C₃ rice (Swift 2024, Nature).
- **Solid.** BS cells of two independent C₄ dicots share a C₃-mesophyll expression pattern and conserved DOF/C2H2 factors (Sun 2026, New Phytol).
- **Solid.** A short rice regulatory module drives BS expression; oligomers raise it up to 220-fold (Hua 2025).
- **Solid.** *Flaveria* genomes point to transcriptional regulation as the main driver of C₄ evolution (Lyu 2025).
- **Solid.** A MYC–MYB module patterns GLDP1 to the BS in C₃ and C₂ Brassicaceae (Dickinson 2025, FT). Transposon insertions shifted GLDP1 expression in ≥ 5 independent C₂ origins (Triesch 2024).
- **Solid.** Single-nucleus atlas of *M. arvensis*: the BS takes on photorespiratory, ammonium-assimilation and transport genes (Triesch 2025).
- **Solid.** Graded C₂ in *Tribulus* (Leung 2024) and in the grass *Homolepis*, where a sub-C₂ species is of hybrid origin (Alvarenga 2025).
- **Solid.** Mesophyll–BS connectivity rises stepwise from C₃ to C₂ to C₄, through different traits in C₂ (vein density) and C₄ (plasmodesmata) (Roberts 2026).
- **Solid, single study.** α-ketoglutarate and Fd-GOGAT link the C₂ → C₄ switch in *Flaveria* (Tang 2024).
- **Solid, single study.** Low CO₂ induces C₄-like traits in a C₃–C₄ *Flaveria*; inducible cyclic electron transport may be a precondition (Wang 2026).
- **Preprint.** Gene gains at the base of PACMAD, including β-carbonic anhydrase, as C₄ precursors (Pereira 2025, bioRxiv).
- **Preprint.** Modelling supports C₃–C₄ intermediacy as a stable state (Machado 2026).

**Global scale**
- **Solid.** C₄ cover fell 17.7 → 17.1 % of land (2001–2019); C₄ gives 19.5 % of GPP (Luo 2024).
- **Solid (model).** C₄ share of biomass fell from ~16 % to 12 % (1982–2016) (Lavergne 2026).

**Engineering**
- **Solid.** In rice, maize PEPC runs at < 2.1 % of its in vitro activity, held back by malate inhibition and light activation (Om 2026).
- **Solid, single study.** β-carboxysome parts formed carboxysome-like compartments in rice chloroplasts; lines carrying cyanobacterial Rubisco grew and yielded less (Sidhu 2025).
- **Solid.** α-carboxysomes in tobacco support autotrophic growth at elevated CO₂, not in air (Chen 2023; earlier Long 2018).
- **Solid.** Hornworts, the only land plants with a pyrenoid CCM, share core *Chlamydomonas* components (Robison 2025).
- **Contested.** A pyrenoid CCM could triple chloroplast fixation at 1.3 ATP per CO₂ (Fei 2022, model). Reaction–diffusion modelling instead finds it costs more than photorespiration unless Ci is low (Kaste 2024, preprint).
- **Solid (E. coli and in vitro only).** The THETA cycle: 17 enzymes, built around crotonyl-CoA carboxylase/reductase and **PEPC**. Successor to CETCH (Schwander 2016). A "now" hook: PEPC is a top enzyme for synthetic CO₂ fixation (Luo S 2023; Abs from Crossref).

**CAM**
- **Solid.** *Portulaca* runs a weak CAM cycle constitutively and upregulates it in drought (Gilman 2022). ABA promotes CAM and cytokinin represses it (Ferrari 2022).
- **Solid, single study.** Salinity also induces CAM in two *Portulaca* species; they revert to C₄ within 1–2 weeks (Bakpa 2026).
- **Solid.** Strong CAM appeared in the last 30 Myr in 46 of 48 clades, after CO₂ fell (Sage 2023).
- **Solid but not CAM.** "CAM-like" rice gives +20 % yield with no WUE gain (Wu 2025; 23 Oct).
- **Contested.** C₄ genes are expressed in wheat-grain tissues (spatial transcriptomics), but no C₄ flux has been shown (Millsteed 2026).

---

## §5 Order notes

**What C7–C10 need before them**
- **Present.** Rubisco oxygenation rises with temperature (C5), and the photorespiratory costs (C4, C6).
- **Present in figures only.** C6 must name GDC in its PLATE text, because C8 is built on it. Write "In mitochondria, glycine decarboxylase (GDC) turns two glycine into…".
- **Never taught.** Leaf anatomy: mesophyll, bundle sheath around veins, Kranz.
- **Taught too late.**
  - Stomata trade CO₂ for water (C11). C₄'s water-use advantage and all of CAM depend on it.
  - The CO₂ compensation point Γ (C11 shows only the light compensation point). C8 and C9 compare compensation points.
  - The C₃ A–Ci curve (C12). C₄'s signature is a curve that saturates at low Ci.

**Recommended order (keeps the lecturer's C₃ → C₂ → C₄ narrative)**

C5 → C6 → **C11** (gas exchange, A = gs(Ca − Ci), Γ) → **C12** (FvCB, C₃ only) → C7 + C8 merged (C₂) → C9 (C₄) → C10 CAM (fold or 1 min) → C13.

- **Why.** FvCB is a C₃ model. It follows naturally from photorespiration, because Γ\* is set by oxygenation. With it in place, the C₂ and C₄ slides can quantify their gain (Γ, Ci, curve shape) instead of only describing it.
- **What moves.** Move C12's "C₃ vs C₄" variant and the FACE point (C₃ +18 %, C₄ only in drought; Reich reversal) into C9 point 3, where they show that C₄ is a trade-off. Put Luo 2024's shrinking C₄ grass cover beside them.
- **Bridge.** Bridge the 7-min gap between C6 and C₂ with one recall line on the merged C7/C8: "remember: glycine → CO₂ in mitochondria".
- **Cost.** The lecture no longer ends on the FvCB link to Lecture 1's electron transport (J). C13 "leaf to loaf" can carry that closure instead.
- **Fallback (smaller change).** Move only C11 before C7 and keep C12 last, recast as "what limits each leaf type: C₃ vs C₄ curves". This puts stomata and Γ in place but leaves a C₃ model after C₄.

**C7 into C8: yes**
- C7 is the premise of C8, and both carry the same anatomy figures.
- Merged slide:
  - Panel 1: anatomy, and C₃ already refixes 24–38 %.
  - Panel 2: proto-Kranz.
  - Panel 3: GDC moves to the BS.
- Move "C₂ persists" (Triesch 2024) to the merged slide's third point.
- Busch 2013 uses a different mechanism (mesophyll chloroplasts block exit). It can also close C6 as one line.

**Where CAM belongs**
- Place CAM after C₄: it reuses PEPC and C₄ acids.
- Its driver is water, not photorespiration, so it sits off the C₃ → C₂ → C₄ axis and closes the block.
- If removed, keep one line on C9: "CAM: same chemistry, separated in time; saves water; ≥ 66 origins".

**Ideas repeated across slides (pick one home each)**
- **GDC equation** (2 glycine → serine + CO₂ + NH₃): C6 point 1 and fig. i; C8 fig. a, c, i. Keep it in C6; in C8 say "same reaction, new place".
- **Same-anatomy comparisons:** C7a (four leaves), C8b (C₃ vs C₂), C8h (four leaves), C9h (three leaves). Use one master figure (C8h or C9h) and build it up slide by slide.
- **Glycine shuttle:** drawn in C7i and C8a.
- **"Cousins, not ancestors":** C7e and C8h.
- **PEPC cycle:** C9a, c, g, i and C10b.
- **"Space vs time":** C10b and C10i, and it "also fits C09".
- **C₃ vs C₄ CO₂ response:** C12g and C12h depend on C9; see the move above.

**Where each missing topic sits:** see the Slot column in §2.

---

## Appendix A: Crossref register

All DOIs were checked on 27 Oct 2026. `updated-by` is empty for every one: no correction, erratum or retraction is listed. Some records carry only "has-preprint" relations, which are not corrections.

| DOI | First author | Year | Journal | Title (short) | updated-by |
|---|---|---|---|---|---|
| 10.1111/j.1365-3040.2012.02567.x | Busch | 2013 | Plant Cell Environ 36:200 | C₃ plants reassimilate photorespired and respired CO₂ | none |
| 10.1104/pp.113.221119 | Sage TL | 2013 | Plant Physiol 163:1266 | Initial events … C₄ evolution in C₃ Flaveria | none |
| 10.1073/pnas.1216777110 | Christin | 2013 | PNAS 110:1381 | Anatomical enablers … grasses | none |
| 10.1093/jxb/erw451 | Lundgren | 2017 | J Exp Bot 68:241 | C₃–C₄ lineages bridge the ecological gap | none |
| 10.1007/BF00401016 | Rawsthorne | 1988 | Planta 173:298 | Immunogold … Moricandia | none |
| 10.1007/BF00397660 | Rawsthorne | 1988 | Planta 176:527 | Distribution of photorespiratory enzymes … M. arvensis | none |
| 10.1007/BF00393064 | Hylton | 1988 | Planta 175:452 | GDC confined to BS of C₃–C₄ intermediates | none |
| 10.1111/pce.15069 | Leung | 2024 | Plant Cell Environ 47:3541 | Tribulus … C₂ and C₄ | none |
| 10.1038/s44319-025-00461-1 | Dickinson | 2025 | EMBO Rep 26:3024 | TF module mediating C₂ in Brassicaceae | none |
| 10.1111/plb.13601 | Triesch | 2024 | Plant Biol 26:270 | Transposable elements … glycine shuttle | none |
| 10.1093/jxb/eraf245 | Triesch | 2025 | J Exp Bot 76:5129 | Single-nuclei sequencing of M. arvensis | none |
| 10.1093/jxb/eru239 | Keerberg | 2014 | J Exp Bot 65:3649 | C₂ … 3-fold elevated leaf CO₂ | none |
| 10.1042/bj1010103 | Hatch | 1966 | Biochem J 101:103 | Photosynthesis by sugar-cane leaves | none |
| 10.1104/pp.40.2.209 | Kortschak | 1965 | Plant Physiol 40:209 | CO₂ fixation in sugarcane leaves | none |
| 10.1093/jxb/erab266 | von Caemmerer | 2021 | J Exp Bot 72:6003 | Updating the steady-state C₄ model | none |
| 10.1111/nph.18485 | Wang Y | 2022 | New Phytol 236:1661 | Leakiness during induction | none |
| 10.1093/pcp/pcm160 | Tazoe | 2008 | Plant Cell Physiol 49:19 | Quantum yield … leakiness, Amaranthus | none |
| 10.1104/pp.85.4.958 | Furbank | 1987 | Plant Physiol 85:958 | Inorganic carbon pool in BS cells | none |
| 10.1093/jxb/erw156 | Sage RF | 2016 | J Exp Bot 67:4039 | Portrait of the C₄ family | none |
| 10.1146/annurev-arplant-042811-105511 | Sage RF | 2012 | Annu Rev Plant Biol 63:19 | Photorespiration and the evolution of C₄ | none |
| 10.1038/s41467-024-45606-3 | Luo X | 2024 | Nat Commun 15:1219 | Global distribution of C₄ vegetation | none |
| 10.1038/s43247-025-03102-6 | Lavergne | 2026 | Commun Earth Environ 7:93 | Decline in C₄ abundance … isotopes | none |
| 10.1104/pp.56.2.194 | Krenzer | 1975 | Plant Physiol 56:194 | CO₂ compensation points of flowering plants | none |
| 10.1126/science.184.4141.1087 | Kennedy | 1974 | Science 184:1087 | Species intermediate for C₃, C₄ | none |
| 10.1104/pp.47.3.380 | Smith | 1971 | Plant Physiol 47:380 | Two categories of ¹³C/¹²C ratios | none |
| 10.1016/s0031-9422(00)84324-1 | Bender | 1971 | Phytochemistry 10:1239 | ¹³C/¹²C ratios and pathway | none |
| 10.1111/nph.12423 | Cernusak | 2013 | New Phytol 200:950 | Determinants of carbon isotope discrimination | none |
| 10.1111/nph.71413 | Jahren | 2026 | New Phytol 251:2349 | A century of research on ¹³C discrimination | none |
| 10.1104/pp.59.1.86 | Ehleringer | 1977 | Plant Physiol 59:86 | Quantum yields in C₃ and C₄ plants | none |
| 10.1016/j.cub.2007.11.058 | Christin | 2008 | Curr Biol 18:37 | Oligocene CO₂ decline promoted C₄ | none |
| 10.1126/science.1177216 | Edwards | 2010 | Science 328:587 | Origins of C₄ grasslands | none |
| 10.1111/j.1365-3040.2011.02367.x | Muhaidat | 2011 | Plant Cell Environ 34:1723 | C₃–C₄ Heliotropium (proto-Kranz) | none |
| 10.7554/eLife.02478 | Mallmann | 2014 | eLife 3:e02478 | Role of photorespiration … Flaveria | none |
| 10.1093/jxb/erac465 | Walsh | 2023 | J Exp Bot 74:707 | Evolutionary implications of C₂ | none |
| 10.7554/elife.00961 | Williams | 2013 | eLife 2:e00961 | Multiple evolutionary paths to C₄ | none |
| 10.1111/nph.71218 | Roberts | 2026 | New Phytol 250:3675 | M–BS connectivity, C₂ vs C₄ Alternanthera | none |
| 10.1093/aob/mcae214 | Alvarenga | 2025 | Ann Bot 135:769 | C₂ in Homolepis | none |
| 10.1093/plphys/kiae077 | Tang | 2024 | Plant Physiol 195:291 | α-ketoglutarate links C₃–C₄ to C₄ | none |
| 10.1093/plphys/kiag089 | Wang Y | 2026 | Plant Physiol 200:kiag089 | Inducible CET and C₄ transition | none |
| 10.1111/nph.70426 | Stata | 2025 | New Phytol 248:2092 | Blepharis | none |
| 10.1038/s41586-024-08204-3 | Swift | 2024 | Nature 636:143 | Exaptation of cell-identity networks | none |
| 10.1111/nph.70475 | Sun T | 2026 | New Phytol 249:24 | Conserved patterning in C₄ lineages | none |
| 10.1038/s41467-025-62087-0 | Hua | 2025 | Nat Commun 16:7040 | TF ensemble for BS expression in rice | none |
| 10.1038/s41467-025-56901-y | Lyu | 2025 | Nat Commun 16:1643 | Transcriptional regulation in Flaveria | none |
| 10.1101/2025.04.23.650007 | Pereira | 2025 | bioRxiv (preprint) | Gene turnover … C₄ in grasses | none |
| 10.64898/2026.04.28.721324 | Machado | 2026 | preprint | Metabolic modelling, C₃–C₄ spectrum | none |
| 10.1093/plphys/kiag387 | Om | 2026 | Plant Physiol 202:kiag387 | Maize PEPC in rice | none |
| 10.1111/pbi.13487 | Ermakova | 2021 | Plant Biotechnol J 19:575 | C₄ enzymes in rice, single construct | none |
| 10.3389/fpls.2020.564463 | Lin H | 2020 | Front Plant Sci 11:564463 | Partial C₄ pathway in rice | none |
| 10.1016/j.cub.2017.09.040 | Wang P | 2017 | Curr Biol 27:3278 | Key step from C₃ to C₄ anatomy | none |
| 10.1016/j.scib.2023.10.005 | Dong | 2023 | Sci Bull 68:3133 | C₄-like vein pattern in rice | none |
| 10.1016/j.pbi.2007.11.002 | Hibberd | 2008 | Curr Opin Plant Biol 11:228 | C₄ rice rationale | none |
| 10.1111/j.1469-8137.2006.01855.x | Mitchell | 2006 | New Phytol 171:688 | Supercharging rice photosynthesis | none |
| 10.1038/35107073 | Voznesenskaya | 2001 | Nature 414:543 | Kranz not essential | none |
| 10.1146/annurev-arplant-081519-040100 | Hennacy | 2020 | Annu Rev Plant Biol 71:461 | Engineering biophysical CCMs | none |
| 10.1016/j.tibs.2024.10.010 | Catherall | 2025 | Trends Biochem Sci 50:33 | Pyrenoid-based CCMs | none |
| 10.1104/pp.66.3.407 | Badger | 1980 | Plant Physiol 66:407 | Internal Ci pool of Chlamydomonas | none |
| 10.1126/science.281.5374.237 | Field | 1998 | Science 281:237 | Primary production of the biosphere | none |
| 10.1038/s41477-024-01871-0 | Robison | 2025 | Nat Plants 11:63 | Hornwort pyrenoid CCM | none |
| 10.1038/s41467-023-37490-0 | Chen T | 2023 | Nat Commun 14:2118 | α-carboxysomes in chloroplasts | none |
| 10.1038/s41467-018-06044-0 | Long | 2018 | Nat Commun 9:3570 | Carboxysome encapsulation in tobacco | none |
| 10.1038/s41467-020-20132-0 | Atkinson | 2020 | Nat Commun 11:6303 | Proto-pyrenoid in higher plant | none |
| 10.1038/s41477-022-01153-7 | Fei | 2022 | Nat Plants 8:583 | Modelling the pyrenoid CCM | none |
| 10.1101/2024.01.04.574220 | Kaste | 2024 | bioRxiv (preprint) | Biophysical CCMs in land plants, modelling | none |
| 10.1007/s10142-024-01518-5 | Sidhu | 2025 | Funct Integr Genomics 25:5 | β-carboxysomes in rice | none |
| 10.1126/science.aah5237 | Schwander | 2016 | Science 354:900 | CETCH cycle | none |
| 10.1038/s41929-023-01079-z | Luo S | 2023 | Nat Catal 6:1228 | THETA cycle | none |
| 10.1016/j.semcdb.2023.07.013 | Ludwig | 2024 | Semin Cell Dev Biol 155:10 | CBB cycle in C₄ and CAM | none |
| 10.1101/cshperspect.a041674 | Yang X | 2023 (online) / 2024 (issue) | CSH Perspect Biol a041674 | Engineering CAM | none |
| 10.1093/jxb/erp118 | Borland | 2009 | J Exp Bot 60:2879 | CAM for bioenergy on marginal lands | none |
| 10.1093/aob/mcad135 | Gilman | 2023 | Ann Bot 132:627 | CAM lineages of planet Earth | none |
| 10.1093/aob/mcad122 | Sage RF | 2023 | Ann Bot 132:753 | CO₂ decline and timing of CAM | none |
| 10.1104/pp.65.2.193 | Koch | 1980 | Plant Physiol 65:193 | CAM in Portulaca oleracea | none |
| 10.1126/sciadv.abn2349 | Moreno-Villena | 2022 | Sci Adv 8:eabn2349 | Integrated C₄ + CAM | none |
| 10.1093/plphys/kiac116 | Gilman | 2022 | Plant Physiol 189:735 | C₄ and CAM modules in Portulaca | none |
| 10.1093/jxb/erac163 | Ferrari | 2022 | J Exp Bot 73:4867 | Regulation of C₄–CAM in P. oleracea | none |
| 10.1093/jxb/erag161 | Ferrari | 2026 | J Exp Bot 77:4316 | Open questions on C₄–CAM | none |
| 10.1093/aob/mcag053 | Bakpa | 2026 | Ann Bot mcag053 | Salinity and drought induce CAM | none |
| 10.1098/rstb.2024.0249 | Lim | 2025 | Phil Trans R Soc B 380:20240249 | SynCAM | none |
| 10.1002/advs.202500418 | Wu S | 2025 | Adv Sci 12:2500418 | CAM-like shuttle in rice | none |
| 10.1186/s12870-026-09008-5 | Millsteed | 2026 | BMC Plant Biol 26:1243 | C₄ in the wheat grain | none |
| 10.1111/j.1096-3642.1813.tb00051.x | Heyne | 1815 (printed 1816) | Trans Linn Soc 11:213 | Deoxidation of leaves of Cotyledon calycina | none |
| 10.1111/j.1469-8137.1949.tb05133.x | Thomas | 1949 | New Phytol 48:390 | Acid metabolism I: … crassulacean acid metabolism | none |
| 10.1146/annurev.pp.11.060160.000501 | Ranson | 1960 | Annu Rev Plant Physiol 11:81 | Crassulacean acid metabolism | none |
| 10.1023/a:1024978220193 | Black | 2003 | Photosynth Res 76:329 | CAM: "working the night shift" | none |
| 10.1146/annurev.pp.29.060178.002115 | Osmond | 1978 | Annu Rev Plant Physiol 29:379 | CAM: a curiosity in context | none |
| 10.1111/j.1469-8137.2004.01224.x | Ainsworth | 2005 | New Phytol 165:351 | 15 years of FACE | none |
| 10.1126/science.aas9313 | Reich | 2018 | Science 360:317 | Reversal of C₃ vs C₄ response | none |
| 10.5962/bhl.title.16533 | de Saussure | 1804 | (book, BHL) | Recherches chimiques sur la végétation | none |

---

## Appendix B: Unverified

- Typical C₃ Vo/Vc at 25 °C. Needed only if the C9e axis gets real numbers; it depends on Γ\* and Cc.
- C₄ BS CO₂ "≈ 10× air". I verified only 160–990 µM inorganic carbon (Furbank & Hatch 1987) and computed ≈ 13 µM for air-equilibrated water (Henry's law, TB).
- Temperature of Krenzer's Γ values (not in the abstract).
- Chloroplast size in proto-Kranz *Flaveria*: the abstract states only "larger mitochondria".
- "Pyrenoids ≈ one third of global CO₂ capture": an estimate quoted in a review (Catherall 2025); I did not check the primary source.
- Who coined "crassulacean acid metabolism". The term was in use by 1949; the earlier origin is unknown.
- de Saussure 1804 observation on cactus CO₂ (book exists; content not checked).
- Haberlandt 1884 "Kranztypus" (no DOI; not checked).
- Kortschak's 1950s unpublished sugarcane results; Karpilov 1960 (Russian; not checked).
- Content of Dong 2023 (title only), Mitchell & Sheehy 2006, Ranson & Thomas 1960, Osmond 1978, Bender 1971: metadata only.
