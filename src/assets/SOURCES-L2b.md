# Lecture 2, slides C6–C9 real images (block L2b, 27 Oct 2026)

Slide numbers are those of the approved 15-slide lecture 2 (C6 photorespiration, C7 measuring leaf gas exchange, C8 light-response curve, C9 CO₂-response curve and FvCB). Cropped and resized with Python/PIL (no retouching, nothing painted over, except where stated: the faded bypasses in `c6-south-native.png`). Crop boxes are in pixels of the source file, x0, y0, x1, y1. The script is `scratchpad/build/L2b-tools/assets.py`. Each image carries its own credit line in the figure. Where a figure's own axis text was too small, the plot box was cropped and the axes were redrawn in SVG at the measured tick positions (noted below).

# Slide C6 · Photorespiration

`photos/c6-eb-o2.png`: Ehleringer J, Björkman O 1977, Quantum yields for CO₂ uptake in C₃ and C₄ plants, *Plant Physiology* 59: 86–90, https://doi.org/10.1104/pp.59.1.86, Fig. 2 (quantum yield of *Encelia californica* at 30 °C in 21 and 2 % O₂ against intercellular CO₂; O₂ inhibition on the right axis).

- Source: PMC page scan (PMC542335), as fetched by research agent D (`scratchpad/redo/D-ccm/ehleringer_bjorkman1977_fig2_O2_21vs2.png`, 772 × 750).
- Licence: © American Society of Plant Biologists; free to read in PMC. Classroom use with credit.
- Crop: x 154–619, y 47–534 (the plot box with its frame and inward ticks). Tick labels and axis titles are redrawn in SVG; the in-plot labels are the authors'. Mapping in the asset: Cᵢ (µbar) → u = 4.9 + 0.268 Cᵢ; φ → v = 482.5 − 5300 φ; inhibition (%) → v = 482.5 − 5.3 p. The page scan is about 370 px wide for this figure, so the asset is about 2× the scan; a sharper scan would need the PMC PDF (bot-checked for scripts).

`photos/c6-south-native.png`: South PF, Cavanagh AP, Liu HW, Ort DR 2019, Synthetic glycolate metabolism pathways stimulate crop growth and productivity in the field, *Science* 363: eaat9077, https://doi.org/10.1126/science.aat9077, Fig. 1A.

- Source: PMC author manuscript PMC7745124 (PMC open-data PDF, page 3 image, 1773 × 2173): https://pmc-oa-opendata.s3.amazonaws.com/PMC7745124.1/PMC7745124.1.pdf
- Licence: CC BY 4.0 (PMC author manuscript).
- Crop: x 70–1773, y 0–1175 (panel A without its letter and without the lower part of the chloroplast), downscaled to 1300 px. **Edited:** the three engineered bypasses (red, dark blue, light blue in the original) are faded to pale grey by a saturation mask (pixels with HSV saturation above 0.12 blended towards 22 % ink); the native pathway, in grey, is unchanged. The figure credit says so.

`photos/c6-fn-fig6.jpg`, `photos/c6-fn-fig2.jpg`: Frederick SE, Newcomb EH 1969, Cytochemical localization of catalase in leaf microbodies (peroxisomes), *J Cell Biol* 43: 343–353, https://doi.org/10.1083/jcb.43.2.343, Figs 6 and 2 (tobacco leaf TEM: peroxisomes against chloroplasts, mitochondria nearby).

