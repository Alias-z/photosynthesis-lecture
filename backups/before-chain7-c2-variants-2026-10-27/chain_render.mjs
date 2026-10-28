// Side views of the four thylakoid complexes for the chain schema (figs/chain.ts, style 'pdb'): space-filling, flat colour
// with dark outlines (after Goodsell's illustrations), all at one scale, membrane normal up (stroma up), on a transparent ground.
//
//   node scripts/chain_render.mjs <dir with 5XNL.cif 6RQF.cif 5L8R.cif 6FKF.cif> <out dir: src/assets/chain>
//
// Inputs are the RCSB mmCIF files (https://files.rcsb.org/download/<ID>.cif):
//   5XNL  pea PSII–LHCII supercomplex C₂S₂M₂, cryo-EM 2.7 Å (Su et al. 2017, Science 357:815)
//   6RQF  spinach cytochrome b₆f dimer, cryo-EM 3.6 Å (Malone et al. 2019, Nature 575:535)
//   5L8R  pea PSI–LHCI supercomplex, X-ray 2.6 Å (Mazor et al. 2017, Nature Plants 3:17014)
//   6FKF  spinach chloroplast ATP synthase, cryo-EM 3.1 Å (Hahn et al. 2018, Science 360:eaat4318)
// Membrane frame (no OPM entry needed): the normal is the C2 axis of the dimers (PSII, b₆f: the rotation that maps one
// monomer onto the other), the axis of the c-ring (ATP synthase) or the thinnest axis of the chlorophyll layer (PSI); it
// points to the stroma (side of PsaC, of CF₁, away from cytochrome f and the oxygen-evolving complex). The membrane centre
// is the mean chlorophyll Mg height (PSII, PSI), the mid-point of the b haems (b₆f) or the mid-height of the c-ring.
// Hydrogens, waters, lipids and detergents are left out; proteins and bound pigments and cofactors are drawn.
// Output per complex: <key>.png (RGBA, PX px per Å) and chain-structures.json (image sizes, membrane centre row, anchors).
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const [, , inDir, outDir] = process.argv;
const PX = 2.4;          // output pixels per ångström
const SS = 2;            // supersampling
const R_ATOM = 1.75;     // Å, every heavy atom
const SKIP = new Set(['HOH', 'LHG', 'LMG', 'DGD', 'SQD', 'PGV', '6PL', 'LMT', 'BNG', 'UNL', 'DMS', 'CDL', 'PCF', 'LFA', 'DD9', 'UNX', 'GOL', 'SO4', 'CL', 'BCT']);

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

/* ---------- membrane frames ---------- */
const CA = (atoms, chains) => atoms.filter(a => !a.het && a.name === 'CA' && chains.includes(a.chain));
/** Paired CA atoms of two monomers (chain pairs, matched by residue number). */
function pairs(atoms, map) {
  const P = [], Q = [];
  const key = new Map(atoms.filter(a => !a.het && a.name === 'CA').map(a => [`${a.chain}:${a.seq}`, a.p]));
  for (const [c1, c2] of map) for (const a of atoms) if (!a.het && a.name === 'CA' && a.chain === c1) {
    const b = key.get(`${c2}:${a.seq}`); if (b) { P.push(a.p); Q.push(b); }
  }
  return [P, Q];
}
const centroidOf = (atoms, f) => mean(atoms.filter(f).map(a => a.p));

