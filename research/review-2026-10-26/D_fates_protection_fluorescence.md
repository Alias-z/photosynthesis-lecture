# Block D review: excitation fates, photoprotection, fluorescence, light-response curve

Reviewer: Claude, 26 Oct 2026.

**Scope.** I checked these sources:
- the `PLATE` texts of `l12.ts`–`l15.ts`;
- the figure labels where they make a factual claim;
- `beats.ts` export `FATES`;
- `ANIM_PIGMENTS_FATES.md`, Animation 4.

I did not repeat the 23 Oct findings (`review-2026-10-23-claude/C_L12-L15.md`, `REVIEW_SUMMARY.md`); where a row depends on one, it says "23 Oct". No project file other than this report was changed.

**Evidence levels.**
- A: I read the full text (or the relevant sections).
- B: I read the abstract or the publisher page.
- C: metadata only.
- S: secondary source or search snippet only.

Every DOI below resolved on Crossref today; see the Appendix.

## Top fixes

1. **Trapping time (L12 figures, Animation 4 beat 3).** "Charge separation < 100 ps" is the value for an isolated PSII *core*. In a leaf's thylakoids with open centres, the average is 300–400 ps; the slide's own source, van Amerongen & Croce 2013, says so. Write "within a few hundred picoseconds (≈ 0.3 ns)".
2. **Carotenoids and triplets (L12 point 3, FATES beat 6).** "Carotenoids quench both" holds in the antenna, where carotenoids catch more than 95 % of Chl triplets. It fails in the PSII reaction centre: the β-carotenes there are too far from P680 to quench its triplet, and that triplet is the main source of ¹O₂. Also change "rarely" to "when excitation lingers".
3. **PsbS and "fast on, slow off" (L13 points 1–2).**
   - PsbS senses the low pH and triggers quenching. The quenching itself happens in the antenna (LHCII).
   - Only the zeaxanthin part is slow: it builds up and relaxes with time constants of 10–15 min. qE switches on and off within about a minute.
   - The cost to CO₂ fixation is a model estimate: 13–32 % of canopy carbon gain.
4. **FLEX (L14).** Confirmed: FLEX launched on 15 Sep 2026 on Vega-C VV30, together with Sentinel-3C. It is now in a planned 3-month commissioning, and I found no data release. Keep "launched"; do not promise data.
5. **Initial slope (L15 point 1) and gaps.**
   - The initial slope equals the quantum yield only when plotted per *absorbed* photon, and only above the Kok break.
   - Two "must" gaps: fluctuating light as the normal state of a canopy leaf, and the efficiency ceiling (4.6 % C₃, 6 % C₄).

---

## 1. Claim check

