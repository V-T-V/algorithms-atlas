// =============================================================================
// 分治DP（Divide and Conquer DP Optimization）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 用途：当最优决策点 opt[i] 关于 i 单调（opt[i] <= opt[i+1]）时，
//   用分治把 1D1D DP 的 O(n^2) 转移降到 O(n log n)。
// 本实现：以「将序列分成若干连续段、最小化各段代价之和」为例（在线 DP + 分治优化）。
// =============================================================================

/** 计算区间 [l, r] 作为一个段的代价（示例：元素和的平方）。 */
export type CostFn = (l: number, r: number) => number;

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface DivideConquerDpHooks {
  /** 计算某层 [lo, hi] 的最优决策，在区间 [optLo, optHi] 内枚举。 */
  onSolve?: (lo: number, hi: number, optLo: number, optHi: number) => void;
  /** 枚举决策点 mid，从 j 转移得到候选值 val。 */
  onTry?: (mid: number, j: number, val: number) => void;
  /** 确定中点 mid 的最优决策 opt，填好 dp[mid]。 */
  onFill?: (mid: number, opt: number, val: number) => void;
}

/**
 * 分治 DP 优化：求解「把序列 [0, n) 切成任意多段」的最小总代价，
 * 其中每段 [l, r] 的代价由 cost(l, r) 给出。
 *
 * 适用前提：最优分割点关于位置单调（满足四边形不等式 / cost 满足单调性）。
 * 做法：对位置区间 [lo, hi] 分治，先求中点 mid 的最优决策 opt[mid]，
 * 则 [lo, mid-1] 的决策只需在 [optLo, opt[mid]] 内、[mid+1, hi] 在 [opt[mid], optHi] 内找。
 *
 * @param n 序列长度
 * @param cost 区间代价函数
 * @param hooks 可选事件钩子
 * @returns dp[i] = 把前 i 个元素切成若干段的最小代价；dp[n] 为答案。同时返回每个 i 的最优决策点。
 */
export function divideConquerDp(
  n: number,
  cost: CostFn,
  hooks: DivideConquerDpHooks = {},
): { dp: number[]; opt: number[] } {
  if (n <= 0) return { dp: [0], opt: [0] };
  // dp[i]: 前 i 个元素的最小代价（i 从 0..n）。dp[0] = 0（空）。
  const dp = new Array<number>(n + 1).fill(Infinity);
  const opt = new Array<number>(n + 1).fill(0);
  dp[0] = 0;

  // 分治：在位置 [lo, hi]（1..n）内填 dp，决策范围 [optLo, optHi]（0..n-1）
  const solve = (lo: number, hi: number, optLo: number, optHi: number): void => {
    if (lo > hi) return;
    hooks.onSolve?.(lo, hi, optLo, optHi);
    const mid = (lo + hi) >> 1;
    let best = Infinity;
    let bestJ = optLo;
    const jEnd = Math.min(optHi, mid - 1);
    for (let j = optLo; j <= jEnd; j++) {
      const cand = dp[j]! + cost(j, mid - 1); // 段 [j, mid-1]
      hooks.onTry?.(mid, j, cand);
      if (cand < best) {
        best = cand;
        bestJ = j;
      }
    }
    dp[mid] = best;
    opt[mid] = bestJ;
    hooks.onFill?.(mid, bestJ, best);
    solve(lo, mid - 1, optLo, bestJ);
    solve(mid + 1, hi, bestJ, optHi);
  };

  solve(1, n, 0, n - 1);
  return { dp, opt };
}
