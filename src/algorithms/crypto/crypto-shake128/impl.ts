// SHAKE128 · 实现（自带教学 sponge：toy 置换 + rate=32 capacity=32）
export interface ShakeHooks {
  onAbsorb?: (block: number[]) => void;
  onSqueeze?: (out: number[]) => void;
}
// toy 64 字节状态置换（非真实 Keccak-f，仅为可重复伪随机）
function permute(state: number[]): void {
  const S = state.slice();
  for (let r = 0; r < 12; r++) {
    for (let i = 0; i < 64; i++)
      state[i] = ((S[i]! + S[(i + 7) % 64]!) ^ (S[(i + 21) % 64]! << 1)) & 0xff;
    for (let i = 0; i < 64; i++) state[i] = state[i]! ^ ((i * 0x1f + r * 0x3b) & 0xff);
    for (let i = 0; i < 64; i++) {
      const j = (i * 5 + r) % 64;
      state[i] = state[i]! ^ state[j]!;
    }
    S.splice(0, 64, ...state);
  }
}
export function shake128(data: number[], outLen: number, hooks: ShakeHooks = {}): number[] {
  const rate = 32; // 简化：rate=32 字节（真实 SHAKE128=168）
  // padding：0x1F (SHAKE 域分隔) + 0x80 末位
  const padded = [...data, 0x1f];
  while (padded.length % rate !== rate - 1) padded.push(0);
  padded.push(0x80);
  const state = new Array<number>(64).fill(0);
  for (let i = 0; i < padded.length; i += rate) {
    for (let k = 0; k < rate; k++) state[k] = state[k]! ^ padded[i + k]!;
    hooks.onAbsorb?.(padded.slice(i, i + rate));
    permute(state);
  }
  const out: number[] = [];
  while (out.length < outLen) {
    const chunk = state.slice(0, Math.min(rate, outLen - out.length));
    hooks.onSqueeze?.(chunk);
    out.push(...chunk);
    if (out.length < outLen) permute(state);
  }
  return out.slice(0, outLen);
}
