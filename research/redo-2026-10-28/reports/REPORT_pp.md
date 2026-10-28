# Chunk pp · Lecture 1 chunk 6 · Photoprotection and chlorophyll fluorescence · slides 11, 12, 13

Phase 1 report, 28 Oct 2026 (overnight). Scratch deck: `$SCR/pp/deck`, served on port 5181. The live project, port 5174, `picks.json` and `chain.ts` were not touched.

- **Screenshots** of every new variant and of the picks: `$SCR/pp/shots/final/`.
- **Contact sheets** of the figure areas: `$SCR/pp/shots/sheet-11.png`, `sheet-12.png`, `sheet-13.png`.
- **Hook page:** `$SCR/pp/shots/hooks.png`.

Where `$SCR` = `/private/tmp/claude-502/-Users-zhongyua--claude-spares-spare-hM1lLo/5ab943f9-d753-4192-bfa6-3efc5cb53ace/scratchpad`.

---

## 1. Plot

**Theory.** This chunk carries on the c2c chain of slides 7–10b, with the photoprotection parts lit:
- **11:** light piles up at photosystem II and leaves by three exits.
- **12:** the acidic lumen switches on PsbS and zeaxanthin in the antenna (heat), and damaged D1 is replaced.
- **13:** the red fluorescence that leaves photosystem II is measured, from leaf clip to satellite.

| Concept to take home | Slide | Key source (read tonight) |
|---|---|---|
| Absorbed light rises with intensity, but CO₂ fixation saturates: excess light | 11 | Murchie & Niyogi 2011 (full text, PMC3075776) |
| Absorbed energy leaves photosystem II by photochemistry, heat (NPQ) or fluorescence; the shares add to 1, and heat grows with light | 11 | Rodríguez-Calcerrada et al. 2008 (data read off the figure as shown by Rosenqvist, slide 56) |
| Unused excitation forms singlet oxygen, which damages D1 | 11 | Murchie & Niyogi 2011; Pospíšil 2016 (board) |
| NPQ: low lumen pH activates PsbS and violaxanthin → zeaxanthin; the antenna dissipates heat | 12 | Li et al. 2000 (abstract); Murchie & Niyogi 2011 |
| Photoinhibition: D1 damage ∝ light; the D1 repair cycle | 12 | Tyystjärvi & Aro 1996 (abstract and Fig. 1, 2 page scans) |
| NPQ relaxes slowly in shade; faster relaxation gave field tobacco ≈ 15 % more dry weight | 12 | Kromdijk et al. 2016 (abstract) |
| Fluorescence competes with photochemistry and heat; a saturating pulse gives Fv/Fm ≈ 0.83 in healthy leaves, lower under stress | 13 | Björkman & Demmig 1987 (abstract: 0.832 ± 0.004, 37 C₃ species); Ruban 2016 Fig. 1A |
| SIF: satellites map crop photosynthesis | 13 | Guanter et al. 2014 (27 Oct review) |

**Hook candidates** (`src/pilot/hooks/L6-photoprotection.json`):
- **a.** If plants need sunlight, why doesn't the midday sun burn their leaves?
- **b.** Why does a leaf glow red under a UV lamp, and why does the glow fade after a minute? (Kautsky & Hirsch 1931)
- **c.** Can a satellite tell how well a cornfield is growing?
- **d.** Does a passing cloud cost a farmer part of the harvest? (VPZ tobacco)
- **e.** Do leaves wear out in the sun, like a solar panel? (Tyystjärvi & Aro 1996)

Recommended: **a** for the chunk; d and e can serve as sparks inside the animations.

**The line in and out.**
- **In:** the cyclic-flow animation (slide 10b) already ends on "What happens when light brings more energy than the chain can use?", which slide 11 answers.
- **Within the chunk:** 11 ends on "how does the leaf protect and repair photosystem II?"; 12 ends on "how can we see NPQ and damage in a living leaf?"
- **Out:** 13 ends lecture 1 with "Light has made ATP and NADPH: how does the leaf turn CO₂ into sugar?", which leads into C1, the Calvin–Benson–Bassham cycle.

