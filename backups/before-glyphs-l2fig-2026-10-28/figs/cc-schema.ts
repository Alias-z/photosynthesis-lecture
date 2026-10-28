// Chunk cc's one theory, drawn once: where CO₂ is released relative to Rubisco, in four panels (C₃ · C₂ · C₄ · CAM).
// Each slide lights its panels and dims the others (C11: C₃ + C₂; C12: C₄; C13: CAM). Every panel is wrapped in
// <g data-p="c3|c2|c4|cam" class="on|off"> so later animations can find it; keep that markup stable.
// The cell drawings are exported for the single-slide figures, so the same drawing of each cell is used everywhere.
import { T, chloro, co2, enzyme, f, heads, it, mito, route, svg } from './cc-kit';

export type Part = 'c3' | 'c2' | 'c4' | 'cam';

/** A stretch of C₃ mesophyll wall, zoomed (after Busch 2020 Fig. 2): air space above, the wall, a row of chloroplasts on
 *  it, mitochondria behind them. `gaps` = chloroplasts with gaps and no stromules (tobacco-like); otherwise a closed row
 *  bridged by stromules (rice). CO₂ from the mitochondria goes into the stroma or out through a gap. */
export function c3Section(p: string, x: number, y: number, w: number, h: number,
  o: { gaps?: boolean; air?: number; big?: boolean; labels?: boolean } = {}): string {
  const air = o.air ?? 64, wy = y + air, s: string[] = [];
  const crx = o.big ? 31 : 25, cry = o.big ? 15.5 : 12.5, mrx = o.big ? 24 : 19, mry = o.big ? 13 : 10.5;
  s.push(`<rect class="fcc-wall" x="${f(x)}" y="${f(wy)}" width="${f(w)}" height="${f(h - air)}" rx="10"/>`);
  s.push(`<path class="fcc-cellwall" d="M${f(x)},${f(wy)} H${f(x + w)}"/>`);
  const n = 5, step = w / n, cy = wy + cry + 7;
  const cx = (i: number): number => x + step * (i + 0.5);
  // rice: five chloroplasts bridged by stromules; tobacco-like: three of five (60 % of the wall), no stromules
  const keep = (i: number): boolean => !o.gaps || i % 2 === 0;
  for (let i = 0; i < n; i++) {
    if (keep(i)) s.push(chloro(cx(i), cy, crx, cry));
    if (!o.gaps && i < n - 1) s.push(`<path class="fcc-stromule" d="M${f(cx(i) + crx - 5)},${f(wy + 7)} H${f(cx(i + 1) - crx + 5)}"/>`);
  }
  const my = cy + cry + mry + 18;
  const mA = cx(1), mB = o.gaps ? cx(2) : cx(3);
  s.push(mito(mA, my, mrx, mry), mito(mB, my + 4, mrx, mry, -6));
  if (o.gaps) {
    // CO₂ from the mitochondrion under the gap leaves the cell; the other one's CO₂ enters a chloroplast
    s.push(route(p, 'x', `M${f(mA)},${f(my - mry - 4)} V${f(y + 12)}`));
    s.push(route(p, 'c', `M${f(mB)},${f(my + 4 - mry - 4)} V${f(cy + cry - 2)}`));
  } else {
    // CO₂ from both mitochondria must cross the stroma: part is refixed there, part goes on to the air space
    s.push(route(p, 'c', `M${f(mA)},${f(my - mry - 4)} V${f(cy + cry - 2)}`));
    s.push(route(p, 'c', `M${f(mB)},${f(my + 4 - mry - 4)} V${f(cy + cry - 2)}`));
    s.push(route(p, 'x', `M${f(mB + 8)},${f(cy - cry + 1)} V${f(y + 12)}`, 'fcc-thin'));
  }
  if (o.labels) {
    s.push(T((mA + mB) / 2, my + mry + 34, 'mitochondria', 'fcc-s fcc-mt-t'));
    s.push(T((o.gaps ? mB : mA) + mrx + 6, my - 2, 'CO₂', 'fcc-s fcc-co2', 'start'));
    s.push(T(x + 8, y + 26, 'air space', 'fcc-s', 'start'));
  }
  return s.join('');
}

