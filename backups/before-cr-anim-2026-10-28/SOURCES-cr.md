# Lecture 2, slides C14–C15 real images and redrawn data (chunk cr, 28 Oct 2026)

All images come from the reference board `refs/C5-crops/` and were cut with `scratchpad/cr/tools/prep.py` (PIL). Photos got a
resize and a light warm grade (saturation × 0.9–0.95); published figures are unchanged and multiply their white ground into
the page. Nothing is painted over. Crop windows inside the figures are set in code (`shot(…, { win })`, image pixels x, y,
width, height). Each figure carries its own credit line. Copyrighted figures are used with credit, as the lecturer decided
on 27 Oct 2026.

## C14 · Rising CO₂ (`figs/cr14.ts`)

`photos/cr-face-wheat.jpg`: Bruce Kimball, USDA Agricultural Research Service, a FACE ring in a wheat field, date stamp
25 Mar 1993. Wikimedia Commons, https://commons.wikimedia.org/wiki/File:Agriculture_Research_Service_(ARS)_(8412930086).jpg,
public domain (US government work). The site is not stated on the file; Kimball led the Maricopa, Arizona wheat FACE.
- Crop: x 0–1464, y 0–728 of the board file (the red date stamp at the bottom right is cut off). Variant v1 shows
  y 90–690.

`photos/cr-soyface-b.jpg`, `photos/cr-soyface-c.jpg`: Aspray EK, et al. (2023) Two decades of fumigation data from the
Soybean Free Air Concentration Enrichment facility. *Sci Data* 10: 226, https://doi.org/10.1038/s41597-023-02118-x,
**Fig. 1b–c** (photos A. Leakey, S. Gable). CC BY 4.0 (PMC10119297).
- `-b`: panel b, y 0–284 (soybean plot inside its octagon of gas pipes); v6 shows x 8–290, y 40–262, which leaves out the
  authors' red and blue circles and the panel letter. The authors' yellow "20 m" arrow is outside the window.
- `-c`: panel c, y 288–592 of the board file (the gas manifold beside a maize plot); v6 shows x 150–435, y 40–264.

`photos/cr-myers-f1.jpg`: Myers SS, et al. (2014) Increasing CO₂ threatens human nutrition. *Nature* 510: 139–142,
https://doi.org/10.1038/nature13179, **Fig. 1** (author manuscript PMC4810679). © Springer Nature. Whole figure, unchanged;
the y-axis title ("change at ≈ 550 ppm CO₂ (%)") is ours, because the published panel has none. Elevated CO₂ in the
experiments: 546–586 ppm.

`photos/cr-al21-f1.jpg`: Ainsworth EA, Long SP (2021) 30 years of free-air carbon dioxide enrichment (FACE): what have we
learned about future crop productivity and its potential for adaptation? *Glob Change Biol* 27: 27–49,
https://doi.org/10.1111/gcb.15375, **Fig. 1** (Mauna Loa CO₂ 1980–2019 with the start of each crop FACE experiment).
© Wiley. Whole figure, unchanged.

`photos/cr-ear.jpg` (also on C15): Patrick Alexander, "Triticum aestivum", Wikimedia Commons (via Flickr), CC0,
https://commons.wikimedia.org/wiki/File:Triticum_aestivum_-_Flickr_-_aspidoscelis.jpg. Resized to 1200 × 800; v5 and C15 v6
show x 580–940, y 40–760.