const SPECS = {
  psii: {
    file: '5XNL.cif',
    frame(atoms) {
      const up = 'ABCDEFHIJKLMOPQRSTWXYZ1234G N'.replace(/ /g, '').split('');
      const lo = 'abcdefhijklmopqrstwxyz5678gn'.split('');
      const [P, Q] = pairs(atoms, up.map((c, i) => [c, lo[i]]));
      let n = rotAxis(P, Q);
      const lum = centroidOf(atoms, a => ['O', 'o'].includes(a.chain));   // PsbO, lumenal
      const cen = mean(atoms.filter(a => a.comp === 'CLA' && a.name === 'MG').map(a => a.p));
      if (dot(sub(lum, cen), n) > 0) n = mul(n, -1);
      return { n, O: cen };
    },
    tint: (a) => (['A', 'B', 'C', 'D', 'a', 'b', 'c', 'd', 'E', 'F', 'e', 'f', 'H', 'h', 'I', 'i', 'J', 'j', 'K', 'k', 'L', 'l', 'M', 'm', 'T', 't', 'W', 'w', 'X', 'x', 'Z', 'z'].includes(a.chain) ? 0
      : ['O', 'P', 'Q', 'o', 'p', 'q'].includes(a.chain) ? 1 : 2),
    anchors: (atoms) => ({
      oec: centroidOf(atoms, a => a.comp === 'OEX' && a.chain === 'A'),
      qb: centroidOf(atoms, a => a.comp === 'PL9' && a.chain === 'A'),
      oec2: centroidOf(atoms, a => a.comp === 'OEX' && a.chain === 'a'),
      qb2: centroidOf(atoms, a => a.comp === 'PL9' && a.chain === 'a'),
    }),
  },
  b6f: {
    file: '6RQF.cif',
    frame(atoms) {
      const [P, Q] = pairs(atoms, [['A', 'I'], ['B', 'J'], ['C', 'K'], ['D', 'L'], ['E', 'M'], ['F', 'N'], ['G', 'O'], ['H', 'P']]);
      let n = rotAxis(P, Q);
      const f = centroidOf(atoms, a => ['C', 'K'].includes(a.chain) && !a.het);   // cytochrome f, lumenal
      const O = centroidOf(atoms, a => a.comp === 'HEM' && a.el === 'FE');
      if (dot(sub(f, O), n) > 0) n = mul(n, -1);
      return { n, O };
    },
    tint: (a) => (['C', 'K'].includes(a.chain) ? 1 : ['D', 'L'].includes(a.chain) ? 2 : 0),
    anchors: (atoms) => ({
      hemes: centroidOf(atoms, a => a.comp === 'HEM' && a.el === 'FE'),
      cytf: centroidOf(atoms, a => a.comp === 'HEC' && a.el === 'FE' && a.chain === 'C'),
      cytf2: centroidOf(atoms, a => a.comp === 'HEC' && a.el === 'FE' && a.chain === 'K'),
    }),
  },
  psi: {
    file: '5L8R.cif',
    frame(atoms) {
      const mg = atoms.filter(a => (a.comp === 'CLA' || a.comp === 'CHL') && a.name === 'MG').map(a => a.p);
      let n = eig3(cov(mg))[1][0];
      const O = mean(mg);
      const c = centroidOf(atoms, a => a.chain === 'C' && !a.het);   // PsaC, stromal
      if (dot(sub(c, O), n) < 0) n = mul(n, -1);
      return { n, O };
    },
    tint: (a) => (['1', '2', '3', '4'].includes(a.chain) ? 2 : ['C', 'D', 'E'].includes(a.chain) ? 1 : 0),
    anchors: (atoms) => ({
      fab: centroidOf(atoms, a => a.comp === 'SF4' && a.chain === 'C'),
      p700: centroidOf(atoms, a => a.comp === 'CL0' && a.name === 'MG'),
    }),
  },
  atps: {
    file: '6FKF.cif',
    frame(atoms) {
      const cs = 'GHIJKLMNOPQRST'.split('');
      const cen = cs.map(ch => centroidOf(atoms, a => a.chain === ch && !a.het));
      let n = eig3(cov(cen))[1][0];
      const ring = atoms.filter(a => cs.includes(a.chain));
      const O0 = mean(cen);
      const f1 = centroidOf(atoms, a => ['A', 'B', 'C', 'D', 'E', 'F'].includes(a.chain));
      if (dot(sub(f1, O0), n) < 0) n = mul(n, -1);
      const hs = ring.map(a => dot(sub(a.p, O0), n));
      const O = add(O0, mul(n, (Math.min(...hs) + Math.max(...hs)) / 2));
      return { n, O };
    },
    tint: (a) => ('GHIJKLMNOPQRST'.includes(a.chain) ? 1 : ['A', 'B', 'C', 'D', 'E', 'F'].includes(a.chain) ? 0 : 2),
    anchors: (atoms) => ({ cring: centroidOf(atoms, a => 'GHIJKLMNOPQRST'.includes(a.chain)) }),
  },
};

/* ---------- render ---------- */
// colour per complex: three tints (0 = main body, 1 = second part, 2 = third), as in figs/chain.ts
const COL = {
  psii: [[118, 168, 82], [150, 190, 104], [170, 205, 130]],
  b6f: [[222, 140, 88], [232, 168, 112], [206, 120, 76]],
  psi: [[84, 168, 158], [112, 188, 178], [150, 205, 190]],
  atps: [[206, 128, 168], [222, 160, 192], [190, 112, 150]],
};
const OUTLINE = [52, 50, 46];

