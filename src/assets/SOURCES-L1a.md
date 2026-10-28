# Slides 6 and 7 real images and renders (block L1a, 27 Oct 2026)

Cropped with `sips` (crop offsets ≥ 1), no retouching and nothing painted over; panel letters left out by the crop or by the figure's clip path. Crop boxes are in pixels of the downloaded file, x then y. Downloads are in the session scratchpad, `redo/A-light/`. Each image carries its own credit in the figure; our additions are label pills, leaders, arrows and (6c) redrawn axes.

## Slide 6 · Light harvesting (module `s06`)

`photos/6-path.jpg`, `photos/6-path-whole.jpg`: **our own renders** of the pea PSII–LHCII supercomplex C₂S₂M₂, PDB 5XNL (Su X, et al. 2017, *Science* 357: 815–820, https://doi.org/10.1126/science.aan0327), seen from the stroma, with one nearest-neighbour energy-transfer path of 19 hops (Mg–Mg 0.9–2.4 nm) from a Chl b in M-LHCII through CP29 and CP47 to P680. The path is an illustration computed from the structure (`lhc6-tools/prep.py`), not a measured route; it follows Kouřil et al. 2012's route M-LHCII → CP29 → CP47 → RC.

- Made by the session page `lhc6/energy-path.html` (3Dmol.js 2.5.5), copied to `build/L1a/work/render/energy-path.html` with a bare mode (no HTML labels) and an exact camera pan, in headless Chrome with SwiftShader GL at 1600 × 900, device scale 2: `?still&bare&noalt&nochg&scale=6&cx=398&cy=720` (6-path) and `?still&bare&noalt&nochg` (6-path-whole). Protein backbone pale grey; Chl a dark green, Chl b light green discs at their Mg positions; pheophytins grey.
- 6-path.jpg: crop x 270–1340, y 150–747 (CSS px) of the render, 1400 × 781, JPEG q 88. 6-path-whole.jpg: crop x 110–1210, y 105–835, 1400 × 929.
- Credited "Own render · PDB 5XNL, pea (Su et al. 2017)". Label anchors are written out by the page (`#anchors`) and listed in `s06.ts` (`ZA`, `WA`).

`photos/6-kouril.jpg`: Kouřil R, Dekker JP, Boekema EJ (2012) Supramolecular organization of photosystem II in green plants. *BBA Bioenergetics* 1817: 2–12, https://doi.org/10.1016/j.bbabio.2011.05.024, **Fig. 2**, energy-transfer routes in one half of C₂S₂M₂.

- Source: Elsevier image CDN, `gr2_lrg.jpg` (1683 × 1727; higher resolution than the 674 × 691 image embedded in the repository PDF).
- Licence: © Elsevier B.V., all rights reserved; shown with credit for teaching.
- The whole figure, downscaled to 1100 × 1128, JPEG q 85.
- Key (from the verbatim caption, `redo/fetched/kouril2012/NOTES.md`): Chl a green, Chl b blue, carotenoids orange, RC chlorophylls and pheophytins yellow; yellow arrows RC ⇄ CP43/CP47, blue arrows within the supercomplex, green arrows to or from neighbouring (super)complexes; grey bars, pigment-free low-molecular-mass subunits.

`photos/6-walk.png`: Croce R, van Amerongen H (2014) Natural strategies for photosynthetic light harvesting. *Nat Chem Biol* 10: 492–501, https://doi.org/10.1038/nchembio.1555, **Fig. 4a**: C₂S₂M₂ seen from the top with one simulated excitation trajectory (yellow) to a reaction centre (red); Chl a green, Chl b blue; 5 nm bar.

- Source: `Croce2014_Fig4.jpg` (1050 × 619) from nature.com (ETH access). Licence: © Springer Nature, shown with credit for teaching.
- Crop x 1–457, y 1–619 (456 × 618), panel a; the panel letter is left out by the figure's clip path.

`photos/4b-levels.png` (existing asset, Croce & van Amerongen 2014, Fig. 4b; see SOURCES.md, "Slide 4b real images") is reused in variant 6e. It appears on slide 4a only in the unpicked variants v and y.

`photos/6-psi-lhci.jpg`, `photos/6-psi-routes.jpg`, `photos/6-redforms.png`: Croce R, van Amerongen H (2013) Light-harvesting in photosystem I. *Photosynth Res* 116: 153–166, https://doi.org/10.1007/s11120-013-9838-x (PMC3825136).

- Licence: Open Access under the Creative Commons Attribution License (version not stated on the article); credited "CC BY".
- 6-psi-lhci.jpg: **Fig. 1**, pea PSI–LHCI from the stroma, subunits labelled; red-form chlorophylls of Lhca3 and Lhca4 as spheres. The whole figure, 708 × 520.
- 6-psi-routes.jpg: **Fig. 4**, energy transfer and trapping in PSI–LHCI (arrow width = rate). The whole figure, 774 × 579.
- 6-redforms.png: **Fig. 3**, 77 K absorption (solid) and fluorescence (dotted) of the native dimers Lhca1/4 (red) and Lhca2/3 (black). Crop x 74–735, y 1–540 (661 × 539): the plot without its axis titles and tick labels, which are redrawn in the figure (wavelength 650–800 nm; 3.67 px per nm, 700 nm at x = 294 of the crop).

## Slide 7 · Photosystem II (module `s07`)

`photos/7-psii.png`, `photos/7-rc.png`: **our own renders** of one PSII core monomer from PDB 5XNL (Su et al. 2017, as above), seen from the side with the stroma up.

- Frame: `build/L1a/work/rcprep.py` turns 5XNL into the membrane frame of `path.json` and then a side frame (y = membrane normal towards the stroma, x = Pheo D2 → Pheo D1), writing `render/data/rc_side.pdb`, `psii_side.pdb` and the cofactor centres `rc_centres.json`. Pages `work/render/rc.html` and `work/render/psii.html` (3Dmol.js 2.5.5), headless Chrome, SwiftShader GL, device scale 2, transparent ground.
- 7-psii.png: `psii.html?scale=7&roty=90&cy=400`, rendered twice (protein only; cofactors only) and composited with the protein at 60 % opacity: cartoon, D1/D2 tan, CP43/CP47 pale green, PsbO/P/Q blue-grey, small subunits grey; chlorophylls green sticks (RC chlorophylls darker), pheophytins olive, plastoquinones orange, non-heme Fe orange sphere, Mn₄CaO₅ as spheres (Mn purple, Ca yellow, O red). Crop x 380–1300, y 100–870 (CSS px), 1100 × 921, 256 colours.
- 7-rc.png: `rc.html?scale=14&prot=0.4`: D1/D2 cofactors only (P_D1, P_D2, Chl_D1, Chl_D2, Pheo D1/D2, Q_A, Q_B, Fe, bicarbonate, Tyr Y_Z, Mn₄CaO₅), chlorophyll phytol tails hidden. Crop x 470–1130, y 55–805, 1056 × 1200, 256 colours.
- Centre-to-centre distances in this frame: P680 (mid P_D1/P_D2) to Q_B 2.5 nm along the membrane normal.
- Credited "Own render · PDB 5XNL, pea (Su et al. 2017)".

`photos/7-membrane.png`, `photos/7-shevela-a.png`, `photos/7-kok.png`: Shevela D, Kern JF, Govindjee G, Messinger J (2023) Solar energy conversion by photosystem II: principles and structures. *Photosynth Res* 156: 279–307, https://doi.org/10.1007/s11120-022-00991-y (PMC10203033).

- Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- 7-membrane.png: **Fig. 3a**, plant PSII with its antenna in the thylakoid membrane. Crop x 1–800, y 150–832 of the 1499 × 832 figure (799 × 682), panel a below its letter.
- 7-shevela-a.png: **Fig. 6a**, primary charge separation (Chl_D1 and P_D1 pathways). Crop x 50–968, y 1–661 of the 968 × 1326 figure (918 × 660).
- 7-kok.png: **Fig. 8b**, the Kok cycle with the S-state structures of the Mn₄CaO₅ cluster. Crop x 1–968, y 578–1734 of the 968 × 1734 figure (967 × 1156), panel b without its letter.

`photos/7-cluster.png`: Umena Y, Kawakami K, Shen J-R, Kamiya N (2011) Crystal structure of oxygen-evolving photosystem II at a resolution of 1.9 Å. *Nature* 473: 55–60, https://doi.org/10.1038/nature09913, **Fig. 2b**, the Mn₄CaO₅ cluster with bond lengths (Å) and its four waters W1–W4.

- Source: `umena2011_nature_fig2.jpg` (946 × 1124) from nature.com. Licence: © Springer Nature, shown with credit for teaching.
- Crop x 500–946, y 6–374 (446 × 368); the panel letter is left out by the figure's clip path.

`photos/7-channels.png`: Bhowmick A, et al. (2023) Structural evidence for intermediates during O₂ formation in photosystem II. *Nature* 617: 629–636, https://doi.org/10.1038/s41586-023-06038-z, **Fig. 5**, step (iv) of the S₃ → S₀ transition: O₂ release, water insertion, deprotonation through the Cl1 channel.

- Source: `Fig5.png` (1601 × 1039) from the PMC copy (PMC10191843). Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- Crop x 780–1601, y 700–1039 (821 × 339); the step label "iv)" is left out by the figure's clip path.
- Key colours from the caption: proton cyan arrow, water red dashed arrow, oxygen red solid arrow.