/** Mesophyll | bundle sheath | vein, left to right. Returns the cell edges for routes. */
export function tissue(x: number, y: number, w: number, h: number, mFrac = 0.4): { svg: string; m: [number, number]; bs: [number, number]; vein: number } {
  const mw = w * mFrac, gap = 10, vw = Math.max(34, w * 0.11), bsw = w - mw - vw - 2 * gap;
  const mx1 = x + mw, bx0 = mx1 + gap, bx1 = bx0 + bsw, vx0 = bx1 + gap;
  const xy = [0.22, 0.5, 0.78].map(k => `<circle class="fcc-xy" cx="${f(vx0 + vw / 2)}" cy="${f(y + h * k)}" r="${f(vw * 0.28)}"/>`).join('');
  return {
    svg: `<rect class="fcc-wall" x="${f(x)}" y="${f(y)}" width="${f(mw)}" height="${f(h)}" rx="24"/>
      <rect class="fcc-bs" x="${f(bx0)}" y="${f(y)}" width="${f(bsw)}" height="${f(h)}" rx="24"/>
      <rect class="fcc-vein" x="${f(vx0)}" y="${f(y)}" width="${f(vw)}" height="${f(h)}" rx="${f(vw / 2)}"/>${xy}`,
    m: [x, mx1], bs: [bx0, bx1], vein: vx0,
  };
}

/** Chloroplasts lining a mesophyll cell's left, top and bottom walls. */
function mesoLining(m0: number, m1: number, y: number, h: number, crx: number, cry: number): string {
  const s: string[] = [];
  const nv = Math.max(2, Math.floor((h - 50) / (2 * crx + 8)));
  for (let i = 0; i < nv; i++) s.push(chloro(m0 + cry + 7, y + 30 + crx + (i * (h - 60 - 2 * crx)) / Math.max(1, nv - 1), crx, cry, 90));
  const nh = Math.max(1, Math.floor((m1 - m0 - 60) / (2 * crx + 8)));
  for (let i = 0; i < nh; i++) {
    const cx = m0 + 48 + crx + (i * (m1 - m0 - 70 - 2 * crx)) / Math.max(1, nh - 1);
    s.push(chloro(cx, y + cry + 7, crx, cry), chloro(cx, y + h - cry - 7, crx, cry));
  }
  return s.join('');
}

/** C₂: glycine moves from mesophyll to bundle-sheath mitochondria at the vein-side wall; their CO₂ enters the chloroplasts
 *  in front of them. Returns the drawing; `mitoAt` is where the glycine decarboxylase mitochondria sit. */
export function c2Tissue(p: string, x: number, y: number, w: number, h: number, o: { labels?: boolean; big?: boolean } = {}): string {
  const t = tissue(x, y, w, h);
  const [m0, m1] = t.m, [, b1] = t.bs;
  const k = o.big ? 1.25 : 1;
  const out = [t.svg, mesoLining(m0, m1, y, h, 20 * k, 9 * k)];
  const mx = b1 - 13 * k - 6, cx = mx - 13 * k - 12 * k - 6;
  const nm = Math.max(3, Math.floor((h - 30) / (30 * k)));
  for (let i = 0; i < nm; i++) out.push(mito(mx, y + 22 * k + (i * (h - 44 * k)) / (nm - 1), 13 * k, 8 * k, 90, true));
  const nc = Math.max(2, Math.floor((h - 30) / (56 * k)));
  const cys: number[] = [];
  for (let i = 0; i < nc; i++) { const cy = y + 34 * k + (i * (h - 68 * k)) / Math.max(1, nc - 1); cys.push(cy); out.push(chloro(cx, cy, 25 * k, 11 * k, 90)); }
  out.push(route(p, 'g', `M${f(m0 + 40 * k)},${f(y + h / 2)} H${f(mx - 18 * k)}`));
  for (const cy of [cys[0], cys[cys.length - 1]]) out.push(route(p, 'c', `M${f(mx - 9 * k)},${f(cy + (cy < y + h / 2 ? 14 : -14))} L${f(cx + 13 * k)},${f(cy)}`, 'fcc-thin'));
  if (o.labels !== false) out.push(T((m0 + m1) / 2 + 10, y + h / 2 - 12, 'glycine', 'fcc-l fcc-gly'));
  return out.join('');
}

