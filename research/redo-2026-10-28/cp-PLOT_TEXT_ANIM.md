# Lecture 2 chunk 3 · the CO₂ path into the chloroplast (C9, new C10 = pick key C10n)

Draft for the lecturer, 28 Oct 2026. Nothing here is approved yet.

## Plot

**Take-home concepts**

| Concept | Slide |
|---|---|
| CO₂ and H₂O each absorb their own infrared wavelengths; an IRGA measures both | C9 |
| Open system: the CO₂ drop gives net CO₂ uptake *A*; the H₂O rise gives transpiration *E* | C9 |
| *g*ₛ and *C*ᵢ are calculated, not measured | C9 |
| Three conductances in series (boundary layer, stomata, mesophyll); uptake = conductance × concentration drop | C10 |
| Stomata trade CO₂ in against water out: 150 to over 500 H₂O per CO₂ | C10 |
| Mesophyll: CO₂ diffuses ≈ 10,000 times slower in water; *C*ᵢ > *C*c (typically 420 → 300 → 200 µmol mol⁻¹) | C10 |

**Hook candidates** (`src/pilot/hooks/C3-co2-path.json`)

| Id | Question | Recommended |
|---|---|---|
| a | Why does a plant need so much water, when photosynthesis uses so little of it? | yes |
| b | How can a leaf take in enough CO₂ through holes that cover less than 1 % of its surface? (Brown & Escombe 1900, catalpa) | yes |
| c | How can you tell how fast a single leaf is photosynthesising? (Gaastra 1959) | |
| d | Why are leaves so thin, and full of air inside? | |
| e | Why do plants close their pores on a hot, dry afternoon, and what does it cost them? | |

**Into chunk 4.** In a C₃ leaf, Rubisco sees only about half the outside CO₂: *C*c ≈ 200 against *C*ₐ ≈ 420 µmol mol⁻¹. When the stomata close, *C*ᵢ and *C*c fall further. The C10 animation therefore ends on: "How can a leaf raise the CO₂ around Rubisco?" Slide C11 answers it.

## C9 · Measuring leaf gas exchange (`figs/cp09.ts`, pick key C7)

| | BEFORE (k07) | AFTER (cp09) |
|---|---|---|
| Title | Measuring leaf gas exchange | Measuring leaf gas exchange |
| Lead | An infrared gas analyser measures how much CO₂ a leaf takes up and how much water it loses. | CO₂ and water vapour absorb infrared light, so an infrared gas analyser measures the CO₂ a leaf takes up and the water vapour it loses. |
| Point 1 | **Infrared gas analysis.** CO₂ and H₂O absorb infrared light at different wavelengths; N₂ and O₂ do not / The absorption gives their concentrations | **Infrared gas analyser (IRGA).** CO₂ and H₂O each absorb their own infrared wavelengths; N₂ and O₂ do not / The light absorbed gives each gas's concentration |
| Point 2 | **Leaf chamber.** Air is measured before and after passing over the leaf / The CO₂ drop gives net CO₂ uptake (*A*); the H₂O rise gives transpiration (*E*) | **Leaf chamber.** Air is analysed before and after it flows over the leaf / CO₂ drop: net CO₂ uptake (*A*) / H₂O rise: transpiration (*E*) |
| Point 3 | **Stomatal conductance and *C*ᵢ.** Water loss and air humidity give stomatal conductance (*g*ₛ) / *A* and *g*ₛ give the CO₂ concentration inside the leaf (*C*ᵢ) | **Stomatal conductance and *C*ᵢ.** *g*ₛ: from *E* and the water-vapour difference between leaf and air / *C*ᵢ, the CO₂ in the leaf air spaces: from *A* and *g*ₛ |

**Variants.** New v1–v9 come first, then the older unpicked c11 variants a, b, c, e, f, g, h, i, j.

