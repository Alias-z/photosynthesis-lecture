// Slide L09 · Two light-driven steps, one electron route. Draft context; see research/figure-briefs/LECTURE_OVERVIEW.md
// and the approved plan research/figure-briefs/DRAFT_LOCATION_ROUTES.md §2 (route overview with the compartment map).
// Page text: mobile carriers link the complexes (PQ in the membrane, PC in the lumen, Fd in the stroma; FNR passes
// Fd's electrons to NADP⁺), two boosts in series (the Z-scheme), and where it runs (PSII in stacked grana; PSI and
// ATP synthase in unstacked membrane; water oxidised in the lumen, NADPH formed in the stroma).
// Listed variants p–t each label every compartment and place the complexes as cryo-ET of intact chloroplasts finds
// them (Wietrzynski et al. 2025): p zoom to the route, q map beside Z, r metro by compartment, s why they sit apart,
// t one cross-section. The older variants a–j stay drawable by id through draw(). Protons belong to L10, which
// imports the shared drawing helpers exported here.
import type { PlateText, Variant } from '../types';
import { text } from '../mechanisms';
import { bilayer, bolt, illusHeads, molecule, tag, water } from '../illus';
import { sun } from './s2';
import './l09.css';

export const PLATE: PlateText = {
  n: '7',
  title: 'Two light-driven steps, one electron route',
  status: 'draft',
  lead: 'Two photosystems in series carry electrons from water to NADP⁺, each giving them a light-driven boost.',
  points: [
    { claim: 'Mobile carriers link the complexes.', text: 'PQ in the membrane, PC in the lumen, Fd in the stroma<br>FNR passes Fd’s electrons to NADP⁺' },
    { claim: 'Two boosts in series: the Z-scheme.', text: 'Each electron needs two photons, one at each photosystem<br>Both absorb all the time, independently' },
    { claim: 'Where it runs.', text: 'PSII in stacked grana; PSI and ATP synthase in unstacked membrane; b₆f in both<br>Water is oxidised in the lumen; NADPH forms in the stroma' },
  ],
  refs: [
    { label: 'Hill & Bendall 1960', url: 'https://doi.org/10.1038/186136a0' },
    { label: 'Duysens et al. 1961', url: 'https://doi.org/10.1038/190510a0' },
    { label: 'Kirchhoff 2019', url: 'https://doi.org/10.1111/nph.15730' },
    { label: 'Wietrzynski et al. 2025', url: 'https://doi.org/10.7554/eLife.105496' },
    { label: 'Johnson 2025', url: 'https://doi.org/10.1038/s41580-025-00847-y' },
  ],
};

export const VARIANTS: Variant[] = [
  { id: 'p', name: 'Zoom to the route' },
  { id: 'q', name: 'Map beside Z' },
  { id: 'r', name: 'Metro by compartment' },
  { id: 's', name: 'Why they sit apart' },
  { id: 't', name: 'One cross-section' },
];

/* ---------- shared parts (also used by L10) ---------- */

export const f = (v: number): string => v.toFixed(1);

/** Arrowheads sized in user units so thick strokes keep small heads, plus the shared inks and the amber bolt head. */
export const marks = (p: string): string =>
  `${illusHeads(p)}<defs>${['e', 'h', 'k', 'g'].map(id =>
    `<marker id="${p}-${id}" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="15" markerHeight="15" markerUnits="userSpaceOnUse" orient="auto"><path class="fl09-hd-${id}" d="M0,0L10,5L0,10z"/></marker>`).join('')}</defs>`;

export const svg = (p: string, label: string, body: string, cls = 'fl09'): string =>
  `<svg class="fig-svg fl09 ${cls}" viewBox="0 0 800 600" role="img" aria-label="${label}">${marks(p)}${body}</svg>`;

/** Electron path: red dashed; 'boost' is the solid light-driven lift. */
export const ePath = (p: string, d: string, kind: '' | 'thin' | 'boost' = ''): string =>
  `<path class="fl09-e${kind ? ` fl09-${kind}` : ''}" d="${d}" marker-end="url(#${p}-e)"/>`;
/** Proton path: blue dotted. */
export const hPath = (p: string, d: string, thin = false): string =>
  `<path class="fl09-h${thin ? ' fl09-thin' : ''}" d="${d}" marker-end="url(#${p}-h)"/>`;
/** Plain conversion or movement arrow. */
export const kPath = (p: string, d: string, cls = ''): string =>
  `<path class="fl09-k${cls ? ` ${cls}` : ''}" d="${d}" marker-end="url(#${p}-k)"/>`;
/** Ghost arrow for context that belongs to another slide. */
export const gPath = (p: string, d: string): string => `<path class="fl09-g" d="${d}" marker-end="url(#${p}-g)"/>`;

/** A proton: white ball, blue outline. */
export const hion = (x: number, y: number, r = 14): string =>
  `<circle class="tag-h" cx="${f(x)}" cy="${f(y)}" r="${r}"/>${text(+f(x), +f(y + 5), 'H⁺', 'fl09-ht')}`;
/** An electron token: white ball, red outline. */
export const eDot = (x: number, y: number, r = 15): string =>
  `<circle class="fl09-edot" cx="${f(x)}" cy="${f(y)}" r="${r}"/>${text(+f(x), +f(y + 6), 'e⁻', 'fl09-et-in')}`;

/** A photosystem: green core inside a lighter antenna. */
export function psys(cx: number, cy: number, w: number, h: number, label = '', cls = 'lab fl09-b', inset = 14): string {
  const r = Math.min(w, h) * 0.32;
  return `<rect class="fl09-ant" x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${f(r)}"/>`
    + `<rect class="blob-ps" x="${f(cx - w / 2 + inset)}" y="${f(cy - h / 2 + inset)}" width="${w - 2 * inset}" height="${h - 2 * inset}" rx="${f(Math.max(r - inset * 0.6, 6))}"/>`
    + (label ? text(cx, cy + (cls.includes('lab') ? 9 : 8), label, cls) : '');
}

export const cytb6f = (cx: number, cy: number, rx: number, ry: number, cls = 'lab fl09-b', label = 'b₆f'): string =>
  `<ellipse class="blob-b6f" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>${label ? text(cx, cy + (cls.includes('lab') ? 9 : 8), label, cls) : ''}`;
export const pq = (cx: number, cy: number, rx = 26, ry = 16, label = 'PQ'): string =>
  `<ellipse class="blob-pq" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>${label ? text(cx, cy + 8, label, 'sm') : ''}`;
export const disc = (cx: number, cy: number, r: number, label: string, cls = 'blob-small'): string =>
  `<circle class="${cls}" cx="${cx}" cy="${cy}" r="${r}"/>${label ? text(cx, cy + 8, label, 'sm') : ''}`;
export const oval = (cx: number, cy: number, rx: number, ry: number, label: string): string =>
  `<ellipse class="blob-small" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>${text(cx, cy + 8, label, 'sm')}`;
/** A rounded label chip; `cls` picks the fill (node, blob-ps, tag-nadph …). */
export const pill = (x: number, y: number, w: number, s: string, cls = 'node', tcls = 'sm', h = 34): string =>
  `<rect class="${cls}" x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${w}" height="${h}" rx="${h / 2}"/>${text(x, y + 8, s, tcls)}`;

/** ATP synthase: blue stalk through the membrane, purple head on the stroma side. Head top = top − 3.25 r. */
export function atps(cx: number, top: number, bot: number, r = 22): string {
  const hy = top - r - 2;
  return `<rect class="blob-stalk" x="${cx - 14}" y="${top - 10}" width="28" height="${bot - top + 26}" rx="10"/>`
    + `<circle class="blob-atp" cx="${f(cx - r * 0.75)}" cy="${hy}" r="${r}"/><circle class="blob-atp" cx="${f(cx + r * 0.75)}" cy="${hy}" r="${r}"/>`
    + `<circle class="blob-atp" cx="${cx}" cy="${f(top - r * 2.25)}" r="${r}"/>`;
}

/** ATP synthase on a membrane whose stroma side faces down: stalk through the membrane, head below. */
const atpsDown = (cx: number, top: number, bot: number, r = 22): string => {
  const hy = bot + r + 2;
  return `<rect class="blob-stalk" x="${cx - 14}" y="${top - 16}" width="28" height="${bot - top + 26}" rx="10"/>`
    + `<circle class="blob-atp" cx="${f(cx - r * 0.75)}" cy="${hy}" r="${r}"/><circle class="blob-atp" cx="${f(cx + r * 0.75)}" cy="${hy}" r="${r}"/>`
    + `<circle class="blob-atp" cx="${cx}" cy="${f(bot + r * 2.25)}" r="${r}"/>`;
};

export const num = (x: number, y: number, n: number | string, r = 15): string =>
  `<circle class="fl09-num" cx="${x}" cy="${y}" r="${r}"/>${text(x, y + 6.5, `${n}`, 'fl09-num-t')}`;

/** A small amber bolt standing for one absorbed photon. */
export const miniBolt = (x: number, y: number, s = 1): string =>
  `<path class="bolt" d="M${f(x - 5 * s)},${f(y - 17 * s)} L${f(x + 6 * s)},${f(y - 2 * s)} L${f(x - 3 * s)},${f(y + 1 * s)} L${f(x + 7 * s)},${f(y + 17 * s)}"/>`;

export const tick = (x: number, y: number): string => `<path class="fl09-yes" d="M${x - 11},${y} L${x - 3},${y + 9} L${x + 12},${y - 10}"/>`;
export const cross = (x: number, y: number): string => `<path class="fl09-no" d="M${x - 10},${y - 10} L${x + 10},${y + 10} M${x + 10},${y - 10} L${x - 10},${y + 10}"/>`;

/* ---------- 9a · icon Z: the energy view with each step drawn as its complex ---------- */

