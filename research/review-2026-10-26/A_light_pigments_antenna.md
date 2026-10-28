# Review A, 26 Oct 2026: light, pigments, excitation and antenna

**Scope.** `PLATE` texts of l02 (slide 5b), l03, l04, l04b, l05 and l06; the SKY, LIFE and PIGMENTS captions in `src/pilot/anim/beats.ts`; and the scripts `ANIM_PIGMENTS_FATES.md` and `ANIM_WHO_SEES.md` (v3). Figure labels are checked where they carry numbers. Findings from the 23 Oct review (`review-2026-10-23-claude/A_L01-L06.md`) are not repeated; items that it raised and that are still unfixed are marked "still open".

**Evidence codes.** A = abstract read. M = Crossref metadata only. S = secondary source. T = textbook physics or my own arithmetic (shown). Every DOI was resolved on Crossref on 26 Oct 2026; the register is at the end.

## Top fixes

1. **Where the pigments sit is missing from slides 1–6.** No picked figure and no text says that the pigments are held by proteins in the thylakoid membrane. Fix: add one line to slide 6 and pick figure 6J or 6E, which are already built: "Pigments sit in proteins in the thylakoid membrane: LHCII with PSII in the grana, LHCI with PSI in the stroma lamellae."
2. **Two wordings are contradicted.**
   - Slide 6, "LHCII feeds PSII", is still one-way; the "mainly" of 22 Oct has been dropped. LHCII feeds both photosystems ([Wientjes 2013](https://doi.org/10.1021/jp401663w); [Li 2026](https://doi.org/10.1038/s41586-026-10847-3)).
   - Slide 5b, "The green left over is reflected", contradicts slide 5's "Leaves still absorb 50–90 % of green".
3. **LIFE, "Primates".**
   - The cited source, [Dominy & Lucas 2001](https://doi.org/10.1038/35066567), found that red–green vision alone singles out the young leaves primates eat, while fruit also stand out by yellow–blue and brightness. It also says only Old World primates and howler monkeys are routinely trichromatic.
   - Fix: "Our primate ancestors gained a third colour receptor: red fruit and young leaves stand out against green." Add [Melin 2017](https://doi.org/10.1073/pnas.1705957114) as the source for fruit.
   - LIFE, "Bees": "but not red" → "red looks dark to them".
4. **Excitation physics.**
   - Slide 4b: "Blue photons reach S₂" → "a higher excited state". In chlorophyll, S₂ is the weak Qx band ([Reimers 2013](https://doi.org/10.1038/srep02761)).
   - Animation 4 script: "charge separation < 100 ps" → PSII traps the energy in about 0.2–0.3 ns in leaves ([Wientjes 2013](https://doi.org/10.1021/jp401663w)).
   - PIGMENTS beat 2: [Kuhn 1949](https://doi.org/10.1063/1.1747143) himself says his free-electron "room" model fails for polyenes. Show the trend only, with no numbers.
5. **Far-red.** The slide 3 figure says far-red is used by "some cyanobacteria". Slide 6 says LHCI absorbs beyond 700 nm. Plants use 701–750 nm photons in sunlight: under a leaf canopy they drove 24–25 % of leaf gross photosynthesis ([Zhen 2022](https://doi.org/10.1111/nph.18375)). Relabel: "far-red: plants use it together with PAR; some cyanobacteria grow on it alone."

**Still open from 23 Oct, not repeated below:**
- No PPFD units anywhere in the block.
- No absorption-versus-action spectrum.
- Rayleigh 1899 not added.
- NASA "wave behaviors" still cited on slide 5b.
- Chen 2024 (green light in crops) not cited.

---

## 1. Claim check

### Slide 5b (l02, summary)

| Claim | Verdict | Evidence | Suggested wording |
|---|---|---|---|
| Light is reflected, transmitted, absorbed or scattered "depending on its wavelength" | imprecise (minor) | The outcome depends on the material as much as on λ (T) | "…depending on the material and the wavelength" |
| Air redirects short wavelengths most; scattered blue reaches you from the whole sky | OK | 23 Oct review | — |
| "Chlorophyll removes blue and red / The green left over is reflected and transmitted" | **imprecise; contradicts slide 5** | Leaves absorb 50–90 % of green at 550 nm ([Terashima 2009](https://doi.org/10.1093/pcp/pcp034)) | "Chlorophyll removes most blue and red / Less green is absorbed, so more is reflected and transmitted" |
| A scattered photon keeps its energy; an absorbed photon gives its energy to the pigment | OK | Elastic scattering (T) | — |

### Slide 3 (l03, Light is a wave)

| Claim | Verdict | Evidence | Suggested wording |
|---|---|---|---|
| Wavelength sets colour | OK | T. In water, λ shrinks but colour does not, because frequency is what stays fixed. Mention this only if asked. | — |
| Sunlight mixes UV, visible and IR | OK | [Gueymard 2004](https://doi.org/10.1016/j.solener.2003.08.039) (M) | — |
| Vision 380–780 nm; PAR 400–700 nm "by convention" | OK | CIE (23 Oct review). "Extended PAR", 400–750 nm, has been proposed ([Zhen, van Iersel & Bugbee 2021](https://doi.org/10.3389/fpls.2021.693445), M). CIE still uses 400–700 nm. Adoption by horticultural standards is **UNVERIFIED**. | — |
| Scattered intensity ∝ 1/λ⁴; blue scattered "~4×" more than red | OK, conditional | (650/450)⁴ = 4.35; with the real-air exponent (≈ 4.08) it is 4.5. 450 vs 700 nm gives 5.9 and 400 vs 700 nm gives 9.4, so "~4×" holds only for the 450/650 nm pair. | Keep the 450 and 650 nm labels on the figure |
| Red Sun at sunset | OK | Longer air path ([Kasten & Young 1989](https://doi.org/10.1364/AO.28.004735), M); aerosols add to the effect (T) | — |
| Figure label: "far-red 700–750 nm: some cyanobacteria" | **contradicted (incomplete)** | Far-red photons are as effective as 400–700 nm photons when mixed with them ([Zhen & Bugbee 2020](https://doi.org/10.1111/pce.13730); A in the 23 Oct review). In sunlight, far-red gave 24–25 % of leaf gross photosynthesis under leaf-filtered light and 10–14 % in deep shade ([Zhen 2022](https://doi.org/10.1111/nph.18375), A). The label also clashes with slide 6, "LHCI absorbs beyond 700 nm". | "far-red: plants use it together with PAR; some cyanobacteria grow on it alone" |

### Slide 4 (l04, Light is also a particle)

| Claim | Verdict | Evidence | Suggested wording |
|---|---|---|---|
| E = hc/λ | OK | T | — |
| "A blue photon carries ~1.4× the energy of a red one" | OK | 2.76 / 1.91 eV (450 / 650 nm) = 1.44. Slide 4b's 430 / 662 nm gives 1.54; both are fine. | — |
| Figure energies: 300 nm 4.1, 450 nm 2.76 (2.8), 650 nm 1.91 (1.9), 1000 nm 1.2 eV; slide 4b 430 nm 2.88, 662 nm 1.87, 550 nm 2.25 eV | OK | 1239.84/λ gives 4.13, 2.76, 1.91, 1.24, 2.88, 1.87 and 2.25 eV (T) | — |
| "Ultraviolet: damages DNA" | imprecise | UV acts through the same electron excitation (in DNA bases). The damage comes mainly from UV-B, which plants also sense as a signal (UVR8; Podolec 2021, in the 23 Oct review). | "Ultraviolet: excites electrons hard enough to damage DNA" |
| "Visible: excites electrons in pigments" | OK | T | — |
| "Infrared: warms" | imprecise | Purple bacteria photosynthesise with near-infrared light: the *Blastochloris* LH1 structure explains its "absorption of infrared light" ([Qian 2018](https://doi.org/10.1038/s41586-018-0014-5), A). Engelmann discovered purple-bacterial photosynthesis and its pigment's spectrum ([1883](https://doi.org/10.1007/bf01674325), M; [Drews 2005](https://doi.org/10.1007/s11120-004-6313-8), A). Crop leaves transmit or reflect most 700–800 nm light ([Wang 2025](https://doi.org/10.1038/s41467-025-62885-6), A). | "Infrared: too little energy for plant pigments; mostly warms" |
| Brighter light = more photons, not more energetic ones | OK | T (at a fixed spectrum) | — |

### Slide 4b (l04b, Excitation)

| Claim | Verdict | Evidence | Suggested wording |
|---|---|---|---|
| A pigment absorbs only if the photon energy fits a gap | OK | Bands are broad because of vibrational sub-levels, as the figure note says (T) | — |
| "Blue photons reach S₂, red photons reach S₁" | **imprecise** | In chlorophyll, S₂ is the weak Qx band at ~580–620 nm. The blue Soret (B) band lies higher. [Gouterman 1961](https://doi.org/10.1016/0022-2852(61)90236-3) (M); [Reimers 2013](https://doi.org/10.1038/srep02761) (A): "Qx (S2) and Qy (S1)". The figure's 2.88 eV rung labelled S₂ therefore mislabels the state. | "Blue photons reach a higher excited state, red photons reach S₁". Label the upper rung "Soret" or "S₂ and above". |
| Drop to S₁ "within ~1 ps"; extra energy lost as heat | OK | Measured at ≈ 200 fs for Chl a and b ([Bricker 2015](https://doi.org/10.1038/srep13625), A). "< 1 ps" is safe. | — |
| "So photosynthesis counts photons, not their energy" | OK, one nuance | True for photons that reach chlorophyll (Kasha's rule). In leaves, blue still gives a lower quantum yield per absorbed photon: carotenoids and non-photosynthetic pigments absorb below 580 nm, and the balance between PSI and PSII also shifts ([Hogewoning 2012](https://doi.org/10.1105/tpc.112.097972), A; [Evans 1987](https://doi.org/10.1071/PP9870069), S). | Optional: "…counts absorbed photons, not their energy" |

### Slide 5 (l05, Why are leaves green?)

| Claim | Verdict | Evidence | Suggested wording |
|---|---|---|---|
| Chlorophyll absorbs blue and red strongly and green weakly; leaves look green | OK | T | — |
| "Leaves still absorb 50–90 % of green" | OK | [Terashima 2009](https://doi.org/10.1093/pcp/pcp034) (23 Oct review). Crop leaves absorb ≈ 90 % of 400–700 nm photons ([Wang 2025](https://doi.org/10.1038/s41467-025-62885-6), A). | — |
| Green reaches deeper cells and drives photosynthesis there | OK | In spinach, 50 % of green light reaches 240 µm deep against 125 µm for blue ([Vogelmann & Evans 2002](https://doi.org/10.1046/j.1365-3040.2002.00910.x), A) | — |
| Chl b and carotenoids widen the band; red algae use phycoerythrin for green | OK | 23 Oct review (Xie 2021) | — |
| Figure peaks: Chl a 430 · 662, Chl b 453 · 642, carotenoid 450 nm | OK in solvent; 23 Oct UNVERIFIED now **partly resolved (S)** | In diethyl ether: Chl a 428–429 / 660–661 nm, Chl b 452 / 642 nm (a table citing [Kobayashi et al. 2006](https://doi.org/10.1007/1-4020-4516-6_6) and Watanabe 1984; primary not read). 662 nm is 1–2 nm long for ether. β-carotene 450 nm in hexane (T). In leaves, Chl a absorbs at 670–680 nm. | Label "in ether" |

### Slide 6 (l06, Light-harvesting complexes)

| Claim | Verdict | Evidence | Suggested wording |
|---|---|---|---|
| "In full sun one chlorophyll absorbs only ~10 photons per second" | OK | PSI-LHCI's ~170 Chl absorb one photon per ~600 µs at 2000 µmol m⁻² s⁻¹, which is ≈ 10 s⁻¹ ([Croce & van Amerongen 2013](https://doi.org/10.1007/s11120-013-9838-x); 23 Oct review). My own estimate from chlorophyll's mean absorption over sunlight (an assumed ε of 2–3 × 10⁴ M⁻¹ cm⁻¹) gives 9–14 s⁻¹ (T). The figure applies to an unshaded chlorophyll; deeper ones receive less. | Optional: "at most ~10" |
| "Antenna pigments pass on energy, not electrons / Only the reaction centre releases an electron" | OK | No electron leaves the antenna ([Croce & van Amerongen 2020](https://doi.org/10.1126/science.aay2058), A). For questions: short-lived charge-transfer states do form *inside* antennas, in red forms ([Capaldi 2025](https://doi.org/10.1111/nph.70562); 23 Oct review) and in NPQ quenching ([Holt 2005](https://doi.org/10.1126/science.1105833); [Ahn 2008](https://doi.org/10.1126/science.1154800), M: titles). | Keep |
| Chl b –CHO vs Chl a –CH₃ "shifts its absorption peaks" | OK | The two bands move in opposite directions: Soret 430 → 453 nm (redder), Qy 662 → 642 nm (bluer) (S, above) | — |
| "LHCII feeds photosystem II (PSII)" | **contradicted; still open, and now stricter than the 22 Oct draft** | "Extra" LHCII "normally transfers energy to both photosystems" ([Wientjes 2013 JPCB](https://doi.org/10.1021/jp401663w), A). "LHCII is an antenna of both photosystems after long-term acclimation" ([Wientjes 2013 BBA](https://doi.org/10.1016/j.bbabio.2012.12.009), title). PSI-LHCI-LHCII has been resolved in maize ([Pan 2018](https://doi.org/10.1126/science.aat1156), A) and in situ in rice ([Li 2026](https://doi.org/10.1038/s41586-026-10847-3), A). | "LHCII feeds mainly PSII, and PSI too" |
| "LHCI feeds PSI and absorbs beyond 700 nm" | OK | 23 Oct review | — |

### SKY captions

| Beat | Verdict | Note |
|---|---|---|
| Sunlight; In the air ("about four times"); Blue sky; Earth turns; Sunset | OK | "About four times" holds for 450 vs 650 nm (see slide 3). Aerosols add to sunset reddening (T). |

### LIFE captions

| Beat | Verdict | Evidence | Suggested wording |
|---|---|---|---|
| In the sea: "Water absorbs red light within a few metres; blue-green goes deepest" | OK, one caution | Pure water absorbs 0.34 m⁻¹ at 650 nm and 0.62 m⁻¹ at 700 nm, so 90 % of red light is gone within ~4–7 m. Absorption is lowest near 420 nm ([Pope & Fry 1997](https://doi.org/10.1364/AO.36.008710) data table; [Smith & Baker 1981](https://doi.org/10.1364/AO.20.000177), M). Caution: placed after "Our ancestors lived in the sea", the sentence implies that water shaped our eyes, which ANIM_WHO_SEES deliberately avoided. | Keep; narrate without "so" |
| On land: "Most mammals see red and green as one colour" | imprecise (implied cause) | Red–green discrimination "is not found in other mammals" ([Dominy & Lucas 2001](https://doi.org/10.1038/35066567), A; [Jacobs 2009](https://doi.org/10.1098/rstb.2009.0039), M). The loss happened in early mammals' nocturnal phase, not with the move onto land ([Gerkema 2013](https://doi.org/10.1098/rspb.2013.0508), A). | "Early mammals lived by night; most mammals still see red and green as one colour." |
| Primates: "Primates evolved an extra colour receptor: ripe fruit stands out" | **contradicted by its own source; overgeneralised** | [Dominy & Lucas 2001](https://doi.org/10.1038/35066567) (A): trichromacy is routine only in catarrhines (Old World monkeys and apes) and howler monkeys. Red–green alone separated the young leaves the primates ate, while eaten fruit also differed on yellow–blue and brightness. A fruit advantage was shown in wild capuchins ([Melin 2017, PNAS](https://doi.org/10.1073/pnas.1705957114), A). | "Our primate ancestors gained a third colour receptor: red fruit and young leaves stand out against green." Cite Dominy & Lucas and Melin. |
| Bees: "Bees see ultraviolet but not red" | imprecise | Most Hymenoptera have UV, blue and green receptors. 4 of 43 species, including the bee *Callonychium petuniae*, also have a red receptor ([Peitsch 1992](https://doi.org/10.1007/BF00190398), A; review: [van der Kooi 2021](https://doi.org/10.1146/annurev-ento-061720-071644), A, general). Koski & Ashman 2015 (A) show that the UV bullseye is also selected by UV (sun protection), not only by pollinators. | "Bees see ultraviolet, blue and green; red looks dark to them." (v3 wording) |
| Plants; So why? | OK | — | — |

### PIGMENTS captions (animation 3)

| Beat | Verdict | Evidence | Suggested wording |
|---|---|---|---|
| 1 Absorbing electrons spread over the ring of alternating bonds | OK; **source scope** | The Croce 2014 abstract does not cover conjugation. [Kuhn 1949](https://doi.org/10.1063/1.1747143) (A) treats porphyrin π-electrons as moving on "a closed ring-shaped path". | Cite Kuhn 1949 (or Gouterman 1961) here |
| 2 "A longer chain gives the electrons more room: smaller gaps" | imprecise (model limit) | Kuhn 1949 (A): the free-electron model fits cyanine-type dyes, but for polyenes and carotenes it "is no longer permissible" and needs a periodic potential, so the gap shrinks more slowly and levels off ([Autschbach 2007](https://doi.org/10.1021/ed084p1840), M). A plain box puts β-carotene's gap near 1.5 µm instead of 450 nm (T, L ≈ 23 × 0.14 nm). The trend is right. | Caption OK as a trend. Draw the ladders without numbers, and note "trend only" in the script. |
| 3 Carotenoids absorb blue to blue-green | OK | T | — |
| 4 Chl b differs by one group and shifts both bands (script: 662 → 642, 430 → 453 nm) | OK | Ether values above (S) | Script: "in ether" |
| 5 Different structures, different gaps | OK | — | — |

### Scripts

| Script line | Verdict | Evidence | Suggested wording |
|---|---|---|---|
| ANIM_PIGMENTS_FATES, animation 3, beat 2: chains of 3, 5 and 11 double bonds, from UV to blue | OK | Hexatriene absorbs in the UV and β-carotene at ~450 nm (T; exact λ from memory, **UNVERIFIED**) | — |
| Animation 4 (slide 12): "charge separation, < 100 ps" | **imprecise** | Overall PSII trapping in thylakoids is ~180 ps (high-light plants) to ~310 ps (low-light plants), with 91 % vs 84 % efficiency ([Wientjes 2013](https://doi.org/10.1021/jp401663w), A). PSI takes ~50 ps (23 Oct review). | "within a few hundred picoseconds" |
| Animation 4: fluorescence ~685 nm after ns; triplet lives µs | OK | T | — |
| ANIM_WHO_SEES v3 (superseded by beats v5) | v3 is more accurate | v3's "ripe fruit and young reddish leaves" and "ultraviolet, blue and green" are correct. The v5 shortening introduced both LIFE errors. Chl f's "706 nm" is a solvent value ([Chen 2010](https://doi.org/10.1126/science.1191127)); it is ~695 nm in ether (S). | Restore the v3 phrases |

---

## 2. Missing topics

**Where the pigments sit: what the deck says now**

| Item | Slides 1–6 (picked figures and text) | Elsewhere |
|---|---|---|
| Envelope (two membranes) | absent | Drawn but unlabelled in L07 figure a |
| Stroma / thylakoid | absent (the L01 chloroplast figure exists but is not picked) | L07 figure a; C01 |
| Lumen | absent | L07 figures |
| Pigments held in proteins in the membrane | not stated; 6E (membrane) and 6J (membrane → protein) are built but not picked | — |
| PSII + LHCII in grana, PSI + LHCI in stroma lamellae | absent | L07 text names PSII and PSI only, not the antennas |

| Topic | Must/nice | One line of content | Source |
|---|---|---|---|
| Pigment–protein complexes | **must** | Every chlorophyll and carotenoid is held at a fixed place by a protein in the thylakoid membrane. The protein sets the spacing (~1 nm) and tunes the colour. | [Croce & van Amerongen 2020](https://doi.org/10.1126/science.aay2058) (A) |
| Chloroplast compartments | **must** | Two envelope membranes enclose the stroma (Calvin–Benson cycle). The stroma holds the thylakoid membrane (pigments, photosystems), which encloses the lumen. | [Kirchhoff 2019](https://doi.org/10.1111/nph.15730) (A, general; compartments T; corrigendum [10.1111/nph.16090](https://doi.org/10.1111/nph.16090)) |
| Grana vs stroma lamellae | **must** | LHCII + PSII sit in the stacked grana. LHCI + PSI (and ATP synthase) sit in the unstacked stroma lamellae. In situ imaging shows a sharp boundary between them. | [Andersson & Anderson 1980](https://doi.org/10.1016/0005-2728(80)90078-X) (A); [Wietrzynski 2025](https://doi.org/10.7554/eLife.105496) (A) |
| How energy hops (Förster) | **must** (one line) | An excited pigment excites a neighbour without emitting light. The rate falls with distance⁶ and needs spectral overlap, so pigments sit ~1 nm apart. The energy reaches the reaction centre in ~50 ps (PSI) to ~0.2–0.3 ns (PSII). | [Förster 1948](https://doi.org/10.1002/andp.19484370105) (M); [Wientjes 2013](https://doi.org/10.1021/jp401663w) (A) |
| Antenna efficiency | nice | An open PSII uses 84–91 % of its excitations | [Wientjes 2013](https://doi.org/10.1021/jp401663w) (A) |
| Antenna size adjusts | nice | High-light leaves make less LHCII. State transitions move phosphorylated LHCII to PSI (STN7 kinase). | [Wientjes 2013](https://doi.org/10.1021/jp401663w) (A); [Bellafiore 2005](https://doi.org/10.1038/nature03286) (M) |
| Size of the photosynthetic unit | nice | ~105 Chl per PSII in C₂S₂ ([Wei 2016](https://doi.org/10.1038/nature18020), A); ~240 per PSII in the in situ C₂S₂M₂L₄ (T: my count, assuming ~10 Chl in CP24, **UNVERIFIED**); ~170 per PSI-LHCI. This links to Emerson & Arnold's ~2,500 Chl per CO₂. | [Li 2026](https://doi.org/10.1038/s41586-026-10847-3) (A) |

The cheapest fix for "where" is one slide 6 point plus figure 6J. Animation 3 beat 1 already zooms leaf → chloroplast → chlorophyll and could stop at "thylakoid membrane → LHCII protein" on the way.

---

## 3. History stories

| # | Then | Now | Hook |
|---|---|---|---|
| 1 | **Tswett 1906.** He separated a leaf's pigments by adsorption and named the method chromatography ([Ber Dtsch Bot Ges 24:384](https://doi.org/10.1111/j.1438-8677.1906.tb06534.x), M; history in [Ettre & Sakodynskii 1993](https://doi.org/10.1007/bf02269707), M). Richard Kuhn's lab used it on xanthophylls ([Kuhn, Winterstein & Lederer 1931](https://doi.org/10.1515/bchm2.1931.197.1-4.141), M); the usual "revival" framing is **UNVERIFIED** in the primary. | Cryo-EM now places every pigment: 105 Chl and 28 carotenoids per PSII–LHCII monomer ([Wei 2016](https://doi.org/10.1038/nature18020), A). In rice chloroplasts, imaged in place, four extra LHCII trimers appear that are lost on purification ([Li 2026](https://doi.org/10.1038/s41586-026-10847-3), A). | Chromatography was invented to separate the colours of a leaf. |
| 2 | **Energy, not light, is passed on.** In diatoms, carotenoid-absorbed light makes chlorophyll fluoresce ([Dutton, Manning & Duggar 1943](https://doi.org/10.1021/j150427a002), M; content S). Förster's theory of radiationless transfer ([1946](https://doi.org/10.1007/BF00585226); [1948](https://doi.org/10.1002/andp.19484370105), M). Duysens shows sensitised Chl a fluorescence across photosynthetic cells ([1951](https://doi.org/10.1038/168548a0), M; content from secondary accounts, **UNVERIFIED** in the original). | Energy-transfer calculations on the in situ rice structure "closely reproduce in vivo measurements" ([Li 2026](https://doi.org/10.1038/s41586-026-10847-3), A). The 2007 quantum-coherence claim ([Engel 2007](https://doi.org/10.1038/nature05678)) has receded ([Cao 2020](https://doi.org/10.1126/sciadv.aaz4888)); the debate is still open (23 Oct review). | Slide 6's "energy, not electrons", with its proof. |
| 3 | **Lateral heterogeneity, 1980.** Chloroplasts broken into fractions: grana partitions are rich in PSII and LHC and poor in PSI; stroma thylakoids are rich in PSI ([Andersson & Anderson 1980](https://doi.org/10.1016/0005-2728(80)90078-X), A). | Cryo-ET of intact spinach chloroplasts finds "strict lateral heterogeneity" and "no evidence for a distinct grana margin" where the two mix ([Wietrzynski 2025](https://doi.org/10.7554/eLife.105496), A). In rice, PSII–LHCII pairs spanning the lumen and the stroma may form a "skeleton" that holds the grana stacked ([Li 2026](https://doi.org/10.1038/s41586-026-10847-3), A; a proposal). | Answers "where do the pigments sit?" |

**Reserves**
- **Two Kuhns (do not confuse them).** Richard Kuhn's lab made diphenylpolyenes whose colour deepens with chain length ([Kuhn & Winterstein 1928](https://doi.org/10.1002/hlca.19280110107), M; the colours themselves are **UNVERIFIED**). Hans Kuhn's free-electron model ([1949](https://doi.org/10.1063/1.1747143), A) is the "room" of animation 3. Now: plant Lhca4 binding Chl d absorbs beyond 750 nm ([Elias 2024](https://doi.org/10.1021/jacs.3c13373), A).
- **Engelmann 1883.** Engelmann discovered that purple bacteria photosynthesise ([Engelmann 1883](https://doi.org/10.1007/bf01674325), M; [Drews 2005](https://doi.org/10.1007/s11120-004-6313-8), A); that he saw them use infrared light is **UNVERIFIED** in the original. Now: an LH1 structure explains the infrared absorption ([Qian 2018](https://doi.org/10.1038/s41586-018-0014-5), A). Pairs with slide 4's "Infrared: warms".
- Emerson & Arnold → in situ rice: story 1 of the 23 Oct review. The citation is already fixed in figure 6F.

---

## 4. Latest findings (2022–2026), one line each

| Finding | Source | Line for the lecture | Status |
|---|---|---|---|
| Far-red counts in real sunlight | [Zhen, van Iersel & Bugbee 2022, *New Phytol*](https://doi.org/10.1111/nph.18375) (A) | Under a leaf canopy, 701–750 nm photons drove a quarter of leaf gross photosynthesis; in vegetation shade they can be > 50 % of the 400–750 nm photons. | One group; consistent with their 2020 work |
| Chl f takes part in charge separation | [Consoli et al. 2025, *Science*](https://doi.org/10.1126/science.ado6830) (A) | In far-red PSI, one of eight Chl f molecules sits at a redox-active site (A₋₁B), so far-red light drives the electron step itself. | **Contested**: [Kato 2020, *Nat Commun*](https://doi.org/10.1038/s41467-019-13898-5) found Chl f "not in the electron transfer chain" |
| Far-red pigments in a plant antenna | [Elias et al. 2024, *JACS*](https://doi.org/10.1021/jacs.3c13373) (A) | Plant Lhca4 binds Chl d and f in vitro, absorbs beyond 750 nm and still transfers energy normally. | In vitro only |
| Payoff, modelled | [Wang, Oliver, Croce & Long 2025, *Nat Commun*](https://doi.org/10.1038/s41467-025-62885-6) (A) | Adding Chl d/f to soybean could raise canopy CO₂ uptake by up to 26 %, mostly in the lower leaves. | Model only. That no such crop exists yet is **UNVERIFIED** (none found). |
| The least light that supports growth | [Hoppe et al. 2024, *Nat Commun*](https://doi.org/10.1038/s41467-024-51636-8) (A) | Arctic under-ice algae resumed growth at ≤ 0.04 µmol photons m⁻² s⁻¹, about 1/50,000 of full sun. At that light one chlorophyll catches a photon roughly every 80 min (T, from ~10 s⁻¹). | One field campaign |
| Native antenna organisation | [Li et al. 2026, *Nature*](https://doi.org/10.1038/s41586-026-10847-3) (A); [Wietrzynski et al. 2025, *eLife*](https://doi.org/10.7554/eLife.105496) (A) | PSII carries more LHCII in situ than in purified samples. PSII and PSI are strictly separated, with no mixed grana margin. | The "skeleton" idea is a proposal; the margin result questions models with a distinct, mixed grana margin |
| Quantum coherence | 23 Oct review (Cao 2020; Lorenzoni 2025; Jha 2026) | No change: incoherent hopping explains the efficiency. Keep it in instructor reserve. | Debated |

---

## Crossref register (26 Oct 2026)

Title, journal and year as returned by `api.crossref.org/works/<DOI>`. "Author" is the first author returned.

| DOI | Author | Year | Title | Journal |
|---|---|---|---|---|
| [10.1063/1.1747143](https://doi.org/10.1063/1.1747143) | Kuhn | 1949 | A Quantum-Mechanical Theory of Light Absorption of Organic Dyes and Similar Compounds | The Journal of Chemical Physics |
| [10.1016/0076-6879(87)48036-1](https://doi.org/10.1016/0076-6879(87)48036-1) | Lichtenthaler | 1987 | [34] Chlorophylls and carotenoids: Pigments of photosynthetic biomembranes | Methods in Enzymology |
| [10.1038/nchembio.1555](https://doi.org/10.1038/nchembio.1555) | Croce | 2014 | Natural strategies for photosynthetic light harvesting | Nature Chemical Biology |
| [10.1007/s11120-013-9824-3](https://doi.org/10.1007/s11120-013-9824-3) | van Amerongen | 2013 | Light harvesting in photosystem II | Photosynthesis Research |
| [10.1007/s11120-013-9838-x](https://doi.org/10.1007/s11120-013-9838-x) | Croce | 2013 | Light-harvesting in photosystem I | Photosynthesis Research |
| [10.1126/science.aay2058](https://doi.org/10.1126/science.aay2058) | Croce | 2020 | Light harvesting in oxygenic photosynthesis: Structural biology meets spectroscopy | Science |
| [10.1016/j.solener.2003.08.039](https://doi.org/10.1016/j.solener.2003.08.039) | Gueymard | 2004 | The sun’s total and spectral irradiance for solar energy applications and solar radiation models | Solar Energy |
| [10.1364/AO.28.004735](https://doi.org/10.1364/AO.28.004735) | Kasten | 1989 | Revised optical air mass tables and approximation formula | Applied Optics |
| [10.1038/nrn2283](https://doi.org/10.1038/nrn2283) | Lamb | 2007 | Evolution of the vertebrate eye: opsins, photoreceptors, retina and eye cup | Nature Reviews Neuroscience |
| [10.1364/AO.20.000177](https://doi.org/10.1364/AO.20.000177) | Smith | 1981 | Optical properties of the clearest natural waters (200–800 nm) | Applied Optics |
| [10.1364/AO.36.008710](https://doi.org/10.1364/AO.36.008710) | Pope | 1997 | Absorption spectrum (380–700 nm) of pure water II Integrating cavity measurements | Applied Optics |
| [10.1038/nature04639](https://doi.org/10.1038/nature04639) | Daeschler | 2006 | A Devonian tetrapod-like fish and the evolution of the tetrapod body plan | Nature |
| [10.1098/rstb.2009.0039](https://doi.org/10.1098/rstb.2009.0039) | Jacobs | 2009 | Evolution of colour vision in mammals | Philosophical Transactions of the Royal Society B: Biological Sciences |
| [10.1098/rspb.2013.0508](https://doi.org/10.1098/rspb.2013.0508) | Gerkema | 2013 | The nocturnal bottleneck and the evolution of activity patterns in mammals | Proceedings of the Royal Society B: Biological Sciences |
| [10.1038/35066567](https://doi.org/10.1038/35066567) | Dominy | 2001 | Ecological importance of trichromatic vision to primates | Nature |
| [10.1073/pnas.1705957114](https://doi.org/10.1073/pnas.1705957114) | Melin | 2017 | Trichromacy increases fruit intake rates of wild capuchins ( Cebus capucinus imitator ) | Proceedings of the National Academy of Sciences |
| [10.1146/annurev.ento.46.1.471](https://doi.org/10.1146/annurev.ento.46.1.471) | Briscoe | 2001 | THE EVOLUTION OF COLOR VISION IN INSECTS (small caps in Crossref) | Annual Review of Entomology |
| [10.1007/BF00190398](https://doi.org/10.1007/BF00190398) | Peitsch | 1992 | The spectral input systems of hymenopteran insects and their receptor-based colour vision | Journal of Comparative Physiology A |
| [10.1146/annurev-ento-061720-071644](https://doi.org/10.1146/annurev-ento-061720-071644) | van der Kooi | 2021 | Evolution of Insect Color Vision: From Spectral Sensitivity to Visual Ecology | Annual Review of Entomology |
| [10.1038/nplants.2014.7](https://doi.org/10.1038/nplants.2014.7) | Koski | 2015 | Floral pigmentation patterns provide an example of Gloger's rule in plants | Nature Plants |
| [10.1016/0022-2852(61)90236-3](https://doi.org/10.1016/0022-2852(61)90236-3) | Gouterman | 1961 | Spectra of porphyrins | Journal of Molecular Spectroscopy |
| [10.1038/srep02761](https://doi.org/10.1038/srep02761) | Reimers | 2013 | Assignment of the Q-Bands of the Chlorophylls: Coherence Loss via Qx − Qy Mixing | Scientific Reports |
| [10.1038/srep13625](https://doi.org/10.1038/srep13625) | Bricker | 2015 | Non-radiative relaxation of photoexcited chlorophylls: theoretical and experimental study | Scientific Reports |
| [10.1071/PP9870069](https://doi.org/10.1071/PP9870069) | Evans | 1987 | The Dependence of Quantum Yield on Wavelength and Growth Irradiance | Australian Journal of Plant Physiology |
| [10.1105/tpc.112.097972](https://doi.org/10.1105/tpc.112.097972) | Hogewoning | 2012 | Photosynthetic Quantum Yield Dynamics: From Photosystems to Leaves | The Plant Cell |
| [10.1021/ed084p1840](https://doi.org/10.1021/ed084p1840) | Autschbach | 2007 | Why the Particle-in-a-Box Model Works Well for Cyanine Dyes but Not for Conjugated Polyenes | Journal of Chemical Education |
| [10.1007/1-4020-4516-6_6](https://doi.org/10.1007/1-4020-4516-6_6) | Kobayashi | none returned (book 2006) | Spectroscopy and Structure Determination | Chlorophylls and Bacteriochlorophylls |
| [10.1093/pcp/pcp034](https://doi.org/10.1093/pcp/pcp034) | Terashima | 2009 | Green Light Drives Leaf Photosynthesis More Efficiently than Red Light in Strong White Light: Revisiting the Enigmatic Question of Why Leaves are Green | Plant and Cell Physiology |
| [10.1046/j.1365-3040.2002.00910.x](https://doi.org/10.1046/j.1365-3040.2002.00910.x) | Vogelmann | 2002 | Profiles of light absorption and chlorophyll within spinach leaves from chlorophyll fluorescence | Plant, Cell & Environment |
| [10.1111/pce.13730](https://doi.org/10.1111/pce.13730) | Zhen | 2020 | Far‐red photons have equivalent efficiency to traditional photosynthetic photons: Implications for redefining photosynthetically active radiation | Plant, Cell & Environment |
| [10.1111/nph.18375](https://doi.org/10.1111/nph.18375) | Zhen | 2022 | Photosynthesis in sun and shade: the surprising importance of far‐red photons | New Phytologist |
| [10.3389/fpls.2021.693445](https://doi.org/10.3389/fpls.2021.693445) | Zhen | 2021 | Why Far-Red Photons Should Be Included in the Definition of Photosynthetic Photons and the Measurement of Horticultural Fixture Efficacy | Frontiers in Plant Science |
| [10.1038/s41467-025-62885-6](https://doi.org/10.1038/s41467-025-62885-6) | Wang | 2025 | Addition of longer wavelength absorbing chlorophylls into crops could increase their photosynthetic productivity by 26% | Nature Communications |
| [10.1021/jp401663w](https://doi.org/10.1021/jp401663w) | Wientjes | 2013 | Quantum Yield of Charge Separation in Photosystem II: Functional Effect of Changes in the Antenna Size upon Light Acclimation | The Journal of Physical Chemistry B |
| [10.1016/j.bbabio.2012.12.009](https://doi.org/10.1016/j.bbabio.2012.12.009) | Wientjes | 2013 | LHCII is an antenna of both photosystems after long-term acclimation | Biochimica et Biophysica Acta (BBA) - Bioenergetics |
| [10.1126/science.aat1156](https://doi.org/10.1126/science.aat1156) | Pan | 2018 | Structure of the maize photosystem I supercomplex with light-harvesting complexes I and II | Science |
| [10.1038/s41586-026-10847-3](https://doi.org/10.1038/s41586-026-10847-3) | Li | 2026 | In situ structures of plant photosystem supercomplexes | Nature |
| [10.7554/eLife.105496](https://doi.org/10.7554/eLife.105496) | Wietrzynski | 2025 | Molecular architecture of thylakoid membranes within intact spinach chloroplasts | eLife |
| [10.1016/0005-2728(80)90078-X](https://doi.org/10.1016/0005-2728(80)90078-X) | Andersson | 1980 | Lateral heterogeneity in the distribution of chlorophyll-protein complexes of the thylakoid membranes of spinach chloroplasts | Biochimica et Biophysica Acta (BBA) - Bioenergetics |
| [10.1111/nph.15730](https://doi.org/10.1111/nph.15730) | Kirchhoff | 2019 | Chloroplast ultrastructure in plants | New Phytologist |
| [10.1111/nph.16090](https://doi.org/10.1111/nph.16090) | — | 2019 | Corrigendum (to Kirchhoff 2019) | New Phytologist |
| [10.1038/nature03286](https://doi.org/10.1038/nature03286) | Bellafiore | 2005 | State transitions and light adaptation require chloroplast thylakoid protein kinase STN7 | Nature |
| [10.1038/nature18020](https://doi.org/10.1038/nature18020) | Wei | 2016 | Structure of spinach photosystem II–LHCII supercomplex at 3.2 Å resolution | Nature |
| [10.1126/science.1105833](https://doi.org/10.1126/science.1105833) | Holt | 2005 | Carotenoid Cation Formation and the Regulation of Photosynthetic Light Harvesting | Science |
| [10.1126/science.1154800](https://doi.org/10.1126/science.1154800) | Ahn | 2008 | Architecture of a Charge-Transfer State Regulating Light Harvesting in a Plant Antenna Protein | Science |
| [10.1111/nph.70562](https://doi.org/10.1111/nph.70562) | Capaldi | 2025 | Structural determinants for red‐shifted absorption in higher‐plants Photosystem I | New Phytologist |
| [10.1007/BF00585226](https://doi.org/10.1007/BF00585226) | Forster | 1946 | Energiewanderung und Fluoreszenz | Die Naturwissenschaften |
| [10.1002/andp.19484370105](https://doi.org/10.1002/andp.19484370105) | Förster | 1948 | Zwischenmolekulare Energiewanderung und Fluoreszenz | Annalen der Physik |
| [10.1021/j150427a002](https://doi.org/10.1021/j150427a002) | Dutton | 1943 | Chlorophyll Fluorescence and Energy Transfer in the Diatom Nitzschia Closterium. | The Journal of Physical Chemistry |
| [10.1038/168548a0](https://doi.org/10.1038/168548a0) | DUYSENS | 1951 | Transfer of Light Energy Within the Pigment Systems Present in Photosynthesizing Cells | Nature |
| [10.1038/nature05678](https://doi.org/10.1038/nature05678) | Engel | 2007 | Evidence for wavelike energy transfer through quantum coherence in photosynthetic systems | Nature |
| [10.1126/sciadv.aaz4888](https://doi.org/10.1126/sciadv.aaz4888) | Cao | 2020 | Quantum biology revisited | Science Advances |
| [10.1111/j.1438-8677.1906.tb06534.x](https://doi.org/10.1111/j.1438-8677.1906.tb06534.x) | — | 1906 | 60. M. Tswett: Adsorptionsanalyse und chrematographische Methode. Anwendung auf die Chemie des Chlorophylls | Berichte der Deutschen Botanischen Gesellschaft |
| [10.1007/bf02269707](https://doi.org/10.1007/bf02269707) | Ettre | 1993 | M. S. Tswett and the discovery of chromatography I: Early work (1899–1903) | Chromatographia |
| [10.1515/bchm2.1931.197.1-4.141](https://doi.org/10.1515/bchm2.1931.197.1-4.141) | Kuhn | 1931 | Zur Kenntnis der Xanthophylle. | Hoppe-Seyler´s Zeitschrift für physiologische Chemie |
| [10.1002/hlca.19280110107](https://doi.org/10.1002/hlca.19280110107) | Kuhn | 1928 | Über konjugierte Doppelbindungen I. Synthese von Diphenyl‐poly‐enen | Helvetica Chimica Acta |
| [10.1007/bf01674325](https://doi.org/10.1007/bf01674325) | Engelmann | 1883 | Bacterium photometricum | Pflüger, Archiv für die Gesammte Physiologie des Menschen und der Thiere |
| [10.1007/s11120-004-6313-8](https://doi.org/10.1007/s11120-004-6313-8) | Drews | 2005 | Contributions of Theodor Wilhelm Engelmann on phototaxis, chemotaxis, and photosynthesis | Photosynthesis Research |
| [10.1038/s41586-018-0014-5](https://doi.org/10.1038/s41586-018-0014-5) | Qian | 2018 | Cryo-EM structure of the Blastochloris viridis LH1–RC complex at 2.9 Å | Nature |
| [10.1126/science.ado6830](https://doi.org/10.1126/science.ado6830) | Consoli | 2025 | Locating the missing chlorophylls f in far-red photosystem I | Science |
| [10.1038/s41467-019-13898-5](https://doi.org/10.1038/s41467-019-13898-5) | Kato | 2020 | Structural basis for the adaptation and function of chlorophyll f in photosystem I | Nature Communications |
| [10.1021/jacs.3c13373](https://doi.org/10.1021/jacs.3c13373) | Elias | 2024 | Coloring Outside the Lines: Exploiting Pigment–Protein Synergy for Far-Red Absorption in Plant Light-Harvesting Complexes | Journal of the American Chemical Society |
| [10.1038/s41467-024-51636-8](https://doi.org/10.1038/s41467-024-51636-8) | Hoppe | 2024 | Photosynthetic light requirement near the theoretical minimum detected in Arctic microalgae | Nature Communications |
| [10.1126/science.1256963](https://doi.org/10.1126/science.1256963) | Gan | 2014 | Extensive remodeling of a cyanobacterial photosynthetic apparatus in far-red light | Science |
| [10.1126/science.1191127](https://doi.org/10.1126/science.1191127) | Chen | 2010 | A Red-Shifted Chlorophyll | Science |
| [10.1085/jgp.16.2.191](https://doi.org/10.1085/jgp.16.2.191) | Emerson | 1932 | THE PHOTOCHEMICAL REACTION IN PHOTOSYNTHESIS | Journal of General Physiology |
| [10.1038/s41598-021-93696-6](https://doi.org/10.1038/s41598-021-93696-6) | Xie | 2021 | Difference in light use strategy in red alga between Griffithsia pacifica and Porphyridium purpureum | Scientific Reports |

No item above returned a retraction or expression-of-concern notice in Crossref `updated-by`. Corrections: Kirchhoff 2019 (corrigendum above); Trinugroho 2020 (not cited here).
