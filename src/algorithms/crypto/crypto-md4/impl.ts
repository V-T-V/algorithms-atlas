// MD4 · 实现（RFC 1320）
export interface Md4Hooks {
  onRound?: (round: number, a: number, b: number, c: number, d: number) => void;
  onResult?: (hash: number[]) => void;
}
function rotl(x: number, n: number): number {
  n &= 31;
  return ((x << n) | (x >>> (32 - n))) >>> 0;
}
export function md4(data: number[], hooks: Md4Hooks = {}): number[] {
  const origLen = data.length;
  const totalBits = origLen * 8;
  const padded = [...data, 0x80];
  while (padded.length % 64 !== 56) padded.push(0);
  padded.push(
    totalBits & 0xff,
    (totalBits >>> 8) & 0xff,
    (totalBits >>> 16) & 0xff,
    (totalBits >>> 24) & 0xff,
  );
  padded.push(0, 0, 0, 0);
  let A = 0x67452301;
  let B = 0xefcdab89;
  let C = 0x98badcfe;
  let D = 0x10325476;
  const F = (x: number, y: number, z: number): number => ((x & y) | (~x & z)) >>> 0;
  const G = (x: number, y: number, z: number): number => ((x & y) | (x & z) | (y & z)) >>> 0;
  const H = (x: number, y: number, z: number): number => (x ^ y ^ z) >>> 0;
  for (let blk = 0; blk < padded.length; blk += 64) {
    const X: number[] = [];
    for (let i = 0; i < 16; i++)
      X.push(
        (padded[blk + i * 4]! |
          (padded[blk + i * 4 + 1]! << 8) |
          (padded[blk + i * 4 + 2]! << 16) |
          (padded[blk + i * 4 + 3]! << 24)) >>>
          0,
      );
    const AA = A;
    const BB = B;
    const CC = C;
    const DD = D;
    // Round 1（顺序更新 A,D,C,B）
    A = rotl((A + F(B, C, D) + X[0]!) >>> 0, 3);
    D = rotl((D + F(A, B, C) + X[1]!) >>> 0, 7);
    C = rotl((C + F(D, A, B) + X[2]!) >>> 0, 11);
    B = rotl((B + F(C, D, A) + X[3]!) >>> 0, 19);
    A = rotl((A + F(B, C, D) + X[4]!) >>> 0, 3);
    D = rotl((D + F(A, B, C) + X[5]!) >>> 0, 7);
    C = rotl((C + F(D, A, B) + X[6]!) >>> 0, 11);
    B = rotl((B + F(C, D, A) + X[7]!) >>> 0, 19);
    A = rotl((A + F(B, C, D) + X[8]!) >>> 0, 3);
    D = rotl((D + F(A, B, C) + X[9]!) >>> 0, 7);
    C = rotl((C + F(D, A, B) + X[10]!) >>> 0, 11);
    B = rotl((B + F(C, D, A) + X[11]!) >>> 0, 19);
    A = rotl((A + F(B, C, D) + X[12]!) >>> 0, 3);
    D = rotl((D + F(A, B, C) + X[13]!) >>> 0, 7);
    C = rotl((C + F(D, A, B) + X[14]!) >>> 0, 11);
    B = rotl((B + F(C, D, A) + X[15]!) >>> 0, 19);
    hooks.onRound?.(0, A, B, C, D);
    // Round 2
    A = rotl((A + G(B, C, D) + X[0]! + 0x5a827999) >>> 0, 3);
    D = rotl((D + G(A, B, C) + X[4]! + 0x5a827999) >>> 0, 5);
    C = rotl((C + G(D, A, B) + X[8]! + 0x5a827999) >>> 0, 9);
    B = rotl((B + G(C, D, A) + X[12]! + 0x5a827999) >>> 0, 13);
    A = rotl((A + G(B, C, D) + X[1]! + 0x5a827999) >>> 0, 3);
    D = rotl((D + G(A, B, C) + X[5]! + 0x5a827999) >>> 0, 5);
    C = rotl((C + G(D, A, B) + X[9]! + 0x5a827999) >>> 0, 9);
    B = rotl((B + G(C, D, A) + X[13]! + 0x5a827999) >>> 0, 13);
    A = rotl((A + G(B, C, D) + X[2]! + 0x5a827999) >>> 0, 3);
    D = rotl((D + G(A, B, C) + X[6]! + 0x5a827999) >>> 0, 5);
    C = rotl((C + G(D, A, B) + X[10]! + 0x5a827999) >>> 0, 9);
    B = rotl((B + G(C, D, A) + X[14]! + 0x5a827999) >>> 0, 13);
    A = rotl((A + G(B, C, D) + X[3]! + 0x5a827999) >>> 0, 3);
    D = rotl((D + G(A, B, C) + X[7]! + 0x5a827999) >>> 0, 5);
    C = rotl((C + G(D, A, B) + X[11]! + 0x5a827999) >>> 0, 9);
    B = rotl((B + G(C, D, A) + X[15]! + 0x5a827999) >>> 0, 13);
    hooks.onRound?.(1, A, B, C, D);
    // Round 3
    A = rotl((A + H(B, C, D) + X[0]! + 0x6ed9eba1) >>> 0, 3);
    D = rotl((D + H(A, B, C) + X[8]! + 0x6ed9eba1) >>> 0, 9);
    C = rotl((C + H(D, A, B) + X[4]! + 0x6ed9eba1) >>> 0, 11);
    B = rotl((B + H(C, D, A) + X[12]! + 0x6ed9eba1) >>> 0, 15);
    A = rotl((A + H(B, C, D) + X[2]! + 0x6ed9eba1) >>> 0, 3);
    D = rotl((D + H(A, B, C) + X[10]! + 0x6ed9eba1) >>> 0, 9);
    C = rotl((C + H(D, A, B) + X[6]! + 0x6ed9eba1) >>> 0, 11);
    B = rotl((B + H(C, D, A) + X[14]! + 0x6ed9eba1) >>> 0, 15);
    A = rotl((A + H(B, C, D) + X[1]! + 0x6ed9eba1) >>> 0, 3);
    D = rotl((D + H(A, B, C) + X[9]! + 0x6ed9eba1) >>> 0, 9);
    C = rotl((C + H(D, A, B) + X[5]! + 0x6ed9eba1) >>> 0, 11);
    B = rotl((B + H(C, D, A) + X[13]! + 0x6ed9eba1) >>> 0, 15);
    A = rotl((A + H(B, C, D) + X[3]! + 0x6ed9eba1) >>> 0, 3);
    D = rotl((D + H(A, B, C) + X[11]! + 0x6ed9eba1) >>> 0, 9);
    C = rotl((C + H(D, A, B) + X[7]! + 0x6ed9eba1) >>> 0, 11);
    B = rotl((B + H(C, D, A) + X[15]! + 0x6ed9eba1) >>> 0, 15);
    hooks.onRound?.(2, A, B, C, D);
    A = (A + AA) >>> 0;
    B = (B + BB) >>> 0;
    C = (C + CC) >>> 0;
    D = (D + DD) >>> 0;
  }
  const out: number[] = [];
  for (const v of [A, B, C, D]) {
    out.push(v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff);
  }
  hooks.onResult?.(out);
  return out;
}
