// Slide 2 figure concepts. What each must show is in research/figure-briefs/FIGURE_BRIEF.md.
// Core: the colour we see is the light that reaches the eye. Air redirects light (blue most);
// leaves remove light (blue and red most), so what comes back from them is relatively green.
import './s2.css';
import photo from '../../assets/leaf-sky.jpg';
import { spec } from '../../lib/colour';

export const VARIANTS = [
  { id: 'a', name: 'Photo tags' },
  { id: 'b', name: 'Redirect vs remove' },
  { id: 'c', name: 'Spectrum chips' },
  { id: 'd', name: 'Mechanism strip' },
  { id: 'e', name: 'Two answers' },
];

const f = (v: number): string => v.toFixed(1);
export type Col = 'b' | 'g' | 'r';
/** Drawn wavelength in px, proportional to 450, 550 and 650 nm, so a scattered blue keeps its blue spacing. */
export const LAM: Record<Col, number> = { b: 450 / 22, g: 550 / 22, r: 650 / 22 };

export const T = (x: number, y: number, s: string, cls: string, anchor: 'start' | 'middle' | 'end' = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${anchor}">${s}</text>`;

/* ---------- shared parts ---------- */

/** Arrowheads for the three light colours, a soft card shadow and the amber glow of absorbed light. */
export const defs = (p: string): string => `<defs>
  ${(['b', 'g', 'r'] as Col[]).map(c => `<marker id="${p}-h${c}" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto"><path class="f2-h${c}" d="M0,0L10,5L0,10z"/></marker>`).join('')}
  <filter id="${p}-sh" x="-20%" y="-30%" width="140%" height="170%"><feDropShadow dx="0" dy="3" stdDeviation="6" flood-color="#1f2a3a" flood-opacity=".22"/></filter>
  <radialGradient id="${p}-glow"><stop offset="0" stop-color="#f0a316" stop-opacity=".9"/><stop offset="1" stop-color="#f0a316" stop-opacity="0"/></radialGradient>
</defs>`;

/** Light of one colour as a wave with a constant drawn wavelength; it starts and ends on its axis. */
export function wv(p: string, c: Col, x0: number, y0: number, x1: number, y1: number,
  o: { amp?: number; head?: boolean; ph?: number; k?: number; cls?: string } = {}): string {
  const amp = o.amp ?? 6, lam = LAM[c] * (o.k ?? 1), head = o.head ?? true;
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  const run = head ? L - 9 : L, ramp = lam * 0.7, n = Math.max(2, Math.ceil(run / 1.5));
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const d = (run * i) / n, e = Math.min(1, d / ramp, (run - d) / ramp);
    const w = Math.sin((2 * Math.PI * d) / lam + (o.ph ?? 0)) * amp * e;
    pts.push(`${i ? 'L' : 'M'}${f(x0 + ux * d - uy * w)},${f(y0 + uy * d + ux * w)}`);
  }
  if (head) pts.push(`L${f(x1)},${f(y1)}`);
  return `<path class="f2-w f2-w${c}${o.cls ? ` ${o.cls}` : ''}" d="${pts.join('')}"${head ? ` marker-end="url(#${p}-h${c})"` : ''}/>`;
}

/** Offset of the i-th of n parallel waves across a beam from (x0, y0) to (x1, y1). */
export function across(x0: number, y0: number, x1: number, y1: number, i: number, n: number, gap: number): [number, number] {
  const L = Math.hypot(x1 - x0, y1 - y0), s = (i - (n - 1) / 2) * gap;
  return [(-(y1 - y0) / L) * s, ((x1 - x0) / L) * s];
}

/** White light: blue, green and red waves side by side. */
export function beam(p: string, cols: Col[], x0: number, y0: number, x1: number, y1: number, gap: number,
  o: { amp?: number; head?: boolean; k?: number } = {}): string {
  return cols.map((c, i) => {
    const [ox, oy] = across(x0, y0, x1, y1, i, cols.length, gap);
    return wv(p, c, x0 + ox, y0 + oy, x1 + ox, y1 + oy, { ...o, ph: i * 1.3 });
  }).join('');
}

/** The photograph, cropped: the region (cx, cy, cw, ch) of the photo scaled to 800 × 600 fills the box. */
export function photoBox(id: string, x: number, y: number, w: number, h: number, crop: [number, number, number, number], r = 18): string {
  const [cx, cy, cw, ch] = crop, s = Math.max(w / cw, h / ch);
  const ix = x - cx * s + (w - cw * s) / 2, iy = y - cy * s + (h - ch * s) / 2;
  return `<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/></clipPath></defs>
    <g clip-path="url(#${id})"><image href="${photo}" x="${f(ix)}" y="${f(iy)}" width="${f(800 * s)}" height="${f(600 * s)}" preserveAspectRatio="none"/></g>`;
}

/** A white leader from a card to a ring on the photo. */
export function pointer(x0: number, y0: number, x1: number, y1: number): string {
  const L = Math.hypot(x1 - x0, y1 - y0), ex = x1 - ((x1 - x0) / L) * 10, ey = y1 - ((y1 - y0) / L) * 10;
  const d = `M${f(x0)},${f(y0)}L${f(ex)},${f(ey)}`;
  return `<path class="f2-lead-sh" d="${d}"/><path class="f2-lead" d="${d}"/>
    <circle class="f2-ring-sh" cx="${x1}" cy="${y1}" r="10"/><circle class="f2-ring" cx="${x1}" cy="${y1}" r="10"/><circle class="f2-ring-dot" cx="${x1}" cy="${y1}" r="3.2"/>`;
}

export const card = (p: string, x: number, y: number, w: number, h: number, r = 14): string =>
  `<rect class="f2-card" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" filter="url(#${p}-sh)"/>`;

export function sun(x: number, y: number, r: number): string {
  const rays = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6, c = Math.cos(a), s = Math.sin(a);
    return `M${f(x + c * (r + 8))},${f(y + s * (r + 8))}L${f(x + c * (r + 17))},${f(y + s * (r + 17))}`;
  }).join('');
  return `<path class="f2-ray" d="${rays}"/><circle class="f2-sun" cx="${x}" cy="${y}" r="${r}"/>`;
}

