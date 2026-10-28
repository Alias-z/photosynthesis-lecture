// Slide 10 (was 11) · ATP and NADPH supply, redo of 27 Oct 2026; text from research/redo-2026-10-27/DRAFT_PAGES_MECHANISMS.md.
// Figure research: research/redo-2026-10-27/A_LIGHT_6-11.md, row 11). Focus set by the
// lecturer on 27 Oct: ATP : NADPH supply vs demand, cyclic flow, state transitions. Figure variants from real published figures
// (sources: assets/SOURCES-L1b.md); only the budget is drawn (a, and compact in d).
// Numbers (Johnson 2016): the Calvin–Benson cycle needs 3 ATP + 2 NADPH per CO₂ (9 ATP + 6 NADPH per triose phosphate), 1.5 ATP per
// NADPH; linear flow moves 12 H⁺ per O₂ (4 e⁻, 2 NADPH), and at 4.67 H⁺ per ATP that is 12 / 4.67 = 2.57 ATP, 1.28 ATP per NADPH;
// the gap is 3 − 2.57 = 0.43 ATP per CO₂. Cyclic flow around PSI (PGR5 or NDH route) moves H⁺ without making NADPH.
// State transitions: the STN7 kinase phosphorylates LHCII, which then binds PSI (Bellafiore et al. 2005; Pan et al. 2018).
import type { PlateText, Variant } from '../types';
import plantsJpg from '../../assets/photos/10-munekage-plants.jpg';
import etrJpg from '../../assets/photos/10-munekage-etr.jpg';
import panJpg from '../../assets/photos/10-pan.jpg';
import degenPng from '../../assets/photos/10-degen.png';
import shevPng from '../../assets/photos/10-shevela.png';
import './s11.css';

