# Lecture 2 text drafts in the new order (28 Oct 2026). Before → after; nothing is applied

**Scope**
- **Texts that show:** each slide shows its own module's `PLATE`. `text-c10.ts` is imported in `plates.ts` (`text2`) but never used, so it overrides nothing.
- **Not drafted here:** C0 (being finished), C5a–C5c (another agent), C11a (another agent).
- **Units used in the after-texts:** they follow the recommendations in "Decisions for the lecturer": ppm for CO₂, and today's air 427 ppm. If the lecturer picks otherwise, only the eq lines change.
- **Name used:** "3-PGA" everywhere, as on C1–C4 and the new cell figures (`cell-schema.ts`). C5, C6 and their captions still say "PGA".
- **Eq lines:** `|` inside a cell separates lines (`<br>` in the module).

---

## Chunk: the Rubisco story (C2 → C5 → C5a–C5c)

**Lead page (chunk opener):**

| Row | Before | After |
|---|---|---|
| Hook | none (`LEADS` has no lecture-2 page; C0 ends "What is Rubisco?") | "Why do farmers spread so much nitrogen fertiliser on a wheat field?" (`hooks/C1-cbb-cycle.json` d). C2 answers it: slow → abundant → ≈ 20 % of leaf N. |

### C2 · Rubisco

| Row | Before | After |
|---|---|---|
| Title | Rubisco | same |
| Lead | Rubisco, the enzyme that fixes CO₂, works slowly, so leaves hold large amounts of it. | same |
| P1 claim | First product: 3-PGA. | same |
| P1 text | ¹⁴CO₂ fed to algae for fractions of a second labels 3-PGA first · A three-carbon product: hence "C₃ photosynthesis" | ¹⁴CO₂ fed to algae for fractions of a second labels 3-phosphoglycerate (3-PGA) first |
| P1 eq | — | 3-PGA: 3 C, hence "C₃ photosynthesis" |
| P2 claim | Turnover number. | same |
| P2 text | *k*cat ≈ 3 CO₂ per second per active site, at 25 °C | CO₂ fixed per second by each active site, with CO₂ and RuBP in excess |
| P2 eq | — | Rubisco: *k*cat ≈ 3 s⁻¹ per active site (25 °C) \| Typical enzyme of central metabolism: *k*cat ≈ 80 s⁻¹ |
| P3 claim | Abundance. | same |
| P3 text | ≈ 20 % of the nitrogen of a C₃ leaf · ≈ 40 % of its soluble protein | Rubisco holds a large share of a C₃ leaf's nitrogen |
| P3 eq | — | ≈ 20 % of leaf nitrogen |
| Refs | Calvin 1961 · Bar-On & Milo 2019 · Evans & Clarke 2019 · Goodsell PDB-101 | + Flamholz et al. 2019 (the 80 s⁻¹ comparison); the rest same |

**Notes on C2**
- **"3-phosphoglycerate" is written out here** because C2 is now the first slide to name 3-PGA. C1 used to do that.
- **The reaction stays on C5:** C2 does not write it, because C5 now follows directly.
- **"≈ 40 % of soluble protein" is dropped:**
  - the sources differ: Evans & Clarke 2019 give ≈ 40 %; Flamholz et al. 2019 give "typically 20–30 %";
  - the nitrogen share is the number the hook needs.
- **"Most abundant protein on Earth" stays out:** Bar-On & Milo 2019 write that this "is not clear", even with their 0.7 Gt.

**Animation captions, cb2:**

| Beat | Before | After |
|---|---|---|
| Active sites | Rubisco has 8 active sites. Each fixes about 3 CO₂ per second, at 25 °C. | same |
| In bulk | So a C₃ leaf holds Rubisco in bulk: about 20 % of its nitrogen, about 40 % of its soluble protein. | So a C₃ leaf holds Rubisco in bulk: about 20 % of its nitrogen. |
| On land | 2019: Bar-On and Milo estimated the Rubisco in all land plants at about 0.7 billion tonnes. | same (checked: terrestrial ≈ 0.7 Gt = 7 × 10¹⁴ g) |
| Last beat (tag) | Back to the cycle | CO₂ and O₂ |
| Last beat (say) | Rubisco's product, 3-PGA, is an acid. **What turns it into sugar, and what does that cost?** | Rubisco adds CO₂ to RuBP. **But air holds 500 times more O₂ than CO₂: does Rubisco tell them apart?** (C5 is next; the old question belonged to C3.) |

### C5 · Rubisco: carboxylation and oxygenation

| Row | Before | After |
|---|---|---|
| Title | Rubisco: carboxylation and oxygenation | same |
| Lead | Rubisco's active site also binds O₂, so RuBP is either carboxylated or oxygenated. | same |
| P1 claim | Carboxylation and oxygenation. | same |
| P1 text | RuBP + CO₂ → 2 PGA · RuBP + O₂ → PGA + 2-phosphoglycolate | Rubisco adds CO₂ or O₂ to ribulose 1,5-bisphosphate (RuBP) |
| P1 eq | — | Carboxylation: RuBP (5 C) + CO₂ (1 C) → 2 3-PGA (2 × 3 C) \| Oxygenation: RuBP (5 C) + O₂ → 3-PGA (3 C) + 2-phosphoglycolate (2 C) |
| P2 claim | Substrate competition. | same |
| P2 text | CO₂ and O₂ compete for the same active site · In air at 25 °C: ≈ 1 oxygenation per 3 carboxylations | CO₂ and O₂ compete for the same active site \| The less CO₂ in the chloroplast, the more oxygenations |
| P2 eq | — | Leaf at 25 °C, CO₂ in the chloroplast ≈ 200 ppm: \| ≈ 2 oxygenations per 5 carboxylations |
| P3 | **Temperature.** Warmer leaves oxygenate more, relative to carboxylation · Rubisco's CO₂/O₂ specificity falls; CO₂ solubility falls more than O₂ solubility | removed: it now belongs to C5b |
| Refs | Bowes, Ogren & Hageman 1971 · Flamholz et al. 2019 · Jordan & Ogren 1984 | Bowes, Ogren & Hageman 1971 · Flamholz et al. 2019 · Busch et al. 2024 (Γ* and C꜀ used in the ratio). Jordan & Ogren 1984 moves to C5b. |

