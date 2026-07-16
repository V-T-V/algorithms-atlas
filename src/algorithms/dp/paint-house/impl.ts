// =============================================================================
// 粉刷房子 Paint House · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典问题（LeetCode 256）：N 幢房子排成一行，相邻房子不能同色，
// cost[i][c] = 房子 i 刷颜色 c 的花费，求刷完所有房子的最小总花费。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface PaintHouseHooks {
  /** dp[i][c] 已求值：前 i+1 幢房子且第 i 幢刷颜色 c 的最小总花费。 */
  onFillCell?: (i: number, c: number, val: number, fromColor: number) => void;
  /** 算法完成。 */
  onDone?: (total: number) => void;
}

/**
 * 粉刷房子（LeetCode 256）。
 *
 * 状态：`dp[i][c]` = 刷完前 `i+1` 幢、且第 `i` 幢用颜色 `c` 时的最小总花费。
 * 转移：`dp[i][c] = cost[i][c] + min(dp[i-1][k] for k ≠ c)`。
 * 答案：`min(dp[n-1][*])`。
 *
 * 普通三色实现复杂度 `O(n·k²)`；这里用「除本列外的最小/次小」优化到 `O(n·k)`：
 * 对每行维护最小值 `m1`、次小值 `m2`，转移时若本格列等于最小列就取次小，否则取最小。
 *
 * 时间 `O(n·k)`，空间 `O(n·k)`（可滚动到 `O(k)`）。
 *
 * @param costs costs[i][c] = 房子 i 刷颜色 c 的花费（非负整数）
 * @returns 最小总花费
 */
export function paintHouse(
  costs: readonly (readonly number[])[],
  hooks: PaintHouseHooks = {},
): number {
  const n = costs.length;
  if (n === 0) {
    hooks.onDone?.(0);
    return 0;
  }
  const k = costs[0]!.length;
  if (k === 0) {
    hooks.onDone?.(0);
    return 0;
  }

  // dp[i][c]
  const dp: number[][] = Array.from({ length: n }, () => new Array<number>(k).fill(0));
  // 第 0 行直接复制
  for (let c = 0; c < k; c++) {
    dp[0]![c] = costs[0]![c]!;
    hooks.onFillCell?.(0, c, dp[0]![c]!, -1);
  }

  for (let i = 1; i < n; i++) {
    // 找上一行的最小与次小（及其颜色下标）
    let m1 = Infinity;
    let m1c = -1;
    let m2 = Infinity;
    let m2c = -1;
    for (let c = 0; c < k; c++) {
      const v = dp[i - 1]![c]!;
      if (v < m1) {
        m2 = m1;
        m2c = m1c;
        m1 = v;
        m1c = c;
      } else if (v < m2) {
        m2 = v;
        m2c = c;
      }
    }
    for (let c = 0; c < k; c++) {
      const useMin = c !== m1c;
      const prev = useMin ? m1 : m2;
      dp[i]![c] = costs[i]![c]! + prev;
      hooks.onFillCell?.(i, c, dp[i]![c]!, useMin ? m1c : m2c);
    }
  }

  const ans = Math.min(...dp[n - 1]!);
  hooks.onDone?.(ans);
  return ans;
}
