// =============================================================================
// 解码方法 Decode Ways · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典问题：数字串 "111" 可解码为 "AAA"/"AK"/"KA" 共 3 种。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface DecodeWaysHooks {
  /** dp[i] 已求值，表示 s[0..i) 的解码方式数。take1/take2 表示本步来源。 */
  onFillCell?: (i: number, val: number, take1: boolean, take2: boolean) => void;
  /** 算法完成。 */
  onDone?: (total: number) => void;
}

/**
 * 解码方法（LeetCode 91）。
 *
 * 一条含 `A-Z` 的消息按 `A→1 ... Z→26` 编码为数字串，给定数字串 `s`，求解码总数。
 *
 * 线性 DP：`dp[i]` = `s[0..i)` 的解码方式数。
 *   - `dp[0] = 1`（空串一种）
 *   - 若 `s[i-1]` 单独合法（`'1'..'9'`）：`dp[i] += dp[i-1]`
 *   - 若 `s[i-2..i-1]` 两位合法（`'10'..'26'`）：`dp[i] += dp[i-2]`
 *
 * 含 `'0'` 起头的非法段时方案数为 0。答案为 `dp[n]`。
 *
 * 时间 `O(n)`，空间 `O(n)`（可滚动至 `O(1)`）。
 *
 * @param s 仅含数字字符的串
 * @returns 解码总数；空串返回 1
 */
export function decodeWays(s: string, hooks: DecodeWaysHooks = {}): number {
  const n = s.length;
  if (n === 0) {
    hooks.onDone?.(1);
    return 1;
  }

  const dp = new Array<number>(n + 1).fill(0);
  dp[0] = 1;
  hooks.onFillCell?.(0, 1, false, false);

  for (let i = 1; i <= n; i++) {
    let take1 = false;
    let take2 = false;
    const one = s[i - 1]!;
    if (one >= '1' && one <= '9') {
      dp[i] = dp[i]! + dp[i - 1]!;
      take1 = true;
    }
    if (i >= 2) {
      const two = s.slice(i - 2, i);
      if (two >= '10' && two <= '26') {
        dp[i] = dp[i]! + dp[i - 2]!;
        take2 = true;
      }
    }
    hooks.onFillCell?.(i, dp[i]!, take1, take2);
  }

  hooks.onDone?.(dp[n]!);
  return dp[n]!;
}
