// =============================================================================
// 视频拼接 · 纯算法实现 (LeetCode 1024)
// clips[i] = [start, end]。贪心跳跃覆盖 [0,T]。
// =============================================================================
export interface GreedyVideoStitchingHooks {
  onPick?: (clipIndex: number, start: number, end: number) => void;
  onConclude?: (count: number) => void;
}

export function greedyVideoStitching(
  clips: ReadonlyArray<readonly [number, number]>,
  T: number,
  hooks: GreedyVideoStitchingHooks = {},
): number {
  const sorted = [...clips].sort((a, b) => a[0] - b[0] || b[1] - a[1]);
  let count = 0;
  let curEnd = 0;
  let nextEnd = 0;
  let i = 0;
  while (curEnd < T) {
    while (i < sorted.length && sorted[i]![0]! <= curEnd) {
      nextEnd = Math.max(nextEnd, sorted[i]![1]!);
      i++;
    }
    if (nextEnd <= curEnd) {
      hooks.onConclude?.(-1);
      return -1; // 无法延伸
    }
    curEnd = nextEnd;
    count++;
    hooks.onPick?.(i - 1, sorted[Math.max(0, i - 1)]![0]!, curEnd);
  }
  hooks.onConclude?.(count);
  return count;
}
