// GOST 28147 · 实现（教学简化：8 轮 16 位状态，4 个 4-bit S 盒）
export interface GostHooks {
  onRound?: (round: number, l: number, r: number) => void;
}
const SBOX: number[][] = [
  [4, 10, 9, 2, 13, 8, 0, 14, 6, 11, 1, 12, 7, 15, 5, 3].map((x) => x & 0xf),
  [14, 11, 4, 12, 6, 13, 15, 10, 2, 3, 8, 1, 0, 7, 5, 9].map((x) => x & 0xf),
  [5, 8, 1, 13, 10, 3, 4, 2, 14, 15, 12, 7, 6, 0, 9, 11].map((x) => x & 0xf),
  [7, 13, 10, 1, 0, 8, 9, 15, 14, 4, 6, 12, 11, 2, 5, 3].map((x) => x & 0xf),
];
export function gostEncrypt(key: number[], block: number[], hooks: GostHooks = {}): number[] {
  let L = (block[0]! << 8) | block[1]!;
  let R = (block[2]! << 8) | block[3]!;
  const K: number[] = [];
  for (let i = 0; i < 8; i++) K.push(((key[i * 2] ?? 0) << 8) | (key[i * 2 + 1] ?? 0));
  for (let r = 0; r < 32; r++) {
    const k = K[r % 8]! << 11; // 简化：移位代替 32 位加
    let s = ((R + k) & 0xffff) >>> 0;
    // 4 个 4-bit S 盒
    let out = 0;
    for (let i = 0; i < 4; i++) out |= SBOX[i]![(s >>> (i * 4)) & 0xf]! << (i * 4);
    s = ((out << 11) | (out >>> 5)) & 0xffff; // 16 位旋转
    const newR = L ^ s;
    L = R;
    R = newR;
    hooks.onRound?.(r, L, R);
  }
  return [(L >>> 8) & 0xff, L & 0xff, (R >>> 8) & 0xff, R & 0xff];
}
