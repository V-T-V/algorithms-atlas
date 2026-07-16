// =============================================================================
// 石子游戏 V · 纯算法实现 (LeetCode 1563)
// 区间 DP：dp[i][j] = 区间 [i,j] 内 Alice 最大得分。
// =============================================================================
export interface GameStoneGame5Hooks {
  onSplit?: (i: number, k: number, j: number, leftSum: number, rightSum: number) => void;
  onDp?: (i: number, j: number, value: number) => void;
}

export function gameStoneGame5(stones: readonly number[], hooks: GameStoneGame5Hooks = {}): number {
  const n = stones.length;
  const prefix = new Array<number>(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i]! + stones[i]!;
  const sum = (l: number, r: number): number => prefix[r + 1]! - prefix[l]!;

  const dp: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));

  // 长度从 2 到 n
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      let best = 0;
      for (let k = i; k < j; k++) {
        const ls = sum(i, k);
        const rs = sum(k + 1, j);
        hooks.onSplit?.(i, k, j, ls, rs);
        let cand: number;
        if (ls < rs) {
          cand = ls + dp[i]![k]!;
        } else if (ls > rs) {
          cand = rs + dp[k + 1]![j]!;
        } else {
          cand = ls + Math.max(dp[i]![k]!, dp[k + 1]![j]!);
        }
        if (cand > best) best = cand;
      }
      dp[i]![j]! = best;
      hooks.onDp?.(i, j, best);
    }
  }
  return dp[0]![n - 1]!;
}
