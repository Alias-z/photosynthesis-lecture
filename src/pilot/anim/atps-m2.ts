// ATP synthase, staging m2: the camera dives closer into ATP synthase on the slide 10 figure, and the render opens into a
// cut-away drawn over its own footprint: the rotor (c-ring of 14 c-subunits and the central stalk) turns; the stator
// (subunit a, the peripheral stalk) and the head stay. Each c-subunit carries one H⁺ round in the membrane. Where the ring
// passes subunit a, an H⁺ from the lumen comes up a's lumen-side half-channel onto the c-subunit there, which has just
// given its own H⁺ up a's stroma-side half-channel to the stroma; so each H⁺ that crosses moves the ring on by 1/14 turn
// (the c-subunit mechanism of Junge & Nelson 2015, Annu. Rev. Biochem. 84:631; 14 c-subunits in the chloroplast:
// Hahn et al. 2018). The 12 H⁺ of one O₂ cross: the counter reads 12 H⁺ → 6/7 turn → ≈ 2.6 ATP, then 14 H⁺ = 1 turn = 3 ATP. The story, the card and the counter: atpsm-common.ts.
//
// Geometry: drawn over the render's footprint (atps.webp in the slide figure, render pixels → figure units): the ring at
// the render's c-ring centre, a little wider than on the render so that a ringed H⁺ fits on each c-subunit at slide size.
// Subunit a sits beside the ring on the side of the peripheral stalk, as in the render (PDB 6FKF). The ring turns
// counterclockwise seen from the stroma (ATP synthesis), so its front face moves to the right, towards subunit a.
import atpsHref from '../../assets/chain/atps.webp';
import { clamp01, f1, lerp, lerpV, smooth, smoother, type Tf, type V } from './antenna-common';
import { along, glowAt, glyph, H_RING, lab, leader, makeStaging, nPassed, numH, PASS, rowSlot, whenAt, type Close, type Geo, type Row } from './atpsm-common';

/** ATP synthase, closer than m1: figure x ≈ 416–1031, y 110–395 (head to the lumen under the ring). */
const Z: Tf = { s: 2.6, t: [760 - 708 * 2.6, -110 * 2.6] };
const N_C = 14;
/** Beat 3 "point": the rotor, subunit a and the head are named and glow in turn (the click stop follows at 3.8 s). */
const PT = { rotor: 1.4, a: 2.1, head: 2.8 };

/** The cut-away's parts (figure units), from the render's box. */
function parts(g: Geo) {
  const [ix, iy] = g.img, px = g.px, cx = ix + 148 * px, hc = cx + 4;
  const ring = { cx, r: 37, y0: 270, y1: 330, hy: 300 }, R = cx + ring.r;
  return {
    ring, hc,
    gamma: { x: cx - 9, y: iy + 108, w: 18, h: 270 - (iy + 108) + 2 },
    lobes: [-1, 0, 1].map(i => ({ x: hc - 18 + 36 * i, y: iy + 14, w: 36, h: 96 })),
    delta: { x: hc + 16, y: iy + 4, w: R + 44 - (hc + 16), h: 16 },
    b: { x: R + 33, y: iy + 6, w: 11, h: 282 - (iy + 6) },
    a: { x: R + 1, y: 274, w: 46, h: 52 },
    inlet: [[R + 35, 354], [R + 31, 331], [R + 18, 314], [R + 3, 308]] as V[],
    outlet: [[R + 3, 292], [R + 16, 287], [R + 19, 275], [R + 12, 259], [R + 4, 245]] as V[],
  };
}
/** The leaders' ends (figure units). */
const L = {
  rotor: { at: [650, 244] as V, from: [654, 238] as V, to: [676, 288] as V, s: 'rotor (c-ring)', a: 'end' as const },
  a: { at: [806, 356] as V, from: [804, 346] as V, to: [770, 318] as V, s: 'subunit a', a: 'start' as const },
  head: { at: [636, 124] as V, from: [640, 120] as V, to: [664, 150] as V, s: 'head', a: 'end' as const },
};

/** Where c-subunit i gives its H⁺ to the stroma, and takes one from the lumen, in the rotor's progress (H⁺, mod 14):
 *  just before and just after it faces subunit a (angle π/2, progress 3.5 − i). */
const REL = (i: number): number => (((3.2 - i) % N_C) + N_C) % N_C;
const LOAD = (i: number): number => (((3.8 - i) % N_C) + N_C) % N_C;
/** The rotor's progress, shifted so that the c-subunit takes each H⁺ just as it arrives at the top of a's lumen-side
 *  half-channel (H⁺ j arrives at tE(j) + cross, when the progress is j + 0.8). */
