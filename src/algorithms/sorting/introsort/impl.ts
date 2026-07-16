// =============================================================================
// 内省排序 IntroSort · 纯算法实现
// 快排 + 堆排 + 插入，深度阈值切换。零 DOM 依赖，可独立单测。
// 通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 当前使用的子算法。 */
export type IntroPhase = 'quicksort' | 'heapsort' | 'insertion';

/** 算法执行过程中的事件钩子。任一可选。 */
export interface IntroSortHooks {
  /** 进入子区间 [lo, hi] 的处理，phase 标明当前用的子算法。 */
  onEnter?: (lo: number, hi: number, phase: IntroPhase) => void;
  /** 比较下标 i、j 的元素。 */
  onCompare?: (i: number, j: number) => void;
  /** 交换下标 i、j。 */
  onSwap?: (i: number, j: number) => void;
  /** 插入排序中把下标 j 的元素右移到 j+1。 */
  onShift?: (j: number, jNext: number) => void;
  /** 插入排序中把 key 写入落点 i。 */
  onPlace?: (i: number, value: number) => void;
  /** 下标 i 已就位（最终位置）。 */
  onPinned?: (i: number) => void;
}

/** 2*log2(n) 作为递归深度阈值，超过则改用堆排。 */
function depthLimit(n: number): number {
  let d = 0;
  let m = n;
  while (m > 1) {
    m >>= 1;
    d++;
  }
  return 2 * d;
}

/** 堆排序 [lo, hi]（原地）。 */
function heapSortRange(a: number[], lo: number, hi: number, hooks: IntroSortHooks): void {
  const n = hi - lo + 1;
  const siftDown = (start: number, end: number): void => {
    let root = start;
    while (true) {
      const l = lo + 2 * (root - lo) + 1;
      const r = l + 1;
      let largest = root;
      if (l <= lo + end) {
        hooks.onCompare?.(l, largest);
        if (a[l]! > a[largest]!) largest = l;
      }
      if (r <= lo + end) {
        hooks.onCompare?.(r, largest);
        if (a[r]! > a[largest]!) largest = r;
      }
      if (largest === root) break;
      swap(a, root, largest);
      hooks.onSwap?.(root, largest);
      root = largest;
    }
  };
  // 建堆
  for (let i = lo + (n >> 1) - 1; i >= lo; i--) siftDown(i, n - 1);
  // 逐个取出最大值放到末尾
  for (let end = n - 1; end > 0; end--) {
    swap(a, lo, lo + end);
    hooks.onSwap?.(lo, lo + end);
    hooks.onPinned?.(lo + end);
    siftDown(0, end - 1);
  }
}

function swap(a: number[], i: number, j: number): void {
  const t = a[i]!;
  a[i] = a[j]!;
  a[j] = t;
}

/**
 * 内省排序 IntroSort：快排为主，递归深度超阈值时切堆排，小段用插入排序。
 * 保证最坏 O(n log n)，同时保留快排的常数优势。
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function introsort(arr: readonly number[], hooks: IntroSortHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  if (n <= 1) return a;

  const INSERT_THRESHOLD = 16;
  const maxDepth = depthLimit(n);

  const insertionRange = (lo: number, hi: number): void => {
    hooks.onEnter?.(lo, hi, 'insertion');
    for (let i = lo + 1; i <= hi; i++) {
      const key = a[i]!;
      let j = i - 1;
      while (j >= lo) {
        hooks.onCompare?.(j, i);
        if (a[j]! > key) {
          a[j + 1] = a[j]!;
          hooks.onShift?.(j, j + 1);
          j--;
        } else {
          break;
        }
      }
      a[j + 1] = key;
      hooks.onPlace?.(j + 1, key);
    }
  };

  // 三数取中选基准
  const median3 = (lo: number, mid: number, hi: number): number => {
    hooks.onCompare?.(lo, mid);
    if (a[lo]! > a[mid]!) {
      swap(a, lo, mid);
      hooks.onSwap?.(lo, mid);
    }
    hooks.onCompare?.(lo, hi);
    if (a[lo]! > a[hi]!) {
      swap(a, lo, hi);
      hooks.onSwap?.(lo, hi);
    }
    hooks.onCompare?.(mid, hi);
    if (a[mid]! > a[hi]!) {
      swap(a, mid, hi);
      hooks.onSwap?.(mid, hi);
    }
    return mid; // 中值放到 mid，作为基准
  };

  const partition = (lo: number, hi: number): number => {
    const mid = (lo + hi) >> 1;
    const pivotIdx = median3(lo, mid, hi);
    // 把基准换到 hi-1 位置
    swap(a, pivotIdx, hi);
    hooks.onSwap?.(pivotIdx, hi);
    const pivot = a[hi]!;
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      hooks.onCompare?.(j, hi);
      if (a[j]! < pivot) {
        i++;
        if (i !== j) {
          swap(a, i, j);
          hooks.onSwap?.(i, j);
        }
      }
    }
    swap(a, i + 1, hi);
    hooks.onSwap?.(i + 1, hi);
    hooks.onPinned?.(i + 1);
    return i + 1;
  };

  const sort = (lo: number, hi: number, depth: number): void => {
    if (hi - lo < INSERT_THRESHOLD) {
      insertionRange(lo, hi);
      return;
    }
    if (depth === 0) {
      // 深度耗尽 → 堆排，避免快排最坏情况
      hooks.onEnter?.(lo, hi, 'heapsort');
      heapSortRange(a, lo, hi, hooks);
      for (let k = lo; k <= hi; k++) hooks.onPinned?.(k);
      return;
    }
    hooks.onEnter?.(lo, hi, 'quicksort');
    const p = partition(lo, hi);
    sort(lo, p - 1, depth - 1);
    sort(p + 1, hi, depth - 1);
  };

  sort(0, n - 1, maxDepth);
  // 兜底
  for (let k = 0; k < n; k++) hooks.onPinned?.(k);
  return a;
}
