// 竞争比分析 · 实现
// 给定在线成本序列 on[] 与离线最优 off[]，求最大比值。
export interface CrHooks {
  onInstance?: (i: number, on: number, off: number, ratio: number) => void;
  onConclude?: (maxRatio: number, idx: number) => void;
}
export function competitiveRatio(
  onCosts: readonly number[],
  offCosts: readonly number[],
  hooks: CrHooks = {},
): { maxRatio: number; idx: number } {
  let maxRatio = 0,
    idx = 0;
  for (let i = 0; i < onCosts.length; i++) {
    const ratio = onCosts[i]! / (offCosts[i]! || 1);
    hooks.onInstance?.(i, onCosts[i]!, offCosts[i]!, ratio);
    if (ratio > maxRatio) {
      maxRatio = ratio;
      idx = i;
    }
  }
  hooks.onConclude?.(maxRatio, idx);
  return { maxRatio, idx };
}