const SHIFT = (() => {
  const target = PASS.t0 + 5 * PASS.gap + PASS.cross;
  let lo = 0, hi = 1;
  for (let it = 0; it < 40; it++) { const m = (lo + hi) / 2; if (nPassed(target - m) > 5.8) lo = m; else hi = m; }
  return (lo + hi) / 2;
})();
const prog = (t3: number): number => nPassed(t3 - SHIFT);
const T_REL = Array.from({ length: N_C }, (_, i) => whenAt(prog, REL(i)));
/** The order in which the c-subunits give their H⁺ to the stroma (0 = first); 12 do so while the 12 H⁺ cross. */
const EXIT_NO = (i: number): number => Math.round(REL(i) - 0.2);
/** The passed H⁺ wait, numbered by the order they left, in a row in the stroma right of ATP synthase (stage units). */
const ROW: Row = { x0: 990, y: 400, dx: 34 };
/** The note on the ring, under the rotor's name (figure units). */
const NOTE: V = [650, 261];

const rr = (k: string, r: { x: number; y: number; w: number; h: number }, cls: string, rx = 8): string =>
  `<rect${k ? ` data-k="${k}"` : ''} class="${cls}" x="${f1(r.x)}" y="${f1(r.y)}" width="${f1(r.w)}" height="${f1(r.h)}" rx="${rx}"/>`;

