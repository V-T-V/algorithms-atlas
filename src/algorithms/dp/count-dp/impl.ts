// =============================================================================
// 计数 DP（Counting DP）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典问题：m×n 网格从左上角到右下角的路径数（每步只能向右或向下）= C(m+n-2, m-1)。
// =============================================================================

/** 输入：网格行数 m、列数 n。 */
export interface GridPathInput {
  rows: number;
  cols: number;
}

/** 执行过程中的事件钩子。任一可选。 */
export interface CountDpHooks {
  /** 填好 dp[i][j]：到达格子 (i,j) 的路径数。 */
  onFillCell?: (i: number, j: number, count: number) => void;
  /** 算法完成：右下角路径数。 */
  onDone?: (count: number) => void;
}

/** 结果。 */
export interface CountDpResult {
  /** 到达右下角 (m-1,n-1) 的路径数。 */
  count: number;
  /** 完整 dp 表 m×n。 */
  dp: number[][];
}

/**
 * 计数 DP 解「不同路径」：m×n 网格，从 (0,0) 到 (m-1,n-1)，每步向右或向下，求路径数。
 *
 * 状态：`dp[i][j]` = 从 (0,0) 到 (i,j) 的路径数。
 *
 * 转移：`dp[i][j] = dp[i-1][j] + dp[i][j-1]`（来自上方和左方）。
 *
 * 边界：第 0 行与第 0 列恒为 1（只有一种走法：一路向右 / 一路向下）。
 *
 * 答案 = `dp[m-1][n-1]` = `C(m+n-2, m-1)`。复杂度 `O(m·n)`。
 *
 * @param input 网格规模
 * @param hooks 可选事件钩子
 */
export function countDp(input: GridPathInput, hooks: CountDpHooks = {}): CountDpResult {
  const { rows: m, cols: n } = input;
  if (m <= 0 || n <= 0) return { count: 0, dp: [] };

  const dp: number[][] = Array.from({ length: m }, () => new Array<number>(n).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let cnt: number;
      if (i === 0 || j === 0) {
        cnt = 1; // 第一行/第一列：唯一走法
      } else {
        cnt = dp[i - 1]![j]! + dp[i]![j - 1]!;
      }
      dp[i]![j] = cnt;
      hooks.onFillCell?.(i, j, cnt);
    }
  }

  const count = dp[m - 1]![n - 1]!;
  hooks.onDone?.(count);
  return { count, dp };
}

/** 组合数 C(n, k)，用于闭式校验。 */
export function binomial(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  k = Math.min(k, n - k);
  let r = 1;
  for (let i = 0; i < k; i++) r = (r * (n - i)) / (i + 1);
  return r;
}
