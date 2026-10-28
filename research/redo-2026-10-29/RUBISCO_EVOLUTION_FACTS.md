# RuBisCO evolution: fact table (checked 28 Oct 2026)

Extends `C2STORY_V3_FACTS.md` (Tcherkez 2006 Table 1 values and lineage-tree times are kept as verified there).

**Read depth.**
- "full text": the paper itself was read (PMC full-text XML through NCBI E-utilities, or an open repository copy).
- "data": the curated Flamholz et al. 2019 data set (`DatasetS2_RubiscoKinetics_Merged.csv`: wild type, 25 °C, near pH 8), or the authors' raw data on Edmond for Schulz 2022.
- "abstract": only the PubMed abstract was read.
- "secondary": the value comes from another paper that quotes the source.

**Blocked, not circumvented.** science.org (Cloudflare check): Schulz 2022 text. academic.oup.com (check): Tabita 2008 text. Nature Plants: Banda 2020 is paywalled; the copy at innovativegenomics.org returned 403. The PMC web pages showed a reCAPTCHA, so the same PMC articles were taken through the official E-utilities API instead.

All S values are dimensionless (dissolved-gas units) at 25 °C unless a row says otherwise. Kinetic values differ between labs and assays: for *R. rubrum* the kcat is 5–7 s⁻¹ in older assays and 11–12 s⁻¹ in Davidi 2020 as corrected in 2025. Compare groups, not single digits.

---

## 1. Forms of RuBisCO and their hosts

