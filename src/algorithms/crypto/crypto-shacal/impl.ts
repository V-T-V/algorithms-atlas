// SHACAL-1 · 实现（80 轮）
export interface ShacalHooks {
  onRound?: (round: number, a: number, b: number, c: number, d: number, e: number) => void;
}
function rotl(x: number, n: number): number {
  n &= 31;
  return ((x << n) | (x >>> (32 - n))) >>> 0;
}
export function shacal1Encrypt(key: number[], block: number[], hooks: ShacalHooks = {}): number[] {
  // key = 16 个 32 位字 (512 bit)
  const W: number[] = [];
  for (let i = 0; i < 16; i++)
    W.push(
      ((key[i * 4] ?? 0) << 24) |
        ((key[i * 4 + 1] ?? 0) << 16) |
        ((key[i * 4 + 2] ?? 0) << 8) |
        (key[i * 4 + 3] ?? 0),
    );
  for (let i = 16; i < 80; i++) W.push(rotl(W[i - 3]! ^ W[i - 8]! ^ W[i - 14]! ^ W[i - 16]!, 1));
  let [a, b, c, d, e] = [
    (block[0]! << 24) | (block[1]! << 16) | (block[2]! << 8) | block[3]!,
    (block[4]! << 24) | (block[5]! << 16) | (block[6]! << 8) | block[7]!,
    (block[8]! << 24) | (block[9]! << 16) | (block[10]! << 8) | block[11]!,
    (block[12]! << 24) | (block[13]! << 16) | (block[14]! << 8) | block[15]!,
    (block[16]! << 24) | (block[17]! << 16) | (block[18]! << 8) | block[19]!,
  ];
  for (let i = 0; i < 80; i++) {
    let f: number;
    let k: number;
    if (i < 20) {
      f = (b & c) | (~b & d);
      k = 0x5a827999;
    } else if (i < 40) {
      f = b ^ c ^ d;
      k = 0x6ed9eba1;
    } else if (i < 60) {
      f = (b & c) | (b & d) | (c & d);
      k = 0x8f1bbcdc;
    } else {
      f = b ^ c ^ d;
      k = 0xca62c1d6;
    }
    const t = (rotl(a, 5) + f + e + k + W[i]!) >>> 0;
    e = d;
    d = c;
    c = rotl(b, 30);
    b = a;
    a = t;
    hooks.onRound?.(i, a, b, c, d, e);
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
    (e >>> 24) & 0xff,
    (e >>> 16) & 0xff,
    (e >>> 8) & 0xff,
    e & 0xff,
  ];
}
