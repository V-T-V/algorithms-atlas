// =============================================================================
// 三叉堆排序（弱堆变体）· 纯算法实现
// 3-叉完全堆：节点 i 的孩子为 3i+1、3i+2、3i+3；父为 ⌊(i-1)/3⌋。
// =============================================================================
export interface WeakHeapSortHooks {
  onBuildMax?: (root: number, arr: number[]) => void;
  onSiftDown?: (root: number, size: number, arr: number[]) => void;
  onPopMax?: (k: number, arr: number[]) => void;
}

/** 在大小为 size 的三叉堆中，对根 root 执行下沉（维护大顶堆）。 */
function siftDown(a: number[], root: number, size: number): void {
  while (true) {
    let largest = root;
    for (let c = 1; c <= 3; c++) {
      const child = 3 * root + c;
      if (child < size && a[child]! > a[largest]!) largest = child;
    }
    if (largest === root) break;
    [a[root], a[largest]] = [a[largest]!, a[root]!];
    root = largest;
  }
}

export function weakHeapSort(arr: readonly number[], hooks: WeakHeapSortHooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  if (n <= 1) return a;

  // 1) 建大顶三叉堆
  for (let i = Math.floor((n - 1) / 3); i >= 0; i--) {
    siftDown(a, i, n);
    hooks.onBuildMax?.(i, a);
  }

  // 2) 反复取最大值
  for (let end = n - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end]!, a[0]!];
    hooks.onPopMax?.(end, a);
    siftDown(a, 0, end);
    hooks.onSiftDown?.(0, end, a);
  }
  return a;
}
