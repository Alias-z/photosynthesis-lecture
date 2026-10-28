# Lecture 2, slides C9–C10: the CO₂ path into the chloroplast (chunk cp, 28 Oct 2026)

Crops and resizes with PIL from files in `scratchpad/cp/fetched/` (downloaded from PMC, Springer Nature media, Wikimedia Commons and WUR edepot) and from the board `refs/C3-gas-exchange/`. Nothing is painted over except where stated. Crop boxes are in pixels of the source file, x then y. Every figure carries its own credit line in small grey type; panel letters are left out by the crop or whitened (stated per file).

## Numbers used on the slides and figures

- Typical values at 25 °C (indicative, order of magnitude): Cₐ 420, Cᵢ 300, Cc 200 µmol mol⁻¹; g_sc 0.25, g_sw 0.4, g_m 0.3, g_bc 1–2.5 mol m⁻² s⁻¹; g_sw = 1.6 g_sc; g_bw = 1.37 g_bc. Busch FA, Ainsworth EA, Amtmann A, et al. (2024) A guide to photosynthetic gas exchange measurements. *Plant Cell Environ* 47: 3344–3364, https://doi.org/10.1111/pce.14815, **Table 1** and **Box 2** (CC BY 4.0; read in full, Glasgow eprint).
- Open-system equations (Busch et al. 2024, Box 1, Eqs 3 and 5; Box 2, Eqs 9–11), shown simplified on C9 v8 and v9 (dilution by transpired water, boundary layer and ternary correction left out; said so on the figure).
- Water lost per CO₂: "Typically, plants lose ∼150 to >500 water molecules via stomatal transpiration for every CO2 molecule that is taken in and assimilated by photosynthesis." Verslues PE, Bailey-Serres J, Brodersen C, et al. (2023) Burning questions for a warming and changing world: 15 unknowns in plant abiotic stress. *Plant Cell* 35: 67–108, https://doi.org/10.1093/plcell/koac263, section by J. I. Schroeder and P.-K. Hsu (CC BY; read in full).
- Stomatal pores are under 3 % of the leaf surface and carry about 98 % of the CO₂ and water flux. Lawson T, Blatt MR (2014) *Plant Physiol* 164: 1556–1570, https://doi.org/10.1104/pp.114.237107, Introduction (read in full, PMC3982722).
- CO₂ diffusion in the liquid phase is slower than in the gas phase "by 4 orders of magnitude" (1.56 × 10⁻⁵ vs 1.7 × 10⁻⁹ m² s⁻¹ at 25 °C). Terashima I, Hanba YT, Tholen D, Niinemets Ü (2011) Leaf functional anatomy in relation to photosynthesis. *Plant Physiol* 155: 108–116, https://doi.org/10.1104/pp.110.165472 (read in full, PMC3075775).
- Boundary-layer conductance rises with wind speed and falls with leaf size (g_b ∝ √(u/L)). Dupont K, van den Berg TE, Zhang J, Moene AF, Vialet-Chabrand SRM, Murchie E (2025) Beyond the boundary: a new road to improve photosynthesis via wind. *J Exp Bot* 76: 5791, https://doi.org/10.1093/jxb/eraf325, Introduction and Figs 2–3 (CC BY 4.0; read in full, PMC12621100).
- Analyser filters: CO₂ 4.26 µm, H₂O 2.595 µm. LI-COR LI-840A instruction manual, "Theory of operation", https://www.licor.com/support/LI-840A/topics/theory.html (read 28 Oct 2026). CO₂ "a strong band at 4.3 µ": Gaastra 1959, p. 12.
- Gaastra 1959: single attached leaves in a Plexiglass chamber; infrared CO₂ analyser, lithium-chloride hygrometer, thermocouples; resistances r_a, r_s, r_me; "At high light intensities … r_me is from 1 to 4 times r_s" (p. 54). Gaastra P (1959) Photosynthesis of crop plants as influenced by light, carbon dioxide, temperature, and stomatal diffusion resistance. *Mededelingen van de Landbouwhogeschool te Wageningen* 59(13): 1–68, https://edepot.wur.nl/291215 (also the thesis, https://edepot.wur.nl/183268; read in full).

## C9 · Measuring leaf gas exchange (`figs/cp09.ts`)

`photos/cp-licor-head.png`: LI-COR Biosciences, LI-6800 instruction manual, "Introduction", flow schematic of the sensor head, leaf-chamber configuration (board C3, image g). © LI-COR; lecture use with credit. Crop: x 0–1335, y 38–477 of the 1335 × 477 board file (the printed title "Leaf Chamber Configuration" left out).

`photos/cp-gaastra-irga.png`: Gaastra 1959, **Fig. 1**, diagram of the infrared CO₂ analyser (board C3, image c). Crop: x 0–955, y 0–328 of the 955 × 395 board file (the printed caption left out).