/** A front-view eye. */
export const eye = (x: number, y: number, s = 1): string =>
  `<path class="f2-eyeball" d="M${f(x - 30 * s)},${y} Q${x},${f(y - 27 * s)} ${f(x + 30 * s)},${y} Q${x},${f(y + 27 * s)} ${f(x - 30 * s)},${y}Z"/>
   <circle class="f2-iris" cx="${x}" cy="${y}" r="${f(10.5 * s)}"/><circle class="f2-pupil" cx="${x}" cy="${y}" r="${f(4.6 * s)}"/><circle class="f2-glint" cx="${f(x + 3.4 * s)}" cy="${f(y - 3.4 * s)}" r="${f(2.2 * s)}"/>`;

/** An air molecule (N₂ or O₂) as two touching atom balls; letters only when the balls are large enough. */
export function airMol(x: number, y: number, a: 'N' | 'O', ang: number, r = 13): string {
  const dx = Math.cos((ang * Math.PI) / 180) * r * 0.78, dy = Math.sin((ang * Math.PI) / 180) * r * 0.78;
  return [-1, 1].map(k => {
    const cx = x + k * dx, cy = y + k * dy;
    return `<circle class="atom f2-atom-${a}" cx="${f(cx)}" cy="${f(cy)}" r="${r}"/>${r >= 12 ? T(cx, cy + 5.5, a, 'f2-atom-t', 'middle') : ''}`;
  }).join('');
}

/** An illustrated leaf: blade, midrib, side veins and a short stalk. */
export function leaf(cx: number, cy: number, len: number, wid: number, rot: number): string {
  const h = len / 2, w = wid / 2;
  const blade = `M${-h},0 C${f(-h * 0.5)},${f(-w * 1.3)} ${f(h * 0.4)},${f(-w * 1.2)} ${h},0 C${f(h * 0.4)},${f(w * 1.2)} ${f(-h * 0.5)},${f(w * 1.3)} ${-h},0Z`;
  const veins = [-0.55, -0.2, 0.15, 0.48].map(t => {
    const x = t * h, reach = w * (0.78 - Math.abs(t + 0.1) * 0.35);
    return `M${f(x)},0 Q${f(x + h * 0.14)},${f(-reach * 0.55)} ${f(x + h * 0.3)},${f(-reach)}M${f(x)},0 Q${f(x + h * 0.14)},${f(reach * 0.55)} ${f(x + h * 0.3)},${f(reach)}`;
  }).join('');
  return `<g transform="translate(${cx} ${cy}) rotate(${rot})"><path class="f2-stalk" d="M${-h},0 L${-h - 22},5"/>
    <path class="f2-leaf" d="${blade}"/><path class="f2-vein" d="M${-h + 6},0 L${f(h * 0.9)},0${veins}"/></g>`;
}