| # | Where | Claim | Verdict | Evidence | Suggested wording |
|---|---|---|---|---|---|
| 1 | FATES beat 1; L12 figs | Absorption in femtoseconds | OK | Standard photophysics | — |
| 2 | L12 point 1; FATES beat 2; figs | S₂→S₁ (blue → red state) as heat in < 1 ps | OK | Soret→Qy takes 146–260 fs in solvents ([Shi 2005](https://doi.org/10.1016/j.cplett.2005.05.017), S). Q-band internal conversion takes ~170 fs ([Meneghin 2017](https://doi.org/10.1038/s41598-017-11621-2), S) | Keep "< 1 ps" |
| 3 | L12 point 1 | "Photons count, not their energy" | IMPRECISE | True for photons that reach Chl. Per photon absorbed by the *leaf*, blue gives less CO₂ than red, because carotenoids and non-photosynthetic pigments absorb part of the blue light ([Hogewoning 2012 Plant Cell](https://doi.org/10.1105/tpc.112.097972), B; [McCree 1971](https://doi.org/10.1016/0002-1571(71)90022-7), S) | "…so every photon that reaches chlorophyll counts the same, whatever its colour." |
| 4 | L12 figs ("< 100 ps" badges); ANIM script beat 3 | Open RC: charge separation < 100 ps | IMPRECISE | "< 100 ps" is the isolated cyanobacterial PSII core. The same review gives 300–400 ps average for thylakoids with open RCs ([van Amerongen & Croce 2013](https://doi.org/10.1007/s11120-013-9824-3), A). Plant supercomplexes: 109–158 ps; ~330 ps with extra LHCII ([Caffarri 2011](https://doi.org/10.1016/j.bpj.2011.03.049), A). Primary charge separation in the RC itself takes ~2–3 ps (Caffarri 2011) | "An open reaction centre traps it within a few hundred picoseconds (≈ 0.3 ns)." The message, much faster than the ns exits, still holds |
| 5 | L12 lead; figs | S₁ lasts nanoseconds | OK | Fm lifetime ≈ 2 ns in thylakoids; isolated LHCII 4 ns ([Belgio 2012](https://doi.org/10.1016/j.bpj.2012.05.004), B). Free Chl: "several ns" (vAC 2013, A). **Teaching bonus for L14:** Fv/Fm ≈ 1 − τ(open)/τ(closed) ≈ 1 − 0.35/2 ≈ 0.83. This is my derivation from these two numbers, and it matches 0.8 | — |
| 6 | L12 figs; ANIM beat 6 | Triplet lasts µs and longer | OK | ³P680: 1 ms without O₂, 33 µs in air. Antenna ³Chl is handed to carotenoids on a ns time scale ([Telfer 2014](https://doi.org/10.1093/pcp/pcu040), A) | — |
| 7 | FATES beat 6 | "Rarely, a triplet forms" | IMPRECISE | Triplet formation competes for the same ns S₁ lifetime as fluorescence. It therefore rises when RCs close and falls when NPQ shortens the lifetime; this was shown in vivo in moss ([Carbonera 2012](https://doi.org/10.1016/j.bbabio.2012.05.007), S). Do not print a triplet yield: published Chl a intersystem-crossing yields disagree (≈ 0.3 vs higher older values; UNVERIFIED) | "When excitation lingers, some of it becomes a long-lived triplet." |
| 8 | L12 point 3; FATES beat 6 | ³Chl → ¹O₂; "carotenoids quench both" | IMPRECISE (missing the key exception) | Antenna: carotenoids in van der Waals contact scavenge > 95 % of Chl triplets (vAC 2013, A). PSII RC: the β-carotenes "cannot be invoked to quench directly any ³P680". ³P680 forms by charge recombination and is the main ¹O₂ source; the β-carotenes quench only part of that ¹O₂ (Telfer 2014, A; [Telfer 2002](https://doi.org/10.1098/rstb.2002.1139), S) | L12: "In the antenna, carotenoids catch triplets before they reach O₂. In the PSII reaction centre they cannot, so singlet oxygen forms there and damages D1." Beat 6: "When excitation lingers, a triplet can form and make singlet oxygen. Carotenoids catch most triplets in the antenna, but not in the reaction centre." |
| 9 | L12 figs; L14 lead and figs | Fluorescence ≈ 685 nm; 0.5–3 % | OK | "Typical values under steady-state illumination of 0.5–3%", never above 10 %. PSII peaks ~685 nm; PSI peaks at 730 nm ([Porcar-Castell 2014](https://doi.org/10.1093/jxb/eru191), A) | L14 lead: "red fluorescence" → "red and far-red fluorescence" |
| 10 | L13 point 1 | PsbS "with zeaxanthin, turns excess excitation into heat" | IMPRECISE | PsbS is the pH sensor and trigger; quenching happens in antenna complexes, mostly LHCII ([vAC 2025](https://doi.org/10.1093/plcell/koaf240), A; [Nicol 2026](https://doi.org/10.1038/s41467-026-74992-z), A per 23 Oct). qE still forms without Zx, at lower amplitude, in *npq1* ([Niyogi 1998](https://doi.org/10.1105/tpc.10.7.1121), C) | "PsbS senses the low pH and switches the antenna into a heat-dissipating state; zeaxanthin strengthens and prolongs it." |
| 11 | L13 (comments, time-course fig) | Components qE / qZ / qT / qI | OK (not on the plate) | qZ forms with a rise time of 10–15 min and relaxes with a 10–15 min lifetime. It is distinct from qE, qT and qI ([Nilkens 2010](https://doi.org/10.1016/j.bbabio.2010.01.001), B). qH (sustained) per 23 Oct | Optional curve labels: "qE: seconds" / "zeaxanthin part: 10–15 min" |
| 12 | L13 point 2 | "Fast on, slow off": relaxes slowly in shade, lowering CO₂ fixation | IMPRECISE | qE switches off within about a minute; the Zx-dependent part lingers (Nilkens 2010). The cost is **modelled**: 12.8–32 % of canopy carbon gain, depending on temperature and species ([Zhu 2004](https://doi.org/10.1093/jxb/erh141), B). For all slow adjustments together (NPQ, Rubisco activation, stomata) the calculated cost is 10–40 % ([Long 2022](https://doi.org/10.1146/annurev-arplant-070221-024745), B) | "Quenching switches on in seconds to minutes. Its fast part switches off within a minute, but the zeaxanthin part lingers 10–15 min in shade and costs CO₂ fixation." |
| 13 | L13 figure (VPZ cards) | Tobacco +15 %; soybean year 1 up to +33 %, year 2 none; potato none; rice impaired; soybean 2026 no seed gain | MOSTLY OK; 3 edits | (a) **Potato:** the paper says yield was unaltered in constant light and *reduced* in fluctuating light ([Lehretz 2022](https://doi.org/10.1111/jipb.13320), C, title). (b) Add **Arabidopsis 2020, impaired** ([Garcia-Molina & Leister](https://doi.org/10.1038/s41477-019-0572-z), C). (c) The positive results (tobacco, soybean 2020) all come from the RIPE consortium. Independent groups found no gain or impaired growth: Arabidopsis, potato, and rice ([Zheng 2026](https://doi.org/10.1111/pce.70245), B). RIPE's own 2021 SoyFACE trial was null ([Singh 2026](https://doi.org/10.1111/pce.70608), B). New C₄ data are preprints only (§4) | Potato card: "no gain; lower in fluctuating light" |
| 14 | L13 point 3; figs | D1 damaged at any light; photoinhibition = damage outpaces repair | OK | [Tyystjärvi & Aro 1996](https://doi.org/10.1073/pnas.93.5.2213); [Komenda 2024](https://doi.org/10.1093/plcell/koae082) (23 Oct) | Optional: "…damaged at a rate proportional to light" |
| 15 | L14 point 1 | Fv/Fm ≈ 0.8 = PSII maximum yield (dark) | OK | 23 Oct (0.81–0.83 by PAM; PSI adds to Fo). Lifetime check in row 5 | — |
| 16 | L14 figure (dark test) | After ≥ 20 min dark, a "regulating" leaf returns to ~0.8; a photoinhibited leaf stays low | IMPRECISE | Low Fv/Fm after dark ≠ necessarily damage. Zx-dependent and sustained quenching persist: winter evergreens keep Zx and depressed PSII efficiency for weeks ([Adams 2002](https://doi.org/10.1055/s-2002-35434), S; [Verhoeven 2014](https://doi.org/10.1111/nph.12466), C). qH needs LCNP and relaxes slowly ([Malnoë 2018](https://doi.org/10.1105/tpc.17.00536), C) | "Stays low after dark: damaged PSII *or* locked-in quenching; both recover over hours or longer." |
| 17 | L14 point 2 | ΦPSII = (Fm′ − Fs)/Fm′; Fm′ < Fm reveals NPQ | OK | 23 Oct. Fm′ < Fm also contains qT and qI, but NPQ is defined to include them | — |
| 18 | L14 (header only) | ETR ≈ ΦPSII × PPFD × 0.84 × 0.5, factors assumed | OK, not on the slide | 23 Oct; nothing new | — |
| 19 | L14 point 3 | Reads PSII, not CO₂ uptake | OK | 23 Oct | — |
| 20 | L14 figs | SIF from orbit since 2011; **FLEX launched 15 Sep 2026**, "first mission built for it" | OK (now verified) | ESA: Vega-C VV30 lifted off 15 Sep 2026, 03:21 CEST, with Sentinel-3C; FLEX initially flies in tandem with Sentinel-3A, later Sentinel-3C ([ESA press release](https://www.esa.int/Newsroom/Press_Releases/FLEX_and_Sentinel-3C_launched)). FLORIS instrument: 814 km, ~300 m pixels, 500–780 nm; 3-month commissioning, 3.5-year mission ([eoPortal](https://www.eoportal.org/satellite-missions/flex), S). **No first-light or data release found on ESA pages (UNVERIFIED)** | Keep. If shown: "in commissioning; first data expected after that" |
| 21 | L15 point 3 | Blackman 1905 sharp corner; real curves smooth | OK | 23 Oct. New history angle in §3 | — |
| 22 | L15 fig G | Quantum yield 0.052 (C₃ air), 0.073 (C₃ 2 % O₂), ≈ 0.053 (C₄), 30 °C | OK | Abstract: C₃ 0.0524 ± 0.0014 and 0.0733 ± 0.0008; C₄ 0.0534 / 0.0538 mol CO₂ per **absorbed** einstein. C₃ yield depends strongly on temperature and CO₂; C₄ does not ([Ehleringer & Björkman 1977](https://doi.org/10.1104/pp.59.1.86), B) | G label: "mol CO₂ per mol **absorbed** photons" |
| 23 | L15 point 1 | "The initial slope is the quantum yield" | IMPRECISE | Only on an absorbed-photon axis; against incident light it is the "apparent" yield (× absorptance ~0.84). Only above the Kok break: at the lowest light the slope is steeper, partly because day respiration is suppressed and partly through malate metabolism ([Kok 1949](https://doi.org/10.1016/0006-3002(49)90136-5), C; [Gauthier 2020](https://doi.org/10.1111/nph.16756), B) | "Just above the lowest light, the slope per photon absorbed is the quantum yield." |
| 24 | L15 point 2 | Electron transport, Rubisco or sugar export set the plateau | OK | 23 Oct | Optional: "Rubisco and CO₂ supply" |
| 25 | FATES beats 3–5 | Open RC → photochemistry; closed → more fluorescence; NPQ → heat | OK | Open-RC photochemistry ≈ 80–85 % (= Fv/Fm). Closing RCs also raises triplets (row 7) | — |
| 26 | L13 figure (story) | "1962 the xanthophyll cycle" | IMPRECISE (credit) | Sapozhnikov reported the light-driven violaxanthin loss in 1957 ([his account, 1973](https://doi.org/10.1351/pac197335010047), C); [Yamamoto 1962](https://doi.org/10.1016/0003-9861(62)90060-7) | "1957–62 (Sapozhnikov; Yamamoto)" |

---

## 2. Missing topics

| Topic | Rank | One line | Source |
|---|---|---|---|
| **Fluctuating light** | **must** | Canopy leaves rarely see constant light. Each sun–shade switch takes minutes to readjust (NPQ, Rubisco, stomata), at a calculated 10–40 % of potential CO₂ uptake. This is why "slow off" matters | [Long 2022 Annu Rev Plant Biol](https://doi.org/10.1146/annurev-arplant-070221-024745) (B) |
| **Efficiency ceiling** | **must** | Theoretical maximum solar-to-biomass conversion: 4.6 % (C₃), 6 % (C₄). Fits L15, right after the quantum yield | [Zhu, Long & Ort 2008](https://doi.org/10.1016/j.copbio.2008.02.004) (B, 23 Oct) |
| PSI vs PSII photoinhibition | nice (L11 has PSI protection) | PSII is often damaged but repaired fast. PSI is damaged less often but recovers extremely slowly, so plants reorganise around it rather than repair it. PSI photoinhibition is now seen under many conditions, not only chilling | [Lempiäinen 2022 PCE](https://doi.org/10.1111/pce.14400) (B); [Sonoike 2025 PCP](https://doi.org/10.1093/pcp/pcaf079) (B) |
| State transitions (qT) | nice | In weak or unbalanced light, the STN7 kinase moves LHCII from PSII to PSI. This matters little in strong light | [Bellafiore 2005 Nature](https://doi.org/10.1038/nature03286) (C); structure: [Pan 2018 Science](https://doi.org/10.1126/science.aat1156) (C) |
| Chloroplast avoidance movement | nice; benefit contested | In strong blue light, chloroplasts move to cell walls and absorb less. Mutants were more damaged in one study ([Kasahara 2002 Nature](https://doi.org/10.1038/nature01213), B); another found no effect on high-light tolerance or NPQ | [Wilson & Ruban 2020 Plant Physiol](https://doi.org/10.1104/pp.20.00549) (B) |
| Sustained quenching (winter evergreens, qH) | nice | Evergreens keep zeaxanthin and quenching through winter. qH requires LCNP. Also links to row 16 | [Verhoeven 2014](https://doi.org/10.1111/nph.12466) (C); [Malnoë 2018](https://doi.org/10.1105/tpc.17.00536) (C) |
| ¹O₂ as a signal | nice | Carotenoid oxidation products such as β-cyclocitral relay ¹O₂ stress to gene expression | [Ramel 2012 PNAS](https://doi.org/10.1073/pnas.1115982109) (C) |
| Sun vs shade leaves | nice | Shade leaves saturate at lower light with a lower plateau; the initial slope is similar | [Boardman 1977 Annu Rev Plant Physiol](https://doi.org/10.1146/annurev.pp.28.060177.002035) (C) |
| C₃ quantum yield vs temperature | nice | The C₃ yield falls as leaves warm (more photorespiration); the C₄ yield does not. They are equal at 30 °C. Bridge to lecture 2 | [Ehleringer & Björkman 1977](https://doi.org/10.1104/pp.59.1.86) (B) |

---

## 3. History stories (new angles; the 23 Oct stories are not repeated)

**1. Seen with bare eyes (1931) → seen from 814 km (2026).**
- **Then.** In a darkened room in Heidelberg, Kautsky and Hirsch lit a dark-adapted leaf with a UV quartz lamp. They watched its red glow by **bare eye**: it jumped within a second, then sank over minutes. They read it rightly: "the larger the fraction … converted into chemical energy, the smaller the fluorescence" ([Kautsky & Hirsch 1931](https://doi.org/10.1007/BF01516164); account and translation in [Schreiber & Lichtenthaler 2025](https://doi.org/10.32615/ps.2025.007), A).
- That same year Kautsky found diffusible "active" oxygen ([Kautsky & de Bruijn 1931](https://doi.org/10.1007/BF01516190)). It was doubted for about 30 years until [Foote & Wexler 1964](https://doi.org/10.1021/ja01072a060) confirmed singlet oxygen.
- **Middle.** The PAM fluorometer ([Schreiber 1986](https://doi.org/10.1007/BF00024185)) let Demmig et al. show the next year that zeaxanthin tracks the quenching ([Demmig 1987](https://doi.org/10.1104/pp.84.2.218), B).
- **Now.** FLEX launched on 15 Sep 2026.
- **Why it works.** One glow links L12 (¹O₂), L13 (zeaxanthin) and L14 (fluorescence).

**2. The "Blackman reaction" → the plateau of L15.**
- **Then.** Blackman and Matthaei (1905) saw that temperature mattered only in strong light ([Matthaei 1905](https://doi.org/10.1098/rstb.1905.0005); [Blackman 1905](https://doi.org/10.1093/oxfordjournals.aob.a089000)).
- Emerson & Arnold used flashing light to show that this temperature-sensitive step runs on in the dark. They called it "what has hitherto been known as the Blackman reaction" ([Emerson & Arnold 1932](https://doi.org/10.1085/jgp.15.4.391), A). Hence the old textbook term "dark reactions".
- **Now.** That step is the Calvin–Benson cycle, with its Rubisco, RuBP-regeneration and TPU limits in FvCB ([Yin 2021](https://doi.org/10.1111/pce.14070)). The cycle is light-regulated, so "dark" is a misnomer.
- **Why it works.** It explains *why* the curve has a plateau, not just that it does.

**3. Four photons or eight? (1923–1970) → the slope on L15.**
- **Then.** From 1923 until his death in 1970, Nobel laureate Otto Warburg insisted that about 4 quanta make one O₂. From the late 1930s Emerson's group measured 8–12. The dispute was settled in Emerson's favour once the two-photosystem scheme was understood ([Hill & Govindjee 2014](https://doi.org/10.1007/s11120-014-0014-8), B).
- **Now.** Across 37 C₃ species, 0.106 O₂ per absorbed photon (≈ 9.4 photons) was measured ([Björkman & Demmig 1987](https://doi.org/10.1007/BF00402983)). For CO₂ in air the yield is only 0.052 (≈ 19 photons), and photorespiration takes the difference (row 22).
- **Why it works.** Students can check the L15 slope against a famous fight, and it sets up lecture 2.

---

## 4. Latest findings (2022–2026), one line each

- **FLEX launched (Sep 2026).** The first dedicated fluorescence satellite launched with Sentinel-3C and is now in commissioning. No data were released as of 26 Oct (UNVERIFIED beyond ESA pages) ([ESA](https://www.esa.int/Newsroom/Press_Releases/FLEX_and_Sentinel-3C_launched)).
- **SIF reads physiology fast (2026).** Globally, SIF/APAR ("fluorescence efficiency") responds to drought within ~3 days; canopy structure changes after ~12 days ([Tang 2026 Nat Commun](https://doi.org/10.1038/s41467-026-70076-0), B). *Contested:* satellite SIF reconstructions miss stomatal responses because canopy structure dominates the signal ([Zhao 2025 Commun Earth Environ](https://doi.org/10.1038/s43247-025-03035-0), S). See also the 23 Oct Martini vs Antala debate.
- **pH alone does not quench LHCII (2026).** 2D-IR shows that acidification changes LHCII's structure, but its light harvesting is unaffected. This fits PsbS as the trigger ([Do, Hajduk, Croce & Kennis 2026 PCCP](https://doi.org/10.1039/d6cp00501b), B). *Contested* against the cryo-EM "photo-protecting" LHCII state at low pH ([Ruan 2023 Nat Plants](https://doi.org/10.1038/s41477-023-01500-2)).
- **VPZ in a C₄ plant (preprints).** In *Setaria*, VPZ sped up NPQ induction but *slowed* relaxation. Lines still grew better, especially at high temperature ([Milburn 2025 bioRxiv](https://doi.org/10.1101/2025.01.12.632622), S; also [Stone 2024 bioRxiv](https://doi.org/10.1101/2024.12.23.630197), C). **PREPRINTS, not peer-reviewed.**
- **NPQ engineering review (2026).** Gains "vary across species"; the authors call for species- and environment-specific strategies ([Beraldo, Alboresi & Morosinotto 2026 Curr Opin Biotechnol](https://doi.org/10.1016/j.copbio.2025.103424), B).
- **Natural variation instead of transgenes (2024).** An NPQ-kinetics GWAS in sorghum and maize found **NYE1**, the stay-green gene behind one of **Mendel's pea traits**, and confirmed its effect on NPQ kinetics in Arabidopsis ([Sahay 2024 Plant J](https://doi.org/10.1111/tpj.16967), B). A good lecture hook.
- **PSI photoinhibition (2022–2025).** It is an intrinsic, widespread property, not a chilling oddity ([Sonoike 2025 PCP](https://doi.org/10.1093/pcp/pcaf079), B). Plants acclimate to lost PSI (more b₆f and ATP synthase) instead of repairing it quickly ([Lempiäinen 2022 PCE](https://doi.org/10.1111/pce.14400), B).
- **Already in the 23 Oct review, still current:**
  - Rice VPZ impaired ([Zheng 2026](https://doi.org/10.1111/pce.70245)).
  - Soybean VPZ no gain at ambient or elevated CO₂ ([Singh 2026](https://doi.org/10.1111/pce.70608)).
  - C₄ species relax NPQ faster than C₃ ([Arce Cubas 2026 PNAS](https://doi.org/10.1073/pnas.2621033123)).
  - LHCII carries most NPQ ([Nicol 2026](https://doi.org/10.1038/s41467-026-74992-z)).
  - SOQ1 as a methionine sulfoxide reductase (preprint).

**UNVERIFIED and kept off the slides:**
- the triplet (intersystem-crossing) yield of Chl a;
- any FLEX first-light date;
- the "creeping bentgrass VPZ" result (cited second-hand only, in Singh 2026);
- the cost of blue vs red per absorbed photon as a single percentage.

---

## Appendix: Crossref check (title, journal, year as returned; titles shortened)

| DOI | Title | Journal | Year |
|---|---|---|---|
| 10.1007/s11120-013-9824-3 | Light harvesting in photosystem II | Photosynthesis Research | 2013 |
| 10.1016/j.bpj.2011.03.049 | Excitation Energy Transfer and Trapping in Higher Plant PSII Complexes with Different Antenna Sizes | Biophysical Journal | 2011 |
| 10.1016/j.bpj.2012.05.004 | Higher Plant PSII Light-Harvesting Antenna, Not the Reaction Center, Determines the Excited-State Lifetime… | Biophysical Journal | 2012 |
| 10.1016/j.cplett.2005.05.017 | Investigation of the internal conversion time of the chlorophyll a from S3, S2 to S1 | Chemical Physics Letters | 2005 |
| 10.1038/s41598-017-11621-2 | Mechanistic insight into internal conversion process within Q-bands of chlorophyll a | Scientific Reports | 2017 |
| 10.1093/pcp/pcu040 | Singlet Oxygen Production by PSII Under Light Stress… Protective role of β-Carotene | Plant and Cell Physiology | 2014 |
| 10.1098/rstb.2002.1139 | What is β-carotene doing in the photosystem II reaction centre? | Phil Trans R Soc B | 2002 |
| 10.1016/j.bbabio.2012.05.007 | NPQ activation reduces chlorophyll triplet state formation in the moss Physcomitrella patens | BBA – Bioenergetics | 2012 |
| 10.1105/tpc.112.097972 | Photosynthetic Quantum Yield Dynamics: From Photosystems to Leaves | The Plant Cell | 2012 |
| 10.1016/0002-1571(71)90022-7 | The action spectrum, absorptance and quantum yield of photosynthesis in crop plants | Agricultural Meteorology | 1971 |
| 10.1093/jxb/eru191 | Linking chlorophyll a fluorescence to photosynthesis for remote sensing applications… | J Exp Bot | 2014 |
| 10.1093/plcell/koaf240 | Nonphotochemical quenching in plants: Mechanisms and mysteries | The Plant Cell | 2025 |
| 10.1038/s41467-026-74992-z | The quantitative contribution of different PSII compartments to NPQ in Arabidopsis | Nature Communications | 2026 |
| 10.1105/tpc.10.7.1121 | Arabidopsis Mutants Define a Central Role for the Xanthophyll Cycle… | The Plant Cell | 1998 |
| 10.1016/j.bbabio.2010.01.001 | Identification of a slowly inducible zeaxanthin-dependent component of NPQ… | BBA – Bioenergetics | 2010 |
| 10.1093/jxb/erh141 | The slow reversibility of PSII thermal energy dissipation… large losses in carbon gain by crop canopies | J Exp Bot | 2004 |
| 10.1146/annurev-arplant-070221-024745 | Into the Shadows and Back into Sunlight: Photosynthesis in Fluctuating Light | Annu Rev Plant Biol | 2022 |
| 10.1126/science.aai8878 | Improving photosynthesis and crop productivity by accelerating recovery from photoprotection | Science | 2016 |
| 10.1126/science.adc9831 | Soybean photosynthesis and crop yield are improved by accelerating recovery from photoprotection | Science | 2022 |
| 10.1126/science.ade8506 | Comment on "Soybean photosynthesis and crop yield are improved…" | Science | 2023 |
| 10.1111/jipb.13320 | High NPQ of VPZ transgenic potato plants limits CO₂ assimilation… reduces tuber yield under fluctuating light | J Integr Plant Biol | 2022 |
| 10.1038/s41477-019-0572-z | Accelerated relaxation of photoprotection impairs biomass accumulation in Arabidopsis | Nature Plants | 2020 |
| 10.1111/pce.70245 | Accelerated Relaxation of Photoprotection Impairs Growth and Biomass Accumulation in Rice | Plant, Cell & Environment | 2025 (online; vol. 49, 2026) |
| 10.1111/pce.70608 | Evaluating the Combined Effects of Elevated [CO₂] and Accelerated NPQ Relaxation… in Soybean | Plant, Cell & Environment | 2026 |
| 10.1073/pnas.2621033123 | Faster relaxation of nonphotochemical quenching in C4 than in C3 species | PNAS | 2026 |
| 10.1101/2025.01.12.632622 | Modification of NPQ Pathways in the C4 Model Plant Setaria viridis… | bioRxiv (posted content) | 2025 |
| 10.1101/2024.12.23.630197 | Overexpression of Xanthophyll Cycle Genes Leads to Faster NPQ Acclimation in… Setaria viridis | bioRxiv (posted content) | 2024 |
| 10.1016/j.copbio.2025.103424 | Photoprotective-based strategies to enhance crop yield under fluctuating light conditions | Curr Opin Biotechnol | 2026 |
| 10.1073/pnas.93.5.2213 | The rate constant of photoinhibition, measured in lincomycin-treated leaves, is directly proportional to light | PNAS | 1996 |
| 10.1093/plcell/koae082 | The biogenesis and maintenance of PSII: Recent advances and current challenges | The Plant Cell | 2024 |
| 10.1055/s-2002-35434 | Photosynthesis and Photoprotection in Overwintering Plants | Plant Biology | 2002 |
| 10.1111/nph.12466 | Sustained energy dissipation in winter evergreens | New Phytologist | 2013 (online; vol. 201, 2014) |
| 10.1105/tpc.17.00536 | The Plastid Lipocalin LCNP Is Required for Sustained Photoprotective Energy Dissipation in Arabidopsis | The Plant Cell | 2017 (online; vol. 30, 2018) |
| 10.1104/pp.59.1.86 | Quantum Yields for CO₂ Uptake in C3 and C4 Plants | Plant Physiology | 1977 |
| 10.1016/0006-3002(49)90136-5 | On the interrelation of respiration and photosynthesis in green plants | BBA | 1949 |
| 10.1111/nph.16756 | Is the Kok effect a respiratory phenomenon? Metabolic insight using ¹³C labeling… | New Phytologist | 2020 |
| 10.1111/nph.14527 | Tracking the origins of the Kok effect, 70 years after its discovery | New Phytologist | 2017 |
| 10.1351/pac197335010047 | Investigation of the violaxanthin cycle | Pure and Applied Chemistry | 1973 |
| 10.1016/0003-9861(62)90060-7 | Studies on the light and dark interconversions of leaf xanthophylls | Arch Biochem Biophys | 1962 |
| 10.1016/j.copbio.2008.02.004 | What is the maximum efficiency with which photosynthesis can convert solar energy into biomass? | Curr Opin Biotechnol | 2008 |
| 10.1111/pce.14400 | Plants acclimate to Photosystem I photoinhibition by readjusting the photosynthetic machinery | Plant, Cell & Environment | 2022 |
| 10.1093/pcp/pcaf079 | Photoinhibition and protection of photosystem I | Plant and Cell Physiology | 2025 |
| 10.1038/nature03286 | State transitions and light adaptation require chloroplast thylakoid protein kinase STN7 | Nature | 2005 |
| 10.1126/science.aat1156 | Structure of the maize photosystem I supercomplex with light-harvesting complexes I and II | Science | 2018 |
| 10.1038/nature01213 | Chloroplast avoidance movement reduces photodamage in plants | Nature | 2002 |
| 10.1104/pp.20.00549 | Rethinking the Influence of Chloroplast Movements on NPQ and Photoprotection | Plant Physiology | 2020 |
| 10.1073/pnas.1115982109 | Carotenoid oxidation products are stress signals that mediate gene responses to singlet oxygen in plants | PNAS | 2012 |
| 10.1146/annurev.pp.28.060177.002035 | Comparative Photosynthesis of Sun and Shade Plants | Annu Rev Plant Physiol | 1977 |
| 10.1007/BF01516164 | Neue Versuche zur Kohlensäureassimilation | Die Naturwissenschaften | 1931 |
| 10.1007/BF01516190 | Die Aufklärung der Photoluminescenztilgung fluorescierender Systeme durch Sauerstoff… | Naturwissenschaften | 1931 |
| 10.32615/ps.2025.007 | Hans Kautsky's groundbreaking discovery(ies) in 1931… | Photosynthetica | 2025 |
| 10.1021/ja01072a060 | Olefin Oxidations with Excited Singlet Molecular Oxygen | J Am Chem Soc | 1964 |
| 10.1007/BF00024185 | Continuous recording of photochemical and non-photochemical chlorophyll fluorescence quenching with a new type of modulation fluorometer | Photosynthesis Research | 1986 |
| 10.1104/pp.84.2.218 | Photoinhibition and Zeaxanthin Formation in Intact Leaves | Plant Physiology | 1987 |
| 10.1098/rstb.1905.0005 | Experimental researches on vegetable assimilation and respiration. III. On the effect of temperature on CO₂ assimilation | Phil Trans R Soc B | 1905 |
| 10.1093/oxfordjournals.aob.a089000 | Optima and Limiting Factors | Annals of Botany | 1905 |
| 10.1085/jgp.15.4.391 | A Separation of the Reactions in Photosynthesis by Means of Intermittent Light | J Gen Physiol | 1932 |
| 10.1111/pce.14070 | Evolution of a biochemical model of steady-state photosynthesis | Plant, Cell & Environment | 2021 |
| 10.1007/s11120-014-0014-8 | The controversy over the minimum quantum requirement for oxygen evolution | Photosynthesis Research | 2014 |
| 10.1007/BF00402983 | Photon yield of O₂ evolution and chlorophyll fluorescence characteristics at 77 K among vascular plants… | Planta | 1987 |
| 10.1038/s41467-026-70076-0 | Fast response of satellite fluorescence-derived plant physiology to drought stress | Nature Communications | 2026 |
| 10.1038/s43247-025-03035-0 | Limited capability of current satellite SIF reconstructions to capture stomatal responses… | Commun Earth Environ | 2025 |
| 10.1039/d6cp00501b | pH-dependent structural alterations in LHCII revealed by two-dimensional infrared spectroscopy | Phys Chem Chem Phys | 2026 |
| 10.1038/s41477-023-01500-2 | Cryo-EM structures of LHCII in photo-active and photo-protecting states… | Nature Plants | 2023 |
| 10.1111/tpj.16967 | Nonphotochemical quenching kinetics GWAS in sorghum identifies genes… | The Plant Journal | 2024 |

No retraction or correction notice appeared in the Crossref `updated-by` field for any DOI checked.
