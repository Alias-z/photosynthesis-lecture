# Morning review, 28 Oct 2026: what was built overnight and what to pick

Everything below is live on port 5174 (`pilot.html`). Nothing is committed. Every live file that was replaced has a backup in `backups/before-<chunk>-2026-10-28/`. Your picks are untouched.

## Start here: the decisions, most important first

1. **The look of the spotlight schema (C5–C8).** It is your thesis Fig. 2b, extended with photorespiration. Pick one look; the four slides and their animations then follow it.
2. **Figure picks per slide.** Slides 11–C15 now have 8–12 new variants each (ids v1, v2, …), listed after your earlier picks. Double-click to pick, as before.
3. **Animation stagings.** Each of 18 new animations has 3–4 stagings: ▶ on the slide, switch at the top of the player, double-click to pick.
4. **Hook questions.** The ? box on each chunk's slides has 5–6 candidates, with a recommendation in each section below.
5. **Text decisions** in each section below (all small). The new text is already live; the old text is in the BEFORE columns of the reports.

**What is not done:**
- Slides 1–10b are untouched.
- Lecture 2 now has 15 slides (one new: C10, the CO₂ path).
- Some papers could only be read as abstracts; each section says which.
- Nothing is committed to git.

## Lecture 2 order A (live)

| Shown | Slide | Pick key |
|---|---|---|
| C1–C4 | the cycle | C1–C4 |
| C5–C8 | oxygenation → photorespiration → light response → FvCB | C5, C6, C8, C9 |
| C9–C10 | measuring gas exchange → the CO₂ path (new) | C7, C10n |
| C11–C13 | C₃ → C₂ → C₄, CAM | C11, C10, C12 |
| C14–C15 | rising CO₂ → from leaf to loaf | C13, C15 |

A moved slide keeps its old number as its pick key, so your earlier picks stay with their slides. Your FvCB pick "a" shows on C8.

## Status by chunk

| Chunk | Slides | Text + figures | Animations | Full report |
|---|---|---|---|---|
| Photoprotection | 11–13 | LIVE: 11 v1–v10, 12 v1–v10, 13 v1–v9 after your picks; new text | LIVE: pp11, pp12, pp13 · stagings a–d each (slide 11 now plays pp11; `fates` stays in the code) | `reports/REPORT_pp.md` |
| Calvin–Benson–Bassham cycle | C1–C4 | LIVE: v1–v8 per slide; new text | LIVE: cb1 (a–d), cb2 (a–c), cb3 (a–c), cb4 (a–d) | `reports/REPORT_cb.md`, `CB_ANIM_SCRIPTS.md` |
| Rubisco → FvCB (spotlight) | C5–C8 | LIVE: C5 v1–v12, C6 v1–v11, C7 v1–v10, C8 v1–v8 after your pick a; new text | LIVE: rf5, rf6, rf7 (a–d), rf8 (a–c) | `reports/REPORT_rf.md` |
| CO₂ path | C9–C10 | LIVE: C9 v1–v9, C10 (new) v1–v12; new text | LIVE: cp9, cp10 · stagings a–d each | `cp-PLOT_TEXT_ANIM.md` |
| C₃ → C₂ → C₄, CAM | C11–C13 | LIVE: C11 v1–v11, C12 v1–v9, C13 v1–v8; new text | LIVE: cc11, cc12, cc13 · stagings a–d each | `reports/REPORT_cc.md`, `cc-ANIM_SCRIPTS.md` |
| Crops | C14–C15 | LIVE: 9 new variants each (v1–v9), new text | LIVE: cr14, cr15 · stagings a–d each (▶ on the slide) | `reports/REPORT_cr.md` |

## Deck-wide text sweep (slides 11–C15)

**Fixed:** "Calvin–Benson cycle" is now "Calvin–Benson–Bassham cycle" in the C7 lead, one C5 figure label (v10) and two figure descriptions. The backup is in `backups/before-sweep-2026-10-28/`.

