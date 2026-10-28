// ATP synthase, staging m1: the camera zooms into ATP synthase on the slide 10 figure and stays on its render. The
// rotor's 14 c-subunits show as stripes on the c-ring that turn with the H⁺ (one stripe, amber, marks one subunit so one
// turn can be followed; the same mark rides on the central stalk); the H⁺ take the slide's own path up through ATP
// synthase. The story, the timing, the card and the counter: atpsm-common.ts.
import atpsHref from '../../assets/chain/atps.webp';
import { f1, type Tf, type V } from './antenna-common';
import { B3, B3_END, glowAt, glyph, lab, leader, makeStaging, nCyclic, nPassed, type Close, type Geo } from './atpsm-common';

/** ATP synthase, close: figure x ≈ 313–1113 (ATP synthase 640–776 near the middle), y 90–460 (head to the lumen's floor). */
const Z: Tf = { s: 2.0, t: [790 - 708 * 2.0, -90 * 2.0] };
const N_C = 14;

/** The rotor on the render (render pixels → figure units): c-ring and central stalk, centre, radius, top, bottom. */
const rotor = (g: Geo): { ring: { cx: number; r: number; y0: number; y1: number }; stalk: { cx: number; r: number; y0: number; y1: number } } => {
  const [ix, iy] = g.img, px = g.px;
  return {
    ring: { cx: ix + 148 * px, r: 72 * px, y0: iy + 386 * px, y1: iy + 538 * px },
    stalk: { cx: ix + 160 * px, r: 46 * px, y0: iy + 290 * px, y1: iy + 386 * px },
  };
};
/** The leaders' ends (figure units): the rotor from the lumen at the right, the head from the stroma at the left. */
const L_ROTOR = { at: [796, 372] as V, from: [794, 362] as V, to: [722, 322] as V };
const L_HEAD = { at: [636, 112] as V, from: [640, 108] as V, to: [668, 140] as V };

