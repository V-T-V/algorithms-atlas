// =============================================================================
// 最大利润计划 · 纯算法实现 (LeetCode 1235 / 加权区间调度)
// jobs[i] = {start, end, profit}。按 end 排序，dp+二分。
// =============================================================================
export interface Job {
  start: number;
  end: number;
  profit: number;
}

export interface GreedyMaxProfitScheduleHooks {
  onSort?: (sorted: Job[]) => void;
  onConsider?: (jobIndex: number, take: number, skip: number, chosen: number) => void;
  onConclude?: (maxProfit: number) => void;
}

export function greedyMaxProfitSchedule(
  jobs: readonly Job[],
  hooks: GreedyMaxProfitScheduleHooks = {},
): number {
  if (jobs.length === 0) {
    hooks.onConclude?.(0);
    return 0;
  }
  const sorted = [...jobs].sort((a, b) => a.end - b.end);
  hooks.onSort?.(sorted);

  // 二分找最大的 k 使 sorted[k].end <= sorted[i].start
  const lastNonConflict = (i: number): number => {
    let lo = 0;
    let hi = i - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (sorted[mid]!.end <= sorted[i]!.start) lo = mid + 1;
      else hi = mid - 1;
    }
    return hi; // -1 表示无
  };

  const dp = new Array<number>(sorted.length).fill(0);
  for (let i = 0; i < sorted.length; i++) {
    const skip = i > 0 ? dp[i - 1]! : 0;
    const p = sorted[i]!.profit;
    const k = lastNonConflict(i);
    const take = p + (k >= 0 ? dp[k]! : 0);
    dp[i]! = Math.max(skip, take);
    hooks.onConsider?.(i, take, skip, dp[i]!);
  }
  hooks.onConclude?.(dp[sorted.length - 1]!);
  return dp[sorted.length - 1]!;
}
