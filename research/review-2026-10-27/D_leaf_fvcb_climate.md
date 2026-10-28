# Review D, 27 Oct 2026: whole leaf, FvCB, CO₂ and climate (C11, C12; link to L15)

**What was checked**
- PLATE text and every figure label that states a fact, in all 10 variants each of `c11.ts` and `c12.ts`, plus the PLATE and figures of `l15.ts` where they link to lecture 2.
- I did not repeat the findings from 23 Oct (`E_C07-C12.md`, `C_L12-L15.md`, `REVIEW_SUMMARY.md`, `F_coverage-scope.md`) or from 26 Oct (`review-2026-10-26/D_…`, which covers L15's Kok effect and the absorbed-photon basis).
- No project file other than this report was changed.

**Evidence levels.** FT = full text read; Abs = abstract read; Meta = Crossref metadata only; TB = textbook consensus. All DOIs were checked on Crossref, including `updated-by` (Appendix A).

**Full texts read:**
- Busch et al. 2024 gas-exchange guide (Glasgow eprint of the published PDF), including Table 1 typical values at 25 °C
- Yin et al. 2021 (Europe PMC)
- Gaastra 1959 thesis (WUR edepot)
- Norby et al. 2024 (open access)
- Gregory et al. 2021 (Europe PMC)
- NOAA GML data files (read 27 Oct 2026)

---

## Top fixes (5)

1. **C12, point 3 and fig h: "≈ 18 %" is cited to the wrong paper and given without its conditions.**
   - The figure comes from Ainsworth & Long **2021**: 186 studies of 18 C₃ crops, CO₂ raised by about 200 ppm, no stress. With low nitrogen, or with about 2 °C of warming, the gain drops to about 10 % (Abs).
   - The 2005 abstract gives no 18 %. It says grain yields rose "far less than anticipated" and that C₄ "showed little response" (Abs).
   - Wording: "At +200 ppm CO₂, C₃ crop yields rose ≈ 18 % (≈ 10 % with low N or +2 °C); C₄ crops gained only in drought." Add Ainsworth & Long 2021 to the references.
2. **C11, the factor 1.6.**
   - Point 1: in A = g_s(C_a − C_i), g_s is the conductance to **CO₂**, which equals the conductance to water vapour ÷ 1.6 (Busch 2024, Table 1, FT).
   - Fig h row 3 derives g_s "from the water lost", then writes "C_i = C_a − A / g_s". That is wrong by a factor of 1.6. It should read **C_i = C_a − 1.6 A / g_s(water)**.
   - Fig b: "H₂O in − out" has the sign reversed. The outgoing air is wetter, so write "H₂O out − in".
3. **C12, points 1–2 and fig a.**
   - "up to the leaf's Rubisco capacity (V_cmax)": at 25 °C, A is typically 10–20 and V_c 0–40 µmol m⁻² s⁻¹, against a V_cmax of 50–150 (Busch 2024, Table 1, FT). A never reaches V_cmax, and V_cmax sets the slope.
   - "light sets the pace": J depends on light and on the capacity J_max. FvCB *assumes* that electron transport controls RuBP regeneration, but Calvin–Benson enzymes can also limit it (Yin 2021, FT). The wording also clashes with L15, where light limits in *dim* light.
   - Fig a: "Aj ~ Jmax" → "Aj ~ J".
4. **Lecture 1 → lecture 2 coherence.**
   - L15 point 3 teaches "real curves bend smoothly; Blackman's corner is history". C12 then teaches a sharp switch ("limiting step switches"). Add one clause to C12: "The model switches sharply, as Blackman did; measured curves round the corner."
   - The light compensation point was moved from lecture 1 to here, but it appears only in C11 fig g, labelled "compensation point", and in no PLATE text. Name it "light compensation point" and keep it on the page (typically ≈ 15 µmol m⁻² s⁻¹ at 25 °C; Busch 2024, FT).
5. **Order (§5).** Teach C11 and the C₃ half of C12 **before** C07–C10, and move C12's rising-CO₂ panel (C₃ vs C₄, FACE) to **after** C09/C10. This removes three forward references:
   - C10 needs stomata and the water cost ("behind closed stomata", "CAM saves water");
   - C₂ and C₄ are measured by a lower compensation point Γ, which C11 should define;
   - the C₄ curve needs C09.

---

## §1 Claim check

### C11 · What a leaf's CO₂ exchange measures

| # | Where | Claim | Verdict | Evidence | Suggested wording |
|---|---|---|---|---|---|
| 1 | Lead | CO₂ diffuses from C_a to C_i through stomata; water vapour leaves the same way | OK | Busch 2024 (FT) | Instructor notes only: boundary layer; a small cuticular water flux (Márquez 2021, Abs; that paper has a correction, not read) |
| 2 | Point 1 | A = g_s(C_a − C_i) | imprecise | Here g_s is g_sc, and g_sw = 1.6 g_sc (Busch 2024, Table 1, FT). Strictly, C_a is the CO₂ at the leaf surface. vC & Farquhar 1981 add a ternary correction (Meta) | "A = g_s (C_a − C_i), with g_s for CO₂ (water vapour diffuses 1.6 × faster)." Instructor notes only: g_b,CO₂ = g_bw/1.37; ternary effect; C_a at the leaf surface |
| 3 | Point 1 claim | "Stomata gate CO₂ and cost water" | OK, but the cost is not shown | E/A = 1.6 Δw/(C_a − C_i). With Busch's typical C_a 420 and C_i 300 µmol mol⁻¹, at 25 °C and 50 % RH (Δw ≈ 0.016 mol mol⁻¹), that is **≈ 200 H₂O lost per CO₂ fixed** (my arithmetic) | Optional line: "≈ 200 water molecules leave per CO₂ fixed" |
| 4 | Point 2 | A = V_c − 0.5 V_o − R_L | OK | Yin 2021, Eq. 1 (FT). Busch 2024, Box 3 (FT): 0.5 holds when the photorespiratory pathway is closed. Less CO₂ is released if glycine or serine leaves the pathway (Busch 2018, cited there) | "…minus CO₂ from photorespiration (0.5 V_o) and respiration in the light (R_L)." Instructor note: < 0.5 with amino-acid export |
| 5 | Point 2 | Name R_L | OK; the naming varies | Yin 2021 writes R_d and prefers "day respiration" (FT). Busch 2024 uses R_d for the intracellular flux and R_light/R_dark at leaf level, which differ by 24–38 % refixation (FT). Sharkey & Xu 2026: "day respiration (often Rd) or respiration in the light (RL)" (Abs). `LECTURE_OUTLINE.md` item 11 says "Rd" | Keep R_L (it avoids "d = dark"). Context: "= R_d in FvCB papers". Align the outline |
| 6 | Point 3 | C_c < C_i because CO₂ must cross the mesophyll | OK | Typical 25 °C values: C_a 420 → C_i 300 → C_c 200 µmol mol⁻¹; g_sc 0.25 and g_m 0.3 mol m⁻² s⁻¹ (Busch 2024, Table 1, FT). The mesophyll drop (≈ 100) is about as large as the stomatal drop (≈ 120) | Optional: "typically ≈ 300 → 200 µmol mol⁻¹, as large a drop as through the stomata" |
| 7 | Point 3, Context | g_m and its measurement | Context only | g_m is never measured directly: it comes from variable-J fluorescence or ¹³C discrimination. Generic or infinite g_m gives "apparent" V_cmax and J (Busch 2024, FT). The two methods are compatible but differ in absolute value; anatomy does not explain g_m across 10 crops (Xiong 2023, Abs). Apparent g_m can vary with CO₂ and light while the cellular conductance does not (Evans 2021, Abs) | Instructor notes only |
| 8 | Fig a | "C_a: 425.6 ppm in 2025" | OK | NOAA GML global annual mean 2025 = 425.62 ppm; Mauna Loa = 427.35. The 2024 growth rate of 3.76 ppm yr⁻¹ is the highest in the record; 2025 was 2.06 (data files) | — |
| 9 | Fig b | "H₂O in − out gives g_s; C_i is calculated" | imprecise (sign) | The outlet air is wetter. g_s comes from E and the leaf-to-air water-vapour difference at leaf temperature, assuming saturated air inside the leaf (Busch 2024, FT) | "H₂O out − in gives water loss; with leaf temperature, g_s; C_i is calculated" |
| 10 | Figs b, e | A = flow × (CO₂ in − out) ÷ leaf area | OK (simplified) | Ignores dilution by transpired water (vC & Farquhar 1981, Meta; Busch 2024, FT) | Keep it; dilution goes in the Context |
| 11 | Fig h row 1 and footer | Measured: "CO₂ and H₂O in and out, air flow, leaf area"; "Only step 1 is read off the instrument" | imprecise | Leaf temperature is also measured and is needed for g_s (Busch 2024, FT). Gaastra 1959 used thermocouples (FT) | Add "leaf temperature" |
| 12 | Fig h row 3 | "C_i = C_a − A / g_s", with g_s from water | **contradicted** (factor 1.6) | C_i = C_a − 1.6 A/g_sw (Busch 2024, FT) | "C_i = C_a − 1.6 A / g_s(water)" |
| 13 | Fig f | CO₂-in and water-out arrows shrink equally when stomata close | imprecise | At fixed Δw, E falls in proportion to g_s. A falls less, because C_i drops and the CO₂ gradient steepens, so water-use efficiency rises. FACE maize: g_s −34 % with no loss of photosynthesis (Leakey 2006, Abs) | Shrink the CO₂ arrow less than the water arrow; add the label "less water per CO₂" |
| 14 | Fig g | "compensation point: A = 0, yet Rubisco is still fixing CO₂" (light on the x-axis) | imprecise (name) | This is the **light** compensation point, typically ≈ 15 µmol m⁻² s⁻¹ at 25 °C (Busch 2024, Table 1, FT) | "light compensation point: A = 0, yet Rubisco still fixes CO₂" |
| 15 | Fig g | Release (0.5 V_o + R_L) rises with light | OK as a schematic | The Kok method overstates how much light inhibits R_L. Changing Γ*/C_c explains ≈ 25 % of the Kok effect and falling Φ₂ ≈ 12 % (Yin 2020, Abs) | — |
| 16 | Fig c | "chamber: CO₂ in − out = A" | imprecise (units) | Needs × flow ÷ leaf area | "(in − out) × flow ÷ area = A" |
| 17 | Figs d, i, j | Same flow through each valve; C_c < C_i; supply line meets demand curve | OK | Busch 2024 (FT) | — |
| — | Context | Γ and Γ* | open (23 Oct): not in the PLATE text | Now with numbers: see §2 | — |

### C12 · FvCB links carbon fixation to energy supply

| # | Where | Claim | Verdict | Evidence | Suggested wording |
|---|---|---|---|---|---|
| 1 | Title | FvCB links fixation to energy supply | OK | Yin 2021 (FT) | — |
| 2 | Lead | "only as fast as its slowest step allows" | imprecise | Net uptake is the minimum of three potential rates, W_c, W_j and W_p, times (1 − Γ*/C_c), minus R_d (Yin 2021, FT). The model's switch is sharp; L15 point 3 tells students that real curves are smooth. Smoothed-minimum forms exist (Collatz 1991, Meta) | "…the lowest of three potential rates sets the leaf's uptake; the model switches sharply, real leaves round the corner." |
| 3 | Point 1 | "Uptake climbs steeply with CO₂, up to the leaf's Rubisco capacity (V_cmax)" | imprecise | At 25 °C, A is typically 10–20 and V_c 0–40, against a V_cmax of 50–150 µmol m⁻² s⁻¹ (Busch 2024, Table 1, FT). V_cmax sets the slope | "Uptake rises steeply with CO₂; Rubisco capacity (V_cmax) sets the slope." |
| 4 | Point 2 | "Higher CO₂: light sets the pace … electron transport (J)" | imprecise | "The model assumes RuBP regeneration-limited photosynthesis is controlled by electron transport", but regeneration "can be limited further by other components as in the Calvin–Benson cycle", and ATP and NADPH co-determine it (Yin 2021, FT) | "Higher CO₂: RuBP regeneration sets the pace. Rubisco waits for RuBP, rebuilt with ATP and NADPH; their supply (J) rises with light up to J_max." |
| 5 | Point 3 claim | "Rising CO₂ helps C₃ more than C₄" | OK for crops in the short term | FACE: C₄ little response (A&L 2005, Abs). Maize gains nothing without drought (Leakey 2006, Abs). The C₄ exception "stands the test of time" (A&L 2021, Abs) | "In crops, rising CO₂ helps C₃ more than C₄." |
| 6 | Point 3 | "C₃ crop yields rose ≈ 18 %" (cited to A&L 2005) | **wrong citation**, and the conditions are missing | See Top fix 1 (A&L 2021, Abs). Legumes and root crops gain more, cereals less; Zn, Fe and protein fall in most C₃ grains (A&L 2021; Myers 2014, Abs) | See Top fix 1 |
| 7 | Point 3 | "a 20-year grassland trial reversed this" | OK but contested; scope needed | Reich 2018: **biomass** of C₃ vs C₄ grass plots, reversed after year 12, partly explained by soil N mineralisation (Abs). Contested in two Science comments: the plants' and soils' natural history (Wolf & Ziska 2018, Abs); interannual climate (Nie 2018, Abs). The authors replied (Meta) | "…one 20-year grassland trial saw the reverse after year 12 (via soil nitrogen)." |
| 8 | Refs | von Caemmerer et al. 2025 | OK | Authors are von Caemmerer, Berry and Farquhar (Meta) | Label "von Caemmerer, Berry & Farquhar 2025" |
| 9 | Fig a | "Aj ~ Jmax" | imprecise | A_j depends on the actual J; J = J_max only at saturating light (Yin 2021, FT) | "Aj ~ J" |
| 10 | Fig a | "3 of 4 C back", "1 of 4 C lost", "5 of 6", "1 of 6" | OK; repeats C03 and C06 | — | Drop the photorespiration branch here (§5) |
| 11 | Figs b, c (Ap) | Ap is a flat TPU cap | OK as a schematic; frequency not stated | TPU "is rarely seen at physiological CO₂ partial pressure and temperature but is very frequently seen when CO₂ is marginally higher than what the plant experienced during growth", especially when cool. Ignoring it underestimates J (Gregory 2021, FT). Under TPU, A loses its sensitivity to O₂ and CO₂ (Sharkey 1985, Abs) | Key: "TPU-limited: rare in the field (high CO₂, cool leaves)" |
| 12 | Figs e, f | Storyboard; "gain at low CO₂ only" / "at high CO₂ only" | OK within the model | Yin 2021 (FT) | — |
| 13 | Fig g | C₄ saturates early; C₃ gets the big gain | OK | Leakey 2006 (Abs). C₄ crops are V_max-limited and still balanced for pre-industrial CO₂ (Pignon & Long 2020, Abs) | Keep "illustrative" |
| 14 | Fig h | "C₃ crops ≈ +18 %"; "C₄: no gain, except in drought" | Same as row 6 | A&L 2021 (Abs) | Add "+200 ppm, unstressed"; cite 2021 |
| 15 | Fig h timeline | C₃ gained more in years 0–12, then C₄ | OK | Reich 2018 (Abs) | Add the word "biomass" |
| 16 | Fig j | "Ap · envelope, triose-P use, TPU" | imprecise | TPU is set by how fast sucrose and starch synthesis release Pᵢ. The envelope translocator is only the exchange site (Yin 2021, FT; Sharkey 1985, Abs) | "Ap · sucrose and starch synthesis (Pᵢ return)" |
| 17 | Fig j | "Aj · thylakoids, electron transport, J" | OK, minor | Regeneration also needs the stromal cycle enzymes (Yin 2021, FT) | Keep it |
| 18 | Code comment | "Γ* at 25 °C still unverified" | partly resolved | Busch 2024, Table 1 gives typical values at 25 °C of **Γ* ≈ 40** and **Γ ≈ 50 µmol mol⁻¹** (FT). The code's 42.75 (Bernacchi 2001) is still not read | — |

### L15 → lecture 2 link

| # | Point | Verdict | Fix |
|---|---|---|---|
| 1 | L15 point 2 (electron transport, Rubisco or sugar export set the plateau) = C12's three limits | Consistent | C12 can say "the same three limits that set the light-curve plateau (lecture 1)" |
| 2 | L15 point 3 "real curves bend smoothly" vs C12's sharp switch | Inconsistent | Top fix 4 |
| 3 | C12 "light sets the pace" (at *high* CO₂) vs L15 "photons limit in dim light" | Terms clash | Use "RuBP regeneration / electron transport (J)" in C12 |
| 4 | Light compensation point (moved from L1) | Only in C11 fig g, unnamed | Top fix 4 |
| 5 | L15 fig a "below zero: respiration exceeds fixation" | Imprecise | At low light, photorespiration also releases CO₂ → "below zero: CO₂ release exceeds fixation" |
| 6 | L15 fig g low-O₂ slope ↔ C11's 0.5 V_o | Missed link | C11 callback: "the steeper slope in 2 % O₂ (lecture 1) is the 0.5 V_o loss removed" |

---

## §2 Missing topics

| Rank | Topic | One line | Slot | Source |
|---|---|---|---|---|
| must | **Water cost: WUE as the stomatal trade-off** | Water leaves 1.6 × more easily down a ~100 × steeper gradient: ≈ 200 H₂O per CO₂ (my arithmetic, row C11-3). Partial closure saves more water than carbon. This grounds the C₄ and CAM water claims | C11 point 1 | Busch 2024 (FT); Leakey 2006 (Abs) |
| must | **CO₂ compensation point Γ (and Γ*)** | Survey of several hundred species: C₃ Γ ≥ 40 µl l⁻¹, C₄ ≤ 10; *Moricandia arvensis* (C₂) 26. Γ* ≈ 40 and Γ ≈ 50 µmol mol⁻¹ at 25 °C. Γ includes R_L; Γ* does not | C11 (Γ); Γ* in Context; reuse in C08/C09 | Krenzer 1975 (Abs); Busch 2024 (FT) |
| must | **Light compensation point** (moved from lecture 1) | A = 0 at ≈ 15 µmol m⁻² s⁻¹ (typical, 25 °C), yet Rubisco still fixes CO₂ | C11 fig g | Busch 2024 (FT) |
| must | **Conditions behind the FACE number** | +200 ppm, unstressed; low N or +2 °C halves the gain | C12 point 3 | A&L 2021 (Abs) |
| nice | Where today's C₃ leaf sits | Typical C_i 300 is just below the switch at C_i ≈ 350 µmol mol⁻¹, so rising CO₂ still pays | C12 fig b (mark C_a) | Busch 2024, Table 1 (FT) |
| nice | CO₂ × temperature | Model: 350 → 650 µmol mol⁻¹ raises A_sat by 20 % at 10 °C but 105 % at 35 °C, and the optimum by 5 °C. Above the optimum, Rubisco deactivation plus falling J explain the decline | C12b (or C05) | Long 1991 (Abs; model); Scafaro 2023 (Abs) |
| nice | Grain quality | Elevated CO₂ lowers Zn and Fe in C₃ grains and legumes, and protein in non-legumes | C12b / C13 | Myers 2014 (Abs; has an author correction, not read); A&L 2021 (Abs) |
| nice | Mature forests under FACE | EucFACE: GPP +12 % at +150 ppm, but no extra carbon stored (soil respiration). BIFoR oak: wood +9.8 % over 7 years at +150 ppm | Context for C12b | Jiang 2020 (Abs); Norby 2024 (FT) |
| nice | Trees' iWUE up ~40 % since 1901, mostly via higher A | Rising CO₂ in tree rings | C11 Context | Mathias & Thomas 2021 (Abs) |
| nice | g_m can be engineered | Cell-wall change: g_m +28 %, field A +8 % (tobacco) | C11 Context | Salesse-Smith 2024 (Abs); caution: Leverett & Kromdijk 2024 (Abs) |

---

## §3 History stories (then → now)

**1. Gaastra 1959 → 2022–2024: splitting the CO₂ path into resistances** (C11; new to the list)
- **Then.** Gaastra measured a single leaf in a "Plexiglass" chamber with an infrared CO₂ analyser, a lithium-chloride hygrometer and thermocouples. He expressed the CO₂ path as air, stomatal and mesophyll resistances.
  - He wrote that "r_m is usually larger than r_s of open stomata" and that transpiration "depends on r_s + r_a, but not on r_m".
  - He assumed the leaf's inner air was saturated while citing contrary data.
  - His r_m also lumped in the carboxylation step. Source: [10.18174/183268](https://doi.org/10.18174/183268), FT.
- **Now.**
  - Substomatal humidity falls to ~80 % under dry air ([Wong 2022](https://doi.org/10.1038/s41477-022-01202-1), Abs).
  - g_m has been engineered: +28 %, giving +8 % field A in tobacco ([Salesse-Smith 2024](https://doi.org/10.1111/pbi.14364), Abs).
- **Why it works.** A resistor-chain animation; one 1959 doubt that became a 2022 result.

**2. Chamber → open air: the CO₂ dividend shrinks** (C12b; new angle, not FACE → Reich)
- **Then.** 430 mostly greenhouse and chamber observations gave +33 % yield at doubled CO₂ ([Kimball 1983](https://doi.org/10.2134/agronj1983.00021962007500050014x), Abs).
- **Now.**
  - In open-air FACE, yield rose ≈ 50 % less than in enclosures ([Long 2006](https://doi.org/10.1126/science.1114722), Abs).
  - The 30-year synthesis: +18 % at +200 ppm; ~10 % with low N or warming; C₄ gains only in drought; Zn and Fe fall ([A&L 2021](https://doi.org/10.1111/gcb.15375), Abs).
- **Why it works.** One bar shrinking three times; it also teaches how the experiment's setting shapes the result.

**3. Keeling's breathing planet → 425.6 ppm and a deeper breath** (C11 fig a or C12b)
- **Then.** Keeling found a "systematic variation with season and latitude" in northern CO₂ ([Keeling 1960](https://doi.org/10.3402/tellusa.v12i2.9366), Abs).
- **Now.**
  - Global mean 425.62 ppm in 2025 (NOAA).
  - Seasonal amplitude at 45–90° N rose 50 % since 1958–61 ([Graven 2013](https://doi.org/10.1126/science.1239207), Abs).
  - Crops explain up to a quarter of the rise, and maize, a C₄ plant, makes up two-thirds of that crop share ([Gray 2014](https://doi.org/10.1038/nature13957), Abs; see also [Zeng 2014](https://doi.org/10.1038/nature13893), Abs).
- **Why it works.** The sawtooth is a whole-biosphere version of C11 fig e (net release in the dark, uptake in the light).

**Reserves**
- **Compensation points.** [Krenzer 1975](https://doi.org/10.1104/pp.56.2.194) sorted several hundred species into Γ ≥ 40 or ≤ 10 µl l⁻¹. Only two species fell between: *Moricandia arvensis* (26) and *Panicum milioides* (12–20). Both were later found to be C₃–C₄ intermediates with glycine decarboxylase confined to the bundle sheath (C08: Rawsthorne 1988; Hylton 1988, 23 Oct). This is a strong bridge if C11 moves before C07 (Abs).
- **Respiration in the light.** [Decker 1955](https://doi.org/10.1104/pp.30.1.82) observed a post-illumination CO₂ burst (Meta) → Kok-effect artefacts ([Yin 2020](https://doi.org/10.1111/nph.16638), Abs) and the debated source of R_L (23 Oct pair).
- **FvCB at global scale.** FvCB 1980 → adding g_m raises modelled CO₂ fertilisation of GPP by 16 % ([Sun 2014](https://doi.org/10.1073/pnas.1418075111), Abs). Adding g_m, temperature acclimation and N optimisation raises projected GPP by up to 20 % ([Knauer 2023](https://doi.org/10.1126/sciadv.adh9444), Abs). This angle differs from 23 Oct's "variant bias".
- **Stomatal diffusion.** [Brown & Escombe 1900](https://doi.org/10.1098/rstb.1900.0014): diffusion through small pores (Meta only; content not checked).

---

## §4 Latest findings (2022–2026)

| Finding | Label | Source |
|---|---|---|
| Community guide sets the conventions: g_sw = 1.6 g_sc; R_d vs R_light; apparent parameters when g_m is assumed | solid | [Busch 2024](https://doi.org/10.1111/pce.14815) (FT) |
| Substomatal RH ≈ 97 % in mild and ≈ 80 % in dry air, which biases C_i and g_m | contested (one group; new method) | [Wong 2022](https://doi.org/10.1038/s41477-022-01202-1) (Abs) |
| CO₂ at the mesophyll cell surface sits > 10 µmol mol⁻¹ below C_i; adaxial and abaxial C_i differ by up to ~50 µmol mol⁻¹ | solid (one group) | [Márquez 2023](https://doi.org/10.1111/nph.18784) (Abs) |
| The two g_m methods agree in rank but differ in absolute value; anatomy does not explain g_m across 10 crops | solid (one study) | [Xiong 2023](https://doi.org/10.1111/tpj.16098) (Abs) |
| First field gain from raising g_m: +28 % g_m, +8 % A (tobacco) | solid (one consortium) | [Salesse-Smith 2024](https://doi.org/10.1111/pbi.14364) (Abs) |
| TPU limitation sets in at lower C_i in high-N rice leaves and follows whole-plant sink:source | solid (one group) | [Zhou 2023](https://doi.org/10.1093/jxb/erad329) (Abs) |
| A new fitting package (PhotoGEA) gave the closest fits of the tools it was compared with, and non-Gaussian confidence intervals | solid (authors' own comparison) | [Lochocki 2025](https://doi.org/10.1111/pce.15501) (Abs) |
| Above the temperature optimum, Rubisco deactivation plus falling J predict the decline across species | solid | [Scafaro 2023](https://doi.org/10.1038/s41467-023-38496-4) (Abs) |
| Mature oak forest: A_sat +33 % for 3 years with no down-regulation; wood +9.8 % over 7 years at +150 ppm | solid (n = 3 rings per treatment) | [Gardner 2022](https://doi.org/10.1093/treephys/tpab090) (Abs); [Norby 2024](https://doi.org/10.1038/s41558-024-02090-3) (FT) |
| A strong CO₂-fertilisation signal in eddy-covariance data; satellite products underestimate it in the tropics | contested (theory-based) | [Chen 2022](https://doi.org/10.1073/pnas.2115627119) (Abs) |
| Earth-system models overstate natural N fixation by > 50 %, which inflates CO₂ fertilisation by ≈ 11 % | solid (model–data comparison) | [Kou-Giesbrecht 2025](https://doi.org/10.1073/pnas.2514628122) (Abs) |
| Richer photosynthesis in a land model (g_m, acclimation, N) gives up to 20 % more GPP by 2070–2099 | contested (one model) | [Knauer 2023](https://doi.org/10.1126/sciadv.adh9444) (Abs) |
| Wild C₄ grasses at 550 ppm raised A, and some raised V_cmax; growth followed the biochemistry, not only water saving | contested (one study, 3 species) | [Singini 2026](https://doi.org/10.1111/pce.70785) (Abs) |
| Context: the "declining CO₂ fertilisation" claim was disputed in three Science comments | contested (2020–21) | [Wang 2020](https://doi.org/10.1126/science.abb7772) (Abs; erratum not read); comments: [Frankenberg](https://doi.org/10.1126/science.abg2947), [Sang](https://doi.org/10.1126/science.abg4420), [Zhu](https://doi.org/10.1126/science.abg5673) (Abs). Do not cite [Keenan 2021](https://doi.org/10.1038/s41586-021-04096-9): retracted |
| NOAA: 2024 global growth rate of 3.76 ppm yr⁻¹, the highest on record; 2025 annual mean 425.62 ppm | solid | NOAA GML data files |

---

## §5 Order notes

**What C11 and C12 need first**
- **C06.** The 0.5 V_o term: C06 says "1 of 4 C lost", which is one CO₂ per two oxygenations. State "one CO₂ per two oxygenations" in C06 so that C11 is a callback, not new content.
- **C02–C04.** RuBP regeneration and the ATP and NADPH spent per CO₂ (for A_j).
- **C04b.** The Pᵢ return (for A_p).
- **C05.** CO₂/O₂ competition (for Γ*).
- **Lecture 1.** L09/L11 for J. L11's "1.3 vs 1.5 ATP/NADPH" is why A_j is written in NADPH form (instructor note, 23 Oct). L15 for the light compensation point and the low-O₂ slope.

**Stomata appear before they are taught.** No PLATE text before C10 mentions stomata. C10 uses "behind closed stomata" and "CAM saves water", and C09 lists water-use efficiency (23 Oct gap).

**Proposed order** (time-neutral). Recommended, but not the only defensible one:

C01–C04, C04b → C05 → C06 → **C11** (net exchange, stomata and water, Γ, light compensation point) → **C12a** (FvCB on one C₃ A–Ci curve: two limits, TPU as one dashed cap pointing back to C04b) → C07/C08 (C₂: lowers Γ) → C09 + C10 (C₄, CAM: the water saving is now grounded) → **C12b** (rising CO₂: C₃ vs C₄ curves, FACE, temperature) → C13.

- **Why.** Each move removes a forward reference. FvCB is a C₃ model, and it shows the C₃ leaf is CO₂-limited at today's C_a. That is the problem C₂ and C₄ solve, and Γ is the yardstick both are measured by (Krenzer 1975).
- **Cost.**
  - About 6 minutes now sit between C06's glycine decarboxylation and C08's relocation of it. Fix this with one callback line in C07/C08.
  - `LECTURE_OVERVIEW.md` step 6 moves.
- **If the order stays as it is:** add one stomata/water line to C01 and define Γ in C06.

**TPU and sugar export.** Keep the mechanism only in C04b (already there). In C12, show A_p as a dashed cap labelled "rare in the field". Do not re-explain the Pᵢ exchange in C12 variants c, i or j. C13 picks up sucrose.

**Repeated ideas**
- **C12 fig a** repeats C06's photorespiration branch and C03's 5-of-6. **C12 figs c, i, j** repeat C03/C04b. → Pick one of a, b or c.
- **C11 fig j** (supply–demand on A–C_i) and **C12 figs b, c** both introduce the A–C_i curve. → Let C12 own it; reuse fig j's supply line as a later build on the C12 curve.
- **C11 fig g** redraws L15's light curve. → Reuse the L15 curve and add the zero crossing.
- **C12 point 3** (C₃ vs C₄ under CO₂) overlaps C09 point 3. C09's cited Luo 2024 adds that natural C₄ cover is shrinking as CO₂ favours C₃ (23 Oct). → One mention, in C12b.
- **C11 point 2** overlaps C06's "loses ½ C". → Make C11 the callback.

**Where each missing topic sits**

| Topic | Slot |
|---|---|
| WUE | C11 point 1 |
| Γ | C11 (Γ* in Context); reused in C08 and C09 |
| Light compensation point | C11 fig g |
| FACE conditions, temperature, nutrients | C12b |
| Keeling, NOAA | C11 fig a, or C01 |
| g_m engineering, forests, iWUE | Context only |

---

## Appendix A: Crossref register

Retrieved 27 Oct 2026. "updated-by" = Crossref `updated-by` field; "none" means none listed.

| DOI | First author | Year | Journal | Title (short) | updated-by |
|---|---|---|---|---|---|
| 10.1007/BF00384257 | von Caemmerer | 1981 | Planta 153 | Biochemistry of photosynthesis and gas exchange of leaves | none |
| 10.1111/pce.14070 | Yin | 2021 | PCE 44 | Evolution of a biochemical model of steady-state photosynthesis | none |
| 10.1111/pce.14815 | Busch | 2024 | PCE 47 | A guide to photosynthetic gas exchange measurements | none |
| 10.1007/BF00386231 | Farquhar | 1980 | Planta 149 | A biochemical model of photosynthetic CO₂ assimilation | none |
| 10.1007/s00425-025-04834-7 | von Caemmerer | 2025 | Planta 262 | A perspective: A biochemical model … (with Berry, Farquhar) | none |
| 10.1111/j.1469-8137.2004.01224.x | Ainsworth | 2005 | New Phytol 165 | 15 years of FACE: meta-analytic review | none |
| 10.1111/gcb.15375 | Ainsworth | 2021 | GCB 27 | 30 years of FACE: crop productivity | none |
| 10.1126/science.aas9313 | Reich | 2018 | Science 360 | Unexpected reversal of C₃ vs C₄ grass response | none (comments below) |
| 10.1126/science.aau1073 | Wolf | 2018 | Science 361 | Comment on Reich 2018 | none |
| 10.1126/science.aau3016 | Nie | 2018 | Science 361 | Comment on Reich 2018 | none |
| 10.1126/science.aau1300 | Reich | 2018 | Science 361 | Response to Comment | none |
| 10.1126/science.aau8982 | Reich | 2018 | Science 361 | Response to Comment | none |
| 10.1093/oxfordjournals.aob.a089000 | Blackman | 1905 | Ann Bot 19 | Optima and limiting factors | none |
| 10.1104/pp.59.1.86 | Ehleringer | 1977 | Plant Physiol 59 | Quantum yields for CO₂ uptake in C₃ and C₄ | none |
| 10.1007/BF00195075 | Ögren | 1993 | Planta 189 | Photosynthetic light-response curves | none |
| 10.1126/science.1114722 | Long | 2006 | Science 312 | Food for thought: lower-than-expected crop yield stimulation | none |
| 10.1104/pp.105.073957 | Leakey | 2006 | Plant Physiol 140 | Maize not affected by open-air CO₂ without drought | none |
| 10.1093/jxb/erp096 | Leakey | 2009 | JXB 60 | Six important lessons from FACE | none |
| 10.2134/agronj1983.00021962007500050014x | Kimball | 1983 | Agron J 75 | CO₂ and agricultural yield: 430 observations | none |
| 10.1126/science.abb7772 | Wang | 2020 | Science 370 | Recent global decline of CO₂ fertilization effects | none (erratum 10.1126/science.abg8637 exists, not linked) |
| 10.1126/science.abg2947 | Frankenberg | 2021 | Science 373 | Comment on Wang 2020 | none |
| 10.1126/science.abg4420 | Sang | 2021 | Science 373 | Comment on Wang 2020 | none |
| 10.1126/science.abg5673 | Zhu | 2021 | Science 373 | Comment on Wang 2020 | none |
| 10.1126/science.abg7484 | Wang | 2021 | Science 373 | Response to Comments | none |
| 10.1038/s41586-021-04096-9 | Keenan | 2021 | Nature 600 | (RETRACTED) Constraint on historic growth in global photosynthesis | **retraction 10.1038/s41586-022-04869-w** |
| 10.1073/pnas.2115627119 | Chen | 2022 | PNAS 119 | CO₂ fertilization inferred from site to global scales | none |
| 10.1111/nph.16866 | Walker | 2021 | New Phytol 229 | Integrating the evidence for a CO₂-driven land sink | none |
| 10.1038/s41586-020-2128-9 | Jiang | 2020 | Nature 580 | Fate of carbon in a mature forest under CO₂ enrichment | none |
| 10.1093/treephys/tpab090 | Gardner | 2022 | Tree Physiol 42 | Photosynthetic enhancement in 175-year-old *Q. robur* | none |
| 10.1038/s41558-024-02090-3 | Norby | 2024 | Nat Clim Change 14 | Enhanced woody biomass in a mature forest under eCO₂ | none |
| 10.1073/pnas.2514628122 | Kou-Giesbrecht | 2025 | PNAS 122 | Overestimated BNF → exaggerated CO₂ fertilization | none |
| 10.1126/sciadv.adh9444 | Knauer | 2023 | Sci Adv 9 | Higher GPP with advanced photosynthesis representations | none |
| 10.1073/pnas.1418075111 | Sun | 2014 | PNAS 111 | Mesophyll diffusion and global CO₂ fertilization | none |
| 10.1111/pce.70785 | Singini | 2026 | PCE 49 | CO₂ fertilisation in wild C₄ grasses | none |
| 10.1111/pce.13863 | Pignon | 2020 | PCE 43 | C₄ crops still adapted to pre-industrial CO₂ | none |
| 10.1104/pp.56.2.194 | Krenzer | 1975 | Plant Physiol 56 | CO₂ compensation points of flowering plants | none |
| 10.1073/pnas.2014286118 | Mathias | 2021 | PNAS 118 | Global tree iWUE enhanced by CO₂ | none |
| 10.1038/nature13179 | Myers | 2014 | Nature 510 | Increasing CO₂ threatens human nutrition | **correction 10.1038/s41586-019-1602-8** (not read) |
| 10.1111/j.1365-3040.1991.tb01439.x | Long | 1991 | PCE 14 | Temperature response modified by CO₂ | none |
| 10.1038/s41467-023-38496-4 | Scafaro | 2023 | Nat Commun 14 | Rubisco deactivation and J co-limit above T_opt | none |
| 10.1111/nph.17092 | Rogers | 2021 | New Phytol 230 | TPU: an unnecessary complexity in TBMs | none |
| 10.1111/pce.14153 | Gregory | 2021 | PCE 44 | TPU: out of global models but important for leaf models | none |
| 10.1104/pp.78.1.71 | Sharkey | 1985 | Plant Physiol 78 | O₂-insensitive photosynthesis in C₃ plants | none |
| 10.1093/jxb/erad329 | Zhou | 2023 | JXB 74 | TPU modulated by sink–source and N in rice | none |
| 10.1111/nph.16638 | Yin | 2020 | New Phytol 227 | The Kok effect revisited | none |
| 10.1111/nph.14816 | Tcherkez | 2017 | New Phytol 216 | Leaf day respiration | none |
| 10.1111/pce.70216 | Sharkey | 2026 (online 2025) | PCE 49 | CO₂ release during photosynthesis | none |
| 10.1111/pce.14871 | Abadie | 2024 | PCE 47 | Day respiration: multiple carbon sources | none |
| 10.1038/s41477-022-01202-1 | Wong | 2022 | Nat Plants 8 | Humidity gradients in leaf air spaces | none |
| 10.1038/s41477-021-00861-w | Márquez | 2021 | Nat Plants 7 | Improved gas-exchange theory (small fluxes) | **correction 10.1038/s41477-021-00899-w** (not read) |
| 10.1111/nph.18784 | Márquez | 2023 | New Phytol 238 | CO₂ at the mesophyll cell surface | none |
| 10.1111/nph.16968 | Evans | 2021 | New Phytol 229 | Mesophyll conductance: walls, membranes | none |
| 10.1111/tpj.16098 | Xiong | 2023 | Plant J 113 | Anatomy does not explain g_m across crops | none |
| 10.1111/pbi.14364 | Salesse-Smith | 2024 | Plant Biotechnol J 22 | Greater g_m and field photosynthesis via AtCGR3 | none |
| 10.1111/pce.14940 | Leverett | 2024 | PCE 47 | Engineering elevated g_m | none |
| 10.1111/pce.15501 | Lochocki | 2025 | PCE 48 | PhotoGEA R package | none |
| 10.1093/insilicoplants/diaf014 | Lochocki | 2025 | in silico Plants | FvCB variants cause parameter errors | none |
| 10.1016/0168-1923(91)90002-8 | Collatz | 1991 | Agric For Meteorol 54 | Stomatal conductance, photosynthesis, transpiration model | none |
| 10.18174/183268 | Gaastra | 1959 (thesis) | WUR thesis 269 | Photosynthesis of crop plants … stomatal diffusion resistance | none |
| 10.3402/tellusa.v12i2.9366 | Keeling | 1960 | Tellus 12 | Concentration and isotopic abundances of atmospheric CO₂ | none (also 10.1111/j.2153-3490.1960.tb01300.x) |
| 10.1126/science.1239207 | Graven | 2013 | Science 341 | Enhanced seasonal exchange of CO₂ since 1960 | none |
| 10.1038/nature13957 | Gray | 2014 | Nature 515 | Cropland productivity and CO₂ seasonality | none |
| 10.1038/nature13893 | Zeng | 2014 | Nature 515 | Green Revolution and CO₂ seasonal amplitude | none |
| 10.1104/pp.30.1.82 | Decker | 1955 | Plant Physiol 30 | Post-illumination deceleration of respiration | none |
| 10.1098/rstb.1900.0014 | Brown | 1900 | Phil Trans B 193 | Static diffusion of gases … assimilation of carbon | none |

## Appendix B: Unverified

- Bernacchi 2001 constants used in the code (K_c 404.9, K_o 278.4, Γ* 42.75): not read. Busch's typical Γ* ≈ 40 is FT.
- Rogers 2021: only the title and opening paragraph were seen; the OSTI copy was unreachable.
- Content not read:
  - the correction notices for Myers 2014 and Márquez 2021;
  - the Wang 2020 erratum;
  - the correction to Zhou & Yin 2024 (listed by Europe PMC as erae470, not linked on Crossref).
- Metadata only: Decker 1955, Brown & Escombe 1900, Collatz 1991 (smoothing), and the Reich 2018 replies.
- "≈ 200 H₂O per CO₂" is my arithmetic from Busch's typical C_a and C_i at 25 °C and 50 % RH, not a measured value.
- Long 1991's +20 % / +105 % / +5 °C are model simulations.
- Typical light compensation point ≈ 15 µmol m⁻² s⁻¹ is Busch's single "typical" value. Sun and shade ranges were not checked.
- AmazonFACE status: not checked.
