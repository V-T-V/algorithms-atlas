// =============================================================================
// 合并石子（K=2）· 纯算法实现
// =============================================================================
export interface StoneHooks {
  onInterval?: (i: number, j: number, val: number) => void;
  onDone?: (cost: number) => void;
}

export function mergeStones(stones: readonly number[], hooks: StoneHooks = {}): number {
  const n = stones.length;
  if (n === 0) {
    hooks.onDone?.(0);
    return 0;
  }
  const prefix = new Array<number>(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i]! + stones[i]!;
  const dp: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      let best = Number.POSITIVE_INFINITY;
      for (let k = i; k < j; k++) {
        best = Math.min(best, dp[i]![k]! + dp[k + 1]![j]!);
      }
      dp[i]![j] = best + (prefix[j + 1]! - prefix[i]!);
      hooks.onInterval?.(i, j, dp[i]![j]!);
    }
  }
  hooks.onDone?.(dp[0]![n - 1]!);
  return dp[0]![n - 1]!;
}