| Id | Idea | Approach |
|---|---|---|
| v1 | Open system, drawn: reference IRGA → lit leaf chamber → sample IRGA; bars show the CO₂ drop (*A*) and the H₂O rise (*E*) | drawing |
| v2 | How an IRGA works: source → gas cell → 4.26 µm filter → detector; less CO₂ lets more light through, more CO₂ less | drawing |
| v3 | Real absorption panels for H₂O, CO₂ and O₂ + O₃ (CC0), with the analyser filters at 2.59 and 4.26 µm | real data figure |
| v4 | LI-6800 sensor head (LI-COR schematic): sample IRGA, air after the leaf; reference IRGA, air before it | real image |
| v5 | LI-6800 in a rice field (photo) + zoom into the clamped leaf: CO₂ in = *A*, H₂O out = *E* | real + drawing |
| v6 | 1959 and today: Gaastra's IRGA diagram above a Walz GFS-3000 in an orchard | real (history) |
| v7 | The drawn CO₂ path, outside part lit: "measured: *A*, *E*", "calculated: *g*ₛ, *C*ᵢ" | whole-schema lit |
| v8 | Calculating *g*ₛ and *C*ᵢ: a stoma between *w*ᵢ (saturated) and *w*ₐ, with the two relations | drawing |
| v9 | Busch et al. 2024 Box 1, with *A* and *E* written out in words | real image |

## C10 · CO₂ diffusion pathway (`figs/cp10.ts`, new slide, pick key C10n)

| | Built (recommended) | Alternative B |
|---|---|---|
| Title | CO₂ diffusion pathway | CO₂ diffusion into the chloroplast |
| Lead | CO₂ diffuses from the air to Rubisco through three conductances in series; across each, CO₂ uptake = conductance × concentration drop. | CO₂ reaches Rubisco by diffusion, so its concentration falls from the air (*C*ₐ) to the chloroplast (*C*c). |
| Point 1 | **Boundary-layer conductance (*g*b).** Still air over the leaf surface: *C*ₐ → *C*ₛ / Higher in wind and on small leaves | **Fick's law.** Uptake = conductance × concentration drop / Three conductances in series: boundary layer, stomata, mesophyll |
| Point 2 | **Stomatal conductance (*g*ₛ).** Guard cells set the pore width: *C*ₛ → *C*ᵢ / Water vapour leaves through the same pores: 150 to over 500 H₂O per CO₂ taken up | **Stomata trade CO₂ for water.** The same pores let water vapour out: 150 to over 500 H₂O per CO₂ / Closing them saves water and lowers *C*ᵢ |
| Point 3 | **Mesophyll conductance (*g*m).** Cell wall, membranes and stroma: *C*ᵢ → *C*c / CO₂ diffuses ≈ 10,000 times slower in water than in air | ***C*ᵢ and *C*c.** In the air spaces ≈ 300, at Rubisco ≈ 200 µmol mol⁻¹ (C₃ leaf, 25 °C) / CO₂ diffuses ≈ 10,000 times slower in water than in air |

**Variants**

| Id | Idea | Approach |
|---|---|---|
| v1 | Light micrograph of a succulent leaf (stomata over their chambers, chloroplasts along the walls) with the CO₂ path drawn on it; 420 → 300 → 200 | real + drawing |
| v2 | The drawn path, all lit: brackets *g*b, *g*ₛ, *g*m; water leaving the same way; typical values | drawing / schema |
| v3 | CO₂ concentration along the path: steps across *g*b, *g*ₛ, *g*m | data graph (typical values) |
| v4 | Busch et al. 2024 Fig. 2 beside bars of *C*ₐ, *C*ᵢ, *C*c | real + graph |
| v5 | Three real images: stoma (SEM, tomato) → air spaces (micro-CT, wheat) → chloroplast at the wall (TEM, tobacco) | real images |
| v6 | Gaastra 1959 Fig. 21: stomatal resistance falls with light; mesophyll 1–4 × stomatal in bright light (turnip) | classic data |
| v7 | Clarke et al. 2021 TEM: stoma → air space → wall enlarged; row air space → cell wall → membranes → stroma under *g*m | real + drawing |
| v8 | Dupont et al. 2025: CO₂ map of a leaf at low wind (thick boundary layer) and high wind (thin) | real figure |
| v9 | Du et al. 2020: *A* against *g*ₛ and against *g*m, 568 rice lines | data graph |
| v10 | One stoma: CO₂ in, H₂O out through the same pore | drawing |
| v11 | The drawn path, stomata and water lit | schema lit |
| v12 | The drawn path, mesophyll lit | schema lit |

## Animation scripts (for approval; not built)

