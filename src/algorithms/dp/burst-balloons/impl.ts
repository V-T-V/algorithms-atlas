// =============================================================================
// 戳气球（Burst Balloons）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典区间 DP：n 个气球，戳破第 i 个得 nums[left]*nums[i]*nums[right]，
// 求最大总收益。技巧：在两端加哨兵 1，反向考虑「最后戳谁」。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface BurstBalloonsHooks {
  /** 计算区间 (i, j) 内最优：选择 k 作为该区间内「最后戳」的气球。 */
  onChooseLast?: (i: number, j: number, k: number, gain: number) => void;
  /** 填好 dp[i][j]：区间 (i, j) 内能获得的最大硬币数。 */
  onFillCell?: (i: number, j: number, val: number) => void;
}

/**
 * 戳气球：给定气球数组，戳破第 i 个气球获得 `nums[i-1]*nums[i]*nums[i+1]` 枚硬币，
 * 求能获得的最大硬币数。
 *
 * 状态：`dp[i][j]` = 在 `(i, j)` 开区间内（不含 i、j 哨兵）全部戳完的最大收益。
 * 转移：枚举该区间内「最后被戳」的气球 k：
 *   `dp[i][j] = max(dp[i][k] + dp[k][j] + nums[i]*nums[k]*nums[j])`
 *
 * @param nums 各气球上的数字（均 > 0）
 * @param hooks 可选事件钩子
 * @returns 能获得的最大硬币数。
 */
export function burstBalloons(nums: readonly number[], hooks: BurstBalloonsHooks = {}): number {
  const n = nums.length;
  if (n === 0) return 0;
  // 两端加哨兵 1
  const a: number[] = [1, ...nums, 1];
  const m = a.length;
  const dp: number[][] = Array.from({ length: m }, () => new Array<number>(m).fill(0));

  // 按区间长度 len 从小到大
  for (let len = 2; len < m; len++) {
    for (let i = 0; i + len < m; i++) {
      const j = i + len;
      let best = 0;
      for (let k = i + 1; k < j; k++) {
        const gain = dp[i]![k]! + dp[k]![j]! + a[i]! * a[k]! * a[j]!;
        hooks.onChooseLast?.(i, j, k, gain);
        if (gain > best) best = gain;
      }
      dp[i]![j] = best;
      hooks.onFillCell?.(i, j, best);
    }
  }
  return dp[0]![m - 1]!;
}