function iconZ(): string {
  const p = 'fl09a';
  return svg(p, 'Z-scheme on an electron-energy axis: water gives electrons to PSII, light lifts the electron twice, at PSII and at PSI, with a downhill chain between and NADPH at the end', `<g transform="translate(0 14)">
    ${kPath(p, 'M40,556 V40', 'fl09-axis')}
    <text class="tl" transform="translate(24 300) rotate(-90)" text-anchor="middle">electron energy</text>

    ${water(108, 404)}${text(108, 372, 'H₂O', 'sm')}
    ${kPath(p, 'M108,426 L108,460')}${molecule(108, 486, 'OO', 13)}${text(108, 528, 'O₂', 'sm')}
    ${ePath(p, 'M128,414 L148,450', 'thin')}
    ${psys(205, 492, 132, 70, 'PSII', 'sm fl09-b', 12)}
    ${ePath(p, 'M205,454 L205,166', 'boost')}
    ${pill(205, 137, 92, 'PSII*', 'blob-ps')}
    ${bolt(p, 92, 250, 188, 330)}${text(60, 236, 'light', 'fl09-note', 'start')}
    ${text(222, 344, 'boost 1', 'fl09-it', 'start')}

    ${pq(300, 276, 34, 20)}
    ${cytb6f(385, 320, 44, 30, 'sm fl09-b')}
    ${disc(466, 360, 24, 'PC')}
    ${ePath(p, 'M240,158 L280,250', 'thin')}${ePath(p, 'M330,290 L348,300', 'thin')}${ePath(p, 'M422,338 L440,348', 'thin')}${ePath(p, 'M484,376 L500,386', 'thin')}
    ${text(300, 386, 'downhill', 'fl09-it')}

    ${psys(565, 412, 132, 70, 'PSI', 'sm fl09-b', 12)}
    ${ePath(p, 'M565,374 L565,96', 'boost')}
    ${pill(565, 70, 84, 'PSI*', 'blob-ps')}${text(614, 40, '* excited', 'sm', 'start')}
    ${bolt(p, 470, 150, 550, 232)}${text(462, 140, 'light', 'fl09-note', 'end')}
    ${text(582, 320, 'boost 2', 'fl09-it', 'start')}

    ${disc(650, 146, 24, 'Fd')}${oval(718, 194, 38, 22, 'FNR')}
    ${ePath(p, 'M600,88 L630,124', 'thin')}${ePath(p, 'M668,164 L684,175', 'thin')}${ePath(p, 'M718,217 L718,228', 'thin')}
    ${tag(718, 252, 'NADPH', 'nadph')}${text(718, 296, 'from NADP⁺', 'sm')}</g>
  `);
}

/* ---------- 9b · the same route twice: energy (Z) above, place (membrane) below ---------- */

function mapAndZ(): string {
  const p = 'fl09b';
  const X = { w: 66, ps2: 165, pq: 268, b6f: 340, pc: 412, ps1: 496, fd: 582, fnr: 656, out: 742 };
  const z = `
    ${pill(X.w + 18, 232, 60, 'H₂O')}
    ${pill(X.ps2, 266, 70, 'PSII', 'node node-ps')}${pill(X.ps2, 74, 80, 'PSII*', 'node node-ps')}
    ${pill(X.pq, 166, 56, 'PQ', 'blob-pq')}${pill(X.b6f, 198, 60, 'b₆f', 'blob-b6f')}${pill(X.pc, 226, 56, 'PC')}
    ${pill(X.ps1, 252, 62, 'PSI', 'node node-ps')}${pill(X.ps1, 40, 72, 'PSI*', 'node node-ps')}
    ${pill(X.fd, 76, 52, 'Fd')}${pill(X.fnr, 104, 66, 'FNR')}${tag(X.out, 132, 'NADPH', 'nadph')}
    ${ePath(p, 'M115,242 L126,250', 'thin')}
    ${ePath(p, `M${X.ps2},248 L${X.ps2},98`, 'boost')}${ePath(p, `M${X.ps1},234 L${X.ps1},64`, 'boost')}
    ${ePath(p, 'M198,90 L236,148', 'thin')}${ePath(p, 'M292,178 L308,190', 'thin')}${ePath(p, 'M366,210 L382,220', 'thin')}
    ${ePath(p, 'M438,236 L460,246', 'thin')}${ePath(p, 'M530,50 L550,64', 'thin')}${ePath(p, 'M604,88 L618,98', 'thin')}${ePath(p, 'M680,120 L694,128', 'thin')}
    ${bolt(p, 100, 122, 152, 172)}${text(96, 116, 'light', 'fl09-note', 'end')}
    ${bolt(p, 430, 74, 484, 124)}${text(426, 68, 'light', 'fl09-note', 'end')}
    ${kPath(p, 'M42,290 V30', 'fl09-axis')}<text class="tl" transform="translate(29 170) rotate(-90)" text-anchor="middle">electron energy</text>`;
  const guides = ([[X.w + 18, 250, 538], [X.ps2, 284, 398], [X.pq, 184, 446], [X.b6f, 216, 398], [X.pc, 244, 532], [X.ps1, 270, 398], [X.fd, 94, 362], [X.fnr, 122, 364], [X.out, 150, 312]] as const)
    .map(([x, a, b]) => `<path class="fl09-guide" d="M${x},${a} V${b}"/>`).join('');
  const m = `
    <rect class="fl09-lumen" x="0" y="496" width="800" height="104"/>
    ${bilayer(p, 0, 800, 430, 496)}
    ${psys(X.ps2, 463, 96, 128, 'PSII', 'sm fl09-b', 12)}
    ${pq(X.pq, 463, 24, 15)}
    ${cytb6f(X.b6f, 463, 30, 64, 'sm fl09-b')}
    ${disc(X.pc, 553, 20, 'PC')}
    ${psys(X.ps1, 463, 96, 128, 'PSI', 'sm fl09-b', 12)}
    ${disc(X.fd, 384, 20, 'Fd')}${oval(X.fnr, 384, 30, 18, 'FNR')}${tag(X.out, 330, 'NADPH', 'nadph')}
    ${water(X.w, 556)}
    ${ePath(p, 'M84,548 L112,522', 'thin')}${ePath(p, 'M214,463 L238,463', 'thin')}${ePath(p, 'M293,463 L302,463', 'thin')}
    ${ePath(p, 'M352,525 L388,546', 'thin')}${ePath(p, 'M432,546 L450,528', 'thin')}
    ${ePath(p, 'M528,400 Q540,384 556,384', 'thin')}${ePath(p, 'M603,384 L618,384', 'thin')}${ePath(p, 'M682,372 L702,350', 'thin')}
    ${bolt(p, 98, 330, 130, 392)}${bolt(p, 428, 330, 460, 392)}
    ${text(790, 424, 'stroma', 'fl09-note', 'end')}${text(790, 590, 'lumen', 'fl09-note', 'end')}`;
  return svg(p, 'The Z-scheme drawn directly above the thylakoid membrane: dotted guides link each energy level to the complex that holds the electron', `${z}${guides}${m}`);
}

/* ---------- 9c · analogy: two ski lifts in series ---------- */

type Pt = [number, number];
/** A point a fraction t along a → b, pushed `off` to the left of the direction of travel. */
const along = (a: Pt, b: Pt, t: number, off = 0): Pt => {
  const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
  return [a[0] + dx * t + (dy / l) * off, a[1] + dy * t - (dx / l) * off];
};
const seg = (a: Pt, b: Pt): string => `M${f(a[0])},${f(a[1])} L${f(b[0])},${f(b[1])}`;

function skiLifts(): string {
  const p = 'fl09c';
  const P1: Pt = [100, 532], S1: Pt = [290, 150], V2: Pt = [460, 420], S2: Pt = [640, 64], P5: Pt = [746, 180];
  const cap = (L: Pt, S: Pt, R: Pt): string => {
    const l = along(L, S, 0.8), r = along(S, R, 0.2), w = r[0] - l[0];
    return `<path class="fl09-snow" d="M${f(l[0])},${f(l[1])} L${f(S[0])},${f(S[1])} L${f(r[0])},${f(r[1])} L${f(l[0] + w * 0.7)},${f(r[1] - 10)} L${f(l[0] + w * 0.5)},${f(l[1] + 6)} L${f(l[0] + w * 0.28)},${f(l[1] - 6)} Z"/>`;
  };
  /** A chairlift 40 px above the uphill face a → b; riders are electrons. */
  const lift = (a: Pt, b: Pt): string => {
    const ca = along(a, b, 0.07, 40), cb = along(a, b, 0.95, 40);
    const C = (t: number): Pt => [ca[0] + (cb[0] - ca[0]) * t, ca[1] + (cb[1] - ca[1]) * t];
    const faceY = (x: number): number => a[1] + ((x - a[0]) / (b[0] - a[0])) * (b[1] - a[1]);
    const pylons = [0.34, 0.68].map(t => { const [x, y] = C(t); return `<path class="fl09-pylon" d="M${f(x)},${f(y)} V${f(faceY(x))}"/>`; }).join('');
    const chairs = [0.18, 0.52, 0.84].map((t, i) => {
      const [x, y] = C(t);
      return `<path class="fl09-hang" d="M${f(x)},${f(y)} V${f(y + 15)}"/>` + (i === 1 ? eDot(x, y + 28, 13) : `<rect class="fl09-chair" x="${f(x - 10)}" y="${f(y + 15)}" width="20" height="8" rx="3"/>`);
    }).join('');
    const box = ([x, y]: Pt): string => `<rect class="fl09-station" x="${f(x - 16)}" y="${f(y - 12)}" width="32" height="24" rx="4"/>`;
    return `${pylons}<path class="fl09-cable" d="${seg(ca, cb)}"/>${chairs}${box(ca)}${box(cb)}`;
  };
  const hut = (a: Pt, b: Pt, t: number): Pt => along(a, b, t, -14);
  const [pqx, pqy] = hut(S1, V2, 0.29), [bx, by] = hut(S1, V2, 0.53), [pcx, pcy] = hut(S1, V2, 0.69);
  const [fdx, fdy] = hut(S2, P5, 0.28), [fnx, fny] = hut(S2, P5, 0.8);
  const t1 = along(P1, S1, 0.95, 40), t2 = along(V2, S2, 0.95, 40);
  return svg(p, 'Analogy: an electron rides two ski lifts in series. Lift 1 is PSII, the downhill run passes PQ, b6f and PC, lift 2 is PSI, and the run down to the lodge passes Fd and FNR to NADPH. One sun powers both lifts at once', `
    <path class="fl09-mtn" d="M0,600 L0,532 L${P1[0]},${P1[1]} L${S1[0]},${S1[1]} L${V2[0]},${V2[1]} L${S2[0]},${S2[1]} L${P5[0]},${P5[1]} L800,${P5[1]} L800,600 Z"/>
    ${cap(P1, S1, V2)}${cap(V2, S2, P5)}

    ${ePath(p, seg(hut(S1, V2, 0.06), hut(S1, V2, 0.8)))}
    ${ePath(p, seg(hut(S2, P5, 0.07), hut(S2, P5, 0.95)))}
    ${pq(+f(pqx), +f(pqy), 28, 17)}${cytb6f(+f(bx), +f(by), 32, 22, 'sm fl09-b')}${disc(+f(pcx), +f(pcy), 20, 'PC')}
    ${disc(+f(fdx), +f(fdy), 20, 'Fd')}${oval(+f(fnx), +f(fny), 32, 19, 'FNR')}
    ${eDot(...hut(S1, V2, 0.4), 13)}${eDot(...hut(S2, P5, 0.52), 13)}
    ${lift(P1, S1)}${lift(V2, S2)}

    ${sun(440, 92, 24)}${text(440, 154, 'light', 'fl09-note')}
    ${bolt(p, 408, 104, t1[0] + 22, t1[1] - 4)}${bolt(p, 472, 84, t2[0] - 20, t2[1] + 2)}

    ${text(140, 300, 'lift 1', 'fl09-it', 'end')}${text(140, 330, 'PSII', 'lab fl09-b', 'end')}
    ${text(492, 220, 'lift 2', 'fl09-it', 'end')}${text(492, 250, 'PSI', 'lab fl09-b', 'end')}
    ${text(300, 440, 'downhill run', 'fl09-it')}
    ${text(640, 312, 'run to the lodge', 'fl09-it')}

    ${water(34, 506)}${text(34, 474, 'H₂O', 'sm')}
    <path class="fl09-lodge" d="M756,180 V154 L773,138 L790,154 V180 Z"/>
    ${tag(726, 222, 'NADPH', 'nadph')}${text(726, 262, 'from NADP⁺', 'sm')}
    ${text(400, 586, 'height = electron energy', 'sm')}
  `);
}

