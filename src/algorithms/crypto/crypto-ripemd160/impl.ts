// RIPEMD-160 · 实现
export interface RmHooks {
  onResult?: (hash: number[]) => void;
}
function rotl(x: number, n: number): number {
  n &= 31;
  return ((x << n) | (x >>> (32 - n))) >>> 0;
}
const f1 = (x: number, y: number, z: number): number => (x ^ y ^ z) >>> 0;
const f2 = (x: number, y: number, z: number): number => ((x & y) | (~x & z)) >>> 0;
const f3 = (x: number, y: number, z: number): number => ((x | ~y) ^ z) >>> 0;
const f4 = (x: number, y: number, z: number): number => ((x & z) | (y & ~z)) >>> 0;
const f5 = (x: number, y: number, z: number): number => (x ^ (y | ~z)) >>> 0;
const ZL = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2,
  14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3,
  7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13,
];
const ZR = [
  5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4,
  9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2,
  13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11,
];
const SL = [
  11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9,
  11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9,
  8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6,
];
const SR = [
  8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7,
  6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6,
  14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11,
];
const HL = [0x00000000, 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xa953fd4e];
const HR = [0x50a28be6, 0x5c4dd124, 0x6d703ef3, 0x7a6d76e9, 0x00000000];
export function ripemd160(data: number[], hooks: RmHooks = {}): number[] {
  const bitLen = data.length * 8;
  const padded = [...data, 0x80];
  while (padded.length % 64 !== 56) padded.push(0);
  padded.push(
    bitLen & 0xff,
    (bitLen >>> 8) & 0xff,
    (bitLen >>> 16) & 0xff,
    (bitLen >>> 24) & 0xff,
    0,
    0,
    0,
    0,
  );
  const H = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
  for (let blk = 0; blk < padded.length; blk += 64) {
    const M: number[] = [];
    for (let i = 0; i < 16; i++)
      M.push(
        (padded[blk + i * 4]! |
          (padded[blk + i * 4 + 1]! << 8) |
          (padded[blk + i * 4 + 2]! << 16) |
          (padded[blk + i * 4 + 3]! << 24)) >>>
          0,
      );
    let al = H[0]!;
    let bl = H[1]!;
    let cl = H[2]!;
    let dl = H[3]!;
    let el = H[4]!;
    let ar = H[0]!;
    let br = H[1]!;
    let cr = H[2]!;
    let dr = H[3]!;
    let er = H[4]!;
    for (let i = 0; i < 80; i++) {
      let tl = (al + M[ZL[i]!]!) >>> 0;
      const rl = Math.floor(i / 16);
      tl =
        (tl +
          (rl === 0
            ? f1(bl, cl, dl)
            : rl === 1
              ? f2(bl, cl, dl)
              : rl === 2
                ? f3(bl, cl, dl)
                : rl === 3
                  ? f4(bl, cl, dl)
                  : f5(bl, cl, dl)) +
          HL[rl]!) >>>
        0;
      tl = (rotl(tl, SL[i]!) + el) >>> 0;
      al = el;
      el = dl;
      dl = rotl(cl, 10);
      cl = bl;
      bl = tl;
      let tr = (ar + M[ZR[i]!]!) >>> 0;
      const rr = Math.floor(i / 16);
      tr =
        (tr +
          (rr === 0
            ? f5(br, cr, dr)
            : rr === 1
              ? f4(br, cr, dr)
              : rr === 2
                ? f3(br, cr, dr)
                : rr === 3
                  ? f2(br, cr, dr)
                  : f1(br, cr, dr)) +
          HR[rr]!) >>>
        0;
      tr = (rotl(tr, SR[i]!) + er) >>> 0;
      ar = er;
      er = dr;
      dr = rotl(cr, 10);
      cr = br;
      br = tr;
    }
    const t = (H[1]! + cl + dr) >>> 0;
    H[1] = (H[2]! + dl + er) >>> 0;
    H[2] = (H[3]! + el + ar) >>> 0;
    H[3] = (H[4]! + al + br) >>> 0;
    H[4] = (H[0]! + bl + cr) >>> 0;
    H[0] = t;
  }
  const out: number[] = [];
  for (const v of H) {
    out.push(v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff);
  }
  hooks.onResult?.(out);
  return out;
}
