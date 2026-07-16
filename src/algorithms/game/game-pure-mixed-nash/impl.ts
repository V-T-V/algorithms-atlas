// 混合策略纳什 (2x2 零和) · 实现
export interface MixedNashHooks {
  onProb?: (p: number) => void;
  onValue?: (v: number) => void;
}
export function mixedNash(
  A: ReadonlyArray<readonly number[]>,
  hooks: MixedNashHooks = {},
): { p: number; value: number } {
  const a = A[0]![0]!,
    b = A[0]![1]!,
    c = A[1]![0]!,
    d = A[1]![1]!;
  // p*(a-c) + c = p*(b-d) + d => p = (d-c)/((a+b)-(c+d))... 用等期望:
  // p*a+(1-p)*c = p*b+(1-p)*d
  const denom = a - c - (b - d);
  const p = denom === 0 ? 0.5 : (d - c) / denom;
  const pc = Math.max(0, Math.min(1, p));
  const value = pc * a + (1 - pc) * c;
  hooks.onProb?.(pc);
  hooks.onValue?.(value);
  return { p: pc, value };
}