/** Where absorbed light ends: a small amber glow (the excitation of later slides). */
export const glow = (p: string, x: number, y: number, r = 13): string =>
  `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="url(#${p}-glow)"/><circle class="f2-exc" cx="${f(x)}" cy="${f(y)}" r="${f(r * 0.3)}"/>`;

/** A short wave used as a colour key inside a card. */
export const keyWave = (p: string, c: Col, x: number, y: number, len = 40): string => wv(p, c, x, y, x + len, y, { amp: 5, head: false });

/* ---------- 2A · Annotated photo ---------- */

function drawA(): string {
  const p = 'f2a';
  return `<svg class="fig-svg f2" viewBox="0 0 800 600" role="img" aria-label="Photograph of green leaves against a blue sky, tagged: scattered sunlight rich in blue, and returned light rich in green">
    ${defs(p)}${photoBox(`${p}-clip`, 0, 0, 800, 600, [0, 0, 800, 600])}
    ${pointer(112, 72, 112, 158)}
    ${card(p, 24, 24, 408, 48, 24)}${keyWave(p, 'b', 46, 48)}
    <text class="f2-tag" x="102" y="56">scattered sunlight: <tspan class="f2-tag-b">rich in blue</tspan></text>
    ${pointer(556, 430, 556, 372)}
    ${card(p, 392, 430, 384, 48, 24)}${keyWave(p, 'g', 414, 454)}
    <text class="f2-tag" x="470" y="462">returned light: <tspan class="f2-tag-b">rich in green</tspan></text>
  </svg>`;
}

/* ---------- 2B · Redirect vs remove ---------- */

/** 2B, exported for slide L02: `p` prefixes every id so the drawing can appear twice on one page. */
export function drawB(p = 'f2b'): string {
  const S: [number, number] = [400, 84];
  // Left: the beam crosses the air molecules and carries on; blue is sent out sideways, red much less.
  const M: [number, number] = [198, 246];
  const dl = [M[0] - S[0], M[1] - S[1]], ll = Math.hypot(dl[0], dl[1]), ul = [dl[0] / ll, dl[1] / ll];
  const inL = [S[0] + ul[0] * 56, S[1] + ul[1] * 56], outL = [M[0] + ul[0] * 172, M[1] + ul[1] * 172];
  // Right: the beam reaches the leaf; blue and red stop there, green comes out underneath.
  const Lc: [number, number] = [606, 262];
  const hit: [number, number] = [588, 236];
  const dr = [hit[0] - S[0], hit[1] - S[1]], lr = Math.hypot(dr[0], dr[1]), ur = [dr[0] / lr, dr[1] / lr];
  const inR = [S[0] + ur[0] * 56, S[1] + ur[1] * 56];
  const ends = (['b', 'g', 'r'] as Col[]).map((c, i) => {
    const [ox, oy] = across(inR[0], inR[1], hit[0], hit[1], i, 3, 11);
    return { c, x0: inR[0] + ox, y0: inR[1] + oy, x1: hit[0] + ox, y1: hit[1] + oy };
  });
  return `<svg class="fig-svg f2" viewBox="0 0 800 600" role="img" aria-label="One Sun, two interactions: air molecules redirect blue light sideways to an eye; a leaf absorbs blue and red light and returns green light to an eye">
    ${defs(p)}<g transform="translate(0 12)">
    ${T(24, 44, 'Air redirects', 'f2-h')}${T(24, 74, 'blue ≈ 4.4× more than red', 'f2-s')}
    ${T(776, 44, 'Leaf absorbs', 'f2-h', 'end')}
    <path class="f2-div" d="M400,150V574"/>
    ${sun(S[0], S[1], 30)}

    ${beam(p, ['b', 'g', 'r'], inL[0], inL[1], outL[0], outL[1], 11, { head: true })}
    ${wv(p, 'b', M[0], M[1], 230, 444)}
    ${wv(p, 'b', M[0], M[1], 112, 162)}
    ${wv(p, 'b', M[0], M[1], 318, 262)}
    ${wv(p, 'r', M[0], M[1], 222, 154, { amp: 4, cls: 'f2-faint' })}
    ${airMol(M[0], M[1], 'N', 18, 14)}${airMol(330, 214, 'O', -30, 12)}${airMol(80, 262, 'N', 40, 12)}
    ${T(230, 310, 'air molecules', 'f2-s')}
    ${T(186, 452, 'same colour,', 'f2-s', 'end')}${T(186, 478, 'new direction', 'f2-s', 'end')}
    ${eye(232, 482)}${T(232, 548, 'you see blue', 'f2-cap', 'middle')}

    ${ends.map(e => e.c === 'g'
      ? wv(p, 'g', e.x0, e.y0, e.x1 + ur[0] * 14, e.y1 + ur[1] * 14, { head: false, ph: 1.3 })
      : wv(p, e.c, e.x0, e.y0, e.x1, e.y1, { head: false, ph: e.c === 'b' ? 0 : 2.6 })).join('')}
    ${leaf(Lc[0], Lc[1], 214, 86, -6)}
    ${ends.filter(e => e.c !== 'g').map(e => glow(p, e.x1, e.y1)).join('')}
    ${wv(p, 'g', 606, 300, 606, 448)}
    ${eye(606, 482)}${T(606, 548, 'you see green', 'f2-cap', 'middle')}
  </g></svg>`;
}

