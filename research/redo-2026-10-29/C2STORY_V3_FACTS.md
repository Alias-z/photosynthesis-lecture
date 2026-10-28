# C2 story v3: fact table (checked 28 Oct 2026)

Read depth: "full text" = the paper itself was read (PMC or an open repository copy). "data" = the curated Flamholz et al. 2019 data set (GitHub `flamholz/rubisco`, `DatasetS1_SourceRubiscoKinetics.csv`), which records each value with its primary paper. "abstract" = only the PubMed or Crossref abstract was read. Paywalled or bot-checked: Whitney 2001, Kane 1994, Morell 1994 (JBC), Badger & Price 2003 (OUP), Goudet 2020 (Wiley), Gibson 2018 (GSA) and the Jordan & Ogren 1981 full text (no ETH access on nature.com). None of these was circumvented.

All S values are in dissolved-gas units at 25 °C. Tcherkez 2006 Table 1 brings S and Kc to a common CO₂/HCO₃⁻ pKa of 6.25.

## 1. RuBisCO kinetics (25 °C)

| Claim | Value | Source with table/figure | Read depth | Confidence |
|---|---|---|---|---|
| Cyanobacterium *Synechococcus* PCC 6301 (form IB, carboxysome): S | 43 | Tcherkez et al. 2006 PNAS, Table 1 (ref 49 = Morell et al. 1994 JBC 269:8091); also Kane et al. 1994 (42.5 ± 1), Greene 2007 (43.9), Mueller-Cajar 2008 (41.5) | full text (Tcherkez); data (others) | high |
| *Synechococcus* PCC 6301: kcat | 11.6 s⁻¹ | Tcherkez 2006 Table 1 (Morell 1994); data: Mueller-Cajar 2008 11.8, Shih 2016 9.8; *S. elongatus* PCC 7942 in tobacco 14.4 (Occhialini et al. 2016) | full text (Tcherkez); data | high (range 10–14) |
| Green alga *Chlamydomonas reinhardtii* (pyrenoid CCM): S | 61 | Jordan & Ogren 1981 (61 ± 5, via Tcherkez 2006 Table 1, ref 9, and the data set); Satagopan & Spreitzer 2008 BMC Plant Biol Table 1: 61 ± 1 (25 °C) | full text (Tcherkez, Satagopan); abstract (Jordan & Ogren) | high |
| *Chlamydomonas*: kcat | 5.8 s⁻¹ (measured at 30 °C, adjusted to 25 °C with the Ea of *Euglena*) | Tcherkez 2006 Table 1, footnote ‡ (ref 57, Seemann et al. 1984) | full text | medium. A direct 25 °C value is 2.7 ± 0.2 s⁻¹ (Satagopan & Spreitzer 2008 Table 1), but the same lab measured spinach at only 1.4 (other labs 2.4–3.7). Both sources put *Chlamydomonas* ≈ 2× faster than the plant enzyme. |
| C₃ land plant, tobacco (the Γ* enzyme of Bernacchi et al. 2001, cv. W38): S | 82 ± 2 | Whitney et al. 2001 Plant J, via Tcherkez 2006 Table 1 (ref 55) and the data set; same method as for *Synechococcus*: Kane 1994, 81.9 ± 1 | full text (Tcherkez); data | high. Other labs give 80–96 (Long 2018 80, Sharwood 2016 82.6, Occhialini 2016 91.2, Uemura 1996 93.1, Orr 2016 96.4). |
| Tobacco: kcat | 3.4 ± 0.1 s⁻¹ | Whitney 2001, via Tcherkez 2006 Table 1 and the data set | full text (Tcherkez); data | high (other labs 3.1–4.4) |
| Bernacchi 2001 in vivo Γ* (42.75 µmol mol⁻¹ at 25 °C), converted to dissolved-gas S | ≈ 88–93 (0.5 × 210 000/42.75 × solubility ratio O₂/CO₂ ≈ 0.036–0.038) | own calculation from Bernacchi 2001 | calculation | medium (depends on solubility constants) |
| Spinach (range) | S 80–98; kcat 2.4–3.7 s⁻¹ | Tcherkez 2006 Table 1: 82, 3.7; data: Kane 1994 82.1; Kubien 2008 79.8, 3.2; Uemura 1997 93.8, 2.6; Hermida-Carrera 2016 97, 2.4 | full text (Tcherkez); data | high |
| Wheat (range) | S 90–102; kcat 2.2–4.9 s⁻¹ | Tcherkez 2006 Table 1: 90, 2.5; data: Carmo-Silva 2010 100; Orr 2016 100, 4.9; Hermida-Carrera 2016 100, 2.2 | full text; data | high |
| C₃ plants, median and mean | median S 98 (N = 162); mean S 89.9, mean kcat 3.2 s⁻¹ | Flamholz et al. 2019 Fig. 5 legend; Bouvier et al. 2021 MBE, Results (fig. 2) | full text | high |
| Red alga *Griffithsia monilis* (mesophilic, marine; "CCM absent?"): S | 167 ± 3 | Whitney 2001, via Tcherkez 2006 Table 1 (ref 55) and the data set | full text (Tcherkez); data | high |
| *Griffithsia monilis*: kcat | 2.6 ± 0.1 s⁻¹ | same | full text; data | high |
| Red alga *Galdieria sulphuraria* | S 166 ± 6; kcat 1.2 s⁻¹ | Whitney 2001, via Tcherkez 2006 Table 1 | full text (Tcherkez) | high |
| Red alga *Galdieria partita* (thermoacidophile; highest S known) | S 238; kcat 1.6 s⁻¹ | Uemura et al. 1997 BBRC (abstract: 238, and *Cyanidium caldarium* 222, "2.4 to 2.5-fold that of higher plant RuBisCOs"); kcat from the data set | abstract (S); data (kcat) | high (S); medium (kcat) |
| Red algae, median S | 177 (N = 6) | Flamholz 2019 Fig. 5 legend | full text | high |
| Cyanobacteria, median S | 48 (N = 16) | Flamholz 2019 Fig. 5 legend | full text | high |
| Jordan & Ogren 1981: cyanobacteria vs land plants | *Aphanizomenon* 48, *Coccochloris* 47; soybean 82, *Tetragonia* 81, *Lolium* 80; *Chlamydomonas* 61 | the data set (rows "Jordan 1981") | abstract + data | medium-high |
| Red-algal RuBisCO is a different lineage (form ID, red-type) from the cyanobacterial, green-algal and plant enzyme (form IB). It was acquired by lateral gene transfer from a proteobacterium. | — | Iñiguez et al. 2020 Plant J, section on Rubisco forms (citing Delwiche & Palmer 1996) | full text (accepted manuscript, RIUMA repository) | high |
| The S of red algae falls faster with temperature: *G. partita* vs spinach Arrhenius plots cross at 57 °C | — | Tcherkez 2006 Fig. 4A | full text | high |

