# Slides 3 and 4: five figure variants each (26 Oct 2026, approved fix plan)

Read first, in this order:
1. `ORDER_PROPOSAL.md` v5: the logic.
2. `GENERAL_RULES.md`.
3. `LIGHTER_BRIEF.md`.

The lecturer's new rules:
- **The figure explains itself.** Define every symbol where it appears. Give every axis its quantity, unit and tick values. Name every drawn thing a student must read. Spell out ultraviolet and infrared (no "UV"/"IR").
- **No repeats.** The page text is terse and fixed in each slide's PLATE (do not change it); the figure must not repeat it verbatim.
- **Balanced.** Use the whole 800 × 600 figure with even margins, no empty corner beside a crowded one, and labels of at least 19 px (the deck's figure text is 22 px).
- **Style.** Use the deck's existing figure helpers and classes in the slide's module, and the shared newspaper clipping `clipping()` from `figs/clipping.ts` (portrait, name, year, finding, symbol key). Its height is `clipHeight(w, CLIP)`.

## Slide 3 · Light is a wave (`l03.ts`, `l03.css`)
**PLATE:**
- lead: "Light is an electromagnetic wave; its wavelength (λ) sets its colour."
- points:
  1. Sunlight is a mix of wavelengths: ultraviolet · visible · infrared.
  2. Human vision: 380–780 nm; PAR (photosynthetically active radiation): 400–700 nm, by convention.
  3. Air scatters blue ~4× more than red: blue sky by day, red Sun at sunset.

**Every variant must show:**
- **What a wavelength is:** a wave with λ marked crest to crest. Blue and red waves side by side, drawn to their true ratio (450 : 650 nm), make the colour–wavelength link visible.
- **The spectrum on a wavelength axis** labelled "wavelength (nm)", with tick values (e.g. 300, 400 … 800). The sections are labelled "ultraviolet", "visible", "infrared". There are brackets for "human vision" and "PAR".
- **Scattering:** air scatters short wavelengths more, with a key so it reads alone (e.g. blue light scattered in all directions, red light mostly passes, around "air molecules").
- **Rayleigh's clipping** with `RAYLEIGH_CLIP`.

## Slide 4 · Light is also a particle (`l04.ts`, `l04.css`)
**PLATE:**
- lead: "Light comes in packets of energy: photons."
- points:
  1. Shorter wavelength, more energy per photon (a blue photon ~1.4× a red one).
  2. The energy decides the effect: ultraviolet breaks bonds · visible lifts electrons · infrared warms.
  3. Brighter light = more photons, not more energetic ones.

**Every variant must show:**
- **A photon as a packet:** a short wave packet labelled "photon".
- **An energy axis:** "energy per photon (eV)", with tick values and the note "eV: electronvolt".
- **Four photons:** ultraviolet 300 nm, blue 450, red 650 and infrared 1000 nm. Each is drawn with its true relative wavelength, with its energy from E = 1239.84 eV·nm / λ (4.1, 2.8, 1.9, 1.2 eV).
- **What each can do,** as small pictures labelled with the object, not the point's sentence: "DNA" with a broken bond, "electron in a pigment" lifted between two levels, "heat".
- **Einstein's clipping** with `EINSTEIN_CLIP`. Its key defines h and c; λ is defined on slide 3, so it may stay unexplained here.
- Optionally, "brighter = more photons" as two beams with 2 vs 6 photons of the same colour, if it fits without crowding.

## Variants
- Make **five variants per slide**: ids **p, q, r, s, t**. Rework the existing p and q to meet these rules, and add r, s, t.
- Each variant takes a clearly different layout or emphasis. Give each a short name that says what it tests.
- List exactly these five in `VARIANTS`. Old variants stay drawable by id.

## Check
- Look at every variant at full size, both handout and lecture versions: `pilot.html?solo=3&v=p` and `?solo=lecture-3&v=p`.
- Check for overlaps, legibility and balance, and that every symbol and axis is explained.
- `npx tsc --noEmit` must pass.
- Edit only your slide's .ts and .css, plus the PLATE `VARIANTS` list. Do not commit.
- Report the five variants (name, what each tests) and your screenshot paths.

## Round 2 (26 Oct 2026, approved): five variants from the lecturer's picks, 3S and 4R

**The lecturer picked 3 · S "Scattering curve" and 4 · R "Energy against wavelength".** Build five new variants of each **from that pick**: ids **u, v, w, x, y**. List the pick first (s or r), then u–y; the other old ids stay drawable but unlisted.

**Text changed in each PLATE: the claims are now themes.**
- Slide 3:
  - Electromagnetic spectrum
  - Visible light and PAR
  - Rayleigh scattering
- Slide 4:
  - Photon energy
  - Energy decides the effect
  - Light intensity

Do not change the text.

**Problems to fix.** The lecturer and I found these in the picks:
1. **Too crowded.** Fewer pieces, bigger. Drop anything that repeats: in 3S the separate λ = 450 / 650 nm waves repeat the curve's blue and red points.
2. **Slide 3: put the scattering drawing on top of the graph,** above the scattering curve it explains, not at the bottom. The drawing shows sunlight hitting air molecules, blue scattered in all directions and red mostly passing.
3. **Slide 3: mark the ranges clearly on the figure** as shaded bands or strong brackets, labelled "human vision" (380–780 nm) and "PAR" (400–700 nm). Also mark the algal use beyond PAR: "far-red: some cyanobacteria" over 700–750 nm (Gan et al. 2014). Spell out every label.
4. **Slide 4: the DNA icon must look like DNA** (a double helix with base-pair rungs) and must show the break, labelled **"DNA damage"**. The other effects are labelled **"electron excited"** (the pigment electron lifted between two levels) and **"warming"**, effects rather than objects.
5. **Keep everything that made the pick good:**
   - 3S's scattering curve over the wavelength axis;
   - 4R's energy-against-wavelength curve with the four photons;
   - the clippings;
   - symbol definitions and axis labels.

**Variation axes.** Make each of the five clearly different: where the clipping sits; how the ranges are marked (bands under the curve, bands on the axis, brackets); where the effect icons sit (along the curve, under the axis, beside the photons); how big the drawing above is.

**Process: important, other agents share the dev server.**
- Write each new file completely in one step.
- Create a .css before any .ts imports it.
- Never leave the project failing to compile between edits, because a half-written file breaks the whole pilot page for the lecturer.

**Check.**
- Full-size handout and lecture versions of every variant (`?solo=3&v=u`, `?solo=lecture-3&v=u`).
- `npx tsc --noEmit` passes.
- Do not commit.
