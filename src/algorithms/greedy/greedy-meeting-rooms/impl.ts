// =============================================================================
// 会议室（能否全部安排）· 纯算法实现 (LeetCode 252)
// 按开始时间排序，检查相邻区间是否重叠。
// =============================================================================
export interface Interval {
  start: number;
  end: number;
}

export interface GreedyMeetingRoomsHooks {
  onSort?: (sorted: Interval[]) => void;
  onCompare?: (i: number, prev: Interval, cur: Interval, overlap: boolean) => void;
  onConclude?: (canAttend: boolean) => void;
}

export function greedyMeetingRooms(
  intervals: readonly Interval[],
  hooks: GreedyMeetingRoomsHooks = {},
): boolean {
  if (intervals.length <= 1) {
    hooks.onConclude?.(true);
    return true;
  }
  const sorted = [...intervals].sort((a, b) => a.start - b.start);
  hooks.onSort?.(sorted);
  for (let i = 1; i < sorted.length; i++) {
    const overlap = sorted[i]!.start < sorted[i - 1]!.end;
    hooks.onCompare?.(i, sorted[i - 1]!, sorted[i]!, overlap);
    if (overlap) {
      hooks.onConclude?.(false);
      return false;
    }
  }
  hooks.onConclude?.(true);
  return true;
}
