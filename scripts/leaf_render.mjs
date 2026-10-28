// The proteins of the leaf-section strip (figs/leaf-schema.ts, slides C10–C13: C₃, C₂, C₄, CAM): space-filling, flat
// colour with dark outlines, 2.4 px per Å, with the look of scripts/cell_render.mjs (its code, with these inputs).
// Brief: research/redo-2026-10-28/CO2_COPING_BRIEF.md.
//
//   node scripts/leaf_render.mjs <dir with the mmCIF files> <out dir: src/assets/leaf>
//
// Inputs (RCSB, https://files.rcsb.org/download/<ID>-assembly1.cif.gz, the biological assembly; entries checked on
// RCSB 28 Oct 2026):
//   pepc  5VYJ assembly 1, maize photosynthetic (C₄) phosphoenolpyruvate carboxylase, tetramer, with glycine
//         (González-Segura et al. 2018, J. Biol. Chem.)
//   ca    1EKJ assembly 1, pea β-carbonic anhydrase, octamer (Kimber & Pai 2000, EMBO J.): no structure of a C₄ β-CA
//   me    5OU5 assembly 1, maize chloroplastic photosynthetic NADP-malic enzyme, tetramer (Alvarez et al. 2019, Nat. Plants)
//   ppdk  1VBG assembly 1, maize pyruvate,orthophosphate dikinase, dimer (Nakanishi et al. 2005, Biochemistry)
// Orientation: on their principal axes (longest across, second up, the flattest axis to the viewer).
// Output per protein: <key>.png, <key>-g.png (grey) and leaf-structures.json (size in px and Å).
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const [, , inDir, outDir] = process.argv;
const PX = 2.4, SS = 2, R_ATOM = 1.75, DZ = 8;
const SKIP = new Set(['HOH', 'SO4', 'PO4', 'CL', 'GOL', 'NA', 'K', 'ACT', 'EDO', 'PEG', 'MPD', 'TRS', 'FMT', 'IMD']);

