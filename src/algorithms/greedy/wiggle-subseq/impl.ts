// =============================================================================
// 摆动子序列（Wiggle Subsequence）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface WiggleSubseqHooks {
  onDirection?: (i: number, dir: 'up' | 'down') => void;
  onResult?: (len: number) => void;
}

export interface WiggleSubseqResult {
  /** 最长摆动子序列长度。 */
  length: number;
}

/**
 * 摆动子序列（LeetCode 376）：相邻差正负交替的最长子序列长度。
 *
 * 贪心：统计「上升/下降」方向的切换次数；每次方向变化就给答案 +1。
 * @param nums 数列
 * @param hooks 可选的事件钩子
 */
export function wiggleSubseq(nums: number[], hooks: WiggleSubseqHooks = {}): WiggleSubseqResult {
  if (nums.length < 2) return { length: nums.length };
  let up = 1;
  let down = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i]! > nums[i - 1]!) {
      up = down + 1;
      hooks.onDirection?.(i, 'up');
    } else if (nums[i]! < nums[i - 1]!) {
      down = up + 1;
      hooks.onDirection?.(i, 'down');
    }
  }
  const length = Math.max(up, down);
  hooks.onResult?.(length);
  return { length };
}
