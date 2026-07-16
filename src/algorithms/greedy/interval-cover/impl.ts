// =============================================================================
// 区间覆盖（Interval Cover）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// 用最少区间覆盖一段连续目标区间 [L, R]。
// =============================================================================

/** 区间。 */
export interface Interval {
  start: number;
  end: number;
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface IntervalCoverHooks {
  onSort?: (order: number[]) => void;
  onPick?: (idx: number, covered: number) => void;
  onResult?: (chosen: number[]) => void;
}

export interface IntervalCoverResult {
  /** 被选中区间的原始下标。 */
  chosen: number[];
}

/**
 * 最少区间覆盖：用最少区间完全覆盖目标 [L, R]。
 *
 * 贪心：按区间左端点排序；每次在「左端 ≤ 已覆盖末端」的区间中选右端最远的。
 * @param intervals 区间集合
 * @param target 目标区间 [L, R]
 * @param hooks 可选的事件钩子
 */
export function intervalCover(
  intervals: Interval[],
  target: { L: number; R: number },
  hooks: IntervalCoverHooks = {},
): IntervalCoverResult {
  const order = intervals.map((it, i) => ({ i, ...it })).sort((a, b) => a.start - b.start);
  hooks.onSort?.(order.map((o) => o.i));

  const chosen: number[] = [];
  let covered = target.L;
  let k = 0;
  while (covered < target.R && k < order.length) {
    let bestEnd = covered;
    let bestIdx = -1;
    while (k < order.length && order[k]!.start <= covered) {
      if (order[k]!.end > bestEnd) {
        bestEnd = order[k]!.end;
        bestIdx = order[k]!.i;
      }
      k++;
    }
    if (bestIdx === -1) break; // 出现空隙，无法覆盖
    chosen.push(bestIdx);
    covered = bestEnd;
    hooks.onPick?.(bestIdx, covered);
  }
  if (covered < target.R) return { chosen: [] }; // 无解
  hooks.onResult?.(chosen);
  return { chosen };
}
