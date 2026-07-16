// SEED · 实现（教学极简：4 轮 32 位 Feistel）
export interface SeedHooks {
  onRound?: (round: number, l: number, r: number) => void;
}
const SS1: number[] = Array.from(
  { length: 256 },
  (_, i) => ((i * 0x5d + 0x1b) & 0xff) ^ ((i << 2) & 0xff),
);
const SS2: number[] = Array.from(
  { length: 256 },
  (_, i) => ((i * 0x7b + 0x33) & 0xff) ^ ((i >>> 3) & 0xff),
);
function g(x: number): number {
  return (SS1[x & 0xff]! << 8) | SS2[(x >>> 8) & 0xff]!;
}
export function seedEncrypt(key: number[], block: number[], hooks: SeedHooks = {}): number[] {
  const K = ((key[0] ?? 0) << 24) | ((key[1] ?? 0) << 16) | ((key[2] ?? 0) << 8) | (key[3] ?? 0);
  let L = (block[0]! << 24) | (block[1]! << 16) | (block[2]! << 8) | block[3]!;
  let R = (block[4]! << 24) | (block[5]! << 16) | (block[6]! << 8) | block[7]!;
  for (let i = 0; i < 16; i++) {
    const t = g(R ^ (K + i * 0x101));
    const newR = L ^ (((t * 0x10001) ^ ((t << 7) | (t >>> 25))) & 0xffffffff);
    L = R;
    R = newR;
    hooks.onRound?.(i, L, R);
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