- Source: PMC2107865, PMC open-data PDF (150-dpi page images): https://pmc-oa-opendata.s3.amazonaws.com/PMC2107865.1/PMC2107865.1.pdf
- Licence: CC BY-NC-SA (JCB archive, as stated by PMC).
- Crops: Fig. 6 from page 8 image (861 × 1155), x 200–800, y 30–520 (figure number left out); Fig. 2 from page 5 image (862 × 1166), x 14–850, y 12–565 (figure number left out; the authors' letters M and Mb kept). Greyscale.

`photos/c6-sage-ratio.jpg`: Sage RF, Sage TL, Kocacinar F 2012, Photorespiration and the evolution of C₄ photosynthesis, *Annu Rev Plant Biol* 63: 19–47, https://doi.org/10.1146/annurev-arplant-042811-105511, Fig. 4 (modelled photorespiration/photosynthesis against chloroplast CO₂ and temperature).

- Source: research agent D (`sage2012_fig4.png`, 1113 × 1170, Annual Reviews, ETH access).
- Licence: © Annual Reviews. Classroom use with credit.
- Crop: x 0–1113, y 0–1040 (journal footer left out); the figure shows the window x 0–1010, y 132–1040, so the colour key and the two printed notes are left out; the notes are given as label pills.

# Slide C7 · Measuring leaf gas exchange

`photos/c7-busch-box1.png`, `photos/c7-busch-path.jpg`: Busch FA, Ainsworth EA, Amtmann A, et al. 2024, A guide to photosynthetic gas exchange measurements: fundamental principles, best practice and potential pitfalls, *Plant Cell Environ* 47: 3344–3364, https://doi.org/10.1111/pce.14815, Figure Box 1 and Fig. 2. Equations 3 and 5 (E and A) and Table 1 (typical values at 25 °C: Cₐ 420, Cᵢ 300, Cc 200 µmol mol⁻¹) are quoted in the figures.

- Source: research agent D (Box 1 re-rendered from the PDF, 2147 × 480; Fig. 2 the PDF's embedded image, 1500 × 1045).
- Licence: CC BY 4.0.
- Crops: Box 1, x 400–1690, y 15–440 (reference IRGA, chamber, sample IRGA and the air arrows; the words "Air IN/OUT" and the frame left out, given as pills). Fig. 2, x 0–1160, y 0–1045 (peroxisome and mitochondrion at the right edge left out; a sliver of the mitochondrion remains at the edge); variants e and f show its window x 0–500, y 0–720 (boundary layer, stoma, air space).

`photos/c7-ir-bands.png`: **Atmospheric Transmission-en**, Wikkiwonkk, after Robert A. Rohde (Global Warming Art), Wikimedia Commons.

- Source: https://commons.wikimedia.org/wiki/File:Atmospheric_Transmission-en.svg (1920-px PNG rendering, research agent D).
- Licence: CC0 1.0.
- Crop: x 597–1340, y 1142–1437 (the water vapour, carbon dioxide and oxygen + ozone rows from 0.8 to 11 µm), flattened on white. Row names and the logarithmic wavelength axis are redrawn in SVG: λ (µm) → u = 63 + 653 log₁₀ λ. Analyser bands marked: CO₂ 4.26 µm, H₂O 2.59 µm (LI-COR LI-840A manual; LI-6800 theory slides).

`photos/c7-gas-exchange.jpg`: **Portable gas exchange measurements**, Heinz Walz GmbH, 13 June 2013 (a GFS-3000 in an orchard).

- Source: https://commons.wikimedia.org/wiki/File:Portable_gas_exchange_measurements.jpg
- Licence: CC BY-SA 3.0.
- Crop: whole 2515 × 1856 frame, downscaled to 1400 × 1033. No openly licensed LI-6800 photo exists on Commons.

`photos/c7-stoma-sem.jpg`: **Tomato leaf stomate 1-color**, Photohound, from the Dartmouth Electron Microscope Facility (coloured SEM).

- Source: https://commons.wikimedia.org/wiki/File:Tomato_leaf_stomate_1-color.jpg
- Licence: public domain.
- Crop: x 250–1010, y 220–880 of 1024 × 1049 (the original scale bar left out; redrawn in SVG from its length, 10 µm = 180 px).

# Slide C8 · Light-response curve

`photos/c8-boardman.png`: Boardman NK 1977, Comparative photosynthesis of sun and shade plants, *Annu Rev Plant Physiol* 28: 355–377, https://doi.org/10.1146/annurev.pp.28.060177.002035, Fig. 1 (*Atriplex patula* grown in high, intermediate and low light; data of Björkman et al. 1972, Carnegie Inst Wash Yearb 71: 115–135).

- Source: page 363 rendered at 400 dpi by the coordinator (`scratchpad/redo/fetched/boardman1977/fig1_light_saturation_Atriplex_p363.png`, 1720 × 1400; Annual Reviews, ETH access).
- Licence: © 1977 Annual Reviews. Classroom use with credit.
- Crop: x 198–1640, y 30–1224 (plot box), downscaled to 900 px. Axes redrawn in SI units: 1 nE cm⁻² s⁻¹ = 10 µmol m⁻² s⁻¹; 1 µmol dm⁻² min⁻¹ = 1.667 µmol m⁻² s⁻¹, so the printed y ticks 0, 5, 10, 15, 20 are labelled 0, 8.3, 16.7, 25, 33.3. Mapping in the asset: Q → u = 3.43 + 0.35736 Q; A → v = 669.0 − 17.375 A. Variant d adds two shaded ranges.

`photos/c8-huang-lrc.jpg`: Huang W, Zhang S-B, Hu H 2014, Sun leaves up-regulate the photorespiratory pathway to maintain a high rate of CO₂ assimilation in tobacco, *Front Plant Sci* 5: 688, https://doi.org/10.3389/fpls.2014.00688, Fig. 1C. Values in the labels from their Table 1 (light saturation point 1164 vs 797, light compensation point 32 vs 20 µmol m⁻² s⁻¹).

- Source: https://www.frontiersin.org/files/Articles/118493/fpls-05-00688-HTML/image_m/fpls-05-00688-g001.jpg (1200 × 2410)
- Licence: CC BY 4.0.
- Crop: x 44–1200, y 1515–2410 (panel C without its letter; the authors' axes kept).

`photos/c8-shade-section.jpg`, `photos/c8-sun-section.jpg`: Hoshino, Yoshida, Tsukaya 2019, Multiple steps of leaf thickening during sun-leaf formation in *Arabidopsis*, *Plant J* 100: 738–753, https://doi.org/10.1111/tpj.14467, Fig. 1e, e′ (leaf transverse sections, low vs high light; one palisade cell outlined by the authors; scale bars 100 µm).

- Source: PMC6900135, PMC open-data PDF, page 3 image (1316 × 1198): https://pmc-oa-opendata.s3.amazonaws.com/PMC6900135.1/PMC6900135.1.pdf
- Licence: CC BY 4.0.
- Crops: x 0–432, y 530–752 (low light) and x 456–890, y 530–762 (high light).

# Slide C9 · CO₂-response curve and the FvCB model

`photos/c9-gregory-a.png`, `photos/c9-gregory-b.png`: Gregory LM, McClain AM, Kramer DM, et al. 2021, The triose phosphate utilization limitation of photosynthetic rate: out of global models but important for leaf models, *Plant Cell Environ* 44: 3223–3226, https://doi.org/10.1111/pce.14153, Fig. 2A, B (rice, replicate 1 of Xiao et al. 2021; fits without and with TPU). Values in variant c from their Table 1 (rep 1 with TPU: Vcmax 194, J 178, TPU 10.9 µmol m⁻² s⁻¹).

- Source: PMC9291784, PMC open-data PDF (figure in vector form), page 2 rendered at 600 dpi: https://pmc-oa-opendata.s3.amazonaws.com/PMC9291784.1/PMC9291784.1.pdf
- Licence: CC BY 4.0.
- Crops of the render (row A/B: x 330–3350, y 2060–3130, then): A x 262–1500, y 120–892; B x 1768–3006, y 120–892 (plot areas with the left and bottom axis lines), downscaled to 900 px. Axes redrawn: Cc (Pa) → u = 43.8 + 8.128 Cc; A → v = 532.5 − 10.011 A. The x axis is chloroplast CO₂ (Cc, Pa), as in the paper.

`photos/c9-coursolle-b.png`: Coursolle, Otis Prud'homme, Lamothe, Isabel 2019, Measuring rapid A–Cᵢ curves in boreal conifers: black spruce and balsam fir, *Front Plant Sci* 10: 1276, https://doi.org/10.3389/fpls.2019.01276, Fig. 4B (RACiR curve of balsam fir with the FvCB fit).

- Source: PMC6823239, PMC open-data PDF, page 6 image (1713 × 2055): https://pmc-oa-opendata.s3.amazonaws.com/PMC6823239.1/PMC6823239.1.pdf
- Licence: CC BY 4.0.
- Crop: x 117–838, y 719–1222 (plot box); the panel letter B is masked out by the clip path; axes redrawn: Cᵢ → u = 27.5 + 0.55375 Cᵢ; A → v = 482.5 − 15.367 A.

`photos/c9-stinziano.jpg`: Stinziano JR, Morgan PB, Lynch DJ, Saathoff AJ, McDermitt DK, Hanson DT 2017, The rapid A–Cᵢ response: photosynthesis in the phenomic era, *Plant Cell Environ* 40: 1256–1262, https://doi.org/10.1111/pce.12911, Fig. 2 (RACiR ramps over the standard A/Cᵢ curve of *Populus deltoides*; RACiR ≈ 5 min per curve, standard 30–60 min).

- Source: fetched by the coordinator (`scratchpad/redo/fetched/stinziano2017/fig2_RACiR_vs_standard_ACi.jpg`, 2128 × 2935).
- Licence: CC BY-NC-ND 4.0. Shown whole and unaltered, only downscaled to 1000 px; labels sit outside the figure with leaders onto it.
