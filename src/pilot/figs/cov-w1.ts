// Slide C10o, page figure w1: the picked table w with drawn plants (figs/ov-plants.ts) instead of the plant photos, w's
// real leaf sections kept small beside them (credited at the bottom). Rows: share · where they live · how it copes ·
// benefit · cost (lecturer, 30 Oct 2026: "highlight the cost and benefits and the region they live; only the most
// important information"); the key phrase of each column on a soft marker band. Texts from figs/ov-sum.ts.
// viewBox 1340 × 590, 1 unit per px.
import { COLS } from './ov-table';
import { KINDS } from '../anim/ov-b';
import { PLANTS, PLANT_H } from './ov-plants';
import { SUM, f, INK, MUTE, RULE, TX, cell, nLines, markerDef, ital } from './ov-sum';

const W = 1340, H = 590, LW = 128, CW = (W - LW) / 4, PAD = 8, SZ = 17, LH = 21, N = 33;
const cx = (i: number): number => LW + i * CW;
const MK = 'cw1-mk';

/** A picture box: the image's window [centre x, centre y, width] shown in the box, cropped (as cov-w.ts). */
function pic(id: string, href: string, iw: number, ih: number, win: [number, number, number], x: number, y: number, w: number, h: number): string {
  const ww = Math.min(win[2], iw, (ih * w) / h), wh = (ww * h) / w, s = w / ww;
  const x0 = Math.max(0, Math.min(iw - ww, win[0] - ww / 2)), y0 = Math.max(0, Math.min(ih - wh, win[1] - wh / 2));
  return `<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="8"/></clipPath>
    <image href="${href}" x="${f(x - x0 * s)}" y="${f(y - y0 * s)}" width="${f(iw * s)}" height="${f(ih * s)}" clip-path="url(#${id})" preserveAspectRatio="none"/>
    <rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="8" style="fill:none;stroke:#cfc8b6;stroke-width:1"/>`;
}

export function draw(): string {
  const headH = 48, PH = 170, SEC = 128;
  const rows: Array<[string[], (k: number) => string]> = [
    [['Share'], k => SUM[k].share],
    [['Where', 'they live'], k => SUM[k].where],
    [['How it', 'copes'], k => SUM[k].how],
    [['Benefit'], k => SUM[k].gain],
    [['Cost'], k => SUM[k].cost],
  ];
  let y = headH + 4;
  const yPic = y; y += PH;
  const rowY = rows.map(([, t]) => { const y0 = y; y += Math.max(...SUM.map((_, k) => nLines(t(k), N))) * LH + 2 * PAD; return y0; });
  const bottom = y;
  const rule = (yy: number): string => `<path d="M0,${f(yy)} H${W}" style="stroke:${RULE};stroke-width:1.4"/>`;
  const heads = SUM.map((s, i) => `<rect x="${f(cx(i) + 4)}" y="0" width="${f(CW - 8)}" height="${headH}" rx="12" style="fill:${COLS[i].tint}"/>
      ${TX(cx(i) + 14, 34, s.name, 30, INK, 700)}${TX(cx(i) + (s.name.length > 2 ? 100 : 62), 33, ital(s.plant), 17, MUTE)}`).join('');
  const plants = SUM.map((_, i) => {
    const xs = cx(i) + CW - PAD - SEC - 2, k = KINDS[i];
    const avail = PH - 16, s = Math.min(0.95, avail / PLANT_H[i]);
    return PLANTS[i](cx(i) + PAD + (xs - cx(i) - PAD) / 2 + 2, yPic + PH - 9, s)
      + pic(`cw1-s${i}`, k.sec.href, k.sec.w, k.sec.h, [k.secC[0], k.secC[1], k.secD], xs, yPic + (PH - SEC) / 2, SEC, SEC);
  }).join('');
  const labs = rows.map(([l], r) => l.map((t, j) => TX(0, rowY[r] + PAD + SZ + j * LH, t, SZ, MUTE, 700)).join('')).join('');
  const cells = rows.map(([, t], r) => SUM.map((_, i) => cell(cx(i) + PAD + 2, rowY[r] + PAD + SZ, t(i), N, SZ, LH, INK, 400, MK).svg).join('')).join('');
  const rules = [yPic, ...rowY, bottom].map(rule).join('');
  const it = (s: string): string => `<tspan font-style="italic">${s}</tspan>`;
  const credits = TX(0, H - 4, `Leaf sections: ${it('Steinchisma laxum')} (C₃) and ${it('Homolepis aturensis')} (C₂), Khoshravesh et al. 2016, J. Exp. Bot. (CC BY 3.0); maize (C₄) and a succulent leaf (CAM), Berkshire Community College Bioscience Image Library (CC0)`, 12, MUTE);
  return `<svg class="fig-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="One table across the page compares C₃, C₂, C₄ and CAM photosynthesis, from cool and moist to hot and dry. For each: a drawing of a representative plant (wheat, Flaveria, maize, saguaro cactus) beside its leaf section; its share of species; where it lives; how it copes with scarce CO₂; its benefit; its cost. Highlighted: C₃ is about 90 % of species and the cheapest, but suffers on hot, dry days; C₄ needs strong sun to pay 2 extra ATP per CO₂ and saves water; CAM survives drought but grows slowly.">
    <defs>${markerDef(MK)}</defs>${heads}${rules}${plants}${labs}${cells}${credits}</svg>`;
}
