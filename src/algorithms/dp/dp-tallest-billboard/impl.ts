// =============================================================================
// 最高广告牌 · 纯算法实现
// dp 是「高差 -> 较高一侧最大高度」的映射，用 Map 滚动。
// =============================================================================

export interface TallestBillboardHooks {
  onResult?: (height: number) => void;
}

export function tallestBillboard(
  rods: readonly number[],
  hooks: TallestBillboardHooks = {},
): number {
  let dp = new Map<number, number>();
  dp.set(0, 0);
  for (const r of rods) {
    const next = new Map<number, number>(dp);
    for (const [diff, taller] of dp) {
      // 放较高一侧
      const a = next.get(diff + r) ?? -1;
      next.set(diff + r, Math.max(a, taller + r));
      // 放较低一侧
      const nd = Math.abs(diff - r);
      const newTaller = Math.max(taller, taller - diff + r);
      const b = next.get(nd) ?? -1;
      next.set(nd, Math.max(b, newTaller));
    }
    dp = next;
  }
  const ans = dp.get(0) ?? 0;
  hooks.onResult?.(ans);
  return ans;
}
