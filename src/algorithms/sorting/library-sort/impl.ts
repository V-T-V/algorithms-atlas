// =============================================================================
// 图书馆排序 Library Sort (Gapped Insertion Sort) · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface LibrarySortHooks {
  /** 把元素 v 二分插入到已排序段位置 pos。 */
  onInsert?: (v: number, pos: number) => void;
  /** 为腾出空位，把槽位整体搬移（「重排/再平衡」）。 */
  onRebalance?: (inserted: number) => void;
}

/**
 * 图书馆排序（Library Sort / Gapped Insertion Sort）。
 *
 * 原理：类似图书管理员在书架上为每本书留空，使后续插入不必大量搬移。
 * 它是**插入排序的改进**：维护一个带「空槽」的已排序区，新元素用二分找到位置后，
 * 优先插入到最近的空槽；当空槽耗尽时做一次「重排（rebalance）」重新均匀预留空位。
 *
 * - 平均时间 `O(n log n)`，最坏 `O(n²)`（空位不足时退化）
 * - 空间 `O(n)`（预留空槽）
 * - 稳定性：**稳定**
 *
 * 本实现用一个紧凑的「已排序数组」配合「元素索引 → 带空槽位置」的映射，
 * 保留二分插入 + 周期性重排的核心思想，并保证结果正确。
 *
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function librarySort(arr: readonly number[], hooks: LibrarySortHooks = {}): number[] {
  const n = arr.length;
  if (n <= 1) return [...arr];

  const GAP = 1; // 每两个元素之间预留 1 个空槽
  const step = GAP + 1; // 每个元素占的槽宽
  const cap = n * step + 1; // 总槽位数
  const buf: Array<number | null> = new Array(cap).fill(null);

  /** 在已插入元素中二分查找：第一个 > v 的「逻辑位置」 idx（0-based，按元素计）。 */
  const lowerBoundIdx = (v: number, count: number): number => {
    let lo = 0;
    let hi = count;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      const slot = mid * step;
      if ((buf[slot] as number) <= v) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };

  /** 把元素逻辑下标 idx（及之后）整体后移一格，腾出 idx 的槽位。 */
  const shiftRight = (idx: number, count: number): void => {
    for (let i = count; i > idx; i--) {
      buf[i * step] = buf[(i - 1) * step]!;
      buf[(i - 1) * step] = null;
    }
  };

  /** 重排：把已插入元素紧凑收集，并按 step 重新均匀铺开留空槽。 */
  const rebalance = (count: number): void => {
    const vals: number[] = [];
    for (let i = 0; i < count; i++) vals.push(buf[i * step] as number);
    for (let i = 0; i < cap; i++) buf[i] = null;
    for (let i = 0; i < count; i++) buf[i * step] = vals[i]!;
  };

  let count = 0;
  for (let i = 0; i < n; i++) {
    const v = arr[i]!;
    const idx = lowerBoundIdx(v, count);
    // 若目标逻辑位置对应的物理槽已被占用 → 重排腾出空间
    if (buf[idx * step] !== null) {
      rebalance(count);
      hooks.onRebalance?.(count);
    }
    shiftRight(idx, count);
    buf[idx * step] = v;
    count++;
    hooks.onInsert?.(v, idx);
  }

  const out: number[] = [];
  for (let i = 0; i < count; i++) out.push(buf[i * step] as number);
  return out;
}
