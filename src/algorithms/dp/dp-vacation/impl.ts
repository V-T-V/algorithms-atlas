// =============================================================================
// 度假 DP（三选一）· 纯算法实现
// n 天，每天可在三项活动（a/b/c）中选一项，相邻两天不能选同一项；
// 每项每天有不同幸福度，求最大总幸福度。
// dp[i][j] = 第 i 天选活动 j 时前 i 天的最大幸福度。
//   dp[i][j] = h[i][j] + max_{k≠j} dp[i-1][k]。
// =============================================================================

export interface VacationHooks {
  onDay?: (i: number, dp: number[]) => void;
  onResult?: (total: number, plan: number[]) => void;
}

export function vacation(
  h: ReadonlyArray<readonly number[]>,
  hooks: VacationHooks = {},
): { total: number; plan: number[] } {
  const n = h.length;
  if (n === 0) {
    hooks.onResult?.(0, []);
    return { total: 0, plan: [] };
  }
  const m = h[0]!.length;
  const dp: number[][] = Array.from({ length: n }, () => new Array<number>(m).fill(0));
  for (let j = 0; j < m; j++) dp[0]![j] = h[0]![j]!;
  hooks.onDay?.(0, [...dp[0]!]);
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < m; j++) {
      let best = -Infinity;
      for (let k = 0; k < m; k++) {
        if (k === j) continue;
        if (dp[i - 1]![k]! > best) best = dp[i - 1]![k]!;
      }
      dp[i]![j] = h[i]![j]! + best;
    }
    hooks.onDay?.(i, [...dp[i]!]);
  }
  // 终值
  let total = -Infinity;
  let lastChoice = 0;
  for (let j = 0; j < m; j++) {
    if (dp[n - 1]![j]! > total) {
      total = dp[n - 1]![j]!;
      lastChoice = j;
    }
  }
  // 回溯
  const plan: number[] = [lastChoice];
  for (let i = n - 1; i >= 1; i--) {
    const cur = plan[0]!;
    let bestK = -1;
    let bestV = -Infinity;
    for (let k = 0; k < m; k++) {
      if (k === cur) continue;
      if (dp[i - 1]![k]! > bestV) {
        bestV = dp[i - 1]![k]!;
        bestK = k;
      }
    }
    plan.unshift(bestK);
  }
  hooks.onResult?.(total, plan);
  return { total, plan };
}
