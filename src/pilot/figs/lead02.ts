// Lead page for slide 2 in the live lecture: the question alone, one full-page drawing (viewBox 1600 x 900);
// the study page (l02.ts: A "Redirect vs remove", J "Colour grid") follows after the animation as the recap.
// Never reveals: no scattering, absorbing, reflecting, wavelengths or per-colour rays. Sun, leaf, eye and the
// photo are the study page's own (s2.ts), so the recap answers the picture the students guessed at.
import type { Variant } from '../types';
import './lead02.css';
import { T, defs, eye, leaf, photoBox, sun } from './s2';

// The lecturer's pick (26 Oct 2026). Unlisted variants (b, c, d, e, f) still draw by id.
export const VARIANTS: Variant[] = [
  { id: 'a', name: 'Photo' },
];

type Pt = [number, number];
const f = (v: number): string => v.toFixed(1);
const svg = (p: string, label: string, body: string): string =>
  `<svg class="fld02" viewBox="0 0 1600 900" role="img" aria-label="${label}">${defs(p)}${body}</svg>`;
const CREDIT = 'Photo: W.carter, CC BY-SA 4.0';

/** The question in Newsreader; each line is a tspan so the block measures as one label. */
function ask(x: number, y: number, size: number, lines: string[], gap = 1.12, anchor: 'start' | 'middle' = 'start'): string {
  return `<text class="lead-q" x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}">${lines
    .map((s, i) => `<tspan x="${x}" dy="${i ? f(size * gap) : 0}">${s}</tspan>`).join('')}</text>`;
}
/** The study page's Sun, scaled as a whole so rays and outline keep its proportions. */
const bigSun = (x: number, y: number, k: number): string => `<g transform="translate(${x} ${y}) scale(${k})">${sun(0, 0, 30)}</g>`;
/** White sunlight as a soft shaft from a to b, widening from w0 to w1: a white core in a soft glow, the same look
 *  for every target and no colours, so nothing is given away. The glow is warm on paper and white on the sky. */
function shaft(p: string, k: string, a: Pt, b: Pt, w0: number, w1: number, onSky = false): string {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), nx = -(b[1] - a[1]) / L, ny = (b[0] - a[0]) / L;
  const poly = (g: number): string => {
    const h0 = (w0 + g) / 2, h1 = (w1 + g) / 2;
    return [[a[0] + nx * h0, a[1] + ny * h0], [b[0] + nx * h1, b[1] + ny * h1], [b[0] - nx * h1, b[1] - ny * h1], [a[0] - nx * h0, a[1] - ny * h0]]
      .map(([x, y]) => `${f(x)},${f(y)}`).join(' ');
  };
  const id = `${p}-shaft${k}`;
  return `<defs><filter id="${id}" filterUnits="userSpaceOnUse" x="0" y="0" width="1600" height="900"><feGaussianBlur stdDeviation="7"/></filter></defs>
    <polygon class="${onSky ? 'fld02-glow-sky' : 'fld02-glow'}" points="${poly(14)}" filter="url(#${id})"/>
    <polygon class="fld02-core" points="${poly(0)}"/>`;
}
/** A clear sky, deep blue above and paler towards the horizon. */
const skyGrad = (id: string): string =>
  `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a82d6"/><stop offset="1" stop-color="#b4d6f3"/></linearGradient></defs>`;
const qm = (x: number, y: number, size: number, cls = 'fld02-qm'): string =>
  `<text class="${cls}" x="${x}" y="${y}" font-size="${size}" text-anchor="middle">?</text>`;

/* ---------- f · Photo band: the photo across the top of the page, the question calmly on the paper below ---------- */

function drawF(): string {
  // The band keeps the photo's clear sky (upper left) and its sunlit leaves side by side; the text gets the
  // lower third to itself, centred, so the page reads top to bottom: look, then ask.
  const p = 'fld02f';
  return svg(p, 'A wide photograph across the top of the page: sunlit green leaves against a clear blue sky. Below it, the question: why is the sky blue, and why are leaves green?', `
    ${photoBox(`${p}-clip`, 0, 0, 1600, 560, [0, 70, 800, 280], 0)}
    ${ask(800, 690, 66, ['Why is the sky blue, and why are leaves green?'], 1.12, 'middle')}
    ${T(800, 760, '', 'fld02-prompt', 'middle')}
    ${T(96, 866, CREDIT, 'fld02-credit')}
  `);
}

/* ---------- a · Photo: the leaves against the sky, and the question ---------- */

function drawA(): string {
  const p = 'fld02a';
  return svg(p, 'Photograph looking up at sunlit green leaves against a clear blue sky, beside the question: why is the sky blue, and why are leaves green?', `
    ${photoBox(`${p}-clip`, 0, 0, 720, 900, [40, 0, 480, 600], 0)}
    ${ask(800, 350, 80, ['Why is the sky blue,', 'and why are', 'leaves green?'])}
    ${T(802, 628, '', 'fld02-prompt')}
    ${T(802, 866, CREDIT, 'fld02-credit')}
  `);
}

/* ---------- b · Split scene: A's picture with the light left out ---------- */

/** A dashed path from y0 to y1 at x, broken around a question mark. */
const unknown = (x: number, y0: number, y1: number, qy: number): string =>
  `<path class="fld02-dash" d="M${x},${y0}V${qy - 62}M${x},${qy + 14}V${y1}"/>${qm(x, qy, 76)}`;

