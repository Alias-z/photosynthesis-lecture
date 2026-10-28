# C2 "RuBisCO through Earth's history", version 2 (lecturer, 28–29 Oct 2026)

The live animation is `anim/dk-c2story.ts`, `beats-c2story.ts`, `c2story-data.ts`, `c2story-scenes.ts` and `dk-c2story.css` (key 'c2story', played from slide C2). Rebuild it as version 2. Quality first: check every fact and every frame yourself.

## The lecturer's requests, near verbatim
1. "The CO₂ and O₂ flying into RuBisCO is just disturbing. What you want to show is how much oxygenation versus carboxylation: show it as a balance. Better, more intuitive."
2. "What I want to show is the affinity of RuBisCO. Show me the technical details of how you calculate it; I want to make sure it is correct."
3. "Nowadays CO₂ is way higher, so in principle carboxylation should benefit. But temperature also goes higher and higher. The background graph must show not only the CO₂ level at each time but also the temperature, and then show the effects together."
4. "Then the newspaper-like papers about how we engineer and change RuBisCO."
5. "The background should move around instead of being still: dinosaurs eating, people hunting, cars running around."

## Science (already computed and checked; keep exactly this model)
- **Ratio:** oxygenations per 100 carboxylations = 100 × 2Γ*/C꜀ (FvCB; von Caemmerer & Farquhar 1981).
- **Γ\*:** Bernacchi et al. 2001: Γ*(T) = exp(19.02 − 37.83 / (R·T_K)) ppm, with R = 0.008314 kJ mol⁻¹ K⁻¹. That gives 42.9 ppm at 25 °C and 70.4 ppm at 35 °C, rising ≈ 5.2 % per K. It is scaled by O₂/20.95 % for other O₂ levels.
- **C꜀** = (200/427) × Cₐ, the deck's rule: C꜀ ≈ 200 ppm in today's air.
- **Net CO₂ fixed per 100 carboxylations** = 100 − ½ × oxygenations.
- **Leaf temperature rule:** T_leaf = 25 °C + ΔGMST, where ΔGMST is the change in global mean surface temperature relative to pre-industrial (1850–1900). This is a stated simplification, printed small on screen as "calculated · leaf at 25 °C + change in global mean temperature".
- **"Affinity" readout:** RuBisCO's relative preference for CO₂ over O₂ in the leaf = Γ*(25 °C)/Γ*(T_leaf), shown as a bar, "CO₂ preference, relative to 25 °C".
- **Worked numbers (keep them; recompute only if you change data):**

| Case | Oxygenations per 100 carboxylations | Net CO₂ fixed per 100 |
|---|---|---|
| 1750, 278 ppm, 25 °C | 66 | 67 |
| 2026, 429.6 ppm, CO₂ effect only (25 °C) | 43 | 79 |
| 2026, 429.6 ppm, + warming ≈ +1.4 °C | 46 | 77 |
| hot day, 35 °C | 70 | 65 |
| hot and dry, 35 °C, stomata half closed (C꜀/Cₐ 0.35) | 94 | 53 |

- **The honest message.** Since 1750 the CO₂ rise has cut oxygenation more than mean warming has raised it (−23 vs +3 per 100). But heat waves and drought reverse that on the days that matter: a hot, dry day gives 94 per 100, more than in 1750. Mean temperature also keeps rising, and warming damages crops through drought and heat stress too.
- **In the animation, show the two effects separately and then together.** A small readout gives "CO₂ effect" (arrow down) and "temperature effect" (arrow up), then the net.
- Use ΔGMST from data. Do not use the 1.4 °C placeholder if a sourced value is available.

## Data to add (fact table with sources and read depth in your report)
- **Temperature curve on the same log time axis as CO₂:** global mean surface temperature (°C) on its own axis.
  - Phanerozoic: Judd et al. 2024, Science 385, eadk3705, "A 485-million-year history of Earth's surface temperature" (PhanDA). Use its data file if you can fetch it with plain curl; otherwise the values stated in the paper.
  - Cenozoic: Westerhold et al. 2020, Science, optional.
  - Last glacial maximum: Tierney et al. 2020, Nature, ≈ −6.1 °C.
  - Holocene to pre-industrial: Osman et al. 2021, Nature, or Kaufman 2020.
  - Instrumental 1850 → the latest month in 2026: HadCRUT5, Berkeley Earth, NOAA or Copernicus ERA5 (plain curl of their data files; WMO: 2024 ≈ +1.55 °C). State which series and its latest month.
