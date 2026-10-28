// Slide C4 · Sucrose and starch (lecture 2 chunk 1, prefix cb, overnight build 28 Oct 2026; draft for the lecturer).
// Where the one triose phosphate in six goes: out of the chloroplast in exchange for phosphate, to sucrose in the
// cytosol; or into starch inside the chloroplast by day, which Arabidopsis leaves break down at a near-constant rate
// so that ≈ 95 % is used by dawn, even after an unexpected early dusk (Graf et al. 2010, PNAS, full text).
// Real figures: Graf et al. 2010 Fig. 1A (© NAS; existing crop c4-graf.jpg); Streb & Zeeman 2012 Fig. 4 C and G
// (TEM of Arabidopsis mesophyll chloroplasts at the end of the day and of the night, scale bars 1 µm; © ASPB; existing
// crop c4-streb.jpg). Redrawn: Graf Fig. 1A from values read off the figure (cb-common GRAF_*). Credits: SOURCES-cb.md.
// Variants v1–v8 are new; the earlier c04b figures (a–j, unpicked) follow, drawn by ./c04b.
import type { PlateText, Variant } from '../types';
import { draw as oldDraw, VARIANTS as OLD } from './c04b';
import grafJpg from '../../assets/photos/c4-graf.jpg';
import strebJpg from '../../assets/photos/c4-streb.jpg';
import {
  ar, axes, carbons, credit, cycleWheel, f, GRAF_CTRL, GRAF_EARLY, it, line, pill, series, shot, svg, T, X, Y,
  type Axes, type Img,
} from './cb-common';

export const PLATE: PlateText = {
  n: 'C4',
  title: 'Sucrose and starch',
  status: 'draft',
  lead: 'Triose phosphate leaves the chloroplast to make sucrose for the whole plant, or stays to make starch for the night.',
  points: [
    { claim: 'Sucrose.', text: 'Triose phosphate leaves the chloroplast in exchange for phosphate (Pᵢ)<br>Sucrose is made in the cytosol and exported to growing organs' },
    { claim: 'Starch.', text: 'Made from part of the triose phosphate, inside the chloroplast, by day' },
    { claim: 'Starch degradation at night.', text: 'Near-constant rate: ≈ 95 % of the starch is used by dawn (<i>Arabidopsis</i>)<br>After an early dusk, breakdown slows, so starch still lasts until dawn' },
  ],
  refs: [
    { label: 'Graf et al. 2010', url: 'https://doi.org/10.1073/pnas.0914299107' },
    { label: 'Smith & Stitt 2007', url: 'https://doi.org/10.1111/j.1365-3040.2007.01708.x' },
    { label: 'Streb & Zeeman 2012', url: 'https://doi.org/10.1199/tab.0160' },
    { label: 'Sharkey 2024', url: 'https://doi.org/10.1093/plphys/kiad601' },
  ],
};

const NEW: Variant[] = [
  { id: 'v1', name: 'Graf 2010: starch over day and night (published graph)' },
  { id: 'v2', name: 'Graf 2010 redrawn: early dusk, slower breakdown' },
  { id: 'v3', name: 'Chloroplasts at the end of the day and of the night (TEM)' },
  { id: 'v4', name: 'TEM pictures pinned to the starch curve' },
  { id: 'v5', name: 'Mesophyll cell by day: two routes (drawn)' },
  { id: 'v6', name: 'Day and night side by side (drawn)' },
  { id: 'v7', name: 'Wheel with the exit lit, split into sucrose and starch' },
  { id: 'v8', name: 'One triose phosphate out, one phosphate in' },
];
// No picks on C4 yet (picks.json, 28 Oct 2026): new variants first, then the earlier unpicked ones (c04b).
export const VARIANTS: Variant[] = [...NEW, ...OLD];

