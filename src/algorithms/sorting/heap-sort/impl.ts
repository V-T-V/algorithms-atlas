// =============================================================================
// 堆排序 Heap Sort · 纯算法实现
// 零 DOM 依赖，可独立单测。通过「钩子」向外暴露每一步操作，供录制器使用。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选；实现录制器按需实现。 */
export interface HeapSortHooks {
  /** 进入堆化阶段（建大顶堆）。 */
  onBuildPhase?: () => void;
  /** 对下标 i 做「下沉」（sift-down），堆的有效范围为 [0, heapSize)。 */
  onSiftDown?: (i: number, heapSize: number) => void;
  /** 比较下标 i 与其子节点 childIdx。 */
  onCompare?: (i: number, childIdx: number) => void;
  /** 交换下标 i、j。 */
  onSwap?: (i: number, j: number) => void;
  /** 进入排序阶段：不断把堆顶放到末尾。 */
  onSortPhase?: () => void;
  /** 下标 end（堆顶摘出后的落点）已就位。 */
  onPinned?: (end: number) => void;
}

/**
 * 堆排序（原地、不稳定）。
 * 先把数组原地建成大顶堆，再反复「取堆顶与末尾交换、缩小堆、下沉」。
 * @param arr 待排序数组（克隆后操作，不改原数组）
 * @param hooks 可选的事件钩子
 */
export function heapSort(arr: readonly number[], hooks: HeapSortHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  if (n <= 1) return a;

  const swap = (x: number, y: number): void => {
    const t = a[x]!;
    a[x] = a[y]!;
    a[y] = t;
  };

  // 对下标 i 下沉，维持堆大小 heapSize 的大顶堆性质
  const siftDown = (i: number, heapSize: number): void => {
    hooks.onSiftDown?.(i, heapSize);
    let cur = i;
    while (true) {
      const left = 2 * cur + 1;
      const right = 2 * cur + 2;
      let largest = cur;
      if (left < heapSize) {
        hooks.onCompare?.(largest, left);
        if (a[left]! > a[largest]!) largest = left;
      }
      if (right < heapSize) {
        hooks.onCompare?.(largest, right);
        if (a[right]! > a[largest]!) largest = right;
      }
      if (largest === cur) break;
      swap(cur, largest);
      hooks.onSwap?.(cur, largest);
      cur = largest;
      hooks.onSiftDown?.(cur, heapSize);
    }
  };

  // 1) 建堆：从最后一个非叶子节点向前下沉
  hooks.onBuildPhase?.();
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    siftDown(i, n);
  }

  // 2) 排序：堆顶（最大值）与末尾交换，缩小堆，再下沉修复
  hooks.onSortPhase?.();
  for (let end = n - 1; end > 0; end--) {
    swap(0, end);
    hooks.onSwap?.(0, end);
    hooks.onPinned?.(end);
    siftDown(0, end);
  }
  hooks.onPinned?.(0);
  return a;
}