const close: Close = {
  Z,
  progress: prog,
  handover: true,
  upScale: 0.8,
  svg(p, g) {
    const P = parts(g), { ring } = P;
    const ringR = { x: ring.cx - ring.r, y: ring.y0, w: 2 * ring.r, h: ring.y1 - ring.y0 };
    const chan = (q: V[]): string => `M${q.map(v => `${f1(v[0])},${f1(v[1])}`).join('L')}`;
    const headSvg = (cls: string): string => P.lobes.map(l => rr('', l, cls, 16)).join('');
    return `<defs><linearGradient id="${p}-cyl" gradientUnits="userSpaceOnUse" x1="${f1(ring.cx - ring.r)}" y1="0" x2="${f1(ring.cx + ring.r)}" y2="0">
        <stop offset="0" stop-color="#5a2a40" stop-opacity=".35"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/><stop offset=".55" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#5a2a40" stop-opacity=".4"/></linearGradient>
        <clipPath id="${p}-ringclip">${rr('', ringR, '', 7)}</clipPath></defs>
      <g data-k="cut" opacity="0">
        ${rr('', P.b, 'am-stat', 5)}${rr('', P.delta, 'am-stat', 6)}
        ${rr('', P.gamma, 'am-rot', 4)}<rect data-k="gmk" class="am-cm" y="${f1(P.gamma.y)}" height="${f1(P.gamma.h)}"/>
        ${headSvg('am-head')}
        <g clip-path="url(#${p}-ringclip)">${rr('', ringR, 'am-rot', 7)}
          ${Array.from({ length: N_C }, (_, i) => `<rect data-k="cl${i}" class="am-cs" y="${ring.y0}" height="${ring.y1 - ring.y0}"/>`).join('')}
          <rect data-k="cmk" class="am-cm" y="${ring.y0}" height="${ring.y1 - ring.y0}"/>
          <rect x="${f1(ringR.x)}" y="${ringR.y}" width="${ringR.w}" height="${ringR.h}" fill="url(#${p}-cyl)"/></g>
        ${rr('', ringR, 'am-ol', 7)}
        ${rr('', P.a, 'am-stat', 10)}<path class="am-chan" d="${chan(P.inlet.slice(1))}"/><path class="am-chan" d="${chan(P.outlet.slice(0, 3))}"/>
        <g data-k="gw-rotor" opacity="0">${rr('', ringR, 'am-glow', 7)}${rr('', P.gamma, 'am-glow', 4)}</g>
        <g data-k="gw-a" opacity="0">${rr('', P.a, 'am-glow', 10)}</g>
        <g data-k="gw-head" opacity="0">${headSvg('am-glow')}</g>
        ${Array.from({ length: N_C }, (_, i) => glyph(`ro${i}`, H_RING) + glyph(`rn${i}`, H_RING) + numH(`xo${i}`, EXIT_NO(i) + 1)).join('')}
      </g>
      ${(['rotor', 'a', 'head'] as const).map(n => glyph(`ld-${n}`, leader(`M${L[n].from[0]},${L[n].from[1]}L${L[n].to[0]},${L[n].to[1]}`, L[n].to))
        + glyph(`l-${n}`, lab(L[n].s, 'chn-in chn-halo', 0, 0, L[n].a))).join('')}
      ${glyph('note', `${lab('each c-subunit', 'chn-in am-note chn-halo', 0, 0, 'end')}${lab('carries 1 H⁺ across', 'chn-in am-note chn-halo', 0, 31, 'end')}`)}`;
  },
  bind(S, g, stage) {
    const { q, set, op } = S, P = parts(g), { ring } = P;
    const render = Array.from(stage.querySelectorAll<SVGImageElement>('[data-k="chain"] image')).find(im => im.getAttribute('href') === atpsHref);
    const put = (k: string, at: V, sc: number, o: number): void => {
      const el = q(k);
      op(el, o);
      if (o > 0.004) set(el, 'transform', `translate(${f1(at[0])} ${f1(at[1])}) scale(${sc.toFixed(4)})`);
    };
    /** A span of the turning ring between angles a0 < a1 (front at 0, moving right), clipped to the front half. */
    const span = (el: Element, a0: number, a1: number, cx: number, r: number): void => {
      const w = (x: number): number => Math.atan2(Math.sin(x), Math.cos(x));
      let lo = w(a0), hi = lo + (a1 - a0);
      lo = Math.max(lo, -Math.PI / 2); hi = Math.min(hi, Math.PI / 2);
      if (hi <= lo) { op(el, 0); return; }
      op(el, 1);
      const x0 = cx + r * Math.sin(lo), x1 = cx + r * Math.sin(hi);
      set(el, 'x', f1(x0)); set(el, 'width', f1(Math.max(0.4, x1 - x0)));
    };
    return (t3, k, zoom) => {
      const cut = smooth((zoom - 0.45) / 0.4);
      put('note', NOTE, k, t3 < 0 ? 0 : clamp01((t3 - PASS.counter) / 0.3) * cut);
      op(q('cut'), cut);
      if (render) set(render, 'opacity', (1 - cut).toFixed(3));
      // point: rotor, subunit a, head, each named, then glowing
      (['rotor', 'a', 'head'] as const).forEach(n => {
        const o = t3 < 0 ? 0 : clamp01((t3 - PT[n]) / 0.25) * cut;
        put(`l-${n}`, L[n].at, k, o);
        op(q(`ld-${n}`), o);
        op(q(`gw-${n}`), t3 < 0 || t3 > 50 ? 0 : 0.55 * glowAt(t3, PT[n] + 0.1, 0.9));
      });
      // the rotor: 14 c-subunits, 1/14 turn for each H⁺ that crosses
      const n = Math.max(0, prog(t3)), phi = (2 * Math.PI * n) / N_C, step = (2 * Math.PI) / N_C;
      for (let i = 0; i < N_C; i++) {
        const b0 = phi + i * step - step / 2, cs = Math.cos(b0);
        const el = q(`cl${i}`);
        op(el, cs > 0.03 ? cs ** 0.5 : 0);
        if (cs > 0.03) { set(el, 'x', f1(ring.cx + ring.r * Math.sin(b0) - 0.7)); set(el, 'width', '1.4'); }
      }
      span(q('cmk'), phi - step / 2 - 0.9, phi + step / 2 - 0.9, ring.cx, ring.r);
      span(q('gmk'), phi - 0.3 - 0.9, phi + 0.3 - 0.9, P.gamma.x + P.gamma.w / 2, P.gamma.w / 2);
      // the H⁺ on the c-subunits: seen on the front half; each gives its H⁺ to the stroma and takes one from the lumen
      // as it passes subunit a
      const hk = k * 0.8;
      for (let i = 0; i < N_C; i++) {
        // (only on the middle of the front, where the c-subunits are wide enough for the glyph; the hand-overs at the
        // edge are shown by the H⁺ moving in the half-channels)
        const a = phi + i * step, at: V = [ring.cx + ring.r * Math.sin(a), ring.hy], vis = clamp01((Math.cos(a) - 0.5) / 0.25);
        const rel = REL(i), load = LOAD(i);
        put(`ro${i}`, at, hk, n < rel ? vis : 0);
        put(`rn${i}`, at, hk, n >= load && t3 >= PASS.t0 - 0.5 ? vis : 0);
        // the released H⁺: up a's stroma-side half-channel into the stroma, then, numbered, to its place in the row
        const e = EXIT_NO(i), tr = t3 > 50 ? 99 : t3 - T_REL[i], w = (tr - 0.55) / 0.7;
        const xat = w > 0 ? lerpV(P.outlet[P.outlet.length - 1], rowSlot(Z, ROW, e), smoother(w)) : along(P.outlet, smooth(tr / 0.55));
        put(`xo${i}`, xat, w > 0 ? lerp(k, k * 0.75, smooth(w)) : lerp(hk, k, smooth(tr / 0.55)), e < 12 && (t3 > 50 || (t3 >= 0 && tr >= 0)) ? 1 : 0);
        op(q(`xo${i}n`), e < 12 ? clamp01(tr / 0.25) : 0);
      }
    };
  },
  path: g => parts(g).inlet,
  exits: [],
  adpFrom: [[846, 170], [840, 158], [834, 170]],
  sites: [[740, 190], [704, 172], [668, 190]],
  atpTo: [[904, 196], [904, 232], [904, 268]],
  zones: { stroma: [1020, 246], lumen: [1020, 388] },
};

export const STAGING = makeStaging({
  id: 'm2',
  name: 'm2 · Cut-away with a turn counter',
  note: 'The slide 10 figure: H⁺ gather in the lumen (pH ≈ 6 vs 8), Jagendorf and Uribe, then ATP synthase opened up: each H⁺ enters subunit a from the lumen onto a c-subunit, the ring turns 1/14, an H⁺ leaves to the stroma; 12 H⁺ → 6/7 turn → ≈ 2.6 ATP (14 H⁺ = 1 turn = 3 ATP).',
  close,
});
