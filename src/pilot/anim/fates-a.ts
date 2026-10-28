// Animation 4 · "Fates of an excitation", staging A · "Energy ladder". The camera zooms into one chlorophyll and its
// energy-level diagram (Jablonski style) takes its place. An amber dot, the excited electron, moves between the levels;
// a small stopwatch shows each step's time scale. Beats: absorb (blue to a higher state Sₙ, red to S₁, fs) · relax (Sₙ → S₁ as heat,
// < 1 ps) · photochemistry (open reaction centre, trapping ≈ 0.3 ns in leaves) · fluorescence (closed centre, ≈ 685 nm after ns) · heat
// through a quencher (NPQ) · triplet (spin flip to T₁, µs; singlet oxygen; a carotenoid quenches it).
// Levels to scale from E = 1239.84 eV·nm / λ: S₁ 1.87 eV (662 nm), Sₙ 2.88 eV (430 nm); T₁ ≈ 1.3 eV.
import './fates-a.css';
import type { Staging } from './types';
import { wave } from '../mechanisms';

const P = 'fta';
type Pt = [number, number];
type A = 'start' | 'middle' | 'end';
type Ink = 'ink' | 'blue' | 'red' | 'grey' | 'green' | 'clay' | 'orange';

const f = (v: number): string => v.toFixed(1);
const clamp = (v: number, a = 0, b = 1): number => Math.max(a, Math.min(b, v));
const sm = (x: number): number => { const u = clamp(x); return u * u * (3 - 2 * u); };
const ramp = (t: number, a: number, b: number): number => sm((t - a) / (b - a));
const lerp = (a: number, b: number, k: number): number => a + (b - a) * k;
const lerpP = (a: Pt, b: Pt, k: number): Pt => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
const T = (x: number, y: number, s: string, cls: string, a: A = 'start'): string =>
  `<text class="${cls}" x="${f(x)}" y="${f(y)}" text-anchor="${a}">${s}</text>`;

/* ---------- the ladder (stage coordinates when the camera rests) ---------- */

const Y0 = 610, K = 170;
const eV = (nm: number): number => 1239.84 / nm;
const Y1 = Y0 - eV(662) * K, Y2 = Y0 - eV(430) * K, YT = Y0 - 1.3 * K;
const LX = 200;
/** Columns: blue and red absorption, Sₙ → S₁ heat, then the exits from S₁. */
const XB = 262, XH = 334, XR = 406, XF = 540, XN = 740, XT = 880;
/** The reaction centre, the acceptor, the triplet level, O₂ and the carotenoid. */
const RC = { x: 990, y: Y1 - 50, w: 180, h: 100 }, RCC: Pt = [RC.x + 36, Y1];
const ACC: Pt = [1318, Y1];
const T1X0 = 940, T1X1 = 1080;
const O2: Pt = [1170, YT + 92], CAR: Pt = [1170, YT + 212];
/** The quencher (NPQ), beside the heat drop. */
const QN: Pt = [820, (Y1 + Y0) / 2 + 18];

const NM = { blue: 430, red: 662, fl: 685 } as const;
const COL = { blue: '#2350e6', red: '#c8361e' } as const;

/** A photon as a wave packet in its colour (slide 4's look): wavelength in proportion, bell-shaped envelope. */
function packet(nm: number, len = 70, amp = 11): string {
  const lam = nm * 0.032, n = 90, pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const u = (i / n - 0.5) * len * 0.8, env = Math.exp(-((u / (len * 0.28)) ** 2)), v = Math.sin((2 * Math.PI * u) / lam) * amp * env;
    pts.push(`${i ? 'L' : 'M'}${f(u)},${f(v)}`);
  }
  return pts.join('');
}

const ar = (k: Ink, d: string, cls = ''): string =>
  `<path class="fa-ar fa-k-${k}${cls ? ` ${cls}` : ''}" pathLength="1" d="${d}" marker-end="url(#${P}-${k})"/>`;
const wv = (k: Ink, x0: number, y0: number, x1: number, y1: number, n: number, cls = ''): string =>
  `<path class="fa-ar fa-k-${k}${cls ? ` ${cls}` : ''}" pathLength="1" d="${wave(x0, y0, x1, y1, 6, n)}" marker-end="url(#${P}-${k})"/>`;
