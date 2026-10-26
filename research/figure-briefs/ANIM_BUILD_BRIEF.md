# Building the light-block animations (26 Oct 2026)

Two animations, two staging variants each, so the lecturer can pick one and steer from it. Read `ORDER_PROPOSAL.md` (sky script) and `ANIM_WHO_SEES.md` (life script) for the story, and `GENERAL_RULES.md` and `LIGHTER_BRIEF.md` for the page rules, which apply here too.

## What is already built (do not edit)

- `src/pilot/anim/types.ts`: the `Staging` interface.
- `src/pilot/anim/beats.ts`: the beats. Each beat has a tag, a caption and its sources. **Captions and citations are fixed**; the player shows them under the stage.
- `src/pilot/anim/player.ts` + `anim.css`: the stepped player. It draws a 1600 × 740 stage on Bristol paper, with the dots, caption, sources and Back / Next under it. Keys are ← → and space.
- `src/pilot/anim/index.ts`, `src/pilot/main.ts`, `src/pilot/pilot.css`: the pilot page wiring.

If you need a change in any of these, say so in your report instead of editing them.

## Your file

You get one staging file, `src/pilot/anim/<key>-<id>.ts`, plus a CSS file of your own that it imports, `<key>-<id>.css`. Replace the placeholder and keep `export const STAGING: Staging`.
- `svg()` returns the inner markup for `viewBox="0 0 1600 740"`.
- `bind(stage)` runs once and returns `draw(beat, t)`. The player calls `draw` every frame; `t` is the number of seconds since the beat began.
- Scope every CSS rule under `.ani-<key>-<id>`. The player puts that class on the root, together with `theme-editorial`, so the slide-2 classes `.f2-*` from `figs/s2.css` also apply.

## Hard rules for the motion

1. **Stepped.** Each beat's motion plays once in about 3–6 s, then holds a still that the lecturer can talk over. A subtle ambient drift is fine, such as wave phase travelling along a beam, if the still stays readable.
2. **Stateless.** `draw(beat, t)` must depend only on `beat` and `t`, never on what was drawn before. Then Back, the dots and the screenshot URL all show the right state.
   - A beat that continues the previous scene starts from that beat's end state. For example, the camera at `t = 0` of beat 3 equals beat 2's final camera.
   - `draw(beat, 99)` is the beat's end state.
3. **One idea per beat.** The stage shows the beat's caption, never repeats it. On-stage text is labels only, 1–4 words each, at least 22 px (it must read in a lecture hall), and never a sentence.
4. **No citations on the stage.** The player shows them under the caption.

## Style: the slides' style, not the old dark stage

- **Paper.** The stage background is the Bristol paper itself. Never paint a full-stage background; scene parts (sky, sea, Earth) are fine.
- **Fonts.** Inter for labels. Newsreader only for a rare display word.
- **Colours:**
  - ink `#141413`, secondary `#3d3d3a`, muted `#6b6a64`, rules `#c9c6bb`
  - light: blue `#2350e6`, green `#2a963a`, red `#c8361e`
  - Sun `#f7c948` with stroke `#e3a51c`; leaf `#cfe3b4` with stroke `#6f9a5a`
  - air atoms: N `#e4e2ea` / `#8f8aa3`, O `#f4cc4f` / `#b8902a`
  - absorbed-light glow: amber `#f0a316`
  - accent: `#a9532f`
- **Reuse the slide drawings** from `src/pilot/figs/s2.ts`, so the animation looks like the slides:
  - `sun`, `eye`, `leaf`, `airMol`
  - `wv` (a wave of one colour with its true relative wavelength) and `beam` (white light as blue, green and red waves side by side)
  - `defs(prefix)`, `T`
  - Spectrum colours come from `spec(nm)` in `src/lib/colour.ts`.
- **Mood.** Calm, physical motion, illustrated like the slide figures. No cartoon faces and no emoji.
- **Layout.** Balanced, with even margins of about 60 px, and nothing crowded at the top.

## Checking your work

The dev server is already running at http://localhost:5174; do not start another. Open your own browser tab with `preview_start` and a `url`, and pass its `tabId` on every call, because other agents share the pane. Close your tab at the end.

