// =============================================================================
// 取石子（Stone Game）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典区间博弈 DP：一排石子 piles，两人轮流从「左端或右端」取一堆，
// 都采取最优策略。求先手能获得的最大石子数。
//   dp[i][j] = max( piles[i] + (区间和[i+1,j] - dp[i+1][j]),
//                   piles[j] + (区间和[i,j-1] - dp[i][j-1]) )
//   即 dp[i][j] = 先手在 [i,j] 上能拿的最大数；对手拿剩下的。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface StoneGameHooks {
  /** 处理区间 [i, j]：先手选左端（pile[i]）或右端（pile[j]）。 */
  onChoose?: (i: number, j: number, side: 'left' | 'right', gain: number) => void;
  /** 填好 dp[i][j]：先手在 [i,j] 上能拿的最大石子数。 */
  onFill?: (i: number, j: number, val: number) => void;
}

/**
 * 取石子博弈：一排石子 `piles`，两人轮流从左端或右端取一堆（都最优策略）。
 * 求先手能获得的最大石子数。
 *
 * 状态：`dp[i][j]` = 在区间 `[i, j]` 上，当前轮到的玩家（视为先手）能拿的最大石子数。
 * 转移（对手也会最优，所以剩下的是「区间和 - 对手的 dp」）：
 *   - 取左端 `piles[i]`：剩下 `[i+1, j]` 给对手，对手最优拿 `dp[i+1][j]`，自己得
 *     `piles[i] + (sum(i+1,j) - dp[i+1][j])`
 *   - 取右端 `piles[j]`：同理 `piles[j] + (sum(i,j-1) - dp[i][j-1])`
 *   - 取两者较大
 * 等价化简：`dp[i][j] = max(piles[i] + sum(i+1,j) - dp[i+1][j], piles[j] + sum(i,j-1) - dp[i][j-1])`
 *
 * @param piles 各堆石子数（正整数）
 * @param hooks 可选事件钩子
 * @returns 先手能获得的最大石子数。
 */
export function stoneGame(piles: readonly number[], hooks: StoneGameHooks = {}): number {
  const n = piles.length;
  if (n === 0) return 0;
  // 前缀和
  const pref = new Array<number>(n + 1).fill(0);
  for (let i = 0; i < n; i++) pref[i + 1] = pref[i]! + piles[i]!;
  const rangeSum = (l: number, r: number): number => pref[r + 1]! - pref[l]!;

  const dp: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (let i = 0; i < n; i++) dp[i]![i] = piles[i]!;

  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      const takeLeft = piles[i]! + (rangeSum(i + 1, j) - dp[i + 1]![j]!);
      const takeRight = piles[j]! + (rangeSum(i, j - 1) - dp[i]![j - 1]!);
      if (takeLeft >= takeRight) {
        hooks.onChoose?.(i, j, 'left', takeLeft);
        dp[i]![j] = takeLeft;
      } else {
        hooks.onChoose?.(i, j, 'right', takeRight);
        dp[i]![j] = takeRight;
      }
      hooks.onFill?.(i, j, dp[i]![j]!);
    }
  }
  return dp[0]![n - 1]!;
}