const GRAF: Img = { href: grafJpg, w: 533, h: 395 };
const STREB: Img = { href: strebJpg, w: 394, h: 323 };
const CR_GRAF = 'Graf, Schlereth, Stitt & Smith 2010, PNAS 107:9458, Fig. 1A · © National Academy of Sciences';
const CR_STREB = 'Streb & Zeeman 2012, The Arabidopsis Book 10:e0160, Fig. 4 C, G · © ASPB';
/** Panels C (end of day) and G (end of night) in the crop, below their letters. */
const WIN_C: [number, number, number, number] = [0, 46, 195, 277];
const WIN_G: [number, number, number, number] = [200, 46, 194, 277];

/* ---------- v1 · the published graph ---------- */

function v1(): string {
  const p = 'fcb4v1', a = shot(`${p}-a`, GRAF, 90, 70, 560, { fig: true, white: [[0, 0, 36, 42]] });
  return svg(p, 'Graf and colleagues’ graph: starch in Arabidopsis rosettes over a 12-hour day and 12-hour night (squares), and in plants whose night began after only 8 hours (diamonds). Both run out of starch at the same time, at the next dawn, 24 hours after the last.', `
    ${a.svg}
    ${pill(400, 40, `${it('Arabidopsis')} rosettes`, undefined, true)}
    ${pill(700, 150, 'night after 12 h', a.at(330, 118), true)}${pill(700, 250, 'night after 8 h', a.at(348, 224), true)}
    ${pill(700, 350, 'dawn: both ≈ 0', a.at(459, 286), true)}
    ${credit(792, 592, CR_GRAF)}
  `);
}

/* ---------- the redrawn graph ---------- */

function grafAxes(p: string, a: Axes, o: { early?: boolean; notes?: boolean } = {}): string {
  const top = a.y0 - 30, band = (x0: number, x1: number, cls: string, fill = ''): string =>
    `<rect x="${f(X(a, x0))}" y="${f(top)}" width="${f(X(a, x1) - X(a, x0))}" height="24" class="${cls}"${fill ? ` fill="${fill}"` : ''}/>`;
  const bands = `${band(0, 12, 'fcb-band-day')}${band(12, 24, 'fcb-band-night')}${band(24, 28, 'fcb-band-ext')}
    ${T((X(a, 0) + X(a, 12)) / 2, top + 18, 'day', 'fcb-band', 'middle')}${T((X(a, 12) + X(a, 24)) / 2, top + 18, 'night', 'fcb-band-d', 'middle')}
    <rect x="${f(X(a, 12))}" y="${f(a.y0)}" width="${f(X(a, 24) - X(a, 12))}" height="${f(a.h)}" class="fcb-shade-night"/>`
    + (o.early ? `<rect x="${f(X(a, 8))}" y="${f(a.y0)}" width="${f(X(a, 12) - X(a, 8))}" height="${f(a.h)}" fill="url(#${p}-hatch)" opacity=".35"/>` : '');
  const curves = `${series(a, GRAF_CTRL, 'ink', 'ink', 6.5)}${o.early ? series(a, GRAF_EARLY, 'amber', 'amber', 6.5) : ''}`;
  const notes = o.notes
    ? `${T(X(a, 12) + 14, Y(a, 6.7) - 4, 'night after 12 h', 'fcb-node', 'start')}${o.early ? T(X(a, 0.4), Y(a, 5.6), 'night after 8 h', 'fcb-node fcb-c-amber', 'start') : ''}`
    : '';
  return `${bands}${axes(a, [0, 4, 8, 12, 16, 20, 24, 28], [0, 2, 4, 6, 8], 'hours after dawn', 'starch (mg g⁻¹ fresh weight)', { ylx: a.x0 - 52 })}${curves}${notes}`;
}

function v2(): string {
  const p = 'fcb4v2', a: Axes = { x0: 110, y0: 84, w: 620, h: 360, xr: [0, 28], yr: [0, 8] };
  return svg(p, 'Redrawn graph: starch in Arabidopsis rosettes rises through the day and falls almost linearly through the night to near zero at dawn (black). When the night starts after 8 hours instead of 12 (orange), breakdown is slower and the smaller store still lasts until the same dawn.', `
    ${grafAxes(p, a, { early: true, notes: true })}
    ${T(X(a, 24) + 6, Y(a, 0.2) - 20, 'dawn', 'fcb-l', 'middle')}
    ${credit(792, 592, `Redrawn from Graf et al. 2010, PNAS 107:9458, Fig. 1A (${'Arabidopsis'})`)}
  `);
}

