// =============================================================================
// 最长公共子串（Longest Common Substring）· 纯算法实现
// 子串（substring）要求字符连续；区别于子序列（subsequence）。
// DP：dp[i][j] = 以 a[i-1]、b[j-1] 结尾的最长公共后缀长度。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface LcsHooks {
  /** 计算完 dp[i][j]。 */
  onCell?: (i: number, j: number, value: number) => void;
  /** 更新全局最长（新长度 len，结束于 a 的下标 endA、b 的下标 endB）。 */
  onBest?: (len: number, endA: number, endB: number) => void;
  /** 计算完成。 */
  onDone?: (length: number, substring: string) => void;
}

/**
 * 最长公共子串：返回 a、b 的最长公共连续子串。
 *
 * DP：dp[i][j] = a[i-1]===b[j-1] ? dp[i-1][j-1]+1 : 0。
 * 维护最大值与结束位置即可还原子串。
 * 时间 O(n·m)，空间 O(n·m)（可用滚动数组优化到 O(min(n,m))）。
 *
 * @param a 字符串 a
 * @param b 字符串 b
 * @returns { length, substring, startA, startB }
 */
export function longestCommonSubstring(
  a: string,
  b: string,
  hooks: LcsHooks = {},
): { length: number; substring: string; startA: number; startB: number } {
  const n = a.length;
  const m = b.length;
  if (n === 0 || m === 0) {
    hooks.onDone?.(0, '');
    return { length: 0, substring: '', startA: -1, startB: -1 };
  }
  // dp[i][j]：以 a[i-1], b[j-1] 结尾的最长公共后缀长度
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  let best = 0;
  let endA = -1;
  let endB = -1;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i]![j] = dp[i - 1]![j - 1]! + 1;
        hooks.onCell?.(i, j, dp[i]![j]!);
        if (dp[i]![j]! > best) {
          best = dp[i]![j]!;
          endA = i - 1;
          endB = j - 1;
          hooks.onBest?.(best, endA, endB);
        }
      } else {
        dp[i]![j] = 0;
        hooks.onCell?.(i, j, 0);
      }
    }
  }
  const substring = a.slice(endA - best + 1, endA + 1);
  hooks.onDone?.(best, substring);
  return { length: best, substring, startA: endA - best + 1, startB: endB - best + 1 };
}
