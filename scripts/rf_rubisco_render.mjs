// Rubisco for the rf schema's structure look (figs/rf-schema.ts, look 'pdb'): activated spinach Rubisco L8S8 with CABP
// (PDB 8RUC; Andersson 1996, J Mol Biol 259:160), space-filling, flat colour with dark outlines, in the style of
// scripts/chain_render.mjs (whose helpers are copied here unchanged). The file holds half the molecule (4 L + 4 S); the
// second half is made with the crystal operator of the biological assembly (-x, y, -z + 100.65).
//
//   node scripts/rf_rubisco_render.mjs <dir with 8RUC.cif> <out dir: src/assets/rf>
//
// View: side view, four-fold axis vertical (small subunits as caps top and bottom), turned ROT degrees about the axis.
// Output: rubisco-8ruc.png (RGBA) and rubisco-8ruc.json (size, anchors: the CABP of the front large subunit = active site).
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const [, , inDir, outDir] = process.argv;
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


const atoms0 = readAtoms(path.join(inDir, '8RUC.cif'));
const op = (p) => [-p[0], p[1], -p[2] + 100.65];
const atoms = [...atoms0, ...atoms0.map(a => ({ ...a, chain: a.chain + "'", p: op(a.p) }))];
const L = new Set(['A', 'C', 'E', 'G', "A'", "C'", "E'", "G'"]);
// four-fold axis: the rotation that maps large subunit A onto C (CA atoms paired by residue number)
const ca = atoms.filter(a => a.name === 'CA').map(a => a.p);
const O = mean(ca);
const byKey = new Map(atoms.filter(a => a.name === 'CA').map(a => [`${a.chain}:${a.seq}`, a.p]));
const PA = [], PC = [];
for (const a of atoms) if (a.name === 'CA' && a.chain === 'A') { const b = byKey.get(`C:${a.seq}`); if (b) { PA.push(a.p); PC.push(b); } }
let n = rotAxis(PA, PC);
const sTop = mean(atoms.filter(a => ['I', 'J', 'K', 'L'].includes(a.chain) && a.name === 'CA').map(a => a.p));
if (dot(sub(sTop, O), n) < 0) n = mul(n, -1);
const vecs = [null, norm(cross(n, Math.abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0]))];
console.log('axis', n.map(v => v.toFixed(3)).join(' '), 'S offset along n', dot(sub(sTop, O), n).toFixed(1));
const ROT = +(process.env.ROT ?? 22);
let e1 = norm(vecs[1]);
const e2b = cross(n, e1), r = (ROT * Math.PI) / 180;
e1 = norm(add(mul(e1, Math.cos(r)), mul(e2b, Math.sin(r))));
const e2 = cross(n, e1);
const proj = (p) => { const d = sub(p, O); return [dot(d, e1), -dot(d, n), dot(d, e2)]; };
const P = atoms.map(a => proj(a.p));
// colour: large-subunit dimers alternate two tones; small subunits pale
const LDIM = { A: 0, C: 1, E: 0, G: 1, "A'": 1, "C'": 0, "E'": 1, "G'": 0 };
const COLS = [[222, 160, 100], [182, 116, 72], [168, 196, 214], [150, 178, 200]];
const tint = (a) => (L.has(a.chain) ? LDIM[a.chain] : (a.chain.endsWith("'") ? 3 : 2));
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
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'rubisco-8ruc.png'), png(w, h, out));
// active sites: CABP (CAP) centroid per large chain; keep the one nearest the viewer
const caps = [...L].map(ch => { const ps = atoms.filter(a => a.comp === 'CAP' && a.chain === ch).map(a => a.p); return ps.length ? proj(mean(ps)) : null; }).filter(Boolean);
caps.sort((a, b) => b[2] - a[2]);
const toImg = (q) => [+((q[0] - x0) * PX).toFixed(1), +((q[1] - y0) * PX).toFixed(1)];
const meta = { w, h, pxPerA: PX, rot: ROT, widthA: +(x1 - x0 - 2 * pad).toFixed(1), heightA: +(y1 - y0 - 2 * pad).toFixed(1), sites: caps.map(toImg), siteZ: caps.map(c => +c[2].toFixed(1)) };
fs.writeFileSync(path.join(outDir, 'rubisco-8ruc.json'), JSON.stringify(meta, null, 1));
console.log(JSON.stringify(meta));
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

