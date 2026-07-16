// =============================================================================
// 最大休假天数 · 纯算法实现
// dp[c] = 当前周身处城市 c 的最大休假；滚动推进。
// =============================================================================

export interface MaximumVacationHooks {
  onWeek?: (w: number, dp: number[]) => void;
  onResult?: (days: number) => void;
}

export function maxVacationDays(
  flights: number[][],
  days: number[][],
  hooks: MaximumVacationHooks = {},
): number {
  const n = flights.length;
  if (n === 0) {
    hooks.onResult?.(0);
    return 0;
  }
  const K = days[0]!.length;
  // dp[c] = 当前周（已含本周）身处城市 c 的最大休假
  let dp: number[] = new Array<number>(n).fill(-Infinity);
  // 第 0 周：从城市 0 出发，可飞到 flights[0][j] 或停留 0
  for (let c = 0; c < n; c++) {
    if (c === 0 || flights[0]![c] === 1) dp[c] = days[c]![0]!;
  }
  hooks.onWeek?.(0, dp);
  for (let w = 1; w < K; w++) {
    const next: number[] = new Array<number>(n).fill(-Infinity);
    for (let c = 0; c < n; c++) {
      for (let p = 0; p < n; p++) {
        if (dp[p] === -Infinity) continue;
        if (p === c || flights[p]![c] === 1) {
          next[c] = Math.max(next[c]!, dp[p]! + days[c]![w]!);
        }
      }
    }
    dp = next;
    hooks.onWeek?.(w, dp);
  }
  const ans = Math.max(...dp);
  hooks.onResult?.(ans);
  return ans;
}
