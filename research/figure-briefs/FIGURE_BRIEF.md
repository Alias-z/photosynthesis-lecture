# Figure brief: what each slide must deliver, and how to draw it

Prepared 23 October 2026 for the style pilot (`pilot.html`). Slides 2, 5 and 6 rest on lecturer-confirmed context. Slides 9, 12 and C5 rest on draft context whose facts were checked in `research/review-2026-10-23-claude/`. Use no number that is not listed here.

## Method

1. **Core first.** For each slide: at most three things a student must leave with, the misconception to block, and a one-line hook to remember.
2. **Then the picture.** Each concept is a different visual idea for the same core, not a re-layout. A good figure makes the core visible without the text: you can point at it and say the take-home.
3. **One visual vocabulary for the whole deck**, so meaning carries from slide to slide.

## Shared visual vocabulary

| Thing | Drawing | Notes |
|---|---|---|
| Light as colour (spectra, sky, leaf) | Wavy line in its own colour: blue `#2350e6`, green `#2a963a`, red `#c8361e`; white light = three waves together | Colour only for light |
| Light as energy input to a photosystem | Amber lightning bolt | From the MSc thesis figure |
| Excitation energy in an antenna | Amber glow dot hopping between pigments | Never drawn as e⁻ |
| Electron | Red dashed arrow, `e⁻` label | Thesis style |
| Proton | Small white ball, blue outline, `H⁺` | |
| Carbon atom | Dark bead; molecules as atom balls (O yellow, C orange-red, H white) | |
| ATP / NADPH / Pᵢ | Orange tag / blue tag / orange ball | |
| PSII, PSI | Green blobs (antenna lighter) | |
| Cytochrome b₆f | Orange | |
| ATP synthase | Purple head, blue stalk | |
| Rubisco | Warm grey block | |
| Heat | Grey wavy line | |
| Danger (singlet oxygen) | Clay-red box | |
| Stroma / lumen | Stroma above, lumen below, lipid bilayer between | |

Never use colour as the only code; every coloured element also has a label or a distinct shape. Figures live on an 800 × 600 grid, with labels at least 22 px, a 15 px minimum for tiny notes, and no overlaps.

## Slide 2 · Why is the sky blue, and why are leaves green? (confirmed)

**Core**
1. The colour we see is the light that reaches our eye.
2. Sky: air molecules **redirect** (scatter) short wavelengths more strongly, ≈ 1/λ⁴. 450 nm blue is scattered about 4.4× more than 650 nm red. The wavelength is unchanged.
3. Leaf: pigments **remove** (absorb) blue and red, so the light coming back is relatively green.

**Hook:** *Air redirects light. Leaves remove light.* The same sunlight meets two interactions.

**Block:** "air turns light blue" (it redirects, never converts); "leaves reject green" (they absorb much of it, just less).

**Constraint (confirmed):** one large photograph, the question as the only title, little text. The PDF still needs the answer in small print.

**Concepts**
- **2A Annotated photo:** the photograph dominant, with two quiet tags, one on the sky ("scattered sunlight: rich in blue") and one on a leaf ("returned light: rich in green").
- **2B Redirect vs remove:** a diptych from one Sun. Left: air molecules send blue sideways to an eye. Right: a leaf absorbs blue and red and returns green to an eye.
- **2C Spectrum chips:** the photo with two small spectrum bars, showing what reaches the eye from the sky (blue-heavy) and from the leaf (green-heavy).
- **2D Photo plus mechanism strip:** the photo on top, with a slim strip below holding two tiny mechanism icons (scatter | absorb).
- **2E Two questions, two answers:** the photo split into sky half and leaf half, each with its own question mark and a one-line answer.

Photo: `src/assets/leaf-sky.jpg`, W.carter, CC BY-SA 4.0. Credit it in the sources line.

## Slide 5 · Why are leaves green? (confirmed)

**Core**
1. Chlorophyll absorbs blue and red strongly and green weakly, so the light that comes back is enriched in green.
2. Green is still used. Leaves absorb 50–90 % of green light (versus 80–95 % of red and blue), and green reaches deeper cells.
3. Pigments divide the spectrum: Chl a (430, 662 nm in solvent), Chl b (453, 642), β-carotene (450). Red algae add phycoerythrin, which catches green (≈ 540–565 nm).

