// Lead page for slide 5 in the live lecture: the question alone, one full-page drawing (viewBox 1600 x 900);
// the "Into the leaf" animation answers it, and the study page (l04a.ts, "Where light is captured") is the recap.
// Never reveals: chloroplast movement, grana, stacking, antenna. The pictures only show how little light reaches
// the forest floor; how the plants cope is the answer.
// Photos (assets/photos, credits on the page; refs board L2b, images d and a):
// - lead5-taro.jpg: giant taro (Alocasia macrorrhizos) in rainforest shade, Lamington National Park, Queensland;
//   John Robert McPherson 2013, CC BY-SA 4.0 (the lecturer's pick, board image d).
// - lead5-sorrel.jpg: wood sorrel under spruce, Estonia; Maris Juuse 2012, CC BY-SA 3.0 (board image a).
// - leaf-sky.jpg: sunlit leaves against a clear sky; W.carter, CC BY-SA 4.0 (slide 2's photo).
// Photos are printed onto the paper: slightly muted, blacks lifted to warm ink and whites to paper.
import type { Variant } from '../types';
import './lead05.css';
import { sun } from './s2';
import taroJpg from '../../assets/photos/lead5-taro.jpg';
import sorrelJpg from '../../assets/photos/lead5-sorrel.jpg';
import skyJpg from '../../assets/leaf-sky.jpg';

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Taro photo' },
  { id: 'b', name: 'Photo band' },
  { id: 'c', name: 'Under the canopy' },
  { id: 'd', name: 'Sorrel floor' },
  { id: 'e', name: 'Sun and shade' },
];

type Pt = [number, number];
interface Img { href: string; w: number; h: number }
const TARO: Img = { href: taroJpg, w: 1600, h: 1200 };
const SORREL: Img = { href: sorrelJpg, w: 1400, h: 1009 };
const SKY: Img = { href: skyJpg, w: 2848, h: 2136 };
const CR = {
  taro: 'Photo: John Robert McPherson, CC BY-SA 4.0',
  sorrel: 'Photo: Maris Juuse, CC BY-SA 3.0',
  sky: 'Photo: W.carter, CC BY-SA 4.0',
};
const Q = ['How do plants', 'on a dark forest floor', 'collect enough light?'];
const Q2 = ['How do plants on a dark forest floor', 'collect enough light?'];
/** What each photo shows, as a small caption beside it (lecturer, 27 Oct 2026). */
const CAP = {
  taro: 'giant taro (<tspan font-style="italic">Alocasia</tspan>), rainforest floor',
  taroShort: 'giant taro, rainforest floor',
  sorrel: 'wood sorrel under spruce',
};

const f = (v: number): string => v.toFixed(1);
const svg = (p: string, label: string, body: string): string =>
  `<svg class="fld05" viewBox="0 0 1600 900" role="img" aria-label="${label}">${body}</svg>`;