**Notes on C5**
- **The ratio:**
  - "≈ 1 per 3" is Flamholz's spinach enzyme "in ambient air": R꜀ ≈ 1.2 s⁻¹ and Rₒ ≈ 0.4 s⁻¹, in water at equilibrium with 0.04 % CO₂ and 21 % O₂. That is not CO₂ in a leaf.
  - In a leaf, vₒ/v꜀ = 2Γ*/C꜀. With the deck's own values (Γ* = 40 ppm, as in rf8; C꜀ ≈ 200 ppm, as in C10), that gives 2 × 40 / 200 = 0.4, so ≈ 2 per 5.
  - See decision 2.
- **The cell figure m1 is per reaction on C5,** so the eq states its carbon counts per reaction, as the figure does.
- **The rf5 tally (3 : 1) must become 5 : 2.** That is a build change, not a caption.
- **"Calvin–Benson–Bassham cycle" no longer appears on C2 or C5:** the cycle is named first on C1, which now comes after C5c.

**Animation captions, rf5 (all stagings):**

| Beat | Before | After |
|---|---|---|
| Carboxylation | Rubisco adds CO₂ to RuBP, giving two PGA, which the Calvin–Benson–Bassham cycle turns into sugar. | Rubisco adds CO₂ to RuBP, giving 2 molecules of 3-PGA, which the chloroplast turns into sugar. |
| Oxygenation | O₂ binds at the same active site of Rubisco; oxygenation of RuBP gives one PGA and one 2-phosphoglycolate. | O₂ binds at the same active site of Rubisco; oxygenation of RuBP gives 3-PGA and 2-phosphoglycolate, 1 molecule of each. |
| 1966 | same | same |
| Temperature (rf5 a, b, c, d) | In warmer leaves Rubisco tells CO₂ from O₂ less well … | removed: C5b tells it |
| Competition (rf5-b) | CO₂ binds at the same site, giving two PGA. CO₂ and O₂ compete for it: the more CO₂, the fewer oxygenations per carboxylation. | CO₂ binds at the same site, giving 2 molecules of 3-PGA. CO₂ and O₂ compete for it: the more CO₂, the fewer oxygenations per carboxylation. |
| 1971 (rf5-b) | … oxygenation of RuBP gives one PGA and one 2-phosphoglycolate. | … oxygenation of RuBP gives 3-PGA and 2-phosphoglycolate. |
| Competition (rf5-c) | In air at 25 °C, CO₂ and O₂ compete for this active site: about one oxygenation per three carboxylations. | In a leaf at 25 °C, with ≈ 200 ppm CO₂ in the chloroplast, CO₂ and O₂ compete for this active site: about 2 oxygenations per 5 carboxylations. |
| Staging rf5-d "Hot leaves" | the hot leaf first (Sage 2012 model) | retire it, or hand it to C5b: its whole subject is warming |
| Last beat (tag) | 2-phosphoglycolate | Why O₂? |
| Last beat (say) | The Calvin–Benson–Bassham cycle cannot use 2-phosphoglycolate. **What does the leaf do with it?** | Oxygenation makes 2-phosphoglycolate instead of a second 3-PGA. **Why has evolution not taught Rubisco to ignore O₂?** (C5a is next. The 2-phosphoglycolate question moves to the end of cb4, before C6.) |

---

## Chunk: the dark side in full (C1 → C3 → C4 → C6 → C7 → C8)

**Lead page (chunk opener):**

| Row | Before | After |
|---|---|---|
| Hook | none | "A tree weighs tonnes. Where does all that wood come from?" (`hooks/C1-cbb-cycle.json` a) |

**New adjacency: C1 now sits directly before C3.** Both list "Reduction" and "Regeneration". In the drafts below:
- C1 keeps the carbon (counts in C, per 3 CO₂);
- C3 keeps the energy (ATP and NADPH, per 3 CO₂) and is retitled.

### C1 · Calvin–Benson–Bassham cycle

| Row | Before | After |
|---|---|---|
| Title | Calvin–Benson–Bassham cycle | same |
| Lead | In the stroma, the Calvin–Benson–Bassham cycle fixes CO₂ into triose phosphate, using ATP and NADPH from the light reactions. | same |
| P1 claim | Carboxylation. | same |
| P1 text | Rubisco adds CO₂ to ribulose 1,5-bisphosphate (RuBP, 5 C) · The product splits into two 3-phosphoglycerate (3-PGA, 3 C) | Rubisco adds CO₂ to RuBP; the product splits into 3-PGA |
| P1 eq | — | Per 3 CO₂ fixed: 3 RuBP (3 × 5 C = 15 C) + 3 CO₂ (3 × 1 C = 3 C) → 6 3-PGA (6 × 3 C = 18 C) |
| P2 claim | Reduction. | same |
| P2 text | 3-PGA is reduced to triose phosphate (3 C) | 3-PGA is reduced to triose phosphate |
| P2 eq | — | 6 3-PGA → 6 triose phosphate (6 × 3 C = 18 C) |
| P3 claim | Regeneration. | same |
| P3 text | Per 3 CO₂ fixed, 6 triose phosphates are made · 5 rebuild 3 RuBP; 1 leaves the cycle | Most triose phosphate rebuilds RuBP; the rest leaves the cycle as the gain |
| P3 eq | — | 5 triose phosphate (5 × 3 C = 15 C) → 3 RuBP (3 × 5 C = 15 C) \| 1 triose phosphate (3 C) leaves the cycle |
| Refs | Bassham et al. 1954 · Calvin 1961 · Sharkey 2019 · Michelet et al. 2013 | same |

