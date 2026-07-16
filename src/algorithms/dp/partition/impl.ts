// =============================================================================
// 划分DP Partition（等和子集 / Partition Equal Subset Sum）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典问题（LeetCode 416）：能否把数组分成两个子集，使二者元素之和相等？
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface PartitionHooks {
  /** 处理第 i 件物品（0-based）时考虑目标和 target。 */
  onItem?: (i: number, target: number) => void;
  /** dp[w] 被设为 true（可达和 w）。 */
  onFillCell?: (w: number) => void;
  /** 算法完成：是否可等分。 */
  onDone?: (ok: boolean) => void;
}

/**
 * 划分等和子集（LeetCode 416）：判断 `nums` 能否分成两个子集使其和相等。
 *
 * 转化：能否选出子集使其和恰为 `total / 2`（total 为奇数直接 false）→ 即子集和问题。
 * 滚动 0/1 背包（bitset）：`dp[w]` = 能否凑出和 `w`。
 *   - `dp[0] = true`
 *   - 每件物品，从大到小枚举：`dp[w] = dp[w] || dp[w - nums[i]]`
 *
 * 时间 `O(n · target)`（target = total/2），空间 `O(target)`。
 *
 * @param nums 正整数数组
 * @returns 能否等分
 */
export function partition(nums: readonly number[], hooks: PartitionHooks = {}): boolean {
  const n = nums.length;
  if (n === 0) {
    hooks.onDone?.(true);
    return true;
  }
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % 2 !== 0) {
    hooks.onDone?.(false);
    return false;
  }
  const target = total / 2;
  const dp = new Array<boolean>(target + 1).fill(false);
  dp[0] = true;
  hooks.onFillCell?.(0);

  for (let i = 0; i < n; i++) {
    const x = nums[i]!;
    hooks.onItem?.(i, target);
    for (let w = target; w >= x; w--) {
      if (!dp[w] && dp[w - x]!) {
        dp[w] = true;
        hooks.onFillCell?.(w);
      }
    }
    if (dp[target]!) {
      hooks.onDone?.(true);
      return true;
    }
  }

  hooks.onDone?.(dp[target]!);
  return dp[target]!;
}
