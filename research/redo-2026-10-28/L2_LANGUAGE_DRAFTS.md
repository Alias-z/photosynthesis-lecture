# Lecture 2 language and layout drafts, 28 Oct 2026. Before → after. Nothing is applied

**How to read this**
- **Brief:** `L2_LANGUAGE_BRIEF.md`.
- **Standard:** lecture-1 slides 7 and 10. Each slide has a 1-sentence lead and at most 3 points. Each point is a textbook term, 1 physical fact, and at most 1 eq line.
- **"Before":** the live module text (`src/pilot/figs/…`) and the live captions (`src/pilot/anim/beats-…`), after the spelling conversion.
- **Spelling:** the lecturer's rule. RuBisCO · 3-PGA · triose phosphate · Calvin–Benson–Bassham cycle · ribulose-1,5-bisphosphate, and by analogy ribulose-5-phosphate.
- **Numbers:** checked against the fact table in `L2_TEXT_DRAFTS.md`, or as stated.
- **Eq lines:** `|` separates lines (`<br>` in the module).
- **Layout check:** measured in the live deck (port 5174) at the untightened type sizes.
  - Column: the natural height of the text column, against the figure's 642 px. Above 642 px, `fitPage` shrinks the type.
  - Widest eq line: against the 483 px available.
  - Reference values for the standard: slide 7 = 628 px, slide 10 (3 text points) = 599 px.
- **Cut from a slide but kept in its animation:** said per slide.

---

## C1 · Calvin–Benson–Bassham cycle (`cb01.ts`)

| Row | Before | After |
|---|---|---|
| Title | Calvin–Benson–Bassham cycle | same |
| Lead | In the stroma, the Calvin–Benson–Bassham cycle fixes CO₂ into triose phosphate, using ATP and NADPH from the light reactions. | In the stroma, the Calvin–Benson–Bassham cycle fixes CO₂ into triose phosphate. |
| P1 claim | Carboxylation. | same |
| P1 text | RuBisCO adds CO₂ to ribulose-1,5-bisphosphate (RuBP, 5 C) \| The product splits into two 3-phosphoglycerate (3-PGA, 3 C) | RuBisCO adds CO₂ to RuBP |
| P1 eq | — | 3 RuBP + 3 CO₂ → 6 3-PGA |
| P2 claim | Reduction. | same |
| P2 text | 3-PGA is reduced to triose phosphate (3 C) | 3-PGA is reduced to triose phosphate |
| P2 eq | — | 6 3-PGA → 6 triose phosphate |
| P3 claim | Regeneration. | same |
| P3 text | Per 3 CO₂ fixed, 6 triose phosphates are made \| 5 rebuild 3 RuBP; 1 leaves the cycle | Triose phosphate regenerates RuBP |
| P3 eq | — | 5 triose phosphate (15 C) → 3 RuBP (15 C) \| 1 triose phosphate (3 C) leaves the cycle |

- **Why:**
  - "using ATP and NADPH" is C3's message, and C3 is the next slide.
  - "rebuild" is replaced by the textbook term "regenerate".
  - The carbon counts stay only where they explain a step: 5 × 3 C = 3 × 5 C.
  - "3 CO₂ in" (P1 eq) and "1 triose phosphate out" (P3 eq) carry the message.
  - The unit is per 3 CO₂, as the figure key says.
- **Full names:** ribulose-1,5-bisphosphate and 3-phosphoglycerate are written in full in the RuBisCO story (C2, C5), which now comes first. If the redone C2/C5 does not write them in full, keep them in full here, on P1.

**Captions, cb1**

| Beat | Before | After |
|---|---|---|
| Carbon-14 | From 1945, carbon-14 was cheap. Calvin, Benson and Bassham fed ¹⁴CO₂ to algae in light, first in a flat flask, the “lollipop”, then dropped them into alcohol to stop all reactions. | Calvin, Benson and Bassham fed ¹⁴CO₂ to algae in light, then dropped them into alcohol to stop all reactions. |
| Shorter feeds | The shorter the feed, the fewer the labelled compounds. After fractions of a second, … | The shorter the ¹⁴CO₂ feeding time, the fewer compounds were labelled. After fractions of a second, … (rest same) |
| Spots into a cycle → tag "Labelling order" | … sugar phosphates that rebuild RuBP. In 1954 they drew it as a cycle. | … sugar phosphates that regenerate RuBP. In 1954 they drew it as a cycle. |
| Per 3 CO₂ | … 5 rebuild 3 RuBP, 1 is the gain. **RuBisCO adds the CO₂: how fast does it work?** | … 5 regenerate 3 RuBP, 1 leaves the cycle. **How much ATP and NADPH do reduction and regeneration use?** |

- **Repetition:** if the redone C2 keeps the ¹⁴C first-product experiment, start cb1 at "Labelling order". The first 2 beats would otherwise repeat it.

**Layout:** column 615 px (before 652 px, shrunk); widest eq 406/483 px. Balanced.

---

## C3 · Reduction and regeneration → retitled (`cb03.ts`)

| Row | Before | After |
|---|---|---|
| Title | Reduction and regeneration | Energy cost of CO₂ fixation |
| Lead | Reducing 3-PGA and regenerating RuBP use the ATP and NADPH of the light reactions: 3 ATP and 2 NADPH per CO₂ fixed. | Reduction and regeneration use ATP and NADPH from the light reactions. |
| P1 claim | Reduction. | ATP. |
| P1 text | Per CO₂: 2 ATP + 2 NADPH turn two 3-PGA into two triose phosphates | Phosphorylates 3-PGA and ribulose-5-phosphate |
| P1 eq | — | Per 3 CO₂: 6 + 3 = 9 ATP |
| P2 claim | Regeneration. | NADPH. |
| P2 text | Per CO₂: 1 ATP, in the last step to RuBP | Reduces 1,3-bisphosphoglycerate to triose phosphate |
| P2 eq | — | 6 NADPH |
| P3 claim | Light–dark transient. | ATP : NADPH ratio. |
| P3 text | Light off: 3-PGA accumulates, RuBP falls to near zero within a minute (*Chlorella*) \| Without RuBP, RuBisCO stops fixing CO₂ | — (no text, like the "Per O₂." points of lecture 1) |
| P3 eq | — | 9 : 6 = 3 : 2 |