The unit is stated once, in P1's eq, as on the m1 strip ("numbers per 3 CO₂ fixed"). The full names of RuBP and 3-PGA now come earlier: on C5 and C2.

**Animation captions, cb1:**

| Beat | Before | After |
|---|---|---|
| Carbon-14, Shorter feeds | ¹⁴C feeds, 3-PGA first | same. In the new order they retell C2 point 1, 5 slides later, so not adjacent. Either keep them as the cycle's discovery story or start cb1 at "Spots into a cycle". |
| Per 3 CO₂ (last) | Per 3 CO₂ fixed, the cycle makes 6 triose phosphates: 5 rebuild 3 RuBP, 1 is the gain. **Rubisco adds the CO₂: how fast does it work?** | Per 3 CO₂ fixed, the cycle makes 6 triose phosphates: 5 rebuild 3 RuBP, 1 is the gain. **What does it cost to turn 3-PGA into sugar and rebuild RuBP?** (C3 is next; C2 is already behind.) |

### C3 · Reduction and regeneration → retitled

| Row | Before | After |
|---|---|---|
| Title | Reduction and regeneration | Energy cost of the cycle |
| Lead | Reducing 3-PGA and regenerating RuBP use the ATP and NADPH of the light reactions: 3 ATP and 2 NADPH per CO₂ fixed. | Reducing 3-PGA and regenerating RuBP spend the ATP and NADPH of the light reactions. |
| P1 claim | Reduction. | ATP and NADPH for reduction. |
| P1 text | Per CO₂: 2 ATP + 2 NADPH turn two 3-PGA into two triose phosphates | Each 3-PGA is phosphorylated by ATP, then reduced by NADPH |
| P1 eq | — | Per 3 CO₂: 6 3-PGA take 6 ATP + 6 NADPH |
| P2 claim | Regeneration. | ATP for regeneration. |
| P2 text | Per CO₂: 1 ATP, in the last step to RuBP | The last step, ribulose 5-phosphate → RuBP, takes ATP |
| P2 eq | — | Per 3 CO₂: 3 ATP (1 per RuBP) \| Cycle total per 3 CO₂ (= per triose phosphate exported): 9 ATP + 6 NADPH, ATP : NADPH = 3 : 2 |
| P3 claim | Light–dark transient. | same |
| P3 text | Light off: 3-PGA accumulates, RuBP falls to near zero within a minute (*Chlorella*) · Without RuBP, Rubisco stops fixing CO₂ | Light off: 3-PGA accumulates and RuBP falls to near zero (*Chlorella*) \| Without RuBP, Rubisco stops fixing CO₂ |
| P3 eq | — | RuBP near zero within ≈ 1 min |
| Refs | Calvin 1961 · Sharkey 2019 | same |

**Notes on C3**
- **The unit was per CO₂;** the m1 strip on C3 counts per 3 CO₂ (6 NADPH, 6 + 3 ATP), so the text now uses the strip's unit.
- **The 3 : 2 ratio** ties back to 10b's ATP gap.
- **Alternative title,** if "Energy cost" reads too loose: "ATP and NADPH per CO₂ fixed".

**Animation captions, cb3:**

| Beat | Before | After |
|---|---|---|
| The fuel | Per 3 CO₂, reduction takes 6 ATP and 6 NADPH, regeneration 3 ATP: 3 ATP and 2 NADPH per CO₂. | Per 3 CO₂, reduction takes 6 ATP and 6 NADPH, regeneration 3 ATP: 9 ATP and 6 NADPH in total. |
| Light off | … within a minute, 3-PGA piled up and RuBP fell to near zero. | … within 1 minute, 3-PGA piled up and RuBP fell to near zero. |
| One in six (tag) | One in six | 1 in 6 |
| Why, last beat | same | same (the last beat still leads into C4) |

### C4 · Sucrose and starch

| Row | Before | After |
|---|---|---|
| Title, lead, P1, P2 | as live | same |
| P3 claim | Starch degradation at night. | same |
| P3 text | Near-constant rate: ≈ 95 % of the starch is used by dawn (*Arabidopsis*) · After an early dusk, breakdown slows, so starch still lasts until dawn | Near-constant rate, timed to run out at dawn (*Arabidopsis*) \| After an early dusk, breakdown slows, so starch still lasts until dawn |
| P3 eq | — | ≈ 95 % of the starch used by dawn |
| Refs | Graf et al. 2010 · Smith & Stitt 2007 · Streb & Zeeman 2012 · Sharkey 2024 | same |

**Animation captions, cb4:**

| Beat | Before | After |
|---|---|---|
| Out or in, Day and night, Early dusk | as live | same |
| Last beat (tag) | Rubisco and O₂ | 2-phosphoglycolate |
| Last beat (say) | All this sugar starts with Rubisco adding CO₂ to RuBP. **But Rubisco can also take O₂ instead of CO₂: what happens then?** | All this sugar starts with Rubisco adding CO₂ to RuBP. But each oxygenation makes 2-phosphoglycolate, which the cycle cannot use. **What does the leaf do with it?** (C6 is next; O₂ was introduced on C5.) |

### C6 · Photorespiration

