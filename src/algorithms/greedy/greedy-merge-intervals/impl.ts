// =============================================================================
// 合并区间 · 纯算法实现 (LeetCode 56)
// intervals[i] = [start, end]。
// =============================================================================
export interface GreedyMergeIntervalsHooks {
  onMerge?: (into: [number, number], merged: [number, number]) => void;
  onNew?: (interval: [number, number]) => void;
  onConclude?: (result: [number, number][]) => void;
}

export function greedyMergeIntervals(
  intervals: ReadonlyArray<readonly [number, number]>,
  hooks: GreedyMergeIntervalsHooks = {},
): [number, number][] {
  if (intervals.length === 0) {
    hooks.onConclude?.([]);
    return [];
  }
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const result: [number, number][] = [[sorted[0]![0], sorted[0]![1]]];
  hooks.onNew?.([sorted[0]![0], sorted[0]![1]]);
  for (let i = 1; i < sorted.length; i++) {
    const last = result[result.length - 1]!;
    if (sorted[i]![0]! <= last[1]) {
      last[1] = Math.max(last[1], sorted[i]![1]!);
      hooks.onMerge?.([last[0], last[1]], [sorted[i]![0]!, sorted[i]![1]!]);
    } else {
      result.push([sorted[i]![0]!, sorted[i]![1]!]);
      hooks.onNew?.([sorted[i]![0]!, sorted[i]![1]!]);
    }
  }
  hooks.onConclude?.(result);
  return result;
}