**Found, not changed** (your call):
1. **PGA vs 3-PGA:** C1–C4 write "3-PGA"; C5–C8 and the spotlight schema write "PGA", as your thesis figure does. Use one name everywhere?
2. **The same hook twice:** C11's hook a ("Do leaves breathe out CO₂ even in sunlight …") and C5–C8's hook c ("Do plants breathe out CO₂ in sunlight too?"). Pick it in one place only.
3. **Dense text columns** (3 points × 2 lines): 12, 13, C4, C11, C15. Lighter versions are proposed in the chunk reports.
4. No vague amounts, slogans, cross-references or citations were found in the slide text.

## What to pick, slide by slide

### 11 Excess light · 12 Photoprotection and repair · 13 Chlorophyll fluorescence
- **Text:** the new text is live (version A). Each slide also has a lighter version B in `reports/REPORT_pp.md`, not built.
  - Slide 11 dropped superoxide, lipids and pigments.
  - Slide 12 dropped the soybean result, which moves to the animation.
  - Slides 12 and 13 are still dense: three points with two lines each.
- **Pick:** 11 v1–v10, 12 v1–v10 and 13 v1–v9. Your picks 11 a, b and 12 b stay listed first.
  - Your picks 11 a and b show timescales (ps, ns), which the "less is more" rule now leaves out. v7 and v8 are time-free versions of the same idea.
- **Unverified facts to check:**
  - the Rodríguez-Calcerrada 2008 data in 11 v5/v6, read off Eva Rosenqvist's slide (DOI blocked);
  - the "FLEX launch, 2026" label in 13 v9;
  - Järvi 2015, not read.
- **Hooks:** 5 candidates; a is recommended ("If plants need sunlight, why doesn't the midday sun burn their leaves?").
- **Animations:**
  - **pp11 Excess light:** three exits from PSII (photochemistry, heat, fluorescence) with measured shares; light rises to noon; singlet O₂ damages D1. Stagings: a zoom (c2c3) · b window (c2c) · c graph first · d weak vs strong light side by side.
  - **pp12 Photoprotection and repair:** acidic lumen → PsbS and zeaxanthin → Li 2000 *npq4* → D1 damage and repair → passing cloud and VPZ tobacco in the field. Stagings: a zoom · b window · c history first · d with vs without PsbS.
  - **pp13 Chlorophyll fluorescence:** Kautsky 1931 → open vs closed centres → saturating pulse, Fv/Fm 0.83 → stressed leaf 0.52 → SIF from orbit. Stagings: a one zoom-out (8 clicks) · b Kautsky to PAM · c trace + dot grid · d healthy vs damaged leaf.
- **Your call on pp13:**
  - Staging a switches organisms as it zooms out (pea structures → pumpkin leaf → crop plots → Earth), which you objected to before; b, c and d don't.
  - The pumpkin leaf is a simple drawing.
  - FLEX launch dropped as trivia.

### C1–C4 Calvin–Benson–Bassham cycle
- **Text:** the new text is live (tables in `reports/REPORT_cb.md`). C1 is retitled "Calvin–Benson–Bassham cycle", and C2 is now "Rubisco" (slow, so abundant).
- **Decide:**
  1. **Light activation** (thioredoxin, Rubisco activase) is now in no slide. Add one line to C3, or leave it out?
  2. **C2 point 1** (¹⁴C pulse) and **C3 point 3** (light-off transient) are experiments. Keep them as take-homes, or move them into the animations?