**Variant: points by phase** (same title and lead). It repeats C1's 2 headings on the next slide.

| Row | Text | Eq |
|---|---|---|
| Reduction. | ATP phosphorylates 3-PGA, then NADPH reduces it | Per 3 CO₂: 6 ATP + 6 NADPH |
| Regeneration. | ATP phosphorylates ribulose-5-phosphate to RuBP | 3 ATP |
| ATP : NADPH ratio. | — | 9 ATP : 6 NADPH = 3 : 2 |

- **Why the title:**
  - The old title and P1–P2 headings repeat C1, which is now the previous slide.
  - "Energy cost of the Calvin–Benson–Bassham cycle" measures 1385 of 1412 px and runs into the play button (x 1436–1504). "Energy cost of CO₂ fixation" (776 px) avoids both problems.
- **Why the lead and units changed:** the lead had numbers, and it had a second unit, "per CO₂", where the figure counts per 3 CO₂.
- **Why the light–dark transient is cut from the slide:**
  - It is not this slide's message.
  - Its data are not in the figure: only the cell figures m1 and m2 are listed for C3.
  - It stays in the cb3 animation (beats "Light off" and "Why").
- **Why 3 : 2:** it is the demand that 10b balances.
- **Numbers checked:**
  - 6 ATP + 6 NADPH (reduction) and 3 ATP (regeneration) per 3 CO₂ (Sharkey 2019, Fig. 3).
  - Phosphoglycerate kinase uses ATP; GAPDH uses NADPH; phosphoribulokinase uses ATP.

**Captions, cb3**

| Beat | Before | After |
|---|---|---|
| The fuel → tag "ATP and NADPH" | Per 3 CO₂, reduction takes 6 ATP and 6 NADPH, regeneration 3 ATP: 3 ATP and 2 NADPH per CO₂. | Per 3 CO₂, reduction uses 6 ATP and 6 NADPH, regeneration 3 ATP: 9 ATP and 6 NADPH in total. |
| Light off | … within a minute, 3-PGA piled up and RuBP fell to near zero. | … within 1 min, 3-PGA accumulated and RuBP fell to near zero. |
| Why | Without ATP and NADPH, 3-PGA is not reduced and RuBP is not rebuilt. RuBisCO uses up the RuBP left, then stops. | Without ATP and NADPH, 3-PGA is not reduced and RuBP is not regenerated. RuBisCO consumes the remaining RuBP, then stops. |
| One in six → tag "1 in 6" | In light the cycle runs again, and 1 of every 6 triose phosphates leaves it. **Where does it go, …?** | In light, 1 of every 6 triose phosphates leaves the Calvin–Benson–Bassham cycle. **Where does it go, by day and at night?** |

**Layout:** column 567 px (before 577 px); widest eq 231/483 px. Light; the figure dominates.

---

## C4 · Sucrose and starch (`cb04.ts`)

| Row | Before | After |
|---|---|---|
| Title | Sucrose and starch | same |
| Lead | Triose phosphate leaves the chloroplast to make sucrose for the whole plant, or stays to make starch for the night. | Triose phosphate leaves the chloroplast to make sucrose, or stays to make starch. |
| P1 claim | Sucrose. | Phosphate translocator (TPT). |
| P1 text | Triose phosphate leaves the chloroplast in exchange for phosphate (Pᵢ) \| Sucrose is made in the cytosol and exported to growing organs | Exchanges triose phosphate for Pᵢ across the inner envelope |
| P2 claim | Starch. | Sucrose. |
| P2 text | Made from part of the triose phosphate, inside the chloroplast, by day | Made in the cytosol, exported in the phloem to sink organs |
| P3 claim | Starch degradation at night. | Starch. |
| P3 text | Near-constant rate: ≈ 95 % of the starch is used by dawn (*Arabidopsis*) \| After an early dusk, breakdown slows, so starch still lasts until dawn | Made in the chloroplast by day, degraded at night to make sucrose |
| Eq lines | — | none: the slide needs no numbers, and its figure carries only "1 × 3 C" |

- **Why:**
  - The TPT gets its own point because it is labelled in the figure. C8's triose phosphate use limit also rests on the Pᵢ return.
  - The night-time role of starch now sits in 1 line, on P3.
- **Cut:**
  - "≈ 95 %": a secondary percentage, not in the figure.
  - The early-dusk experiment: a second-level finding.
  - Both stay in the cb4 animation.
  - "for the whole plant" is replaced by "sink organs"; "for the night" is now in P3.

**Captions, cb4**

| Beat | Before | After |
|---|---|---|
| Out or in → tag "Export or storage" | Triose phosphate leaves the chloroplast in exchange for phosphate and becomes sucrose, for the whole plant. Part stays in the chloroplast and becomes starch. | Triose phosphate leaves the chloroplast in exchange for Pᵢ and is made into sucrose, which the phloem exports to the rest of the plant. Part stays in the chloroplast and is made into starch. |
| Day and night | … starch builds up all day and is broken down at night at a near-constant rate: almost all of it is used by dawn. | … starch accumulates all day and is degraded at night at a near-constant rate: ≈ 95 % of it is used by dawn. |
| Early dusk → tag "8 h day" | 2010: Graf and colleagues let night fall after 8 hours instead of 12. The plants slowed starch breakdown at once, and the starch still lasted until dawn. | 2010: Graf and colleagues switched the light off after 8 h instead of 12 h. The plants slowed starch degradation at once, so the starch still lasted until dawn. |
| RuBisCO and O₂ → tag "2-phosphoglycolate" | All this sugar starts with RuBisCO adding CO₂ to RuBP. **But RuBisCO can also take O₂ instead of CO₂: what happens then?** | All this sugar comes from CO₂ that RuBisCO adds to RuBP. But each oxygenation makes 2-phosphoglycolate, which the Calvin–Benson–Bassham cycle cannot use. **What happens to it?** |

