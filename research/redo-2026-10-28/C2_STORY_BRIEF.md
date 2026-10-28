# C2 · one RuBisCO animation: why carboxylation, then RuBisCO through Earth's history (lecturer, 28 Oct 2026)

Slide C5a is removed from the deck. Its history moves into C2's animation, which becomes one continuous story.

The lecturer's words, near verbatim:
- "First tell: RuBisCO is the one, we illustrate why we need more carboxylation, because we make bread."
- "Then show how RuBisCO's history evolved: a chart of the O₂ and CO₂ levels in the atmosphere."
- "In the background, show how the world is changing. Single cells evolve into many species and dinosaurs; show the plants over time, then human evolution and the industrial revolution, all the way to today, AI."
- "Show how RuBisCO was, what happened, how that changes RuBisCO's affinity to CO₂, and how much yield we can get."
- Earlier: "The background chart should be the year and the CO₂ level, a little transparent, showing what was happening at that time… the CO₂ level goes higher and higher… do you understand how important the illustration is?"

## Structure: one animation key 'rubisco', played from C2
### Part 1 (beats 1–4): the existing 'rubisco' beats
- Reuse `anim/dk-rubisco.ts` (builder 1 is giving it one fixed camera) and its `RUBISCO` beats as they are: RuBP, carboxylation (2 3-PGA), oxygenation (1 3-PGA + 2-PG), 3-PGA → sugar → bread.
- Change beat 4's closing question to: "**Why does RuBisCO take O₂ at all? Its history tells.**"

### Transition
- A crossfade, ≥ 1.2 s, eased. No zoom and no camera move.
- The strip scene fades out while the history stage fades in. A small RuBisCO, with RuBP below, CO₂ in from the left and O₂ in from the right, appears in the lower right corner of the history stage.

### Part 2 (beats 5–12): the history stage, one fixed framing
- **Background chart, full width:**
  - x: time on a log scale, "4 billion years ago" → "today";
  - y: CO₂ in the air (ppm, log scale);
  - a thinner second line: O₂ in the air (% of air, its own small axis).
  - The real curves draw left to right with a playhead; the chart sits a little transparent behind the scenes.
- **Era scenes behind the chart:** semi-transparent flat illustrations in the deck's quiet palette, fading in as the playhead passes. Use PhyloPic silhouettes (phylopic.org, CC0 only, or CC BY with a small credit; plain curl to its API is fine) for organisms, and draw the rest as simple shapes. Every organism must be correct for its era.
- **A yield readout beside the corner RuBisCO:**
  - "oxygenations per 100 carboxylations";
  - "net CO₂ fixed per 100 carboxylations" = 100 − ½ × oxygenations (FvCB: each oxygenation releases ½ CO₂ in photorespiration);
  - a bar shows the carbon gain as the yield proxy;
  - both values carry the label "calculated".

| Beat | Scene | Curves | Corner RuBisCO / readout |
|---|---|---|---|
| 5 · ≈ 4–3 billion years ago | Early ocean, single cells, cyanobacterial mats (stromatolites) | CO₂ very high (off the top), O₂ ≈ 0 | Only CO₂ arrives → 0 oxygenations; carbon gain 100 |
| 6 · ≈ 2.4 billion years ago, Great Oxidation Event | O₂ bubbles from cyanobacteria; the ocean turns blue-green | O₂ rises | First O₂ bindings |
| 7 · ≈ 470–300 million years ago, plants on land, giant forests | Mosses → giant club mosses and tree ferns; a giant dragonfly | O₂ peaks (≈ 30 %?), CO₂ falls low | Many oxygenations; carbon gain falls |
| 8 · ≈ 250–66 million years ago, dinosaurs | Dinosaurs among conifers, cycads, ferns; the first flowering plants | CO₂ high, warm | Few oxygenations |
| 9 · last ≈ 3 million years, ice ages and early humans | Primates → early humans with stone tools; ice sheets | CO₂ swings 180–280 ppm | ≈ 96 per 100 at the glacial low; carbon gain ≈ 52 |
| 10 · ≈ 12,000 years ago → 1750, farming | Wheat fields, first towns | CO₂ ≈ 260–280 ppm | ≈ 66 per 100 |
| 11 · 1750 → today, industry → AI | Steam engines and factory chimneys → city skyline with a data centre | CO₂ 278 → 427 ppm, rising steeply | Oxygenations fall to ≈ 43; then a thermometer rises (warming) and they climb to ≈ 70 per 100 at 35 °C; carbon gain ≈ 65 |
| 12 · A better RuBisCO? | The same scene, dimmed | Curves stay | 3 small cards, 1 line each: red-algal RuBisCO (more specific, slower; not assembled in tobacco) · cyanobacterial RuBisCO (fast, needs high CO₂) · engineering (small gains so far). Caption ends "**How does the leaf turn 3-PGA into sugar?**" (C1 next) |

- **Captions:** 1–2 short sentences each, scientific terms, numerals, abbreviations spelled out at first use. No meta text on screen.
- **Length:** ≈ 60–70 s in total, one click per beat. The camera is fixed in each part: no zoom, no pans.

## Facts to verify first (report a fact table with sources)
- **CO₂ and O₂ through time:**
  - CO₂ for the Phanerozoic: Foster, Royer & Lunt 2017, Nat Commun; or the newer Cenozoic CO₂ consortium 2023, Science.
  - O₂: Berner's GEOCARBSULF, or Lenton et al. 2018.
  - The ice-core record you already use (Bereiter 2015), NOAA for today.
- **Dates:**
  - the Great Oxidation Event, about 2.4 billion years ago;
  - land plants, about 470 million years ago;
  - the Carboniferous forests, about 359–299 million years ago, with O₂ near 30 %;
  - the dinosaurs, 252–66 million years ago;
  - flowering plants, about 130 million years ago;
  - hominins, about 7 million years ago;
  - stone tools, about 3.3 million years ago;
  - farming, about 12,000 years ago.
- **Readout values:** compute them with your FvCB rule. Γ* scales with O₂ (Γ* ∝ O₂), so the Carboniferous O₂ raises oxygenation. Γ* follows Bernacchi 2001 at 25 °C unless stated. Keep the same C꜀/Cₐ rule you used before and state it in the beats file comment.

## Wiring
- Build in your rubisco-story scratch, re-synced from live: `anim/dk-c2story.ts` (+ css) and `anim/beats-c2story.ts`.
- The composite staging delegates beats 1–4 to the live `dk-rubisco.ts` staging and beats 5–12 to your history stage.
- Report the `index.ts` line, which replaces the 'rubisco' entry's stagings with the composite, and the files to copy. I wire it.
- C2's slide text changes separately; don't edit it.
- **QA:**
  - `tsc` must be clean;
  - contact sheets of every beat end plus the transition at 0, 0.6 and 1.2 s;
  - look at every scene yourself: organisms correct for the era, labels ≥ 11 px, nothing cut.