- `http://localhost:5174/pilot.html?anim=<key>&v=<id>&beat=<n>&t=<s>` shows beat `n` (0-based) at full size, frozen at `t` seconds. `t=99` gives the end state.
- Leave `t` out to watch the motion live.
- Screenshot every beat's end state and one mid-motion frame per beat. Check for label overlaps, legibility at 1600 px, balance, and physical correctness.
- `npx tsc --noEmit` must pass.

## Report

Per beat, give what the stage shows and the motion. Then list every physical or design choice the lecturer should know about, any change you need in a shared file, and where your screenshots are. Do not commit.

## Round 2 (26 Oct 2026): from the B variants, faster and more cohesive

The lecturer prefers both B variants ("Zoom journey", "Through each eye"). Round 2 builds two new variants of each, C and D, in the B direction. The pilot lists B (reference), C and D; A stays in the code but is unlisted.

**Lecturer feedback that applies to all four:**
1. **Much faster.** "I don't have much time to wait."
   - Every beat's motion finishes within about **2.5 s**: camera moves at most 1 s, the beat's own action at most 1.5 s.
   - Overlap staggered elements instead of queueing them.
   - No slow wave drift that the eye waits for.
2. **Remove filler.** No "not to scale". No label that does not name something the student must look at; when in doubt, leave it out.
3. **Cohesive.** One continuous story with one subject the eye follows, not separate tableaux.
4. **Explain on screen, briefly and visually.** Whatever a beat contrasts must be self-explanatory on the stage, e.g. what "two cones vs three cones" means, and what a false-colour view shows. Use short labels like "2 cone types" or "ultraviolet shown as purple", never sentences.
5. **No camera roll** beyond about 15°.

**Captions changed in beats.ts.** Read them again:
- Trees: "Most mammals have two cone types, so red and green look alike to them. Primates evolved a third…"
- Bees: "…but not red".
- The last beat is now **"So why?"**: each creature uses its own slice of the spectrum. What physical property of light decides which slice a creature can use? The next slide answers: photon energy.
  - The final still must therefore show the **differences** between the slices: us, bee, plants as rows on one wavelength axis, the bee shifted into ultraviolet and the plants reaching far-red, plus a "?".
  - No overlap column, no nm values, and no hint of the answer (no "energy").

## Round 2, final spec (v5, approved 26 Oct 2026). This replaces the round-2 notes above where they differ.

Read `ORDER_PROPOSAL.md` v5 first: the whole light block is one chain of questions, and each animation does exactly one step of it. **Interesting but few concepts.** Anything the chain does not need stays out.

**Captions.** `SKY` (4 beats) and `LIFE` (5 beats) in beats.ts are the v5 captions. The A and B variants keep `SKY_R1` / `LIFE_R1` through `Staging.beats`. C and D use the animation's own beats, so set no `beats` field.

**Sky, 4 beats: Sunlight → In the air → Blue sky → Sunset.**
- "Earth turns" and "Red Sun" are now one Sunset beat: Earth turns, the path through the air lengthens, blue peels off, and the Sun turns orange-red, all within about 2.5 s.
- No N₂/O₂ labels.
- In "In the air", a **Rayleigh newspaper clipping** pops in beside the scattering for the rest of the beat. Use `clipping()` from `src/pilot/figs/clipping.ts`, the shared newspaper cutout with the restyled public-domain portrait.

**Life, 5 beats: In the sea → On land → Bees → Plants → So why?**
- **One journey.** The early fish swims in blue-green water. At "On land" it crawls ashore and morphs quickly along our lineage: fish → four-legged animal → small mammal → monkey. At "Bees" the monkey looks at flowers and a bee flies in as its own animal; **never morph into the bee**. At "Plants", a leaf. At "So why?", rows for us, the bee and plants on one wavelength axis show how the slices differ, plus a "?".
- **Eyes instead of jargon.** Each viewer's eye is drawn with its light-sensitive cells as coloured dots, one colour per kind:
  - small mammal: 2 kinds (blue, yellow-green)
  - monkey: 3 kinds (blue, green, red)
  - bee (compound eye): 3 kinds (ultraviolet shown as purple, blue, green), with no red
  - leaf: its chlorophyll glows where it catches blue and red
  - When light arrives, the dots that catch it light up. No "cone", no sensitivity curves, no nm values.