## 2. Beat 3 caption

| Claim | Value | Source with table/figure | Read depth | Confidence |
|---|---|---|---|---|
| "prefers CO₂ about twice as strongly as a cyanobacterial one" | tobacco/*Synechococcus* 82/43 = 1.9 (same method in Kane 1994: 81.9/42.5 = 1.93); medians of C₃ plants/cyanobacteria 98/48 = 2.0 | Tcherkez 2006 Table 1; Flamholz 2019 Fig. 5 | full text | high: true as written |
| "and works more slowly" | 3.4 vs 11.6 s⁻¹ (≈ 3.4× slower) | Tcherkez 2006 Table 1 | full text | high: true |
| "changed too, but slowly" | Phylogenetic constraint, "most likely resulting from a slow rate of molecular evolution", limited RuBisCO kinetics more than catalytic trade-offs | Bouvier 2021, Introduction and Discussion | full text | medium-high (an interpretation, well supported) |

## 3. Trade-off (more selective → slower)

| Claim | Value | Source with table/figure | Read depth | Confidence |
|---|---|---|---|---|
| Tcherkez 2006: an inverse S–kcat correlation is "particularly obvious". They propose that a more product-like transition state raises S but slows catalysis, and that every RuBisCO is "nearly perfectly" optimised. | about 20 RuBisCOs; the cyanobacterial outliers are excluded from the fits | Tcherkez 2006 Fig. 3B, Table 1 | full text | high (on what they claim) |
| Savir 2010: 28 RuBisCOs from 27 species lie on an effectively 1-dimensional landscape (the first principal component holds ≈ 91 % of the variance); "S decreases like the square root of" vC | form II outliers excluded | Savir et al. 2010 PNAS Fig. 2 | full text | high |
| Flamholz 2019: in ≈ 300 organisms the correlations are "substantially attenuated" | kcat–S R ≈ −0.6 among form I enzymes (previously ≈ 0.9); the fit exponent CI is (−4.0, −2.0), so the form of the relation is "very uncertain"; > 95 % of kcat values lie in 1–10 s⁻¹; S varies by only ≈ 30 % in form I and < 10 % among C₃ plants | Flamholz 2019 Abstract, Fig. 5A | full text | high |
| Bouvier 2021: strong phylogenetic signal in kinetic traits. S vs kcat explains only 9.8 % of the variance in angiosperms, 8.1 % after phylogenetic correction, and is not significant within C₃ plants. Phylogenetic constraint limited RuBisCO more than all trade-offs together. | — | Bouvier 2021 Abstract, Results, Fig. 3C | full text | high |
| Iñiguez 2020: the trade-offs hold clearly in vascular plants but are "strongly weakened" across diverse groups and absent within diatoms | — | Iñiguez 2020, section 4 | full text (accepted manuscript) | high |
| One sentence for students | "Across today's RuBisCOs, more selective enzymes tend to be slower, but this is a loose trend, not a strict law." | synthesis of the 4 papers above | — | high |

## 4. CO₂-concentrating mechanisms

| Claim | Value | Source with table/figure | Read depth | Confidence |
|---|---|---|---|---|
| Cyanobacteria concentrate CO₂ in carboxysomes, fed by HCO₃⁻ and CO₂ uptake systems | — | Badger & Price 2003 J Exp Bot, abstract | abstract | high |
| All known cyanobacteria have a CCM | — | Flamholz 2019 Introduction; Iñiguez 2020 section 3 ("All cyanobacteria, the vast majority of eukaryotic algae, some hornworts…") | full text | high |
| Pyrenoids in algae: high-affinity CCM physiology correlates strongly with pyrenoids in microalgae; macroalgae are more variable | — | Badger et al. 1998 Can J Bot, abstract | abstract | high |
| "Algae have adopted two primary strategies…": a CCM or the evolution of RuBisCO's kinetics. Algal RuBisCOs evolved higher CO₂ affinity where the algae lack a CCM. | — | Badger et al. 1998, abstract | abstract | high. This supports the "instead" in beat 4. |
| A causal "so they keep a fast, less selective enzyme" | Partly supported. Raised CO₂ "permits an adequate vc/vo… with a lower S… and thus a higher kcat" (Tcherkez 2006). RuBisCO evolved first in high CO₂, and CCMs came later, when CO₂ fell to 2–16 × today's level, "depending on Rubisco kinetics" (Raven et al. 2017). Iñiguez 2020 notes that the timing of the first CCM is unresolved. It is also not general: diatoms and red algae with CCMs have high-S, slow, red-type enzymes (for example *Phaeodactylum*: S 113, kcat 3.4). | Tcherkez 2006 text after Fig. 3; Raven et al. 2017, abstract; Iñiguez 2020 section 2; Tcherkez 2006 Table 1 | full text / abstract | medium: the "so" and the "keep" are hypotheses, and "many algae" overgeneralises |
| Mechanism (safe): with a CCM, a fast low-S enzyme works well. A 30-fold CO₂ enrichment raises PCC 7942 RuBisCO's net carboxylation from ≈ 4 % to ≈ 60 % of kcat. | — | Flamholz 2019 Introduction | full text | high |
| Hornwort pyrenoids arose 5–6 times; the oldest ≈ 100 million years ago, most < 35 million years ago | — | Villarreal & Renner 2012 PNAS, abstract | abstract | high |
| Most land plants have no CCM; only ≈ 25 % of terrestrial primary production uses one | — | Iñiguez 2020 section 3 (citing Still et al. 2003) | full text | high. "Most without a CCM" in beat 5 is supported. |

## 5. Lineage-tree times

| Claim | Value | Source with table/figure | Read depth | Confidence |
|---|---|---|---|---|
| Cyanobacteria / oxygenic photosynthesis | evidence consistent with cyanobacteria at 3.2–2.7 Ga; O₂ oases 3.2–3.0 Ga; phylogenies "mostly" put cyanobacteria by 2.8 Ga (a minority: only 50–100 Ma before the GOE) | Catling & Zahnle 2020 Sci Adv, section "Negligible Archean O₂ but oxygen oases…" | full text | medium: the origin is debated; draw ≈ 3 Ga with "≥ 2.7" |
| Great Oxidation Event | O₂ > 10⁻⁵ PAL from ≈ 2.43 Ga; permanent from ≈ 2.22 Ga | Poulton et al. 2021 Nature, abstract | abstract | high |
| Biological C-isotope fractionation (carbon fixation) | 3.7 Ga (graphite), 3.52 Ga (kerogen) | Catling & Zahnle 2020 | full text | medium |
| Red–green algal split | ≈ 1.5 Ga (molecular clock) | Yoon et al. 2004 MBE, abstract | abstract | low-medium (clock estimates range ≈ 1.0–1.9 Ga) |
| Oldest accepted red alga | *Bangiomorpha pubescens*, 1.047 (+0.013/−0.017) Ga | Gibson et al. 2018 Geology (number from the press release and search summary; paper bot-checked) | secondary | medium-high |
| Older probable red algae | ≈ 1.6 Ga (*Rafatazmia*, *Ramathallus*; "if these inferences are correct") | Bengtson et al. 2017 PLoS Biol, abstract | abstract | low (contested) |
| Oldest green alga (chlorophyte) | ≈ 1.0 Ga (*Proterocladus antiquus*) | Tang et al. 2020 Nat Ecol Evol, abstract | abstract | medium |
| Crown green plants (Viridiplantae), clock | 972–670 Ma (95 % HPD) | Morris et al. 2018 PNAS Table 3 | full text | medium |
| Land plants, fossils | cryptospores, Dapingian (early Middle Ordovician), c. 473–471 Ma | Rubinstein et al. 2010 New Phytol, abstract; Morris 2018 Discussion ("Dapingian; 469 Ma") | abstract; full text | high |
| Land plants, molecular clock | crown embryophytes 515–474 Ma (95 % HPD across topologies; 583–470 Ma across all strategies), "middle Cambrian–Early Ordovician" | Morris 2018 Tables 2–3, Fig. 5 | full text | high |
| First C₄ plants | first C₃ → C₄ transition (grasses, Chloridoideae) 32.0–25.0 Ma | Christin et al. 2008 Curr Biol, abstract | abstract | medium-high |
| First C₄ plants, review | grasses "probably during the Oligocene (24–35 million yr ago)"; first C₄ dicots 15–21 Ma; most C₄ dicots < 5 Ma | Sage 2004 New Phytol, abstract | abstract | medium-high |

## 6. DOIs in the C2STORY3 cites (Crossref, 28 Oct 2026)

| Claim | Value | Source with table/figure | Read depth | Confidence |
|---|---|---|---|---|
| VCF81 10.1007/BF00384257 | von Caemmerer & Farquhar 1981, Planta 153:376 | Crossref | metadata | resolves ✓ |
| BERNACCHI01 / 01S 10.1111/j.1365-3040.2001.00668.x | Bernacchi et al. 2001, PCE 24:253 | Crossref | metadata | ✓ |
| JORDAN81 10.1038/291513a0 | Jordan & Ogren 1981, Nature 291:513 | Crossref | metadata | ✓ |
| CATLING20 10.1126/sciadv.aax1420 | Catling & Zahnle 2020, "The Archean atmosphere" | Crossref | metadata | ✓ (it never mentions RuBisCO) |
| ALLWOOD06 10.1038/nature04764 | Allwood et al. 2006, Nature 441:714 (stromatolite reef) | Crossref | metadata | ✓ |
| POULTON21 10.1038/s41586-021-03393-7 | Poulton et al. 2021, Nature 592:232 | Crossref | metadata | ✓ |
| TCHERKEZ06 10.1073/pnas.0600605103 | Tcherkez et al. 2006, PNAS 103:7246 | Crossref | metadata | ✓ |
| FLAMHOLZ19 10.1021/acs.biochem.9b00237 | Flamholz et al. 2019, Biochemistry 58:3365 | Crossref | metadata | ✓ |
| BADGER03 10.1093/jxb/erg076 | Badger & Price 2003, J Exp Bot 54:609 | Crossref | metadata | ✓ |
| MORRIS18 10.1073/pnas.1719588115 | Morris et al. 2018, PNAS 115 | Crossref | metadata | ✓ |
| FOSTER17 10.1038/ncomms14845 | Foster et al. 2017, Nat Commun 8 | Crossref | metadata | ✓ |
| SCHACHAT18 10.1098/rspb.2017.2631 | Schachat et al. 2018, Proc R Soc B 285 | Crossref | metadata | ✓ |
| JUDD24 10.1126/science.adk3705 | Judd et al. 2024, Science 385 | Crossref | metadata | ✓ |
| MARTINEZ11 10.1126/science.1198467 | Martinez et al. 2011, Science 331:206 (basal dinosaur) | Crossref | metadata | ✓ |
| BEREITER15 10.1002/2014GL061957 | Bereiter et al. 2015, GRL 42:542 | Crossref | metadata | ✓ |
| SNYDER16 10.1038/nature19798 | Snyder 2016, Nature 538:226 | Crossref | metadata | ✓ |
| IPCC21 10.1017/9781009157896.004 | AR6 WG1 Ch. 2, "Changing State of the Climate System" | Crossref | metadata | ✓ |
| HADCRUT5 10.1029/2019JD032361 | Morice et al. 2021, JGR Atmos 126 | Crossref | metadata | ✓ |
| WHITNEY01 10.1046/j.1365-313x.2001.01056.x | Whitney et al. 2001, Plant J 26:535 | Crossref + PubMed | abstract | ✓ |
| LIN14 10.1038/nature13776 | Lin et al. 2014, Nature 513:547 | Crossref | metadata | ✓ |
| OCCHIALINI16 10.1111/tpj.13098 | Occhialini et al., Plant J 85:148 (online Dec 2015; issue 2016) | Crossref | metadata | ✓ |
| MCDONALD26 10.1126/sciadv.aeh3246 | McDonald et al. 2026, Sci Adv 12 | Crossref | metadata | ✓ |
| Suggested additions | Badger et al. 1998 10.1139/b98-074; Bouvier et al. 2021 10.1093/molbev/msab079; Savir et al. 2010 10.1073/pnas.0911663107; Rubinstein et al. 2010 10.1111/j.1469-8137.2010.03433.x; Villarreal & Renner 2012 10.1073/pnas.1213498109; Christin et al. 2008 10.1016/j.cub.2007.11.058; Sage 2004 10.1111/j.1469-8137.2004.00974.x; Uemura et al. 1997 10.1006/bbrc.1997.6497; Raven et al. 2017 10.1093/jxb/erx110; Yoon et al. 2004 10.1093/molbev/msh075; Tang et al. 2020 10.1038/s41559-020-1122-9; Gibson et al. 2018 10.1130/G39829.1; Satagopan & Spreitzer 2008 10.1186/1471-2229-8-85 | Crossref / PubMed | metadata | all resolve ✓ |
