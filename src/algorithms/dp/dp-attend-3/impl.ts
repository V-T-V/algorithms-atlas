// =============================================================================
// 参加最多活动 · 纯算法实现（贪心：按结束时间排序）
// =============================================================================
export interface AttendHooks {
  onSort?: (order: number[]) => void;
  onPick?: (idx: number, interval: readonly number[]) => void;
  onSkip?: (idx: number, interval: readonly number[]) => void;
  onDone?: (count: number) => void;
}

export interface Interval {
  start: number;
  end: number;
}

export function maxMeetings(intervals: readonly Interval[], hooks: AttendHooks = {}): number {
  const order = intervals
    .map((_, i) => i)
    .sort((a, b) => {
      const ea = intervals[a]!.end,
        eb = intervals[b]!.end;
      return ea !== eb ? ea - eb : intervals[a]!.start - intervals[b]!.start;
    });
  hooks.onSort?.(order);
  let count = 0,
    lastEnd = -Infinity;
  for (const idx of order) {
    const it = intervals[idx]!;
    if (it.start >= lastEnd) {
      count++;
      lastEnd = it.end;
      hooks.onPick?.(idx, [it.start, it.end]);
    } else {
      hooks.onSkip?.(idx, [it.start, it.end]);
    }
  }
  hooks.onDone?.(count);
  return count;
}
