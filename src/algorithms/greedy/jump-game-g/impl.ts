// =============================================================================
// 跳跃游戏（Jump Game, 贪心版）· 纯算法实现
// 维护 maxReach，一次扫描判断能否到达终点。
// =============================================================================

/** 算法执行过程中的事件钩子。 */
export interface JumpGameGHooks {
  /** 扫描到下标 i，更新最远可达 maxReach。 */
  onStep?: (i: number, numsI: number, maxReach: number) => void;
  /** 中途断链：i > maxReach。 */
  onBreak?: (i: number, maxReach: number) => void;
  /** 结论：能否到达。 */
  onConclude?: (canReach: boolean, maxReach: number) => void;
}

export interface JumpGameGResult {
  /** 能否到达最后一格。 */
  canReach: boolean;
  /** 最终最远可达位置。 */
  maxReach: number;
}

/**
 * 跳跃游戏：判断能否到达最后一格（贪心）。
 *
 * @param nums 非负整数数组
 * @param hooks 可选事件钩子
 */
export function jumpGame(nums: readonly number[], hooks: JumpGameGHooks = {}): JumpGameGResult {
  const n = nums.length;
  if (n <= 1) return { canReach: true, maxReach: 0 };
  let maxReach = 0;
  for (let i = 0; i < n; i++) {
    if (i > maxReach) {
      hooks.onBreak?.(i, maxReach);
      hooks.onConclude?.(false, maxReach);
      return { canReach: false, maxReach };
    }
    maxReach = Math.max(maxReach, i + nums[i]!);
    hooks.onStep?.(i, nums[i]!, maxReach);
    if (maxReach >= n - 1) {
      hooks.onConclude?.(true, maxReach);
      return { canReach: true, maxReach };
    }
  }
  hooks.onConclude?.(maxReach >= n - 1, maxReach);
  return { canReach: maxReach >= n - 1, maxReach };
}