| Row | Before | After |
|---|---|---|
| Title | Photorespiration | same |
| Lead | The cycle cannot use 2-phosphoglycolate, so photorespiration recycles it into PGA via peroxisome and mitochondrion. | The cycle cannot use 2-phosphoglycolate, so photorespiration recycles it into 3-PGA through peroxisome and mitochondrion. |
| P1 claim | Pathway. | same |
| P1 text | Chloroplast → peroxisome → mitochondrion → peroxisome → chloroplast · In the mitochondrion: 2 glycine → serine + CO₂ + NH₃ | Chloroplast → peroxisome → mitochondrion → peroxisome → chloroplast |
| P1 eq | — | Mitochondrion: 2 glycine (2 × 2 C) → serine (3 C) + CO₂ (1 C) + NH₃ |
| P2 claim | Cost. | same |
| P2 text | Of 4 C in two 2-phosphoglycolate: 3 return as PGA, 1 is lost as CO₂ · Refixing NH₃ and returning glycerate cost ATP and reductant | Part of the carbon is lost as CO₂ \| Refixing NH₃ and returning glycerate cost ATP and reduced ferredoxin |
| P2 eq | — | Per 2 O₂: 2 2-phosphoglycolate (2 × 2 C = 4 C) → 3-PGA (3 C) + CO₂ (1 C lost) |
| P3 claim | Essential pathway. | same |
| P3 text | *Arabidopsis* mutants that lack it grow in 1 % CO₂ but not in air | *Arabidopsis* mutants that lack it grow in high CO₂ but not in air |
| P3 eq | — | Grows: 1 % CO₂ (10,000 ppm) · fails: air (427 ppm) |
| Refs | Peterhänsel et al. 2010 · Somerville & Ogren 1979 · Frederick & Newcomb 1969 | same |

**Notes on C6**
- **The audit's "3.5 ATP + 2 NADPH per oxygenation" is left out:** it is a second unit on a per-2-O₂ slide.
- **If wanted, per 2 O₂:** 7 ATP + 4 NADPH. This is FvCB accounting with RuBP regeneration included; 1 of the 4 NADPH is reduced ferredoxin.
- **The loop's own cost per 2 O₂:** 2 ATP + 2 reduced ferredoxin (glycerate kinase; GS and Fd-GOGAT).

**Animation captions, rf6:**

| Beat | Before | After |
|---|---|---|
| Mitochondrion | In the mitochondrion, two glycine make one serine; one carbon leaves as CO₂, and NH₃ is released. | In the mitochondrion, 2 glycine make 1 serine; 1 carbon leaves as CO₂, and NH₃ is released. |
| Back to PGA (tag, say) | Back to PGA · … the chloroplast makes PGA from it with ATP … | Back to 3-PGA · … the chloroplast makes 3-PGA from it with ATP … |
| 1979 | … grew in 1 % CO₂ but turned pale in air … | … grew in 1 % CO₂ (10,000 ppm) but turned pale in air … |
| The cost (rf6-d), ATP and reductant (last) | as live | same (the last beat still leads into C7) |

### C7 · Light-response curve

| Row | Before | After |
|---|---|---|
| Title, lead | as live | same |
| P1 claim | Quantum yield. | same |
| P1 text | In dim light, CO₂ uptake rises linearly with light · Slope = CO₂ fixed per photon absorbed | same |
| P1 eq | — | C₃ leaf in air, 30 °C: 0.052 mol CO₂ per mol absorbed photons |
| P2 | **Light compensation point.** Uptake = release by respiration and photorespiration · Below it, the leaf releases CO₂ | same |
| P3 | **Light saturation.** In bright light, uptake levels off at the leaf's capacity · Shade leaves saturate at lower light and lower uptake than sun leaves | same. The sun and shade numbers stay in the caption, so the slide keeps 1 unit. |
| Refs | Huang, Zhang & Hu 2014 · Ehleringer & Björkman 1977 · Busch et al. 2024 | same |

**Animation captions, rf7:**

| Beat | Before | After |
|---|---|---|
| More CO₂ (rf7-b, Gaastra) | … measured at four CO₂ levels, from 0.017 to 0.15 %. … | … measured at 4 CO₂ levels, from 170 to ≈ 1500 ppm. … |
| All other beats | as live | same (the last beat still leads into C8) |

### C8 · FvCB model

| Row | Before | After |
|---|---|---|
| Title, lead | as live | same |
| P1 claim | Rubisco limit, *A*c. | same |
| P1 text | At low *C*ᵢ, uptake rises steeply with CO₂ · Set by the amount of active Rubisco (*V*cmax) | same |
| P1 eq | — | *C*ᵢ: CO₂ in the leaf air spaces; today ≈ 300 ppm |
| P2, P3 | as live | same |
| Refs | Farquhar, von Caemmerer & Berry 1980 · Sharkey 1985 · Busch et al. 2024 | same |

C9 defined *C*ᵢ; C9 now comes after C8, at the optional end. P1's eq defines it instead (decision 4).

**Animation captions, rf8:**

| Beat | Before | After |
|---|---|---|
| Today's air and the limits | as live (*C*ᵢ ≈ 300 ppm) | same |
| FvCB model (last) | … 1985: Sharkey added triose-phosphate use. **How do we measure a leaf's CO₂ uptake, and the CO₂ inside it?** | … 1985: Sharkey added triose-phosphate use. **Photorespiration releases CO₂ in the light: does the leaf just lose it?** (C11 is next; C9 has moved to the end.) |

---

## Chunk: escaping photorespiration (C11 → C11a → C12 → C13)

**Lead page (chunk opener):**

| Row | Before | After |
|---|---|---|
| Hook | none | "Do leaves breathe out CO₂ even in sunlight, and do they just lose it?" (`hooks/C4-co2-concentration.json` a). rf8's last line leads into it. In the new chunks, hook c of `C2-rubisco-fvcb.json` ("Do plants breathe out CO₂ in sunlight too?") opens nothing, so the duplicate hook flagged in the morning review is resolved. |

### C11 · Refixation of photorespired CO₂ (trim: points 2 and 3 now repeat C11a)

