// =============================================================================
// 粉刷房子 III · 纯算法实现
// dp[i][c][t] = 前 i+1 栋、末色 c、t 个街区最小成本。
// =============================================================================

export interface PaintHouseIIIHooks {
  onResult?: (cost: number) => void;
}

export function minCostPaintHouseIII(
  houses: number[],
  cost: number[][],
  n: number,
  target: number,
  hooks: PaintHouseIIIHooks = {},
): number {
  const m = houses.length;
  const colorCount = n;
  const INF = Number.POSITIVE_INFINITY;
  // dp[c][t]
  let dp: number[][] = Array.from({ length: colorCount + 1 }, () =>
    new Array<number>(target + 1).fill(INF),
  );
  // 第 0 栋
  for (let c = 1; c <= colorCount; c++) {
    if (houses[0] !== 0 && houses[0] !== c) continue;
    const cst = houses[0] === c ? 0 : cost[0]![c - 1]!;
    dp[c]![1] = cst;
  }
  for (let i = 1; i < m; i++) {
    const next: number[][] = Array.from({ length: colorCount + 1 }, () =>
      new Array<number>(target + 1).fill(INF),
    );
    for (let c = 1; c <= colorCount; c++) {
      if (houses[i] !== 0 && houses[i] !== c) continue;
      const cst = houses[i] === c ? 0 : cost[i]![c - 1]!;
      for (let pc = 1; pc <= colorCount; pc++) {
        for (let t = 1; t <= target; t++) {
          if (dp[pc]![t] === INF) continue;
          const nt = t + (pc === c ? 0 : 1);
          if (nt > target) continue;
          next[c]![nt] = Math.min(next[c]![nt]!, dp[pc]![t]! + cst);
        }
      }
    }
    dp = next;
  }
  let ans = INF;
  for (let c = 1; c <= colorCount; c++) ans = Math.min(ans, dp[c]![target]!);
  const res = ans === INF ? -1 : ans;
  hooks.onResult?.(res);
  return res;
}