function drawB(): string {
  const p = 'fld02b';
  // A's layout at about 1.2x: the Sun on the seam, the sky left, the leaf right, an eye under each.
  // Sunlight reaches both; what travels on to each eye is the question.
  const S: Pt = [800, 262], W = { x: 380, y: 388, w: 340, h: 196 }, L: Pt = [1050, 478], ey = 748, qy = 682;
  const skyHit: Pt = [652, 400], leafHit: Pt = [1012, 462];
  const from = (t: Pt): Pt => { const d = Math.hypot(t[0] - S[0], t[1] - S[1]); return [S[0] + ((t[0] - S[0]) / d) * 46, S[1] + ((t[1] - S[1]) / d) * 46]; };
  return svg(p, 'One Sun above a split scene: the same sunlight falls on a patch of sky at left and on a leaf at right. An eye below each, and on the way to each eye a question mark. You see blue; you see green.', `
    ${skyGrad(`${p}-sky`)}
    ${ask(96, 140, 70, ['Why is the sky blue, and why are leaves green?'])}
    <path class="fld02-seam" d="M800,352V812"/>
    ${shaft(p, '1', from(skyHit), skyHit, 12, 64)}
    ${shaft(p, '2', from(leafHit), leafHit, 12, 64)}
    <rect x="${W.x}" y="${W.y}" width="${W.w}" height="${W.h}" rx="24" fill="url(#${p}-sky)"/>
    ${T(W.x + 28, W.y + W.h - 26, 'sky', 'fld02-lab-w')}
    ${leaf(L[0], L[1], 268, 108, -6)}
    ${T(L[0] + 152, L[1] - 2, 'leaf', 'fld02-lab')}
    ${bigSun(S[0], S[1], 1.25)}
    ${unknown(550, W.y + W.h + 14, ey - 44, qy)}
    ${unknown(L[0], L[1] + 64, ey - 44, qy)}
    ${eye(550, ey, 1.3)}${T(550, ey + 80, 'you see blue', 'fld02-lab', 'middle')}
    ${eye(L[0], ey, 1.3)}${T(L[0], ey + 80, 'you see green', 'fld02-lab', 'middle')}
  `);
}

/* ---------- c · Two questions, each with its own icon ---------- */

function drawC(): string {
  const p = 'fld02c';
  return svg(p, 'Two questions stacked, each with an icon. A patch of blue sky with the Sun: why is the sky blue? A leaf: why are leaves green?', `
    ${skyGrad(`${p}-sky`)}
    <rect x="160" y="182" width="184" height="184" rx="26" fill="url(#${p}-sky)"/>
    ${bigSun(300, 224, 0.72)}
    ${ask(420, 310, 104, ['Why is the sky blue?'])}
    ${leaf(256, 528, 214, 90, -32)}
    ${ask(420, 570, 104, ['Why are leaves green?'])}
    ${T(424, 720, 'Take a guess before we look.', 'fld02-prompt')}
  `);
}

/* ---------- d · Same sunlight: one beam crosses the sky and lands on a leaf ---------- */

function drawD(): string {
  const p = 'fld02d';
  const S: Pt = [508, 400], hit: Pt = [1096, 640];
  const d = Math.hypot(hit[0] - S[0], hit[1] - S[1]), a: Pt = [S[0] + ((hit[0] - S[0]) / d) * 58, S[1] + ((hit[1] - S[1]) / d) * 58];
  return svg(p, 'Same sunlight, two colours: a window of blue sky with the Sun in it; one beam of white sunlight crosses the sky and lands on a large green leaf.', `
    ${skyGrad(`${p}-sky`)}
    ${ask(96, 168, 100, ['Same sunlight. Two colours.'])}
    ${T(100, 240, 'Why the blue, and why the green?', 'fld02-prompt')}
    <rect x="380" y="300" width="840" height="500" rx="28" fill="url(#${p}-sky)"/>
    ${shaft(p, '1', a, hit, 20, 96, true)}
    ${bigSun(S[0], S[1], 1.6)}
    ${leaf(1170, 666, 420, 168, -24)}
  `);
}

/* ---------- e · Black boxes: white sunlight in, blue and green out ---------- */

function drawE(): string {
  const p = 'fld02e';
  const S: Pt = [250, 556], rows = [416, 696], bx = 700, bw = 180;
  const row = (i: number, y: number, name: string, c: 'b' | 'g', seen: string): string => {
    const t: Pt = [bx + 20, y], d = Math.hypot(t[0] - S[0], t[1] - S[1]);
    return `${shaft(p, `${i}`, [S[0] + ((t[0] - S[0]) / d) * 50, S[1] + ((t[1] - S[1]) / d) * 50], t, 10, 44)}
    <rect class="fld02-box" x="${bx}" y="${y - bw / 2}" width="${bw}" height="${bw}" rx="22"/>
    ${qm(bx + bw / 2, y + 36, 112, 'fld02-qm fld02-qm-w')}
    ${T(bx + bw / 2, y - bw / 2 - 18, name, 'fld02-lab', 'middle')}
    <path class="fld02-out fld02-out-${c}" d="M${bx + bw + 16},${y}H${1150}" marker-end="url(#${p}-h${c})"/>
    ${eye(1226, y, 1.4)}${T(1286, y + 10, seen, 'fld02-lab')}`;
  };
  return svg(p, 'One Sun sends the same white sunlight into two closed boxes marked with a question mark, one labelled air and one labelled leaf. Blue light comes out of the air box to an eye; green light comes out of the leaf box to an eye.', `
    ${ask(96, 140, 70, ['Why is the sky blue, and why are leaves green?'])}
    ${row(1, rows[0], 'air', 'b', 'you see blue')}
    ${row(2, rows[1], 'leaf', 'g', 'you see green')}
    ${bigSun(S[0], S[1], 1.5)}
  `);
}

export function draw(id: string): string {
  const d: Record<string, () => string> = { a: drawA, b: drawB, c: drawC, d: drawD, e: drawE, f: drawF };
  return (d[id] ?? drawA)();
}