| Claim | Value | Source with table/figure | Read depth | Confidence |
|---|---|---|---|---|
| Four forms. Forms I, II and III carboxylate and oxygenate RuBP. Form IV (RuBisCO-like protein, RLP) does neither and has ≥ 6 clades. | — | Tabita et al. 2008 J Exp Bot 59:1515, abstract | abstract | high |
| All forms are built from the L₂ dimer of ~50 kDa large subunits; the active sites sit at the L–L interface. Forms II and III occur as (L₂)ₙ. Form I is L₈S₈, with a ~15 kDa small subunit. | n up to 5 in forms II/III | Iñiguez et al. 2020 Plant J, §1; Erb & Zarzycki 2018 Curr Opin Biotechnol, section "Oligomerization of RubisCO" | full text (both) | high |
| **Form III**: anaerobic archaea, for example *Thermococcus kodakarensis* (decamer, (L₂)₅) and *Archaeoglobus fulgidus*, plus some bacteria. Its role is nucleoside (AMP) salvage via the pentose-bisphosphate pathway, not the Calvin cycle. Some methanogens use form III with phosphoribulokinase in a "reductive hexulose-phosphate" pathway. | — | Erb & Zarzycki 2018, section "RubisCO evolved in a non-heterotrophic context"; Iñiguez 2020 §1 (Sato 2007; Kono 2017); Kacar 2017 Introduction | full text | high |
| **Form II/III**: *Methanococcoides burtonii* and other Methanosarcinales; also candidate-phyla-radiation (CPR) bacteria. Gunn et al. 2017 renamed the *M. burtonii* enzyme **form IIIB**: an (L₂)₅ decamer with a 29-residue domain that mimics the small subunit. | — | Iñiguez 2020 §1; Erb & Zarzycki 2018; Gunn 2017 JBC 292:6838 abstract; Flamholz data labels it "2_3" | full text; abstract | high (the nomenclature differs between papers) |
| **Form II**: proteobacteria (*Rhodospirillum rubrum*, *Rhodobacter sphaeroides* II, *Thiobacillus*, the *Riftia* symbiont, *Gallionella*, Zetaproteobacteria) and **peridinin dinoflagellates**. In dinoflagellates it is nuclear-encoded and acquired by HGT from a proteobacterium. | — | Morse et al. 1995 Science 268:1622, abstract; Iñiguez 2020 §1; Davidi 2020 Table 1 | abstract; full text | high |
| **Form IV (RLP)**: *Bacillus subtilis* (an enolase in methionine salvage), *Rhodopseudomonas*, *Chlorobium*, some archaea. *R. rubrum* form II RuBisCO can substitute for the *B. subtilis* RLP. | — | Ashida et al. 2003 Science 302:286, abstract; Erb & Zarzycki 2018 Fig. 1 | abstract; full text | high |
| **Form IA**: proteobacteria (*Halothiobacillus*, *Allochromatium vinosum*, *Thiobacillus*) and **α-cyanobacteria** (*Prochlorococcus*, marine *Synechococcus*, *Cyanobium*), with α-carboxysomes. Some proteobacteria have IAq, a type without carboxysomes. | — | Badger et al. 2002 Funct Plant Biol, abstract (coined α/β-cyanobacteria: IA + α-carboxysome, IB + β-carboxysome); Iñiguez 2020 §4; Shih 2016 Introduction | abstract; full text | high |
| **Form IB**: **β-cyanobacteria, glaucophytes, euglenozoa, chlorophytes (green algae) and streptophytes (land plants)**. C₃, C₄ and CAM plants all carry form IB; only the kinetics differ. | — | Iñiguez 2020 §1 | full text | high |
| **Form IC**: diverse proteobacteria (*Rhodobacter sphaeroides* I, *Cupriavidus/Ralstonia*). **Form ID**: red algae (rhodophytes), cryptophytes, ochrophytes (diatoms, brown algae) and haptophytes. IA and IB are "green-type"; IC and ID are "red-type". | — | Iñiguez 2020 §1 (citing Tabita 2008) | full text | high |
| **Form ID in red algae came from a proteobacterium**: the cyanobacterial *rbcLS* of the red lineage was "apparently replaced" by a proteobacterial one, "probably by lateral gene transfer". The less probable alternative is an ancient duplication followed by differential loss. The replacement happened before the secondary endosymbioses, so diatoms, haptophytes and cryptophytes inherited ID from their red-algal endosymbiont. | ~6 HGTs implied by the rbcL tree: 2 cyanobacteria ↔ proteobacteria, 1 proteobacteria → plastids, 3 within proteobacteria | Delwiche & Palmer 1996 MBE 13:873, abstract; Iñiguez 2020 §1 | abstract; full text | high (HGT favoured; duplication + loss not excluded) |
| In form ID both *rbcL* and *rbcS* sit in the plastid genome as one operon. In the green lineage (IB) *rbcS* moved to the nucleus. Activases differ: Rca (green) vs CbbX (red). | — | Iñiguez 2020 §1 | full text | high |
| **Form I′** (I-prime): Chloroflexi (Anaerolineales; *Ca.* Promineofilum breve). An **L₈ octamer with no small subunit**, sister to form I. It "diverged before the evolution of cyanobacteria and the origin of the small subunit". | PDB 6URA (L₈) | Banda et al. 2020 Nat Plants 6:1158, abstract and Extended Data legends; RCSB 6URA | abstract + figure legends | high |
| **Form Iα and form I″**: deeper clades from metagenomes, without RbcS. Form Iα (Chloroflexota, Limnocylindria) is a **dimer (L₂)**. Form I″ (Firmicutes, from a hot spring) is an **L₈ octamer** that carries the insertion that "primed" it to bind a small subunit. | PDB 8U66 (I″, L₈) | Liu et al. 2023 Curr Biol 33:5316, Summary, Highlights and Results | full text (eScholarship, CC BY) | high |
| The branching order of I′, I″ and I is **not settled**. Schulz 2022 places I″ as the sister of form I. Liu 2023 (unconstrained tree, bootstrap 1) places I″ between Iα and I′. | — | Liu 2023, Results ("Discovery…", "New metagenomic sequences…") | full text | high that it is contested |
| Origin of the family: either RuBisCO evolved from a non-carboxylating, RLP-like enolase (carboxylation is the derived trait), or RLPs evolved from RuBisCO. Erb & Zarzycki and Iñiguez favour the first; Tabita 2008 proposes "a primordial archaeal Rubisco". The placement of form II relative to form III also varies between trees (Kacar 2017). | — | Erb & Zarzycki 2018 (Hypotheses 1 and 2, Figs 1–2); Iñiguez 2020 §1; Tabita 2008 abstract | full text; abstract | high that it is unresolved |

