// =============================================================================
// 我能赢吗（Can I Win, LeetCode 464）· 纯算法实现
// 状态压缩（位掩码）+ 记忆化搜索。
// =============================================================================

/** 算法执行过程中的事件钩子。 */
export interface CanIWinHooks {
  /** 搜索某状态（位掩码 + 剩余目标）。 */
  onSearch?: (state: number, remaining: number, result: boolean) => void;
  /** 结论。 */
  onConclude?: (firstWins: boolean) => void;
}

/**
 * 判断先手玩家能否保证获胜。
 *
 * @param maxChoosableInteger 可选整数上界 m（1..m）
 * @param desiredTotal 目标累计和
 * @param hooks 可选事件钩子
 * @returns 先手能否赢
 */
export function canIWin(
  maxChoosableInteger: number,
  desiredTotal: number,
  hooks: CanIWinHooks = {},
): boolean {
  // 边界
  if (desiredTotal <= 0) return true; // 先手无需选数即已达目标
  const m = maxChoosableInteger;
  // 所选数之和上界 < 目标 → 谁都赢不了
  if ((m * (m + 1)) / 2 < desiredTotal) return false;

  // 记忆化：memo[state] = 当前玩家能否赢（state 用 m 位的位掩码）
  // 用 -1=未算，0=false，1=true。状态数 2^m。
  const size = 1 << m;
  const memo: Int8Array = new Int8Array(size).fill(-1);

  const dfs = (state: number, remaining: number): boolean => {
    if (memo[state]! !== -1) {
      // 命中：不触发 onSearch（避免重复帧）
      return memo[state]! === 1;
    }
    let win = false;
    for (let x = 1; x <= m; x++) {
      const bit = 1 << (x - 1);
      if (state & bit) continue; // 已选
      if (x >= remaining) {
        win = true; // 选 x 直接到目标
        break;
      }
      // 对手在 state|bit 上，remaining-x 时若对手不能赢 → 我赢
      if (!dfs(state | bit, remaining - x)) {
        win = true;
        break;
      }
    }
    memo[state]! = win ? 1 : 0;
    hooks.onSearch?.(state, remaining, win);
    return win;
  };

  const result = dfs(0, desiredTotal);
  hooks.onConclude?.(result);
  return result;
}
