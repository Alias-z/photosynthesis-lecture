// Slide 12 · Photoprotection and repair (was slide 13; redo of 27 Oct 2026, block L1c; page text approved 27 Oct). Real figures: Li et al. 2000 Nature Fig. 1b
// (NPQ of wild type, npq1 without zeaxanthin, npq4 without PsbS) and 1c (NPQ image); Tyystjärvi & Aro 1996 PNAS Fig. 2A
// (rate constant of photoinhibition k_PI proportional to PPFD, lincomycin-treated pumpkin leaves); De Souza et al. 2022
// Science Fig. 2A, 2C (faster NPQ relaxation in VPZ soybean) and 1B (seed yield, field 2020). Drawn: the xanthophyll
// cycle with PsbS in the thylakoid (after Murchie & Niyogi 2011, Fig. 2) and the PSII repair cycle as four steps (after
// Komenda et al. 2024). Kromdijk et al. 2016 Science Fig. 3A (NPQ relaxation, VPZ tobacco) and Fig. 5A, D (field dry
// weight +14–20 %, aerial photo), fetched by the coordinator through ETH access on 27 Oct 2026.
// Focus (lecturer, 27 Oct): lumen acidification triggers NPQ; D1 repair; the field yield gains.
// Small placements mask the figures' own tick labels and legends and redraw them larger at the same data positions.
import type { PlateText, Variant } from '../types';
import { wave } from '../mechanisms';
import liBJpg from '../../assets/photos/13-li-b.jpg';
import liCJpg from '../../assets/photos/13-li-c.jpg';
import tyPng from '../../assets/photos/13-tyystjarvi.png';
import ds2aJpg from '../../assets/photos/13-desouza-2a.jpg';
import ds2cJpg from '../../assets/photos/13-desouza-2c.jpg';
import ds1bJpg from '../../assets/photos/13-desouza-1b.jpg';
import kr3aJpg from '../../assets/photos/13-kromdijk-3a.jpg';
import kr5aJpg from '../../assets/photos/13-kromdijk-5a.jpg';
import kr5dJpg from '../../assets/photos/13-kromdijk-5d.jpg';
import './s13.css';