/* ---------- 9d · hero membrane: one electron's journey, two boosts across the membrane ---------- */

function journey(): string {
  const p = 'fl09d';
  return svg(p, 'Illustrated thylakoid membrane: an electron from water crosses the membrane twice, lifted by light at PSII and again at PSI, travelling through PQ, cytochrome b6f, plastocyanin, ferredoxin and FNR to NADPH', `
    <rect class="fl09-lumen" x="0" y="325" width="800" height="275"/>
    ${bilayer(p, 0, 800, 235, 325)}
    ${psys(150, 280, 176, 200, '', '', 18)}${text(126, 284, 'PSII', 'lab fl09-b')}${text(126, 312, 'boost 1', 'fl09-it')}
    ${pq(270, 280, 24, 16)}
    ${cytb6f(358, 280, 34, 98, 'lab fl09-b')}
    ${disc(432, 420, 22, 'PC')}
    ${psys(540, 280, 176, 200, '', '', 18)}${text(564, 284, 'PSI', 'lab fl09-b')}${text(564, 312, 'boost 2', 'fl09-it')}
    ${disc(640, 154, 22, 'Fd')}${oval(712, 102, 36, 22, 'FNR')}
    ${tag(560, 40, 'NADP⁺', 'nadph')}${kPath(p, 'M608,40 L676,40')}${tag(730, 40, 'NADPH', 'nadph')}

    ${water(150, 452)}${water(194, 474)}${kPath(p, 'M150,474 L150,512')}${molecule(150, 538, 'OO', 13)}${text(180, 546, 'O₂', 'sm', 'start')}
    ${ePath(p, 'M190,456 L198,388', 'thin')}
    ${ePath(p, 'M200,364 L200,204', 'boost')}
    ${ePath(p, 'M210,200 Q244,214 254,266')}
    ${ePath(p, 'M295,282 L316,282')}
    ${ePath(p, 'M370,372 Q382,404 406,414')}
    ${ePath(p, 'M454,412 Q480,406 488,380')}
    ${ePath(p, 'M492,364 L492,204', 'boost')}
    ${ePath(p, 'M500,192 Q556,136 612,150')}
    ${ePath(p, 'M658,138 L678,118')}
    ${ePath(p, 'M694,82 L664,56', 'thin')}

    ${bolt(p, 66, 52, 112, 170)}${text(60, 40, 'light', 'fl09-note', 'start')}
    ${bolt(p, 420, 60, 470, 170)}${text(408, 48, 'light', 'fl09-note', 'end')}
    ${eDot(388, 404)}${eDot(560, 152)}${text(206, 432, 'e⁻', 'sm fl09-et', 'start')}
    ${text(264, 140, 'stroma', 'fl09-note')}${text(330, 570, 'lumen', 'fl09-note')}
    ${text(110, 586, 'start: water', 'fl09-it')}
    ${text(640, 514, 'each boost moves the e⁻', 'sm')}${text(640, 542, 'across the membrane', 'sm')}
  `);
}

/* ---------- 9e · both at once: photon arrivals on two lanes against time ---------- */

function bothAtOnce(): string {
  const p = 'fl09e';
  const lane = (y: number, label: string): string =>
    `${psys(72, y, 96, 50, label, 'sm fl09-b', 8)}<path class="fl09-lane" d="M136,${y} H770"/>`;
  const myth2 = [190, 350, 510, 670], myth1 = [270, 430, 590, 750];
  const fact2 = [168, 196, 284, 312, 404, 470, 496, 588, 676, 702, 752], fact1 = [186, 246, 270, 352, 440, 462, 540, 612, 638, 728];
  return svg(p, 'Two timelines. Myth: PSII absorbs, then PSI, in turn. Actually: each photosystem absorbs whenever a photon arrives, so both work at the same time', `
    ${cross(30, 34)}${text(54, 43, 'Myth: PSII absorbs first, then PSI', 'lab fl09-b', 'start')}
    ${lane(100, 'PSII')}${lane(176, 'PSI')}
    ${myth2.map(x => miniBolt(x, 100)).join('')}${myth1.map(x => miniBolt(x, 176)).join('')}
    ${myth2.map(x => `<path class="fl09-baton" d="M${x + 12},${118} L${x + 66},${156}" marker-end="url(#${p}-g)"/>`).join('')}
    ${kPath(p, 'M136,226 H776', 'fl09-axis')}${text(776, 256, 'time', 'tl', 'end')}

    ${tick(30, 316)}${text(54, 325, 'Actually: each absorbs whenever light arrives', 'lab fl09-b', 'start')}
    ${lane(384, 'PSII')}${lane(460, 'PSI')}
    ${fact2.map(x => miniBolt(x, 384)).join('')}${fact1.map(x => miniBolt(x, 460)).join('')}
    ${kPath(p, 'M136,510 H776', 'fl09-axis')}${text(776, 540, 'time', 'tl', 'end')}
    ${text(400, 586, 'The route is fixed; the timing is not', 'sm')}
  `);
}

/* ---------- 9f · evidence: two lights push cytochrome f in opposite directions ---------- */

function twoLightTest(): string {
  const p = 'fl09f';
  const x0 = 150, x1 = 760, yLo = 492, yHi = 372;
  const T = (t: number): number => x0 + t * (x1 - x0);
  const mid = 450;
  const trace = `M${x0},${yLo} H${T(0.12)} C${T(0.15)},${yLo} ${T(0.16)},${yHi} ${T(0.2)},${yHi} H${T(0.42)} C${T(0.45)},${yHi} ${T(0.46)},${mid} ${T(0.5)},${mid} H${T(0.68)} C${T(0.71)},${mid} ${T(0.72)},${yHi} ${T(0.76)},${yHi} H${T(0.88)} C${T(0.91)},${yHi} ${T(0.92)},${yLo} ${T(0.96)},${yLo} H${x1}`;
  return svg(p, 'Evidence for two photosystems in series: light absorbed by PSI oxidises cytochrome f, light absorbed by PSII reduces it again; schematic trace after Duysens and colleagues, 1961', `
    ${psys(150, 116, 150, 84, 'PSII', 'lab fl09-b', 12)}
    <rect class="fl09-tank" x="368" y="68" width="64" height="96" rx="12"/><rect class="fl09-tank-e" x="372" y="118" width="56" height="42" rx="8"/>
    ${text(400, 96, 'cyt f', 'sm fl09-b')}${text(400, 192, 'in b₆f', 'sm')}
    ${psys(650, 116, 150, 84, 'PSI', 'lab fl09-b', 12)}
    ${ePath(p, 'M228,116 L360,116')}${ePath(p, 'M440,116 L570,116')}
    ${bolt(p, 112, 16, 136, 70)}${text(104, 30, 'light 2', 'sm fl09-amber', 'end')}
    ${bolt(p, 690, 16, 666, 70)}${text(698, 30, 'light 1', 'sm fl09-amber', 'start')}
    ${text(150, 192, 'reduces cyt f', 'sm')}${text(650, 192, 'oxidises cyt f', 'sm')}
    ${text(400, 240, 'Opposite effects: PSII and PSI act in series', 'fl09-it')}

    <rect class="fl09-on" x="${T(0.12)}" y="264" width="${T(0.88) - T(0.12)}" height="20" rx="4"/>${text(T(0.12) - 10, 281, 'light 1', 'sm', 'end')}
    <rect class="fl09-on fl09-on2" x="${T(0.42)}" y="296" width="${T(0.68) - T(0.42)}" height="20" rx="4"/>${text(T(0.42) - 10, 313, 'light 2 added', 'sm', 'end')}
    <path class="fl09-axisline" d="M${x0},336 V${yLo + 18} H${x1}"/>
    ${text(x0 + 10, 350, 'cyt f', 'sm fl09-b', 'start')}
    ${text(x0 - 12, yHi + 8, 'oxidised', 'sm', 'end')}${text(x0 - 12, yLo + 8, 'reduced', 'sm', 'end')}
    <path class="fl09-trace" d="${trace}"/>
    ${text(x1, yLo + 46, 'time', 'tl', 'end')}
    ${text(400, 586, 'schematic, after Duysens et al. 1961 (red alga Porphyridium)', 'fl09-key')}
  `);
}

/* ---------- 9g · grana map: PSII stacked, PSI on the stroma lamellae, PQ and PC carry between them ---------- */

