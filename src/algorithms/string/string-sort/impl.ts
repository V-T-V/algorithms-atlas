// =============================================================================
// 字符串排序（字典序，基于比较的归并排序）· 纯算法实现
// 对一组字符串按字典序升序排列（稳定）。用归并排序保证 O(L·N·log N) 且稳定。
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface StringSortHooks {
  /** 比较两个字符串 a、b（返回 -1/0/1）。 */
  onCompare?: (a: string, b: string, cmp: number) => void;
  /** 合并两个有序段 [lo,mid) 与 [mid,hi)。 */
  onMerge?: (lo: number, mid: number, hi: number) => void;
  /** 计算完成。 */
  onDone?: (sorted: string[]) => void;
}

/**
 * 字符串字典序比较：a < b 返回 -1，相等 0，a > b 返回 1。
 * 按字符码点逐位比较（不区分语言区域，确定性）。
 */
export function compareStrings(a: string, b: string, hooks: StringSortHooks = {}): number {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    if (a[i]! < b[i]!) {
      hooks.onCompare?.(a, b, -1);
      return -1;
    }
    if (a[i]! > b[i]!) {
      hooks.onCompare?.(a, b, 1);
      return 1;
    }
  }
  const cmp = a.length < b.length ? -1 : a.length > b.length ? 1 : 0;
  hooks.onCompare?.(a, b, cmp);
  return cmp;
}

/**
 * 字符串归并排序：按字典序升序、稳定。
 *
 * 时间 O(N·log N·L)（每次比较最坏 O(L)），空间 O(N)。
 *
 * @returns 排序后的新数组（不改原数组）
 */
export function stringSort(words: string[], hooks: StringSortHooks = {}): string[] {
  const arr = [...words];
  const aux: string[] = new Array(arr.length);
  const mergeSort = (lo: number, hi: number): void => {
    if (hi - lo <= 1) return;
    const mid = (lo + hi) >> 1;
    mergeSort(lo, mid);
    mergeSort(mid, hi);
    hooks.onMerge?.(lo, mid, hi);
    // 合并 [lo,mid) 与 [mid,hi) 到 aux
    let i = lo;
    let j = mid;
    for (let k = lo; k < hi; k++) {
      if (i >= mid) {
        aux[k] = arr[j]!;
        j++;
      } else if (j >= hi) {
        aux[k] = arr[i]!;
        i++;
      } else if (compareStrings(arr[i]!, arr[j]!, hooks) <= 0) {
        aux[k] = arr[i]!;
        i++;
      } else {
        aux[k] = arr[j]!;
        j++;
      }
    }
    for (let k = lo; k < hi; k++) arr[k] = aux[k]!;
  };
  mergeSort(0, arr.length);
  hooks.onDone?.(arr);
  return arr;
}