`photos/cp-du-field.jpg`: Du T, Meng P, Huang J, Peng S, Xiong D (2020) Fast photosynthesis measurements for phenotyping photosynthetic capacity of rice. *Plant Methods* 16: 6, https://doi.org/10.1186/s13007-020-0553-2, **Fig. 1f**: gas-exchange measurement with a LI-6800 in a flooded rice field. CC BY 4.0. Crop: x 1519–1961, y 672–1217 of the 1961 × 1217 PMC figure (PMC6979334); the panel letter is above the crop.

Reused deck files (not changed): `photos/c7-busch-box1.png` (Busch et al. 2024, Box 1 figure, CC BY 4.0), `photos/c7-ir-bands.png` (Atmospheric Transmission, Wikkiwonkk after R. A. Rohde, Commons, CC0; shown here from 1.5 to 7 µm), `photos/c7-gas-exchange.jpg` (Walz GFS-3000 in an orchard, Heinz Walz GmbH, Commons, CC BY-SA 3.0). Their crops are described in `SOURCES-L2b.md`.

## C10 · CO₂ diffusion pathway (`figs/cp10.ts`)

`photos/cp-succulent-xs.jpg`: **Guard cells and stomata in succulent xerophyte leaf**, Berkshire Community College Bioscience Image Library, https://commons.wikimedia.org/wiki/File:Guard_cells_and_stomata_in_succulent_xerophyte_leaf_(35229487806).jpg. CC0. The whole 3264 × 1840 file, resized to 1800 × 1015. Species not given by the library; the slide says "succulent leaf".

`photos/cp-busch-path.jpg`: Busch et al. 2024, **Fig. 2**, the CO₂ and H₂O diffusion path (board C3, image i). CC BY 4.0. Crop: x 0–910, y 0–1045 of the 1500 × 1045 board file (air to stroma, Cₐ → Cᵢ → Cc; the RuBisCO, peroxisome and mitochondrion part on the right left out).

`photos/cp-lundgren-block.png`: Lundgren MR, Mathers A, Baillie AL, et al. (2019) Mesophyll porosity is modulated by the presence of functional stomata. *Nat Commun* 10: 2825, https://doi.org/10.1038/s41467-019-10826-5, **Fig. 2a**: micro-CT block of a *Triticum urartu* leaf, air space yellow, cells green (scale bar kept). CC BY 4.0. Crop: x 100–560, y 85–470 of the 2022 × 2096 figure; the panel letter and species heading are above the crop.

`photos/cp-clarke-b.jpg`, `photos/cp-clarke-c.jpg`: Clarke VC, Danila FR, von Caemmerer S (2021) CO₂ diffusion in tobacco: a link between mesophyll conductance and leaf anatomy. *Interface Focus* 11: 20200040, https://doi.org/10.1098/rsfs.2020.0040, **Fig. 1b, c**: TEM of a tobacco leaf, stoma → intercellular air space → mesophyll cell (bar 10 µm), and the boxed wall enlarged with the authors' labels (bar 1 µm). CC BY 4.0. Crops of the 727 × 623 PMC figure (PMC7898150): b x 3–449, y 303–622; c x 457–724, y 303–622 (the cartoon panel a and the panel letters left out).

`photos/cp-dupont-wind.jpg`: Dupont et al. 2025, **Fig. 3**: CO₂ concentration in a drawn leaf section at low (≈ 0.15 m s⁻¹) and high (≈ 1 m s⁻¹) wind speed. CC BY 4.0. The whole 750 × 509 PMC figure (PMC12621100).

`photos/cp-du-ags.png`, `photos/cp-du-agm.png`: Du et al. 2020, **Fig. 7a, b**: net CO₂ uptake of 568 rice F2 lines against stomatal and mesophyll conductance. CC BY 4.0. Crops of the 1594 × 728 figure: a x 0–797, b x 800–1594; the panel letters (a at x 0–44, y 0–52; b at x 806–850, y 0–52) are whitened.

`photos/cp-gaastra-fig21.png`: Gaastra 1959, **Fig. 21** (p. 54): stomatal resistance to CO₂ against light intensity, with columns for the mesophyll and outside-air resistances; turnip, 0.03 % CO₂. Page 54 of edepot 291215 rendered at 400 dpi (2530 × 3798); crop x 430–1575, y 1830–3265; **the body text printed beside the upper part of the plot (x 880–1800, y 1600–2575 of the page) is whitened**, nothing else.

Reused deck file (not changed): `photos/c7-stoma-sem.jpg` (Tomato leaf stomate, Dartmouth Electron Microscope Facility, Commons, public domain; crop in `SOURCES-L2b.md`). Shown here as the window x 175–635, y 70–530.

Drawn figures: the CO₂ path schema (`figs/cp-kit.ts`, `pathSchema`) is a plain redraw after Busch et al. 2024, Fig. 2. The single-stoma drawings (C9 v5, v8; C10 v10) and the open-system and IRGA drawings (C9 v1, v2) are own drawings of the textbook schematics.

## Reference board additions (`refs/C3-gas-exchange/`, images q–x)