function granaMap(): string {
  const p = 'fl09g';
  // four sacs, 64 tall, 10 apart (appressed); sac 1 runs on to the right as a stroma lamella
  const sac = (x0: number, x1: number, y: number): string => `<rect class="fl09-sac2" x="${x0}" y="${y}" width="${x1 - x0}" height="64" rx="26"/>`;
  /** PSII on the membrane at height y, bulging into the lumen on side s (+1 below, −1 above). */
  const ps2 = (x: number, y: number, s: number): string =>
    `<rect class="blob-ps" x="${x - 20}" y="${y + s * 12 - 15}" width="40" height="30" rx="9"/>${text(x, y + s * 12 + 8, 'II', 'sm fl09-b')}`;
  /** PSI on the lamella, bulging into the stroma on side s. */
  const ps1 = (x: number, y: number, s: number): string =>
    `<rect class="blob-ps" x="${x - 22}" y="${y + s * 14 - 20}" width="44" height="40" rx="12"/>${text(x, y + s * 14 + 8, 'I', 'sm fl09-b')}`;
  const decor: [number, number, number[]][] = [
    [104, 1, [120, 230, 340]], [168, -1, [170, 290]], [178, 1, [130]], [242, -1, [150, 260, 360]],
    [252, 1, [115, 210, 320]], [316, -1, [160, 270, 370]], [326, 1, [120, 220, 330]], [390, -1, [170, 290]],
  ];
  const stackPs2 = decor.map(([y, s, xs]) => xs.map(x => ps2(x, y, s)).join('')).join('');
  return svg(p, 'Where the route runs: PSII sits in the stacked grana membranes, PSI on the unstacked stroma lamellae; plastoquinone moves within the membrane and plastocyanin through the lumen between them', `
    ${text(235, 30, 'granum: stacked', 'sm fl09-b')}${text(235, 56, 'PSII (II)', 'sm')}
    ${text(600, 30, 'stroma lamella', 'sm fl09-b')}${text(600, 56, 'PSI (I)', 'sm')}
    <path class="fl09-div" d="M412,40 V400"/>
    ${sac(70, 400, 104)}${sac(70, 786, 178)}${sac(70, 400, 252)}${sac(70, 400, 326)}
    ${stackPs2}
    ${ps2(250, 178, 1)}${pq(312, 180, 22, 11, '')}${cytb6f(372, 184, 17, 14, 'sm', '')}
    ${cytb6f(560, 242, 17, 14, 'sm', '')}
    ${ps1(600, 178, -1)}${ps1(470, 242, 1)}${ps1(700, 242, 1)}
    ${disc(520, 210, 16, '')}${disc(664, 104, 18, 'Fd')}

    ${ePath(p, 'M272,186 L286,182', 'thin')}${ePath(p, 'M334,181 L350,182', 'thin')}
    ${ePath(p, 'M380,197 Q398,216 498,211', 'thin')}${ePath(p, 'M536,210 Q590,212 596,190', 'thin')}
    ${ePath(p, 'M618,146 L644,118', 'thin')}${text(690, 112, '→ NADP⁺', 'sm', 'start')}

    ${text(312, 88, 'PQ', 'sm fl09-b')}<path class="fl09-lead" d="M312,94 L312,168"/>
    ${text(372, 88, 'b₆f', 'sm fl09-b')}<path class="fl09-lead" d="M372,94 L372,169"/>
    ${text(520, 300, 'PC', 'sm fl09-b')}<path class="fl09-lead" d="M520,227 L520,280"/>
    ${text(566, 300, 'b₆f', 'sm fl09-b', 'start')}

    ${text(436, 452, 'PQ: within the membrane', 'sm', 'start')}${text(436, 484, 'PC: through the lumen', 'sm', 'start')}

    <ellipse class="fl09-chloro" cx="130" cy="508" rx="104" ry="54"/>
    ${[70, 130, 190].map(x => Array.from({ length: 4 }, (_, i) => `<rect class="fl09-sac" x="${x - 18}" y="${484 + i * 12}" width="36" height="9" rx="4.5"/>`).join('')).join('')}
    <path class="fl09-lam" d="M88,494 L112,506 M148,506 L172,494"/>
    <rect class="fl09-zoom" x="106" y="476" width="48" height="50" rx="5"/>
    <path class="fl09-zoomline" d="M106,476 L70,398 M154,476 L400,398"/>
    ${text(130, 586, 'chloroplast', 'sm')}
    ${text(436, 586, 'in situ by cryo-ET: Wietrzynski et al. 2025', 'fl09-key', 'start')}
  `);
}

/* ---------- 9h · equation link: the electron route sits under the terms it explains ---------- */

function equationLink(): string {
  const p = 'fl09h';
  const term = (x: number, s: string, cls: string, w: number): string =>
    `<rect class="fl09-term ${cls}" x="${x - w / 2}" y="34" width="${w}" height="46" rx="10"/>${text(x, 66, s, 'lab fl09-b')}`;
  return svg(p, 'The photosynthesis equation with water, light and oxygen highlighted; below, the Z-scheme shows water giving electrons, light driving two boosts and NADPH carrying them on to CO2', `
    ${text(60, 66, '6 CO₂', 'lab fl09-grey')}${text(112, 66, '+', 'lab fl09-grey')}
    ${term(184, '12 H₂O', 'fl09-term-w', 104)}${text(252, 66, '+', 'lab')}
    ${term(316, 'light', 'fl09-term-l', 86)}${text(384, 66, '→', 'lab')}
    ${text(470, 66, 'C₆H₁₂O₆', 'lab fl09-grey')}${text(540, 66, '+', 'lab fl09-grey')}
    ${term(604, '6 O₂', 'fl09-term-w', 80)}${text(664, 66, '+', 'lab fl09-grey')}${text(724, 66, '6 H₂O', 'lab fl09-grey')}
    ${text(604, 110, '(from water)', 'fl09-it')}

    ${kPath(p, 'M184,84 L184,414', 'fl09-link')}${text(174, 250, 'electron source', 'fl09-it', 'end')}
    <path class="fl09-lightlink" d="M296,82 L204,284 M336,82 L506,236"/>
    ${bolt(p, 204, 290, 278, 350)}${bolt(p, 508, 242, 572, 296)}

    ${water(184, 446)}${kPath(p, 'M166,460 L142,486')}${molecule(128, 506, 'OO', 12)}${text(128, 542, 'O₂', 'sm')}
    ${ePath(p, 'M204,456 L240,486', 'thin')}
    ${psys(300, 514, 116, 60, 'PSII', 'sm fl09-b', 10)}
    ${ePath(p, 'M300,482 L300,232', 'boost')}${pill(300, 206, 84, 'PSII*', 'blob-ps')}
    ${pq(380, 330, 30, 18)}${cytb6f(448, 366, 36, 24, 'sm fl09-b')}${disc(510, 402, 21, 'PC')}
    ${ePath(p, 'M330,226 L362,306', 'thin')}${ePath(p, 'M404,340 L417,347', 'thin')}${ePath(p, 'M476,382 L490,388', 'thin')}${ePath(p, 'M522,412 L533,423', 'thin')}
    ${psys(596, 450, 116, 60, 'PSI', 'sm fl09-b', 10)}
    ${ePath(p, 'M596,418 L596,166', 'boost')}${pill(596, 140, 76, 'PSI*', 'blob-ps')}
    ${disc(664, 178, 21, 'Fd')}${oval(722, 220, 34, 20, 'FNR')}
    ${ePath(p, 'M626,158 L640,166', 'thin')}${ePath(p, 'M680,194 L692,203', 'thin')}${ePath(p, 'M722,242 L722,252', 'thin')}
    ${tag(722, 278, 'NADPH', 'nadph')}${text(706, 320, 'used to make', 'sm')}${text(706, 346, 'sugar from CO₂', 'sm')}
    ${text(400, 590, '4 e⁻ from 2 H₂O reduce 2 NADP⁺', 'sm')}
  `);
}

/* ---------- 9i · four frames: one electron, one step at a time ---------- */

function fourFrames(): string {
  const p = 'fl09i';
  type Pt = [number, number];
  const N: Record<string, Pt> = {
    w: [30, 168], ps2: [74, 196], ps2x: [74, 36], pq: [128, 104], b6f: [168, 128], pc: [206, 150],
    ps1: [248, 172], ps1x: [248, 14], fd: [288, 34], fnr: [318, 54], out: [346, 76],
  };
  const segs: [string, string, number][] = [
    ['w', 'ps2', 1], ['ps2', 'ps2x', 1], ['ps2x', 'pq', 2], ['pq', 'b6f', 2], ['b6f', 'pc', 2], ['pc', 'ps1', 3], ['ps1', 'ps1x', 3], ['ps1x', 'fd', 4], ['fd', 'fnr', 4], ['fnr', 'out', 4],
  ];
  const names: Record<string, string> = { w: 'H₂O', ps2: 'PSII', pq: 'PQ', b6f: 'b₆f', pc: 'PC', ps1: 'PSI', fd: 'Fd', fnr: 'FNR', out: 'NADPH' };
  const lit: Record<number, string[]> = { 1: ['w', 'ps2'], 2: ['pq', 'b6f', 'pc'], 3: ['ps1'], 4: ['fd', 'fnr', 'out'] };
  const caps: Record<number, [string, string]> = {
    1: ['Light boost at PSII', ''],
    2: ['Downhill via carriers', ''],
    3: ['Light boost at PSI', ''],
    4: ['NADP⁺ reduced to NADPH', ''],
  };
  const off: Record<string, [number, number, 'start' | 'middle' | 'end']> = {
    w: [-12, 8, 'end'], ps2: [0, 34, 'middle'], ps1: [0, 34, 'middle'], pq: [12, -10, 'start'], b6f: [12, -10, 'start'], pc: [-12, 30, 'end'],
    fd: [14, -8, 'start'], fnr: [-14, 24, 'end'], out: [8, 34, 'end'],
  };
  const frame = (k: number, ox: number, oy: number): string => {
    const P = (id: string): Pt => [+f(ox + 30 + N[id][0] * 0.97), +f(oy + 72 + N[id][1] * 0.88)];
    const lines = segs.map(([a, b, s]) => {
      const [x0, y0] = P(a), [x1, y1] = P(b);
      const boost = (a === 'ps2' && b === 'ps2x') || (a === 'ps1' && b === 'ps1x');
      if (s !== k) return `<path class="fl09-faint" d="M${x0},${y0} L${x1},${y1}"/>`;
      const dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy), cut = boost ? 12 : 10;
      return ePath(p, `M${f(x0 + (dx / l) * cut)},${f(y0 + (dy / l) * cut)} L${f(x1 - (dx / l) * (cut + 4))},${f(y1 - (dy / l) * (cut + 4))}`, boost ? 'boost' : 'thin');
    }).join('');
    const dots = Object.keys(N).map(id => {
      const [x, y] = P(id), on = lit[k].includes(id) || (k === 1 && id === 'ps2x') || (k === 3 && id === 'ps1x');
      return `<circle class="${on ? 'fl09-node-on' : 'fl09-node-off'}" cx="${x}" cy="${y}" r="${on ? 8 : 6}"/>`;
    }).join('');
    const labs = lit[k].map(id => {
      const [x, y] = P(id), [dx, dy, a] = off[id];
      return text(x + dx, y + dy, names[id], 'sm fl09-b', a);
    }).join('');
    const bolts = k === 1 ? miniBolt(P('ps2')[0] - 24, P('ps2')[1] - 96) : k === 3 ? miniBolt(P('ps1')[0] - 26, P('ps1')[1] - 70) : '';
    const o2 = k === 1 ? molecule(P('w')[0] - 2, P('w')[1] - 38, 'OO', 10) : '';
    return `<rect class="fl09-cell" x="${ox}" y="${oy}" width="384" height="292" rx="16"/>${num(ox + 28, oy + 30, k)}
      ${text(ox + 54, oy + 38, caps[k][0], 'sm fl09-b', 'start')}${lines}${dots}${labs}${bolts}${o2}`;
  };
  // frames 1, 2 on top; 3, 4 below; each caption sits beside its number
  return svg(p, 'Four frames of one electron on the Z-scheme: lifted at PSII, downhill through PQ, b6f and PC, lifted again at PSI, then handed to NADP+', `
    ${frame(1, 8, 2)}${frame(2, 408, 2)}${frame(3, 8, 306)}${frame(4, 408, 306)}
  `);
}

