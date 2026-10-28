# Chunk rf (C5–C8: Rubisco's two reactions → photorespiration → light response → FvCB): phase-1 report

The builder (28 Oct 2026, night) returned this report in its message. The main thread saved it here because the builder could not write files. The work is merged live:
- schema `figs/rf-schema.ts` + `.css`;
- kit `figs/rf-kit.ts` + `.css`;
- text `figs/rf05–rf08.ts`, figures `figs/rff05–rff08.ts`;
- `hooks/C2-rubisco-fvcb.json`, `assets/SOURCES-rf.md`, assets in `assets/rf/`, render script `scripts/rf_rubisco_render.mjs`.

The backup is in `backups/before-rf-2026-10-28/`.

## The spotlight schema (`figs/rf-schema.ts`)
- **What it is:** `schemaSvg(look, lit)` redraws the lecturer's MSc-thesis Fig. 2b (after von Caemmerer 2000, Fig. 2.1) and extends it with the light reactions and the photorespiratory loop (peroxisome, mitochondrion).
- **6 looks:**
  - `thesis`;
  - `tem`: real organelles from Frederick & Newcomb 1969;
  - `pdb`: an 8RUC Rubisco render plus the chain renders;
  - `flat`, `line`, `glow`.
- **Markup:** every part is wrapped in `<g data-p class="on|off">`. The FvCB braces carry `data-opt` and are hidden while off. `GEO` exports every position.

| Lit set | What is lit |
|---|---|
| LIT_C5 | CO₂, O₂, Rubisco/RuBP, carboxylation, oxygenation, PGA, 2-PG |
| LIT_C6 | 2-PG → glycolate → peroxisome → glycine → mitochondrion (CO₂, NH₃ out) → serine → glycerate → PGA |
| LIT_C7 | light, thylakoid, ATP + NADPH supply, reduction, triose phosphate, regeneration, RuBP |
| LIT_C8 | the three FvCB braces with their parts |
| LIT_C8C / LIT_C8J / LIT_C8P | one limit each: Rubisco / RuBP regeneration (J) / triose-phosphate use (TPU) |

**Hooks** (`C2-rubisco-fvcb.json`):

| id | Question |
|---|---|
| a | Why do greenhouse growers pump extra CO₂ into their greenhouses? |
| b | If plants make the oxygen we breathe, why does oxygen slow them down? |
| c | Do plants breathe out CO₂ in sunlight too? |
| d | Why does a houseplant by the window grow faster than one in the corner, but full sun is not twice as fast as half sun? |
| e | Why do plants lose more of the carbon they fix on a hot day? |

## C5 · Rubisco: carboxylation and oxygenation (pick key C5)

| | BEFORE (k05) | AFTER (rf05, live) |
|---|---|---|
| Title | Rubisco oxygenation | Rubisco: carboxylation and oxygenation |
| Lead | Rubisco also reacts with O₂; oxygenation produces 2-phosphoglycolate, which the cycle cannot use. | Rubisco's active site also binds O₂, so RuBP is either carboxylated or oxygenated. |
| 1 | Two substrates: CO₂ and O₂ compete … / one oxygenation per three carboxylations | **Carboxylation and oxygenation.** RuBP + CO₂ → 2 PGA / RuBP + O₂ → PGA + 2-phosphoglycolate |
| 2 | Temperature: in warm leaves, oxygenation rises relative to carboxylation | **Substrate competition.** CO₂ and O₂ compete for the same active site / In air at 25 °C: ≈ 1 oxygenation per 3 carboxylations |
| 3 | Evolutionary origin (Rubisco evolved before O₂) | **Temperature.** Warmer leaves oxygenate more, relative to carboxylation / Rubisco's CO₂/O₂ specificity falls; CO₂ solubility falls more than O₂ solubility |

