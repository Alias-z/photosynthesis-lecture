// The three soluble carriers of the chain schema (figs/chain.ts, glyph mode): space-filling, flat colour with dark
// outlines (after Goodsell), at the scale of the complexes (scripts/chain_render.mjs, 2.4 px per Å), on a transparent
// ground; the redox centre marked as a small amber spot drawn over the protein (it lies under the surface).
//
//   node scripts/carrier_render.mjs <dir with 1AG6.cif 1A70.cif 1FNB.cif> <out dir: src/assets/chain>
//
// Inputs are the RCSB mmCIF files (https://files.rcsb.org/download/<ID>.cif):
//   1AG6  spinach plastocyanin, X-ray 1.7 Å (Xue et al. 1998, Protein Sci. 7:2099); centre: the Cu ion
//   1A70  spinach ferredoxin I, X-ray 1.7 Å (Binda et al. 1998, Acta Cryst. D54:1353); centre: the [2Fe–2S] cluster
//   1FNB  spinach ferredoxin–NADP⁺ reductase, X-ray 1.7 Å (Bruns & Karplus 1995, J. Mol. Biol. 247:125); centre: the
//         isoalloxazine (flavin) ring of FAD
// Rendering (atom radius, supersampling, outline, fog, flat shade) is copied from chain_render.mjs. Differences, both
// for small single-chain proteins: an internal outline also where the surface steps back by more than DZ Å (default 6;
// chain_render uses 14 Å, scaled for 100–200 Å complexes, which leaves a 30 Å protein a flat blob without crevices), and
// FNR's two domains in two tints (FAD-binding domain to residue 151, NADP⁺-binding domain from 152).
// Orientation: the vector from the protein's centroid to its redox centre is turned to a set direction (plastocyanin: up,
// to the membrane, where it docks on cytochrome f and PSI; ferredoxin and FNR: down-left, towards their electron
// donor, PSI and ferredoxin), tilted towards the viewer so that the centre lies in the near half; a proper rotation
// (no mirror image). Hydrogens, waters, ions of the crystal (SO₄, PO₄) and alternate conformations other than A are
// left out.
// Output per carrier: <key>.png (lit), <key>-g.png (the grey of the dimmed complexes: chain.ts pdbDefs `-grey`, the same
// colour matrix applied here) and carrier-structures.json (image size, centre, redox-centre anchor, size in Å).
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const [, , inDir, outDir] = process.argv;
const PX = 2.4;          // output pixels per ångström (as chain_render.mjs)
const SS = 2;            // supersampling
const R_ATOM = 1.75;     // Å, every heavy atom
const DZ = +(process.env.DZ ?? 6);
const SKIP = new Set(['HOH', 'SO4', 'PO4', 'CL', 'GOL', 'NA', 'K', 'ACT']);