/* ---------- 9j · metro line: stations sit in the compartment where each carrier works ---------- */

function metroLine(): string {
  const p = 'fl09j';
  const st = (x: number, y: number, name: string, above: boolean, cls = 'fl09-stop'): string =>
    `<circle class="${cls}" cx="${x}" cy="${y}" r="11"/>${text(x, above ? y - 24 : y + 40, name, 'lab fl09-b')}`;
  const hub = (x: number, y: number, name: string): string =>
    `<circle class="fl09-hub" cx="${x}" cy="${y}" r="24"/>${miniBolt(x, y, 0.85)}${text(x - 36, y + 9, name, 'lab fl09-b', 'end')}`;
  return svg(p, 'The electron route drawn as a metro line through three zones: it starts at water in the lumen, stops at PSII, PQ and b6f in the membrane, PC in the lumen, PSI in the membrane, then Fd, FNR and NADP+ in the stroma; PSII and PSI are the two light-powered stops', `
    <rect class="fl09-zone-s" x="0" y="60" width="800" height="168"/>
    <rect class="fl09-zone-m" x="0" y="228" width="800" height="156"/>
    <rect class="fl09-zone-l" x="0" y="384" width="800" height="156"/>
    ${text(16, 92, 'stroma', 'fl09-note', 'start')}${text(16, 260, 'membrane', 'fl09-note', 'start')}${text(16, 416, 'lumen', 'fl09-note', 'start')}

    <path class="fl09-line" d="M84,480 H142 Q164,480 164,458 V306 H336 V438 Q336,460 358,460 H476 Q498,460 498,438 V170 Q498,148 520,148 H684" marker-end="url(#${p}-e)"/>
    ${st(84, 480, 'H₂O', false, 'fl09-stop fl09-end')}
    ${hub(164, 306, 'PSII')}
    ${st(250, 306, 'PQ', true)}${st(336, 306, 'b₆f', true)}
    ${st(418, 460, 'PC', false)}
    ${hub(498, 306, 'PSI')}
    ${st(566, 148, 'Fd', true)}${st(640, 148, 'FNR', true)}
    ${tag(740, 148, 'NADPH', 'nadph')}${text(736, 188, 'from NADP⁺', 'sm')}

    <circle class="fl09-hub" cx="200" cy="572" r="13"/>${miniBolt(200, 572, 0.5)}${text(222, 580, 'light-powered stop', 'sm', 'start')}
    <circle class="fl09-stop" cx="480" cy="572" r="9"/>${text(498, 580, 'carrier stop', 'sm', 'start')}
  `);
}

/* ---------- 9p–9t · where the route runs: compartments and the cryo-ET placement of the complexes ---------- */

/** The abbreviation key, two centred lines at the foot of the figure. */
const KEY_A = 'PQ plastoquinone · b₆f cytochrome b₆f · PC plastocyanin';
const KEY_B = 'Fd ferredoxin · FNR ferredoxin–NADP⁺ reductase';
const routeKey = (a = KEY_A, b = KEY_B): string => `${text(400, 566, a, 'fl09-key')}${text(400, 590, b, 'fl09-key')}`;

/** A thin leader from a label to the thing it names. */
const lead = (x0: number, y0: number, x1: number, y1: number): string =>
  `<path class="fl09-lead" d="M${f(x0)},${f(y0)} L${f(x1)},${f(y1)}"/>`;

/** A membrane drawn as a tan band along a centre line `d`, `w` thick, with darker edges. */
const memBand = (d: string, w: number): string =>
  `<path class="fl09-mband" d="${d}" style="stroke-width:${w}"/><path class="fl09-mfill" d="${d}" style="stroke-width:${w - 3}"/>`;

/** A thylakoid seen side-on: membrane band (m thick) around a lumen. */
const sac = (x0: number, y0: number, x1: number, y1: number, m: number, r: number): string =>
  `<rect class="fl09-memb" x="${f(x0)}" y="${f(y0)}" width="${f(x1 - x0)}" height="${f(y1 - y0)}" rx="${f(r)}"/>`
  + `<rect class="fl09-lum" x="${f(x0 + m)}" y="${f(y0 + m)}" width="${f(x1 - x0 - 2 * m)}" height="${f(y1 - y0 - 2 * m)}" rx="${f(Math.max(r - m, 2))}"/>`;

/** The chloroplast envelope: two membranes around the stroma. */
const envelope = (cx: number, cy: number, rx: number, ry: number, gap = 7): string =>
  `<ellipse class="fl09-env" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/><ellipse class="fl09-env2" cx="${cx}" cy="${cy}" rx="${rx - gap}" ry="${ry - gap}"/>`;

/** One granum in a whole-chloroplast view: n discs, w wide, stacked tight. */
const granumIcon = (x: number, y: number, n = 4, w = 36, h = 6, pitch = 8.5): string =>
  Array.from({ length: n }, (_, i) => `<rect class="fl09-gr" x="${f(x - w / 2)}" y="${f(y - ((n - 1) * pitch) / 2 + i * pitch - h / 2)}" width="${w}" height="${h}" rx="${h / 2}"/>`).join('');

/** A side-on sac for joined networks: [x0, y0, x1, y1, turn in degrees about the left end]. */
type Sac = [number, number, number, number, number];
/** Joined sacs drawn in four passes (membrane outline, membrane, lumen outline, lumen) so junctions show no seams. */
function sacNetwork(list: Sac[], m: number, cls: [string, string, string, string], rMax = 999): string {
  const shape = ([x0, y0, x1, y1, rot]: Sac, inset: number, c: string): string => {
    const r = Math.max(Math.min(rMax, (y1 - y0) / 2) - inset, 1);
    return `<rect class="${c}" x="${x0 + inset}" y="${y0 + inset}" width="${x1 - x0 - 2 * inset}" height="${y1 - y0 - 2 * inset}" rx="${r}"${rot ? ` transform="rotate(${rot} ${x0} ${(y0 + y1) / 2})"` : ''}/>`;
  };
  return cls.map((c, i) => list.map(sk => shape(sk, i < 2 ? 0 : m, c)).join('')).join('');
}

/* ---------- 9p · zoom to the route: leaf → cell → chloroplast → membrane strip carrying the route ---------- */

