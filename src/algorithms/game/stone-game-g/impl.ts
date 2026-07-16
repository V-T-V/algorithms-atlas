// =============================================================================
// 石子游戏（Stone Game, LeetCode 877）· 纯算法实现
// 区间 DP：dp[i][j] = 当前玩家在 piles[i..j] 上比对手多的分数。
// =============================================================================

/** 算法执行过程中的事件钩子。 */
export interface StoneGameGHooks {
  /** 求出某个区间 [i..j] 的最优分差。 */
  onInterval?: (i: number, j: number, gap: number, takeLeft: boolean) => void;
  /** 结论：Alex 是否赢，以及最大分差。 */
  onConclude?: (alexWins: boolean, gap: number) => void;
}

export interface StoneGameGResult {
  /** Alex 是否必胜（分差 > 0）。 */
  alexWins: boolean;
  /** Alex 相对 Lee 的最大分差。 */
  gap: number;
  /** dp 表：dp[i][j] = 当前玩家在 [i..j] 上的最优分差。 */
  dp: number[][];
}

/**
 * 石子游戏：用区间 DP 求 Alex（先手）的最大分差。
 *
 * @param piles 各堆石子数（应为偶数长度）
 * @param hooks 可选事件钩子
 */
export function stoneGame(piles: readonly number[], hooks: StoneGameGHooks = {}): StoneGameGResult {
  const n = piles.length;
  if (n === 0) return { alexWins: false, gap: 0, dp: [] };
  // dp[i][j]：当前玩家面对 [i..j] 能比对手多的分数
  const dp: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < n; i++) dp[i]![i]! = piles[i]!;
  // 长度从 2 到 n
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      const left = piles[i]! - dp[i + 1]![j]!;
      const right = piles[j]! - dp[i]![j - 1]!;
      const takeLeft = left >= right;
      dp[i]![j]! = takeLeft ? left : right;
      hooks.onInterval?.(i, j, dp[i]![j]!, takeLeft);
    }
  }
  const gap = dp[0]![n - 1]!;
  const alexWins = gap > 0;
  hooks.onConclude?.(alexWins, gap);
  return { alexWins, gap, dp };
}
