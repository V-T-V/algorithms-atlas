// 四叉堆排序 · 纯算法实现
export interface Heap4Hooks {
  onSiftDown?: (root: number, size: number, arr: number[]) => void;
}

function siftDown4(a: number[], root: number, size: number): void {
  while (true) {
    let largest = root;
    for (let c = 1; c <= 4; c++) {
      const child = 4 * root + c;
      if (child < size && a[child]! > a[largest]!) largest = child;
    }
    if (largest === root) break;
    [a[root], a[largest]] = [a[largest]!, a[root]!];
    root = largest;
  }
}

export function heapSort4ary(arr: readonly number[], hooks: Heap4Hooks = {}): number[] {
  const a = [...arr];
  const n = a.length;
  for (let i = Math.floor((n - 1) / 4); i >= 0; i--) siftDown4(a, i, n);
  for (let end = n - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end]!, a[0]!];
    siftDown4(a, 0, end);
    hooks.onSiftDown?.(0, end, a);
  }
  return a;
}