function zoomRoute(): string {
  const p = 'fl09p';
  const A = { x: 70, y: 116, r: 50 }, B = { x: 210, y: 116, r: 62 };
  const C = { x: 426, y: 116, rx: 128, ry: 72 };
  type Lens = typeof A;
  const on = (L: Lens, deg: number): [number, number] => [L.x + L.r * Math.cos((deg * Math.PI) / 180), L.y + L.r * Math.sin((deg * Math.PI) / 180)];
  const zl = (a: [number, number], b: [number, number]): string => `<path class="fl09-zl" d="M${f(a[0])},${f(a[1])} L${f(b[0])},${f(b[1])}"/>`;
  const zbox = (x0: number, y0: number, w: number, h: number): string => `<rect class="fl09-zb" x="${x0}" y="${y0}" width="${w}" height="${h}" rx="2"/>`;
  const clip = (id: string, inner: string): string => `<clipPath id="${p}-${id}">${inner}</clipPath>`;

  // leaf, mesophyll cells with chloroplasts along the walls, chloroplast with grana and lamellae
  const leaf = `<g transform="translate(${A.x} ${A.y}) rotate(-32) scale(0.72)">
      <path class="fl09-vein" d="M-70,5 L-50,0" style="stroke-width:3"/>
      <path class="fl09-leaf" d="M-50,0 C-30,-34 24,-36 54,0 C24,36 -30,34 -50,0Z"/>
      <path class="fl09-vein" d="M-50,0 L50,0 M-28,0 L-14,-17 M-4,0 L10,-19 M20,0 L32,-12 M-28,0 L-14,17 M-4,0 L10,19 M20,0 L32,12"/></g>`;
  const cell = (x0: number, y0: number, x1: number, y1: number): string => {
    const ys = [0.2, 0.4, 0.6, 0.8].map(t => y0 + (y1 - y0) * t), xs = [0.36, 0.64].map(t => x0 + (x1 - x0) * t);
    const side = ys.flatMap(y => [x0 + 9, x1 - 9].map(x => `<ellipse class="fl09-cp" cx="${f(x)}" cy="${f(y)}" rx="5" ry="9"/>`));
    const ends = xs.flatMap(x => [y0 + 9, y1 - 9].map(y => `<ellipse class="fl09-cp" cx="${f(x)}" cy="${f(y)}" rx="9" ry="5"/>`));
    return `<rect class="fl09-cellw" x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="20"/>${side.join('')}${ends.join('')}`;
  };
  const cells = cell(B.x - 104, B.y - 52, B.x - 36, B.y + 52) + cell(B.x - 32, B.y - 52, B.x + 32, B.y + 52) + cell(B.x + 36, B.y - 52, B.x + 104, B.y + 52);
  const G: [number, number][] = [[346, 112], [408, 140], [474, 98], [414, 82], [494, 142]];
  const lam = `<path class="fl09-lam2" d="M306,124 L346,112 L408,140 L494,142 L536,128 M346,112 L414,82 L474,98 L520,90 M408,140 L474,98 M414,82 L392,58 M494,142 L470,172"/>`;
  const chloro = `${envelope(C.x, C.y, C.rx, C.ry)}${lam}${G.map(([x, y]) => granumIcon(x, y)).join('')}`;

  // membrane strip: window below a header row; granum part (left, stacked) and stroma lamella (right, unstacked)
  const T = 212, H = 248, Bt = 548, edge = 330;
  const yM = 315, yL = 404, w = 30; // membrane centre lines: in the granum, in the lamella
  const route = `M0,${yM} H${edge} C${edge + 40},${yM} ${edge + 30},${yL} ${edge + 70},${yL} H800`;
  const win = `M21,${H} H779 V${Bt - 13} Q779,${Bt - 1} 767,${Bt - 1} H33 Q21,${Bt - 1} 21,${Bt - 13} Z`;
  const strip = `
    <rect class="fl09-panel" x="20" y="${T}" width="760" height="${Bt - T}" rx="14"/>
    ${clip('win', `<path d="${win}"/>`)}
    <g clip-path="url(#${p}-win)">
      <rect class="fl09-stroma" x="0" y="${H}" width="800" height="${Bt - H}"/>
      ${sac(-60, 150, edge, yM - w / 2 - 8, w, 44)}
      <path class="fl09-lum" style="stroke:none" d="M0,${yM} H${edge} C${edge + 40},${yM} ${edge + 30},${yL} ${edge + 70},${yL} H800 V${Bt} H0 Z"/>
      ${memBand(route, w)}
    </g>
    <path class="fl09-div" d="M${edge},${T + 8} V${H - 4}"/>
    ${text((20 + edge) / 2, T + 26, 'granum (stacked)', 'sm fl09-b')}${text((edge + 780) / 2, T + 26, 'stroma lamella (unstacked)', 'sm fl09-b')}`;

  // complexes and the route
  const X = { ps2: 128, pq: 214, b6f: 280, atp: 444, b6f2: 500, ps1: 578, fd: 652, fnr: 726 };
  const cx = `
    ${psys(X.ps2, 337, 94, 82, 'PSII', 'sm fl09-b', 10)}
    ${pq(X.pq, yM, 22, 13)}
    ${cytb6f(X.b6f, 338, 24, 40, 'sm fl09-b')}
    ${atps(X.atp, yL - w / 2, yL + w / 2, 14)}
    ${cytb6f(X.b6f2, yL + 4, 22, 38, 'sm fl09-b')}
    ${psys(X.ps1, yL, 86, 100, 'PSI', 'sm fl09-b', 10)}
    ${disc(X.fd, 330, 19, 'Fd')}${oval(X.fnr, 330, 32, 19, 'FNR')}${tag(X.fnr, 272, 'NADPH', 'nadph')}
    ${water(104, 432)}${text(104, 470, 'H₂O', 'sm')}
    ${kPath(p, 'M128,434 L152,434')}${molecule(178, 434, 'OO', 11)}${text(178, 470, 'O₂', 'sm')}${hion(224, 434)}
    ${disc(412, 474, 19, 'PC')}`;
  const e = `
    ${ePath(p, 'M110,418 L118,382', 'thin')}
    ${ePath(p, `M154,372 L154,${yM - 6}`, 'boost')}
    ${ePath(p, `M166,${yM} L190,${yM}`, 'thin')}${ePath(p, `M237,${yM + 4} L254,${yM + 8}`, 'thin')}
    ${ePath(p, 'M284,380 Q300,460 390,472', 'thin')}
    ${ePath(p, 'M432,470 Q520,470 540,446', 'thin')}
    ${ePath(p, `M602,446 L602,${yL - 38}`, 'boost')}
    ${ePath(p, `M612,360 L634,342`, 'thin')}${ePath(p, 'M672,330 L692,330', 'thin')}${ePath(p, 'M726,310 L726,292', 'thin')}
    ${bolt(p, 70, 256, 104, 294)}${bolt(p, 548, 258, 566, 348)}`;
  const labels = `
    ${text(452, 330, 'ATP synthase', 'sm')}
    ${text(40, 532, 'lumen', 'fl09-note', 'start')}
    ${text(768, 520, 'thylakoid membrane', 'sm', 'end')}${lead(700, 500, 700, yL + w / 2 + 1)}`;

  return svg(p, 'Zoom from a leaf to a mesophyll cell, a chloroplast and a strip of thylakoid membrane: PSII sits in the stacked granum, PSI and ATP synthase in the unstacked stroma lamella, cytochrome b6f in both; water is oxidised in the lumen, PQ moves in the membrane, PC through the lumen, and Fd and FNR reduce NADP+ in the stroma', `
    ${clip('cA', `<circle cx="${A.x}" cy="${A.y}" r="${A.r - 1}"/>`)}${clip('cB', `<circle cx="${B.x}" cy="${B.y}" r="${B.r - 1}"/>`)}
    ${zl([A.x + 9, A.y - 14], on(B, 200))}${zl([A.x + 9, A.y - 2], on(B, 160))}
    ${zl([B.x + 24, B.y - 12], [C.x - C.rx + 6, C.y - 30])}${zl([B.x + 24, B.y + 12], [C.x - C.rx + 6, C.y + 30])}
    ${zl([396, 154], [20, T])}${zl([436, 154], [780, T])}
    <circle class="fl09-lens" cx="${A.x}" cy="${A.y}" r="${A.r}"/><g clip-path="url(#${p}-cA)">${leaf}</g>${zbox(A.x - 3, A.y - 14, 12, 12)}
    <circle class="fl09-lens" cx="${B.x}" cy="${B.y}" r="${B.r}"/><g clip-path="url(#${p}-cB)">${cells}</g>${zbox(B.x + 18, B.y - 12, 12, 24)}
    ${chloro}${zbox(396, 124, 40, 30)}
    ${text(A.x, 30, 'leaf', 'sm fl09-b')}${text(B.x, 30, 'mesophyll cell', 'sm fl09-b')}${text(C.x, 30, 'chloroplast', 'sm fl09-b')}
    ${text(588, 82, 'envelope:', 'sm', 'start')}${text(588, 108, 'two membranes', 'sm', 'start')}${lead(582, 82, 538, 84)}
    ${text(588, 160, 'stroma', 'sm', 'start')}${lead(582, 154, 522, 118)}
    ${strip}${cx}${e}${labels}
    ${routeKey()}
  `);
}

/* ---------- 9q · map beside Z: the chloroplast tinted by compartment, the Z-scheme's boxes in the same tints ---------- */