/* ---------- 2C · Spectrum chips ---------- */

export const NM0 = 400, NM1 = 680;
export const skyCurve = (nm: number): number => (NM0 / nm) ** 4;
export const leafCurve = (nm: number): number => 0.1 + 0.9 * Math.exp(-((nm - 550) ** 2) / (2 * 32 * 32));

export function specStops(): string {
  const n = (NM1 - NM0) / 10;
  return Array.from({ length: n + 1 }, (_, i) => {
    const c = spec(NM0 + i * 10).map(v => Math.round(v * 0.88 + 250 * 0.12));
    return `<stop offset="${(i / n).toFixed(3)}" stop-color="rgb(${c.join(',')})"/>`;
  }).join('');
}

/** A small card: what reaches the eye from one place, as a spectrum filled with its own colours. */
function chip(p: string, x: number, y: number, title: string, curve: (nm: number) => number): string {
  const W = 268, x0 = x + 24, x1 = x + W - 24, yb = y + 118, yt = y + 54;
  const X = (nm: number): number => x0 + ((nm - NM0) / (NM1 - NM0)) * (x1 - x0);
  const Y = (v: number): number => yb - v * (yb - yt);
  const pts: string[] = [];
  for (let nm = NM0; nm <= NM1; nm += 4) pts.push(`${f(X(nm))},${f(Y(curve(nm)))}`);
  return `${card(p, x, y, W, 168, 16)}
    ${T(x0, y + 36, title, 'f2-tag f2-tag-b')}
    <path fill="url(#${p}-spec)" d="M${f(x0)},${yb}L${pts.join('L')}L${f(x1)},${yb}Z"/>
    <path class="f2-curve" d="M${pts.join('L')}"/><path class="f2-base" d="M${f(x0)},${yb}H${f(x1)}"/>
    ${T(X(450), y + 146, 'blue', 'f2-axis', 'middle')}${T(X(550), y + 146, 'green', 'f2-axis', 'middle')}${T(X(650), y + 146, 'red', 'f2-axis', 'middle')}`;
}

function drawC(): string {
  const p = 'f2c';
  return `<svg class="fig-svg f2" viewBox="0 0 800 600" role="img" aria-label="Photograph of leaves against the sky with two small spectra: light from the sky is blue-heavy, light from a leaf is green-heavy">
    ${defs(p)}<defs><linearGradient id="${p}-spec">${specStops()}</linearGradient></defs>
    ${photoBox(`${p}-clip`, 0, 0, 800, 600, [0, 0, 800, 600])}
    ${pointer(112, 192, 112, 236)}
    ${chip(p, 24, 24, 'light from the sky', skyCurve)}
    ${pointer(572, 408, 556, 366)}
    ${chip(p, 508, 408, 'light from a leaf', leafCurve)}
  </svg>`;
}

