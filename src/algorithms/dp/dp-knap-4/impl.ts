// =============================================================================
// 0-1 背包（一维滚动）· 纯算法实现
// =============================================================================
export interface KnapHooks {
  onItem?: (i: number, w: number, v: number) => void;
  onUpdate?: (cap: number, val: number) => void;
  onDone?: (best: number) => void;
}

export function knapsack01(
  weights: readonly number[],
  values: readonly number[],
  capacity: number,
  hooks: KnapHooks = {},
): number {
  const n = weights.length;
  const dp = new Array<number>(capacity + 1).fill(0);
  for (let i = 0; i < n; i++) {
    const w = weights[i]!,
      v = values[i]!;
    hooks.onItem?.(i, w, v);
    for (let j = capacity; j >= w; j--) {
      const cand = dp[j - w]! + v;
      if (cand > dp[j]!) {
        dp[j] = cand;
        hooks.onUpdate?.(j, cand);
      }
    }
  }
  hooks.onDone?.(dp[capacity]!);
  return dp[capacity]!;
}
