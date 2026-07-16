// =============================================================================
// 跳跃游戏 II（Jump Game II）· 纯算法实现
// 贪心隐式 BFS：维护当前层区间 [l, r] 与下一层最远边界。
// =============================================================================

/** 算法执行过程中的事件钩子。 */
export interface JumpGame2Hooks {
  /** 扫描到下标 i，更新下一层最远边界 nextEnd。 */
  onStep?: (i: number, numsI: number, nextEnd: number) => void;
  /** 完成一层，跳一次。 */
  onJump?: (layerEnd: number, nextEnd: number, jumps: number) => void;
  /** 结论。 */
  onConclude?: (jumps: number) => void;
}

/**
 * 跳跃游戏 II：求到达终点的最少跳跃次数（贪心）。
 *
 * @param nums 非负整数数组（假设可达终点）
 * @param hooks 可选事件钩子
 * @returns 最少跳跃次数
 */
export function jumpGame2(nums: readonly number[], hooks: JumpGame2Hooks = {}): number {
  const n = nums.length;
  if (n <= 1) return 0;
  let jumps = 0;
  let l = 0;
  let r = 0; // 当前层区间 [l, r]
  let nextEnd = 0;
  while (r < n - 1) {
    nextEnd = 0;
    for (let i = l; i <= r; i++) {
      nextEnd = Math.max(nextEnd, i + nums[i]!);
      hooks.onStep?.(i, nums[i]!, nextEnd);
    }
    jumps++;
    hooks.onJump?.(r, nextEnd, jumps);
    l = r + 1;
    r = nextEnd;
  }
  hooks.onConclude?.(jumps);
  return jumps;
}
