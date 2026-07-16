// 区间调度 · 实现
export interface Interval {
  s: number;
  e: number;
}
export interface IntervalHooks {
  onPick?: (idx: number, iv: Interval) => void;
  onSkip?: (idx: number, iv: Interval) => void;
  onConclude?: (count: number, picked: Interval[]) => void;
}
export interface IntervalResult {
  count: number;
  picked: Interval[];
}
export function greedyInterval3(
  intervals: ReadonlyArray<Interval>,
  hooks: IntervalHooks = {},
): IntervalResult {
  const order = intervals.map((iv, i) => ({ iv, i })).sort((a, b) => a.iv.e - b.iv.e);
  let lastEnd = -Infinity;
  const picked: Interval[] = [];
  for (const { iv, i } of order) {
    if (iv.s >= lastEnd) {
      picked.push(iv);
      lastEnd = iv.e;
      hooks.onPick?.(i, iv);
    } else hooks.onSkip?.(i, iv);
  }
  hooks.onConclude?.(picked.length, picked);
  return { count: picked.length, picked };
}
