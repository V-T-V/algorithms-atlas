// 均值收益博弈 (最大圈均值) · 实现 (Karp)
export interface MpHooks {
  onLen?: (k: number, dk: number[]) => void;
  onConclude?: (maxCycleMean: number) => void;
}
export function meanPayoff(
  n: number,
  edges: ReadonlyArray<readonly [number, number, number]>,
  hooks: MpHooks = {},
): number {
  // dp[k][v] = 从某起点走 k 步到 v 的最短路径权重；max over v of max_k (dp[n][v]-dp[k][v])/(n-k)
  const INF = Infinity;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(n).fill(INF));
  dp[0] = new Array<number>(n).fill(0);
  for (let k = 0; k < n; k++) {
    for (let v = 0; v < n; v++)
      if (dp[k]![v]! < INF) {
        for (const [from, to, w] of edges)
          if (from === v) {
            if (dp[k]![v]! + w < dp[k + 1]![to]!) dp[k + 1]![to] = dp[k]![v]! + w;
          }
      }
    hooks.onLen?.(k + 1, dp[k + 1]!);
  }
  let best = -INF;
  for (let v = 0; v < n; v++) {
    if (dp[n]![v] === INF) continue;
    for (let k = 0; k < n; k++)
      if (dp[k]![v]! < INF) {
        const mean = (dp[n]![v]! - dp[k]![v]!) / (n - k);
        if (mean > best) best = mean;
      }
  }
  hooks.onConclude?.(best);
  return best;
}
