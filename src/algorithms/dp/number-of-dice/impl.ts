// =============================================================================
// 骰子求和（Number of Dice Rolls With Target Sum）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 求：用 n 个 k 面骰子（面值 1..k）掷出总和恰为 target 的方案数。
// 滚动数组 DP：dp[s] = sum_{f=1..k} dp_prev[s-f]。O(n*target*k)。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface NumberOfDiceHooks {
  /** 填好第 i 颗骰子、和为 s 的方案数 val。 */
  onFill?: (i: number, s: number, val: number) => void;
  /** 用面值 f 累加到当前和 s。 */
  onUseFace?: (i: number, s: number, f: number) => void;
}

/**
 * 骰子求和：用 `n` 个 `faces` 面骰子（各面 1..faces）掷出总和恰为 `target` 的方案数。
 *
 * 状态：`dp[i][s]` = 前 `i` 颗骰子和为 `s` 的方案数。
 * 转移：`dp[i][s] = sum_{f=1..faces} dp[i-1][s-f]`（第 i 颗掷出 f）。
 * 初始：`dp[0][0] = 1`。
 *
 * @param n 骰子数（>=0）
 * @param faces 每颗骰子面数（>=1）
 * @param target 目标总和（>=0）
 * @param hooks 可选事件钩子
 * @returns 方案数（取模 1e9+7，避免溢出）。
 */
export function numberOfDice(
  n: number,
  faces: number,
  target: number,
  hooks: NumberOfDiceHooks = {},
): number {
  if (n <= 0) return target === 0 ? 1 : 0;
  if (target < n || target > n * faces) return 0; // 剪枝
  const MOD = 1_000_000_007;
  // prev = dp[i-1], cur = dp[i]
  let prev = new Array<number>(target + 1).fill(0);
  prev[0] = 1;
  for (let i = 1; i <= n; i++) {
    const cur = new Array<number>(target + 1).fill(0);
    for (let s = 1; s <= target; s++) {
      let sum = 0;
      for (let f = 1; f <= faces; f++) {
        if (s - f >= 0) {
          hooks.onUseFace?.(i, s, f);
          sum = (sum + prev[s - f]!) % MOD;
        }
      }
      cur[s] = sum;
      hooks.onFill?.(i, s, sum);
    }
    prev = cur;
  }
  return prev[target]!;
}