/* ---------- v3 · the micrographs ---------- */

function v3(): string {
  const p = 'fcb4v3', c = shot(`${p}-c`, STREB, 70, 70, 290, { win: WIN_C, frame: true }), g = shot(`${p}-g`, STREB, 440, 70, 290, { win: WIN_G, frame: true });
  return svg(p, 'Two electron micrographs of Arabidopsis mesophyll chloroplasts. Left, at the end of the day: large pale starch granules between the thylakoids. Right, at the end of the night: thylakoids only, no starch.', `
    ${c.svg}${g.svg}
    ${pill(215, 40, 'end of the day', undefined, true)}${pill(585, 40, 'end of the night', undefined, true)}
    ${pill(215, 70 + c.h + 32, 'starch granules', [c.at(85, 165), c.at(118, 250)], true)}
    ${pill(585, 70 + g.h + 32, 'no starch left', undefined, true)}
    ${T(400, 70 + c.h + 72, `${it('Arabidopsis')} mesophyll chloroplasts · scale bars 1 µm`, 'fcb-s', 'middle')}
    ${credit(792, 592, CR_STREB)}
  `);
}

/* ---------- v4 · the micrographs pinned to the redrawn curve ---------- */

function v4(): string {
  const p = 'fcb4v4', a: Axes = { x0: 110, y0: 292, w: 600, h: 200, xr: [0, 28], yr: [0, 8] };
  const c = shot(`${p}-c`, STREB, 196, 14, 146, { win: WIN_C, frame: true }), g = shot(`${p}-g`, STREB, 572, 14, 146, { win: WIN_G, frame: true });
  const pk: [number, number] = [X(a, 12), Y(a, 6.7)], dn: [number, number] = [X(a, 24), Y(a, 0.15)];
  return svg(p, 'A starch curve over a day and night (Arabidopsis), with two electron micrographs pinned to it: at the end of the day, a chloroplast full of starch granules; at the end of the night, one without starch.', `
    ${grafAxes(p, a)}
    ${c.svg}${g.svg}
    ${line(`M${f(196 + 73)},${f(14 + c.h)} L${f(pk[0])},${f(pk[1] - 10)}`, 'fcb-mark')}${line(`M${f(572 + 73)},${f(14 + g.h)} L${f(dn[0])},${f(dn[1] - 10)}`, 'fcb-mark')}
    ${T(184, 90, 'end of', 'fcb-node', 'end')}${T(184, 116, 'the day', 'fcb-node', 'end')}${T(560, 90, 'end of', 'fcb-node', 'end')}${T(560, 116, 'the night', 'fcb-node', 'end')}
    ${credit(110, 592, 'Curve: redrawn from Graf et al. 2010, Fig. 1A · TEM: Streb & Zeeman 2012, Fig. 4 C, G (© ASPB)', 'start')}
  `);
}

/* ---------- a drawn chloroplast–cytosol scene, shared by v5 and v6 ---------- */

/** Starch granule as a pale lens with growth rings. */
const granule = (x: number, y: number, rx: number, ry: number): string =>
  `<ellipse class="fcb-starch" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/><ellipse cx="${x}" cy="${y}" rx="${f(rx * 0.62)}" ry="${f(ry * 0.6)}" fill="none" stroke="#c9bb8a" stroke-width="1.4"/>`;

