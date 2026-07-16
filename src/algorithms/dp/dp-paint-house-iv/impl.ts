// =============================================================================
// 粉刷房屋（k 色）· 纯算法实现（最小次小优化）
// =============================================================================

export interface PaintHouseHooks {
  onRow?: (i: number, dp: number[]) => void;
  onDone?: (minCost: number) => void;
}

export function paintHouseK(
  cost: ReadonlyArray<readonly number[]>,
  hooks: PaintHouseHooks = {},
): number {
  const n = cost.length;
  if (n === 0) {
    hooks.onDone?.(0);
    return 0;
  }
  const k = cost[0]!.length;
  let dp = [...cost[0]!];
  hooks.onRow?.(0, [...dp]);
  for (let i = 1; i < n; i++) {
    // 找上一行最小、次小及最小颜色
    let min1 = Number.POSITIVE_INFINITY;
    let min2 = Number.POSITIVE_INFINITY;
    let minIdx = -1;
    for (let j = 0; j < k; j++) {
      if (dp[j]! < min1) {
        min2 = min1;
        min1 = dp[j]!;
        minIdx = j;
      } else if (dp[j]! < min2) {
        min2 = dp[j]!;
      }
    }
    const next = new Array<number>(k).fill(0);
    for (let j = 0; j < k; j++) {
      const prev = j === minIdx ? min2 : min1;
      next[j] = cost[i]![j]! + prev;
    }
    dp = next;
    hooks.onRow?.(i, [...dp]);
  }
  let ans = Number.POSITIVE_INFINITY;
  for (const v of dp) if (v < ans) ans = v;
  hooks.onDone?.(ans);
  return ans;
}
