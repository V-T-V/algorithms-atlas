// =============================================================================
// 01 背包 · 一维滚动
// =============================================================================

export interface KnapsackHooks {
  onItem?: (i: number, w: number, v: number) => void;
  onUpdate?: (i: number, c: number, oldV: number, newV: number) => void;
  onDone?: (best: number) => void;
}

export function knapsack01(
  weights: readonly number[],
  values: readonly number[],
  capacity: number,
  hooks: KnapsackHooks = {},
): number {
  const n = weights.length;
  const dp = new Array<number>(capacity + 1).fill(0);
  for (let i = 0; i < n; i++) {
    const wi = weights[i]!;
    const vi = values[i]!;
    hooks.onItem?.(i, wi, vi);
    for (let c = capacity; c >= wi; c--) {
      const cand = dp[c - wi]! + vi;
      if (cand > dp[c]!) {
        hooks.onUpdate?.(i, c, dp[c]!, cand);
        dp[c] = cand;
      }
    }
  }
  hooks.onDone?.(dp[capacity]!);
  return dp[capacity]!;
}