const lvl = (x0: number, x1: number, y: number, cls = 'fa-lvl'): string => `<path class="${cls}" d="M${f(x0)},${f(y)} H${f(x1)}"/>`;
const sub = (x0: number, x1: number, y: number): string => `<path class="fa-sub" d="M${f(x0)},${f(y - 10)} H${f(x1)} M${f(x0)},${f(y - 20)} H${f(x1)}"/>`;

/** A time pill, as on slide 12; its colour deepens from fs to µs. */
function pill(x: number, y: number, s: string, sc: 'fs' | 'ps' | 'ns' | 'us', a: A = 'end'): string {
  const w = Math.round(s.length * 12 + 30), x0 = a === 'start' ? x : a === 'end' ? x - w : x - w / 2;
  return `<rect class="tb tb-${sc}" x="${f(x0)}" y="${f(y - 18)}" width="${w}" height="36" rx="18"/>${T(x0 + w / 2, y + 8, s, 'fa-bt', 'middle')}`;
}

/** A carotenoid: a polyene zig-zag with a ring at each end (orange), as on slide 12. */
function carotenoid(cx: number, cy: number, len: number): string {
  const r = 10, x = cx - len / 2, hex = (hx: number): string =>
    `<path class="fa-car-ring" d="${Array.from({ length: 6 }, (_, i) => `${i ? 'L' : 'M'}${f(hx + r * Math.cos((Math.PI / 3) * i))},${f(cy + r * Math.sin((Math.PI / 3) * i))}`).join('')}Z"/>`;
  const a = x + r, b = x + len - r, n = Math.max(4, Math.round((b - a) / 11));
  const zz = Array.from({ length: n + 1 }, (_, i) => `${i ? 'L' : 'M'}${f(a + ((b - a) * i) / n)},${f(cy + (i % 2 ? -6 : 6))}`).join('');
  return `<path class="fa-car" d="${zz}"/>${hex(x)}${hex(x + len)}`;
}

/** O₂ as two touching atoms. */
const o2 = (x: number, y: number, r = 13): string =>
  [-1, 1].map(k => `<circle class="fa-atom" cx="${f(x + k * r * 0.78)}" cy="${f(y)}" r="${r}"/>${T(x + k * r * 0.78, y + 5.5, 'O', 'fa-atom-t', 'middle')}`).join('');

/* ---------- the chlorophyll the camera zooms into ---------- */

const MC: Pt = [800, 320];
function chlorophyll(): string {
  const R = 92, pr = 32;
  const rings = [45, 135, 225, 315].map(deg => {
    const a = (deg * Math.PI) / 180, cx = MC[0] + Math.cos(a) * R, cy = MC[1] + Math.sin(a) * R;
    const pts = Array.from({ length: 5 }, (_, i) => { const b = a + Math.PI + (i * 2 * Math.PI) / 5; return `${f(cx + Math.cos(b) * pr)},${f(cy + Math.sin(b) * pr)}`; });
    const inner: Pt = [cx + Math.cos(a + Math.PI) * pr, cy + Math.sin(a + Math.PI) * pr];
    return { d: `M${pts.join('L')}Z`, inner, c: [cx, cy] as Pt };
  });
  // the conjugated path: round the ring of four rings, through the bridges between them
  const loop = Array.from({ length: 8 }, (_, i) => {
    const a = ((45 * i) * Math.PI) / 180, r = i % 2 ? R + pr * 0.15 : R + 4;
    return `${f(MC[0] + Math.cos(a + Math.PI / 4) * r)},${f(MC[1] + Math.sin(a + Math.PI / 4) * r)}`;
  });
  const t0: Pt = [rings[0].c[0] + 26, rings[0].c[1] + 24];
  const tail = Array.from({ length: 15 }, (_, i) => `${i ? 'L' : 'M'}${f(t0[0] + i * 22)},${f(t0[1] + i * 9 + (i % 2 ? 12 : 0))}`).join('');
  return `<path class="fa-conj" d="M${loop.join('L')}Z"/>
    ${rings.map(r => `<path class="fa-mol" d="${r.d}"/><path class="fa-bond" d="M${f(MC[0])},${f(MC[1])}L${f(r.inner[0])},${f(r.inner[1])}"/>`).join('')}
    <path class="fa-mol fa-tail" d="${tail}"/>
    <circle class="fa-mg" cx="${MC[0]}" cy="${MC[1]}" r="20"/>${T(MC[0], MC[1] + 8, 'Mg', 'fa-mg-t', 'middle')}
    ${T(MC[0], MC[1] + 158, 'chlorophyll', 'fa-h', 'middle')}`;
}

