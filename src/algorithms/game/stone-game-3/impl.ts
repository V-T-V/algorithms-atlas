// =============================================================================
// 石子游戏 III（Stone Game III, LeetCode 1406）· 纯算法实现
// DP：f(i) = 当前玩家从 i 起比对手多的分数。
// =============================================================================

/** 算法执行过程中的事件钩子。 */
export interface StoneGame3Hooks {
  /** 求出 f(i)（从 i 起的优势）。 */
  onSolve?: (i: number, advantage: number) => void;
  /** 结论。 */
  onConclude?: (result: 'Alice' | 'Bob' | 'Tie', advantage: number) => void;
}

export interface StoneGame3Result {
  /** 胜负结论。 */
  winner: 'Alice' | 'Bob' | 'Tie';
  /** f(0)：先手相对后手的优势。 */
  advantage: number;
  /** dp 表。 */
  dp: number[];
}

/**
 * 石子游戏 III：判断 Alice 先手的胜负。
 *
 * @param piles 各堆石子数（可为负）
 * @param hooks 可选事件钩子
 */
export function stoneGame3(
  piles: readonly number[],
  hooks: StoneGame3Hooks = {},
): StoneGame3Result {
  const n = piles.length;
  // dp[i] = 当前玩家从 i 起比对手多的分数；dp[n]=0
  const dp: number[] = new Array<number>(n + 1).fill(0);
  dp[n] = 0;
  for (let i = n - 1; i >= 0; i--) {
    let best = -Infinity;
    let taken = 0;
    for (let x = 1; x <= 3 && i + x - 1 < n; x++) {
      taken += piles[i + x - 1]!;
      const adv = taken - dp[i + x]!;
      if (adv > best) best = adv;
    }
    dp[i] = best;
    hooks.onSolve?.(i, best);
  }
  const advantage = dp[0]!;
  let winner: 'Alice' | 'Bob' | 'Tie';
  if (advantage > 0) winner = 'Alice';
  else if (advantage < 0) winner = 'Bob';
  else winner = 'Tie';
  hooks.onConclude?.(winner, advantage);
  return { winner, advantage, dp };
}