| Row | Before | After |
|---|---|---|
| Title | Refixation of photorespired CO₂ | same |
| Lead | Photorespired CO₂ leaves the mitochondria; chloroplasts lying in its way to the air spaces refix part of it. | same |
| P1 claim | Refixation in C₃ leaves. | Chloroplast cover. |
| P1 text | Rice, wheat: chloroplasts cover 92–99 % of the wall facing the air spaces; mitochondria lie behind them · 26–29 % of the photorespired CO₂ is refixed; net CO₂ uptake +9–11 % | In rice and wheat, chloroplasts line the cell wall facing the air spaces; mitochondria lie behind them |
| P1 eq | — | Wall covered: wheat 92 % · rice 99 % |
| P2 claim | C₂ photosynthesis. | Refixation. |
| P2 text | Glycine moves from mesophyll to bundle-sheath cells · There, glycine decarboxylase releases CO₂ next to Rubisco | CO₂ released behind a chloroplast crosses its stroma, where Rubisco refixes part of it |
| P2 eq | — | Refixed: wheat 26 % · rice 29 % of photorespired CO₂ \| Net CO₂ uptake: wheat +9 % · rice +11 % (350 ppm, 30 °C) |
| P3 | **Path to C₄.** C₃ → C₂ → C₄: living *Flaveria* species show each stage | removed (C11a, next) |
| Refs | Busch et al. 2013 · Sage & Sage 2009 · Busch 2020 · Sage, Khoshravesh & Sage 2014 · Khoshravesh et al. 2016 · Sage 2016 | Busch et al. 2013 · Sage & Sage 2009 · Busch 2020. The last 3 now belong to C11a. |

**Animation captions, cc11:**

| Beat | Before | After |
|---|---|---|
| Where CO₂ is released, Refixation, How it was measured | as live | same |
| C₂ photosynthesis | C₂ plants go further: … | removed (C11a) |
| Toward C₄ (last) | Living *Flaveria* species show each step from C₃ through C₂ to C₄. **What if a plant pumped CO₂ to Rubisco instead …?** | new last beat, tag "Next to Rubisco": **Could a plant release its photorespired CO₂ right next to Rubisco?** (C11a is next) |
| Six C₃ species (cc11-d) | … rice ≈ 46, tobacco ≈ 51, Rubisco alone ≈ 57 µmol mol⁻¹. | … rice ≈ 46, tobacco ≈ 51, Rubisco alone ≈ 57 ppm. |
| cc11-b and cc11-d | reuse CC11[3] and CC11[4] | drop those 2 beats there too |

### C12 · C₄ photosynthesis

| Row | Before | After |
|---|---|---|
| Title, lead | as live | same |
| P1 claim | PEP carboxylase. | same |
| P1 text | In mesophyll cells it fixes HCO₃⁻ into a four-carbon acid · It does not react with O₂ | In mesophyll cells it fixes HCO₃⁻ into a C₄ acid \| It does not react with O₂ |
| P1 eq | — | PEP (3 C) + HCO₃⁻ (1 C) → C₄ acid (4 C) |
| P2 | **Kranz anatomy.** Bundle-sheath cells form a wreath around each vein · The C₄ acid moves there and releases CO₂ next to Rubisco | same |
| P3 claim | Costs and benefits. | same |
| P3 text | Regenerating PEP costs 2 ATP per CO₂ · It pays in hot, dry, bright conditions: maize, sugarcane, sorghum | Regenerating PEP costs extra ATP \| It pays in hot, dry, bright conditions: maize, sugarcane, sorghum |
| P3 eq | — | Per 3 CO₂: C₄ 15 ATP + 6 NADPH · C₃ 9 ATP + 6 NADPH |
| Refs | as live | same |

Per 3 CO₂ matches C1 and C3. The +6 ATP is 2 ATP per PEP, for the NADP-ME type: maize, sugarcane and sorghum are all of this type.

**Animation captions, cc12:**

| Beat | Before | After |
|---|---|---|
| Label in the acids | … After about one second, more than 93 % of the fixed ¹⁴C was in four-carbon acids … | … After about 1 s, more than 93 % of the fixed ¹⁴C was in 4-carbon acids … |
| The CO₂ pump | … ≈ 1500 µmol mol⁻¹ there, ≈ 100 in the mesophyll. | … ≈ 1500 ppm there, ≈ 100 ppm in the mesophyll. |
| The price | Regenerating PEP costs 2 ATP per CO₂. Below about 30 °C … | Regenerating PEP costs 6 extra ATP per 3 CO₂. Below ≈ 30 °C … (the last question stays) |
| A cool leaf, A hot leaf (cc12-d) | … per 1000 absorbed photons, … 69 CO₂, … 53. The pump costs 2 ATP per CO₂. · … only 42 CO₂ per 1000 photons, … still 53. | per decision 6: … 0.069 mol CO₂ per mol absorbed photons, … 0.053. The pump costs 6 extra ATP per 3 CO₂. · … only 0.042, … still 0.053. |

### C13 · Crassulacean acid metabolism (CAM)

| Row | Before | After |
|---|---|---|
| Title, lead, P1, P2 | as live | same |
| P3 claim | Water saving. | same |
| P3 text | Night air is cooler and more humid, so less water is lost per CO₂ · ≈ 7 % of vascular plant species, e.g. pineapple, agave, cacti | Night air is cooler and more humid, so less water is lost per CO₂ \| Pineapple, agave, cacti |
| P3 eq | — | H₂O lost per CO₂ fixed: CAM 100–250 · C₃ 670–2000 \| CAM: ≈ 7 % of vascular plant species |
| Refs | as live | same |

The water numbers are Borland 2009 Table 2 converted: 4–10 and 0.5–1.5 mmol CO₂ per mol H₂O. Basis: decision 3.

**Animation captions, cc13:**

