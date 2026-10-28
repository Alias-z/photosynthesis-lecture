// RuBisCO forms for the slide 15 evolution story (anim/c2story-evo.ts; lecturer, 29 Oct 2026: "the RuBisCO you made look
// exactly the same"): the biological assemblies of form III (1GEH, Thermococcus kodakarensis, (L2)5 ring), form II
// (9RUB, Rhodospirillum rubrum, L2), form IB (1RBL, Synechococcus PCC 6301, L8S8) and form ID (1BWV, Galdieria
// partita, L8S8), in the look and at the scale of scripts/rf_rubisco_render.mjs (spinach 8RUC; helpers copied unchanged).
//
//   node scripts/rf_forms_render.mjs <assembly mmCIF> <out png> <ring | pair | l8s8>
//
// Inputs: https://files.rcsb.org/download/<ID>-assembly1.cif.gz (gunzipped).
// Views: ring, down the ring axis (the flattest principal axis), tilted 18°; pair, the longest axis across; l8s8, side
// view with the four-fold axis vertical (the principal axis that best separates the small subunits), turned ROT degrees.
// Colour: large subunits alternate two tones in their order round the axis; small subunits pale, one tone per layer.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const [, , inFile, outFile, mode] = process.argv;
const PX = +(process.env.PX ?? 4);
const SS = 2;
const R_ATOM = 1.75;
const SKIP = new Set(['HOH']);
/* ---------- mmCIF atom_site ---------- */
function readAtoms(file) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const i0 = lines.findIndex((l, i) => l.startsWith('loop_') && lines[i + 1].startsWith('_atom_site.'));
  const cols = [];
  let j = i0 + 1;
  while (lines[j].startsWith('_atom_site.')) cols.push(lines[j++].slice(11).trim());
  const c = (n) => cols.indexOf(n);
  const [ig, it, iat, icomp, ix, iy, iz, ich, iseq, imod] = ['group_PDB', 'type_symbol', 'label_atom_id', 'label_comp_id', 'Cartn_x', 'Cartn_y', 'Cartn_z', 'auth_asym_id', 'auth_seq_id', 'pdbx_PDB_model_num'].map(c);
  const atoms = [];
  for (; j < lines.length && (lines[j].startsWith('ATOM') || lines[j].startsWith('HETATM')); j++) {
    const t = lines[j].split(/\s+/);
    if (t[imod] !== '1' || t[it] === 'H' || SKIP.has(t[icomp])) continue;
    atoms.push({ het: t[ig] === 'HETATM', el: t[it], name: t[iat].replace(/"/g, ''), comp: t[icomp], chain: t[ich], seq: +t[iseq], p: [+t[ix], +t[iy], +t[iz]] });
  }
  return atoms;
}

/* ---------- small vector algebra ---------- */
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => mul(a, 1 / Math.hypot(...a));
const mean = (ps) => mul(ps.reduce((s, p) => add(s, p), [0, 0, 0]), 1 / ps.length);

/** Symmetric 3×3 eigen-decomposition (Jacobi); returns [values, vectors as rows], ascending. */
function eig3(A) {
  const a = A.map(r => r.slice()), v = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  for (let it = 0; it < 60; it++) {
    let p = 0, q = 1;
    for (const [i, k] of [[0, 1], [0, 2], [1, 2]]) if (Math.abs(a[i][k]) > Math.abs(a[p][q])) { p = i; q = k; }
    if (Math.abs(a[p][q]) < 1e-12) break;
    const th = 0.5 * Math.atan2(2 * a[p][q], a[q][q] - a[p][p]), c = Math.cos(th), s = Math.sin(th);
    for (let k = 0; k < 3; k++) { const x = a[k][p], y = a[k][q]; a[k][p] = c * x - s * y; a[k][q] = s * x + c * y; }
    for (let k = 0; k < 3; k++) { const x = a[p][k], y = a[q][k]; a[p][k] = c * x - s * y; a[q][k] = s * x + c * y; }
    for (let k = 0; k < 3; k++) { const x = v[k][p], y = v[k][q]; v[k][p] = c * x - s * y; v[k][q] = s * x + c * y; }
  }
  const vals = [0, 1, 2].map(i => a[i][i]), order = [0, 1, 2].sort((i, k) => vals[i] - vals[k]);
  return [order.map(i => vals[i]), order.map(i => [v[0][i], v[1][i], v[2][i]])];
}
function cov(ps) {
  const m = mean(ps), C = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (const p of ps) { const d = sub(p, m); for (let i = 0; i < 3; i++) for (let k = 0; k < 3; k++) C[i][k] += d[i] * d[k]; }
  return C;
}
/** Rotation axis of the best rotation taking point set P onto Q (Kabsch via Horn's quaternion). */
function rotAxis(P, Q) {
  const mp = mean(P), mq = mean(Q);
  const S = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  P.forEach((p, n) => { const a = sub(p, mp), b = sub(Q[n], mq); for (let i = 0; i < 3; i++) for (let k = 0; k < 3; k++) S[i][k] += a[i] * b[k]; });
  const [[xx, xy, xz], [yx, yy, yz], [zx, zy, zz]] = S;
  const N = [
    [xx + yy + zz, yz - zy, zx - xz, xy - yx],
    [yz - zy, xx - yy - zz, xy + yx, zx + xz],
    [zx - xz, xy + yx, -xx + yy - zz, yz + zy],
    [xy - yx, zx + xz, yz + zy, -xx - yy + zz],
  ];
  // power iteration on N + cI for the largest eigenvector
  let q = [1, 0.1, 0.1, 0.1];
  const M = N.map((r, i) => r.map((x, k) => x + (i === k ? 1e6 : 0)));
  for (let it = 0; it < 500; it++) {
    const r = M.map(row => row.reduce((s, x, k) => s + x * q[k], 0));
    const l = Math.hypot(...r); q = r.map(x => x / l);
  }
  return norm([q[1], q[2], q[3]]);
}



const atoms = readAtoms(inFile).filter(a => !a.het);
const chains = [...new Set(atoms.map(a => a.chain))];
const nCA = new Map(chains.map(c => [c, atoms.filter(a => a.chain === c && a.name === 'CA').length]));
const isSmall = (c) => nCA.get(c) < 200;
const O = mean(atoms.map(a => a.p));
const [, ev] = eig3(cov(atoms.map(a => a.p)));
const cen = new Map(chains.map(c => [c, mean(atoms.filter(a => a.chain === c).map(a => a.p))]));
let n, e1;
if (mode === 'l8s8') {
  // the four-fold axis: the principal axis along which the small subunits' centres spread most
  const sc = chains.filter(isSmall).map(c => cen.get(c));
  n = ev.map(v => ({ v, s: sc.reduce((s, p) => s + dot(sub(p, O), v) ** 2, 0) })).sort((a, b) => b.s - a.s)[0].v;
  e1 = norm(cross(n, Math.abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]));
  const r = ((+(process.env.ROT ?? 22)) * Math.PI) / 180, e2b = cross(n, e1);
  e1 = norm(add(mul(e1, Math.cos(r)), mul(e2b, Math.sin(r))));
} else if (mode === 'ring') {
  // view down the ring axis (smallest variance), tilted about the screen x axis
  const ax = ev[0]; e1 = ev[2];
  const t = (18 * Math.PI) / 180, up = cross(ax, e1);
  n = norm(add(mul(up, Math.cos(t)), mul(ax, Math.sin(t))));
} else {
  n = ev[1]; e1 = ev[2];
}
const e2 = cross(n, e1);
const proj = (p) => { const d = sub(p, O); return [dot(d, e1), -dot(d, n), dot(d, e2)]; };
const P = atoms.map(a => proj(a.p));
// tones: large chains in angular order round the view axis (ring, l8s8) or by index; small chains by layer
const ang = (c) => { const q = proj(cen.get(c)); return mode === 'ring' ? Math.atan2(q[1], q[0]) : Math.atan2(q[2], q[0]); };
const large = chains.filter(c => !isSmall(c)).sort((a, b) => ang(a) - ang(b));
const tone = new Map(large.map((c, i) => [c, i % 2]));
for (const c of chains.filter(isSmall)) tone.set(c, proj(cen.get(c))[1] < 0 ? 2 : 3);
const COLS = [[222, 160, 100], [182, 116, 72], [168, 196, 214], [150, 178, 200]];
const tint = (a) => tone.get(a.chain);
const OUTLINE = [52, 50, 46];
const xs = P.map(p => p[0]), ys = P.map(p => p[1]);
const pad = 4, x0 = Math.min(...xs) - pad, x1 = Math.max(...xs) + pad, y0 = Math.min(...ys) - pad, y1 = Math.max(...ys) + pad;
const s = PX * SS, W = Math.ceil((x1 - x0) * s), H = Math.ceil((y1 - y0) * s);
const zb = new Float32Array(W * H).fill(-1e9), id = new Int32Array(W * H).fill(-1), nz = new Float32Array(W * H);
const order = P.map((_, i) => i).sort((i, k) => P[i][2] - P[k][2]);
const rr = R_ATOM * s, ri = Math.ceil(rr);
for (const i of order) {
  const cx = (P[i][0] - x0) * s, cy = (P[i][1] - y0) * s, z = P[i][2];
  const ix0 = Math.max(0, Math.floor(cx - ri)), ix1 = Math.min(W - 1, Math.ceil(cx + ri));
  const iy0 = Math.max(0, Math.floor(cy - ri)), iy1 = Math.min(H - 1, Math.ceil(cy + ri));
  for (let y = iy0; y <= iy1; y++) for (let x = ix0; x <= ix1; x++) {
    const dx = x + 0.5 - cx, dy = y + 0.5 - cy, d2 = (dx * dx + dy * dy) / (rr * rr);
    if (d2 > 1) continue;
    const h = Math.sqrt(1 - d2), zz = z + h * R_ATOM, k = y * W + x;
    if (zz > zb[k]) { zb[k] = zz; id[k] = i; nz[k] = h; }
  }
}
const zs = P.map(p => p[2]), zmin = Math.min(...zs), zmax = Math.max(...zs);
const rgba = new Uint8ClampedArray(W * H * 4);
const ow = Math.max(1, Math.round(0.8 * s));
const chainOf = atoms.map(a => a.chain);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const k = y * W + x, i = id[k];
  if (i < 0) continue;
  let edge = 0;
  for (let dy = -ow; dy <= ow && edge < 1; dy++) for (let dx = -ow; dx <= ow; dx++) {
    if (dx * dx + dy * dy > ow * ow) continue;
    const xx = x + dx, yy = y + dy;
    if (xx < 0 || yy < 0 || xx >= W || yy >= H) { edge = 1; break; }
    const kk = yy * W + xx, j = id[kk];
    if (j < 0 || zb[k] - zb[kk] > 14) { edge = 1; break; }
    if (chainOf[j] !== chainOf[i] && zb[k] - zb[kk] > 3 && dx * dx + dy * dy <= 2) edge = Math.max(edge, 0.3);
  }
  const base = COLS[tint(atoms[i])];
  const fog = 0.28 * (zmax - P[i][2]) / (zmax - zmin);
  const shade = 0.93 + 0.07 * nz[k];
  let c = base.map(v => v * shade * (1 - fog) + 250 * fog);
  if (edge) c = c.map((v, q) => v * (1 - edge) + OUTLINE[q] * edge);
  rgba.set([c[0], c[1], c[2], 255], k * 4);
}
const w = Math.floor(W / SS), h = Math.floor(H / SS), out = new Uint8ClampedArray(w * h * 4);
for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
  let r0 = 0, g0 = 0, b0 = 0, a0 = 0;
  for (let v = 0; v < SS; v++) for (let u = 0; u < SS; u++) {
    const k = ((y * SS + v) * W + x * SS + u) * 4, a = rgba[k + 3] / 255;
    r0 += rgba[k] * a; g0 += rgba[k + 1] * a; b0 += rgba[k + 2] * a; a0 += a;
  }
  const o = (y * w + x) * 4;
  if (a0 > 0) out.set([r0 / a0, g0 / a0, b0 / a0, (255 * a0) / (SS * SS)], o);
}
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, png(w, h, out));
console.log(JSON.stringify({ out: path.basename(outFile), w, h, pxPerA: PX, widthA: +(x1 - x0 - 2 * pad).toFixed(1), heightA: +(y1 - y0 - 2 * pad).toFixed(1), chains: chains.length }));
/* ---------- minimal PNG writer ---------- */
function png(w, h, rgba) {
  const crcT = new Int32Array(256).map((_, nn) => { let c = nn; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
  const crc = (buf) => { let c = -1; for (const b of buf) c = crcT[(c ^ b) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
  const chunk = (type, data) => {
    const t = Buffer.from(type), len = Buffer.alloc(4), c = Buffer.alloc(4);
    len.writeUInt32BE(data.length); c.writeUInt32BE(crc(Buffer.concat([t, data])));
    return Buffer.concat([len, t, data, c]);
  };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) { raw[y * (w * 4 + 1)] = 0; Buffer.from(rgba.buffer, y * w * 4, w * 4).copy(raw, y * (w * 4 + 1) + 1); }
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

