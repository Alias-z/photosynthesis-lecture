# Review A, 27 Oct 2026: the CBB cycle, its light switch, products, export and the finale (C1, C2, C3, C4, C4b, C13)

**Scope.** I checked the `PLATE` text and every figure label that states a fact, in all ten variants of `src/pilot/figs/c01.ts`, `c02.ts`, `c03.ts`, `c04.ts`, `c04b.ts` and `c13.ts`. I compared them with lecture 1 as it now stands: L01 says "Rubisco fixes CO₂ / ATP and NADPH make it into sugar / The carbon in bread comes from air"; L11 says linear flow gives ≈ 1.3 ATP per NADPH against the 1.5 the cycle needs; and the L15 figure says "④ sugar export (TPU)". I do not repeat findings from 23 Oct. A 23 Oct finding that is still not applied is listed once as "open (23 Oct)". I changed no file except this one.

**Evidence levels.**
- **FT**: I read the full text.
- **Abs**: I read the abstract (Europe PMC, or the Crossref abstract field).
- **Meta**: Crossref metadata only.
- **TB**: textbook consensus.
- **Calc**: my own arithmetic.

Every DOI cited here was checked on Crossref, including `updated-by` (Appendix A).

**Bottom line.** The science is sound. Nothing is outdated or flatly wrong. I found:
- Five wording problems that change the meaning.
- One consistency break with lecture 1: C1's lead says ATP and NADPH "fix" CO₂.
- One crop-specific contradiction inside the deck. Wheat leaves store the day's carbon mainly as **sucrose**, not starch, yet C4b and two C13 variants present leaf starch as the night store.

The main order problem is that C1 names the four light-switched enzymes and Rubisco activase before C2 and C3 have taught what Rubisco and those steps do.

---

## Top fixes

| # | Where | Problem | Suggested text |
|---|---|---|---|
| 1 | **C1 lead** | "…uses ATP and NADPH … to fix CO₂ into sugar" contradicts C2 point 3 (fixing CO₂ costs no ATP or NADPH) and L01 ("Rubisco fixes CO₂; ATP and NADPH make it into sugar"). | "In the stroma, Rubisco fixes CO₂; ATP and NADPH from the light reactions turn it into sugar. Light also switches the cycle on." |
| 2 | **C4 point 2** | Says 1.5 "must be matched" but never connects it to L11's ≈ 1.3. "Photorespiration adds to it" is ambiguous: adds to the cost, or to the ratio? | **Each CO₂ costs 3 ATP + 2 NADPH.** "A ratio of 1.5; linear flow alone gives ≈ 1.3 (slide 11). Photorespiration raises both costs." |
| 3 | **C4b lead and point 2; C13 variants e and h** | Wheat stores the day's carbon mainly as sucrose; "diurnal storage of sucrose seems to be much more important than the transient storage of starch" (Schnyder 1993, Abs). C13d says this, but C4b, C13e ("Only sucrose travels"; leaf starch as the night store) and C13h ("night stock = leaf starch") say otherwise. | C4b lead: "By day, triose phosphate becomes sucrose; many leaves also store starch for the night." Add to point 2: "Wheat leaves store more sucrose; wheat stems store fructans." C13e: "Carbon travels as sucrose." C13h: "night stock = leaf sucrose and starch". |
| 4 | **C13 point 3** | "(3–18 %)" reads as the ear's share; it is the flag-leaf blade's. The result comes from one δ¹³C study of six elite CIMMYT bread-wheat lines, and the methods disagree. Shading gives ear ≈ culm, and DCMU gives culm > ear (Sanchez-Bragado 2016, Abs). | **The ear helps fill the grain.** "In elite bread wheat, ear photosynthesis matched or exceeded the shoot's; the flag-leaf blade gave only 3–18 %." |
| 5 | **C2 point 3** | "they are spent next, to reduce 3-PGA" leaves out the 3 of 9 ATP spent on rebuilding RuBP (C3). | "Fixing CO₂ costs no ATP or NADPH; they are spent later, to reduce 3-PGA and to rebuild RuBP." |

Also worth one line each (§1): add "mainly at high CO₂" to the TPU limit (C4b point 1). In C4b-e, write "Pᵢ stays locked in sugar phosphates", not "Pᵢ stays in cytosol". In C13 point 1, the chloroplast exports triose-P but the leaf exports sucrose.

---

## §1 Claim check

### C1 From light energy to organic carbon

