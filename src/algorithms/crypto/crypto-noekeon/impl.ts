export interface NkHooks {
  onRound?: (round: number, state: number[]) => void;
}
function rotl(x: number, s: number): number {
  return ((x << s) | (x >>> (32 - s))) & 0xffffffff;
}
export function noekeonEncrypt(key: number[], block: number[], hooks: NkHooks = {}): number[] {
  let a = (block[0]! << 24) | (block[1]! << 16) | (block[2]! << 8) | block[3]!;
  let b = (block[4]! << 24) | (block[5]! << 16) | (block[6]! << 8) | block[7]!;
  let c = (block[8]! << 24) | (block[9]! << 16) | (block[10]! << 8) | block[11]!;
  let d = (block[12]! << 24) | (block[13]! << 16) | (block[14]! << 8) | block[15]!;
  const RC = Array.from({ length: 16 }, (_, i) => (i * 0x1111 + 0x1) & 0xffffffff);
  for (let r = 0; r < 16; r++) {
    a ^= RC[r]!;
    const t = a & b & c & d;
    a ^= t;
    b ^= t;
    c ^= t;
    d ^= t;
    b = rotl(b, 1);
    c = rotl(c, 5);
    d = rotl(d, 13);
    a ^= b & c & d;
    b = rotl(b, 7);
    c = rotl(c, 22);
    hooks.onRound?.(r, [a, b, c, d]);
  }
  return [
    (a >>> 24) & 0xff,
    (a >>> 16) & 0xff,
    (a >>> 8) & 0xff,
    a & 0xff,
    (b >>> 24) & 0xff,
    (b >>> 16) & 0xff,
    (b >>> 8) & 0xff,
    b & 0xff,
    (c >>> 24) & 0xff,
    (c >>> 16) & 0xff,
    (c >>> 8) & 0xff,
    c & 0xff,
    (d >>> 24) & 0xff,
    (d >>> 16) & 0xff,
    (d >>> 8) & 0xff,
    d & 0xff,
  ];
}
