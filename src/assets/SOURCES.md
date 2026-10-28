# Opening photograph

`leaf-sky.jpg`: **Green leaves blue sky**, W.carter, 24 June 2007.

- Source: https://commons.wikimedia.org/wiki/File:Green_leaves_blue_sky.jpg
- Original: https://upload.wikimedia.org/wikipedia/commons/b/bf/Green_leaves_blue_sky.jpg
- Licence: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
- The original file is retained. The slide displays a crop using CSS.

# Overview diagram

Original editable TypeScript diagram. Its biological structure was checked against:

- Lecture D6, slide 15, “Photosynthesis: Light and CO₂ fixation” (Taiz and Zeiger 2015 figure).
- Santelia 2019, slide 9, “The two stages of photosynthesis”.

The reference figures are not reproduced in the live deck.

# Portraits for the newspaper clippings

Both are public domain, restyled as warm-ink newspaper halftones by `scripts/halftone.py` (crop, greyscale, oval fade into newsprint, 45° dot screen).

`portraits/rayleigh.png`: **John William Strutt, 3rd Baron Rayleigh**, unknown photographer. Published in the Royal Society's obituary notice, 1921.

- Source: https://commons.wikimedia.org/wiki/File:John_William_Strutt.jpg
- Licence: public domain.
- Crop: x 70–590, y 60–710 of the 800 × 1077 original.

`portraits/einstein.png`: **Albert Einstein**, Ferdinand Schmutzer, 1921.

- Source: https://commons.wikimedia.org/wiki/File:Einstein_1921_by_F_Schmutzer_-_restoration.jpg (960 px rendition)
- Licence: public domain.
- Crop: x 330–790, y 140–715 of the 960 × 1261 rendition.

`portraits/rayleigh-wink.png`: the same Rayleigh photo with his near eye closed. It is painted into the greyscale photo by `scripts/paint_faces.py` and halftoned with the same screen. The sky animation switches to it for a wink.

`portraits/einstein-1951.png`: **Albert Einstein sticks his tongue**, Arthur Sasse, International News Service, 14 March 1951. The life animation's Einstein teaser switches to it.

- Source: https://commons.wikimedia.org/wiki/File:Albert_Einstein_sticks_his_tongue_1951.jpg
- Licence: public domain, per Wikimedia Commons.
- Crop: x 110–1390, y 80–1680 of the 1514 × 1789 file, halftoned by `scripts/halftone.py`.

# Slide 4a real images (variants j–m)

Cropped with `sips` (no other edits: no retouching, nothing painted over), downscaled to at most 1400 px wide, saved as JPEG at quality 85. Crop boxes are in pixels of the original file, x then y. Each image carries its own credit line in the figure. Their own scale bars and labels are kept where the crop includes them.

`photos/leaf-section-syringa.jpg`: **Angiosperm Morphology: Mesophyll Arrangement in Syringa Leaf** (stained cross-section, 400×), Berkshire Community College Bioscience Image Library.

- Source: https://commons.wikimedia.org/wiki/File:Angiosperm_Morphology_Mesophyll_Arrangement_in_Syringa_Leaf_(36176478164).jpg (from https://www.flickr.com/photos/146824358@N03/36176478164/)
- Licence: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/).
- Crop: the whole 3264 × 1840 frame, downscaled to 1400 × 789. The figure credit is shortened to "Berkshire Community College, CC0".

`photos/chloroplast-lettuce-tip.jpg`: **Lettuce Chloroplast STEM**, Yuv345: a 10 nm STEM tomography slice of a lettuce chloroplast, data from Bussi et al. 2019, *PNAS* 116: 22366–22375, https://doi.org/10.1073/pnas.1905994116.

- Source: https://commons.wikimedia.org/wiki/File:Lettuce_Chloroplast_STEM.jpg
- Licence: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
- Crop: x 1680–2320, y 0–743 of the 2320 × 2000 file (the tip of the top slice). It leaves out the baked-in labels "Plastoglobules", "Grana" and "Stroma lamellae" and keeps the 200 nm bar. Variant m shows it without its top 110 px.