/* ---------- mmCIF atom_site (alt conformation A only) ---------- */
function readAtoms(file) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const i0 = lines.findIndex((l, i) => l.startsWith('loop_') && lines[i + 1].startsWith('_atom_site.'));
  const cols = [];
  let j = i0 + 1;
  while (lines[j].startsWith('_atom_site.')) cols.push(lines[j++].slice(11).trim());
  const c = (n) => cols.indexOf(n);
  const [ig, it, iat, ialt, icomp, ix, iy, iz, ich, iseq, imod] = ['group_PDB', 'type_symbol', 'label_atom_id', 'label_alt_id', 'label_comp_id', 'Cartn_x', 'Cartn_y', 'Cartn_z', 'auth_asym_id', 'auth_seq_id', 'pdbx_PDB_model_num'].map(c);
  const atoms = [];
  for (; j < lines.length && (lines[j].startsWith('ATOM') || lines[j].startsWith('HETATM')); j++) {
    const t = lines[j].split(/\s+/);
    if (t[imod] !== '1' || t[it] === 'H' || SKIP.has(t[icomp])) continue;
    if (t[ialt] !== '.' && t[ialt] !== 'A') continue;
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

/* ---------- the carriers ---------- */
const FLAVIN = new Set(['N1', 'C2', 'O2', 'N3', 'C4', 'O4', 'C4X', 'N5', 'C5X', 'C6', 'C7', 'C7M', 'C8', 'C8M', 'C9', 'C9A', 'N10', 'C10']);
// colour: the chain's carrier fills (chain.css .chn-pc #73a3da, .chn-fd #cf8c74, .chn-fnr #ad94d4) × 0.95, as the
// complexes' render colours sit a little under their flat fills
const SPECS = {
  pc: { file: '1AG6.cif', centre: (a) => a.comp === 'CU', to: [0, -1], tilt: 35, roll: +(process.env.ROLL_PC ?? 0),
    col: [[109, 155, 207]], tint: () => 0 },
  fd: { file: '1A70.cif', centre: (a) => a.comp === 'FES', to: [-0.8, 0.6], tilt: 35, roll: +(process.env.ROLL_FD ?? 0),
    col: [[197, 133, 110]], tint: () => 0 },
  fnr: { file: '1FNB.cif', centre: (a) => a.comp === 'FAD' && FLAVIN.has(a.name), to: [-0.8, 0.6], tilt: 35, roll: +(process.env.ROLL_FNR ?? 0),
    col: [[164, 141, 201], [182, 163, 214]], tint: (a) => (a.seq >= 152 ? 1 : 0) },
};
const OUTLINE = [52, 50, 46];
const MARK = [240, 176, 48];   // the redox centre: amber, dark rim

function render(key) {
  const S = SPECS[key];
  const atoms = readAtoms(path.join(inDir, S.file));
  const prot = atoms.filter(a => !a.het);
  const O = mean(prot.map(a => a.p));
  const cen = atoms.filter(S.centre);
  const C = mean(cen.map(a => a.p));
  // molecular frame: ev to the centre, ea the longest axis across it
  const ev = norm(sub(C, O));
  const ax = eig3(cov(prot.map(a => a.p)))[1][2];
  const ea = norm(sub(ax, mul(ev, dot(ax, ev)))), eb = cross(ev, ea);
  // image frame (x right, y down, z to the viewer; right-handed): t = where ev goes, u ⊥ t nearest the horizontal,
  // turned by roll about t
  const tl = (S.tilt * Math.PI) / 180, d2 = norm([S.to[0], S.to[1], 0]);
  const t = [d2[0] * Math.cos(tl), d2[1] * Math.cos(tl), Math.sin(tl)];
  let u = norm(sub([1, 0, 0], mul(t, t[0])));
  const w0 = cross(t, u), rr = (S.roll * Math.PI) / 180;
  u = norm(add(mul(u, Math.cos(rr)), mul(w0, Math.sin(rr))));
  const w = cross(t, u);
  const proj = (p) => { const d = sub(p, O), a = dot(d, ev), b = dot(d, ea), c = dot(d, eb); return add(add(mul(t, a), mul(u, b)), mul(w, c)); };
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
      if (S.tint(atoms[j]) !== S.tint(atoms[i]) && zb[k] - zb[kk] > 2 && dx * dx + dy * dy <= 2) edge = Math.max(edge, 0.3);
    }
    const base = S.col[S.tint(atoms[i])];
    const fog = 0.28 * (zmax - P[i][2]) / (zmax - zmin);
    const shade = 0.93 + 0.07 * nz[k];
    let c = base.map(v => v * shade * (1 - fog) + 250 * fog);
    if (edge) c = c.map((v, q) => v * (1 - edge) + OUTLINE[q] * edge);
    rgba.set([c[0], c[1], c[2], 255], k * 4);
  }
  // the redox centre over the protein: its atoms as discs (Cu a little larger: a lone ion), amber with a dark rim
  const mk = cen.map(a => proj(a.p)), mr = (cen.length === 1 ? 2.1 : 1.1) * s, rim = 0.8 * s;
  const inMark = (x, y, r) => mk.some(p => { const dx = x + 0.5 - (p[0] - x0) * s, dy = y + 0.5 - (p[1] - y0) * s; return dx * dx + dy * dy <= r * r; });
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const k = y * W + x;
    if (inMark(x, y, mr)) rgba.set([...MARK, 255], k * 4);
    else if (inMark(x, y, mr + rim)) rgba.set([...OUTLINE, 255], k * 4);
  }
  // downsample SS × SS (premultiplied)
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
  // the dimmed copy: chain.ts pdbDefs `-grey` (feColorMatrix in sRGB on unpremultiplied colour), applied here
  const grey = new Uint8ClampedArray(out.length);
  for (let k = 0; k < out.length; k += 4) {
    const v = 0.12 * out[k] + 0.24 * out[k + 1] + 0.05 * out[k + 2] + 0.53 * 255;
    grey.set([v, v, v, out[k + 3]], k);
  }
  fs.writeFileSync(path.join(outDir, `${key}-g.png`), png(w2, h2, grey));
  const toImg = (p) => { const q = proj(p); return [+((q[0] - x0) * PX).toFixed(1), +((q[1] - y0) * PX).toFixed(1)]; };
  return {
    w: w2, h: h2, pxPerA: PX, c: [+(w2 / 2).toFixed(1), +(h2 / 2).toFixed(1)],
    widthA: +(x1 - x0 - 2 * pad).toFixed(1), heightA: +(y1 - y0 - 2 * pad).toFixed(1),
    anchors: { centre: toImg(C), centroid: toImg(O) },
  };
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
const only = (process.env.ONLY ?? 'pc,fd,fnr').split(',');
const metaFile = path.join(outDir, 'carrier-structures.json');
const meta = fs.existsSync(metaFile) ? JSON.parse(fs.readFileSync(metaFile, 'utf8')) : {};
for (const k of only) { meta[k] = { ...render(k), dz: DZ, roll: SPECS[k].roll }; console.log(k, JSON.stringify(meta[k])); }
fs.writeFileSync(metaFile, JSON.stringify(meta, null, 1));