| Beat | Before | After |
|---|---|---|
| Water (last) | … CAM plants gain 4–10 mmol CO₂ per mol water, C₃ plants 0.5–1.5. **All three tricks …** | … CAM plants lose 100–250 H₂O per CO₂ fixed, C₃ plants 670–2000. **All three tricks raise CO₂ around Rubisco: what happens to crops when the air itself holds more CO₂?** (same question; C14 is next) |
| Night, Day, The record, cc13 b–d | as live | same |

---

## Chunk: crops (C14 → C15)

**Lead page (chunk opener):**

| Row | Before | After |
|---|---|---|
| Hook | none | "Is more CO₂ in the air good for plants?" (`hooks/C5-crops.json` a). cc13's last line leads into it. |

### C14 · Rising CO₂

| Row | Before | After |
|---|---|---|
| Title | Rising CO₂ | same |
| Lead | Higher CO₂ suppresses Rubisco's oxygenation, so it raises the yield of C₃ crops; C₄ crops are already CO₂-saturated. | Higher CO₂ speeds Rubisco's carboxylation and suppresses its oxygenation, so it raises the yield of C₃ crops; C₄ crops are already CO₂-saturated. |
| P1 claim | C₃ crops. | same |
| P1 text | Free-air CO₂ enrichment (FACE), +200 ppm: yield ≈ +18 % · With low nitrogen or 2 °C warming: ≈ +10 % | Free-air CO₂ enrichment (FACE) raises CO₂ over open fields \| Low nitrogen or warming shrinks the gain |
| P1 eq | — | +200 ppm: yield ≈ +18 % \| with low N or ≈ 2 °C warming: ≈ +10 % |
| P2 | **C₄ crops.** No yield gain, except in drought · Narrower stomata save soil water | same |
| P3 claim | Grain quality. | same |
| P3 text | C₃ grains and legume seeds: less zinc and iron · Wheat and rice grain: less protein | same |
| P3 eq | — | Wheat at ≈ 550 ppm: zinc −9 %, iron −5 %, protein −6 % |
| Refs | as live | same |

The old lead gave only half the cause: Leakey et al. 2009 say more CO₂ at Rubisco both speeds carboxylation and suppresses oxygenation.

**Animation captions, cr14:** all beats the same. "316 ppm in 1959 to 427 ppm in 2025" is checked against the NOAA file today.

### C15 · From leaf to loaf

| Row | Before | After |
|---|---|---|
| Title, lead | as live | same |
| P1 claim | Interception and harvest index. | same |
| P1 text | Soybean: ≈ 90 % of the light intercepted, ≈ 60 % of the biomass in the seed · Breeding has brought both close to their limits | Breeding has brought both close to their limits |
| P1 eq | — | Soybean: ≈ 90 % of the light intercepted · ≈ 60 % of the biomass in the seed |
| P2 claim | Conversion efficiency. | same |
| P2 text | Theoretical maximum: 4.6 % of sunlight in C₃, 6 % in C₄ crops · A photorespiratory bypass raised tobacco biomass by 11–24 % in field trials | Photorespiration lowers the C₃ maximum \| A bypass of photorespiration raised tobacco biomass in the field |
| P2 eq | — | Maximum share of sunlight in biomass: C₃ 4.6 % · C₄ 6.0 % \| Tobacco with the bypass, field: biomass +19 to +37 % |
| P3 | **Grain filling.** Sucrose from the leaves and the ear moves in the phloem to the grain · The endosperm stores it as starch | same |
| Refs | Zhu, Long & Ort 2010 · South et al. 2019 · Cavanagh et al. 2022 · Sanchez-Bragado et al. 2014 · Chen et al. 2024 | Cavanagh et al. 2022 can go: its +11 % is no longer on the slide. The rest same. |

"11–24 %" combines 2 papers: Cavanagh 2022 (+11 %, ambient temperature) and South 2019 (+24 %, 2017). South's own corrected range is "between 19 and 37 %" (PMC7745124).

**Animation captions, cr15:** all beats the same. The 20 % (2016) and 24 % (2017) are South's pathway 3 + RNAi results, inside the 19–37 % range.

---

## Optional block at the end (C9, C10): numbers and units only

### C9 · Measuring leaf gas exchange

| Row | Before | After |
|---|---|---|
| Slide text | no numbers | same |

**Animation captions, cp9:**

| Beat | Before | After |
|---|---|---|
| Calculated (cp9 a, b, d) | … the CO₂ in the leaf air spaces, *C*ᵢ ≈ 300 µmol mol⁻¹. | … *C*ᵢ ≈ 300 ppm. |
| Calculated (cp9-c) | … *C*ᵢ ≈ 300 µmol mol⁻¹, against 420 in the outside air. | … *C*ᵢ ≈ 300 ppm, against 427 ppm in the outside air. |
| Question | **How much of it reaches Rubisco?** | same (C10 is still next) |

### C10 · CO₂ diffusion pathway

| Row | Before | After |
|---|---|---|
| Title, lead, P1 | as live | same |
| P2 text | Guard cells set the pore width: *C*s → *C*ᵢ · Water vapour leaves through the same pores: 150 to over 500 H₂O per CO₂ taken up | Guard cells set the pore width: *C*s → *C*ᵢ \| Water vapour leaves through the same pores |
| P2 eq | — | Leaf: 150 to > 500 H₂O lost per CO₂ taken up |
| P3 text | Cell wall, membranes and stroma: *C*ᵢ → *C*c · CO₂ diffuses ≈ 10,000 times slower in water than in air | Cell wall, membranes and stroma: *C*ᵢ → *C*c |
| P3 eq | — | CO₂ diffuses ≈ 10,000 × slower in water than in air |

**Animation captions, cp10:**

