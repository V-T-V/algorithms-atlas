// =============================================================================
// 青蛙过河（含能量代价）· 纯算法实现
// =============================================================================

export interface FrogEnergyHooks {
  onStone?: (i: number, dp: number) => void;
  onDone?: (cost: number) => void;
}

export function frogEnergyJump(
  h: readonly number[],
  k: number,
  hooks: FrogEnergyHooks = {},
): number {
  const n = h.length;
  if (n === 0) {
    hooks.onDone?.(0);
    return 0;
  }
  const INF = Number.POSITIVE_INFINITY;
  const dp = new Array<number>(n).fill(INF);
  dp[0] = 0;
  hooks.onStone?.(0, 0);
  for (let i = 1; i < n; i++) {
    for (let j = Math.max(0, i - k); j < i; j++) {
      const cand = dp[j]! + Math.abs(h[i]! - h[j]!);
      if (cand < dp[i]!) dp[i] = cand;
    }
    hooks.onStone?.(i, dp[i]!);
  }
  const ans = dp[n - 1]!;
  hooks.onDone?.(ans);
  return ans;
}
