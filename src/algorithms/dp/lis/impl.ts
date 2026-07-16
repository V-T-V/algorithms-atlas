// =============================================================================
// 最长递增子序列 LIS · 纯算法实现（O(n²) DP）
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface LisHooks {
  /** 考察以 i 结尾、回看前驱 j 的状态。val = 当前 dp[i]。 */
  onConsider?: (i: number, j: number, len: number) => void;
  /** 填好 dp[i]（以 i 结尾的最长长度），prev = 取得该长度的前驱下标（或 -1）。 */
  onFillCell?: (i: number, len: number, prev: number) => void;
  /** 回溯：把下标 i 标记为答案路径上的一员。 */
  onBacktrack?: (i: number) => void;
}

/**
 * 最长递增子序列（严格递增）。O(n²) DP。
 *
 * 状态：`dp[i]` = 以 `arr[i]` 结尾的（严格）最长递增子序列长度。
 * 转移：`dp[i] = max(dp[j]) + 1`，对所有 `j < i` 且 `arr[j] < arr[i]`。
 * 用 `prev[i]` 记录前驱，便于回溯还原一条具体路径。
 *
 * @param arr 输入序列（不会被修改）
 * @param hooks 可选事件钩子
 * @returns 一条最长递增子序列（按原序）。空输入返回 `[]`。
 */
export function lis(arr: readonly number[], hooks: LisHooks = {}): number[] {
  const n = arr.length;
  if (n === 0) return [];

  const dp = new Array<number>(n).fill(1);
  const prev = new Array<number>(n).fill(-1);

  for (let i = 0; i < n; i++) {
    let best = 1; // 至少包含 arr[i] 自身
    let bestPrev = -1;
    for (let j = 0; j < i; j++) {
      hooks.onConsider?.(i, j, dp[i]!);
      if (arr[j]! < arr[i]! && dp[j]! + 1 > best) {
        best = dp[j]! + 1;
        bestPrev = j;
      }
    }
    dp[i] = best;
    prev[i] = bestPrev;
    hooks.onFillCell?.(i, best, bestPrev);
  }

  // 找到 dp 最大值所在下标作为回溯起点
  let end = 0;
  for (let i = 1; i < n; i++) if (dp[i]! > dp[end]!) end = i;

  // 回溯出一条路径（下标从大到小，再反转）
  const pathIdx: number[] = [];
  let cur: number | -1 = end;
  while (cur !== -1) {
    hooks.onBacktrack?.(cur);
    pathIdx.push(cur);
    cur = prev[cur]!;
  }
  pathIdx.reverse();

  return pathIdx.map((k) => arr[k]!);
}