/* ---------- mmCIF atom_site (alt conformation A only; optional chain and entity filters) ---------- */
function readAtoms(file, keep = () => true) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const i0 = lines.findIndex((l, i) => l.startsWith('loop_') && lines[i + 1].startsWith('_atom_site.'));
  const cols = [];
  let j = i0 + 1;
  while (lines[j].startsWith('_atom_site.')) cols.push(lines[j++].slice(11).trim());
  const c = (n) => cols.indexOf(n);
  const [ig, it, iat, ialt, icomp, ix, iy, iz, ich, iseq, imod, ient] = ['group_PDB', 'type_symbol', 'label_atom_id', 'label_alt_id', 'label_comp_id', 'Cartn_x', 'Cartn_y', 'Cartn_z', 'auth_asym_id', 'auth_seq_id', 'pdbx_PDB_model_num', 'label_entity_id'].map(c);
  const atoms = [];
  for (; j < lines.length && (lines[j].startsWith('ATOM') || lines[j].startsWith('HETATM')); j++) {
    const t = lines[j].split(/\s+/);
    if (t[imod] !== '1' || t[it] === 'H' || SKIP.has(t[icomp])) continue;
    if (t[ialt] !== '.' && t[ialt] !== 'A') continue;
    const a = { het: t[ig] === 'HETATM', el: t[it], name: t[iat].replace(/"/g, ''), comp: t[icomp], chain: t[ich], seq: +t[iseq], ent: t[ient], p: [+t[ix], +t[iy], +t[iz]] };
    if (keep(a)) atoms.push(a);
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


/** The membrane normal: the mean direction of the helices (CA i → i+4 where it spans 5.5–6.6 Å), signs aligned. */
function helixNormal(atoms) {
  const ca = atoms.filter(a => a.name === 'CA' && !a.het);
  const v = [];
  for (let i = 0; i + 4 < ca.length; i++) {
    if (ca[i + 4].chain !== ca[i].chain || ca[i + 4].seq - ca[i].seq !== 4) continue;
    const d = sub(ca[i + 4].p, ca[i].p), L = Math.hypot(...d);
    if (L > 5.5 && L < 6.6) v.push(mul(d, 1 / L));
  }
  // principal direction of the helix vectors (sign-free): the top eigenvector of Σ v vᵀ
  const C = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (const d of v) for (let i = 0; i < 3; i++) for (let k = 0; k < 3; k++) C[i][k] += d[i] * d[k];
  return eig3(C)[1][2];
}

/* ---------- the proteins: file, filter, colour per chain group, orientation ---------- */
const A = (id) => `${id}-a1.cif`;
const two = (c1, c2) => (a, chains) => (chains.indexOf(a.chain) % 2 ? c2 : c1);
const SPECS = {
  pepc: { file: A('5VYJ'), col: two([126, 170, 92], [152, 190, 118]) },
  ca: { file: A('1EKJ'), col: two([106, 148, 204], [134, 170, 218]) },
  me: { file: A('5OU5'), col: two([216, 144, 84], [230, 166, 112]) },
  ppdk: { file: A('1VBG'), col: two([86, 158, 150], [114, 180, 170]) },
};
const OUTLINE = [52, 50, 46];

function render(key) {
  const S = SPECS[key];
  const atoms = readAtoms(path.join(inDir, S.file), S.keep ?? (() => true)).filter(a => !a.het || ['FMN', 'HEM', 'PLP', 'FAD', 'F3S', 'SF4'].includes(a.comp));
  const chains = [...new Set(atoms.map(a => a.chain))];
  const O = mean(atoms.map(a => a.p));
  let ex, ey, ez;
  const [, ev] = eig3(cov(atoms.map(a => a.p)));
  if (S.membrane) {
    ex = norm(helixNormal(atoms));
    const l = sub(ev[2], mul(ex, dot(ev[2], ex)));
    ey = norm(Math.hypot(...l) > 0.2 ? l : sub(ev[1], mul(ex, dot(ev[1], ex))));
    ez = cross(ex, ey);
  } else { ex = ev[2]; ey = ev[1]; ez = cross(ex, ey); }
  const proj = (p) => { const d = sub(p, O); return [dot(d, ex), dot(d, ey), dot(d, ez)]; };
  const P = atoms.map(a => proj(a.p));
  const xs = P.map(p => p[0]), ys = P.map(p => p[1]);
  const pad = 4, x0 = Math.min(...xs) - pad, x1 = Math.max(...xs) + pad, y0 = Math.min(...ys) - pad, y1 = Math.max(...ys) + pad;
  const s = PX * SS, W = Math.ceil((x1 - x0) * s), H = Math.ceil((y1 - y0) * s);
  const zb = new Float32Array(W * H).fill(-1e9), id = new Int32Array(W * H).fill(-1), nz = new Float32Array(W * H);
  const order = P.map((_, i) => i).sort((i, k) => P[i][2] - P[k][2]);
  const rA = R_ATOM * s, ri = Math.ceil(rA);
  for (const i of order) {
    const cx = (P[i][0] - x0) * s, cy = (P[i][1] - y0) * s, z = P[i][2];
    const ix0 = Math.max(0, Math.floor(cx - ri)), ix1 = Math.min(W - 1, Math.ceil(cx + ri));
    const iy0 = Math.max(0, Math.floor(cy - ri)), iy1 = Math.min(H - 1, Math.ceil(cy + ri));
    for (let y = iy0; y <= iy1; y++) for (let x = ix0; x <= ix1; x++) {
      const dx = x + 0.5 - cx, dy = y + 0.5 - cy, q = (dx * dx + dy * dy) / (rA * rA);
      if (q > 1) continue;
      const h = Math.sqrt(1 - q), zz = z + h * R_ATOM, k = y * W + x;
      if (zz > zb[k]) { zb[k] = zz; id[k] = i; nz[k] = h; }
    }
  }
  const zs = P.map(p => p[2]), zmin = Math.min(...zs), zmax = Math.max(...zs);
  const rgba = new Uint8ClampedArray(W * H * 4);
  const ow = Math.max(1, Math.round(0.8 * s));
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const k = y * W + x, i = id[k];
    if (i < 0) continue;
    let edge = 0;
    for (let dy = -ow; dy <= ow && edge < 1; dy++) for (let dx = -ow; dx <= ow; dx++) {
      if (dx * dx + dy * dy > ow * ow) continue;
      const xx = x + dx, yy = y + dy;
      if (xx < 0 || yy < 0 || xx >= W || yy >= H) { edge = 1; break; }
      const kk = yy * W + xx, j = id[kk];
      if (j < 0 || zb[k] - zb[kk] > DZ) { edge = 1; break; }
      if (atoms[j].chain !== atoms[i].chain && zb[k] - zb[kk] > 2 && dx * dx + dy * dy <= 2) edge = Math.max(edge, 0.3);
    }
    const base = S.col(atoms[i], chains);
    const fog = 0.28 * (zmax - P[i][2]) / (zmax - zmin);
    const shade = 0.93 + 0.07 * nz[k];
    let c = base.map(v => v * shade * (1 - fog) + 250 * fog);
    if (edge) c = c.map((v, q) => v * (1 - edge) + OUTLINE[q] * edge);
    rgba.set([c[0], c[1], c[2], 255], k * 4);
  }
  const w2 = Math.floor(W / SS), h2 = Math.floor(H / SS), out = new Uint8ClampedArray(w2 * h2 * 4);
  for (let y = 0; y < h2; y++) for (let x = 0; x < w2; x++) {
    let r0 = 0, g0 = 0, b0 = 0, a0 = 0;
    for (let v = 0; v < SS; v++) for (let uu = 0; uu < SS; uu++) {
      const k = ((y * SS + v) * W + x * SS + uu) * 4, a = rgba[k + 3] / 255;
      r0 += rgba[k] * a; g0 += rgba[k + 1] * a; b0 += rgba[k + 2] * a; a0 += a;
    }
    const o = (y * w2 + x) * 4;
    if (a0 > 0) out.set([r0 / a0, g0 / a0, b0 / a0, (255 * a0) / (SS * SS)], o);
  }
  fs.writeFileSync(path.join(outDir, `${key}.png`), png(w2, h2, out));
  const grey = new Uint8ClampedArray(out.length);
  for (let k = 0; k < out.length; k += 4) {
    const v = 0.12 * out[k] + 0.24 * out[k + 1] + 0.05 * out[k + 2] + 0.53 * 255;
    grey.set([v, v, v, out[k + 3]], k);
  }
  fs.writeFileSync(path.join(outDir, `${key}-g.png`), png(w2, h2, grey));
  return { w: w2, h: h2, pxPerA: PX, widthA: +(x1 - x0 - 2 * pad).toFixed(1), heightA: +(y1 - y0 - 2 * pad).toFixed(1),
    chains: chains.length, ...(S.membrane ? { memX: +((0 - x0) * PX).toFixed(1) } : {}) };
}

/* ---------- minimal PNG writer (as chain_render.mjs) ---------- */
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


fs.mkdirSync(outDir, { recursive: true });
const only = (process.env.ONLY ?? Object.keys(SPECS).join(',')).split(',');
const metaFile = path.join(outDir, 'leaf-structures.json');
const meta = fs.existsSync(metaFile) ? JSON.parse(fs.readFileSync(metaFile, 'utf8')) : {};
for (const k of only) { meta[k] = render(k); console.log(k, JSON.stringify(meta[k])); }
fs.writeFileSync(metaFile, JSON.stringify(meta, null, 1));