## 2. Timing

Kinds of evidence: **geo** = geochemical or isotopic; **fossil** = a dated body fossil (a minimum age); **clock** = a molecular-clock estimate (model-dependent); **phylo** = relative order in a tree, with no absolute date.

| Claim | Value | Kind | Source with table/figure | Read depth | Confidence |
|---|---|---|---|---|---|
| First isotopic evidence of biological C fixation | 3.7 Ga (graphite), 3.52 Ga (kerogen); "∼3.8 Ga" for the earliest indicators | geo | Catling & Zahnle 2020 (in V3 facts); Kędzior et al. 2022 Cell Rep, abstract | full text; abstract | medium. **This does not prove RuBisCO**: other pathways also fractionate carbon. |
| Age of RuBisCO itself | Iñiguez: form III "probably emerged ~3,500 Mya" (citing Tabita 2007). Bouvier 2024: "evolved ~3 billion years ago". Amritkar et al. 2024: "the exact age… is not clearly known", but it emerged before the GOE. | inference (no clock found) | Iñiguez 2020 §1; Bouvier et al. 2024 PNAS Introduction; Amritkar, Cuevas-Zuviría & Kaçar 2024 MBE msae268, Introduction | full text | **low** for any number. Safe wording: "older than the GOE, probably ≥ 3 Ga." |
| Erb & Zarzycki's timeline has no dates | "timeline is only relative" | phylo | Erb & Zarzycki 2018 Fig. 2 legend | full text | high |
| Form I with its small subunit arose before atmospheric O₂ | Schulz: specificity rose with the gain of the small subunit "before atmospheric oxygen was present". Wang 2023: "Form I rubiscos evolved in Cyanobacteria ≥ 2.5 billion years ago". | phylo, then mapped onto geology | Schulz et al. 2022 Science 378:155, abstract; Wang et al. 2023 Biomolecules 13:596, abstract | abstract; full text | medium. The ordering comes from trees, not a dated clock. |
| Oxygenic photosynthesis | ≥ 2.7 Ga, possibly 3.2–3.0 Ga | geo + phylo | Catling & Zahnle 2020 (V3) | full text | medium |
| Great Oxidation Event | 2.43–2.22 Ga | geo | Poulton et al. 2021 (V3) | abstract | high |
| Crown cyanobacteria | 1947–1023 Ma; oxygenic photosynthesis evolved earlier, on the stem | clock | Betts et al. 2018 Nat Ecol Evol, Results | full text | medium (clocks disagree) |
| Divergence of form IA and IB | > 1 Ga ("predates the origins of… Archaeplastida") | phylo | Shih et al. 2016 Nat Commun 7:10382, Introduction | full text | medium |
| **Primary endosymbiosis (Archaeplastida)** | plastid lineage branches ~2.1 Ga, Archaeplastida ancestor ~1.9 Ga (Sánchez-Baracaldo 2017); 2137–1807 Ma (Strassert 2021); 1774–1118 Ma (Betts 2018); ~1.5 Ga (Yoon 2004) | clock | Sánchez-Baracaldo et al. 2017 PNAS, abstract; Strassert et al. 2021 Nat Commun, Results; Betts 2018, Results; Iñiguez 2020 §1 | abstract; full text | **low–medium**: 2.1–1.1 Ga across studies |
| Oldest accepted red alga (minimum age for Archaeplastida) | *Bangiomorpha* 1.047 Ga; contested older red algae ~1.6 Ga (*Rafatazmia*, *Ramathallus*) | fossil | Gibson 2018 and Bengtson 2017 (V3); Strassert 2021 (calls *Bangiomorpha* "~1.2 bya", older dating) | secondary; full text | medium-high (1.05); low (1.6) |
| Red algae, crown | 1984–1732 Ma (Strassert, which uses the 1.6 Ga calibration); 1.6–1.0 Ga (Sánchez-Baracaldo) | clock | as above | full text; abstract | low |
| Oldest green alga | ~1.0 Ga (*Proterocladus*) | fossil | Tang 2020 (V3) | abstract | medium |
| Lineages with red-algal plastids (form ID), stem ages | cryptophytes 1658–440 Ma; ochrophytes 1298–622 Ma; haptophytes 1943–579 Ma; myzozoans 1520–696 Ma; abundant in fossils only from ~300 Ma | clock; fossil | Strassert 2021, Results (95 % HPD) and Introduction | full text | low (wide ranges) |
| Diatoms | origin ~200 Ma (Triassic–Jurassic); Jurassic *Pyxidicula* "diatoms" were probably not diatoms; the oldest abundant diatom fossils are 75 Myr younger than that origin (≈ 125 Ma) | clock; fossil | Bryłka et al. 2023 Sci Rep 13:8047, abstract | abstract | medium |
| Land plants | cryptospores 473–471 Ma; clock 515–474 Ma | fossil; clock | Rubinstein 2010; Morris 2018 (V3) | abstract; full text | high |
| Angiosperms | ~160 Ma (TimeTree) | clock | Bouvier 2024, Results | full text | medium |
| Hornwort pyrenoids | 5–6 origins; oldest ~100 Ma, most < 35 Ma | clock | Villarreal & Renner 2012 (V3) | abstract | high |
| **Cyanobacterial carboxysome / CCM** | **unresolved**: 400–300 Ma (Raven 1997; Badger 2002); ~300 Myr before the Carboniferous (Riding 2006); Archaean–early Proterozoic (Raven & Larkum 2007). Shih 2016 favours a Phanerozoic origin. The two carboxysome types arose independently. | hypothesis | Iñiguez 2020 §2; Shih 2016, Results; Badger 2002, abstract; Rae et al. 2013 MMBR, abstract | full text; abstract | high that it is unresolved |
| First C₄ plants | 32–25 Ma (grasses); most C₄ origins late Miocene | clock | Christin 2008; Sage 2004 (V3); Arakaki et al. 2011 PNAS, abstract | abstract | medium-high |
| CAM succulents | cactus lineage ~35 Ma; major radiations of cacti, ice plants and agaves 10–5 Ma | clock | Arakaki 2011, abstract | abstract | medium (the first origin of CAM is not dated here) |