/* ---------- the stopwatch ---------- */

const CK: Pt = [1450, 112], CR = 34;
const CLOCK_T = [
  { s: 'fs', sc: 'fs' }, { s: '< 1 ps', sc: 'ps' }, { s: '~300 ps', sc: 'ps' }, { s: 'ns', sc: 'ns' }, { s: '', sc: 'ns' }, { s: 'µs', sc: 'us' },
] as const;

/* ---------- the camera on the ladder: stage = (world − c) · s + SC ---------- */

interface Cam { s: number; c: Pt }
const SC: Pt = [800, 370];
const CAMS: Cam[] = [
  // Gentle leans toward each step's exit, chosen so the whole ladder and its labels stay in the frame.
  { s: 1.06, c: [700, 380] }, { s: 1.07, c: [680, 372] }, { s: 1.0, c: [800, 370] }, { s: 1.06, c: [700, 384] }, { s: 1.06, c: [740, 384] }, { s: 1.04, c: [800, 382] },
];

function svg(): string {
  const mk = (k: Ink): string => `<marker id="${P}-${k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path class="fa-hd-${k}" d="M0,0L10,5L0,10z"/></marker>`;
  const heatOut = (x: number, y: number, cls: string): string =>
    [-26, 0, 26].map(dx => `<path class="fa-ar fa-k-grey ${cls}" pathLength="1" d="${wave(x + dx, y - 24, x + dx * 1.6, y - 92, 5, 3)}" marker-end="url(#${P}-grey)"/>`).join('');
  return `<defs>${(['ink', 'blue', 'red', 'grey', 'green', 'clay', 'orange'] as Ink[]).map(mk).join('')}
    <radialGradient id="${P}-glow"><stop offset="0" stop-color="#f6c453" stop-opacity=".95"/><stop offset=".45" stop-color="#f6c453" stop-opacity=".45"/><stop offset="1" stop-color="#f6c453" stop-opacity="0"/></radialGradient>
  </defs>

  <g class="fa-molg">${chlorophyll()}</g>

  <g class="fa-ladv" opacity="0"><g class="fa-cam">
    <path class="fa-axis" d="M120,664 L120,78" marker-end="url(#${P}-grey)"/>
    <text class="fa-ax" transform="translate(98 372) rotate(-90)" text-anchor="middle">energy</text>
    ${lvl(LX, 560, Y2)}${sub(LX, 300, Y2)}${T(186, Y2 + 9, 'Sₙ', 'fa-lv', 'end')}
    ${lvl(LX, RC.x + 6, Y1)}${sub(LX, 300, Y1)}${T(186, Y1 + 9, 'S₁', 'fa-lv', 'end')}
    ${lvl(LX, 900, Y0)}${sub(LX, 300, Y0)}${T(186, Y0 + 9, 'S₀', 'fa-lv', 'end')}
    <path class="fa-br" d="M572,${f(Y2)} H584 V${f(Y1 - 14)}"/>${T(598, (Y2 + Y1) / 2 - 2, 'excited', 'fa-l')}${T(598, (Y2 + Y1) / 2 + 24, 'states', 'fa-l')}
    ${T(896, Y0 - 14, 'ground state', 'fa-l', 'end')}

    <g class="fa-g1">
      ${ar('blue', `M${XB},${Y0 - 3} L${XB},${f(Y2 + 6)}`, 'fa-up fa-upb')}${ar('red', `M${XR},${Y0 - 3} L${XR},${f(Y1 + 6)}`, 'fa-up fa-upr')}
      <g class="fa-pk fa-pkb"><path class="fa-wave" style="stroke:${COL.blue}" transform="rotate(90)" d="${packet(NM.blue, 92, 15)}"/></g>
      <g class="fa-pk fa-pkr"><path class="fa-wave" style="stroke:${COL.red}" transform="rotate(90)" d="${packet(NM.red, 92, 15)}"/></g>
      <g class="fa-plab fa-plab-b">${T(XB - 30, Y0 + 62, 'blue', 'fa-h fa-c-blue', 'end')}</g><g class="fa-plab fa-plab-r">${T(XR + 30, Y0 + 62, 'red', 'fa-h fa-c-red')}</g>
    </g>
    <g class="fa-g2" opacity="0">${wv('grey', XH, Y2 + 8, XH, Y1 - 8, 5, 'fa-hw')}${T(XH + 22, Y2 + 62, 'heat', 'fa-h')}</g>

    <g class="fa-g3" opacity="0">
      <g class="fa-rc"><rect class="fa-rcbox" x="${RC.x}" y="${RC.y}" width="${RC.w}" height="${RC.h}" rx="26"/>
        ${T(RC.x + RC.w / 2, RC.y - 18, 'reaction centre', 'fa-h fa-c-green', 'middle')}
        <g class="fa-open">${T(RC.x + 112, Y1 + 8, 'open', 'fa-l', 'middle')}</g>
        <g class="fa-closed" opacity="0">${T(RC.x + 112, Y1 + 8, 'closed', 'fa-l', 'middle')}<path class="fa-stop" d="M${RC.x - 16},${f(Y1 - 22)} V${f(Y1 + 22)}"/></g>
        <g class="fa-pm" opacity="0"><circle class="fa-pmr" cx="${RCC[0]}" cy="${RCC[1]}" r="17"/>${T(RCC[0] - 6, RCC[1] + 7, '+', 'fa-pmt', 'middle')}${T(RCC[0] + 7, RCC[1] + 6, '–', 'fa-pmt', 'middle')}</g>
      </g>
      ${ar('green', `M${XR + 16},${f(Y1)} L${RC.x - 10},${f(Y1)}`, 'fa-pc')}
      ${ar('green', `M${RC.x + RC.w + 4},${f(Y1)} L${ACC[0] - 72},${f(Y1)}`, 'fa-pe')}
      <rect class="fa-acc" x="${ACC[0] - 64}" y="${f(Y1 - 20)}" width="128" height="40" rx="12"/>${T(ACC[0], Y1 + 52, 'acceptor', 'fa-l', 'middle')}
      ${T((XR + RC.x) / 2 + 40, Y1 - 18, 'photochemistry', 'fa-h fa-c-green', 'middle')}
      <g class="fa-em" opacity="0"><circle class="fa-e" cx="0" cy="0" r="9"/>${T(0, 7, 'e⁻', 'fa-et', 'middle')}</g>
    </g>

    <g class="fa-g4" opacity="0">
      ${wv('red', XF, Y1 + 8, XF, Y0 - 8, 8, 'fa-fw')}
      <g class="fa-pk fa-pkf"><path class="fa-wave" style="stroke:${COL.red}" d="${packet(NM.fl, 76)}"/></g>
      <g class="fa-flab">${T(XF + 22, (Y1 + Y0) / 2 - 6, 'fluorescence', 'fa-h fa-c-red')}${T(XF + 22, (Y1 + Y0) / 2 + 22, '≈ 685 nm', 'fa-l')}</g>
    </g>

    <g class="fa-g5" opacity="0">
      ${wv('grey', XN, Y1 + 8, XN, Y0 - 8, 8, 'fa-nw')}
      <g class="fa-qg"><circle cx="${QN[0]}" cy="${QN[1]}" r="40" fill="url(#${P}-glow)" class="fa-qglow" opacity="0"/>${carotenoid(QN[0], QN[1], 72)}${T(QN[0], QN[1] + 40, 'quencher', 'fa-l', 'middle')}</g>
      ${heatOut(QN[0], QN[1] - 4, 'fa-qh')}
      ${T(XN, Y0 + 44, 'heat (NPQ)', 'fa-h', 'middle')}
    </g>

    <g class="fa-g6" opacity="0">
      ${ar('clay', `M${XT},${f(Y1 + 6)} L${T1X0 + 14},${f(YT - 8)}`, 'fa-sf')}${T(XT + 14, Y1 + 62, 'spin flip', 'fa-l fa-c-clay', 'end')}
      ${lvl(T1X0, T1X1, YT, 'fa-lvl fa-lvl-t')}${T(T1X1 + 14, YT + 9, 'T₁', 'fa-lv')}${T((T1X0 + T1X1) / 2, YT + 36, 'triplet state', 'fa-l', 'middle')}
      ${ar('clay', `M${T1X1 + 12},${f(YT + 22)} L${O2[0] - 30},${f(O2[1] - 40)}`, 'fa-to2')}
      <g class="fa-o2box" opacity="0"><rect class="fa-ros" x="${O2[0] - 54}" y="${f(O2[1] - 36)}" width="108" height="88" rx="14"/>${T(O2[0], O2[1] + 40, '¹O₂', 'fa-h', 'middle')}</g>
      ${o2(O2[0], O2[1])}${T(O2[0] - 66, O2[1] + 8, 'O₂', 'fa-h', 'end')}
      <g class="fa-sox" opacity="0">${T(O2[0] + 68, O2[1] + 2, 'singlet', 'fa-l')}${T(O2[0] + 68, O2[1] + 28, 'oxygen', 'fa-l')}</g>
      ${ar('orange', `M${O2[0]},${f(O2[1] + 56)} L${O2[0]},${f(CAR[1] - 18)}`, 'fa-toc')}
      ${carotenoid(CAR[0], CAR[1], 104)}${T(CAR[0], CAR[1] + 42, 'carotenoid', 'fa-h fa-c-orange', 'middle')}
      ${[0, 1].map(i => `<path class="fa-ar fa-k-grey fa-ch" pathLength="1" d="${wave(CAR[0] + 66, CAR[1] - 10 + i * 20, CAR[0] + 146, CAR[1] - 30 + i * 40, 5, 3)}" marker-end="url(#${P}-grey)"/>`).join('')}
    </g>

    ${['a', 'b'].map(k => `<g class="fa-dot fa-dot-${k}" opacity="0"><circle class="fa-dglow" r="26" fill="url(#${P}-glow)"/><circle class="fa-dcore" r="8"/>
      <path class="fa-spin" opacity="0" d="M0,7 V-6 M-4,-1 L0,-7 L4,-1"/></g>`).join('')}
  </g></g>

  <g class="fa-clock" opacity="0">
    <circle class="fa-watch" cx="${CK[0]}" cy="${CK[1]}" r="${CR}"/><rect class="fa-crown" x="${CK[0] - 7}" y="${CK[1] - CR - 11}" width="14" height="9" rx="2"/>
    ${Array.from({ length: 12 }, (_, i) => { const a = (i * Math.PI) / 6; return `<path class="fa-tick" d="M${f(CK[0] + Math.sin(a) * (CR - 4))},${f(CK[1] - Math.cos(a) * (CR - 4))}L${f(CK[0] + Math.sin(a) * (CR - (i % 3 ? 8 : 11)))},${f(CK[1] - Math.cos(a) * (CR - (i % 3 ? 8 : 11)))}"/>`; }).join('')}
    <path class="fa-hand" d="M${CK[0]},${CK[1] + 6} V${CK[1] - CR + 9}"/><circle class="fa-hub" cx="${CK[0]}" cy="${CK[1]}" r="4"/>
    ${CLOCK_T.map(c => `<g class="fa-ct" opacity="0">${c.s ? pill(CK[0] - CR - 16, CK[1], c.s, c.sc) : ''}</g>`).join('')}
  </g>`;
}

