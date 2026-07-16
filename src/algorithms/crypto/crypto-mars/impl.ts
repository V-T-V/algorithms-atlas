// MARS · 实现（教学极简：8 轮核心 32 位字）
export interface MarsHooks {
  onRound?: (round: number, val: number) => void;
}
export function marsEncrypt(key: number[], block: number[], hooks: MarsHooks = {}): number[] {
  const K = ((key[0] ?? 0) << 24) | ((key[1] ?? 0) << 16) | ((key[2] ?? 0) << 8) | (key[3] ?? 0);
  let A = (block[0]! << 24) | (block[1]! << 16) | (block[2]! << 8) | block[3]!;
  let B = (block[4]! << 24) | (block[5]! << 16) | (block[6]! << 8) | block[7]!;
  let C = (block[8]! << 24) | (block[9]! << 16) | (block[10]! << 8) | block[11]!;
  let D = (block[12]! << 24) | (block[13]! << 16) | (block[14]! << 8) | block[15]!;
  A = (A + K) >>> 0;
  for (let r = 0; r < 8; r++) {
    const f = (((A * 0x5bd1e995) ^ (A >>> 13)) + r * K) >>> 0;
    D = ((D ^ f) + r) >>> 0;
    [A, B, C, D] = [B, C, D, A];
    hooks.onRound?.(r, D);
  }
  D = (D - K) >>> 0;
  return [
    (A >>> 24) & 0xff,
    (A >>> 16) & 0xff,
    (A >>> 8) & 0xff,
    A & 0xff,
    (B >>> 24) & 0xff,
    (B >>> 16) & 0xff,
    (B >>> 8) & 0xff,
    B & 0xff,
    (C >>> 24) & 0xff,
    (C >>> 16) & 0xff,
    (C >>> 8) & 0xff,
    C & 0xff,
    (D >>> 24) & 0xff,
    (D >>> 16) & 0xff,
    (D >>> 8) & 0xff,
    D & 0xff,
  ];
}
