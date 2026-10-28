# Lecture 2, slides C11–C13 real images and redrawn data (chunk cc, 28 Oct 2026)

Made by `scratchpad/cc/tools/assets.py` from the reference board `refs/C4-co2-concentration/` (crops in pixels of the board file, x0, y0, x1, y1). Electron micrographs are toned from ink (#221f1d) to paper (#fbf8f0); colour figures keep their colours, with the near-white ground set to white so that they multiply into the page. Nothing is painted over. Panel letters are cut out by the crop or by the figure's window (`shot()` in `figs/cc-kit.ts`). Each figure carries its own credit line. Redrawn graphs say "redrawn from" or "after" in their credit.

## C11 · Refixation of photorespired CO₂ (`figs/cc11.ts`)

`photos/cc-busch-tem-a.jpg` … `cc-busch-tem-d.jpg`: Busch FA, Sage TL, Cousins AB, Sage RF (2013) C₃ plants enhance rates of photosynthesis by reassimilating photorespired and respired CO₂. *Plant Cell Environ* 36: 200–212, https://doi.org/10.1111/j.1365-3040.2012.02567.x, **Fig. 4**: TEMs of wheat (a, b) and rice (c, d) mesophyll; arrows mark stromules; C chloroplast, m mitochondrion, p peroxisome, n nucleus, IAS intercellular air space; bars 2 µm.

- Licence: © Wiley (free access); lecture use with credit (lecturer's decision, 27 Oct 2026).
- Crops of the 1007 × 1005 board file: a (0, 0, 498, 496), b (0, 501, 498, 1005), c (503, 0, 1007, 496), d (503, 501, 1007, 1005). The figure windows cut the panel letters: v1 uses c from (34, 26) and d from (30, 30); v2 uses b from y 30.

`photos/cc-sage14-tem-{c3,pk,c2,c4l,c4}.jpg`: Sage RF, Khoshravesh R, Sage TL (2014) From proto-Kranz to C₄ Kranz: building the bridge to C₄ photosynthesis. *J Exp Bot* 65: 3341–3356, https://doi.org/10.1093/jxb/eru180, **Fig. 2**, the coloured bundle-sheath TEMs of *Flaveria* (chloroplasts green, mitochondria red; colours theirs).

- Licence: © Oxford University Press; lecture use with credit.
- Crops of the 1177 × 1280 board file, y 291–506: C₃ x 23–235, proto-Kranz 254–467, C₂ 482–691, C₄-like 709–923 (not used), C₄ 942–1157.

`photos/cc-sage14-gdc-{a,c,d,f}.jpg`: same paper, **Fig. 3**, immunolocalization of glycine decarboxylase (brown); D *Flaveria cronquistii* (C₃), F *F. ramosissima* (C₂); A, C *Heliotropium* (not used yet).

- Crops of the 1280 × 1180 board file, the left 96 px of each panel cut (panel letter and species code): a (96, 0, 647, 389), c (96, 790, 647, 1180), d (747, 0, 1280, 389), f (747, 790, 1280, 1180).

`photos/cc-khosh-aci.jpg`: Khoshravesh R, Stinson CR, Stata M, Busch FA, Sage RF, Ludwig M, Sage TL (2016) C₃–C₄ intermediacy in grasses. *J Exp Bot* 67: 3065–3078, https://doi.org/10.1093/jxb/erw150, **Fig. 4** (A/Cᵢ of C₃, C₂ and C₄ grasses at 31 °C). C* values on the figure: their Table 1 and text ("C* values of the C₂ species were 10.8−20 µmol mol⁻¹"; C₃ "near 50").

- Licence: CC BY 3.0 (PMC4867898). Whole figure, ground whitened.

`photos/cc-sage12-tree.jpg`: Sage RF, Sage TL, Kocacinar F (2012) Photorespiration and the evolution of C₄ photosynthesis. *Annu Rev Plant Biol* 63: 19–47, https://doi.org/10.1146/annurev-arplant-042811-105511, **Fig. 2** (phylogeny, C₄ lineages red). © Annual Reviews. Board file downscaled to 1100 px, ground whitened. "> 60 origins": Sage 2016, *J Exp Bot* 67: 4039 (61 lineages).

**Redrawn (no image):**
- v3 and the C₃ panel of the schema: drawn after Busch FA (2020) Photorespiration in the context of Rubisco biochemistry, CO₂ diffusion and metabolism. *Plant J* 101: 919–939, https://doi.org/10.1111/tpj.14674, **Fig. 2a, b** (itself adapted from von Caemmerer 2013). Cover values: Busch et al. 2013 (rice Sc/Sm 0.989, wheat 0.925; tobacco ≈ 0.6, Discussion).
- v4: redrawn from Busch et al. 2013 **Fig. 5a**: points read from the figure (rice 98.9 %, 45.9; wheat 92.5 %, 46.7; *F. cronquistii* 78 %, 47.0; sunflower 77 %, 48.5; rye 70 %, 48.4; tobacco 61 %, 51.4; in vitro Γ* 0 %, 57.2 µmol mol⁻¹), regression y = −12.79x + 58.19 from the caption.
- v5: Busch et al. 2013 **Table 1** and Results, 350 µmol mol⁻¹ CO₂, 30 °C: refixed inside the cell 29 % (rice) and 26 % (wheat); intrafoliaceous 51 % and 46 %, so refixed from the air spaces 22 % and 20 % (the paper: "20–23 %"); net CO₂ uptake +11 % and +9 %.
- v6 and the C₂ panel: drawn after Sage, Sage & Kocacinar 2012 **Fig. 5** and Busch 2020 **Fig. 2**.

## C12 · C₄ photosynthesis (`figs/cc12.ts`)

`photos/cc-maize-kranz.jpg`: Berkshire Community College Bioscience Image Library, "Angiosperm Morphology: Bundle Sheaths in Zea Leaf", Wikimedia Commons, **CC0**, https://commons.wikimedia.org/wiki/File:Angiosperm_Morphology_Bundle_Sheaths_in_Zea_Leaf_(36808119403).jpg. Board file downscaled to 1400 × 789.

`photos/cc-haberlandt-105.jpg`: Haberlandt G (1904) *Physiologische Pflanzenanatomie*, 3rd edn, Leipzig: Engelmann, p. 252, **Fig. 105** (*Panicum turgidum*, after Volkens), public domain, https://archive.org/details/physiologischepf00habeuoft/page/252. Crop (868, 22, 1600, 762) of the board file; levels lift the print-through of the facing page (grey > 168 set to white); the figure window cuts the caption line.

`photos/cc-hatch-slack.png`: Hatch MD, Slack CR (1966) Photosynthesis by sugar-cane leaves. *Biochem J* 101: 103–111, https://doi.org/10.1042/bj1010103, **Fig. 2** (share of ¹⁴C per compound, 5–150 s). © Biochemical Society; free in PMC1270070. Crop (96, 30, 790, 700) of the board scan (plot only, caption cut); grey > 200 set to white.

`photos/cc-sage12-nadpme.jpg`: Sage, Sage & Kocacinar 2012, **Fig. 1** (NADP-ME C₄ cycle; CO₂ ≈ 100 µmol mol⁻¹ in the mesophyll, ≈ 1500 in the bundle sheath). © Annual Reviews. Whole board file, ground whitened.

**Redrawn (no image):**
- v3: drawn after Sage, Sage & Kocacinar 2012 **Fig. 1**; CO₂ values from that figure; 2 ATP per PEP: von Caemmerer 2021, *J Exp Bot* 72: 6003, https://doi.org/10.1093/jxb/erab266.
- v6: after Ehleringer J, Björkman O (1977) Quantum yields for CO₂ uptake in C₃ and C₄ plants. *Plant Physiol* 59: 86–90, https://doi.org/10.1104/pp.59.1.86, **Fig. 3** and Table 1 (normal air): C₄ *Atriplex rosea* 0.053 at 12–39 °C; C₃ *Encelia californica* 0.069 at 14 °C, 0.0524 at 30 °C, 0.042 at 38 °C. The curve passes through these three values only.

## C13 · Crassulacean acid metabolism (`figs/cc13.ts`)

`photos/cc-agave-field.jpg`: Tomascastelazo, "Agave field in Jalisco, Mexico", Wikimedia Commons, **CC BY-SA 4.0**, https://commons.wikimedia.org/wiki/File:Agave_field_in_Jalisco,_Mexico.jpg. Board file downscaled to 1200 × 860.

`photos/cc-kalanchoe.jpg`: Ixitixel, "Bryophyllum fedtschenkoi (Habitus)", Wikimedia Commons, **CC BY-SA 3.0**, https://commons.wikimedia.org/wiki/File:Bryophyllum_fedtschenkoi_(Habitus).jpg. The 1280 px Commons thumbnail, downscaled to 1000 × 750. Also added to the board as image w.

**Redrawn (no image):**
- v1, v7: Borland AM, Griffiths H, Hartwell J, Smith JAC (2009) Exploiting the potential of plants with crassulacean acid metabolism for bioenergy production on marginal lands. *J Exp Bot* 60: 2879–2896, https://doi.org/10.1093/jxb/erp118, **Fig. 3A** (*Kalanchoë fedtschenkoi*, CO₂ exchange over 24 h; dark 00:00–12:00, light 12:00–24:00; phases after Osmond 1978). The curve was digitized by colour from the board image (`tools/digitize.py`); one stray column (legend pixels) removed.
- v2, v4 inset, v8: Abraham PE, Yin H, Borland AM, et al. (2016) Transcript, protein and metabolite temporal dynamics in the CAM plant *Agave*. *Nature Plants* 2: 16178, https://doi.org/10.1038/nplants.2016.178, **Fig. 1a** (net CO₂ uptake, leaves L1 C₃ and L4 CAM, 12 h light) and **Fig. 1c** (malic acid, µg g⁻¹ fresh weight, shown here in mg g⁻¹). Values read by eye from the board image; the x axis of Fig. 1a has no numbers, so hours are placed from the light/dark shading.
- v5: Borland et al. 2009 **Table 2**: CO₂ gained per water lost, mmol CO₂ per mol H₂O: C₃ 0.5–1.5, C₄ 1–2, CAM 4–10.
- v3 and the CAM panel: drawn after Borland et al. 2009 and Males J, Griffiths H (2017) Stomatal biology of CAM plants. *Plant Physiol* 174: 550–560, https://doi.org/10.1104/pp.17.00114.

## Reference board additions (`refs/C4-co2-concentration/`, ids u, v, w)

- u `busch2013-cstar-vs-cover.png`: Busch et al. 2013 Fig. 5 (475 × 721, from the Wiley full-text page).
- v `busch2020-chloroplast-barrier.png`: Busch 2020 Fig. 2 (242 × 500 web image only).
- w `kalanchoe-fedtschenkoi-habitus.jpg`: as `photos/cc-kalanchoe.jpg`.
