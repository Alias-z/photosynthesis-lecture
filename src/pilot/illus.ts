// Illustrated parts after the lecturer's MSc thesis figures: atoms as balls, a lipid bilayer,
// green photosystems, an orange cytochrome b₆f, lightning photons and tagged ATP/NADPH.
import { arrow, heads, text } from './mechanisms';

/** A small molecule as touching atom balls, e.g. 'OCO' for CO₂ or 'OO' for O₂. */
export function molecule(x: number, y: number, atoms: string, r = 13): string {
  const n = atoms.length;
  return [...atoms].map((a, i) => {
    const cx = x + (i - (n - 1) / 2) * r * 1.55;
    return `<circle class="atom atom-${a}" cx="${cx.toFixed(1)}" cy="${y}" r="${r}"/><text class="atom-t atom-t-${a}" x="${cx.toFixed(1)}" y="${(y + r * 0.42).toFixed(1)}" text-anchor="middle">${a}</text>`;
  }).join('');
}

/** Water: one oxygen with two small hydrogens. */
export const water = (x: number, y: number): string =>
  `<circle class="atom atom-H" cx="${x - 12}" cy="${y + 9}" r="7"/><circle class="atom atom-H" cx="${x + 12}" cy="${y + 9}" r="7"/>${molecule(x, y, 'O', 12)}`;

/** O₂ and CO₂ as atom balls, and H⁺ as a ringed mark: the deck's one glyph set (lecturer, 28 Oct 2026). Every figure and
 *  animation draws molecules with these (or with figs/chain.ts's glyph mode, which uses the same classes). */
export const o2 = (x: number, y: number, r = 11): string => molecule(x, y, 'OO', r);
export const co2 = (x: number, y: number, r = 11): string => molecule(x, y, 'OCO', r);
export const hplus = (x: number, y: number, r = 12): string =>
  `<circle class="tag-h" cx="${x}" cy="${y}" r="${r}"/><text class="tag-ht" x="${x}" y="${(y + r * 0.42).toFixed(1)}" text-anchor="middle" style="font-size:${(r * 1.08).toFixed(1)}px">H⁺</text>`;

/** A tagged energy carrier or a proton. */
export function tag(x: number, y: number, s: string, kind: 'atp' | 'nadph' | 'pi' | 'h' | 'plain'): string {
  if (kind === 'h') return `<circle class="tag-h" cx="${x}" cy="${y}" r="13"/><text class="tag-ht" x="${x}" y="${y + 5}" text-anchor="middle">H⁺</text>`;
  if (kind === 'pi') return `<circle class="tag-pi" cx="${x}" cy="${y}" r="16"/><text class="tag-t" x="${x}" y="${y + 7}" text-anchor="middle">Pᵢ</text>`;
  const w = s.length * 12.5 + 26;
  return `<rect class="tag-${kind}" x="${x - w / 2}" y="${y - 17}" width="${w}" height="34" rx="10"/><text class="tag-t" x="${x}" y="${y + 7}" text-anchor="middle">${s}</text>`;
}

/** A lightning-bolt photon from one point to another. */
export function bolt(p: string, x0: number, y0: number, x1: number, y1: number): string {
  const dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy), nx = -dy / l, ny = dx / l;
  const pt = (s: number, o: number): string => `${(x0 + dx * s + nx * o).toFixed(1)},${(y0 + dy * s + ny * o).toFixed(1)}`;
  return `<path class="bolt" d="M${pt(0, 0)} L${pt(0.35, 12)} L${pt(0.45, -10)} L${pt(0.8, 8)} L${pt(0.9, 0)}" marker-end="url(#${p}-bolt)"/>`;
}

/** The marker set for illustrated figures: the shared inks plus an amber bolt head. */
export const illusHeads = (p: string): string =>
  `${heads(p)}<defs><marker id="${p}-bolt" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="hd-bolt" d="M0,0L10,5L0,10z"/></marker></defs>`;