/** C₄: PEP carboxylase in the mesophyll, a C₄ acid to the bundle sheath, CO₂ concentrated around Rubisco there. */
export function c4Tissue(p: string, x: number, y: number, w: number, h: number, o: { labels?: boolean; big?: boolean } = {}): string {
  const t = tissue(x, y, w, h, 0.38);
  const [m0, m1] = t.m, [b0, b1] = t.bs;
  const k = o.big ? 1.25 : 1;
  const out = [t.svg];
  const bc = (b0 + b1) / 2;
  out.push(chloro(m0 + 16, y + h * 0.25, 17 * k, 7.5 * k, 90), chloro(m0 + 16, y + h * 0.75, 17 * k, 7.5 * k, 90));
  out.push(chloro(bc - 16 * k, y + h * 0.3, 28 * k, 12 * k, 90), chloro(bc + 18 * k, y + h * 0.7, 28 * k, 12 * k, 90));
  out.push(co2(x - 30 * k, y + h / 2, 8 * k));
  out.push(route(p, 'k', `M${f(x - 8 * k)},${f(y + h / 2)} H${f(m0 + 20)}`, 'fcc-thin'));
  out.push(enzyme((m0 + m1) / 2 + 10, y + h / 2, 'PEPC', 'm', 18));
  out.push(route(p, 'm', `M${f((m0 + m1) / 2 + 42)},${f(y + h / 2)} H${f(bc - 22 * k)}`));
  for (const [dx, dy] of [[-30, -46], [26, -30], [-28, 40], [30, 16], [2, -4]] as const) out.push(co2(bc + dx * k, y + h / 2 + dy * k, 7 * k));
  if (o.labels !== false) out.push(T((m1 + b0) / 2 - 4, y + h / 2 - 16, 'C₄ acid', 'fcc-l fcc-c4'));
  return out.join('');
}