function mapBesideZ(): string {
  const p = 'fl09q';
  // map: one granum of three sacs; a stroma lamella leaves the middle sac; two more lamellae for context
  const C = { x: 200, y: 262, rx: 182, ry: 150 };
  const gx0 = 44, gx1 = 194, sh = 46, m = 8, gap = 4, sy = [190, 190 + sh + gap, 190 + 2 * (sh + gap)];
  const L1 = { x0: 170, x1: 352, y0: 246, y1: 280 };
  const sacs: Sac[] = [
    ...sy.map(y => [gx0, y, gx1, y + sh, 0] as Sac),
    [L1.x0, L1.y0, L1.x1, L1.y1, 0],
    [176, 300, 318, 330, 24],
    [176, 196, 300, 226, -26],
  ];
  const chip = (x: number, y: number, w: number, s: string): string =>
    `<rect class="fl09-chip" x="${x - w / 2}" y="${y - 14}" width="${w}" height="28" rx="8"/>${text(x, y + 8, s, 'sm fl09-b')}`;
  const atpChip = (x: number, top: number): string =>
    `<rect class="fl09-chip" x="${x - 6}" y="${top - 6}" width="12" height="${L1.y1 - L1.y0 - 6}" rx="4"/>`
    + `<circle class="fl09-chip" cx="${x - 8}" cy="${top - 14}" r="10"/><circle class="fl09-chip" cx="${x + 8}" cy="${top - 14}" r="10"/><circle class="fl09-chip" cx="${x}" cy="${top - 27}" r="10"/>`;
  const map = `
    <ellipse class="fl09-ts" cx="${C.x}" cy="${C.y}" rx="${C.rx}" ry="${C.ry}"/><ellipse class="fl09-env2" cx="${C.x}" cy="${C.y}" rx="${C.rx - 8}" ry="${C.ry - 8}"/>
    ${sacNetwork(sacs, m, ['fl09-tm-o', 'fl09-tm-f', 'fl09-tl-o', 'fl09-tl-f'])}
    ${chip(78, sy[1] + 12, 54, 'PSII')}${chip(146, sy[1] + sh - 12, 50, 'b₆f')}
    ${chip(232, L1.y0 + 2, 48, 'PSI')}${atpChip(316, L1.y0)}${chip(290, L1.y1 - 2, 50, 'b₆f')}
    ${text(30, 74, 'granum (stacked)', 'sm', 'start')}${lead(78, 82, 78, sy[0] - 2)}
    ${text(390, 74, 'ATP synthase', 'sm', 'end')}${lead(330, 82, 318, L1.y0 - 38)}
    ${text(30, 454, 'envelope: two membranes', 'sm', 'start')}${lead(84, 436, 92, 395)}
    ${text(386, 488, 'stroma lamella (unstacked)', 'sm', 'end')}${lead(340, 468, 330, L1.y1 + 1)}`;

  // Z-scheme: each box tinted by the compartment where that carrier works
  const z = `
    ${kPath(p, 'M404,476 V40', 'fl09-axis')}${text(416, 44, 'electron energy', 'tl', 'start')}
    ${pill(440, 456, 62, 'H₂O', 'fl09-tl')}
    ${pill(500, 410, 66, 'PSII', 'fl09-tm', 'sm fl09-b')}${pill(500, 150, 78, 'PSII*', 'fl09-tm', 'sm fl09-b')}
    ${pill(556, 214, 52, 'PQ', 'fl09-tm')}${pill(602, 262, 56, 'b₆f', 'fl09-tm')}${pill(648, 310, 52, 'PC', 'fl09-tl')}
    ${pill(694, 370, 60, 'PSI', 'fl09-tm', 'sm fl09-b')}${pill(694, 92, 70, 'PSI*', 'fl09-tm', 'sm fl09-b')}
    ${pill(740, 156, 50, 'Fd', 'fl09-ts')}${pill(740, 212, 64, 'FNR', 'fl09-ts')}${pill(738, 268, 88, 'NADPH', 'fl09-ts', 'sm fl09-b')}
    ${ePath(p, 'M466,446 L480,430', 'thin')}${kPath(p, 'M472,460 L496,465')}${pill(550, 468, 92, 'O₂ + H⁺', 'fl09-tl')}
    ${ePath(p, 'M500,391 L500,172', 'boost')}${ePath(p, 'M694,351 L694,114', 'boost')}
    ${ePath(p, 'M522,168 L540,192', 'thin')}${ePath(p, 'M572,230 L584,244', 'thin')}${ePath(p, 'M620,278 L632,292', 'thin')}${ePath(p, 'M666,326 L678,348', 'thin')}
    ${ePath(p, 'M722,108 L732,134', 'thin')}${ePath(p, 'M740,174 L740,190', 'thin')}${ePath(p, 'M740,230 L740,246', 'thin')}
    ${bolt(p, 426, 302, 470, 388)}${bolt(p, 784, 330, 730, 366)}
`;

  // tint key
  const sw = (x: number, cls: string, s: string): string => `<rect class="${cls}" x="${x}" y="506" width="26" height="22" rx="5"/>${text(x + 36, 525, s, 'sm', 'start')}`;
  const tints = `${sw(150, 'fl09-ts', 'stroma')}${sw(292, 'fl09-tm', 'thylakoid membrane')}${sw(570, 'fl09-tl', 'lumen')}`;

  return svg(p, 'Left, a chloroplast tinted by compartment: stroma, thylakoid membrane and lumen, with PSII in the stacked granum, PSI and ATP synthase in the unstacked stroma lamella and cytochrome b6f in both. Right, the Z-scheme with each carrier boxed in the tint of the compartment where it works', `
    ${map}${z}${tints}
    ${routeKey(KEY_A, `${KEY_B} · * excited`)}
  `);
}

/* ---------- 9r · metro by compartment: 9j's line in stroma / membrane / lumen bands, stacked left, unstacked right ---------- */

function metroBands(): string {
  const p = 'fl09r';
  const F = { x0: 12, y0: 42, x1: 788, y1: 536 };         // envelope frame (outer membrane)
  const yS = 170, yM = 282, yL = 432, split = 380;            // line levels in stroma, membrane, lumen; domain border
  const st = (x: number, y: number, name: string, dy: number, cls = 'fl09-stop'): string =>
    `<circle class="${cls}" cx="${x}" cy="${y}" r="11"/>${text(x, y + dy, name, 'lab fl09-b')}`;
  const hub = (x: number, y: number, name: string, dx = 0, dy = -36, anchor: 'start' | 'middle' = 'middle'): string =>
    `<circle class="fl09-hub" cx="${x}" cy="${y}" r="24"/>${miniBolt(x, y, 0.85)}${text(x + dx, y + dy, name, 'lab fl09-b', anchor)}`;
  const X = { w: 132, ps2: 206, pq: 274, b6f: 336, pc: 470, b6f2: 428, atp: 494, ps1: 580, fd: 626, fnr: 680, out: 724 };
  return svg(p, 'The electron route as a metro line inside the chloroplast envelope, through three bands: stroma, thylakoid membrane and lumen, split into stacked granum on the left and unstacked stroma lamella on the right. Water in the lumen, PSII, PQ and b6f in the stacked membrane, PC in the lumen, PSI in the unstacked membrane, then Fd, FNR and NADPH in the stroma; a second b6f and ATP synthase sit in the unstacked membrane', `
    <rect class="fl09-env" x="${F.x0}" y="${F.y0}" width="${F.x1 - F.x0}" height="${F.y1 - F.y0}" rx="34"/>
    <rect class="fl09-env2" x="${F.x0 + 7}" y="${F.y0 + 7}" width="${F.x1 - F.x0 - 14}" height="${F.y1 - F.y0 - 14}" rx="28"/>
    <rect class="fl09-memb" x="32" y="222" width="736" height="296" rx="22"/>
    <rect class="fl09-lum" x="46" y="${yM + 40}" width="708" height="${518 - 14 - yM - 40}" rx="12"/>
    <path class="fl09-div" d="M${split},64 V508"/>
    ${text(24, 30, 'envelope: two membranes', 'sm', 'start')}
    ${text((F.x0 + split) / 2 + 8, 82, 'granum (stacked)', 'sm fl09-b')}${text((split + F.x1) / 2, 82, 'stroma lamella (unstacked)', 'sm fl09-b')}
    ${text(40, yS + 9, 'stroma', 'fl09-note', 'start')}
    ${text(48, yM - 6, 'thylakoid', 'fl09-note', 'start')}${text(48, yM + 22, 'membrane', 'fl09-note', 'start')}
    ${text(740, 488, 'lumen', 'fl09-note', 'end')}

    <path class="fl09-line" d="M${X.w},${yL} H${X.ps2 - 22} Q${X.ps2},${yL} ${X.ps2},${yL - 22} V${yM} H${X.b6f} V${yL - 22} Q${X.b6f},${yL} ${X.b6f + 22},${yL} H${X.ps1 - 22} Q${X.ps1},${yL} ${X.ps1},${yL - 22} V${yS + 22} Q${X.ps1},${yS} ${X.ps1 + 22},${yS} H${X.out - 22} Q${X.out},${yS} ${X.out},${yS - 22} V${yS - 46}" marker-end="url(#${p}-e)"/>
    ${st(X.w, yL, 'H₂O', -24, 'fl09-stop fl09-end')}
    ${kPath(p, `M${X.w},${yL + 14} L${X.w},${yL + 34}`)}${text(X.w, yL + 60, 'O₂ + H⁺', 'sm')}
    ${hub(X.ps2, yM, 'PSII')}
    ${st(X.pq, yM, 'PQ', -24)}${st(X.b6f, yM, 'b₆f', -24)}
    ${st(X.pc, yL, 'PC', 40)}
    ${cytb6f(X.b6f2, yM + 4, 19, 28, 'sm', '')}${text(X.b6f2, yM - 36, 'b₆f', 'lab fl09-b')}
    ${atps(X.atp, yM - 30, yM + 30, 12)}${text(X.atp, yS + 28, 'ATP synthase', 'sm')}
    ${hub(X.ps1, yM, 'PSI', 34, 10, 'start')}
    ${st(X.fd, yS, 'Fd', -24)}${st(X.fnr, yS, 'FNR', 40)}
    ${tag(X.out, yS - 64, 'NADPH', 'nadph')}
    ${routeKey()}
  `);
}

/* ---------- 9s · why they sit apart: the stromal gap is too narrow for PSI's and ATP synthase's stroma-side parts ---------- */

