// =============================================================================
// 贪心设计范式 · 纯算法实现
// 以「区间调度」（最多不相交区间）为载体：按 end 升序，贪心选最早结束。
// 同时提供「活动选择」活动-选择通用框架与交换论证的简单验证。
// =============================================================================

export interface Interval {
  start: number;
  end: number;
}

export interface GreedyHooks {
  onSort?: (sorted: Interval[]) => void;
  onPick?: (interval: Interval, index: number, lastEnd: number) => void;
  onSkip?: (interval: Interval, reason: string) => void;
  onDone?: (picked: Interval[]) => void;
}

/**
 * 区间调度贪心：选最多不相交区间。
 * 策略：按 end 升序排序，从左到右选第一个不与上次冲突的。
 * 正确性（交换论证）：若最优解 OPT 的第一个区间结束时间不早于贪心选的 g，
 *   可用 g 替换 OPT 的第一个区间得到另一个合法最优解，归纳即得。
 */
export function intervalSchedule(
  intervals: readonly Interval[],
  hooks: GreedyHooks = {},
): Interval[] {
  const sorted = [...intervals].sort((a, b) => a.end - b.end);
  hooks.onSort?.([...sorted]);
  const picked: Interval[] = [];
  let lastEnd = -Infinity;
  sorted.forEach((iv, idx) => {
    if (iv.start >= lastEnd) {
      picked.push(iv);
      lastEnd = iv.end;
      hooks.onPick?.(iv, idx, lastEnd);
    } else {
      hooks.onSkip?.(iv, `start ${iv.start} < lastEnd ${lastEnd}`);
    }
  });
  hooks.onDone?.([...picked]);
  return picked;
}

/**
 * 活动选择（与区间调度等价的另一表述）：给定 start[]/finish[]，求最多兼容活动集合。
 */
export function activitySelection(
  start: readonly number[],
  finish: readonly number[],
  hooks: GreedyHooks = {},
): number[] {
  if (start.length !== finish.length) throw new RangeError('start/finish length mismatch');
  // 按 finish 升序
  const order = start.map((_, i) => i).sort((a, b) => finish[a]! - finish[b]!);
  const pickedIdx: number[] = [];
  let lastEnd = -Infinity;
  for (const i of order) {
    if (start[i]! >= lastEnd) {
      pickedIdx.push(i);
      lastEnd = finish[i]!;
      hooks.onPick?.({ start: start[i]!, end: finish[i]! }, i, lastEnd);
    } else {
      hooks.onSkip?.({ start: start[i]!, end: finish[i]! }, 'conflict');
    }
  }
  return pickedIdx;
}

/**
 * 验证一组区间是否两两不相交（用于反例对比）。
 */
export function isNonOverlapping(intervals: readonly Interval[]): boolean {
  const sorted = [...intervals].sort((a, b) => a.start - b.start);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i]!.start < sorted[i - 1]!.end) return false;
  }
  return true;
}