### `cp-gas` (C9) · from a leaf in a box to *C*ᵢ · 5 beats, ≈ 35 s

| Beat | Click plays | Caption | Cite |
|---|---|---|---|
| 1 Air past a leaf | C9 v1 drawing, chamber dark; air flows; the in/out readouts are on screen from the start (out has slightly more CO₂: the leaf respires) | Air flows past a leaf in a chamber. Infrared analysers count CO₂ and water vapour before and after the leaf. | Busch et al. 2024 |
| 2 Light on | The lamp switches on; in the same click CO₂-out drops below in (*A* > 0) and H₂O-out rises (*E*) | Light on: the leaf takes CO₂ out of the air and adds water vapour. The CO₂ drop is *A*, the water rise is *E*. | Busch et al. 2024 |
| 3 1959 | A clipping of Gaastra's Fig. 1 and his Plexiglass chamber appears | 1959, Wageningen: Gaastra measured single leaves this way and split the CO₂ path into air, stomatal and mesophyll resistances. | Gaastra 1959 |
| 4 Into the leaf | Zoom from the chamber into the leaf (C9 v7 look); *g*ₛ and *C*ᵢ appear with a "calculated" tag; *C*ᵢ ≈ 300 against *C*ₐ 420 | From the water lost, the stomatal conductance; from *A* and *g*ₛ, the CO₂ in the leaf air spaces, *C*ᵢ. | Busch et al. 2024, Table 1 |
| 5 Question | The dimmed mesophyll pulses once | ***C*ᵢ is the CO₂ in the air spaces. How much of it reaches Rubisco?** | — |

Stagings:
- **A · zoom on the slide figure:** v1 → into the leaf → v7, then back out.
- **B · history-led:** Gaastra's clipping first, then the GFS-3000 photo, then the drawn system with its readouts.
- **C · real-image-led:** rice-field photo → LI-6800 head schematic → SEM stoma → *C*ᵢ tag.
- **D · side by side:** a dark chamber (*A* < 0) beside a lit one (*A* > 0, *E* up), then one zoom into the lit leaf.

### `cp-path` (C10) · three doors to Rubisco · 5 beats, ≈ 38 s

| Beat | Click plays | Caption | Cite |
|---|---|---|---|
| 1 The whole path | v2 schema, all lit; one CO₂ starts in the outside air; *C*ₐ 420 shown | To reach Rubisco, CO₂ diffuses through three conductances in series: boundary layer, stomata, mesophyll. | Busch et al. 2024 |
| 2 Boundary layer | The camera moves to the boundary layer; a wind gust thins it in the same click; *C*ₛ rises | A layer of still air covers the leaf. Wind thins it, and more CO₂ reaches the surface. | Dupont et al. 2025 |
| 3 Stomata | The camera moves to the stoma; clipping: catalpa pores 0.9 % of the leaf; water streams out as CO₂ goes in; counter "150 to > 500 H₂O per CO₂" | 1900: catalpa pores cover 0.9 % of the leaf, yet it takes up CO₂ half as fast as a dish of caustic soda. The same pores let water out. | Brown & Escombe 1900; Verslues et al. 2023 |
| 4 Mesophyll | The camera moves to the wall and chloroplast (TEM inset, Clarke 2021); the CO₂ dissolves and slows; *C*ᵢ 300 → *C*c 200 | In water, CO₂ diffuses 10,000 times more slowly. Through wall, membranes and stroma, it falls from 300 to 200 µmol mol⁻¹. | Terashima et al. 2011; Busch et al. 2024 |
| 5 Stomata close | Zoom out; the guard cells close; in the same click the water arrow shrinks and *C*ᵢ and *C*c fall | On a hot, dry afternoon the stomata close: less water is lost, and less CO₂ reaches Rubisco. **How can a leaf raise the CO₂ around Rubisco?** | Gaastra 1959 |

Stagings:
- **A · one camera along the drawn path:** spotlight each part, zoom in and back out.
- **B · history-led:** Brown & Escombe 1900 → Gaastra 1959 Fig. 21 → micro-CT and TEM today, each landing on its part of the schema.
- **C · real-image journey:** SEM stoma → micro-CT air space → TEM wall and chloroplast, with the readouts fixed at the top.
- **D · side by side:** still air vs wind, then open vs closed stomata.