| Beat | Before | After |
|---|---|---|
| Mesophyll (cp10 a, c, d), Mesophyll today (cp10-b) | … from *C*ᵢ ≈ 300 to *C*c ≈ 200 µmol mol⁻¹. | … from *C*ᵢ ≈ 300 to *C*c ≈ 200 ppm. |
| Air spaces (cp10-c) | … *C*ᵢ ≈ 300 µmol mol⁻¹. | … *C*ᵢ ≈ 300 ppm. |
| Stomata close (last) | When the air is dry, the stomata close: less water is lost, but *C*ᵢ and *C*c fall. **How can a leaf keep CO₂ high at Rubisco, first by recapturing …?** | When the air is dry, the stomata close: less water is lost, but *C*ᵢ and *C*c fall, and Rubisco oxygenates more. (C10 is now the last slide, so it ends without a question.) |

---

## Decisions for the lecturer

| # | Decision | Recommendation | Evidence |
|---|---|---|---|
| 1 | CO₂ unit: ppm or µmol mol⁻¹ | ppm everywhere | C14, rf7 and rf8 already use ppm. The C9–C12 captions use µmol mol⁻¹, and C11a uses µbar (Ku 1991's unit). In dry air 1 ppm = 1 µmol mol⁻¹, so only the label changes. |
| 2 | Oxygenations per carboxylation, C5 | ≈ 2 per 5: leaf at 25 °C, C꜀ ≈ 200 ppm | vₒ/v꜀ = 2Γ*/C꜀ = 2 × 40/200 = 0.4, with the deck's own Γ* (rf8) and C꜀ (C10). Flamholz's 1 : 3 is the enzyme in water at equilibrium with air. |
| 3 | Water per CO₂: unit and basis (C10 vs C13) | "H₂O lost per CO₂", molecules, on both slides, each with its basis | C10: Verslues 2023 gives 150 to > 500 (leaf, stomatal transpiration). C13: Borland Table 2 gives C₃ 0.5–1.5 mmol mol⁻¹ = 670–2000 H₂O per CO₂, ≈ 4× higher, which fits a whole-plant, long-term basis. Table 2's basis could not be re-read (OUP 403). |
| 4 | C8 variable: *C*ᵢ or *C*c | *C*ᵢ, defined in C8's eq | rf8 and the lecturer's thesis Fig. 5 are A/*C*ᵢ curves. C9, which defined *C*ᵢ, has moved to the end. The dark-prep scratch moved rff08's axes to A/*C*c; undo that if *C*ᵢ stays. |
| 5 | Today's air CO₂: 420 or 427 ppm | 427 ppm (2025 annual mean) | NOAA Mauna Loa: 2024 424.61, 2025 427.35 ppm. 420 is Busch 2024's rounded reference. C14 already says 427; the cp9-c caption and C6's eq would follow. |
| 6 | Quantum yield form | mol CO₂ per mol absorbed photons (0.052) | This is the definition of the textbook term on C7's heading, and Ehleringer & Björkman's own unit. It changes only the cc12-d captions (69, 53 and 42 per 1000 photons become 0.069, 0.053 and 0.042). |

---

## Fact table (every number changed or kept in the drafts)

"Here" = re-read for this draft. Otherwise the read depth is the earlier chunk's, as recorded in its report or module header.

| Slide | Number | Kept / changed | Source | Read depth |
|---|---|---|---|---|
| C2 | *k*cat ≈ 3 s⁻¹ per active site, 25 °C, land plants | kept | Bar-On & Milo 2019, PNAS 116:4738 | full text, here (PMC6410859) |
| C2 | typical central-metabolism enzyme *k*cat ≈ 80 s⁻¹ | new | Flamholz et al. 2019, Biochemistry 58:3365 (citing Bar-Even 2011) | full text, here (PMC6686151) |
| C2 | ≈ 20 % of C₃ leaf N in Rubisco | kept | Evans & Clarke 2019, JXB 70:7 | full text by the cb chunk; not re-read (OUP) |
| C2 | ≈ 40 % of soluble protein | dropped | Evans & Clarke 2019 vs Flamholz 2019 ("typically 20–30 %") | Flamholz here; the sources disagree |
| C2 caption | 8 active sites (L₈S₈) | kept | Goodsell, PDB-101 MotM 11 | cb chunk |
| C2 caption | ≈ 0.7 Gt land Rubisco = 7 × 10¹⁴ g = 0.7 billion t | kept | Bar-On & Milo 2019 | full text, here |
| C2 caption | O₂ : CO₂ in air ≈ 500 : 1 | new | 20.95 % O₂ vs 427 ppm CO₂ (NOAA 2025): 209,500 / 427 ≈ 490 | arithmetic |
| C5 | ≈ 2 oxygenations per 5 carboxylations, 25 °C | changed from ≈ 1 per 3 | FvCB vₒ/v꜀ = 2Γ*/C꜀ (Farquhar et al. 1980); Γ* = 40 ppm (Busch 2024, as in `rf8-common.ts`); C꜀ ≈ 200 ppm (Busch 2024 Table 1, as in C10) | our arithmetic; Busch full text by the cp/rf chunks, not re-read here (the PDF download was refused under the no-bot-check rule) |
| C5 (old) | spinach R꜀ ≈ 1.2, Rₒ ≈ 0.4 s⁻¹ "in ambient air" (0.04 % CO₂, 21 % O₂) | explains the old 1 : 3 | Flamholz 2019 | full text, here |
| C5 | RuBP 5 C + CO₂ 1 C → 2 × 3 C; RuBP 5 C + O₂ → 3 C + 2 C | new eq | Bowes, Ogren & Hageman 1971; textbook stoichiometry | rf chunk |
| C1 | per 3 CO₂: 15 C + 3 C → 18 C; 5 × 3 C → 3 × 5 C; 1 × 3 C out | eq | Sharkey 2019; Bassham et al. 1954 | cb chunk (audit: checked) |
| C3 | per 3 CO₂: 6 ATP + 6 NADPH (reduction), 3 ATP (regeneration), 9 + 6 in total | changed basis (was per CO₂) | Sharkey 2019 Fig. 3 | cb chunk |
| C3 | RuBP near zero within ≈ 1 min after light off | kept | Calvin 1961, Fig. 15 (Bassham's data) | cb chunk, full scan |
| C4 | ≈ 95 % of starch used by dawn; early dusk at 8 h instead of 12 | kept | Graf et al. 2010, PNAS | cb chunk, full text |
| C6 | per 2 O₂: 4 C in, 3 C back, 1 C lost | kept | Peterhänsel et al. 2010 §2.1–2.2 | rf chunk, full text |
| C6 | mutants grow in 1 % CO₂ (= 10,000 ppm) | unit added | Somerville & Ogren 1979, via Peterhänsel 2010 | rf chunk |
| C6 (option) | 7 ATP + 4 NADPH per 2 O₂ (3.5 + 2 per oxygenation) | not used | FvCB accounting (von Caemmerer 2000) | textbook; not re-read |
| C6 caption | 29 % less CO₂ per photon in air than in 2 % O₂ | kept | Ehleringer & Björkman 1977: 0.052 vs 0.073; 1 − 0.052/0.073 = 0.29 | rf chunk, scan |
| C7 | 0.052 mol CO₂ per mol absorbed photons (C₃, air, 30 °C) | eq | Ehleringer & Björkman 1977 | rf chunk, scan |
| C7 caption | tobacco: ≈ 22 vs ≈ 13 µmol m⁻² s⁻¹ (21.8, 13.1) | kept | Huang, Zhang & Hu 2014 Table 1 | rf chunk, full text |
| C7 caption | Gaastra 0.017–0.148 % = 170 to ≈ 1500 ppm | unit | Gaastra 1959 Fig. 12A | rf chunk |
| C8 | *C*ᵢ ≈ 300 ppm today | kept | Busch et al. 2024 Table 1 ("indicative") | cp/rf chunks, full text |
| C11 | wall covered: wheat 92.5 %, rice 98.9 % | kept (as 92 %, 99 %) | Busch, Sage, Cousins & Sage 2013, PCE 36:200 | cc chunk, full text |
| C11 | refixed 26 % (wheat), 29 % (rice); net uptake +9 %, +11 %, at 350 ppm, 30 °C | kept | Busch et al. 2013 Table 1 | cc chunk, full text |
| C11 caption | ≈ 46, 51, 57 ppm | unit | Busch et al. 2013 Fig. 5a | cc chunk |
| C12 | PEP 3 C + HCO₃⁻ 1 C → C₄ acid 4 C | new eq | textbook | — |
| C12 | per 3 CO₂: C₄ 15 ATP + 6 NADPH, C₃ 9 + 6 (2 ATP per PEP, NADP-ME type) | changed basis (was per CO₂) | von Caemmerer 2021, JXB | cc chunk, full text |
| C12 caption | > 93 % of ¹⁴C in C₄ acids after ≈ 1 s | kept | Hatch & Slack 1966 | cc chunk: abstract + Fig. 2 scan |
| C12 caption | ≈ 1500 ppm in the bundle sheath, ≈ 100 ppm in the mesophyll | unit | Sage, Sage & Kocacinar 2012 Fig. 1 | cc chunk: figure only |
| C12 caption | 0.069 (14 °C) → 0.042 (38 °C) C₃; 0.053 C₄ | form (decision 6) | Ehleringer & Björkman 1977 | scan |
| C13 | CAM 4–10, C₃ 0.5–1.5 mmol CO₂ per mol H₂O = 100–250 and 670–2000 H₂O per CO₂ | unit | Borland et al. 2009, Table 2 | cc fact-check, full text; not re-read here (OUP 403) |
| C13 | ≈ 7 % of vascular plant species CAM | kept | Gilman et al. 2023 | cc chunk, full text |
| C14 | FACE +200 ppm: yield ≈ +18 %; low N or ≈ 2 °C: ≈ +10 % | kept | Ainsworth & Long 2021 | cr chunk: abstract + Fig. 2 |
| C14 | wheat at 546–586 ppm: Zn −9.3 %, Fe −5.1 %, protein −6.3 % | eq | Myers et al. 2014, Nature | cr chunk, full text |
| C14 lead | carboxylation faster and oxygenation suppressed | changed | Leakey et al. 2009 | cr chunk, full text |
| C14 caption | 316 ppm (1959), 427 ppm (2025) | kept | NOAA GML `co2_annmean_mlo.txt`: 315.98, 427.35 | here |
| C15 | soybean εi 0.89, εp 0.60 | kept | Zhu, Long & Ort 2010 Table 1 | cr chunk, full text |
| C15 | max conversion efficiency C₃ 4.6 %, C₄ 6.0 % | kept | Zhu, Long & Ort 2010 | cr chunk, full text |
| C15 | bypass in field tobacco: +19 to +37 % | changed from 11–24 % | South et al. 2019, corrected (erratum Science 365:eaay8818) | full text, here (PMC7745124) |
| C15 caption | 620 MJ, 10.6 MJ, 1.7 %; +20 % (2016), +24 % (2017) | kept | Zhu 2010 Table 1; South 2019 | cr chunk; South here |
| C9, C10 captions | *C*ᵢ ≈ 300, *C*c ≈ 200 ppm | unit | Busch et al. 2024 Table 1 | cp chunk, full text |
| C10 | 150 to > 500 H₂O per CO₂ (stomatal transpiration) | eq | Verslues et al. 2023, Plant Cell 35:67 | full text, here (PMC9806664) |
| C10 | ≈ 10,000 × slower diffusion in water | eq | Terashima et al. 2011 ("4 orders of magnitude") | cp chunk, full text |
