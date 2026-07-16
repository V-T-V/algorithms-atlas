// =============================================================================
// 无重叠区间 · 纯算法实现 (LeetCode 435)
// intervals[i] = [start, end]。按 end 排序贪心。
// =============================================================================
export interface GreedyNonOverlappingHooks {
  onKeep?: (index: number, start: number, end: number) => void;
  onRemove?: (index: number, start: number, end: number) => void;
  onConclude?: (removed: number) => void;
}

export function greedyNonOverlapping(
  intervals: ReadonlyArray<readonly [number, number]>,
  hooks: GreedyNonOverlappingHooks = {},
): number {
  if (intervals.length === 0) {
    hooks.onConclude?.(0);
    return 0;
  }
  const sorted = [...intervals].sort((a, b) => a[1] - b[1]);
  let end = sorted[0]![1];
  let keep = 1;
  hooks.onKeep?.(0, sorted[0]![0], sorted[0]![1]);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i]![0]! >= end) {
      end = sorted[i]![1]!;
      keep++;
      hooks.onKeep?.(i, sorted[i]![0]!, sorted[i]![1]!);
    } else {
      hooks.onRemove?.(i, sorted[i]![0]!, sorted[i]![1]!);
    }
  }
  const removed = intervals.length - keep;
  hooks.onConclude?.(removed);
  return removed;
}
