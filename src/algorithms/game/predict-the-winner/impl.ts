// =============================================================================
// 预测赢家（Predict the Winner, LeetCode 486）· 纯算法实现
// 区间 DP：dp[i][j] = 当前玩家在 [i..j] 上比对手多的分数。
// =============================================================================

/** 算法执行过程中的事件钩子。 */
export interface PredictTheWinnerHooks {
  /** 求出某区间 [i..j] 的最优分差。 */
  onInterval?: (i: number, j: number, gap: number, takeLeft: boolean) => void;
  /** 结论。 */
  onConclude?: (player1Wins: boolean, gap: number) => void;
}

export interface PredictResult {
  /** 玩家 1 是否不输（gap >= 0）。 */
  player1Wins: boolean;
  /** dp[0][n-1]：玩家 1 相对玩家 2 的分数差。 */
  gap: number;
  /** dp 表。 */
  dp: number[][];
}

/**
 * 预测赢家：判断玩家 1（先手）能否不输。
 *
 * @param nums 非负整数数组
 * @param hooks 可选事件钩子
 */
export function predictTheWinner(
  nums: readonly number[],
  hooks: PredictTheWinnerHooks = {},
): PredictResult {
  const n = nums.length;
  if (n === 0) return { player1Wins: true, gap: 0, dp: [] };
  const dp: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < n; i++) dp[i]![i]! = nums[i]!;
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      const left = nums[i]! - dp[i + 1]![j]!;
      const right = nums[j]! - dp[i]![j - 1]!;
      const takeLeft = left >= right;
      dp[i]![j]! = takeLeft ? left : right;
      hooks.onInterval?.(i, j, dp[i]![j]!, takeLeft);
    }
  }
  const gap = dp[0]![n - 1]!;
  const player1Wins = gap >= 0;
  hooks.onConclude?.(player1Wins, gap);
  return { player1Wins, gap, dp };
}