`photos/cryoet-tomogram.jpg`, `photos/cryoet-model.jpg`, `photos/cryoet-grana-3d.jpg`, `photos/cryoet-margin.jpg`, `photos/cryoet-complexes.jpg`: Wietrzynski W, et al. 2025, cryo-electron tomography of intact spinach chloroplasts, *eLife*, https://doi.org/10.7554/eLife.105496 (figures at https://elifesciences.org/articles/105496/figures).

- Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- `cryoet-tomogram.jpg`: Figure 1A, tomogram slice. Crop x 5–1058, y 90–1095 of the 2205 × 2546 figure: inside the panel border, below the panel letter. The 200 nm bar is kept.
- `cryoet-model.jpg`: Figure 1B, 3-D segmentation of the same volume. Crop x 1084–2200, y 90–1095 of the same figure, below the panel letter. Its own labels are kept: envelope, granum, stromal lamellae, plastoglobules, stromal particles (RuBisCO).
- `cryoet-grana-3d.jpg`: Figure 1—figure supplement 3A, 3-D render of grana and stroma lamellae. Crop x 75–2200, y 0–1127 of the 2205 × 2966 figure, which leaves out the panel letter. Downscaled to 1400 × 742.
- `cryoet-margin.jpg`: Figure 5B, tomogram of a granum margin running into a stroma lamella. Crop x 1247–2136, y 3–505 of the 2205 × 1707 figure: inside the panel border, right of the panel letter. The 100 nm bar is kept.
- `cryoet-complexes.jpg`: Figure 6C, a granum with every PSII mapped. Crop x 46–1054, y 631–1349 of the 2205 × 1816 figure, inside the panel border. The 200 nm bar is kept.

`photos/complex-5xnl.jpg`: **PDB 5XNL**, the pea PSII–LHCII supercomplex (Su et al. 2017, *Science* 357: 815–820), the RCSB PDB assembly image.

- Source: https://www.rcsb.org/structure/5XNL (image `5xnl_assembly-1.jpeg`, 500 × 500).
- Licence: molecular images on RCSB PDB structure pages are under the PDB archive terms, [CC0 1.0](https://www.rcsb.org/pages/usage-policy). Credited as "RCSB PDB, PDB ID 5XNL (Su et al. 2017)".
- Crop: x 89–410, y 5–494, around the molecule. Rotated 90° clockwise to fit a wide panel; the figure shows it with a multiply blend so its white ground takes the panel colour.

# Slide 4a real images and renders (variants n–w)

Cropped with `sips` and saved as JPEG at quality 85, never wider than 1400 px and never upscaled, unless noted. Crop boxes are in pixels of the original file (or of the stated rendering), x then y. Each image carries its own credit in the figure. "Adapted" marks the two images whose baked-in labels were covered; nothing else was retouched.

`photos/leaf-block.jpg`: **Leaf Tissue Structure**, Zephyris (Wikimedia Commons), a drawn block of leaf.

- Source: https://commons.wikimedia.org/wiki/File:Leaf_Tissue_Structure.svg
- Licence: [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). Credited "Zephyris, CC BY-SA 3.0, adapted".
- Adapted: the SVG was rendered at 1920 × 1280 in headless Chrome with its text labels and leader lines hidden (`scripts/l04a_svg_nolabels.py`; ids in `scripts/l04a_hidden_ids.txt`); no drawn structure was changed. Crop x 396–1651, y 45–1279 of that rendering (1255 × 1234).

`photos/chloroplast-drawing.jpg`: **Chloroplast (borderless version)**, Kelvinsong (Wikimedia Commons), a chloroplast cut open.

- Source: https://commons.wikimedia.org/wiki/File:Chloroplast_(borderless_version)-en.svg
- Licence: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). Credited "Kelvinsong, CC0" although no credit is needed.
- The SVG was rendered at 1640 × 1403 on white with its labels, leader lines and its inset close-up hidden (same script and id list); no drawn structure was changed. Crop x 77–1462, y 185–1095 of that rendering (1385 × 910).