## 3. Specificity S and kcat by group (25 °C)

Unless a row says otherwise, ranges come from my own summary of Flamholz Data Set S2, which holds wild-type enzymes at 25 °C. Medians marked "F" are taken from the Flamholz 2019 Fig. 5 legend. n is the number of values.

| Group (form) | Representative S | S range (n) | Representative kcat (s⁻¹) | kcat range (n) | Source | Read depth | Confidence |
|---|---|---|---|---|---|---|---|
| Form III, *T. kodakarensis* | 11 at 25 °C; 6 at 83 °C | — | 0.25 at 25 °C; 16.6 at 83 °C | — | Yoshida 2007 and Kreel & Tabita 2015 (via the data set); Iñiguez 2020 §4 | data; full text | medium. Ezaki 1999 reported S = 310 at 90 °C, which conflicts and was not reproduced in later work. |
| Form III, *A. fulgidus* | 4 at 83 °C | — | 23 at 83 °C | — | Kreel & Tabita 2015 (data); Iñiguez 2020 | data | medium |
| Form II/III (IIIB), *M. burtonii* | 1.2 | 1.1–1.3 (5) | ~2 | 0.6–2 (5) | Alonso 2009; Wilson 2016 (data) | data | high |
| Form III and II/III, review summary | "0.5–11", "almost no discrimination" | — | lowest kcat at 25 °C | — | Iñiguez 2020 §4 | full text | high |
| **Form II**, *R. rubrum* | 12 (Tcherkez Table 1: 12.3) | 7.4–15 (10 in α-proteobacteria) | 7.3 (Tcherkez); 11–12 (Davidi as corrected in 2025) | 4.3–12.3 | Tcherkez 2006 Table 1; data; Tsai et al. 2025 EMBO J correction, Table 1 | full text; data | high (S); medium (kcat depends on the assay) |
| Form II, all FII in the data set | — | "7 to 15" | — | — | Flamholz 2019 Results | full text | high |
| **Form II, fastest known RuBisCO** (*Gallionella*, Zetaproteobacteria; L₂) | 10.0 ± 0.1 (*Gallionella*) | — | **26–29** (corrected; originally reported as 22) | 19.7–29.2 | Davidi et al. 2020 EMBO J Table 1 (S); Tsai et al. 2025 correction Table 1 (kcat) | full text | high |
| **Form I′** (*P. breve*, L₈, no SSU) | 36.1 ± 0.9 | — | 2.23 ± 0.04 | — | Banda 2020, quoted in Wang 2023 Biomolecules Table 1 (same table: *Synechococcus* 6301 L₈S₈ S 56.1, kcat 14.3; assay temperature not stated there) | secondary (full text of Wang) | medium-high |
| **Form IA** (proteobacteria and α-cyanobacteria) | ~45–60 | *A. vinosum* 41–44; *Prochlorococcus* MIT9313 59.9; *Cyanobium* 55; *T. denitrificans* IA 42.7 | *A. vinosum* 6.7–8.8; *Prochlorococcus* 6.6; *Cyanobium* 9.8 | 1.9–9.8 | Shih 2016 Table 1; Tcherkez Table 1; data | full text; data | medium (few enzymes) |
| **Form IC** (*R. sphaeroides* I) | 60–62 | (2) | 5.2 | (1) | data (Jordan 1981; Mueller-Cajar, personal communication) | data | medium (few enzymes) |
| **Form IB, cyanobacteria** | median 48 (N = 16, F); Tcherkez: 43 (PCC 6301), 52 (PCC 7002) | 38–55 for most strains (outliers: 67, 82) | ~11 | 9.8–14.4 for the main strains (n = 16, median 9.8; low values from Read 1992/94) | Flamholz Fig. 5; Tcherkez Table 1; data | full text; data | high |
| **Green algae** (IB, pyrenoid) | median 62 | 54–71 (8): *Euglena* 54, *Chlamydomonas* 61–70.5, *Scenedesmus* 63, *Ulva* 68.5 | 5.8 (*Chlamydomonas*, adjusted from 30 °C) | only 1 value in the set | Tcherkez Table 1; data | full text; data | high (S); low (kcat) |
| **C₃ plants** (IB) | **median 98 (N = 162, F)** | 74–121 (203); IQR 92–104 | **3.2** (median) | 1.4–5.8 (172); IQR 2.5–3.6 | Flamholz Fig. 5; data | full text; data | high |
| **C₄ plants** (IB) | **median 80 (N = 35, F)** | 58–107 (45); IQR 77–84 | **4.1** (median) | 2.1–7.1 (34); IQR 3.6–5.3 | Flamholz Fig. 5; data | full text; data | high |
| C₃ vs C₄ in one genus (*Flaveria*) | C₃ *F. pringlei* 80.8 vs C₄ *F. trinervia* 77.0 | C₄ 75.5–77.2 | 3.11 vs 4.42 | C₄ 3.7–4.4 | Kubien 2008 (data) | data | high: C₄ has slightly lower S, higher kcat and higher Kc |
| CAM plants (IB) | no S in the data set | — | 3.4–4.5 (3 species) | — | Galmés 2014b (data) | data | low (too few data) |
| **Red algae** (ID) | **median 177 (N = 6, F)**; 166 in the full set | 129–238 (9): *Porphyridium* 129–144, *Porphyra* 145, *G. sulphuraria* 166, *Griffithsia* 167, *Cyanidium* 222–225, *G. partita* 238 | **1.4** | 1.2–2.6 (8) | Flamholz Fig. 5; Uemura 1997 abstract; Tcherkez Table 1; data | full text; abstract; data | high |
| **Diatoms** (ID) | median 92 | 57–116 (17); IQR 78–110 | 3.2 | 0.8–3.7 (15) | data (Young 2016; Haslam 2005; Whitney 2001) | data | high |
| Haptophytes (ID) | ~102 | 89–125 (3) | 2.5 | 2.2–3.3 (3) | Heureux 2017 (data) | data | medium |
| Peridinin dinoflagellate (II) | *Amphidinium carterae* 37, **at 10 °C**, primary source unknown | — | — | — | Badger 1998 meta-analysis (data, S1) | data | **low; do not teach** |
| Overall narrow range | Form I S varies ≈ 30 %; > 95 % of kcat values are 1–10 s⁻¹ | — | — | — | Flamholz 2019 Results and Fig. 3C | full text | high |