- **Last beat:** oxygenation is already known from C5.

**Layout:** column 528 px (before 719 px, shrunk 2 steps). Light. If the page looks top-light, the figure can take the space; no text needs adding.

---

## C6 · Photorespiration (`rf06.ts`)

| Row | Before | After |
|---|---|---|
| Title | Photorespiration | same |
| Lead | The cycle cannot use 2-phosphoglycolate, so photorespiration recycles it into 3-PGA via peroxisome and mitochondrion. | Photorespiration converts 2-phosphoglycolate into 3-PGA. |
| P1 claim | Pathway. | same |
| P1 text | Chloroplast → peroxisome → mitochondrion → peroxisome → chloroplast \| In the mitochondrion: 2 glycine → serine + CO₂ + NH₃ | Chloroplast → peroxisome → mitochondrion → peroxisome → chloroplast |
| P2 claim | Cost. | Carbon loss. |
| P2 text | Of 4 C in two 2-phosphoglycolate: 3 return as PGA, 1 is lost as CO₂ \| Refixing NH₃ and returning glycerate cost ATP and reductant | Glycine decarboxylase releases CO₂ and NH₃ |
| P2 eq | — | Per 2 O₂: 4 C → 3 C (3-PGA) + 1 C (CO₂) |
| P3 claim | Essential pathway. | Energy cost. |
| P3 text | Arabidopsis mutants that lack it grow in 1 % CO₂ but not in air | Glycerate kinase and NH₃ refixation use ATP and reduced ferredoxin |
| P3 eq | — | 2 ATP + 2 reduced ferredoxin |

- **Why the lead changed:**
  - It no longer lists the organelles: P1 does.
  - "The cycle cannot use 2-phosphoglycolate" moves to the question that ends cb4.
  - Writing the cycle's full name in the lead would take 4 lines.
- **Why the points changed:**
  - "PGA" becomes "3-PGA".
  - "reductant" becomes the exact carrier: reduced ferredoxin, used by Fd-GOGAT.
  - "Cost." is split into the 2 costs of the message: carbon and energy.
- **Cut:** the mutant point. It is not this slide's message, and it stays in the rf6 animation (beat "1979").
- **Numbers checked, per 2 O₂:**
  - 4 C in, 3 C back, 1 C lost (Peterhänsel et al. 2010).
  - Glycerate kinase: 1 ATP.
  - NH₃ refixation: 1 ATP (glutamine synthetase) and 2 reduced ferredoxin (Fd-GOGAT).
  - Total: 2 ATP + 2 reduced ferredoxin. These are the ATP and ferredoxin drawn in the cell figure.

**Captions, rf6** (live staging rf6-a; the same beats serve rf6-b and rf6-c)

| Beat | Before | After |
|---|---|---|
| Glycolate | The chloroplast turns 2-phosphoglycolate into glycolate and sends it to the peroxisome. | In the chloroplast, 2-phosphoglycolate is dephosphorylated to glycolate, which moves to the peroxisome. |
| Peroxisome | In the peroxisome, glycolate becomes glycine. | In the peroxisome, glycolate is oxidised and aminated to glycine. |
| Mitochondrion | In the mitochondrion, two glycine make one serine; one carbon leaves as CO₂, and NH₃ is released. | In the mitochondrion, 2 glycine give 1 serine, 1 CO₂ and 1 NH₃. |
| Back to 3-PGA | Serine becomes glycerate in the peroxisome, and the chloroplast makes 3-PGA from it with ATP; NH₃ is refixed in the chloroplast with ATP and reduced ferredoxin. | Serine is converted to glycerate in the peroxisome; in the chloroplast, glycerate kinase makes 3-PGA from it with ATP. NH₃ is refixed there with ATP and reduced ferredoxin. |
| 1979 | … grew in 1 % CO₂ but turned pale in air … | … grew in 1 % CO₂ (10,000 ppm) but became chlorotic in air … (rest same) |
| ATP and reductant → tag "Light supply" | The Calvin–Benson–Bassham cycle and photorespiration both spend ATP and reductant from the light reactions. **How fast can light supply them?** | The Calvin–Benson–Bassham cycle uses ATP and NADPH, photorespiration ATP and reduced ferredoxin, all from the light reactions. **How does the leaf's CO₂ uptake depend on light?** |

**Layout:** column 553 px (before 719 px, shrunk 2 steps); widest eq 384/483 px. Balanced.

---

## C7 · Light-response curve (`rf07.ts`)

| Row | Before | After |
|---|---|---|
| Title | Light-response curve | same |
| Lead | Light supplies the ATP and NADPH that regenerate RuBP, so CO₂ uptake rises with light until the Calvin–Benson–Bassham cycle limits it. | Light supplies the ATP and NADPH that regenerate RuBP, so net CO₂ uptake rises with light. |
| P1 claim | Quantum yield. | Light compensation point. |
| P1 text | In dim light, CO₂ uptake rises linearly with light \| Slope = CO₂ fixed per photon absorbed | CO₂ fixation equals CO₂ release by respiration and photorespiration |
| P2 claim | Light compensation point. | Quantum yield. |
| P2 text | Uptake = release by respiration and photorespiration \| Below it, the leaf releases CO₂ | Slope in dim light: CO₂ fixed per photon absorbed |
| P3 claim | Light saturation. | same |
| P3 text | In bright light, uptake levels off at the leaf’s capacity \| Shade leaves saturate at lower light and lower uptake than sun leaves | In bright light, uptake levels off: light no longer limits it |
| Eq lines | — | none |

