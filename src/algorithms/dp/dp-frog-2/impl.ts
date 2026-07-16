// =============================================================================
// 青蛙跳 2（1~K 步）· 纯算法实现
// dp[i] = min(dp[i-k] + |h[i-k]-h[i]|) for k=1..K。
// =============================================================================

export interface Frog2Hooks {
  onLand?: (i: number, val: number, from: number) => void;
  onResult?: (cost: number) => void;
}

export function frog2(heights: readonly number[], K: number, hooks: Frog2Hooks = {}): number {
  const n = heights.length;
  if (n === 0) {
    hooks.onResult?.(0);
    return 0;
  }
  if (n === 1) {
    hooks.onLand?.(0, 0, 0);
    hooks.onResult?.(0);
    return 0;
  }
  const dp: number[] = new Array<number>(n).fill(0);
  dp[0] = 0;
  for (let i = 1; i < n; i++) {
    dp[i] = Infinity;
    let bestFrom = -1;
    for (let k = 1; k <= K && i - k >= 0; k++) {
      const cand = dp[i - k]! + Math.abs(heights[i - k]! - heights[i]!);
      if (cand < dp[i]!) {
        dp[i] = cand;
        bestFrom = i - k;
      }
    }
    hooks.onLand?.(i, dp[i]!, bestFrom);
  }
  hooks.onResult?.(dp[n - 1]!);
  return dp[n - 1]!;
}