---

## 2. Per slide

The text modules are built with the AFTER (A) wording. Version B is a lighter alternative for the lecturer to choose, and is not built. Every AFTER line keeps the facts of the 27 Oct text unless a row says otherwise.

### Slide 11 · Excess light

`pp11.ts` (text) and `pp11f.ts` (figures); the slide still plays `fates`.

| | BEFORE (s12r.ts, 27 Oct) | AFTER A (built) | AFTER B (lighter, not built) |
|---|---|---|---|
| Title | Excess light | Excess light | Excess light |
| Lead | In bright light, leaves absorb more energy than they can use; the excess must be removed or it damages the photosystems. | In strong light, leaves absorb more energy than CO₂ fixation can use. | same as A |
| 1 | **Light saturation.** CO₂ fixation reaches its maximum well below full sunlight / Light absorbed beyond that cannot be used | **Light saturation.** CO₂ fixation saturates below full sunlight; absorbed light keeps rising | same as A |
| 2 | **Fates of absorbed energy.** Each excitation is used in photochemistry, lost as heat or re-emitted as fluorescence / When photochemistry is saturated, more goes to heat and fluorescence | **Fates of absorbed energy.** Photochemistry, heat or fluorescence; their shares add up to 1 / In strong light, heat rises and photochemistry falls | **Fates of absorbed energy.** Photochemistry, heat or fluorescence; their shares add up to 1 |
| 3 | **Reactive oxygen species.** Energy and electrons that cannot be used pass to O₂ / Singlet oxygen and superoxide damage proteins (especially D1), lipids and pigments | **Reactive oxygen species.** Unused excitation forms singlet oxygen, which damages the D1 protein of photosystem II | same as A |

**Dropped facts, stated plainly:**
- **A** drops superoxide (electrons passed to O₂), and drops lipids and pigments as targets. The reason: singlet oxygen damaging D1 is the link to slide 12.
- **B** also drops the line "heat rises and photochemistry falls". That fact is shown by figures v5, v6 and v8.

The text fits its column without tightening.