`photos/chloroplast-tem.jpg`: Staehelin LA, Paolillo DJ 2020, *Photosynthesis Research* 145: 237–258, https://doi.org/10.1007/s11120-020-00782-3, Fig. 3 (tobacco chloroplast, transmission electron micrograph).

- Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Credited "Staehelin & Paolillo 2020, CC BY 4.0, adapted".
- Adapted with a short Python script (`scripts/l04a_patch_tem.py`): the authors' abbreviations EM, S, GT, PG, ST and V, their leader lines and the four arrowheads were covered with micrograph texture copied from 30–90 px away in the same image (only the black annotation pixels and a 3 px margin; the EM label, on clear cytoplasm, as a box). Then the cell-wall label (CW) and the unlabelled scale bar were cropped off: crop x 0–1498, y 0–822 of the 1498 × 924 figure, downscaled to 1400 × 768.

`photos/grana-tem.jpg`: Staehelin & Paolillo 2020 (as above), Fig. 4a (maize grana and stroma thylakoids, transmission electron micrograph).

- Licence: CC BY 4.0. Credited "Staehelin & Paolillo 2020, CC BY 4.0".
- Crop x 0–1404, y 190–720 of the 1404 × 2003 figure (inside panel a, below its letter, above its scale bar); 1400 × 529.

`photos/leaf-section-fresh.jpg`: **Blattquerschnitt** (cross-section of a leaf, fresh, unstained), V44020001 (Wikimedia Commons).

- Source: https://commons.wikimedia.org/wiki/File:Blattquerschnitt.jpg
- Licence: public domain. Credited "V44020001, public domain".
- The whole 1280 × 1024 frame (1279 × 1023 after the sips offset of 1).

`photos/cell-3d.jpg`: Midorikawa K, Tateishi A, Toyooka K, et al. 2022, *PNAS Nexus* 1: pgac225, https://doi.org/10.1093/pnasnexus/pgac225, Fig. 1, cell D3 (a whole Arabidopsis mesophyll cell reconstructed from serial sections; chloroplasts green, nucleus yellow).

- Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- Crop x 928–1345, y 98–462 of the 1465 × 1162 figure; 417 × 364, not upscaled.

`photos/leaf-3d.jpg`: Xiao Y, Tholen D, Zhu X-G 2016, *Journal of Experimental Botany* 67: 6021–6035, https://doi.org/10.1093/jxb/erw359, Fig. 1a (3-D leaf model with palisade and spongy cells).

- Licence: [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).
- Crop x 30–376, y 8–345 of the 771 × 769 figure (panel a without its letter); 346 × 337, not upscaled.

`photos/chloroplast-3d.jpg`: **Lettuce Chloroplast STEM**, Yuv345 (as for `chloroplast-lettuce-tip.jpg`), the lower half: the same chloroplast as a 3-D model (envelope blue, grana yellow, stroma lamellae green).

- Licence: CC BY-SA 4.0.
- Crop x 46–2274, y 882–1868 of the 2320 × 2000 file, downscaled to 1400 × 619.

`photos/moss-live-cells.jpg`: **Bryum capillare leaf cells**, Des Callaghan (Wikimedia Commons), live moss leaf cells.

- Source: https://commons.wikimedia.org/wiki/File:Bryum_capillare_leaf_cells.jpg
- Licence: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
- Crop x 1900–3150, y 1150–2000 of the 5075 × 3383 file; 1250 × 850.

`photos/leaf-photo.jpg`: a crop of `leaf-sky.jpg` (W.carter, CC BY-SA 4.0, above): x 700–1400, y 250–760 of the 2848 × 2136 file; 700 × 510. Used as the leaf thumbnail of the size ladder (variant w).

`photos/cryoet-model-clean.jpg`: `cryoet-model.jpg` (Wietrzynski et al. 2025, Fig. 1B, CC BY 4.0) with its baked-in labels covered, so variant t can carry our own. Credited "Wietrzynski et al. 2025, eLife, CC BY 4.0, adapted".