function bind(stage: SVGSVGElement): (beat: number, t: number) => void {
  const q = (s: string): SVGElement => stage.querySelector(s) as SVGElement;
  const qa = (s: string): SVGElement[] => Array.from(stage.querySelectorAll<SVGElement>(s));
  const memo = new Map<Element, Map<string, string>>();
  const set = (el: Element, k: string, v: string): void => {
    let m = memo.get(el);
    if (!m) memo.set(el, (m = new Map()));
    if (m.get(k) !== v) { m.set(k, v); el.setAttribute(k, v); }
  };
  const op = (el: Element, v: number): void => set(el, 'opacity', clamp(v).toFixed(3));
  /** Static things appear and leave whole, in a short fade. */
  const fade = (t: number, a: number): number => ramp(t, a, a + 0.3);
  const reveal = (el: Element, k: number): void => { op(el, k > 0.001 ? 1 : 0); set(el, 'stroke-dasharray', `${k.toFixed(4)} 2`); };

  const molg = q('.fa-molg'), ladv = q('.fa-ladv'), cam = q('.fa-cam');
  const g = [q('.fa-g1'), q('.fa-g2'), q('.fa-g3'), q('.fa-g4'), q('.fa-g5'), q('.fa-g6')];
  const upb = q('.fa-upb'), upr = q('.fa-upr'), pkb = q('.fa-pkb'), pkr = q('.fa-pkr'), plabB = q('.fa-plab-b'), plabR = q('.fa-plab-r'), hw = q('.fa-hw');
  const open = q('.fa-open'), closed = q('.fa-closed'), pm = q('.fa-pm'), rcbox = q('.fa-rcbox'), pc = q('.fa-pc'), pe = q('.fa-pe'), em = q('.fa-em');
  const fw = q('.fa-fw'), pkf = q('.fa-pkf'), flab = q('.fa-flab');
  const nw = q('.fa-nw'), qglow = q('.fa-qglow'), qh = qa('.fa-qh');
  const sf = q('.fa-sf'), to2 = q('.fa-to2'), o2box = q('.fa-o2box'), sox = q('.fa-sox'), toc = q('.fa-toc'), ch = qa('.fa-ch');
  const dots = [q('.fa-dot-a'), q('.fa-dot-b')], dglow = qa('.fa-dglow'), dcore = qa('.fa-dcore'), spin = q('.fa-dot-b .fa-spin');
  const clock = q('.fa-clock'), hand = q('.fa-hand'), cts = qa('.fa-ct');

  /** One dot: position, how visible, and how excited (0: a ground-state electron, 1: an excited one). */
  const dot = (i: number, p: Pt, o: number, ex: number): void => {
    set(dots[i], 'transform', `translate(${f(p[0])} ${f(p[1])})`);
    op(dots[i], o);
    op(dglow[i], ex);
    set(dcore[i], 'style', `fill:${ex > 0.5 ? '#f0a316' : '#3d3d3a'};stroke:${ex > 0.5 ? '#c98410' : '#141413'}`);
  };
  /** A point on a wavy drop at column x from y0 to y1, at fraction k (follows the drawn wave). */
  const onWave = (x: number, y0: number, y1: number, n: number, k: number): Pt => {
    const s = clamp(k), w = Math.sin(s * Math.PI * 2 * n) * 6 * Math.min(1, (1 - s) * 6);
    return [x - w, lerp(y0, y1, s)];
  };

  return (beat: number, t: number): void => {
    const b = Math.max(0, Math.min(5, beat));
    const at = (bb: number, k: number): number => (b === bb ? k : b > bb ? 1 : 0);

    // Beat 1 opens on the chlorophyll; the camera zooms into its ring of four rings, and the energy ladder takes its place.
    const z = b === 0 ? ramp(t, 0.2, 1.8) : 1;
    set(molg, 'transform', `translate(${MC[0]} ${MC[1]}) scale(${lerp(1, 4.5, z * z).toFixed(4)}) translate(${-MC[0]} ${-MC[1]})`);
    op(molg, b === 0 ? 1 - ramp(t, 1.0, 1.6) : 0);
    set(molg, 'style', b === 0 && t < 1.7 ? '' : 'display:none');
    const kl = b === 0 ? ramp(t, 1.0, 1.6) : 1;
    op(ladv, kl);

    // The camera on the ladder: each beat leans toward its exit (1.2 s), from where the last beat ended.
    const kc = ramp(t, 0, 1.2), c0 = b === 0 ? CAMS[0] : CAMS[b - 1], c1 = CAMS[b];
    const s = lerp(c0.s, c1.s, kc) * (b === 0 ? lerp(0.88, 1, kl) : 1), c = lerpP(c0.c, c1.c, kc);
    set(cam, 'transform', `translate(${f(SC[0] - c[0] * s)} ${f(SC[1] - c[1] * s)}) scale(${s.toFixed(4)})`);

    // Earlier steps stay as faint context once the next one starts; each new step appears once the camera has settled.
    const dim = (bb: number): number => (b < bb ? 0 : b === bb ? 1 : b === bb + 1 ? lerp(1, 0.32, fade(t, 0)) : 0.32);
    op(g[0], b === 0 ? 1 : dim(0));
    [1, 2, 3, 4, 5].forEach(i => op(g[i], b < i ? 0 : b === i ? fade(t, 1.2) : dim(i)));
    if (b >= 3) op(g[2], b === 3 ? 0.55 + 0.45 * (1 - fade(t, 0)) : 0.55);

    // Absorb: a blue photon lifts one electron to Sₙ, a red one lifts another to S₁, each in femtoseconds.
    const pb = b === 0 ? ramp(t, 2.4, 3.0) : 1, pr = b === 0 ? ramp(t, 3.25, 3.85) : 1;
    set(pkb, 'transform', `translate(${XB} ${f(lerp(790, Y0 + 52, pb))})`); op(pkb, b === 0 ? ramp(t, 2.4, 2.6) * (1 - ramp(t, 2.95, 3.1)) : 0);
    set(pkr, 'transform', `translate(${XR} ${f(lerp(790, Y0 + 52, pr))})`); op(pkr, b === 0 ? ramp(t, 3.25, 3.45) * (1 - ramp(t, 3.8, 3.95)) : 0);
    op(plabB, b === 0 ? fade(t, 2.4) : 1); op(plabR, b === 0 ? fade(t, 3.25) : 1);
    const ub = at(0, ramp(t, 2.95, 3.25)), ur = at(0, ramp(t, 3.8, 4.1));
    reveal(upb, ub); reveal(upr, ur);

    // The electrons: a ground-state dot that the photon lifts and lights up.
    let pa: Pt = [XB, lerp(Y0, Y2, ub)], oa = b === 0 ? fade(t, 1.8) : 1;
    const ea = ub;
    let ob = b === 0 ? fade(t, 1.8) : 1, eb = ur, posB: Pt = [XR, lerp(Y0, Y1, ur)];
    // Relax: the blue one drops from Sₙ to S₁ as heat, within a picosecond.
    if (b >= 1) {
      const k1 = at(1, ramp(t, 1.4, 1.7)), k2 = at(1, ramp(t, 1.7, 2.8));
      pa = k2 > 0 ? onWave(XH, Y2 + 8, Y1, 5, k2) : [lerp(XB, XH, k1), Y2];
      if (k2 >= 1) pa = [XH, Y1];
    }
    reveal(hw, at(1, ramp(t, 1.7, 2.8)));
    if (b >= 2) oa = b === 2 ? 1 - fade(t, 0) : 0;
    // Photochemistry: the reaction centre is open; the excitation reaches it and an electron leaves to the acceptor.
    const toRC = at(2, ramp(t, 1.5, 2.5));
    reveal(pc, toRC);
    if (b === 2) { posB = [lerp(XR, RCC[0], toRC), Y1]; ob = 1 - ramp(t, 2.5, 2.8); }
    op(pm, at(2, ramp(t, 2.5, 2.8)));
    const ke = at(2, ramp(t, 2.9, 3.7));
    reveal(pe, ke);
    set(em, 'transform', `translate(${f(lerp(RCC[0] + 30, ACC[0], ke))} ${f(Y1)})`);
    op(em, at(2, ramp(t, 2.8, 3.0)));
    // Fluorescence: the centre is closed (its acceptor is still full); the excitation waits nanoseconds, then
    // leaves as a slightly redder photon.
    op(open, 1 - at(3, fade(t, 1.2)));
    op(closed, at(3, fade(t, 1.2)));
    set(rcbox, 'class', b > 3 || (b === 3 && t > 1.35) ? 'fa-rcbox fa-rc-off' : 'fa-rcbox');
    if (b === 3) {
      const go = ramp(t, 1.8, 2.3), back = ramp(t, 2.35, 2.9), fall = ramp(t, 3.4, 4.1);
      posB = fall > 0 ? onWave(XF, Y1 + 8, Y0 - 4, 8, fall) : [back > 0 ? lerp(RC.x - 40, XF, back) : lerp(XR, RC.x - 40, go), Y1];
      ob = fade(t, 1.5) * (1 - ramp(t, 4.0, 4.2)); eb = 1;
    }
    reveal(fw, at(3, ramp(t, 3.4, 4.1)));
    const kf = at(3, ramp(t, 3.9, 5.0));
    set(pkf, 'transform', `translate(${f(lerp(XF + 40, XF + 330, kf))} ${f(Y0 - 60)})`);
    op(pkf, b === 3 ? ramp(t, 3.9, 4.1) * (1 - ramp(t, 4.7, 5.0)) : 0);
    op(flab, at(3, fade(t, 3.5)));
    // Heat (NPQ): in excess light a quencher takes the excitation and turns it into heat.
    if (b === 4) {
      const go = ramp(t, 1.8, 2.5), fall = ramp(t, 2.6, 3.5);
      posB = fall > 0 ? onWave(XN, Y1 + 8, Y0 - 4, 8, fall) : [lerp(XR, XN, go), Y1];
      ob = fade(t, 1.5) * (1 - ramp(t, 3.4, 3.6)); eb = 1;
    }
    reveal(nw, at(4, ramp(t, 2.6, 3.5)));
    op(qglow, b === 4 ? ramp(t, 2.8, 3.2) * (1 - ramp(t, 4.1, 4.5)) : 0);
    qh.forEach((e, i) => reveal(e, at(4, ramp(t, 3.3 + 0.12 * i, 4.0 + 0.12 * i))));
    // Triplet: the spin flips (T₁, lives µs); it passes its energy to O₂, giving singlet oxygen; a carotenoid quenches it.
    if (b === 5) {
      const go = ramp(t, 1.8, 2.4), drop = ramp(t, 2.7, 3.2), along = ramp(t, 3.2, 3.8);
      posB = drop > 0 ? (along > 0 ? [lerp(T1X0 + 18, T1X1 - 14, along), YT] : lerpP([XT, Y1], [T1X0 + 14, YT], drop)) : [lerp(XR, XT, go), Y1];
      ob = fade(t, 1.5) * (1 - ramp(t, 4.1, 4.3)); eb = 1;
    }
    op(spin, b === 5 ? fade(t, 1.5) : 0);
    set(spin, 'transform', `rotate(${b === 5 ? f(180 * ramp(t, 2.4, 2.7)) : 0})`);
    reveal(sf, at(5, ramp(t, 2.7, 3.2)));
    reveal(to2, at(5, ramp(t, 3.8, 4.2)));
    op(o2box, b === 5 ? ramp(t, 4.1, 4.4) * (1 - ramp(t, 5.0, 5.3)) : 0);
    op(sox, b === 5 ? ramp(t, 4.1, 4.4) : 0);
    reveal(toc, at(5, ramp(t, 4.6, 5.0)));
    ch.forEach((e, i) => reveal(e, at(5, ramp(t, 5.0 + 0.12 * i, 5.5 + 0.12 * i))));

    dot(0, pa, oa, ea);
    dot(1, posB, ob, eb);

    // The stopwatch: its hand sweeps once while the step happens; the pill says the time scale.
    const sweep = [[2.4, 4.0], [1.7, 2.8], [1.5, 3.7], [1.8, 4.1], [0, 0], [2.7, 3.8]][b];
    const kh = sweep[1] > sweep[0] ? ramp(t, sweep[0], sweep[1]) : 0;
    set(hand, 'transform', `rotate(${f(360 * kh)} ${CK[0]} ${CK[1]})`);
    op(clock, b === 0 ? fade(t, 2.1) : b === 4 ? 1 - fade(t, 0) : b === 5 ? fade(t, 0.2) : 1);
    cts.forEach((e, i) => op(e, i === b ? (b === 0 ? fade(t, 2.1) : fade(t, 0.15)) : i === b - 1 ? 1 - fade(t, 0) : 0));
  };
}

// One click per scene, as in the sky and life animations (lecturer, 27 Oct 2026): no holds inside a beat.

export const STAGING: Staging = {
  id: 'a',
  name: 'A · Energy ladder',
  note: 'A level diagram with a moving electron and a clock.',
  svg,
  bind,
};
