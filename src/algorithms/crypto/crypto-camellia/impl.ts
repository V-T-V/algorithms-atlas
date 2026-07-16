// Camellia · 实现（教学极简：6 轮 Feistel 32 位半字）
export interface CaHooks {
  onRound?: (round: number, l: number, r: number) => void;
}
function f(x: number, k: number): number {
  // 简化：S 函数 + P 变换
  const s = ((x ^ k) * 0x010101 + 0x63) & 0xffffffff;
  return ((s << 7) | (s >>> 25)) & 0xffffffff;
}
export function camelliaEncrypt(key: number[], block: number[], hooks: CaHooks = {}): number[] {
  const K = ((key[0] ?? 0) << 24) | ((key[1] ?? 0) << 16) | ((key[2] ?? 0) << 8) | (key[3] ?? 0);
  let L = (block[0]! << 24) | (block[1]! << 16) | (block[2]! << 8) | block[3]!;
  let R = (block[4]! << 24) | (block[5]! << 16) | (block[6]! << 8) | block[7]!;
  for (let i = 0; i < 6; i++) {
    const newR = L ^ f(R, K + i);
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
