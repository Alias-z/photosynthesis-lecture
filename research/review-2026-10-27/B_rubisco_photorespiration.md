# Review B, 27 Oct 2026: Rubisco and photorespiration (C5, C6)

Scope: the `PLATE` text and every figure label that makes a factual claim in the ten variants of `src/pilot/figs/c05.ts` and `c06.ts`. C6 variant a draws `c5.ts` variant a. I do not repeat findings already in `research/review-2026-10-23-claude/`; where one is still not applied, it is listed as "open (23 Oct)". Context read: `c04.ts`, `c07.ts`, `LECTURE_OUTLINE.md`, `LECTURE_OVERVIEW.md` and `ENERGY_ACCOUNTING.md`, plus the order sections of the other 27 Oct reports (A, C, D). No project file other than this report was changed.

**Evidence key.**
- FT = full text read.
- Abs = abstract read.
- Meta = Crossref metadata only.
- TB = textbook consensus.
- Calc = my own arithmetic.

**DOI check.** All 85 DOIs were checked on Crossref on 27 Oct 2026 (Appendix A). None is retracted. Four carry correction notices:
- Meacham-Hensold 2026: Tables 3 and 4 were transposed. Read; no conclusion changes.
- Gionfriddo 2025: content not read.
- Prywes 2025: affiliations only.
- South 2019: erratum, content not readable.

## Top fixes

1. **C6 point 2, "Each oxygenation costs 3.5 ATP + 2 NADPH (cycle included) and loses ½ C": the accounting boundary is hidden.**
   - What it covers: 3.5 ATP + 2 NADPH pays for recycling the 2-PG and rebuilding the RuBP (von Caemmerer 2025, FT).
   - What it leaves out: re-fixing the ½ CO₂ that is lost costs another 1.5 ATP + 1 NADPH.
   - The cited 2026 review gives the "textbook" figure as 5 ATP + 3 NADPH per oxygenation, *including* that refixation (Meacham-Hensold 2026, Table 2, FT). A student who opens the slide's own reference finds a different number.
   - "NADPH" here also stands for the reduced ferredoxin used to re-fix NH₃.
   - Wording (matches figure h): "At 3 oxygenations per 10 carboxylations, each CO₂ gained costs ≈ 4.8 ATP + 3.1 NADPH instead of 3 + 2."
2. **C6 point 3 and figure g, "bypasses added ≈ 24 % tobacco biomass": this is the best season of one design.**
   - 24 % is the AP3 bypass with PLGG1-RNAi in 2017 (P = 0.018). The same design gave 20 % in 2016. AP3 without RNAi gave +10 % in 2017, not significant (South 2019, FT).
   - In heating trials run in 2017 at the same site, the same AP3 + PLGG1-RNAi design gave +11 % (5–17 %) at ambient temperature and +26 % at +5 °C (Cavanagh 2022, FT).
   - Plots were 6 × 6 plants. The 2026 review says bypass trials are "limited by small size and low statistical power" (FT).
   - Wording: "One bypass raised tobacco biomass by 11–24 % in small field trials."
   - Also: "Mutants that block it cannot grow in air" → "Mutants lacking a core step survive only in high CO₂". HPR1 mutants grow in air (Timm 2008, Abs).
3. **C5 point 2, "Warming favours the O₂ reaction": state the mechanism, and fix figure e.**
   - Two causes act together. Rubisco's CO₂/O₂ specificity falls (spinach: about 160 at 5 °C, about 50 at 40 °C). CO₂ solubility falls faster than O₂ solubility.
   - Specificity accounts for about two-thirds of the effect, solubility for one-third (Jordan & Ogren 1984, Abs).
   - The cited Walker 2016 abstract does not state this mechanism. Cite Jordan & Ogren 1984 instead.
   - Figure e keeps O₂ constant and halves CO₂. Both fall; CO₂ falls faster.
   - Wording: "Warmth lowers Rubisco's preference for CO₂ and dissolves less CO₂ relative to O₂; more CO₂ tilts it back."
4. **C5 point 3, "A hard reaction, not a bad enzyme. Rubisco is typical for its chemistry": the claim is right, but the slide cites the wrong papers and still implies Rubisco is optimal.**
   - The cited papers do not test "typical for its chemistry". Bouvier 2024 and Bar-On 2019 are about evolution and mass. The papers that show it are Bathellier 2018 (Abs: "not especially slow"; its kinetics are "unremarkable") and Flamholz 2019 (FT).
   - A number to anchor it: tobacco Rubisco's kcat/Kc in air is 117 mM⁻¹ s⁻¹ ≈ 1.2 × 10⁵ M⁻¹ s⁻¹ (McDonald 2026, FT). That equals the "average enzyme", ≈ 10⁵ (Bar-Even 2011, Abs).
   - The near-optimal view (Tcherkez 2006; Savir 2010) is weaker now.
     - Flamholz 2019 found the trade-off correlations "substantially attenuated" (FT).
     - Lab variants made in 2025–26 are faster without losing specificity. McDonald 2026: kcat/Kc in air +43 %, S_c/o unchanged. Chaudhari 2026: +16–20 %.
   - Wording: "Typical for its chemistry and still improving; at ≈ 0.7 Gt it is Earth's most abundant enzyme."
5. **Figure fixes that affect the teaching order.**
   - C6 variant a is `c5.ts` 'a', the FvCB scheme. Its braces (Aj ~ Jmax, Ac ~ Vcmax, Ap ~ TPU) teach C12 before C12 and repeat C12's figure. Use the scheme without the braces.
   - TPI and SBPase:
     - C5 a, b, f, g and h name both enzymes, but C03 never introduces TPI.
     - C5 h places TPI beside "reduction", yet both enzymes act in regeneration (Raines 2022, FT).
     - Fix: name both in C03, or write "two cycle enzymes" on C5.
   - C6 b, c and i tag NH₃ re-fixation with "NADPH". The enzyme (GOGAT) uses reduced ferredoxin (von Caemmerer 2025, FT). Tag it "Fd" or "reductant".
   - C5 writes "3-PGA", C6 writes "PGA". Use one.

---

## §1 Claim check

### C5 PLATE (Rubisco reacts with CO₂ and O₂)

