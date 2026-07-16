// =============================================================================
// 区间 DP（Interval DP）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 经典问题：石子合并（相邻石子合并，每次代价为两者之和，求最小总代价）。
// =============================================================================

/** 区间 DP 执行过程中的事件钩子。任一可选。 */
export interface IntervalDpHooks {
  /** 开始计算区间 [i,j]（长度 len = j-i+1）。 */
  onEnterInterval?: (i: number, j: number, len: number) => void;
  /** 在区间 [i,j] 中尝试以 k 为分割点：cost = dp[i][k] + dp[k+1][j] + sum(i..j)。 */
  onTrySplit?: (i: number, j: number, k: number, candidate: number) => void;
  /** 区间 [i,j] 已求出最优值 value，最优分割点 split。 */
  onSolve?: (i: number, j: number, value: number, split: number) => void;
  /** 算法完成：最小总代价。 */
  onDone?: (minCost: number) => void;
}

/** 区间 DP 结果。 */
export interface IntervalDpResult {
  /** 最小总合并代价。 */
  minCost: number;
  /** dp[i][j]：区间 [i,j] 最小代价。 */
  dp: number[][];
  /** split[i][j]：区间 [i,j] 的最优分割点。 */
  split: number[][];
}

/**
 * 区间 DP：石子合并（最小总代价）。
 *
 * 状态 `dp[i][j]` = 把相邻石子 `stones[i..j]` 合成一堆的最小代价。
 *
 * 转移（按区间长度 `len` 升序枚举）：
 *   `dp[i][j] = min over k∈[i,j) ( dp[i][k] + dp[k+1][j] ) + prefixSum(j+1) − prefixSum(i)`
 * 其中 `prefixSum` 为前缀和，`prefixSum(j+1)−prefixSum(i)` = `Σ stones[i..j]`，即本次合并的代价。
 *
 * 边界：`dp[i][i] = 0`（单堆无需合并）。
 *
 * @param stones 各堆石子数
 * @param hooks 可选事件钩子
 * @returns 最小总代价、dp 表、分割点表
 */
export function intervalDp(
  stones: readonly number[],
  hooks: IntervalDpHooks = {},
): IntervalDpResult {
  const n = stones.length;
  if (n === 0) return { minCost: 0, dp: [], split: [] };
  if (n === 1) return { minCost: 0, dp: [[0]], split: [[-1]] };

  // 前缀和
  const prefix = new Array<number>(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i]! + stones[i]!;
  const rangeSum = (i: number, j: number): number => prefix[j + 1]! - prefix[i]!;

  const dp: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  const split: number[][] = Array.from({ length: n }, () => new Array<number>(n).fill(-1));
  const INF = Infinity;

  for (let len = 2; len <= n; len++) {
    for (let i = 0; i + len - 1 < n; i++) {
      const j = i + len - 1;
      hooks.onEnterInterval?.(i, j, len);
      dp[i]![j] = INF;
      for (let k = i; k < j; k++) {
        const cand = dp[i]![k]! + dp[k + 1]![j]!;
        hooks.onTrySplit?.(i, j, k, cand + rangeSum(i, j));
        if (cand < dp[i]![j]!) {
          dp[i]![j] = cand;
          split[i]![j] = k;
        }
      }
      dp[i]![j] = dp[i]![j]! + rangeSum(i, j);
      hooks.onSolve?.(i, j, dp[i]![j]!, split[i]![j]!);
    }
  }

  const minCost = dp[0]![n - 1]!;
  hooks.onDone?.(minCost);
  return { minCost, dp, split };
}
