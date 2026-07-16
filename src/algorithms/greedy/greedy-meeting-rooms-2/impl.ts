// =============================================================================
// 会议室 II · 纯算法实现 (LeetCode 253)
// 排序 + 双指针扫描：开始事件 +1，结束事件 -1，取最大并发数。
// =============================================================================
export interface Interval {
  start: number;
  end: number;
}

export interface GreedyMeetingRooms2Hooks {
  onEvent?: (time: number, delta: number, rooms: number) => void;
  onConclude?: (minRooms: number) => void;
}

export function greedyMeetingRooms2(
  intervals: readonly Interval[],
  hooks: GreedyMeetingRooms2Hooks = {},
): number {
  if (intervals.length === 0) {
    hooks.onConclude?.(0);
    return 0;
  }
  const starts = intervals.map((iv) => iv.start).sort((a, b) => a - b);
  const ends = intervals.map((iv) => iv.end).sort((a, b) => a - b);

  let rooms = 0;
  let maxRooms = 0;
  let s = 0;
  let e = 0;
  while (s < starts.length) {
    if (starts[s]! < ends[e]!) {
      rooms++;
      hooks.onEvent?.(starts[s]!, 1, rooms);
      maxRooms = Math.max(maxRooms, rooms);
      s++;
    } else {
      rooms--;
      hooks.onEvent?.(ends[e]!, -1, rooms);
      e++;
    }
  }
  hooks.onConclude?.(maxRooms);
  return maxRooms;
}