**Variants:**
- schema looks: v1 thesis · v2 glow · v3 with the 8RUC structure · v11 line · v12 flat;
- v4 zoom on Rubisco with a mini-map;
- v5 8RUC: one active site, two gases;
- v6 Forrester 1966 Fig. 2 redrawn · v7 the original scan;
- v8 Sage 2012 Fig. 4;
- v9 specificity 160 vs 50 at 5 vs 40 °C (Jordan & Ogren 1984);
- v10 the two reactions side by side with carbon beads;
- then the old ids.

**Animation `rf5`** (≈ 34 s, 5 clicks):

| Beat | What plays | Caption | Cite |
|---|---|---|---|
| 1 | Whole schema; a CO₂ ball enters Rubisco → PGA | Rubisco adds CO₂ to RuBP: two PGA, which the cycle turns into sugar. | — |
| 2 | Zoom to Rubisco; cross-fade to the 8RUC render; an O₂ ball takes the same site | O₂ fits the same active site; oxygenation gives one PGA and one 2-phosphoglycolate. | Bowes, Ogren & Hageman 1971 |
| 3 | Clipping of Forrester 1966 Fig. 2 | 1966: soybean leaves fixed less CO₂ the more O₂ they got; more CO₂ took part of the loss back. | Forrester et al. 1966 |
| 4 | Thermometer 5 → 40 °C; specificity readout falls 160 → 50; more O₂ reaches the site | In warmer leaves Rubisco tells CO₂ from O₂ less well, and less CO₂ dissolves: oxygenation rises. | Jordan & Ogren 1984 |
| 5 | Zoom out; 2-PG glows | The cycle cannot use 2-phosphoglycolate. **What does the leaf do with it?** | — |

**Stagings:**
- **A** schema zoom;
- **B** history-led: Forrester clipping → Bowes 1971 → one line on Rubisco evolving before O₂;
- **C** structure-led: 8RUC full screen, air-ratio counter ≈ 1 : 3, pull back;
- **D** active site at 5 °C next to 40 °C, with counters.

## C6 · Photorespiration (pick key C6)

| | BEFORE (k06) | AFTER (rf06, live) |
|---|---|---|
| Lead | Photorespiration recycles 2-phosphoglycolate into 3-PGA, at a cost of CO₂, ammonia and energy. | The cycle cannot use 2-phosphoglycolate, so photorespiration recycles it into PGA via peroxisome and mitochondrion. |
| 1 | Three organelles | **Pathway.** Chloroplast → peroxisome → mitochondrion → peroxisome → chloroplast / In the mitochondrion: 2 glycine → serine + CO₂ + NH₃ |
| 2 | Cost | **Cost.** Of 4 C in two 2-phosphoglycolate: 3 return as PGA, 1 is lost as CO₂ / Refixing NH₃ and returning glycerate cost ATP and reductant |
| 3 | Yield loss | **Essential pathway.** *Arabidopsis* mutants that lack it grow in 1 % CO₂ but not in air |

- **Removed:** "Yield loss". Its 2 % vs 21 % O₂ data is now figure v8.
- **Proposed, not built:** a point "Benefit: photorespiration also supports nitrate assimilation" (Busch, Sage & Farquhar 2018; abstract only).

**Variants:**
- schema looks: v1 thesis · v2 tem (real organelles) · v3 glow · v10 line · v11 flat;
- v4 zoom on the loop + mini-map;
- v5 the pathway drawn on the Frederick & Newcomb micrograph;
- v6 *pglp1* photos, air vs 0.3 % CO₂ (Schwarte & Bauwe 2007);
- v7 Somerville & Ogren 1979 screen, drawn;
- v8 CO₂ per photon 0.052 (air) vs 0.073 (2 % O₂), Ehleringer & Björkman 1977;
- v9 carbon beads: 4 C in, 3 back, 1 lost;
- then the old ids.

**Animation `rf6`** (≈ 38 s, 6 clicks):

