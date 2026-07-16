// =============================================================================
// 区间调度（最早结束优先）· 纯算法实现
// 返回选出的不重叠区间下标（按输入顺序），以及数量。
// =============================================================================
export interface GreedyEarliestEndHooks {
  onSort?: (order: number[]) => void;
  onPick?: (index: number, interval: [number, number]) => void;
  onSkip?: (index: number, interval: [number, number]) => void;
  onConclude?: (count: number) => void;
}

export interface EarliestEndResult {
  count: number;
  picked: number[]; // 原始下标
}

export function greedyEarliestEnd(
  intervals: ReadonlyArray<readonly [number, number]>,
  hooks: GreedyEarliestEndHooks = {},
): EarliestEndResult {
  const n = intervals.length;
  const order = Array.from({ length: n }, (_, i) => i);
  order.sort((a, b) => {
    const ia = intervals[a]!;
    const ib = intervals[b]!;
    return ia[1] !== ib[1] ? ia[1] - ib[1] : ia[0] - ib[0];
  });
  hooks.onSort?.(order);

  const picked: number[] = [];
  let lastEnd = -Infinity;
  for (const idx of order) {
    const iv = intervals[idx]!;
    if (iv[0] >= lastEnd) {
      picked.push(idx);
      lastEnd = iv[1];
      hooks.onPick?.(idx, [iv[0], iv[1]]);
    } else {
      hooks.onSkip?.(idx, [iv[0], iv[1]]);
    }
  }
  hooks.onConclude?.(picked.length);
  return { count: picked.length, picked };
}
