// Slide L13 · Too much excitation: protect the system. Draft context; see research/figure-briefs/LECTURE_OVERVIEW.md.
// Facts used, all CONFIRMED in research/review-2026-10-23-claude/C_L12-L15.md and REVIEW_SUMMARY.md:
// lumen pH ≈ 7.5 in weak light, ≈ 6 (± 0.5) in strong light (Takizawa et al. 2007); low pH protonates PsbS and activates VDE (V → A → Z);
// qE acts in seconds to minutes, zeaxanthin (qZ) is slower and is removed slowly (ZEP), qI lasts hours;
// acidification also slows b₆f, protecting PSI; most quenching sits in LHCII; D1 damage is proportional to light
// from 6.5 to 1500 µmol m⁻² s⁻¹ (repair blocked with lincomycin), repair (FtsH removal, new D1) runs continuously,
// photoinhibition = damage outpacing repair, ROS act mainly by slowing repair; VPZ field results as in §5a.
// Not used: the 4.6 % / 6 % efficiency ceiling (it does not belong to this causal chain), VDE's ascorbate need (unverified).
import type { PlateText, Variant } from '../types';
import { text, wave, rcDot } from '../mechanisms';
import { bilayer, bolt, illusHeads, tag } from '../illus';
import './l13.css';

export const PLATE: PlateText = {
  n: '13',
  title: 'Too much light: dissipation and repair',
  status: 'draft',
  lead: 'In excess light, an acidic lumen switches the antenna to dissipate energy as heat. Damage still happens; repair never stops.',
  points: [
    { claim: 'An acidic lumen triggers quenching.', text: 'The protein PsbS senses the low pH and switches the antenna to dissipate heat (NPQ); the carotenoid zeaxanthin strengthens it.' },
    { claim: 'Fast on, slow off.', text: 'In shade the fast part relaxes in a minute, the zeaxanthin part in 10–15 min; a model puts the cost at 13–32 % of canopy CO₂ uptake.' },
    { claim: 'Repair runs all the time.', text: 'PSII’s D1 protein is damaged at any light; photoinhibition means damage outpaces repair.' },
  ],
  refs: [
    { label: 'van Amerongen & Croce 2025', url: 'https://doi.org/10.1093/plcell/koaf240' },
    { label: 'Tyystjärvi & Aro 1996', url: 'https://doi.org/10.1073/pnas.93.5.2213' },
    { label: 'Komenda et al. 2024', url: 'https://doi.org/10.1093/plcell/koae082' },
    { label: 'Kromdijk et al. 2016', url: 'https://doi.org/10.1126/science.aai8878' },
    { label: 'Nilkens et al. 2010', url: 'https://doi.org/10.1016/j.bbabio.2010.01.001' },
    { label: 'Zhu et al. 2004', url: 'https://doi.org/10.1093/jxb/erh141' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Acid switch' },
  { id: 'b', name: 'Thesis inset' },
  { id: 'c', name: 'Sun–shade lag', anim: true },
  { id: 'd', name: 'Mill bypass' },
  { id: 'e', name: 'Damage ∝ light' },
  { id: 'f', name: 'D1 repair', anim: true },
  { id: 'g', name: 'Shade vs sun' },
  { id: 'h', name: 'Zoom in' },
  { id: 'i', name: '1962 → field', anim: true },
  { id: 'j', name: 'Icons' },
];

export function draw(id: string): string {
  switch (id) {
    case 'b': return thesisSvg();
    case 'c': return lagSvg();
    case 'd': return millSvg();
    case 'e': return damageSvg();
    case 'f': return repairSvg();
    case 'g': return shadeSunSvg();
    case 'h': return zoomSvg();
    case 'i': return storySvg();
    case 'j': return iconsSvg();
    default: return chainSvg();
  }
}

/* ---------- shared parts ---------- */

type A = 'start' | 'middle' | 'end';
type K = 'ink' | 'green' | 'grey' | 'clay' | 'amber' | 'blue' | 'orange' | 'red';
const KS: K[] = ['ink', 'green', 'grey', 'clay', 'amber', 'blue', 'orange', 'red'];
const f = (v: number): string => v.toFixed(1);
const T = (x: number, y: number, s: string, cls = 'fl13-l', a: A = 'middle'): string => text(x, y, s, cls, a);

const svg = (label: string, body: string): string =>
  `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="${label}">${body}</svg>`;

/** Shared arrowheads, the amber bolt head, per-ink heads and the excitation glow, all prefixed. */
const defs = (p: string): string => `${illusHeads(p)}<defs>${KS.map(k =>
  `<marker id="${p}-k${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path class="fl13-hd-${k}" d="M0,0L10,5L0,10z"/></marker>`).join('')}
  <radialGradient id="${p}-glow"><stop offset="0" class="fl13-g0"/><stop offset=".45" class="fl13-g1"/><stop offset="1" class="fl13-g2"/></radialGradient></defs>`;

const ar = (p: string, k: K, d: string, cls = ''): string =>
  `<path class="fl13-ar fl13-k-${k}${cls ? ` ${cls}` : ''}" d="${d}" marker-end="url(#${p}-k${k})"/>`;

/** Heat: a grey wavy arrow. */
const heat = (p: string, x0: number, y0: number, x1: number, y1: number, amp = 5, n = 4): string =>
  `<path class="fl13-heat" d="${wave(x0, y0, x1, y1, amp, n)}" marker-end="url(#${p}-kgrey)"/>`;

/** Excitation energy: amber glow with a bright core. */
const glow = (p: string, x: number, y: number, r = 20): string =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${p}-glow)"/><circle class="fl13-exc" cx="${x}" cy="${y}" r="${Math.max(4, r * 0.28).toFixed(1)}"/>`;

const num = (x: number, y: number, n: string): string =>
  `<circle class="fl13-num" cx="${x}" cy="${y}" r="14"/>${T(x, y + 6, n, 'fl13-nt')}`;

const H = (x: number, y: number): string => tag(x, y, '', 'h');

/** PsbS: a yellow lumen-side protein, optionally carrying protons. */
function psbs(x: number, y: number, rx = 44, ry = 21, rot = 0, protons: [number, number][] = []): string {
  return `<g transform="rotate(${rot} ${x} ${y})"><ellipse class="fl13-psbs" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>${T(x, y + 7, 'PsbS', 'fl13-in')}</g>${protons.map(([a, b]) => H(a, b)).join('')}`;
}

/** A xanthophyll: polyene zigzag between two rings; epoxide O balls on the rings (V two, A one, Z none). */
function xan(x: number, y: number, len: number, kind: 'v' | 'a' | 'z', r = 9): string {
  const hex = (cx: number): string =>
    `<path class="fl13-ring-${kind}" d="${Array.from({ length: 6 }, (_, i) => `${i ? 'L' : 'M'}${f(cx + r * Math.cos((Math.PI / 3) * i + Math.PI / 6))},${f(y + r * Math.sin((Math.PI / 3) * i + Math.PI / 6))}`).join('')}Z"/>`;
  const a = x + r, b = x + len - r, n = Math.max(4, Math.round((b - a) / 9));
  const zz = Array.from({ length: n + 1 }, (_, i) => `${i ? 'L' : 'M'}${f(a + ((b - a) * i) / n)},${y + (i % 2 ? -5 : 5)}`).join('');
  const ox = (cx: number, s: number): string => `<circle class="fl13-epox" cx="${f(cx + s * r * 0.2)}" cy="${f(y - r - 4)}" r="5"/>`;
  const ep = kind === 'v' ? ox(x, -1) + ox(x + len, 1) : kind === 'a' ? ox(x + len, 1) : '';
  return `<path class="fl13-x-${kind}" d="${zz}"/>${hex(x)}${hex(x + len)}${ep}`;
}

/** Antenna (LHCII) and PSII core side by side, the thesis "PSII & antenna" pair. */
const lhc = (x: number, y: number, w: number, h: number, rx = 40): string =>
  `<rect class="fl13-lhc" x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/>`;
const core = (x: number, y: number, w: number, h: number, rx = 34): string =>
  `<rect class="blob-ps" x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/>`;

/** A polyline through points. */
const poly = (pts: [number, number][]): string => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)},${f(y)}`).join('');

/* ---------- A · acid switch: the causal chain on the membrane ---------- */

function chainSvg(): string {
  const p = 'fl13a';
  return svg('Thylakoid membrane in excess light: protons accumulate in the lumen, PsbS binds protons and VDE makes zeaxanthin, and the antenna sheds the excess as heat', `
    ${defs(p)}
    ${bilayer(p, 14, 786, 236, 316)}
    ${T(786, 226, 'stroma', 'fl13-m', 'end')}${T(786, 350, 'lumen', 'fl13-m', 'end')}
    ${lhc(52, 190, 200, 172, 44)}
    ${T(152, 228, 'antenna', 'fl13-h')}${T(152, 254, 'LHCII', 'fl13-l')}
    ${xan(96, 296, 112, 'z')}${T(160, 336, 'zeaxanthin', 'fl13-in fl13-c-orange')}
    ${core(262, 184, 132, 184)}${T(328, 258, 'PSII', 'fl13-h')}
    <ellipse class="blob-b6f" cx="520" cy="276" rx="40" ry="92"/>${T(520, 284, 'b₆f', 'fl13-h')}
    ${psbs(258, 362, 46, 21, 0)}
    ${H(226, 398)}${H(262, 404)}${H(298, 396)}
    <ellipse class="fl13-enz" cx="86" cy="402" rx="38" ry="20"/>${T(86, 409, 'VDE', 'fl13-in')}
    ${ar(p, 'ink', 'M86,382 L94,318', 'fl13-thin')}

    ${'' /* electron flow and proton release */}
    ${ar(p, 'ink', 'M396,262 L474,262')}${T(436, 226, 'e⁻', 'sm lab-b')}
    ${ar(p, 'red', 'M352,372 L364,412', 'fl13-hpath')}${ar(p, 'red', 'M520,370 L520,408', 'fl13-hpath')}
    ${H(392, 436)}${H(440, 470)}${H(476, 430)}${H(530, 462)}${H(574, 428)}${H(620, 460)}${H(664, 426)}${H(708, 458)}${H(356, 476)}
    ${ar(p, 'blue', 'M378,450 L318,408', 'fl13-thin')}

    ${'' /* ① light */}
    ${bolt(p, 380, 64, 238, 188)}${bolt(p, 440, 64, 300, 182)}${bolt(p, 500, 64, 356, 182)}
    ${num(596, 54, '1')}${T(618, 62, 'excess light', 'fl13-h', 'start')}

    ${'' /* ④ heat */}
    ${heat(p, 76, 186, 40, 100)}${heat(p, 116, 186, 96, 96)}${heat(p, 156, 186, 152, 96)}
    ${num(38, 54, '4')}${T(60, 62, 'excess → heat (NPQ)', 'fl13-h', 'start')}

    ${'' /* ③ switch */}
    ${num(38, 470, '3')}${T(60, 478, 'PsbS binds H⁺', 'fl13-h', 'start')}
    ${T(60, 506, 'VDE: violaxanthin', 'fl13-l', 'start')}${T(60, 532, '→ zeaxanthin', 'fl13-l', 'start')}

    ${'' /* ② protons */}
    ${num(420, 524, '2')}${T(442, 532, 'H⁺ accumulate in the lumen', 'fl13-h', 'start')}
    ${T(442, 560, 'pH ≈ 7.5 → ≈ 6', 'fl13-l', 'start')}
  `);
}

/* ---------- B · thesis inset: three antenna states ---------- */

function thesisSvg(): string {
  const p = 'fl13b';
  const xs = [26, 316, 606], w = 168, y0 = 196, h = 150;
  /** Antenna (light green) with the PSII core (green) on its right; stroma above, lumen below. */
  const blob = (x: number, sub: string, pig: 'v' | 'z'): string =>
    `${lhc(x, y0, w, h, 36)}${core(x + 100, y0 + 16, 54, h - 32, 20)}${x === xs[0] ? T(x + 50, y0 + 112, 'PSII &', 'fl13-in') + T(x + 50, y0 + 136, 'antenna', 'fl13-in') : ''}
     ${xan(x + 12, y0 + 82, 62, pig, 7)}${T(x + 88, y0 + 88, pig.toUpperCase(), `fl13-in ${pig === 'z' ? 'fl13-c-orange' : 'fl13-c-amber'}`)}
     ${T(x + w / 2, y0 + h + 76, sub, 'fl13-h')}`;
  const bolts = xs.map(x => bolt(p, x + 116, 124, x + 128, y0 + 10)).join('');
  return svg('After the MSc thesis inset: PSII and its light-harvesting antenna; protons from an acid lumen bind PsbS; the xanthophyll cycle makes zeaxanthin and the antenna dissipates heat. Below, the cycle between violaxanthin, antheraxanthin and zeaxanthin: VDE forward at low pH, ZEP back slowly', `
    ${defs(p)}<g transform="translate(0 -22)">
    <rect class="fl13-frame" x="12" y="108" width="776" height="366" rx="20"/>
    ${T(24, 92, 'lumen pH ≈ 7.5', 'fl13-l fl13-c-blue', 'start')}${T(776, 92, 'lumen pH ≈ 6', 'fl13-l fl13-c-clay', 'end')}
    ${ar(p, 'ink', 'M200,84 L588,84', 'fl13-thin fl13-dot')}${T(394, 70, 'light rises, lumen acidifies', 'fl13-s')}
    ${bolts}

    ${blob(xs[0], 'harvesting', 'v')}
    ${glow(p, xs[0] + 40, y0 + 44, 16)}${ar(p, 'amber', `M${xs[0] + 60},${y0 + 44} L${xs[0] + 106},${y0 + 44}`, 'fl13-dot')}${rcDot(xs[0] + 127, y0 + 44)}
    ${psbs(xs[0] + 150, y0 + h + 2, 40, 19, -24)}

    ${ar(p, 'ink', `M${xs[0] + w + 10},${y0 + 75} L${xs[1] - 10},${y0 + 75}`)}
    ${T(xs[0] + w + 61, y0 + 56, 'low pH', 'fl13-s')}${T(xs[0] + w + 61, y0 + 104, 'H⁺ bind', 'fl13-s')}

    ${blob(xs[1], 'switched on', 'v')}
    ${glow(p, xs[1] + 40, y0 + 44, 16)}${ar(p, 'amber', `M${xs[1] + 60},${y0 + 44} L${xs[1] + 106},${y0 + 44}`, 'fl13-dot')}${rcDot(xs[1] + 127, y0 + 44)}
    ${psbs(xs[1] + 150, y0 + h + 2, 40, 19, -24, [[xs[1] + 112, y0 + h + 30], [xs[1] + 158, y0 + h + 36]])}

    ${ar(p, 'ink', `M${xs[1] + w + 10},${y0 + 75} L${xs[2] - 10},${y0 + 75}`)}
    ${T(xs[1] + w + 61, y0 + 56, 'xanthophyll', 'fl13-s')}${T(xs[1] + w + 61, y0 + 104, 'cycle', 'fl13-s')}

    ${blob(xs[2], 'dissipating heat', 'z')}
    ${glow(p, xs[2] + 40, y0 + 44, 16)}
    ${heat(p, xs[2] + 26, y0 + 30, xs[2] + 6, 128)}${heat(p, xs[2] + 54, y0 + 28, xs[2] + 58, 126)}
    ${psbs(xs[2] + 150, y0 + h + 2, 40, 19, -24, [[xs[2] + 112, y0 + h + 30], [xs[2] + 158, y0 + h + 36]])}
    ${T(xs[2] + 66, 140, 'heat', 'fl13-in fl13-c-grey', 'start')}

    ${xan(54, 522, 92, 'v', 9)}${T(100, 562, 'violaxanthin', 'fl13-l')}
    ${xan(354, 522, 92, 'a', 9)}${T(400, 562, 'antheraxanthin', 'fl13-l')}
    ${xan(654, 522, 92, 'z', 9)}${T(700, 562, 'zeaxanthin', 'fl13-l')}
    ${ar(p, 'clay', 'M176,510 L326,510')}${ar(p, 'clay', 'M476,510 L626,510')}
    ${ar(p, 'blue', 'M626,534 L476,534', 'fl13-dash')}${ar(p, 'blue', 'M326,534 L176,534', 'fl13-dash')}
    ${T(251, 498, 'VDE · low pH', 'fl13-s fl13-c-clay')}${T(551, 498, 'VDE · low pH', 'fl13-s fl13-c-clay')}
    ${T(400, 594, 'back by ZEP, slowly', 'fl13-s fl13-c-blue')}
  </g>`);
}

/* ---------- C · sun–shade lag: NPQ switches on fast and off slowly ---------- */

function lagSvg(): string {
  const p = 'fl13c';
  const x0 = 110, x1 = 770, yb = 496, yt = 222, t1 = 0.2, t2 = 0.52;
  const X = (t: number): number => x0 + t * (x1 - x0);
  const Y = (v: number): number => yb - v * (yb - yt);
  const AE = 0.62, AZ = 0.38, tE = 0.018, tZ = 0.11;
  const on = (s: number): [number, number] => [AE * (1 - Math.exp(-s / tE)), AZ * (1 - Math.exp(-s / tZ))];
  const npq = (t: number, zOff: number): number => {
    if (t < t1) return 0;
    if (t <= t2) { const [e, z] = on(t - t1); return e + z; }
    const [e, z] = on(t2 - t1), s = t - t2;
    return e * Math.exp(-s / tE) + z * Math.exp(-s / zOff);
  };
  const pts = (zOff: number, from = 0): [number, number][] => Array.from({ length: 241 }, (_, i) => from + (i / 240) * (1 - from)).map(t => [X(t), Y(npq(t, zOff))]);
  const slow = pts(0.3), fast = pts(0.05, t2);
  const tail = slow.filter(([x]) => x >= X(t2 + 0.03));
  const lag = `${poly(tail)} L${f(x1)},${yb} L${f(tail[0][0])},${yb}Z`;
  return svg('Schematic time course: in shade, then full sun, then shade again. Heat dissipation (NPQ) switches on within minutes and keeps building as zeaxanthin forms; back in shade it drops fast at first and then lingers, because zeaxanthin is removed slowly, so less CO₂ is fixed. A dashed curve shows the faster switch-off engineered in VPZ crops', `
    ${defs(p)}<g transform="translate(0 6)">
    <rect class="fl13-shade" x="${X(0)}" y="88" width="${X(t1) - X(0)}" height="18" rx="4"/>
    <rect class="fl13-sun" x="${X(t1)}" y="56" width="${X(t2) - X(t1)}" height="50" rx="4"/>
    <rect class="fl13-shade" x="${X(t2)}" y="88" width="${X(1) - X(t2)}" height="18" rx="4"/>
    ${T((X(0) + X(t1)) / 2, 76, 'shade', 'fl13-h')}${T((X(t1) + X(t2)) / 2, 88, 'full sun', 'fl13-h')}${T((X(t2) + X(1)) / 2, 76, 'shade again', 'fl13-h')}
    ${T(24, 102, 'light', 'fl13-ax', 'start')}
    <path class="fl13-rule" d="M${X(t1)},116 V${yb} M${X(t2)},116 V${yb}"/>

    <path class="fl13-lag" d="${lag}"/>
    <path class="fl13-axis" d="M${x0},${yt - 30} V${yb} H${x1}"/>
    <text class="fl13-ax" transform="translate(${x0 - 22} ${(yb + yt) / 2}) rotate(-90)" text-anchor="middle">heat dissipation (NPQ)</text>
    ${T(x0, yb + 34, 'time (minutes) · schematic', 'fl13-ax', 'start')}
    <rect class="fl13-lag" x="${X(0.58)}" y="${yb + 18}" width="22" height="20" rx="3"/>${T(X(0.58) + 30, yb + 34, 'less CO₂ fixed in the shade', 'fl13-in fl13-c-clay', 'start')}
    <path class="fl13-curve-vpz" d="${poly(fast)}"/>
    <path class="fl13-curve" d="${poly(slow)}"/>

    ${T(X(t1) + 30, Y(0.58), 'on within', 'fl13-l', 'start')}${T(X(t1) + 30, Y(0.58) + 26, 'minutes', 'fl13-l', 'start')}
    ${T(X(t1) + 12, Y(1.0) - 20, 'zeaxanthin builds up', 'fl13-s', 'start')}
    ${T(X(t2) + 24, Y(0.94), 'H⁺ leave: fast drop', 'fl13-l', 'start')}
    ${T(786, Y(0.62), 'zeaxanthin removed slowly:', 'fl13-l', 'end')}${T(786, Y(0.62) + 26, 'NPQ lingers', 'fl13-l', 'end')}
    ${ar(p, 'ink', `M${X(0.84)},${Y(0.5)} L${X(0.8)},${Y(0.2)}`, 'fl13-thin')}
    ${T(X(t2) - 14, Y(0.18), 'engineered:', 'fl13-in fl13-c-green', 'end')}${T(X(t2) - 14, Y(0.18) + 24, 'faster off', 'fl13-in fl13-c-green', 'end')}
    ${ar(p, 'green', `M${X(t2) - 8},${Y(0.13)} L${X(0.558)},${Y(0.13)}`, 'fl13-thin')}
  </g>`);
}

/* ---------- D · mill bypass: an analogy, mapped part by part ---------- */

function millSvg(): string {
  const p = 'fl13d';
  const wx = 530, wy = 292, wr = 78;
  const spokes = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6, c = Math.cos(a), s = Math.sin(a);
    const px = wx + c * (wr + 2), py = wy + s * (wr + 2);
    return `<path class="fl13-wood-o" d="M${f(wx + c * 18)},${f(wy + s * 18)} L${f(wx + c * wr)},${f(wy + s * wr)}"/>` +
      `<rect class="fl13-wood" x="${f(px - 15)}" y="${f(py - 5)}" width="30" height="10" transform="rotate(${(i * 30).toFixed(0)} ${f(px)} ${f(py)})"/>`;
  }).join('');
  return svg('Analogy: a water mill with a bypass gate. The stream is absorbed light, the wheel is photochemistry, the backed-up tailwater is protons accumulating in the lumen, drained through a narrow outlet (ATP synthase), the gate is PsbS with a zeaxanthin latch that is slow to close, the spillway is heat, and the paddles swapped all the time are D1 repair', `
    ${defs(p)}<g transform="translate(0 -18)">
    ${T(24, 70, 'stream', 'fl13-m', 'start')}${T(24, 98, 'absorbed light', 'fl13-h', 'start')}
    <rect class="fl13-water" x="24" y="130" width="440" height="36"/>
    <path class="fl13-streak" d="M60,148 h40 M150,142 h30 M250,150 h50 M360,144 h40 M430,152 h30"/>
    <path class="fl13-wall" d="M24,168 H130 M196,168 H464"/>
    ${ar(p, 'blue', 'M40,148 L110,148', 'fl13-thin')}

    <path class="fl13-water" d="M134,168 L192,168 L182,440 L138,440Z"/>
    <path class="fl13-streak" d="M150,190 V420 M166,200 V430 M178,186 V300"/>
    <path class="fl13-wood-o" d="M196,168 L174,212"/><rect class="fl13-latch" x="186" y="172" width="16" height="12" rx="3"/>
    <rect class="fl13-water" x="24" y="440" width="250" height="56"/><path class="fl13-wall" d="M24,436 V498 H274 V436"/>
    ${T(148, 534, 'spillway', 'fl13-m')}${T(148, 562, 'heat (NPQ)', 'fl13-h')}

    <path class="fl13-water" d="M464,130 Q492,140 490,226 L474,230 Q474,172 464,166Z"/>
    ${spokes}
    <circle class="fl13-wood-o" cx="${wx}" cy="${wy}" r="${wr}"/><circle class="fl13-wood" cx="${wx}" cy="${wy}" r="18"/>
    ${T(786, 72, 'wheel', 'fl13-m', 'end')}${T(786, 100, 'photochemistry', 'fl13-h', 'end')}

    <rect class="fl13-water" x="414" y="412" width="342" height="74"/>
    <path class="fl13-water-o" d="M414,412 Q470,404 530,412 T650,412 T756,412"/>
    <path class="fl13-wall" d="M410,400 V490 H760 V474 M760,462 V400"/>
    <rect class="fl13-water" x="760" y="464" width="28" height="8"/>
    ${T(586, 526, 'tailwater backs up', 'fl13-m')}${T(586, 554, 'H⁺ accumulate in the lumen', 'fl13-h')}
    ${T(786, 586, 'narrow outlet: ATP synthase', 'fl13-s', 'end')}

    ${ar(p, 'blue', 'M420,408 H226 V216 L204,192', 'fl13-dash')}
    ${T(236, 252, 'gate', 'fl13-m', 'start')}${T(236, 280, 'PsbS', 'fl13-h', 'start')}
    ${T(236, 312, 'zeaxanthin latch:', 'fl13-in fl13-c-orange', 'start')}${T(236, 336, 'slow to close', 'fl13-in fl13-c-orange', 'start')}

    <rect class="fl13-wood" x="690" y="188" width="84" height="12" rx="2"/><rect class="fl13-wood" x="694" y="206" width="84" height="12" rx="2"/><rect class="fl13-wood" x="686" y="224" width="84" height="12" rx="2"/>
    ${T(786, 270, 'spare paddles', 'fl13-m', 'end')}${T(786, 298, 'D1 repair', 'fl13-h', 'end')}${T(786, 322, 'always swapped', 'fl13-s', 'end')}
  </g>`);
}

/* ---------- E · evidence: damage is proportional to light ---------- */

function damageSvg(): string {
  const p = 'fl13e';
  const yb = 444, yt = 150, I = 1500;
  const panel = (x0: number, x1: number): { X: (i: number) => number; Y: (v: number) => number; axes: string } => {
    const X = (i: number): number => x0 + (i / I) * (x1 - x0);
    const Y = (v: number): number => yb - v * (yb - yt);
    const ticks = [0, 500, 1000, 1500].map(i => `<path class="fl13-axis" d="M${f(X(i))},${yb} V${yb + 8}"/>${T(X(i), yb + 32, `${i}`, 'fl13-ax')}`).join('');
    const axes = `<path class="fl13-axis" d="M${x0},${yt - 24} V${yb} H${x1 + 10}"/>${ticks}${T((x0 + x1) / 2, yb + 62, 'light (µmol m⁻² s⁻¹)', 'fl13-ax')}`;
    return { X, Y, axes };
  };
  const L = panel(90, 350), R = panel(480, 740);
  const dmg = (i: number): number => (i / I) * 0.9;
  const cap = 0.42, rep = (i: number): number => { const d = dmg(i); return (d + cap - Math.sqrt((d - cap) ** 2 + 0.002)) / 2; };
  const grid = Array.from({ length: 151 }, (_, k) => (k / 150) * I);
  const wedge = grid.filter(i => dmg(i) > rep(i) + 0.004);
  const wedgePath = `${poly(wedge.map(i => [R.X(i), R.Y(dmg(i))]))} ${poly([...wedge].reverse().map(i => [R.X(i), R.Y(rep(i))])).replace('M', 'L')}Z`;
  return svg('Evidence, schematic after Tyystjärvi and Aro 1996: with repair blocked by lincomycin, PSII damage rises in proportion to light from 6.5 to 1500 micromoles per square metre per second. With repair running, repair matches damage until it cannot; beyond that, damage outpaces repair and photoinhibition appears', `
    ${defs(p)}
    ${T(220, 60, 'repair blocked', 'fl13-h')}${T(220, 88, '(lincomycin)', 'fl13-l')}
    ${T(610, 60, 'repair running', 'fl13-h')}${T(610, 88, '(normal leaf)', 'fl13-l')}
    <text class="fl13-ax" transform="translate(56 ${(yb + yt) / 2}) rotate(-90)" text-anchor="middle">rate per PSII</text>
    ${L.axes}${R.axes}
    <path class="fl13-curve-dmg" d="M${f(L.X(6.5))},${f(L.Y(dmg(6.5)))} L${f(L.X(I))},${f(L.Y(dmg(I)))}"/>
    <circle class="fl13-down" cx="${f(L.X(6.5))}" cy="${f(L.Y(dmg(6.5)))}" r="6"/><circle class="fl13-down" cx="${f(L.X(I))}" cy="${f(L.Y(dmg(I)))}" r="6"/>
    ${T(L.X(460), 150, 'damage even in', 'fl13-in', 'start')}${T(L.X(460), 174, 'dim light (6.5)', 'fl13-in', 'start')}
    ${ar(p, 'ink', `M${f(L.X(440))},162 C${f(L.X(60))},180 ${f(L.X(30))},320 ${f(L.X(12))},${f(L.Y(0.03))}`, 'fl13-thin')}
    ${T(L.X(900), L.Y(0.3), 'damage rises', 'fl13-h fl13-c-clay', 'start')}${T(L.X(900), L.Y(0.3) + 26, 'with light', 'fl13-h fl13-c-clay', 'start')}

    <path class="fl13-loss" d="${wedgePath}"/>
    <path class="fl13-curve-dmg" d="M${f(R.X(0))},${f(R.Y(0))} L${f(R.X(I))},${f(R.Y(dmg(I)))}"/>
    <path class="fl13-curve-rep" d="${poly(grid.map(i => [R.X(i), R.Y(rep(i))]))}"/>
    ${T(R.X(1500), R.Y(dmg(I)) - 18, 'damage', 'fl13-h fl13-c-clay', 'end')}
    ${T(R.X(1500), R.Y(cap) + 34, 'repair', 'fl13-h fl13-c-green', 'end')}
    ${T(R.X(900), R.Y(0.86), 'net loss:', 'fl13-in fl13-c-clay', 'end')}${T(R.X(900), R.Y(0.86) + 24, 'photoinhibition', 'fl13-in fl13-c-clay', 'end')}
    ${ar(p, 'clay', `M${f(R.X(910))},${f(R.Y(0.8))} L${f(R.X(1230))},${f(R.Y(0.62))}`, 'fl13-thin')}
    ${T(R.X(330), R.Y(0.05), 'repair keeps pace', 'fl13-in fl13-c-green', 'start')}

    ${T(400, 566, 'schematic, after Tyystjärvi & Aro 1996', 'fl13-s')}
  `);
}

/* ---------- F · the D1 repair cycle ---------- */

function repairSvg(): string {
  const p = 'fl13f';
  const cx = 400, cy = 310, rx = 250, ry = 190;
  const at = (deg: number): [number, number] => [cx + rx * Math.cos((deg * Math.PI) / 180), cy + ry * Math.sin((deg * Math.PI) / 180)];
  const arc = (a: number, b: number, k: K = 'ink'): string => {
    const [xa, ya] = at(a), [xb, yb] = at(b);
    return ar(p, k, `M${f(xa)},${f(ya)} A${rx},${ry} 0 0 1 ${f(xb)},${f(yb)}`);
  };
  /** PSII drawn as a green body with its D1 subunit as a bar. */
  const ps = (x: number, y: number, d1: 'ok' | 'bad' | 'none' | 'new'): string => {
    const bar = d1 === 'ok' ? `<rect class="fl13-d1" x="${x - 34}" y="${y - 8}" width="68" height="16" rx="5"/>`
      : d1 === 'bad' ? `<rect class="fl13-d1-bad" x="${x - 34}" y="${y - 8}" width="68" height="16" rx="5"/><path class="fl13-crack" d="M${x - 6},${y - 14} L${x + 4},${y - 2} L${x - 4},${y + 4} L${x + 6},${y + 16}"/>`
        : d1 === 'new' ? `<rect class="fl13-d1" x="${x - 34}" y="${y - 8}" width="68" height="16" rx="5" opacity=".55"/>`
          : `<rect class="fl13-d1-bad" x="${x - 34}" y="${y - 8}" width="68" height="16" rx="5" opacity=".35"/>`;
    return `<rect class="blob-ps" x="${x - 62}" y="${y - 40}" width="124" height="80" rx="26"/>${bar}${d1 !== 'none' ? T(x, y + 32, 'D1', 'fl13-in fl13-c-green') : ''}`;
  };
  const [tx, ty] = at(-90), [rxp, ryp] = at(0), [bx, by] = at(90), [lx, ly] = at(180);
  return svg('The PSII repair cycle: working PSII; light damages its D1 protein at any light level; the FtsH protease removes the damaged D1; a new D1 is made and inserted, and PSII works again', `
    ${defs(p)}<g transform="translate(-10 8)">
    ${arc(-62, -22, 'clay')}${arc(36, 66)}${arc(114, 142)}${arc(222, 250, 'green')}
    ${ps(tx, ty, 'ok')}${T(tx, ty - 56, 'working PSII', 'fl13-h')}
    ${ps(rxp - 10, ryp, 'bad')}${bolt(p, rxp + 64, ryp - 126, rxp + 26, ryp - 46)}
    ${T(rxp - 10, ryp + 68, 'light damages D1', 'fl13-h fl13-c-clay')}
    ${ps(bx - 30, by - 20, 'none')}
    <path class="fl13-ftsh" d="M${bx + 52},${by - 44} a26,26 0 1 1 0,48 l-18,-24Z"/>
    <rect class="fl13-d1-bad" x="${bx + 74}" y="${by - 30}" width="16" height="16" rx="3"/><rect class="fl13-d1-bad" x="${bx + 98}" y="${by - 18}" width="12" height="12" rx="3"/>
    ${T(bx + 66, by - 56, 'FtsH', 'fl13-in')}
    ${T(bx, by + 50, 'damaged D1 removed', 'fl13-h')}
    ${ps(lx + 10, ly, 'new')}
    <rect class="fl13-d1" x="${lx - 24}" y="${ly - 92}" width="68" height="16" rx="5"/>${ar(p, 'green', `M${lx + 10},${ly - 72} L${lx + 10},${ly - 14}`, 'fl13-thin')}
    ${T(lx + 10, ly + 68, 'new D1 made', 'fl13-h fl13-c-green')}${T(lx + 10, ly + 94, 'and inserted', 'fl13-l')}

    ${T(cx, cy - 4, 'D1 repair', 'fl13-hb')}${T(cx, cy + 26, 'cycle', 'fl13-hb')}
  </g>`);
}

/* ---------- G · weak light vs strong light, side by side ---------- */

function shadeSunSvg(): string {
  const p = 'fl13g';
  const col = (ox: number, strong: boolean): string => {
    const hs: [number, number][] = strong
      ? [[ox + 60, 360], [ox + 112, 396], [ox + 180, 412], [ox + 246, 392], [ox + 296, 358], [ox + 330, 404], [ox + 70, 424], [ox + 268, 432]]
      : [[ox + 120, 396], [ox + 286, 372]];
    const bolts = strong
      ? `${bolt(p, ox + 214, 64, ox + 140, 160)}${bolt(p, ox + 268, 64, ox + 196, 156)}${bolt(p, ox + 322, 64, ox + 258, 154)}`
      : bolt(p, ox + 214, 64, ox + 150, 160);
    const fate = strong
      ? `${glow(p, ox + 88, 226, 18)}${ar(p, 'amber', `M${ox + 108},226 L${ox + 196},226`, 'fl13-dot')}${heat(p, ox + 70, 170, ox + 30, 92)}${heat(p, ox + 96, 168, ox + 84, 88)}`
      : `${glow(p, ox + 88, 226, 18)}${ar(p, 'amber', `M${ox + 108},226 L${ox + 196},226`, 'fl13-dot')}`;
    return `
      <rect class="${strong ? 'fl13-lumen-acid' : 'fl13-lumen'}" x="${ox + 8}" y="316" width="356" height="136" rx="10"/>
      ${bilayer(`${p}${strong ? 's' : 'w'}`, ox + 8, ox + 364, 200, 276)}
      ${lhc(ox + 28, 166, 158, 140, 38)}${T(ox + 82, 200, 'antenna', 'fl13-in')}
      ${core(ox + 196, 160, 116, 152, 30)}${T(ox + 254, 196, 'PSII', 'fl13-in')}${rcDot(ox + 228, 226)}
      ${xan(ox + 48, 268, 86, strong ? 'z' : 'v', 8)}
      ${psbs(ox + 190, 312, 40, 19, 0, strong ? [[ox + 158, 342], [ox + 222, 344]] : [])}
      ${hs.map(([x, y]) => H(x, y)).join('')}
      ${bolts}${fate}
      ${T(ox + 186, 494, strong ? 'lumen pH ≈ 6' : 'lumen pH ≈ 7.5', `fl13-h ${strong ? 'fl13-c-clay' : 'fl13-c-blue'}`)}
      ${T(ox + 186, 522, strong ? 'zeaxanthin' : 'violaxanthin', `fl13-l ${strong ? 'fl13-c-orange' : 'fl13-c-amber'}`)}
      ${T(ox + 186, 562, strong ? 'excess leaves as heat' : 'energy goes to PSII', 'fl13-h')}`;
  };
  return svg('The same membrane in weak and in strong light. Weak light: lumen pH about 7.5, PsbS without protons, violaxanthin, and the antenna passes its energy to PSII. Strong light: lumen pH about 6, PsbS carries protons, zeaxanthin, and the excess leaves as heat', `
    ${defs(p)}
    ${T(194, 40, 'weak light', 'fl13-hb')}${T(606, 40, 'strong light', 'fl13-hb')}
    <path class="fl13-rule" d="M400,30 V570"/>
    ${col(8, false)}${col(420, true)}
  `);
}

/* ---------- H · zoom from leaf to antenna ---------- */

function zoomSvg(): string {
  const p = 'fl13h';
  const L = [
    { x: 92, y: 132, r: 62 },
    { x: 240, y: 236, r: 76 },
    { x: 414, y: 320, r: 94 },
    { x: 642, y: 398, r: 140 },
  ];
  const clip = (i: number): string => `<clipPath id="${p}-c${i}"><circle cx="${L[i].x}" cy="${L[i].y}" r="${L[i].r - 1.5}"/></clipPath>`;
  const lens = (i: number, inner: string): string =>
    `<circle class="fl13-lens" cx="${L[i].x}" cy="${L[i].y}" r="${L[i].r}"/><g clip-path="url(#${p}-c${i})">${inner}</g><circle class="fl13-lens-o" cx="${L[i].x}" cy="${L[i].y}" r="${L[i].r}"/>`;
  const link = (i: number): string => {
    const a = L[i], b = L[i + 1], d = Math.hypot(b.x - a.x, b.y - a.y), ux = (b.x - a.x) / d, uy = (b.y - a.y) / d;
    return `<path class="fl13-zoom" d="M${f(a.x + ux * a.r)},${f(a.y + uy * a.r)} L${f(b.x - ux * b.r)},${f(b.y - uy * b.r)}"/>`;
  };
  const [c0, c1, c2, c3] = L;
  const leaf = `<path class="fl13-leaf" d="M${c0.x - 50},${c0.y + 36} Q${c0.x - 34},${c0.y - 36} ${c0.x + 46},${c0.y - 30} Q${c0.x + 36},${c0.y + 40} ${c0.x - 50},${c0.y + 36}Z"/>
    <path class="fl13-vein" d="M${c0.x - 48},${c0.y + 34} Q${c0.x},${c0.y} ${c0.x + 44},${c0.y - 28}"/>
    ${bolt(p, c0.x - 36, c0.y - 60, c0.x - 18, c0.y - 14)}${bolt(p, c0.x + 4, c0.y - 64, c0.x + 16, c0.y - 22)}`;
  const chl = `<ellipse class="fl13-chl" cx="${c1.x}" cy="${c1.y}" rx="62" ry="38"/>
    ${[[-30, -10], [-2, 12], [26, -12], [42, 10], [-22, 18]].map(([dx, dy]) => `<rect class="fl13-granum" x="${c1.x + dx - 9}" y="${c1.y + dy - 8}" width="18" height="16" rx="3"/>`).join('')}`;
  const thy = `${bilayer(`${p}m`, c2.x - 96, c2.x + 96, c2.y - 22, c2.y + 14)}
    <rect class="fl13-lumen-acid" x="${c2.x - 96}" y="${c2.y + 14}" width="192" height="90"/>
    ${lhc(c2.x - 66, c2.y - 38, 62, 66, 18)}${core(c2.x, c2.y - 40, 50, 70, 16)}
    ${H(c2.x - 54, c2.y + 44)}${H(c2.x - 16, c2.y + 62)}${H(c2.x + 22, c2.y + 40)}${H(c2.x + 58, c2.y + 58)}`;
  const ant = `${[[c3.x - 52, c3.y - 4], [c3.x, c3.y - 36], [c3.x, c3.y + 30]].map(([x, y]) => `<circle class="fl13-lhc" cx="${x}" cy="${y}" r="38"/>`).join('')}
    ${xan(c3.x - 34, c3.y - 2, 66, 'z', 7)}
    ${psbs(c3.x + 62, c3.y + 48, 40, 19, -20, [[c3.x + 40, c3.y + 84], [c3.x + 90, c3.y + 82]])}
    ${heat(p, c3.x - 40, c3.y - 50, c3.x - 76, c3.y - 112)}${heat(p, c3.x + 2, c3.y - 80, c3.x + 2, c3.y - 128)}`;
  return svg('Zoom from a leaf in strong light, into a chloroplast, onto the thylakoid membrane with an acid lumen, and onto the main antenna LHCII, where PsbS and zeaxanthin switch it to dissipate heat; most quenching happens there', `
    ${defs(p)}<defs>${[0, 1, 2, 3].map(clip).join('')}</defs><g transform="translate(0 12)">
    ${link(0)}${link(1)}${link(2)}
    ${lens(0, leaf)}${lens(1, chl)}${lens(2, thy)}${lens(3, ant)}
    ${T(170, 66, 'leaf in strong light', 'fl13-h', 'start')}
    ${T(334, 172, 'chloroplast', 'fl13-h', 'start')}
    ${T(300, 450, 'thylakoid', 'fl13-h')}${T(300, 476, 'H⁺ accumulate in the lumen', 'fl13-l')}
    ${T(540, 140, 'antenna (LHCII)', 'fl13-h', 'start')}${T(540, 168, 'PsbS + zeaxanthin:', 'fl13-l', 'start')}${T(540, 194, 'excess → heat', 'fl13-l', 'start')}
  </g>`);
}

/* ---------- I · story: from the xanthophyll cycle to field trials ---------- */

function storySvg(): string {
  const p = 'fl13i';
  const then = [
    { x: 110, yr: '1962', who: 'Yamamoto', what: ['xanthophyll', 'cycle'] },
    { x: 300, yr: '1987', who: 'Demmig et al.', what: ['zeaxanthin', 'linked to protection'] },
    { x: 490, yr: '2000', who: 'Li et al.', what: ['PsbS', 'identified'] },
    { x: 680, yr: '2016', who: 'Kromdijk et al.', what: ['VPZ: faster', 'switch-off'] },
  ];
  const ty = 92;
  const rows: { yr: string; crop: string; mark: 'up' | 'flat' | 'down'; note: string }[] = [
    { yr: '2016', crop: 'tobacco', mark: 'up', note: '≈ +15 % biomass' },
    { yr: '2020', crop: 'Arabidopsis', mark: 'down', note: 'growth impaired' },
    { yr: '2022', crop: 'soybean', mark: 'up', note: 'year 1: up to +33 % seed' },
    { yr: '2022', crop: 'soybean', mark: 'flat', note: 'year 2: no gain' },
    { yr: '2022', crop: 'potato', mark: 'down', note: 'no gain; lower in fluctuating light' },
    { yr: '2026', crop: 'rice', mark: 'down', note: 'growth impaired' },
    { yr: '2026', crop: 'soybean', mark: 'flat', note: 'better light use, no seed gain' },
  ];
  const mk = (x: number, y: number, m: 'up' | 'flat' | 'down'): string =>
    m === 'up' ? `<path class="fl13-up" d="M${x},${y - 11} L${x + 11},${y + 8} L${x - 11},${y + 8}Z"/>`
      : m === 'down' ? `<path class="fl13-down" d="M${x},${y + 11} L${x + 11},${y - 8} L${x - 11},${y - 8}Z"/>`
        : `<circle class="fl13-flat" cx="${x}" cy="${y}" r="9"/>`;
  const r0 = 300, dy = 34;
  return svg('Story from discovery to field: 1962 the xanthophyll cycle, 1987 zeaxanthin linked to protection, 2000 PsbS identified, 2016 VPZ plants relax quenching faster. Results since then are mixed: gains in tobacco and in one soybean year, no gain or impaired growth in other crops and years', `
    ${defs(p)}<g transform="translate(0 10)">
    ${T(24, 34, 'then', 'fl13-m', 'start')}
    <path class="fl13-axis" d="M60,${ty} H760"/>
    ${then.map(s => `<circle class="fl13-num" cx="${s.x}" cy="${ty}" r="8"/>${T(s.x, ty - 20, s.yr, 'fl13-yr')}${T(s.x, ty + 34, s.who, 'fl13-s')}${T(s.x, ty + 62, s.what[0], 'fl13-in')}${T(s.x, ty + 86, s.what[1], 'fl13-in')}`).join('')}
    ${xan(54, 214, 60, 'v', 7)}${ar(p, 'clay', 'M124,214 L150,214', 'fl13-thin')}${xan(158, 214, 60, 'z', 7)}
    ${psbs(490, 222, 38, 18, 0)}
    ${T(680, 218, 'more VDE, PsbS, ZEP', 'fl13-s')}

    ${T(24, 268, 'now: tests in plants', 'fl13-m', 'start')}
    <path class="fl13-rule" d="M24,280 H776"/>
    ${rows.map((r, i) => {
      const y = r0 + 12 + i * dy;
      return `${T(40, y + 7, r.yr, 'fl13-in', 'start')}${T(110, y + 7, r.crop, 'fl13-in', 'start')}${mk(262, y, r.mark)}${T(290, y + 7, r.note, 'fl13-l', 'start')}`;
    }).join('')}
    <path class="fl13-rule" d="M24,${r0 + 7 * dy + 2} H776"/>
    ${mk(40, 558, 'up')}${T(58, 565, 'gain', 'fl13-s', 'start')}${mk(124, 558, 'flat')}${T(142, 565, 'no gain', 'fl13-s', 'start')}${mk(234, 558, 'down')}${T(252, 565, 'worse', 'fl13-s', 'start')}
    ${T(776, 565, '', 'fl13-in', 'end')}
  </g>`);
}

/* ---------- J · minimal icon summary ---------- */

function iconsSvg(): string {
  const p = 'fl13j';
  const cy = 170, xs = [100, 300, 500, 700];
  const box = (x: number, y: number): string => `<circle class="fl13-icon" cx="${x}" cy="${y}" r="62"/>`;
  const sun = (x: number, y: number): string =>
    `<circle class="fl13-sunfill" cx="${x}" cy="${y}" r="22"/>${Array.from({ length: 8 }, (_, i) => {
      const a = (i * Math.PI) / 4;
      return `<path class="fl13-ray" d="M${f(x + Math.cos(a) * 30)},${f(y + Math.sin(a) * 30)} L${f(x + Math.cos(a) * 42)},${f(y + Math.sin(a) * 42)}"/>`;
    }).join('')}`;
  const drop = (x: number, y: number): string =>
    `<path class="fl13-lumen-acid" style="stroke:#d97757;stroke-width:2" d="M${x},${y - 40} Q${x + 34},${y + 2} ${x + 22},${y + 22} A30,30 0 0 1 ${x - 22},${y + 22} Q${x - 34},${y + 2} ${x},${y - 40}Z"/>${H(x - 10, y + 6)}${H(x + 12, y + 18)}`;
  return svg('Icon summary: excess light, an acidic lumen, PsbS and zeaxanthin, heat. Below: heat dissipation over a shade–sun–shade time course; and the D1 damage and repair cycle', `
    ${defs(p)}<g transform="translate(0 -14)">
    ${box(xs[0], cy)}${sun(xs[0], cy)}
    ${box(xs[1], cy)}${drop(xs[1], cy)}
    ${box(xs[2], cy)}${psbs(xs[2], cy - 16, 40, 19, 0)}${xan(xs[2] - 34, cy + 26, 68, 'z', 7)}
    ${box(xs[3], cy)}${heat(p, xs[3] - 26, cy + 30, xs[3] - 26, cy - 34)}${heat(p, xs[3], cy + 30, xs[3], cy - 38)}${heat(p, xs[3] + 26, cy + 30, xs[3] + 26, cy - 34)}
    ${[0, 1, 2].map(i => ar(p, 'ink', `M${xs[i] + 68},${cy} L${xs[i + 1] - 68},${cy}`)).join('')}
    ${T(xs[0], cy + 96, 'excess', 'fl13-h')}${T(xs[0], cy + 122, 'light', 'fl13-h')}
    ${T(xs[1], cy + 96, 'acidic lumen', 'fl13-h')}${T(xs[1], cy + 122, 'H⁺ accumulate', 'fl13-l')}
    ${T(xs[2], cy + 96, 'PsbS +', 'fl13-h')}${T(xs[2], cy + 122, 'zeaxanthin', 'fl13-h')}
    ${T(xs[3], cy + 96, 'heat', 'fl13-h')}${T(xs[3], cy + 122, '(NPQ)', 'fl13-l')}

    <path class="fl13-rule" d="M24,350 H776"/>
    <g transform="translate(66 24)">
    <rect class="fl13-shade" x="60" y="400" width="34" height="14" rx="3"/><rect class="fl13-sun" x="94" y="380" width="70" height="34" rx="3"/><rect class="fl13-shade" x="164" y="400" width="70" height="14" rx="3"/>
    <path class="fl13-curve" d="M60,500 H94 C100,452 120,448 164,446 C176,470 186,476 234,482"/></g>

    <g transform="translate(-30 0)">
    ${ar(p, 'clay', 'M560,404 A54,54 0 0 1 614,458')}${ar(p, 'green', 'M614,470 A54,54 0 0 1 560,524')}
    ${ar(p, 'clay', 'M548,524 A54,54 0 0 1 494,470', 'fl13-dot')}${ar(p, 'green', 'M494,458 A54,54 0 0 1 548,404', 'fl13-dot')}
    <rect class="fl13-d1" x="530" y="456" width="48" height="14" rx="4"/>${T(554, 498, 'D1', 'fl13-in fl13-c-green')}
    ${T(640, 452, 'damage', 'fl13-h fl13-c-clay', 'start')}${T(640, 480, 'and repair', 'fl13-h fl13-c-green', 'start')}</g>
  </g>`);
}
