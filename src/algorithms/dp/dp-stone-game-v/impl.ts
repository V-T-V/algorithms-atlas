// =============================================================================
// 石子游戏 V · 纯算法实现
// 区间 DP：dp[i][j] = [i,j] 上最大得分。
// =============================================================================

export interface StoneGameVHooks {
  onSplit?: (i: number, j: number, k: number, left: number, right: number) => void;
  onFill?: (i: number, j: number, val: number) => void;
  onResult?: (score: number) => void;
}

export function stoneGameV(values: readonly number[], hooks: StoneGameVHooks = {}): number {
  const n = values.length;
  if (n === 0) {
    hooks.onResult?.(0);
    return 0;
  }
  // 前缀和
  const pre: number[] = new Array<number>(n + 1).fill(0);
  for (let i = 0; i < n; i++) pre[i + 1] = pre[i]! + values[i]!;
  const sum = (i: number, j: number): number => pre[j + 1]! - pre[i]!;

  const dp: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  // 长度从 2 到 n
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      let best = 0;
      for (let k = i; k < j; k++) {
        const left = sum(i, k);
        const right = sum(k + 1, j);
        hooks.onSplit?.(i, j, k, left, right);
        let cand = 0;
        if (left < right) cand = left + dp[i]![k]!;
        else if (left > right) cand = right + dp[k + 1]![j]!;
        else cand = left + Math.max(dp[i]![k]!, dp[k + 1]![j]!);
        best = Math.max(best, cand);
      }
      dp[i]![j] = best;
      hooks.onFill?.(i, j, best);
    }
  }
  hooks.onResult?.(dp[0]![n - 1]!);
  return dp[0]![n - 1]!;
}
