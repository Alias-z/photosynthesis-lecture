# Light reactions — current science and teaching checks

Checked **21 October 2026**. Instructor research notes, not a proposed expansion of the 45-minute lecture. “Established” below refers to the teaching principle; it does not imply every mechanistic detail is resolved.

**Energy-accounting follow-up:** read [Electron routes and the FvCB connection](ENERGY_ROUTES_AND_FVCB.md) alongside this overview. It adds Yin and colleagues' model treatments, metabolic demand, route-specific proton yields, and the August 2026 ATP-sensor results. The four-electron table below is one conditional linear-flow example, not the ATP:NADPH ratio of all photosynthesis. The [animation shortlist](ANIMATION_SHORTLIST.md) selects three sequences from the larger story bank.

## Checks in lecture order

| Topic | Established teaching point | Update or qualification | Evidence |
|---|---|---|---|
| Photons and energy | E = hν = hc/λ; photon flux and radiant energy flux are different quantities. | Extra blue-photon energy is not automatically stored as extra ATP or additional electrons. Distinguish energy per photon from the probability of absorption and the quantum yield. | [Einstein, 1905](https://doi.org/10.1002/andp.19053220607); [McCree](https://doi.org/10.1016/0002-1571(71)90022-7) |
| PAR | Conventional PAR is 400–700 nm. | It is a measurement convention, not a universal biochemical cutoff. Far-red 700–750 nm can contribute strongly with shorter wavelengths. Extended PAR is a proposed/useful framework that requires its definition to be stated. | [Zhen & Bugbee, 2020](https://doi.org/10.1111/pce.13730) |
| Far-red beyond crop lighting | Some oxygenic phototrophs use wavelengths beyond the conventional PAR band. | Specialized chlorophyll d/f systems and other far-red strategies depend on the organism. Ordinary plant far-red cooperation does not mean their leaves contain chlorophyll f. | [Elias et al., 2024 review](https://doi.org/10.1146/annurev-physchem-090722-125847) |
| Pigments and green leaves | Chlorophylls, carotenoids, and the leaf's optical structure shape wavelength use. | Green photons are used. Whole-leaf action spectra differ from pigment-extract absorption. The stronger green-light advantage reported by Terashima et al. concerns strong white-light conditions and deeper penetration; it is not a universal ranking of colours. | [Terashima et al., 2009](https://doi.org/10.1093/pcp/pcp034) |
| Excitation and charge separation | Antennae transfer excitation energy; reaction centres generate charge separation. | An animation must distinguish energy transfer between pigments from net electron transfer down the reaction-centre/transport pathway. Avoid electrons physically traversing the entire antenna as the light-harvesting mechanism. | [Liu et al., 2026 review](https://doi.org/10.1146/annurev-biophys-021424-011156) |
| Native antenna organization | Photosystems operate within organized membrane assemblies. | In situ cryo-EM of rice chloroplasts resolved a C₂S₂M₂L₄ PSII–LHCII assembly containing four LHCII trimers not retained in purified preparations. This improves the structural picture, without requiring bachelor students to memorize that stoichiometry. | [Li et al., July 2026](https://doi.org/10.1038/s41586-026-10847-3) |
| Water oxidation | O₂ formation requires four oxidizing equivalents accumulated at the Mn₄CaO₅ cluster. | Time-resolved structures resolve intermediates during S₃ → [S₄] → S₀. Teach the four-charge cycle confidently; mark an atom-by-atom O–O bond-formation animation as a mechanistic interpretation. | [Bhowmick et al., 2023](https://doi.org/10.1038/s41586-023-06038-z) |
| ATP synthesis | Proton return from lumen to stroma drives ATP synthase; pmf includes ΔpH and Δψ. | Use a plant chloroplast c₁₄ rotor when explaining the structural H⁺/ATP ratio. Do not borrow a mitochondrial rotor count. Redox regulation helps suppress wasteful ATP hydrolysis in darkness. | [Hahn et al., 2018](https://doi.org/10.1126/science.aat4318); [Kohzuma et al., 2025 review](https://doi.org/10.1093/pcp/pcaf100) |
| Cyclic electron flow | Recycling electrons around PSI can contribute proton flux and photoprotection without net NADPH or O₂ production by that cyclic pathway. | Its ATP contribution depends on the route and context; a compulsory fixed ATP-deficit narrative is too strong. The PGR5-dependent Fd→PQ mechanism remains unresolved. NDH receives electrons from Fd despite its historical name. | [Johnson, 2025, Box 1](https://doi.org/10.1038/s41580-025-00847-y); [2026 measurements](https://doi.org/10.1038/s41477-026-02374-w); [energy follow-up](ENERGY_ROUTES_AND_FVCB.md) |
| NPQ | Rapid qE involves lumen acidification, PsbS, and antenna/xanthophyll regulation. | Several physical quenching mechanisms and sites remain debated. The 2025 review proposes a localized antenna switch plus an effect of zeaxanthin on the quenchable domain; this is a working model, not the sole settled mechanism. | [van Amerongen & Croce, 2025](https://doi.org/10.1093/plcell/koaf240) |
| Xanthophyll cycle | VDE supports violaxanthin → antheraxanthin → zeaxanthin; ZEP supports the reverse conversion. | Conversion, antenna response, and relaxation have different kinetics. qE and slower zeaxanthin-associated components interact, so one single instantaneous “NPQ switch” is too literal. Retain the mechanism without adding crop-engineering or acclimation material. | [Glowacka, 2025 review](https://doi.org/10.1042/BST20253087); [PsbS review, 2024](https://doi.org/10.1016/j.jmb.2023.168407) |
| Fluorescence | Fluorescence reports on excited-state competition and PSII photochemistry. | A saturation pulse minimizes PSII photochemical quenching during measurement; heat dissipation persists. Fluorescence-derived electron transport is not a direct measurement of net CO₂ assimilation. | [Murchie & Lawson, 2013 guide](https://doi.org/10.1093/jxb/ert208) |
| Light-response curve — last | Net assimilation generally rises at low light and approaches a capacity limit. | Explain initial slope and plateau using the mechanisms already taught. A plateau does not mean electron transport or photosynthesis has ceased. Keep the compensation point with net assimilation in lecture 2, and environmental controls and acclimation outside this section. | [Blackman, 1905](https://doi.org/10.1093/oxfordjournals.aob.a089000) |

## The quantitative anchor: one O₂, four electrons, two NADPH

Use **one consistent batch of four electrons** throughout the future animation. The accounting below assumes plant linear electron flow, a complete cytochrome b₆f Q cycle, and ideal tight coupling. It distinguishes protons released from water from protons transferred from the stroma.

| Process | Account per 4 e⁻ |
|---|---|
| Water oxidation at PSII | 2 H₂O → O₂ + 4 H⁺ in the lumen + 4 e⁻ |
| Minimum successful photochemistry | 4 PSII photons + 4 PSI photons = **8 photons** |
| PQ/b₆f pathway with full Q-cycle accounting | **8 H⁺ transferred from stroma to lumen**, including the protons carried by PQH₂; do not add the PQ-carried protons again |
| Total lumen-side proton supply in this ideal account | **12 H⁺**: 4 from water + 8 transferred |
| NADP⁺ reduction | 2 NADP⁺ + 4 e⁻ + 2 H⁺ from the stroma → **2 NADPH** |
| Plant chloroplast c₁₄ ATP synthase | **14 H⁺ per 3 ATP** in the ideal structural ratio |
| ATP supported by 12 H⁺ in that model | 12 × 3/14 = **2.57 ATP per 2 NADPH**, or 1.29 ATP/NADPH |
| Calvin-cycle comparison, excluding photorespiration and other costs | **3 ATP + 2 NADPH per CO₂** fixed |

The comparison is **2.57 ATP supplied in this model versus 3 ATP required by the Calvin cycle for the same 2 NADPH**. It motivates examining both alternative electron routes and downstream reductant consumption. It does not prove that every leaf must fill a fixed ATP deficit through cyclic flow. Photorespiration changes demand, and coupling assumptions change calculated supply; see the [energy follow-up](ENERGY_ROUTES_AND_FVCB.md). Actual photon demand exceeds the ideal minimum when losses and alternative processes are included. NADP⁺ reduction consumes stromal H⁺; those two protons are not another pair pumped into the lumen. [Structural basis](https://doi.org/10.1126/science.aat4318), [current ATP synthase review](https://doi.org/10.1093/pcp/pcaf100).

This uses exact 14/3 arithmetic: 18/14 = 1.286 ATP/NADPH. Johnson rounds H⁺/ATP to 4.7 and consequently quotes about 1.28. Avoid treating that small rounding difference as a biological disagreement.

## Fluorescence: the reference-slide correction to retain

The final fluorescence slide in `SanteliaD_Probevorlesung_20190807.pptx` (slide 57) simplifies the saturation-pulse explanation too far. For our version:

- Closing PSII reaction centres does **not** make all absorbed energy emerge as fluorescence; non-radiative dissipation continues.
- Dark-adapted **Fv/Fm = (Fm − Fo)/Fm** describes maximum PSII photochemical efficiency under the specified dark-adaptation protocol.
- Light-adapted **ΦPSII = (Fm′ − Fs)/Fm′** describes operating PSII photochemical efficiency.
- An estimated **ETR ≈ ΦPSII × incident PPFD × leaf absorptance × fraction allocated to PSII** requires those assumptions to be stated. The often used 0.5 allocation and fixed absorptance are assumptions, not constants of nature.
- ETR and net CO₂ assimilation differ because electrons can support photorespiration and other sinks, while net CO₂ exchange also includes respiratory fluxes. Fluorescence alone does not directly provide A.

The 2013 guide remains a useful methodological foundation; its age is not a reason to discard these distinctions. [Murchie & Lawson](https://doi.org/10.1093/jxb/ert208).

## Active research to keep in instructor notes

**CEF quantification.** A review in the January 2026 volume argues that inhibitor specificity and indirect measurements can distort the inferred balance between PSI and PSII cyclic pathways. Its stronger conclusions about dominant routes should be presented as the authors' contested interpretation, not a replacement consensus for the bachelor lecture. Compare it with genetic/physiological evidence and the broader 2025 chain review. [Lysenko et al., 2026](https://doi.org/10.1016/j.jphotobiol.2025.113312), [Degen et al.](https://doi.org/10.1093/jxb/erad428).

**NPQ mechanism.** Regulation by low lumen pH and PsbS is much firmer than a single universal pigment-level quenching mechanism. A useful teaching diagram can show energy diverted into heat without pretending every molecular intermediate has been settled. [PsbS review](https://doi.org/10.1016/j.jmb.2023.168407).

**Native architecture.** The 2026 rice structures support the importance of the membrane environment and components lost during purification. Avoid generalizing one resolved assembly to every species, state, and growth condition. [Li et al.](https://doi.org/10.1038/s41586-026-10847-3).

## Source checks

- Johnson's 2025 review has a [publisher correction](https://doi.org/10.1038/s41580-025-00877-6): a concentration printed as approximately 0.25 M was corrected to **0.25 mM**. Use the corrected version if that value is ever needed.
- Liu et al. is a **2026** review, not an inferred future paper; the 2026 rice study appeared online **29 July 2026**. Both predate this research check.
- The far-red review is in **Annual Review of Physical Chemistry**, not Annual Review of Plant Biology.
- The saved historical modelling overview is by **Stirbet, Lazár, Guo, and Govindjee**; use its verified author list.
- No environmental-control, acclimation, or engineering-application teaching block has been added.
