# Chunk cr (C14 Rising CO₂, C15 From leaf to loaf): phase-1 report

The builder (28 Oct 2026, night) returned this report in its message. The main thread saved it here because the builder could not write files. The work is merged live as `figs/cr14.ts`, `figs/cr15.ts`, `figs/cr-common.ts`, `figs/cr.css`, `hooks/C5-crops.json` and `assets/SOURCES-cr.md`, plus the photos `assets/photos/cr-*.jpg`. The backup is in `backups/before-cr-2026-10-28/`.

## Theory of the chunk
Grain yield = sunlight × light interception × conversion efficiency × harvest index (Monteith's equation, as Zhu, Long & Ort 2010 give it).
- Interception (≈ 0.9) and harvest index (≈ 0.6) are close to their limits.
- Conversion efficiency is photosynthesis, the link still far below its maximum.
- C14: more CO₂ suppresses oxygenation, which raises conversion efficiency.
- C15: the whole chain, its ceiling, the photorespiratory bypass and grain filling.

**Hooks** (`C5-crops.json`):

| id | Question |
|---|---|
| a | Is more CO₂ in the air good for plants? |
| b | Will bread and rice be less nutritious in the future? |
| c | Can we keep raising crop yields the way the Green Revolution did? |
| d | Could we engineer crops to photosynthesise better? |
| e | How does the sugar made in a leaf end up in a loaf of bread? |

Recommendation: a opens C14, c opens C15.

## C14 · Rising CO₂ (pick key C13)

| | BEFORE | AFTER (live now) |
|---|---|---|
| Lead | Higher CO₂ raises photosynthesis and yield of C₃ crops, but lowers grain quality. | Higher CO₂ suppresses Rubisco's oxygenation, so it raises the yield of C₃ crops; C₄ crops are already CO₂-saturated. |
| 1 | **C₃ crops.** More CO₂ speeds carboxylation and suppresses oxygenation / Field yield +18 % at ≈ 550 ppm (FACE) | **C₃ crops.** Free-air CO₂ enrichment (FACE), +200 ppm: yield ≈ +18 % / With low nitrogen or 2 °C warming: ≈ +10 % |
| 2 | **C₄ crops.** Already saturated with CO₂ / They gain only in drought, by saving water through narrower stomata | **C₄ crops.** No yield gain, except in drought / Narrower stomata save soil water |
| 3 | **Grain quality.** Less protein, zinc and iron in wheat and rice grain | **Grain quality.** C₃ grains and legume seeds: less zinc and iron / Wheat and rice grain: less protein |

**Variants:**

| id | Idea |
|---|---|
| v1 | FACE ring photo in wheat, plus the result: C₃ +18 %, C₄ ≈ 0 % |
| v2 | Yield change per crop (redrawn from Ainsworth & Long 2021, Fig. 2) |
| v3 | A/Cᵢ of maize (C₄) and soybean (C₃) at 384 vs 550 ppm (Leakey 2009, Fig. 4) |
| v4 | Myers 2014, Fig. 1, as published |
| v5 | Wheat ear photo beside bars: yield +14 %, Zn −9 %, Fe −5 %, protein −6 % |
| v6 | SoyFACE photos: soybean (C₃, +15 %) beside maize (C₄, ≈ 0 %) |
| v7 | The yield chain with conversion lit, for SoyFACE soybean |
| v8 | Keeling curve with the FACE sites (Ainsworth & Long 2021, Fig. 1) |
| v9 | Drawn table comparing C₃ and C₄ crops |
| g, h | Old figures |

**Animation script `cr14`** (≈ 36 s, 5 clicks):

| Beat | Tag | Click plays | Caption | Cite |
|---|---|---|---|---|
| 1 | Rising curve | The Keeling curve draws from 1958 to 2025, with a ppm readout | Since 1958 the air at Mauna Loa has gone from ≈ 315 to ≈ 427 ppm CO₂. Is that good for crops? | NOAA GML & Scripps |
| 2 | Greenhouse promise | Kimball 1983 clipping; a bar grows to +33 % | Greenhouse growers add CO₂. In 1983 Bruce Kimball pooled 430 trials, mostly in greenhouses: doubling CO₂ raised yields by about a third. | Kimball 1983 |
| 3 | Open field | Glide to the FACE ring photo (v1); CO₂ drifts from the pipes; bars C₃ +18 %, C₄ ≈ 0 % | In open fields, FACE gave about half the enclosure gain: C₃ crops +18 % at +200 ppm, C₄ crops nothing except in drought. | Long et al. 2006; Ainsworth & Long 2021 |
| 4 | Inside the leaf | Zoom into the leaf → v3 A/Cᵢ; both points move from 2009 to 2050 | In a C₃ leaf more CO₂ speeds carboxylation and suppresses oxygenation. A C₄ leaf already concentrates CO₂ at Rubisco. | Leakey et al. 2009 |
| 5 | Inside the grain | Ear → grain; readouts Zn −9 %, Fe −5 %, protein −6 % | Wheat grown at ≈ 550 ppm holds less zinc, iron and protein. More CO₂ raised photosynthesis: **what else sets how much grain a field gives?** | Myers et al. 2014 |

**Stagings:**
- **A · Zoom journey on v1/v3:** field → leaf → grain, then back out.
- **B · History-led:** Keeling → Kimball clipping → Long 2006 "Food for thought" clipping → the v2 chart.
- **C · Real-image-led:** SoyFACE photos (v6), then Myers Fig. 1 (v4).
- **D · Side by side:** wheat and maize columns (v9), one row per click.

## C15 · From leaf to loaf (pick key C15)

| | BEFORE | AFTER (live now) |
|---|---|---|
| Lead | The sugar made in the leaves fills the grain as starch. | Grain yield is the sunlight a crop intercepts, times the efficiency of converting it into biomass, times the share of biomass in the grain. |
| 1 | **Sources of grain carbon.** Flag leaf and ear photosynthesis during grain filling / Stem reserves stored before flowering | **Interception and harvest index.** Soybean: ≈ 90 % of the light intercepted, ≈ 60 % of the biomass in the seed / Breeding has brought both close to their limits |
| 2 | **Phloem transport.** Sucrose moves from leaves and stem to the grain | **Conversion efficiency.** Theoretical maximum: 4.6 % of sunlight in C₃, 6 % in C₄ crops / A photorespiratory bypass raised tobacco biomass by 11–24 % in field trials |
| 3 | **Grain starch.** The grain turns sucrose into starch, the carbon in bread | **Grain filling.** Sucrose from the leaves and the ear moves in the phloem to the grain / The endosperm stores it as starch |

- **Dropped from the text:** "stem reserves stored before flowering". It is still in figure v5 and in the animation.
- **Alternative line for point 2, if the bypass should be in the animation only:** "The best crops in the field reach about one third of it".

**Variants:**

| id | Idea |
|---|---|
| v1 | Zhu 2010, Fig. 2, the energy cascade, as published |
| v2 | The cascade redrawn as bars |
| v3 | Yield chain with conversion lit |
| v4 | Yield chain with interception and harvest index lit |
| v5 | Drawn wheat shoot → phloem → grain → bread |
| v6 | Ear photo + endosperm SEM series (durum wheat, Chen 2024) |
| v7 | Bypass tobacco photo (South 2019) + drawn bypass |
| v8 | Bypass field trials redrawn |
| v9 | One soybean field per m² as areas to scale |
| a–j | Old figures |

**Animation script `cr15`** (≈ 38 s, 5 clicks):

| Beat | Tag | Click plays | Caption | Cite |
|---|---|---|---|---|
| 1 | A field's sunlight | The v9 square fills | One square metre of a soybean field receives 620 MJ of sunlight in a season. How much of it ends up in the seed? | Zhu 2010, Table 1 |
| 2 | Ceiling | The v2 cascade shrinks step by step; photorespiration flashes | At most 4.6 % of sunlight can end in C₃ biomass, 6 % in C₄. In C₃ crops photorespiration nearly halves what the cycle stores. | Zhu 2010, Fig. 2 |
| 3 | What breeding raised | The v4 chain lights interception (≈ 0.9) and harvest index (≈ 0.6) | Breeding raised the light a crop catches and the share of biomass in its seed. Both are near their limits; photosynthesis is the link left. | Zhu 2010 |
| 4 | Engineering the link | Tobacco photo (v7); the bypass draws; bars rise to +20 % and +24 % | A synthetic pathway breaks glycolate down inside the chloroplast. Tobacco with it made 20–24 % more biomass in the field. | South et al. 2019 |
| 5 | Leaf to loaf | Phloem dots on the v5 shoot; zoom into the endosperm SEM (v6); a loaf appears | Sucrose from the leaves and the ear fills the grain, where it is stored as starch. **Which link of the chain would you improve?** | Sanchez-Bragado 2014; Chen 2024 |

**Stagings:**
- **A · Zoom along the yield chain.**
- **B · History-led:** Monteith → Green Revolution → Zhu 2008 clipping → South 2019 clipping. A Borlaug portrait needs a source first.
- **C · Real-image-led:** tobacco → ear → SEM → granules.
- **D · Side by side:** C₃ wheat vs C₄ maize funnels (4.6 % vs 6.0 %), then the chain.

## Doubts the builder flagged
- **Not fully read:**
  - Ainsworth & Long 2021: no Wiley access; v2's values were measured off the figure.
  - Kimball 1983, Long 2006 and Leakey 2006: abstracts only.
  - The 2019 correction to Myers 2014.
- **Zhu 2010:** the text says εc falls to 6.1 %, but the figure shows 6.5 % remaining. The figure was used.
- **C14 v3** is an A/Cᵢ graph, close in form to the FvCB slide (C8).
- **C6's old variant g** ("Native vs bypass") duplicates the bypass, which now belongs to C15.
- **C15 holds three ideas.** Proposal: split it into "Crop yield potential" and "From leaf to loaf", or move the bypass into the animation.
- **Durum wheat:** the endosperm micrographs are durum (pasta) wheat; v6 says so.
- **Old c13 variants a–j** contain cross-references and 15 px labels.