Redrawn data (no image):
- v2: Ainsworth & Long 2021 **Fig. 2**, means and error bars measured on the published figure (board image f; 0.0 at x 583,
  0.2 at x 946 px): wheat +14.1 % (9.0–21.9), rice +14.1 (12.7–15.7), legumes +20.4 (18.7–24.0), root crops +21.9
  (14.7–32.5), C₃ low N +10.0 (7.9–12.7), C₃ warming +9.8 (7.9–13.6), C₄ all −2.9 (−6.2 to 1.7), C₄ drought +20.3
  (17.6–23.6), C₃ all +17.7. The open data set (Illinois Data Bank, https://doi.org/10.13012/B2IDB-2432396_V1, CC0) was not
  downloaded.
- v3: Leakey ADB, et al. (2009) Elevated CO₂ effects on plant carbon, nitrogen, and water relations: six important lessons
  from FACE. *J Exp Bot* 60: 2859–2876, https://doi.org/10.1093/jxb/erp096, **Fig. 4**, curves digitised from board image e
  (x 48 px per 100 µmol mol⁻¹, y 4.46 px per µmol m⁻² s⁻¹). Soybean Cᵢ 270 and 384 µmol mol⁻¹ at 384 and 550 ppm, and
  "+29 %", are from the paper's text.
- v5: wheat yield +14 % (Ainsworth & Long 2021, Fig. 2) with Myers et al. 2014 Table E1 (Zn −9.3, Fe −5.1, protein −6.3 %).
- v6, v7: soybean at SoyFACE 2002, 380 vs 550 ppm, from Zhu, Long & Ort 2010 **Table 1**; maize: Leakey et al. 2006,
  *Plant Physiol* 140: 779, https://doi.org/10.1104/pp.105.073957 (abstract).

## C15 · From leaf to loaf (`figs/cr15.ts`)

`photos/cr-zhu-f2.jpg`: Zhu X-G, Long SP, Ort DR (2010) Improving photosynthetic efficiency for greater yield.
*Annu Rev Plant Biol* 61: 235–261, https://doi.org/10.1146/annurev-arplant-042809-112206, **Fig. 2** (free to read on
annualreviews.org). © Annual Reviews. Board PNG converted to JPEG, unchanged; the clay frame around the photorespiration row
is ours.

`photos/cr-south-f3.jpg`: South PF, Cavanagh AP, Liu HW, Ort DR (2019) Synthetic glycolate metabolism pathways stimulate crop
growth and productivity in the field. *Science* 363: eaat9077, https://doi.org/10.1126/science.aat9077, **Fig. 3A**
(greenhouse tobacco after 6 weeks). CC BY 4.0 (PMC7745124). v7 shows x 22–768, y 8–308 (the photo; the panel letter and
panel B are outside the window). The plant labels under the pots are the authors'.

`photos/cr-chen-f9a.jpg`, `photos/cr-chen-f6.jpg`: Chen J, et al. (2024) *Plant Physiol* 196: 1980,
https://doi.org/10.1093/plphys/kiae429, **Fig. 9A** (wild-type row: SEM of developing durum-wheat endosperm 10, 15 and 20
days after flowering; A-type granules red, B-type blue, coloured by the authors; bars 50 µm) and **Fig. 6B** (wild-type
column: SEM of purified starch granules from mature grain; bar 20 µm). CC BY 4.0 (PMC11531834).
- `f9a`: v6 shows x 26–739 (the rotated row label is left out).
- `f6`: v6 shows x 16–205, y 340–626 (panel B only; panel letter left out).

Not used here although on the board: `south2019-bypass-pathways.jpg` (South Fig. 1A is already on slide C6, `k06.ts`),
`south2019-field-2017.jpg` (its values are redrawn in v7/v8 instead), `noaa-scripps-keeling-curve.png` (kept for the C14
animation).

Redrawn data (no image):
- v2: Zhu, Long & Ort 2010 Fig. 2 values (30 °C, 387 ppm).
- v3, v4, v9: Zhu, Long & Ort 2010 Table 1 and text (εi 0.89, εp 0.60; 620 MJ m⁻² sunlight, 17.7 MJ m⁻² biomass, 10.6 MJ m⁻²
  seed; the maxima 4.6 % and 6 %; observed ≈ one third of the theoretical).
- v7, v8: South et al. 2019 (field biomass +20 % in 2016, +24 % in 2017); Cavanagh AP, et al. (2022) *Plant Biotechnol J*
  20: 711, https://doi.org/10.1111/pbi.13750 (+11 % ambient, +26 % at +5 °C); Meacham-Hensold K, et al. (2024)
  *Glob Change Biol* 30: e17595, https://doi.org/10.1111/gcb.17595 (potato tubers per plant +9.5 % in 2020, +30 % in 2022).
- v5 (drawn): Sanchez-Bragado R, et al. (2014) *J Exp Bot* 65: 5401, https://doi.org/10.1093/jxb/eru298 (ear and flag leaf
  as grain carbon sources).