## 4. How S changed through evolution

| Claim | Value | Source with table/figure | Read depth | Confidence |
|---|---|---|---|---|
| Today S tracks the CO₂:O₂ ratio at the enzyme. Low S in anaerobes (forms II and III, 1–15), and in CCM hosts relative to C₃ plants; highest S in red algae without a CCM. | Table 1, column "CO₂:O₂ environment" | Tcherkez 2006 Table 1 and text after Fig. 3; Iñiguez 2020 §4 | full text | high (a correlation among living enzymes) |
| **Schulz 2022 (resurrected pre-form-I ancestors).** AncL, an L₈ that is the last common ancestor of form I″ and form I and has no small subunit, has S ≈ 22. AncL+7 (7 substitutions that let it bind the ancestral SSU) has ≈ 25, and ≈ 30 with the SSU. Adding one more LSU substitution (e170N) gives ≈ 26 without the SSU and **≈ 39 with it**. The SSU's effect on S thus depends on other mutations (epistasis). Binding the SSU also lowered KC (AncL+7: 499 → 148 µM). | AncL 21.9 ± 1.4 (n = 9); AncL+7 25.3 ± 1.5; + SSU 29.6 ± 1.0; e170N 25.6 ± 2.2; e170N + SSU 38.6 ± 2.7 (my means of the raw replicates) | Schulz et al. 2022 Science, abstract; Edmond data set doi:10.17617/3.F9BWOU, files "3E data.xlsx" (specificity) and "3A data.xlsx" (KC); RCSB 7QSV title (AncL = LCA of I″ and I) | abstract + raw data (text and assay conditions not read) | medium-high for the numbers; the narrative is from the abstract. ESRF summary: "the SSU alone was not the cause of drastic changes in specificity". |
| Schulz 2022's claim: the gain of the small subunit increased "specificity and carboxylation efficiency… **before atmospheric oxygen was present**" | — | Schulz 2022 abstract | abstract | medium (the timing is phylogenetic inference) |
| **Shih 2016 (resurrected ancestors of IA and IB, > 1 Ga, older than Archaeplastida)**: S **~50–55**, similar to modern cyanobacteria and far below plants; kcat **~4.7**, lower than modern cyanobacteria (6.6–9.8). The authors interpret this as bacteria later raising kcat (with CCMs) while eukaryotes raised S. **Their own caveats**: only 2 ancestors, low-posterior sites, and the α/β ancestor could not be expressed. | Anc IA S 54.7 ± 3.5, kcat 4.77; Anc IB S 49.6 ± 1.8, kcat 4.72; *Prochlorococcus* 59.9 / 6.58; *Synechococcus* 6301 50.3 / 9.78; wheat 100 / 2.92 (25 °C) | Shih 2016 Table 1, Fig. 7, Results | full text | high (data); low–medium (interpretation) |
| The ancestral IB can be packed into modern carboxysomes, and as the only RuBisCO it supports *S. elongatus* growth in air | — | Shih 2016 Fig. 8; Wang et al. 2023 PNAS, abstract | full text | high |
| **Kacar 2017**: substitutions concentrated near the active site and subunit interfaces between the form III and form I ancestors. "One possible interpretation" is O₂ stress before or around the GOE. No kinetics, no dates. (Its Fig. 2 labels PDB 1RBL as spinach; 1RBL is *Synechococcus*.) | — | Kacar et al. 2017 Geobiology 15:628, abstract and Fig. 2 legend | full text | high (as a hypothesis) |
| **Amritkar et al. 2024**: simulations suggest the SSU restricted LSU flexibility early on, and that the SSU "CO₂-reservoir" role is not conserved through history | — | Amritkar 2024 MBE, abstract | full text | medium |
| **Bouvier 2024 (angiosperms)**: directional selection toward higher S, kcat and kcat/KC. rbcL is among the slowest-evolving 1 % of genes: one nucleotide substitution per 0.9 Myr, one amino acid per 7.2 Myr. Gains per Myr: +0.05 % S, +0.2 % kcat. The angiosperm last common ancestor is **inferred by regression, not resurrected**. | LCA S 81.1 ± 1.9, kcat 2.6 ± 0.3 → extant C₃ mean 87.1, 3.4 | Bouvier, Emms & Kelly 2024 PNAS, abstract, Results and Table 1 | full text | high |
| **Kapralov & Filatov 2007**: positive selection in rbcL in **most land plants, but not in algae and cyanobacteria** (> 3000 species). The selected sites lie at dimer–dimer, L–S and activase interfaces, some near the active site. | — | Kapralov & Filatov 2007 BMC Evol Biol 7:73, abstract | full text | high |
| Lin 2022: some resurrected Solanaceae ancestors had a higher kcat than modern C₃ enzymes. This supports the idea that ancient C₃ RuBisCOs, evolving at higher CO₂, were more C₄-like. | — | Lin et al. 2022 Sci Adv 8:eabm6871, Results and Discussion | full text | medium |
| **Did S rise as O₂ rose?** Solid: form I enzymes (S ~36–240) occur in O₂-exposed or oxygenic hosts, while forms II/III (S 1–15) occur mostly in anaerobes or at low O₂. Ancestral reconstructions show S increasing at the dawn of form I (≈ 22 → 39) and again in eukaryotic lineages (≈ 50 → 80–240). **Hypothesis**: that atmospheric O₂ was the driver and that the timing matches the GOE. Schulz places the rise *before* atmospheric O₂; oxygenic cells make O₂ locally (Shih 2016 Discussion). | — | synthesis of Tcherkez 2006, Schulz 2022, Shih 2016, Flamholz 2019, Iñiguez 2020 | — | high (pattern); low (cause and timing) |
| **Trade-off**: Tcherkez 2006 (strong inverse S–kcat, "nearly perfectly optimised") and Savir 2010 (1-D landscape) vs Flamholz 2019 (R ≈ −0.6, form of the fit "very uncertain") vs Bouvier 2021 (phylogenetic constraint > trade-off; S–kcat not significant within C₃) and Bouvier 2024 (S and kcat rising together). Iñiguez 2020: clear in vascular plants, weak across groups. | see V3 facts §3 | V3 facts §3; Bouvier 2024 Introduction | full text | high |
| CCM co-evolution, mechanism: a CCM lets a fast, low-S enzyme work. Cyanobacteria (all have a CCM) keep S ~40–55 with kcat ~10. C₄ RuBisCO is slightly less specific and faster than C₃. Exception: diatoms and red-lineage algae with CCMs keep a high S. | — | Tcherkez 2006; Iñiguez 2020 §4; Flaveria data above | full text; data | high (pattern); medium (direction of causation) |