export const PLATE: PlateText = {
  n: '10',
  title: 'ATP and NADPH supply',
  status: 'draft',
  lead: 'The Calvin–Benson–Bassham cycle uses 3 ATP per 2 NADPH; chloroplasts adjust the supply by changing electron routes.',
  points: [
    { claim: 'Linear electron flow.', text: 'Water → PSII → PSI → NADP⁺', eq: 'per O₂: ≈ 2.6 ATP + 2 NADPH' },
    { claim: 'Cyclic electron flow.', text: 'PSI → plastoquinone → b₆f → PSI: ATP only' },
    { claim: 'State transitions.', text: 'PSII gets too much light: LHCII moves to PSI; both run evenly' },
  ],
  refs: [
    { label: 'Johnson 2016', url: 'https://doi.org/10.1042/EBC20160016' },
    { label: 'Munekage et al. 2004', url: 'https://doi.org/10.1038/nature02598' },
    { label: 'Shevela et al. 2023', url: 'https://doi.org/10.1007/s11120-022-00991-y' },
    { label: 'Bellafiore et al. 2005', url: 'https://doi.org/10.1038/nature03286' },
    { label: 'Pan et al. 2018', url: 'https://doi.org/10.1126/science.aat1156' },
    { label: 'Degen et al. 2026', url: 'https://doi.org/10.1038/s41477-026-02374-w' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'ATP : NADPH supply and demand' },
  { id: 'b', name: 'Linear and cyclic electron flow' },
  { id: 'c', name: 'State transitions: PSI–LHCII complex' },
  { id: 'd', name: 'ATP : NADPH budget + cyclic electron flow' },
  { id: 'e', name: 'Mutants without cyclic electron flow' },
  { id: 'f', name: 'Mutants without cyclic flow: growth + electron transport' },
  { id: 'g', name: 'Cyclic electron flow + state transitions' },
  { id: 'h', name: 'pgr5: proton motive force vs stromal ATP (optional)' },
];

/* ---------- shared helpers (pattern of l04b u–z) ---------- */

type A = 'start' | 'middle' | 'end';
type Pt = [number, number];
interface Img { href: string; w: number; h: number }
interface Shot { svg: string; at: (u: number, v: number) => Pt; h: number }
const f = (v: number): string => v.toFixed(1);
const T = (x: number, y: number, s: string, cls = 'fs11-l', a: A = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;

function shot(id: string, im: Img, x: number, y: number, w: number,
  o: { win?: [number, number, number, number]; fig?: boolean; credit?: string; hole?: [number, number, number, number] } = {}): Shot {
  const [u0, v0, uw, vh] = o.win ?? [0, 0, im.w, im.h];
  const s = w / uw, h = vh * s, ox = x - u0 * s, oy = y - v0 * s;
  const img = `<image href="${im.href}" x="${f(ox)}" y="${f(oy)}" width="${f(im.w * s)}" height="${f(im.h * s)}"/>`;
  const band = o.credit ? `<rect class="fs11-credbg" x="${f(x)}" y="${f(y + h - 22)}" width="${f(w)}" height="22"/>${T(x + w - 8, y + h - 6.5, o.credit, 'fs11-cr', 'end')}` : '';
  // The hole is clipped to the window first: a hole reaching outside the window would add that outside part under evenodd.
  const hc = o.hole && [Math.max(o.hole[0], u0), Math.max(o.hole[1], v0), Math.min(o.hole[2], u0 + uw), Math.min(o.hole[3], v0 + vh)];
  const hl = hc && hc[2] > hc[0] && hc[3] > hc[1] ? (([a, b, c, d]) => ` M${f(ox + a * s)},${f(oy + b * s)} H${f(ox + c * s)} V${f(oy + d * s)} H${f(ox + a * s)}Z`)(hc) : '';
  const clip = o.fig
    ? `<clipPath id="${id}"><path clip-rule="evenodd" d="M${f(x)},${f(y)} h${f(w)} v${f(h)} h${f(-w)}Z${hl}"/></clipPath>`
    : `<clipPath id="${id}"><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="10"/></clipPath>`;
  return { svg: `${clip}<g clip-path="url(#${id})"${o.fig ? ' class="fs11-mult"' : ''}>${img}${band}</g>`, at: (u, v) => [ox + u * s, oy + v * s], h };
}
const pleader = (a: Pt, b: Pt): string => {
  const d = `M${f(a[0])},${f(a[1])}L${f(b[0])},${f(b[1])}`;
  return `<path class="fs11-ldh" d="${d}"/><path class="fs11-ldk" d="${d}"/><circle class="fs11-tipd" cx="${f(b[0])}" cy="${f(b[1])}" r="2.8"/>`;
};
/** A label pill centred at (x, y): white on photos, tinted on white-ground figures; with `to`, a leader. */
function pill(x: number, y: number, s: string, to?: Pt, tint = false, small = false): string {
  const w = s.replace(/<[^>]+>/g, '').length * (small ? 8 : 8.8) + (small ? 14 : 22), hh = small ? 24 : 28;
  let ld = '';
  if (to) {
    const dx = to[0] - x, dy = to[1] - y, t = Math.min(w / 2 / Math.max(Math.abs(dx), 1e-6), hh / 2 / Math.max(Math.abs(dy), 1e-6));
    ld = pleader([x + dx * t, y + dy * t], to);
  }
  return `${ld}<rect class="${tint ? 'fs11-pillbg-t' : 'fs11-pillbg'}" x="${f(x - w / 2)}" y="${f(y - hh / 2)}" width="${f(w)}" height="${hh}" rx="${hh / 2}"/>${T(x, y + (small ? 5.5 : 6), s, small ? 'fs11-pills' : 'fs11-pill', 'middle')}`;
}
const it = (s: string): string => `<tspan font-style="italic">${s}</tspan>`;
const credit = (x: number, y: number, s: string, a: A = 'end'): string => T(x, y, s, 'fs11-crd', a);
const realSvg = (label: string, body: string): string =>
  `<svg class="fig-svg fs11" viewBox="0 0 800 600" role="img" aria-label="${label}">${body}</svg>`;

const CR = {
  plants: 'Munekage et al. 2004, Nature, Fig. 2 · © Springer Nature',
  etr: 'Munekage et al. 2004, Nature, Fig. 1e · © Springer Nature',
  shev: 'Shevela et al. 2023, Photosynth Res, Fig. 1 · CC BY 4.0',
  pan: 'Pan et al. 2018, Science, Fig. 1B · © AAAS',
  degen: 'Degen, Schwarzländer & Johnson 2026, Nat Plants, Fig. 2d · CC BY 4.0',
  budget: 'Numbers: Johnson 2016, Essays Biochem',
};

/* ---------- the ATP : NADPH budget (drawn plainly from Johnson 2016's numbers) ---------- */

/** One row of unit blocks: ATP (n, a fraction drawn as part of a block) and NADPH, from x0 at y; u = px per molecule. */
function blocks(x0: number, y: number, u: number, hb: number, atp: number, gap: number, nadph: number, short: boolean): string {
  const out: string[] = [];
  for (let i = 0; i < Math.ceil(atp - 1e-9); i++) {
    const w = Math.min(1, atp - i) * u;
    out.push(`<rect class="fs11-atp" x="${f(x0 + i * u + 2)}" y="${f(y)}" width="${f(w - 4)}" height="${hb}" rx="6"/>`);
    if (w > u * 0.7) out.push(T(x0 + i * u + w / 2, y + hb / 2 + 7, 'ATP', 'fs11-blk', 'middle'));
  }
  if (short) out.push(`<rect class="fs11-gap" x="${f(x0 + atp * u + 2)}" y="${f(y)}" width="${f((3 - atp) * u - 4)}" height="${hb}" rx="6"/>`);
  const n0 = x0 + 3 * u + gap;
  for (let i = 0; i < nadph; i++) out.push(`<rect class="fs11-nadph" x="${f(n0 + i * u + 2)}" y="${f(y)}" width="${f(u - 4)}" height="${hb}" rx="6"/>${T(n0 + i * u + u / 2, y + hb / 2 + 7, 'NADPH', 'fs11-blk', 'middle')}`);
  return out.join('');
}

/** The budget in the box x…x+w from y: what the Calvin–Benson cycle needs per CO₂ against what linear flow supplies per O₂. */
function budget(x: number, y: number, w: number, compact: boolean): string {
  const u = compact ? (w - 30) / 5.3 : (w - 160) / 5.3, hb = compact ? 40 : 52, gap = u * 0.3, x0 = compact ? x : x + 20;
  const r1 = y + (compact ? 30 : 40), r2 = r1 + (compact ? 128 : 170), xr = x0 + 5 * u + gap + 18;
  const atpEnd = x0 + (12 / 4.67) * u, need = x0 + 3 * u;
  const ratio = (yy: number, s: string): string => compact ? '' : `${T(xr, yy + hb / 2 - 2, s, 'fs11-ratio')}${T(xr, yy + hb / 2 + 20, 'ATP per NADPH', 'fs11-small')}`;
  return `${T(x0, r1 - 14, 'Calvin–Benson cycle needs, per CO₂', 'fs11-h')}
    ${blocks(x0, r1, u, hb, 3, gap, 2, false)}${ratio(r1, '1.5')}
    ${T(x0, r2 - (compact ? 40 : 46), 'linear electron flow supplies, per O₂ (4 e⁻)', 'fs11-h')}
    ${T(x0, r2 - (compact ? 16 : 18), compact ? '12 H⁺ ÷ 4.67 = 2.57 ATP' : '12 H⁺ ÷ 4.67 H⁺ per ATP = 2.57 ATP', 'fs11-l')}${T(x0 + 3 * u + gap, r2 - (compact ? 16 : 18), '4 e⁻ → 2 NADPH', 'fs11-l')}
    ${blocks(x0, r2, u, hb, 12 / 4.67, gap, 2, true)}${ratio(r2, '1.28')}
    <path class="fs11-guide" d="M${f(need)},${f(r1 + hb + 4)} V${f(r1 + hb + 14)} M${f(need)},${f(r2 - 6)} V${f(r2 + hb + 6)}"/>
    ${T((atpEnd + need) / 2, r2 + hb + 26, '−0.43 ATP', 'fs11-red', 'middle')}`;
}

/* ---------- a · ATP : NADPH supply and demand ---------- */

function drawA(): string {
  return realSvg('Unit blocks. The Calvin–Benson cycle needs 3 ATP and 2 NADPH per CO2 fixed, 1.5 ATP per NADPH. Linear electron flow supplies, per O2 and 4 electrons, 12 protons, which at 4.67 protons per ATP make 2.57 ATP, and 2 NADPH: 1.28 ATP per NADPH, 0.43 ATP short per CO2. Cyclic electron flow around photosystem I moves protons without making NADPH and so adds ATP only.', `
    ${budget(30, 40, 760, false)}
    ${pill(400, 470, 'cyclic electron flow around PSI: H⁺ → ATP, no NADPH', undefined, true)}
    ${pill(400, 512, 'two routes: PGR5–PGRL1 and NDH complex', undefined, true)}
    ${credit(790, 594, CR.budget)}
  `);
}

/* ---------- b · Linear and cyclic electron flow (Shevela et al. 2023, Fig. 1) ---------- */

const SHEV: Img = { href: shevPng, w: 900, h: 560 };
// Asset pixels (Fig. 1, original x 500–1400, y 50–610): the paper's labels CET (150–182, 163–182), LET, Q-cycle and e⁻ carrier stay
// as printed; the grey e⁻ carrier sits at (256, 262). The hole hides the organism icons and their names (y < 70, x < 505). The
// original's "Stroma or cytoplasm" (y 236–287) and "Lumen" (y 380–396) are cut at the right edge (x > 846): covered by our pills.
function shevela(id: string, x: number, y: number, w: number, win: [number, number, number, number] = [0, 0, 900, 560]): { svg: string; at: (u: number, v: number) => Pt } {
  const a = shot(id, SHEV, x, y, w, { fig: true, win, hole: [0, 0, 505, 70] });
  const cov = (v0: number, v1: number, t: string): string => {
    if (v1 < win[1] || v0 > win[1] + win[3]) return '';
    const [x0, y0] = a.at(842, v0), [x1, y1] = a.at(900, v1), cx = Math.min(x1 - 34, x0 + 30);
    return `<rect class="fs11-pagebg" x="${f(x0)}" y="${f(y0)}" width="${f(x1 - x0)}" height="${f(y1 - y0)}"/>${pill(cx, (y0 + y1) / 2, t, undefined, true, true)}`;
  };
  return { svg: `${a.svg}${cov(230, 292, 'stroma')}${cov(374, 402, 'lumen')}`, at: a.at };
}
/** The key to the paper's abbreviations. */
const key = (x: number, y: number): string => `${pill(x, y, 'CET = cyclic electron flow', undefined, true)}${pill(x, y + 36, 'LET = linear electron flow', undefined, true)}`;
function drawB(): string {
  const a = shevela('fs11b-a', 20, 6, 760);
  return realSvg('The thylakoid membrane with cytochrome b6f, photosystem I and ATP synthase. In linear electron flow, LET, electrons from photosystem I go through ferredoxin and FNR to NADPH. In cyclic electron flow, CET, they return from photosystem I through an electron carrier to plastoquinone and cytochrome b6f, where the Q cycle pumps protons into the lumen; no NADPH is made. Protons return through ATP synthase, making ATP; ATP and NADPH both feed the Calvin–Benson–Bassham cycle.', `
    ${a.svg}
    ${key(180, 512)}
    ${pill(560, 512, 'e⁻ carrier = PGR5 or NDH route', undefined, true)}
    ${pill(560, 548, 'CET: H⁺ pumped, no NADPH', undefined, true)}
    ${credit(790, 594, CR.shev)}
  `);
}

/* ---------- c · State transitions: maize PSI–LHCI–LHCII (Pan et al. 2018, Fig. 1B) ---------- */

const PAN: Img = { href: panJpg, w: 660, h: 375 };
// Asset pixels (Fig. 1B): Stroma (52, 100), Lumen (52, 223), LHCII bracket label (520, 330), LHCII trimer (520, 185), PsaO (400, 270).
function drawC(): string {
  const a = shot('fs11c-a', PAN, 20, 70, 760, { fig: true });
  return realSvg('Side view of the maize photosystem I supercomplex in the membrane, stroma above and lumen below: the photosystem I core with its LHCI antenna on the left and, on the right, one LHCII trimer bound next to the subunit PsaO. In state 2 the kinase STN7 phosphorylates LHCII, which moves from photosystem II to photosystem I.', `
    ${a.svg}
    ${pill(560, 44, 'LHCII (from PSII)', a.at(530, 170), true)}
    ${pill(400, 530, 'PSII receives more light than PSI → LHCII moves to PSI', undefined, true)}${pill(400, 566, 'LHCII is phosphorylated by the STN7 kinase', undefined, true, true)}
    ${credit(790, 594, CR.pan)}
  `);
}

/* ---------- d · the budget above the cyclic route ---------- */

function drawD(): string {
  const a = shevela('fs11d-a', 20, 288, 760, [0, 150, 900, 343]);
  return realSvg('Top: unit blocks. The Calvin–Benson cycle needs 3 ATP and 2 NADPH per CO2; linear electron flow supplies 2.57 ATP and 2 NADPH per O2, 0.43 ATP short. Bottom: the thylakoid membrane with cytochrome b6f, photosystem I and ATP synthase: in cyclic electron flow, CET, electrons return from photosystem I to plastoquinone and cytochrome b6f, pumping protons without making NADPH.', `
    ${budget(20, 0, 520, true)}
    ${a.svg}
    ${pill(676, 56, 'CET = cyclic electron flow', undefined, true)}${pill(676, 94, 'H⁺ → ATP, no NADPH', undefined, true)}
    ${pill(676, 132, 'LET = linear electron flow', undefined, true)}
    ${pill(676, 170, 'e⁻ carrier = PGR5 or NDH', undefined, true)}
    ${credit(14, 270, CR.budget, 'start')}${credit(790, 270, CR.shev)}
  `);
}

/* ---------- e · Mutants without cyclic flow (Munekage et al. 2004, Fig. 2) ---------- */

const PLANTS: Img = { href: plantsJpg, w: 543, h: 410 };
function legend(x: number, y: number, tint = false): string {
  return `${pill(x, y, `${it('pgr5')}: no PGR5 route`, undefined, tint)}${pill(x, y + 36, `${it('crr')}: no NDH route`, undefined, tint)}${pill(x, y + 72, `${it('crr pgr5')}: neither route`, undefined, tint)}`;
}
function drawE(): string {
  const a = shot('fs11e-a', PLANTS, 30, 8, 740, { credit: CR.plants });
  return realSvg('Arabidopsis plants of the same age in one pot, seen from above: wild type, pgr5, which lacks the PGR5 route of cyclic electron flow, three crr mutants, which lack the NDH route, and the three double mutants crr pgr5, which lack both routes and stay very small and pale.', `
    ${a.svg}${legend(150, 44)}
  `);
}

/* ---------- f · growth and electron transport of the same mutants (Munekage et al. 2004, Figs 2 and 1e) ---------- */

const ETR: Img = { href: etrJpg, w: 214, h: 183 };
// Asset pixels of Fig. 1e's plot area (axes at x 1.5, y 181.5): x = 1.5 + 0.3445 · light (µmol m⁻² s⁻¹), y = 180.5 − 1.375 · ETR (%).
function drawF(): string {
  const a = shot('fs11f-a', PLANTS, 14, 30, 404, { credit: 'Munekage et al. 2004, Fig. 2 · © Springer Nature' });
  const e = shot('fs11f-e', ETR, 490, 50, 296, { fig: true });
  const P = (l: number, r: number): Pt => e.at(1.5 + 0.3445 * l, 180.5 - 1.375 * r);
  const bottom = e.at(0, 182)[1], left = e.at(1.5, 0)[0];
  const ticks = [0, 200, 400, 600].map(l => T(P(l, 0)[0], bottom + 22, `${l}`, 'fs11-ax', 'middle')).join('')
    + [0, 50, 100].map(r => T(left - 8, P(0, r)[1] + 6, `${r}`, 'fs11-ax', 'end')).join('');
  return realSvg('Left: the Arabidopsis mutants in one pot: the double mutants crr pgr5, lacking both routes of cyclic electron flow, stay very small. Right: relative electron transport rate against light intensity: wild type and the crr mutants reach about 100 percent; pgr5 about 60 percent and falls in strong light; the double mutants stay near 20 to 35 percent.', `
    ${a.svg}${e.svg}${ticks}
    ${T((left + e.at(214, 0)[0]) / 2, bottom + 48, 'light (µmol photons m⁻² s⁻¹)', 'fs11-axt', 'middle')}
    <text class="fs11-axt" transform="translate(${f(left - 42)} ${f((e.at(0, 0)[1] + bottom) / 2)}) rotate(-90)" text-anchor="middle">relative ETR (%)</text>
    ${pill(...P(330, 112), `WT, ${it('crr')}`, undefined, true, true)}${pill(...P(470, 76), it('pgr5'), undefined, true, true)}${pill(...P(470, 36), it('crr pgr5'), undefined, true, true)}
    ${legend(216, 400, true)}
    ${credit(790, 384, 'Munekage et al. 2004, Fig. 1e · © Springer Nature')}
  `);
}

/* ---------- g · cyclic electron flow (Shevela 2023) beside state transitions (Pan 2018) ---------- */

function drawG(): string {
  const a = shevela('fs11g-a', 14, 50, 772, [0, 150, 900, 343]);
  const b = shot('fs11g-b', PAN, 400, 372, 390, { fig: true });
  return realSvg('Top: linear and cyclic electron flow: in cyclic flow, CET, electrons return from photosystem I through an electron carrier to plastoquinone and cytochrome b6f, pumping protons without making NADPH. Bottom right: the maize photosystem I supercomplex with an LHCII trimer bound, the arrangement after LHCII moves from photosystem II to photosystem I.', `
    ${a.svg}${b.svg}
    ${pill(200, 24, 'CET = cyclic electron flow: ATP, no NADPH', undefined, true)}${pill(600, 24, 'LET = linear electron flow', undefined, true)}
    ${pill(190, 440, 'state transition:', undefined, true)}${pill(190, 476, 'LHCII moves from PSII to PSI', undefined, true)}
    ${credit(14, 566, 'Shevela et al. 2023, Fig. 1 · CC BY 4.0', 'start')}${credit(14, 586, 'Pan et al. 2018, Science, Fig. 1B · © AAAS', 'start')}
  `);
}

/* ---------- h · pgr5: proton motive force vs stromal ATP (Degen et al. 2026, Fig. 2d) ---------- */

const DEG: Img = { href: degenPng, w: 830, h: 586 };
// Asset pixels: plot frame x 60–819, bottom y 484; ratio 1.0 at y 224 (0 at 462, 1.5 at 105); light bar x 95–785, y 35–58.
function drawH(): string {
  const a = shot('fs11h-a', DEG, 66, 20, 714, { fig: true });
  const [l1, y1] = a.at(95, 224), [r1] = a.at(785, 224);
  return realSvg('Ratio of the pgr5 mutant to wild type in Arabidopsis leaves over 15 minutes of stepwise increasing light: the proton motive force falls to about 0.6 to 0.8 of wild type, while the stromal MgATP level stays at or above wild type.', `
    ${a.svg}
    <path class="fs11-one" d="M${f(l1)},${f(y1)} H${f(r1)}"/>
    <text class="fs11-axt" transform="translate(30 ${f(a.at(0, 284)[1])}) rotate(-90)" text-anchor="middle">${it('pgr5')} / wild type</text>
    ${pill(440, a.at(0, 47)[1] - 30, 'light: ≈ 50 → 390 µmol photons m⁻² s⁻¹', a.at(440, 40), true)}
    ${pill(...a.at(600, 382), `pmf: 0.6–0.8 × wild type`, undefined, true)}${pill(...a.at(600, 424), 'stromal MgATP²⁻: ≥ wild type', undefined, true)}${pill(...a.at(600, 340), '– – –  ratio 1 = wild type', undefined, true, true)}
    ${credit(790, 594, CR.degen)}
  `);
}

const DRAW: Record<string, () => string> = { a: drawA, b: drawB, c: drawC, d: drawD, e: drawE, f: drawF, g: drawG, h: drawH };

export function draw(id: string): string {
  return (DRAW[id] ?? drawA)();
}