const close: Close = {
  Z,
  svg(p, g) {
    const [ix, iy, iw, ih] = g.img, { ring, stalk } = rotor(g);
    const stripes = Array.from({ length: N_C }, (_, i) => `<rect data-k="cs${i}" class="am-cs" y="${f1(ring.y0)}" height="${f1(ring.y1 - ring.y0)}"/>`).join('');
    return `<defs><mask id="${p}-rmask" maskUnits="userSpaceOnUse" x="${f1(ix)}" y="${f1(iy)}" width="${f1(iw)}" height="${f1(ih)}" style="mask-type:alpha">
        <image href="${atpsHref}" x="${f1(ix)}" y="${f1(iy)}" width="${f1(iw)}" height="${f1(ih)}"/></mask></defs>
      <g mask="url(#${p}-rmask)">
        <g data-k="g-rotor" opacity="0"><rect class="am-glow" x="${f1(ring.cx - ring.r - 2)}" y="${f1(ring.y0)}" width="${f1(2 * ring.r + 4)}" height="${f1(ring.y1 - ring.y0)}"/>
          <rect class="am-glow" x="${f1(stalk.cx - stalk.r)}" y="${f1(stalk.y0)}" width="${f1(2 * stalk.r)}" height="${f1(stalk.y1 - stalk.y0 + 1)}"/></g>
        <rect data-k="g-head" class="am-glow" opacity="0" x="${f1(ix)}" y="${f1(iy)}" width="${f1(iw * 0.86)}" height="${f1(stalk.y0 - iy)}"/>
        <g data-k="stripes" opacity="0">${stripes}<rect data-k="cm" class="am-cm" y="${f1(ring.y0)}" height="${f1(ring.y1 - ring.y0)}"/>
          <rect data-k="sm" class="am-cm" y="${f1(stalk.y0)}" height="${f1(stalk.y1 - stalk.y0)}"/></g>
      </g>
      ${glyph('ld-rotor', leader(`M${L_ROTOR.from[0]},${L_ROTOR.from[1]}L${L_ROTOR.to[0]},${L_ROTOR.to[1]}`, L_ROTOR.to))}
      ${glyph('l-rotor', lab('rotor (c-ring)', 'chn-in chn-halo', 0, 0, 'start'))}
      ${glyph('ld-head', leader(`M${L_HEAD.from[0]},${L_HEAD.from[1]}L${L_HEAD.to[0]},${L_HEAD.to[1]}`, L_HEAD.to))}
      ${glyph('l-head', lab('head', 'chn-in chn-halo', 0, 0, 'end'))}`;
  },
  bind(S, g) {
    const { q, set, op } = S, { ring, stalk } = rotor(g);
    const put = (k: string, at: V, sc: number, o: number): void => {
      const el = q(k);
      op(el, o);
      if (o > 0.004) set(el, 'transform', `translate(${f1(at[0])} ${f1(at[1])}) scale(${sc.toFixed(4)})`);
    };
    /** A band on a turning cylinder at angle a (front at a = 0, moving right), width w at the front. */
    const band = (k: string, c: { cx: number; r: number }, a: number, w: number, vis: number): void => {
      const el = q(k), cs = Math.cos(a), x = c.cx + c.r * Math.sin(a), ww = Math.max(0.5, w * cs);
      op(el, cs > 0.02 ? vis * cs ** 0.5 : 0);
      if (cs > 0.02) { set(el, 'x', f1(x - ww / 2)); set(el, 'width', f1(ww)); }
    };
    return (t3, k, zoom) => {
      // the close view's own marks come and go with the zoom (beat 4: t3 = 99)
      const zv = Math.max(0, (zoom - 0.55) / 0.45);
      // point: each part is named, then glows
      const lr = (t3 < 0 ? 0 : Math.min(1, (t3 - B3.rotor) / 0.25)) * zv, lh = (t3 < 0 ? 0 : Math.min(1, (t3 - B3.head) / 0.25)) * zv;
      put('l-rotor', L_ROTOR.at, k, Math.max(0, lr));
      op(q('ld-rotor'), Math.max(0, lr));
      put('l-head', L_HEAD.at, k, Math.max(0, lh));
      op(q('ld-head'), Math.max(0, lh));
      op(q('g-rotor'), t3 < 0 || t3 > 50 ? 0 : 0.55 * glowAt(t3, B3.rotor + 0.1, 1.0));
      op(q('g-head'), t3 < 0 || t3 > 50 ? 0 : 0.5 * glowAt(t3, B3.head + 0.1, 1.0));
      // the rotor: 14 c-subunits; it moves on by 1/14 turn with each H⁺ that crosses
      // in beat 4 (cyclic) t3 runs on past beat 3's end: H⁺ 13 and 14 turn the rotor to 1 full turn
      const ang = (2 * Math.PI * (t3 > B3_END ? nCyclic(t3 - B3_END) : nPassed(Math.max(0, t3)))) / N_C;
      op(q('stripes'), zv);
      for (let i = 0; i < N_C; i++) band(`cs${i}`, ring, ang + (i * 2 * Math.PI) / N_C, 1.5, 1);
      band('cm', ring, ang + Math.PI / N_C - 0.9, (2 * Math.PI * ring.r) / N_C - 1.5, 1);
      band('sm', stalk, ang + Math.PI / N_C - 0.9, 6, 0.8);
    };
  },
  path: g => [[g.path[0][0] + 6, g.path[0][1] + 20], ...g.path],
  exits: Array.from({ length: 14 }, (_, j) => [656 + 9 * Math.sin(j * 2.4), 236 + 9 * Math.cos(j * 2.4)] as V),
  row: { x0: 140, y: 54, dx: 30 },
  adpFrom: [[846, 170], [840, 158], [834, 170]],
  sites: [[746, 194], [714, 170], [690, 196]],
  atpTo: [[904, 200], [904, 236], [904, 272]],
  zones: { stroma: [1092, 246] },
  cyclic: true,
};

export const STAGING = makeStaging({
  id: 'm1',
  name: 'm1 · Zoom on the slide figure',
  note: 'The slide 10 figure: H⁺ gather in the lumen (pH ≈ 6 vs 8), Jagendorf and Uribe, zoom into ATP synthase: rotor and head named, the 12 H⁺ of one O₂ turn the rotor 6/7, ADP + Pᵢ in, ≈ 2.6 ATP out (14 H⁺ = 1 turn = 3 ATP).',
  close,
});