- **Why:**
  - "until the cycle limits it" and "the leaf's capacity" name no step. Which step limits is C8's subject, so C7 states only that light no longer limits.
  - The points now follow rising light, as the rf7 animation does: compensation point, then the linear range, then saturation.
- **Cut:**
  - "Below it, the leaf releases CO₂": it follows from the definition.
  - Sun vs shade leaves: a second example. It stays in the rf7 beat "Sun and shade".
- **Why no numbers:** only the cell figures (m) are listed for C7, so no curve and no number is in the figure. The quantum yield 0.052 stays out.

**Captions, rf7**

| Beat | Before | After |
|---|---|---|
| Light compensation point | … the CO₂ that RuBisCO fixes balances the CO₂ released … | … the CO₂ that RuBisCO fixes equals the CO₂ released … |
| Light saturation | In bright light, the thylakoids supply more ATP and NADPH than the cycle uses: CO₂ uptake levels off at the leaf’s capacity. | In bright light, the thylakoids can supply more ATP and NADPH than the Calvin–Benson–Bassham cycle uses: CO₂ uptake levels off. |
| Sun and shade | Tobacco grown in 28 % of sunlight levels off at lower light and lower uptake … | Tobacco grown in 28 % of sunlight saturates at lower light and lower uptake … (rest same) |
| More CO₂ (rf7 B) | 1959, Gaastra: spinach leaves measured at four CO₂ levels, from 0.017 to 0.15 %. Each rise in CO₂ raised the level at which uptake levels off. | 1959, Gaastra: spinach leaves measured at 4 CO₂ levels, from 170 to ≈ 1500 ppm. Each rise in CO₂ raised the light-saturated uptake. |

**Layout:** column 528 px (before 727 px, shrunk 2 steps). Light.

---

## C8 · FvCB model (`rf08.ts`)

| Row | Before | After |
|---|---|---|
| Title | FvCB model | same |
| Lead | The Farquhar–von Caemmerer–Berry (FvCB) model gives CO₂ uptake as the lowest of three rates, each set by one step. | The Farquhar–von Caemmerer–Berry (FvCB) model gives CO₂ uptake as the lowest of 3 rates. |
| P1 claim | RuBisCO limit, *A*c. | same |
| P1 text | At low *C*ᵢ, uptake rises steeply with CO₂ \| Set by the amount of active RuBisCO (*V*cmax) | At low *C*ᵢ: set by the amount of active RuBisCO, *V*cmax |
| P1 eq | — | *C*ᵢ: CO₂ in the leaf air spaces |
| P2 claim | RuBP-regeneration limit, *A*j. | same |
| P2 text | At higher *C*ᵢ, uptake rises slowly \| Set by the electron transport rate (*J*) that supplies ATP and NADPH | At higher *C*ᵢ: set by the electron transport rate, *J* |
| P3 claim | TPU limit, *A*p. | same |
| P3 text | At high *C*ᵢ, uptake stops rising \| Set by triose-phosphate use (TPU) for sucrose and starch | At high *C*ᵢ: set by triose phosphate use (TPU) in sucrose and starch synthesis |

