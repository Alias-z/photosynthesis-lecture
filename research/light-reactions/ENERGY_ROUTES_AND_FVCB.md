# Electron routes, energy demand, and the FvCB connection

Checked 21 October 2026, following the instructor's request to revisit the energy accounting. This supplements and qualifies the original linear-flow example. The detailed route comparison and model equations are instructor notes; they are not all intended for bachelor slides.

## The Yin review

The matching review is **Yin, Busch, Struik & Sharkey (2021), “Evolution of a biochemical model of steady-state photosynthesis”**, *Plant, Cell & Environment* 44:2811–2837, [doi:10.1111/pce.14070](https://doi.org/10.1111/pce.14070). It marks **40 years**, and was already in the Photosynthesis collection (`UP76JVDM`, PDF `ADWJB3PA`). Sections 3.1–3.4 and Figure 2 are particularly relevant.

Its useful warning is that an electron-transport-limited assimilation equation depends on the energy and electron-routing assumptions behind it. PSII flux, PSI flux, and the electron supply supporting carbon metabolism need not be identical. Its modelling category “pseudocyclic” includes several alternative electron sinks; it must not be drawn as one biochemical cycle.

For the underlying derivation, see [Yin et al. (2004)](https://doi.org/10.1111/j.1365-3040.2004.01224.x). For C4-specific assumptions, compare [Yin & Struik (2012)](https://doi.org/10.1111/j.1365-3040.2012.02490.x). These are valuable model treatments, not measurements establishing one universal coupling ratio.

## 1. Keep supply, consumption, and pool size separate

- **Supply:** electron routes determine where reducing equivalents go and how much proton translocation can accompany them; coupling converts that into ATP synthesis.
- **Consumption:** Calvin-cycle flux, Rubisco oxygenation/photorespiration, nitrogen assimilation, and other metabolism determine ATP and reductant demand.
- **Pool size:** measured ATP or NADPH concentration reflects both supply and consumption. An unchanged concentration does not establish an unchanged production flux.

Thus, a single “ATP:NADPH ratio of photosynthesis” is inadequate. State the route, coupling assumption, metabolic scope, and whether the quantity is a flux or a concentration.

## 2. Route comparison using a consistent electron basis

The numerical examples below use **h = 14/3 H⁺ per ATP**, a full b6f Q cycle, and ideal tight coupling. They are derived bookkeeping examples, not fixed measured yields. A cyclic electron is counted each time it completes a circuit, whereas a linear electron is counted on its passage from water to the terminal acceptor.

| Route and electron basis | H⁺ supplied to the lumen / transferred across the membrane | Net reductant available as NADPH | Ideal ATP supported | Where this belongs |
|---|---|---|---|---|
| Linear flow: 4 e⁻, water → PSII → b6f → PSI → NADP⁺ | 4 H⁺ released from water + 8 H⁺ transferred through PQ/b6f accounting = **12 H⁺** | **2 NADPH** | **18/7 ≈ 2.57 ATP** | Main lecture example; 1 O₂ evolved, minimum 8 successful photons |
| Cyclic route with non-proton-pumping Fd→PQ return: 4 e⁻ circuits around PSI | **8 H⁺** through b6f/Q-cycle accounting | **0 net NADPH** | **12/7 ≈ 1.71 ATP** | Brief classroom comparison; no net O₂ from this route, minimum 4 PSI photons |
| NDH-mediated cyclic flow: 4 e⁻ circuits | Approximately 8 H⁺ through NDH + 8 H⁺ through b6f = **16 H⁺** under the cited pumping model | **0 net NADPH** | **24/7 ≈ 3.43 ATP** | Instructor detail or one verbal qualification; not a second numerical problem |
| Water–water/Mehler-peroxidase flow: 4 e⁻ transferred ultimately from water back to O₂ | Can retain proton-coupled transport through the chain | **No net NADPH retained** by a complete water–water cycle | Conditional on routing and detoxification; not assigned a universal yield here | Instructor context; detoxification can consume reductant, and gross O₂ production and uptake must be distinguished |
| Export of reducing equivalents / alternative metabolic sinks | Depends on the route supplying them | Reductant is used outside the Calvin-cycle budget | Not automatically ATP delivered to the chloroplast | Instructor context; avoid drawing the malate valve as a direct ATP import pipe |

The distinction between the two cyclic examples is additional proton pumping by NDH. Evidence for approximately **2 pumped H⁺ per electron at NDH**, on top of b6f contributions, comes from [Strand, Fisher & Kramer (2017)](https://doi.org/10.1074/jbc.M116.770792). This does not assign a settled molecular identity to the PGR5-dependent Fd→PQ return reaction.

The water–water cycle and reductant-export alternatives are discussed in [Kramer & Evans (2011)](https://doi.org/10.1104/pp.110.166652). Their relative importance must be evaluated for the species and conditions; they are not interchangeable arrows.

### One optional worked example, for the instructor

Four linear electrons supply 12 H⁺ and 2 NADPH in this ideal account. One additional circuit through a non-proton-pumping cyclic return plus the b6f Q cycle adds 2 H⁺. Then **14 H⁺ → 3 ATP**, while net NADPH remains **2**. Minimum successful photon counts become 4 PSII + 5 PSI.

This illustrates how changing the route changes the supply ratio. It is **not** evidence that every C3 leaf must execute exactly one cyclic electron per four linear electrons. With an NDH return, a different circulation rate would give the same additional proton flux.

### Why different papers give different ATP yields

The original four-electron example must not silently switch among assumptions:

| Idealized whole-chain assumption | ATP per 4 linear e⁻ (= 2 NADPH) |
|---|---:|
| Historical no-Q-cycle account: 2 H⁺/e⁻, h = 3 | 8/3 ≈ 2.67 |
| Full Q cycle: 3 H⁺/e⁻, h = 4 | 3 |
| Full Q cycle: 3 H⁺/e⁻, h = 14/3 | 18/7 ≈ 2.57 |

The first row is historical model accounting, not a proposed alternative operating mode to teach for the modern plant chain. The structural c14 ratio and experimentally inferred effective coupling values are different kinds of evidence. The lecture can use the last row, visibly labelled as an assumption, while the instructor keeps the alternatives available. [Kramer & Evans (2011)](https://doi.org/10.1104/pp.110.166652), [Yin & Struik (2012)](https://doi.org/10.1111/j.1365-3040.2012.02490.x).

## 3. Metabolic demand changes too

For the **canonical fully recycling C3 carboxylation/oxygenation model**, with Vc and Vo denoting Rubisco carboxylation and oxygenation fluxes:

**ATP demand = 3 Vc + 3.5 Vo**

**Reductant demand = 2 Vc + 2 Vo NADPH equivalents**

**A + Rd = Vc − 0.5 Vo**

These are flux accounts. “NADPH equivalents” groups reducing equivalents for the model; it does not imply that every reaction in every organelle directly consumes chloroplast NADPH. The oxygenation term includes the associated recycling/restoration account, rather than only one isolated salvage enzyme.

| Metabolic account | ATP:NADPH-equivalent demand |
|---|---:|
| Calvin cycle alone, Vo = 0 | 3:2 = **1.5** |
| Canonical oxygenation/photorespiratory branch | 3.5:2 = **1.75** |
| Combined C3 demand, Vo/Vc = 0.3 | (3 + 3.5 × 0.3)/(2 + 2 × 0.3) = **1.558** |

The last case costs approximately **4.76 ATP and 3.06 NADPH equivalents per net CO₂ gain before Rd**, because carboxylation must also replace photorespiratory CO₂ loss. Carbon exiting the pathway as glycine, serine, or C1 intermediates changes this canonical budget. Keep those extensions in instructor notes. [Walker and colleagues (2024)](https://doi.org/10.1111/pce.14949).

For C4, distinguish **whole-leaf extra ATP demand for the concentrating cycle** from **local demand in mesophyll and bundle-sheath chloroplasts**. Subtype, metabolite exchange, and leakiness matter. A whole-leaf ratio cannot simply be assigned to both cell types. In *Flaveria bidentis*, [Ermakova et al. (2024)](https://doi.org/10.1111/nph.19982) directly examined the major contribution of NDH-mediated cyclic flow in bundle-sheath cells. That cell-specific result should not be erased by generalizing Arabidopsis C3 results to all photosynthesis.

## 4. What to retain for the brief FvCB introduction

For the standard carbon/reductant-limited case, the familiar net-assimilation expression is:

**Aj = J (Cc − Γ*)/[4(Cc + 2Γ*)] − Rd**

Here the meaning of J matters. When alternative routes run, the PSII electron flux estimated from fluorescence is not automatically the entire electron supply supporting that carbon-metabolism expression.

Using the generalized model's fractions of total PSI flux:

- **J2 = (1 − fcyc) J1**
- **Jcarbon = (1 − fcyc − fpseudo) J1**, supporting the Calvin and photorespiratory accounts together

These show why PSI flux, PSII flux, and carbon-directed flux may differ. They are model bookkeeping relations under the stated definitions, not a method to measure cyclic flow by casually subtracting two noisy signals. For students, retain the conceptual link—RuBP regeneration depends on usable ATP and reductant supply—and leave fraction equations and competing Aj formulations in the instructor notes. [Yin et al. (2004)](https://doi.org/10.1111/j.1365-3040.2004.01224.x).

## 5. The 2026 update changes how we tell the cyclic-flow story

[Degen, Schwarzländer & Johnson (2026)](https://doi.org/10.1038/s41477-026-02374-w) measured maintained chloroplast MgATP²⁻ despite lower pmf in Arabidopsis cyclic-flow mutants. They favour ΔpH-dependent protection and stromal alkalinization over obligatory ATP augmentation. The companion [News & Views](https://doi.org/10.1038/s41477-026-02399-1) is commentary, not independent replication.

**Teaching consequence:** arithmetic alone does not prove a universal cyclic fraction must fill an ATP shortage. **Interpretive limit:** the sensor measures MgATP²⁻ concentration, not ATP turnover or total adenylate charge. This does not establish that all cyclic routes lack energetic functions in every cell type.

## Classroom boundary

Students need one consistent linear-flow budget, the fact that rerouting changes proton/reductant outputs, and the distinction between energy supply and demand. A single qualitative cyclic overlay and a connection to NPQ are sufficient in lecture 1. Photorespiratory demand and C4 allocation belong in lecture 2. H⁺/ATP alternatives, NDH arithmetic, water–water flow, nitrogen sinks, and detailed FvCB extensions remain instructor context unless the lecturer chooses otherwise.
