// =============================================================================
// 石子合并 · 区间 DP
// =============================================================================

export interface MergeStonesHooks {
  onCombine?: (i: number, j: number, k: number, cost: number) => void;
  onDone?: (total: number) => void;
}

export function mergeStones(stones: readonly number[], hooks: MergeStonesHooks = {}): number {
  const n = stones.length;
  if (n <= 1) return 0;
  const prefix = new Array<number>(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i]! + stones[i]!;
  const rangeSum = (i: number, j: number): number => prefix[j + 1]! - prefix[i]!;
  const INF = Number.POSITIVE_INFINITY;
  const dp: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      let best = INF;
      for (let k = i; k < j; k++) {
        const c = dp[i]![k]! + dp[k + 1]![j]!;
        if (c < best) {
          best = c;
          hooks.onCombine?.(i, j, k, c);
        }
      }
      dp[i]![j] = best + rangeSum(i, j);
    }
  }
  hooks.onDone?.(dp[0]![n - 1]!);
  return dp[0]![n - 1]!;
}