| Beat | What plays | Caption |
|---|---|---|
| 1 | 2-PG → glycolate leaves the chloroplast | The chloroplast turns 2-phosphoglycolate into glycolate and sends it to the peroxisome. |
| 2 | Peroxisome (micrograph cross-fades in): glycolate → glycine | In the peroxisome, glycolate becomes glycine. |
| 3 | Mitochondrion: 2 glycine → serine + CO₂ + NH₃; carbon readout "4 in · 1 lost" | In the mitochondrion, two glycine make one serine; one carbon leaves as CO₂, and NH₃ is released. |
| 4 | Serine → glycerate → PGA; ATP spent; NH₃ refixed with ATP + ferredoxin | Serine returns as glycerate, and the chloroplast makes PGA from it. Returning the carbon and refixing NH₃ cost ATP and reductant. |
| 5 | Somerville & Ogren 1979 clipping, three trays | 1979: *Arabidopsis* mutants missing one step grew in high CO₂ but died in air. Photorespiration is essential. |
| 6 | Zoom out; ATP/NADPH tags glow | All this runs on ATP and NADPH from light. **How fast can light supply them?** |

**Stagings:**
- **A** follow one carbon around the loop on the schema;
- **B** the tem look, travelling across the micrograph;
- **C** history-led: the mutant screen first, then the loop revealed;
- **D** schema + a balanced counter panel (carbon, ATP).

## C7 · Light-response curve (pick key C8)

| | BEFORE (k09) | AFTER (rf07, live) |
|---|---|---|
| Lead | As light increases, CO₂ uptake first rises, then levels off when the Calvin–Benson cycle limits it. | Light supplies the ATP and NADPH that regenerate RuBP, so CO₂ uptake rises with light until the Calvin–Benson cycle limits it. |
| 1 | Light-limited range | **Quantum yield.** In dim light, CO₂ uptake rises linearly with light / Slope = CO₂ fixed per photon absorbed |
| 2 | Light compensation point | **Light compensation point.** Uptake = release by respiration and photorespiration / Below it, the leaf releases CO₂ |
| 3 | Light saturation | **Light saturation.** In bright light, uptake levels off at the leaf's capacity / Shade leaves saturate at lower light and lower uptake than sun leaves |

**Variants:**
- schema looks: v1 thesis (light supply lit) · v2 glow · v3 pdb (chain renders) · v10 line;
- v4 zoom on the supply + mini-map;
- v5 Huang 2014 Fig. 1C, sun vs shade · v6 the Huang data redrawn with the terms marked;
- v7 Boardman 1977 *Atriplex*;
- v8 Gaastra 1959 Fig. 12A (plateau rises with CO₂);
- v9 schema crop beside the curve;
- then the old ids.

**Animation `rf7`** (≈ 36 s, 6 clicks; a PPFD readout and a live curve dot are on screen from the start):

| Beat | What plays | Caption |
|---|---|---|
| 1 | Dim light: few ATP/NADPH tags | In dim light, the thylakoids make little ATP and NADPH; RuBP is regenerated slowly. |
| 2 | 100 → 500: the slope is labelled quantum yield | More light, more ATP and NADPH: uptake rises in step. The slope is the quantum yield. |
| 3 | Light 0: CO₂ release; then the compensation point | In darkness the leaf only releases CO₂. At the compensation point uptake balances release. |
| 4 | 2000: tags pile up; Rubisco glows; the curve flattens | In bright light ATP and NADPH pile up: now Rubisco and the cycle set the limit. |
| 5 | Huang 2014 clipping, sun (≈ 22) vs shade (≈ 13) µmol m⁻² s⁻¹ | Sun leaves of the same plant saturate higher than shade leaves. |
| 6 | Zoom out | **In bright light, which step sets the limit, and does that change with CO₂?** |

**Stagings:**
- **A** schema zoom + curve panel;
- **B** Gaastra 1959: raise CO₂ and the plateau rises;
- **C** a sun-leaf schema next to a shade-leaf schema;
- **D** follow one photon, then one ATP, then pull back to the curve.

## C8 · FvCB model (pick key C9; the lecturer's pick 'a' stays first)