const T = (x: number, y: number, s: string, cls: string, anchor: 'start' | 'middle' | 'end' = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${anchor}">${s}</text>`;
/** The question in Newsreader; each line is a tspan so the block measures as one label. */
function ask(x: number, y: number, size: number, lines: string[], gap = 1.12, anchor: 'start' | 'middle' = 'start'): string {
  return `<text class="lead-q" x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}">${lines
    .map((s, i) => `<tspan x="${x}" dy="${i ? f(size * gap) : 0}">${s}</tspan>`).join('')}</text>`;
}
/** A real photo printed onto the paper: the window win = [u0, v0, width, height] (image px) covers the box, rounded by r.
 *  lift = a soft shadow under an inset photo, as the study pages' figure panels have. */
function photo(id: string, im: Img, x: number, y: number, w: number, h: number, win: [number, number, number, number], r = 18, lift = false): string {
  const [u0, v0, uw, vh] = win, s = Math.max(w / uw, h / vh);
  const ix = x - u0 * s + (w - uw * s) / 2, iy = y - v0 * s + (h - vh * s) / 2;
  return `<defs><clipPath id="${id}-c"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/></clipPath>
      <filter id="${id}-p" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values=".88"/>
        <feComponentTransfer><feFuncR type="linear" slope=".93" intercept=".05"/><feFuncG type="linear" slope=".93" intercept=".045"/><feFuncB type="linear" slope=".92" intercept=".035"/></feComponentTransfer></filter>
      ${lift ? `<filter id="${id}-sh" x="-10%" y="-10%" width="120%" height="125%"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#46321a" flood-opacity=".22"/></filter>` : ''}</defs>
    ${lift ? `<rect class="fld05-mat" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" filter="url(#${id}-sh)"/>` : ''}
    <g clip-path="url(#${id}-c)"><image href="${im.href}" x="${f(ix)}" y="${f(iy)}" width="${f(im.w * s)}" height="${f(im.h * s)}" preserveAspectRatio="none" filter="url(#${id}-p)"/></g>
    ${r ? `<rect class="fld05-edge" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>` : ''}`;
}

/* ---------- a · Taro photo: the forest floor down the left edge, the question on the paper beside it ---------- */

function drawA(): string {
  const p = 'fld05a';
  return svg(p, 'Photograph of giant taro plants with large leaves on the dim floor of a rainforest, dark trunks behind. Beside it, the question: how do plants on a dark forest floor collect enough light?', `
    ${photo(`${p}-ph`, TARO, 0, 0, 720, 900, [330, 0, 960, 1200], 0)}
    ${ask(808, 330, 72, Q)}
    ${T(810, 838, CAP.taro, 'fld05-cap')}
    ${T(810, 866, CR.taro, 'fld05-credit')}
  `);
}

/* ---------- b · Photo band: the forest floor across the top, the question calmly on the paper below ---------- */

function drawB(): string {
  const p = 'fld05b';
  return svg(p, 'A wide photograph across the top of the page: giant taro leaves on the dim floor of a rainforest, dark trunks behind. Below it, the question: how do plants on a dark forest floor collect enough light?', `
    ${photo(`${p}-ph`, TARO, 0, 0, 1600, 520, [0, 380, 1600, 520], 0)}
    ${T(96, 554, CAP.taro, 'fld05-cap')}
    ${ask(800, 652, 66, Q2, 1.14, 'middle')}
    ${T(96, 866, CR.taro, 'fld05-credit')}
  `);
}

/* ---------- c · Under the canopy: full sunlight on the treetops, a few thin flecks on the floor ---------- */

/** A soft-edged polygon of light (points as [x, y] pairs). */
const glowPoly = (p: string, k: string, pts: Pt[], cls: string, blur = 4): string =>
  `<defs><filter id="${p}-gf${k}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${blur}"/></filter></defs>
    <polygon class="${cls}" points="${pts.map(([x, y]) => `${f(x)},${f(y)}`).join(' ')}" filter="url(#${p}-gf${k})"/>`;
/** A thin fleck of light falling from a gap in the canopy at (x0, y0) to (x1, y1), w0 wide at the top and w1 below. */
const fleck = (p: string, k: string, x0: number, y0: number, x1: number, y1: number, w0: number, w1: number): string =>
  glowPoly(p, k, [[x0 - w0 / 2, y0], [x0 + w0 / 2, y0], [x1 + w1 / 2, y1], [x1 - w1 / 2, y1]], 'fld05-fleck', 3);
/** A heart-shaped taro leaf on its stalk: the stalk rises from the base (bx, by) to the blade's notch at (x, y);
 *  rot turns the blade's tip from straight down. */
function taroLeaf(bx: number, by: number, x: number, y: number, len: number, rot: number): string {
  const w = len * 0.86;
  const blade = `M0,0 C${f(-w * 0.18)},${f(-len * 0.12)} ${f(-w * 0.62)},${f(-len * 0.1)} ${f(-w * 0.56)},${f(len * 0.28)} C${f(-w * 0.5)},${f(len * 0.62)} ${f(-w * 0.14)},${f(len * 0.86)} 0,${f(len)}
    C${f(w * 0.14)},${f(len * 0.86)} ${f(w * 0.5)},${f(len * 0.62)} ${f(w * 0.56)},${f(len * 0.28)} C${f(w * 0.62)},${f(-len * 0.1)} ${f(w * 0.18)},${f(-len * 0.12)} 0,0Z`;
  const veins = [0.3, 0.55].map(t => `M0,${f(len * t)} Q${f(-w * 0.22)},${f(len * (t + 0.02))} ${f(-w * 0.4)},${f(len * (t + 0.14))}M0,${f(len * t)} Q${f(w * 0.22)},${f(len * (t + 0.02))} ${f(w * 0.4)},${f(len * (t + 0.14))}`).join('');
  return `<path class="fld05-stalk" d="M${bx},${by} Q${f(bx + (x - bx) * 0.2)},${f(y + (by - y) * 0.35)} ${x},${y}"/>
    <g transform="translate(${x} ${y}) rotate(${rot})"><path class="f2-leaf fld05-taro" d="${blade}"/><path class="f2-vein" d="M0,${f(len * 0.06)} L0,${f(len * 0.9)}${veins}"/></g>`;
}
/** A broadleaf crown as overlapping lobes with one merged outline; back = the darker green of crowns behind. */
function crown(cx: number, cy: number, rx: number, ry: number, back = false): string {
  const lobes: Array<[number, number, number]> = [[-0.55, 0.15, 0.55], [0, -0.2, 0.7], [0.55, 0.12, 0.55], [-0.2, 0.3, 0.6], [0.28, 0.32, 0.6]];
  const c = back ? 'fld05-crown fld05-back' : 'fld05-crown';
  const e = (d: number, extra: string): string => lobes.map(([u, v, k]) =>
    `<ellipse class="${c}${extra}" cx="${f(cx + u * rx)}" cy="${f(cy + v * ry)}" rx="${f(rx * k - d)}" ry="${f(ry * k - d)}"/>`).join('');
  return e(0, '') + e(2, ' fld05-fill');
}

function drawC(): string {
  const p = 'fld05c';
  const ground = 784, top = 452, S: Pt = [1262, 196];
  const trunks = [262, 478, 700, 930, 1150].map(x => `<path class="fld05-trunk" d="M${x},${ground} V520"/>`).join('');
  const back = [[370, 438, 150, 64], [610, 426, 160, 70], [850, 438, 150, 62], [1080, 428, 150, 66]].map(([x, y, a, b]) => crown(x, y, a, b, true)).join('');
  const front = [[250, 466, 128, 60], [480, 470, 140, 60], [720, 464, 140, 64], [950, 470, 140, 60], [1170, 464, 124, 60]].map(([x, y, a, b]) => crown(x, y, a, b)).join('');
  // Sunlight spreads from the Sun over the whole canopy and stops there; under it, two thin flecks.
  return svg(p, 'Drawing of a forest. The Sun lights the treetops; under the closed canopy, only two thin flecks of light reach the dim forest floor, where a small plant with broad leaves grows. Question: how do plants on a dark forest floor collect enough light?', `
    ${ask(96, 150, 64, Q2)}
    <defs><linearGradient id="${p}-sh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".07" stop-color="#fff"/><stop offset=".93" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <mask id="${p}-shm" maskUnits="userSpaceOnUse" x="120" y="480" width="1180" height="${ground - 480}"><rect x="120" y="480" width="1180" height="${ground - 480}" fill="url(#${p}-sh)"/></mask></defs>
    ${glowPoly(p, 's', [[S[0] - 26, S[1] + 4], [S[0] + 26, S[1] + 4], [1300, top - 40], [150, top - 30]], 'fld05-sun-shaft', 10)}
    <rect class="fld05-shade" x="120" y="480" width="1180" height="${ground - 480}" mask="url(#${p}-shm)"/>
    ${fleck(p, '1', 598, 520, 640, 700, 8, 20)}${fleck(p, '2', 1040, 520, 1066, ground - 2, 5, 14)}
    ${trunks}${back}${front}
    <path class="fld05-ground" d="M150,${ground} H1290"/>
    ${taroLeaf(700, ground, 618, 700, 100, 62)}${taroLeaf(706, ground, 790, 694, 104, -60)}${taroLeaf(703, ground, 712, 650, 84, 12)}
    <g transform="translate(${S[0]} ${S[1]}) scale(1.5)">${sun(0, 0, 30)}</g>
    ${T(1326, 470, 'canopy', 'fld05-lab')}
    ${T(1326, ground + 9, 'forest floor', 'fld05-lab')}
  `);
}

/* ---------- d · Sorrel floor: wood sorrel carpeting a dark spruce forest, as an inset beside the question ---------- */

function drawD(): string {
  const p = 'fld05d';
  return svg(p, 'The question: how do plants on a dark forest floor collect enough light? Beside it, a photograph of wood sorrel carpeting the floor of a dark spruce forest.', `
    ${ask(96, 400, 68, Q)}
    ${photo(`${p}-ph`, SORREL, 856, 170, 648, 600, [120, 0, 1090, 1009], 20, true)}
    ${T(856, 806, CAP.sorrel, 'fld05-cap')}
    ${T(1504, 806, CR.sorrel, 'fld05-credit', 'end')}
  `);
}

/* ---------- e · Sun and shade: a sunlit leaf against the sky beside the dim rainforest floor ---------- */

function drawE(): string {
  const p = 'fld05e';
  const y = 290, h = 452, w = 604, xl = 172, xr = 824;
  return svg(p, 'Two photographs side by side: sunlit leaves against a clear blue sky, labelled full sun; giant taro leaves on a dim rainforest floor, labelled giant taro, rainforest floor. Above them, the question: how do plants on a dark forest floor collect enough light?', `
    ${ask(800, 142, 64, Q2, 1.14, 'middle')}
    ${photo(`${p}-sun`, SKY, xl, y, w, h, [620, 180, 1700, 1272], 20, true)}
    ${photo(`${p}-shade`, TARO, xr, y, w, h, [330, 340, 1000, 748], 20, true)}
    ${T(xl + w / 2, y + h + 50, 'full sun', 'fld05-lab', 'middle')}
    ${T(xr + w / 2, y + h + 50, 'rainforest floor', 'fld05-lab', 'middle')}${T(xr + w / 2, y + h + 80, 'giant taro', 'fld05-cap', 'middle')}
    ${T(96, 866, `Photos: ${CR.sky.replace('Photo: ', '')} · ${CR.taro.replace('Photo: ', '')}`, 'fld05-credit')}
  `);
}

export function draw(id: string): string {
  const d: Record<string, () => string> = { a: drawA, b: drawB, c: drawC, d: drawD, e: drawE };
  return (d[id] ?? drawA)();
}