/* ---------- 2D · Photo plus mechanism strip ---------- */

function drawD(): string {
  const p = 'f2d';
  const pin = (x: number, y: number, s: string, w: number): string =>
    `${card(p, x - w / 2, y - 20, w, 40, 20)}${T(x, y + 8, s, 'f2-tag f2-tag-b', 'middle')}`;
  // Scatter icon, centred on x = 200: the white beam passes on, blue leaves sideways.
  const my = 486;
  const scatter = `
    ${beam(p, ['b', 'g', 'r'], 40, my, 350, my, 10, { amp: 4.5, k: 0.85 })}
    ${wv(p, 'b', 196, my, 252, 438, { amp: 4.5, k: 0.85 })}${wv(p, 'b', 196, my, 140, 438, { amp: 4.5, k: 0.85 })}
    ${wv(p, 'b', 196, my, 248, 540, { amp: 4.5, k: 0.85 })}
    ${airMol(196, my, 'N', 30, 12)}`;
  // Absorb icon, centred on x = 600: blue and red stop at the leaf, green comes through.
  const lx = 596;
  const absorb = `
    ${beam(p, ['b', 'g', 'r'], 440, my, lx - 4, my, 10, { amp: 4.5, k: 0.85, head: false })}
    ${leaf(lx, my, 104, 44, -72)}
    ${glow(p, lx - 6, my - 10, 11)}${glow(p, lx - 2, my + 10, 11)}
    ${wv(p, 'g', lx + 14, my, 756, my, { amp: 4.5, k: 0.85 })}`;
  return `<svg class="fig-svg f2" viewBox="0 0 800 600" role="img" aria-label="Photograph of leaves and sky above a strip of two mechanism icons: air scatters blue, leaves absorb blue and red">
    ${defs(p)}${photoBox(`${p}-clip`, 0, 0, 800, 404, [0, 0, 800, 404])}
    ${pin(140, 168, 'sky', 76)}${pin(596, 330, 'leaf', 82)}
    <rect class="f2-strip" x="0" y="422" width="800" height="178" rx="18"/>
    <path class="f2-div" d="M400,440V584"/>
    ${scatter}${absorb}
    <text class="f2-cap" x="200" y="584" text-anchor="middle"><tspan class="f2-cap-b">scatter</tspan> · air redirects blue</text>
    <text class="f2-cap" x="600" y="584" text-anchor="middle"><tspan class="f2-cap-b">absorb</tspan> · leaf removes blue, red</text>
  </svg>`;
}

/* ---------- 2E · Two questions, two answers ---------- */

function drawE(): string {
  const p = 'f2e';
  const W = 388, H = 420;
  // A large question mark on each half of the photo; the answer sits under it.
  const ask = (cx: number): string =>
    `<circle class="f2-card" cx="${cx}" cy="${H / 2}" r="56" filter="url(#${p}-sh)"/>${T(cx, H / 2 + 28, '?', 'f2-qbig', 'middle')}`;
  const answer = (x: number, q: string, a: string, note: string): string =>
    `${T(x, 474, q, 'f2-q')}<text class="f2-ans" x="${x}" y="512">${a}</text>${T(x, 546, note, 'f2-s')}`;
  return `<svg class="fig-svg f2" viewBox="0 0 800 600" role="img" aria-label="The photo split into a sky half and a leaf half. Why blue? Air redirects blue light. Why green? Leaves remove blue and red light.">
    ${defs(p)}
    ${photoBox(`${p}-sky`, 0, 0, W, H, [0, 0, 195, 220])}
    ${photoBox(`${p}-leaf`, 800 - W, 0, W, H, [90, 215, 195, 220])}
    ${ask(W / 2)}${ask(800 - W / 2)}
    ${answer(4, 'Why blue?', 'Air <tspan class="f2-ans-b">redirects</tspan> blue light.', 'Same colour, new direction.')}
    ${answer(800 - W + 4, 'Why green?', 'Leaves <tspan class="f2-ans-b">remove</tspan> blue and red.', 'Green is absorbed too, just less.')}
  </svg>`;
}

export function draw(id: string): string {
  if (id === 'b') return drawB();
  if (id === 'c') return drawC();
  if (id === 'd') return drawD();
  if (id === 'e') return drawE();
  return drawA();
}