/** A lipid bilayer: heads on both faces, tails pointing inwards. */
export function bilayer(p: string, x0: number, x1: number, top: number, bot: number): string {
  const h = bot - top;
  return `<defs><pattern id="${p}-lip" width="14" height="${h}" patternUnits="userSpaceOnUse" x="${x0}" y="${top}">
      <path class="lip-tail" d="M5,8 V${h * 0.42} M9,8 V${h * 0.42} M5,${h - 8} V${h * 0.58} M9,${h - 8} V${h * 0.58}"/>
      <circle class="lip-head" cx="7" cy="6" r="5.5"/><circle class="lip-head" cx="7" cy="${h - 6}" r="5.5"/></pattern></defs>
    <rect class="lip-bg" x="${x0}" y="${top}" width="${x1 - x0}" height="${h}"/><rect x="${x0}" y="${top}" width="${x1 - x0}" height="${h}" fill="url(#${p}-lip)"/>`;
}

/** Red dashed electron path, as in the thesis figure. */
export const epath = (p: string, d: string): string => arrow(p, 'red', d, 'epath');

/* ---------- electron transport, thesis style ---------- */

export function etcThesisSvg(): string {
  const p = 'ett';
  return `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="Illustrated light reactions in the thylakoid membrane">
    ${illusHeads(p)}
    ${text(24, 36, 'stroma (high pH)', 'note', 'start')}${text(786, 556, 'lumen (low pH)', 'note', 'end')}
    ${bilayer(p, 14, 786, 252, 338)}
    <rect class="blob-ps" x="50" y="196" width="160" height="198" rx="38"/>${text(130, 288, 'PSII &', 'lab lab-b')}${text(130, 316, 'antenna', 'lab lab-b')}
    <ellipse class="blob-pq" cx="246" cy="296" rx="24" ry="15"/>${text(246, 303, 'PQ', 'sm')}
    <ellipse class="blob-b6f" cx="318" cy="296" rx="40" ry="104"/>${text(318, 286, 'cyt', 'sm')}${text(318, 312, 'b₆f', 'lab lab-b')}
    <circle class="blob-small" cx="388" cy="402" r="19"/>${text(388, 409, 'PC', 'sm')}
    <rect class="blob-ps" x="422" y="196" width="160" height="198" rx="38"/>${text(502, 288, 'PSI &', 'lab lab-b')}${text(502, 316, 'antenna', 'lab lab-b')}
    <circle class="blob-small" cx="566" cy="160" r="18"/>${text(566, 167, 'Fd', 'sm')}
    ${tag(606, 116, 'NADP⁺', 'nadph')}${tag(606, 52, 'NADPH', 'nadph')}${arrow(p, 'ink', 'M606,98 L606,72')}${tag(662, 86, '', 'h')}
    <rect class="blob-stalk" x="662" y="236" width="40" height="120" rx="12"/>
    <circle class="blob-atp" cx="664" cy="186" r="26"/><circle class="blob-atp" cx="700" cy="186" r="26"/><circle class="blob-atp" cx="682" cy="156" r="26"/>
    ${text(682, 300, 'ATP', 'sm')}${text(682, 322, 'synth.', 'sm')}
    ${tag(752, 228, 'ADP', 'atp')}${tag(752, 182, '', 'pi')}${tag(752, 104, 'ATP', 'atp')}${arrow(p, 'ink', 'M752,162 L752,124')}
    ${bolt(p, 84, 62, 120, 188)}${bolt(p, 462, 62, 494, 188)}${text(126, 96, 'light', 'note', 'start')}
    ${water(92, 452)}${water(140, 470)}${arrow(p, 'ink', 'M116,500 L116,522')}${molecule(104, 542, 'OO', 12)}
    ${tag(176, 520, '', 'h')}${tag(206, 538, '', 'h')}${tag(178, 556, '', 'h')}${tag(214, 506, '', 'h')}
    ${text(24, 588, '2 H₂O → O₂ + 4 H⁺', 'sm', 'start')}
    ${epath(p, 'M118,436 L124,384')}${epath(p, 'M210,286 L220,290')}${epath(p, 'M270,296 L276,296')}${epath(p, 'M336,392 L366,402')}
    ${epath(p, 'M408,394 L436,372')}${epath(p, 'M540,198 L552,176')}${epath(p, 'M582,150 L592,138')}
    ${text(214, 268, 'e⁻', 'sm lbl-e')}
    ${tag(246, 212, '', 'h')}${arrow(p, 'proton', 'M246,226 L246,274')}
    ${tag(300, 438, '', 'h')}${tag(334, 456, '', 'h')}${tag(486, 446, '', 'h')}${tag(530, 470, '', 'h')}${tag(600, 448, '', 'h')}
    ${arrow(p, 'proton', 'M318,402 L318,422')}
    ${arrow(p, 'proton', 'M682,470 L682,214')}${tag(650, 482, '', 'h')}${tag(714, 482, '', 'h')}
    ${text(470, 516, 'H⁺ build up in the lumen', 'sm', 'start')}
    ${text(786, 588, 'per O₂: 8 photons → 2 NADPH + ≈ 2.6 ATP', 'sm', 'end')}
  </svg>`;
}