| # | Item | Verdict | Evidence | Suggested wording |
|---|---|---|---|---|
| 1 | Lead: "uses ATP and NADPH … to fix CO₂ into sugar" | **imprecise; contradicts C2 and L01** | Carboxylation uses no ATP or NADPH ([von Caemmerer 2025](https://doi.org/10.1007/s00425-025-04834-7) Fig. 1, FT per 23 Oct #16); L01 text | Top fix 1 |
| 2 | P1: ATP and NADPH link the halves; ADP, Pᵢ and NADP⁺ return | OK | Pᵢ returns only when sugar is made ([Sharkey 2024](https://doi.org/10.1093/plphys/kiad601), FT). C4b now teaches this. | Keep |
| 3 | P2: water oxidised, carbon reduced | OK | TB; Calc (C goes from +4 to 0) | Keep |
| 4 | P3: Fd → Trx switches enzymes on; "at night they are inactivated" | OK | [Yoshida 2018](https://doi.org/10.1073/pnas.1808284115); [Yoshida & Hisabori 2023](https://doi.org/10.1093/pcp/pcad049) (Abs). The "off" step is an active oxidation (TrxL2/2-Cys Prx). | Optional: "…at night an oxidising pathway switches them off." |
| 5 | Fig b: photo half "12 H₂O → 6 O₂ + NADPH + ATP"; label "per CO₂: 3 ATP + 2 NADPH" | OK, with a caution | If coefficients are ever added: 12 NADPH need 18 ATP, but linear flow gives 12 × 18/14 ≈ **15.4 ATP** (Calc; 14 H⁺/3 ATP), the L11 gap. The per-CO₂ label duplicates C4. | Keep the photo half without coefficients. Drop the per-CO₂ label (C4 owns it). |
| 6 | Fig c: +4 → 0; 2 NADPH per CO₂; one O₂ per CO₂ | OK | Calc. Holds when the product is carbohydrate. | Keep |
| 7 | Fig d: land plants fix ≈ 120–160 Pg C yr⁻¹ (gross), upper values debated | OK | [Beer 2010](https://doi.org/10.1126/science.1184984) 123 ± 8; [Lai 2024](https://doi.org/10.1038/s41586-024-08050-3) 157 ± 8.5 (both Abs). Disputed by [Tian 2026](https://doi.org/10.1038/s41586-026-10562-z) (Matters Arising), with [Lai 2026 Reply](https://doi.org/10.1038/s41586-026-10561-0) (both Meta). | Keep. Optional: "≈ 45 % of plant dry mass is carbon" ([Ma 2018](https://doi.org/10.5194/bg-15-693-2018), Abs). |
| 8 | Fig d: myth "mass from soil" vs fact "carbon from CO₂" | OK | [Hershey 2003](https://www.botany.org/userdata/IssueArchive/issues/originalfile/PSB_2003_49_3.pdf) (FT; no DOI) | Keep. This is the hook for §3 story 1. |
| 9 | Fig e: FBPase, SBPase, PRK, GAPDH on (SH) / off (S–S); "activase uses ATP"; "GAPDH, PRK held by CP12" | OK, but **misplaced** | Yoshida & Hisabori 2023 (Abs). It names four enzymes and activase before C2 and C3 introduce Rubisco and the steps. | Move to C3 (§5) |
| 10 | Fig h: y-axis "enzymes switched on", "all / none" | imprecise | In low light FBPase and SBPase are only partly reduced, and their redox state tracks electron transport ([Yoshida & Hisabori 2024](https://doi.org/10.1093/pcp/pcae013), Abs) | Axis "share switched on (schematic)"; drop "all" |
| 11 | Figs a, f, g, i, j | OK | TB | — |
| 12 | Ref Johnson 2016 | **open (23 Oct)**: the correction is not cited | Crossref `updated-by` 10.1042/ebc20160016_cor | Cite the correction |

### C2 Carbon enters the CBB cycle

| # | Item | Verdict | Evidence | Suggested wording |
|---|---|---|---|---|
| 1 | Lead | OK | TB | Keep |
| 2 | P1: enzyme-bound 6-C step | OK | [Andersson 2008](https://doi.org/10.1093/jxb/ern091) (23 Oct) | Keep |
| 3 | P2: algae fed ¹⁴CO₂ for seconds; first label in 3-PGA | OK | [Bassham 2003](https://doi.org/10.1023/A:1024929725022) (Abs: "after a few seconds") | Add the primary source [Calvin & Benson 1948](https://doi.org/10.1126/science.107.2784.476) (Meta) to refs |
| 4 | P3: "…they are spent next, to reduce 3-PGA" | **imprecise** | Calc: 6 of 9 ATP go to reduction, 3 of 9 to regeneration (C3) | Top fix 5 |
| 5 | Fig c: feed, stop in hot alcohol, separate on paper | OK | Bassham 2003 (Abs). [Sharkey 2019](https://doi.org/10.1007/s11120-018-0600-2) (Abs) flags the "lollipop" and ascending-chromatography simplifications; the figure avoids both. | Keep |
| 6 | Fig d: extrapolated to zero time, all label in 3-PGA | OK as a schematic | TB | Keep "schematic" |
| 7 | Fig e: C₄ short pulse labels C₄ acids first (Hatch & Slack 1966) | OK; credit is incomplete | [Hatch & Slack 1966](https://doi.org/10.1042/bj1010103) (Abs: ~1 s pulse, > 93 % in malate, aspartate and OAA). Sugarcane C₄ acids were first reported by [Kortschak et al. 1965](https://doi.org/10.1104/pp.40.2.209) (Meta). | "Kortschak et al. 1965; Hatch & Slack 1966" |
| 8 | Fig g: CO₂ lowered → RuBP piles up, 3-PGA falls | OK (TB); **order** | Primary source: [Wilson & Calvin 1955](https://doi.org/10.1021/ja01627a050) "CO₂ dependent transients" (Meta). Students can read it only once they know RuBP is regenerated (C3). | Credit Wilson & Calvin 1955; place it with C3h (§5) |
| 9 | Fig a: the new carbon ends up as the carboxyl of one 3-PGA | OK | TB; Hatch & Slack (Abs): early label in C-1 of 3-PGA | Keep |
| 10 | Fig b: 15 + 3 = 18 = 6 × 3 | OK; duplicates C3a/b/c/g | Calc | C2 keeps 5 + 1 = 2 × 3 (variant j); C3 keeps the three-turn count |
| 11 | Rubisco activation (carbamylation) | **open (23 Oct, D gap 2)**: activase appears in C1e and C4j, carbamylation nowhere | [Lorimer 1976](https://doi.org/10.1021/bi00648a012) | §2 must 1 |

### C3 Reduction and regeneration

| # | Item | Verdict | Evidence | Suggested wording |
|---|---|---|---|---|
| 1 | Lead and P1–P2 | OK | Calc; von Caemmerer 2025 Fig. 1 | Keep |
| 2 | P3: one in six leaves; more would drain RuBP | OK at steady state | Refinement: sugar carbon re-enters the cycle at ~5 % of net fixation ([Xu 2022](https://doi.org/10.1073/pnas.2121531119), FT) | Keep. Use the refinement as the "now" in §3 story 2. |
| 3 | Fig h: light off → PGA up, RuBP down; "after Calvin's group, 1950s" | OK | TB. Primary source: [Calvin & Massini 1952](https://doi.org/10.1007/BF02139287) (Meta) | Credit "Calvin & Massini 1952" |
| 4 | Fig e: carboxyl → aldehyde; ATP adds P, NADPH adds e⁻, Pᵢ released | OK | TB | Keep |
| 5 | Fig i: net 3 CO₂ + 9 ATP + 6 NADPH → 1 triose-P | OK | Calc. The full balance also releases 8 Pᵢ (Context only). | Keep |
| 6 | Figs a–d, f, g, j: counts and the 3-C sack analogy | OK | Calc | Keep |
| 7 | Names: figures say "Calvin–Benson", the C1/C2 titles say "Calvin–Benson–Bassham"; labels mix "6 PGA" and "6 × 3-PGA" | inconsistent | Sharkey 2024 (FT) notes that both cycle names are in use | One name and one abbreviation throughout (§5) |

### C4 What the cycle produces and what it costs

| # | Item | Verdict | Evidence | Suggested wording |
|---|---|---|---|---|
| 1 | Lead: 3 CO₂ → one triose-P for 9 ATP + 6 NADPH | OK | Calc | "…yields one **net** triose phosphate…" |
| 2 | P1: not glucose; sucrose in the cytosol, starch in the chloroplast | OK | Sharkey 2024 (FT): most fixed carbon ends as sucrose or starch; free glucose occurs only in part of starch breakdown | Keep |
| 3 | P2: 3 ATP + 2 NADPH; "1.5 that the light reactions must match; photorespiration adds to it" | **imprecise; no link to L11** | [Kramer & Evans 2011](https://doi.org/10.1104/pp.110.166652) (23 Oct #30, #34: the ratio falls from 1.67 at Γ* to 1.5); L11 text | Top fix 2. The code comment "link to lecture 1 is qualitative only" is outdated now that L11 gives numbers (lecturer to decide). |
| 4 | P3: one hexose = two trioses = 18 ATP + 12 NADPH | OK | Calc | Keep |
| 5 | Fig d: "no glucose leaves" | ambiguous | "leaves" can be read as the noun. Leaves do hold free glucose (vacuole; Xu 2022, FT). | "The cycle releases no free glucose" |
| 6 | Fig c: classic 6 H₂O equation; C1b and C4b-i use the 12 H₂O form | inconsistent | L08 introduced 12 H₂O | One form for lecture 2 (§5) |
| 7 | Fig j: extra costs (photorespiration, CCM, sucrose and starch, activase) | OK | Calc. Sucrose needs UTP via UDP-glucose (Sharkey 2024, FT), an ATP equivalent. | Keep |
| 8 | Figs a, b, e–i | OK | Calc | Keep |

### C4b Sucrose by day, starch for the night

| # | Item | Verdict | Evidence | Suggested wording |
|---|---|---|---|---|
| 1 | Lead: "…sucrose for the plant and starch to last the night" | **imprecise for wheat** | [Schnyder 1993](https://doi.org/10.1111/j.1469-8137.1993.tb03731.x) (Abs) | Top fix 3 |
| 2 | P1: triose-P out for Pᵢ in; sucrose frees Pᵢ; if it lags, ATP synthesis slows (TPU) | OK; **refine** | Sharkey 2024 (FT): obligatory triose-P/Pᵢ exchange on the TPT; end products release Pᵢ for ATP. TPU "almost never" limits at ambient CO₂ ([McClain 2023](https://doi.org/10.1111/pce.14476), FT, *N. benthamiana*; [Kumarathunge 2019](https://doi.org/10.1111/pce.13639), Abs, 141 species). | "…the triose-phosphate-use (TPU) limit, seen mainly when CO₂ is raised." |
| 3 | P2: starch built by day, broken down at a rate that lasts until dawn | OK (Arabidopsis) | [Graf 2010](https://doi.org/10.1073/pnas.0914299107) (FT via PMC: ~95 % used by dawn). How the timer works is unresolved: a triple clock mutant still paces starch to dawn ([Moraes 2022](https://doi.org/10.1093/plphys/kiac226), Abs). | Add the wheat caveat (top fix 3) |
| 4 | P3: SWEETs release, SUTs load, pressure flow to growing organs | imprecise in scope | Two-step apoplasmic loading holds "in many herbaceous crop species" ([Braun 2022](https://doi.org/10.1146/annurev-arplant-070721-083240), Abs); [Chen 2012](https://doi.org/10.1126/science.1213351) (Abs); [Knoblauch 2016](https://doi.org/10.7554/eLife.15341) (FT) | **Sucrose travels in the phloem.** "In most crops SWEETs release it and SUTs load it; pressure flow carries it to roots, young leaves and grain." Better still, move this point to C13 (§5). |
| 5 | Fig e: "Pᵢ stays in cytosol" | imprecise | Pᵢ is tied up in phosphorylated sugars (Sharkey 2024, FT) | "Pᵢ stays locked in sugar phosphates" |
| 6 | Fig h: night comes early after 8 h; slower breakdown; both curves near empty at dawn | OK | Graf 2010 (FT via PMC: early night after 8 h instead of 12 h; "linear but markedly slower"; reserves last to ZT24) | Keep |
| 7 | Fig c: "sucrose made day and night" | OK | Sharkey 2024 (FT): carbon is supplied at an almost constant rate day and night | Keep |
| 8 | Figs a, g, i: starch leaves as maltose at night | OK | [Niittylä 2004](https://doi.org/10.1126/science.1091811) (Abs); Sharkey 2024 (FT): plus some glucose | Keep |
| 9 | Fig i: "No free glucose leaves the cycle" | OK; duplicates C4 | — | Drop here (§5) |
| 10 | Refs | incomplete | Chen 2012, Knoblauch 2016 and Smith & Zeeman 2020 are used in figures and comments but not listed | Add them if those variants are kept |

### C13 From leaf to loaf

| # | Item | Verdict | Evidence | Suggested wording |
|---|---|---|---|---|
| 1 | Lead | OK | — | Keep |
| 2 | P1: "The leaf exports triose phosphate as sucrose…" | imprecise | The chloroplast exports triose-P; the leaf ships sucrose (Sharkey 2024, FT) | "The chloroplast exports triose phosphate; the leaf ships sucrose, which the phloem carries to the grain." |
| 3 | P2: endosperm makes sucrose → ADP-glucose → starch | OK | [Beckles 2001](https://doi.org/10.1104/pp.125.2.818) (Abs); [Emes 2003](https://doi.org/10.1093/jxb/erg089) (Meta) | Keep |
| 4 | P3: the ear supplies more than the flag-leaf blade "(3–18 %)" | **imprecise; contested** | [Sanchez-Bragado 2014](https://doi.org/10.1093/jxb/eru298) (FT): six bread-wheat lines; shoot plus stem reserves ≈ 22 % of grain assimilate on average. [Sanchez-Bragado 2016](https://doi.org/10.1093/jxb/erw116) (Abs): methods disagree. [Zhang 2020](https://doi.org/10.1016/j.fcr.2020.107931) (Abs, Chinese field trials): spike 9.8–39 %, mean 20 %. | Top fix 4. Alternative point: "Half or more of grain carbon first sits in reserve pools" (Schnyder 1993, Abs). |
| 5 | Fig a: "water: split at PSII" | imprecise | L08: "Light does not split water directly". "Photolysis" was retired on 23 Oct. | "water: oxidised at PSII" |
| 6 | Fig b: atom ledger | OK | Calc. Oxygen tracing is bookkeeping because CO₂ and water swap O atoms (Context). | Keep |
| 7 | Fig d: ear > flag-leaf blade 3–18 %; stem fructans; leaves keep sucrose | OK | Schnyder 1993 (Abs); Sanchez-Bragado 2014 (FT) | Add "δ¹³C method"; add Schnyder to refs |
| 8 | Fig e: "Only sucrose travels"; leaf starch as the night store | overstated; **conflicts with fig d** | "Plants transport fixed carbon predominantly as sucrose" (Chen 2012, Abs); amino acids travel too. Wheat: Schnyder 1993. | Top fix 3 |
| 9 | Fig h: "night stock = leaf starch" | conflicts with fig d | Schnyder 1993 (Abs) | "night stock = leaf sucrose and starch" |
| 10 | Fig g: cytosolic AGPase in grass endosperm | OK | Beckles 2001 (Abs) | Keep |
| 11 | Figs c, f, i, j | OK | — | Keep |

---

## §2 Missing topics

| Rank | Topic | One line of content | Where | Source (level) |
|---|---|---|---|---|
| **Must 1** | Rubisco must be activated. **Open (23 Oct)** | An activator CO₂ and Mg²⁺ bind the active site first. Activase uses ATP to free sites blocked by sugar phosphates. | C2, one line (or C5 with heat) | [Lorimer 1976](https://doi.org/10.1021/bi00648a012) (Meta; Abs on 23 Oct); [Yamori 2026](https://doi.org/10.1111/pce.70617) (Abs: activase releases inhibitors, ATP-dependent) |
| **Must 2** | Where wheat keeps its carbon | Leaves store the day's carbon mainly as sucrose; stems store fructans; half or more of grain carbon passes through reserve pools first. | C4b caveat; C13 | [Schnyder 1993](https://doi.org/10.1111/j.1469-8137.1993.tb03731.x) (Abs) |
| **Must 3** | Which steps light switches | GAPDH in reduction; FBPase, SBPase and PRK in regeneration; Rubisco through activase. C1e uses these names before any slide explains them. | C3 (overlay on the cycle) | [Yoshida & Hisabori 2023](https://doi.org/10.1093/pcp/pcad049) (Abs) |
| Nice 4 | A second light signal: stromal pH | Light raises stromal pH by about one unit, to ≈ 8. Fixation stops below pH 7.3 (optimum 8.1). | C1 Context | [Werdan 1975](https://doi.org/10.1016/0005-2728(75)90041-9) (Abs) |
| Nice 5 | Switching on takes minutes | After shade, wheat flag leaves need ≈ 15 min to regain full rate, mainly while Rubisco activates. The modelled cost is ≈ 21 % of daily uptake (10–40 % across crops). | C1 (fits animation h) | [Taylor & Long 2017](https://doi.org/10.1098/rstb.2016.0543) (Abs); [Long 2022](https://doi.org/10.1146/annurev-arplant-070221-024745) (Abs) |
| Nice 6 | TPU is a ceiling set just above need | Rarely limiting at today's CO₂; TPU capacity sits just above ambient demand; seen when CO₂ is raised | C4b P1; C12 | McClain 2023 (FT); Kumarathunge 2019 (Abs); [Gregory 2021](https://doi.org/10.1111/pce.14153) and [Rogers 2021](https://doi.org/10.1111/nph.17092) (Meta: keep in leaf models, drop from global ones) |
| Nice 7 | The cycle is not sealed | Sugar from the cytosol and vacuole re-enters the cycle (~5 % of net fixation, G6P shunt) | C3 Context; story 2 | [Xu 2022](https://doi.org/10.1073/pnas.2121531119) (FT) |
| Nice 8 | How sucrose enters the grain | Mother and grain tissues share no plasmodesmata, so sucrose crosses the cell walls between them; endosperm transfer cells take it up. SWEET4 is needed for seed filling in maize and rice. | C13 Context | [Braun 2022](https://doi.org/10.1146/annurev-arplant-070721-083240) (Abs); [Sosso 2015](https://doi.org/10.1038/ng.3422) (Abs) |
| Nice 9 | Not all fixed carbon reaches the grain | Land plants respire roughly half of what they fix (Calc: land NPP ≈ half of 105 Pg C vs GPP ≈ 123) | C13 Context | [Field 1998](https://doi.org/10.1126/science.281.5374.237), Beer 2010 (Abs); Calc |
| Nice 10 | How much of a plant is air | ≈ 45 % of dry mass is carbon (45.0 % in reproductive organs, 4318 species) | C1d or C13 | [Ma 2018](https://doi.org/10.5194/bg-15-693-2018) (Abs) |
| Nice 11 | Why sucrose frees phosphate | Sucrose 6-P is made from UDP-glucose + F6P, then dephosphorylated; sucrose is the phosphate-free end point | C4b Context | Sharkey 2024 (FT) |
| Nice 12 | Breeding gains track grain-fill photosynthesis | 273 wheat varieties (1890–2019): yield +0.84 % yr⁻¹; seed-fill A_sat +0.58 % yr⁻¹; the link holds only during seed fill | C13 ("now") | [Ding 2025](https://doi.org/10.1002/csc2.70005) (Abs) |

---

## §3 History stories ("then → now")

**1. Where the bread comes from: the willow (opening hook for lecture 2)**
- **Then.** Van Helmont, published 1648 (first English translation 1662). He planted a 5 lb willow in 200 lb of oven-dried soil and gave it only rain or distilled water. After five years the willow weighed 169 lb 3 oz, and the soil had lost only about 2 oz. He concluded the wood came "out of water onely" (Hershey 2003, FT).
- **The twist.** Van Helmont himself coined *gas sylvestre* for CO₂. He also knew that 62 lb of charcoal burns to 61 lb of gas and 1 lb of ash, yet he missed that the tree was made of that gas. The pot experiment was probably borrowed from Nicolaus of Cusa (~1450) (Hershey 2003, FT).
- **Fix.** De Saussure 1804 showed that the carbon comes from CO₂ and that water also adds to dry mass. Primary source: [de Saussure 1804](https://doi.org/10.5962/bhl.title.16533) (Meta); [Hill 2013 translation](https://doi.org/10.1007/978-1-4614-4136-6) (Meta). Details from secondary sources: UNVERIFIED.
- **Now.** About 45 % of a plant's dry mass is carbon ([Ma 2018](https://doi.org/10.5194/bg-15-693-2018), Abs). Land plants fix ≈ 120–160 Pg C yr⁻¹, and the upper value is under live dispute ([Lai 2024](https://doi.org/10.1038/s41586-024-08050-3) vs [Tian 2026](https://doi.org/10.1038/s41586-026-10562-z) and [Lai 2026 Reply](https://doi.org/10.1038/s41586-026-10561-0)).
- **Why it works.** It turns L01's promise ("the carbon in bread comes from air") into a measurement, in under a minute.

**2. Calvin's first label, and the cycle that leaks (new angle on 23 Oct S1)**
- **Then.** A few seconds of ¹⁴CO₂ label 3-PGA first ([Calvin & Benson 1948](https://doi.org/10.1126/science.107.2784.476), Meta). Benson identified ribulose among the products ([Benson 1951](https://doi.org/10.1021/ja01150a545), Meta). The closed cycle followed in 1954.
- **Now.** With ¹³CO₂, cycle intermediates in *Camelina* leaves reach 80–90 % label quickly, but the last 10–20 % labels slowly. Unlabelled carbon from cytosolic and vacuolar sugars re-enters through a glucose-6-phosphate shunt, at ≈ 5 % of net fixation ([Xu 2022](https://doi.org/10.1073/pnas.2121531119), FT). Sharkey 2024 (FT) discusses the same slow final 10–20 % under the heading "the pyruvate paradox".
- **Why it works.** Same method, 70 years apart. The core cycle stands, but it trades carbon with the cell. Fits C3.

**3. Münch's pressure flow, tested 86 years later**
- **Then.** Münch (1930; a book, no DOI) proposed osmotic pressure flow in the phloem. Aphid mouthparts became natural syringes for sampling sieve-tube sap ([Kennedy & Mittler 1953](https://doi.org/10.1038/171528a0), Meta).
- **Now.** In 7.5 m morning-glory vines, all the flow parameters were measured: source sieve-tube turgor ≈ 1.1 MPa, and conductivity and turgor rise with transport distance. This strongly supports Münch ([Knoblauch 2016](https://doi.org/10.7554/eLife.15341), FT). Single-cell RNA sequencing has since located the SWEET11/12 cells that release sucrose for loading ([Kim 2021](https://doi.org/10.1093/plcell/koaa060), Abs).
- **Why it works.** It completes the route from leaf to grain. Fits wherever phloem is taught (C13, per §5).

**Reserves.**
- **R1. Clock-timed starch.** Then: an unexpected early night after 8 h slows starch breakdown so that it lasts to the anticipated dawn ([Graf 2010](https://doi.org/10.1073/pnas.0914299107), FT). Now: a triple clock mutant still paces starch to dawn, so the timer is unresolved ([Moraes 2022](https://doi.org/10.1093/plphys/kiac226), Abs). This turns 23 Oct S6 around: Graf becomes the "then".
- **R2. Who feeds the wheat grain?** Then: the flag leaf was "traditionally" thought to be the main source (Sanchez-Bragado 2014, FT). Now: the answer depends on the method ([2016](https://doi.org/10.1093/jxb/erw116), Abs; [Zhang 2020](https://doi.org/10.1016/j.fcr.2020.107931), Abs). Breeding gains track photosynthesis during grain fill ([Ding 2025](https://doi.org/10.1002/csc2.70005), Abs).
- **R3. Benson and the rift.** Benson found ribulose (1951); the 1961 Nobel Prize went to Calvin alone; Sharkey 2019 (Abs) describes the rift. Details of Benson's departure are UNVERIFIED.
- **R4. Buchanan's thioredoxin.** Open (23 Oct story 14). New angle: a second reducing route, NADPH-driven NTRC, reduces CP12 in the cold ([Teh 2023](https://doi.org/10.1073/pnas.2306338120), Abs; mutant evidence in *Chlamydomonas*, in vitro only for *Arabidopsis* CP12).

---

## §4 Newer findings

### 4a Textbook statements refined or contradicted

| Textbook statement | Refinement | Source (level) |
|---|---|---|
| The CBB cycle is a closed loop | Sugar carbon re-enters it (≈ 5 % of net fixation) | Xu 2022 (FT) |
| Leaves store starch for the night | True for Arabidopsis-type leaves. Wheat and barley store mainly sucrose by day and stem fructans for longer. | Schnyder 1993 (Abs) |
| The flag leaf feeds the grain | The ear contributes as much as the shoot or more, depending on the method. Half or more of grain carbon passes through reserve pools first. | Sanchez-Bragado 2014 (FT), 2016 (Abs); Schnyder 1993 (Abs) |
| TPU is the third limit on photosynthesis | It almost never limits at today's CO₂. Global models drop it; leaf models keep it. | McClain 2023 (FT); Kumarathunge 2019 (Abs); Rogers 2021, Gregory 2021 (Meta) |
| The circadian clock sets starch breakdown | The pacing survives major clock disruption, so the mechanism is open | Moraes 2022 (Abs) |
| Light switches on the cycle by Fd–Trx | Also NADPH-NTRC, plus an active oxidising "off" pathway | Teh 2023 (Abs); Yoshida 2018 (Abs) |
| Global GPP ≈ 120 Pg C yr⁻¹ | 157 from COS; contested | Lai 2024 (Abs); Tian 2026, Lai 2026 (Meta) |
| Plant dry mass is 50 % carbon | 45–48 % by organ | Ma 2018 (Abs) |

### 4b Latest findings, 2022–2026

| Finding | Label |
|---|---|
| ¹³C labelling anomalies explained by sugar re-import into the cycle (Xu 2022, PNAS) | solid data; shunt size is model-based |
| TPU almost never limits at ambient CO₂; at 1500 ppm, *N. benthamiana* removed the limit within 30 h by lowering V_cmax and J_max (McClain 2023, PCE) | solid |
| In rice, leaf TPU follows whole-plant sink/source and N during grain filling ([Zhou 2023](https://doi.org/10.1093/jxb/erad329), Abs) | solid, one crop |
| Starch pacing to dawn persists in the *lhy cca1 elf3* mutant (Moraes 2022) | contested mechanism |
| NTRC reduces CP12 and frees PRK and GAPDH in the cold (Teh 2023, PNAS) | solid in an alga; in vitro in plants |
| Shade-to-sun induction costs 10–40 % of potential crop uptake (Long 2022) | solid review; model-based |
| More Rubisco activase speeds induction in rice under fluctuating light at high CO₂ (Yamori 2026, PCE) | single study |
| Land GPP 157 ± 8.5 Pg C yr⁻¹ from carbonyl sulfide (Lai 2024), challenged on tropical GPP (Tian 2026) with a reply (Lai 2026) | contested |
| Wheat yield gains over 129 years correlate with grain-fill A_sat (Ding 2025) | solid meta-analysis; correlation only |

No preprints are used.

---

## §5 Order notes

### A. Must come before

1. **C1 redox (C goes from +4 to 0) → C3 reduction.** Already in the right order.
2. **C2 Rubisco and C3 enzymes → light switch at enzyme level.** C1e and C1h name FBPase, SBPase, PRK, GAPDH and activase before C2 and C3 explain them.
   - Keep the headline in C1: "the 'dark reactions' need light; switched on by day, off at night".
   - Move the enzyme chips to C3, as an overlay on the cycle: GAPDH in reduction; FBPase, SBPase and PRK in regeneration.
   - Put activase and carbamylation in C2 (or C5).
3. **C3 (RuBP is regenerated) → both Calvin transients.** The CO₂-drop (C2g) is readable only once students know RuBP keeps being made. Show both switches together at the end of C3 (C3h plus C2g), as 23 Oct S1 proposed.
4. **C3 step costs → C4 totals → the L11 gap.** C4 is the one place for 3 ATP + 2 NADPH per CO₂ and for "1.5 vs ≈ 1.3".
5. **C4b triose-P/Pᵢ exchange → TPU in C12.** L15 already says "④ sugar export (TPU)", so the mechanism must come before C12.
6. **C4b leaf storage (with the wheat caveat) → C13's grain and reserves.**

### B. Repeated ideas

| Idea | Appears in | Keep in | Drop or recall elsewhere |
|---|---|---|---|
| "C₆H₁₂O₆ is bookkeeping" | C1b, C4 (P3, c, d), C4b-i, C13 P1 | C4 | Drop from C1b and C4b-i; one recall line in C13 |
| Carbon count 15 + 3 = 18 | C2b; C3a, b, c, g | C3 | C2 shows 5 + 1 = 2 × 3 only |
| 3 ATP + 2 NADPH per CO₂ | C1b label, C4 P2 (L11 says "needs 1.5") | C4 | Drop the C1b label |
| Phloem: SWEET, SUT, pressure flow | C4b P3 and variants a, b, d, f, g, j; C13 P1 and variants c, e, g, h | **C13** (route to grain) | C4b keeps the chloroplast and the leaf cell |
| Equation form | 12 H₂O: C1b, C4b-i, C13b. 6 H₂O: C4c, C13a, C13j | 12 H₂O after L08; 6 H₂O only where labelled "the opening equation" (C13a) | C4c → 12 H₂O |
| Cycle name | "Calvin–Benson" in L01, L10, L11, L15 and in C3/C4/C4b figures; "Calvin–Benson–Bassham" in the C1 and C2 titles | Say "Calvin–Benson–Bassham (CBB), also called Calvin–Benson" once in C1, then one form | — |
| "Carbon comes from air" | L01 bullet; C1d | C1d as the lecture-2 hook (story 1) | — |
| Redox | L01, L08, C1 P2 | C1 as a one-line recap | — |
| TPU | L15 figure; C4b P1, b, e; C12 Ap | C4b (mechanism), C12 (limit) | L15 teases it only |

### C. Where C4b belongs

**Recommendation: keep C4b right after C4, and move its phloem point to C13.**
- C4 ends on "becomes sucrose and starch". C4b answers that at once; moved to the end, it would leave the promise hanging for eight slides.
- The triose-P/Pᵢ exchange closes the loop C1 opened ("ADP, Pᵢ and NADP⁺ return"). It also gives TPU its mechanism before C12 uses it, and after L15 has teased it.
- C5 then opens cleanly on a new question: Rubisco also takes O₂.
- Moving the phloem point to C13 makes C13 a single path, phloem → grain → bread, and removes the duplication in table B.
- The alternative (C4b just before C13) gives a tidy "fate of carbon" finale, but then C12 uses TPU unexplained. That would mean either dropping Ap from C12 or wedging C4b between C11 and C12, which breaks the gas-exchange → model step. I do not recommend it.

### D. Proposed order for this block

1. **C1** Hook: willow, carbon from air. Bridge: ATP + NADPH, redox. Headline: light switches the cycle on.
2. **C2** Rubisco fixes CO₂, plus one line on Rubisco activation.
3. **C3** Reduce and regenerate; the four light-switched enzymes placed on the cycle; the two Calvin transients.
4. **C4** One net triose-P for 9 ATP + 6 NADPH; 1.5 vs ≈ 1.3 (L11).
5. **C4b** Out of the chloroplast: triose-P for Pᵢ (→ TPU); sucrose by day; starch or sucrose for the night, with the wheat caveat.
6. **C5–C12** unchanged; C12's Ap refers back to C4b.
7. **C13** Phloem → grain (reserves, ear, endosperm starch) → back to the equation.

### E. Where the missing topics sit

| Topic | Slot |
|---|---|
| Must 1 (activation) | C2 |
| Must 2 (wheat sucrose and fructans) | C4b and C13 |
| Must 3 (switched enzymes) | C3 |
| Nice 4 (stromal pH) | C1 Context |
| Nice 5 (induction) | C1 animation h |
| Nice 6 (TPU ceiling) | C4b and C12 |
| Nice 7 (leaky cycle) | C3 Context |
| Nice 8, 9 (grain entry; respiration share) | C13 Context |
| Nice 10 (45 % carbon) | C1d |
| Nice 11 (sucrose frees Pᵢ) | C4b Context |
| Nice 12 (breeding gains track grain-fill photosynthesis) | C13 |

---

## Appendix A: Crossref register

Checked 27 Oct 2026. "–" means Crossref lists no `updated-by` entry. Years are Crossref's "issued" year; print years can differ (noted).

| DOI | First author | Year | Journal | Title (short) | updated-by |
|---|---|---|---|---|---|
| 10.1042/EBC20160016 | Johnson | 2016 | Essays Biochem | Photosynthesis | **correction 10.1042/ebc20160016_cor** |
| 10.1093/plphys/kiad601 | Sharkey | 2024 | Plant Physiol | The end game(s) of photosynthetic carbon metabolism | – |
| 10.1093/pcp/pcad049 | Yoshida | 2023 | Plant Cell Physiol | Redox regulation network in chloroplasts | – |
| 10.1093/pcp/pcae013 | Yoshida | 2024 | Plant Cell Physiol | Divergent protein redox dynamics … induction | – |
| 10.1073/pnas.1808284115 | Yoshida | 2018 | PNAS | TrxL2/2-Cys Prx oxidative thiol modulation | – |
| 10.1007/s11120-015-0212-z | Buchanan | 2015 (print 2016) | Photosynth Res | The carbon (formerly dark) reactions | – |
| 10.1126/science.1184984 | Beer | 2010 | Science | Terrestrial gross CO₂ uptake | – |
| 10.1038/s41586-024-08050-3 | Lai | 2024 | Nature | Photosynthesis from COS uptake | – |
| 10.1038/s41586-026-10562-z | Tian | 2026 | Nature | The size of tropical vegetation GPP | – |
| 10.1038/s41586-026-10561-0 | Lai | 2026 | Nature | Reply to: The size of tropical vegetation GPP | – |
| 10.1126/science.281.5374.237 | Field | 1998 | Science | Primary production of the biosphere | – |
| 10.5194/bg-15-693-2018 | Ma | 2018 | Biogeosciences | Carbon content in plants: a global synthesis | – |
| 10.2307/4449369 | Hershey | 1991 | Am Biol Teach | Helmont's willow tree experiment | – |
| 10.5962/bhl.title.16533 | Saussure | 1804 | (BHL) | Recherches chimiques sur la végétation | – |
| 10.1007/978-1-4614-4136-6 | de Saussure (tr. Hill) | 2013 | Springer | Chemical Research on Plant Growth | – |
| 10.1126/science.107.2784.476 | Calvin | 1948 | Science | The path of carbon in photosynthesis | – |
| 10.1021/ja01150a545 | Benson | 1951 | JACS | Identification of ribulose in ¹⁴CO₂ products | – |
| 10.1021/ja01636a012 | Bassham | 1954 | JACS | Path of carbon XXI: cyclic regeneration | – |
| 10.1023/A:1024929725022 | Bassham | 2003 | Photosynth Res | Mapping the carbon reduction cycle | – |
| 10.1007/s11120-018-0600-2 | Sharkey | 2018 (print 2019) | Photosynth Res | Discovery of the canonical CB cycle | – |
| 10.1023/A:1020427619771 | Benson | 2002 | Photosynth Res | Following the path of carbon | – |
| 10.1007/BF02139287 | Calvin | 1952 | Experientia | Path of carbon XX: the steady state | – |
| 10.1021/ja01627a050 | Wilson | 1955 | JACS | CO₂-dependent transients | – |
| 10.1042/bj1010103 | Hatch | 1966 | Biochem J | Photosynthesis by sugar-cane leaves | – |
| 10.1104/pp.40.2.209 | Kortschak | 1965 | Plant Physiol | CO₂ fixation in sugarcane leaves | – |
| 10.1093/jxb/ern091 | Andersson | 2007 (print 2008) | J Exp Bot | Catalysis and regulation in Rubisco | – |
| 10.1021/bi00648a012 | Lorimer | 1976 | Biochemistry | Activation of Rubisco by CO₂ and Mg²⁺ | – |
| 10.1016/0005-2728(75)90041-9 | Werdan | 1975 | BBA Bioenerg | Role of pH in carbon fixation in the stroma | – |
| 10.1111/nph.18394 | Raines | 2022 | New Phytol | Re-tuning RuBP regeneration | – |
| 10.1007/s00425-025-04834-7 | von Caemmerer | 2025 | Planta | Perspective on the FvCB model | – |
| 10.1104/pp.110.166652 | Kramer | 2010 (print 2011) | Plant Physiol | Energy balance and productivity | – |
| 10.1073/pnas.2121531119 | Xu | 2022 | PNAS | Reimport of carbon into the CB cycle | – |
| 10.1146/annurev.arplant.50.1.27 | Flügge | 1999 | Annu Rev Plant Biol | Phosphate translocators in plastids | – |
| 10.1126/science.1091811 | Niittylä | 2004 | Science | Maltose transporter (MEX1) | – |
| 10.1073/pnas.0914299107 | Graf | 2010 | PNAS | Circadian control of carbohydrate at night | – |
| 10.1146/annurev-arplant-050718-100241 | Smith | 2020 | Annu Rev Plant Biol | Starch: a flexible, adaptable carbon store | – |
| 10.1093/plphys/kiac226 | Alexandre Moraes | 2022 | Plant Physiol | *lhy cca1 elf3* paces starch to dawn | – |
| 10.1146/annurev-arplant-070721-083240 | Braun | 2022 | Annu Rev Plant Biol | Phloem loading and unloading of sucrose | – |
| 10.1126/science.1213351 | Chen | 2012 | Science | Sucrose efflux by SWEETs | – |
| 10.7554/eLife.15341 | Knoblauch | 2016 | eLife | Testing the Münch hypothesis | – |
| 10.1038/171528a0 | Kennedy | 1953 | Nature | Phloem sap via aphid mouthparts | – |
| 10.1093/plcell/koaa060 | Kim | 2021 | Plant Cell | Leaf phloem cells by single-cell RNA-seq | – |
| 10.1038/ng.3422 | Sosso | 2015 | Nat Genet | SWEET-mediated seed filling | – |
| 10.1111/pce.14476 | McClain | 2022 (print 2023) | Plant Cell Environ | Acclimation to TPU limitation | – |
| 10.1111/pce.13639 | Kumarathunge | 2019 | Plant Cell Environ | No evidence for TPU limitation at current CO₂ | – |
| 10.1111/pce.14153 | Gregory | 2021 | Plant Cell Environ | TPU: out of global models, in leaf models | – |
| 10.1111/nph.17092 | Rogers | 2020 (print 2021) | New Phytol | TPU: an unnecessary complexity in TBMs | – |
| 10.1093/jxb/erad329 | Zhou | 2023 | J Exp Bot | TPU vs sink–source and N in rice | – |
| 10.1111/j.1469-8137.1993.tb03731.x | Schnyder | 1993 | New Phytol | Carbohydrate storage in wheat and barley grain filling | – |
| 10.1093/jxb/eru298 | Sanchez-Bragado | 2014 | J Exp Bot | Shoot vs ear photosynthesis by δ¹³C | – |
| 10.1093/jxb/erw116 | Sanchez-Bragado | 2016 | J Exp Bot | Ear contribution: methods compared | – |
| 10.1016/j.fcr.2020.107931 | Zhang | 2020 | Field Crops Res | Spike photosynthesis in crop models | – |
| 10.1002/csc2.70005 | Ding | 2025 | Crop Sci | Photosynthesis-driven yield gains in wheat | – |
| 10.1104/pp.125.2.818 | Beckles | 2001 | Plant Physiol | Cytosolic AGPase in grass endosperm | – |
| 10.1093/jxb/erg089 | Emes | 2003 | J Exp Bot | Starch synthesis in developing endosperm | – |
| 10.1098/rstb.2016.0543 | Taylor | 2017 | Phil Trans R Soc B | Slow induction in wheat costs ≥ 21 % | – |
| 10.1146/annurev-arplant-070221-024745 | Long | 2022 | Annu Rev Plant Biol | Photosynthesis in fluctuating light | – |
| 10.1111/pce.70617 | Yamori | 2026 | Plant Cell Environ | Rubisco activase overexpression in rice, fluctuating light | – |
| 10.1073/pnas.2306338120 | Teh | 2023 | PNAS | NTRC regulates CP12 in the cold | – |
| 10.1038/266565a0 | Wolosiuk | 1977 | Nature | Thioredoxin and glutathione regulate photosynthesis | – |

No retractions. The only update is the Johnson 2016 correction.

## Appendix B: Unverified (keep off the slides until checked)

- **De Saussure 1804 specifics** (closed vessels; dry-mass gain larger than the CO₂ carbon, so water is fixed too). Seen only in secondary sources (an encyclopedia citing Hill 2013, pp. 85–86). The book and its translation were not read.
- **Van Helmont's numbers and the Cusa link.** From Hershey 2003 (FT), which is secondary; the 1648 primary was not read.
- **Older primary papers, metadata only:**
  - Kortschak 1965: content.
  - Calvin & Massini 1952 and Wilson & Calvin 1955: direction of the transients (TB).
  - Benson 1951: content.
  - Kennedy & Mittler 1953: content.
- **Münch 1930.** A book with no DOI; known here only through Knoblauch 2016.
- **The Calvin–Benson rift.** Abstract only; details of Benson's departure unchecked.
- **Zhang 2020 spike share** (9.8–39 %, mean 20 %). From the Europe PMC abstract record; Crossref has no abstract, and the scope (Chinese trials) comes from the abstract.
- **"Plants respire about half of GPP".** My calculation from two abstracts (Beer 2010; Field 1998). Biome and crop values differ.
- **Wheat's share of dietary calories.** Shiferaw 2013 is still unchecked (paywalled). Taylor & Long 2017 (Abs) says only "second most important direct source of food calories".
- **Teh 2023 for land plants.** Shown in vitro only for *Arabidopsis*.
- **Lai 2026 Reply and Tian 2026.** Content not read (Meta).
- **Flügge 1999, Emes 2003, Hershey 1991, Hill 2013, de Saussure 1804.** Metadata only.