- **CO₂:** keep the existing sources and the live NOAA September 2026 value (429.6 ppm, seasonally adjusted). The NOAA files were lost in a restart; re-download `https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_mm_mlo.txt` with plain curl.
- **Deep-time readouts:** compute them with the leaf temperature rule. For hot eras (e.g. the Cretaceous) the temperature effect can outweigh high CO₂. Show whatever the calculation gives, labelled "calculated".

## Design
- **Background chart:** full width, behind everything. Two curves on one log time axis: CO₂ (ppm, left axis, ink) and temperature (°C, right axis, warm red). The O₂ line stays only as a faint thin line or is removed; it matters only in the first 2 beats (O₂ ≈ 0, then the Great Oxidation Event), where a small O₂ note can carry it instead. Curves draw left to right with the playhead; the status line gives the year, CO₂ and temperature.
- **Corner panel (replaces the flying-gas corner):**
  - RuBisCO (8RUC render) as the fulcrum of a beam balance: "carboxylation" pan on the left, "oxygenation" pan on the right.
  - The pans hold weights (or bars) proportional to carboxylations (100) and oxygenations (the computed number). The beam tilts smoothly, eased, by the ratio.
  - Under it: the numbers (oxygenations per 100 carboxylations; net CO₂ fixed), the "CO₂ preference" bar, and in the modern beats the "CO₂ effect / temperature effect / net" readout.
  - No molecules fly in.
- **Living scenes:** subtle loops, eased, below the chart band, never covering curves or labels:
  - early ocean: waves, O₂ bubbles rising from stromatolites;
  - Carboniferous: tree ferns swaying, a giant dragonfly flying;
  - dinosaurs: a sauropod lowering its neck to eat conifer leaves, a small dinosaur walking;
  - ice age: humans hunting, walking with spears towards a mammoth (no gore);
  - farming: wheat swaying, a farmer harvesting;
  - industry: a steam train moving, chimney smoke drifting;
  - today: cars driving along a road, a plane crossing, the data-centre windows blinking.
- **Newspaper clippings** for "A better RuBisCO?": 3–4 newspaper-style clippings: paper texture, a headline, a year, 1–2 factual lines and a small source line. Generic design: no real newspaper name, masthead or logo, and no invented quotes. Every headline must be true and sourced, for example:
  - red-algal RuBisCO made in tobacco but not assembled (Whitney et al. 2001);
  - faster cyanobacterial RuBisCO works in tobacco, but the plants need high CO₂ (Lin et al. 2014, Nature);
  - a photorespiratory bypass raised tobacco biomass in the field by 19–37 % (South et al. 2019, Science; corrected values);
  - directed evolution of RuBisCO, small gains so far (cite what you can verify).
- **Camera:** one fixed framing, no zoom. Motion smooth and eased. Captions ≤ 3 lines so their sources show. Numerals only; abbreviations spelled out at first use; no meta text beyond the one "calculated" line and data credits.
- **Beats:**
  1. intro (balance shown, both reactions named);
  2. ≈ 3 billion years ago;
  3. Great Oxidation Event;
  4. plants on land / Carboniferous;
  5. dinosaurs;
  6. ice ages and early humans;
  7. farming / 1750;
  8. industry to today, with the CO₂ effect, then the temperature effect, then a hot dry day, as click steps within the beat;
  9. "A better RuBisCO?" clippings, ending "<b>How does the leaf turn 3-phosphoglycerate (3-PGA) into sugar?</b>"

  ≤ 70 s in total.

## Workflow
- Scratch copy `$S/c2story-v2/deck`, rsync'd from live (exclude node_modules, backups, .git, dist), with node_modules symlinked; vite on port 5260.
  - `$S` = /private/tmp/claude-502/-Users-zhongyua--codex-visualizations-2026-10-18-01a14e64-129b-7041-8fab-d6753ae41888-claude-handoff/5ab943f9-d753-4192-bfa6-3efc5cb53ace/scratchpad
- Edit only the c2story files (and new files). Do not touch picks.json, plates.ts or index.ts in live.
- **QA:**
  - `tsc` must be clean;
  - headless Chrome shots (`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --headless=new …`) of every beat end and of mid-motion frames, including several frames of each living scene to prove the loops move smoothly;
  - make your own contact-sheet script with PIL (run `python3` without `-I`);
  - look at every frame yourself.
- **Final message:**
  1. a technical note on the calculation, with every formula and constant, for the lecturer;
  2. the fact table;
  3. the files to copy;
  4. contact-sheet paths;
  5. doubts.