| # | Claim | Verdict | Evidence | Suggested wording |
|---|---|---|---|---|
| 5.1 | Lead: "Rubisco can add O₂ to RuBP instead of CO₂, making a product the cycle cannot use." | OK | 2-PG "cannot re-enter" the cycle ([Cavanagh 2022](https://doi.org/10.1111/pbi.13750), FT). O₂ adds to the enolised RuBP ([Bathellier 2020](https://doi.org/10.1073/pnas.2008824117), Abs). The second product, 3-PGA, is usable. | Optional: "…making 2-PG, which the cycle cannot use." |
| 5.2 | "Two gases compete for RuBP." | OK | Competitive inhibition at one active site ([Flamholz 2019](https://doi.org/10.1021/acs.biochem.9b00237), FT) | — |
| 5.3 | "RuBP + O₂ gives 3-PGA plus 2-phosphoglycolate (2-PG), which inhibits cycle enzymes." | OK (2-PG wording) | 2-PG inhibits TPI and SBPase and shifts carbon from RuBP regeneration to starch. The authors read this as a feedback control loop, not only as damage ([Flügel 2017](https://doi.org/10.1105/tpc.17.00256), Abs). Fernie & Bauwe 2020 call 2-PG "auto-inhibitory" (Abs). Walker 2016 and Bauwe 2010 call it "toxic", which says more than the data show. In C₄ *Flaveria*, a phenotype appears only below 5 % residual PGLP ([Levey 2019](https://doi.org/10.1093/jxb/ery370), Abs). | Keep "inhibits"; avoid "toxic". |
| 5.4 | "Warming favours the O₂ reaction. Oxygenation rises relative to carboxylation as leaves warm; more CO₂ tilts it back." | OK; **mechanism missing** | Specificity falls, about 2/3 of the effect; solubility, about 1/3 ([Jordan & Ogren 1984](https://doi.org/10.1007/bf00398720), Abs). Vo/Vc = O/(S_c/o · C) (TB). Cavanagh 2022 calls this "the most significant direct effect of temperature on photosynthesis in C3 plants" (FT). Context nuance: above the temperature optimum, the drop in assimilation is explained by Rubisco deactivation and slower electron transport, not by oxygenation alone ([Scafaro 2023](https://doi.org/10.1038/s41467-023-38496-4), Abs). | Top fix 3 |
| 5.5 | "A hard reaction, not a bad enzyme." | OK as framing; **contested** | For "near-optimal within constraints": [Tcherkez 2006](https://doi.org/10.1073/pnas.0600605103) and [Savir 2010](https://doi.org/10.1073/pnas.0911663107) (Abs). Against: Flamholz 2019 (FT) says the weaker correlations "call into question" a one-dimensional, optimised landscape, while Rubisco stays "highly constrained". [Bouvier 2021](https://doi.org/10.1093/molbev/msab079) and [Bouvier & Kelly 2023](https://doi.org/10.1016/j.jplph.2023.154021) argue that phylogenetic constraint matters more than the trade-off; [Tcherkez & Farquhar 2021](https://doi.org/10.1016/j.jplph.2021.153554) reply that it does not (all Abs). [Bathellier 2018](https://doi.org/10.1111/pce.13149) (Abs): oxygenation is "not … an inevitable consequence of the mechanism". Bathellier 2020 (Abs): O₂ reacts through a single electron transfer from the enolised RuBP. | Top fix 4 |
| 5.6 | "Rubisco is typical for its chemistry" | OK; **SCOPE**: not in the cited refs | Bathellier 2018 (Abs). [Bar-Even 2011](https://doi.org/10.1021/bi2002289) (Abs): the "average enzyme" has kcat/K_M ≈ 10⁵ M⁻¹ s⁻¹. [McDonald 2026](https://doi.org/10.1126/sciadv.aeh3246), Table 1 (FT): tobacco kcat 3.5 s⁻¹, kcat/Kc(air) 117 mM⁻¹ s⁻¹. | Cite Bathellier 2018 or Flamholz 2019 |
| 5.7 | "at ≈ 0.7 Gt it is Earth's most abundant enzyme" | OK | [Bar-On & Milo 2019](https://doi.org/10.1073/pnas.1816654116) (FT): ≈ 0.7 Gt, over 10× Ellis's 0.04 Gt, with more than 90 % in leaves. They say Rubisco "has been claimed to be" the most abundant protein; their collagen estimate is ≈ 0.05 Gt. "Most abundant enzyme" also appears in Flamholz 2019 and [Taylor-Kearney 2024](https://doi.org/10.1016/j.cub.2024.06.024) (Abs). | — |
| 5.8 | Walker 2016 cited for the temperature mechanism (code header) | **UNSUP at abstract level** | The abstract gives modelled yield costs (US soybean −36 %, wheat −20 %), not the mechanism. Full text not open. | Cite Jordan & Ogren 1984 |

### C5 figure labels

| Var. | Label | Verdict | Note / fix |
|---|---|---|---|
| a Two doors | "2-PG ⊣ TPI, SBPase"; "recycled by photorespiration" | OK | Flügel 2017 (Abs) |
| b Coin and token | "clearing the jam" costs energy; "hot day: more tokens slip in" | OK as analogy | Conveys "more O₂" only, not "less CO₂ dissolved" |
| c Slow, not frozen | "rbcL … slowest 1 %"; "≈ 1 amino-acid change per 7.2 million years"; "kinetics still evolving (debated)" | OK | [Bouvier 2024](https://doi.org/10.1073/pnas.2321050121) (Abs): rbcL is "among the 1% of slowest-evolving genes", with "one amino acid mutation every 7.2 My" |
| d Earth to site | "≈ 0.7 Gt Rubisco"; "≈ 3 % of dry mass"; "in the stroma" | OK | Bar-On 2019 (FT): ≈ 3 % of a global leaf mass of ≈ 30 Gt dry weight |
| e Cool vs warm | Dissolved gases: CO₂ 4 → 2 molecules, O₂ 6 → 6; "Rubisco's preference for CO₂" lower when warm | **Imprecise** | Both solubilities fall; CO₂'s falls more (Jordan & Ogren 1984). Draw fewer of both, or label "CO₂ : O₂ in solution falls". The gauge is right. |
| f Four steps | "RuBP binds"; "either gas can react"; "only CO₂ fixes carbon"; "2-PG must be cleared" | OK | Panel 4 repeats C6 (§5) |
| g Carbon trace | "C from CO₂" on one 3-PGA; "inhibits TPI, SBPase"; "warmer: more 2-PG" | OK | TB |
| h 2-PG test | TPI chip in the "reduction" arc; bars "− 2-PG / + 2-PG"; "schematic, after Flügel et al. 2017" | **Imprecise** | "Eight out of the 11 enzymes" regenerate RuBP. TPI's product, DHAP, "enters the regenerative phase" ([Raines 2022](https://doi.org/10.1111/nph.18394), FT). Move TPI next to SBPase. |
| i O₂ comes back | "Rubisco prefers CO₂; air holds far more O₂"; equation with 12 H₂O | OK, but invites a wrong sum | Air has ≈ 500 O₂ per CO₂, but Rubisco works in water: ≈ 270 µM O₂ at 25 °C, and the median S_c/o of C₃ plants is 98. Net result in ambient air: R_C ≈ 1.2 and R_O ≈ 0.4 s⁻¹ for spinach Rubisco (Flamholz 2019, FT). Suggested label: "Rubisco prefers CO₂ about 100-fold, yet in air about 1 reaction in 4 uses O₂." |
| j Three icons | "Heat tips the balance towards O₂" | OK | — |

### C6 PLATE (Photorespiration recovers carbon at a cost)

| # | Claim | Verdict | Evidence | Suggested wording |
|---|---|---|---|---|
| 6.1 | Lead: "3 of every 4 carbons return, 1 is lost as CO₂." | OK (closed loop) | [Fernie & Bauwe 2020](https://doi.org/10.1111/tpj.14669) (Abs). Serine export of 23–41 % of photorespiratory carbon ([Fu 2023](https://doi.org/10.1038/s41477-022-01294-9), Abs) is open (23 Oct) as context. | — |
| 6.2 | "Three organelles, one CO₂ lost. In mitochondria, two glycine become serine, CO₂ and NH₃; serine is recycled to 3-PGA." | OK | TB. A cytosolic route via HPR2 also exists ([Timm 2008](https://doi.org/10.1105/tpc.108.062265), Abs); context only. Reviewer C asks that "glycine decarboxylase (GDC)" be named here, because C8 builds on it; I agree. | "In mitochondria, glycine decarboxylase turns two glycine into serine, CO₂ and NH₃…" |
| 6.3 | "Each oxygenation costs 3.5 ATP + 2 NADPH (cycle included) and loses ½ C." | **Imprecise** | Top fix 1. [von Caemmerer 2025](https://doi.org/10.1007/s00425-025-04834-7) (FT): 0.5 ATP to turn one 2-PG back into 0.5 PGA; re-fixing 0.5 NH₃ needs 1 reduced ferredoxin + 0.5 ATP. [Meacham-Hensold 2026](https://doi.org/10.1111/nph.70724), Table 2 (FT): native pathway 3.5 ATP + 2 NADPH, plus 1.5 + 1 to re-fix the 0.5 CO₂, total 5 + 3 (ATP:NADPH = 1.67). Calc at Vo/Vc = 0.3: (3 + 1.05)/0.85 = 4.76 ATP and (2 + 0.6)/0.85 = 3.06 NADPH per net CO₂. | Top fix 1 |
| 6.4 | "Mutants that block it cannot grow in air" | **Imprecise** | Mutants in the core pathway die in air but survive in high CO₂, with severity that differs between mutants ([Timm & Bauwe 2013](https://doi.org/10.1111/j.1438-8677.2012.00691.x), Abs). HPR1 is the exception (Timm 2008, Abs). The pathway is essential even in cyanobacteria that concentrate CO₂ ([Eisenhut 2008](https://doi.org/10.1073/pnas.0807043105), Abs). | "Mutants lacking a core step survive only in high CO₂." |
| 6.5 | "bypasses added ≈ 24 % tobacco biomass in field trials" | **Imprecise (selective)** | Top fix 2 | "One bypass raised tobacco biomass by 11–24 % in small field trials." |
| 6.6 | Refs | OK | Meacham-Hensold 2026 has a correction (Tables 3 and 4 transposed; [correction](https://doi.org/10.1111/nph.71182) read on PMC). South 2019 erratum content still unread. | Add Cavanagh 2022 if the range is used |

### C6 figure labels

| Var. | Label | Verdict | Note / fix |
|---|---|---|---|
| a Thesis scheme (`c5.ts` 'a') | "Aj ~ Jmax", "Ac ~ Vcmax", "Ap ~ TPU"; "3 of 4 C back"; "1 of 4 C lost" | Carbon OK; **order** | Remove the braces (top fix 5). Reviewer D also asks C12 to drop this photorespiration branch. |
| b Three organelles | glycolate → glycine → serine → glycerate (ATP) → PGA; "1 C lost"; NH₃ "re-fixed in the chloroplast" with ATP + NADPH | OK; tag **imprecise** | Re-fixing 0.5 NH₃ takes 1 reduced Fd (≡ 0.5 NADPH) + 0.5 ATP (von Caemmerer 2025, FT). The same NADPH tag appears in c and i. |
| c Four steps | "two 2-PG (4 C) leave as glycolate"; "via glyoxylate; still 4 C"; "one carbon lost as CO₂"; "3 C return as PGA" | OK | 2-PG is dephosphorylated in the chloroplast; glycolate leaves through PLGG1 ([Pick 2013](https://doi.org/10.1073/pnas.1215142110), Abs). Same NADPH tag issue as b. |
| d Recycling plant | analogy | OK | — |
| e Air-sick mutant | "mutant without step 1 … cannot grow"; "2-PG piles up"; "Arabidopsis; Somerville & Ogren 1979" | OK | Title (Meta) and [Ogren 2003](https://doi.org/10.1023/A:1024913925002) (Abs). 2-PG build-up fits PGLP knock-downs (Levey 2019; Flügel 2017, Abs); the 1979 data were not read. |
| f Net gain | "6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂"; "net carbon gain = Vc − ½ Vo"; "gain before day respiration" | OK; **consistency** | C01 and C5 i use the 12 H₂O → 6 H₂O form. The formula repeats C11 point 2 (§5). |
| g Native vs bypass | native "1 of 4 C"; bypass CO₂ released "next to Rubisco"; two CO₂ per glycolate; "More CO₂ lost, yet more biomass"; "field tobacco, small trials; the cause is not settled"; aria-label "about 24 %" | OK; aria-label **imprecise** | AP3 fully decarboxylates glycolate and needs *more* energy than the native route: 7.36 ATP + 3 NADPH vs 5 + 3, both including refixation (2026 review, Table 2, FT). A model predicted full decarboxylation would *lower* photosynthesis ([Xin 2015](https://doi.org/10.1104/pp.114.248013), Abs). This sharpens the paradox the slide already shows. Change the aria-label to "11–24 %". |
| h Cost curve | "C kept per carboxylation" falls from 1 to 0 at Vo/Vc = 2; "4.8 ATP at 0.3"; "gain = Vc − ½ Vo; ATP = 3 Vc + 3.5 Vo" | OK (Calc) | Vo/Vc = 2 is where Cc = Γ\*; label it, to set up C11/C12. Vo/Vc ≈ 0.3 is realistic: spinach R_O/R_C ≈ 0.33 (Flamholz 2019, FT). |
| i Glycine step | 2 glycine (4 C, 2 N) → serine (3 C, 1 N) + CO₂ + NH₃; "GDC", "SHMT", "also NADH" | OK | TB |
| j Four to three | "4 C → 3 C back + 1 C lost"; ATP, NADPH | OK | — |

### Open (23 Oct)

| Item | Status now |
|---|---|
| C5: one engineering-status line ("more enzyme works; a better enzyme is not yet in the field", §5a) | Absent. Update the "better enzyme" half with McDonald 2026, Gionfriddo 2025 and Chaudhari 2026 (§4). |
| C5: "runs ≈ 100× below its lab rate on land" (§5c) | Absent (optional) |
| C6: misconception "photorespiration is pure waste" → "essential and feeds serine and C1 metabolism" (§6) | Only "essential" is there |
| C6: RIPE programme line (§5a) | Absent; status after 2026 still unverified |
| South 2019 erratum (10.1126/science.aay8818) | Content still unread; the Science page is blocked |
| "Rubisco evolved before O₂" (F, §5c) | Now partly checked. It is phylogenetic inference ([Kacar 2017](https://doi.org/10.1111/gbi.12243), Abs). [Lin 2022](https://doi.org/10.1126/sciadv.abm6871) (FT) says it arose more than 2.5 Ga ago, before the Great Oxidation Event, citing Kacar 2017 and [Shih 2016](https://doi.org/10.1038/ncomms10382). Teach it as an inference. |

---

## §2 Missing topics

| Rank | Topic | Slot | One line | Source |
|---|---|---|---|---|
| Must | Why warming raises oxygenation | C5 point 2 | Specificity accounts for about 2/3 of the effect, solubility for 1/3 | [Jordan & Ogren 1984](https://doi.org/10.1007/bf00398720) (Abs) |
| Must | Heat also switches Rubisco off | C5 Context (or C2 with activation, as reviewer A suggests) | Above the optimum, Rubisco deactivation (activase is heat-sensitive) and slower electron transport cut uptake. Extra activase rescued rice at 40 °C. | [Scafaro 2023](https://doi.org/10.1038/s41467-023-38496-4); [Qu 2021](https://doi.org/10.1111/pce.14051); [Qu 2023](https://doi.org/10.1093/jxb/erac340) (Abs) |
| Must | Photorespiration feeds metabolism | C6 point 3 or Context | It supports nitrogen assimilation and exports serine. About 5.8 % of assimilated carbon reaches C1 metabolism; photorespiratory formate even supplies DNA methyl groups. | [Busch 2018](https://doi.org/10.1038/s41477-017-0065-x); [Fu 2023](https://doi.org/10.1038/s41477-022-01294-9); [Gashu 2025](https://doi.org/10.1038/s41477-025-02091-w); [Hankofer 2026](https://doi.org/10.1038/s41477-026-02222-x) (Abs) |
| Must | Name Γ\* where it is defined | C6 h label; then C11/C12 | At Γ\*, two oxygenations cancel one carboxylation (Vo/Vc = 2). Reviewer D gives Γ\* ≈ 40 µmol mol⁻¹ at 25 °C (Busch 2024, FT by D; not re-read by me). | von Caemmerer 2025 (FT); Calc |
| Must | Rubisco engineering status (open 23 Oct) | C5, one line | More Rubisco gives about +10 % in field trials. Better Rubisco: lab variants with kcat +29 % and efficiency +43 %, no plant growth data yet. | [Salesse-Smith 2025](https://doi.org/10.1111/nph.20298) (Abs); [McDonald 2026](https://doi.org/10.1126/sciadv.aeh3246) (FT) |
| Nice | Photorespiration is universal among oxygen-producing photosynthesisers | C6 Context / C09 | Essential even in cyanobacteria that concentrate CO₂, and in C₄ *Flaveria* | [Eisenhut 2008](https://doi.org/10.1073/pnas.0807043105); [Levey 2019](https://doi.org/10.1093/jxb/ery370) (Abs) |
| Nice | How often O₂ wins in air | C5 i | About 1 oxygenation per 3 carboxylations at 25 °C | [Flamholz 2019](https://doi.org/10.1021/acs.biochem.9b00237) (FT) |
| Nice | A mostly idle enzyme | C5 d Context | On land Rubisco averages ≈ 0.03 s⁻¹, about 1 % of its lab kcat | [Bar-On 2019](https://doi.org/10.1073/pnas.1816654116) (FT) |
| Nice | Why a better Rubisco cannot simply be swapped in | C5 Context | Plant Rubisco needs specific assembly chaperones, and algal Rubiscos have so far failed to fold in plants. The chaperones themselves can be evolved. | [Aigner 2017](https://doi.org/10.1126/science.aap9221) (Meta); [Gionfriddo 2024](https://doi.org/10.1016/j.semcdb.2023.04.003); [Li 2025](https://doi.org/10.1073/pnas.2510701122) (Abs) |
| Nice | Origin before abundant O₂ | C5 Context | Form I Rubisco adapted to O₂ around the GOE (inference) | [Kacar 2017](https://doi.org/10.1111/gbi.12243) (Abs) |
| Nice | Leaves tune Rubisco through its small subunits | C5 Context | In Arabidopsis, the small subunit made in warm conditions stabilises the active site | [Askey 2026](https://doi.org/10.1073/pnas.2519914123) (Abs) |
| Nice | The C₄ advantage grows with temperature | C09, one phrase | At 30 °C, C₃ quantum yield is 0.052 in air and 0.073 at 2 % O₂. C₄ gives 0.053 in both and does not change with temperature. | [Ehleringer & Björkman 1977](https://doi.org/10.1104/pp.59.1.86) (Abs) |

---

## §3 History stories ("then → now")

These avoid the 23 Oct stories: Bowes 1971 → field bypasses; the 1982 activase mutant → Scafaro 2023; the "bad enzyme" revisited.

**H1 · Oxygen slows photosynthesis: a 1920 effect, evolved away in 2025 (C5).**
- **Then.**
  - Warburg (1920) found that O₂ inhibits photosynthesis in *Chlorella*.
  - Sources: the original is in *Biochem Z* 103 and is not on Crossref. Its title is verified through the 1928 reprint ([10.1007/978-3-642-47774-4_26](https://doi.org/10.1007/978-3-642-47774-4_26), Meta); the content is TB.
  - The cause was found 51 years later: O₂ competes with CO₂ at Rubisco ([Ogren & Bowes 1971](https://doi.org/10.1038/newbio230159a0), Meta; Ogren 2003, Abs).
- **Now** ([McDonald 2025](https://doi.org/10.1073/pnas.2505083122), Abs + FT).
  - A Rubisco from a semi-anaerobic bacterium runs about 5× faster than average (25.8 s⁻¹) but is "extremely sensitive to O₂ inhibition".
  - Six rounds of directed evolution in air raised its carboxylation efficiency in ambient O₂ by 8–25 %.
  - The price: about 16 % lower efficiency in its near-anaerobic home conditions.
  - O₂ sensitivity can be tuned, but only as a trade-off.
- **Animation:** an O₂ dial slows *Chlorella*; zoom to the active site; evolution rounds in *E. coli*.

**H2 · "The most abundant protein", and it mostly idles (C5).**
- **Then:** Ellis (1979), ["The most abundant protein in the world"](https://doi.org/10.1016/0968-0004(79)90212-3) (Meta). He estimated about 0.04 Gt in one paragraph, as recounted by Bar-On 2019 (FT).
- **Now.**
  - Bar-On & Milo 2019 (FT): about 0.7 Gt, about 3 % of leaf dry mass. On land it works at about 1 % of its lab rate.
  - About 20 % more Rubisco gives about 10 % more productivity in field trials (Salesse-Smith 2025, Abs).
- **Animation:** zoom from Earth to leaf to enzyme, then a speedometer stuck at 1 %.

**H3 · Air-sick mutants map the pathway, then steer the bypass (C6).**
- **Then:** Somerville & Ogren (1979) kept Arabidopsis mutants alive in high CO₂ and looked for those that die in air. The first lacked 2-PG phosphatase ([Meta](https://doi.org/10.1038/280833a0); Ogren 2003, Abs).
- **In between:** the same high-CO₂ rescue logic identified PLGG1, the chloroplast glycolate/glycerate transporter. It was the first core photorespiratory transporter found ([Pick 2013](https://doi.org/10.1073/pnas.1215142110), Abs).
- **Now.**
  - Silencing PLGG1 keeps glycolate in the chloroplast for the AP3 bypass. In 2017 tobacco biomass rose 24 % with the RNAi and 10 % (not significant) without it (South 2019, FT).
  - Rice: PLGG1 knocked down by CRISPR in an AP3 line (Chen X 2026, read via the 2026 review FT).
- **Animation:** two growth chambers (high CO₂ vs air); then a door (PLGG1) closes and glycolate is rerouted.

**Reserves**
- **R1 (C6).**
  - Then: the photorespiratory nitrogen cycle ([Keys 1978](https://doi.org/10.1038/275741a0), Meta).
  - Now: assimilating nitrogen via photorespiration raises CO₂ uptake (Busch 2018, Abs). Photorespiratory formate supplies methyl groups for DNA methylation, and elevated CO₂ changes the methylome (Hankofer 2026, Abs).
  - Contested edge: [Bloom 2010](https://doi.org/10.1126/science.1186440) vs [Andrews 2019](https://doi.org/10.1093/jxb/ery371) (Abs).
- **R2 (C6).**
  - Then: the post-illumination CO₂ burst ([Decker 1955](https://doi.org/10.1104/pp.30.1.82); title Meta, interpretation TB).
  - Now: a standard measure of photorespiratory CO₂ release ([Gregory 2024](https://doi.org/10.1007/978-1-0716-3802-6_9), Abs). Glycine pools shape these transients (Fu 2023, Abs).
- **R3 (C5).**
  - Then: Rubisco specificity differs between species ([Jordan & Ogren 1981](https://doi.org/10.1038/291513a0), Meta; Ogren 2003, Abs).
  - Now: Solanaceae ancestors about 30 Myr old were resurrected in a Rubisco-null tobacco. They grow normally and carboxylate 16–20 % more efficiently in air ([Chaudhari 2026](https://doi.org/10.1073/pnas.2523360123), FT).
- **R4 (C6 → C09):** 2-PG metabolism is essential even in cyanobacteria that concentrate CO₂ (Eisenhut 2008) and in C₄ *Flaveria* (Levey 2019) (Abs).

---

## §4 Latest findings, 2022–2026

**Rubisco**
- [Prywes 2025](https://doi.org/10.1038/s41586-024-08455-0), *Nature* · **solid (bacterial)**. Mapped over 99 % of single mutants of a Form II Rubisco. Most are harmful; rare ones raise CO₂ affinity. "Non-trivial biochemical changes are readily accessible" (Abs).
- [McDonald 2026](https://doi.org/10.1126/sciadv.aeh3246), *Sci Adv* · **solid in vitro; plant effect untested**. Machine-learning-assisted evolution of tobacco RbcL; the 23 Oct entry for this paper was "preprint".
  - T391I: kcat 3.5 → 4.5 s⁻¹ and kcat/Kc(air) +43 %, with S_c/o unchanged (79.7 → 79.9).
  - The variants assemble in chloroplasts. The authors say "stable plastome-transformed … lines … will be necessary" (FT).
- [Gionfriddo 2025](https://doi.org/10.1038/s41477-025-02093-8), *Nat Plants* · **solid, with a caveat**.
  - M116L raises kcat by 25–40 % across plant Rubiscos.
  - It had no effect on tobacco's own Rubisco in the plant. Growth improved only in a line with a low-abundance hybrid Rubisco (Abs).
  - An author correction exists; its content was not read.
- [Chaudhari 2026](https://doi.org/10.1073/pnas.2523360123), *PNAS* · **solid, single lab**. Tobacco with all 11 *rbcS* genes knocked out, carrying two resurrected Solanaceae ancestors. It grew like wild type in air and soil, with kcat,air/Kc,air 16–20 % higher (FT).
- [Lin 2022](https://doi.org/10.1126/sciadv.abm6871), *Sci Adv* · **solid (in E. coli)**. Ancestral Solanaceae Rubiscos have higher kcat and C₃-like specificity (FT).
- [Zhou 2023](https://doi.org/10.1038/s41477-023-01436-7), *Nat Plants* · **solid; caveat: the comparison is with tobacco carrying the unmodified bacterial (RsRubisco) enzyme, not wild-type tobacco**. Grafting an algal loop gave kcat +60 %, S_c/o +7 %, and up to 2× growth (Abs).
- [McDonald 2025](https://doi.org/10.1073/pnas.2505083122), *PNAS* · **solid (bacterial)**. Evolution under O₂ raised efficiency in air and lowered it under anoxia (Abs).
- [Li 2025](https://doi.org/10.1073/pnas.2510701122), *PNAS* · **solid (tool)**. The assembly chaperone Raf1 was evolved to assemble a foreign Rubisco (Abs).
- [Chen T 2023](https://doi.org/10.1038/s41467-023-37490-0), *Nat Commun* · **solid**. α-Carboxysomes built in tobacco chloroplasts support growth only at elevated CO₂ (Abs).
- [Bouvier 2024](https://doi.org/10.1073/pnas.2321050121), *PNAS* · **contested method**. Rubisco kinetics are still improving (Abs).
- [Schulz 2025](https://doi.org/10.1038/s44318-024-00311-1), *EMBO J* · **solid (mechanism)**. Several overlapping changes keep the small subunit essential (Abs).
- [Askey 2026](https://doi.org/10.1073/pnas.2519914123), *PNAS* · **new, single study**. Holoenzymes mix different small subunits; the warm-expressed one stabilises the active site (Abs).
- [Salesse-Smith 2025](https://doi.org/10.1111/nph.20298), *New Phytol* · **review; the canopy numbers are modelled**. +20 % Rubisco → canopy photosynthesis +9 % in soybean and +14 % in sugarcane; about +10 % productivity (Abs).
- [Iñiguez 2026](https://doi.org/10.1093/plphys/kiag507), *Plant Physiol* · **review**. In aquatic phototrophs, "none … achieves CO₂ saturation solely through Rubisco kinetics" (Abs).

**Heat and activase**
- [Scafaro 2023](https://doi.org/10.1038/s41467-023-38496-4), *Nat Commun* · **solid, global dataset**. Above the optimum temperature, Rubisco deactivation and slower electron transport explain the decline (Abs).
- [Qu 2021](https://doi.org/10.1111/pce.14051), *PCE* · **solid, growth chamber**. Rice overexpressing both Rubisco and activase gained 26 % dry weight at 40 °C (Abs).
- [Gjindali 2025](https://doi.org/10.1111/nph.70271), *New Phytol* · **solid, in vitro plus a heatwave experiment**. Cowpea activase isoforms Rca10α/β are more heat-tolerant (Abs).
- [Hotto 2025](https://doi.org/10.1093/jxb/eraf289), *JXB* · **solid, C₄**. In *Setaria*, the heat-induced α form alone kept plants alive at 40 °C for about 7 d (Abs).
- [Cao 2026](https://doi.org/10.1111/pbi.70774), *PBJ* · **single study**. A heat-induced activase also stops other chloroplast proteins from aggregating (Abs).

**Photorespiration beyond salvage**
- [Fu 2023](https://doi.org/10.1038/s41477-022-01294-9), *Nat Plants* · **contested magnitude**. 23–41 % of photorespiratory carbon leaves the pathway as serine (Abs).
- [Gashu 2025](https://doi.org/10.1038/s41477-025-02091-w), *Nat Plants* · **solid, single lab**. About 5.8 % of assimilated carbon goes to C1 metabolism, mainly via serine (Abs).
- [Gashu & Walker 2026](https://doi.org/10.1093/jxb/erag322), *JXB* · **solid, single lab**. The formate route is minor and cannot be engineered to carry more (Abs).
- [Hankofer 2026](https://doi.org/10.1038/s41477-026-02222-x), *Nat Plants* · **new, single study**. Photorespiratory formate feeds DNA methylation; elevated CO₂ changes the methylome (Abs).
- [Walker 2024](https://doi.org/10.1111/pce.14949), *PCE* · **modelling**. When photorespiration runs as an open loop, the ATP:NADPH demand can fall below what linear electron flow supplies (Abs).
- [Walker & Schroeder 2026](https://doi.org/10.1007/s00425-026-04961-9), *Planta* · **perspective**. Its role as an energy sink "remains debated" (Abs).
- [Timm 2026](https://doi.org/10.1007/s00425-026-04989-x), *Planta* · **negative result**. The enzyme SHMT1 does not limit flux (Abs).
- [Mortezazadeh 2025](https://doi.org/10.1111/ppl.70539), *Physiol Plant* · **preliminary (epidermal peels, inhibitors)**. Guard cells need photorespiration for light-induced stomatal opening (Abs).
- [Basu 2026](https://doi.org/10.1111/tpj.71019), *Plant J* · **single study**. Regulators of the sulfur-starvation response connect to photorespiration (Abs).

**Bypasses**
- [Cavanagh 2022](https://doi.org/10.1111/pbi.13750), *PBJ* · **solid; same design, group and site as South 2019**. +26 % biomass at +5 °C vs +11 % at ambient (FT).
- [Meacham-Hensold 2024](https://doi.org/10.1111/gcb.17595), *GCB* · **solid, small**. Potato tuber mass per plant +9.5 % in 2020 and +30 % in 2022, after heatwaves (FT).
- [Chen X 2026](https://doi.org/10.1016/j.cj.2025.03.001), *Crop J* · **independent group; primary not read**. AP3 in rice raised paddy yield by up to 35 % (Meta; numbers from the 2026 review, FT).
- [Xu 2023](https://doi.org/10.1016/j.xplc.2023.100641), *Plant Commun* · **single study**. A light-inducible bypass (GMA) in rice raised yield without lowering seed set (Abs).
- [Chen G 2024/25](https://doi.org/10.1093/plcell/koaf015), *Plant Cell* · **single study**. The GCBG bypass raised rice yield by 19 % and improved nitrogen uptake (Abs).
- [Lin 2025](https://doi.org/10.1111/pbi.70076), *PBJ* · **per-plant yield; plot size not stated**. The GOC bypass raised potato yield per plant by 21–69 % at five sites in China (Abs).
- [Chen G 2025](https://doi.org/10.1111/pbi.70258), *PBJ* · **brief communication, not read**. A carbon-positive bypass through the tartronyl-CoA pathway in rice (Meta).
- [Luo 2026](https://doi.org/10.1016/j.celrep.2026.117609), *Cell Rep* · **single study**. A tomato bypass that also adds GS2; yield and fruit quality up (Abs).
- [Meacham-Hensold 2026](https://doi.org/10.1111/nph.70724), *New Phytol* · **solid review**.
  - Gives the energy table used above.
  - Trials are "limited by small size and low statistical power" (FT).
  - Correction: Tables 3 and 4 were transposed (FT).
- Jeong 2026, bioRxiv [10.64898/2026.07.23.739952](https://doi.org/10.64898/2026.07.23.739952) · **preprint**. Expressing an algal glycolate dehydrogenase (GDH) in the chloroplast; title only.

---

## §5 Order notes

**A. Must come before C5/C6**
1. **C02:** RuBP, carboxylation and 3-PGA. Already present.
2. **C03:** TPI and SBPase.
   - C5 names them as the targets of 2-PG, but C03 never names TPI. C01 names SBPase only as a thioredoxin target.
   - Reviewer A proposes placing the light-switched enzymes on the C03 cycle. Add TPI there too, or write "two cycle enzymes" on C5.
3. **C04:** 3 ATP + 2 NADPH per CO₂. C6's cost only means something against this number.
4. **C01:** activase keeps Rubisco active. Already present. C5's heat note needs it.
5. **Lecture 1, L07 zoom:** chloroplast and mitochondrion. The peroxisome first appears in C6; one word there is enough.

**B. C04b placement (seen from C5/C6)**
- C04b (sucrose, starch, phloem) sits between C04 and C5 and breaks the thread from cycle cost (C04) to oxygenation (C5) to the cost of oxygenation (C6).
- Reviewer A recommends keeping it there because C12's TPU limit needs it. I accept that.
- The cost of that choice: C5 should open with a one-line return to Rubisco. C6 point 2 should restate "instead of 3 + 2", as in top fix 1.

**C. What C5/C6 set up**
1. **C11/C12 (FvCB).**
   - Γ\* is defined on C6 h: at Vo/Vc = 2 there is no net gain. Label it there.
   - Two FvCB expressions are C5's competition in algebra: Vo/Vc = 2Γ\*/Cc, and the Rubisco-limited rate's Kc(1 + O/Ko).
   - Oxygenation shifts the energy mix: 3.5 : 2 ATP:NADPH per oxygenation vs 3 : 2 per carboxylation. This links L11 and C04.
2. **C12 CO₂ fertilisation** ("helps C₃ more than C₄"). The mechanism is C5's "more CO₂ tilts it back". Refer back to it rather than re-teaching it.
3. **C07–C08 (C₂).**
   - C6 must name glycine decarboxylase (GDC) and the mitochondrion as the CO₂-release step, in its text and not only in figure i (agrees with reviewer C).
   - C6 g ("CO₂ released next to Rubisco") is the engineered version of C₂. Use the same words on C08.
4. **C09 (C₄).**
   - "More CO₂ tilts it back" plus warming → C₄'s advantage grows with temperature (Ehleringer & Björkman 1977). Add one phrase on C09, not on C5.
   - C₄ plants still need photorespiration (Levey 2019).

**D. If C11–C12 move up to follow C06** (proposed by reviewers C and D: C05 → C06 → C11 → C12 → C07/C08 → C09 → C10 → C13)
- From the C5/C6 side this is the better order:
  - Γ\* and "Vc − ½ Vo" are used immediately after C6 defines them.
  - C₂ and C₄ can then be compared by their compensation points.
- One change is needed: move the bypass (C6 point 3's second half and figure g) to the end of the C₂ slide, as "engineers copy the trick".
  - C6 point 3 then reads: "Essential, and more than salvage: mutants survive only in high CO₂; photorespiration feeds N, serine and C1 metabolism."
  - Otherwise the bypass sits 6–7 minutes before the C₂ idea it previews.
- If the order stays as it is, keep the bypass as the last panel of C6, as the bridge to C07.

**E. Repeated ideas (keep each in one place)**

| Idea | Appears in | Keep in | Elsewhere |
|---|---|---|---|
| Net gain = Vc − ½ Vo | C6 f and h; C11 point 2 | C6 in words ("two oxygenations lose one CO₂") | C11 gives the formula as a callback (reviewer D agrees) |
| "2-PG must be cleared" | C5 f panel 4, C5 h; C6 lead | C5 = the problem (2-PG inhibits) | C6 = the fix and its evidence (mutant) |
| The equation | C5 i and C6 f, besides C01, C04 and C13 | L01, L08, C01, C04, C13 (the overview's thread) | Drop it from C5/C6, or keep C5 i only. C6 f also uses the 6 H₂O form. |
| Analogies | C5 b (coins) and C6 d (recycling plant), on consecutive slides | At most one | — |
| FvCB scheme | C6 a and C12 a | C12 | C6 a without braces; C12 without the photorespiration branch (D) |
| Glycine → serine + CO₂ + NH₃ | C6 point 1 and fig. i; C8 | C6 | C8: "same reaction, new place" (reviewer C) |
| 3-PGA vs PGA | C02, C5 vs C6, `c5.ts` | One name | — |

**F. Where the missing topics sit**

| Topic | Slot |
|---|---|
| Temperature mechanism | C5 point 2 |
| Engineering status | C5, one line |
| Heat and activase; idle Rubisco; chaperones; origin; small-subunit tuning | C5 Context |
| Photorespiration feeds N, serine and C1 metabolism | C6 point 3 (or Context) |
| Γ\* | C6 h label, then C11/C12 |
| C₄ temperature advantage; photorespiration in C₄ | C09 |

---

## Appendix A: Crossref register (27 Oct 2026)

| DOI | First author | Year | Journal | Title | Crossref updated-by | Read |
|---|---|---|---|---|---|---|
| [10.1126/science.aap9221](https://doi.org/10.1126/science.aap9221) | Aigner | 2017 | Science 358:1272-1278 | Plant RuBisCo assembly in E. coli with five chloroplast chaperones including BSD2 | none | Meta |
| [10.1093/jxb/ery371](https://doi.org/10.1093/jxb/ery371) | Andrews | 2019 | Journal of Experimental Botany 70:683-690 | Elevated CO2 effects on nitrogen assimilation and growth of C3 vascular plants are similar regardless of N-form assimilated | none | Abs |
| [10.1021/bi2002289](https://doi.org/10.1021/bi2002289) | Bar-Even | 2011 | Biochemistry 50:4402-4410 | The Moderately Efficient Enzyme: Evolutionary and Physicochemical Trends Shaping Enzyme Parameters | none | Abs |
| [10.1073/pnas.1816654116](https://doi.org/10.1073/pnas.1816654116) | Bar-On | 2019 | Proceedings of the National Academy of Sciences 116:4738-4743 | The global mass and average rate of rubisco | none | FT |
| [10.1111/pce.13149](https://doi.org/10.1111/pce.13149) | Bathellier | 2018 | Plant, Cell & Environment 41:705-716 | Rubisco is not really so bad | none | Abs |
| [10.1073/pnas.2008824117](https://doi.org/10.1073/pnas.2008824117) | Bathellier | 2020 | Proceedings of the National Academy of Sciences 117:24234-24242 | Ribulose 1,5-bisphosphate carboxylase/oxygenase activates O 2 by electron transfer | none | Abs |
| [10.1126/science.1186440](https://doi.org/10.1126/science.1186440) | Bloom | 2010 | Science 328:899-903 | Carbon Dioxide Enrichment Inhibits Nitrate Assimilation in Wheat and Arabidopsis | none | Abs |
| [10.1093/molbev/msab079](https://doi.org/10.1093/molbev/msab079) | Bouvier | 2021 | Molecular Biology and Evolution 38:2880-2896 | Rubisco Adaptation Is More Limited by Phylogenetic Constraint Than by Catalytic Trade-off | none | Abs |
| [10.1016/j.jplph.2023.154021](https://doi.org/10.1016/j.jplph.2023.154021) | Bouvier | 2023 | Journal of Plant Physiology 287:154021 | Response to Tcherkez and Farquhar: Rubisco adaptation is more limited by phylogenetic constraint than by catalytic trade-off | none | Abs |
| [10.1073/pnas.2321050121](https://doi.org/10.1073/pnas.2321050121) | Bouvier | 2024 | Proceedings of the National Academy of Sciences 121:e2321050121 | Rubisco is evolving for improved catalytic efficiency and CO 2 assimilation in plants | none | Abs |
| [10.1038/s41477-017-0065-x](https://doi.org/10.1038/s41477-017-0065-x) | Busch | 2017 | Nature Plants 4:46-54 | Plants increase CO2 uptake by assimilating nitrogen via the photorespiratory pathway | none | Abs |
| [10.1111/pbi.70774](https://doi.org/10.1111/pbi.70774) | Cao | 2026 | Plant Biotechnology Journal :pbi.70774 | A Heat‐Inducible Rubisco Activase Safeguards Photosynthesis via Multilevel Regulation and Dual Function | none | Abs |
| [10.1111/pbi.13750](https://doi.org/10.1111/pbi.13750) | Cavanagh | 2022 | Plant Biotechnology Journal 20:711-721 | Alternative pathway to photorespiration protects growth and productivity at elevated temperatures in a model crop | none | FT |
| [10.1073/pnas.2523360123](https://doi.org/10.1073/pnas.2523360123) | Chaudhari | 2026 | Proceedings of the National Academy of Sciences 123:e2523360123 | Rewinding evolution in planta: A Rubisco-null platform validates high-performance ancestral enzymes | none | FT |
| [10.1038/s41467-023-37490-0](https://doi.org/10.1038/s41467-023-37490-0) | Chen | 2023 | Nature Communications 14:2118 | Engineering α-carboxysomes into plant chloroplasts to support autotrophic photosynthesis | none | Abs |
| [10.1093/plcell/koaf015](https://doi.org/10.1093/plcell/koaf015) | Chen | 2024 | The Plant Cell 37:koaf015 | Synthetic photorespiratory bypass improves rice productivity by enhancing photosynthesis and nitrogen uptake | none | Abs |
| [10.1111/pbi.70258](https://doi.org/10.1111/pbi.70258) | Chen | 2025 | Plant Biotechnology Journal 23:4712-4714 | Carbon‐positive photorespiratory bypass via the tartronyl‐coenzyme A pathway enhances carbon fixation efficiency and yield in rice | none | Meta |
| [10.1016/j.cj.2025.03.001](https://doi.org/10.1016/j.cj.2025.03.001) | Chen | 2026 | The Crop Journal 14:107-116 | A synthetic glycolate metabolism bypass in rice chloroplasts increases photosynthesis and yield | none | Meta (content via 2026 review FT) |
| [10.15252/embj.2019104081](https://doi.org/10.15252/embj.2019104081) | Davidi | 2020 | The EMBO Journal 39:EMBJ2019104081 | Highly active rubiscos discovered by systematic interrogation of natural sequence diversity | none | Abs |
| [10.1104/pp.30.1.82](https://doi.org/10.1104/pp.30.1.82) | Decker | 1955 | Plant Physiology 30:82-84 | A Rapid, Postillumination Deceleration of Respiration in Green Leaves. | none | Meta |
| [10.1104/pp.59.1.86](https://doi.org/10.1104/pp.59.1.86) | Ehleringer | 1977 | Plant Physiology 59:86-90 | Quantum Yields for CO 2 Uptake in C 3 and C 4 Plants | none | Abs |
| [10.1073/pnas.0807043105](https://doi.org/10.1073/pnas.0807043105) | Eisenhut | 2008 | Proceedings of the National Academy of Sciences 105:17199-17204 | The photorespiratory glycolate metabolism is essential for cyanobacteria and might have been conveyed endosymbiontically to plants | none | Abs |
| [10.1016/0968-0004(79)90212-3](https://doi.org/10.1016/0968-0004(79)90212-3) | Ellis | 1979 | Trends in Biochemical Sciences 4:241-244 | The most abundant protein in the world | none | Meta |
| [10.1111/tpj.14669](https://doi.org/10.1111/tpj.14669) | Fernie | 2020 | The Plant Journal 102:666-677 | Wasteful, essential, evolutionary stepping stone? The multiple personalities of the photorespiratory pathway | none | Abs |
| [10.1021/acs.biochem.9b00237](https://doi.org/10.1021/acs.biochem.9b00237) | Flamholz | 2019 | Biochemistry 58:3365-3376 | Revisiting Trade-offs between Rubisco Kinetic Parameters | none | FT |
| [10.1105/tpc.17.00256](https://doi.org/10.1105/tpc.17.00256) | Flügel | 2017 | The Plant Cell 29:2537-2551 | The Photorespiratory Metabolite 2-Phosphoglycolate Regulates Photosynthesis and Starch Accumulation in Arabidopsis | none | Abs |
| [10.1038/s41477-022-01294-9](https://doi.org/10.1038/s41477-022-01294-9) | Fu | 2022 | Nature Plants 9:169-178 | Integrated flux and pool size analysis in plant central metabolism reveals unique roles of glycine and serine during photorespiration | none | Abs |
| [10.1038/s41477-025-02091-w](https://doi.org/10.1038/s41477-025-02091-w) | Gashu | 2025 | Nature Plants 11:1877-1889 | Metabolic flux analysis in leaf metabolism quantifies the link between photorespiration and one carbon metabolism | none | Abs |
| [10.1093/jxb/erag322](https://doi.org/10.1093/jxb/erag322) | Gashu | 2026 | Journal of Experimental Botany 77:6408-6417 | Using high-throughput 13CO2 labeling to determine if photorespiration can be engineered to increase flux to one-carbon metabolism | none | Abs |
| [10.1016/j.semcdb.2023.04.003](https://doi.org/10.1016/j.semcdb.2023.04.003) | Gionfriddo | 2024 | Seminars in Cell & Developmental Biology 155:37-47 | Perspectives on improving crop Rubisco by directed evolution | none | Abs |
| [10.1038/s41477-025-02093-8](https://doi.org/10.1038/s41477-025-02093-8) | Gionfriddo | 2025 | Nature Plants 11:1939-1950 | Laboratory evolution of Rubisco solubility and catalytic switches to enhance plant productivity | correction: 10.1038/s41477-025-02136-0 | Abs |
| [10.1038/s41477-025-02136-0](https://doi.org/10.1038/s41477-025-02136-0) | Gionfriddo | 2025 | Nature Plants 11:2181-2181 | Author Correction: Laboratory evolution of Rubisco solubility and catalytic switches to enhance plant productivity | is a correction to 10.1038/s41477-025-02093-8 | Meta (content not read) |
| [10.1111/nph.70271](https://doi.org/10.1111/nph.70271) | Gjindali | 2025 | New Phytologist 247:1199-1217 | Two cowpea Rubisco activase isoforms for crop thermotolerance | none | Abs |
| [10.1007/978-1-0716-3802-6_9](https://doi.org/10.1007/978-1-0716-3802-6_9) | Gregory | 2024 | Methods in Molecular Biology :115-124 | Measuring and Quantifying Characteristics of the Post-illumination Burst | none | Abs |
| [10.1038/s41477-026-02222-x](https://doi.org/10.1038/s41477-026-02222-x) | Hankofer | 2026 | Nature Plants 12:653-664 | Photorespiration is linked to DNA methylation by formate as a one-carbon source | none | Abs |
| [10.1093/jxb/eraf289](https://doi.org/10.1093/jxb/eraf289) | Hotto | 2025 | Journal of Experimental Botany 76:5930-5945 | The α form of Rubisco activase supports photosynthesis during heat stress in the absence of the β form in Setaria viridis | none | Abs |
| [10.64898/2026.07.23.739952](https://doi.org/10.64898/2026.07.23.739952) | Jeong | 2026 |   | Chloroplast expression of Chlamydomonas glycolate dehydrogenase en route to an improved photorespiratory bypass | none | Meta (preprint, title only) |
| [10.1038/291513a0](https://doi.org/10.1038/291513a0) | Jordan | 1981 | Nature 291:513-515 | Species variation in the specificity of ribulose biphosphate carboxylase/oxygenase | none | Meta |
| [10.1007/bf00398720](https://doi.org/10.1007/bf00398720) | Jordan | 1984 | Planta 161:308-313 | The CO2/O2 specificity of ribulose 1,5-bisphosphate carboxylase/oxygenase | none | Abs |
| [10.1111/gbi.12243](https://doi.org/10.1111/gbi.12243) | Kacar | 2017 | Geobiology 15:628-640 | Constraining the timing of the Great Oxidation Event within the Rubisco phylogenetic tree | none | Abs |
| [10.1038/275741a0](https://doi.org/10.1038/275741a0) | Keys | 1978 | Nature 275:741-743 | Photorespiratory nitrogen cycle | none | Meta |
| [10.1093/jxb/ery370](https://doi.org/10.1093/jxb/ery370) | Levey | 2019 | Journal of Experimental Botany 70:575-587 | Efficient 2-phosphoglycolate degradation is required to maintain carbon assimilation and allocation in the C4 plant Flaveria bidentis | none | Abs |
| [10.1073/pnas.2510701122](https://doi.org/10.1073/pnas.2510701122) | Li | 2025 | Proceedings of the National Academy of Sciences 122:e2510701122 | Directed evolution of a plant Rubisco chaperone with altered client recognition | none | Abs |
| [10.1126/sciadv.abm6871](https://doi.org/10.1126/sciadv.abm6871) | Lin | 2022 | Science Advances 8:eabm6871 | Improving the efficiency of Rubisco by resurrecting its ancestors in the family Solanaceae | none | FT |
| [10.1111/pbi.70076](https://doi.org/10.1111/pbi.70076) | Lin | 2025 | Plant Biotechnology Journal 23:2526-2536 | Synthetic photorespiratory bypass more stably increases potato yield per plant by improving photosynthesis | none | Abs |
| [10.1016/j.celrep.2026.117609](https://doi.org/10.1016/j.celrep.2026.117609) | Luo | 2026 | Cell Reports 45:117609 | Chloroplast photorespiratory bypass in tomato couples carbon–nitrogen assimilation to increase yield and fruit quality | none | Abs |
| [10.1073/pnas.2505083122](https://doi.org/10.1073/pnas.2505083122) | McDonald | 2025 | Proceedings of the National Academy of Sciences 122:e2505083122 | In vivo directed evolution of an ultrafast Rubisco from a semianaerobic environment imparts oxygen resistance | none | Abs + FT |
| [10.1126/sciadv.aeh3246](https://doi.org/10.1126/sciadv.aeh3246) | McDonald | 2026 | Science Advances 12:eaeh3246 | Machine learning–assisted directed evolution of plant Rubisco | none | FT |
| [10.1111/gcb.17595](https://doi.org/10.1111/gcb.17595) | Meacham‐Hensold | 2024 | Global Change Biology 30:e17595 | Shortcutting Photorespiration Protects Potato Photosynthesis and Tuber Yield Against Heatwave Stress | none | FT |
| [10.1111/nph.70724](https://doi.org/10.1111/nph.70724) | Meacham‐Hensold | 2026 | New Phytologist 249:675-690 | Shortcutting photorespiration: avenues and challenges toward realizing higher‐yielding photorespiratory bypass crops | correction: 10.1111/nph.71182 | FT |
| [10.1111/ppl.70539](https://doi.org/10.1111/ppl.70539) | Mortezazadeh | 2025 | Physiologia Plantarum 177:e70539 | A Functional Photorespiratory Cycle Is Essential for Light‐Dependent Stomata Opening in Epidermal Peels of Arabidopsis thaliana | none | Abs |
| [10.1038/newbio230159a0](https://doi.org/10.1038/newbio230159a0) | Ogren | 1971 | Nature New Biology 230:159-160 | Ribulose Diphosphate Carboxylase regulates Soybean Photorespiration | none | Meta |
| [10.1023/A:1024913925002](https://doi.org/10.1023/A:1024913925002) | Ogren | 2003 | Photosynthesis Research 76:53-63 | Affixing the O to Rubisco: discovering the source of photorespiratory glycolate and its regulation | none | Abs |
| [10.1073/pnas.1215142110](https://doi.org/10.1073/pnas.1215142110) | Pick | 2013 | Proceedings of the National Academy of Sciences 110:3185-3190 | PLGG1 , a plastidic glycolate glycerate transporter, is required for photorespiration and defines a unique class of metabolite transporters | none | Abs |
| [10.1038/s41586-024-08455-0](https://doi.org/10.1038/s41586-024-08455-0) | Prywes | 2025 | Nature 638:823-828 | A map of the rubisco biochemical landscape | correction: 10.1038/s41586-025-08707-7 | Abs (23 Oct: FT) |
| [10.1038/s41586-025-08707-7](https://doi.org/10.1038/s41586-025-08707-7) | Prywes | 2025 | Nature 638:E47-E47 | Author Correction: A map of the rubisco biochemical landscape | is a correction to 10.1038/s41586-024-08455-0 | Meta (23 Oct: affiliations only) |
| [10.1111/pce.14051](https://doi.org/10.1111/pce.14051) | Qu | 2021 | Plant, Cell & Environment 44:2308-2320 | Overexpression of both Rubisco and Rubisco activase rescues rice photosynthesis and biomass under heat stress | none | Abs |
| [10.1093/jxb/erac340](https://doi.org/10.1093/jxb/erac340) | Qu | 2023 | Journal of Experimental Botany 74:591-599 | Improving plant heat tolerance through modification of Rubisco activase in C3 plants to secure crop yield and food security in a future warming world | none | Abs |
| [10.1111/nph.18394](https://doi.org/10.1111/nph.18394) | Raines | 2022 | New Phytologist 236:350-356 | Improving plant productivity by re‐tuning the regeneration ofRuBPin the Calvin–Benson–Bassham cycle | none | FT |
| [10.1111/nph.20298](https://doi.org/10.1111/nph.20298) | Salesse‐Smith | 2025 | New Phytologist 245:951-965 | Increasing Rubisco as a simple means to enhance photosynthesis and productivity now without lowering nitrogen use efficiency | none | Abs |
| [10.1073/pnas.0911663107](https://doi.org/10.1073/pnas.0911663107) | Savir | 2010 | Proceedings of the National Academy of Sciences 107:3475-3480 | Cross-species analysis traces adaptation of Rubisco toward optimality in a low-dimensional landscape | none | Abs |
| [10.1038/s41467-023-38496-4](https://doi.org/10.1038/s41467-023-38496-4) | Scafaro | 2023 | Nature Communications 14:2820 | Rubisco deactivation and chloroplast electron transport rates co-limit photosynthesis above optimal leaf temperature in terrestrial plants | none | Abs |
| [10.1038/s44318-024-00311-1](https://doi.org/10.1038/s44318-024-00311-1) | Schulz | 2024 | The EMBO Journal 44:269-280 | Layered entrenchment maintains essentiality in the evolution of Form I Rubisco complexes | none | Abs |
| [10.1016/j.molp.2018.11.013](https://doi.org/10.1016/j.molp.2018.11.013) | Shen | 2019 | Molecular Plant 12:199-214 | Engineering a New Chloroplastic Photorespiratory Bypass to Increase Photosynthetic Efficiency and Productivity in Rice | none | Abs |
| [10.1038/ncomms10382](https://doi.org/10.1038/ncomms10382) | Shih | 2016 | Nature Communications 7:10382 | Biochemical characterization of predicted Precambrian RuBisCO | none | Abs |
| [10.1038/280833a0](https://doi.org/10.1038/280833a0) | Somerville | 1979 | Nature 280:833-836 | A phosphoglycolate phosphatase-deficient mutant of Arabidopsis | none | Meta |
| [10.1126/science.aat9077](https://doi.org/10.1126/science.aat9077) | South | 2019 | Science 363:eaat9077 | Synthetic glycolate metabolism pathways stimulate crop growth and productivity in the field | none | FT (author manuscript) |
| [10.1016/j.cub.2024.06.024](https://doi.org/10.1016/j.cub.2024.06.024) | Taylor-Kearney | 2024 | Current Biology 34:R764-R767 | Evolution and origins of rubisco | none | Abs |
| [10.1073/pnas.0600605103](https://doi.org/10.1073/pnas.0600605103) | Tcherkez | 2006 | Proceedings of the National Academy of Sciences 103:7246-7251 | Despite slow catalysis and confused substrate specificity, all ribulose bisphosphate carboxylases may be nearly perfectly optimized | none | Abs |
| [10.1016/j.jplph.2021.153554](https://doi.org/10.1016/j.jplph.2021.153554) | Tcherkez | 2021 | Journal of Plant Physiology 267:153554 | Rubisco catalytic adaptation is mostly driven by photosynthetic conditions – Not by phylogenetic constraints | none | Abs |
| [10.1105/tpc.108.062265](https://doi.org/10.1105/tpc.108.062265) | Timm | 2008 | The Plant Cell 20:2848-2859 | A Cytosolic Pathway for the Conversion of Hydroxypyruvate to Glycerate during Photorespiration in Arabidopsis | none | Abs |
| [10.1111/j.1438-8677.2012.00691.x](https://doi.org/10.1111/j.1438-8677.2012.00691.x) | Timm | 2013 | Plant Biology 15:737-747 | The variety of photorespiratory phenotypes – employing the current status for future research directions on photorespiration | none | Abs |
| [10.3390/plants8120563](https://doi.org/10.3390/plants8120563) | Timm | 2019 | Plants 8:563 | Faster Removal of 2-Phosphoglycolate through Photorespiration Improves Abiotic Stress Tolerance of Arabidopsis | none | Abs |
| [10.1007/s00425-026-04989-x](https://doi.org/10.1007/s00425-026-04989-x) | Timm | 2026 | Planta 263:114 | Arabidopsis photorespiration is not limited by mitochondrial serine hydroxymethyltransferase 1 | none | Abs |
| [10.1007/s00425-025-04834-7](https://doi.org/10.1007/s00425-025-04834-7) | von Caemmerer | 2025 | Planta 262:115 | A perspective: A biochemical model of photosynthetic CO2 assimilation in leaves of C3 species (Planta 149, 78–90) | none | FT |
| [10.1146/annurev-arplant-043015-111709](https://doi.org/10.1146/annurev-arplant-043015-111709) | Walker | 2016 | Annual Review of Plant Biology 67:107-129 | The Costs of Photorespiration to Food Production Now and in the Future | none | Abs |
| [10.1111/pce.14949](https://doi.org/10.1111/pce.14949) | Walker | 2024 | Plant, Cell & Environment 47:3365-3374 | Re‐evaluating the energy balance of the many routes of carbon flow through and from photorespiration | none | Abs |
| [10.1007/s00425-026-04961-9](https://doi.org/10.1007/s00425-026-04961-9) | Walker | 2026 | Planta 263:94 | Understanding plant resilience by putting photosynthesis and photorespiration in the metabolic context | none | Abs |
| [10.1016/j.molp.2020.10.007](https://doi.org/10.1016/j.molp.2020.10.007) | Wang | 2020 | Molecular Plant 13:1802-1815 | A Synthetic Photorespiratory Shortcut Enhances Photosynthesis to Boost Biomass and Grain Yield in Rice | none | Abs |
| [10.1007/978-3-642-47774-4_26](https://doi.org/10.1007/978-3-642-47774-4_26) | Warburg | 1928 | Über die Katalytischen Wirkungen der Lebendigen Substanz :341-366 | Über die Geschwindigkeit der photochemischen Kohlensäurezersetzung in lebenden Zellen. II | none | Meta (1928 reprint) |
| [10.1104/pp.114.248013](https://doi.org/10.1104/pp.114.248013) | Xin | 2015 | Plant Physiology 167:574-585 | The Benefits of Photorespiratory Bypasses: How Can They Work? | none | Abs |
| [10.1016/j.xplc.2023.100641](https://doi.org/10.1016/j.xplc.2023.100641) | Xu | 2023 | Plant Communications 4:100641 | A synthetic light-inducible photorespiratory bypass enhances photosynthesis to improve rice growth and grain yield | none | Abs |
| [10.1038/s41477-023-01436-7](https://doi.org/10.1038/s41477-023-01436-7) | Zhou | 2023 | Nature Plants 9:978-986 | Grafting Rhodobacter sphaeroides with red algae Rubisco to accelerate catalysis and plant growth | none | Abs |
| [10.1126/science.aay8818](https://doi.org/10.1126/science.aay8818) | — | 2019 | Science 365:eaay8818 | Erratum for the Research Article “Synthetic glycolate metabolism pathways stimulate crop growth and productivity in the field” by P. F. South, A. P. Cavanagh, H. W. Liu, D. R. Ort | none | Meta (content not readable) |
| [10.1111/nph.71182](https://doi.org/10.1111/nph.71182) | — | 2026 | New Phytologist 251:589-589 | Correction to ‘Shortcutting photorespiration: avenues and challenges toward realizing higher‐yielding photorespiratory bypass crops’ | is a correction to 10.1111/nph.70724 | FT (PMC page) |

Notes:
- South 2019 lists no "updated-by" on Crossref, but an erratum exists (10.1126/science.aay8818, also in the register); its content is unread.
- Prywes 2025's correction (10.1038/s41586-025-08707-7) concerns affiliations only (23 Oct).
- Years are Crossref's: Busch was online December 2017 (issue 2018); Fu online 2022 (issue 2023); Chen G *Plant Cell* online 2024 (issue 2025); Chen X *Crop J* online 2025 (issue 2026).
- Not on Crossref: Warburg 1920, *Biochem Z* 103 (only the 1928 reprint is registered).

## Appendix B: Unverified (keep off the slides until checked)

- **Corrections not read**
  - South 2019 erratum: content.
  - Gionfriddo 2025 author correction: content.
- **Primary history papers seen only as titles (Meta)**
  - Warburg 1920: the original *Biochem Z* paper. Only its title is checked (via the 1928 reprint); the O₂-inhibition finding is TB.
  - Somerville & Ogren 1979: the data themselves (2-PG build-up, death in air) were not read. Support is the title and the Ogren 2003 abstract.
  - Keys 1978, Decker 1955, Jordan & Ogren 1981, Ellis 1979: content comes from secondary accounts or TB.
- **Numbers taken from a secondary source or not read**
  - Chen X 2026 (AP3 in rice): "up to 35 %" is from the 2026 review only.
  - Chen G 2025 (tartronyl-CoA bypass in rice): title only.
  - Walker 2016 full text: whether it states the temperature mechanism.
  - Flügel 2017: inhibition constants and how large the effect is in planta.
  - Rubisco's share of leaf nitrogen: not checked. Salesse-Smith 2025 says only "a major component".
- **Open from 23 Oct**
  - RIPE programme status after 2026.
  - Γ\* at 25 °C from Bernacchi 2001/2002 (full texts not obtainable). Reviewer D reports Γ\* ≈ 40 µmol mol⁻¹ from Busch 2024 (FT); I did not re-read it.