/* ---------- electron transport, Z-scheme above the membrane it describes ---------- */

export function zMembraneSvg(): string {
  const p = 'zm';
  const zx = { h2o: 70, ps2: 160, pheo: 214, pq: 262, b6f: 330, pc: 400, ps1: 490, fd: 572, fnr: 640, nadph: 724 };
  const c = (x: number, y: number, s: string, cls = 'node', w = 74): string =>
    `<rect class="${cls}" x="${x - w / 2}" y="${y - 15}" width="${w}" height="30" rx="15"/>${text(x, y + 7, s, 'sm')}`;
  const z = `
    ${c(zx.h2o, 282, 'H₂O')}${c(zx.ps2, 250, 'P680', 'node node-ps')}${c(zx.ps2, 46, 'P680*', 'node node-ps')}
    ${c(zx.pheo, 86, 'Pheo', 'node', 64)}${c(zx.pq, 130, 'PQ', 'node', 56)}${c(zx.b6f, 176, 'b₆f', 'node', 60)}${c(zx.pc, 214, 'PC', 'node', 56)}
    ${c(zx.ps1, 250, 'P700', 'node node-ps')}${c(zx.ps1, 30, 'P700*', 'node node-ps')}
    ${c(zx.fd, 88, 'Fd', 'node', 56)}${c(zx.fnr, 128, 'FNR', 'node', 64)}${c(zx.nadph, 170, 'NADPH', 'node node-out', 90)}
    ${arrow(p, 'ink', `M${zx.h2o + 30},274 L${zx.ps2 - 38},256`)}
    ${arrow(p, 'red', `M${zx.ps2},232 L${zx.ps2},64`, 'boost')}${arrow(p, 'red', `M${zx.ps1},232 L${zx.ps1},48`, 'boost')}
    ${arrow(p, 'ink', `M${zx.ps2 + 30},58 L${zx.pheo - 20},76`)}${arrow(p, 'ink', `M${zx.pheo + 20},98 L${zx.pq - 18},120`)}
    ${arrow(p, 'ink', `M${zx.pq + 18},142 L${zx.b6f - 22},166`)}${arrow(p, 'ink', `M${zx.b6f + 22},188 L${zx.pc - 22},206`)}
    ${arrow(p, 'ink', `M${zx.pc + 22},224 L${zx.ps1 - 40},244`)}
    ${arrow(p, 'ink', `M${zx.ps1 + 34},42 L${zx.fd - 22},78`)}${arrow(p, 'ink', `M${zx.fd + 22},98 L${zx.fnr - 24},118`)}${arrow(p, 'ink', `M${zx.fnr + 26},140 L${zx.nadph - 34},158`)}
    ${text(zx.ps2 - 14, 160, 'light', 'note', 'end')}${text(zx.ps1 - 14, 150, 'light', 'note', 'end')}`;
  const guides = [zx.h2o, zx.ps2, zx.pq, zx.b6f, zx.pc, zx.ps1, zx.fd, zx.nadph]
    .map(x => `<path class="guide" d="M${x},${x === zx.h2o ? 300 : 268} V346"/>`).join('');
  const m = `
    ${bilayer(p, 14, 786, 420, 496)}
    <rect class="blob-ps" x="${zx.ps2 - 46}" y="388" width="92" height="140" rx="30"/>${text(zx.ps2, 466, 'PSII', 'sm lab-b')}
    <ellipse class="blob-pq" cx="${zx.pq}" cy="458" rx="20" ry="13"/>${text(zx.pq, 464, 'PQ', 'sm')}
    <ellipse class="blob-b6f" cx="${zx.b6f}" cy="458" rx="30" ry="72"/>${text(zx.b6f, 464, 'b₆f', 'sm lab-b')}
    <circle class="blob-small" cx="${zx.pc}" cy="548" r="16"/>${text(zx.pc, 554, 'PC', 'sm')}
    <rect class="blob-ps" x="${zx.ps1 - 46}" y="388" width="92" height="140" rx="30"/>${text(zx.ps1, 466, 'PSI', 'sm lab-b')}
    <circle class="blob-small" cx="${zx.fd}" cy="372" r="16"/>${text(zx.fd, 378, 'Fd', 'sm')}
    ${tag(zx.nadph, 372, 'NADPH', 'nadph')}${water(zx.h2o, 552)}
    ${epath(p, `M${zx.h2o + 16},544 L${zx.ps2 - 48},510`)}${epath(p, `M${zx.ps2 + 46},458 L${zx.pq - 22},458`)}${epath(p, `M${zx.pq + 22},458 L${zx.b6f - 32},458`)}
    ${epath(p, `M${zx.b6f + 12},528 L${zx.pc - 16},544`)}${epath(p, `M${zx.pc + 16},542 L${zx.ps1 - 48},512`)}${epath(p, `M${zx.ps1 + 30},388 L${zx.fd - 12},386`)}${epath(p, `M${zx.fd + 18},370 L${zx.nadph - 50},372`)}
    ${text(786, 412, 'stroma', 'note', 'end')}${text(786, 590, 'lumen', 'note', 'end')}`;
  return `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="Z-scheme aligned above the thylakoid membrane complexes it describes">
    ${illusHeads(p)}${z}${guides}${m}
  </svg>`;
}

