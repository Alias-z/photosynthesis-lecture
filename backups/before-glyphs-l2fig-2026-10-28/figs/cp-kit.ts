// Shared parts for the CO₂-path chunk (lecture 2, slides C9 and C10; prefix cp, 28 Oct 2026): text helpers, real-image
// frames with label pills and credits, arrow markers, CO₂ and water glyphs, and the drawn diffusion-path schema that C9
// (measured vs calculated) and C10 (three conductances) light part by part. Typical values at 25 °C: Busch et al. 2024,
// Plant Cell Environ 47:3344, Table 1 (Cₐ 420, Cᵢ 300, Cc 200 µmol mol⁻¹). Sources: assets/SOURCES-cp.md.
import { molecule } from '../illus';
import './cp.css';

export type A = 'start' | 'middle' | 'end';
export type Pt = [number, number];
export interface Img { href: string; w: number; h: number }
export interface Shot { svg: string; at: (u: number, v: number) => Pt; h: number; w: number; x: number; y: number }

export const f = (v: number): string => v.toFixed(1);
/** Newsreader (the serif of symbols and equations) has no subscript digits: set them as lowered tspans. */
const serifSub = (s: string): string => s.replace(/[₀-₉]/g, d => `<tspan baseline-shift="sub" font-size="70%">${d.charCodeAt(0) - 0x2080}</tspan>`);
export const T = (x: number, y: number, s: string, cls = 'fcp-l', a: A = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${/fcp-(eq|sym)/.test(cls) ? serifSub(s) : s}</text>`;
export const it = (s: string): string => `<tspan font-style="italic">${s}</tspan>`;
export const sb = (s: string): string => `<tspan baseline-shift="sub" font-size="70%">${s}</tspan>`;
/** Rotated text centred on (x, y). */
export const TV = (x: number, y: number, s: string, cls = 'fcp-s'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="middle" transform="rotate(-90 ${f(x)} ${f(y)})">${s}</text>`;

/** Symbols set in SVG: italic variable, upright subscript. */
export const C = (s: string): string => `${it('C')}${sb(s)}`;
export const g = (s: string): string => `${it('g')}${sb(s)}`;
export const SYM = { ca: C('a'), cs: C('s'), ci: C('i'), cc: C('c'), gb: g('b'), gs: g('s'), gm: g('m'), A: it('A'), E: it('E') };

/** Arrowhead markers: CO₂ (rust), water vapour (blue), ink and grey. */
export const heads = (p: string): string => `<defs>${(['co2', 'h2o', 'ink', 'grey'] as const).map(k =>
  `<marker id="${p}-${k}" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="5.2" markerHeight="5.2" orient="auto-start-reverse"><path class="fcp-hd-${k}" d="M0,0.6 L10,5 L0,9.4z"/></marker>`).join('')}</defs>`;
export const arr = (p: string, k: 'co2' | 'h2o' | 'ink' | 'grey', d: string, cls = ''): string =>
  `<path class="fcp-ar fcp-ar-${k}${cls ? ` ${cls}` : ''}" d="${d}" marker-end="url(#${p}-${k})"/>`;

export const svg = (p: string, label: string, body: string): string =>
  `<svg class="fig-svg fcp" viewBox="0 0 800 600" role="img" aria-label="${label}">${heads(p)}${body}</svg>`;

/** CO₂ as atom balls, water vapour as one O with two H. */
export const co2 = (x: number, y: number, r = 11): string => molecule(x, y, 'OCO', r);
export const h2o = (x: number, y: number, r = 9): string =>
  `<circle class="atom atom-H" cx="${f(x - r * 0.95)}" cy="${f(y + r * 0.7)}" r="${f(r * 0.55)}"/><circle class="atom atom-H" cx="${f(x + r * 0.95)}" cy="${f(y + r * 0.7)}" r="${f(r * 0.55)}"/><circle class="atom fcp-h2o-o" cx="${f(x)}" cy="${f(y)}" r="${f(r)}"/>`;

/** A real image: the window win = [u0, v0, width, height] (image pixels) shown w wide at x, y. A photo or micrograph gets a
 *  rounded frame; a published white-ground figure ('fig') is multiplied into the paper. at() maps image pixels to the figure. */
export function shot(id: string, im: Img, x: number, y: number, w: number,
  o: { win?: [number, number, number, number]; fig?: boolean; band?: string } = {}): Shot {
  const [u0, v0, uw, vh] = o.win ?? [0, 0, im.w, im.h];
  const s = w / uw, h = vh * s, ox = x - u0 * s, oy = y - v0 * s;
  const img = `<image href="${im.href}" x="${f(ox)}" y="${f(oy)}" width="${f(im.w * s)}" height="${f(im.h * s)}" preserveAspectRatio="none"/>`;
  const band = o.band
    ? `<rect class="fcp-credbg" x="${f(x)}" y="${f(y + h - 22)}" width="${f(w)}" height="22"/>${T(x + w - 8, y + h - 6.5, o.band, 'fcp-cr', 'end')}`
    : '';
  const clip = `<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}"${o.fig ? '' : ' rx="10"'}/></clipPath>`;
  const frame = o.fig ? '' : `<rect class="fcp-frame" x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="10"/>`;
  return { svg: `${clip}<g clip-path="url(#${id})"${o.fig ? ' class="fcp-mult"' : ''}>${img}${band}</g>${frame}`, at: (u, v) => [ox + u * s, oy + v * s], h, w, x, y };
}

const plain = (s: string): string => s.replace(/<[^>]+>/g, '');
/** Label pill centred at (x, y); with `to`, a leader from its edge to that point. Kinds: paper (on figures), photo (white on
 *  photos), co2 (rust), h2o (blue), dark. Width follows the text (≈ 10.6 px per character at 20 px). */
export function pill(x: number, y: number, s: string, o: { to?: Pt; k?: 'paper' | 'photo' | 'co2' | 'h2o' | 'dark' | 'leaf'; big?: boolean } = {}): string {
  const k = o.k ?? 'paper', fs = o.big ? 22 : 20, w = plain(s).length * fs * 0.53 + 26, hh = o.big ? 34 : 31;
  let ld = '';
  if (o.to) {
    const dx = o.to[0] - x, dy = o.to[1] - y;
    const t = Math.min((w / 2) / Math.max(Math.abs(dx), 1e-6), (hh / 2) / Math.max(Math.abs(dy), 1e-6));
    const a: Pt = [x + dx * t, y + dy * t];
    const d = `M${f(a[0])},${f(a[1])}L${f(o.to[0])},${f(o.to[1])}`;
    ld = `<path class="fcp-ldh" d="${d}"/><path class="fcp-ldk" d="${d}"/><circle class="fcp-tip" cx="${f(o.to[0])}" cy="${f(o.to[1])}" r="3.4"/>`;
  }
  return `${ld}<rect class="fcp-pill fcp-pill-${k}" x="${f(x - w / 2)}" y="${f(y - hh / 2)}" width="${f(w)}" height="${hh}" rx="${hh / 2}"/>${T(x, y + fs * 0.35, s, `fcp-pt fcp-pt-${k}${o.big ? ' fcp-pt-big' : ''}`, 'middle')}`;
}
/** Small grey credit line. */
export const credit = (x: number, y: number, s: string, a: A = 'end'): string => T(x, y, s, 'fcp-crd', a);
/** A square bracket over [x0, x1] at y, opening downward, with a label above its middle. */
export const brace = (x0: number, x1: number, y: number, s: string, cls = 'fcp-h'): string =>
  `<path class="fcp-brace" d="M${f(x0)},${f(y + 10)} V${f(y)} H${f(x1)} V${f(y + 10)}"/>${T((x0 + x1) / 2, y - 10, s, cls, 'middle')}`;

/* ---------- the drawn diffusion path (after Busch et al. 2024, Fig. 2), outside air on the left, stroma on the right ---------- */
// Zones on x: outside air 20–150, boundary layer 150–236, epidermis with the stoma 236–282, intercellular air space 282–470,
// cell wall 470–484, cytosol 484–500, chloroplast 500–770. The pore is centred at yP; CO₂ passes it at yP − 8, water at yP + 8.
// Every part sits in <g class="cpp cpp-on|off" data-p="<part>"> so that slides and animations can light it.

export type PathPart = 'air' | 'bl' | 'st' | 'ias' | 'me' | 'h2o' | 'co2';
export interface PathOpts {
  lit?: PathPart[];
  /** Typical values at 25 °C under Cₐ, Cᵢ and Cc (Busch et al. 2024, Table 1). */
  values?: boolean;
  /** Symbols under the drawing (Cₐ, Cₛ, Cᵢ, Cc); off for variants that label them otherwise. */
  syms?: boolean;
  /** Conductance brackets over the drawing. */
  brackets?: boolean;
  top?: number;
  bottom?: number;
}

export function pathSchema(p: string, o: PathOpts = {}): string {
  const lit = new Set<PathPart>(o.lit ?? ['air', 'bl', 'st', 'ias', 'me', 'h2o', 'co2']);
  const spot = !!o.lit; // a partial lit set: the lit parts glow
  const g = (k: PathPart, body: string): string => `<g class="cpp cpp-${lit.has(k) ? 'on' : 'off'}${spot && lit.has(k) ? ' cpp-glow' : ''}" data-p="${k}">${body}</g>`;
  const top = o.top ?? 110, bot = o.bottom ?? 450, H = bot - top, yP = (top + bot) / 2;
  const yc = yP - 8, yw = yP + 8;
  // Epidermis: two cells above and two below the pore; guard cells in section around the pore.
  const eh = (H / 2 - 44) / 2;
  const epi = [top, top + eh, yP + 44, yP + 44 + eh].map(y => `<rect class="fcp-epi" x="237" y="${f(y + 2)}" width="44" height="${f(eh - 4)}" rx="9"/>`).join('')
    + `<ellipse class="fcp-guard" cx="259" cy="${f(yP - 42)}" rx="24" ry="22"/><ellipse class="fcp-guard" cx="259" cy="${f(yP + 42)}" rx="24" ry="22"/>`;
  const cell = (cx: number, cy: number, rx: number, ry: number): string =>
    `<ellipse class="fcp-cell" cx="${cx}" cy="${f(cy)}" rx="${rx}" ry="${ry}"/>`;
  const ias = `<rect class="fcp-ias" x="282" y="${top}" width="188" height="${H}"/>
    ${cell(350, top + 18, 54, 34)}${cell(436, top + 4, 34, 30)}${cell(336, bot - 14, 48, 30)}${cell(430, bot - 4, 40, 28)}
    ${T(376, yP - 52, 'air space', 'fcp-z', 'middle')}${T(290, yw + 30, 'stoma', 'fcp-z')}`;
  const meso = `
    <rect class="fcp-wall" x="470" y="${top}" width="14" height="${H}"/>
    <rect class="fcp-cyto" x="484" y="${top}" width="300" height="${H}"/>
    <path class="fcp-pm" d="M488,${top} V${bot}"/>
    <path class="fcp-chl" d="M500,${f(top + 24)} Q497,${f(yP)} 500,${f(bot - 24)} Q640,${f(bot + 4)} 768,${f(bot - 36)} Q788,${f(yP)} 768,${f(top + 36)} Q640,${f(top - 4)} 500,${f(top + 24)} Z"/>
    ${[0, 1, 2].map(i => `<g class="fcp-thy">${[0, 1, 2, 3].map(j => `<rect x="${590 + i * 58}" y="${f(top + 54 + j * 10 + (i % 2) * 170)}" width="32" height="7" rx="3"/>`).join('')}</g>`).join('')}
    ${TV(460, top + 70, 'cell wall', 'fcp-z')}
    ${T(700, bot - 30, 'chloroplast', 'fcp-z', 'middle')}`;
  const bl = `<defs><linearGradient id="${p}-bl" x1="0" x2="1"><stop offset="0" stop-color="#cfdde9" stop-opacity="0"/><stop offset="1" stop-color="#cfdde9" stop-opacity=".95"/></linearGradient></defs>
    <rect x="150" y="${top}" width="87" height="${H}" fill="url(#${p}-bl)"/>
    <path class="fcp-dash" d="M150,${top} V${bot}"/>
    ${TV(194, top + 92, 'boundary layer', 'fcp-z')}`;
  const air = `${co2(70, top + 40)}${co2(110, bot - 46)}${co2(56, yP + 72)}${T(85, top + 112, 'outside air', 'fcp-z', 'middle')}`;
  const rub = `<rect class="fcp-rub" x="612" y="${f(yc - 19)}" width="104" height="36" rx="18"/>${T(664, yc + 6, 'Rubisco', 'fcp-rubt', 'middle')}`;
  const co2Arrow = `${arr(p, 'co2', `M44,${f(yc)} H606`, 'fcp-ar-big')}${T(556, yc - 14, 'CO₂', 'fcp-c', 'middle')}`;
  const water = `${arr(p, 'h2o', `M420,${f(yw)} H40`, 'fcp-ar-big')}${T(410, yw + 30, 'H₂O', 'fcp-w', 'middle')}`;
  const yb = top - 22;
  const brk = o.brackets === false ? '' : `
    ${g('bl', brace(152, 235, yb, SYM.gb, 'fcp-sym'))}
    ${g('st', brace(238, 280, yb, SYM.gs, 'fcp-sym'))}
    ${g('me', brace(470, 712, yb, SYM.gm, 'fcp-sym'))}`;
  const vy = bot + 40;
  const val = (x: number, sym: string, v: string, k: PathPart): string =>
    g(k, `${T(x, vy, sym, 'fcp-sym', 'middle')}${o.values && v ? T(x, vy + 30, v, 'fcp-s', 'middle') : ''}`);
  const vals = o.syms === false ? '' : `${val(85, SYM.ca, '420', 'air')}${val(237, SYM.cs, '', 'bl')}${val(376, SYM.ci, '300', 'ias')}${val(664, SYM.cc, '200', 'me')}
    ${o.values ? T(780, vy + 30, 'µmol mol⁻¹', 'fcp-s', 'end') : ''}`;
  return `
    ${g('bl', bl)}${g('ias', ias)}${g('st', epi)}${g('me', meso + rub)}${g('air', air)}
    ${g('co2', co2Arrow)}${g('h2o', water)}
    ${brk}${vals}`;
}
