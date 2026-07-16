// =============================================================================
// 最长公共子序列 LCS · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface LcsHooks {
  /** 填好 dp[i][j]（即 a 前 i 个、b 前 j 个的 LCS 长度）。 */
  onFillCell?: (i: number, j: number, val: number, from: 'match' | 'up' | 'left') => void;
  /** 回溯经过单元格 (i,j)，且当 from==='match' 时为「公共字符」贡献点。 */
  onBacktrack?: (i: number, j: number, isMatch: boolean) => void;
}

/**
 * 最长公共子序列（Longest Common Subsequence）。
 *
 * 状态：`dp[i][j]` = `a[0..i)` 与 `b[0..j)` 的 LCS 长度。
 * 转移：
 *   - 若 `a[i-1] === b[j-1]`：`dp[i][j] = dp[i-1][j-1] + 1`（来自左上，记为 match）
 *   - 否则：`dp[i][j] = max(dp[i-1][j], dp[i][j-1])`（取上/左较大者）
 * 回溯：从右下角出发，按上述来源还原一条具体 LCS。
 *
 * @param a 字符串/序列 A（不区分字符与元素，逐项 === 比较）
 * @param b 字符串/序列 B
 * @param hooks 可选事件钩子
 * @returns 一条最长公共子序列。任一为空返回 `''`。
 */
export function lcs(a: string, b: string, hooks: LcsHooks = {}): string {
  const m = a.length;
  const n = b.length;
  if (m === 0 || n === 0) return '';

  // dp 大小 (m+1) x (n+1)，第 0 行/列全 0（表示空前缀）
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i]![j] = dp[i - 1]![j - 1]! + 1;
        hooks.onFillCell?.(i, j, dp[i]![j]!, 'match');
      } else {
        const up = dp[i - 1]![j]!;
        const left = dp[i]![j - 1]!;
        if (up >= left) {
          dp[i]![j] = up;
          hooks.onFillCell?.(i, j, up, 'up');
        } else {
          dp[i]![j] = left;
          hooks.onFillCell?.(i, j, left, 'left');
        }
      }
    }
  }

  // 回溯（从右下角到左上角）
  const chars: string[] = [];
  let i = m;
  let j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      hooks.onBacktrack?.(i, j, true);
      chars.push(a[i - 1]!);
      i--;
      j--;
    } else if (dp[i - 1]![j]! >= dp[i]![j - 1]!) {
      hooks.onBacktrack?.(i, j, false);
      i--;
    } else {
      hooks.onBacktrack?.(i, j, false);
      j--;
    }
  }
  chars.reverse();
  return chars.join('');
}

/**
 * 辅助：仅计算 LCS 长度（O(min(m,n)) 空间优化版），无钩子、无回溯。
 * 适合只需长度的场景。
 */
export function lcsLength(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0 || n === 0) return 0;
  let prev = new Array<number>(n + 1).fill(0);
  let cur = new Array<number>(n + 1).fill(0);
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) cur[j] = prev[j - 1]! + 1;
      else cur[j] = Math.max(prev[j]!, cur[j - 1]!);
    }
    [prev, cur] = [cur, prev];
    cur.fill(0);
  }
  return prev[n]!;
}
