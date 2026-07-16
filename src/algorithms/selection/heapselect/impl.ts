// =============================================================================
// 堆选择（Heapselect）· 纯算法实现
// 用容量为 k 的最大堆选第 k 小。零 DOM 依赖，可独立单测。
// =============================================================================

/** 事件钩子。 */
export interface HeapselectHooks {
  /** 把下标 idx 的元素加入堆。heapTop 为当前堆顶值（可能为空）。 */
  onPush?: (idx: number, heapTop: number | null) => void;
  /** 因堆满且新元素更小，弹出堆顶（被淘汰）。被弹出元素对应的下标 ejectedIdx。 */
  onPop?: (ejectedIdx: number) => void;
  /** 完成，结果为第 k 小（0-based k）的值。 */
  onDone?: (k: number, value: number) => void;
}

/** 堆元素：值 + 其在原数组中的下标（用于 trace 高亮）。 */
interface HeapItem {
  value: number;
  srcIdx: number;
}

/**
 * 堆选择：用容量为 k 的最大堆求第 k 小（0-based k）。
 *
 * @param arr 输入数组（不改原数组）
 * @param k 目标排名，0-based；须在 [1, arr.length] 内（k>=1 表示至少要第 1 小=最小）
 * @param hooks 可选事件钩子
 * @returns 第 k 小的元素值
 */
export function heapselect(arr: readonly number[], k: number, hooks: HeapselectHooks = {}): number {
  const n = arr.length;
  if (!Number.isInteger(k) || k < 1 || k > n) {
    throw new RangeError(`k 须在 [1, ${n}]，收到 ${k}`);
  }

  // 最大堆（用数组实现，比较器为大顶堆）。堆元素 {value, srcIdx}。
  const heap: HeapItem[] = [];
  const less = (i: number, j: number): boolean => heap[i]!.value > heap[j]!.value;

  const swapH = (i: number, j: number): void => {
    const t = heap[i]!;
    heap[i] = heap[j]!;
    heap[j] = t;
  };

  const siftUp = (i: number): void => {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (less(i, parent)) {
        swapH(i, parent);
        i = parent;
      } else break;
    }
  };

  const siftDown = (i: number): void => {
    const size = heap.length;
    while (true) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let best = i;
      if (l < size && less(l, best)) best = l;
      if (r < size && less(r, best)) best = r;
      if (best === i) break;
      swapH(i, best);
      i = best;
    }
  };

  const top = (): HeapItem => heap[0]!;

  for (let idx = 0; idx < n; idx++) {
    const v = arr[idx]!;
    if (heap.length < k) {
      heap.push({ value: v, srcIdx: idx });
      siftUp(heap.length - 1);
      hooks.onPush?.(idx, heap.length === k ? top().value : null);
    } else if (v < top().value) {
      // 替换堆顶并下沉
      const ejected = top();
      hooks.onPop?.(ejected.srcIdx);
      heap[0] = { value: v, srcIdx: idx };
      siftDown(0);
      hooks.onPush?.(idx, top().value);
    }
  }

  const result = top().value;
  hooks.onDone?.(k, result);
  return result;
}