**Variants** (the picks come first, then the new ones, then the older unpicked ones, which are l12's c–j). Approaches: 1 real image, 2 drawing, 3 data, 4 combination, 5 lit schema.

| id | Idea | Approach |
|---|---|---|
| a, b | **Picks**, unchanged (l12 Jablonski "Levels + times", "Energy × time") | — |
| v1 | Whole chain (c2c) smaller, photosystem II ringed; a zoom circle shows the excess light and its three exits: heat, fluorescence, photochemistry (e⁻ to plastoquinone) | 5 |
| v2 | Close-up crop of photosystem II (c2c3 glow) with the three exits, big; a mini-map of the chain | 5 |
| v3 | Energy balance drawn: absorbed light (straight) vs CO₂ fixation (saturating); the gap is "excess"; full sun marked | 2 |
| v4 | Murchie & Niyogi 2011, Fig. 1A, restyled: its labels masked and set again | 1 |
| v5 | Measured yields vs light in oak leaves: photochemistry falls, heat (NPQ) rises, the rest stays near 0.2; "sum = 1" | 3 |
| v6 | The same data as stacked shares, each column adding up to 1 | 3 |
| v7 | Energy levels with the three exits plus triplet → singlet O₂, with no times: a lighter version of pick a | 2 |
| v8 | Weak vs strong light: the three exits as arrows whose widths are the measured shares (40 vs 1420 µmol m⁻² s⁻¹) | 2/3 |
| v9 | Porcar-Castell et al. 2021, Fig. 1 detail, restyled: absorbed light → photosystem I/II → photochemistry, heat (NPQ), fluorescence | 1 |
| v10 | Murchie & Niyogi's real graph, plus the drawn routes of the excess: heat, fluorescence, singlet O₂ → damages photosystem II | 4 |

**Sources:** Murchie & Niyogi 2011; Rodríguez-Calcerrada et al. 2008; Porcar-Castell et al. 2021; Pospíšil 2016; E. Rosenqvist's PhD course 2018 (slides 11, 13, 56). Details are in `src/assets/SOURCES-pp.md`.

**Animation script** (new key `pp-excess`, ≈ 35 s, 4 clicks; the existing `fates` stays listed):

| Beat · tag | Click plays | Caption | Cite |
|---|---|---|---|
| 1 · Noon | Whole chain, photosystem II lit. A light readout (µmol m⁻² s⁻¹, on screen from the start) climbs from 200 to 2000. Light waves at photosystem II multiply; plastoquinone stays loaded. | At noon a leaf absorbs ever more light, but CO₂ fixation levels off: photosystem II receives more energy than the chain can pass on. | Murchie & Niyogi 2011, Plant Physiol. |
| 2 · Three exits | Camera zooms into photosystem II. Three exit arrows (photochemistry, heat, fluorescence) change width with the readout: from 0.79/0.06/0.17 at 40 to 0.22/0.57/0.22 at 1420 µmol m⁻² s⁻¹. | Each excitation leaves photosystem II by photochemistry, heat or fluorescence. In weak light most goes to photochemistry; in strong light most leaves as heat. | Rodríguez-Calcerrada et al. 2008, Tree Physiol. |
| 3 · Singlet oxygen | One excitation finds no exit; a triplet forms, meets O₂, and a singlet-O₂ burst hits D1 (a red mark on the core). | Excitation that finds no exit forms singlet oxygen, which damages the D1 protein of photosystem II. | Murchie & Niyogi 2011; Pospíšil 2016, Front. Plant Sci. |
| 4 · Back to the chain | Zoom out to the whole chain; the red mark stays on photosystem II. | **How does the leaf protect photosystem II, and repair it?** | — |

**Stagings:**
- **(A) Zoom.** The slide's own c2c3 chain (v1/v2 layout): zoom into photosystem II and back out.
- **(B) Graph-led.** The energy-balance graph (v3/v4) fills its excess area as a light cursor sweeps right. The graph then shrinks to a corner and the photosystem II zoom shows where the excess goes.
- **(C) Data-led.** The stacked shares (v6) with a vertical light cursor; beside it, the three arrows of v8 thicken and thin with the cursor. Pospíšil 2016's structure image (singlet O₂ at LHCII and P680) appears as the final card.
- **(D) Side by side.** A shaded leaf and a sunlit leaf at noon (v8 columns) under the same clock; singlet O₂ appears only in the sunlit column.

### Slide 12 · Photoprotection and repair

`pp12.ts` and `pp12f.ts`.

| | BEFORE (s13.ts, 27 Oct) | AFTER A (built) | AFTER B (lighter, not built) |
|---|---|---|---|
| Title | Photoprotection and repair | Photoprotection and repair | same |
| Lead | The acidic lumen signals excess light and switches on heat dissipation (NPQ); damaged PSII is repaired continuously. | Excess light acidifies the lumen, which switches on heat dissipation; damaged photosystem II is repaired continuously. | same as A |
| 1 | **Non-photochemical quenching (NPQ).** The acidic lumen activates PsbS and converts violaxanthin to zeaxanthin / The antenna then turns excess energy into heat | **Non-photochemical quenching (NPQ).** Low lumen pH activates PsbS and turns violaxanthin into zeaxanthin / The antenna then dissipates excess energy as heat | same as A |
| 2 | **Photoinhibition and repair.** PSII, especially its D1 protein, is damaged in proportion to light / Damaged D1 is replaced; photoinhibition appears when damage outpaces repair | **Photoinhibition and D1 repair.** Light damages D1 of photosystem II, in proportion to light / Damaged D1 is replaced; photoinhibition: damage faster than repair | same as A |
| 3 | **NPQ and crop yield.** NPQ switches off slowly when light drops, so shaded leaves waste light for minutes / Faster NPQ relaxation increased field yield of tobacco and soybean | **NPQ relaxation.** NPQ switches off slowly in shade, wasting light / Faster relaxation: tobacco gained ≈ 15 % dry weight in the field | (point removed: VPZ told in the animation only) |

**Changes from BEFORE:**
- **Soybean** moves to the animation. De Souza 2022 found a gain in only one of two years.
- **"PSII"** is spelled out as photosystem II.
- **"The lumen converts…"** was corrected: the enzyme does the converting, activated by low pH.

**Text fit:** fitPage tightens the text column one step (tight-2, 21 px points). Version B would fit without tightening.

**Variants** (the pick comes first, then the new ones, then l13's other ids a, c–j):

| id | Idea | Approach |
|---|---|---|
| b | **Pick**, unchanged (the MSc-thesis inset) | — |
| v1 | Whole chain (c2c) with the lumen H⁺ lit; a zoom circle on photosystem II shows H⁺ on PsbS, zeaxanthin in the antenna and heat leaving | 5 |
| v2 | Close-up crop (c2c3 glow): a lumen crowded with H⁺, PsbS with H⁺, zeaxanthin, heat; a mini-map | 5 |
| v3 | Close-up crop (c2c): singlet O₂ hits D1 (a red burst), plus a repair card: damaged D1 removed → new D1 inserted → photosystem II works again | 5/2 |
| v4 | Li et al. 2000, Fig. 1b redrawn: NPQ of wild type, no zeaxanthin (npq1) and no PsbS (npq4) over 5 min light and 5 min dark | 3 |
| v5 | Li et al. 2000, Fig. 1c, the real NPQ image: plants without PsbS are purple, with the PsbS gene back they recover | 1 |
| v6 | Tyystjärvi & Aro 1996, Fig. 2A, the real graph: the damage rate of photosystem II rises in a straight line with light (repair blocked) | 1 |
| v7 | A lighter version of pick b: three states (harvesting → H⁺ bind PsbS → heat dissipation) with violaxanthin/zeaxanthin and no bottom cycle | 2 |
| v8 | The PSII repair cycle, drawn after Järvi et al. 2015: grana → D1 damaged → to the unstacked membrane → D1 removed → new D1 → back to grana | 2 |
| v9 | The real PsbS crystal structure (Fan 2015) with lumen H⁺ drawn at its two acidic sensors, plus a 3-step card (lumen pH falls → H⁺ bind PsbS → antenna switches to heat dissipation) | 4 |
| v10 | Kromdijk 2016, Fig. 5A (real bars: VPZ lines 14–20 % above wild type) and Fig. 5D (aerial photo of the field trial): "faster NPQ relaxation: ≈ 15 % more dry weight" | 1/4 |

**Sources:** Li et al. 2000; Murchie & Niyogi 2011; Tyystjärvi & Aro 1996; Järvi et al. 2015; Kromdijk et al. 2016; Fan et al. 2015; Wilhelm & Selmar 2011.

**Animation script** (key `pp-protect`, ≈ 40 s, 5 clicks):

| Beat · tag | Click plays | Caption | Cite |
|---|---|---|---|
| 1 · Acidic lumen | Whole chain, strong light. H⁺ dots pile up in the lumen; ATP synthase turns at its limit (the lumen pH readout falls). | In excess light, H⁺ pile up in the lumen: it becomes more acidic. | Murchie & Niyogi 2011 |
| 2 · PsbS and zeaxanthin | Zoom into the photosystem II antenna. H⁺ bind PsbS; the violaxanthin chain turns orange (zeaxanthin); heat waves leave; the red fluorescence dims. | Low lumen pH activates PsbS and turns violaxanthin into zeaxanthin; the antenna now dissipates the excess as heat (NPQ). | Li et al. 2000, Nature; Murchie & Niyogi 2011 |
| 3 · A mutant without PsbS | Journal clipping of Li et al. 2000 with the Fig. 1c NPQ image; the npq4 row is ringed. | 2000: Arabidopsis mutants that could not dissipate excess light all lacked one protein, PsbS. | Li et al. 2000 |
| 4 · Damage and repair | Back on the chain. Singlet O₂ marks D1 red; photosystem II glides to the unstacked membrane, swaps D1, and returns. | Light still damages D1, in proportion to light; the leaf replaces damaged D1 continuously. | Tyystjärvi & Aro 1996, PNAS; Järvi et al. 2015 |
| 5 · A passing cloud | Light drops; the H⁺ leave, but the zeaxanthin stays orange and the heat waves go on. The Kromdijk field photo and "≈ 15 % more dry weight" clipping appear. | In shade, NPQ switches off slowly and wastes light. Tobacco engineered to switch it off faster gained ≈ 15 % dry weight in the field (2016). **How can we see NPQ and damage in a living leaf?** | Kromdijk et al. 2016, Science |

**Stagings:**
- **(A) Zoom.** The c2c3 chain zooms into the antenna and back out (matching v1–v3).
- **(B) History-led.** Opens on the puzzle of the purple npq4 plants (Li 2000 clipping); then the mechanism zoom; ends on the Illinois field photo.
- **(C) Structure-led.** The PsbS crystal structure (Fan 2015) takes H⁺ at its lumen side; cut to the antenna dissipating heat; the repair shown on the drawn cycle (v8).
- **(D) Side by side.** Wild type and npq4 leaves under the same light steps, with NPQ readouts from Li Fig. 1b; then wild type and VPZ under a passing cloud.

### Slide 13 · Chlorophyll fluorescence

`pp13.ts` and `pp13f.ts`.

| | BEFORE (s14.ts, 27 Oct) | AFTER A (built) | AFTER B (lighter, not built) |
|---|---|---|---|
| Title | Chlorophyll fluorescence | Chlorophyll fluorescence | same |
| Lead | Fluorescence competes with photochemistry and heat, so measuring it shows how a leaf uses light, without harming it. | Fluorescence competes with photochemistry and heat, so measuring it shows how photosystem II uses light, without harming the leaf. | same as A |
| 1 | **Fv/Fm.** Measured after dark adaptation with a saturating light pulse / Maximum PSII efficiency: ≈ 0.8 in healthy leaves, lower under stress | **Fv/Fm.** Maximum quantum yield of photosystem II, measured with a saturating light pulse after dark adaptation / ≈ 0.83 in healthy leaves; lower after photoinhibition or other stress | same as A |
| 2 | **ΦPSII and NPQ.** Measured in the light / ΦPSII: the share of absorbed light used by PSII; NPQ: the heat dissipation | **ΦPSII and NPQ.** Pulses in the light measure photochemistry (ΦPSII) and heat dissipation (NPQ) | **Pulse-amplitude modulation (PAM).** A weak pulsed measuring light reads fluorescence even in daylight |
| 3 | **Solar-induced fluorescence (SIF).** Satellites detect the faint fluorescence of vegetation / It tracks crop photosynthesis across regions | **Solar-induced fluorescence (SIF).** Satellites measure the faint fluorescence of vegetation in sunlight / It maps crop photosynthesis across regions | same as A |

**Notes on the text:**
- **0.8 → 0.83:** Björkman & Demmig 1987, 0.832 ± 0.004.
- **Text fit:** fitPage tightens one step (tight-2).
- **Kautsky** is told in the animation only.

**Variants** (slide 13 has no picks; the new ones come first, then l14's a–j):

| id | Idea | Approach |
|---|---|---|
| v1 | Whole chain smaller; a zoom circle on photosystem II sends red fluorescence to a fluorometer head | 5 |
| v2 | Saturating pulse on a dark-adapted leaf, healthy vs photoinhibited: Fo, Fm, Fv; Fv/Fm ≈ 0.83 vs lower (schematic) | 2 |
| v3 | Ruban 2016, Fig. 1A, the real PAM trace of an Arabidopsis leaf, relabelled Fo, Fm, Fs, Fm′, NPQ, actinic light on/off | 1 |
| v4 | Tyystjärvi & Aro 1996, Fig. 1A redrawn: Fv/Fm of pumpkin leaves starts at 0.83 and falls in light when repair is blocked (548, 307, 32, 9 µmol m⁻² s⁻¹); it stays at 0.83 when repair works | 3 |
| v5 | The photosystem II population behind Fo / Fm / Fs / Fm′: dot grids of open, closed and quenching centres (after Rosenqvist slide 34) | 2 |
| v6 | How a PAM fluorometer works: measuring light pulses, actinic light, saturating pulse; the detector reads only the pulsed signal | 2 |
| v7 | Guanter 2014, Fig. 1, the real global SIF map, colour bar set again; "US Corn Belt" | 1 |
| v8 | One signal at three scales: leaf clip (drawn) → tree SIF image (Porcar-Castell 2021 Fig. 3b) → Earth (Guanter 2014) | 4 |
| v9 | The FLEX launch photo (ESA, 2026) and the SIF map | 1/4 |

**Sources:** Björkman & Demmig 1987; Maxwell & Johnson 2000 (listed, not re-read tonight); Ruban 2016; Tyystjärvi & Aro 1996; Guanter et al. 2014; Porcar-Castell et al. 2021; Schreiber et al. 1986; ESA 2026.

**Animation script** (key `pp-fluor`, ≈ 40 s, 5 clicks):

| Beat · tag | Click plays | Caption | Cite |
|---|---|---|---|
| 1 · 1931, Heidelberg | A clipping of Kautsky & Hirsch 1931, with the Kautsky photo shown unaltered (CC BY-NC-ND). A dark-kept leaf under a UV lamp: its red glow rises within a second, then fades over minutes, drawn as a live curve. | 1931: Kautsky and Hirsch lit a dark-kept leaf with UV light. Its red glow rose within a second, then faded over minutes as photosynthesis started. | Kautsky & Hirsch 1931, Naturwissenschaften; Schreiber & Lichtenthaler 2025, Photosynthetica |
| 2 · Competing exits | The photosystem II close-up: open reaction centres give a faint glow; closed ones a bright glow. | The more energy goes into photochemistry, the less is left for fluorescence. | Schreiber & Lichtenthaler 2025 |
| 3 · Saturating pulse | A PAM leaf clip with its measuring pulses ticking. The flash fires: the dot grid turns all red, the trace jumps from Fo to Fm, and the readout shows Fv/Fm = 0.83. | A saturating pulse closes every reaction centre. From Fo and Fm, Fv/Fm ≈ 0.83 in a healthy leaf. | Björkman & Demmig 1987, Planta |
| 4 · Stress | The same leaf after strong light with repair blocked. The flash fires: Fm is lower and the readout falls (0.83 → 0.52 after 4.6 h at 548 µmol m⁻² s⁻¹). | After light damage the pulse peak is lower: Fv/Fm falls. | Tyystjärvi & Aro 1996 |
| 5 · From space | The camera zooms out: leaf → field → Earth (Guanter SIF map, the Corn Belt glowing); the FLEX launch photo appears. | Satellites read the same glow from orbit; the US Corn Belt shines brightest. ESA's FLEX satellite was launched on 15 Sep 2026 to map it. **Light has made ATP and NADPH: how does the leaf turn CO₂ into sugar?** | Guanter et al. 2014, PNAS; ESA 2026 |

**Stagings:**
- **(A) One zoom-out.** Photosystem II on the chain → leaf clip → field → Earth, with a stop at each scale.
- **(B) History-led.** The Kautsky clipping and the 1931 curve, then the real PAM trace (Ruban 2016) built pulse by pulse.
- **(C) Real-trace-led.** Ruban's trace plays live, with the v5 dot grid beside it flipping state at each pulse.
- **(D) Side by side.** A healthy and a photoinhibited leaf under the same pulse (v2), Fv/Fm 0.83 vs lower; then both shrink into the SIF map.

---

## 3. Files (paths relative to `deck/`)

**New:**
- `src/pilot/figs/pp-kit.ts` (shared kit: text, waves, plots, masked paper figures, chain overlays: `chainWhole`, `chainCrop`, `chainMap`)
- `src/pilot/figs/pp.css`
- `src/pilot/figs/pp11.ts`, `pp12.ts`, `pp13.ts` (text)
- `src/pilot/figs/pp11f.ts`, `pp12f.ts`, `pp13f.ts` (figures; old ids are delegated to l12/l13/l14)
- `src/pilot/hooks/L6-photoprotection.json`
- `src/assets/SOURCES-pp.md`

**Changed:**
- `src/pilot/plates.ts` only. No new image files: the figures use the existing `photos/12-*`, `13-*`, `14-*` and two board images (`refs/L6-photoprotection/fan2015-psbs-structure.jpg`, `ruban2016-pam-trace.jpg`).
- `chain.ts` is unchanged; all overlays are drawn in `pp-kit.ts` through the existing `focusSvg` API.

**plates.ts lines to paste:**

```ts
// Slides 11–13, chunk pp (photoprotection and fluorescence, 28 Oct 2026): text pp11–pp13, figures pp11f–pp13f.
import * as pp11 from './figs/pp11';
import * as pp11f from './figs/pp11f';
import * as pp12 from './figs/pp12';
import * as pp12f from './figs/pp12f';
import * as pp13 from './figs/pp13';
import * as pp13f from './figs/pp13f';
```

In `PLATES`, replace `withFigures(s12r, l12), withFigures(s13, l13), withFigures(s14, l14),` with:

```ts
withFigures(pp11, pp11f), withFigures(pp12, pp12f), withFigures(pp13, pp13f),
```

- Slide 11 keeps `play: 'fates'` through `pp11f.PLATE`.
- Pick keys stay '11', '12' and '13' (n unchanged).

**QA:**
- `npx tsc --noEmit -p .` is clean.
- All 29 new variants plus the picks were shot and looked at.
- The `qa.html` dump shows no overflow or overlap in the new figures. Two flags remain:
  - `12 v1 "H⁺ × H⁺"`: the chain's own two H⁺ labels coincide in its small copy. This also happens on slide 10's 10a–10e.
  - Text-column flags on 11a, 12b and 13v1: the QA page does not run fitPage. In the real page, slide 11 fits untightened, and 12 and 13 use tight-2.

---

## 4. Doubts

1. **Slide 11's picks carry timescales.** Picks a and b show fs/ps/ns badges, which the brief now forbids; they stay listed, untouched. v7 and v8 are the time-free versions. The lecturer may want a and b trimmed the same way.
2. **Rodríguez-Calcerrada et al. 2008 (v5, v6, v8 and the slide 11 animation) is not read.**
   - The data are read off the figure as reproduced on Rosenqvist slide 56. The paper (OUP, Cloudflare) and its figure number are still to be checked.
   - The DOI `10.1093/treephys/28.5.761` is unverified. Rosenqvist is a co-author, per the 27 Oct notes.
3. **Järvi, Suorsa & Aro 2015 is to read** (ScienceDirect returned an error page). The repair steps also stand in Murchie & Niyogi 2011, which was read.
4. **Unverified details taken from the board:**
   - Fan 2015: the E69/E173 identity comes from the board caption.
   - Li 2000 Fig. 1c: "purple = low NPQ" is inferred from the figure (npq4 purple, PsbS restored green/red). Check the legend.
5. **Kromdijk 2016, field wording.** The slide says "≈ 15 % … in the field". The abstract says "about 15 % in fluctuating light"; the editor's summary and Fig. 5A (14–20 %) are about the field.
6. **Maxwell & Johnson 2000 and Baker 2008** are cited but were not re-read tonight. The facts used are covered by Björkman & Demmig and Ruban.
7. **Proposals, not built:**
   - **Slide 12 B:** VPZ only in the animation, which makes slide 12 fit untightened.
   - **Slide 13 B:** a PAM point instead of the ΦPSII/NPQ point.
   - **No merge or split proposed;** the three slides map cleanly onto 3 animations.
8. **Kautsky also discovered singlet oxygen in 1931** (Schreiber & Lichtenthaler 2025, abstract). That is a possible spark for slide 11's animation, but it is kept out so the deck tells one history story per chunk.
9. **The v5 dot-grid pattern is illustrative**, not counted from data.
10. **Image files:** two board images are imported straight from `src/assets/refs/L6-photoprotection/`. The main thread may prefer copies under `photos/pp-*`.
