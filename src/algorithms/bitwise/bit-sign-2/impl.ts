// 符号提取 · 实现
export interface SignHooks {
  onSign?: (s: number) => void;
}
export function signBit(x: number, hooks: SignHooks = {}): number {
  const v = x | 0;
  const signNeg = v >> 31; // -1 if negative else 0
  const nonZero = (-v | v) >> 31; // -1 if nonzero else 0
  const r = (nonZero & 1) + signNeg; // -1 / 0 / 1
  hooks.onSign?.(r);
  return r;
}