**Hook:** *Green is what is left over, not what is useless.*

**Block:** "leaves reflect all green" and "green light does nothing".

**Concepts**
- **5A Subtraction:** a white-light spectrum bar, minus the pigments' absorption "bites" (blue and red), leaves a green-rich remainder that travels to the eye.
- **5B Leaf cross-section:** blue, red and green photons enter. Blue and red are absorbed in the top cells; green goes deeper, scatters, is mostly absorbed lower down, and some comes back out.
- **5C Absorbed vs returned:** the pigment rows (the version the lecturer liked), topped by one "what comes back" curve with a schematic green peak.
- **5D Pigment palette:** cards for Chl a, Chl b, carotenoid and phycoerythrin, each with its absorption bands on a mini spectrum, combining into "together they cover more".
- **5E Rows:** the liked "one row each" spectra, polished.

## Slide 6 · Light-harvesting complexes (confirmed)

**Core**
1. Many pigments feed one reaction centre: antenna proteins hold the pigments so that absorbed energy hops to the reaction centre.
2. In the antenna only energy moves; at the reaction centre an electron moves (charge separation).
3. Chl a and Chl b differ by one group (–CH₃ / –CHO), so they absorb different colours. Chl b-rich LHCII (a:b ≈ 1.3) feeds PSII; Chl a-rich LHCI (a:b ≈ 3.7, red forms absorbing beyond 700 nm) feeds PSI.

**Hook:** *A funnel: many pigments collect, one centre converts.*

**Block:** "electrons run through the antenna" and "every chlorophyll does photochemistry". Emerson & Arnold found ≈ 2,500 chlorophylls per CO₂ fixed per flash.

**Concepts**
- **6A Energy funnel:** a side view of an energy landscape. Chl b pigments sit on the rim (higher energy), Chl a lower, the reaction centre at the bottom. A glow dot runs downhill; at the bottom an e⁻ leaves.
- **6B Relay:** a line of pigments passes a glowing energy packet to the reaction centre, which then sends out an electron. The baton is energy; only the finish line moves an electron.
- **6C Top view:** a structure-like top view of PSII–LHCII and PSI–LHCI with arrows converging on the reaction centres (refine the current one).
- **6D Two parts:** "Different colours" (the Chl a/b structures beside their absorption peaks) and "One destination" (antenna to reaction centre).
- **6E Membrane side view in thesis style:** LHCII trimers beside PSII and the LHCI belt beside PSI. Amber bolts in, glow hops across, an e⁻ out at each reaction centre.

## Slide 9 · Electron transport (draft; checked facts)

**Core**
1. Electrons flow from water to NADP⁺. PSII takes them from water and releases O₂ (Mn₄CaO₅ cluster; 2 H₂O → O₂ + 4 H⁺ + 4 e⁻). PSI delivers them via Fd and FNR to NADP⁺.
2. Two light-driven boosts work in series (the Z-scheme). Both photosystems absorb at the same time.
3. Electron flow loads the lumen with protons (from water splitting and the b₆f Q cycle). Protons flowing back through ATP synthase make ATP on the stroma side. Outputs: O₂, NADPH, ATP.

**Hook:** *Two light-powered lifts for electrons; a proton dam that turns a turbine.*

**Block:** "light splits water directly" (P680⁺ oxidises it); "ATP is made in the lumen"; "PSII fires, then PSI waits".

**Concepts**
- **9A Three flows:** a minimal membrane carrying only three colour-coded flows: amber photons into PSII and PSI, a red e⁻ path from water to NADPH, and a blue H⁺ path into the lumen and back out through ATP synthase. Inputs on the left, outputs on the right, few labels.
- **9B Lifts and dam:** an analogy panel. Two lifts raise an electron in two stages joined by a downhill chute; a dam holds protons and drives a turbine (ATP synthase). Each analogy part carries its real name.
- **9C Z with real icons:** the classic Z-scheme on an energy axis, with each node drawn as its complex (green photosystem blobs, orange b₆f, PC disc). Bolts mark the two lifts, protons drop from b₆f, and NADPH sits at the end.
- **9D Machine:** the thylakoid as one machine box. In: light ×2, H₂O, NADP⁺, ADP + Pᵢ. Out: O₂, NADPH, ATP. Inside, three numbered steps. No stoichiometry numbers.
- **9E Four-panel strip:** ① light excites PSII; water gives electrons; O₂ out. ② Electrons pass PQ → b₆f → PC; protons are pumped. ③ Light excites PSI; NADP⁺ is reduced. ④ Protons flow back through ATP synthase, making ATP.