function render(key, rot) {
  const S = SPECS[key];
  const atoms = readAtoms(path.join(inDir, S.file));
  const { n, O } = S.frame(atoms);
  // in-plane axes: the widest in-plane direction, turned by rot degrees
  const inPlane = atoms.filter(a => a.name === 'CA').map(a => { const d = sub(a.p, O); return sub(d, mul(n, dot(d, n))); });
  let e1 = norm(eig3(cov(inPlane))[1][2]);
  const e2b = cross(n, e1), r = (rot * Math.PI) / 180;
  e1 = norm(add(mul(e1, Math.cos(r)), mul(e2b, Math.sin(r))));
  const e2 = cross(n, e1);
  const proj = (p) => { const d = sub(p, O); return [dot(d, e1), -dot(d, n), dot(d, e2)]; };   // x right, y down (stroma up), z towards viewer
  const P = atoms.map(a => proj(a.p));
  const xs = P.map(p => p[0]), ys = P.map(p => p[1]);
  const pad = 6, x0 = Math.min(...xs) - pad, x1 = Math.max(...xs) + pad, y0 = Math.min(...ys) - pad, y1 = Math.max(...ys) + pad;
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
  const ow = Math.max(1, Math.round(0.8 * s));   // outline reach, render px
  const chainOf = atoms.map(a => a.chain);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const k = y * W + x, i = id[k];
    if (i < 0) continue;
    // outline: a neighbour that is background, much further back, or (thinner) another chain
    let edge = 0;
    for (let dy = -ow; dy <= ow && edge < 1; dy++) for (let dx = -ow; dx <= ow; dx++) {
      if (dx * dx + dy * dy > ow * ow) continue;
      const xx = x + dx, yy = y + dy;
      if (xx < 0 || yy < 0 || xx >= W || yy >= H) { edge = 1; break; }
      const kk = yy * W + xx, j = id[kk];
      if (j < 0 || zb[k] - zb[kk] > 14) { edge = 1; break; }
      if (chainOf[j] !== chainOf[i] && zb[k] - zb[kk] > 3 && dx * dx + dy * dy <= 2) edge = Math.max(edge, 0.3);
    }
    const t = S.tint(atoms[i]), base = COL[key][t];
    const shade = 0.93 + 0.07 * nz[k];
    const fog = 0.28 * (zmax - P[i][2]) / (zmax - zmin);   // further back = paler
    let c = base.map(v => v * shade * (1 - fog) + 250 * fog);
    if (edge) c = c.map((v, q) => v * (1 - edge) + OUTLINE[q] * edge);
    rgba.set([c[0], c[1], c[2], 255], k * 4);
  }
  // downsample SS × SS (premultiplied)
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
  fs.writeFileSync(path.join(outDir, `${key}.png`), png(w, h, out));
  const A = S.anchors(atoms), toImg = (p) => { const q = proj(p); return [+((q[0] - x0) * PX).toFixed(1), +((q[1] - y0) * PX).toFixed(1)]; };
  return {
    w, h, pxPerA: PX, membraneY: +((0 - y0) * PX).toFixed(1),
    widthA: +(x1 - x0 - 2 * pad).toFixed(1), heightA: +(y1 - y0 - 2 * pad).toFixed(1),
    stromaA: +(-(y0 + pad)).toFixed(1), lumenA: +(y1 - pad).toFixed(1),
    anchors: Object.fromEntries(Object.entries(A).map(([k, p]) => [k, toImg(p)])),
  };
}

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

fs.mkdirSync(outDir, { recursive: true });
const ROT = { psii: +(process.env.ROT_PSII ?? 90), b6f: +(process.env.ROT_B6F ?? 0), psi: +(process.env.ROT_PSI ?? 0), atps: +(process.env.ROT_ATPS ?? 0) };
const only = (process.env.ONLY ?? 'psii,b6f,psi,atps').split(',');
const metaFile = path.join(outDir, 'chain-structures.json');
const meta = fs.existsSync(metaFile) ? JSON.parse(fs.readFileSync(metaFile, 'utf8')) : {};
for (const k of only) { meta[k] = { ...render(k, ROT[k]), rot: ROT[k] }; console.log(k, JSON.stringify(meta[k])); }
fs.writeFileSync(metaFile, JSON.stringify(meta, null, 1));
