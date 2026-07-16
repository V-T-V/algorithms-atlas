// =============================================================================
// 跳跃游戏 Jump Game · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典问题（LeetCode 55）：数组每格表示最大跳跃步数，从首格能否跳到末格。
// 采用贪心维护「最远可达」。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface JumpGameHooks {
  /** 扫描到位置 i，最远可达更新为 maxReach。 */
  onVisit?: (i: number, maxReach: number) => void;
  /** 最远可达被扩展到新值 newReach（来自位置 i）。 */
  onExtend?: (i: number, newReach: number) => void;
  /** 算法完成：能否到达末格。 */
  onDone?: (ok: boolean) => void;
}

/**
 * 跳跃游戏（LeetCode 55）：位于数组首格，每格 `nums[i]` 表示在该处最多可跳 `nums[i]` 步，判断能否到达最后一格。
 *
 * 贪心（隐式 DP）：维护「最远可达 `maxReach`」。\n- 从左到右扫描，若当前位置 `i` 已超出 `maxReach` → 无法继续，返回 false\n- 否则 `maxReach = max(maxReach, i + nums[i])`；一旦 `maxReach >= n-1` → 返回 true\n\n等价于 DP：`dp[i]` = 能否到达 `i`，但贪心把「能到达的最远」压缩成一个标量。
 *
 * 时间 `O(n)`，空间 `O(1)`。
 *
 * @param nums 非负整数数组
 * @returns 是否可达末格
 */
export function jumpGame(nums: readonly number[], hooks: JumpGameHooks = {}): boolean {
  const n = nums.length;
  if (n <= 1) {
    hooks.onDone?.(true);
    return true;
  }

  let maxReach = 0;
  for (let i = 0; i < n; i++) {
    if (i > maxReach) {
      hooks.onDone?.(false);
      return false;
    }
    const newReach = Math.min(i + nums[i]!, n - 1);
    hooks.onVisit?.(i, maxReach);
    if (newReach > maxReach) {
      maxReach = newReach;
      hooks.onExtend?.(i, newReach);
    }
    if (maxReach >= n - 1) {
      hooks.onDone?.(true);
      return true;
    }
  }

  hooks.onDone?.(maxReach >= n - 1);
  return maxReach >= n - 1;
}