| | BEFORE (k10) | AFTER (rf08, live) |
|---|---|---|
| Title | CO₂-response curve and the FvCB model | FvCB model |
| Lead | … the slowest of three processes sets the rate. | The Farquhar–von Caemmerer–Berry (FvCB) model gives CO₂ uptake as the lowest of three rates, each set by one step of the cycle. |
| 1 | Rubisco-limited (V_cmax) | **Rubisco-limited rate, A_c.** At low Cᵢ, uptake rises steeply with CO₂ / Set by the amount of active Rubisco (V_cmax) |
| 2 | RuBP regeneration-limited (J_max) | **RuBP-regeneration-limited rate, A_j.** At higher Cᵢ, uptake rises slowly / Set by the electron transport rate (J) that supplies ATP and NADPH |
| 3 | TPU-limited | **TPU-limited rate, A_p.** At high Cᵢ, uptake stops rising / Set by triose-phosphate use (TPU) for sucrose and starch |

**Variants:**
- a: the lecturer's pick;
- schema looks: v1 thesis, three braces · v2 glow · v7 pdb · v8 line;
- v3 storyboard: 3 sub-lit crops + the rice A/Cc curve;
- v4 Gregory 2021 Fig. 2B · v6 the Gregory fits redrawn (solid where limiting);
- v5 thesis Fig. 5 (wheat) with today's Cᵢ ≈ 300 ppm;
- then the old ids.

**Animation `rf8`** (≈ 38 s, 5 clicks; a Cᵢ dial and a live curve dot are on screen from the start):

| Beat | What plays | Caption |
|---|---|---|
| 1 | Cᵢ 100: the Rubisco brace lit (A_c) | At low CO₂, Rubisco is short of CO₂: uptake rises steeply with CO₂ (A_c). |
| 2 | Cᵢ 300: today, near the switch | In today's air, leaves work near the switch between the two limits. |
| 3 | Cᵢ 600: the RuBP-regeneration / J brace lit (A_j) | At higher CO₂, RuBP regeneration, fed by electron transport, sets the rate (A_j). |
| 4 | Cᵢ 1000+: triose phosphate piles up (A_p) | At very high CO₂, triose phosphate is made faster than sucrose and starch use it: uptake stops rising (A_p). |
| 5 | All three braces; FvCB 1980 and Sharkey 1985 clippings | 1980: Farquhar, von Caemmerer and Berry; 1985: Sharkey added TPU. **How do we measure a leaf's CO₂ uptake, and the CO₂ inside it?** |

**Stagings:**
- **A** sub-lit zooms on the schema;
- **B** thesis-led: fly from the thesis Fig. 5 curve into the schema and back;
- **C** Gregory's rice points appear one by one;
- **D** storyboard v3 made live.

(The builder wrote no captions for some beats; the main thread filled them in from the beat descriptions. They follow the rules but are unreviewed.)

## Doubts the builder flagged
- **A_j ~ J** was used instead of the thesis's Jmax, matching the picked c12 'a'.
- **"≈ 1 oxygenation per 3 carboxylations"** is the builder's arithmetic (Flamholz 2019). Busch 2024 gives V_o/V_c ≈ 0.4 (≈ 1 per 2.5). Alternative line: "1 per 2.5–3".
- **NH₃ refixation:** the figures tag it ATP + ferredoxin (GS/Fd-GOGAT); the text says "reductant".
- **Gregory 2021 Fig. 2:** the axis is printed as Cc (Pa) but the caption says A/Ci.
- **Values read off figures:** Huang 2014, Gregory 2021.
- **Not read in full:** Forrester 1966, Somerville & Ogren 1979, Boardman 1977, Gaastra 1959, FvCB 1980, Sharkey 1985, Jordan & Ogren 1984, E&B 1977 (abstracts or figures only).
- **Density:** the overview schema carries about 30 labels. The zoom, glow and line looks are lighter.
- **Old variants:** the k05/k06/k09/k10 modules hold real-figure variants from 27 Oct that were never listed.
- **Duplicate:** C6's old variant g ("Native vs bypass") is listed, and duplicates the bypass now on C15.
