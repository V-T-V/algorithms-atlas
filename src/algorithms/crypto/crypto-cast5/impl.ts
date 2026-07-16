// CAST-5 · 实现（教学简化：4 轮 32 位 Feistel，3 种轮函数）
export interface CastHooks {
  onRound?: (round: number, type: number, l: number, r: number) => void;
}
function rotl(x: number, n: number): number {
  n &= 31;
  return ((x << n) | (x >>> (32 - n))) & 0xffffffff;
}
function f(x: number, k: number, type: number): number {
  switch (type) {
    case 0:
      return rotl(((x + k) & 0xffffffff) ^ 0xa5a5a5a5, 7);
    case 1:
      return rotl((x ^ k) - 0x55555555, 11);
    default:
      return rotl(((x - k) & 0xffffffff) + 0x33333333, 17);
  }
}
export function cast5Encrypt(key: number[], block: number[], hooks: CastHooks = {}): number[] {
  const K = ((key[0] ?? 0) << 24) | ((key[1] ?? 0) << 16) | ((key[2] ?? 0) << 8) | (key[3] ?? 0);
  let L = (block[0]! << 24) | (block[1]! << 16) | (block[2]! << 8) | block[3]!;
  let R = (block[4]! << 24) | (block[5]! << 16) | (block[6]! << 8) | block[7]!;
  for (let i = 0; i < 12; i++) {
    const type = i % 3;
    const newR = L ^ f(R, K + i * 0x010101, type);
    L = R;
    R = newR;
    hooks.onRound?.(i, type, L, R);
  }
  return [
    (L >>> 24) & 0xff,
    (L >>> 16) & 0xff,
    (L >>> 8) & 0xff,
    L & 0xff,
    (R >>> 24) & 0xff,
    (R >>> 16) & 0xff,
    (R >>> 8) & 0xff,
    R & 0xff,
  ];
}