## 5. Structures (checked on RCSB REST API, 28 Oct 2026)

| Form | Organism | PDB | Biological assembly (RCSB assembly 1) | Resolution | Ligand / state | Primary citation |
|---|---|---|---|---|---|---|
| I (IB), plant | *Spinacia oleracea* | **8RUC** | L₈S₈, hetero 16-mer, D4 (the asymmetric unit holds L₄S₄) | 1.6 Å | activated (Mg, carbamate), with 2-CABP | Andersson 1996 J Mol Biol 259:160 |
| I (IB), cyanobacterium | *Synechococcus elongatus* PCC 6301 | **1RBL** | L₈S₈, D4 (full complex in the asymmetric unit) | 2.2 Å | with 2-CABP and Mg | Newman, Brändén & Jones 1993 Acta Cryst D 49:548 |
| I (IB), cyanobacterium | same | 1RSC | L₈S₈, D4 | 2.3 Å | inactive complex with xylulose-1,5-bisphosphate (no ligand listed by RCSB) | Newman & Gutteridge 1994 Structure 2:495 |
| I (ID), red alga | *Galdieria partita* | **1BWV** | L₈S₈, D4 (the asymmetric unit holds L₄S₄); SSU 138 aa vs 123 in spinach and 109 in *Synechococcus* | 2.4 Å | activated, with 2-CABP | Sugawara et al. 1999 J Biol Chem 274:15655 |
| II | *Rhodospirillum rubrum* | **9RUB** | L₂ homodimer, C2 | 2.6 Å | activated, with substrate RuBP | Lundqvist & Schneider 1991 J Biol Chem 266:12604 |
| II | *R. rubrum* | 5RUB | L₂, C2 | 1.7 Å | no ligand | Schneider, Lindqvist & Lundqvist 1990 J Mol Biol 211:989 |
| II (hexamer) | *Rhodopseudomonas palustris* | 4LF1 | (L₂)₃, D3 | 2.38 Å | with 2-CABP | Satagopan et al. 2014 J Biol Chem 289:21433 |
| III | *Thermococcus kodakarensis* KOD1 | **1GEH** | (L₂)₅ decamer, D5 (the asymmetric unit holds 5 chains) | 2.8 Å | no ligand | Kitano et al. 2001 Structure 9:473 |
| II/III (IIIB) | *Methanococcoides burtonii* | 5MAC | (L₂)₅, D5 | 2.6 Å | with 2-CABP | Gunn, Valegård & Andersson 2017 J Biol Chem 292:6838 |
| I′ | *Ca.* Promineifilum breve | 6URA | L₈, D4, no SSU | 2.17 Å | with 2-CABP | Banda et al. 2020 Nat Plants 6:1158 |
| I″ | Firmicutes (metagenome) | 8U66 | L₈, D4 | 2.21 Å | with 2-CABP | Liu et al. 2023 Curr Biol 33:5316 |
| ancestral AncL | synthetic construct (LCA of I″ and I) | 7QSV | L₈, D4 | 2.1 Å | with 2-CABP | Schulz et al. 2022 Science 378:155 |
| IV (RLP) | *R. palustris* | 2QYG | L₂, C2 | 3.3 Å | no ligand | Tabita et al. 2007 MMBR 71:576 |

## 6. Not verified

- Schulz 2022 main text (science.org bot check): assay temperature for the Fig. 3E specificities, exact kcat values in s⁻¹, and the reasoning behind "before atmospheric oxygen". The numbers above come from the authors' raw data files.
- Banda 2020 main text (paywalled): its own kinetic table. The P. breve values come from Wang 2023, which quotes it.
- Tabita 2008 main text (OUP bot check); only the abstract was read.
- The assignment of two extant clades in Schulz 2022 raw data file "S3G_Specificity.xlsx" ("Anaerolineae sp." S ≈ 12, "Caldilineae sp." S ≈ 26) to I′, I″ or I-Anaero. Not used.
- Any molecular-clock date for the origin of RuBisCO or of the small subunit: none found. All absolute dates for these are inference.
- A first-origin date for CAM; a reliable S value for any dinoflagellate form II at 25 °C; kcat for form IC beyond one value.
- Nisbet et al. 2007 Geobiology "The age of Rubisco" was not read.
