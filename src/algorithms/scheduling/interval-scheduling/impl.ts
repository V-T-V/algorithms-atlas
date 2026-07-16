// =============================================================================
// 区间调度（活动选择）· 纯算法实现
// 贪心：按结束时间排序，选不重叠的最大子集。零 DOM 依赖，可独立单测。
// =============================================================================

export interface Interval {
  /** 开始时间。 */
  start: number;
  /** 结束时间（严格大于 start）。 */
  finish: number;
  /** 可选标识。 */
  id?: string;
}

export interface IntervalHooks {
  /** 按结束时间排序完成。 */
  onSort?: (sorted: Interval[]) => void;
  /** 考察某区间，给出是否选中。 */
  onConsider?: (interval: Interval, lastEnd: number, selected: boolean) => void;
  /** 算法结束，给出选中数量。 */
  onDone?: (selected: Interval[]) => void;
}

/**
 * 区间调度（活动选择）。
 *
 * @param intervals 区间列表
 * @param hooks 可选钩子
 * @returns 选中的不重叠区间子集（按结束时间顺序）
 */
export function intervalScheduling(
  intervals: readonly Interval[],
  hooks: IntervalHooks = {},
): Interval[] {
  if (intervals.length === 0) {
    hooks.onDone?.([]);
    return [];
  }
  // 1. 按结束时间升序（平局按开始时间）
  const sorted = [...intervals].sort((a, b) => a.finish - b.finish || a.start - b.start);
  hooks.onSort?.(sorted);

  // 2. 贪心选择
  const selected: Interval[] = [];
  let lastEnd = -Infinity;
  for (const it of sorted) {
    if (it.start >= lastEnd) {
      selected.push(it);
      lastEnd = it.finish;
      hooks.onConsider?.(it, lastEnd, true);
    } else {
      hooks.onConsider?.(it, lastEnd, false);
    }
  }
  hooks.onDone?.(selected);
  return selected;
}

/** 验证一组区间两两不重叠。 */
export function isNonOverlapping(intervals: readonly Interval[]): boolean {
  const sorted = [...intervals].sort((a, b) => a.finish - b.finish);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i]!.start < sorted[i - 1]!.finish) return false;
  }
  return true;
}