- Adapted with `scripts/l04a_patch_seg.py`: inside each label box (envelope, granum, stromal lamellae, plastoglobules, stromal particles (RuBisCO)), the near-white letter pixels and a 7 px margin were replaced by the same image 60–190 px away (the envelope label, on the black margin, by black, stopping at the blue envelope). No structure was changed. 1115 × 1004.

`photos/lhcii-top.png`, `photos/lhcii-side.png`: **our own renders** of the LHCII trimer from its crystal structure, PDB 2BHW (pea; Standfuss J, et al. 2005, *EMBO J* 24: 919–928, https://doi.org/10.1038/sj.emboj.7600585; coordinates from https://files.rcsb.org/download/2BHW.pdb, kept at `model3d/data/rcsb/2BHW.pdb`).

- Made by `model3d/complex.html?bare=1&view=top|side&w=1000&h=1000&scale=10&stick=0.42&onechl=1` (3Dmol.js 2.5.5) in headless Chrome with SwiftShader GL, on a transparent ground: protein as a pale grey ribbon, chlorophylls dark green (a and b in one colour, as the slide does not separate them), carotenoids orange, phytol tails hidden. 10 px per Å. Seen from the stroma (top) and side-on with the stroma up (side), the membrane normal from the trimer's threefold axis.
- Cropped to the molecule plus 8 px and quantized to 256 colours: top 809 × 794 (crop x 83–892, y 70–864 of the 1000 × 1000 rendering), side 809 × 546 (x 83–892, y 213–759).
- Label anchors (written out by the page) are listed in `l04a.ts` (`TOPA`, `SIDEA`); "≈ 1 nm" is the Mg–Mg distance of chlorophylls B602 and B607, 9.8 Å. In the side render the membrane's hydrocarbon core (OPM, entry 2bhw: 29.4 Å thick, centred 2.2 Å lumen-side of the protein centroid) runs from y = 140 to 434.
- Credited "PDB 2BHW (Standfuss et al. 2005)".

`photos/chlorophyll.png`: our render of one chlorophyll a from the same file (chain C, residue 607), seen face-on (normal of the plane of its four ring nitrogens), without its phytol tail, Mg as a light green sphere: `model3d/complex.html?bare=1&view=chl&w=600&h=600&scale=40&stick=0.32`; crop x 56–573, y 52–563 (517 × 511), 256 colours.

# Slide 4b real images (variants u–z)

Cropped with `sips` (no other edits: no retouching, nothing painted over; one sideways rotation, noted below), at most 1400 px wide; photos saved as JPEG at quality 85, plots as PNG. Crop boxes are in pixels of the file named, x then y. Each image carries its own credit in the figure; our additions are only short label pills, leaders and (variant v) two dashed guides.

`photos/4b-flask.jpg`: **Fluorescence of chlorophyll under UV light**, Marie Franzen: chlorophyll dissolved in alcohol, above in white light, below in the light of a UV lamp.

- Source: https://commons.wikimedia.org/wiki/File:Fluorescence_of_chlorophyll_under_UV_light.jpg (1920 px rendition of the 5128 × 6856 original)
- Licence: [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/).
- Crop: the whole frame, downscaled to 1047 × 1400. Variant u shows it whole; y shows the UV half (window x 30–970, y 720–1400 of the 1047 × 1400 file); z shows the white-light flask (window x 150–650, y 80–690).

`photos/4b-elodea.jpg`: **Chlorophyll fluorescence of Elodea canadensis under 405 nm light**, Ihor Panas: a living waterweed shoot in water, lit with 405 nm light.

- Source: https://commons.wikimedia.org/wiki/File:Chlorophyll_fluorescence_of_Elodea_canadensis_under_405_nm_light.jpg (1920 × 1277 rendition of the 6016 × 4000 original)
- Licence: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
- Crop: x 280–1320, y 230–1270 of the 1920 px rendition (1040 × 1040), around the shoot. Variant u shows x 190–800 of it.

`photos/4b-levels.png`: Croce R, van Amerongen H (2014) Natural strategies for photosynthetic light harvesting. *Nat Chem Biol* 10: 492–501, https://doi.org/10.1038/nchembio.1555, **Fig. 4b**: simplified energy-level diagram of the pigments of PSII (Chl a green, Chl b blue, carotenoid orange; S₀, S₁, Sₙ; numbers are rate constants in ps⁻¹, so 10 ps⁻¹ for Sₙ → S₁ is 0.1 ps).

- Source: the figure image on nature.com (`Croce2014_Fig4.jpg`, 1050 × 619; ETH access).
- Licence: © Springer Nature, all rights reserved; shown with credit for teaching.
- Crop: x 482–1050, y 1–619 (568 × 618), panel b. The figure leaves out the panel letter "b" (x 0–24, y 0–37 of the crop) with its clip path; nothing is painted.

`photos/4b-palette.png`: the same paper, **Fig. 2c**: absorption spectra of Chl a, b, c, d, f and BChl a, b in solvents, each normalised to its maximum.

- Source: `Croce2014_Fig2.jpg` (2100 × 848) from nature.com. Licence: © Springer Nature, shown with credit for teaching.
- Crop: x 68–870, y 497–848 (802 × 351): right of the panel letter "c" and of the y-axis label, which therefore drops out together with the 300 nm tick label.

`photos/4b-spectrum.png` and `photos/4b-spectrum-side.png`: **Chlorophyll Absorption Spectrum**, Serge Helfrich: molar absorption coefficient of chlorophyll a and b (in diethyl ether; peaks 428.5 and 660.4 nm for Chl a, 452.7 and 642.4 nm for Chl b, read off the plot).

- Source: https://commons.wikimedia.org/wiki/File:Chlorophyll_Absorption_Spectrum.svg (3840 × 2560 PNG rendition).
- Licence: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
- `4b-spectrum.png`: the whole frame, downscaled to 1400 × 933.
- `4b-spectrum-side.png`: crop x 897–3374, y 320–2560 of the 3840 px rendition (370–785 nm, with the legend, without the y-axis labels and the 800 nm tick label), rotated 90° clockwise so that wavelength runs down, downscaled to 1400 × 1548 (Rosenqvist's idea: the spectrum on its side beside the levels). In variant v it is scaled so that Chl a's 428.5 and 660.4 nm peaks sit at the heights of Chl a's Sₙ and S₁ in Fig. 4b (273 and 175 kJ/mol).

`photos/4b-mccree.jpg`: Liu J, van Iersel MW (2021) Photosynthetic physiology of blue, green, and red light: light intensity effects and underlying mechanisms. *Front Plant Sci* 12: 619987, https://doi.org/10.3389/fpls.2021.619987, **Figure 1**: the normalised action spectrum of the maximum quantum yield of CO₂ fixation (McCree 1971/72, *Agric Meteorol* 9: 191–216), redrawn from the data of Sager et al. (1988).

- Source: https://pmc.ncbi.nlm.nih.gov/articles/PMC7977723/ (image `fpls-12-619987-g001.jpg`, 739 × 545).
- Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- Crop: the whole figure.

## Slide 5 figure variants r1–r5 (27 Oct 2026)
- `anim/leaf/tem-shade.jpg`, `anim/leaf/tem-sun.jpg`: Shao Q et al. 2014, PLoS One 9:e85996, Fig. 6 k (5 % irradiance) and b (50 % irradiance), https://doi.org/10.1371/journal.pone.0085996, CC BY 4.0. Same 2.9 × 2.6 µm field from each, toned; our own 0.5 µm bars.
- `anim/leaf/senn.png`: Gustav Senn, Photopress AG, between 1915 and 1935, Universitätsbibliothek Basel, UBH Portr BS Senn G 1875, 2, https://swisscollections.ch/Record/991100683099705501 (no licence stated; check before publishing). Halftone by scripts/halftone.py.
- `anim/leaf/senn-1895.jpg`: G. Senn 1895, chloroplasts moving in Vallisneria leaf cells, in Honegger 2022, Bauhinia 28:63, Abb. 3a, https://eterna.unibas.ch/bauhinia/article/view/1607, CC BY 4.0.
- `photos/alocasia-shade.jpg`: John Robert McPherson 2013, Alocasia macrorrhizos, Lamington National Park, Queensland, Wikimedia Commons, CC BY-SA 4.0. Cropped and toned by scripts/fig5_assets.py.

## Slide 6 animation portraits (27 Oct 2026)
- `anim/antenna/emerson-nas.png`: Robert Emerson, frontispiece of E. Rabinowitch, Robert Emerson 1903–1959, Biographical Memoirs of the National Academy of Sciences (1961), © NAS. Halftone.
- `anim/antenna/arnold-nas.png`: William A. Arnold, from Govindjee & N. Srivastava, William Archibald Arnold 1904–2001, Biographical Memoirs of the NAS (2014), photo courtesy of the family of William Arnold, © NAS. Halftone.

## Slide 6 figure variants r1–r5 (27 Oct 2026)
- r1, r4, r5: own render (3Dmol.js 2.5.5) of the pea PSII–LHCII supercomplex C₂S₂M₂, PDB 5XNL; Su et al. 2017, Science 357:815, doi:10.1126/science.aan0327. r1 route arrows redrawn after Kouřil, Dekker & Boekema 2012, BBA Bioenergetics 1817:2, Fig. 2, doi:10.1016/j.bbabio.2011.05.024.
- r2: Emerson and Arnold portraits © NAS Biographical Memoirs (see slide 6 animation); Emerson & Arnold 1932, J Gen Physiol 16:191, Fig. 1, doi:10.1085/jgp.16.2.191 (Internet Archive scan, relabelled axes).
- r3: drawn; E = 1239.84 eV·nm / λ; level scheme after Croce & van Amerongen 2014, Nat Chem Biol 10:492, Fig. 4b.

## Lead pages for slides 5–7 (27 Oct 2026)
- `photos/lead5-taro.jpg`: giant taro (Alocasia macrorrhizos), Lamington NP; John Robert McPherson 2013, Wikimedia Commons, CC BY-SA 4.0.
- `photos/lead5-sorrel.jpg`: wood sorrel under spruce, Estonia; Maris Juuse 2012, Wikimedia Commons, CC BY-SA 3.0.
- `photos/lead-bubbles.jpg`: "Photosynthesis in action", underwater lake plants with O₂ bubble trails; Rcaravit 2021, Wikimedia Commons, CC BY 4.0 (cropped, resized).
- `photos/lead6-priestley.jpg`: J. Priestley 1774, Experiments and Observations on Different Kinds of Air, frontispiece; public domain (Wikimedia Commons).
- `photos/lead6-chlorella.jpg`: Chlorella vulgaris NIES-2170, light micrograph; NEON_ja 2014, Wikimedia Commons, CC BY-SA 3.0.

## Slide 5 combined figure (s1, s2), 27 Oct 2026
- `photos/lhcii-top-ab.png`: own render of the pea LHCII trimer, PDB 2BHW (Standfuss J, et al. 2005, EMBO J 24: 919–928, https://doi.org/10.1038/sj.emboj.7600585), 3Dmol.js 2.5.5; as `lhcii-top.png` but Chl *a* (#2e7d32) and Chl *b* (#93c95a) coloured separately; same crop (x 83–892, y 70–864), made by `scripts/lhcii_ab_crop.py`. "≈ 1 nm" = Mg–Mg distance of chlorophylls B602 and B607 (0.98 nm). Credited "PDB 2BHW (Standfuss et al. 2005)".
- `anim/leaf/senn.png` (s1, s2): Gustav Senn, Photopress AG, 1915–1935, Universitätsbibliothek Basel, UBH Portr BS Senn G 1875, 2 (no licence stated). Credited "Photopress AG, UB Basel".
- `anim/leaf/tem-shade.jpg`, `tem-sun.jpg` (s1, s2): Shao et al. 2014, PLoS One 9: e85996, Fig. 6 k and b, CC BY 4.0; *Anoectochilus roxburghii* (jewel orchid).
- `photos/chloroplast-3d.jpg` colour key (s1, s2, p), from the Commons file description: grana yellow, stroma lamellae green, plastoglobules purple, envelope blue.
- Organisms named on slide 5: leaf-section-fresh unidentified plant; leaf-3d generic dicot model (Xiao et al. 2016); cell-3d *Arabidopsis*; chloroplast-tem tobacco; cryo-ET spinach.
- cell-3d key (p): only chloroplast, mitochondrion and peroxisome, as in Midorikawa et al. 2022 Fig. 3; their legends give the nucleus no colour, so the yellow is not keyed.

## Slide 5 focused figures n1–n6, 27 Oct 2026
- chloroplast-tem (n1, n2, n6); chloroplast-3d (n4, key from the file legend); cryoet-grana-3d and cryoet-complexes (n5; the figure frame cuts Fig 6C above its 200 nm bar); complex-5xnl (n6, credited "RCSB PDB, PDB ID 5XNL (Su et al. 2017)"). Drawings are schematic: complexes not to scale; photosystem I also on the stroma-exposed grana end membranes.

## Slide 7 whole-chain schema (src/pilot/figs/chain.ts), 27 Oct 2026
- `chain/psii.webp`, `chain/b6f.webp`, `chain/psi.webp`, `chain/atps.webp`: own space-filling renders (`scripts/chain_render.mjs`), side view with the stroma up, all at 2.4 px per Å (true relative size). Flat colour with dark outlines, after Goodsell. Hydrogens, waters, lipids and detergents are left out. The membrane frame is computed from each structure (C2 axis for photosystem II and b₆f, c-ring axis for ATP synthase, thinnest axis of the chlorophyll layer for photosystem I) and checked against the charged-residue profile (≈ 3 Å). Image sizes and anchors are in `chain/chain-structures.json`.
- Structures (RCSB PDB, CC0):
  - 5XNL, pea PSII–LHCII C₂S₂M₂ (Su et al. 2017, Science 357:815, doi:10.1126/science.aan0327);
  - 6RQF, spinach cytochrome b₆f (Malone et al. 2019, Nature 575:535, doi:10.1038/s41586-019-1746-6);
  - 5L8R, pea PSI–LHCI (Mazor et al. 2017, Nature Plants 3:17014, doi:10.1038/nplants.2017.14);
  - 6FKF, spinach chloroplast ATP synthase (Hahn et al. 2018, Science 360:eaat4318, doi:10.1126/science.aat4318).
- Drawn variants credit "after Shevela et al. 2023, Fig. 1; Nelson & Ben-Shem 2004, Fig. 1"; c3 after Nelson & Ben-Shem 2004 Fig. 1a and Wietrzynski et al. 2020; c6 Z-scheme after Govindjee, Shevela & Björn 2017.
- `chain/psii-s.webp`, `chain/b6f-s.webp`, `chain/psi-s.webp`, `chain/atps-s.webp` (slide 7 c2b): shaded versions of the chain renders (`scripts/chain_render.mjs`, SHADE=1). Same PDB entries, frame and scale as `chain/*.webp`: 5XNL, 6RQF, 5L8R, 6FKF.
- `chain/psii-core.webp`, `chain/psii-ant.webp` (slide 7 c2a): the 5XNL supercomplex split into core dimer and antenna (`scripts/chain_render.mjs`, SUBSET=core|ant), in the frame of the whole complex so the two stack exactly. Su et al. 2017, Science 357:815, doi:10.1126/science.aan0327 (RCSB PDB, CC0). c2a puts the core in front by layering, not by true depth.

## Slide 10b cyclic-flow animation, 27 Oct 2026
- `anim/cyclic/munekage2004-plants.png`: Munekage Y, et al. 2004, Nature 429: 579–582, https://doi.org/10.1038/nature02598, Fig. 2 (*Arabidopsis* wild type vs crr2-2 pgr5 double mutant), halftoned with the paper's labels removed and our own "wild type" / "double mutant" added (`scripts/cyclic_anim_assets.py`). Copyrighted figure used in the lecture with credit (lecturer's decision, 27 Oct 2026).