- **Labels allowed:** "most mammals", "primates", "as we see it", "as a bee sees it", "ultraviolet shown as purple", "us", "bee", "plants", and "?".
- **Plants:** chlorophyll only. No red algae, phycoerythrin, chlorophyll f or far-red.

## Round 3 (26 Oct 2026, approved fix plan). This overrides everything above where they differ.

The lecturer reviewed sky C and life C. These are the problems to fix:
- too much moved;
- no pause when the scene changed (Earth turning straight into the sunset view, "how can I talk?");
- pictures that don't explain themselves;
- undefined symbols.

**Beats** (read beats.ts again):
- **SKY has 5:** Sunlight · In the air · Blue sky · Earth turns · Sunset.
- **LIFE has 6:** In the sea · On land · Primates · Bees · Plants · So why?

**Hard rules:**
1. **One scene or idea per beat, then hold.** A scene change, such as globe to ground view, or small mammal to monkey, always starts a new beat (a click). Never chain two scenes in one beat.
   - Sky: "Earth turns" shows the globe turning, the observer reaching sunset and the path through the air lengthening, then holds. "Sunset" zooms to the observer's sunset view: blue peels off, the Sun turns orange-red, hold.
   - Life:
     - "On land": the fish crawls ashore and morphs to the small mammal, which sees with 2 kinds of cells, and the tree turns olive. Hold, labelled "most mammals".
     - "Primates": the small mammal morphs to the monkey, the dots split into green and red, and the fruit turns red. Hold, labelled "primates".
2. **Only what teaches moves:** light travelling, scattering, a colour changing, a creature morphing. Static things appear whole, in a short fade of at most 0.3 s:
   - cards, insets and clippings;
   - the prism spectrum (no fanning in);
   - labels;
   - scenery.
3. **Each beat's motion lasts at most about 2.5 s**, then holds.
4. **Every picture explains itself.** Label each thing a student must read, the first time it appears. Labels are 1–4 words, at least 22 px. Examples:
   - "sunlight", "air molecules", "you"
   - the spectrum card: "ultraviolet · visible · infrared"
   - a colour key the first time coloured waves mean colours of light, e.g. "blue light" / "red light" on the waves
   - in the sea: "red light", "blue-green light" on the descending waves
   - the eye close-up: "light-sensitive cells", once
   - the compound eye: "ultraviolet shown as purple"
   - the bee lens: "as a bee sees it"
   - the leaf: "chlorophyll"
5. **Symbols are defined where they appear.** The shared clipping now carries its key ("λ: wavelength"); keep its full height with `clipHeight(w, RAYLEIGH_CLIP)`.
6. **"So why?" rows** sit on a labelled wavelength axis. Its sections are labelled "ultraviolet", "visible", "infrared", plus the word "wavelength". **Each row shows only its own slice:**
   - us: visible only;
   - bee: ultraviolet to orange, none in red;
   - plants: chlorophyll's blue and red strongly, green weakly.

   The differences must read at a glance. No nm values, no overlap column, plus a "?".
7. **No "not to scale"** and no other filler. No camera roll beyond 15°.

## Round 4 (26 Oct 2026, approved). This overrides earlier timing rules.

The lecturer's verdict on round 3:
- Sky C was far too fast: "the zoom journey only needs to be a bit faster".
- Life C had the better animals, life D the better layout.
- All animations should be **zoom-in style**.
- The monkey must be gone when the bee comes.
- The drawn pink tongue clashed with the portrait. It is being redone as a halftone photo change; `clipFx` keeps its API.

**Pace.** Use sky B's pace, about 1.5× faster: roughly **4–5 s of motion per beat** (camera moves about 1.5–2 s, then the action). Each beat still holds when its motion ends. Do not go faster than this.

