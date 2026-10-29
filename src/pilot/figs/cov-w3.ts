// Slide C10o, page figure w3: each drawn plant (figs/ov-plants.ts) stands in its home, a scene strip from cool and moist
// (left) to desert (right); under it the share, where it lives and how it copes, then benefit and cost as 2 bands across
// the 4 columns (lecturer, 30 Oct 2026: "highlight the cost and benefits and the region they live"). The key phrase of
// each column on a soft marker band. Texts from figs/ov-sum.ts. viewBox 1340 × 590, 1 unit per px.
import { PLANTS, PLANT_H } from './ov-plants';
import { SUM, f, INK, MUTE, RULE, TX, cell, nLines, markerDef, ital } from './ov-sum';

const W = 1340, H = 590, LW = 128, CW = (W - LW) / 4, PAD = 8, SZ = 17, LH = 21, N = 33;
const cx = (i: number): number => LW + i * CW;
const MK = 'cw3-mk', MKH = 'cw3-mkh';   // the yellow marker; the mechanism's blue one
const SH = 194, GY = 168;   // the strip's height and its ground line

/** The homes, behind the plants: cloud and rain over a forest tree · a dry hillside · savanna sun, acacia, grass · desert sun and dunes. */
function scene(): string {
  const x = (i: number, d: number): number => cx(i) + d;
  const cloud = (cx0: number, cy0: number): string => `<g style="fill:#f7f9fb;stroke:#9fb0bf;stroke-width:1.3">
    <path d="M${cx0 - 38},${cy0 + 10} a14,14 0 0 1 12,-22 a20,20 0 0 1 36,-4 a14,14 0 0 1 24,10 a12,12 0 0 1 2,16 Z"/></g>
    <path d="M${cx0 - 24},${cy0 + 18} l-5,12 M${cx0 - 6},${cy0 + 18} l-5,12 M${cx0 + 12},${cy0 + 18} l-5,12 M${cx0 + 30},${cy0 + 18} l-5,12" style="fill:none;stroke:#7fa3c4;stroke-width:1.8;stroke-linecap:round"/>`;
  const sun = (sx: number, sy: number, r: number): string => `<circle cx="${f(sx)}" cy="${sy}" r="${r}" style="fill:#fff1b8;stroke:#e2b24a;stroke-width:1.5"/>`
    + Array.from({ length: 10 }, (_, k) => { const a = (k * Math.PI) / 5; return `<path d="M${f(sx + Math.cos(a) * (r + 5))},${f(sy + Math.sin(a) * (r + 5))} L${f(sx + Math.cos(a) * (r + 12))},${f(sy + Math.sin(a) * (r + 12))}" style="stroke:#e2b24a;stroke-width:1.8;stroke-linecap:round"/>`; }).join('');
  const tree = (tx: number): string => `<path d="M${tx - 4},${GY + 2} L${tx - 3},${GY - 46} L${tx + 3},${GY - 46} L${tx + 4},${GY + 2} Z" style="fill:#8a7457;stroke:#5f4f3a;stroke-width:1.2"/>
    <path d="M${tx - 40},${GY - 58} c-6,-28 22,-50 42,-40 c18,-14 46,4 38,30 c14,16 -2,38 -22,32 c-14,12 -42,10 -50,-4 c-18,0 -22,-14 -8,-18 Z" style="fill:#b5d39a;stroke:#6f9658;stroke-width:1.3"/>`;
  const acacia = (tx: number): string => `<path d="M${tx},${GY + 2} L${tx - 2},${GY - 40} M${tx - 2},${GY - 40} L${tx - 22},${GY - 62} M${tx - 2},${GY - 40} L${tx + 20},${GY - 64}" style="fill:none;stroke:#6f5a3d;stroke-width:4;stroke-linecap:round"/>
    <path d="M${tx - 62},${GY - 62} Q${tx - 50},${GY - 84} ${tx},${GY - 84} Q${tx + 52},${GY - 86} ${tx + 64},${GY - 64} Q${tx},${GY - 56} ${tx - 62},${GY - 62} Z" style="fill:#a9b874;stroke:#6f7d45;stroke-width:1.3"/>`;
  const tuft = (tx: number, c: string): string => `<path d="M${tx - 9},${GY + 2} Q${tx - 8},${GY - 10} ${tx - 14},${GY - 18} M${tx},${GY + 2} Q${tx + 1},${GY - 14} ${tx - 1},${GY - 24} M${tx + 8},${GY + 2} Q${tx + 8},${GY - 10} ${tx + 15},${GY - 17}" style="fill:none;stroke:${c};stroke-width:2;stroke-linecap:round"/>`;
  const dunes = `<path d="M${x(3, -40)},${GY + 2} Q${x(3, 70)},${GY - 40} ${x(3, 150)},${GY - 8} Q${x(3, 220)},${GY - 40} ${x(3, CW)},${GY - 14} V${GY + 2} Z" style="fill:#efd9a8;stroke:#cfae6c;stroke-width:1.2"/>`;
  const hill = `<path d="M${x(1, -30)},${GY + 2} Q${x(1, 140)},${GY - 34} ${x(1, CW + 30)},${GY + 2} Z" style="fill:#dcdcaa;stroke:none"/>`;
  return `<defs><linearGradient id="cw3-sky" x1="${LW}" x2="${W}" y1="0" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#dfe9f0"/><stop offset="0.38" stop-color="#eef0e2"/><stop offset="0.66" stop-color="#f8efd2"/><stop offset="1" stop-color="#fbe9c4"/></linearGradient>
    <linearGradient id="cw3-gnd" x1="${LW}" x2="${W}" y1="0" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0.08" stop-color="#b9d39c"/><stop offset="0.36" stop-color="#d3d8a2"/><stop offset="0.64" stop-color="#dfcb8c"/><stop offset="0.9" stop-color="#ecd49e"/></linearGradient>
    <clipPath id="cw3-clip"><rect x="${LW + 4}" y="0" width="${W - LW - 8}" height="${SH}" rx="14"/></clipPath></defs>
    <g clip-path="url(#cw3-clip)"><rect x="${LW}" y="0" width="${W - LW}" height="${SH}" style="fill:url(#cw3-sky)"/>
    ${cloud(x(0, 200), 34)}${tree(x(0, 262))}${hill}${sun(x(1, 250), 40, 14)}${sun(x(2, 250), 40, 19)}${acacia(x(2, 222))}${sun(x(3, 248), 40, 24)}${dunes}
    <rect x="${LW}" y="${GY}" width="${W - LW}" height="${SH - GY}" style="fill:url(#cw3-gnd)"/>
    ${tuft(x(1, 228), '#a59a52')}${tuft(x(1, 260), '#a59a52')}${tuft(x(2, 40), '#b8964a')}${tuft(x(2, 196), '#b8964a')}${tuft(x(2, 270), '#b8964a')}</g>
    <rect x="${LW + 4}" y="0" width="${W - LW - 8}" height="${SH}" rx="14" style="fill:none;stroke:#cfc8b6;stroke-width:1"/>`;
}