function v5(): string {
  const p = 'fcb4v5';
  return svg(p, 'A mesophyll cell by day, drawn. In the chloroplast the cycle makes triose phosphate. Part of it is turned into a starch granule inside the chloroplast. The rest leaves through the envelope, swapped for phosphate, and becomes sucrose in the cytosol, which is exported from the leaf.', `
    <rect x="10" y="40" width="780" height="520" rx="34" class="fcb-cytosol"/>
    <ellipse class="fcb-stroma" cx="300" cy="300" rx="260" ry="200"/>
    ${T(300, 136, 'chloroplast', 'fcb-h fcb-c-grey', 'middle')}${T(680, 80, 'cytosol', 'fcb-h fcb-c-grey', 'middle')}
    ${cycleWheel(p, { cx: 190, cy: 300, r: 70, names: false, counts: false, sectors: true, mols: false, co2: false, out: '' })}
    ${T(190, 307, 'cycle', 'fcb-l', 'middle')}
    ${ar(p, 'rust', 'M276,300 L420,300', 'fcb-fat')}${T(352, 286, 'triose phosphate', 'fcb-s fcb-c-rust', 'middle')}
    ${ar(p, 'rust', 'M430,316 C440,360 420,390 390,404', 'fcb-thin')}
    ${granule(330, 420, 58, 34)}${T(330, 478, 'starch', 'fcb-node', 'middle')}
    <rect x="548" y="270" width="26" height="60" rx="10" fill="#d9cfb8" stroke="#8a877d" stroke-width="1.4"/>
    ${ar(p, 'rust', 'M440,292 L640,292', 'fcb-fat')}
    ${ar(p, 'grey', 'M640,322 L478,322', 'fcb-thin')}${T(600, 348, 'Pᵢ', 'fcb-node', 'middle')}
    ${T(700, 286, 'sucrose', 'fcb-node fcb-c-rust', 'middle')}
    ${ar(p, 'rust', 'M700,300 L700,470', 'fcb-thin')}${T(700, 500, 'to the', 'fcb-s', 'middle')}${T(700, 524, 'whole plant', 'fcb-s', 'middle')}
    ${T(561, 246, 'translocator', 'fcb-s', 'middle')}
  `);
}

/* ---------- v6 · day and night side by side ---------- */

function v6(): string {
  const p = 'fcb4v6';
  const panel = (x: number, night: boolean): string => {
    const cx = x + 190;
    return `<rect x="${x}" y="70" width="380" height="490" rx="24" class="fcb-cytosol"/>
      <rect x="${x}" y="70" width="380" height="44" rx="22" class="${night ? 'fcb-band-night' : 'fcb-band-day'}"/>${T(cx, 100, night ? 'night' : 'day', night ? 'fcb-band-d' : 'fcb-band', 'middle', ' style="font-size:22px"')}
      <ellipse class="fcb-stroma" cx="${cx}" cy="300" rx="160" ry="128"/>
      ${night ? `${granule(cx, 316, 34, 20)}${T(cx, 274, 'starch', 'fcb-node', 'middle')}${ar(p, 'rust', `M${cx + 40},316 H${cx + 170} V492`, 'fcb-thin')}${T(cx + 104, 304, 'sugars', 'fcb-s', 'middle')}`
    : `${granule(cx + 30, 346, 62, 36)}${T(cx + 30, 410, 'starch', 'fcb-node', 'middle')}${T(cx - 40, 206, 'CO₂ → triose', 'fcb-s', 'middle')}${T(cx - 40, 230, 'phosphate', 'fcb-s', 'middle')}
         ${ar(p, 'rust', `M${cx - 50},260 L${cx + 4},322`, 'fcb-thin')}${ar(p, 'rust', `M${cx - 10},252 H${cx + 170} V492`, 'fcb-thin')}`}
      ${T(cx + 150, 524, 'sucrose', 'fcb-node fcb-c-rust', 'end')}`;
  };
  return svg(p, 'Two drawn cells side by side. Day: the chloroplast fixes CO2 into triose phosphate, stores part of it as a large starch granule and exports the rest, which becomes sucrose in the cytosol. Night: the starch granule shrinks; its sugars leave the chloroplast and become sucrose.', `
    ${panel(12, false)}${panel(408, true)}
  `);
}

/* ---------- v7 · the wheel with its exit lit, split into the two routes ---------- */