export const PLATE: PlateText = {
  n: '12',
  title: 'Photoprotection and repair',
  status: 'draft',
  lead: 'The acidic lumen signals excess light and switches on heat dissipation (NPQ); damaged PSII is repaired continuously.',
  points: [
    { claim: 'Non-photochemical quenching (NPQ).', text: 'The acidic lumen activates PsbS and converts violaxanthin to zeaxanthin<br>The antenna then turns excess energy into heat' },
    { claim: 'Photoinhibition and repair.', text: 'PSII, especially its D1 protein, is damaged in proportion to light<br>Damaged D1 is replaced; photoinhibition appears when damage outpaces repair' },
    { claim: 'NPQ and crop yield.', text: 'NPQ switches off slowly when light drops, so shaded leaves waste light for minutes<br>Faster NPQ relaxation increased field yield of tobacco and soybean' },
  ],
  refs: [
    { label: 'Li et al. 2000', url: 'https://doi.org/10.1038/35000131' },
    { label: 'Tyystjärvi & Aro 1996', url: 'https://doi.org/10.1073/pnas.93.5.2213' },
    { label: 'De Souza et al. 2022', url: 'https://doi.org/10.1126/science.adc9831' },
    { label: 'Kromdijk et al. 2016', url: 'https://doi.org/10.1126/science.aai8878' },
    { label: 'Murchie & Niyogi 2011', url: 'https://doi.org/10.1104/pp.110.168831' },
    { label: 'Komenda et al. 2024', url: 'https://doi.org/10.1093/plcell/koae082' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'j', name: 'Lumen pH, PsbS, zeaxanthin + NPQ of npq1, npq4 (Li 2000)' },
  { id: 'f', name: 'Xanthophyll cycle and PsbS in the thylakoid' },
  { id: 'a', name: 'NPQ of wild type, npq1, npq4 (Li 2000, Fig. 1b)' },
  { id: 'b', name: 'NPQ kinetics + NPQ image (Li 2000, Fig. 1b, c)' },
  { id: 'd', name: 'Photoinhibition rate ∝ PPFD + PSII repair cycle' },
  { id: 'c', name: 'NPQ (Li 2000) + photoinhibition rate ∝ PPFD (Tyystjärvi & Aro 1996)' },
  { id: 'h', name: 'Field gains: tobacco dry weight + soybean seed yield (VPZ)' },
  { id: 'i', name: 'NPQ relaxation + field dry weight, VPZ tobacco (Kromdijk 2016)' },
  { id: 'e', name: 'NPQ relaxation τ₂ + seed yield, VPZ soybean (De Souza 2022)' },
  { id: 'g', name: 'NPQ relaxation after a step to low light (De Souza 2022, Fig. 2A)' },
];

/* ---------- shared parts ---------- */

type A = 'start' | 'middle' | 'end';
type K = 'ink' | 'red' | 'green' | 'grey' | 'clay' | 'orange' | 'blue';
type Pt = [number, number];
const KS: K[] = ['ink', 'red', 'green', 'grey', 'clay', 'orange', 'blue'];
const f = (v: number): string => v.toFixed(1);
const T = (x: number, y: number, s: string, cls = 'fx13-l', a: A = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;
const TV = (x: number, y: number, s: string, cls = 'fx13-ax'): string =>
  `<text class="${cls}" transform="translate(${f(x)} ${f(y)}) rotate(-90)" text-anchor="middle">${s}</text>`;
const it = (s: string): string => `<tspan class="fx13-i">${s}</tspan>`;
const defs = (p: string): string => `<defs>${KS.map(k =>
  `<marker id="${p}-${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path class="fx13-hd-${k}" d="M0,0L10,5L0,10z"/></marker>`).join('')}</defs>`;
const ar = (p: string, k: K, d: string, cls = ''): string =>
  `<path class="fx13-ar fx13-k-${k}${cls ? ` ${cls}` : ''}" d="${d}" marker-end="url(#${p}-${k})"/>`;
const wv = (p: string, k: K, x0: number, y0: number, x1: number, y1: number, n = 4, amp = 6): string =>
  `<path class="fx13-ar fx13-k-${k}" d="${wave(x0, y0, x1, y1, amp, n)}" marker-end="url(#${p}-${k})"/>`;

interface Img { href: string; w: number; h: number }
interface Shot { svg: string; at: (u: number, v: number) => Pt; h: number; s: number }
type Mask = [number, number, number, number, string?];
function shot(id: string, im: Img, x: number, y: number, w: number,
  o: { win?: [number, number, number, number]; fig?: boolean; masks?: Mask[] } = {}): Shot {
  const [u0, v0, uw, vh] = o.win ?? [0, 0, im.w, im.h];
  const s = w / uw, h = vh * s, ox = x - u0 * s, oy = y - v0 * s;
  const img = `<image href="${im.href}" x="${f(ox)}" y="${f(oy)}" width="${f(im.w * s)}" height="${f(im.h * s)}"/>`;
  const masks = (o.masks ?? []).map(([a, b, c, d, fill]) =>
    `<rect x="${f(ox + a * s)}" y="${f(oy + b * s)}" width="${f((c - a) * s)}" height="${f((d - b) * s)}" fill="${fill ?? '#ffffff'}"/>`).join('');
  const clip = o.fig
    ? `<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}"/></clipPath>`
    : `<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="8"/></clipPath>`;
  return { svg: `${clip}<g clip-path="url(#${id})"${o.fig ? ' class="fx13-mult"' : ''}>${img}${masks}</g>`, at: (u, v) => [ox + u * s, oy + v * s], h, s };
}
const pleader = (a: Pt, b: Pt): string => {
  const d = `M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;
  return `<path class="fx13-ldh" d="${d}"/><path class="fx13-ldk" d="${d}"/><circle class="fx13-tipd" cx="${f(b[0])}" cy="${f(b[1])}" r="2.8"/>`;
};
function pill(x: number, y: number, s: string, to?: Pt, tint = true): string {
  const w = s.replace(/<[^>]+>/g, '').length * 9.7 + 24;
  let ld = '';
  if (to) {
    const dx = to[0] - x, dy = to[1] - y, t = Math.min(w / 2 / Math.max(Math.abs(dx), 1e-6), 14 / Math.max(Math.abs(dy), 1e-6));
    ld = pleader([x + dx * t, y + dy * t], to);
  }
  return `${ld}<rect class="${tint ? 'fx13-pillbg-t' : 'fx13-pillbg'}" x="${f(x - w / 2)}" y="${f(y - 15)}" width="${f(w)}" height="30" rx="15"/>${T(x, y + 6.5, s, 'fx13-pill', 'middle')}`;
}
const credit = (x: number, y: number, s: string, a: A = 'end'): string => T(x, y, s, 'fx13-crd', a);
const svg = (p: string, label: string, body: string): string =>
  `<svg class="fig-svg fx13" viewBox="0 0 800 600" role="img" aria-label="${label}">${defs(p)}${body}</svg>`;

/* ---------- Li et al. 2000, Fig. 1b: NPQ during 5 min of light and 5 min of dark ---------- */

const LIB: Img = { href: liBJpg, w: 572, h: 392 }; // x 28–600, y 368–760 of the 600 × 1103 figure
const LIC: Img = { href: liCJpg, w: 328, h: 333 }; // the NPQ image only, x 77–405, y 762–1095
// data positions in the asset: time t (min) → u, NPQ → v; the light bar runs along v 12–30 (white 0–5 min, black 5–10)
const liU = (t: number): number => 103 + 42.3 * t;
const liV = (n: number): number => 328 - 118.8 * n;
const LI_LEGEND: Mask = [345, 32, 530, 150];
const LI_LETTERS: Mask[] = [[0, 6, 28, 38], [0, 370, 36, 392]]; // panel letter b and the top of c
const LI_TEXT: Mask[] = [[40, 18, 97, 345], [80, 335, 548, 358], [200, 356, 420, 392], [0, 120, 36, 230], LI_LEGEND, ...LI_LETTERS];

/** The four genotypes, with the paper's markers. */
const LI_ROWS: [string, string][] = [
  ['sq-f', 'wild type'], ['sq-o', `${it('npq4')} (no PsbS)`], ['ci-f', `${it('npq1')} (no zeaxanthin)`], ['ci-o', `${it('npq4 npq1')}`],
];
function marker(kind: string, x: number, y: number, r: number): string {
  const fill = kind.endsWith('f') ? '#141413' : '#ffffff';
  return kind.startsWith('sq')
    ? `<rect x="${f(x - r)}" y="${f(y - r)}" width="${f(2 * r)}" height="${f(2 * r)}" fill="${fill}" stroke="#141413" stroke-width="1.4"/>`
    : `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${fill}" stroke="#141413" stroke-width="1.4"/>`;
}
const liLegend = (x: number, y: number, dy = 30, cls = 'fx13-l'): string =>
  LI_ROWS.map(([k, s], i) => `<path class="fx13-axis" d="M${x - 2},${y + i * dy - 6} h28"/>${marker(k, x + 12, y + i * dy - 6, 6)}${T(x + 36, y + i * dy, s, cls)}`).join('');

/** Li Fig. 1b at width w; small = mask its own text and redraw axes and legend at the data positions. */
function liB(id: string, x: number, y: number, w: number, small: boolean, legendAt?: Pt): string {
  const a = shot(id, LIB, x, y, w, { fig: true, masks: small ? LI_TEXT : [LI_LEGEND, ...LI_LETTERS] });
  const [x0, yb] = a.at(liU(0), liV(0));
  const axes = small ? `
    ${[0, 1, 2].map(n => T(x0 - 10, a.at(0, liV(n))[1] + 6, `${n}`, 'fx13-tk', 'end')).join('')}
    ${[0, 5, 10].map(t => T(a.at(liU(t), 0)[0], yb + 26, `${t}`, 'fx13-tk', 'middle')).join('')}
    ${T(a.at(liU(5), 0)[0], yb + 52, 'time (min)', 'fx13-ax', 'middle')}${TV(x0 - 40, a.at(0, liV(1.2))[1], 'NPQ')}` : '';
  const [lx, ly] = legendAt ?? a.at(352, 62);
  const [bl, bt] = a.at(liU(2.5), 21), [bd] = a.at(liU(7.5), 0);
  const bar = small ? `${T(bl, a.at(0, 12)[1] - 8, 'light', 'fx13-l', 'middle')}${T(bd, a.at(0, 12)[1] - 8, 'dark', 'fx13-l', 'middle')}`
    : `${T(bl, bt + 6, 'light', 'fx13-l', 'middle')}<text class="fx13-l" x="${f(bd)}" y="${f(bt + 6)}" text-anchor="middle" style="fill:#fffdf8">dark</text>`;
  return `${a.svg}${axes}${bar}${liLegend(lx, ly, small ? 28 : 31)}`;
}

/* ---------- Tyystjärvi & Aro 1996, Fig. 2A: k_PI against PPFD ---------- */

const TY: Img = { href: tyPng, w: 502, h: 392 }; // panel A frame and data, x 146–648, y 66–458 of the 700 × 1040 page crop
const CR_TY = 'Tyystjärvi & Aro 1996, PNAS, Fig. 2A · © PNAS';
const tyU = (ppfd: number): number => 15.5 + 0.2285 * ppfd;
const tyV = (k: number): number => 365.8 - 853 * k;
function tyA(id: string, x: number, y: number, w: number): string {
  const a = shot(id, TY, x, y, w, { fig: true, masks: [[24, 22, 58, 56]] }); // the panel letter
  const [x0] = a.at(4, 0), [, yb] = a.at(0, 386);
  return `${a.svg}
    ${[0, 0.1, 0.2, 0.3, 0.4].map(k => T(x0 - 8, a.at(0, tyV(k))[1] + 6, `${k}`, 'fx13-tk', 'end')).join('')}
    ${[0, 500, 1000, 1500, 2000].map(p => T(a.at(tyU(p), 0)[0], yb + 24, `${p}`, 'fx13-tk', 'middle')).join('')}
    ${T(a.at(tyU(1000), 0)[0], yb + 50, 'PPFD (µmol m⁻² s⁻¹)', 'fx13-ax', 'middle')}
    ${TV(x0 - 48, a.at(0, tyV(0.2))[1], 'k<tspan baseline-shift="sub" font-size="14">PI</tspan> (h⁻¹)')}`;
}

/* ---------- De Souza et al. 2022 ---------- */

const DS2A: Img = { href: ds2aJpg, w: 1100, h: 787 }; // Fig. 2A without its letter, downscaled 0.729
const DS2C: Img = { href: ds2cJpg, w: 783, h: 946 }; // Fig. 2C
const DS1B: Img = { href: ds1bJpg, w: 820, h: 707 }; // Fig. 1B, downscaled 0.675
const CR_DS = 'De Souza et al. 2022, Science · © AAAS';

/* ---------- drawn: the PSII repair cycle (after Komenda et al. 2024) ---------- */

function repair(p: string, cx: number, cy: number): string {
  const dx = 82, dy = 108, bw = 150, bh = 62;
  const box = (x: number, y: number, l1: string, l2 = ''): string =>
    `<rect class="fx13-box" x="${f(x - bw / 2)}" y="${f(y - bh / 2)}" width="${bw}" height="${bh}" rx="12"/>${l2 ? `${T(x, y - 4, l1, 'fx13-l', 'middle')}${T(x, y + 20, l2, 'fx13-l', 'middle')}` : T(x, y + 7, l1, 'fx13-l', 'middle')}`;
  const [l, r, t, b] = [cx - dx, cx + dx, cy - dy, cy + dy];
  return `
    ${T(cx, t - 118, 'PSII repair cycle', 'fx13-h', 'middle')}
    ${box(l, t, 'active PSII')}${box(r, t, 'D1 damaged')}${box(r, b, 'D1 degraded')}${box(l, b, 'new D1', 'inserted')}
    ${ar(p, 'red', `M${l + bw / 2 - 40},${t - bh / 2 - 4} Q${cx},${t - bh / 2 - 30} ${r - bw / 2 + 40},${t - bh / 2 - 4}`)}
    ${ar(p, 'ink', `M${r},${t + bh / 2 + 6} L${r},${b - bh / 2 - 8}`, 'fx13-thin')}
    ${ar(p, 'ink', `M${r - bw / 2 - 4},${b} L${l + bw / 2 + 8},${b}`, 'fx13-thin')}
    ${ar(p, 'ink', `M${l},${b - bh / 2 - 6} L${l},${t + bh / 2 + 8}`, 'fx13-thin')}
    ${T(cx, t - bh / 2 - 36, `photodamage <tspan style="font-family:'Times New Roman',Times,serif;font-size:1.3em">∝</tspan> light`, 'fx13-h fx13-c-red', 'middle')}
    ${T(l + 12, cy + 7, 'reassembly', 'fx13-l')}
  `;
}

/* ---------- drawn: xanthophyll cycle and PsbS in the thylakoid (after Murchie & Niyogi 2011, Fig. 2) ---------- */

const hp = (x: number, y: number): string => `<circle cx="${x}" cy="${y}" r="13" fill="#fbe3dc" stroke="#c8361e" stroke-width="1.2"/>${T(x, y + 6, 'H⁺', 'fx13-bt', 'middle')}`;
/** The left half: excess light, acidic lumen, protonated PsbS and zeaxanthin in LHCII, heat out (x 16–434). */
function membrane(p: string): string {
  const m0 = 230, m1 = 350;
  return `
    ${T(430, 180, 'stroma', 'fx13-h fx13-c-grey', 'end')}${T(430, 548, 'lumen', 'fx13-h fx13-c-grey', 'end')}
    <rect x="16" y="${m0}" width="418" height="${m1 - m0}" fill="#ece8dc" stroke="#cfccc1" stroke-width="1.2"/>
    ${T(338, (m0 + m1) / 2 - 4, 'thylakoid', 'fx13-l fx13-c-grey')}${T(338, (m0 + m1) / 2 + 18, 'membrane', 'fx13-l fx13-c-grey')}
    <rect x="44" y="${m0 - 22}" width="150" height="${m1 - m0 + 44}" rx="22" fill="#dcebcc" stroke="#5d8a48" stroke-width="1.6"/>${T(119, (m0 + m1) / 2 - 2, 'LHCII', 'fx13-h', 'middle')}
    <circle cx="96" cy="${(m0 + m1) / 2 + 30}" r="9" fill="#f2a33a" stroke="#b9620f" stroke-width="1.2"/><circle cx="142" cy="${(m0 + m1) / 2 + 30}" r="9" fill="#f2a33a" stroke="#b9620f" stroke-width="1.2"/>
    ${T(119, (m0 + m1) / 2 + 60, 'zeaxanthin', 'fx13-l fx13-c-orange', 'middle')}
    <rect x="230" y="${m0 - 14}" width="96" height="${m1 - m0 + 28}" rx="20" fill="#e3e0f2" stroke="#6a62a8" stroke-width="1.6"/>${T(278, (m0 + m1) / 2 + 7, 'PsbS', 'fx13-h', 'middle')}
    ${hp(258, m1 + 34)}${hp(298, m1 + 34)}${ar(p, 'ink', `M258,${m1 + 20} L258,${m1 + 2}`, 'fx13-thin')}${ar(p, 'ink', `M298,${m1 + 20} L298,${m1 + 2}`, 'fx13-thin')}
    ${hp(110, 420)}${hp(160, 450)}${hp(220, 430)}${hp(290, 456)}${hp(360, 418)}${hp(390, 462)}
    ${T(200, 510, 'low pH (ΔpH)', 'fx13-h fx13-c-red', 'middle')}
    ${wv(p, 'orange', 44, 64, 84, m0 - 30, 4)}${T(20, 44, 'excess light', 'fx13-h fx13-c-amber')}
    ${wv(p, 'grey', 160, m0 - 26, 204, 96, 4)}${T(214, 96, 'heat (NPQ)', 'fx13-h fx13-c-grey')}
  `;
}
/** The right half: violaxanthin ⇄ antheraxanthin ⇄ zeaxanthin with VDE and ZEP. */
function cycle(p: string, cyc = 620): string {
  const v = 150, an = 300, z = 450;
  return `
    ${T(cyc, 70, 'xanthophyll cycle', 'fx13-h', 'middle')}
    ${T(cyc, v + 7, 'violaxanthin', 'fx13-h', 'middle')}${T(cyc, an + 7, 'antheraxanthin', 'fx13-h', 'middle')}${T(cyc, z + 7, 'zeaxanthin', 'fx13-h fx13-c-orange', 'middle')}
    ${ar(p, 'red', `M${cyc - 34},${v + 20} L${cyc - 34},${an - 26}`)}${ar(p, 'red', `M${cyc - 34},${an + 20} L${cyc - 34},${z - 26}`)}
    ${ar(p, 'blue', `M${cyc + 34},${an - 26} L${cyc + 34},${v + 20}`)}${ar(p, 'blue', `M${cyc + 34},${z - 26} L${cyc + 34},${an + 20}`)}
    ${T(cyc - 48, (v + an) / 2 - 4, 'VDE', 'fx13-h fx13-c-red', 'end')}${T(cyc - 48, (v + an) / 2 + 20, 'lumen, low pH', 'fx13-l', 'end')}
    ${T(cyc - 48, (an + z) / 2 + 8, 'VDE', 'fx13-h fx13-c-red', 'end')}
    ${T(cyc + 48, (v + an) / 2 - 4, 'ZEP', 'fx13-h fx13-c-blue')}${T(cyc + 48, (v + an) / 2 + 20, 'stroma', 'fx13-l')}
    ${T(cyc + 48, (an + z) / 2 + 8, 'ZEP', 'fx13-h fx13-c-blue')}
  `;
}
const xanthophyll = (p: string): string => membrane(p) + cycle(p);

/* ---------- Kromdijk et al. 2016 ---------- */

const KR3A: Img = { href: kr3aJpg, w: 622, h: 470 }; // Fig. 3A (with the left edge of 3B, masked)
const KR3A_MASK: Mask[] = [[556, 20, 596, 64], [608, 0, 622, 362], [0, 465, 622, 470]];
const KR5A_MASK: Mask[] = [[376, 14, 412, 50], [0, 366, 426, 370]];
const KR5A: Img = { href: kr5aJpg, w: 426, h: 370 }; // Fig. 5A, total dry weight relative to WT
const KR5D: Img = { href: kr5dJpg, w: 282, h: 250 }; // Fig. 5D, aerial photo of the field trial (Urbana, 2016; photo D. Drag)
const CR_KR = 'Kromdijk et al. 2016, Science · © AAAS'

/* ---------- variants ---------- */

/* a · Li Fig. 1b large, legend redrawn with what each mutant lacks */
function drawA(): string {
  const p = 'fx13a';
  return svg(p, 'Li and colleagues 2000, Figure 1b: NPQ of Arabidopsis leaves over 5 minutes of light and 5 minutes of dark. Wild type rises to about 2.4; npq1, without zeaxanthin, reaches about 0.8; npq4, without PsbS, and the double mutant only about 0.5. In the dark NPQ relaxes.', `
    ${liB(`${p}-a`, 34, 30, 734, false)}
    ${credit(786, 594, 'Li et al. 2000, Nature, Fig. 1b · © Macmillan; legend relabelled')}
  `);
}

/* b · Li Fig. 1b with the NPQ image of the rosettes, Fig. 1c */
function drawB(): string {
  const p = 'fx13b', c = shot(`${p}-c`, LIC, 506, 292, 276);
  const rows: [number, string][] = [[60, 'wild type'], [123, `${it('npq4')}`], [203, `${it('npq4')} + vector`], [283, `${it('npq4')} + ${it('psbS')} gene`]];
  return svg(p, 'Left: Li and colleagues 2000, Figure 1b: NPQ over 5 minutes of light and 5 of dark; wild type reaches about 2.4, npq1 without zeaxanthin about 0.8, npq4 without PsbS about 0.5. Right: Figure 1c, a false-colour image of NPQ in rosettes: wild type high; npq4 low (purple); npq4 with an empty vector low; npq4 given the psbS gene high again.', `
    ${liB(`${p}-b`, 60, 50, 430, true, [526, 64])}
    ${c.svg}
    ${rows.map(([v, s]) => T(494, c.at(0, v)[1] + 6, s, 'fx13-l', 'end')).join('')}
    ${T(644, c.at(0, 0)[1] - 12, 'NPQ image (false colour)', 'fx13-l', 'middle')}
    ${credit(786, 596, 'Li et al. 2000, Nature, Fig. 1b, c · © Macmillan')}
  `);
}

/* c · Li Fig. 1b beside Tyystjärvi & Aro Fig. 2A */
function drawC(): string {
  const p = 'fx13c';
  return svg(p, 'Left: Li and colleagues 2000, Figure 1b: NPQ of wild type, npq1 without zeaxanthin and npq4 without PsbS over 5 minutes of light and 5 of dark. Right: Tyystjärvi and Aro 1996, Figure 2A: the rate constant of photoinhibition of PSII in lincomycin-treated pumpkin leaves rises in a straight line with photon flux density, from 0 to about 0.4 per hour at 2000 micromoles per square metre per second.', `
    ${T(220, 26, 'NPQ (heat dissipation)', 'fx13-h', 'middle')}${T(612, 26, 'PSII photoinhibition rate', 'fx13-h', 'middle')}
    ${liB(`${p}-b`, 64, 84, 364, true, [96, 404])}
    ${tyA(`${p}-t`, 480, 72, 300)}
    ${credit(14, 594, 'Li et al. 2000, Nature, Fig. 1b · © Macmillan', 'start')}${credit(786, 594, CR_TY)}
  `);
}

/* d · Tyystjärvi & Aro Fig. 2A + the repair cycle */
function drawD(): string {
  const p = 'fx13d';
  return svg(p, 'Left: Tyystjärvi and Aro 1996, Figure 2A: the rate constant of PSII photoinhibition in lincomycin-treated pumpkin leaves is proportional to photon flux density up to 2000 micromoles per square metre per second. Right: the PSII repair cycle: active PSII; light damages the D1 protein; D1 is degraded; a new D1 is inserted; PSII is reassembled.', `
    ${tyA(`${p}-t`, 88, 60, 390)}
    ${repair(p, 642, 316)}
    ${credit(14, 594, CR_TY, 'start')}${credit(786, 594, 'after Komenda et al. 2024')}
  `);
}

/* e · De Souza Fig. 2C (τ₂ of NPQ relaxation) beside Fig. 1B (seed yield 2020) */
function drawE(): string {
  const p = 'fx13e', H = 360;
  const c = shot(`${p}-c`, DS2C, 14, 74, (DS2C.w * H) / DS2C.h, { fig: true, masks: [[0, 0, 56, 80], [0, 80, 5, 946], [772, 0, 783, 946], [0, 934, 783, 946]] });
  const b = shot(`${p}-b`, DS1B, 344, 74, (DS1B.w * H) / DS1B.h, { fig: true, masks: [[0, 0, 28, 48], [0, 48, 6, 707], [0, 675, 40, 707]] });
  return svg(p, 'Left: De Souza and colleagues 2022, Figure 2C: the slow time constant of NPQ relaxation, tau 2, is about 20 minutes in wild-type soybean and 6 to 8 minutes in three VPZ lines. Right: Figure 1B: seed yield in the 2020 field trial, 5.1 tonnes per hectare in wild type and up to 6.8 in VPZ line ND-18-34A, 33 percent more.', `
    ${c.svg}${b.svg}
    ${T(14 + (DS2C.w * H) / DS2C.h / 2, 36, 'NPQ relaxation τ₂ (2021)', 'fx13-h', 'middle')}${T(344 + (DS1B.w * H) / DS1B.h / 2, 36, 'seed yield, field 2020', 'fx13-h', 'middle')}
    ${pill(b.at(330, 0)[0], 70, '+33 %', b.at(240, 80))}
    ${pill(400, 486, 'VPZ lines: VDE, PsbS and ZEP overexpressed')}
    ${credit(786, 594, `${CR_DS}, Fig. 2C, 1B`)}
  `);
}

/* f · xanthophyll cycle and PsbS, drawn */
function drawF(): string {
  const p = 'fx13f';
  return svg(p, 'Drawn after Murchie and Niyogi 2011: in excess light the lumen becomes acidic. Protons bind to PsbS, and the lumen enzyme violaxanthin de-epoxidase (VDE) converts violaxanthin through antheraxanthin to zeaxanthin; together they switch LHCII to dissipate excitation as heat (NPQ). Zeaxanthin epoxidase (ZEP) on the stroma side converts zeaxanthin back.', `
    ${xanthophyll(p)}
    ${credit(786, 594, 'after Murchie & Niyogi 2011, Plant Physiol, Fig. 2')}
  `);
}

/* g · De Souza Fig. 2A large */
function drawG(): string {
  const p = 'fx13g', a = shot(`${p}-a`, DS2A, 24, 14, 750, { fig: true, masks: [[1092, 0, 1100, 787]] });
  return svg(p, 'De Souza and colleagues 2022, Figure 2A: NPQ after a change from high to low light. In wild-type soybean NPQ falls from 1 to about 0.52 within 2 minutes and stays there; in the VPZ lines, which overexpress VDE, PsbS and ZEP, it falls further, to 0.40 to 0.47.', `
    ${a.svg}
    ${pill(470, 428, 'VPZ: VDE, PsbS, ZEP overexpressed', a.at(700, 522))}
    ${credit(786, 594, `${CR_DS}, Fig. 2A`)}
  `);
}

/* h · field gains: tobacco dry weight (Kromdijk Fig. 5A, D) beside soybean seed yield (De Souza Fig. 1B) */
function drawH(): string {
  const p = 'fx13h', H = 300, HB = 360;
  const k = shot(`${p}-k`, KR5A, 14, 92, (KR5A.w * H) / KR5A.h, { fig: true, masks: KR5A_MASK });
  const d = shot(`${p}-d`, KR5D, 14, 410, 200);
  const b = shot(`${p}-b`, DS1B, 372, 92, (DS1B.w * HB) / DS1B.h, { fig: true, masks: [[0, 0, 28, 48], [0, 48, 6, 707], [0, 675, 40, 707]] });
  return svg(p, 'Left: Kromdijk and colleagues 2016, Figure 5A: in the 2016 field trial in Illinois, three tobacco lines with faster NPQ relaxation (VPZ) had 14 to 20 percent more total dry weight than wild type; below, an aerial photo of the trial plots. Right: De Souza and colleagues 2022, Figure 1B: soybean seed yield in the 2020 field trial, 5.1 tonnes per hectare in wild type and up to 6.8 in VPZ line ND-18-34A.', `
    ${k.svg}${d.svg}${b.svg}
    ${T(14 + (KR5A.w * H) / KR5A.h / 2, 40, 'tobacco, field 2016', 'fx13-h', 'middle')}${T(14 + (KR5A.w * H) / KR5A.h / 2, 64, 'dry weight +14–20 %', 'fx13-l', 'middle')}
    ${T(372 + (DS1B.w * HB) / DS1B.h / 2, 40, 'soybean, field 2020', 'fx13-h', 'middle')}${T(372 + (DS1B.w * HB) / DS1B.h / 2, 64, 'seed yield up to +33 %', 'fx13-l', 'middle')}
    ${T(240, 492, 'VPZ: VDE, PsbS, ZEP', 'fx13-l')}${T(240, 516, 'overexpressed', 'fx13-l')}
    ${credit(786, 576, `${CR_KR}, Fig. 5A, D (photo D. Drag)`)}${credit(786, 594, `${CR_DS}, Fig. 1B`)}
  `);
}

/* i · Kromdijk Fig. 3A (NPQ relaxation) above Fig. 5A (dry weight) and the field photo */
function drawI(): string {
  const p = 'fx13i';
  const a = shot(`${p}-a`, KR3A, 14, 14, 440, { fig: true, masks: KR3A_MASK });
  const k = shot(`${p}-k`, KR5A, 480, 14, 300, { fig: true, masks: KR5A_MASK });
  const d = shot(`${p}-d`, KR5D, 480, 300, 300);
  return svg(p, 'Kromdijk and colleagues 2016. Left, Figure 3A: after light off, NPQ relaxes faster and further in three tobacco lines overexpressing VDE, PsbS and ZEP (VPZ) than in wild type; the slow time constant falls from about 2640 to 690–790 seconds. Right, Figure 5A: in the field VPZ plants had 14 to 20 percent more total dry weight than wild type; below, Figure 5D, an aerial view of the field trial.', `
    ${a.svg}${k.svg}${d.svg}
    ${pill(230, 400, 'τ₂: wild type 2641 s, VPZ 693–793 s')}
    ${pill(230, 448, 'VPZ: VDE, PsbS, ZEP overexpressed')}
    ${credit(786, 594, `${CR_KR}, Fig. 3A, 5A, 5D (photo D. Drag)`)}
  `);
}

/* j · the acidic lumen, PsbS and zeaxanthin (drawn) beside Li Fig. 1b: no PsbS or no zeaxanthin, little NPQ */
function drawJ(): string {
  const p = 'fx13j';
  return svg(p, 'Left, drawn after Murchie and Niyogi 2011: in excess light the lumen becomes acidic; protons bind to PsbS and zeaxanthin forms in LHCII, which then dissipates excitation as heat (NPQ). Right, Li and colleagues 2000, Figure 1b: NPQ reaches about 2.4 in wild type, about 0.8 in npq1, which cannot make zeaxanthin, and about 0.5 in npq4, which lacks PsbS.', `
    ${membrane(p)}
    ${T(640, 44, 'NPQ, Arabidopsis', 'fx13-h', 'middle')}
    ${liB(`${p}-b`, 470, 112, 320, true, [490, 404])}
    ${credit(14, 594, 'after Murchie & Niyogi 2011', 'start')}${credit(786, 594, 'Li et al. 2000, Nature, Fig. 1b · © Macmillan')}
  `);
}

const DRAW: Record<string, () => string> = { a: drawA, b: drawB, c: drawC, d: drawD, e: drawE, f: drawF, g: drawG, h: drawH, i: drawI, j: drawJ };

export function draw(id: string): string {
  return (DRAW[id] ?? drawJ)();
}