**Kept from round 3:**
- one scene per beat, with a hold;
- static things (cards, insets, windows, labels, scenery) appear whole, in a short fade;
- every picture explains itself, with labels of at least 22 px;
- no "not to scale";
- v5 captions in beats.ts (SKY 5 beats, LIFE 6 beats);
- the Rayleigh wink and Einstein teaser through `clipFx` (Einstein in life uses `EINSTEIN_TEASER`).

**The new variants:**
- **Sky E · Zoom journey, tuned** (`sky-e.ts`). Copy sky B's staging and camera exactly, with these changes:
  - speed it up about 1.5×;
  - use the SKY captions (5 beats; B's "Red Sun" is now "Sunset");
  - add the Rayleigh clipping with its wink in "In the air";
  - add round 3's labels: "sunlight", a stacked colour key "blue light / green light / red light", "air molecules", "ultraviolet · visible · infrared" on the prism card, and "midday" / "sunset" in Earth turns, with "you" kept;
  - drop "not to scale" and "N₂"/"O₂".
- **Life F · Zoom to the scene** (`life-f.ts`). Use life D's side-by-side windows, each with its eye of light-sensitive cells, and life C's animals (fish, four-legged animal, small mammal, monkey, bee).
  - The camera zooms into each scene in turn: sea → shore → fruit tree → flower → leaf → rows.
  - The two windows appear beside the scene.
  - The monkey leaves before the bee arrives.
- **Life G · Zoom through the eye** (`life-g.ts`). The same animals and windows content as F, but the camera dives into the creature's eye, and the window opens as what that eye sees, with its light-sensitive cells.
  - Then the camera pulls back out to the next scene.
  - The monkey leaves before the bee arrives.
  - "most mammals" and "primates" end side by side, as in D.

## Process rule (26 Oct 2026): never break the shared page

The lecturer browses the pilot page while you work. **Never save a half-finished file into the project.**
1. Copy the files you change to a scratch folder and edit and type-check them there.
2. Copy them back only when they compile: the CSS first, then the TS, each in one step.
3. Check that the project files did not change under you before you copy back.

## Round 5 (26 Oct 2026): two new animations, "Why pigments differ" and "Fates of an excitation"

The scripts are in `ANIM_PIGMENTS_FATES.md` (approved); the captions are `PIGMENTS` (5 beats) and `FATES` (6 beats) in beats.ts.
- **Keys and stagings:** `pig` (played from slide 4b) has pig-a and pig-b; `fates` (played from slide 12) has fates-a and fates-b.

**Everything the lecturer has asked for so far applies:**
- **Pace:** zoom-in style at the E/F pace, about 4–5 s of motion per beat, camera moves about 1.5–2 s; then hold.
- **One scene per beat:** a scene change starts a new beat.
- **Only what teaches moves:** cards, labels and scenery appear whole in a fade of at most 0.3 s.
- **Every picture explains itself:** labels of 1–4 words, at least 22 px; symbols defined where they appear; axes with quantity and unit.
- **No filler:** no "not to scale" and no filler labels.
- **Never a blank stage:** cross-fade between scenes.
- **Styling:**
  - Bristol paper.
  - Light as wave packets in the deck's colours: blue `#2350e6`, green `#2a963a`, red `#c8361e`, plus amber `#f0a316` for an excitation.
  - Heat as a grey wavy arrow.
  - Fluorescence as a red wave.
  - Triplet in clay; photochemistry in green, as on slide 12.
- **Precision:**
  - Chl a peaks are 430 and 662 nm, Chl b 453 and 642 nm, in solvent.
  - β-carotene absorbs about 400–500 nm.
  - S₂→S₁ takes < 1 ps, charge separation < 100 ps, the S₁ lifetime is about ns, the triplet lives µs and longer, and fluorescence is at about 685 nm.
  - The "room" model (Kuhn 1949) is a stated simplification: draw the conjugated system as the electrons' room, not real orbitals.
- **Molecule drawings:** simple and recognisable skeletal sketches.
  - Chlorophyll: a ring of four small rings with Mg at the centre, and its tail.
  - β-carotene: a long zig-zag chain with a ring at each end.
  - The 3- and 5-double-bond chains: short zig-zags.
  - Highlight the conjugated path in amber.
- **Process:** work in a scratch copy and copy back only when it compiles (see the process rule above).
