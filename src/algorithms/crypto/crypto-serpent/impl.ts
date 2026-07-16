// Serpent · 实现（教学极简：4 轮 SPN 16 位状态）
export interface SpHooks {
  onRound?: (round: number, state: number) => void;
}
const SBOX: number[] = [
  0x3, 0xa, 0xd, 0xc, 0x1, 0x2, 0x0, 0xb, 0x7, 0x5, 0x9, 0x4, 0x6, 0xf, 0x8, 0xe,
];
export function serpentEncrypt(key: number[], block: number[], hooks: SpHooks = {}): number[] {
  let state = ((block[0]! << 8) | block[1]!) & 0xffff;
  const K = ((key[0] ?? 0) << 8) | (key[1] ?? 0);
  for (let r = 0; r < 32; r++) {
    state ^= (K + r) & 0xffff;
    // S 盒层：4 个 4-bit 盒
    let s = 0;
    for (let i = 0; i < 4; i++) s |= SBOX[(state >>> (i * 4)) & 0xf]! << (i * 4);
    state = s;
    // 线性变换（旋转）
    state = ((state << 5) | (state >>> 11)) & 0xffff;
    state ^= (state >>> 3) & 0xffff;
    hooks.onRound?.(r, state);
  }
  state ^= K;
  return [(state >>> 8) & 0xff, state & 0xff];
}
