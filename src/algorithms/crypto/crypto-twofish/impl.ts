// Twofish · 实现（教学极简：4 轮 Feistel 32 位半字）
export interface TfHooks {
  onRound?: (round: number, l: number, r: number) => void;
}
function g(x: number, k: number): number {
  // 简化：4 个字节经 S 盒（依赖 k）+ MDS 风格混合
  const b0 = ((x * 0x9e + k) ^ (x << 3)) & 0xff;
  const b1 = ((x >>> 8) ^ k ^ (x >>> 3)) & 0xff;
  const b2 = ((x + k * 7) ^ (x >>> 5)) & 0xff;
  const b3 = ((x ^ (k << 2)) + 0x5b) & 0xff;
  return (b0 << 24) | (b1 << 16) | (b2 << 8) | b3;
}
export function twofishEncrypt(key: number[], block: number[], hooks: TfHooks = {}): number[] {
  const K = ((key[0] ?? 0) << 24) | ((key[1] ?? 0) << 16) | ((key[2] ?? 0) << 8) | (key[3] ?? 0);
  let R0 = (block[0]! << 24) | (block[1]! << 16) | (block[2]! << 8) | block[3]!;
  let R1 = (block[4]! << 24) | (block[5]! << 16) | (block[6]! << 8) | block[7]!;
  let R2 = (block[8]! << 24) | (block[9]! << 16) | (block[10]! << 8) | block[11]!;
  const R3 = (block[12]! << 24) | (block[13]! << 16) | (block[14]! << 8) | block[15]!;
  for (let i = 0; i < 16; i++) {
    const t0 = g(R0, K + i);
    const t1 = g(R1, K + i + 1);
    const f0 = ((t0 + t1 + (((K + i) * 2) >>> 0)) >>> 0) & 0xffffffff;
    const f1 = ((t0 + 2 * t1 + (((K + i + 1) * 3) >>> 0)) >>> 0) & 0xffffffff;
    const newR2 = R2 ^ (f0 >>> 0);
    const newR3 = R3 ^ (f1 >>> 0);
    R0 = newR2;
    R1 = newR3;
    R2 = R0;
    void R2;
    hooks.onRound?.(i, R0, R1);
  }
  // 最终 swap + 输出（简化）
  return [
    (R0 >>> 24) & 0xff,
    (R0 >>> 16) & 0xff,
    (R0 >>> 8) & 0xff,
    R0 & 0xff,
    (R1 >>> 24) & 0xff,
    (R1 >>> 16) & 0xff,
    (R1 >>> 8) & 0xff,
    R1 & 0xff,
    (R2 >>> 24) & 0xff,
    (R2 >>> 16) & 0xff,
    (R2 >>> 8) & 0xff,
    R2 & 0xff,
    (R3 >>> 24) & 0xff,
    (R3 >>> 16) & 0xff,
    (R3 >>> 8) & 0xff,
    R3 & 0xff,
  ];
}