/** CAM: one cell at night (stoma open, CO₂ → malic acid in the vacuole) and by day (stoma shut, acid → CO₂ → chloroplast). */
export function camPair(p: string, x: number, y: number, w: number, h: number, o: { labels?: boolean } = {}): string {
  const cw = (w - 26) / 2, out: string[] = [];
  const cell = (cx: number, night: boolean): string => {
    const s: string[] = [];
    s.push(`<rect class="fcc-wall" x="${f(cx)}" y="${f(y)}" width="${f(cw)}" height="${f(h)}" rx="22"/>`);
    const vx = cx + cw * 0.38, vw = cw * 0.54, vy = y + 16, vh = h - 32;
    const ah = night ? vh * 0.62 : vh * 0.16;
    s.push(`<rect class="fcc-vac" x="${f(vx)}" y="${f(vy)}" width="${f(vw)}" height="${f(vh)}" rx="16"/>`);
    s.push(`<rect class="fcc-acid" x="${f(vx + 4)}" y="${f(vy + vh - 4 - ah)}" width="${f(vw - 8)}" height="${f(ah)}" rx="12"/>`);
    // stoma in the left wall: open at night, shut by day
    const sy = y + h / 2, g = night ? 8 : 0.5;
    s.push(`<ellipse class="fcc-stoma" cx="${f(cx)}" cy="${f(sy - 11 - g)}" rx="8" ry="12"/><ellipse class="fcc-stoma" cx="${f(cx)}" cy="${f(sy + 11 + g)}" rx="8" ry="12"/>`);
    const chx = cx + cw * 0.2;
    s.push(chloro(chx, y + h * 0.2, 16, 7.5, 90), chloro(chx, y + h * 0.8, 16, 7.5, 90));
    if (night) {
      s.push(co2(cx - 34, sy, 7.5));
      s.push(route(p, 'k', `M${f(cx - 14)},${f(sy)} H${f(vx - 6)}`, 'fcc-thin'));
    } else {
      s.push(route(p, 'c', `M${f(vx - 4)},${f(vy + vh - ah / 2 - 4)} C${f(vx - 24)},${f(vy + vh - 20)} ${f(chx + 30)},${f(y + h * 0.82)} ${f(chx + 11)},${f(y + h * 0.8)}`, 'fcc-thin'));
    }
    return s.join('');
  };
  out.push(cell(x + 14, true), cell(x + 14 + cw + 26, false));
  if (o.labels !== false) {
    const lx1 = x + 14 + cw / 2, lx2 = x + 14 + cw + 26 + cw / 2;
    out.push(`<circle class="fcc-moon" cx="${f(lx1 - 34)}" cy="${f(y - 14)}" r="9"/>${T(lx1 + 8, y - 7, 'night', 'fcc-s')}`);
    out.push(`<circle class="fcc-sun" cx="${f(lx2 - 26)}" cy="${f(y - 14)}" r="9"/>${T(lx2 + 10, y - 7, 'day', 'fcc-s')}`);
  }
  return out.join('');
}

const PANELS: Record<Part, { head: string; plant: string; cap: string; dx: number }> = {
  c3: { head: 'C₃', plant: 'rice, wheat', cap: 'CO₂ released behind chloroplasts', dx: 56 },
  c2: { head: 'C₂', plant: `${it('Flaveria')}, ${it('Moricandia')}`, cap: 'CO₂ released in the bundle sheath', dx: 56 },
  c4: { head: 'C₄', plant: 'maize, sugarcane', cap: 'CO₂ pumped into the bundle sheath', dx: 56 },
  cam: { head: 'CAM', plant: 'agave, pineapple', cap: 'CO₂ stored at night, used by day', dx: 92 },
};

/** One panel at (x, y), 386 × 284. */
function panel(p: string, k: Part, x: number, y: number, on: boolean): string {
  const P = PANELS[k], W = 386, H = 284;
  let body = '';
  if (k === 'c3') body = c3Section(p, x + 24, y + 96, 338, 170, { air: 52 });
  if (k === 'c2') body = c2Tissue(p, x + 22, y + 98, 342, 168);
  if (k === 'c4') body = c4Tissue(p, x + 58, y + 98, 306, 168);
  if (k === 'cam') body = camPair(p, x + 40, y + 120, 330, 146);
  return `<g data-p="${k}" class="${on ? 'on' : 'off'}">
    <rect class="${on ? 'fcc-lit-bg' : 'fcc-off-bg'}" x="${x}" y="${y}" width="${W}" height="${H}" rx="18"/>
    <g${on ? '' : ' class="fcc-dim"'}>
      ${T(x + 20, y + 42, P.head, 'fcc-big', 'start')}${T(x + 20 + P.dx, y + 40, P.plant, 'fcc-it', 'start')}
      ${T(x + 20, y + 74, P.cap, 'fcc-l', 'start')}
      ${body}
    </g></g>`;
}

/** The four-panel schema with the parts in `lit` lit. */
export function schemaSvg(p: string, lit: Part[], label: string): string {
  const on = (k: Part): boolean => lit.includes(k);
  return svg(label, `${heads(p)}
    ${panel(p, 'c3', 8, 10, on('c3'))}${panel(p, 'c2', 406, 10, on('c2'))}
    ${panel(p, 'c4', 8, 306, on('c4'))}${panel(p, 'cam', 406, 306, on('cam'))}`);
}