function v7(): string {
  const p = 'fcb4v7';
  return svg(p, 'The cycle wheel dimmed except its exit: one triose phosphate per three CO2 leaves the cycle and splits into two routes, sucrose made in the cytosol for the whole plant, and starch made in the chloroplast for the night.', `
    ${cycleWheel(p, { cx: 250, cy: 260, r: 130, lit: ['out'], names: false, counts: true, sectors: false, out: '' })}
    ${ar(p, 'rust', 'M296,416 C330,470 430,478 500,472', 'fcb-fat')}${T(400, 520, '1 triose phosphate', 'fcb-node fcb-c-rust', 'middle')}
    ${ar(p, 'rust', 'M510,462 C560,430 590,330 624,266', 'fcb-thin')}${ar(p, 'rust', 'M520,476 C550,486 566,488 580,488', 'fcb-thin')}
    ${T(640, 184, 'sucrose', 'fcb-big fcb-c-rust', 'middle')}${T(640, 214, 'in the cytosol,', 'fcb-s', 'middle')}${T(640, 238, 'for the whole plant', 'fcb-s', 'middle')}
    ${T(680, 470, 'starch', 'fcb-big fcb-c-rust', 'middle')}${T(680, 500, 'in the chloroplast,', 'fcb-s', 'middle')}${T(680, 524, 'for the night', 'fcb-s', 'middle')}
  `);
}

/* ---------- v8 · one triose phosphate out, one phosphate in ---------- */

function v8(): string {
  const p = 'fcb4v8', mx = 400;
  const tp = (x: number, y: number): string => `${carbons(x, y, 'ccc', 26, 4)}<circle cx="${x + 96}" cy="${y + 13}" r="13" fill="#f6dfd6" stroke="#c8361e" stroke-width="1.6"/>${T(x + 96, y + 19, 'P', 'fcb-cl', 'middle')}`;
  return svg(p, 'The chloroplast envelope with the translocator. One triose phosphate goes out to the cytosol for every phosphate that comes in. In the cytosol, making sucrose frees the phosphate again; in the chloroplast, the phosphate is used again to make ATP.', `
    <rect x="0" y="40" width="${mx - 18}" height="520" fill="#eef3e2"/><rect x="${mx + 18}" y="40" width="${800 - mx - 18}" height="520" fill="#f8f4ea"/>
    <rect x="${mx - 18}" y="40" width="36" height="520" fill="#d8d5cb"/>
    <rect x="${mx - 30}" y="220" width="60" height="150" rx="18" fill="#c9b98f" stroke="#7a6a3a" stroke-width="1.6"/>
    ${T(200, 84, 'chloroplast (stroma)', 'fcb-h', 'middle')}${T(610, 84, 'cytosol', 'fcb-h', 'middle')}
    ${T(mx, 206, 'translocator', 'fcb-node', 'middle')}
    ${tp(150, 252)}${ar(p, 'rust', `M290,265 L${mx + 120},265`, 'fcb-fat')}${tp(mx + 130, 252)}
    ${T(205, 236, 'triose phosphate', 'fcb-s fcb-c-rust', 'middle')}
    <circle cx="${mx + 160}" cy="335" r="16" fill="#f6dfd6" stroke="#c8361e" stroke-width="1.6"/>${T(mx + 160, 342, 'Pᵢ', 'fcb-cl', 'middle')}
    ${ar(p, 'red', `M${mx + 136},335 L${mx - 120},335`, 'fcb-fat')}
    <circle cx="${mx - 144}" cy="335" r="16" fill="#f6dfd6" stroke="#c8361e" stroke-width="1.6"/>${T(mx - 144, 342, 'Pᵢ', 'fcb-cl', 'middle')}
    ${ar(p, 'grey', `M${mx + 250},290 L${mx + 250},420`, 'fcb-thin')}${T(mx + 250, 452, 'sucrose', 'fcb-node fcb-c-rust', 'middle')}${T(mx + 250, 478, 'frees the Pᵢ', 'fcb-s', 'middle')}
    ${ar(p, 'grey', `M${mx - 144},360 L${mx - 144},420`, 'fcb-thin')}${T(mx - 144, 452, 'ADP + Pᵢ → ATP', 'fcb-node', 'middle')}
    ${T(400, 540, 'one out, one in', 'fcb-big', 'middle')}
  `);
}

const DRAW: Record<string, () => string> = { v1, v2, v3, v4, v5, v6, v7, v8 };
export function draw(id: string): string {
  return DRAW[id] ? DRAW[id]() : oldDraw(id);
}