## Slide 12 · Fates of an excited chlorophyll (draft; checked facts)

**Core**
1. An excited chlorophyll must lose its energy within nanoseconds; the exits compete.
2. Photochemistry is the fastest exit (< 100 ps) and wins when reaction centres are open. Heat (NPQ) is the adjustable safety valve. Fluorescence (≈ 685 nm) is the small leak that reports on the others.
3. If energy is not used, a long-lived triplet can form and turn O₂ into singlet oxygen. Carotenoids quench both. A blue photon's extra energy is lost as heat in < 1 ps, so photosynthesis counts photons, not energy.

**Hook:** *A tank with four drains:* a big pipe to work (photochemistry), a valve you can open (NPQ heat), a small visible leak (fluorescence), and a slow drip into a toxic bucket (triplet → ¹O₂).

**Block:** "fluorescence is lost photosynthesis" (it is a tiny readout); "blue light does more work per photon".

**Concepts**
- **12A Tank with drains:** the metaphor, mapped label by label to the real processes, with small time tags.
- **12B Levels + times:** the classic Jablonski diagram with time badges, cleaner than before.
- **12C Levels + clock:** the numbered diagram beside a vertical log-time ruler, refined.
- **12D Open vs closed:** the same excited state shown twice. Reaction centres open: photochemistry dominates. Reaction centres closed: more heat and fluorescence, and triplet risk. This shows why fluorescence reports on photosynthesis.
- **12E Race lanes:** exits as lanes on a log time axis, with a small diagram heading the lanes.

## Slide C5 · Carbon fixation and photorespiration (draft; checked facts)

**Core**
1. Rubisco attaches CO₂ to RuBP (5 C), giving 2 × 3-PGA (3 C).
2. ATP and NADPH from the light reactions reduce PGA to triose phosphate. Of every 6 triose-P, 5 rebuild RuBP and 1 leaves as sugar: 3 CO₂ in, 1 triose-P out, for 9 ATP + 6 NADPH.
3. Rubisco also reacts with O₂, giving 2-phosphoglycolate. Photorespiration recovers 3 of every 4 carbons and loses 1 as CO₂, at an energy cost. Per oxygenation: 3.5 ATP + 2 NADPH, −0.5 C. Per carboxylation: 3 ATP + 2 NADPH, +1 C. A = Vc − 0.5 Vo − Rʟ.
4. FvCB: the rate is set by the slower of Rubisco (CO₂ supply, Vcmax) and RuBP regeneration (electron transport, J); triose-phosphate use (TPU) can cap it at high CO₂.

**Hook:** *3 in, 1 out*, and *Rubisco cannot fully tell CO₂ from O₂*.

**Block:** "the cycle makes glucose directly" (it exports triose phosphate); "photorespiration is pure waste" (it salvages 3/4 of the carbon).

**Concepts**
- **C5A FvCB scheme:** the MSc-thesis Fig. 2b redrawn cleaner, with fewer labels, the shared vocabulary and colour-coded limits.
- **C5B Three-station wheel:** stations Rubisco → reduction → regeneration around a circle, carbon beads showing 15 + 3 = 18 = 6 × 3, one triose-P leaving, and fuel tags at each station.
- **C5C Rubisco's two doors:** Rubisco in the centre. The CO₂ door leads to 2 PGA (gain); the O₂ door leads to PGA + 2-PG, then photorespiration (lose 1 C in 4). Costs are shown at each door.
- **C5D Bottlenecks:** a pipeline with valves labelled Rubisco (Vcmax), regeneration (J) and export (TPU), beside a small A/Ci curve coloured by which valve limits where.
- **C5E Assembly line:** a conveyor running CO₂ in → Rubisco → reduction → out, with recycled RuBP returning underneath; 1 of 6 boxes leaves as sugar.