q `gaastra1959-fig21-three-resistances.png` (page crop before the final trim); r `bcc-succulent-stomata-section.jpg` (resized to 1600 px); s `clarke2021-co2-path-tem.jpg` (whole figure); t `lundgren2019-wheat-microct-airspace.jpg` (whole Fig. 2, resized to 1011 px); u `dupont2025-wind-boundary-layer.jpg`; v `du2020-rice-A-vs-gs-gm.png`; w `du2020-licor6800-rice-field.jpg` (whole Fig. 1); x `knauer2022-gm-vs-Sc-wall.jpg` (Knauer J, Cuntz M, Evans JR, Niinemets Ü, et al. 2022, Contrasting anatomical and biochemical controls on mesophyll conductance across plant functional types, *New Phytol* 236: 357, Fig. 3, CC BY 4.0; not used on a slide).

## Animations cp9 (C9) and cp10 (C10), anim build of 28 Oct 2026 (`anim/cp9-*.ts`, `anim/cp10-*.ts`, assets in `assets/anim/cp9/`, `assets/anim/cp10/`)

The stages reuse the slide figures as drawn by `figs/cp09.ts` (v1, v4, v5, v6, v7) and `figs/cp10.ts` (v2, v6, v7, v8), with their credits as above. New files:

`anim/cp9/gaastra1959-title.png`: Gaastra 1959 (Meded. Landbouwhogeschool Wageningen 59(13): 1–68, https://edepot.wur.nl/291215), page 1, rendered at 220 dpi with pdftoppm; crop x 80–1300, y 135–668 (journal header, title, author); ink made transparent (alpha from darkness, ink #2b2a27), shown on newsprint. Nothing painted over.

`anim/cp10/be1900-catalpa.png`: Brown HT, Escombe F (1900) Static diffusion of gases and liquids in relation to the assimilation of carbon and translocation in plants. *Phil Trans R Soc Lond B* 193: 223–291, https://doi.org/10.1098/rstb.1900.0014. Public domain (Internet Archive item `philtrans09391510`, public-domain mark). Three strips of the scan rendered at 220 dpi, stacked with "• • •" between them: p. 223, x 290–1600, y 430–752 (title, authors, "Received May 31,—Read June 14, 1900"); p. 226, x 250–1640, y 1026–1164 (the catalpa stomata: 145 per mm², open slits ·9 per cent of the surface; the trailing word "It" whitened); p. 226, x 250–1640, y 1664–1812 (the leaf absorbs at "about one-half the rate" of a film of caustic alkali; the rest of the last line after "alkali" whitened). Yellow marker under "·9 per cent." and "one-half the rate" added. Ink made transparent as above; scaled to 75 %.

`anim/cp10/brown.png`: Horace Tabberer Brown, c. 1889, by Maull & Fox, https://commons.wikimedia.org/wiki/File:Horace_Tabberer_Brown_c1889.jpg (Royal Society Picture Library image RS.7810), public domain. Crop x 40–232, y 10–250 of the 266 × 323 file, newsprint halftone with `scripts/halftone.py`. No portrait of F. Escombe was found.

`anim/cp10/stoma-open.jpg`, `anim/cp10/stoma-closed.jpg`: Berkshire Community College Bioscience Image Library, "Guard cells surrounding open stoma in epidermis of succulent xerophyte leaf" (https://commons.wikimedia.org/wiki/File:Guard_cells_surrounding_open_stoma_in_epidermis_of_succulent_xerophyte_leaf_(35229486166).jpg) and "… closed stoma …" (https://commons.wikimedia.org/wiki/File:Guard_cells_surrounding_closed_stoma_in_epidermis_of_succulent_xerophyte_leaf_(34426138264).jpg), both CC0. Crops of the 3264 × 1840 files, open x 1072–3217, y 280–1539; closed x 909–3054, y 280–1539; flipped top to bottom (outside air above), resized to 1000 × 587. Two different stomata of the same kind of section, not one stoma before and after.

Facts on the animation stages and in their captions (besides those listed above for the slides): catalpa (*Catalpa bignonioides*) pores 0.9 % of the leaf surface, 145 stomata per mm², the leaf absorbing CO₂ at about half the rate of an equally large surface of caustic alkali (Brown & Escombe 1900, pp. 225–226, read in the scan); Gaastra 1959: "a single leaf … enclosed in a 'Plexiglass' assimilation chamber", infrared CO₂ analyser (p. 5); Fig. 21 and p. 54 as above; stomatal closure is driven by darkness, high CO₂ and high vapour-pressure difference (Lawson & Blatt 2014, Introduction, read in full). The readouts' bars are drawn to the typical values (Cₐ 420, Cᵢ 300, Cc 200; Busch et al. 2024, Table 1); Cₛ (drawn at 405, 415 with wind) and the closed-stomata Cᵢ and Cc (230, 150) are schematic and carry no number; the dark chamber's bars in cp9 (CO₂ out 162 against 150 in, H₂O out 80 against 70) are schematic.