/* ---------- electron transport, illustrated Z-scheme ---------- */

export function zIllusSvg(): string {
  const p = 'zi';
  return `<svg class="fig-svg" viewBox="0 0 800 600" role="img" aria-label="Illustrated Z-scheme with photosystems as blobs, lightning photons and protons">
    ${illusHeads(p)}
    ${arrow(p, 'ink', 'M30,566 L30,40', 'axis-ar')}<text class="tl" transform="translate(18 300) rotate(-90)" text-anchor="middle">electron energy (more reducing ↑)</text>
    <rect class="blob-ps" x="128" y="96" width="104" height="420" rx="40"/>${text(180, 300, 'PSII', 'lab lab-b')}
    ${text(180, 492, 'P680', 'sm lab-b')}${text(180, 132, 'P680*', 'sm lab-b')}
    ${arrow(p, 'red', 'M180,470 L180,150', 'boost')}
    <rect class="blob-ps" x="476" y="40" width="104" height="436" rx="40"/>${text(528, 260, 'PSI', 'lab lab-b')}
    ${text(528, 454, 'P700', 'sm lab-b')}${text(528, 76, 'P700*', 'sm lab-b')}
    ${arrow(p, 'red', 'M528,430 L528,94', 'boost')}
    ${bolt(p, 78, 330, 126, 380)}${bolt(p, 426, 300, 474, 350)}${text(74, 322, 'light', 'note', 'end')}
    ${water(70, 520)}${water(106, 538)}${epath(p, 'M122,520 L146,506')}${molecule(62, 574, 'OO', 10)}${text(84, 580, '+ 4 H⁺', 'sm', 'start')}
    <ellipse class="blob-pq" cx="290" cy="214" rx="34" ry="20"/>${text(290, 221, 'PQ', 'sm')}
    <ellipse class="blob-b6f" cx="358" cy="300" rx="42" ry="56"/>${text(358, 296, 'cyt', 'sm')}${text(358, 320, 'b₆f', 'sm lab-b')}
    <circle class="blob-small" cx="420" cy="388" r="22"/>${text(420, 395, 'PC', 'sm')}
    ${epath(p, 'M232,150 L268,196')}${epath(p, 'M312,230 L330,258')}${epath(p, 'M384,350 L404,370')}${epath(p, 'M440,400 L482,430')}
    ${tag(330, 384, '', 'h')}${tag(300, 404, '', 'h')}${arrow(p, 'proton', 'M330,400 L330,446')}${text(330, 470, 'to lumen', 'sm')}
    <circle class="blob-small" cx="636" cy="140" r="22"/>${text(636, 147, 'Fd', 'sm')}
    ${epath(p, 'M580,92 L616,124')}${epath(p, 'M652,158 L690,196')}
    ${tag(716, 220, 'NADP⁺', 'nadph')}${arrow(p, 'ink', 'M716,238 L716,268')}${tag(716, 288, 'NADPH', 'nadph')}
  </svg>`;
}
