// =============================================================================
// 插入区间 · 纯算法实现 (LeetCode 57)
// intervals 已按 start 升序且互不重叠。newInterval 待插入。
// =============================================================================
export interface GreedyInsertIntervalHooks {
  onAdd?: (interval: [number, number], phase: 'left' | 'merged' | 'right') => void;
  onMerge?: (current: [number, number]) => void;
  onConclude?: (result: [number, number][]) => void;
}

export function greedyInsertInterval(
  intervals: ReadonlyArray<readonly [number, number]>,
  newInterval: readonly [number, number],
  hooks: GreedyInsertIntervalHooks = {},
): [number, number][] {
  const result: [number, number][] = [];
  const merged: [number, number] = [newInterval[0], newInterval[1]];
  let placed = false;
  for (const iv of intervals) {
    if (iv[1] < merged[0]) {
      // 完全在新区间左侧
      result.push([iv[0], iv[1]]);
      hooks.onAdd?.([iv[0], iv[1]], 'left');
    } else if (iv[0] > merged[1]) {
      // 完全在新区间右侧
      if (!placed) {
        result.push([merged[0], merged[1]]);
        hooks.onAdd?.([merged[0], merged[1]], 'merged');
        placed = true;
      }
      result.push([iv[0], iv[1]]);
      hooks.onAdd?.([iv[0], iv[1]], 'right');
    } else {
      // 重叠：合并
      merged[0] = Math.min(merged[0], iv[0]);
      merged[1] = Math.max(merged[1], iv[1]);
      hooks.onMerge?.([merged[0], merged[1]]);
    }
  }
  if (!placed) {
    result.push([merged[0], merged[1]]);
    hooks.onAdd?.([merged[0], merged[1]], 'merged');
  }
  hooks.onConclude?.(result);
  return result;
}