/** w3's options (its variants): the mechanism row first and on its own band; where they live under the share, not as a row. */
export interface W3 { howFirst?: boolean; howBand?: boolean; whereInHead?: boolean }
export function draw(): string { return drawW3({}); }
export function drawW3(o: W3): string {
  const plants = SUM.map((_, i) => PLANTS[i](cx(i) + 110, GY + 10, Math.min(0.95, (GY - 10) / PLANT_H[i]))).join('');
  // under the strip: name and plant, the share; then where it lives and how it copes; then the 2 bands
  const yName = SH + 34, yShare = yName + 26;
  const heads = SUM.map((s, i) => TX(cx(i) + PAD + 2, yName, s.name, 30, INK, 700)
    + TX(cx(i) + PAD + 2 + (s.name.length > 2 ? 86 : 48), yName - 1, ital(s.plant), 17, MUTE)
    + cell(cx(i) + PAD + 2, yShare, s.share, N, SZ, LH, INK, 400, MK).svg).join('');
  let y = yShare + Math.max(...SUM.map(s => nLines(s.share, N))) * LH - 6;
  // where they live, as a muted line under the share (w3b)
  const whereHead = o.whereInHead ? SUM.map((s, i) => cell(cx(i) + PAD + 2, y + LH, s.where, N + 4, 15, 19, MUTE, 400, MK).svg).join('') : '';
  if (o.whereInHead) y += Math.max(...SUM.map(s => nLines(s.where, N + 4))) * 19 + 4;
  type Row = [string[], (k: number) => string, string, string, string];
  const where: Row = [['Where', 'they live'], k => SUM[k].where, '', MUTE, MK];
  const how: Row = [['How it', 'copes'], k => SUM[k].how, o.howBand ? '#e1ecf4' : '', o.howBand ? '#2f5f86' : MUTE, MKH];
  const rows: Row[] = [
    ...(o.howFirst ? [how] : []), ...(o.whereInHead ? [] : [where]), ...(o.howFirst ? [] : [how]),
    [['Benefit'], k => SUM[k].gain, '#e3efd6', '#4a7537', MK],
    [['Cost'], k => SUM[k].cost, '#f6e0d3', '#9a4426', MK],
  ];
  const parts = rows.map(([lab, t, band, lc, mk]) => {
    if (band) y += 6;
    const y0 = y, h = Math.max(...SUM.map((_, k) => nLines(t(k), mk === MKH ? N - 5 : N))) * LH + 2 * PAD;
    y += h;
    const bg = band ? `<rect x="0" y="${f(y0)}" width="${W}" height="${f(h)}" rx="10" style="fill:${band}"/>`
      : `<path d="M0,${f(y0)} H${W}" style="stroke:${RULE};stroke-width:1.4"/>`;
    return bg + lab.map((s, j) => TX(band ? 12 : 0, y0 + PAD + SZ + j * LH, s, SZ, lc, 700)).join('')
      // the mechanism's bold words are wider: 4 characters fewer a line
      + SUM.map((_, i) => cell(cx(i) + PAD + 2, y0 + PAD + SZ, t(i), mk === MKH ? N - 5 : N, SZ, LH, INK, 400, mk).svg).join('');
  }).join('');
  return `<svg class="fig-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="A strip of 4 homes from cool and moist to desert, each with a drawing of a representative plant: wheat (C₃) under a rain cloud by a forest tree, Flaveria (C₂) on a warm, dry hillside, maize (C₄) in a sunny savanna, a saguaro cactus (CAM) among dunes. Under it, per type: share of species, where it lives and how it copes with scarce CO₂, then a green band of benefits (C₃ cheapest; C₄ saves water; CAM survives drought) and a rust band of costs (C₃ suffers on hot, dry days; C₄ needs strong sun to pay 2 extra ATP per CO₂; CAM grows slowly).">
    <defs>${markerDef(MK)}${markerDef(MKH, '#bcd8ee')}</defs>${scene()}${plants}${heads}${whereHead}${parts}</svg>`;
}