- **Pick:** v1–v8 on each slide. The old figures are listed after them.
- **Hooks:** 6 candidates; a is recommended ("Where does a tree's wood come from?").
- **Animations (live):**
  - **cb1 How the cycle was found:** ¹⁴C, the lollipop and the three portraits → shorter feeds (30 s → 5 s → under 1 s in Bassham's flow tube: over 80 % in 3-PGA) → the spots fall into a cycle (1954 drawing) → per 3 CO₂ → "how fast does Rubisco work?" Stagings: a empty-map fill-in · b history (portraits, clippings) · c real images · d feed times side by side.
  - **cb2 Rubisco:** 8 sites, ≈ 3 CO₂ per second each → in bulk (≈ 20 % of leaf N, ≈ 40 % of soluble protein) → 0.7 billion tonnes on land (Bar-On & Milo 2019) → back to the cycle. Stagings: a dive into the slide's Rubisco · b numbers on their source clippings · c structure-led.
  - **cb3 Reduction and regeneration:** ATP/NADPH tokens → Bassham's light-off experiment → why RuBP runs out → 1 of 6 leaves. Stagings: a tokens on the wheel · b real scans (Calvin Fig. 15, Sharkey) · c blocks stack.
  - **cb4 Sucrose and starch:** out or in (translocator) → starch day and night → Graf 2010 early dusk → Rubisco can also take O₂ (leads into C5). Stagings: a dive into the cell · b TEMs on a 24 h clock · c built up live · d day and night side by side.
  - The builder read Sharkey 2019 in full tonight. The lollipop is shown only as the first apparatus; sub-second feeds were done in Bassham's quenched-flow tube.
  - **Your call:** no sub-second film was ever published. The "under 1 s" step shows the 5 s film veiled, plus a readout. It could show the readout alone.

### C5 Rubisco · C6 Photorespiration · C7 Light-response curve · C8 FvCB model: the spotlight schema
- **The schema** (`figs/rf-schema.ts`) is your MSc-thesis Fig. 2b, redrawn and extended with the light reactions and the photorespiratory loop (peroxisome, mitochondrion).
  - It comes in 6 looks: thesis, tem (real organelles, Frederick & Newcomb 1969), pdb (rendered Rubisco), flat, line and glow.
  - Each slide lights its part: C5 Rubisco's two reactions; C6 the loop through three organelles; C7 the light supply to RuBP regeneration; C8 the three FvCB limits.
  - The animations zoom into that part and back out.
- **First pick the look.** Each slide has the schema in several looks: C5 v1/v2/v11/v12, C6 v1/v2/v3/v10/v11, C7 v1/v2/v3/v10, C8 v1/v2/v7/v8. One look should then carry all four slides and their animations, as c2c does for slides 7–10b.
- **Other figures per slide:**
  - C5: the Forrester 1966 O₂ graph and the Rubisco structure;
  - C6: the *pglp1* mutant photos and the quantum yield at 2 % vs 21 % O₂;
  - C7: sun vs shade curves, and Gaastra 1959 showing the plateau rising with CO₂;
  - C8: your pick a, the thesis Fig. 5 wheat curve, and the Gregory 2021 rice fits.
- **Decide:**
  1. C5 says "≈ 1 oxygenation per 3 carboxylations". Busch 2024 gives ≈ 0.4, i.e. 1 per 2.5. Keep it, or change to "1 per 2.5–3"?
  2. C8 uses A_j ~ J, not Jmax (matching your pick a). OK?
  3. Add a C6 point on the benefit, "photorespiration also supports nitrate assimilation" (Busch, Sage & Farquhar 2018)? Not built.
  4. C6's old variant g ("Native vs bypass") duplicates the bypass now on C15. Unlist it?
- **Hooks:** 5 candidates. b: "If plants make the oxygen we breathe, why does oxygen slow them down?"
- **Animations (live):**
  - **rf5 Rubisco:** zoom into Rubisco on the schema → carboxylation → dive into the 8RUC structure, O₂ takes the same site → Forrester 1966 → temperature, specificity 160 → 50 → zoom out, 2-phosphoglycolate ringed. Stagings: a straight (thesis look) · b history first, 1966 → 1971 (glow) · c from inside the structure, with a 3 : 1 tally (pdb) · d hot leaf first (flat).
  - **rf6 Photorespiration:** follow 4 carbon atoms (beads) through chloroplast → peroxisome → mitochondrion (1 lost as CO₂, NH₃) → back to PGA, with a live readout → Somerville & Ogren 1979 mutant → zoom out, the light supply starts to light. Stagings: a straight (thesis) · b on the real Frederick & Newcomb micrograph (tem) · c mutant first (glow) · d cost first, 29 % less CO₂ per photon (line).
  - The builder corrected two script errors: Forrester's CO₂ effect is "a smaller fraction", and the 1979 mutant "turned pale" in air rather than "died".
- **rf7 Light-response curve:** the light rises once, 0 → 2000, on the schema, with the Huang 2014 tobacco curve and its dot. Darkness (respiration only) → compensation point → quantum yield (supply lit) → saturation (ATP and NADPH pile up, Rubisco glows) → sun- vs shade-grown tobacco → "which step sets the limit, and does it change with CO₂?" Stagings: a thesis look · b glow, with Gaastra 1959 (more CO₂ raises the plateau) · c structures, linking back to the slide 7–10b complexes · d sun- and shade-grown side by side.
- **rf8 FvCB model, the animation you asked for:** Cᵢ rises 60 → 1200 ppm. Each limit is lit in turn on the schema, with an A/Cᵢ curve fitted to your thesis Fig. 5:
  - Rubisco (A_c);
  - today's air, near the switch;
  - RuBP regeneration (A_j);
  - TPU (A_p).
  - It ends with "uptake = the lowest rate" and the FvCB 1980 and Sharkey 1985 paper cards.
  - Stagings: a thesis look · b glow, with the dot running on your real thesis Fig. 5 · c three windows, one per limit.
  - Notes:
    - A_p (= 33) is schematic, because your thesis figure has no TPU branch.
    - The paper-card titles were checked against the citations (FvCB 1980, Planta 149:78; Sharkey 1985, Plant Physiol. 78:71).
    - The closing question assumes order A (C9 measuring comes next).

### C9 Measuring leaf gas exchange · C10 CO₂ diffusion pathway (new)
- **Text:** the new text is live. The BEFORE/AFTER tables, hooks and scripts are in `cp-PLOT_TEXT_ANIM.md`.
  - C10's lead states Fick's law: across each step, CO₂ uptake = conductance × concentration drop.
  - C10's points are the three conductances: boundary layer, stomata and mesophyll.
- **Decide:** under order A, C7 (light response) and C8 (FvCB) use A and Cᵢ before C9 explains how they are measured. The builder proposes moving C9 before C7. Keep order A, or move C9?
- **Pick:** C9 v1–v9 (the old figures follow) and C10 v1–v12, including a micrograph with the path drawn on it and the path schema with each conductance lit.
- **Not read:** Evans 2021, Flexas 2008/2012, Wong 1979. No numbers on the slides come from them.
- **Animations:**
  - **cp9 Measuring gas exchange:** a leaf in the chamber in the dark (respiration) → light on (A, E) → Gaastra 1959 → gₛ and Cᵢ calculated → "How much of it reaches Rubisco?" Stagings: a on the slide figure · b history first · c real images (LI-6800 in a rice field, SEM stoma) · d dark vs lit leaf side by side.
  - **cp10 CO₂ diffusion pathway:** a CO₂ walks through the three conductances, with a live Cₐ/Cₛ/Cᵢ/Cc readout. Wind thins the boundary layer → Brown & Escombe 1900 at the stoma → water out → the mesophyll, ≈ 10,000× slower in water → stomata close in dry air → question leading into C11 (recapture). Stagings: a along the slide figure · b history first · c real images · d still air vs wind, open vs closed side by side.

### C11 Refixation of photorespired CO₂ · C12 C₄ · C13 CAM
- **The Sage & Busch research you asked for is on C11.**
  - Busch, Sage, Cousins & Sage 2013, read in full: chloroplasts cover 92.5 % (wheat) and 98.9 % (rice) of the wall facing the air spaces, with the mitochondria behind them.
  - 26–29 % of the photorespired CO₂ is refixed inside the cell, and net uptake rises by 9–11 %.
  - Figures: v1 (rice TEM), v2 (path drawn on wheat TEM), v3 (rice vs tobacco), v4 (Busch Fig. 5 redrawn), v5 (where the CO₂ goes).
- **Decide:**
  1. C11 point 1 carries four numbers. Keep it, or use the lighter line (in `reports/REPORT_cc.md`) with the numbers in the animation?
  2. Split C11 into "C₃ refixation" and "C₂ → C₄"?
- **Check:** board images u and v were downloaded by bypassing a bot check, which shouldn't have happened. If their source matters, re-fetch them through ETH access.
- **Pick:** C11 v1–v11, C12 v1–v9, C13 v1–v8. The old figures follow.
- **Hooks:** 5 candidates. a: "Do leaves breathe out CO₂ even in sunlight, and do they just lose it?"
- **Animations (live):**
  - **cc11 Refixation:** inside the rice C₃ cell, CO₂ from the mitochondria must cross chloroplast stroma (29 % refixed, +11 % uptake) → how Busch & Sage measured it (a ¹³CO₂ switch, then a ¹³CO₂ flood: 49 % vs 100 % comes out, so 51 % refixed) → C₂: glycine moves to the bundle sheath (Rawsthorne 1988) → the *Flaveria* series → "What if a plant pumped CO₂ instead?" Stagings: a on the schema · b experiment first · c real images (rice TEM, glycine decarboxylase stain, *Flaveria*) · d rice vs tobacco side by side.
    - The builder read Busch et al. 2013 in full tonight and corrected the method: it has two switches, not one.
  - **cc12 C₄:** Hatch & Slack 1966 (> 93 % of the ¹⁴C in C₄ acids) → Kranz (Haberlandt 1904) → the pump, CO₂ ≈ 100 vs ≈ 1500 → 2 ATP and the 30 °C crossover → "Could a plant separate the steps in time?" Stagings: a schema · b history first · c dive into the maize micrograph · d C₃ vs C₄ at 14 and 38 °C.
  - **cc13 CAM:** night (acid fills the vacuole) → day (stomata shut, CO₂ to Rubisco) → the *Kalanchoë* 24 h record → water use → question into C14. Stagings: a schema · b Heyne 1815, "as acid as sorrel" in the morning (read in full) · c *Agave* data · d C₄ (space) vs CAM (time).
  - No portraits of Busch, Sage, Hatch or Slack are openly licensed, so they appear as typeset clippings.

### C14 Rising CO₂ · C15 From leaf to loaf
- **Text:** the new text is live. The BEFORE/AFTER tables are in `reports/REPORT_cr.md`.
- **Decide on C15:** "stem reserves" left the text (it stays in figure v5 and the animation). C15 now holds three ideas: yield chain, ceiling and bypass, grain filling. Keep it, or split it into "Crop yield potential" + "From leaf to loaf"?
- **Pick:** the figures C14 v1–v9 and C15 v1–v9. The old figures are listed after them.
- **Hooks:** the ? box on C14/C15 has 5 candidates; a (C14) and c (C15) are recommended.
- **Animations:**
  - **cr14 Rising CO₂:** Keeling curve → Kimball 1983 → FACE → inside the leaf (+29 % soybean, 0 % maize) → grain zinc, iron and protein. Stagings: a zoom on the slide figures · b clippings · c real images first · d C₃/C₄ table.
  - **cr15 From leaf to loaf:** sunlight per m² → efficiency ceiling → breeding (Borlaug) → photorespiration bypass → grain filling. Stagings: a zoom along the yield chain · b papers on the desk · c real images · d side-by-side pairs.
  - Notes: cr15-a has 10 clicks, probably too many. Kimball 1983 and Long 2006 were read as abstracts only.
