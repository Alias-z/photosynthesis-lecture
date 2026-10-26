# Order of the light block: proposal v2, 26 Oct 2026 (follows the lecturer's story; awaiting approval; nothing changed in the deck)

## The lecturer's story

1. The question: a photo of a blue sky (and green leaves).
2. The physics: the Sun–Earth animation. Sunlight is a mix of wavelengths; the atmosphere scatters it; the sky is blue and the sunset red.
3. Life: an animation from the sea to primates' red–green vision, then to plants.
4. The band: what we see (380–780 nm) and PAR (400–700 nm).
5. Back to pigments: why leaves are green, then chlorophyll and antennas.

## Pages and animations

| # | Lecture (live) | Handout (PDF) | Comes from |
|---|---|---|---|
| 2 | Lead: photo, "Why is the sky blue, and why are leaves green?" | none | lead 2A |
| ▶ | **Animation 1, "Sunlight and the sky"** (≈ 38 s, script below) | — | restyled from `src/slides/skyAnimation.ts` (original kept) |
| 3 | **Why the sky is blue:** Rayleigh 1/λ⁴, why blue and not violet, sunset | same | Rayleigh and sunset half of current slide 4 |
| ▶ | **Animation 2, "Who uses which light?"** (≈ 33 s, `ANIM_WHO_SEES.md` v3) | — | script v2, trimmed |
| 4 | **The solar spectrum:** vision 380–780 nm, PAR 400–700 nm, far-red | same | current slide 3 |
| 5 | **Light comes in photons:** E = hc/λ; why life uses about 400–700 nm | same | Einstein half of current slide 4 (variant 1 only) |
| 6 | Why leaves are green | same | current slide 5 |
| 7 | Light-harvesting complexes | same | current slide 6 |

Later slides move up by one. 2A "Redirect vs remove" has no place in this story; it stays drawable but leaves the order.

## Where the photon idea goes (the one open choice)

Animation 2 ends on "which band, and why that one?". Slide 4 answers *which*. *Why* is photon energy:
- 400 nm photons carry 3.1 eV and 700 nm photons 1.8 eV. That is enough to lift an electron in a pigment, but below most covalent bonds (C–C ≈ 3.6 eV).
- UV-B photons (280–315 nm, ≈ 4 eV) damage DNA directly.
- Beyond ≈ 750 nm, photons carry too little energy for the photosynthesis that splits water. Some bacteria use infrared up to ≈ 1000 nm, but they do not split water.

**Variant 1 (recommended): its own slide 5,** between the spectrum and the pigments. The pigment slide then builds directly on "one photon lifts one electron".

**Variant 2: folded into slide 4,** one page fewer. Slide 4 would then carry vision, PAR and photon energy, so its far-red point moves to slide 6.

## Animation 1, "Sunlight and the sky": draft script (do not build)

Bristol paper and our fonts. It keeps the original's calm Earth rotation and sunlight.

| # | Beat (s) | Picture | Caption |
|---|---|---|---|
| 1 | Sunlight (6) | The Sun at left; a white beam travels to Earth. A lens on the beam spreads it into the spectrum, ultraviolet to infrared. | Sunlight is a mix of wavelengths, from ultraviolet through visible light to infrared. |
| 2 | In the air (9) | The lens moves to the atmosphere: molecules, waves passing. Blue waves bounce off in all directions; red mostly passes. | Air molecules are over a thousand times smaller than these wavelengths. They scatter short wavelengths far more: blue about 4.4 times more than red. |
| 3 | Blue sky (7) | Scattered blue reaches an observer from every direction. | Scattered blue reaches you from the whole sky, so the sky looks blue. |
| 4 | Earth turns (8) | The Earth rotates; the observer moves to the terminator. A bracket marks the long path through air. | At sunset, sunlight crosses almost 40 times more air to reach you. |
| 5 | Red Sun (8) | Blue leaves the beam along the path; the Sun turns orange-red. | Most of the blue is scattered out of the beam on the way, leaving red and orange. |

**Wording:** the captions say *scatter*, not *filter*. Scattering redirects light; it does not remove it. The atmosphere does filter in two places, ozone absorbing ultraviolet and water vapour absorbing parts of the infrared. That would be one optional 4 s beat.

Checks:
- An N₂ molecule is about 0.36 nm across, about 1250 times smaller than 450 nm light.
- (650/450)⁴ = 4.35.
- Air mass at the horizon is about 38 (Kasten & Young 1989).

## The physics behind this order

- **The sky needs only the spectrum and Rayleigh.** Scattering by molecules much smaller than the wavelength rises as 1/λ⁴. This is wave physics (Rayleigh 1871, *Phil Mag* 41:107), 34 years before Einstein's photons (1905). That is why the photon idea waits until the pigments.
- **Why blue, not violet.** Skylight holds about as much violet as blue, yet our cones see the mix as pale blue (Smith 2005, *Am J Phys* 73:590). This can be point 2 on slide 3.