- **Cut:**
  - "rises slowly" (the word the lecturer rejected), "rises steeply" and "stops rising". They describe the A/*C*ᵢ curve, which is not in the figure: only the cell figures with the 3 limit boxes are listed. The rf8 animation shows the curve and says it.
  - "that supplies ATP and NADPH": C7 says it.
- **Kept:** *C*ᵢ is defined here, because C9 has moved to the end. "≈ 300 ppm today" stays in the rf8 beat "Today's air".

**Captions, rf8**

| Beat | Before | After |
|---|---|---|
| RuBisCO limit | At low *C*ᵢ, RuBisCO has RuBP to spare but too little CO₂: uptake rises steeply with CO₂. … | At low *C*ᵢ, RuBP is in excess and CO₂ limits carboxylation: uptake rises steeply with *C*ᵢ. … (rest same) |
| Today’s air | … the leaf works near the switch from the RuBisCO limit to the next one. | … the leaf operates near the transition from the RuBisCO limit to the RuBP-regeneration limit. |
| RuBP-regeneration limit | At higher *C*ᵢ, RuBisCO waits for RuBP. Regenerating RuBP needs ATP and NADPH, … | At higher *C*ᵢ, RuBP regeneration limits carboxylation. Regenerating RuBP needs ATP and NADPH, … (rest same) |
| TPU limit | At very high *C*ᵢ, triose phosphate is made faster than sucrose and starch synthesis use it: uptake stops rising. | At very high *C*ᵢ, triose phosphate is made faster than sucrose and starch synthesis use it, and too little Pᵢ returns to the chloroplast: uptake stops rising. |
| FvCB model (last) | … **How do we measure a leaf’s CO₂ uptake, and the CO₂ inside it?** | … **Photorespiration releases CO₂ in the light: does all of it leave the leaf?** (C11 is next; C9 has moved to the end.) |

**Layout:** column 609 px (before 676 px, shrunk); widest eq 264/483 px. Balanced.

---

## C11 · Refixation of photorespired CO₂ (`cc11.ts`)

| Row | Before | After |
|---|---|---|
| Title | Refixation of photorespired CO₂ | same |
| Lead | Photorespired CO₂ leaves the mitochondria; chloroplasts lying in its way to the air spaces refix part of it. | Photorespired CO₂ must cross chloroplasts to leave the cell; their RuBisCO refixes part of it. |
| P1 claim | Refixation in C₃ leaves. | Chloroplast coverage. |
| P1 text | Rice, wheat: chloroplasts cover 92–99 % of the wall facing the air spaces; mitochondria lie behind them \| 26–29 % of the photorespired CO₂ is refixed; net CO₂ uptake +9–11 % | Chloroplasts line the wall facing the air spaces, mitochondria behind them |
| P1 eq | — | Rice: 99 % of that wall covered |
| P2 claim | C₂ photosynthesis. | Refixation. |
| P2 text | Glycine moves from mesophyll to bundle-sheath cells \| There, glycine decarboxylase releases CO₂ next to RuBisCO | Raises the net CO₂ uptake of the leaf |
| P2 eq | — | Rice, 30 °C: 29 % refixed · net CO₂ uptake +11 % |
| P3 | **Path to C₄.** C₃ → C₂ → C₄: living *Flaveria* species show each stage | removed |

- **Why:**
  - "lying in its way" is figurative; the lead now states the physical constraint.
  - Old P2 and P3 are the subjects of C11a, the next slide.
- **Cut:** wheat (92 %, 26 %, +9 %), a second example. It stays in the cc11 beat "Refixation".
- **Numbers checked:** Busch et al. 2013, at 350 ppm, 30 °C: rice 98.9 % coverage, 29 % refixed, +11 % net uptake.

**Captions, cc11**

| Beat | Before | After |
|---|---|---|
| How it was measured | … In a flood of ¹³CO₂, RuBisCO almost never meets ¹²CO₂, and about twice as much came out. | … At high ¹³CO₂, RuBisCO refixes almost no ¹²CO₂, and about twice as much ¹²CO₂ came out. |
| C₂ photosynthesis | C₂ plants go further: … | removed (C11a is next) |
| Toward C₄ (last) | Living *Flaveria* species show each step from C₃ through C₂ to C₄. **What if a plant pumped CO₂ to RuBisCO instead of catching what photorespiration releases?** | new tag "Next to RuBisCO": **Could a leaf release its photorespired CO₂ next to RuBisCO, so that more of it is refixed?** |
| Six C₃ species (cc11 D) | … rice ≈ 46, tobacco ≈ 51, RuBisCO alone ≈ 57 µmol mol⁻¹. | … rice ≈ 46, tobacco ≈ 51, RuBisCO alone (no refixation) ≈ 57 ppm. |
| cc11 B, D | reuse CC11[3] and CC11[4] | drop those 2 beats there too |

**Layout:** column 464 px (before 711 px, shrunk 2 steps). It has 2 points only; the figure dominates.

---

## C11a · C₂ photosynthesis (`cc11a.ts`)

| Row | Before | After |
|---|---|---|
| Title | C₂ photosynthesis | same |
| Lead | C₂ plants release photorespired CO₂ in the bundle sheath, next to RuBisCO, and so lose less of it. | same |
| P1 claim | Glycine shuttle. | same |
| P1 text | Glycine moves into the bundle sheath, where glycine decarboxylase is confined | Glycine decarboxylase is only in the bundle sheath, so glycine moves there |
| P1 eq | 2 glycine → serine + CO₂ + NH₃ | same |
| P2 claim | CO₂ build-up. | CO₂ concentration. |
| P2 text | Bundle-sheath RuBisCO refixes the released CO₂ | CO₂ rises around bundle-sheath RuBisCO, so it oxygenates less |
| P2 eq | CO₂ at RuBisCO: C₂ ≈ 3 × C₃ \| CO₂ compensation point (*Flaveria*, 30 °C): \| C₃ 62 · C₂ 9–29 · C₄ ≈ 3 µbar | CO₂ compensation point (*Flaveria*, 30 °C): \| C₃ 62 · C₂ 9–29 · C₄ ≈ 3 ppm |
| P3 claim | Step towards C₄. | C₃–C₄ intermediates. |
| P3 text | *Flaveria*, *Heliotropium*: C₃, C₂ and C₄ species \| *Moricandia*, *Steinchisma*: C₃ and C₂ species | *Flaveria* has C₃, C₂ and C₄ species |
| P3 eq | > 50 C₂ species in ≈ 20 lineages · C₄: 61 lineages | — |

- **Why:**
  - "build-up" is replaced by the textbook term.
  - The P2 eq kept 3 lines; it now keeps 1 measure that runs C₃ → C₂ → C₄ and is plotted in variant v4.
  - Unit: ppm, 1 unit per slide. Ku 1991 gives µbar; at sea-level pressure 1 µbar ≈ 1 ppm.
- **Cut:**
  - "C₂ ≈ 3 × C₃": a single species pair.
  - 3 of the 4 genera: second examples.
  - The lineage counts: secondary numbers.

**Captions:** C11a has no animation.

**Layout:** column 632 px (before 761 px, shrunk 2 steps); widest eq 391/483 px. Close to the limit; full.

---

## C12 · C₄ photosynthesis (`cc12.ts`)

| Row | Before | After |
|---|---|---|
| Title | C₄ photosynthesis | same |
| Lead | C₄ plants concentrate CO₂ in bundle-sheath cells, where RuBisCO works at high CO₂ and photorespiration is nearly absent. | C₄ plants concentrate CO₂ around RuBisCO, so photorespiration is low. |
| P1 claim | PEP carboxylase. | same |
| P1 text | In mesophyll cells it fixes HCO₃⁻ into a four-carbon acid \| It does not react with O₂ | Fixes HCO₃⁻ in the mesophyll; does not react with O₂ |
| P1 eq | — | PEP (3 C) + HCO₃⁻ (1 C) → oxaloacetate (4 C) |
| P2 claim | Kranz anatomy. | same |
| P2 text | Bundle-sheath cells form a wreath around each vein \| The C₄ acid moves there and releases CO₂ next to RuBisCO | The C₄ acid releases CO₂ in the bundle sheath around each vein |
| P2 eq | — | CO₂: bundle sheath ≈ 1500 · mesophyll ≈ 100 ppm |
| P3 claim | Costs and benefits. | Energy cost. |
| P3 text | Regenerating PEP costs 2 ATP per CO₂ \| It pays in hot, dry, bright conditions: maize, sugarcane, sorghum | Regenerating PEP uses extra ATP |
| P3 eq | — | Per 3 CO₂: C₄ 15 ATP · C₃ 9 ATP; 6 NADPH each |

- **Why:**
  - "works at high CO₂" and "It pays" are figurative.
  - Per 3 CO₂ is the cycle's unit (C1, C3).
  - The product of PEP carboxylase is named exactly: oxaloacetate.
- **Cut:**
  - The 3 crop names: second examples.
  - "hot, dry, bright": its physical form, C₄ fixes more CO₂ per photon above ≈ 30 °C, stays in the cc12 beat "The price".
- **Numbers checked:**
  - 2 ATP per PEP, NADP-ME type (von Caemmerer 2021).
  - ≈ 1500 and ≈ 100 ppm (Sage, Sage & Kocacinar 2012, Fig. 1).

**Captions, cc12**

| Beat | Before | After |
|---|---|---|
| Label in the acids | … After about one second, more than 93 % of the fixed ¹⁴C was in four-carbon acids … | … After about 1 s, more than 93 % of the fixed ¹⁴C was in 4-carbon acids … |
| The CO₂ pump → tag "CO₂ concentration" | … ≈ 1500 µmol mol⁻¹ there, ≈ 100 in the mesophyll. | … ≈ 1500 ppm there, ≈ 100 ppm in the mesophyll. |
| The price → tag "Energy cost" | Regenerating PEP costs 2 ATP per CO₂. Below about 30 °C … | Regenerating PEP costs 6 extra ATP per 3 CO₂. Below ≈ 30 °C … (rest same) |
| A cool leaf (cc12 D) | … per 1000 absorbed photons, … fixed 69 CO₂, … 53. The pump costs 2 ATP per CO₂. | … fixed 0.069 mol CO₂ per mol absorbed photons, … 0.053. Concentrating CO₂ costs 6 extra ATP per 3 CO₂. |
| A hot leaf (cc12 D) | … *Encelia* fixed only 42 CO₂ per 1000 photons, *Atriplex* still 53. | … *Encelia* fixed only 0.042, *Atriplex* still 0.053. |

**Layout:** column 603 px (before 727 px, shrunk 2 steps); widest eq 473/483 px. Balanced.

---

## C13 · Crassulacean acid metabolism (CAM) (`cc13.ts`)

| Row | Before | After |
|---|---|---|
| Title | Crassulacean acid metabolism (CAM) | same |
| Lead | CAM plants take up CO₂ at night and fix it by day behind closed stomata, saving water. | CAM plants take up CO₂ at night and keep their stomata closed by day. |
| P1 claim | Night. | same |
| P1 text | Stomata open; PEP carboxylase fixes CO₂ as HCO₃⁻ \| The product is stored as malic acid in the vacuole | Stomata open; PEP carboxylase fixes HCO₃⁻; malic acid accumulates in the vacuole |
| P2 claim | Day. | same |
| P2 text | Stomata close; malic acid releases CO₂ \| RuBisCO fixes it, using ATP and NADPH from the light reactions | Stomata close; malic acid releases CO₂, which RuBisCO fixes |
| P3 claim | Water saving. | Water-use efficiency. |
| P3 text | Night air is cooler and more humid, so less water is lost per CO₂ \| ≈ 7 % of vascular plant species, e.g. pineapple, agave, cacti | Night air is cooler and more humid, so less water is lost per CO₂ |
| P3 eq | — | CO₂ per H₂O (mmol mol⁻¹): CAM 4–10 · C₃ 0.5–1.5 |

- **Why:**
  - "fixes CO₂ as HCO₃⁻" was inexact.
  - "fix it by day" was inexact: CO₂ is fixed twice, by PEP carboxylase at night and by RuBisCO by day.
  - "Water-use efficiency" is the textbook term, and its definition is CO₂ per H₂O. This is Borland 2009's own unit, also used in variant v5.
- **Cut:**
  - "using ATP and NADPH": known from C3.
  - "≈ 7 % of species" and the examples: secondary. The figures show *Kalanchoë* and *Agave*.
- **Water basis:** this supersedes decision 3 in `L2_TEXT_DRAFTS.md` for C13. C10's water number is cut from its slide, so the 2 bases no longer meet on slides.

**Captions, cc13**

| Beat | Before | After |
|---|---|---|
| Day | By day the stomata stay shut. … | By day the stomata stay closed. … |
| The record | … CO₂ uptake runs through the night (phase I) … while malic acid feeds RuBisCO behind closed stomata. | … CO₂ uptake continues through the night (phase I) … while malic acid supplies CO₂ to RuBisCO behind closed stomata. |
| Water (last) | … CAM plants gain 4–10 mmol CO₂ per mol water, C₃ plants 0.5–1.5. **All three tricks raise CO₂ around RuBisCO: …?** | … CAM plants fix 4–10 mmol CO₂ per mol water lost, C₃ plants 0.5–1.5. **C₂, C₄ and CAM photosynthesis all raise CO₂ at RuBisCO: what happens to crops when the air itself holds more CO₂?** |

**Layout:** column 537 px (before 719 px, shrunk 2 steps); widest eq 463/483 px. Balanced.

---

## C14 · Rising CO₂ (`cr14.ts`)

| Row | Before | After |
|---|---|---|
| Title | Rising CO₂ | same |
| Lead | Higher CO₂ suppresses RuBisCO’s oxygenation, so it raises the yield of C₃ crops; C₄ crops are already CO₂-saturated. | More CO₂ raises carboxylation and lowers oxygenation at RuBisCO, so C₃ crops yield more. |
| P1 claim | C₃ crops. | same |
| P1 text | Free-air CO₂ enrichment (FACE), +200 ppm: yield ≈ +18 % \| With low nitrogen or 2 °C warming: ≈ +10 % | Measured by free-air CO₂ enrichment (FACE) in open fields |
| P1 eq | — | +200 ppm CO₂: yield ≈ +18 % |
| P2 claim | C₄ crops. | same |
| P2 text | No yield gain, except in drought \| Narrower stomata save soil water | RuBisCO is already CO₂-saturated: no yield gain, except in drought |
| P3 claim | Grain quality. | same |
| P3 text | C₃ grains and legume seeds: less zinc and iron \| Wheat and rice grain: less protein | Wheat grain: less zinc, iron and protein |
| P3 eq | — | ≈ 550 ppm: zinc −9 %, iron −5 %, protein −6 % |

- **Why:**
  - The old lead gave half the cause (Leakey et al. 2009: both carboxylation and oxygenation change).
  - The C₄ reason moves from the lead to P2, where it explains "no gain".
- **Cut:**
  - "low N or 2 °C warming ≈ +10 %": a secondary percentage. It is not in the captions either; keep it out.
  - Legumes and rice: second examples.
  - The drought mechanism: secondary.
- **Numbers checked:**
  - +18 % (Ainsworth & Long 2021).
  - Wheat at 546–586 ppm: Zn −9.3 %, Fe −5.1 %, protein −6.3 % (Myers et al. 2014).

**Captions, cr14**

| Beat | Before | After |
|---|---|---|
| Open field | … C₃ crops +18 % at +200 ppm, C₄ crops nothing, except in drought. | … C₃ crops +18 % at +200 ppm, C₄ crops no gain, except in drought. |
| Inside the leaf | In a C₃ leaf, more CO₂ at RuBisCO speeds carboxylation and suppresses oxygenation: … maize gains nothing. | In a C₃ leaf, more CO₂ at RuBisCO raises carboxylation and suppresses oxygenation: … maize photosynthesis does not rise. |

**Layout:** column 594 px (before 660 px, shrunk); widest eq 441/483 px. Balanced.

---

## C15 · From leaf to loaf → retitled (`cr15.ts`)

| Row | Before | After |
|---|---|---|
| Title | From leaf to loaf | From leaf to yield |
| Lead | Grain yield is the sunlight a crop intercepts, times the efficiency of converting it into biomass, times the share of biomass in the grain. | Grain yield is the incident sunlight times interception, conversion efficiency and harvest index. |
| P1 claim | Interception and harvest index. | same |
| P1 text | Soybean: ≈ 90 % of the light intercepted, ≈ 60 % of the biomass in the seed \| Breeding has brought both close to their limits | Breeding has brought both close to their limits |
| P1 eq | — | Soybean: interception ≈ 0.9 · harvest index ≈ 0.6 |
| P2 claim | Conversion efficiency. | same |
| P2 text | Theoretical maximum: 4.6 % of sunlight in C₃, 6 % in C₄ crops \| A photorespiratory bypass raised tobacco biomass by 11–24 % in field trials | Photorespiration lowers its maximum in C₃ crops |
| P2 eq | — | Maximum: C₃ 4.6 % · C₄ 6.0 % of sunlight |
| P3 claim | Grain filling. | same |
| P3 text | Sucrose from the leaves and the ear moves in the phloem to the grain \| The endosperm stores it as starch | Phloem sucrose is stored as starch in the endosperm |

- **Why:**
  - "loaf" is wordplay; the brief names the slide "From leaf to yield".
  - Interception and harvest index are fractions, as in Zhu, Long & Ort 2010 (εi 0.89, εp 0.60).
- **Cut:**
  - The bypass: its range is disputed (South 2019 corrected: 19–37 %; Cavanagh 2022: +11 %). It stays in the cr15 beat "Engineering the link". South 2019 and Cavanagh 2022 can leave the slide's refs.
  - "and the ear": a second source.
- **Mixed crops:** P1's numbers are for soybean, but P3's endosperm is a cereal's. Either take P1's values for wheat from a checked source, or write "In cereals, …" in P3.

**Captions, cr15**

| Beat | Before | After |
|---|---|---|
| The ceiling → tag "Theoretical maximum" | same text | same |
| What breeding raised | … Both are near their limits; conversion efficiency is the link left. | … Both are near their limits; conversion efficiency is the factor still well below its maximum. |
| Engineering the link → tag "Photorespiratory bypass" | same text | same |
| Leaf to loaf → tag "Grain filling" | … **Which link of the chain would you improve?** | … **Which of these factors would you improve, and how?** |

**Layout:** column ≈ 594 px (before 727 px, shrunk 2 steps); widest eq 453/483 px. Balanced.

---

## C9 · Measuring leaf gas exchange (optional, `cp09.ts`)

| Row | Before | After |
|---|---|---|
| Title | Measuring leaf gas exchange | same |
| Lead | CO₂ and water vapour absorb infrared light, so an infrared gas analyser measures the CO₂ a leaf takes up and the water vapour it loses. | Infrared gas analysers measure a leaf’s CO₂ uptake and water loss. |
| P1 claim | Infrared gas analyser (IRGA). | same |
| P1 text | CO₂ and H₂O each absorb their own infrared wavelengths; N₂ and O₂ do not \| The light absorbed gives each gas’s concentration | Infrared absorbed at each gas’s own wavelength gives its concentration |
| P2 claim | Leaf chamber. | same |
| P2 text | Air is analysed before and after it flows over the leaf \| CO₂ drop: net CO₂ uptake (*A*) \| H₂O rise: transpiration (*E*) | Air is analysed before and after the leaf |
| P2 eq | — | CO₂ drop: net CO₂ uptake, *A* \| H₂O rise: transpiration, *E* |
| P3 claim | Stomatal conductance and *C*ᵢ. | same |
| P3 text | *g*s: from *E* and the water-vapour difference between leaf and air \| *C*ᵢ, the CO₂ in the leaf air spaces: from *A* and *g*s | *g*s from *E* and the leaf-to-air H₂O difference; *C*ᵢ from *A* and *g*s |

- **Cut:**
  - "N₂ and O₂ do not": secondary.
  - The definition of *C*ᵢ: it is on C8 now.

**Captions, cp9**

| Beat | Before | After |
|---|---|---|
| Calculated (cp9 A, B, D) | … *C*ᵢ ≈ 300 µmol mol⁻¹. | … *C*ᵢ ≈ 300 ppm. |
| Calculated (cp9 C) | … *C*ᵢ ≈ 300 µmol mol⁻¹, against 420 in the outside air. | … *C*ᵢ ≈ 300 ppm, against 427 ppm in the outside air. |

**Layout:** column 554 px (before 818 px, shrunk 2 steps). Light.

---

## C10 · CO₂ diffusion pathway (optional, `cp10.ts`)

| Row | Before | After |
|---|---|---|
| Title | CO₂ diffusion pathway | same |
| Lead | CO₂ diffuses from the air to RuBisCO through three conductances in series; across each, CO₂ uptake = conductance × concentration drop. | CO₂ diffuses from the air to RuBisCO through 3 conductances in series. |
| P1 claim | Boundary-layer conductance (*g*b). | same |
| P1 text | Still air over the leaf surface: *C*a → *C*s \| Higher in wind and on small leaves | Still air at the leaf surface; wind raises it |
| P1 eq | — | *A* = *g*b (*C*a − *C*s) |
| P2 claim | Stomatal conductance (*g*s). | same |
| P2 text | Guard cells set the pore width: *C*s → *C*ᵢ \| Water vapour leaves through the same pores: 150 to over 500 H₂O per CO₂ taken up | Guard cells set the pore width; water vapour leaves the same way |
| P2 eq | — | *A* = *g*s (*C*s − *C*ᵢ) |
| P3 claim | Mesophyll conductance (*g*m). | same |
| P3 text | Cell wall, membranes and stroma: *C*ᵢ → *C*c \| CO₂ diffuses ≈ 10,000 times slower in water than in air | Cell wall, membranes and stroma: the liquid phase |
| P3 eq | — | *A* = *g*m (*C*ᵢ − *C*c) |

- **Why:** the lead's Fick's law becomes 1 equation per conductance. This replaces the arrows *C*a → *C*s etc.
- **Cut:**
  - "small leaves": a second factor.
  - "150 to > 500 H₂O per CO₂" and "≈ 10,000 × slower": secondary. Both stay in the cp10 beats "Water out" and "Mesophyll".

**Captions, cp10**

| Beat | Before | After |
|---|---|---|
| 1900 | … half as fast as an equal area of caustic soda. | … half as fast as an equal area of sodium hydroxide solution. |
| Mesophyll, Mesophyll today, cp10 C and D | … *C*ᵢ ≈ 300 to *C*c ≈ 200 µmol mol⁻¹; Air spaces: *C*ᵢ ≈ 300 µmol mol⁻¹ | ppm in each |
| Stomata close (last) | … but *C*ᵢ and *C*c fall. **How can a leaf keep CO₂ high at RuBisCO, first by recapturing …?** | … but *C*ᵢ and *C*c fall, and RuBisCO oxygenates more. (C10 is now the last slide, so it ends without a question.) |

**Layout:** column 624 px (before 684 px, shrunk); widest eq 150/483 px. Balanced.

---

## Cross-slide references in figures (the order changed)

**C15, old variants a–j (drawn by `figs/c13.ts`, still listed on C15):**
- These figures cite the old slide numbers of both lectures.
- They also say "triose-P".
- The new variants v1–v9 (`cr15.ts`) cite no slide numbers.

| Variant | Line | Stale reference | Current slide |
|---|---|---|---|
| a Annotated equation | 201 (label), 203–212 | water "8", light "5–6", oxygen "8", ATP + NADPH "9–10"; CO₂ "slide C2"; sugar "slide C4" | water 7, light 4b–6, O₂ 7, ATP + NADPH 9–10; CO₂ C2, C1; sugar C4 |
| a | 212, 216, 217 | "triose-P is exported", step "triose-P" "slide C4", step "sucrose" "slide C4b" | triose phosphate; C4; C4 (C4b no longer exists) |
| c Six steps | 264, 267, 271, 273 | "slide C2", "slide C4b" (×3) | C2 or C1; C4 |
| f Course map | 334, 336, 343 (label) | lecture 2 drawn as C1–C13 with C4b; lecture 1 drawn as 1–15; label "light (2–6) … whole leaf (15)" and "ATP and NADPH spent (C1), CO₂ fixed (C2–C3), sugar (C4–C4b)…" | Redraw it from `ORDER` in `plates.ts`, or retire it |
| i Zoom into bread | 437, 438 | "from triose-P", "slides C4, C4b", "slide C2" | triose phosphate; C4; C2 |
| j Six answers | 448–453, 459 (label) | "5–6", "7–8", "8", "9–10"; "3 CO₂ → 1 triose-P" "slides C2–C4"; "slides C4b, C13" | 4b–6, 7, 7, 9–10; triose phosphate, C1–C3 (with C2); C4, C15 (old C13 is now CAM) |

**Animations that return to a figure the slide no longer shows:**
- `anim/cb1-common.ts:56` stages C1's figure v1, and `anim/cb3-common.ts:28` stages C3's figure v3.
- C1 and C3 now list only the cell figures (m1, m2), so the animation's "back to the slide" lands on a figure the slide does not show.

**Leftover "PGA" in live figures** (not in the slide text):
- C6's pick a, the thesis scheme: `figs/c5.ts:86`, "PGA + 2-PG" → "3-PGA + 2-phosphoglycolate".
- The live rf6 animation: `anim/rf6-common.ts:124` (chip "PGA") and `:141` ("back as PGA") → "3-PGA".
