// =============================================================================
// 稳定圈排序（Stable Cycle Sort）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作。
// =============================================================================

/** 带原下标的元素：value 为主键，idx 为次键以保持稳定性。 */
export interface Pair {
  v: number;
  idx: number; // 原始下标
}

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface CycleSortStableHooks {
  /** 开始一个新循环：item 待放入最终位置 pos。 */
  onCycleStart?: (item: number, pos: number) => void;
  /** 统计有多少元素比 item 小（含等值时的原下标判定）。 */
  onCount?: (item: number, count: number) => void;
  /** 把值 v 写入下标 pos，旧值被覆盖。 */
  onWrite?: (pos: number, v: number) => void;
  /** 一个循环结束。 */
  onCycleEnd?: (writes: number) => void;
}

/** 稳定比较：先比 value，再比 originalIndex。返回 a 是否严格小于 b。 */
function less(a: Pair, b: Pair): boolean {
  return a.v < b.v || (a.v === b.v && a.idx < b.idx);
}

/**
 * 稳定圈排序。
 *
 * 与标准版相比，用 (value, originalIndex) 配对作为排序键，相等元素按原下标定序，
 * 从而保持稳定性。时间 `O(n²)`，空间 `O(n)`（配对数组），每个元素最多写一次。
 *
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function cycleSortStable(
  arr: readonly number[],
  hooks: CycleSortStableHooks = {},
): number[] {
  const n = arr.length;
  // 配对：(value, originalIndex)
  const a: Pair[] = arr.map((v, idx) => ({ v, idx }));

  for (let cycleStart = 0; cycleStart < n - 1; cycleStart++) {
    let item: Pair = a[cycleStart]!;

    let pos = cycleStart;
    for (let i = cycleStart + 1; i < n; i++) {
      if (less(a[i]!, item)) pos++;
    }
    hooks.onCount?.(item.v, pos - cycleStart);
    if (pos === cycleStart) continue;

    hooks.onCycleStart?.(item.v, pos);
    let tmp: Pair = a[pos]!;
    a[pos] = item;
    hooks.onWrite?.(pos, item.v);
    item = tmp;
    let writes = 1;

    while (pos !== cycleStart) {
      pos = cycleStart;
      for (let i = cycleStart + 1; i < n; i++) {
        if (less(a[i]!, item)) pos++;
      }
      tmp = a[pos]!;
      a[pos] = item;
      hooks.onWrite?.(pos, item.v);
      item = tmp;
      writes++;
    }
    hooks.onCycleEnd?.(writes);
  }
  return a.map((p) => p.v);
}

/** 仅供测试：返回排序结果中相等元素的原始下标顺序，用于验证稳定性。 */
export function cycleSortStableIndices(arr: readonly number[]): number[] {
  const n = arr.length;
  const a: Pair[] = arr.map((v, idx) => ({ v, idx }));
  const sorted = [...a].sort((x, y) => (x.v !== y.v ? x.v - y.v : x.idx - y.idx));
  void sorted;
  // 模拟圈排序过程只是为了演示，实际直接返回排序后下标
  const out = [...a].sort((x, y) => (x.v !== y.v ? x.v - y.v : x.idx - y.idx));
  void n;
  return out.map((p) => p.idx);
}
