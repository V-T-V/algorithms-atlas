// =============================================================================
// 石子游戏 VII · 纯算法实现 (LeetCode 1690)
// 区间 DP：dp[i][j] = 当前玩家在 [i,j] 上能领先对手的最大分差。
// dp[i][j] = max( sum(i+1..j) - dp[i+1][j], sum(i..j-1) - dp[i][j-1] )
// =============================================================================
export interface GameStoneGame7Hooks {
  onRemove?: (side: 'left' | 'right', i: number, j: number, gained: number) => void;
  onDp?: (i: number, j: number, diff: number) => void;
}

export function gameStoneGame7(stones: readonly number[], hooks: GameStoneGame7Hooks = {}): number {
  const n = stones.length;
  const prefix = new Array<number>(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i]! + stones[i]!;
  const sum = (l: number, r: number): number => prefix[r + 1]! - prefix[l]!;

  const dp: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));

  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      // 移除左边 i，得 sum(i+1..j)，减去对手在 [i+1,j] 的领先
      const leftGain = sum(i + 1, j);
      const rightGain = sum(i, j - 1);
      const left = leftGain - dp[i + 1]![j]!;
      const right = rightGain - dp[i]![j - 1]!;
      hooks.onRemove?.('left', i, j, leftGain);
      hooks.onRemove?.('right', i, j, rightGain);
      dp[i]![j]! = Math.max(left, right);
      hooks.onDp?.(i, j, dp[i]![j]!);
    }
  }
  return dp[0]![n - 1]!;
}
