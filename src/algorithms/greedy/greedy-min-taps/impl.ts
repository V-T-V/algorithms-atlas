// =============================================================================
// 最少水龙头浇灌 · 纯算法实现 (LeetCode 1326)
// ranges[i] = i 处水龙头的半径。转为区间后贪心跳跃。
// =============================================================================
export interface GreedyMinTapsHooks {
  onReach?: (position: number, farthest: number) => void;
  onJump?: (count: number) => void;
  onConclude?: (count: number) => void;
}

export function greedyMinTaps(
  n: number,
  ranges: readonly number[],
  hooks: GreedyMinTapsHooks = {},
): number {
  // 每个位置能向右延伸的最远
  const maxReach = new Array<number>(n + 1).fill(0);
  for (let i = 0; i <= n; i++) {
    const lo = Math.max(0, i - ranges[i]!);
    const hi = Math.min(n, i + ranges[i]!);
    maxReach[lo]! = Math.max(maxReach[lo]!, hi);
  }

  let taps = 0;
  let curEnd = 0;
  let nextEnd = 0;
  for (let i = 0; i <= n; i++) {
    nextEnd = Math.max(nextEnd, maxReach[i]!);
    hooks.onReach?.(i, nextEnd);
    if (i > nextEnd) {
      hooks.onConclude?.(-1);
      return -1; // 覆盖不到 i
    }
    if (i === curEnd && i < n) {
      taps++;
      curEnd = nextEnd;
      hooks.onJump?.(taps);
    }
  }
  hooks.onConclude?.(taps);
  return taps;
}
