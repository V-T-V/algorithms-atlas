// =============================================================================
// 二分插入排序（Binary Insertion Sort）· 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface BinaryInsertionHooks {
  /** 开始处理下标 i 的元素。 */
  onElement?: (i: number) => void;
  /** 二分查找区间收敛：[lo, hi)。 */
  onProbe?: (lo: number, mid: number, hi: number) => void;
  /** 已确定插入位置 pos。 */
  onInsertPos?: (pos: number) => void;
  /** 把 [pos, i) 右移一位并写入 a[i]。 */
  onInsert?: (pos: number, i: number) => void;
}

/**
 * 在升序段 a[0..hi) 中，用二分查找定位 value 的**稳定**插入位置：
 * 返回第一个 > value 的下标（即首个使 a[k] > value 的 k），
 * 等价于 upper-bound，从而保证相等元素保持原序（稳定）。
 */
function upperBound(a: readonly number[], hi: number, value: number): number {
  let lo = 0;
  let hi2 = hi;
  while (lo < hi2) {
    const mid = (lo + hi2) >> 1;
    if (a[mid]! <= value) lo = mid + 1;
    else hi2 = mid;
  }
  return lo;
}

/**
 * 二分插入排序：对每个 a[i]，二分查找插入点后右移搬入。
 * 时间 O(n²)（搬移主导），比较 O(n log n)，空间 O(1)，稳定。
 *
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function binaryInsertionSort(
  arr: readonly number[],
  hooks: BinaryInsertionHooks = {},
): number[] {
  const a = [...arr];
  const n = a.length;
  for (let i = 1; i < n; i++) {
    hooks.onElement?.(i);
    const value = a[i]!;

    // 二分查找插入位置（带探测回调）
    let lo = 0;
    let hi = i;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      hooks.onProbe?.(lo, mid, hi);
      if (a[mid]! <= value) lo = mid + 1;
      else hi = mid;
    }
    const pos = lo;
    hooks.onInsertPos?.(pos);

    // 右移 [pos, i) 并写入 value
    if (pos !== i) {
      for (let k = i; k > pos; k--) a[k] = a[k - 1]!;
      a[pos] = value;
      hooks.onInsert?.(pos, i);
    }
  }
  return a;
}

// 重新导出便于测试
export { upperBound };