function sitApart(): string {
  const p = 'fl09s';
  // 10 px per nm for the three measured heights (Wietrzynski et al. 2025): gap 3.2, PSI 3.5, ATP synthase 12
  const nm = 10, gapH = 3.2 * nm, m = 26, lum = 60, sacH = 2 * m + lum;
  const T = 40, Bt = 440, edge = 380;                 // panel top and bottom, right margin of the granum
  const s2 = 196, s1 = s2 - gapH - sacH, s3 = s2 + sacH + gapH; // tops of sacs 1–3; sac 2 runs on as the lamella
  const top2 = s2, bot2 = s2 + sacH;                  // stroma-facing surfaces of the lamella
  const yMem = s2 + m / 2, yLum = s2 + m + lum / 2;   // membrane and lumen mid-lines of sac 2 and the lamella
  const win = `M21,${T} H779 V${Bt - 13} Q779,${Bt - 1} 767,${Bt - 1} H33 Q21,${Bt - 1} 21,${Bt - 13} Z`;
  // chloroplast edge in the bottom-right corner: outside it is cytosol, not stroma
  const R = 260, ex = 900, ey = 560;
  const envArc = (r: number): string => `M${ex - r},${ey} A${r},${r} 0 0 1 ${ex},${ey - r}`;
  const stack = `
    <defs><clipPath id="${p}-win"><path d="${win}"/></clipPath></defs>
    <rect class="fl09-panel" x="20" y="${T}" width="760" height="${Bt - T}" rx="14"/>
    <g clip-path="url(#${p}-win)">
      <rect class="fl09-stroma" x="0" y="${T}" width="800" height="${Bt - T}"/>
      <path class="fl09-cyto" d="M${ex - R},${ey} A${R},${R} 0 0 1 ${ex},${ey - R} V${ey} Z"/>
      <path class="fl09-env3" d="${envArc(R)}"/><path class="fl09-env3" d="${envArc(R - 8)}"/>
      ${sac(-60, s1, edge, s1 + sacH, m, 36)}${sac(-60, s3, edge, s3 + sacH, m, 36)}
      ${sac(-60, s2, 860, s2 + sacH, m, 36)}
    </g>`;

  // complexes
  const ridgeTop = top2 - 3.5 * nm, atpBot = bot2 + 12 * nm;
  const X = { ps2: 100, pq: 200, b6f: 338, pc: 398, ps1: 580, atp: 452, fd: 662, fnr: 724, b6f2: 740 };
  /** ATP synthase drawn to the same scale: stalk through the lamella's lower membrane, 12 nm stroma-side part below. */
  const atpTall = (x: number): string =>
    `<rect class="blob-stalk" x="${x - 13}" y="${bot2 - m - 4}" width="26" height="${m + 40}" rx="9"/>`
    + `<circle class="blob-atp" cx="${x - 26}" cy="${bot2 + 62}" r="30"/><circle class="blob-atp" cx="${x + 26}" cy="${bot2 + 62}" r="30"/><circle class="blob-atp" cx="${x}" cy="${atpBot - 30}" r="30"/>`;
  const cx = `
    ${psys(X.ps2, s2 + 20, 96, 60, 'PSII', 'sm fl09-b', 10)}
    ${pq(X.pq, yMem, 25, 14)}
    ${cytb6f(X.b6f, s2 + 30, 21, 42, 'sm fl09-b')}
    ${disc(X.pc, yLum + 4, 19, 'PC')}
    <rect class="blob-ps" x="${X.ps1 - 22}" y="${ridgeTop}" width="44" height="${top2 - ridgeTop + 10}" rx="6"/>
    ${psys(X.ps1, s2 + 24, 92, 56, '', '', 10)}${text(X.ps1 - 12, s2 + 32, 'PSI', 'sm fl09-b')}
    ${atpTall(X.atp)}
    ${cytb6f(X.b6f2, s2 + 30, 21, 42, 'sm fl09-b')}
    ${disc(X.fd, 124, 18, 'Fd')}${oval(X.fnr, 124, 30, 18, 'FNR')}${tag(X.fnr - 6, 62, 'NADPH', 'nadph')}
    ${water(166, yLum + 8)}${kPath(p, `M190,${yLum + 10} L210,${yLum + 10}`)}${text(214, yLum + 18, 'O₂ + H⁺', 'sm', 'start')}`;

  // the 3.2 nm gap continued as guides across the lamella: where the neighbouring discs would be
  const g1 = s1 + sacH, g2 = s3;
  const dim = (x: number, y0: number, y1: number): string => `<path class="fl09-dim" d="M${x - 6},${y0} H${x + 6} M${x},${y0} V${y1} M${x - 6},${y1} H${x + 6}"/>`;
  const guides = `
    <path class="fl09-guide2" d="M${edge},${g1} H780 M${edge},${g2} H780"/>
    ${dim(262, g1, s2)}${text(250, g1 + 23, '3.2 nm', 'sm fl09-b', 'end')}
    ${dim(X.ps1 - 32, ridgeTop, top2)}${text(X.ps1 - 42, top2 - 10, '3.5 nm', 'sm fl09-b', 'end')}
    ${dim(X.atp + 70, bot2, atpBot)}${text(X.atp + 82, (bot2 + atpBot) / 2 + 20, '12 nm', 'sm fl09-b', 'start')}`;

  const e = `
    ${ePath(p, `M152,${yLum + 2} L140,${s2 + 48}`, 'thin')}
    ${ePath(p, `M136,${s2 + 46} L136,${s2 + 4}`, 'boost')}
    ${ePath(p, `M150,${yMem} L170,${yMem}`, 'thin')}
    ${ePath(p, `M227,${yMem} L314,${yMem}`)}
    ${ePath(p, `M352,${s2 + 66} L376,${yLum + 2}`, 'thin')}
    ${ePath(p, `M419,${yLum + 4} L532,${yLum + 4}`)}
    ${ePath(p, `M${X.ps1 + 14},${s2 + 48} L${X.ps1 + 14},${ridgeTop + 6}`, 'boost')}
    ${ePath(p, `M${X.ps1 + 24},${ridgeTop + 4} L${X.fd - 20},136`, 'thin')}${ePath(p, `M${X.fd + 20},124 L${X.fnr - 32},124`, 'thin')}${ePath(p, `M${X.fnr - 6},106 L${X.fnr - 6},84`, 'thin')}
    ${bolt(p, 60, 60, 84, 182)}${bolt(p, 514, 58, 552, 156)}`;

  const labels = `
    ${text(200, 28, 'granum (stacked)', 'sm fl09-b')}${text(590, 28, 'stroma lamella (unstacked)', 'sm fl09-b')}
    ${text(200, s3 + m + lum / 2 + 9, 'lumen', 'fl09-note')}
    ${text(630, 414, 'stroma', 'fl09-note')}
    ${text(400, 92, 'thylakoid', 'sm', 'start')}${text(400, 118, 'membrane', 'sm', 'start')}${lead(440, 126, 440, top2 - 1)}
    ${text(780, 482, 'envelope: two membranes', 'sm', 'end')}${lead(736, 464, 742, 372)}
    ${text(24, 488, '1980: separated by breaking chloroplasts', 'sm', 'start')}
    ${text(24, 516, '2025: seen in intact chloroplasts, a sharp border', 'sm', 'start')}`;

  return svg(p, 'Close-up of a granum and the stroma lamella leaving it: the stromal gap between stacked discs is 3.2 nm, narrower than the stroma-side parts of PSI (3.5 nm) and ATP synthase (12 nm), so both sit in unstacked membrane; PQ carries electrons within the membrane and PC through the lumen from PSII in the granum to PSI in the lamella', `
    ${stack}${cx}${guides}${e}${labels}
    ${routeKey('PQ plastoquinone · b₆f cytochrome b₆f · PC plastocyanin · Fd ferredoxin', 'FNR ferredoxin–NADP⁺ reductase · Andersson & Anderson 1980; Wietrzynski et al. 2025')}
  `);
}

/* ---------- 9t · one cross-section: a single chloroplast, the route as one red thread from water to NADPH ---------- */

function oneSection(): string {
  const p = 'fl09t';
  const C = { x: 400, y: 272, rx: 380, ry: 230 };
  const m = 12, lum = 80, sh = 2 * m + lum, gap = 6, gx0 = 128, gx1 = 410;
  const s1 = 122, s2 = s1 + sh + gap, s3 = s2 + sh + gap;   // sac tops; sac 2 runs on as the stroma lamella
  const yL = s2 + m + lum / 2;                              // lumen mid-line of the route sac
  const lamEnd = 728;
  const sacs: Sac[] = [[gx0, s1, gx1, s1 + sh, 0], [gx0, s2, lamEnd, s2 + sh, 0], [gx0, s3, gx1, s3 + sh, 0]];
  const network = sacNetwork(sacs, m, ['fl09-n-mo', 'fl09-n-mf', 'fl09-n-lo', 'fl09-n-lf'], 34);

  const X = { ps2: 250, pq: 330, b6f: 386, pc: 444, ps1: 532, b6f2: 676, atp: 616, fd: 594, fnr: 656, out: 604 };
  const yP2 = s2 + 23, yP1 = s2 + 4;                         // PSII and PSI centres
  // one red thread, drawn under the complexes it passes through; the two light-driven crossings drawn solid on top
  const thread = `<path class="fl09-e" d="M${X.ps2 + 30},${yL + 10} V${s2 + 6} H${X.pq} L${X.b6f},${s2 + 18} L${X.pc},${yL + 16} Q${X.ps1 - 32},${yL + 28} ${X.ps1 + 24},${yP1 + 26} V${yP1 - 22} L${X.fd},${s2 - 52} L${X.fnr},${s2 - 60} L${X.out + 14},${s2 - 92}" marker-end="url(#${p}-e)"/>`;
  const body = `
    ${envelope(C.x, C.y, C.rx, C.ry, 8)}
    ${network}
    ${thread}
    ${psys(X.ps2, yP2, 84, 46, 'PSII', 'sm fl09-b', 8)}
    ${water(X.ps2 + 30, yL + 22)}${molecule(X.ps2 - 22, yL + 24, 'OO', 9)}${hion(X.ps2 - 66, yL + 24, 12)}
    ${pq(X.pq, s2 + 6, 25, 14)}
    ${cytb6f(X.b6f, s2 + 30, 18, 32, 'sm fl09-b')}
    ${disc(X.pc, yL + 16, 19, 'PC')}
    ${cytb6f(X.b6f2, s2 + 22, 21, 30, 'sm fl09-b')}
    ${psys(X.ps1, yP1, 84, 58, 'PSI', 'sm fl09-b', 9)}
    ${atpsDown(X.atp, s2 + sh - m, s2 + sh, 12)}${text(X.atp, s2 + sh + 70, 'ATP synthase', 'sm')}
    ${disc(X.fd, s2 - 52, 20, 'Fd')}${oval(X.fnr, s2 - 60, 32, 20, 'FNR')}${tag(X.out, s2 - 110, 'NADPH', 'nadph')}
    ${ePath(p, `M${X.ps2 + 30},${yP2 + 20} L${X.ps2 + 30},${s2 + 2}`, 'boost')}
    ${ePath(p, `M${X.ps1 + 24},${yP1 + 26} L${X.ps1 + 24},${yP1 - 24}`, 'boost')}
    ${bolt(p, 150, 54, 204, 226)}${bolt(p, 452, 70, 492, 170)}`;
  const labels = `
    ${text(24, 36, 'envelope: two membranes', 'sm', 'start')}${lead(84, 44, 104, 152)}
    ${text(776, 36, 'stroma lamella (unstacked)', 'sm', 'end')}${lead(716, 44, 716, s2 - 1)}
    ${text(24, 528, 'granum (stacked)', 'sm', 'start')}${lead(150, 510, 190, s3 + sh + 1)}
    ${text(776, 528, 'thylakoid membrane', 'sm', 'end')}${lead(704, 510, 704, s2 + sh + 1)}
    ${text(272, s1 + m + lum / 2 + 9, 'lumen', 'fl09-note')}
    ${text(470, 446, 'stroma', 'fl09-note')}`;

  return svg(p, 'One chloroplast in cross-section: the electron route runs as a red thread from water in the lumen of a granum disc, up through PSII into the membrane, by PQ to cytochrome b6f, down to PC in the lumen, along the lumen into the stroma lamella, up through PSI and out by Fd and FNR to NADPH in the stroma', `
    ${body}${labels}
    ${routeKey()}
  `);
}

const DRAW: Record<string, () => string> = {
  a: iconZ, b: mapAndZ, c: skiLifts, d: journey, e: bothAtOnce, f: twoLightTest, g: granaMap, h: equationLink, i: fourFrames, j: metroLine,
  p: zoomRoute, q: mapBesideZ, r: metroBands, s: sitApart, t: oneSection,
};

export function draw(id: string): string {
  return (DRAW[id] ?? zoomRoute)();
}
