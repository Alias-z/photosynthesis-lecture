// Slide C10o, page figure w2: each column reads as a chain, top to bottom: how it copes → what it pays → what it gains →
// so it lives in (lecturer, 30 Oct 2026: "C₄ is extremely costly in energy; that's why it needs a sunny environment …
// CAM plants can live in deserts"). The drawn plant (figs/ov-plants.ts) heads each column, the share under its name;
// the key phrase of each column on a soft marker band. Texts from figs/ov-sum.ts. viewBox 1340 × 590, 1 unit per px.
import { COLS } from './ov-table';
import { PLANTS, PLANT_H, PLANT_HW } from './ov-plants';
import { SUM, f, INK, MUTE, TX, cell, nLines, markerDef, ital } from './ov-sum';

const W = 1340, H = 590, LW = 128, CW = (W - LW) / 4, PAD = 9, SZ = 17, LH = 21, N = 33, GAP = 26;
const cx = (i: number): number => LW + i * CW;
const MK = 'cw2-mk', RUST = '#a9532f';

export function draw(): string {
  const headH = 188, DW = 124;   // head: the drawing (DW wide) beside the name, plant and share
  const steps: Array<[string[], (k: number) => string]> = [
    [['How it', 'copes'], k => SUM[k].how],
    [['What it', 'pays'], k => SUM[k].cost],
    [['What it', 'gains'], k => SUM[k].gain],
    [['So it', 'lives in'], k => SUM[k].where],
  ];
  let y = headH + 14;
  const rowY = steps.map(([, t]) => { const y0 = y; y += Math.max(...SUM.map((_, k) => nLines(t(k), N))) * LH + 2 * PAD + GAP; return y0; });
  const rowH = (r: number): number => (r + 1 < rowY.length ? rowY[r + 1] : y) - rowY[r] - GAP;
  const heads = SUM.map((s, i) => {
    const x = cx(i) + 5, w = CW - 10, sh = cell(x + DW + 8, 112, s.share, 19, SZ, LH, INK, 400, MK).svg;
    const sc = Math.min(0.95, (headH - 16) / PLANT_H[i], (DW / 2 - 6) / PLANT_HW[i]);
    return `<rect x="${f(x)}" y="0" width="${f(w)}" height="${headH}" rx="12" style="fill:${COLS[i].tint}"/>
      ${PLANTS[i](x + DW / 2 + 2, headH - 8, sc)}
      ${TX(x + DW + 8, 52, s.name, 32, INK, 700)}${TX(x + DW + 8, 80, ital(s.plant), 17, MUTE)}${sh}`;
  }).join('');
  const boxes = steps.map(([, t], r) => SUM.map((_, i) => {
    const x = cx(i) + 5, w = CW - 10, y0 = rowY[r], h = rowH(r);
    const arrow = r < steps.length - 1 ? (() => {
      const ax = x + w / 2, a0 = y0 + h + 4, a1 = y0 + h + GAP - 4;
      return `<path d="M${f(ax)},${f(a0)} V${f(a1 - 1)}" style="fill:none;stroke:${RUST};stroke-width:2.6;stroke-linecap:round"/>
        <path d="M${f(ax - 7)},${f(a1 - 8)} L${f(ax)},${f(a1)} L${f(ax + 7)},${f(a1 - 8)}" style="fill:none;stroke:${RUST};stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round"/>`;
    })() : '';
    return `<rect x="${f(x)}" y="${f(y0)}" width="${f(w)}" height="${f(h)}" rx="10" style="fill:${COLS[i].tint};fill-opacity:0.45;stroke:${COLS[i].tint};stroke-width:1.6"/>
      ${cell(x + 10, y0 + PAD + SZ, t(i), N, SZ, LH, INK, 400, MK).svg}${arrow}`;
  }).join('')).join('');
  const labs = steps.map(([l], r) => l.map((s, j) => TX(0, rowY[r] + PAD + SZ + j * LH, s, SZ, MUTE, 700)).join('')).join('');
  return `<svg class="fig-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Four columns, C₃, C₂, C₄ and CAM, each headed by a drawing of a representative plant (wheat, Flaveria, maize, saguaro cactus) and its share of species, read as a chain from top to bottom: how it copes with scarce CO₂, what it pays, what it gains, and so where it lives. C₃ uses the CO₂ that diffuses in, the cheapest way, but suffers on hot, dry days, so it lives in cool to warm, moist regions. C₄ pumps CO₂ into the bundle sheath, pays 2 extra ATP per CO₂ and needs strong sun, saves water, and lives in hot, sunny grasslands. CAM takes CO₂ in at night, grows slowly, survives drought, and lives in deserts.">
    <defs>${markerDef(MK)}</defs>${heads}${boxes}${labs}</svg>`;
}
